import { supabase } from '@/integrations/supabase/client';
import { createServerFn } from '@tanstack/react-start';

export const getLearningStats = createServerFn({ method: 'GET' })
  .handler(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const { data } = await supabase
      .from('learning_stats')
      .select('*')
      .eq('user_id', session.user.id)
      .maybeSingle();
      
    return data;
  });

export const getRecentMessages = createServerFn({ method: 'GET' })
  .handler(async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .limit(10)
      .order('created_at', { ascending: false });
    return data || [];
  });

export const getQuizzes = createServerFn({ method: 'GET' })
  .handler(async () => {
    const { data } = await supabase
      .from('quizzes')
      .select('*')
      .order('created_at', { ascending: false });
    return data || [];
  });
