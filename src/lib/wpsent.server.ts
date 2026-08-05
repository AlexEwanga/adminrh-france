import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const WPSENT_API_URL = "https://wpsent.com/api/send";

const sendMessageSchema = z.object({
  phoneNumber: z.string(),
  message: z.string(),
});

/**
 * Helper to send a WhatsApp message via WPSent API.
 * Requires WPSENT_API_KEY to be set in the environment.
 */
export async function sendWhatsAppMessage(phoneNumber: string, message: string) {
  const apiKey = process.env['WPSENT_API_KEY'];
  
  if (!apiKey) {
    console.log("[WPSent Simulation] No API Key found. Logging message:");
    console.log(`To: ${phoneNumber}`);
    printWhatsAppPreview(message);
    return { success: true, simulated: true };
  }

  try {
    const response = await fetch(WPSENT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        to: phoneNumber,
        message: message,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to send message via WPSent");
    }

    return await response.json();
  } catch (error) {
    console.error("WPSent Error:", error);
    throw error;
  }
}

function printWhatsAppPreview(message: string) {
  console.log("-------------------");
  console.log(message);
  console.log("-------------------");
}

export const testWPSentConnection = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ phone: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env['WPSENT_API_KEY'];
    if (!apiKey) {
      return { 
        success: false, 
        error: "Clé API WPSent manquante. Ajoutez 'WPSENT_API_KEY' dans les secrets Lovable Cloud." 
      };
    }
    
    return await sendWhatsAppMessage(data.phone, "Test de connexion AdminRH-France via WPSent 🚀");
  });
