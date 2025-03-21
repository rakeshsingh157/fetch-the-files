const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3001; // Or 3000, as you mentioned

app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
const mongoURI = 'mongodb+srv://kumarpatelrakesh222:5rqdGjk2vBtKdVob@uploads.tc9np.mongodb.net/test?retryWrites=true&w=majority&appName=uploads';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB (test.files)'))
  .catch(err => console.error('❌ Could not connect to MongoDB', err));

// ✅ File Schema for test.files
const fileSchema = new mongoose.Schema({
  filename: String,
  data: Buffer,
  contentType: String,
  uploadDate: { type: Date, default: Date.now },
});

const File = mongoose.model('File', fileSchema, 'files'); // "files" from "test.files"

// ✅ Fetch All Files from test.files
app.get('/uploads', async (req, res) => {
  try {
    const files = await File.find().sort({ uploadDate: -1 });

    console.log('✅ Fetched Files:', files);

    res.json(
      files.map((file) => ({
        id: file._id,
        filename: file.filename,
        contentType: file.contentType,
        uploadDate: file.uploadDate,
        data: file.data.buffer.toString('base64'), // Correctly convert Binary to Base64
      }))
    );
  } catch (error) {
    console.error('❌ Error fetching files:', error);
    res.status(500).json({ error: 'Failed to fetch files.' });
  }
});

// ✅ Root Route (Add this!)
app.get('/', (req, res) => {
  res.send('Welcome to your API!'); // Or send a JSON response, etc.
});

// ✅ Start Server
app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});