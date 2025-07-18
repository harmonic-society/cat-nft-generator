const express = require('express');
const path = require('path');
const { generateCatNFT } = require('./src/catGenerator');
const { generateMetadata } = require('./src/metadataGenerator');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/generate-nft', async (req, res) => {
  try {
    const { traits } = req.body;
    const imageBuffer = await generateCatNFT(traits);
    const metadata = generateMetadata(traits);
    
    res.json({
      image: imageBuffer.toString('base64'),
      metadata: metadata
    });
  } catch (error) {
    console.error('Error generating NFT:', error);
    res.status(500).json({ error: 'NFT生成中にエラーが発生しました' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});