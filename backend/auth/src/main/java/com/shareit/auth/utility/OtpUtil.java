package com.shareit.auth.utility;


import org.springframework.stereotype.Component;

@Component
public class OtpUtil {

    public String generateOtp(){
        int otp = (int)(Math.random() * 900000) + 100000;
        return String.valueOf(otp);
    }
}
