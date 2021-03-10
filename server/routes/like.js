const express = require('express');
const router = express.Router();
const { Like } = require('../models/Like');
const { Dislike } = require('../models/Dislike');

//=================================
//             Like
//=================================
//항상 index.js 에 가서 app.use('/api/like', require('./routes/like')); 넣어주어야한다.

/* 좋아요 가져오기 */
router.post('/getLikes', (req, res) => {
  let variable = {};

  // 비디오에관한 좋아요싫어요일때
  if (req.body.videoId) {
    variable = { videoId: req.body.videoId };
  } else {
    // 댓글에 관한 좋아요싫어요일때
    variable = { commentId: req.body.commentId };
  }
  Like.find(variable).exec((err, likes) => {
    if (err) return res.status(400).send(err);
    res.status(200).json({ success: true, likes });
  });
});

/* 싫어요 가져오기 */
router.post('/getDislikes', (req, res) => {
  let variable = {};

  // 비디오에관한 좋아요싫어요일때
  if (req.body.videoId) {
    variable = { videoId: req.body.videoId };
  } else {
    // 댓글에 관한 좋아요싫어요일때
    variable = { commentId: req.body.commentId };
  }

  Dislike.find(variable).exec((err, dislikes) => {
    if (err) return res.status(400).send(err);
    res.status(200).json({ success: true, dislikes });
  });
});

/* 좋아요 누르기 */
router.post('/upLike', (req, res) => {
  let variable = {};

  // 비디오에관한 좋아요싫어요일때
  if (req.body.videoId) {
    variable = { videoId: req.body.videoId, userId: req.body.userId };
  } else {
    // 댓글에 관한 좋아요싫어요일때
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  }

  // Like collection에다가 클릭 정보를 넣는다.
  const like = new Like(variable);

  like.save((err, likeResult) => {
    if (err) return res.status(400).json({ success: false, err });

    // 만약에 Dislike이 이미 클릭이 되어있다면, Dislike를 1 줄여준다.
    Dislike.findOneAndDelete(variable).exec((err, disLikeResult) => {
      if (err) return res.status(400).json({ success: false, err });
      res.status(200).json({ success: true });
    });
  });
});

/* 좋아요 취소하기 */
router.post('/unLike', (req, res) => {
  let variable = {};

  // 비디오에관한 좋아요싫어요일때
  if (req.body.videoId) {
    variable = { videoId: req.body.videoId, userId: req.body.userId };
  } else {
    // 댓글에 관한 좋아요싫어요일때
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  }

  Like.findOneAndDelete(variable) // 좋아요 취소
    .exec((err, result) => {
      if (err) return res.status(400).json({ success: false, err });
      res.status(200).json({ success: true });
    });
});

/* 싫어요 취소하기 (좋아요취소하기와 거의 같다) */
router.post('/unDislike', (req, res) => {
  let variable = {};

  // 비디오에관한 좋아요싫어요일때
  if (req.body.videoId) {
    variable = { videoId: req.body.videoId, userId: req.body.userId };
  } else {
    // 댓글에 관한 좋아요싫어요일때
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  }

  Dislike.findOneAndDelete(variable) // 싫어요 취소
    .exec((err, result) => {
      if (err) return res.status(400).json({ success: false, err });
      res.status(200).json({ success: true });
    });
});

/* 싫어요 누르기 */
router.post('/upDislike', (req, res) => {
  let variable = {};

  // 비디오에관한 좋아요싫어요일때
  if (req.body.videoId) {
    variable = { videoId: req.body.videoId, userId: req.body.userId };
  } else {
    // 댓글에 관한 좋아요싫어요일때
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  }

  // Dislike collection에다가 클릭 정보를 넣는다.
  const dislike = new Dislike(variable);

  dislike.save((err, dislikeResult) => {
    if (err) return res.status(400).json({ success: false, err });

    // 만약에 Like이 이미 클릭이 되어있다면, Like를 1 줄여준다.
    Like.findOneAndDelete(variable) //
      .exec((err, likeResult) => {
        if (err) return res.status(400).json({ success: false, err });
        res.status(200).json({ success: true });
      });
  });
});

module.exports = router;
