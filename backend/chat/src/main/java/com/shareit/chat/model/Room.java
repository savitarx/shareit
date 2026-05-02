package com.shareit.chat.model;


import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Entity
@Data

public class Room {


    @Id
    @GeneratedValue
    private Long id;
    private String name;
    private String code;
    private String adminId;
    private String imageUrl;

    private int capacity=20;
    @ElementCollection
    private Set<String> members = new HashSet<>();
}
