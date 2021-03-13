import React from 'react';
import { Radio, Collapse } from 'antd';
import { useState } from 'react';
const { Panel } = Collapse;

function RadioBox(props) {
  const [Value, setValue] = useState(0);

  const renderRadioBox = () =>
    props.list &&
    props.list.map((value) => (
      <Radio key={value._id} value={value._id}>
        {value.name}
      </Radio>
    ));

  /* 라디오버튼에 체크할수있게 한다. */
  const handleChange = (event) => {
    setValue(event.target.value);
    props.handleFilters(event.target.value); // 부모컴포넌트에 업데이트 하기 위해 쓴다.
  };

  return (
    <div>
      <Collapse defaultActiveKey={['1']}>
        <Panel header="Price" key="1">
          <Radio.Group onChange={handleChange} value={Value}>
            {renderRadioBox()}
          </Radio.Group>
        </Panel>
      </Collapse>
    </div>
  );
}

export default RadioBox;
