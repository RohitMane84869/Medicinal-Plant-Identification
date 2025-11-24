// Verification script for free Gemini setup
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Free Gemini Setup...\n');

// Check .env file
const envFile = path.join(__dirname, 'herbai-detect-main', '.env');
const envContent = fs.readFileSync(envFile, 'utf8');

if (envContent.includes('GEMINI_API_KEY=')) {
  if (envContent.includes('your_gemini_api_key_here')) {
    console.log('⚠️  GEMINI_API_KEY placeholder found - replace with actual key');
  } else {
    console.log('✅ GEMINI_API_KEY configured');
  }
} else {
  console.log('❌ GEMINI_API_KEY missing');
}

// Check Supabase function
const functionFile = path.join(__dirname, 'herbai-detect-main', 'supabase', 'functions', 'analyze-plant', 'index.ts');
const functionContent = fs.readFileSync(functionFile, 'utf8');

const models = [
  'gemini-2.5-flash',
  'gemini-2.0-flash-exp', 
  'gemini-2.5-pro'
];

console.log('\n📋 Free Models Configured:');
models.forEach(model => {
  if (functionContent.includes(model)) {
    console.log(`✅ ${model}`);
  } else {
    console.log(`❌ ${model} missing`);
  }
});

// Check cooldown removal
const detectionFile = path.join(__dirname, 'herbai-detect-main', 'src', 'pages', 'Detection.tsx');
const detectionContent = fs.readFileSync(detectionFile, 'utf8');

if (detectionContent.includes('Cooldown removed for unlimited analysis')) {
  console.log('\n✅ Cooldown limitations removed');
} else {
  console.log('\n⚠️  Cooldown may still be active');
}

console.log('\n🎯 Next Steps:');
console.log('1. Get free API key: https://aistudio.google.com/app/apikey');
console.log('2. Replace "your_gemini_api_key_here" in .env file');
console.log('3. Deploy to Supabase or run locally');
console.log('\n💡 Free Limits:');
console.log('- gemini-2.5-flash: 15/min, 1,500/day');
console.log('- gemini-2.0-flash-exp: 10/min, 50/day');
console.log('- gemini-2.5-pro: 2/min, 50/day');