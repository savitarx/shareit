package com.shareit.chat.repository;


import com.shareit.chat.model.Message;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message,Long> {
    List<Message> findByRoomCodeOrderByTimeStampAsc(String roomCode);
}
