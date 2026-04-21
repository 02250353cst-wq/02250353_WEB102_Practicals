const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Initalize Express app
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); //HTTP request logging

//Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

//Serve uploaded files statically
app.use('/uploads', express.static(uploadDir));

//Basic route for testing
app.get('/', (req, res) => {
    res.send('File Upload Server is running');
});

//Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

//PART 2: Configuring Multer for File Uploads
const multer = require('multer');
const { url } = require('inspector');

//Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        //Create unique filename
        const timestamp = Date.now();
        const originalName = file.originalname;
        cb(null, '${originalName}');
    }
});

//Configure file filter
const fileFilter = (req, file, cb) => {
    //Accept only specific mime types
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed.'), false);
    }
};

//Create the multer instance
const upload = multer({
    storage: storage,
    limits:{
        fileSize: 5 * 1024 * 1024 //5MB in bytes
    },
    fileFilter: fileFilter
});

//Part 3: Creating the Upload API Endpoint
//File upload route
app.post('/api/upoad', upload.single('file'), (req, res) => {
    try{
        //Check if file exists
        if (!req.file) {
            return res.status(400).json({error: 'No file upload'});
        }

        console.log('File received:', req.file.originalname);
        console.log('File type:', req.file.mimetype);

        //Success respnse with file details
        return res.status(200).json({
            message: 'File uploaded successfully',
            filename: req.file.filename,
            originalName: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            url: `/uploads/${req.file.filename}`
        });
    } catch (error) {
      console.error('Upload error:', error);
        return res.status(500).json({error: error.message});
    }
});

// Error handling for multer errors
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'File too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ error: err.message });
  }

  // For any other errors
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

//Part 4: Configuring CORS for Frontend Connection
//Replace the simple cors() call with:
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
