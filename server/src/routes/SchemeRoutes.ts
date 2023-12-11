import express from "express";
import { getAllSchemes, enrollInScheme } from "../controllers/SchemeController";
import { auth } from "../middlewares/auth";

const router = express.Router();

router.get("/schemes", getAllSchemes);
router.post("/enroll", auth, enrollInScheme);

export default router;
