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
  // parseInt는 string인 경우 숫자로 바꿔준다. (형변환)
  let limit = req.body.limit ? parseInt(req.body.limit) : 20; //req.body.limit 이 있다면? parseInt해서보내고 없으면 원하는숫자(20)을보낸다.
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;
  let term = req.body.searchTerm;

  /*필터 추가하기 */
  let findArgs = {};
  for (let key in req.body.filters) {
    // if(req.body.filters["continents"]) 또는 if(req.body.filters["price"]) 일것이다
    if (req.body.filters[key].length > 0) {
      // 필터가 하나이상 있을때
      console.log('key', key); // key는 continents 클릭할때, continents 고, price 클릭하면 price이다.
      if (key === 'price') {
        // key가 price일때,
        findArgs[key] = {
          $gte: req.body.filters[key][0], // 몽고 DB : 이것보다 크거나 같을떄 | Greater than equal  | $gte:200
          $lte: req.body.filters[key][1], // 몽고 DB : 이것보다 작거나 같을떄 | Less than equal  | $lte:249
        };
      } else {
        // key가 continent 일때
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  //findArgs 콘솔로그 찍어보기
  console.log('findArgs', findArgs);

  if (term) {
    // 검색어가 있다면,
    Product.find(findArgs)
      .find({ $text: { $search: term } }) // 검색어 있다면, 조건을 추가해주어야한다. 몽고DB 의 옵션을 이용했다.
      .populate('writer')
      .skip(skip) // mongoDB에 skip 을 지정한다.
      .limit(limit) // mongoDB에 limit 을 지정한다.
      .exec((err, productInfo) => {
        if (err) return res.status(400).json({ success: false, err });
        return res
          .status(200)
          .json({ success: true, productInfo, postSize: productInfo.length }); // 데이터의 총갯수가되면 더보기버튼 없애기위해, postSize를 더해서 전송해준다.
      });
  } else {
    // 검색어가 없다면,
    Product.find(findArgs)
      .populate('writer')
      .skip(skip) // mongoDB에 skip 을 지정한다.
      .limit(limit) // mongoDB에 limit 을 지정한다.
      .exec((err, productInfo) => {
        if (err) return res.status(400).json({ success: false, err });
        return res
          .status(200)
          .json({ success: true, productInfo, postSize: productInfo.length }); // 데이터의 총갯수가되면 더보기버튼 없애기위해, postSize를 더해서 전송해준다.
      });
  }
});

module.exports = router;
