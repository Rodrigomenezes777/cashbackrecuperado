import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3001;

// Create uploads directory if it doesn't exist
const uploadsDir = join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const cpf = req.body.cpf || 'unknown';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExt = file.originalname.split('.').pop();
    cb(null, `${cpf}-${file.fieldname}-${uniqueSuffix}.${fileExt}`);
  }
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());

// Endpoint to handle document uploads
app.post('/api/upload-documents', upload.fields([
  { name: 'idFront', maxCount: 1 },
  { name: 'idBack', maxCount: 1 },
  { name: 'selfie', maxCount: 1 }
]), (req, res) => {
  try {
    const files = req.files;
    const userData = req.body;
    
    // Log the received data
    console.log('Received user data:', userData);
    console.log('Received files:', Object.keys(files).map(key => ({
      fieldname: key,
      filename: files[key][0].filename
    })));
    
    // Here you would typically save the user data to a database
    // For this example, we're just returning success
    
    res.status(200).json({
      success: true,
      message: 'Documents uploaded successfully',
      files: Object.keys(files).map(key => ({
        fieldname: key,
        filename: files[key][0].filename
      }))
    });
  } catch (error) {
    console.error('Error uploading documents:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading documents',
      error: error.message
    });
  }
});

// Endpoint to save bank information
app.post('/api/save-bank-info', express.json(), (req, res) => {
  try {
    const bankData = req.body;
    
    // Log the received data
    console.log('Received bank data:', bankData);
    
    // Here you would typically save the bank data to a database
    // For this example, we're just returning success
    
    res.status(200).json({
      success: true,
      message: 'Bank information saved successfully',
      claimId: `CB-${Date.now()}`
    });
  } catch (error) {
    console.error('Error saving bank information:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving bank information',
      error: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});