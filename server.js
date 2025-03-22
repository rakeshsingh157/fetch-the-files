// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001; // Use environment port or default to 3001

app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://kumarpatelrakesh222:5rqdGjk2vBtKdVob@uploads.tc9np.mongodb.net/?retryWrites=true&w=majority&appName=uploads';

mongoose.connect(mongoURI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ Could not connect to MongoDB', err));

// File Schema
const fileSchema = new mongoose.Schema({
  filename: String,
  data: Buffer,
  contentType: String,
  uploadDate: { type: Date, default: Date.now },
  uid: String, // Add UID field
});

const File = mongoose.model('File', fileSchema);

// Multer Setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload Route
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const { uid } = req.body;

    if (!uid) {
      return res.status(400).send('UID is required.');
    }

    const newFile = new File({
      filename: req.file.originalname,
      data: req.file.buffer,
      contentType: req.file.mimetype,
      uid: uid,
    });

    await newFile.save();
    res.status(200).send('File uploaded successfully!');
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Failed to upload file.');
  }
});

// Fetch Files Route (with optional UID filter)
app.get('/uploads', async (req, res) => {
  try {
    const { uid } = req.query;
    let files;

    if (uid) {
      files = await File.find({ uid }).sort({ uploadDate: -1 });
    } else {
      files = await File.find().sort({ uploadDate: -1 });
    }

    const formattedFiles = files.map((file) => ({
      id: file._id,
      filename: file.filename,
      contentType: file.contentType,
      uploadDate: file.uploadDate,
      data: file.data.buffer.toString('base64'),
    }));

    res.json(formattedFiles);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'Failed to fetch files.' });
  }
});

// Root Route (similar to /uploads but potentially for other purposes)
app.get('/', async (req, res) => {
  try {
    const { uid } = req.query;
    let files;

    if (uid) {
      files = await File.find({ uid }).sort({ uploadDate: -1 });
    } else {
      files = await File.find().sort({ uploadDate: -1 });
    }

    const formattedFiles = files.map((file) => ({
      id: file._id,
      filename: file.filename,
      contentType: file.contentType,
      uploadDate: file.uploadDate,
      data: file.data.buffer.toString('base64'),
    }));

    res.json(formattedFiles);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'Failed to fetch files.' });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});