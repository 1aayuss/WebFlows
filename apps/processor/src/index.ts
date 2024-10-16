import client from "@repo/database";
import { Kafka } from "kafkajs";

const TOPIC_NAME = "flow-events";

const kafka = new Kafka({
  clientId: "outbox-processor",
  brokers: ["localhost:9092"],
});

async function main() {
  const producer = kafka.producer();
  await producer.connect();

  while (1) {
    const pendingRows = await client.flowRunOutbox.findMany({
      where: {},
      take: 10,
    });

    producer.send({
      topic: TOPIC_NAME,
      messages: pendingRows.map((row: any) => ({
        value: row.FlowRunId,
      })),
    });

    await client.flowRunOutbox.deleteMany({
      where: {
        id: {
          in: pendingRows.map((row: any) => row.id),
        },
      },
    });
  }
}

main();
