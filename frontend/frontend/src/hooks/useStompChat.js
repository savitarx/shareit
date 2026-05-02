import { useEffect, useRef, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';

const WS_URL = 'ws://localhost:8000/chat/ws';

export function useStompChat(roomCode, token) {
  const clientRef  = useRef(null);
  const timerRef   = useRef(null);
  const [connected,  setConnected]  = useState(false);
  const [messages,   setMessages]   = useState([]);
  const [typingUser, setTypingUser] = useState('');
  const[members,setMembers]=useState([])

  useEffect(() => {
    if (!roomCode || !token) return;
    const client = new Client({
      brokerURL: WS_URL,
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 4000,
      onConnect: () => {
        setConnected(true);
        client.subscribe(`/topic/${roomCode}`, (msg) => {
          setMessages(prev => [...prev, JSON.parse(msg.body)]);
        });
        client.subscribe(`/topic/${roomCode}/typing`, (msg) => {
          setTypingUser(msg.body);
          clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => setTypingUser(''), 2500);
        });
        client.subscribe(`/topic/${roomCode}/members`, (msg) => {
          setMembers(JSON.parse(msg.body));
        });
      },
      onDisconnect: () => setConnected(false),
    });

    
client.activate();
    clientRef.current = client;
    return () => { clearTimeout(timerRef.current); client.deactivate(); };
  }, [roomCode, token]);

  const sendMessage = useCallback((content) => {
    clientRef.current?.connected && clientRef.current.publish({
      destination: '/app/chat.send',
      body: JSON.stringify({ roomCode, content }),
    });
  }, [roomCode]);

  const sendTyping = useCallback(() => {
    clientRef.current?.connected && clientRef.current.publish({
      destination: '/app/typing',
      body: JSON.stringify({ roomCode }),
    });
  }, [roomCode]);

  return { connected, messages, setMessages, typingUser, members,setMembers,sendMessage, sendTyping };
}