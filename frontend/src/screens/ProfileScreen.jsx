import React from 'react'
import { useState, useEffect } from 'react';
import {useSelector} from 'react-redux';
import {Form,Button} from 'react-bootstrap';
import {toast} from 'react-toastify';
import { useEditProfileMutation } from '../slices/userApiSlice';
import { useDispatch } from 'react-redux'; 
import{setCredentials } from '../slices/authSlice';
const ProfileScreen = () => {
  const[name,setName] = useState("");
  const[email,setEmail] = useState("");
  const[password,setPassword] = useState("");

  const {userInfo} = useSelector((state)=>state.auth);
  const dispatch = useDispatch();

  const [editProfile, {isLoading,error}] = useEditProfileMutation();

  useEffect(()=>{
    setName(userInfo.name);
    setEmail(userInfo.email);
  },[userInfo]);

  const UpdateHandler = async (e)=>{
    e.preventDefault();
    try{
      const data = {name,email,password};
      await editProfile(data);
      dispatch(setCredentials(data));
      toast.success('Profile updated successfully');
    }catch(e){
      toast.error(e.message);
    }
  }

  return (
    <>
      <Form style={{ width: "18rem" }} className="mx-auto my-5" onSubmit={UpdateHandler}>
        <Form.Group controlId="name" className="my-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            placeholder="Enter Name"
            value={name}
            type="name"
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="email" className="my-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            placeholder="Enter Email"
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="password" className="my-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            placeholder="Enter Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button
          type="submit"
          className="my-2 btn-dark"
          variant="dark"
        >
          Update
        </Button>
      </Form>
    </>
  );
}

export default ProfileScreen;
