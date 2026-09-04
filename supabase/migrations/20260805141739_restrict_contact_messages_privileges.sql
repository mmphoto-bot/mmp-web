/*
  # Remove unused client privileges on contact_messages

  1. Security
     - `anon` and `authenticated` held SELECT, INSERT, UPDATE and DELETE on
       `public.contact_messages`. Only the anon INSERT is used (the submission
       path); nothing in the application reads, updates or deletes the table
       from the browser.
     - Revoke SELECT, UPDATE and DELETE from both client roles so a future
       permissive policy cannot silently expose or destroy stored messages.
     - The owner and `service_role` retain full access, so the project owner can
       still read submissions through the dashboard and the edge function keeps
       working.
*/

REVOKE SELECT, UPDATE, DELETE ON public.contact_messages FROM anon;
REVOKE SELECT, UPDATE, DELETE ON public.contact_messages FROM authenticated;
REVOKE INSERT ON public.contact_messages FROM authenticated;

GRANT INSERT ON public.contact_messages TO anon;
