# QuickClinic AI

A patient-focused healthcare app built with Next.js, Firebase, and MongoDB. Features an AI symptom checker, doctor list filtered by symptoms, appointment booking with email reminders, prescription uploads, and a video call mockup. Designed to streamline patient care with a modern, intuitive UI.

## Components

- **Signup (`/src/app/signup/page.js`)**  
  Registers patients using Firebase Authentication. Syncs user data (UID, email) to MongoDB with a fixed `patient` role.

- **Login (`/src/app/login/page.js`)**  
  Authenticates patients via Firebase. Auto-creates MongoDB entry if missing, then redirects to the dashboard.

- **Patient Dashboard (`/src/app/patient-dashboard/page.js`)**  
  Central hub for patients. Links to symptom checker, appointments, prescriptions, video calls, and logout. Displays a grid of interactive cards.

- **Doctor List (`/src/app/doctor-list/page.js`)**  
  Fetches and displays doctors from MongoDB based on symptoms entered in the checker. Includes a "Book" button for appointments.

- **Appointments (`/src/app/appointments/page.js`)**  
  Form to book appointments with a selected doctor. Stores details in MongoDB and sends an email reminder to the doctor.

- **Prescriptions (`/src/app/prescriptions/page.js`)**  
  Allows patients to upload prescription files (mock URL for now). Saves to MongoDB with patient UID and timestamp.

- **Video Call (`/src/app/video-call/page.js`)**  
  Placeholder for a video call feature with a doctor. Displays a mock screen; ready for Twilio/WebRTC integration.

- **Backend (`/backend/server.js`)**  
  Node.js/Express server with MongoDB integration. Handles user creation, doctor queries, appointment booking, prescription storage, and email notifications via Nodemailer.

## Routes

- **`/`**: Redirects to `/login` (default landing).
- **`/signup`**: Patient signup page.
- **`/login`**: Patient login page.
- **`/patient-dashboard`**: Main patient interface, protected route.
- **`/doctor-list?symptoms=<query>`**: Lists doctors matching symptoms.
- **`/appointments?doctorId=<id>`**: Appointment booking form.
- **`/prescriptions`**: Prescription upload page.
- **`/video-call`**: Video call mockup.

**API Routes (Backend)**:
- `GET /api/test`: Health check.
- `POST /api/users`: Creates a patient in MongoDB.
- `GET /api/users/:uid`: Fetches patient role.
- `GET /api/doctors?symptoms=<query>`: Returns doctors by symptom.
- `POST /api/appointments`: Books an appointment and sends email.
- `POST /api/prescriptions`: Stores prescription data.

## State Management

- **React Hooks**:  
  - `useState`: Manages local component state (e.g., form inputs like email, password, symptoms, etc.).
  - `useEffect`: Handles side effects (e.g., redirecting on auth state change, fetching doctors on mount).
  - Example: In `patient-dashboard`, `useState` tracks `symptoms`, while `useEffect` checks auth status.

- **Firebase Auth**:  
  - Global auth state via `auth.currentUser`. Used across components to protect routes and fetch patient UID.

- **URL Params**:  
  - `useSearchParams` from `next/navigation` passes data between pages (e.g., `symptoms` to `doctor-list`, `doctorId` to `appointments`).

- **No Redux/Context**:  
  - App is lightweight, so state stays local to components or URL params. Scalable to Context API if needed for global patient data later.