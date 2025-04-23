"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { motion } from "framer-motion";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../src/lib/firebase";

const Wrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #0F172A, #1E293B); /* Obsidian to slate blue */
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;

  /* Glassy backdrop */
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(15, 23, 42, 0.7);
    backdrop-filter: blur(12px);
    z-index: -1;
  }

  @media (min-width: 640px) {
    padding: 2rem;
  }
`;

const Card = styled(motion.div)`
  background: rgba(15, 23, 42, 0.8); /* Glassy dark */
  backdrop-filter: blur(10px);
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 420px;
  border: 1px solid rgba(46, 229, 196, 0.2); /* Subtle teal border */
  font-family: 'Inter', sans-serif;

  @media (max-width: 640px) {
    padding: 1.5rem;
  }
`;

const Title = styled(motion.h1)`
  font-family: 'Orbitron', sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: #2EE5C4; /* Neon teal */
  margin-bottom: 2rem;
  text-align: center;
  text-shadow: 0 0 10px rgba(46, 229, 196, 0.4); /* Glow */

  @media (min-width: 640px) {
    font-size: 2rem;
  }
`;

const Input = styled(motion.input)`
  padding: 1rem;
  background: rgba(30, 41, 59, 0.8); /* Dark slate */
  color: #D1D5DB; /* Light gray */
  border: 2px solid rgba(46, 229, 196, 0.3); /* Teal border */
  border-radius: 10px;
  font-size: 1rem;
  width: 100%;
  margin-bottom: 1.25rem;
  font-family: 'Inter', sans-serif;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #A855F7; /* Purple focus */
    box-shadow: 0 0 8px rgba(168, 85, 247, 0.5);
    outline: none;
  }

  &::placeholder {
    color: #94A3B8; /* Slate gray */
  }
`;

const Button = styled(motion.button)`
  padding: 1rem;
  width: 100%;
  background: linear-gradient(90deg, #2EE5C4, #06B6D4); /* Teal to cyan */
  color: #D1D5DB; /* Light gray */
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 16px rgba(46, 229, 196, 0.3);

  &:hover {
    transform: translateY(-2px);
    background: linear-gradient(90deg, #A855F7, #7E22CE); /* Purple hover */
    box-shadow: 0 6px 20px rgba(168, 85, 247, 0.5);
  }

  &:focus {
    outline: 2px solid #2EE5C4;
    outline-offset: 2px;
  }
`;

const ErrorText = styled(motion.p)`
  color: #F87171; /* Muted red */
  font-size: 0.9rem;
  text-align: center;
  margin-top: -0.75rem;
  margin-bottom: 1rem;
  font-family: 'Inter', sans-serif;
`;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (auth.currentUser) router.push("/patient-dashboard");
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/patient-dashboard");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <Wrapper>
      <Card
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Title
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Welcome Back
        </Title>
        <form onSubmit={handleLogin} aria-label="Log in to QuickClinic AI">
          <Input
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileFocus={{ scale: 1.02 }}
          />
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileFocus={{ scale: 1.02 }}
          />
          {error && (
            <ErrorText
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              {error}
            </ErrorText>
          )}
          <Button
            type="submit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Log In 
          </Button>
        </form>
      </Card>
    </Wrapper>
  );
}