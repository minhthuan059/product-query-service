import "dotenv/config";
import app from "./src/app.js";
import { connect} from "./src/lib/rabbitmq.js";
import { setupEventSubscriptions } from "./src/events/eventSubscribe.js";

const PORT = process.env.PORT || 3002;

async function start() {
  await connect();
  await setupEventSubscriptions();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

start();
