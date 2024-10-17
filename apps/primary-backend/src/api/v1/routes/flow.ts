import { Router, Request, Response } from "express";
import { authMiddleware } from "../../../middleware.js";
import { flowCreateSchema } from "@repo/types";
import client from "@repo/database";

const router = Router();

router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const id = req.id;
    const body = req.body;
    const parsedData = flowCreateSchema.safeParse(body);

    if (!parsedData.success) {
      res.status(411).json({
        success: false,
        message: "Incorrect inputs",
      });
    }

    const flowId = await client.$transaction(async (tx: any) => {
      const flow = await client.flow.create({
        data: {
          flowName: parsedData.data!.flowName || "Untitled Flow",
          userId: parseInt(id),
          triggerId: "",
          actions: {
            create: parsedData.data!.actions.map((x, index) => ({
              actionId: x.availableActionId,
              sortingOrder: index,
              metadata: x.actionMetadata,
            })),
          },
        },
      });

      const trigger = await tx.trigger.create({
        data: {
          triggerId: parsedData.data!.availableTriggerId,
          FlowId: flow.id,
        },
      });

      await tx.flow.update({
        where: {
          id: flow.id,
        },
        data: {
          triggerId: trigger.id,
        },
      });

      return flow;
    });

    res.status(200).json({
      success: true,
      flow: flowId,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the flow.",
    });
  }
});

router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const id = req.id;
    const flows = await client.flow.findMany({
      where: {
        userId: id,
      },
      include: {
        actions: {
          include: {
            type: true,
          },
        },
        trigger: {
          include: {
            type: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      flows: flows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching flows.",
    });
  }
});

router.get("/:flowId", authMiddleware, async (req, res) => {
  try {
    //@ts-ignore
    const id = req.id;
    const flowId = req.params.flowId;

    const flow = await client.flow.findFirst({
      where: {
        id: flowId,
        userId: id,
      },
      include: {
        actions: {
          include: {
            type: true,
          },
        },
        trigger: {
          include: {
            type: true,
          },
        },
      },
    });

    if (!flow) {
      res.status(404).json({
        success: false,
        message: `Flow with ID ${flowId} not found.`,
      });
    } else {
      res.status(200).json({
        success: true,
        flow: flow,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the flow.",
    });
  }
});

export const flowRouter = router;
