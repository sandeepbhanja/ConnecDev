
import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap';
import logo from '../assets/logo.png';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import { logout } from "../slices/authSlice";
import { useDispatch } from "react-redux";
import { useLogoutMutation } from "../slices/authApiSlice";

const Header = () => {

  const{userInfo} = useSelector((state)=>state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async (e)=>{
    e.preventDefault();
    try{
      dispatch(logout());
      navigate('/');
    }catch(e){
      console.log(e);
    }
  }

  return (
    <header>
      <LinkContainer to="/">
        <Navbar bg='dark' variant='dark' collapseOnSelect expands='md'>
          <Container>
            <Navbar.Brand href="/">
              <img src={logo} alt="connectDev" height={70} width={70} />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                {userInfo && <LinkContainer to="/profile">
                  <Nav.Link>Profile</Nav.Link>
                </LinkContainer>}
                {userInfo ? (<LinkContainer to="/logout">
                  <Nav.Link onClick={logoutHandler}>Log Out</Nav.Link>
                </LinkContainer>):(<LinkContainer to="/">
                  <Nav.Link>Sign In</Nav.Link>
                </LinkContainer>)}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </LinkContainer>
    </header>
  );
};

export default Header;
