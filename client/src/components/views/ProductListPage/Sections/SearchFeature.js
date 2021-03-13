import React, { useState } from 'react';
import { Input } from 'antd';

const { Search } = Input;

function SearchFeature(props) {
  const [SearchTerms, setSearchTerms] = useState('');

  const onChangeSearch = (event) => {
    setSearchTerms(event.currentTarget.value); // 검색창에 타이핑하면 값이 변할수있도록 했다.

    props.refreshFunction(event.currentTarget.value); // 부모컴포넌트에서 내려준 props.refreshFunction을 이용해서 타이핑해서 바뀌는 값을 부모컴포넌트에 전달해준다.
  };

  return (
    <div>
      <Search
        value={SearchTerms}
        onChange={onChangeSearch}
        placeholder="Search By Typing..."
      />
    </div>
  );
}

export default SearchFeature;
