import React, { ChangeEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { io, Socket } from 'socket.io-client';

import { Message } from '../../../services/chat';
import { selectUserSelected } from '../../../store/modules/Chat/reducer';
import {
  Container,
  Header,
  UserInfo,
  Avatar,
  UserInfoContent,
  UserName,
  UserStatus,
  Chat,
  MessageSent,
  MessageReceived,
  InputMessage,
  Actions,
  SearchIcon,
  PhoneIcon,
  MoreIcon,
  WrapperIcon,
  MessageContent,
  MessageDate,
  WrapperInput,
} from './Content.styles';

const Content: React.FC<{ socket: Socket | undefined, user: User }> = ({ socket, user }) => {
  const userSelected = useSelector(selectUserSelected);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const msg = new Message({ message, sender: user.name });

    setMessage('');
    if (userSelected) {
      if (socket) {
        socket.emit('private message', {
          msg,
          to: userSelected,
        });

        console.log(msg);
        // socket.emit('private message', {

        // });
      }
    }
  };

  useEffect(() => {
    if (socket) {
      // socket.emit('private messages', userSelected);

      socket.on('private message', ({ data, msg: newMessage }) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setUsername(data.username);
      });

      socket.on('new private message', ({ msg: newMessage, from }) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    }

    console.log(messages);
  }, [socket, userSelected, setMessages, setUsername]);

  return (
    <Container>
      <Header>
        <UserInfo>
          <Avatar />
          <UserInfoContent>
            <UserName>{username}</UserName>
            <UserStatus>online</UserStatus>
          </UserInfoContent>
        </UserInfo>
        <Actions>
          <WrapperIcon>
            <SearchIcon />
          </WrapperIcon>
          <WrapperIcon>
            <PhoneIcon />
          </WrapperIcon>
          <WrapperIcon>
            <MoreIcon />
          </WrapperIcon>
        </Actions>
      </Header>
      <Chat>
        <MessageSent>
          <MessageContent>
            lets do this quick
          </MessageContent>
          <MessageDate>10:03 AM</MessageDate>
        </MessageSent>
        <MessageReceived>
          <MessageContent>
            What do u think about creating some additional screens for our case?
          </MessageContent>
          <MessageDate>10:03 AM</MessageDate>
        </MessageReceived>
      </Chat>
      <WrapperInput>
        <form onSubmit={handleSubmit}>
          <InputMessage
            type="text"
            placeholder="Escreva uma mensagem..."
            onChange={(e: ChangeEvent<{ value: string }>) => {
              console.log(message);
              return setMessage(e.target.value);
            }}
            value={message}
          />
        </form>
      </WrapperInput>
    </Container>
  );
};

export default Content;
