const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');
// console.log(process.env)
const DB = process.env.DATABASE;

mongoose.connect(DB).then((con) => {
  // console.log(con.connections);
  console.log('Connection Done');
});

// testTour.save().then(doc =>{
//     console.log(doc);
// }).catch(err=>{
//     console.log(err);
// })

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App Is Runnig On Port ${port}....`);
});


process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});