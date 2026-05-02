package com.shareit.chat.model;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Message {
    @Id
    @GeneratedValue
    private Long id;

    private String roomCode;
    private String senderId;
    private String content;
    private long timeStamp;
    private boolean read;


}
