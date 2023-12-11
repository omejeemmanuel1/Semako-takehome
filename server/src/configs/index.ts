import dotenv from "dotenv";

dotenv.config();

export const jwtsecret = String(process.env.JWT_SECRET_KEY);

export const stripeSecret = String(process.env.stripe_secrete_key);
