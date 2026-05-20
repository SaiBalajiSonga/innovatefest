import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(' Supabase URL or Key missing in Vercel environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors({
  origin: '*', // In production, Vercel API and frontend are on the same domain anyway
  credentials: true
}));
app.use(express.json());

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

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/register', async (req, res) => {
  try {
    const { first_name, last_name, email, college, year_of_study, skills, motivation } = req.body;

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
    res.status(500).json({ error: 'Internal server error', details: error.message || error });
  }
});

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
    res.status(500).json({ error: 'Internal server error', details: error.message || error });
  }
});

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
    res.status(500).json({ error: 'Internal server error', details: error.message || error });
  }
});

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
    res.status(500).json({ error: 'Internal server error', details: error.message || error });
  }
});

app.delete('/api/registrations/:id', verifyAdmin, async (req, res) => {
  try {
    const { error } = await supabase
      .from('registrations')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Registration deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message || error });
  }
});

// Export the Express API
export default app;
