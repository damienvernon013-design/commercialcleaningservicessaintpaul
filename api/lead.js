// Vercel serverless function: proxies quote/contact form submissions to the CRM-QM PushLead API.
// Keeps the CRM bearer token server-side only (set CRM_API_TOKEN in Vercel project env vars).

const CRM_ENDPOINT = "https://thequotemasters.com/crm_api/api.php?action=push_lead";
const INDUSTRY_CODE = 23; // commercial cleaning, per CRM-QM API doc

function splitName(fullName) {
  const trimmed = (fullName || "").trim().replace(/\s+/g, " ");
  if (!trimmed) return { first_name: "", last_name: "" };
  const parts = trimmed.split(" ");
  if (parts.length === 1) return { first_name: parts[0], last_name: "" };
  return { first_name: parts.slice(0, -1).join(" "), last_name: parts[parts.length - 1] };
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "https://commercialcleaningservicessaintpaul.com");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const token = process.env.CRM_API_TOKEN;
  if (!token) {
    console.error("CRM_API_TOKEN is not configured");
    res.status(500).json({ error: "Server is not configured to accept leads yet" });
    return;
  }

  const body = req.body || {};

  const name = String(body.name || "").slice(0, 200);
  const company = String(body.company || "").slice(0, 200);
  const phone = String(body.phone || "").replace(/[^\d+]/g, "").slice(0, 20);
  const email = String(body.email || "").slice(0, 200);
  const title = String(body.title || "").slice(0, 200);
  const sqft = String(body.sqft || "");
  const facilityType = String(body.type || "");
  const frequency = String(body.frequency || "");
  const notes = String(body.notes || "").slice(0, 2000);
  const utmSource = String(body.utm_source || "").slice(0, 255);

  if (!name || !phone) {
    res.status(400).json({ error: "Name and phone are required" });
    return;
  }

  const { first_name, last_name } = splitName(name);

  const noteParts = [];
  if (facilityType) noteParts.push(`Facility type: ${facilityType}`);
  if (sqft) noteParts.push(`Sq footage: ${sqft}`);
  if (frequency) noteParts.push(`Desired frequency: ${frequency}`);
  if (title) noteParts.push(`Title: ${title}`);
  if (notes) noteParts.push(notes);

  const payload = {
    zip: "",
    customer: {
      company_name: company,
      first_name,
      last_name,
      position: title,
      phone,
      email,
      email2: "",
      address: "",
      service_address: "",
      notes: noteParts.join(" | "),
    },
    industry: INDUSTRY_CODE,
    questions: [],
    appointments: [],
    number_of_quotes: "1",
    utm_source: utmSource,
  };

  try {
    const crmResponse = await fetch(CRM_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const text = await crmResponse.text();

    if (!crmResponse.ok) {
      console.error("CRM PushLead error", crmResponse.status, text);
      res.status(502).json({ error: "Failed to submit lead to CRM" });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("CRM PushLead request failed", err);
    res.status(502).json({ error: "Failed to reach CRM" });
  }
};
