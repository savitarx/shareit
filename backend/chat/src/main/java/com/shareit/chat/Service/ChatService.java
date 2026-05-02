package com.shareit.chat.Service;


import com.shareit.chat.model.Message;
import com.shareit.chat.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final MessageRepository repo;

    public Message save(String room,String sender,String content){

        Message m = new Message();
        m.setRoomCode(room);
        m.setSenderId(sender);
        m.setContent(content);
        m.setTimeStamp(System.currentTimeMillis());

        return repo.save(m);
    }

    public List<Message> getMessages(String roomCode){
        return repo.findByRoomCodeOrderByTimeStampAsc(roomCode);

    }

}
