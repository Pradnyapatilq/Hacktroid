const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
const fetch = require("node-fetch"); // ✅ Required for geocoding proxy

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.static(__dirname));

// ✅ Email config
const COMPANY_EMAIL = "hackroid6@gmail.com";
const COMPANY_APP_PASSWORD = "lykr pone upxi vezr"; // Consider using environment vars

// ✅ Geocoding Proxy Route
app.get("/geocode", async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ error: "Missing query param `q`" });

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`;
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "HospitalLocatorApp/1.0 (hackroid6@gmail.com)"
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Geocoding error:", err);
    res.status(500).json({ error: "Failed to fetch geolocation" });
  }
});

// ✅ Email sending endpoint
app.post("/send-email", async (req, res) => {
  const { image, hospitalEmail } = req.body;

  if (!image || !hospitalEmail) {
    return res.status(400).send("Missing required fields");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: COMPANY_EMAIL,
      pass: COMPANY_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Emergency QR System" <${COMPANY_EMAIL}>`,
    to: hospitalEmail,
    subject: "🚨 Emergency QR Code",
    html: `<p>Please find attached the emergency QR code submitted by the user.</p>`,
    attachments: [
      {
        filename: "qr-code.png",
        content: image.split("base64,")[1],
        encoding: "base64",
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send("✅ Email sent successfully!");
  } catch (err) {
    console.error("Email send failed:", err);
    res.status(500).send("Email failed to send");
  }
});

// ✅ Confirmation route
app.get("/thank-you", (req, res) => {
  res.send("<h2>✅ QR code sent successfully to the hospital!</h2>");
});

app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});
