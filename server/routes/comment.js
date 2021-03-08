const express = require('express');
const router = express.Router();
const { Comment } = require('../models/Comment');

//=================================
//             Comment
//=================================
//항상 index.js 에 가서 app.use('/api/subscribe', require('./routes/subscribe')); 넣어주어야한다.

/* 댓글 저장하기 */
router.post('/saveComment', (req, res) => {
  const comment = new Comment(req.body); //save할때는 인스턴스 생성하기
  comment.save((err, comment) => {
    if (err) return res.json({ success: false, err });

    //.populate 여기서 바로 못한다.
    //save할 때는 populate를 바로 쓸 수 없다. 그래서 find 로 전체 찾아 준 다음에 populate를 해준다.
    Comment.find({ _id: comment._id })
      .populate('writer')
      .exec((err, result) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({ success: true, result });
      });
  });
});

/* 댓글 리스트 가져오기 */
router.post('/getComments', (req, res) => {
  Comment.find({ postId: req.body.videoId })
    .populate('writer')
    .exec((err, comments) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, comments });
    });
});

module.exports = router;
