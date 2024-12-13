import express from "express";
import { Create, Find } from "../controllers/authController.js";
const router = express.Router();
router.post("/create", Create);
router.get("/find", Find);
export default router;
