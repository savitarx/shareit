package com.shareit.auth.service;


import com.shareit.auth.model.User;
import com.shareit.auth.repository.UserRepository;
import com.shareit.auth.utility.JwtUtility;
import com.shareit.auth.utility.OtpUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtility jwtUtil;
    private final OtpUtil otpUtil;
    //private final EmailService emailService;


    public String registerUser(User user){

        if(userRepository.findByEmail(user.getEmail()).isPresent())throw  new RuntimeException("Email already taken");
        if(userRepository.findByUsername(user.getUsername()).isPresent()) throw new RuntimeException("username already taken");
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        String otp=otpUtil.generateOtp();
        user.setOtp(otp);
        user.setVerified(false);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));

        userRepository.save(user);

        return otp;
    }

    public String  verifyOtp(String email,String otp){
        User user = userRepository.findByEmail(email).orElseThrow(()->new RuntimeException("User not found"));


        if(user.isOtpBlocked()) throw new RuntimeException("Max Attempts exceeded.Requested for new otp");

        if(user.getOtpExpiry().isBefore(LocalDateTime.now()))throw new RuntimeException("Otp Expired.Request for new otp");

        if(!otp.equals(user.getOtp())){
            user.setOtpAttempts(user.getOtpAttempts()+1);
            if(user.getOtpAttempts()>=5)user.setOtpBlocked(true);
            userRepository.save(user);

            throw new RuntimeException("Invalid Otp Attempts left: "+(5-user.getOtpAttempts()));
        }

        user.setVerified(true);
        user.setOtp(null);
        user.setOtpExpiry(null);
        user.setOtpAttempts(0);
        user.setOtpBlocked(false);

        userRepository.save(user);

        return "User registered successfully";
    }



    public String initiateLogin(String username, String password){

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(!user.isVerified())
            throw new RuntimeException("Verify account first");

        if(!passwordEncoder.matches(password, user.getPassword()))
            throw new RuntimeException("Invalid credentials");

        String otp = otpUtil.generateOtp();

        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        user.setOtpAttempts(0);
        user.setOtpBlocked(false);

        userRepository.save(user);

        return  otp;
    }


    public String verifyLoginOtp(String username,String otp){
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(user.isOtpBlocked()) throw new RuntimeException("Max Attempts Exceeded");
        if(user.getOtpExpiry().isBefore(LocalDateTime.now()))throw new RuntimeException("Otp Expired");

        if(!otp.equals(user.getOtp())){
            user.setOtpAttempts(user.getOtpAttempts()+1);
            if(user.getOtpAttempts()>=5)user.setOtpBlocked(true);

            userRepository.save(user);

            throw new RuntimeException("Invalid Otp.Attempts left : "+ (5-user.getOtpAttempts()));

        }
        user.setOtp(null);
        user.setOtpExpiry(null);
        user.setOtpAttempts(0);
        user.setOtpBlocked(false);
        userRepository.save(user);
        return jwtUtil.generateToken(username);

    }

    public String resendOtp(String username)
    {


        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        String otp = otpUtil.generateOtp();
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        user.setOtpAttempts(0);
        user.setOtpBlocked(false);

        userRepository.save(user);
        return otp;
    }

    public String forgotPassword(String email){

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String otp = otpUtil.generateOtp();

        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        user.setOtpAttempts(0);
        user.setOtpBlocked(false);

        userRepository.save(user);

        return  otp;
    }

    // ================= RESET PASSWORD =================

    public String resetPassword(String email, String otp, String newPassword){

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(user.isOtpBlocked())
            throw new RuntimeException("Max attempts exceeded");

        if(user.getOtpExpiry().isBefore(LocalDateTime.now()))
            throw new RuntimeException("OTP expired");

        if(!otp.equals(user.getOtp())){
            user.setOtpAttempts(user.getOtpAttempts() + 1);

            if(user.getOtpAttempts() >= 5){
                user.setOtpBlocked(true);
            }

            userRepository.save(user);

            throw new RuntimeException("Invalid OTP");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setOtp(null);
        user.setOtpExpiry(null);
        user.setOtpAttempts(0);
        user.setOtpBlocked(false);

        userRepository.save(user);

        return "Password reset successful";
    }
}
