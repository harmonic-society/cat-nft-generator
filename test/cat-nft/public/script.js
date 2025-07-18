let currentImageData = null;
let currentMetadata = null;

async function generateNFT() {
    const loadingText = document.getElementById('loadingText');
    const catPreview = document.getElementById('catPreview');
    const downloadBtn = document.getElementById('downloadBtn');
    const downloadMetaBtn = document.getElementById('downloadMetaBtn');
    const metadataSection = document.getElementById('metadataSection');
    
    // Show loading
    loadingText.style.display = 'block';
    catPreview.style.display = 'none';
    metadataSection.style.display = 'none';
    downloadBtn.disabled = true;
    downloadMetaBtn.disabled = true;
    
    // Get selected traits
    const traits = {
        body: document.getElementById('bodyColor').value || null,
        eyes: document.getElementById('eyeColor').value || null,
        accessories: document.getElementById('accessory').value || null,
        background: document.getElementById('background').value || null
    };
    
    // Remove null values
    Object.keys(traits).forEach(key => {
        if (traits[key] === null) {
            delete traits[key];
        }
    });
    
    try {
        const response = await fetch('/generate-nft', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ traits })
        });
        
        if (!response.ok) {
            throw new Error('NFT生成に失敗しました');
        }
        
        const data = await response.json();
        
        // Store data for download
        currentImageData = data.image;
        currentMetadata = data.metadata;
        
        // Show image
        catPreview.src = `data:image/png;base64,${data.image}`;
        catPreview.style.display = 'block';
        loadingText.style.display = 'none';
        
        // Enable download buttons
        downloadBtn.disabled = false;
        downloadMetaBtn.disabled = false;
        
        // Show metadata
        displayMetadata(data.metadata);
        
    } catch (error) {
        console.error('Error:', error);
        loadingText.textContent = 'エラーが発生しました';
        setTimeout(() => {
            loadingText.style.display = 'none';
        }, 3000);
    }
}

function displayMetadata(metadata) {
    const metadataSection = document.getElementById('metadataSection');
    const metadataContent = document.getElementById('metadataContent');
    
    metadataContent.innerHTML = '';
    
    // Basic info
    addMetadataItem('名前', metadata.name);
    addMetadataItem('説明', metadata.description);
    addMetadataItem('レアリティ', metadata.rarity);
    addMetadataItem('作成日時', new Date(metadata.date).toLocaleString('ja-JP'));
    addMetadataItem('トークンID', metadata.tokenId);
    
    // Attributes
    metadata.attributes.forEach(attr => {
        addMetadataItem(attr.trait_type, attr.value);
    });
    
    metadataSection.style.display = 'block';
}

function addMetadataItem(label, value) {
    const metadataContent = document.getElementById('metadataContent');
    const item = document.createElement('div');
    item.className = 'metadata-item';
    item.innerHTML = `
        <div class="metadata-label">${label}</div>
        <div class="metadata-value">${value}</div>
    `;
    metadataContent.appendChild(item);
}

function downloadImage() {
    if (!currentImageData) return;
    
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${currentImageData}`;
    link.download = `cat-nft-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function downloadMetadata() {
    if (!currentMetadata) return;
    
    const dataStr = JSON.stringify(currentMetadata, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `cat-nft-metadata-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

// Generate a random NFT on page load
window.addEventListener('load', () => {
    setTimeout(generateNFT, 500);
});