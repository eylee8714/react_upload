import React from 'react';
import { useEffect } from 'react';
import axios from 'axios';
function ProductListPage() {
  useEffect(() => {
    axios.post('/api/product/products').then((response) => {
      if (response.data.success) {
        console.log(response.data);
      } else {
        alert('상품들을 가져오는데 실패했습니다.');
      }
    });
  }, []);

  return <div>ProductListPage</div>;
}

export default ProductListPage;
