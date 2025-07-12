
const twilio = require("twilio");
require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

const client = twilio(accountSid, authToken);

async function sendWhatsAppMessage(to, message) {
  try {
    const result = await client.messages.create({
      from: fromNumber,
      to: to,
      body: message,
    });

    console.log("✅ Twilio message sent:", result.sid);
  } catch (err) {
    console.error("❌ Failed to send Twilio message:", err.message);
  }
}

module.exports = { sendWhatsAppMessage };
