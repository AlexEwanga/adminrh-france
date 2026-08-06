CREATE TABLE public.whatsapp_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    phone_number TEXT NOT NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT NOT NULL, -- 'success', 'failed', 'retrying'
    attempts INTEGER DEFAULT 1 NOT NULL,
    error_message TEXT,
    provider TEXT DEFAULT 'callmebot'
);

GRANT SELECT, INSERT, UPDATE ON public.whatsapp_logs TO authenticated;
GRANT ALL ON public.whatsapp_logs TO service_role;

CREATE TABLE public.whatsapp_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    name TEXT UNIQUE NOT NULL, -- e.g., 'daily_lesson', 'quiz_reminder'
    theme TEXT NOT NULL,
    content_template TEXT NOT NULL, -- e.g., "*{{subject}}*\n\n{{content}}\n\n_AdminRH-France_"
    is_default BOOLEAN DEFAULT false
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.whatsapp_templates TO authenticated;
GRANT ALL ON public.whatsapp_templates TO service_role;

ALTER TABLE public.whatsapp_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated to select logs" ON public.whatsapp_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated to manage templates" ON public.whatsapp_templates FOR ALL TO authenticated USING (true);

-- Seed default template
INSERT INTO public.whatsapp_templates (name, theme, content_template, is_default)
VALUES ('daily_lesson', 'Général', '*{{subject}}*\n\n{{content}}\n\n_AdminRH-France_', true);
