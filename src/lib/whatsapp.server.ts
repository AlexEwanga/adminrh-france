import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const CALLMEBOT_API_URL = "https://api.callmebot.com/whatsapp.php";

export async function sendWhatsAppMessage(phoneNumber: string, message: string) {
  // Read key inside the function to ensure we get the latest value from Lovable Cloud
  const callmebotApiKey = process.env['CALLMEBOT_API_KEY'];
  
  if (!callmebotApiKey) {
    console.log("[WhatsApp Simulation] CALLMEBOT_API_KEY is missing in env. Logging to console:");
    console.log(`To: ${phoneNumber}`);
    console.log(`Message: ${message}`);
    return { success: true, simulated: true };
  }

  try {
    // Standardize phone format for CallMeBot (no + sign, no spaces)
    const cleanPhone = phoneNumber.replace(/[\s+]/g, "");
    
    // CallMeBot uses a simple GET request
    const url = new URL(CALLMEBOT_API_URL);
    url.searchParams.append("phone", cleanPhone);
    url.searchParams.append("text", message);
    url.searchParams.append("apikey", callmebotApiKey);
    
    console.log(`[WhatsApp] Sending via CallMeBot to ${cleanPhone}...`);
    
    // Use a standard fetch request
    const response = await fetch(url.toString(), {
      method: "GET",
      // Important for some edge runtimes to explicitly avoid cache
      cache: 'no-store'
    });
    
    const responseText = await response.text();
    
    if (response.ok) {
      console.log("[WhatsApp] CallMeBot Success response:", responseText);
      return { success: true, provider: "callmebot", detail: responseText };
    } else {
      console.error("[WhatsApp] CallMeBot Failed:", response.status, responseText);
      throw new Error(`CallMeBot error (${response.status}): ${responseText}`);
    }
  } catch (error: any) {
    console.error("[WhatsApp] Network or API Error:", error.message);
    throw new Error(`Erreur d'envoi: ${error.message}`);
  }
}

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
