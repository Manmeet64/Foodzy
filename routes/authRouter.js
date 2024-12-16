import express from "express";
import { Create, Find, editUser } from "../controllers/authController.js";
const router = express.Router();
router.post("/create", Create);
router.get("/find", Find);
router.put("/edit", editUser);
export default router;
