package com.shareit.chat.Service;

import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PresenceService{

    private final Map<String, Set<String>> roomUsers=new ConcurrentHashMap<>();
    private void join(String room,String user){
        roomUsers.computeIfAbsent(room,k->new HashSet<>()).add(user);

    }

    public void leave(String room,String user){
        roomUsers.getOrDefault(room,new HashSet<>()).remove(user);
    }

    public Set<String> getUsers(String room){
        return roomUsers.getOrDefault(room,new HashSet<>());
    }

}
