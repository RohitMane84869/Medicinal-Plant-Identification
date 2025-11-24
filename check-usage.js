// Check Gemini API usage script
const https = require('https');

async function checkGeminiUsage() {
  console.log('🔍 Checking Gemini API Usage...\n');
  
  // Check if API key is configured
  const fs = require('fs');
  const path = require('path');
  
  try {
    const envPath = path.join(__dirname, 'herbai-detect-main', '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    const apiKeyMatch = envContent.match(/GEMINI_API_KEY=(.+)/);
    if (!apiKeyMatch || apiKeyMatch[1] === 'your_gemini_api_key_here') {
      console.log('❌ No API key configured');
      console.log('📝 Add your free API key to check usage');
      console.log('🔗 Get key: https://aistudio.google.com/app/apikey\n');
      return;
    }
    
    const apiKey = apiKeyMatch[1].trim();
    console.log('✅ API Key found');
    
    // Try to get model list to verify key works
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      const models = data.models || [];
      
      console.log('✅ API Key is valid\n');
      
      console.log('📊 Available Models:');
      console.log('=' .repeat(40));
      
      const geminiModels = models.filter(m => 
        m.name && m.name.includes('gemini')
      );
      
      geminiModels.forEach(model => {
        const name = model.name.split('/').pop();
        console.log(`• ${name}`);
      });
      
      console.log('\n💡 Usage Information:');
      console.log('=' .repeat(40));
      console.log('• Google doesn\'t provide real-time usage APIs');
      console.log('• Check usage in Google AI Studio dashboard');
      console.log('• Free tier resets daily at midnight UTC');
      
      console.log('\n📈 Your Free Limits:');
      console.log('• gemini-2.5-flash: 1,500 requests/day');
      console.log('• gemini-2.0-flash-exp: 50 requests/day');
      console.log('• gemini-2.5-pro: 50 requests/day');
      
      console.log('\n🔗 Check detailed usage:');
      console.log('https://aistudio.google.com/app/apikey');
      
    } else {
      const errorText = await response.text();
      console.log('❌ API Key invalid or expired');
      console.log(`Status: ${response.status}`);
      console.log(`Error: ${errorText}`);
    }
    
  } catch (error) {
    console.error('❌ Error checking usage:', error.message);
  }
}

// Run the check
checkGeminiUsage();