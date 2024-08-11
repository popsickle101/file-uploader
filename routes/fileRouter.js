const express = require('express');
const router = express.Router();
const multer = require('multer');
const fileController = require('../controllers/fileController');
const {ensureAuthenticated,ensureDirectoryExists} = require('../middlewares/middleware');
const path =require ('path')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads', req.params.folderId));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// File routes
router.post('/folders/:folderId/upload', ensureAuthenticated, ensureDirectoryExists,upload.single('file'), fileController.uploadFile);
router.get('/files/:fileId', ensureAuthenticated, fileController.getFileDetails);
router.get('/files/:fileId/download', ensureAuthenticated, fileController.downloadFile);




module.exports = router;