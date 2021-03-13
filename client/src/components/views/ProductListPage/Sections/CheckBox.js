import React from 'react';
import { Checkbox, Collapse } from 'antd';
import { useState } from 'react';
const { Panel } = Collapse;
function CheckBox(props) {
  const [Checked, setChecked] = useState([]);

  /* 체크박스 값 토글 해서 state에 넣기 */
  const handleToggle = (value) => {
    // 누른 체크박스의 index를 구하고
    const currentIndex = Checked.indexOf(value);
    // 전체 Checked 된 state에서 현재 누른 checkbox가
    const newChecked = [...Checked];
    if (currentIndex === -1) {
      // 없다면, state넣어 준다
      newChecked.push(value);
    } else {
      // 이미 있다면, 빼준다.
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
    props.handleFilters(newChecked);
  };

  const renderCheckboxLists = () =>
    props.list &&
    props.list.map((value, index) => (
      <React.Fragment key={index}>
        {/* onChange 로 체크가 되었을때 true, 다시 클릭해서 체크풀리면 false로 바꿔주는 토글을 설정해준다. */}
        {/* Checkbox에서 checked ={true} checked={false} */}
        <Checkbox
          onChange={() => handleToggle(value._id)}
          checked={Checked.indexOf(value._id) === -1 ? false : true}
        />
        &nbsp;&nbsp;
        <span>{value.name}</span>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </React.Fragment>
    ));

  return (
    <div>
      <Collapse defaultActiveKey={['0']}>
        <Panel header="Continents" key="1">
          {renderCheckboxLists()}
        </Panel>
      </Collapse>
    </div>
  );
}

export default CheckBox;
