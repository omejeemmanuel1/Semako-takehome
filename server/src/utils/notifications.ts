import { Response } from "express";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { MemberDocument } from "../models/Member";
import { jwtsecret } from "../configs";

export const generatePin = () => {
  const pin = Math.floor(1000 + Math.random() * 9000);
  return { pin };
};

export const generateToken = (_id: string, email: string) => {
  const payload = {
    _id,
    email,
  };
  console.log("payload:", payload);

  try {
    const token = jwt.sign(payload, jwtsecret, { expiresIn: "30d" });
    return token;
  } catch (error) {
    console.error(error);
    throw new Error("Error generating token");
  }
};

export const validateToken = (member: MemberDocument, token: string) => {
  try {
    const decodedToken: any = jwt.verify(token, jwtsecret);
    if (
      decodedToken._id !== member._id ||
      decodedToken.email !== member.email
    ) {
      return false;
    }
    const expiry = new Date(decodedToken.exp * 1000);
    if (expiry.getTime() < new Date().getTime()) {
      return false;
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const sendLoginPin = async (email: string, pin: number) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.smtp_host,
      port: 465,
      secure: true,
      auth: {
        user: process.env.sendinblue_user,
        pass: process.env.sendinblue_pass,
      },
    });

    const mailOptions = {
      from: "Semako <noreply@semako-mails.com>",
      to: email,
      subject: "Login Pin",
      html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5e7e8; text-align: center;">
              <h2 style="color: #21502c;">Account Login Pin</h2>
              <p style="color: #6c757d;">Below is your PIN:</p>
              <h1 style="color: #21502c;font-size: 40px; margin-top: 10px;">${pin}</h1>
              <p style="color: #6c757d;">Please enter this Pin to login.</p>
              <p style="color: #6c757d; text-align: center;">Thank you for choosing Semako!</p>
            </div>
          `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
    throw new Error("Error sending account verification OTP");
  }
};
