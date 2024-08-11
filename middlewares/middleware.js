
const fs = require('fs');
const path = require('path');



function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
  }
  

  
  function ensureDirectoryExists(req, res, next) {
    const folderId = req.params.folderId;
    const uploadDir = path.join(__dirname, '../uploads', folderId);
  
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  
    next();
  }
  
  module.exports = ensureDirectoryExists;
  


  module.exports = { ensureAuthenticated , ensureDirectoryExists};
  