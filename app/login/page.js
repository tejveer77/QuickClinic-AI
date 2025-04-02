"use client";

import { useState } from "react";
import styled from "styled-components";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../src/lib/firebase";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const FormWrapper = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-5px);
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #1e3a8a;
  text-align: center;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  color: #333;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  &:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
    outline: none;
  }
  &::placeholder {
    color: #9ca3af;
  }
`;

const Label = styled.label`
  position: absolute;
  top: -0.6rem;
  left: 1rem;
  background: white;
  padding: 0 0.25rem;
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
`;

const Button = styled.button`
  padding: 1rem;
  background-color: #10b981;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  &:hover {
    background-color: #059669;
    transform: scale(1.02);
  }
  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorText = styled.p`
  color: #ef4444;
  font-size: 0.875rem;
  text-align: center;
  margin-top: -1rem;
`;

const LinkText = styled.p`
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 1.5rem;
`;

const LinkButton = styled.a`
  color: #1e3a8a;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
  &:hover {
    color: #10b981;
    text-decoration: underline;
  }
`;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Logged in successfully!");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <FormWrapper>
        <Title>Log In to QuickClinic</Title>
        <Form onSubmit={handleLogin}>
          <InputWrapper>
            <Label>Email Address</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </InputWrapper>
          <InputWrapper>
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </InputWrapper>
          {error && <ErrorText>{error}</ErrorText>}
          <Button type="submit" disabled={loading}>
            {loading ? "Logging In..." : "Log In"}
          </Button>
        </Form>
        <LinkText>
          Don’t have an account? <LinkButton href="/signup">Sign Up</LinkButton>
        </LinkText>
      </FormWrapper>
    </Container>
  );
}