"use client";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 120px);
  background-color: #f5f7fa;
  text-align: center;
  padding: 1.5rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  color: #1e3a8a;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #6b7280;
  max-width: 600px;
  margin-bottom: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.a`
  padding: 0.75rem 1.5rem;
  background-color: ${(props) => (props.primary ? "#10b981" : "#1e3a8a")};
  color: white;
  font-weight: 600;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.2s;
  &:hover {
    background-color: ${(props) => (props.primary ? "#059669" : "#1e40af")};
  }
`;

export default function Home() {
  return (
    <Container>
      <Title>Welcome to QuickClinic AI</Title>
      <Subtitle>
        Your smart healthcare companion. Book appointments, analyze symptoms, and consult with doctors—all in one place.
      </Subtitle>
      <ButtonGroup>
        <Button href="/signup" primary>Get Started</Button>
        <Button href="/login">Log In</Button>
      </ButtonGroup>
    </Container>
  );
}