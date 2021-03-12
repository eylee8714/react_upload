const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Product } = require('../models/Product');

//=================================
//             Product
//=================================

/* multer 사용법, 공식사이트 참고한다. */
var storage = multer.diskStorage({
  //destination 은 어디에 파일이 저장이 되는지
  destination: function (req, file, cb) {
    cb(null, 'uploads_img/');
  },
  // 저장될 파일 이름 지정
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

var upload = multer({ storage: storage }).single('file');

/* 이미지 저장 , multer 사용한다. */
router.post('/image', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return req.json({ success: false, err });
    }
    return res.json({
      // 성공여부, 파일저장위치, 파일이름 프론트엔드로 전달한다.
      success: true,
      filePath: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

router.post('/', (req, res) => {
  //submit해서 받아온 정보들을 DB에 넣어 준다.
  const product = new Product(req.body);

  product.save((err) => {
    // 넣어준 정보들을 Product 콜렉션 안에 저장된다.
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

/* product collection에 들어있는 모든 상품정보를 가져오기*/
router.post('/products', (req, res) => {
  Product.find()
    .populate('writer')
    .exec((err, productInfo) => {
      if (err) return res.status(400).json({ success: false, err });
      return res.status(200).json({ success: true, productInfo });
    });
});

module.exports = router;
