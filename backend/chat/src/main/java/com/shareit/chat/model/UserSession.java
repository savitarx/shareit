package com.shareit.chat.model;


import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_sessions")
public class UserSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;


    @Column(unique = true,nullable = false)
    private String token;

    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;

    private boolean active;
}
