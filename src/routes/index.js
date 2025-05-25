import express from "express";
import { handlers } from "../query/handlers.js";
const router = express.Router();

router.get('/', async (req, res) => {
  const result = await handlers.getAllProducts();
  res.json({data: result});
});

export default router;
