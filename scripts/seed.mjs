import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/feedback-platform";

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection;
  console.log("Connected to MongoDB.");

  for (const collection of ["feedbacks", "comments", "votes", "admins"]) {
    await db.dropCollection(collection).catch(() => {});
  }

  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const sample = [
    {
      ticketNumber: "FB-DEMO01",
      title: "Add dark mode to the dashboard",
      description:
        "The dashboard is bright at night. A dark theme would make long review sessions much easier on the eyes.",
      category: "feature",
      status: "in-progress",
      createdAt: new Date(now - 5 * day),
      updatedAt: new Date(now - 2 * day),
    },
    {
      ticketNumber: "FB-DEMO02",
      title: "Email notification when my ticket changes status",
      description:
        "It would be great to get an email when my submitted feedback moves to planned or done, so I don't have to keep checking.",
      category: "feature",
      status: "planned",
      createdAt: new Date(now - 3 * day),
      updatedAt: new Date(now - 1 * day),
    },
    {
      ticketNumber: "FB-DEMO03",
      title: "Search and filter controls are hard to find",
      description:
        "I didn't realize I could filter the board by category and status. The controls could be more prominent, or pinned to the top.",
      category: "bug",
      status: "open",
      createdAt: new Date(now - 1 * day),
      updatedAt: new Date(now - 1 * day),
    },
    {
      ticketNumber: "FB-DEMO04",
      title: "Thanks for making this easy",
      description:
        "Love that I can submit feedback without creating an account and track it with a simple ticket number.",
      category: "general",
      status: "done",
      createdAt: new Date(now - 8 * day),
      updatedAt: new Date(now - 4 * day),
    },
  ];

  await db.collection("feedbacks").insertMany(sample);
  console.log(`Seeded ${sample.length} sample tickets (try FB-DEMO01..FB-DEMO04).`);
  await mongoose.disconnect();
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
