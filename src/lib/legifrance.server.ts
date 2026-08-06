import { z } from 'zod';

export const articleValidatorSchema = z.object({
  reference: z.string().regex(/^Art\.\sL\d+-\d+$/, "Format invalide (ex: Art. L3121-27)"),
  article: z.string().min(10, "L'article doit être complet"),
  casus: z.string().min(10, "Le casus doit être explicite")
});

/**
 * Simulates a verification against Legifrance API
 * In a real production environment, this would call the Legifrance Open Data API
 * to verify that the article exists and is in force.
 */
export async function verifyLegifranceReference(reference: string): Promise<{ valid: boolean; url: string }> {
  // Normalize reference for URL (e.g., Art. L3121-27 -> L3121-27)
  const code = reference.replace('Art. ', '').trim();
  
  // Base URL for Legifrance search or direct link
  const legifranceUrl = `https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI${code}`;
  
  // Simulation: We check if it follows the Labor Code pattern
  const isValid = /^Art\.\sL\d+-\d+$/.test(reference);
  
  return {
    valid: isValid,
    url: legifranceUrl
  };
}
