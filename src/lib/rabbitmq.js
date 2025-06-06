import amqp from "amqplib";
import { NotFoundError } from "../errors/notFound.js";

let channel = null;

export async function connect() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();
}



export async function subscribeEvents(exchange, routingKey, callback) {
  if (!channel) {
    throw new Error("RabbitMQ is not connected.");
  }
  // 1. Khai báo exchange
  await channel.assertExchange(exchange, "topic", { durable: true });

  // 2. Tạo queue riêng
  const queueName = `query_queue_${routingKey}`;
  const { queue } = await channel.assertQueue(queueName, {
    durable: true,
  });

  // 3. Bind queue với exchange + routing key
  await channel.bindQueue(queue, exchange, routingKey);

  console.log(`[Query] Waiting for events with routingKey "${routingKey}"...`);

  // 4. Consume message từ queue
  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      try {
        const data = JSON.parse(msg.content.toString());
        await callback(data);
        channel.ack(msg);
      } catch (error) {
        console.error("Error processing message:", error);
        channel.nack(msg, false, false);
      }
    }
  });
}
