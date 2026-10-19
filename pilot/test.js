// Run with: node pilot/test.js
const assert = require('assert');
const QUESTIONS = require('./questions.js');
const A = require('./app.js');

let failures = 0;
const pendingTests = [];
function test(name, fn) {
  try {
    const result = fn();
    if (result && typeof result.then === 'function') {
      pendingTests.push(result.then(() => console.log('PASS ' + name)).catch((err) => {
        failures++; console.log('FAIL ' + name + ': ' + err.message);
      }));
    } else console.log('PASS ' + name);
  } catch (err) { failures++; console.log('FAIL ' + name + ': ' + err.message); }
}

// T8.2: every stored answer matches an independent recomputation, 12/12.
test('T8.2 question bank: 12 questions, 12/12 answers verified', () => {
  assert.strictEqual(QUESTIONS.length, 12);
  QUESTIONS.forEach((q) => {
    assert.strictEqual(q.check(), q.answer, q.id + ' stored answer does not match recomputation');
    assert.strictEqual(q.hints.length, 3, q.id + ' needs a 3-level hint ladder');
    assert(['story', 'reverse', 'estimation', 'which-is-wrong', 'irrelevant-numbers'].includes(q.form), q.id + ' form');
    assert(!/^\s*\d+\s*[×x+\-÷]\s*\d+\s*=\s*\?\s*$/.test(q.text), q.id + ' is a plain drill');
  });
  const forms = new Set(QUESTIONS.map((q) => q.form));
  assert.strictEqual(forms.size, 5);
});

// Helpers to build scripted sessions. Times are ms from session start.
function shown(s, t, q) { A.logEvent(s, t, 'question_shown', { qid: q.id, number: 1, form: q.form, text: q.text }); }

// (a) active trying with wrong answers -> unlock
function fixtureTrying(threshold) {
  const s = A.createSession(1700000000000, threshold);
  A.logEvent(s, 0, 'session_start');
  let t = 0;
  [QUESTIONS[0], QUESTIONS[1], QUESTIONS[4]].forEach((q, i) => {
    t += 4000; shown(s, t, q);
    t += 8000; A.recordAttempt(s, t, q.id, '999', false);
    t += 6000; A.logEvent(s, t, 'hint_opened', { qid: q.id, level: 1, hintText: q.hints[0] });
    t += 7000; A.logEvent(s, t, 'revision', { qid: q.id, from: '999', to: '12' });
    t += 9000; A.recordAttempt(s, t, q.id, '12', false);
    t += 8000; A.recordAttempt(s, t, q.id, '13', false);
  });
  return { s: s, end: t + 1000 };
}
test('T8.3 fixture (a): active trying with wrong answers unlocks (max threshold)', () => {
  const f = fixtureTrying(14);
  const r = A.evaluateSession(f.s, f.end);
  assert(r.floor.met);
  assert.strictEqual(r.signals.correctAttempts, 0);
  assert(r.unlock, 'points ' + r.points);
  assert(/real trying/.test(r.justification));
});

// (b) pure idling -> no unlock no matter how much time passes
test('T8.3 fixture (b): pure idling never unlocks', () => {
  const s = A.createSession(1700000000000, 8);
  A.logEvent(s, 0, 'session_start');
  shown(s, 0, QUESTIONS[0]);
  [60000, 3600000, 24 * 3600000].forEach((end) => {
    const r = A.evaluateSession(s, end);
    assert.strictEqual(r.signals.activeMs, 0);
    assert(!r.floor.met && !r.unlock);
  });
});

// Floor is a hard gate: lots of active time with no hint interaction still does not unlock.
test('T8.3 floor: attempts without a hint interaction never unlock, even at the minimum threshold', () => {
  const s = A.createSession(1700000000000, 8);
  shown(s, 0, QUESTIONS[0]);
  let t = 0;
  for (let i = 0; i < 20; i++) { t += 5000; A.recordAttempt(s, t, QUESTIONS[0].id, String(i), false); }
  const r = A.evaluateSession(s, t);
  assert(r.points >= 8 && !r.floor.hintOk && !r.unlock);
});

