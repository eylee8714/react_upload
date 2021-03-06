const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key');

// const mongoose = require("mongoose");
// mongoose
//   .connect(config.mongoURI, { useNewUrlParser: true })
//   .then(() => console.log("DB connected"))
//   .catch(err => console.error(err));

const mongoose = require('mongoose');
const connect = mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err));

app.use(cors());

//to not get any deprecation warning or error
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
//to get json data
// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(cookieParser());

/* 원래는 app.post('/api/product/image, 해야할것하기 ) 이런식으로 적어주어야하는데, index.js 가 길어지기떄문에, 
 express에서 제공해주는 router를 써서 리퀘스트를 나눠준다.*/

app.use('/api/users', require('./routes/users'));
app.use('/api/video', require('./routes/video')); // /api/video 를 주소에 붙여서 routes>video.js 파일로 간다.
app.use('/api/subscribe', require('./routes/subscribe')); // /api/subscribe 를 주소에 붙여서 routes>subscribe.js 파일로 간다.
app.use('/api/comment', require('./routes/comment')); // /api/comment 를 주소에 붙여서 routes>comment.js 파일로 간다.
app.use('/api/like', require('./routes/like')); // /api/like 를 주소에 붙여서 routes>like.js 파일로 간다.
app.use('/api/product', require('./routes/product')); // /api/product 를 주소에 붙여서 routes>product.js 파일로 간다.

//use this to show the image you have in node js server to client (react js)
//client에서  back서버에 있는 static한 파일들을 (이미지, css 파일, javascript 파일) 처리하기위해 uploads 폴더 등록해준다.
//https://stackoverflow.com/questions/48914987/send-image-path-from-node-js-express-server-to-react-client
app.use('/uploads', express.static('uploads'));
app.use('/uploads_img', express.static('uploads_img')); // 이미지 폴더 등록해주어야한다.

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  // All the javascript and css files will be read and served from this folder
  app.use(express.static('client/build'));

  // index.html for all page routes    html or routing and naviagtion
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server Listening on ${port}`);
});
