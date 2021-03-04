const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = mongoose.Schema(
  {
    writer: {
      type: Schema.Types.ObjectId, // ref 의 데이터를 모두 가져올수 있다.
      ref: 'User',
    },
    title: { type: String, maxlength: 50 },
    description: { type: String },
    privacy: { type: Number },
    filePath: { type: String },
    category: { type: String },
    views: { type: Number, default: 0 },
    duration: { type: String },
    thumbnail: { type: String },
  },
  { timestamp: true } // 생성날짜, 업데이트 날짜 표시된다.
);

const Video = mongoose.model('Video', videoSchema);

module.exports = { Video };
