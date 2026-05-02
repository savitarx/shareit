package com.shareit.auth.controller;


import com.shareit.auth.model.User;
import com.shareit.auth.repository.UserRepository;
import com.shareit.auth.service.AuthService;
import com.shareit.auth.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    private final EmailService emailService;
    private final UserRepository userRepository;


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user){

        String registerOtp = authService.registerUser(user);
        System.out.println("Registration otp "+registerOtp);
        emailService.sendOtp(user.getEmail(),registerOtp, user.getUsername());


        return ResponseEntity.ok(registerOtp);
    }

    @PostMapping("/verify-register")
    public ResponseEntity<?> verifyRegisterOtp(@RequestParam String email,
                                            @RequestParam String otp){

        String registerOtp = authService.verifyOtp(email,otp);

        System.out.println("Otp for registration "+registerOtp);

        return ResponseEntity.ok(registerOtp);
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String username,
                                        @RequestParam String password){

        String loginOtp = authService.initiateLogin(username,password) ;
        User user = userRepository.findByUsername(username).orElseThrow(()->new RuntimeException("No such user"));
        emailService.sendOtp(user.getEmail(),loginOtp,username);
        System.out.println(loginOtp);

        return ResponseEntity.ok(loginOtp);
    }

    @PostMapping("/verify-login")
    public ResponseEntity<?> verifyLoginOtp(@RequestParam String username,
                                 @RequestParam String otp){

        String loginOtp=authService.verifyLoginOtp(username, otp);
        return ResponseEntity.ok(loginOtp);
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestParam String email){

        String resendOtp = authService.resendOtp(email);

        System.out.println(resendOtp);
        User user = userRepository.findByUsername(email).orElseThrow(()-> new RuntimeException("No such user"));
        emailService.sendOtp(user.getEmail(),resendOtp,user.getUsername());

        return ResponseEntity.ok(resendOtp);
    }


    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email){

        String forgotpasswordOtp = authService.forgotPassword(email);

        System.out.println("Forgot password otp "+forgotpasswordOtp);
        User user = userRepository.findByEmail(email).orElseThrow(()->new RuntimeException("No such user"));
        emailService.sendOtp(email,forgotpasswordOtp,user.getUsername());

        return ResponseEntity.ok(forgotpasswordOtp);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String email,
                                @RequestParam String otp,
                                @RequestParam String newPassword){


        String resetPassword = authService.resetPassword(email,otp,newPassword);

        System.out.println(resetPassword);

        return ResponseEntity.ok(resetPassword);

    }




}
