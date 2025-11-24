// Check if your project uses FREE or PAID Gemini models
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Model Type: FREE vs PAID\n');

// Read the Supabase function to see which models are configured
const functionPath = path.join(__dirname, 'herbai-detect-main', 'supabase', 'functions', 'analyze-plant', 'index.ts');

try {
  const functionContent = fs.readFileSync(functionPath, 'utf8');
  
  console.log('📋 Models Found in Your Code:');
  console.log('=' .repeat(50));
  
  // Extract model URLs from the code
  const modelMatches = functionContent.match(/gemini-[^"'`]+/g) || [];
  const uniqueModels = [...new Set(modelMatches)];
  
  const FREE_MODELS = {
    'gemini-2.5-flash': { tier: 'FREE', limit: '1,500/day', cost: '$0' },
    'gemini-2.0-flash-exp': { tier: 'FREE', limit: '50/day', cost: '$0' },
    'gemini-2.5-pro': { tier: 'FREE', limit: '50/day', cost: '$0' },
    'gemini-1.5-flash': { tier: 'FREE', limit: '1,500/day', cost: '$0' },
    'gemini-1.5-pro': { tier: 'FREE', limit: '50/day', cost: '$0' }
  };
  
  const PAID_MODELS = {
    'gemini-pro': { tier: 'PAID', cost: '$0.50/1M tokens' },
    'gemini-ultra': { tier: 'PAID', cost: '$60/1M tokens' }
  };
  
  let totalFreeRequests = 0;
  let hasPaidModels = false;
  
  uniqueModels.forEach(model => {
    if (FREE_MODELS[model]) {
      const info = FREE_MODELS[model];
      console.log(`✅ ${model}: ${info.tier} (${info.limit}) - ${info.cost}`);
      
      // Extract daily limit number
      const dailyLimit = parseInt(info.limit.split('/')[0].replace(',', ''));
      totalFreeRequests += dailyLimit;
    } else if (PAID_MODELS[model]) {
      const info = PAID_MODELS[model];
      console.log(`💰 ${model}: ${info.tier} - ${info.cost}`);
      hasPaidModels = true;
    } else {
      console.log(`❓ ${model}: Unknown model`);
    }
  });
  
  console.log('\n📊 Summary:');
  console.log('=' .repeat(50));
  
  if (hasPaidModels) {
    console.log('⚠️  MIXED: Your project uses both FREE and PAID models');
    console.log('💳 You will be charged for paid model usage');
  } else {
    console.log('✅ 100% FREE: All models are completely free');
    console.log(`🎯 Total daily quota: ${totalFreeRequests.toLocaleString()} requests`);
    console.log('💰 Cost: $0 (within free limits)');
  }
  
  console.log('\n🔧 Model Priority Order:');
  console.log('=' .repeat(50));
  
  // Show the order models are tried
  const modelUrlsMatch = functionContent.match(/const modelUrls = \[([\s\S]*?)\];/);
  if (modelUrlsMatch) {
    const urls = modelUrlsMatch[1];
    const orderedModels = urls.match(/gemini-[^"'`]+/g) || [];
    
    orderedModels.forEach((model, index) => {
      const status = FREE_MODELS[model] ? '✅ FREE' : '💰 PAID';
      console.log(`${index + 1}. ${model} (${status})`);
    });
  }
  
  console.log('\n💡 Recommendation:');
  console.log('=' .repeat(50));
  
  if (hasPaidModels) {
    console.log('• Remove paid models to stay 100% free');
    console.log('• Use only gemini-2.5-flash, gemini-2.0-flash-exp, gemini-2.5-pro');
  } else {
    console.log('• Perfect setup! All models are free');
    console.log('• No charges will occur within daily limits');
    console.log('• Smart fallback system maximizes free usage');
  }
  
} catch (error) {
  console.error('❌ Error reading function file:', error.message);
}