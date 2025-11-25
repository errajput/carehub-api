import Appointment from "../models/Appointment.js";
import { send } from "../utils/email.js";

export async function sendUpcomingReminders() {
  const nextHour = new Date(Date.now() + 60 * 60 * 1000);
  const now = new Date();

  const appointments = await Appointment.find({
    start: { $gte: now, $lt: nextHour },
    status: { $ne: "cancelled" },
  }).populate("patient doctor");

  for (const appt of appointments) {
    await send({
      to: appt.patient.email,
      subject: "Appointment Reminder",
      text: `You have an appointment at ${appt.start}`,
    });
  }
}
