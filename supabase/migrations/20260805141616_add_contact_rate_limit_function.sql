/*
  # Atomic rate limit claim for contact submissions

  1. New function
     - `public.claim_contact_slot(p_ip_hash text, p_limit integer, p_window_seconds integer)`
       returns boolean. Performs a single atomic upsert so two concurrent
       submissions cannot both pass the check. Returns true when the caller is
       within its allowance, false when it has exhausted it.

  2. Security
     - SECURITY DEFINER so it can write the service-role-only ledger table.
     - `search_path` is pinned to prevent resolution hijacking.
     - EXECUTE is revoked from PUBLIC, `anon` and `authenticated`, and granted
       only to `service_role`, so no browser client can call it.
*/

CREATE OR REPLACE FUNCTION public.claim_contact_slot(
  p_ip_hash text,
  p_limit integer,
  p_window_seconds integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_count integer;
BEGIN
  INSERT INTO public.contact_rate_limits AS r (ip_hash, window_start, request_count)
  VALUES (p_ip_hash, now(), 1)
  ON CONFLICT (ip_hash) DO UPDATE
    SET
      window_start = CASE
        WHEN r.window_start < now() - make_interval(secs => p_window_seconds)
        THEN now() ELSE r.window_start END,
      request_count = CASE
        WHEN r.window_start < now() - make_interval(secs => p_window_seconds)
        THEN 1 ELSE r.request_count + 1 END
  RETURNING request_count INTO v_count;

  RETURN v_count <= p_limit;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_contact_slot(text, integer, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.claim_contact_slot(text, integer, integer) FROM anon;
REVOKE ALL ON FUNCTION public.claim_contact_slot(text, integer, integer) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.claim_contact_slot(text, integer, integer) TO service_role;
