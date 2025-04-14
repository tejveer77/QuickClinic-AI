"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { motion } from "framer-motion";
import axios from "axios";

const Container = styled.div`
  min-height: 100vh;
  padding: 2rem 1.5rem;
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
    padding: 3rem 2rem;
  }
`;

const Card = styled(motion.div)`
  background: rgba(15, 23, 42, 0.8); /* Glassy dark */
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 500px;
  border: 2px solid rgba(46, 229, 196, 0.3); /* Teal border */
  text-align: center;

  @media (max-width: 640px) {
    padding: 1.5rem;
  }
`;

const Header = styled(motion.h2)`
  font-family: 'Orbitron', sans-serif;
  font-size: 1.75rem;
  color: #2EE5C4; /* Neon teal */
  margin-bottom: 1.5rem;
  text-shadow: 0 0 10px rgba(46, 229, 196, 0.4); /* Glow */

  @media (min-width: 640px) {
    font-size: 2rem;
  }
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(90deg, #2EE5C4, #06B6D4); /* Teal to cyan */
  color: #D1D5DB; /* Light gray */
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 600;
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

  &:disabled {
    background: #4B5563; /* Grayed out */
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const StatusText = styled(motion.p)`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #D1D5DB; /* Light gray */
  margin-top: 1rem;

  &.creating {
    color: #2EE5C4; /* Neon teal for progress */
  }

  &.error {
    color: #F87171; /* Muted red for errors */
  }
`;

const Spinner = styled(motion.div)`
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  border: 3px solid rgba(46, 229, 196, 0.3);
  border-top-color: #2EE5C4;
  border-radius: 50%;
  margin-right: 0.5rem;
`;

export default function VideoCall() {
  const [callStatus, setCallStatus] = useState("Waiting to start video call...");
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const handleVideoCall = async () => {
    try {
      setIsCreating(true);
      setCallStatus("Creating meeting...");
      const res = await axios.post("http://localhost:5000/api/create-daily-meeting");
      const link = res.data.link;
      setCallStatus("Meeting created. Redirecting...");
      window.open(link, "_blank");
      setTimeout(() => {
        setCallStatus("Waiting to start video call...");
        setIsCreating(false);
      }, 2000);
    } catch (err) {
      console.error("Meeting error:", err.message);
      setCallStatus("Failed to create video call.");
      setIsCreating(false);
    }
  };

  return (
    <Container>
      <Card
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Header
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Start Video Call
        </Header>
        <Button
          onClick={handleVideoCall}
          disabled={isCreating}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: isCreating ? 1 : 1.05 }}
          whileTap={{ scale: isCreating ? 1 : 0.95 }}
          aria-label="Create video call"
        >
          Create Call
        </Button>
        <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginTop: "1rem",
    justifyContent: "center"
  }}
>
  <StatusText
    as="span" 
    className={
      callStatus.includes("Creating") || callStatus.includes("Redirecting")
        ? "creating"
        : callStatus.includes("Failed")
        ? "error"
        : ""
    }
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5, delay: 0.3 }}
  >
    {callStatus}
  </StatusText>

  {callStatus.includes("Creating") && (
    <Spinner
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  )}
</div>

       
      </Card>
    </Container>
  );
}