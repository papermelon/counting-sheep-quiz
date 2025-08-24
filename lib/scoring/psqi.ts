// lib/scoring/psqi.ts
export function scorePsqi(answerValues: number[]) {
  // Simplified MVP: sum 0–3 across 19 items, clamp to 21 for banding
  const raw = answerValues.reduce((a, b) => a + (Number(b) || 0), 0);
  const score = Math.min(raw, 21);
  const interpretation = score <= 5 ? 'Good sleep quality' : 'Poor sleep quality';
  return { score, interpretation, max: 21 };
}