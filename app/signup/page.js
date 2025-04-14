"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { motion } from "framer-motion";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../src/lib/firebase";
import axios from "axios";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 180px);
  background: linear-gradient(180deg, #0F172A, #1E293B); /* Obsidian to slate blue */
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
  max-width: 480px;
  width: 100%;
  font-family: 'Inter', sans-serif;
  border: 1px solid rgba(46, 229, 196, 0.2); /* Subtle teal border */

  @media (max-width: 640px) {
    padding: 1.5rem;
  }
`;

const Title = styled(motion.h2)`
  font-family: 'Orbitron', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #2EE5C4; /* Neon teal */
  margin-bottom: 1.5rem;
  text-align: center;
  text-shadow: 0 0 10px rgba(46, 229, 196, 0.4); /* Glow */

  @media (min-width: 640px) {
    font-size: 2.25rem;
  }
`;

const Input = styled(motion.input)`
  width: 100%;
  padding: 1rem;
  margin-bottom: 1.25rem;
  font-size: 1rem;
  background: rgba(30, 41, 59, 0.8); /* Dark slate */
  color: #D1D5DB; /* Light gray */
  border: 2px solid rgba(46, 229, 196, 0.3); /* Teal border */
  border-radius: 10px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  font-family: 'Inter', sans-serif;

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
  width: 100%;
  padding: 1rem;
  background: linear-gradient(90deg, #2EE5C4, #06B6D4); /* Teal to cyan */
  color: #D1D5DB; /* Light gray */
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 4px 16px rgba(46, 229, 196, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    background: linear-gradient(90deg, #A855F7, #7E22CE); /* Purple hover */
    box-shadow: 0 6px 20px rgba(168, 85, 247, 0.5);
  }

  &:focus {
    outline: 2px solid #2EE5C4;
    outline-offset: 2px;
  }

  &:disabled {
    background: linear-gradient(90deg, #4B5563, #6B7280);
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const ErrorText = styled(motion.p)`
  color: #F87171; /* Muted red */
  text-align: center;
  font-size: 0.95rem;
  margin-top: -0.75rem;
  margin-bottom: 1rem;
  font-family: 'Inter', sans-serif;
`;

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (auth.currentUser) router.push("/patient-dashboard");
  }, [router]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await axios.post("http://localhost:5000/api/users", { uid: user.uid, email: user.email });
      router.push("/patient-dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
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
          Create Your Account
        </Title>
        <form onSubmit={handleSignup}>
          <Input
            type="email"
            placeholder="Enter your email"
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
            placeholder="Create a password"
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
            disabled={loading}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? "Signing you up..." : "Sign Up"}
          </Button>
        </form>
      </Card>
    </Container>
  );
}