export interface DayMessage {
  sender: 'client' | 'coach' | 'system';
  text: string;
}

export interface ConversationDay {
  day: number;
  messages: DayMessage[];
}

export const sampleConversation: ConversationDay[] = [
  {
    day: 1,
    messages: [
      { sender: 'client', text: 'Good morning. Slept only around 5 hours last night. Daughter had exams, so I was awake late.' },
      { sender: 'client', text: 'Did some mopping, sweeping, Surya Namaskar and walking inside the house.' },
      { sender: 'client', text: 'Generally feeling happy today.' },
      { sender: 'coach', text: 'Good. Please keep sharing your daily updates for water, sleep, steps, exercise and meals.' },
      { sender: 'client', text: 'Had tea and some soaked nuts.' },
      { sender: 'client', text: 'Lunch was kadhi with soya and green vegetables.' },
      { sender: 'coach', text: 'Did you have salad before lunch?' },
      { sender: 'client', text: 'No. I still need to stock vegetables properly. Will do it tomorrow.' },
      { sender: 'client', text: 'Feeling some acidity since morning.' },
      { sender: 'coach', text: 'Did it start after eating something?' },
      { sender: 'client', text: 'No. Slept very late and did a lot of work today. Got up with acidity.' },
      { sender: 'coach', text: 'Did you walk after meals?' },
      { sender: 'client', text: 'Yes, around 15 minutes.' },
    ],
  },
  {
    day: 2,
    messages: [
      { sender: 'client', text: 'Walk and water done.' },
      { sender: 'client', text: 'Can I have banana stem, mint and ginger juice?' },
      { sender: 'coach', text: 'Yes.' },
      { sender: 'client', text: 'Tea 1 cup and 1 apple.' },
      { sender: 'client', text: "Didn't eat much in the evening. Just a small piece of paneer." },
      { sender: 'client', text: 'Still having acidity and bloating.' },
      { sender: 'coach', text: "Please don't skip meals completely. Try to keep the meals simple." },
    ],
  },
  {
    day: 3,
    messages: [
      { sender: 'client', text: 'I had to go to school after a few days. Very hectic morning.' },
      { sender: 'client', text: 'Coconut water, tea, prunes and some seeds till now.' },
      { sender: 'coach', text: 'Nothing else till now?' },
      { sender: 'client', text: "No. I didn't get time." },
      { sender: 'coach', text: 'Slowly we need to adjust the routine around your school schedule also.' },
      { sender: 'client', text: 'Yes. I know it will take time.' },
      { sender: 'client', text: 'Lunch had lots of vegetables, curd and some protein.' },
      { sender: 'client', text: 'Forgot ACV today. Not yet in the habit.' },
      { sender: 'coach', text: 'Set a reminder around meal timings.' },
      { sender: 'client', text: 'Yes, will do.' },
      { sender: 'system', text: "Today's update: Water 4 litres, Sleep 5 hours, Steps around 8,000, Exercise only walking." },
    ],
  },
  {
    day: 4,
    messages: [
      { sender: 'client', text: 'Breakfast was 1.5 vegetable chapatis with seeds and ajwain.' },
      { sender: 'client', text: 'One cup tea.' },
      { sender: 'client', text: '4,500 steps so far.' },
      { sender: 'coach', text: 'Did you carry lunch to school?' },
      { sender: 'client', text: 'Yes.' },
      { sender: 'client', text: 'ACV done today.' },
      { sender: 'client', text: 'Lunch done. Trying to eat slowly.' },
      { sender: 'coach', text: 'Good. Chew properly and avoid rushing meals.' },
      { sender: 'client', text: 'Did around 20 minutes walking, stretching and breathing today. Feeling really good.' },
    ],
  },
  {
    day: 5,
    messages: [
      { sender: 'client', text: "Weight seems slightly up even though I'm eating almost half of what I used to eat." },
      { sender: 'coach', text: 'It is not always about eating less. Your body needs adequate nutrition.' },
      { sender: 'coach', text: 'Protein seems low in breakfast on some days.' },
      { sender: 'client', text: "I didn't have sprouts today. Have ordered them." },
      { sender: 'coach', text: 'You can also have boiled chana, moong or chhole.' },
      { sender: 'client', text: 'Forgot to mention, I had roasted chana at school.' },
      { sender: 'client', text: 'Did 20 minutes stretching and running.' },
    ],
  },
  {
    day: 6,
    messages: [
      { sender: 'client', text: 'Yesterday energy was very good. Today feeling low again.' },
      { sender: 'client', text: 'Bloating is back and I feel like I have gained weight.' },
      { sender: 'coach', text: 'Food intake was low today. Protein was also missing.' },
      { sender: 'client', text: 'I had roasted chana and kala chana.' },
      { sender: 'client', text: 'I am not getting enough time to plan meals. Next week should be easier.' },
      { sender: 'coach', text: "That could be one of the main barriers right now. Let's keep the plan practical." },
    ],
  },
  {
    day: 7,
    messages: [
      { sender: 'client', text: 'Steps 6,000 today.' },
      { sender: 'client', text: 'Sleep around 5.5 hours.' },
      { sender: 'client', text: 'Did mopping and sweeping also, lots of movement.' },
      { sender: 'client', text: 'Breakfast and lunch were okay.' },
      { sender: 'client', text: 'Sorry I missed your call. There was a stressful situation at work.' },
      { sender: 'system', text: 'Tried calling you. Please update when free.' },
      { sender: 'client', text: 'Had a very hectic day today.' },
      { sender: 'client', text: 'There is a lot of office pressure and politics going on.' },
      { sender: 'client', text: 'During a meeting today I was so tired that my head went down on the table and I actually slept for a few seconds.' },
      { sender: 'client', text: 'Feeling very low.' },
      { sender: 'client', text: 'I feel I can sleep for days.' },
      { sender: 'coach', text: 'That sounds like a very exhausting day. Please rest today. We also need to look at your sleep and stress more carefully.' },
    ],
  },
  {
    day: 8,
    messages: [
      { sender: 'client', text: 'Slept better last night, around 8 hours.' },
      { sender: 'client', text: 'Energy feels much better today.' },
      { sender: 'client', text: 'Water around 3.5 litres.' },
      { sender: 'client', text: 'Did 30 minutes exercise.' },
      { sender: 'client', text: 'Steps around 8,000.' },
      { sender: 'client', text: 'Weight is around 83 kg. Waist almost same.' },
      { sender: 'client', text: 'Still having bloating on and off.' },
      { sender: 'client', text: 'But overall energy is much better than before.' },
      { sender: 'coach', text: "That is good progress. Let's continue tracking sleep, bloating, meals and movement consistently." },
    ],
  },
];
