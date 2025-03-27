const otpGenerator = require('otp-generator');
const sendEmail = require('./email');
const User = require('../models/User');

const generateAndSendOtp = async (email) => {
  const otp = otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });

  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  await User.findOneAndUpdate(
    { email },
    { otp, otpExpires },
    { upsert: true, new: true }
  );

  const subject = 'Your OTP for Email Verification';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #2563eb; text-align: center;">Email Verification OTP</h2>
      <p style="font-size: 16px; color: #333; text-align: center;">
        Your verification code is:
      </p>
      <div style="background: #f3f4f6; padding: 15px; margin: 20px 0; border-radius: 5px; text-align: center;">
        <strong style="font-size: 24px; letter-spacing: 3px; color: #2563eb;">${otp}</strong>
      </div>
      <p style="font-size: 14px; color: #666; text-align: center;">
        This code will expire in 10 minutes.<br>
        If you didn't request this code, please ignore this email.
      </p>
      <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
        Sent by Your App Name
      </div>
    </div>
  `;

  await sendEmail(email, subject, html);
};

module.exports = generateAndSendOtp;