/**
 * Curated CyberSahayak response library.
 * Safe, practical Indian cybercrime guidance.
 * Future: can be replaced / augmented by aiProvider.
 */

import type { CyberSahayakSituation } from '../types';

export const SITUATIONS: CyberSahayakSituation[] = [
  {
    id: 'suspicious_message',
    title: 'I received a suspicious message',
    description: 'You received an SMS, email, WhatsApp or other message that feels wrong.',
    steps: [
      {
        title: 'Do not engage',
        detail: 'Do not reply, click links, or share any OTP, PIN, password or personal details.',
        priority: 'immediate',
      },
      {
        title: 'Preserve evidence',
        detail: 'Take screenshots of the full message including sender ID and timestamp. Do not delete yet.',
        priority: 'immediate',
      },
      {
        title: 'Verify independently',
        detail: 'If the message claims to be from a bank or company, call them using the number on their official website or the back of your card - never the number in the message.',
        priority: 'soon',
      },
      {
        title: 'Report if needed',
        detail: 'Report phishing / fraud attempts on https://cybercrime.gov.in/ (select "Report Cyber Crime").',
        priority: 'followup',
      },
      {
        title: 'Block the sender',
        detail: 'Block the number or email address in your messaging app to reduce further contact.',
        priority: 'followup',
      },
    ],
    helplines: [
      { name: 'National Cyber Crime Helpline', value: '1930' },
      { name: 'Official reporting portal', value: 'https://cybercrime.gov.in/' },
    ],
  },
  {
    id: 'clicked_link',
    title: 'I clicked a suspicious link',
    description: 'You opened a link from an untrusted message or website.',
    steps: [
      {
        title: 'Stop further interaction',
        detail: 'Close the tab/window immediately. Do not enter any credentials, OTP or card details on that page.',
        priority: 'immediate',
      },
      {
        title: 'Check for downloads',
        detail: 'If anything downloaded, do not open it. Delete the file and empty recycle bin / trash.',
        priority: 'immediate',
      },
      {
        title: 'Scan your device',
        detail: 'Run a full malware / antivirus scan with a trusted security app.',
        priority: 'soon',
      },
      {
        title: 'Change passwords (from a clean device)',
        detail: 'If you typed any password on the page, change that password and enable 2FA from a different trusted device.',
        priority: 'soon',
      },
      {
        title: 'Monitor accounts',
        detail: 'Watch bank SMS and email for unusual activity for the next few days.',
        priority: 'followup',
      },
      {
        title: 'Report',
        detail: 'Report the incident and the URL on https://cybercrime.gov.in/.',
        priority: 'followup',
      },
    ],
    helplines: [
      { name: 'Financial cyber fraud helpline', value: '1930' },
      { name: 'Reporting portal', value: 'https://cybercrime.gov.in/' },
    ],
  },
  {
    id: 'shared_otp',
    title: 'I shared an OTP or password',
    description: 'You shared a one-time password, PIN or account password with someone.',
    steps: [
      {
        title: 'Contact your bank / service immediately',
        detail: 'Call the official customer-care number (from the back of your card or official website) and inform them that OTP/password was shared. Request temporary block if needed.',
        priority: 'immediate',
      },
      {
        title: 'Change the password / PIN',
        detail: 'Reset the password and PIN for that account from a trusted device as soon as possible.',
        priority: 'immediate',
      },
      {
        title: 'Enable extra security',
        detail: 'Turn on transaction alerts, set lower limits if available, and enable two-factor authentication where possible.',
        priority: 'soon',
      },
      {
        title: 'Check recent transactions',
        detail: 'Review recent activity. If any unauthorised transaction appears, dispute it at once.',
        priority: 'soon',
      },
      {
        title: 'File a complaint',
        detail: 'Report on https://cybercrime.gov.in/ and call 1930 for financial fraud. Note the acknowledgement number.',
        priority: 'followup',
      },
    ],
    helplines: [
      { name: 'Financial cyber fraud helpline', value: '1930' },
      { name: 'Reporting portal', value: 'https://cybercrime.gov.in/' },
    ],
  },
  {
    id: 'shared_banking',
    title: 'I shared banking information',
    description: 'You shared account number, IFSC, card details, CVV, net-banking credentials or similar.',
    steps: [
      {
        title: 'Call your bank right now',
        detail: 'Use the official helpline printed on your card or bank website. Request immediate block / hotlist of the card or account if required.',
        priority: 'immediate',
      },
      {
        title: 'Do not share more data',
        detail: 'Stop all further communication with the person who asked for the details.',
        priority: 'immediate',
      },
      {
        title: 'Change credentials',
        detail: 'Reset net-banking password, app PIN and any related passwords from a safe device.',
        priority: 'immediate',
      },
      {
        title: 'Monitor and dispute',
        detail: 'Check all recent transactions. Raise disputes for any unauthorised debits with the bank and keep reference numbers.',
        priority: 'soon',
      },
      {
        title: 'Report cybercrime',
        detail: 'File a complaint at https://cybercrime.gov.in/ and call 1930. Also consider filing a local police complaint if significant money is involved.',
        priority: 'followup',
      },
    ],
    helplines: [
      { name: 'Financial cyber fraud helpline', value: '1930' },
      { name: 'Reporting portal', value: 'https://cybercrime.gov.in/' },
    ],
  },
  {
    id: 'unauthorized_transfer',
    title: 'Money was deducted or transferred without my permission',
    description: 'You noticed unauthorised debits, UPI transfers or card transactions.',
    steps: [
      {
        title: 'Call 1930 immediately',
        detail: 'The national financial cyber fraud helpline can help freeze further transfers in many cases if reported quickly.',
        priority: 'immediate',
      },
      {
        title: 'Inform your bank',
        detail: 'Call official bank helpline, report the unauthorised transaction, and request account/card freeze and dispute filing.',
        priority: 'immediate',
      },
      {
        title: 'Collect evidence',
        detail: 'Save SMS, email alerts, bank statements, UPI reference numbers and screenshots of the transactions.',
        priority: 'soon',
      },
      {
        title: 'File online complaint',
        detail: 'Submit a detailed complaint on https://cybercrime.gov.in/ with all evidence. Note the acknowledgement number.',
        priority: 'soon',
      },
      {
        title: 'Follow up',
        detail: 'Keep the acknowledgement number safe. Follow up with the bank and cybercrime portal as instructed. Consider a local police FIR for larger amounts.',
        priority: 'followup',
      },
    ],
    helplines: [
      { name: 'Financial cyber fraud helpline (priority)', value: '1930' },
      { name: 'Reporting portal', value: 'https://cybercrime.gov.in/' },
    ],
  },
  {
    id: 'account_compromise',
    title: 'My account may have been compromised',
    description: 'You suspect email, social media, banking or other account takeover.',
    steps: [
      {
        title: 'Secure the account from a clean device',
        detail: 'Use a different trusted device if possible. Change the password, sign out all sessions, and enable 2FA / authenticator app.',
        priority: 'immediate',
      },
      {
        title: 'Check recovery options',
        detail: 'Verify that recovery email and phone number are still yours. Update them if they were changed by an attacker.',
        priority: 'immediate',
      },
      {
        title: 'Review connected apps and activity',
        detail: 'Remove unknown devices, sessions and third-party app access. Check recent login history.',
        priority: 'soon',
      },
      {
        title: 'Warn contacts if needed',
        detail: 'If the account was used to message others, inform close contacts that it was compromised so they ignore scams sent in your name.',
        priority: 'soon',
      },
      {
        title: 'Report',
        detail: 'Report account takeover on https://cybercrime.gov.in/ and to the platform official abuse channel.',
        priority: 'followup',
      },
    ],
    helplines: [
      { name: 'National Cyber Crime Helpline', value: '1930' },
      { name: 'Reporting portal', value: 'https://cybercrime.gov.in/' },
    ],
  },
];

export function getSituation(id: string): CyberSahayakSituation | undefined {
  return SITUATIONS.find((s) => s.id === id);
}
