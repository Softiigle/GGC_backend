const express = require('express');
const dotenv = require('dotenv');
const db = require('./src/database'); 
const errorHandler = require('./src/middleware/errorHandler');

const authRoutes = require('./src/routes/auth.routes');
const questionRouter = require('./src/routes/question.Routes')
const studentRoutes = require('./src/routes/student.routes');
const coachingOwnerRoutes = require('./src/routes/coachingOwner.routes')
const classRoutes = require('./src/routes/class.routes')
const testRoutes = require('./src/routes/test.routes')

dotenv.config(); 
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

//routing
app.use('/authRoutes',authRoutes);
app.use('/questions', questionRouter);
app.use('/studentRoutes', studentRoutes)
app.use('/coaching-owner', coachingOwnerRoutes);
app.use('/class-Routes', classRoutes)
app.use('/testRoutes', testRoutes)




//error handling middleware
app.use(errorHandler);



//db sync
db.sequelize.sync()
  .then(() => {
    console.log('Database connected successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
  

app.listen(PORT, () => {
  console.log(`GGC server started at ${PORT}`);
});
