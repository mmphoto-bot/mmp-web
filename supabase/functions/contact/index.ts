import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json" };

/* Field bounds. These mirror the CHECK constraints on contact_messages so the
   function and the database agree on what a valid submission looks like. */
const LIMITS = {
  name: 200,
  email: 320,
  message: 5000,
  project_type: 100,
} as const;

/* Per-IP allowance: 5 submissions per 10 minutes. */
const RATE_LIMIT = 5;
const RATE_WINDOW_SECONDS = 600;

/* Reject bodies larger than this outright, before parsing. */
const MAX_BODY_BYTES = 16 * 1024;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function fail(status: number, message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: jsonHeaders,
  });
}

function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

async function hashIp(ip: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function validField(value: unknown, max: number): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= max;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return fail(405, "Method not allowed");
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !supabaseKey) {
    console.error("contact: missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    return fail(500, "Unable to send your message right now. Please try again later.");
  }

  try {
    /* Reject oversized payloads before doing any work with them. */
    const declaredLength = Number(req.headers.get("content-length") ?? "0");
    if (declaredLength > MAX_BODY_BYTES) {
      return fail(413, "Your message is too long.");
    }

    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return fail(413, "Your message is too long.");
    }

    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return fail(400, "Invalid request.");
    }

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return fail(400, "Invalid request.");
    }

    const { name, email, message, project_type } = body as Record<string, unknown>;

    if (
      !validField(name, LIMITS.name) ||
      !validField(email, LIMITS.email) ||
      !validField(message, LIMITS.message) ||
      !validField(project_type, LIMITS.project_type)
    ) {
      return fail(400, "Please fill in every field and keep your message a reasonable length.");
    }

    if (!EMAIL_RE.test(email)) {
      return fail(400, "Please enter a valid email address.");
    }

    /* Rate limit per caller. The IP is hashed with the service key as a salt so
       the ledger never stores a raw address. */
    const ipHash = await hashIp(clientIp(req), supabaseKey);
    const rateRes = await fetch(`${supabaseUrl}/rest/v1/rpc/claim_contact_slot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        p_ip_hash: ipHash,
        p_limit: RATE_LIMIT,
        p_window_seconds: RATE_WINDOW_SECONDS,
      }),
    });

    if (!rateRes.ok) {
      console.error("contact: rate limit check failed", await rateRes.text());
      return fail(500, "Unable to send your message right now. Please try again later.");
    }

    const allowed = await rateRes.json();
    if (allowed !== true) {
      return fail(429, "Too many messages sent. Please try again later.");
    }

    const res = await fetch(`${supabaseUrl}/rest/v1/contact_messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        project_type: project_type.trim(),
      }),
    });

    if (!res.ok) {
      /* Detail stays in the server log; the caller gets a generic message. */
      console.error("contact: insert failed", res.status, await res.text());
      return fail(500, "Unable to send your message right now. Please try again later.");
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: jsonHeaders,
    });
  } catch (err) {
    console.error("contact: unexpected error", err);
    return fail(500, "Unable to send your message right now. Please try again later.");
  }
});
