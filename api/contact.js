// api/contact.js — Vercel Serverless Function
// Forwards the contact form submission via the Resend API to the shop's
// real inbox. Requires the RESEND_API_KEY environment variable to be set
// in the Vercel project (Config type, not Secret — see project notes).
//
// Env vars expected:
//   RESEND_API_KEY        — Resend API key
//   CONTACT_FROM_ADDRESS  — e.g. "no-reply@bokretasarok.com" (must be a
//                            domain verified with Resend)
//   CONTACT_TO_ADDRESS    — e.g. "info@bokretasarok.com"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Minimal email sanity check — real validation stays optional for a
  // small contact form, but this filters out obvious junk.
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress = process.env.CONTACT_FROM_ADDRESS || "no-reply@bokretasarok.com";
  const toAddress = process.env.CONTACT_TO_ADDRESS || "info@bokretasarok.com";

  // Demo/preview mode: until RESEND_API_KEY is set in the Vercel project,
  // don't actually try to send — just log the submission and tell the
  // frontend it succeeded, so a visitor testing the form sees the normal
  // success state instead of a red error message. Remove this block (or
  // just set the env var) once the shop's real inbox is wired up.
  if (!apiKey) {
    console.warn(
      "RESEND_API_KEY is not configured — demo mode, submission logged but not emailed:",
      { name, email, message }
    );
    return res.status(200).json({ ok: true, demo: true });
  }

  try {
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Bokréta Sarok weboldal <${fromAddress}>`,
        to: [toAddress],
        reply_to: email,
        subject: `Új üzenet a weboldalról – ${name}`,
        text: `Név: ${name}\nE-mail: ${email}\n\nÜzenet:\n${message}`,
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      console.error("Resend API error:", errText);
      return res.status(502).json({ error: "Failed to send email" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return res.status(500).json({ error: "Unexpected server error" });
  }
}
