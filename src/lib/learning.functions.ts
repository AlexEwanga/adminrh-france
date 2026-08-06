import { supabase } from '@/integrations/supabase/client';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';


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

export const getRecentLogs = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({
    page: z.number().default(1),
    pageSize: z.number().default(10),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    search: z.string().optional()
  }))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { page, pageSize, startDate, endDate, search } = data;
    
    let query = supabase
      .from('whatsapp_logs')
      .select('*', { count: 'exact' });

    if (startDate) query = query.gte('created_at', startDate);
    if (endDate) query = query.lte('created_at', endDate);
    if (search) query = query.or(`subject.ilike.%${search}%,content.ilike.%${search}%,phone_number.ilike.%${search}%`);

    const { data: logs, count, error } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) throw error;
    return { logs: logs || [], total: count || 0 };
  });

export const getWhatsAppStats = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    
    // Get last 7 days stats
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data: logs, error } = await supabase
      .from('whatsapp_logs')
      .select('created_at, status')
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Process data for charts
    const statsByDay: Record<string, { date: string, success: number, failure: number, total: number }> = {};
    
    // Initialize last 7 days
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0]!;
      statsByDay[dateStr] = { 
        date: dateStr, 
        success: 0, 
        failure: 0, 
        total: 0 
      };
    }

    logs?.forEach((log: any) => {
      const dateStr = new Date(log.created_at).toISOString().split('T')[0];
      if (statsByDay[dateStr]) {
        statsByDay[dateStr].total++;
        if (log.status === 'success') {
          dayStat.success++;
        } else {
          dayStat.failure++;
        }
      }
    });

    return Object.values(statsByDay).sort((a, b) => a.date.localeCompare(b.date));
  });

export const getRecentMessages = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
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
    const today = new Date().toISOString().split('T')[0] || new Date().toLocaleDateString('en-CA');
    
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

export const addLearningContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({
    subject: z.string(),
    content: z.string(),
    reference: z.string().regex(/^Art\.\sL\d+-\d+$/, "Référence Legifrance invalide"),
    tag: z.string().optional()
  }))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    
    // Simulate Legifrance verification
    const isValidRef = data.reference.startsWith('Art. L');
    if (!isValidRef) {
      throw new Error("La référence n'a pas pu être validée par Legifrance");
    }

    const { data: content, error } = await supabase
      .from('messages')
      .insert({
        subject: data.subject,
        content: data.content,
        source: data.reference,
        tag: data.tag || 'Législatif',
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;
    return content;
  });

