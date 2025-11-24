import cron from "node-cron";
import User from "../models/User.js";
import { overspendCheckHandler } from "../controllers/alertController.js";
import { sendMonthlyEmailReport } from "../controllers/monthlyMailer.js";
import { sendMonthlyPrediction } from "../controllers/monthlyPrediction.js";

// DAILY budget alert check
cron.schedule("0 23 * * *", async () => {
  console.log("Running daily overspend check");

  const users = await User.find();

  for(const user of users){
    await overspendCheckHandler(user);
  }
});

// MONTHLY finance summary on 1st
cron.schedule("0 7 1 * *", async () => {
  console.log("Sending monthly summary mails");
  
  await sendMonthlyEmailReport();
});

// MONTHLY predictive AI mail
cron.schedule("0 9 1 * *", async () => {
  console.log("Sending monthly prediction");
  
  await sendMonthlyPrediction();
});
