// Script to remove cooldown limitations for unlimited analysis
const fs = require('fs');
const path = require('path');

const detectionFile = path.join(__dirname, 'herbai-detect-main', 'src', 'pages', 'Detection.tsx');

try {
  let content = fs.readFileSync(detectionFile, 'utf8');
  
  // Remove cooldown state and logic
  content = content.replace(/const \[cooldownUntil.*?\] = useState.*?;/s, '// Cooldown removed for unlimited analysis');
  content = content.replace(/const \[secondsLeft.*?\] = useState.*?;/s, '');
  content = content.replace(/useEffect\(\(\) => \{[\s\S]*?cooldown[\s\S]*?\}, \[cooldownUntil\]\);/s, '');
  
  // Remove cooldown checks in buttons
  content = content.replace(/disabled=\{isAnalyzing \|\| \(cooldownUntil \? cooldownUntil > Date\.now\(\) : false\)\}/g, 'disabled={isAnalyzing}');
  
  // Remove cooldown display logic
  content = content.replace(/\(cooldownUntil && cooldownUntil > Date\.now\(\) \?[\s\S]*?:\s*/g, '');
  content = content.replace(/`Cooldown \$\{secondsLeft\}s…`/g, '"Analyze Plant 🌿"');
  
  // Remove cooldown messages
  content = content.replace(/\{cooldownUntil && cooldownUntil > Date\.now\(\) && \([\s\S]*?\)\}/s, '');
  
  fs.writeFileSync(detectionFile, content);
  console.log('✅ Cooldown limitations removed successfully!');
  console.log('📝 Your app now supports unlimited analysis (subject to Gemini API limits)');
} catch (error) {
  console.error('❌ Error removing cooldown:', error.message);
}