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

export const getNotes = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return [];

    const { data } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
      
    return data || [];
  });

export const addNote = createServerFn({ method: "POST" })
  .inputValidator((d: { title: string, content: string, color?: string }) => d)
  .handler(async ({ data }) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Unauthorized');

    const { data: note, error } = await supabase
      .from('notes')
      .insert({
        user_id: session.user.id,
        title: data.title,
        content: data.content,
        color: data.color || 'bg-[#D1FAE5] text-[#065F46]'
      })
      .select()
      .single();

    if (error) throw error;
    return note;
  });

export const getObjectives = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return [];

    const { data } = await supabase
      .from('objectives')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
      
    return data || [];
  });

export const addObjective = createServerFn({ method: "POST" })
  .inputValidator((d: { title: string, subject: string, due_date?: string }) => d)
  .handler(async ({ data }) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Unauthorized');

    const { data: objective, error } = await supabase
      .from('objectives')
      .insert({
        user_id: session.user.id,
        title: data.title,
        subject: data.subject,
        due_date: data.due_date || new Date().toISOString(),
        status: 'À faire',
        progress: 0
      })
      .select()
      .single();

    if (error) throw error;
    return objective;
  });

export const getProgressionData = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return [];

    const { data } = await supabase
      .from('learning_stats')
      .select('date, avg_score')
      .eq('user_id', session.user.id)
      .order('date', { ascending: true })
      .limit(7);
      
    return data || [];
  });

export const getQuizById = createServerFn({ method: "GET" })
  .inputValidator((d: { id: string | number }) => d)
  .handler(async ({ data }) => {
    const quizId = typeof data.id === 'string' ? parseInt(data.id, 10) : data.id;
    const { data: quiz, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', quizId)
      .single();
      
    if (error) throw error;
    return quiz;
  });

export const submitQuizResult = createServerFn({ method: "POST" })
  .inputValidator((d: { quiz_id: number, score: number, time_spent?: number }) => d)
  .handler(async ({ data }) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Unauthorized');

    const { data: result, error } = await supabase
      .from('quiz_results')
      .insert({
        user_id: session.user.id,
        quiz_id: data.quiz_id,
        score: data.score,
        time_spent: data.time_spent || 0
      })
      .select()
      .single();

    if (error) throw error;
    
    // Update learning stats for today
    const today = new Date().toISOString().split('T')[0];
    const { error: rpcError } = await supabase.rpc('update_learning_stats', {
      _user_id: session.user.id,
      _date: today,
      _score: data.score
    });


    if (rpcError) {
      console.error('Error updating learning stats:', rpcError);
    }

    return result;
  });


