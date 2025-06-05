import express from 'express';

const app = express();
app.get('/', (_req, res) => {
  res.send('Admin UI placeholder');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Admin listening on ${port}`);
});
