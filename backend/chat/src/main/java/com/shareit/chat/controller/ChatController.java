package com.shareit.chat.controller;


import com.shareit.chat.Service.ChatService;
import com.shareit.chat.Service.PresenceService;
import com.shareit.chat.dto.ChatMessageDto;
import com.shareit.chat.dto.TypingDto;
import com.shareit.chat.model.Message;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate template;
    private final ChatService chatService;
    private final PresenceService service;

    @MessageMapping("/chat.send")
    public void send(ChatMessageDto dto, Principal user){
        Message msg = chatService.save(dto.getRoomCode(),user.getName(),dto.getContent());
        template.convertAndSend("/topic/"+dto.getRoomCode(),msg);
    }


    @MessageMapping("/typing")
    public void typing(TypingDto dto,Principal user){
        template.convertAndSend("/topic/"+dto.getRoomCode()+"/typing",user.getName());

    }

}
