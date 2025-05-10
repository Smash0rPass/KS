require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Load keys from environment variable
const validKeys = JSON.parse(process.env.VALID_KEYS || '{}');

// Endpoint to verify keys
app.post('/verify-key', (req, res) => {
    const { key } = req.body;
    
    if (!key) {
        return res.status(400).json({ valid: false, message: "No key provided" });
    }
    
    if (validKeys[key]) {
        // Check if key is expired
        const expiryDate = new Date(validKeys[key].expiryDate);
        if (expiryDate > new Date()) {
            return res.json({ 
                valid: true, 
                message: "Key verified",
                owner: validKeys[key].owner,
                expiryDate: validKeys[key].expiryDate
            });
        } else {
            return res.json({ valid: false, message: "Invalid key" });
        }
    } else {
        return res.json({ valid: false, message: "Invalid key" });
    }
});

app.listen(port, () => {
    console.log(`Key verification server running on port ${port}`);
});
