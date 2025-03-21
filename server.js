const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection (Accessing "test" Database)
const mongoURI = 'mongodb+srv://kumarpatelrakesh222:5rqdGjk2vBtKdVob@uploads.tc9np.mongodb.net/test?retryWrites=true&w=majority&appName=uploads';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB (test.files)'))
  .catch(err => console.error('❌ Could not connect to MongoDB', err));

// ✅ File Schema
const fileSchema = new mongoose.Schema({
  filename: String,
  data: Buffer,
  contentType: String,
  uploadDate: { type: Date, default: Date.now }
});

// ✅ Fetching from "test.files" Collection
const File = mongoose.model('File', fileSchema, 'files'); // Accessing 'test.files'

// ✅ API to Fetch All Files
app.get('/uploads', async (req, res) => {
  try {
    const files = await File.find().sort({ uploadDate: -1 });
    res.json(files.map(file => ({
      id: file._id,
      filename: file.filename,
      uploadDate: file.uploadDate,
    })));
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'Failed to fetch files.' });
  }
});

// ✅ Root Route to Check Connection
app.get('/', (req, res) => {
  res.send("✅ API is running and connected to test.files!");
});

// ✅ Start Server
app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
