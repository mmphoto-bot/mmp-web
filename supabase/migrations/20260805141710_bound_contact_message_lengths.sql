/*
  # Bound the size of contact message submissions

  1. Constraints
     - Add CHECK constraints capping `name` (200), `email` (320),
       `message` (5000) and `project_type` (100) characters, and requiring each
       to be non-blank. Previously all four were unbounded `text`, so any caller
       holding the public anon key could insert arbitrarily large rows.

  2. Security
     - Restate `insert_contact_messages` so the same bounds are enforced in the
       policy predicate, keeping the Data API insert path bounded independently
       of the constraints.
*/

ALTER TABLE public.contact_messages
  DROP CONSTRAINT IF EXISTS contact_messages_name_len,
  DROP CONSTRAINT IF EXISTS contact_messages_email_len,
  DROP CONSTRAINT IF EXISTS contact_messages_message_len,
  DROP CONSTRAINT IF EXISTS contact_messages_project_type_len;

ALTER TABLE public.contact_messages
  ADD CONSTRAINT contact_messages_name_len
    CHECK (char_length(btrim(name)) BETWEEN 1 AND 200),
  ADD CONSTRAINT contact_messages_email_len
    CHECK (char_length(btrim(email)) BETWEEN 3 AND 320),
  ADD CONSTRAINT contact_messages_message_len
    CHECK (char_length(btrim(message)) BETWEEN 1 AND 5000),
  ADD CONSTRAINT contact_messages_project_type_len
    CHECK (char_length(btrim(project_type)) BETWEEN 1 AND 100);

DROP POLICY IF EXISTS "insert_contact_messages" ON public.contact_messages;

CREATE POLICY "insert_contact_messages" ON public.contact_messages FOR INSERT
  TO anon
  WITH CHECK (
    name IS NOT NULL AND char_length(btrim(name)) BETWEEN 1 AND 200 AND
    email IS NOT NULL AND char_length(btrim(email)) BETWEEN 3 AND 320 AND
    email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND
    message IS NOT NULL AND char_length(btrim(message)) BETWEEN 1 AND 5000 AND
    project_type IS NOT NULL AND char_length(btrim(project_type)) BETWEEN 1 AND 100
  );
