import { supabase } from '@/integrations/supabase/client';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { createServerFn } from '@tanstack/react-start';

export const getLearningStats = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data } = await supabase
      .from('learning_stats')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(1)
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
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    return data || [];
  });

export const addNote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { title: string, content: string, color?: string }) => d)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: note, error } = await supabase
      .from('notes')
      .insert({
        user_id: userId,
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
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data } = await supabase
      .from('objectives')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    return data || [];
  });

export const addObjective = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { title: string, subject: string, due_date?: string }) => d)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: objective, error } = await supabase
      .from('objectives')
      .insert({
        user_id: userId,
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
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data } = await supabase
      .from('learning_stats')
      .select('date, avg_score')
      .eq('user_id', userId)
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
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { quiz_id: number, score: number, time_spent?: number }) => d)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: result, error } = await supabase
      .from('quiz_results')
      .insert({
        user_id: userId,
        quiz_id: data.quiz_id,
        score: data.score,
        time_spent: data.time_spent || 0
      })
      .select()
      .single();

    if (error) throw error;
    
    // Update learning stats
    const today = new Date().toISOString().split('T')[0];
    
    // Check if stats table is empty or we need to initialize
    const { data: existingStat, error: fetchError } = await supabase
      .from('learning_stats')
      .select('id, avg_score, quiz_taken')
      .eq('user_id', userId)
      .eq('date', today)
      .maybeSingle();
      
    if (fetchError) {
      console.error('Error fetching stats:', fetchError);
    }
      
    if (existingStat) {
      const newQuizCount = (existingStat.quiz_taken || 0) + 1;
      const newAvg = Math.round((((existingStat.avg_score || 0) * (existingStat.quiz_taken || 0)) + data.score) / newQuizCount);
      
      const { error: updateError } = await supabase
        .from('learning_stats')
        .update({ avg_score: newAvg, quiz_taken: newQuizCount })
        .eq('id', existingStat.id);
        
      if (updateError) console.error('Error updating stats:', updateError);
    } else {
      const { error: insertError } = await supabase
        .from('learning_stats')
        .insert({
          user_id: userId,
          date: today,
          avg_score: data.score,
          quiz_taken: 1
        });
        
      if (insertError) console.error('Error inserting stats:', insertError);
    }

    return result;
  });
