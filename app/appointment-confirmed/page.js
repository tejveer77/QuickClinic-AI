"use client";

import { useRouter } from "next/navigation";
import styled from "styled-components";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0fdf4;
  padding: 2rem;
`;

const Card = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  max-width: 500px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
`;

const Button = styled.button`
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: #1d4ed8;
  color: white;
  border: none;
  border-radius: 8px;
`;

export default function AppointmentConfirmed() {
  const router = useRouter();

  return (
    <Container>
      <Card>
        <h2>✅ Appointment Confirmed!</h2>
        <p>You will receive an email & SMS with the details.</p>
        <Button onClick={() => router.push("/patient-dashboard")}>Go to Dashboard</Button>
      </Card>
    </Container>
  );
}
