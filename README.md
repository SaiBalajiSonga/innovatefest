# InnovateFest 2026

A complete, production-ready hackathon registration portal with a public-facing landing page, a secure registration flow, and a protected admin dashboard.

**Live Demo:** https://innovatefest.vercel.app/

### 🔑 Admin Portal Access (For Evaluators)
- **URL:** [https://innovatefest.vercel.app/admin](https://innovatefest.vercel.app/admin)
- **Email:** `admin@innovatefest.com`
- **Password:** `Admin@123`

---

## Tech Stack

- **Frontend:** React (Vite) + Tailwind CSS
  - *Why Vite?* Much faster HMR and build times than Create React App.
  - *Why Tailwind?* Rapid styling without switching between CSS files, highly customizable, and tree-shakes unused styles for a tiny production bundle.
- **Backend API:** Node.js + Express (Local) & Vercel Serverless Functions
  - *Why Express / Serverless?* It's lightweight, unopinionated, and perfectly suited for building simple RESTful APIs quickly. In production, Vercel seamlessly serves the API via serverless functions.
- **Database:** Supabase (PostgreSQL)
  - *Why SQL (PostgreSQL)?* Registration data is highly structured (users have distinct properties like name, email, college) and SQL enforces a strict schema ensuring data integrity. It's also ideal for preventing duplicate registrations (via UNIQUE constraints) out of the box, unlike NoSQL which typically requires manual indexing/checks.
- **Authentication:** Supabase Auth (JWT)
  - *Why?* Built-in, secure, and seamlessly integrates with Row Level Security (RLS) policies.
- **Realtime:** Supabase Realtime
  - *Why?* Allows the admin dashboard to update instantly when a new registration is submitted.

---

## Edge Cases & Requirement Fulfillment

As per the project requirements, this application robustly handles edge cases, data validation, and security:

- **Duplicate Registrations:** The PostgreSQL database enforces a strict `UNIQUE` constraint on the `email` column. If a user attempts to register with an already registered email, the API catches the specific Postgres error code (`23505`) and gracefully returns a `409 Conflict` status with a user-friendly error message, completely preventing duplicate sign-ups.
- **Data Validation:** 
  - **Frontend:** The React form enforces required fields and proper email formatting before a network request is even made.
  - **Backend:** The serverless API strictly validates the incoming payload. If any required field is missing, it instantly returns a `400 Bad Request`. It also enforces a strict character limit check on the `motivation` field (must be between 50 and 500 characters).
- **Security & Authorization (RLS):** Supabase Row-Level Security (RLS) is configured to allow anyone to `INSERT` a registration, but it strictly requires a verified `authenticated` admin JWT token to `SELECT`, `UPDATE`, or `DELETE` any records. This completely isolates user data and prevents any participant from querying other people's data.
- **Admin Search & Sorting:** The dashboard securely fetches all registrations and implements comprehensive filtering (by name, college, skills) and sorting (by submission time) directly on the client side, fulfilling all dashboard management requirements.

---

## Local Setup Guide

Follow these steps to run the project locally.

### Step 1: Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and click "Start your project".
2. Sign up or log in with GitHub.
3. Click "New Project" and fill in:
   - **Organization:** your username or create one.
   - **Project Name:** `innovatefest`.
   - **Database Password:** Create a strong password (and save it somewhere secure).
   - **Region:** Choose the closest to you.
4. Click "Create new project" and wait ~2 minutes for the database to provision.

### Step 2: Get Your Environment Variables
Once the project is ready:
1. Go to **Settings (gear icon)** → **API**.
2. Locate the following three values:
   - **Project URL** (This is your `VITE_SUPABASE_URL`)
   - **anon public key** (This is your `VITE_SUPABASE_ANON_KEY`)
   - **service_role secret** (This is your `SUPABASE_SERVICE_KEY`)
   > ⚠️ **IMPORTANT:** Never expose the `service_role` key to the frontend (do not prefix it with `VITE_`). It must only be used in the backend/serverless environment.

### Step 3: Set Up the Database Table
1. In the Supabase dashboard, go to the **SQL Editor** (left sidebar).
2. Click **New Query** and paste the following SQL exactly as written:

```sql
-- Create the registrations table
CREATE TABLE registrations (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name     text NOT NULL,
  email         text UNIQUE NOT NULL,
  college       text NOT NULL,
  year_of_study text NOT NULL,
  skills        text[] NOT NULL,
  motivation    text NOT NULL CHECK (char_length(motivation) <= 500),
  status        text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at  timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Allow anyone (anon) to insert (public registration)
CREATE POLICY "Allow public registration"
  ON registrations FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow only logged-in admin to read all registrations
CREATE POLICY "Allow admin to read"
  ON registrations FOR SELECT
  TO authenticated
  USING (true);

-- Allow only logged-in admin to update (e.g., change status)
CREATE POLICY "Allow admin to update"
  ON registrations FOR UPDATE
  TO authenticated
  USING (true);

-- Allow only logged-in admin to delete
CREATE POLICY "Allow admin to delete"
  ON registrations FOR DELETE
  TO authenticated
  USING (true);
```
3. Click **Run**. You should see a success message. (Verify by checking the "Table Editor").

### Step 4: Create the Admin User
1. In the Supabase dashboard, go to **Authentication** → **Users**.
2. Click **Add User** → **Create new user**.
3. Enter:
   - **Email:** your preferred admin email
   - **Password:** choose a strong password
4. Click **Create User**.
   > *Note: This is the only login that will work at `/admin/login`.

### Step 5: Install Dependencies
Clone this repository and install the dependencies:
```bash
npm install
```

### Step 6: Create Your `.env` Files
In the root directory of the frontend project, create a file named `.env`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_API_URL=http://localhost:5000/api
```

In the `backend/` directory, create another `.env` file:
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here
SUPABASE_ANON_KEY=your-anon-key-here
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### Step 7: Run the App
Start both the Vite development server and the Express backend simultaneously:
```bash
npm run dev
```
- Frontend runs on `http://localhost:5173`
- Backend API runs on `http://localhost:5000`

Test registering a user and logging into the admin dashboard at `/admin/login`.

---

## Deployment (Vercel)

### Step 1: Push Your Code to GitHub
1. Create a new repository on GitHub (do NOT initialize it with a README).
2. Push your local code to the repository:
```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/innovatefest.git
git push -u origin main
```
> ⚠️ **Ensure `.env` is NOT pushed to GitHub.** (It should already be in `.gitignore`).

### Step 2: Connect to Vercel
1. Go to [https://vercel.com](https://vercel.com) and log in with GitHub.
2. Click **Add New Project** and import your `innovatefest` repository.
3. Vercel will automatically detect it as a Vite project.

### Step 3: Add Environment Variables
Before clicking "Deploy", expand the **Environment Variables** section and add:
- `VITE_SUPABASE_URL` = `https://your-project-id.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = `your-anon-key-here`
- `SUPABASE_SERVICE_KEY` = `your-service-role-key-here` (Required for the Vercel serverless API backend to securely bypass RLS for admin tasks)

### Step 4: Deploy
Click **Deploy**. Once finished, Vercel will provide a live URL (e.g., `https://innovatefest.vercel.app`).

### Step 5: Supabase Allowed URLs Configuration (Critical!)
Supabase Auth restricts login to specific domains to prevent spoofing. You must whitelist your Vercel URL.
1. In the Supabase dashboard, go to **Authentication** → **URL Configuration**.
2. Under **Site URL**, enter your Vercel URL: `https://innovatefest.vercel.app`
3. Under **Redirect URLs**, add a wildcard URL: `https://innovatefest.vercel.app/*`
4. Click **Save**. If you skip this, the admin login will silently fail on the production site.

---

## Scalability & Database Schema

Our database uses PostgreSQL (via Supabase). The strict relational structure is perfect for managing structured application data.

**Why SQL over NoSQL?**
- Hackathon registrations require strict data integrity. A `UNIQUE` constraint on the email column instantly prevents duplicate signups without any complex application logic.
- SQL queries easily allow for sorting and aggregation, which are heavily used in the admin dashboard.

**Scaling for Thousands of Users & Concurrent Admins:**
- **Connection Pooling:** Supabase handles connection pooling automatically via pgBouncer, managing thousands of concurrent database connections seamlessly.
- **Pagination & Search Strategy:** The admin table currently fetches up to 500 rows upfront and performs pagination and searching in-memory on the client side. For >10,000 rows, this should be transitioned to server-side pagination (adding `limit` and `offset` to our Express API) and `ilike` queries in Postgres.
- **Indexing:** If queries slow down as data grows, add indexes in PostgreSQL:
  ```sql
  CREATE INDEX idx_registrations_email ON registrations(email);
  CREATE INDEX idx_registrations_status ON registrations(status);
  ```

---

## API Documentation

The backend is built with Express.js and is mounted at `/api`.

- **`POST /api/register`**
  - **Description:** Submits a new participant application.
  - **Body:** `{ first_name, last_name, email, college, year_of_study, skills, motivation }`
  - **Response (201):** `{ message: 'Registration successful', data: { ... } }`
  - **Error (409):** `{ error: 'This email is already registered.' }`

- **`GET /api/registrations`** (Requires Admin Auth)
  - **Description:** Fetches a list of all registrations.
  - **Headers:** `Authorization: Bearer <JWT>`
  - **Response (200):** `[ { id, full_name, email, status, ... }, ... ]`

- **`GET /api/registrations/:id`** (Requires Admin Auth)
  - **Description:** Fetches details for a single registration.

- **`PATCH /api/registrations/:id/status`** (Requires Admin Auth)
  - **Description:** Updates the status of an application.
  - **Body:** `{ status: 'approved' | 'pending' | 'rejected' }`

- **`DELETE /api/registrations/:id`** (Requires Admin Auth)
  - **Description:** Permanently deletes a registration.

---

## SMP Web Nominee - Question 2: Initiatives

### Initiative 1: Transitioning from a Static Wiki to an Interactive Mentorship Portal ("SMP Connect")

**The Gap:**
Currently, the SMP website is entirely static. Mentorship matching, communication logs, and coordinator tracking happen on external, fragmented channels like WhatsApp, Google Sheets, and Forms. This lack of centralized data makes it hard for coordinators to track which freshmen have fallen out of touch with their mentors.

**The Proposal:**
Integrate an interactive, SSO-authenticated (IITB LDAP) user portal directly into the SMP website with three specialized dashboards:
- **Mentee Dashboard:** Allows freshmen to view their assigned mentor's bio, contact info, and specializations. It features a simple "Log a Meeting" tool and a "Request Intervention" button if a mentee needs a new mentor or wants to connect with the Student Wellness Centre (SWC).
- **Mentor Dashboard:** A panel for mentors to check in on their mentees, schedule regular 1-on-1s, and update their own profiles with academic/career interest tags (e.g., Core Research, SDE Prep, Quant Finance).
- **Coordinator/Admin Dashboard:** Offers a real-time analytics suite showing mentorship activity. It flags "inactive" mentorship pairs (e.g., no meetups logged for 4+ weeks) so coordinators can intervene proactively before a student slips through the cracks.

---

### Initiative 2: The "Pulse Check" – Lightweight Student Wellness & Academic Tracker

**What the initiative is:**
I propose transitioning the SMP portal from a static information hub into a proactive care ecosystem by introducing a highly secure, bi-weekly "Pulse Check" system. Every two weeks, freshmen will receive an automated link to log into the portal (via IITB SSO) and answer a rapid 3-question survey. They will rate their academic comfort, social integration, and overall stress levels on a 1-5 scale, with an optional text box for specific concerns. 

**What problem it aims to solve:**
At IIT Bombay, freshmen often experience severe imposter syndrome, academic burnout, or homesickness. However, due to social friction, intimidation, or fear of judgment, they rarely reach out to their direct mentors or the Student Wellness Centre (SWC) until a crisis occurs. The current website acts only as an informational brochure; it offers no digital lifeline or early-warning mechanism for students suffering in silence.

**How it benefits SMP & Students:**
- **For Students:** It dramatically lowers the friction required to ask for help. A student who might hesitate to draft a formal email or WhatsApp message is far more likely to select a "5/5 Stress Level" on a frictionless, private web form.
- **For SMP & IITB:** It acts as an automated early warning system. Rather than reacting to problems post-midsems, SMP coordinators and counselors can proactively identify and reach out to struggling students. 

**Implementation Approach:**
1. **Frontend (React/Next.js):** Build a mobile-friendly, non-intrusive survey UI integrated directly into the `smp.gymkhana.iitb.ac.in` domain.
2. **Backend & Security (Node.js/Express + Postgres):** Strict data privacy is paramount. Survey responses will be securely stored.
3. **Automated Alerts:** Implement backend triggers (e.g., via NodeMailer or SendGrid) that securely alert the SMP Core team and the assigned mentor *only* if a student flags high distress or logs a drastic negative trend over consecutive weeks.
4. **Analytics Dashboard:** Build a restricted-access dashboard for the Core Team to view macro-level analytics (e.g., "Hostel 15 is reporting 40% higher academic stress this week"), allowing SMP to organize targeted stress-relief events or academic workshops where they are needed most.


