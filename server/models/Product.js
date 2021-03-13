const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = mongoose.Schema(
  {
    writer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
      maxlength: 50,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
      default: [],
    },
    continents: {
      type: Number,
      default: 1,
    },
    sold: {
      type: Number,
      maxlength: 100,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// 검색시, 잘 걸려야하는 부분을 indexing해준다. title와 description의 내용중에서 검색어를 중점적으로 찾는다.
productSchema.index(
  {
    title: 'text',
    description: 'text',
  },
  {
    weights: {
      title: 5, // title을 5배의 비중으로 둬서 더 중점적으로 검색을 한다.
      description: 1,
    },
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = { Product };
