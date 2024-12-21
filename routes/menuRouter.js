import express from "express";
import {
    addMenu,
    deleteDish,
    getDishById,
    getDishesByMood,
    getMenuByRestaurantId,
    getMenus,
    updateDish,
} from "../controllers/menuController.js";
const router = express.Router();
router.post("/:restaurantId", addMenu);
router.get("/:restaurantId", getMenuByRestaurantId);
router.get("/:restaurantId/dishes/:dishId", getDishById);
router.put("/:restaurantId/dishes/:dishId", updateDish);
router.delete("/:restaurantId/dishes/:dishId", deleteDish);
router.get("/mood/:mood", getDishesByMood);
export default router;
