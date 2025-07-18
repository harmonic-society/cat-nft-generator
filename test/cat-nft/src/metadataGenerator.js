const { v4: uuidv4 } = require('uuid');

function generateMetadata(traits) {
  const tokenId = uuidv4();
  const timestamp = new Date().toISOString();
  
  return {
    name: `Cat NFT #${tokenId.slice(0, 8)}`,
    description: "A unique digital cat generated with various traits and characteristics.",
    image: `cat-nft-${tokenId}.png`,
    attributes: [
      {
        trait_type: "Body Color",
        value: capitalizeFirst(traits.body)
      },
      {
        trait_type: "Eye Color", 
        value: capitalizeFirst(traits.eyes)
      },
      {
        trait_type: "Accessory",
        value: capitalizeFirst(traits.accessories)
      },
      {
        trait_type: "Background",
        value: capitalizeFirst(traits.background)
      }
    ],
    compiler: "Cat NFT Generator v1.0",
    date: timestamp,
    tokenId: tokenId,
    rarity: calculateRarity(traits)
  };
}

function capitalizeFirst(str) {
  if (!str) return 'Unknown';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function calculateRarity(traits) {
  let rarityScore = 0;
  
  // Body color rarity
  const bodyRarity = {
    'white': 5,
    'black': 4, 
    'gray': 3,
    'brown': 2,
    'orange': 1
  };
  
  // Eye color rarity
  const eyeRarity = {
    'amber': 4,
    'blue': 3,
    'green': 2,
    'yellow': 1
  };
  
  // Accessory rarity
  const accessoryRarity = {
    'glasses': 5,
    'hat': 4,
    'bow': 3,
    'collar': 2,
    'none': 1
  };
  
  // Background rarity
  const backgroundRarity = {
    'purple': 4,
    'green': 3,
    'pink': 2,
    'blue': 2,
    'yellow': 1
  };
  
  rarityScore += bodyRarity[traits.body] || 1;
  rarityScore += eyeRarity[traits.eyes] || 1;
  rarityScore += accessoryRarity[traits.accessories] || 1;
  rarityScore += backgroundRarity[traits.background] || 1;
  
  if (rarityScore >= 16) return "Legendary";
  if (rarityScore >= 12) return "Epic";
  if (rarityScore >= 8) return "Rare";
  if (rarityScore >= 6) return "Uncommon";
  return "Common";
}

function generateCollectionMetadata() {
  return {
    name: "Cat NFT Collection",
    description: "A collection of unique digital cats with various traits and characteristics.",
    image: "collection-banner.png",
    external_link: "https://example.com/cat-nft",
    seller_fee_basis_points: 250,
    fee_recipient: "0x0000000000000000000000000000000000000000"
  };
}

module.exports = {
  generateMetadata,
  generateCollectionMetadata,
  calculateRarity
};