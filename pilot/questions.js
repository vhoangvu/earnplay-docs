// Pilot question bank (T8.2): 12 varied-form 4th-grade questions.
// Each question stores its answer and a separate check() that recomputes the
// answer independently from the numbers in the story; test.js asserts they match.
const QUESTIONS = [
  {
    id: 'q1', form: 'story', skill: 'multi-digit multiplication',
    text: 'Maya packs 4 bags with 36 marbles in each bag. Then she gives 58 marbles to her cousin. How many marbles does Maya have now?',
    answer: 86,
    check: () => 4 * 36 - 58,
    hints: [
      'Nudge: there are two steps. What do you need to find out first?',
      'Strategy: find the total in all the bags, then take away the marbles she gave away.',
      'Worked step: 4 × 36 = 4 × 30 + 4 × 6. Work that out, then finish the problem.'
    ]
  },
  {
    id: 'q2', form: 'reverse', skill: 'word problems',
    text: 'I am thinking of a number. I multiply it by 6, then add 9, and I get 75. What was my number?',
    answer: 11,
    check: () => (75 - 9) / 6,
    hints: [
      'Nudge: try working backwards from 75.',
      'Strategy: undo the last thing that was done first, then undo the one before it.',
      'Worked step: undo the "add 9" by taking 9 away from 75. Now undo the "multiply by 6" yourself.'
    ]
  },
  {
    id: 'q3', form: 'estimation', skill: 'multi-digit multiplication',
    text: 'A stadium has 398 seats in each section, and there are 5 sections. Round 398 to the nearest hundred, then estimate the total number of seats.',
    answer: 2000,
    check: () => Math.round(398 / 100) * 100 * 5,
    hints: [
      'Nudge: what is 398 close to?',
      'Strategy: use the friendly round number instead of 398, then multiply.',
      'Worked step: 398 rounds to 400. Now multiply 400 by 5 using 4 × 5 and some zeros.'
    ]
  },
  {
    id: 'q4', form: 'which-is-wrong', skill: 'multiplication facts',
    text: 'One of these three facts is wrong. Type the number of the wrong one, and think about why it is wrong.\n1) 7 × 8 = 56\n2) 9 × 6 = 56\n3) 48 ÷ 6 = 8',
    answer: 2,
    check: () => [7 * 8 === 56, 9 * 6 === 56, 48 / 6 === 8].indexOf(false) + 1,
    hints: [
      'Nudge: check the facts one at a time.',
      'Strategy: use a fact you know well, like 10 × 6, to test the 9 × 6.',
      'Worked step: 9 × 6 is the same as 10 × 6 take away one 6. Work that out and compare it with the fact in the question.'
    ]
  },
  {
    id: 'q5', form: 'irrelevant-numbers', skill: 'word problems',
    text: 'A school bus has 48 seats and 9 of them are blue. The driver is 35 years old. At the first stop 27 kids get on, and at the second stop 15 more kids get on. How many kids are on the bus?',
    answer: 42,
    check: () => 27 + 15,
    hints: [
      'Nudge: some of these numbers do not help. Which ones are about the kids getting on?',
      'Strategy: ignore the seats, the colour, and the driver. Only the kids getting on matter.',
      'Worked step: the two groups of kids are 27 and 15. Add them together yourself.'
    ]
  },
  {
    id: 'q6', form: 'reverse', skill: 'word problems',
    text: 'Sam spent $14 on a game and then $9 on a snack. Now he has $27 left. How many dollars did Sam start with?',
    answer: 50,
    check: () => 27 + 9 + 14,
    hints: [
      'Nudge: Sam ended with less than he started with. How do you go back?',
      'Strategy: put the spent money back, one purchase at a time.',
      'Worked step: start with the $27 left and add the $9 snack back. Then add the other purchase back.'
    ]
  },
  {
    id: 'q7', form: 'estimation', skill: 'word problems',
    text: 'A zoo had 612 adults and 389 kids visit on Saturday. Round each number to the nearest hundred, then estimate how many people visited in all.',
    answer: 1000,
    check: () => Math.round(612 / 100) * 100 + Math.round(389 / 100) * 100,
    hints: [
      'Nudge: round each number on its own first.',
      'Strategy: 612 is close to a friendly hundred, and so is 389. Add the friendly numbers.',
      'Worked step: 612 rounds to 600. Round 389 yourself, then add the two rounded numbers.'
    ]
  },
  {
    id: 'q8', form: 'which-is-wrong', skill: 'fraction compare/add',
    text: 'One of these three statements is wrong. Type the number of the wrong one, and think about why it is wrong.\n1) 3/4 is bigger than 2/3\n2) 1/2 + 1/4 = 3/4\n3) 5/8 is bigger than 3/4',
    answer: 3,
    check: () => [3 / 4 > 2 / 3, 1 / 2 + 1 / 4 === 3 / 4, 5 / 8 > 3 / 4].indexOf(false) + 1,
    hints: [
      'Nudge: try writing each fraction with the same bottom number.',
      'Strategy: eighths are easy to compare with halves and quarters. Turn 3/4 into eighths.',
      'Worked step: 3/4 is the same as 6/8. Compare 6/8 with 5/8, then check the other statements.'
    ]
  },
  {
    id: 'q9', form: 'story', skill: 'division',
    text: 'Three friends share 84 stickers equally. Then each friend gives 6 of their stickers to a little sister. How many stickers does each friend have now?',
    answer: 22,
    check: () => 84 / 3 - 6,
    hints: [
      'Nudge: share first, then think about what each friend gives away.',
      'Strategy: find how many each friend gets, then subtract what each friend gives.',
      'Worked step: 84 = 60 + 24. Divide 60 by 3 and 24 by 3, add the parts, then take away what each friend gives.'
    ]
  },
  {
    id: 'q10', form: 'story', skill: 'fraction compare/add',
    text: 'A pizza is cut into 8 equal slices. Lena eats 3/8 of the pizza and her brother eats 2/8 of the pizza. How many slices are left?',
    answer: 3,
    check: () => 8 - (3 + 2),
    hints: [
      'Nudge: 3/8 of the pizza is how many slices?',
      'Strategy: add the slices that were eaten, then see how many of the 8 remain.',
      'Worked step: 3 slices and 2 slices were eaten. Add them, then take that away from 8.'
    ]
  },
  {
    id: 'q11', form: 'reverse', skill: 'word problems',
    text: 'A rectangle has a perimeter of 36 cm. Its length is 11 cm. How wide is the rectangle, in cm?',
    answer: 7,
    check: () => 36 / 2 - 11,
    hints: [
      'Nudge: the perimeter goes all the way around. How many sides are there?',
      'Strategy: the length and width together make half of the perimeter.',
      'Worked step: half of 36 is 18. That is length + width. Take the length away to find the width.'
    ]
  },
  {
    id: 'q12', form: 'irrelevant-numbers', skill: 'multi-digit multiplication',
    text: 'A book has 5 chapters with 24 pages in each chapter. It costs $8, and Jo reads for 15 minutes each night. How many pages are in the whole book?',
    answer: 120,
    check: () => 5 * 24,
    hints: [
      'Nudge: which numbers tell you about pages?',
      'Strategy: the cost and the reading time do not matter. Multiply chapters by pages in each chapter.',
      'Worked step: 5 × 24 = 5 × 20 + 5 × 4. Work that out yourself.'
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) module.exports = QUESTIONS;
