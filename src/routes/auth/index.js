import express from "express";
import { AuthController } from "../../controllers/index.js";
import { AuthMiddleware } from "../../middlewares/index.js";

const router = express.Router();

router.get("/signup", AuthController.getSignup);
router.post("/signup", AuthController.postSignup);
router.post("/verify", AuthController.verifyEmail);
router.post("/login", AuthController.login);
router.post("/profile", AuthMiddleware.IsAuth, AuthController.getProfile);
router.post("/logout", AuthMiddleware.IsAuth, AuthController.logoutUser);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);
router.post("/refresh-token", AuthController.refreshToken);

export default router;
