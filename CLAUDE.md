You are an expert full-stack developer. Help me build "InnovateFest" — a hackathon registration 
portal — as a complete project.

## Tech Stack
- Frontend: React (Vite) + Tailwind CSS
- Backend: Supabase (PostgreSQL + instant REST API + Realtime)
- Auth: Supabase Auth (for admin route)
- Hosting: Vercel (frontend)

---

## IMPORTANT: Before writing any code, output a complete SETUP GUIDE section first.
## This must be the very first thing you output. Be extremely beginner-friendly.
## Assume the reader has Node.js installed but has never used Supabase or Vercel before.

---

## SETUP GUIDE (Output this first, in full)

### Step 1: Create a Supabase Project
1. Go to https://supabase.com and click "Start your project"
2. Sign up or log in with GitHub
3. Click "New Project"
4. Fill in:
   - Organization: your username or create one
   - Project Name: innovatefest
   - Database Password: create a strong password (SAVE THIS SOMEWHERE)
   - Region: choose closest to you (e.g., South Asia → Singapore for India)
5. Click "Create new project" — wait ~2 minutes for it to spin up

### Step 2: Get Your Supabase Environment Variables
Once the project is ready:
1. In your Supabase dashboard, go to:
   Settings (gear icon, bottom left) → API
2. You will see two values you need:
   - "Project URL" → this is your VITE_SUPABASE_URL
   - "anon public" key → this is your VITE_SUPABASE_ANON_KEY
   ⚠️ Do NOT use the service_role key — never expose that on the frontend
3. Keep this tab open — you will need these values in Step 6 and Step 10

### Step 3: Set Up the Database Table
1. In Supabase dashboard, click "SQL Editor" in the left sidebar
2. Click "New Query"
3. Paste and run this SQL exactly:

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

4. Click "Run" — you should see "Success. No rows returned"
5. Go to "Table Editor" in the left sidebar to confirm the table was created

### Step 4: Create the Admin User
1. In Supabase dashboard, go to Authentication → Users (left sidebar)
2. Click "Add User" → "Create new user"
3. Enter:
   - Email: admin@innovatefest.com (or any email you prefer)
   - Password: choose a strong password and SAVE IT
4. Click "Create User"
5. This is the only login that will work at /admin/login in your app
   You do NOT store this in .env — Supabase Auth manages it securely

### Step 5: Scaffold the React Project
Run these commands one by one in your terminal:

npm create vite@latest innovatefest -- --template react
cd innovatefest
npm install
npm install @supabase/supabase-js
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install react-router-dom
npm install react-hot-toast

### Step 6: Create Your .env File
In the root of your project (same level as package.json),
create a file called exactly: .env

Paste this inside it:
  VITE_SUPABASE_URL=https://your-project-id.supabase.co
  VITE_SUPABASE_ANON_KEY=your-anon-key-here

Replace the values with the ones from Step 2.
⚠️ The variable names MUST start with VITE_ or Vite won't expose them to the app.

### Step 7: Configure Tailwind
In tailwind.config.js, set content to:
  content: ["./index.html", "./src/**/*.{js,jsx}"]

In src/index.css, replace everything with:
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

### Step 8: Add .env to .gitignore
Open .gitignore (Vite creates this automatically).
Make sure this line exists:
  .env
⚠️ NEVER push your .env file to GitHub. Your Supabase keys will be exposed.

### Step 9: Run the Project Locally
npm run dev
Open http://localhost:5173 in your browser.
Test registration and admin login before deploying.

---

### Step 10: Deploy to Vercel

#### 10a. Push Your Code to GitHub
1. Go to https://github.com and create a new repository
   - Name: innovatefest
   - Set to Public or Private (either works with Vercel)
   - Do NOT initialize with README (you already have one)
2. In your terminal, run:

git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/innovatefest.git
git push -u origin main

   Replace YOUR_USERNAME with your GitHub username.
   ⚠️ Double-check that .env is NOT in the push (check git status first)

#### 10b. Connect Vercel to GitHub
1. Go to https://vercel.com and sign up / log in with GitHub
2. Click "Add New Project"
3. Click "Import" next to your innovatefest repository
4. Vercel will auto-detect it as a Vite project
5. Under "Framework Preset" confirm it shows "Vite"
6. Leave Build Command as: npm run build
7. Leave Output Directory as: dist
8. DO NOT click Deploy yet — you must add env variables first

#### 10c. Add Environment Variables in Vercel
Still on the "Configure Project" screen:
1. Scroll down to "Environment Variables"
2. Add the first variable:
   - Name:  VITE_SUPABASE_URL
   - Value: https://your-project-id.supabase.co  (from Step 2)
   - Environment: check all three (Production, Preview, Development)
3. Click "Add"
4. Add the second variable:
   - Name:  VITE_SUPABASE_ANON_KEY
   - Value: your-anon-key-here  (from Step 2)
   - Environment: check all three
5. Click "Add"
⚠️ These replace your local .env on Vercel. Without them the app will crash.

#### 10d. Deploy
1. Click "Deploy"
2. Vercel will build your project (takes ~1 minute)
3. Once done, you'll get a live URL like:
   https://innovatefest.vercel.app
4. Open it and test registration end to end

#### 10e. Add Your Vercel URL to Supabase Allowed URLs (Important!)
Supabase restricts which URLs can use Auth. You must whitelist your Vercel URL:
1. In Supabase dashboard → Authentication → URL Configuration
2. Under "Site URL" set it to:
   https://innovatefest.vercel.app
3. Under "Redirect URLs" add:
   https://innovatefest.vercel.app/*
