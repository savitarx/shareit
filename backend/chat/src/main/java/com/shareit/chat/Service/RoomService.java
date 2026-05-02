package com.shareit.chat.Service;


import com.shareit.chat.model.Room;
import com.shareit.chat.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor

public class RoomService {
private final RoomRepository repo;

public Room createRoom(String name,String adminId){
    Room room = new Room();
    room.setName(name);
    room.setAdminId(adminId);
    room.setCode(generateCode());
    room.getMembers().add(adminId);
    return repo.save(room);


}

public Room joinRoom(String roomCode,String username){
    Room room = repo.findByCode(roomCode).orElseThrow(()-> new RuntimeException("Room not found"));
    if(room.getMembers().size()==20)throw  new RuntimeException("Unable to join the room");

    room.getMembers().add(username);
    return repo.save(room);

}

public Set<String> getMembers(String code){
    Room room = repo.findByCode(code).orElseThrow(()->new RuntimeException("Room not found"));
    return room.getMembers();
}

private String generateCode()
{
    return String.valueOf((int)(Math.random()*9000)+1000);
}
}
