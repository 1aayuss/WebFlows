import express, { Router, Request, Response } from "express";
import { authMiddleware } from "../../../middleware.js";
import { SigninSchema, SignupSchema } from "@repo/types";
import client from "@repo/database";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const router: Router = express.Router();

const JWT_PASSWORD = process.env.JWT_PASSWORD!;

router.post("/signup", async (req: Request, res: Response) => {
  const body = req.body;
  const parsedData = SignupSchema.safeParse(body);

  if (!parsedData.success) {
    console.log(parsedData.error);
    res.status(400).json({
      success: false,
      message: "Incorrect inputs",
    });
  }

  const userExists = await client.user.findFirst({
    where: {
      email: parsedData.data!.username,
    },
  });

  if (userExists) {
    res.status(409).json({
      success: false,
      message: "User already exists",
    });
  }

  try {
    await client.user.create({
      data: {
        email: parsedData.data!.username,
        // TODO: Don't store passwords in plaintext, hash it
        password: parsedData.data!.password,
        name: parsedData.data!.name,
      },
    });

    // await sendEmail();

    res.status(200).json({
      success: true,
      message: "New user created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the user.",
    });
  }
});

router.post("/signin", async (req: Request, res: Response) => {
  const body = req.body;
  const parsedData = SigninSchema.safeParse(body);

  if (!parsedData.success) {
    console.log(parsedData.error);
    res.status(400).json({
      success: false,
      message: "Incorrect inputs",
    });
  }

  const user = await client.user.findFirst({
    where: {
      email: parsedData.data!.username,
      password: parsedData.data!.password, // TODO: Validate password with hashing
    },
  });

  if (!user) {
    res.status(401).json({
      success: false,
      message: "Unauthorized, credentials are incorrect",
    });
  }

  // sign the JWT
  const token = jwt.sign(
    {
      id: user!.id,
    },
    JWT_PASSWORD
  );

  res.status(200).json({
    success: true,
    message: "User signed in successfully",
    token: token,
  });
});

export const authRouter = router;
