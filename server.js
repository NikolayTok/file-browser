const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3101;

app.use(cors());

app.get('/*', (req, res) => {
  const folderPath = path.join('/', req.params[0] || '');

  fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      return res.status(404).json({ error: 'Folder not found' });
    }
    
    const contents = files.map(file => ({
      name: file.name,
      type: file.isDirectory() ? 'folder' : 'file',
    }));

    res.json({ path: folderPath, contents });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
