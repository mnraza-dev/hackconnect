import express from 'express';
import cors from 'cors';
const app = express();
const port = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());
app.get('/health', (req, res) => {
  res.json({status: 'ok', time: new Date().toISOString()});
});
app.listen(port, ()=> console.log(`Server listening on ${port}`));