import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const LandingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  color: #ffffff;
  padding: 2rem;
`;

const Content = styled.div`
  text-align: center;
  max-width: 800px;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(45deg, #00ff88, #00a1ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2.5rem;
  color: #b3b3b3;
  line-height: 1.6;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const Button = styled(Link)`
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  border-radius: 5px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;

  &.primary {
    background: linear-gradient(45deg, #00ff88, #00a1ff);
    color: #1a1a1a;
    border: none;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 255, 136, 0.3);
    }
  }

  &.secondary {
    background: transparent;
    color: #ffffff;
    border: 2px solid #00ff88;

    &:hover {
      background: rgba(0, 255, 136, 0.1);
      transform: translateY(-2px);
    }
  }
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
  width: 100%;
`;

const Feature = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureTitle = styled.h3`
  color: #00ff88;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: #b3b3b3;
  line-height: 1.6;
`;

const LandingPage = () => {
  return (
    <LandingContainer>
      <Content>
        <Title>Welcome to EduINPT</Title>
        <Subtitle>
          Your comprehensive platform for educational resources and learning materials.
          Access high-quality content, collaborate with peers, and enhance your learning journey.
        </Subtitle>
        <ButtonContainer>
          <Button to="/login" className="primary">
            Sign In
          </Button>
          <Button to="/register" className="secondary">
            Sign Up
          </Button>
        </ButtonContainer>
      </Content>

      <Features>
        <Feature>
          <FeatureTitle>Rich Content Library</FeatureTitle>
          <FeatureDescription>
            Access a vast collection of educational materials, including documents,
            videos, and interactive content.
          </FeatureDescription>
        </Feature>
        <Feature>
          <FeatureTitle>Subject-Based Learning</FeatureTitle>
          <FeatureDescription>
            Explore content organized by subjects, from mathematics to languages,
            with different difficulty levels.
          </FeatureDescription>
        </Feature>
        <Feature>
          <FeatureTitle>Collaborative Learning</FeatureTitle>
          <FeatureDescription>
            Share resources, collaborate with peers, and engage in meaningful
            discussions with teachers and students.
          </FeatureDescription>
        </Feature>
      </Features>
    </LandingContainer>
  );
};

export default LandingPage; 