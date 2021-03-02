const express = require('express');
const router = express.Router();
// const { Video } = require('../models/Video');

const { auth } = require('../middleware/auth');
const multer = require('multer'); // multer이용해서 파일 저장하기

/* config 옵션 */
// STORAGE MULTER CONFIG
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // 서버에서 파일 저장할 위치 지정하기
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`); // 저장할때 파일 이름
  },

  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    // 업로드 가능한 파일 확장자
    // if (ext !== '.mp4' || ext!=='.png)  png파일도 가능하게 하고싶을때는 || 를 쓴다.
    if (ext !== '.mp4') {
      return cb(res.status(400).end('only mp4 is allowed'), false);
    }
    cb(null, true);
  },
});

/* multer에 config 옵션 넣어주기 , single을 적어서 파일 하나만 가능하도록 해주었다. */
const upload = multer({
  storage: storage,
}).single('file');

//=================================
//             Video
//=================================

// server > index.js 파일에서 /api/video 를 읽어오기떄문에 /uploadfiles 만 적어줘도된다.
router.post('/uploadfiles', (req, res) => {
  // 클라이언트에서 받은 비디오를 서버에 저장한다.
  upload(req, res, (err) => {
    if (err) {
      // 에러가나면, false 보낸다.
      return res.json({ success: false, err });
    }
    //성공을 했다면, true, url, 파일이름 보낸다.
    return res.json({
      success: true,
      url: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

module.exports = router;
