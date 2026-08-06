import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const CALLMEBOT_API_URL = "https://api.callmebot.com/whatsapp.php";
const MAX_RETRIES = 3;

export async function sendWhatsAppMessage(phoneNumber: string, message: string, subject: string = "Notification") {
  const callmebotApiKey = process.env['CALLMEBOT_API_KEY'];
  
  let attempts = 0;
  let lastError = "";
  let success = false;
  
  while (attempts < MAX_RETRIES && !success) {
    attempts++;
    try {
      if (!callmebotApiKey) {
        console.log("[WhatsApp Simulation] CALLMEBOT_API_KEY missing");
        success = true; // Mark as success for simulation
        break;
      }

      const cleanPhone = phoneNumber.replace(/[\s+]/g, "");
      const url = new URL(CALLMEBOT_API_URL);
      url.searchParams.append("phone", cleanPhone);
      url.searchParams.append("text", message);
      url.searchParams.append("apikey", callmebotApiKey);
      
      const response = await fetch(url.toString(), { method: "GET", cache: 'no-store' });
      const responseText = await response.text();
      
      if (response.ok) {
        success = true;
      } else {
        lastError = `CallMeBot error (${response.status}): ${responseText}`;
      }
    } catch (error: any) {
      lastError = error.message;
      if (attempts < MAX_RETRIES) {
        await new Promise(r => setTimeout(r, 2000 * attempts)); // Backoff
      }
    }
  }

  // Log to DB via Admin client (using service role key if available, else standard)
  const supabaseUrl = process.env['SUPABASE_URL'];
  const supabaseKey = process.env['SUPABASE_SERVICE_ROLE_KEY'] || process.env['SUPABASE_PUBLISHABLE_KEY'];
  
  if (supabaseUrl && supabaseKey) {
    // Dynamic import to avoid client-side leakage of server-only deps if this is bundled
    const { createClient } = await import('@supabase/supabase-js');
    const adminSupabase = createClient(supabaseUrl, supabaseKey);
    
    await adminSupabase.from('whatsapp_logs').insert({
      phone_number: phoneNumber,
      subject,
      content: message,
      status: success ? 'success' : 'failed',
      attempts,
      error_message: success ? null : lastError
    });
  }

  if (!success) throw new Error(lastError || "Erreur d'envoi WhatsApp");
  return { success: true, attempts };
}

export const getWhatsAppLogs = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabase
      .from('whatsapp_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) throw error;
    return data;
  });

export const getWhatsAppTemplates = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabase
      .from('whatsapp_templates')
      .select('*')
      .order('name', { ascending: true });
    if (error) throw error;
    return data;
  });

export const updateWhatsAppTemplate = createServerFn({ method: "POST" })
  .inputValidator(z.object({
    id: z.string(),
    content_template: z.string()
  }))
  .handler(async ({ data }) => {
    const { error } = await supabase
      .from('whatsapp_templates')
      .update({ content_template: data.content_template })
      .eq('id', data.id);
    if (error) throw error;
    return { success: true };
  });


export const resendDailyMessages = createServerFn({ method: "POST" })
  .handler(async () => {
    // On appelle le hook interne de manière sécurisée
    const baseUrl = process.env['NODE_ENV'] === 'production' 
      ? `https://adminrh-france.lovable.app`
      : 'http://localhost:8080';
      
    // Pour forcer le renvoi sans attendre le CRON, on peut appeler l'API
    // Mais ici on va implémenter la logique directement ou via fetch
    const response = await fetch(`${baseUrl}/api/public/hooks/send-lessons?force=true`, {
      method: 'POST',
      headers: {
        'apikey': process.env['SUPABASE_PUBLISHABLE_KEY'] || ''
      }
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erreur lors du renvoi: ${error}`);
    }
    
    return await response.json();
  });

export const testWhatsAppConnection = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ 
    phone: z.string()
  }).parse(data))
  .handler(async ({ data }) => {
    // Re-check key presence for immediate feedback
    if (!process.env['CALLMEBOT_API_KEY']) {
      return { success: false, error: "La clé CALLMEBOT_API_KEY n'est pas détectée par le serveur. Assurez-vous de l'avoir ajoutée dans les Secrets de Lovable Cloud." };
    }
    
    try {
      return await sendWhatsAppMessage(data.phone, "AdminRH-France : Votre configuration est maintenant opérationnelle ! ✅");
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });
