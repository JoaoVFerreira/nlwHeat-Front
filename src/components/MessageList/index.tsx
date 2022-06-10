import styles from './styles.module.scss';
import io from 'socket.io-client';
import { api } from '../../services/api';

import logoImg from '../../assets/logo.svg';
import { useEffect, useState } from 'react';

type Message = {
  id: string;
  text: string;
  user: {
    name: string;
    avatar_url: string;
  }
}

const messageQueu: Message[] = [];

const socket = io('http://localhost:4000');

socket.on('new_message', (newMessage: Message) => {
  messageQueu.push(newMessage);
})

export function MessageList() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setInterval(() => {
      if (messageQueu.length > 0) {
        setMessages(prevState => [
          messageQueu[0],
          prevState[0],
          prevState[1],
        ].filter(Boolean))

        messageQueu.shift();
      }
    }, 3000);
  })

  useEffect(() => {
    api.get<Message[]>('messages/last3').then((response) => {
      setMessages(response.data);
    })
  }, [])


  return (
    <div className={styles.messageListWrapper}>
      <img src={logoImg} alt="DoWhile 2021"/>

      <ul className={styles.messageList}>
        {messages.map((message) => {
          return (
            <li key={message.id} className={styles.message}>
              <p className={styles.messageContent}>{message.text}</p>
                <div className={styles.messageUser}>
                  <div className={styles.userImage}>
                    <img src={message.user.avatar_url} alt={message.user.name} />
                  </div>
                    <span>{message.user.name}</span>
                </div>
            </li>
          );
        })}
      </ul>

    </div>
  )
}