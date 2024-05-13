const mongoose=require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/test")
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process if MongoDB connection fails
  });