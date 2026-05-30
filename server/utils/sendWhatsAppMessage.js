const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendWhatsAppMessage = async ({ to, body }) => {
  if (!to || !body) {
    throw new Error("Phone number and message body are required");
  }

  let cleanPhone = to.replace(/\s+/g, "").trim();

  if (!cleanPhone.startsWith("+")) {
    cleanPhone = `+91${cleanPhone}`;
  }

  return await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: `whatsapp:${cleanPhone}`,
    body,
  });
};

module.exports = sendWhatsAppMessage;