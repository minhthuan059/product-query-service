import { NotFoundError } from "../errors/notFound.js";

export function errorHandler(err, req, res, next) {
  if (err instanceof NotFoundError) {
    return res.status(404).json({ error: err.message });
  }

  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
}
