"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import axios from "axios";
import { auth } from "../../src/lib/firebase";

const Container = styled.div`
  min-height: calc(100vh - 120px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
`;

const Form = styled.form`
  max-width: 500px;
  margin: 0 auto;
  background: white;
  padding: 2rem;
  border-radius: 12px;
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
`;

export default function Prescriptions() {
  const [file, setFile] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const patientUid = auth.currentUser.uid;
    // Mock file upload (replace with real storage like Firebase Storage)
    const fileUrl = "mock-url.pdf";
    await axios.post("http://localhost:5000/api/prescriptions", { patientUid, fileUrl });
    alert("Prescription uploaded!");
    router.push("/patient-dashboard");
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Input type="file" onChange={(e) => setFile(e.target.files[0])} required />
        <Button type="submit">Upload Prescription</Button>
      </Form>
    </Container>
  );
}