import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import { Icon } from 'antd';
import axios from 'axios';

function FileUpload(props) {
  const [Images, setImages] = useState([]); // 여러 이미지 올릴수있도록 [] 로 주었다. submit했을때 값이 있어야하기때문에 useState 적어주었다.

  const dropHandler = (files) => {
    //파일저장하기위해서는 formData를 함께 전송해주어야한다.
    let formData = new FormData();
    const config = {
      header: { 'content-type': 'multipart/fomr-data' }, // 헤더에 어떤 파일인지에대한 content-type함께 전송해줘서, 백엔드에서 리퀘스트 받을 때 에러 없이 받을 수 있게 해준다.
    };
    formData.append('file', files[0]);

    // 프론트엔드에서 할 것 처리해준다.
    // axios로 백엔드에 이미지 전달하기 (formData,config 함께보낸다 )
    axios.post('/api/product/image', formData, config).then((response) => {
      if (response.data.success) {
        // 파일저장 성공시
        console.log(response.data);
        setImages([...Images, response.data.filePath]); // 배열에다 추가를 해야되기떄문에 원래있던것 ... 적어주고 추가해준다.
        props.refreshFunction([...Images, response.data.filePath]); // 부모컴포넌트에 이미지 업로드 내용 전달한다.
      } else {
        //파일저장 실패시
        alert('파일을 저장하는데 실패했습니다.');
      }
    });
  };

  /* 이미지 클릭하면 이미지 지우기 */
  const deleteHandler = (image) => {
    const currentIndex = Images.indexOf(image);
    console.log('currentIndex', currentIndex); // 콘솔로그 찍어보면, 클릭하는것에 대한 인덱스 나오는걸 확인할 수 있다.

    let newImages = [...Images];
    newImages.splice(currentIndex, 1); //splice를 써서, 현재인덱스가 0이면, 현재인덱스 부터 1개를 지운다는 뜻이다. 현재인덱스가 1이면 현재인덱스부터 1개를 지운다.

    setImages(newImages); //새로운 스테이트 넣어주기
    props.refreshFunction(newImages); // 부모컴포넌트에 이미지 업로드 내용 전달한다.
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      {/* 이미지를 서버에 저장하는건 onDrop에서 한다. */}
      <Dropzone onDrop={dropHandler}>
        {({ getRootProps, getInputProps }) => (
          <div
            style={{
              width: 300,
              height: 240,
              border: '1px solid lightgray',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <Icon type="plus" style={{ fontSize: '3rem' }} />
          </div>
        )}
      </Dropzone>

      <div
        style={{
          display: 'flex',
          width: '350px',
          height: '240px',
          overflowX: 'scroll',
        }}
      >
        {/* 업로드 이미지 미리보기 */}
        {/* 배열이라서 map 쓴다. 여러 이미지 저장하기위해서 배열을 썼다.  */}
        {Images.map((image, index) => (
          // 클릭하면 이미지를 지우기위해서 deleteHandler 를 넣어주었다. index를 받기위해 image를 넣어주었다.
          <div onClick={() => deleteHandler(image)} key={index}>
            <img
              style={{ minWidth: '300px', width: '300px', height: '240px' }}
              src={`http://localhost:5000/${image}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default FileUpload;
