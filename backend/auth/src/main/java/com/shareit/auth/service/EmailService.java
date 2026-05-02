package com.shareit.auth.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;


    public void sendOtp(String toEmail, String otp,String username) {

        try {

            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);

            helper.setSubject("Your WeChat verification code");

            String htmlContent =

                    "<div style='font-family: Arial, sans-serif; padding: 24px; color: #333;'>"

                            + "<p>Hey <b>" + username + "</b> 👋,</p>"

                            + "<p>Here’s your verification code for your request</p>"

                            + "<p>Verification Code:</p>"



                            + "<div style='"

                            + "font-size: 36px;"

                            + "font-weight: bold;"

                            + "letter-spacing: 10px;"

                            + "text-align: center;"

                            + "padding: 18px;"

                            + "margin: 25px 0;"

                            + "background-color: #f4f6f8;"

                            + "border-radius: 12px;"

                            + "border: 1px solid #ddd;"

                            + "'>"

                            + otp

                            + "</div>"

                            + "<p>⏳ This code will disappear in 5 minutes.Do not share it with anyone</p>"

                            + "<p>If you didn’t ask for this, you can safely ignore it.👍</p>"

                            + "<br>"

                            + "<p>Cheers,<br>"

                            + "<b>Team WeChat 🚀</b></p>"

                            + "</div>";
            helper.setText(htmlContent, true); // true = HTML

            mailSender.send(message);

        } catch (Exception e) {

            throw new RuntimeException("Failed to send OTP email", e);

        }

    }
}
