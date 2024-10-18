import { Kafka } from "kafkajs";
import client from "@repo/database";
import { parse } from "./parser.js";
import { JsonObject } from "@prisma/client/runtime/library";
import { sendEmail } from "./actions/email.js";
import { sendSol } from "./actions/solana.js";

const TOPIC_NAME = "flow-events";

const kafka = new Kafka({
  clientId: "outbox-processor",
  brokers: ["localhost:9092"],
});

async function main() {
  const consumer = kafka.consumer({ groupId: "main-worker" });
  await consumer.connect();
  const producer = kafka.producer();
  await producer.connect();

  await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true });

  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value?.toString(),
      });

      // Ensure the message value is not empty
      if (!message.value?.toString()) {
        console.log("Empty message received, skipping...");
        return;
      }
      // Add try-catch block for JSON parsing
      let parsedValue;
      try {
        parsedValue = JSON.parse(message.value?.toString());
      } catch (err) {
        console.error(
          "Failed to parse message as JSON:",
          message.value?.toString()
        );
        return; // Skip further processing for this message
      }

      const flowRunId = parsedValue.flowRunId;
      const stage = parsedValue.stage;

      const flowRunDetails = await client.flowRun.findFirst({
        where: {
          id: flowRunId,
        },
        include: {
          flow: {
            include: {
              actions: {
                include: {
                  type: true,
                },
              },
            },
          },
        },
      });

      const currentAction = flowRunDetails?.flow.actions.find(
        (x) => x.sortingOrder === stage
      );

      if (!currentAction) {
        console.log("Current action not found?");
        return;
      }

      const flowRunMetadata = flowRunDetails?.metadata;

      // Handle email action
      if (currentAction.type.name === "Email") {
        console.log("Email action found");
        const body = parse(
          (currentAction.metadata as JsonObject)?.body as string,
          flowRunMetadata
        );
        console.log("body" + body);
        const to = parse(
          (currentAction.metadata as JsonObject)?.email as string,
          flowRunMetadata
        );
        console.log("to:" + to);
        console.log("Sending email...");
        await sendEmail(to, body);
      }

      // Handle SOL sending action
      if (currentAction.type.id === "send-sol") {
        const amount = parse(
          (currentAction.metadata as JsonObject)?.amount as string,
          flowRunMetadata
        );
        const address = parse(
          (currentAction.metadata as JsonObject)?.address as string,
          flowRunMetadata
        );
        await sendSol(address, amount);
      }

      // Simulate processing delay
      await new Promise((r) => setTimeout(r, 500));

      const lastStage = (flowRunDetails?.flow.actions?.length || 1) - 1;
      console.log(lastStage);
      console.log(stage);

      // If there are more stages, push back to the queue
      if (lastStage !== stage) {
        console.log("Pushing back to the queue");
        await producer.send({
          topic: TOPIC_NAME,
          messages: [
            {
              value: JSON.stringify({
                stage: stage + 1,
                flowRunId,
              }),
            },
          ],
        });
      }

      console.log("Processing done");

      // Commit the offset
      await consumer.commitOffsets([
        {
          topic: TOPIC_NAME,
          partition: partition,
          offset: (parseInt(message.offset) + 1).toString(),
        },
      ]);
    },
  });
}

main();
