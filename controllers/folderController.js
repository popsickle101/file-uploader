const prisma = require('../prisma/prisma');
const {parseDuration}=require('../utils/parseDuration.js')

exports.createFolder = async (req, res) => {
    const { name } = req.body;
    const folder = await prisma.folder.create({
      data: {
        name,
        userId: req.user.id,
      },
    });
    res.redirect('/folders');
  };
  
  // Get all folders for the authenticated user
exports.getAllFolders = async (req, res) => {
    const folders = await prisma.folder.findMany({
      where: { userId: req.user.id },
    });
    res.render('folderList', { folders });
  };
  
  // Delete a folder
exports.deleteFolder = async (req, res) => {
    await prisma.folder.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.redirect('/folders');
  };
  exports.editFolderForm = async (req, res) => {
    const folderId = parseInt(req.params.id);
  
    if (isNaN(folderId)) {
      return res.status(400).send('Invalid folder ID');
    }
  
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
    });
  
    if (!folder) {
      return res.status(404).send('Folder not found');
    }
  
    res.render('edit-folder', { folder });
  };
  
// Get the details of a folder and its files
exports.getFolder = async (req, res) => {
    try {
      const folderId = parseInt(req.params.folderId);
  
      // Find the folder by its ID
      const folder = await prisma.folder.findUnique({
        where: { id: folderId },
      });
  
      if (!folder || folder.userId !== req.user.id) {
        return res.status(404).send('Folder not found or access denied');
      }
  
      // Find all files in the folder
      const files = await prisma.file.findMany({
        where: { folderId: folderId },
      });
  
      // Render the folder details page with the folder and file data
      res.render('showFolder', { folder, files });
    } catch (err) {
      console.error('Error retrieving folder:', err);
      res.status(500).send('Internal Server Error');
    }
  };



  exports.shareFolder = async (req, res) => {
    try {
      const { folderId } = req.params;
      const { duration } = req.body;
  
      // Ensure the folder exists
      const folder = await prisma.folder.findUnique({
        where: { id: parseInt(folderId) },
      });
  
      if (!folder) {
        return res.status(404).send('Folder not found');
      }
  
      const expiresAt = parseDuration(duration); // Function to calculate expiration date
  
      // Create a new shared folder entry
      const sharedFolder = await prisma.sharedFolder.create({
        data: {
          folderId: parseInt(folderId),
          expiresAt: new Date(expiresAt),
        },
      });
  
      // Generate the share link
      const shareLink = `${req.protocol}://${req.get('host')}/share/${sharedFolder.id}`;
  
      res.json({ shareLink });
    } catch (error) {
      console.error('Error sharing folder:', error);
      res.status(500).send('Internal Server Error');
    }
  };
  

// Display the share folder form
exports.showShareForm = (req, res) => {
  const { folderId } = req.params;
  res.render('shareFolder', { folderId });
};


exports.viewSharedFolder = async (req, res) => {
  try {
    const { shareId } = req.params;

    // Find the shared folder entry
    const sharedFolder = await prisma.sharedFolder.findUnique({
      where: { id: shareId },
      include: { folder: true }, 
    });

    if (!sharedFolder) {
      return res.status(404).send('Shared folder not found');
    }

    // Check if the share link has expired
    if (new Date() > new Date(sharedFolder.expiresAt)) {
      return res.status(403).send('Share link has expired');
    }

    // Retrieve folder details and send response
    res.render('sharedFolder', { folder: sharedFolder.folder }); // Render view with folder details
  } catch (error) {
    console.error('Error retrieving shared folder:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getSharedFolder = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the shared folder entry
    const sharedFolder = await prisma.sharedFolder.findUnique({
      where: { id: id },
      include: { folder: { include: { files: true } } } // Include related folder and its files
    });

    if (!sharedFolder) {
      return res.status(404).send('Shared folder not found');
    }

    // Check if the share link has expired
    if (new Date() > sharedFolder.expiresAt) {
      return res.status(403).send('Share link has expired');
    }

    // Render the folder details or redirect as needed
    res.render('showSharedFolder', { folder: sharedFolder.folder });
  } catch (error) {
    console.error('Error retrieving shared folder:', error);
    res.status(500).send('Internal Server Error');
  }
};
