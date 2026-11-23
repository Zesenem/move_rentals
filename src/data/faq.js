export const FAQ_ITEMS = [
  {
    question: "What do I need to rent a vehicle in Lisbon?",
    answer:
      "You need valid identification, a suitable driving licence, and a card for the security deposit. Individual vehicle pages list any model-specific experience or licence requirements.",
  },
  {
    question: "Is insurance and roadside assistance included?",
    answer:
      "The listed rental conditions include the applicable insurance and roadside assistance. Open a vehicle page and check Included in Rental for the complete details for that model.",
  },
  {
    question: "Do you offer scooters, motorcycles, cars, and watercraft?",
    answer:
      "Yes. The available fleet can include scooters, motorcycles, selected cars, and seasonal watercraft. Use the fleet filters to find a vehicle that matches your licence and plans.",
  },
  {
    question: "How do I ask about availability?",
    answer:
      "Choose a vehicle and use its WhatsApp contact button. Include your preferred dates in the message so the Move team can confirm current availability and the final rental terms.",
  },
];

export const FAQ_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: {
      "@type": "Answer",
      text: answer,
    },
  })),
};
