"use client";
import styled from "styled-components";
import { motion } from "framer-motion";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 120px);
  background: linear-gradient(180deg, #0F172A, #1E293B); /* Obsidian to slate blue */
  text-align: center;
  padding: 2rem 1.5rem;
  position: relative;
  overflow: hidden;

  /* Glassy futuristic overlay */
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(15, 23, 42, 0.7); /* Dark glass */
    backdrop-filter: blur(12px);
    z-index: -1;
  }

  @media (min-width: 640px) {
    padding: 3rem 2rem;
  }
`;

const Title = styled(motion.h1)`
  font-family: 'Orbitron', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: #2EE5C4; /* Neon teal */
  margin-bottom: 1rem;
  text-shadow: 0 0 12px rgba(46, 229, 196, 0.5); /* Glow effect */
  letter-spacing: 0.03em;

  @media (min-width: 640px) {
    font-size: 3.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-family: 'Inter', sans-serif;
  font-size: 1.125rem;
  color: #D1D5DB; /* Light gray */
  max-width: 700px;
  margin-bottom: 2.5rem;
  line-height: 1.8;

  @media (min-width: 640px) {
    font-size: 1.25rem;
  }
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const Button = styled(motion.a)`
  padding: 0.875rem 2rem;
  background: ${(props) =>
    props.primary
      ? "linear-gradient(90deg, #2EE5C4, #06B6D4)" /* Teal to cyan */
      : "linear-gradient(90deg, #1E293B, #0F172A)" /* Slate to obsidian */};
  color: #D1D5DB; /* Light gray */
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 10px;
  border: 1px solid rgba(46, 229, 196, 0.3); /* Subtle teal border */
  text-decoration: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  cursor: pointer;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(46, 229, 196, 0.5); /* Neon teal glow */
    background: ${(props) =>
      props.primary
        ? "linear-gradient(90deg, #A855F7, #7E22CE)" /* Purple hover */
        : "linear-gradient(90deg, #0F172A, #1E293B)"};
    border-color: #A855F7; /* Purple border */
  }

  &:focus {
    outline: 2px solid #2EE5C4;
    outline-offset: 2px;
  }

  @media (max-width: 640px) {
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
  }
`;

export default function Home() {
  return (
    <Container>
      <Title
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        Welcome to QuickClinic AI
      </Title>
      <Subtitle
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        Your smart healthcare companion. Book appointments, analyze symptoms, and consult with doctors—all in one place.
      </Subtitle>
      <ButtonGroup
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        <Button
          href="/signup"
          primary
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          aria-label="Get started with QuickClinic AI"
        >
          Get Started
        </Button>
        <Button
          href="/login"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          aria-label="Log in to QuickClinic AI"
        >
          Log In
        </Button>
      </ButtonGroup>
    </Container>
  );
}