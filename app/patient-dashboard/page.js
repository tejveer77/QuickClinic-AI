"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { signOut } from "firebase/auth";
import { auth } from "../../src/lib/firebase";
import axios from "axios";

const Container = styled.div`
  min-height: calc(100vh - 120px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
`;

const Header = styled.h1`
  font-size: 2.5rem;
  color: #1e3a8a;
  text-align: center;
  margin-bottom: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  color: #1e3a8a;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background-color: #059669;
  }
`;

export default function PatientDashboard() {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) router.push("/login");
    setLoading(false);
  }, [router]);

  const handleSymptomCheck = async () => {
    // Placeholder for AI API (e.g., OpenAI or custom model)
    alert(`AI analyzing: ${symptoms}. Suggested disease: Flu (coming soon!)`);
    router.push(`/doctor-list?symptoms=${encodeURIComponent(symptoms)}`);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (loading) return <Container>Loading...</Container>;

  return (
    <Container>
      <Header>Welcome, Patient!</Header>
      <Grid>
        <Card>
          <CardTitle>AI Symptom Checker</CardTitle>
          <Input
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Enter symptoms (e.g., fever, cough)"
          />
          <Button onClick={handleSymptomCheck}>Check Symptoms</Button>
        </Card>
        <Card>
          <CardTitle>Book Appointment</CardTitle>
          <Button onClick={() => router.push("/appointments")}>Book Now</Button>
        </Card>
        <Card>
          <CardTitle>Upload Prescription</CardTitle>
          <Button onClick={() => router.push("/prescriptions")}>Upload</Button>
        </Card>
        <Card>
          <CardTitle>Video Call</CardTitle>
          <Button onClick={() => router.push("/video-call")}>Start Call</Button>
        </Card>
        <Card>
          <CardTitle>Logout</CardTitle>
          <Button onClick={handleLogout}>Log Out</Button>
        </Card>
      </Grid>
    </Container>
  );
}