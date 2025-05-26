import { handlers } from "../query/handlers.js";
import { RABBIT_EXCHANGES, RABBIT_ROUTING_KEYS } from "../constants/rabbitmq.js";
import { subscribeEvents } from "../lib/rabbitmq.js";



export async function setupEventSubscriptions() {
  const exchange = RABBIT_EXCHANGES.PRODUCT;

  await subscribeEvents(exchange, RABBIT_ROUTING_KEYS.PRODUCT_CREATED, async (data) => {
    const {id, name, price } = data;
    await handlers.createProduct(id, name, price);
    return;
  });

  await subscribeEvents(exchange, RABBIT_ROUTING_KEYS.PRODUCT_UPDATED, async (data) => {
    const { id, name, price } = data;
    await handlers.updateProduct(id, name, price);
    return;
  });

  await subscribeEvents(exchange, RABBIT_ROUTING_KEYS.PRODUCT_DELETED, async (data) => {
    const { id } = data;
    await handlers.deleteProduct(id);
    return;
  });
}
