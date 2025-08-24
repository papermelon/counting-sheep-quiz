export interface RecommendationPayload {
  title: string
  tips: string[]
}

export function getDefaultRecommendations(quizSlug: string, score: number): RecommendationPayload | null {
  switch (quizSlug) {
    case "epworth": {
      if (score <= 7) {
        return {
          title: "Normal Daytime Sleepiness",
          tips: [
            "Maintain a consistent sleep schedule (same bedtime and wake time).",
            "Aim for 7–9 hours of sleep per night as needed.",
            "Limit caffeine after mid‑afternoon and keep your bedroom dark and cool.",
          ],
        }
      }
      if (score <= 9) {
        return {
          title: "Mild Excessive Sleepiness",
          tips: [
            "Review sleep duration and consistency for the last 2 weeks.",
            "Reduce late‑night screens; try a 30‑minute wind‑down routine.",
            "If symptoms persist, discuss with a clinician.",
          ],
        }
      }
      if (score <= 15) {
        return {
          title: "Moderate Excessive Sleepiness",
          tips: [
            "Consider a clinical evaluation for possible sleep disorders (e.g., OSA, narcolepsy).",
            "Avoid driving when drowsy; schedule short, strategic naps if appropriate.",
            "Track daytime sleepiness and triggers to share with a provider.",
          ],
        }
      }
      return {
        title: "Severe Excessive Sleepiness",
        tips: [
          "Seek prompt medical assessment for significant daytime sleepiness.",
          "Avoid safety‑critical tasks (driving, operating machinery) until evaluated.",
          "Consider a sleep study as advised by a clinician.",
        ],
      }
    }

    case "stop_bang": {
      if (score <= 2) {
        return {
          title: "Low Risk for Obstructive Sleep Apnea",
          tips: [
            "Maintain healthy weight and regular exercise.",
            "Sleep on your side and limit alcohol close to bedtime.",
            "Monitor snoring or witnessed apneas if they arise.",
          ],
        }
      }
      if (score <= 4) {
        return {
          title: "Intermediate Risk for Obstructive Sleep Apnea",
          tips: [
            "Discuss symptoms (snoring, witnessed apneas, fatigue) with a clinician.",
            "Consider home sleep apnea testing if recommended.",
            "Elevate head of bed; avoid sedatives unless prescribed.",
          ],
        }
      }
      return {
        title: "High Risk for Obstructive Sleep Apnea",
        tips: [
          "Seek evaluation by a sleep specialist; a sleep study may be indicated.",
          "If diagnosed, treatment (e.g., CPAP) can improve health and daytime alertness.",
          "Avoid driving while drowsy and limit alcohol before bed.",
        ],
      }
    }

    case "psqi": {
      if (score <= 5) {
        return {
          title: "Good Sleep Quality",
          tips: [
            "Keep a consistent sleep schedule and bedtime routine.",
            "Continue healthy habits (light exposure by day, dark quiet bedroom at night).",
            "Reassess if sleep quality changes or daytime fatigue increases.",
          ],
        }
      }
      if (score <= 10) {
        return {
          title: "Moderate Sleep Quality Issues",
          tips: [
            "Audit caffeine, alcohol, and late‑evening meals; adjust as needed.",
            "Try relaxation techniques (breathing exercises, gentle stretching).",
            "Consider a brief sleep diary to identify patterns to improve.",
          ],
        }
      }
      return {
        title: "Poor Sleep Quality",
        tips: [
          "Consult a clinician or sleep specialist for persistent issues.",
          "Cognitive Behavioral Therapy for Insomnia (CBT‑I) is highly effective.",
          "Evaluate for conditions such as sleep apnea, anxiety, or restless legs.",
        ],
      }
    }

    default:
      return null
  }
}

// lib/recommendations.ts
import { createClient } from '@supabase/supabase-js';

function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

/** Return the tips array for a given quiz + score (single matching band). */
export async function getRecommendations(
  quizSlug: 'epworth' | 'stopbang' | 'psqi',
  score: number
): Promise<string[]> {
  const supabase = serviceClient();
  const { data, error } = await supabase
    .from('recommendation_rules')
    .select('tips,min_score,max_score')
    .eq('quiz_slug', quizSlug)
    .lte('min_score', score)
    .gte('max_score', score)
    .maybeSingle();

  if (error) throw error;
  return data?.tips ?? [];
}