import React from "react";
import { Row, Col, Form, ListGroup } from "react-bootstrap";
import Search from '../components/Search';
import {
  useAccessChatMutation,
  useFetchChatQuery,
} from "../slices/chatApiSlice";

const ChatScreen = () => {
  const { data, isLoading, error } = useFetchChatQuery();
  return (
    <>
    <Search/>
      <Row>
        <Col md={4}>
          {!isLoading && data.map((chat) => <ListGroup key={chat._id}>{chat.chatName}</ListGroup>)}
          </Col>
        <Col md={8}>Col 2</Col>
      </Row>
    </>
  );
};

export default ChatScreen;
