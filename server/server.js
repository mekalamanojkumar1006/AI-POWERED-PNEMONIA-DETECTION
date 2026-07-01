import express from 'express';
import cors from 'cors';
import multer from 'multer';

const app = express();
const port = 5000;

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

// Mock data for testing
const mockPredictions = [];
const mockStats = {
  total: 0,
  pneumonia: 0,
  normal: 0,
  accuracy: 95.5
};

const mockModelInfo = {
  name: "PneumoniaNet v1.0",
  type: "CNN",
  accuracy: 95.5,
  lastUpdated: "2025-10-29"
};

// Get stats
app.get('/api/predictions/stats', (req, res) => {
  res.json(mockStats);
});

// Get prediction history
app.get('/api/predictions/history', (req, res) => {
  res.json(mockPredictions);
});

// Get specific prediction
app.get('/api/predictions/results/:id', (req, res) => {
  const prediction = mockPredictions.find(p => p.id === req.params.id);
  if (!prediction) {
    return res.status(404).json({ message: 'Prediction not found' });
  }
  res.json(prediction);
});

// Get model info
app.get('/api/predictions/model-info', (req, res) => {
  res.json(mockModelInfo);
});

// Handle image upload and analysis
app.post('/api/predictions/upload', upload.single('xrayImage'), (req, res) => {
  const file = req.file;
  const { patientName, patientId, patientAge, clinicalNotes } = req.body;

  if (!file) {
    return res.status(400).json({ message: 'No image file provided' });
  }

  // Mock prediction result
  const prediction = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    patientName: patientName || 'Unknown',
    patientId: patientId || 'N/A',
    clinicalNotes: clinicalNotes || '',
    imageUrl: `uploads/${file.filename}`,
    result: Math.random() > 0.5 ? 'PNEUMONIA' : 'NORMAL',
    confidence: (Math.random() * (0.99 - 0.85) + 0.85).toFixed(4),
    status: 'completed'
  };

  mockPredictions.unshift(prediction);
  
  // Update stats
  mockStats.total++;
  if (prediction.result === 'PNEUMONIA') {
    mockStats.pneumonia++;
  } else {
    mockStats.normal++;
  }

  res.json(prediction);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});