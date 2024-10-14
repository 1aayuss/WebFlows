import express from "express";
import { triggerRouter } from "./routes/trigger.js";
import { actionRouter } from "./routes/action.js";
import { flowRouter } from "./routes/flow.js";
import { userRouter } from "./routes/user.js";
import { authRouter } from "./routes/auth.js";

const router = express.Router();

router.use("/auth", authRouter);

router.use("/flow", flowRouter);

router.use("/trigger", triggerRouter);

router.use("/action", actionRouter);

router.use("/user", userRouter);

export const apiV1Route = router;
