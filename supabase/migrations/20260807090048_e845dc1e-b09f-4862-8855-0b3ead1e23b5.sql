UPDATE public.whatsapp_templates 
SET content_template = REPLACE(content_template, '_Zenith_', '_AdminRH-France_')
WHERE content_template LIKE '%_Zenith_%';