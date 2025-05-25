import "dotenv/config";
import app from "./src/app.js";
import { connect as connectRabbitMQ } from "./src/lib/rabbitmq.js";

const PORT = process.env.PORT || 3002;

async function start() {
  await connectRabbitMQ();
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

start();
