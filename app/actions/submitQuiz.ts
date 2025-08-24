// app/actions/submitQuiz.ts
'use server';

import { randomBytes } from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { scoreBySlug } from '@/lib/scoring';
import { getRecommendations } from '@/lib/recommendations';

function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

/** Save a submission and return computed result + share URL. */
export async function submitQuizAction(params: {
  quizSlug: 'epworth' | 'stopbang' | 'psqi';
  quizId: string;
  answers: number[];           // aligned with order_index 1..n
  referralCode?: string | null;
  userId?: string | null;      // pass if logged-in
}) {
  const { quizSlug, quizId, answers, referralCode, userId } = params;

  // 1) Compute score + interpretation
  const { score, interpretation } = scoreBySlug(quizSlug, answers);

  // 2) Fetch tips for this score
  const tips = await getRecommendations(quizSlug, score);

  // 3) Persist submission
  const shared_token = randomBytes(12).toString('hex');
  const supabase = serviceClient();

  const { data, error } = await supabase
    .from('quiz_submissions')
    .insert({
      quiz_id: quizId,
      user_id: userId ?? null,
      score,
      interpretation,
      tips,
      answers,
      shared_token,
      referral_code: referralCode ?? null
    })
    .select('id, created_at')
    .single();

  if (error) {
    // Bubble to UI; you can also map error.message to friendly text
    throw error;
  }

  // 4) Build share URL (for Web Share / copy)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  const shareUrl = `${baseUrl}/r/${shared_token}`;

  return {
    score,
    interpretation,
    tips,
    shareUrl,
    createdAt: data?.created_at
  };
}