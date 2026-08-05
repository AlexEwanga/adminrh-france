import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const CALLMEBOT_API_URL = "https://api.callmebot.com/whatsapp.php";

export async function sendWhatsAppMessage(phoneNumber: string, message: string) {
  const callmebotApiKey = process.env['CALLMEBOT_API_KEY'];
  
  if (callmebotApiKey) {
    try {
      // Nettoyage du numéro : enlever le + et les espaces
      const cleanPhone = phoneNumber.replace(/[\s+]/g, "");
      const url = `${CALLMEBOT_API_URL}?phone=${cleanPhone}&text=${encodeURIComponent(message)}&apikey=${callmebotApiKey}`;
      
      console.log(`[WhatsApp] Calling CallMeBot: ${CALLMEBOT_API_URL}?phone=${cleanPhone}&text=...&apikey=${callmebotApiKey}`);
      
      const response = await fetch(url);
      const responseText = await response.text();
      
      if (response.ok) {
        console.log("[WhatsApp] CallMeBot Success:", responseText);
        return { success: true, provider: "callmebot" };
      } else {
        console.error("[WhatsApp] CallMeBot Error Response:", responseText);
        throw new Error(`CallMeBot error: ${responseText}`);
      }
    } catch (error) {
      console.error("CallMeBot Fetch Error:", error);
      throw error;
    }
  }

  // Fallback to simulation
  console.log("[WhatsApp Simulation] Logging message (Check CALLMEBOT_API_KEY):");
  console.log(`To: ${phoneNumber}`);
  console.log("-------------------");
  console.log(message);
  console.log("-------------------");
  return { success: true, simulated: true };
}

export const testWhatsAppConnection = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ 
    phone: z.string()
  }).parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env['CALLMEBOT_API_KEY'];
    if (!apiKey) return { success: false, error: "Clé CALLMEBOT_API_KEY manquante dans Lovable Cloud." };
    
    try {
      return await sendWhatsAppMessage(data.phone, "Test de connexion AdminRH-France via CallMeBot 🚀");
    } catch (error: any) {
      return { success: false, error: error.message || "Erreur lors de l'envoi" };
    }
  });
