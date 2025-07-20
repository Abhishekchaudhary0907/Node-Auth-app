import express from "express";
import authRoutes from "./auth/index.js";
const router = express.Router();

router.get("/health-check", (req, res) => {
  res.send({
    statusCode: 200,
    success: true,
  });
});
router.use("/auth", authRoutes);
export default router;
