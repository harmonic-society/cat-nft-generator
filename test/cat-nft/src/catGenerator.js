const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

const CAT_PARTS = {
  body: ['orange', 'gray', 'black', 'white', 'brown'],
  eyes: ['blue', 'green', 'yellow', 'amber'],
  accessories: ['none', 'bow', 'collar', 'hat', 'glasses'],
  background: ['blue', 'pink', 'purple', 'green', 'yellow']
};

function getRandomTrait(category) {
  const options = CAT_PARTS[category];
  return options[Math.floor(Math.random() * options.length)];
}

function generateRandomTraits() {
  return {
    body: getRandomTrait('body'),
    eyes: getRandomTrait('eyes'),
    accessories: getRandomTrait('accessories'),
    background: getRandomTrait('background')
  };
}

async function generateCatNFT(traits = null) {
  if (!traits) {
    traits = generateRandomTraits();
  }

  const width = 500;
  const height = 500;
  
  // Create SVG string for the cat
  const svg = createCatSVG(traits, width, height);
  
  // Convert SVG to PNG using Sharp
  const buffer = await sharp(Buffer.from(svg))
    .png()
    .toBuffer();
    
  return buffer;
}

function getBackgroundColor(background) {
  const colors = {
    blue: '#87CEEB',
    pink: '#FFB6C1',
    purple: '#DDA0DD',
    green: '#98FB98',
    yellow: '#F0E68C'
  };
  return colors[background] || '#87CEEB';
}

function getCatColor(body) {
  const colors = {
    orange: '#FF8C00',
    gray: '#808080',
    black: '#2F2F2F',
    white: '#F5F5F5',
    brown: '#8B4513'
  };
  return colors[body] || '#FF8C00';
}

function createCatSVG(traits, width, height) {
  const backgroundColor = getBackgroundColor(traits.background);
  const catColor = getCatColor(traits.body);
  const eyeColor = getEyeColor(traits.eyes);
  
  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
  
  // Background
  svg += `<rect width="${width}" height="${height}" fill="${backgroundColor}"/>`;
  
  // Cat body (ellipse)
  svg += `<ellipse cx="250" cy="350" rx="120" ry="100" fill="${catColor}"/>`;
  
  // Cat head (circle)
  svg += `<circle cx="250" cy="200" r="100" fill="${catColor}"/>`;
  
  // Cat ears
  svg += `<polygon points="180,140 210,100 220,140" fill="${catColor}"/>`;
  svg += `<polygon points="280,140 290,100 320,140" fill="${catColor}"/>`;
  
  // Eyes
  svg += `<ellipse cx="220" cy="180" rx="15" ry="20" fill="${eyeColor}"/>`;
  svg += `<ellipse cx="280" cy="180" rx="15" ry="20" fill="${eyeColor}"/>`;
  
  // Pupils
  svg += `<ellipse cx="220" cy="180" rx="5" ry="12" fill="#000000"/>`;
  svg += `<ellipse cx="280" cy="180" rx="5" ry="12" fill="#000000"/>`;
  
  // Nose
  svg += `<polygon points="250,210 240,220 260,220" fill="#FF69B4"/>`;
  
  // Mouth
  svg += `<path d="M 230 230 Q 240 240 250 230" stroke="#000000" stroke-width="3" fill="none"/>`;
  svg += `<path d="M 250 230 Q 260 240 270 230" stroke="#000000" stroke-width="3" fill="none"/>`;
  
  // Whiskers
  svg += `<line x1="180" y1="210" x2="220" y2="215" stroke="#000000" stroke-width="2"/>`;
  svg += `<line x1="280" y1="215" x2="320" y2="210" stroke="#000000" stroke-width="2"/>`;
  svg += `<line x1="180" y1="230" x2="220" y2="230" stroke="#000000" stroke-width="2"/>`;
  svg += `<line x1="280" y1="230" x2="320" y2="230" stroke="#000000" stroke-width="2"/>`;
  
  // Accessories
  if (traits.accessories !== 'none') {
    svg += getAccessorySVG(traits.accessories);
  }
  
  svg += '</svg>';
  return svg;
}

function getEyeColor(eyeColor) {
  const colors = {
    blue: '#4169E1',
    green: '#32CD32',
    yellow: '#FFD700',
    amber: '#FFBF00'
  };
  return colors[eyeColor] || '#4169E1';
}

function getAccessorySVG(accessory) {
  switch (accessory) {
    case 'bow':
      return `<ellipse cx="250" cy="120" rx="30" ry="15" fill="#FF1493"/>
              <rect x="240" y="115" width="20" height="10" fill="#DC143C"/>`;
      
    case 'collar':
      return `<rect x="180" y="280" width="140" height="15" fill="#8B0000"/>
              <circle cx="250" cy="287" r="8" fill="#FFD700"/>`;
      
    case 'hat':
      return `<rect x="200" y="80" width="100" height="10" fill="#000000"/>
              <rect x="230" y="50" width="40" height="40" fill="#000000"/>`;
      
    case 'glasses':
      return `<circle cx="220" cy="180" r="25" stroke="#000000" stroke-width="3" fill="none"/>
              <circle cx="280" cy="180" r="25" stroke="#000000" stroke-width="3" fill="none"/>
              <line x1="245" y1="180" x2="255" y2="180" stroke="#000000" stroke-width="3"/>`;
      
    default:
      return '';
  }
}

module.exports = {
  generateCatNFT,
  generateRandomTraits,
  CAT_PARTS
};