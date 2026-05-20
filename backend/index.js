import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { createClient } from '@supabase/supabase-js';

import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../.env.local') });
dotenv.config(); // Also load backend/.env if it exists

const app = express();
const PORT = process.env.PORT || 5000;

// Supabase client setup (using Service Role key if available, otherwise Anon key)
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(' Supabase URL or Key missing in backend environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev')); // Logging

// --- Middleware: Verify Admin Token ---
const verifyAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: 'Unauthorized', details: error?.message });
  }

  // Secure Role Validation: Verify role inside app_metadata (only server-writable) to prevent client-side self-promotion
  if (user.app_metadata?.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }

  req.user = user;
  next();
};

// --- Routes ---

// @route   GET /api/health
// @desc    Check server health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// @route   POST /api/register
// @desc    Register a new participant
app.post('/api/register', async (req, res) => {
  try {
    const { first_name, last_name, email, college, year_of_study, skills, motivation } = req.body;

    // Basic Server-Side Validation
    if (!first_name || !email || !college || !year_of_study || !skills || !motivation) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (motivation.length < 50 || motivation.length > 500) {
      return res.status(400).json({ error: 'Motivation must be between 50 and 500 characters' });
    }

    const full_name = `${first_name.trim()} ${last_name?.trim() || ''}`.trim();

    const { data, error } = await supabase.from('registrations').insert([{
      full_name,
      email,
      college,
      year_of_study,
      skills,
      motivation
    }]).select().single();

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'This email is already registered.' });
      }
      throw error;
    }

    res.status(201).json({ message: 'Registration successful', data });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   GET /api/registrations
// @desc    Get all registrations (Admin only)
app.get('/api/registrations', verifyAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .order('submitted_at', { ascending: false })
      .limit(500);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Fetch Registrations Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   GET /api/registrations/:id
// @desc    Get single registration by ID (Admin only)
app.get('/api/registrations/:id', verifyAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Registration not found' });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   PATCH /api/registrations/:id/status
// @desc    Update registration status (Admin only)
app.patch('/api/registrations/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const { data, error } = await supabase
      .from('registrations')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   DELETE /api/registrations/:id
// @desc    Delete a registration (Admin only)
app.delete('/api/registrations/:id', verifyAdmin, async (req, res) => {
  try {
    const { error } = await supabase
      .from('registrations')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Registration deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
