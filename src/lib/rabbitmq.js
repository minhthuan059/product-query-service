import amqp from "amqplib";
import { NotFoundError } from "../errors/notFound.js";

let channel = null;

export async function connect() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();
}



export async function subscribeEvents(exchange, routingKey, callback) {
  if (!channel) await connect();
  // 1. Khai báo exchange
  await channel.assertExchange(exchange, "topic", { durable: true });

  // 2. Tạo queue riêng
  const { queue } = await channel.assertQueue("", { exclusive: true });

  // 3. Bind queue với exchange + routing key
  await channel.bindQueue(queue, exchange, routingKey);

  console.log(`[Query] Waiting for events with routingKey "${routingKey}"...`);

  // 4. Consume message từ queue
  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      try {
        const data = JSON.parse(msg.content.toString());
        channel.ack(msg);
        await callback(data);
      } catch (error) {
        console.error("Error processing message:", error);
        channel.nack(msg, false, false);
      }
    }
  });
}
