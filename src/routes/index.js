import express from "express";
import { handlers } from "../query/handlers.js";
import { RABBIT_EXCHANGES, RABBIT_ROUTING_KEYS } from "../constants/rabbitmq.js";
const router = express.Router();
import { subscribeEvents } from "../lib/rabbitmq.js";

async function setupEventSubscriptions() {
  const exchange = RABBIT_EXCHANGES.PRODUCT;

  await subscribeEvents(exchange, RABBIT_ROUTING_KEYS.PRODUCT_CREATED, async (data) => {
    const { name, price } = data;
    await handlers.createProduct(name, price);
  });

  await subscribeEvents(exchange, RABBIT_ROUTING_KEYS.PRODUCT_UPDATED, async (data) => {
    const { id, name, price } = data;
    await handlers.updateProduct(id, name, price);
  });

  await subscribeEvents(exchange, RABBIT_ROUTING_KEYS.PRODUCT_DELETED, async (data) => {
    const { id } = data;
    await handlers.deleteProduct(id);
  });
}

setupEventSubscriptions().catch((err) => {
  console.error("Failed to setup RabbitMQ event subscriptions:", err);
});


router.get('/', async (req, res) => {
  const result = await handlers.getAllProducts();
  res.json({data: result});
});

export default router;
