import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  padding: 2rem;
`;

const RegisterForm = styled.form`
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
  backdrop-filter: blur(10px);
`;

const Title = styled.h1`
  color: #ffffff;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #00ff88;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.8rem;
  background: linear-gradient(45deg, #00ff88, #00a1ff);
  border: none;
  border-radius: 5px;
  color: #1a1a1a;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 255, 136, 0.3);
  }
`;

const LoginLink = styled.p`
  text-align: center;
  margin-top: 1rem;
  color: #b3b3b3;

  a {
    color: #00ff88;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  text-align: center;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: rgba(255, 68, 68, 0.1);
  border-radius: 5px;
`;

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const { confirmPassword, ...userData } = formData;
      const success = await register(userData);
      if (success) {
        navigate('/home');
      } else {
        setError('Registration failed');
      }
    } catch (err) {
      setError('An error occurred during registration');
    }
  };

  return (
    <RegisterContainer>
      <RegisterForm onSubmit={handleSubmit}>
        <Title>Sign Up</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <Input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <Button type="submit">Sign Up</Button>
        <LoginLink>
          Already have an account? <Link to="/login">Sign In</Link>
        </LoginLink>
      </RegisterForm>
    </RegisterContainer>
  );
};

export default Register; 