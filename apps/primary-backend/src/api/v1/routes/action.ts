import client from "@repo/database";
import { Router } from "express";
const router = Router();

router.get("/available", async (req, res) => {
  try {
    const availableActions = await client.availableAction.findMany({});

    if (!availableActions.length) {
      res.status(404).json({
        message: "No available actions found",
      });
    }

    res.status(200).json({
      availableActions,
    });
  } catch (error: any) {
    console.error("Error fetching available actions:", error);

    res.status(500).json({
      message: "An error occurred while fetching available actions",
      error: error.message,
    });
  }
});

export const actionRouter = router;
