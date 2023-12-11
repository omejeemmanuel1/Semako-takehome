import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
import Member from "../models/Member";
import mongoose from "mongoose";

const jwtSecret = process.env.JWT_SECRET_KEY as Secret;

if (!jwtSecret) {
  throw new Error("JWT secret key is not defined");
}

declare module "express-serve-static-core" {
  interface Request {
    member?: { _id: string };
  }
}

export async function auth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      res.status(401).json({ Error: "Kindly login as a member" });
      return;
    }

    const token = authorizationHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ Error: "Kindly login as a member" });
      return;
    }

    let verified: { _id: string } | null = null;
    try {
      verified = jwt.verify(token, jwtSecret) as { _id: string } | null;
      console.log("Decoded Token:", verified);
    } catch (error) {
      console.error("Token verification error:", error);
      res.status(401).json({ Error: "Token not valid" });
      return;
    }

    if (!verified) {
      res.status(401).json({
        Error: "Invalid token, you are not authorized to access this route",
      });
      return;
    }

    const { _id } = verified;

    const memberId = new mongoose.Types.ObjectId(_id);

    const member = await Member.findById(memberId);
    console.log("member:", member);

    if (!member) {
      res
        .status(401)
        .json({ Error: "Kindly login correct details as a member" });
      return;
    }

    req.member = { _id };
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res
      .status(401)
      .json({ Error: "Member not authenticated, please login first." });
  }
}
