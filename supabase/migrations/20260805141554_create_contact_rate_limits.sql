/*
  # Rate limit ledger for contact submissions

  1. New table
     - `contact_rate_limits`
       - `ip_hash` (text, primary key) - salted hash of the submitter IP, never the raw address
       - `window_start` (timestamptz) - start of the current counting window
       - `request_count` (integer) - submissions seen inside the current window

  2. Security
     - Row level security is enabled with NO policies, so neither `anon` nor
       `authenticated` can read or write it through the Data API. Only the
       service role, which bypasses row level security, may touch it.
     - No privileges are granted to the client roles.
*/

CREATE TABLE IF NOT EXISTS public.contact_rate_limits (
  ip_hash text PRIMARY KEY,
  window_start timestamptz NOT NULL DEFAULT now(),
  request_count integer NOT NULL DEFAULT 0
);

ALTER TABLE public.contact_rate_limits ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.contact_rate_limits FROM anon;
REVOKE ALL ON public.contact_rate_limits FROM authenticated;
