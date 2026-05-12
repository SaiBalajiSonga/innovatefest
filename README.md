# InnovateFest 2025

A complete, production-ready hackathon registration portal with a public-facing landing page, a secure registration flow, and a protected admin dashboard.

**Live Demo:** [https://innovatefest.vercel.app](#) *(Placeholder: Update with your Vercel URL)*

---

## Tech Stack

- **Frontend:** React (Vite) + Tailwind CSS
  - *Why Vite?* Much faster HMR and build times than Create React App.
  - *Why Tailwind?* Rapid styling without switching between CSS files, highly customizable, and tree-shakes unused styles for a tiny production bundle.
- **Backend / Database:** Supabase (PostgreSQL + REST API)
  - *Why Supabase?* Eliminates the need to write and host a custom Node.js/Express server. Gives us a robust PostgreSQL database with an instant, secure REST API.
- **Authentication:** Supabase Auth
  - *Why?* Built-in, secure, and seamlessly integrates with Row Level Security (RLS) policies.
- **Realtime:** Supabase Realtime
  - *Why?* Allows the admin dashboard to update instantly when a new registration is submitted without polling or manual refreshes.
- **Hosting:** Vercel
  - *Why?* Zero-configuration deployment for Vite/React apps, automatic CI/CD on git push, and a generous free tier.

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
2. Locate the following two values:
   - **Project URL** (This is your `VITE_SUPABASE_URL`)
   - **anon public key** (This is your `VITE_SUPABASE_ANON_KEY`)
   > ⚠️ **IMPORTANT:** Do NOT use the `service_role` key. Never expose the service role key to the frontend.

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
  year_of_study integer NOT NULL CHECK (year_of_study BETWEEN 1 AND 5),
  skills        text[] NOT NULL,
  motivation    text NOT NULL CHECK (char_length(motivation) <= 500),
  status        text DEFAULT 'pending' CHECK (status IN ('pending', 'approved')),
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
   - **Email:** `admin@innovatefest.com` (or your preferred admin email)
   - **Password:** Choose a strong password and save it.
4. Click **Create User**.
   > *Note: This is the only login that will work at `/admin/login`.*

### Step 5: Install Dependencies
Clone this repository and install the dependencies:
```bash
npm install
```

### Step 6: Create Your `.env` File
In the root directory of the project, create a file named exactly `.env`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
Replace the placeholder values with the keys you retrieved in Step 2.

### Step 7: Run the App
Start the Vite development server:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser. Test registering a user and logging into the admin dashboard at `/admin/login`.

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

### Step 4: Deploy
Click **Deploy**. Once finished, Vercel will provide a live URL (e.g., `https://innovatefest.vercel.app`).

### Step 5: Supabase Allowed URLs Configuration (Critical!)
Supabase Auth restricts login to specific domains to prevent spoofing. You must whitelist your Vercel URL.
1. In the Supabase dashboard, go to **Authentication** → **URL Configuration**.
2. Under **Site URL**, enter your Vercel URL: `https://innovatefest.vercel.app`
3. Under **Redirect URLs**, add a wildcard URL: `https://innovatefest.vercel.app/*`
4. Click **Save**. If you skip this, the admin login will silently fail on the production site.

---

## Scalability Notes

While this project is designed for a hackathon of ~500-1000 participants, it can easily scale:
- **Connection Pooling:** Supabase handles connection pooling automatically via pgBouncer, managing thousands of concurrent database connections seamlessly.
- **Pagination Strategy:** The admin table currently fetches all rows and paginates on the client. For >10,000 rows, switch to server-side pagination using Supabase's `.range(from, to)` method to minimize payload size.
- **Indexing:** If queries slow down as data grows, add indexes in PostgreSQL:
  ```sql
  CREATE INDEX idx_registrations_email ON registrations(email);
  CREATE INDEX idx_registrations_submitted_at ON registrations(submitted_at DESC);
  ```
- **Business Logic:** If complex validation or email sending (e.g., sending a confirmation email upon registration) is required later, you can implement [Supabase Edge Functions](https://supabase.com/docs/guides/functions) instead of adding a full backend server.
