import type { QuizQuestion } from '../types';

export const SAFETY_TIPS = [
  {
    title: 'Never share OTP',
    body: 'Banks, government portals and genuine companies will never ask for your OTP over phone, SMS or email.',
  },
  {
    title: 'Type official URLs yourself',
    body: 'Instead of clicking links in messages, open a browser and type the official website address.',
  },
  {
    title: 'Verify job & scholarship offers',
    body: 'Unsolicited offers that ask for registration or processing fees are almost always scams.',
  },
  {
    title: 'Enable transaction alerts',
    body: 'Turn on SMS and email alerts for every debit so you can react quickly to unauthorised transactions.',
  },
  {
    title: 'Use strong unique passwords',
    body: 'Prefer a password manager and enable two-factor authentication (preferably authenticator app, not SMS alone).',
  },
  {
    title: 'Report fast — call 1930',
    body: 'For financial cyber fraud in India, call 1930 as soon as possible and also file a complaint on cybercrime.gov.in.',
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'A message says your bank account will be blocked in 2 hours unless you click a link and enter OTP. What should you do?',
    options: [
      'Click the link and enter OTP to save the account',
      'Reply asking for more details',
      'Ignore the link, call the bank using the number on your card',
      'Forward the message to friends for advice',
    ],
    correctIndex: 2,
    explanation:
      'Banks never ask for OTP via unsolicited links. Always use official contact channels printed on your card or the bank\'s real website.',
  },
  {
    id: 'q2',
    question: 'Which of the following is the official Indian portal to report cybercrime?',
    options: [
      'cybercrime.gov.in',
      'reportscam.com',
      'indiacyber.in',
      'cyberpolice.org',
    ],
    correctIndex: 0,
    explanation: 'The official portal is https://cybercrime.gov.in/. For financial fraud also call 1930.',
  },
  {
    id: 'q3',
    question: 'You receive a scholarship message asking for a ₹999 "processing fee" via UPI. This is most likely:',
    options: [
      'A legitimate government process',
      'A common scholarship scam',
      'A bank verification step',
      'Required for all online scholarships',
    ],
    correctIndex: 1,
    explanation:
      'Genuine scholarships do not ask for advance processing fees via UPI from random messages. This is a classic scam pattern.',
  },
  {
    id: 'q4',
    question: 'What is the national helpline number for financial cyber fraud in India?',
    options: ['100', '112', '1930', '155260'],
    correctIndex: 2,
    explanation: '1930 is the dedicated helpline for financial cyber fraud. Report quickly to improve chances of freezing funds.',
  },
  {
    id: 'q5',
    question: 'A URL uses a raw IP address (e.g. http://192.0.2.10/login). This is:',
    options: [
      'Normal for all banking sites',
      'A structural red flag worth high caution',
      'Proof the site is government-run',
      'Required for HTTPS',
    ],
    correctIndex: 1,
    explanation:
      'Legitimate consumer sites rarely ask users to visit raw IP addresses. It is a common phishing technique.',
  },
  {
    id: 'q6',
    question: 'After sharing an OTP with a caller, the first priority is to:',
    options: [
      'Wait and see if money is deducted',
      'Post about it on social media',
      'Call the bank\'s official number and request protection / block if needed',
      'Change only the phone\'s screen lock',
    ],
    correctIndex: 2,
    explanation:
      'Immediate contact with the bank using official channels is critical. Also change credentials and report on cybercrime.gov.in.',
  },
];

export const TIP_OF_THE_DAY = [
  'Never share OTP — not even with someone who claims to be from your bank.',
  'Type website addresses yourself instead of clicking links in messages.',
  'Call 1930 immediately if money is transferred without your permission.',
  'Genuine job or scholarship offers do not ask for advance fees via UPI.',
  'Enable 2FA on important accounts using an authenticator app when possible.',
  'Report phishing and fraud on https://cybercrime.gov.in/.',
  'If a message creates extreme urgency, pause and verify through official channels.',
];
