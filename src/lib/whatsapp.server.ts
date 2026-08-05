import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const WPSENT_API_URL = "https://wpsent.com/api/send";
const CALLMEBOT_API_URL = "https://api.callmebot.com/whatsapp.php";

export async function sendWhatsAppMessage(phoneNumber: string, message: string) {
  const wpsentKey = process.env['WPSENT_API_KEY'];
  const callmebotApiKey = process.env['CALLMEBOT_API_KEY'];
  
  // Try WPSent first if configured
  if (wpsentKey) {
    try {
      const response = await fetch(WPSENT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${wpsentKey}`,
        },
        body: JSON.stringify({
          to: phoneNumber,
          message: message,
        }),
      });

      if (response.ok) return await response.json();
    } catch (error) {
      console.error("WPSent Error:", error);
    }
  }

  // Try CallMeBot as fallback or if configured
  if (callmebotApiKey) {
    try {
      // CallMeBot format: phone (with international code), text, apikey
      // Documentation: https://www.callmebot.com/blog/free-api-whatsapp-messages/
      const cleanPhone = phoneNumber.replace(/\+/g, "");
      const url = `${CALLMEBOT_API_URL}?phone=${cleanPhone}&text=${encodeURIComponent(message)}&apikey=${callmebotApiKey}`;
      
      const response = await fetch(url);
      if (response.ok) return { success: true, provider: "callmebot" };
    } catch (error) {
      console.error("CallMeBot Error:", error);
    }
  }

  // Fallback to simulation if no keys or both failed
  console.log("[WhatsApp Simulation] No API Key found or requests failed. Logging message:");
  console.log(`To: ${phoneNumber}`);
  console.log("-------------------");
  console.log(message);
  console.log("-------------------");
  return { success: true, simulated: true };
}

export const testWhatsAppConnection = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ 
    phone: z.string(),
    provider: z.enum(['wpsent', 'callmebot'])
  }).parse(data))
  .handler(async ({ data }) => {
    const message = `Test de connexion AdminRH-France via ${data.provider.toUpperCase()} 🚀`;
    
    if (data.provider === 'wpsent') {
      const apiKey = process.env['WPSENT_API_KEY'];
      if (!apiKey) return { success: false, error: "Clé WPSENT_API_KEY manquante." };
      return await sendWhatsAppMessage(data.phone, message);
    } else {
      const apiKey = process.env['CALLMEBOT_API_KEY'];
      if (!apiKey) return { success: false, error: "Clé CALLMEBOT_API_KEY manquante." };
      return await sendWhatsAppMessage(data.phone, message);
    }
  });
