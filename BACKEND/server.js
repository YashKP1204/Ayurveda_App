const express = require('express');
const app = express();
const cors = require('cors');
const bodyparser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const analysisRoutes = require('./routes/AnalysisRoutes')
const userRoutes = require("./routes/UserRoutes")
const connectDb = require('./config/db');
const authenticateJWT = require('./middleware/authenticateJWT');
const questionnaireRoutes = require('./routes/QuestionnareRoutes');
const authRoutes = require('./routes/AuthRoutes');

app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.get('/', (req, res) => {
  res.send('Welcome to the ayurveda-backend server!');
});
app.use('/api/auth', authRoutes);
app.use('/api/user',authenticateJWT ,userRoutes);
app.use('/api/analysis',authenticateJWT, analysisRoutes);
app.use('/api/questionnaire', authenticateJWT, questionnaireRoutes);

connectDb();
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`); });


