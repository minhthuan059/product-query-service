# Product Command (Write Side in CQRS & Event Sourcing)

## Overview

1. Framework: Express.js
2. EventStoreDB đã đổi tên thành KurrentDB rồi nha.
3. File `docker-compose.yml` và `rabbitmqDefinitions.json` để trong service này thì không có phù hợp lắm nhưng tui để tạm thôi.
4. Mã nguồn:

- `routes` gọi đến `commands/handlers.js`.
- `commands/handlers.js` lưu event xuống KurrentDB. Trong KurrentDB, tất cả event của cùng 1 product được nhóm lại thành 1 stream với tên stream là `product-<productId>`. Ý là mỗi product tương ứng với 1 stream á.
- `rebuildProduct` trong `aggregates` để replay lại tất cả event của 1 product để build current state của product đó. Cái này giúp validate product có tồn tại không/đã bị delete chưa khi gọi các route update và delete product.
- `eventRelay` để subscribe vào KurrentDB, khi có event mới thì publish vào RabbitMQ (KurrentDB có cái `RabbitMQ sink` để có thể connect KurrentDB với RabbitMQ, nhưng phải có license mới dùng được tính năng đó nên thôi tui tự làm `eventRelay` thủ công.)
- Lưu ý là khi restart project/hot reload khi dev/... thì nó sẽ đọc lại tất cả event trong KurrentDB từ đầu và gửi lại vào RabbitMQ nha (cơ chế Catch-up subscriptions cơ bản của KurrentDB là vậy, nếu không muốn vậy thì phải lưu vị trí lần trước vào database hay đâu đó nữa, tui không định làm vụ này cho phức tạp thêm).
- RabbitMQ có exchange `product` (topic exchange). Trong đó có 3 routing key là `product.created`, `product.updated`, `product.deleted`. Event thuộc loại nào thì đi theo routing key đó, nhưng mà 3 routing key đều đi vào cùng 1 queue là `product-event-consumer`.
  <br/>

## Cách chạy

1. Tạo file `.env` giống file `.env.example`
2. Chạy Docker Desktop
3. `docker compose up -d` (để chạy KurrentDB và RabbitMQ)
4. `npm i`
5. `npm run dev`
6. Gọi các endpoint sau:

- `POST /products { name: <text>, price: <number> }`
- `PUT /products/:id { name?: <text>, price?: <number> }`
- `DELETE /products/:id`

Có thể quan sát:

- Response trả về.
- KurrentDB:
  - Cách 1: http://localhost:2113/web/index.html#/dashboard
  - Cách 2: download Kurrent Navigator (https://navigator.kurrent.io/) về để xem, cái này thì nó rõ ràng hơn.
- RabbitMQ: http://localhost:15672/ (username: `guest`; password: `guest`)
