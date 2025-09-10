import express from 'express';
import cookieParser from 'cookie-parser';
import routes from './routes/index';

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(routes);

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
