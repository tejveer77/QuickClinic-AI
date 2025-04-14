"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styled from "styled-components";
import { motion } from "framer-motion";

const Container = styled.div`
  padding: 2rem 1.5rem;
  background: linear-gradient(180deg, #0F172A, #1E293B); /* Obsidian to slate blue */
  min-height: 100vh;
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

const Section = styled(motion.div)`
  background: rgba(15, 23, 42, 0.8); /* Glassy dark */
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3);
  max-width: 600px; /* Smaller for focus */
  margin: 2rem auto;
  border: 2px solid rgba(46, 229, 196, 0.3); /* Teal border */

  @media (max-width: 640px) {
    padding: 1.5rem;
  }
`;

const Header = styled(motion.h1)`
  font-family: 'Orbitron', sans-serif;
  font-size: 1.75rem;
  color: #2EE5C4; /* Neon teal */
  text-align: center;
  margin-bottom: 1.5rem;
  text-shadow: 0 0 10px rgba(46, 229, 196, 0.4); /* Glow */

  @media (min-width: 640px) {
    font-size: 2rem;
  }
`;

const Text = styled(motion.p)`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #D1D5DB; /* Light gray */
  margin-bottom: 0.75rem;

  strong {
    color: #2EE5C4; /* Teal for emphasis */
  }
`;

export default function DiagnosisResult() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const symptoms = searchParams.get("symptoms");
  const diagnosis = searchParams.get("diagnosis");

  useEffect(() => {
    if (!diagnosis) {
      router.push("/patient-dashboard");
    }
  }, [diagnosis, router]);

  return (
    <Container>
      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Header
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Diagnosis Result
        </Header>
        <Text
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <strong>Symptoms Provided:</strong> {symptoms || "Not provided"}
        </Text>
        <Text
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <strong>Possible Diagnosis:</strong> {diagnosis || "Not available"}
        </Text>
      </Section>
    </Container>
  );
}