link to application: https://file-uploader-364y.onrender.com

Here are the routes:

Folder Routes

GET /folders: List all folders for the authenticated user.
POST /folders/new: Create a new folder.
GET /folders/:id: Get details of a specific folder and its files.
GET /folders/:id/edit: Show the form to edit a specific folder.
POST /folders/:id: Update a specific folder.
DELETE /folders/:id: Delete a specific folder.

File Routes

GET /folders/:folderId/files/:fileId/download: Download a specific file from a folder.

Share Folder Routes

GET /folders/:folderId/share: Show the form to share a folder.
POST /folders/:folderId/share: Generate a share link for a folder with a specified duration.
GET /share/:id: Access a shared folder using the share link.

User Routes

POST /sign-up: Register a new user.
POST /log-in: Log in a user.
POST /log-out: Log out the current user.


Miscellaneous

GET /: (Optional)Show the homepage or landing page.

Notes

Authentication is required for routes where users interact with their own folders or files, such as GET /folders, POST /folders, etc. The GET /share/:sharedFolderId route is accessible without authentication and allows unauthenticated users to access the shared folder.
Make an account before trying to log in or you end up in /fail


