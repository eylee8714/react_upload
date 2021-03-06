const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriberSchema = mongoose.Schema(
  {
    userTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    userFrom: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamp: true } // 생성날짜, 업데이트 날짜 표시된다.
);

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = { Subscriber };
