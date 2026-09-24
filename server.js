require("dotenv").config();

const path = require("path");
const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3000;

const REQUIRED_ENV = ["GMAIL_USER", "GMAIL_APP_PASSWORD", "CONTACT_TO_EMAIL"];
const missingEnv = REQUIRED_ENV.filter((key) => !process.env[key]);

let transporter = null;
if (missingEnv.length === 0) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
} else {
  console.warn(
    "[contact form] Missing " + missingEnv.join(", ") + " in .env — " +
    "email sending is disabled until those are filled in."
  );
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.use(express.json());
app.use(express.static(__dirname));

app.post("/api/contact", async (req, res) => {
  const body = req.body || {};
  const name = (body.name || "").trim();
  const facility = (body.facility || "").trim();
  const email = (body.email || "").trim();
  const phone = (body.phone || "").trim();
  const message = (body.message || "").trim();

  // Honeypot: a hidden field real visitors never fill in. If it has a
  // value, silently pretend success so bots don't learn anything.
  if (body.company) {
    return res.status(200).json({ ok: true });
  }

  if (!name || !facility || !email || !message) {
    return res.status(400).json({ error: "Please fill in all required fields." });
  }
  if (!EMAIL_PATTERN.test(email)) {
    return res.status(400).json({ error: "Please provide a valid email address." });
  }

  if (!transporter) {
    return res.status(503).json({ error: "Email sending is not configured yet." });
  }

  try {
    await transporter.sendMail({
      from: `"HHD Renal Website" <${process.env.GMAIL_USER}>`,
      to: process.env.CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `New inquiry from ${name} (${facility})`,
      text: [
        `Name: ${name}`,
        `Facility: ${facility}`,
        `Email: ${email}`,
        `Phone: ${phone || "Not provided"}`,
        "",
        "Message:",
        message,
      ].join("\n"),
      html: [
        `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
        `<p><strong>Facility:</strong> ${escapeHtml(facility)}</p>`,
        `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
        `<p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p>`,
        `<p><strong>Message:</strong></p>`,
        `<p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>`,
      ].join("\n"),
    });
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[contact form] Failed to send email:", err.message);
    res.status(500).json({ error: "Something went wrong sending your message. Please try again or call us directly." });
  }
});

app.listen(PORT, () => {
  console.log(`HHD Renal website running at http://localhost:${PORT}`);
  if (missingEnv.length) {
    console.log("Fill in .env with real Gmail credentials to enable the contact form.");
  }
});
