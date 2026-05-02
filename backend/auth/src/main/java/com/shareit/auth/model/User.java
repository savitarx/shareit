package com.shareit.auth.model;


import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String fullname;
    private String username;
    private String email;
    private String password;


    private boolean verified;
    private String otp;
    private LocalDateTime otpExpiry;

    private int otpAttempts;
    private boolean otpBlocked;


}
