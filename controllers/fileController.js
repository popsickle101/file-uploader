const prisma = require('../prisma/prisma');
const path = require('path');
const fs = require('fs');

exports.uploadFile = async (req, res) => {
  try {
    const { folderId } = req.params;
    const { file } = req;

    if (!file) {
      return res.status(400).send('No file uploaded.');
    }

    // Create the file entry in the database
    const savedFile = await prisma.file.create({
      data: {
        filename: file.filename,
        path: path.join('uploads', folderId, file.filename),
        folderId: parseInt(folderId),
      },
    });

    // Redirect back to the folder details page
    res.redirect(`/folders/${folderId}`);
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Internal Server Error');
  }
};



exports.getFileDetails = async (req, res) => {
  try {
    const { fileId } = req.params;
    

    const file = await prisma.file.findUnique({
      where: { id: parseInt(fileId) },
    });

    if (!file) {
      return res.status(404).send('File not found');
    }

    // Assuming the file size and upload time are part of the file model
    const filePath = path.join(__dirname, '../uploads', file.folderId.toString(), file.filename);
    const stats = fs.statSync(filePath);

    const fileDetails = {
      name: file.filename,
      size: stats.size,
      uploadTime: stats.birthtime,
    };

    res.render('fileDetails', { fileDetails, fileId });
  } catch (error) {
    console.error('Error retrieving file details:', error);
    res.status(500).send('Internal Server Error');
  }
};


exports.downloadFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    // Await the Prisma query to get the file details
    const file = await prisma.file.findUnique({
      where: { id: parseInt(fileId) },
    });

    if (!file) {
      return res.status(404).send('File not found');
    }

    // Construct the file path
    const filePath = path.join(__dirname, '../uploads', file.folderId.toString(), file.filename);

    // Use the `res.download` method to send the file to the client
    res.download(filePath, file.filename, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).send('Internal Server Error');
      }
    });
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).send('Internal Server Error');
  }
};
