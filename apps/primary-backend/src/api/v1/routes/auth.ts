import express, { Router, Request, Response } from "express";
import { authMiddleware } from "../../../middleware.js";
import { SigninSchema, SignupSchema } from "@repo/types";
import client from "@repo/database";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { hashpass, comparepass } from "./../../../passwordHashing.js";
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
    const hashedPassword = await hashpass(parsedData.data!.password);
    const newUser = await client.user.create({
      data: {
        email: parsedData.data!.username,
        password: hashedPassword,
        name: parsedData.data!.name,
      },
    });

    // Generate a JWT token for the new user
    const token = jwt.sign(
      {
        id: newUser.id,
      },
      JWT_PASSWORD
    );

    // Return the token along with the success message
    res.status(200).json({
      success: true,
      message: "New user created successfully",
      token: token,
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
    },
  });

  if (!user) {
    res.status(401).json({
      success: false,
      message: "No user found",
    });
  }

  const pass = await comparepass(parsedData.data!.password, user!.password);
  if (pass) {
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
  } else {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
});

export const authRouter = router;
