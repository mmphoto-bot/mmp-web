-- Revoke unnecessary privileges from anon and authenticated roles.
-- Only INSERT is needed for the public contact form.
-- RLS policies already block SELECT/UPDATE/DELETE, but the grants
-- should be minimized to match the actual access model.

REVOKE ALL ON public.contact_messages FROM anon;
REVOKE ALL ON public.contact_messages FROM authenticated;

GRANT INSERT ON public.contact_messages TO anon;
