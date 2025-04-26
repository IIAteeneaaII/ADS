const express = require('express');
const authRoutes = require('./routes/authRoutes');
const habitRoutes = require('./routes/habitRoute');
const principalScrRoutes = require('./routes/principalScrRoutes');
const { authMiddleware } = require('./middlewares/authMiddleware');

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/habit', authMiddleware, habitRoutes);
app.use('/api/inicio', authMiddleware, principalScrRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
