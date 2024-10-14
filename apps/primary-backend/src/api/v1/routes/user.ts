import express, { Router, Request, Response } from "express";
import { authMiddleware } from "../../../middleware.js";
import client from "@repo/database";

const router = Router();

router.get("/", authMiddleware, async (req: Request, res: Response) => {
  // @ts-ignore
  const id = req.id;
  const user = await client.user.findFirst({
    where: {
      id,
    },
    select: {
      name: true,
      email: true,
    },
  });

  res.json({
    user,
  });
});

export const userRouter = router;
