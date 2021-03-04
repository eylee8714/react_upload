const express = require('express');
const router = express.Router();
// const { Video } = require('../models/Video');

const { auth } = require('../middleware/auth');
const multer = require('multer'); // multer이용해서 파일 저장하기
const ffmpeg = require('fluent-ffmpeg');

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

/* multer에 config 옵션 넣어주기 , single을 적어서 파일 하 나만 가능하도록 해주었다. */
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
      filePath: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

/* 썸네일 생성하고 비디오 러닝타임도 가져오기 */
router.post('/thumbnail', (req, res) => {
  let thumbsFilePath = ''; //썸네일 path
  let fileDuration = ''; // 비디오 러닝타임

  /* 비디오 정보 가져오기 (ffprobe 이용한다.)*/
  ffmpeg.ffprobe(req.body.filePath, function (err, metadata) {
    console.dir(metadata);
    console.log(metadata.format.duration);

    fileDuration = metadata.format.duration;
  });

  /* 썸네일 생성 (ffmpeg 이용한다.)*/
  ffmpeg(req.body.filePath)
    // 비디오 썸네일 파일이름 생성
    .on('filenames', function (filenames) {
      console.log('Will generate ' + filenames.join(', '));
      thumbsFilePath = 'uploads/thumbnails/' + filenames[0];
    })
    //썸네일을 생성하고 무엇을 할것인지 적어준다.
    .on('end', function () {
      console.log('Screenshots taken');
      return res.json({
        success: true,
        thumbsFilePath: thumbsFilePath,
        fileDuration: fileDuration,
      });
    })
    /*에러가 나면 어떻게 할것인지 적는다.*/
    .on('error', function (err) {
      console.error(err);
      return res.json({ success: false, err });
    })
    /* 스크린샷 옵션주기 */
    .screenshots({
      // Will take screens at 20%, 40%, 60% and 80% of the video
      count: 3, // 3개의 스크린샷 찍기
      folder: 'uploads/thumbnails',
      size: '320x240',
      // %b input basename ( filename w/o extension )
      filename: 'thumbnail-%b.png', //thumbnail-원래이름(%b는 확장자 뺴고라는뜻이다.)
    });
});

module.exports = router;
