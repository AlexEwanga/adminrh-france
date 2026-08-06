ALTER TABLE public.daily_schedule ADD COLUMN IF NOT EXISTS sent_count_today INTEGER DEFAULT 0;
GRANT ALL ON public.daily_schedule TO service_role;
GRANT SELECT, UPDATE ON public.daily_schedule TO authenticated;
