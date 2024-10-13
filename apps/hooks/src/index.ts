import express from "express";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();
const app = express();
app.use(express.json());

app.post("/hooks/catch/:userId/:flowId", async (req, res) => {
  const userId = req.params.userId;
  const flowId = req.params.flowId;
  const body = req.body;

  // storea new trigger in db
  await client.$transaction(async (tx) => {
    const run = await tx.flowRun.create({
      data: {
        FlowId: flowId,
        metadata: body,
      },
    });

    await tx.flowRunOutbox.create({
      data: {
        FlowRunId: run.id,
      },
    });
  });
  res.json({
    message: "Webhook received",
  });
});

app.listen(3000);
