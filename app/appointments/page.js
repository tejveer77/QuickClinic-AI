"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
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
`;

export default function Appointments() {
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedDoctorId = searchParams.get("doctorId");

  useEffect(() => {
    const fetchDoctors = async () => {
      const response = await axios.get("http://localhost:5000/api/doctors");
      setDoctors(response.data);
      if (preselectedDoctorId) setDoctorId(preselectedDoctorId);
    };
    fetchDoctors();
  }, [preselectedDoctorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const patientUid = auth.currentUser.uid;
    await axios.post("http://localhost:5000/api/appointments", {
      patientUid,
      doctorId,
      date,
      time,
    });
    alert("Appointment booked! Email and SMS sent to doctor.");
    router.push("/patient-dashboard");
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} required>
          <option value="">Select a Doctor</option>
          {doctors.map((doc) => (
            <option key={doc._id} value={doc._id}>
              {doc.name} - {doc.specialties}
            </option>
          ))}
        </Select>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <Input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
        <Button type="submit">Book Appointment</Button>
      </Form>
    </Container>
  );
}