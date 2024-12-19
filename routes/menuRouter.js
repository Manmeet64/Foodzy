import express from "express";
import {
    addMenu,
    deleteDish,
    getDishById,
    getMenuByRestaurantId,
    updateDish,
} from "../controllers/menuController.js";
import {
    updateDishImages,
    uploadMiddleware,
} from "../controllers/menuMulterController.js";
const router = express.Router();
router.post("/:restaurantId", addMenu);
router.get("/:restaurantId", getMenuByRestaurantId);
router.get("/:restaurantId/dishes/:dishId", getDishById);
router.put("/:restaurantId/dishes/:dishId", updateDish);
router.delete("/:restaurantId/dishes/:dishId", deleteDish);
router.post(
    "/photos/:restaurantId/:menuId",
    uploadMiddleware,
    updateDishImages
);
export default router;
