import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../slices/authSlice";
import { useLoginMutation, useRegisterMutation } from "../slices/authApiSlice";
import {toast} from 'react-toastify';

const AuthScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const [login, { isLoading, error }] = useLoginMutation();
  const [register, { isLoading: RegisterLoading }] = useRegisterMutation();

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  const loginHandler = async (e) => {
    e.preventDefault();
    // console.log(email,password);
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Logged in");
      navigate(`/chat`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const registerHandler = async (e) => {
    e.preventDefault();
    // console.log(email,password);
    try {
      
      if (confirmPassword !== password) {
        toast.error("password do not match");
        return;
      } else {
        const res = await register({ name, email, password, confirmPassword });
        dispatch(setCredentials({ ...res }));
        toast.success('Signed up successfully')
        navigate(`/chat`);
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      {userInfo && navigate('/chats')}
      <Row className="justify-content-center">
        <Col md={4} className="mx-3">
          <h3 className="text-center">New Here?</h3>
          <h5 className="text-center">Sign Up</h5>
          <Form onSubmit={registerHandler}>
            <Form.Group controlId="name" className="my-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter Name"
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="email" className="my-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Email"
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="password" className="my-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="confirmPassword" className="my-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Button type="submit" className="dark" variant="dark">
              Sign-Up
            </Button>
          </Form>
        </Col>

        <Col md={4}>
          <h3 className="text-center">Already a User?</h3>
          <h5 className="text-center">Sign In</h5>
          <Form onSubmit={loginHandler}>
            <Form.Group controlId="email" className="my-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Email"
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="password" className="my-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Button type="submit" className="dark" variant="dark">
              Sign-In
            </Button>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default AuthScreen;
