import express from "express";
import {
  createMember,
  getMemberDetails,
  makePayment,
  memberLogin,
} from "../controllers/MemberController";
import { auth } from "../middlewares/auth";

const router = express.Router();

router.post("/create-account", createMember);
router.post("/login-account", memberLogin);
router.post("/make-payment", auth, makePayment);
router.get("/details", auth, getMemberDetails);

export default router;
