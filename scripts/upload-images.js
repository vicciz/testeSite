/*
  Upload product images to Supabase Storage and keep DB image filenames.

  Usage:
    node scripts/upload-images.js --folder "C:\\path\\to\\images"

  Required env (in .env.local or environment):
    NEXT_PUBLIC_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY  (or SUPABASE_SERVICE_ROLE_KEY for admin uploads)
*/

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

function loadEnvFile(envPath) {
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    if (!line || line.trim().startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

function getArg(name) {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx === -1) return null;
  return process.argv[idx + 1] || null;
}

(async () => {
  loadEnvFile(path.resolve(__dirname, '..', '.env.local'));

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const cliServiceKey = getArg('service-key');
  const supabaseKey = cliServiceKey || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE_KEY / --service-key).');
    process.exit(1);
  }

  const folder = getArg('folder');
  if (!folder) {
    console.error('Missing --folder argument.');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: produtos, error } = await supabase
    .from('produtos')
    .select('id,image')
    .not('image', 'is', null);

  if (error) {
    console.error('Erro ao listar produtos:', error.message);
    process.exit(1);
  }

  console.log(`Encontrados ${produtos.length} produtos com imagem.`);

  for (const p of produtos) {
    const filename = p.image;
    const filePath = path.join(folder, filename);

    if (!fs.existsSync(filePath)) {
      console.warn(`Arquivo não encontrado: ${filePath}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(filePath);

    const { error: uploadError } = await supabase
      .storage
      .from('produtos')
      .upload(filename, fileBuffer, { upsert: false });

    if (uploadError) {
      if (uploadError.message.includes('The resource already exists')) {
        console.log(`Já existe no bucket: ${filename}`);
        continue;
      }
      console.error(`Erro ao enviar ${filename}:`, uploadError.message);
      continue;
    }

    console.log(`Upload ok: ${filename}`);
  }
})();
