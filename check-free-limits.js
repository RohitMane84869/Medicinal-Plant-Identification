// Free Gemini API Limits Checker
const https = require('https');

const GEMINI_MODELS = {
  'gemini-2.5-flash': {
    requestsPerMinute: 15,
    requestsPerDay: 1500,
    tokensPerMinute: 1000000,
    tokensPerDay: 50000000
  },
  'gemini-2.0-flash-exp': {
    requestsPerMinute: 10,
    requestsPerDay: 50,
    tokensPerMinute: 1000000,
    tokensPerDay: 50000000
  },
  'gemini-2.5-pro': {
    requestsPerMinute: 2,
    requestsPerDay: 50,
    tokensPerMinute: 32000,
    tokensPerDay: 50000000
  }
};

console.log('🔍 Free Gemini API Limits Analysis\n');

console.log('📊 Current Free Tier Limits:');
console.log('=' .repeat(50));

Object.entries(GEMINI_MODELS).forEach(([model, limits]) => {
  console.log(`\n🤖 ${model}:`);
  console.log(`   • ${limits.requestsPerMinute} requests/minute`);
  console.log(`   • ${limits.requestsPerDay} requests/day`);
  console.log(`   • ${limits.tokensPerMinute.toLocaleString()} tokens/minute`);
  console.log(`   • ${limits.tokensPerDay.toLocaleString()} tokens/day`);
});

console.log('\n⏱️ Timing Calculations:');
console.log('=' .repeat(50));

// Calculate optimal usage patterns
const flashModel = GEMINI_MODELS['gemini-2.5-flash'];
const secondsBetweenRequests = 60 / flashModel.requestsPerMinute;
const hoursToUseDaily = flashModel.requestsPerDay / flashModel.requestsPerMinute / 60;

console.log(`\n🚀 gemini-2.5-flash (Best for unlimited use):`);
console.log(`   • Wait ${secondsBetweenRequests.toFixed(1)}s between requests`);
console.log(`   • Can analyze continuously for ${hoursToUseDaily.toFixed(1)} hours/day`);
console.log(`   • ${Math.floor(flashModel.requestsPerDay / 24)} requests/hour average`);

console.log('\n💡 Optimization Tips:');
console.log('=' .repeat(50));
console.log('• Use gemini-2.5-flash as primary (highest limits)');
console.log('• Implement smart fallbacks to other models');
console.log('• Cache results to avoid duplicate requests');
console.log('• Use batch processing for multiple images');

console.log('\n🔧 Your Current Setup Status:');
console.log('=' .repeat(50));

// Check if API key is configured
const fs = require('fs');
const path = require('path');

try {
  const envPath = path.join(__dirname, 'herbai-detect-main', '.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  if (envContent.includes('GEMINI_API_KEY=') && !envContent.includes('your_gemini_api_key_here')) {
    console.log('✅ API Key: Configured');
  } else {
    console.log('❌ API Key: Not configured - add your free key');
  }
  
  // Check Detection.tsx for cooldown
  const detectionPath = path.join(__dirname, 'herbai-detect-main', 'src', 'pages', 'Detection.tsx');
  const detectionContent = fs.readFileSync(detectionPath, 'utf8');
  
  if (detectionContent.includes('cooldownUntil') || detectionContent.includes('secondsLeft')) {
    console.log('⚠️  Cooldown: Still active in code');
    console.log('   Run: node remove-cooldown-complete.js');
  } else {
    console.log('✅ Cooldown: Removed');
  }
  
} catch (error) {
  console.log('❌ Setup: Error checking files');
}

console.log('\n🎯 Next Steps:');
console.log('1. Get API key: https://aistudio.google.com/app/apikey');
console.log('2. Add to .env: GEMINI_API_KEY=your_key');
console.log('3. Remove any remaining cooldowns');
console.log('4. Deploy and enjoy unlimited analysis!');