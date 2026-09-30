const DC = process.env.ZOHO_DC || "eu";

function configured() {
  return process.env.ZOHO_CLIENT_ID && process.env.ZOHO_CLIENT_SECRET && process.env.ZOHO_REFRESH_TOKEN;
}

function norm(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

async function accessToken() {
  const body = new URLSearchParams({
    refresh_token: process.env.ZOHO_REFRESH_TOKEN,
    client_id: process.env.ZOHO_CLIENT_ID,
    client_secret: process.env.ZOHO_CLIENT_SECRET,
    grant_type: "refresh_token"
  });
  const response = await fetch("https://accounts.zoho." + DC + "/oauth/v2/token", { method: "POST", body });
  const json = await response.json();
  if (!json.access_token) {
    const error = new Error("Zoho did not return an access token");
    error.detail = json.error || json.message || "auth";
    throw error;
  }
  return json.access_token;
}

async function zoho(path, token, options) {
  const response = await fetch("https://www.zohoapis." + DC + path, {
    method: options && options.method ? options.method : "GET",
    headers: {
      Authorization: "Zoho-oauthtoken " + token,
      "Content-Type": "application/json"
    },
    body: options && options.body ? JSON.stringify(options.body) : undefined
  });
  const json = await response.json().catch(function () { return {}; });
  if (!response.ok) {
    const error = new Error("Zoho request failed");
    error.status = response.status;
    error.detail = json;
    throw error;
  }
  return json;
}

async function propertyModule(token) {
  const preferred = norm(process.env.ZOHO_MODULE || "Property Deals");
  const keys = [preferred, "propertydeals", "propertydels", "propertydeal"];
  const json = await zoho("/crm/v8/settings/modules", token);
  const modules = json.modules || [];
  const match = modules.find(function (module) {
    const names = [module.api_name, module.module_name, module.plural_label, module.singular_label].map(norm);
    return names.some(function (name) {
      return keys.some(function (key) { return name === key || name.indexOf(key) === 0; });
    });
  });
  if (!match) {
    const error = new Error("Property Deals module was not found");
    error.detail = "module";
    throw error;
  }
  return match.api_name;
}

function pick(fields, names) {
  const wanted = names.map(norm);
  const field = fields.find(function (item) {
    return wanted.indexOf(norm(item.api_name)) >= 0 || wanted.indexOf(norm(item.field_label)) >= 0;
  });
  return field ? field.api_name : "";
}

function recordFrom(fields, data) {
  const details = [
    "Name: " + (data.name || ""),
    data.title ? "Job title: " + data.title : "",
    "Organisation: " + (data.org || ""),
    "They are a: " + (data.role || ""),
    "Email: " + (data.email || ""),
    data.tel ? "Telephone: " + data.tel : "",
    "About: " + (data.about || ""),
    data.where ? "Location: " + data.where : "",
    data.when ? "Timescale: " + data.when : "",
    "",
    data.message || ""
  ].filter(function (line, index, all) { return line !== "" || all[index - 1] !== ""; }).join("\n");

  const record = {};
  function set(names, value) {
    if (!value) return;
    const key = pick(fields, names);
    if (key && record[key] == null) record[key] = value;
  }

  set(["Name", "Deal_Name", "Last_Name", "Full_Name"], (data.name || "Website enquiry") + (data.org ? " — " + data.org : ""));
  set(["Email", "Email_Address"], data.email);
  set(["Phone", "Mobile", "Telephone"], data.tel);
  set(["Company", "Account_Name", "Organisation", "Organization"], data.org);
  set(["Title", "Designation", "Job_Title"], data.title);
  set(["Description", "Message", "Details"], details);
  set(["Lead_Source", "Source"], "Website");

  if (!Object.keys(record).length) record.Name = data.name || "Website enquiry";
  return record;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ ok: false });
    return;
  }
  if (!configured()) {
    res.status(503).json({ ok: false, reason: "zoho-not-configured" });
    return;
  }

  const data = req.body || {};
  if (!data.name || !data.email || !data.message || !data.consent) {
    res.status(400).json({ ok: false });
    return;
  }

  try {
    const token = await accessToken();
    const moduleName = await propertyModule(token);
    const fields = (await zoho("/crm/v8/settings/fields?module=" + encodeURIComponent(moduleName), token)).fields || [];
    const created = await zoho("/crm/v8/" + encodeURIComponent(moduleName), token, {
      method: "POST",
      body: { data: [recordFrom(fields, data)], trigger: ["workflow"] }
    });
    const row = (created.data || [])[0];
    if (!row || row.status === "error") {
      res.status(502).json({ ok: false });
      return;
    }
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(502).json({ ok: false });
  }
};