// (c) instant guessing (sub-2s answers) -> no unlock
test('T8.3 fixture (c): instant guessing never unlocks', () => {
  const s = A.createSession(1700000000000, 8);
  let t = 0;
  QUESTIONS.forEach((q) => {
    t += 3000; shown(s, t, q);
    t += 900; A.recordAttempt(s, t, q.id, '1', false);
    t += 700; A.recordAttempt(s, t, q.id, '2', false);
    A.logEvent(s, t + 100, 'hint_opened', { qid: q.id, level: 1, hintText: q.hints[0] });
    t += 900; A.recordAttempt(s, t, q.id, '3', false);
  });
  const r = A.evaluateSession(s, t);
  assert.strictEqual(r.signals.genuineAttempts, 0);
  assert(!r.floor.met && !r.unlock);
});

test('T8.3 idle pause: gaps over 20s add no more than 20s of active time', () => {
  const s = A.createSession(0, 10);
  A.touch(s, 0);
  assert.strictEqual(A.activeMs(s, 10000), 10000);
  assert.strictEqual(A.activeMs(s, 25000), 20000);
  assert.strictEqual(A.activeMs(s, 600000), 20000);
});

test('T8.3 threshold is drawn in the 8-14 range', () => {
  for (let i = 0; i < 200; i++) { const x = A.drawThreshold(); assert(x >= 8 && x <= 14); }
  assert.strictEqual(A.drawThreshold(() => 0), 8);
  assert.strictEqual(A.drawThreshold(() => 0.9999), 14);
});

test('T8.4 transcript lists every event in time order and matches the log count', () => {
  const f = fixtureTrying(10);
  const r = A.evaluateSession(f.s, f.end);
  A.logEvent(f.s, f.end, 'session_end', {});
  A.logEvent(f.s, f.end, 'decision', { unlock: r.unlock, justification: r.justification });
  const rows = A.transcriptRows(f.s);
  assert.strictEqual(rows.length, f.s.events.length);
  const times = f.s.events.slice().sort((a, b) => a.t - b.t || a.seq - b.seq).map((e) => e.t);
  assert.deepStrictEqual(rows.map((x) => x.time), times.map((t) => { const s = Math.floor(t / 1000); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }));
  assert(rows[rows.length - 1].text.indexOf('Decision:') === 0);
  assert(/Attempts: 9/.test(A.signalsLine(r)) && /Hints opened: 3/.test(A.signalsLine(r)) && /Revisions: 3/.test(A.signalsLine(r)));
});

test('parseAnswer', () => {
  assert.strictEqual(A.parseAnswer(' $1,000 '), 1000);
  assert.strictEqual(A.parseAnswer('abc'), null);
  assert.strictEqual(A.parseAnswer(''), null);
});

test('T8.6 rejects answer-leaking tutor drafts and falls back to the canned line', async () => {
  let attempts = 0;
  const fallback = 'Try splitting the problem into steps.';
  const message = await A.draftTutorMessage(async () => {
    attempts++;
    return 'The answer is 86.';
  }, 'Tutor prompt', 86, fallback);
  assert.strictEqual(message, fallback);
  assert.strictEqual(attempts, 3);
  assert.strictEqual(A.validTutorDraft('Try 1 000 next.', 1000), false);
});

test('T8.6 tutor prompt contains the code-chosen level, question, and recent attempts', () => {
  const prompt = A.tutorPrompt('strategy', 'What is 8 times 7?', ['54', '56']);
  assert(/strategy level only/.test(prompt));
  assert(prompt.includes('What is 8 times 7?'));
  assert(prompt.includes('Recent attempts: 54, 56'));
});

test('T8.6 scorer controls unlock when the model judge disagrees in both directions', () => {
  const unlocked = A.compareJudge({ unlock: true }, { verdict: 'stalling' });
  const locked = A.compareJudge({ unlock: false }, { verdict: 'trying' });
  assert.strictEqual(unlocked.unlock, true);
  assert.strictEqual(unlocked.judgeVerdict, 'stalling');
  assert.strictEqual(unlocked.disagreement, true);
  assert.strictEqual(locked.unlock, false);
  assert.strictEqual(locked.judgeVerdict, 'trying');
  assert.strictEqual(locked.disagreement, true);
});

test('T8.6 parses judge JSON defensively', () => {
  assert.deepStrictEqual(A.parseJudgeResponse('```json\n{"verdict":"trying","justification":"Kept working."}\n```'),
    { verdict: 'trying', justification: 'Kept working.' });
  assert.strictEqual(A.parseJudgeResponse('not JSON'), null);
});

Promise.all(pendingTests).then(() => {
  console.log(failures ? failures + ' FAILED' : 'ALL PASSED');
  process.exit(failures ? 1 : 0);
});
