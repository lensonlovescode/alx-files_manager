import express from 'express';
import routes from './routes/index';

const PORT = process.env.PORT || 5000;

const app = express();

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});

app.use(routes);
