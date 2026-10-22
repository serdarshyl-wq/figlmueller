import nodemailer from "nodemailer";
import { getEnquiryInbox } from "@/sanity/lib/connect";

/*
 * Where a filled-in enquiry goes.
 *
 * The sheet posts what was typed here and this sends it on as a mail. The
 * address it is sent to is written in the studio rather than here, so moving
 * enquiries to another inbox is something the client does themselves and the
 * site never has to be built again for it. The mail is sent from the site's
 * own account and carries the sender's address as the one to reply to, so
 * answering the mail answers them.
 *
 * What it is sent through is a mailbox the client already has: the host, the
 * user and the password are read from the environment. Nothing is held here
 * and nothing is stored - the enquiry is a mail and nothing else.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WRITTEN = [
  ["name", "Name"],
  ["company", "Company"],
  ["designation", "Designation"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["location", "Project location"],
  ["enquiryType", "Enquiry type"],
  ["message", "Message"],
];

/* A serverless function is handed the whole request in memory, and the host
   refuses one much larger than this anyway. */
const ATTACHMENTS_MOST = 4 * 1024 * 1024;

/* A box no reader can see. Anything that fills it in is not a reader. */
const TRAP = "companyUrl";

const answer = (body, status = 200) =>
  Response.json(body, {
    status,
    headers: { "cache-control": "no-store" },
  });

const mailer = () => {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  const port = Number(process.env.SMTP_PORT || 587);

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
};

export async function POST(request) {
  let form;
  try {
    form = await request.formData();
  } catch {
    return answer({ ok: false, reason: "unreadable" }, 400);
  }

  /* Told the same thing a reader is told, so a robot has nothing to learn
     from the answer. */
  if (String(form.get(TRAP) || "").trim()) return answer({ ok: true });

  const typed = new Map();
  for (const [name, label] of WRITTEN) {
    const value = form.get(name);
    if (typeof value === "string" && value.trim()) typed.set(label, value.trim());
  }

  const from = typed.get("Email");
  if (!from || !typed.get("Message")) {
    return answer({ ok: false, reason: "incomplete" }, 422);
  }

  const attachments = [];
  let weight = 0;

  for (const file of form.getAll("documents")) {
    if (typeof file === "string" || !file?.size) continue;

    weight += file.size;
    if (weight > ATTACHMENTS_MOST) {
      return answer({ ok: false, reason: "attachments" }, 413);
    }

    attachments.push({
      filename: file.name,
      content: Buffer.from(await file.arrayBuffer()),
      contentType: file.type || undefined,
    });
  }

  const to = (await getEnquiryInbox()) || process.env.ENQUIRY_INBOX;
  const transport = mailer();

  if (!to || !transport) {
    console.error(
      "[enquiry] not sent:",
      !to ? "no inbox is written in the studio" : "no mailbox is configured"
    );
    return answer({ ok: false, reason: "unconfigured" }, 500);
  }

  const who = typed.get("Name") || from;
  const where = typed.get("Company");

  try {
    await transport.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to,
      replyTo: from,
      subject: `Enquiry - ${who}${where ? `, ${where}` : ""}`,
      text: [
        ...[...typed].map(([label, value]) => `${label}: ${value}`),
        attachments.length
          ? `\nAttached: ${attachments.map((file) => file.filename).join(", ")}`
          : "",
        "\nSent from the enquiry form on figlmueller.ae",
      ]
        .filter(Boolean)
        .join("\n"),
      attachments,
    });
  } catch (error) {
    console.error("[enquiry] the mail could not be sent:", error.message);
    return answer({ ok: false, reason: "mail" }, 502);
  }

  return answer({ ok: true });
}
