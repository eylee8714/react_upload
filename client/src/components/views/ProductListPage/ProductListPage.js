import React from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { Icon, Col, Card, Row } from 'antd';
import { useState } from 'react';
import ImageSlider from '../../utils/ImageSlider';
const { Meta } = Card;
function ProductListPage() {
  const [Products, setProducts] = useState([]);

  // LIMIT과 SKIP을 위한 state 만들기
  const [Skip, setSkip] = useState(0); // 0부터 가져올거라서 스킵 0으로 지정한다.
  const [Limit, setLimit] = useState(8); // limit은 8을 지정했다.

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
  }, []);

  const loadMoreHandler = () => {};

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

  return (
    <div style={{ width: '75%', margin: '3rem auto' }}>
      <div style={{ textAlign: 'center' }}>
        <h2>
          Let's Travel Anywhere <Icon type="rocket" />
        </h2>
      </div>

      {/* Filter  */}

      {/* Search  */}
      <Row gutter={[16, 16]}>{renderCards}</Row>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button onClick={loadMoreHandler}>더보기</button>
      </div>
    </div>
  );
}
export default ProductListPage;
