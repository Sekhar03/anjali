import functions from 'firebase-functions';
import admin from 'firebase-admin';
import nodemailer from 'nodemailer';

admin.initializeApp();

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().gmail.user,
    pass: functions.config().gmail.password
  }
});

/**
 * Scheduled function to send monthly donation reminders
 * Runs on the 5th of every month at 9:00 AM IST
 */
export const sendMonthlyReminders = functions.pubsub
  .schedule('0 9 5 * *')
  .timeZone('Asia/Kolkata')
  .onRun(async (context) => {
    try {
      const db = admin.firestore();
      
      // Get all members with pending payment status and monthly donation preference
      const membersSnapshot = await db.collection('members')
        .where('paymentStatus', '==', 'pending')
        .where('donationPreference', '==', 'monthly')
        .where('active', '==', true)
        .get();

      if (membersSnapshot.empty) {
        console.log('No members with pending payments found.');
        return null;
      }

      const emailPromises = [];
      const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

      membersSnapshot.forEach((doc) => {
        const member = doc.data();
        
        const mailOptions = {
          from: `Anjali Connect <${functions.config().gmail.user}>`,
          to: member.email,
          subject: `Monthly Donation Reminder - ${currentMonth}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; background: #ea580c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🙏 Monthly Donation Reminder</h1>
                </div>
                <div class="content">
                  <p>Dear ${member.fullName},</p>
                  
                  <p>Namaste! We hope this message finds you well.</p>
                  
                  <p>This is a gentle reminder that your monthly donation of <strong>₹${member.monthlyAmount}</strong> for ${currentMonth} is pending.</p>
                  
                  <p>Your continued support helps us organize beautiful Durga Puja celebrations and maintain our community activities throughout the year.</p>
                  
                  <p style="text-align: center;">
                    <a href="https://anjaliconnect.org/payments" class="button">Make Payment Now</a>
                  </p>
                  
                  <p><strong>Payment Details:</strong></p>
                  <ul>
                    <li>Amount: ₹${member.monthlyAmount}</li>
                    <li>Period: ${currentMonth}</li>
                    <li>Member ID: ${doc.id}</li>
                  </ul>
                  
                  <p>If you have already made the payment, please disregard this reminder.</p>
                  
                  <p>Thank you for your generous support!</p>
                  
                  <p>With warm regards,<br>
                  <strong>Anjali Connect Team</strong></p>
                  
                  <div class="footer">
                    <p>You received this email because you are a registered member of Anjali Connect.</p>
                    <p>If you have any questions, please contact us at info@anjaliconnect.org</p>
                  </div>
                </div>
              </div>
            </body>
            </html>
          `
        };

        emailPromises.push(
          transporter.sendMail(mailOptions)
            .then(() => {
              console.log(`Reminder sent to ${member.email}`);
              return db.collection('emailLogs').add({
                memberId: doc.id,
                email: member.email,
                type: 'monthly_reminder',
                sentAt: admin.firestore.FieldValue.serverTimestamp(),
                status: 'sent'
              });
            })
            .catch((error) => {
              console.error(`Failed to send email to ${member.email}:`, error);
              return db.collection('emailLogs').add({
                memberId: doc.id,
                email: member.email,
                type: 'monthly_reminder',
                sentAt: admin.firestore.FieldValue.serverTimestamp(),
                status: 'failed',
                error: error.message
              });
            })
        );
      });

      await Promise.all(emailPromises);
      console.log(`Monthly reminders sent to ${emailPromises.length} members.`);
      return null;
      
    } catch (error) {
      console.error('Error sending monthly reminders:', error);
      throw error;
    }
  });

/**
 * HTTP function to manually trigger reminder emails
 * Can be called by admin for testing or manual reminders
 */
export const sendManualReminder = functions.https.onCall(async (data, context) => {
  // Check if request is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    const db = admin.firestore();
    const { memberIds } = data;

    if (!memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
      throw new functions.https.HttpsError('invalid-argument', 'memberIds must be a non-empty array');
    }

    const emailPromises = [];
    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

    for (const memberId of memberIds) {
      const memberDoc = await db.collection('members').doc(memberId).get();
      
      if (!memberDoc.exists) {
        continue;
      }

      const member = memberDoc.data();

      const mailOptions = {
        from: `Anjali Connect <${functions.config().gmail.user}>`,
        to: member.email,
        subject: `Payment Reminder - ${currentMonth}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; background: #ea580c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🙏 Payment Reminder</h1>
              </div>
              <div class="content">
                <p>Dear ${member.fullName},</p>
                <p>This is a reminder about your pending contribution for ${currentMonth}.</p>
                <p style="text-align: center;">
                  <a href="https://anjaliconnect.org/payments" class="button">Make Payment Now</a>
                </p>
                <p>Thank you for your support!</p>
                <p>Regards,<br><strong>Anjali Connect Team</strong></p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      emailPromises.push(transporter.sendMail(mailOptions));
    }

    await Promise.all(emailPromises);
    
    return {
      success: true,
      message: `Reminders sent to ${emailPromises.length} members`
    };
    
  } catch (error) {
    console.error('Error sending manual reminders:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send reminders');
  }
});

/**
 * Trigger when a payment is completed
 * Sends a thank you email and updates member payment status
 */
export const onPaymentCompleted = functions.firestore
  .document('payments/{paymentId}')
  .onCreate(async (snap, context) => {
    const payment = snap.data();
    
    if (payment.status !== 'completed') {
      return null;
    }

    try {
      const mailOptions = {
        from: `Anjali Connect <${functions.config().gmail.user}>`,
        to: payment.email,
        subject: 'Thank You for Your Donation!',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .receipt { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🙏 Thank You!</h1>
              </div>
              <div class="content">
                <p>Dear ${payment.name},</p>
                <p>We have received your generous donation. Thank you for your continued support!</p>
                
                <div class="receipt">
                  <h3>Payment Receipt</h3>
                  <p><strong>Amount:</strong> ₹${payment.amount}</p>
                  <p><strong>Type:</strong> ${payment.type}</p>
                  <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
                  <p><strong>Transaction ID:</strong> ${context.params.paymentId}</p>
                </div>
                
                <p>Your contribution helps us continue our community activities and organize beautiful Durga Puja celebrations.</p>
                
                <p>May Maa Durga bless you and your family!</p>
                
                <p>With gratitude,<br><strong>Anjali Connect Team</strong></p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log(`Thank you email sent to ${payment.email}`);
      
      return null;
    } catch (error) {
      console.error('Error sending thank you email:', error);
      return null;
    }
  });
