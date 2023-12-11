import { Request, Response } from "express";
import Member, { MemberDocument } from "../models/Member";
import {
  generatePin,
  generateToken,
  sendLoginPin,
} from "../utils/notifications";
import { createSchema, loginSchema, options } from "../utils/utils";
import { stripeSecret } from "../configs";

import stripe from "stripe";

export const createMember = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;

    const validationResult = createSchema.validate(req.body, options);

    if (validationResult.error) {
      return res.status(400).json({
        error: validationResult.error.details[0].message,
      });
    }

    const existingMember = await Member.findOne({ email });

    if (existingMember) {
      return res.status(400).json({
        error: "Email already exists",
      });
    }

    const { pin } = generatePin();

    const newMember: MemberDocument = new Member({
      name,
      email,
      pin,
      verify: true,
    });

    await newMember.save();

    const token = generateToken(newMember._id, newMember.email);
    await sendLoginPin(email, pin);

    res
      .status(201)
      .json({ message: "Member registered successfully", newMember, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const memberLogin = async (req: Request, res: Response) => {
  try {
    const { email, pin } = req.body;

    const validationResult = loginSchema.validate(req.body, options);

    if (validationResult.error) {
      return res.status(400).json({
        error: validationResult.error.details[0].message,
      });
    }

    const existingMember = await Member.findOne({ email });

    if (!existingMember) {
      return res.status(400).json({
        error: "Member not found",
      });
    }

    if (pin !== existingMember.pin) {
      return res.status(401).json({
        error: "Invalid pin",
      });
    }
    const token = generateToken(existingMember._id, existingMember.email);
    console.log("Generated Token:", token);

    res.status(200).json({
      message: "Member login successful",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const stripeSecretKey = stripeSecret;
console.log("stripe secret", stripeSecretKey);
const stripeClient = new stripe(stripeSecretKey);

export const makePayment = async (req: Request, res: Response) => {
  try {
    const { amount, token } = req.body;

    const charge = await stripeClient.charges.create({
      amount: amount * 100,
      currency: "usd",
      source: token,
      description: "Payment for account balance",
    });

    const memberId = req.member?._id;
    const member = await Member.findById(memberId);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const maintenanceFee = 10;
    const adminFee = 15;

    member.balance += amount - (maintenanceFee + adminFee);
    member.accountHistory.push({
      date: new Date(),
      description: "Account Credited",
      amount: amount,
    });

    member.accountHistory.push({
      date: new Date(),
      description: "Maintenance Fee Deduction",
      amount: maintenanceFee,
    });

    member.accountHistory.push({
      date: new Date(),
      description: "Admin Fee Deduction",
      amount: adminFee,
    });

    await member.save();

    res.status(200).json({ message: "Payment successful", charge });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMemberDetails = async (req: Request, res: Response) => {
  try {
    const memberId = req.member?._id;

    if (!memberId) {
      return res.status(401).json({ message: "Member not authenticated" });
    }

    const member = await Member.findById(memberId);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res
      .status(200)
      .json({ message: "Member details retrieved successfully", member });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
