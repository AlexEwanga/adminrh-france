import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const CALLMEBOT_API_URL = "https://api.callmebot.com/whatsapp.php";

export async function sendWhatsAppMessage(phoneNumber: string, message: string) {
  const callmebotApiKey = process.env['CALLMEBOT_API_KEY'];
  
  if (!callmebotApiKey) {
    console.log("[WhatsApp Simulation] No API Key found. Logging message:");
    console.log(`To: ${phoneNumber}`);
    console.log("-------------------");
    console.log(message);
    console.log("-------------------");
    return { success: true, simulated: true };
  }

  try {
    // Nettoyage du numéro : enlever le + et les espaces
    const cleanPhone = phoneNumber.replace(/[\s+]/g, "");
    const url = `${CALLMEBOT_API_URL}?phone=${cleanPhone}&text=${encodeURIComponent(message)}&apikey=${callmebotApiKey}`;
    
    console.log(`[WhatsApp] Calling: ${url.replace(callmebotApiKey, "HIDDEN")}`);
    
    const response = await fetch(url);
    const responseText = await response.text();
    
    if (response.ok) {
      console.log("[WhatsApp] CallMeBot Success:", responseText);
      return { success: true, provider: "callmebot", response: responseText };
    } else {
      console.error("[WhatsApp] CallMeBot Error Response:", responseText);
      throw new Error(`CallMeBot a répondu avec une erreur: ${responseText}`);
    }
  } catch (error: any) {
    console.error("CallMeBot Fetch Error:", error);
    throw new Error(`Erreur réseau ou API: ${error.message}`);
  }
}

export const testWhatsAppConnection = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ 
    phone: z.string()
  }).parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env['CALLMEBOT_API_KEY'];
    if (!apiKey) {
      return { success: false, error: "Clé CALLMEBOT_API_KEY manquante dans Lovable Cloud (Secrets)." };
    }
    
    try {
      const result = await sendWhatsAppMessage(data.phone, "Test de connexion AdminRH-France via CallMeBot 🚀. Si vous voyez ce message, la configuration est correcte !");
      return result;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });
