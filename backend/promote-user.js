import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '../.env.local') });
dotenv.config(); // Load local backend/.env if it exists

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('\x1b[31mError: SUPABASE_URL or SUPABASE_SERVICE_KEY (service_role key) is missing in environment variables.\x1b[0m');
  console.log('Please ensure they are defined in either the root `.env.local` or `backend/.env` file.');
  process.exit(1);
}

// Initialise Supabase client using the Service Role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const main = async () => {
  const email = process.argv[2];
  if (!email) {
    console.log('\x1b[33mUsage: node promote-user.js <email>\x1b[0m');
    console.log('Example: node promote-user.js admin@innovatefest.com');
    process.exit(1);
  }

  const normalizedEmail = email.trim().toLowerCase();
  console.log(`\x1b[36mConnecting to Supabase at: ${supabaseUrl}...\x1b[0m`);
  console.log(`\x1b[36mSearching for user with email: "${normalizedEmail}"...\x1b[0m`);

  try {
    // 1. Fetch the list of users via the Admin API
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      throw listError;
    }

    const targetUser = users.find(u => u.email?.toLowerCase() === normalizedEmail);

    if (!targetUser) {
      console.error(`\x1b[31mError: No user found with email "${normalizedEmail}" in Supabase Auth.\x1b[0m`);
      console.log('Please create the user first in the Supabase Dashboard (Authentication -> Users) or via signup.');
      process.exit(1);
    }

    console.log(`\x1b[32mFound user: ${targetUser.email} (ID: ${targetUser.id})\x1b[0m`);
    console.log('\x1b[36mPromoting user by updating app_metadata.role to "admin"...\x1b[0m');

    // 2. Perform the update
    const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
      targetUser.id,
      {
        app_metadata: {
          ...targetUser.app_metadata,
          role: 'admin'
        }
      }
    );

    if (updateError) {
      throw updateError;
    }

    console.log('\x1b[32m✨ Success! User promoted successfully. \x1b[0m');
    console.log('\x1b[35mUpdated User Metadata:\x1b[0m');
    console.log(JSON.stringify(updatedUser.user.app_metadata, null, 2));

  } catch (error) {
    console.error('\x1b[31mAn error occurred while promoting the user:\x1b[0m');
    console.error(error.message || error);
    process.exit(1);
  }
};

main();
