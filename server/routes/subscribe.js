const express = require('express');
const router = express.Router();
const { Subscriber } = require('../models/Subscriber');

//=================================
//             Subscribe
//=================================
//항상 index.js 에 가서 app.use('/api/subscribe', require('./routes/subscribe')); 넣어주어야한다.

/* 구독자수 가져오기 , 몽고DB에서 글작성자의 Subscriber 정보를 가져온다. */
router.post('/subscribeNumber', (req, res) => {
  Subscriber.find({ userTo: req.body.userTo }).exec((err, subscribe) => {
    if (err) return res.status(400).send(err);
    return res
      .status(200)
      .json({ success: true, subscribeNumber: subscribe.length }); // subscribe 데이터의 개수를 세면 subscribeNumber가 나온다.
  });
});

//로그인사용자가 글작성자를 구독했는지 안했는지 가져오기
router.post('/subscribed', (req, res) => {
  Subscriber.find({
    userTo: req.body.userTo,
    userFrom: req.body.userFrom,
  }).exec((err, subscribe) => {
    if (err) return res.status(400).send(err); // 에러발생시
    let result = false; // 구독자수 없을경우
    if (subscribe.length !== 0) {
      // 구독자수 1개 이상 있을 경우
      result = true;
    }
    res.status(200).json({ success: true, subscribed: result });
  });
});

/*구독취소*/
router.post('/unSubscribe', (req, res) => {
  Subscriber.findOneAndDelete({
    userTo: req.body.userTo,
    userFrom: req.body.userFrom,
  }) //findOneAndDelete로 데이터 찾아서 지우기
    .exec((err, doc) => {
      if (err) return res.status(400).json({ success: false, err });
      res.status(200).json({ success: true, doc });
    });
});

//구독하기
router.post('/subscribe', (req, res) => {
  const subscribe = new Subscriber(req.body); // 클라이언트에서 보내준 모든정보 (req.body) 여기서는 userTo와 userFrom 정보
  subscribe.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true, doc });
  });
});

module.exports = router;
