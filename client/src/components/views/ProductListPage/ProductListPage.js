import React from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { Icon, Col, Card, Row } from 'antd';
import { useState } from 'react';
import ImageSlider from '../../utils/ImageSlider';
import CheckBox from './Sections/CheckBox';
import { continents } from './Sections/Datas';
const { Meta } = Card;
function ProductListPage() {
  const [Products, setProducts] = useState([]);

  // LIMIT과 SKIP을 위한 state 만들기
  const [Skip, setSkip] = useState(0); // 0부터 가져올거라서 스킵 0으로 지정한다.
  const [Limit, setLimit] = useState(8); // limit은 8을 지정했다.

  // 더보기 버튼을 눌러서 더이상 데이터가 없을때를 위한 state 만들기
  const [PostSize, setPostSize] = useState(0);

  // 체크박스 체크된 array, 가격대 array가 담길 필터 state
  const [Filters, setFilters] = useState({ continents: [], price: [] }); // continents:[1,2,3] 이런식으로 될것이다.

  useEffect(() => {
    // body를 이용해서 skip, limit 을 줘서 조건에 맞는 데이터 가져오도록 한다.
    let body = {
      skip: Skip,
      limit: Limit,
    };
    axios
      .post('/api/product/products', body) //
      .then((response) => {
        if (response.data.success) {
          console.log(response.data);
          setProducts(response.data.productInfo);
        } else {
          alert('상품들을 가져오는데 실패했습니다.');
        }
      });
    getProducts(body);
  }, []);

  // 중복되는거라서 따로빼주었다.
  const getProducts = (body) => {
    axios
      .post('/api/product/products', body) //
      .then((response) => {
        if (response.data.success) {
          // console.log(response.data);
          if (body.loadMore) {
            // 더보기 버튼을 눌렀다면
            setProducts([...Products, ...response.data.productInfo]); // 현재 데이터 + 새로운 데이터 더하기
          } else {
            setProducts(response.data.productInfo);
          }
          // PostSize 받아온다.
          setPostSize(response.data.postSize);
        } else {
          alert('상품들을 가져오는데 실패했습니다.');
        }
      });
  };

  const loadMoreHandler = () => {
    // 더보기 버튼을 눌렀을때 skip값 // 0 + 8 = 8 // 8 + 8 = 16
    let skip = Skip + Limit;

    let body = {
      skip: skip,
      limit: Limit,
      loadMore: true, // 더보기 버튼을 눌렀을때 가는 리퀘스트라는것을 나타낸다.
    };
    getProducts(body);
    setSkip(skip);
  };

  const renderCards = Products.map((product, index) => {
    return (
      // 창크기 최대일떄 6사이즈, 4칸 // 중간일떄 8사이즈, 3칸 // 작을때 24사이즈 1칸
      <Col lg={6} md={8} xs={24} key={index}>
        {/*  이미지 슬라이더 컴포넌트 연결하기 */}
        <Card hoverable={true} cover={<ImageSlider images={product.images} />}>
          <Meta title={product.title} description={`$${product.price}`} />
        </Card>
      </Col>
    );
  });

  /*필터한 내용 보여주기 */
  const showFilteredResults = (filters) => {
    let body = {
      skip: 0, // 필터를 누를때마다 db에서 처음부터 다시 가져와야하기때문에 0이 되어야한다.
      limit: Limit,
      filters: filters, // 해당하는 필터를 넣어준다.
    };
    getProducts(body);
    setSkip(0); // skip이 0이되었기 때문에 setSkip 을 다시 0으로 넣어주어야한다.
  };

  const handleFilters = (filters, category) => {
    // 체크박스 필터라면, filter에는 check된 id 가 array에 담겨져있다.
    const newFilters = { ...Filters };
    newFilters[category] = filters;
    showFilteredResults(newFilters);
  };

  return (
    <div style={{ width: '75%', margin: '3rem auto' }}>
      <div style={{ textAlign: 'center' }}>
        <h2>
          Let's Travel Anywhere <Icon type="rocket" />
        </h2>
      </div>

      {/* Filter  */}
      {/* CheckBox */}
      {/* handleFileters를 props에 줘서, CheckBox 컴포넌트에서 체크한 값을 부모컴포넌트(ProductListPage 컴포넌트)로 전달받는다 */}

      <CheckBox
        list={continents}
        handleFilters={(filters) => handleFilters(filters, 'continents')}
      />

      {/* Search  */}
      <Row gutter={[16, 16]}>{renderCards}</Row>
      <br />
      {/* PostSize >= Limit 일때만 더보기버튼 보여준다. (더이상가져올데이터 없으면 더보기버튼 없애기) */}
      {PostSize >= Limit && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button onClick={loadMoreHandler}>더보기</button>
        </div>
      )}
    </div>
  );
}
export default ProductListPage;
