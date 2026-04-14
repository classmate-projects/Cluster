const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function migrate() {
  try {
    const dataFilePath = path.join(process.cwd(), 'src/data/projects.json');
    if (!fs.existsSync(dataFilePath)) {
      console.log('No projects.json found. Skipping migration.');
      return;
    }

    const jsonData = fs.readFileSync(dataFilePath, 'utf8');
    const projects = JSON.parse(jsonData);

    console.log(`Found ${projects.length} projects. Migrating to Supabase...`);

    for (const project of projects) {
      // Basic check to see if project exists by id
      const { data, error } = await supabase
        .from('projects')
        .upsert(project)
        .select();

      if (error) {
        console.error(`Failed to migrate ${project.title}:`, error.message);
      } else {
        console.log(`Migrated: ${project.title}`);
      }
    }

    console.log('Migration complete!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrate();
