import express from "express";

const router = express.Router();

router.post("/fibonacci", (req, res) => {
  const { body } = req;
  const { num } = body;
});
