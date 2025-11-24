// Icebreaker suggestions for StrangerConnect
// Help users start conversations with interesting questions

export const icebreakers = [
  // Fun & Light
  "What's the best thing that happened to you today?",
  "If you could travel anywhere right now, where would you go?",
  "What's your favorite way to spend a weekend?",
  "What's the most interesting thing you've learned recently?",
  "If you could have dinner with anyone (dead or alive), who would it be?",
  
  // Hobbies & Interests
  "What hobbies are you into?",
  "What's the last movie or show you really enjoyed?",
  "What kind of music are you listening to lately?",
  "Do you have any hidden talents?",
  "What's your favorite book or the last book you read?",
  
  // Thought-Provoking
  "What's something you've always wanted to try but haven't yet?",
  "If you could learn any skill instantly, what would it be?",
  "What's the best advice you've ever received?",
  "What's your unpopular opinion?",
  "If you could change one thing about the world, what would it be?",
  
  // Casual & Easy
  "How's your day going so far?",
  "What are you currently working on or studying?",
  "What's your go-to comfort food?",
  "Are you a morning person or a night owl?",
  "What's something that always makes you laugh?",
  
  // Creative
  "If you could have any superpower, what would it be and why?",
  "What would your perfect day look like?",
  "If you could live in any time period, when would it be?",
  "What's your dream job?",
  "If you won the lottery, what's the first thing you'd do?",
];

/**
 * Get a random icebreaker question
 */
export function getRandomIcebreaker(): string {
  return icebreakers[Math.floor(Math.random() * icebreakers.length)];
}

/**
 * Get multiple random icebreakers (no duplicates)
 */
export function getRandomIcebreakers(count: number = 3): string[] {
  const shuffled = [...icebreakers].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, icebreakers.length));
}
