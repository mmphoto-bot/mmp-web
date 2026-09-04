DROP POLICY IF EXISTS "insert_contact_messages" ON public.contact_messages;

CREATE POLICY "insert_contact_messages" ON public.contact_messages FOR INSERT
  TO anon
  WITH CHECK (
    name IS NOT NULL AND name <> '' AND
    email IS NOT NULL AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND
    message IS NOT NULL AND message <> '' AND
    project_type IS NOT NULL AND project_type <> ''
  );
