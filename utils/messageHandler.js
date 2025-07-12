
const { sendWhatsAppMessage } = require("./twilioAPI");
const roomData = require("./roomData");
const fs = require("fs");
const path = require("path");

const bookingsFile = path.join(__dirname, "../bookings.json");

function saveBooking(data) {
  let bookings = [];
  if (fs.existsSync(bookingsFile)) {
    bookings = JSON.parse(fs.readFileSync(bookingsFile, "utf8"));
  }
  bookings.push(data);
  fs.writeFileSync(bookingsFile, JSON.stringify(bookings, null, 2));
}

async function handleMessage(message) {
  console.log("➡️ RAW INCOMING MESSAGE:", JSON.stringify(message, null, 2));
  const from = message.From || message.from;
  const body = (message.Body || message.body || "").toLowerCase();

  if (!from || !body) {
    console.warn("⚠️ Invalid message format:", message);
    return;
  }

  if (body.includes("hi") || body.includes("menu")) {
    return sendWhatsAppMessage(
      from,
      `👋 Welcome to *Mathanda Guest House*! Please choose:

1️⃣ View Rooms
2️⃣ Book a Room (e.g. book whitehub John 20 July)
3️⃣ Get Directions

Reply with the number or keyword.`
    );
  }

  if (body === "1" || body.includes("rooms")) {
    const list = Object.values(roomData)
      .map(
        (room) =>
          `🏠 *${room.name}*
💲 $${room.price}
📄 ${room.description}`
      )
      .join("\n\n");
    return sendWhatsAppMessage(from, list);
  }

  if (body.startsWith("book")) {
    const parts = body.split(" ");
    if (parts.length < 4) {
      return sendWhatsAppMessage(from, "❌ Usage: book roomname name date");
    }
    const roomKey = parts[1];
    const guestName = parts[2];
    const date = parts.slice(3).join(" ");
    const room = roomData[roomKey];

    if (!room) {
      return sendWhatsAppMessage(from, "❌ Room not found. Try 'menu' to view rooms.");
    }

    const booking = { room: room.name, guest: guestName, date, from };
    saveBooking(booking);

    return sendWhatsAppMessage(from, `✅ Booking Confirmed!

🏠 Room: ${room.name}
👤 Guest: ${guestName}
📅 Date: ${date}`);
  }

  return sendWhatsAppMessage(from, "❌ I didn't understand that. Type *menu*.");
}

module.exports = { handleMessage };
