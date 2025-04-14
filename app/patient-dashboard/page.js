"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { motion } from "framer-motion";
import { signOut } from "firebase/auth";
import { auth } from "../../src/lib/firebase";
import axios from "axios";

const Container = styled.div`
  min-height: calc(100vh - 120px);
  background: linear-gradient(180deg, #0F172A, #1E293B); /* Obsidian to slate blue */
  padding: 2rem 1.5rem;
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

const Header = styled(motion.h1)`
  font-family: 'Orbitron', sans-serif;
  font-size: 2.25rem;
  color: #2EE5C4; /* Neon teal */
  text-align: center;
  margin-bottom: 2.5rem;
  text-shadow: 0 0 10px rgba(46, 229, 196, 0.4); /* Glow */

  @media (min-width: 640px) {
    font-size: 2.75rem;
  }
`;

const CardContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 cards per row */
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Stack on mobile */
  }
`;

const Card = styled(motion.div)`
  background: rgba(15, 23, 42, 0.8); /* Glassy dark */
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3);
  border: ${(props) => (props.hero ? "2px solid rgba(46, 229, 196, 0.5)" : "1px solid rgba(46, 229, 196, 0.2)")}; /* Bolder for hero */
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 32px rgba(46, 229, 196, 0.4);
  }

  @media (max-width: 640px) {
    padding: 1.25rem;
  }
`;

const CardTitle = styled.h2`
  font-family: 'Inter', sans-serif;
  font-size: 1.25rem;
  color: #D1D5DB; /* Light gray */
  margin-bottom: 1rem;
`;

const Input = styled(motion.input)`
  width: 100%;
  padding: 0.75rem;
  background: rgba(30, 41, 59, 0.8); /* Dark slate */
  color: #D1D5DB;
  border: 2px solid rgba(46, 229, 196, 0.3); /* Teal border */
  border-radius: 8px;
  margin-bottom: 1rem;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
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
  padding: 0.75rem 1.5rem;
  background: linear-gradient(90deg, #2EE5C4, #06B6D4); /* Teal to cyan */
  color: #D1D5DB;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  width: 100%;
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

const DiagnosisText = styled(motion.p)`
  color: #D1D5DB;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  margin-top: 1rem;
`;

export default function PatientDashboard() {
  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) router.push("/login");
    setLoading(false);
  }, [router]);

  const handleSymptomCheck = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/symptom-checker", { symptoms });
      const suggestion = response.data.diagnosis;
      setDiagnosis(suggestion);
      router.push(`/diagnosis-result?symptoms=${encodeURIComponent(symptoms)}&diagnosis=${encodeURIComponent(suggestion)}`);
    } catch (error) {
      alert("Error checking symptoms: " + error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const handleAppointments = () => {
    router.push("/my-appointments");
  };

  if (loading) {
    return (
      <Container>
        <Header>Loading...</Header>
      </Container>
    );
  }

  return (
    <Container>
      <Header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Welcome, Patient!
      </Header>
      <CardContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Row 1 */}
        <Card
          hero
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <CardTitle>AI Symptom Checker</CardTitle>
          <Input
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Enter symptoms (e.g., fever, cough)"
            aria-label="Enter symptoms for AI checker"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileFocus={{ scale: 1.02 }}
          />
          <Button
            onClick={handleSymptomCheck}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Check Symptoms
          </Button>
          {diagnosis && (
            <DiagnosisText
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              Possible Diagnosis: {diagnosis}
            </DiagnosisText>
          )}
        </Card>

        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <CardTitle>Search Doctors</CardTitle>
          <Button
            onClick={() => router.push("/search-doctors")}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Search Now
          </Button>
        </Card>

        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <CardTitle>My Appointments</CardTitle>
          <Button
            onClick={handleAppointments}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Appointments
          </Button>
        </Card>

        {/* Row 2 */}
        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <CardTitle>Upload Prescription</CardTitle>
          <Button
            onClick={() => router.push("/prescriptions")}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Upload
          </Button>
        </Card>

        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <CardTitle>Video Call</CardTitle>
          <Button
            onClick={() => router.push("/video-call")}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Call
          </Button>
        </Card>

        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <CardTitle>Logout</CardTitle>
          <Button
            onClick={handleLogout}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Log Out
          </Button>
        </Card>
      </CardContainer>
    </Container>
  );
}