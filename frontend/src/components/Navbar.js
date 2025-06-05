import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const Nav = styled.nav`
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Logo = styled(Link)`
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 600;
  text-decoration: none;
  background: linear-gradient(45deg, #00ff88, #00a1ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: #b3b3b3;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #ffffff;
  }
`;

const LogoutButton = styled.button`
  background: transparent;
  border: 1px solid #00ff88;
  color: #00ff88;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: #00ff88;
    color: #1a1a1a;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #ffffff;
`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Nav>
      <Logo to="/home">EduINPT</Logo>
      <NavLinks>
        <NavLink to="/home">Home</NavLink>
        <NavLink to="/subjects">Subjects</NavLink>
        <NavLink to="/favorites">Favorites</NavLink>
        <NavLink to="/profile">Profile</NavLink>
        {user && (
          <UserInfo>
            <span>{user.firstName} {user.lastName}</span>
            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
          </UserInfo>
        )}
      </NavLinks>
    </Nav>
  );
};

export default Navbar; 