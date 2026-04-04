export interface Question {
  id: number;
  text: string;
  category: 'Aahara' | 'Vihara' | 'Vichara';
  guna: 'sattva' | 'rajas' | 'tamas';
}

export const questions: Question[] = [
  // Aahara (Diet & Consumption)
  { id: 1, text: "I prioritize fresh, home-cooked meals over processed or instant food.", category: 'Aahara', guna: 'sattva' },
  { id: 2, text: "I often consume caffeine, energy drinks, or very spicy food to keep my energy levels high.", category: 'Aahara', guna: 'rajas' },
  { id: 3, text: "I tend to eat mindlessly while watching TV or scrolling through my phone.", category: 'Aahara', guna: 'tamas' },
  { id: 4, text: "I stop eating when I am comfortably full, rather than overindulging.", category: 'Aahara', guna: 'sattva' },
  { id: 5, text: "I eat my meals very quickly because I am usually in a rush or thinking about work.", category: 'Aahara', guna: 'rajas' },
  { id: 6, text: "I often consume heavy, oily, or leftover food that makes me feel lethargic afterward.", category: 'Aahara', guna: 'tamas' },
  { id: 7, text: "I feel light, alert, and energetic after most of my meals.", category: 'Aahara', guna: 'sattva' },

  // Vihara (Lifestyle & Activity)
  { id: 8, text: "I maintain a consistent daily routine for waking up and going to bed.", category: 'Vihara', guna: 'sattva' },
  { id: 9, text: "I push myself to the limit in my work or workouts, often ignoring physical fatigue.", category: 'Vihara', guna: 'rajas' },
  { id: 10, text: "I spend a significant portion of my day in sedentary activities (sitting or lying down).", category: 'Vihara', guna: 'tamas' },
  { id: 11, text: "I regularly spend time in nature or quiet environments to recharge my mind.", category: 'Vihara', guna: 'sattva' },
  { id: 12, text: "I find it difficult to sit still for 10 minutes without seeking digital entertainment.", category: 'Vihara', guna: 'rajas' },
  { id: 13, text: "I often oversleep (more than 9 hours) and still feel tired upon waking.", category: 'Vihara', guna: 'tamas' },
  { id: 14, text: "I engage in some form of mindful movement (like Yoga or walking) almost every day.", category: 'Vihara', guna: 'sattva' },

  // Vichara (Thought & Mindset)
  { id: 15, text: "I can remain calm and objective even when faced with unexpected challenges.", category: 'Vichara', guna: 'sattva' },
  { id: 16, text: "I frequently compare my achievements with others and feel a strong need to be superior.", category: 'Vichara', guna: 'rajas' },
  { id: 17, text: "I feel a sense of 'mental fog' or confusion when I have to make important decisions.", category: 'Vichara', guna: 'tamas' },
  { id: 18, text: "I practice gratitude or self-reflection at the end of my day.", category: 'Vichara', guna: 'sattva' },
  { id: 19, text: "My mind is often racing with worries about the future or regrets about the past.", category: 'Vichara', guna: 'rajas' },
  { id: 20, text: "I find myself procrastinating on tasks even when I know they are critical for my growth.", category: 'Vichara', guna: 'tamas' },
  { id: 21, text: "I find it easy to forgive myself and others for mistakes and move forward.", category: 'Vichara', guna: 'sattva' },
];

export const calculateScores = (responses: Record<number, number>) => {
  let s = 0, r = 0, t = 0;
  let sCount = 0, rCount = 0, tCount = 0;

  const categoryBreakdown: Record<string, { sattva: number, rajas: number, tamas: number }> = {
    'Aahara': { sattva: 0, rajas: 0, tamas: 0 },
    'Vihara': { sattva: 0, rajas: 0, tamas: 0 },
    'Vichara': { sattva: 0, rajas: 0, tamas: 0 }
  };

  questions.forEach(q => {
    const val = responses[q.id] || 3;
    if (q.guna === 'sattva') { s += val; sCount++; categoryBreakdown[q.category].sattva += val; }
    if (q.guna === 'rajas') { r += val; rCount++; categoryBreakdown[q.category].rajas += val; }
    if (q.guna === 'tamas') { t += val; tCount++; categoryBreakdown[q.category].tamas += val; }
  });

  const normalize = (val: number, count: number) => {
    if (count === 0) return 0;
    return Math.round(((val - count) / (count * 4)) * 100);
  };

  return {
    overall: {
      sattva: normalize(s, sCount),
      rajas: normalize(r, rCount),
      tamas: normalize(t, tCount)
    },
    categories: categoryBreakdown
  };
};
