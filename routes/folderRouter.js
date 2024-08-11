const express = require('express');
const router = express.Router();
const folderController = require('../controllers/folderController');
const passport=require('passport')
const { ensureAuthenticated } = require('../middlewares/middleware.js'); 
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

 //folder routes
router.get('/folders', ensureAuthenticated, folderController.getAllFolders);
router.get('/folders/new',ensureAuthenticated,(req,res)=>res.render('createFolder'))
router.post('/folders', ensureAuthenticated, folderController.createFolder);
router.delete('/folders/:id', ensureAuthenticated, folderController.deleteFolder);
router.get('/folders/:id/edit', ensureAuthenticated, folderController.editFolderForm);
router.get('/folders/:folderId', ensureAuthenticated, folderController.getFolder);


router.post('/folders/:folderId/share', ensureAuthenticated, folderController.shareFolder);
router.get('/folders/:folderId/share', ensureAuthenticated, folderController.showShareForm);


router.get('/share/:id', folderController.getSharedFolder);

module.exports = router;