4. Click Save
Without this, admin login may fail on the live site even if it works locally.

#### 10f. Re-deploying After Changes
Whenever you push to GitHub main branch, Vercel auto-redeploys. Just:
git add .
git commit -m "your message"
git push

That's it — Vercel handles the rest automatically.

#### 10g. Custom Domain (Optional)
1. In Vercel dashboard → your project → Settings → Domains
2. Add your custom domain (e.g., innovatefest.com)
3. Follow Vercel's DNS instructions for your domain registrar

---

## Now, after the setup guide, generate all code files in this order:

1. src/lib/supabaseClient.js
2. src/hooks/useAuth.js
3. src/App.jsx
4. src/pages/Landing.jsx
5. src/components/Hero.jsx
6. src/components/About.jsx
7. src/components/Timeline.jsx
8. src/components/FAQ.jsx
9. src/components/Footer.jsx
10. src/pages/Register.jsx
11. src/components/RegistrationForm.jsx
12. src/components/TagInput.jsx
13. src/pages/AdminLogin.jsx
14. src/pages/Admin.jsx
15. src/components/AdminTable.jsx
16. README.md

---

## For each file output:
- Full file path as a header
- Complete working code
- Inline comments explaining WHY, not just what
- Note any common mistakes to avoid

---

## Database Schema (follow this exactly in code)

Table: registrations
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid()
  full_name     text NOT NULL
  email         text UNIQUE NOT NULL
  college       text NOT NULL
  year_of_study integer NOT NULL CHECK (year_of_study BETWEEN 1 AND 5)
  skills        text[] NOT NULL
  motivation    text NOT NULL CHECK (char_length(motivation) <= 500)
  status        text DEFAULT 'pending' CHECK (status IN ('pending','approved'))
  submitted_at  timestamptz DEFAULT now()

---

## Supabase Operations Reference (use these exact patterns in code)

// Initialize client
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// Insert registration
const { data, error } = await supabase
  .from('registrations')
  .insert([{ full_name, email, college, year_of_study, skills, motivation }])
// If error.code === '23505' → show "This email is already registered"

// Fetch all (admin)
const { data, error } = await supabase
  .from('registrations')
  .select('*')
  .order('submitted_at', { ascending: false })

// Update status
const { error } = await supabase
  .from('registrations')
  .update({ status: 'approved' })
  .eq('id', id)

// Delete
const { error } = await supabase
  .from('registrations')
  .delete()
  .eq('id', id)

// Admin login
const { error } = await supabase.auth.signInWithPassword({ email, password })

// Get session
const { data: { session } } = await supabase.auth.getSession()

// Logout
await supabase.auth.signOut()

// Realtime listener
supabase
  .channel('registrations-changes')
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'registrations' },
    (payload) => { /* prepend payload.new to local state */ }
  )
  .subscribe()

---

## Features to implement

### Landing Page (/)
- Hero: title, subtitle, "Register Now" button → /register
- About: event description
- Timeline: visual step-by-step event schedule
- FAQ: accordion (one open at a time)
- Fully responsive with Tailwind
- Smooth hover and transition animations

### Registration Form (/register)
- Fields: Full Name, Email, College, Year of Study (select 1–5),
  Skills (TagInput — type and press Enter or comma to add tags),
  Motivation (textarea with live 500 char countdown)
- Validation:
  - All fields required
  - Email regex check
  - Duplicate email → catch error.code 23505 → friendly message
  - Motivation ≤ 500 chars enforced in UI and DB
- Loading spinner on submit
- Success toast → redirect to /
- Error toast on failure

### Admin Login (/admin/login)
- Email + password form
- supabase.auth.signInWithPassword()
- Redirect to /admin on success
- Show friendly error on wrong credentials

### Admin Dashboard (/admin)
- Protected route: if no session → redirect to /admin/login
- Table: Name | Email | College | Year | Skills | Status | Date
- Client-side search: filter by name, college, or skills
- Sort toggle: by submitted_at or year_of_study (asc/desc)
- Total registration count badge
- Status toggle button: pending ↔ approved
- Delete with confirmation dialog
- Logout button
- Realtime: new registrations appear instantly without refresh
- Export to CSV (client-side, no library needed)
- Pagination: 10 rows per page with prev/next buttons

---

## README.md must include:
1. Project overview and live link placeholder
2. Full tech stack with reasons:
   - Supabase: no backend server needed, built-in auth, RLS, realtime, PostgreSQL
   - Vercel: zero-config deployment, auto-deploy on git push, free tier
3. Complete local setup steps (Steps 1–9 from setup guide above)
4. All environment variables listed and explained
5. SQL to recreate table and RLS policies (copy-paste ready)
6. How to create the admin user in Supabase
7. Vercel deployment steps (Steps 10a–10f from setup guide above)
8. Supabase allowed URL configuration (Step 10e)
9. Scalability notes:
   - Supabase handles connection pooling via pgBouncer
   - Use .range(from, to) for pagination instead of fetching all rows
   - Add indexes: CREATE INDEX ON registrations(email); and ON submitted_at
   - Promote to Supabase Edge Functions if business logic grows
   - Vercel scales automatically — no config needed
---

## Code Quality Rules (follow strictly):
- No inline styles — Tailwind classes only
- Reusable components — no copy-pasted JSX blocks
- Every async Supabase call wrapped in try/catch
- Loading and error states for EVERY async operation
- No hardcoded strings — use constants where repeated
- Clean, readable variable names
- No unused imports
- react-hot-toast for all user-facing notifications