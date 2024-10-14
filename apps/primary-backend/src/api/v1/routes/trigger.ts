import { Router } from "express";
import client from "@repo/database";

const router = Router();

router.get("/available", async (req, res) => {
  try {
    const availableTriggers = await client.availableTrigger.findMany({});

    if (!availableTriggers.length) {
      res.status(404).json({
        success: false,
        message: "No available triggers found",
      });
    }

    res.status(200).json({
      success: true,
      availableTriggers: availableTriggers,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching available triggers",
    });
  }
});

export const triggerRouter = router;
