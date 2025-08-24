// lib/scoring/index.ts
import { scoreEpworth } from './epworth';
import { scoreStopBang } from './stopbang';
import { scorePsqi } from './psqi';

export function scoreBySlug(slug: string, answers: number[]) {
  switch (slug) {
    case 'epworth':  return scoreEpworth(answers);
    case 'stopbang': return scoreStopBang(answers);
    case 'psqi':     return scorePsqi(answers);
    default: throw new Error(`Unknown quiz slug: ${slug}`);
  }
}