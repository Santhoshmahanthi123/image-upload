const express = require('express');
const app = express();
const multer = require('multer'); 
const User = require('./model/user')
const path = require('path');
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
app.use(bodyParser.urlencoded({extended : true}));

mongoose.connect('mongodb://Venkatnatraj:natraj95@ds123625.mlab.com:23625/image', { useNewUrlParser: true })
app.get('/',(req,res)=>{
    res.send('home')
})

app.use((req,res,next)=>{
    //* will give access to any origin
 res.header('Access-Control-Allow-Origin','*');
 next();
});

//setting storage
const storage = multer.diskStorage({
    destination: './public/uploads/',
     filename: function(req, file, callback) {
      req.newFileName = new Date().toISOString() + file.originalname;
      callback(null, req.newFileName);
    }
  });
  const fileFilter = (req, file, callback) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      callback(null, true);
    } else {
      callback(null, false);
    }
  };
  // stores in uploads folder
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
  });
app.post('/',upload.single('image'),(req,res)=>{
    const user = new User ({
        _id : new mongoose.Types.ObjectId(),
        name : req.body.name,
        description : req.body.description,
        image : req.newFileName,


     });
    
    user
    .save()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message : "user created ",
            createdUser : user,
           
        });
    
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        });
    });
})
app.listen(port,()=>{
    console.log(`app started on port:${port}`)
})