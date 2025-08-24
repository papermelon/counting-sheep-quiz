// lib/scoring/epworth.ts
export function scoreEpworth(answerValues: number[]) {
  // 8 items, each 0–3
  const score = answerValues.reduce((a, b) => a + (Number(b) || 0), 0);
  let interpretation = 'Normal daytime sleepiness';
  if (score >= 11 && score <= 12) interpretation = 'Mild excessive sleepiness';
  else if (score >= 13 && score <= 15) interpretation = 'Moderate excessive sleepiness';
  else if (score >= 16) interpretation = 'Severe excessive sleepiness';
  return { score, interpretation, max: 24 };
}