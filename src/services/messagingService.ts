import { Student, Branch } from '../types';
import { addNotification } from './storage';

export interface MessagingPayload {
  to: string; // E.164 formatted phone number e.g. +919876543210
  channels: ('whatsapp' | 'sms')[];
  templateName?: string;
  body: string;
  metadata: {
    studentId: string;
    studentName: string;
    fatherName: string;
    seatNo: string;
    receiptNo: string;
    amountPaid: number;
    amountPending: number;
    expiryDate: string;
    event: 'ADMISSION_CONFIRMATION' | 'FEE_PAYMENT_UPDATE' | 'FEE_DUE_REMINDER';
    providerIntegrationHints?: {
      twilioEndpoint: string;
      whatsAppBusinessEndpoint: string;
    };
  };
}

/**
 * Mock messaging service that formats and dispatches messages to WhatsApp & SMS.
 * Logs payload to browser console with Twilio / WhatsApp Business API format.
 */
export const mockMessagingService = {
  /**
   * Dispatch an automated fee payment notification to student via WhatsApp & SMS (Twilio / WhatsApp API mock)
   */
  async sendPaymentNotification(
    student: Student,
    amountPaid: number,
    branch?: Branch,
    event: 'ADMISSION_CONFIRMATION' | 'FEE_PAYMENT_UPDATE' = 'FEE_PAYMENT_UPDATE'
  ): Promise<MessagingPayload> {
    const cleanPhone = student.phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('91') ? `+${cleanPhone}` : `+91${cleanPhone}`;
    const receiptNo = `REC1-${student.id.replace(/\D/g, '').padStart(4, '0') || '0097'}`;
    const remainingDue = Math.max(0, student.feesTotal - student.feesPaid);
    const branchName = branch?.name || 'Apna Library - Lanka Main Branch, Varanasi';

    const whatsappText = 
`*APNA DIGITAL LIBRARY - OFFICIAL PAYMENT CONFIRMATION* 🏛️
--------------------------------------------------
Receipt No: ${receiptNo}
Date: ${new Date().toLocaleDateString('en-GB')}

Dear *${student.name}* (S/o *${student.fatherName}*),
Thank you! Your payment of *₹${amountPaid}* for Seat *${student.seatNo}* (${student.shift.toUpperCase()} Shift) has been received.

Branch: ${branchName}
Validity: ${student.joiningDate} to ${student.expiryDate}
Remaining Due: ₹${remainingDue}
Payment Status: ${remainingDue === 0 ? 'PAID IN FULL ✅' : 'PARTIAL / BALANCE DUE ⚠️'}

Download Digital ID Card & Invoice: https://apnalibrary.in/portal
Helpline: +91 98765 43210
"Your Peaceful Place to Study & Succeed"
🙏 WELCOME 🙏`;

    const smsText = 
`APNALIB: Dear ${student.name}, recvd Rs.${amountPaid} for Seat ${student.seatNo} (Receipt: ${receiptNo}). Bal Due: Rs.${remainingDue}. Valid till ${student.expiryDate}. Happy Studying!`;

    const payload: MessagingPayload = {
      to: formattedPhone,
      channels: ['whatsapp', 'sms'],
      templateName: event === 'ADMISSION_CONFIRMATION' ? 'library_student_welcome_v1' : 'library_fee_payment_receipt_v1',
      body: whatsappText,
      metadata: {
        studentId: student.id,
        studentName: student.name,
        fatherName: student.fatherName,
        seatNo: student.seatNo,
        receiptNo,
        amountPaid,
        amountPending: remainingDue,
        expiryDate: student.expiryDate,
        event,
        providerIntegrationHints: {
          twilioEndpoint: 'POST https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages.json',
          whatsAppBusinessEndpoint: 'POST https://graph.facebook.com/v18.0/{Phone-Number-ID}/messages',
        },
      },
    };

    // --- BROWSER CONSOLE INTEGRATION LOGGING ---
    console.group(`🔔 [MESSAGING SERVICE] Triggered Notification (${event})`);
    console.log(
      `%c[Twilio / WhatsApp Business API Dispatch]%c -> Recipient: %c${formattedPhone}`,
      'background: #0F172A; color: #FBBF24; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
      'color: #94A3B8;',
      'color: #38BDF8; font-weight: bold;'
    );
    console.log('📦 Provider Payload Data:', payload);
    console.log('%c--- WhatsApp Message Body ---', 'color: #34D399; font-weight: bold;');
    console.log(whatsappText);
    console.log('%c--- SMS (Twilio / Gateway) Text ---', 'color: #60A5FA; font-weight: bold;');
    console.log(smsText);
    console.log('✅ Status: 200 OK - Queued for delivery to gateway (Message SID: SM_' + Math.random().toString(36).substring(2, 12) + ')');
    console.groupEnd();

    // Store WhatsApp & SMS entries into storage history for the Admin Audit Logs
    addNotification({
      studentId: student.id,
      studentName: student.name,
      phone: student.phone,
      type: 'WhatsApp',
      category: 'Fee Payment Confirmation',
      message: whatsappText,
    });

    addNotification({
      studentId: student.id,
      studentName: student.name,
      phone: student.phone,
      type: 'SMS',
      category: 'Fee Payment Confirmation',
      message: smsText,
    });

    return payload;
  },
};
