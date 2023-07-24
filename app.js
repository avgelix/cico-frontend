import express from 'express';

const app = express();
const port = 8080;

app.use('/dummy-frontend', express.static('src/main/'));

app.listen(port, () => {
  console.log(`dummy-frontend listening on port ${port}`);
});

