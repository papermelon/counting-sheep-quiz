// lib/scoring/stopbang.ts
export function scoreStopBang(answerValues: number[]) {
  // 8 yes/no items; Yes=1, No=0
  const score = answerValues.reduce((a, b) => a + (Number(b) || 0), 0);
  let interpretation = 'Low OSA risk';
  if (score >= 3 && score <= 4) interpretation = 'Intermediate OSA risk';
  else if (score >= 5) interpretation = 'High OSA risk';
  return { score, interpretation, max: 8 };
}