package com.shareit.chat.controller;


import com.shareit.chat.Service.ChatService;
import com.shareit.chat.Service.RoomService;
import com.shareit.chat.model.Message;
import com.shareit.chat.model.Room;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/rooms")
public class RoomController {

    private final RoomService service;
    private final ChatService chat;
    private final SimpMessagingTemplate template;


    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestParam String roomCode,Principal user){
        try{
            Room room= service.joinRoom(roomCode,user.getName());
            template.convertAndSend("/topic/"+roomCode+"/members",room.getMembers());
            return ResponseEntity.ok(room);
        }catch (RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    // write the logic for leaving the room
    @PostMapping("/leave")
    public ResponseEntity<?> leave(){
        return new ResponseEntity<>(null);
    }

    @GetMapping("/{roomCode}/messages")
    public List<Message> getMessages (@PathVariable String roomCode){
        return chat.getMessages(roomCode);
    }

    @PostMapping("/create")
    public Room create(@RequestParam String name, Principal user){
        System.out.println("username" +user.getName());
        return service.createRoom(name, user.getName());
    }

    @PostMapping("/health")
    public void check(){
        System.out.println("Health api working");
    }

    @GetMapping("/{roomCode}/members")
    public ResponseEntity<?> getMembers(@PathVariable String roomCode){
        return ResponseEntity.ok(service.getMembers(roomCode));
    }





}
