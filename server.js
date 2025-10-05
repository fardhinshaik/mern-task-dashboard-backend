const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('✅ MongoDB Connected Successfully!'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

app.get('/api/test', (req, res) => {
  res.send('Server is working!');
});
const taskRoutes = require('./routes/tasks');
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
