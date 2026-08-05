import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const CALLMEBOT_API_URL = "https://api.callmebot.com/whatsapp.php";

export async function sendWhatsAppMessage(phoneNumber: string, message: string) {
  const callmebotApiKey = process.env['CALLMEBOT_API_KEY'];
  
  if (callmebotApiKey) {
    try {
      // CallMeBot format: phone (with international code), text, apikey
      const cleanPhone = phoneNumber.replace(/\+/g, "");
      const url = `${CALLMEBOT_API_URL}?phone=${cleanPhone}&text=${encodeURIComponent(message)}&apikey=${callmebotApiKey}`;
      
      const response = await fetch(url);
      if (response.ok) return { success: true, provider: "callmebot" };
    } catch (error) {
      console.error("CallMeBot Error:", error);
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
    if (!apiKey) return { success: false, error: "Clé CALLMEBOT_API_KEY manquante." };
    
    return await sendWhatsAppMessage(data.phone, "Test de connexion AdminRH-France via CallMeBot 🚀");
  });
