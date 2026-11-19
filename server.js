const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 4200;
const dist = path.join(__dirname, 'dist/felc-front/browser');

app.use(express.static(dist));

// Angular routing - toutes les routes renvoient index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(dist, 'index.html'));
});

app.listen(port, () => {
  console.log(`Frontend servi sur le port ${port}`);
});
