/*
  # Close the anonymous write path on contact_messages

  1. Security
     - `anon` held INSERT on `public.contact_messages` together with a permissive
       INSERT policy. That let any caller with the public anon key POST directly
       to the Data API and insert an unbounded number of rows, bypassing the
       per-IP throttle that lives in the `contact` edge function.
     - The browser bundle never creates a Supabase client (the contact form posts
       to Formspree), so no application feature depends on this grant.
     - The `contact` edge function authenticates with the service role, which
       bypasses row level security, so the legitimate submission path keeps
       working and remains rate limited.

  2. Result
     - `contact_messages` has no client-reachable privileges and no policies.
       Only the owner and `service_role` can write or read it.
*/

DROP POLICY IF EXISTS "insert_contact_messages" ON public.contact_messages;

REVOKE INSERT ON public.contact_messages FROM anon;
REVOKE ALL ON public.contact_messages FROM anon;
REVOKE ALL ON public.contact_messages FROM authenticated;
