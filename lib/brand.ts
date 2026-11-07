export const brand = {
  name: 'KultVibe',
  tagline: 'Compete. Stream. Earn.',
  oneLiner: "KultVibe is where Africa's gamers and creators compete, stream, and get paid.",
  siteTitle: 'KultVibe | Compete. Stream. Earn.',
  siteDescription: "Join the KultVibe waitlist. Africa's home for gamers and creators to compete in tournaments, stream live, get gifted, and earn.",
  userTypes: {
    Gamer: {
      label: "I'm a gamer",
      description: 'Compete in tournaments, climb the ranks, stream your games and get gifted live.',
    },
    Creator: {
      label: "I'm a creator",
      description: 'Stream, grow your audience, and earn from live gifts and brand deals.',
    },
    Brand: {
      label: "I'm a brand",
      description: "Work with Africa's gamers and creators.",
    },
  },
  interests: ['Music', 'Tech', 'Lifestyle'],
  interestsLabel: 'Vote for what we build next',
  interestsHelper: 'Optional. Pick up to 3.',
} as const

export type UserType = keyof typeof brand.userTypes
export type Interest = typeof brand.interests[number]
