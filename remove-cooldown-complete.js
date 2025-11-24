// Complete cooldown removal script
const fs = require('fs');
const path = require('path');

const detectionFile = path.join(__dirname, 'herbai-detect-main', 'src', 'pages', 'Detection.tsx');

try {
  let content = fs.readFileSync(detectionFile, 'utf8');
  
  console.log('🔧 Removing all cooldown limitations...\n');
  
  // Remove cooldown state variables
  content = content.replace(/const \[cooldownUntil.*?\] = useState.*?;/gs, '// Cooldown removed for unlimited analysis');
  content = content.replace(/const \[secondsLeft.*?\] = useState.*?;/gs, '');
  
  // Remove cooldown useEffect
  content = content.replace(/useEffect\(\(\) => \{[\s\S]*?cooldown[\s\S]*?\}, \[cooldownUntil\]\);/gs, '');
  
  // Remove cooldown from button disabled conditions
  content = content.replace(/disabled=\{isAnalyzing \|\| \(cooldownUntil \? cooldownUntil > Date\.now\(\) : false\)\}/g, 'disabled={isAnalyzing}');
  
  // Remove cooldown ternary operators in button text
  content = content.replace(/\(cooldownUntil && cooldownUntil > Date\.now\(\) \?[\s\S]*?:\s*/g, '');
  content = content.replace(/`Cooldown \$\{secondsLeft\}s…`/g, '"Analyze Plant 🌿"');
  
  // Remove cooldown display messages
  content = content.replace(/\) : \(cooldownUntil && cooldownUntil > Date\.now\(\) && \([\s\S]*?\)\)/gs, ')');
  content = content.replace(/\{cooldownUntil && cooldownUntil > Date\.now\(\) && \([\s\S]*?\)\}/gs, '');
  
  // Clean up any remaining cooldown references
  content = content.replace(/cooldownUntil/g, 'false');
  content = content.replace(/secondsLeft/g, '0');
  
  // Remove the cooldown message div entirely
  content = content.replace(/: \(cooldownUntil && cooldownUntil > Date\.now\(\) && \([\s\S]*?\)\)/gs, '');
  
  fs.writeFileSync(detectionFile, content);
  
  console.log('✅ All cooldown code removed successfully!');
  console.log('✅ Buttons now only disabled during analysis');
  console.log('✅ No more waiting between requests');
  console.log('\n🚀 Your app now supports unlimited analysis!');
  
} catch (error) {
  console.error('❌ Error:', error.message);
}