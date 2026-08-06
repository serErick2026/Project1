import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/feedback-platform";

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection;
  console.log("Connected to MongoDB.");

  for (const collection of ["feedbacks", "comments", "votes", "admins", "otps"]) {
    await db.dropCollection(collection).catch(() => {});
  }

  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const sample = [
    {
      ticketNumber: "FB-DEMO01",
      fullname: "Juan Dela Cruz",
      email: "demo@example.com",
      emailVerified: true,
      schoolOffice: "Mabini Elementary School",
      district: "Quezon City District II",
      nature: "suggestion",
      description:
        "It would help if weekly updates about school activities were posted earlier, so parents can plan ahead.",
      status: "in-progress",
      createdAt: new Date(now - 5 * day),
      updatedAt: new Date(now - 2 * day),
    },
    {
      ticketNumber: "FB-DEMO02",
      fullname: "Maria Santos",
      cellphone: "0917 000 0000",
      email: "demo2@example.com",
      emailVerified: true,
      schoolOffice: "Bagong Silang National High School",
      district: "Caloocan North",
      nature: "complaint",
      description:
        "The hallway lights near the Science building are not working, which makes it hard for students to move around in the morning.",
      status: "open",
      createdAt: new Date(now - 3 * day),
      updatedAt: new Date(now - 3 * day),
    },
    {
      ticketNumber: "FB-DEMO03",
      email: "demo3@example.com",
      emailVerified: true,
      schoolOffice: "DepEd Schools Division Office",
      district: "Manila",
      nature: "praise",
      description:
        "The registration line moved quickly during the last enrollment period. Great job to the staff who handled it.",
      status: "done",
      createdAt: new Date(now - 8 * day),
      updatedAt: new Date(now - 4 * day),
    },
    {
      ticketNumber: "FB-DEMO04",
      fullname: "Pedro Reyes",
      email: "demo4@example.com",
      emailVerified: true,
      schoolOffice: "San Isidro Integrated School",
      district: "Laguna",
      nature: "suggestion",
      description:
        "Consider adding more drinking fountains near the covered court for students during recess.",
      status: "planned",
      createdAt: new Date(now - 1 * day),
      updatedAt: new Date(now - 1 * day),
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
