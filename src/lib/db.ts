import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/feedback-platform";

const CONNECTION_OPTIONS = {
  serverSelectionTimeoutMS: 8000,
  connectTimeoutMS: 8000,
  maxPoolSize: 1,
};

let queue: Promise<unknown> = Promise.resolve();

export function withConnection<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    await mongoose.disconnect().catch(() => {});
    await mongoose.connect(MONGODB_URI, CONNECTION_OPTIONS);
    try {
      return await fn();
    } finally {
      await mongoose.disconnect().catch(() => {});
    }
  });
  queue = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}
