package com.shareit.chat.config;


import com.shareit.chat.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

import java.security.Principal;
@Component
@RequiredArgsConstructor
public class JwtChannelInterceptor implements ChannelInterceptor {

    private final JwtUtil jwtUtil;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor accessor = MessageHeaderAccessor
                .getAccessor(message, StompHeaderAccessor.class);

        if (accessor == null || !StompCommand.CONNECT.equals(accessor.getCommand())) {
            return message;
        }

        System.out.println("🔌 STOMP CONNECT received");

        String authHeader = accessor.getFirstNativeHeader("Authorization");
        System.out.println("🔑 Auth header: " + authHeader);

        if (authHeader == null || authHeader.isBlank()) {
            System.out.println("❌ No Authorization header in STOMP CONNECT");
            throw new IllegalArgumentException("Missing Authorization header");
        }

        try {
            String userId = jwtUtil.validateTokenAndGetUser(authHeader); // already strips Bearer
            System.out.println("✅ STOMP auth success: " + userId);
            accessor.setUser(() -> userId); // ✅ lambda instead of anonymous class
        } catch (Exception e) {
            System.out.println("❌ STOMP auth failed: " + e.getMessage());
            throw new IllegalArgumentException("Invalid JWT: " + e.getMessage());
        }

        return message;
    }
}