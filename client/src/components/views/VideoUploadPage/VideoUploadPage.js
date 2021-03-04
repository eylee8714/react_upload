import React, { useState, useEffect } from 'react';
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import { useSelector } from 'react-redux'; //리덕스의 state 쓰기위해서 useSelector 가져오기

const { Title } = Typography;
const { TextArea } = Input;

/* 옵션에 넣어줄 Private 목록 적어준다. */
const PrivateOptions = [
  { value: 0, label: 'Private' },
  { value: 1, label: 'Public' },
];

const CategoryOptions = [
  { value: 0, label: 'Film & Animation' },
  { value: 1, label: 'Autos & Vehicles' },
  { value: 2, label: 'Music' },
  { value: 3, label: 'Pets & Animals' },
  { value: 4, label: 'Sports' },
];

function UploadVideoPage(props) {
  /* value 값을 input 태그의 state로 만들어준다. state가 db에 들어가게된다. */
  const [VideoTitle, setTitle] = useState('');
  const [Description, setDescription] = useState('');
  const [Private, setPrivate] = useState(0);
  const [Category, setCategory] = useState('Film & Animation');
  const [FilePath, setFilePath] = useState('');
  const [Duration, setDuration] = useState('');
  const [ThumbnailPath, setThumbnailPath] = useState('');
  const user = useSelector((state) => state.user); // 리덕스의 state에 있는 user 변수의 모든 정보를 user변수에 담는다.

  const onTitleChange = (event) => {
    setTitle(event.currentTarget.value);
  };

  const onDescriptionChange = (event) => {
    setDescription(event.currentTarget.value);
  };

  const onPrivateChange = (event) => {
    setPrivate(event.currentTarget.value);
  };

  const onCategoryChange = (event) => {
    setCategory(event.currentTarget.value);
  };

  const onDrop = (files) => {
    let formData = new FormData();
    const config = {
      header: { 'content-type': 'multipart/form-data' },
    };

    /* console.log(files);  콘솔로그 찍어보면 파일에 대한 정보를 가지고오는걸 볼수있다. */
    formData.append('file', files[0]); // files 중에서 0번째 정보를 axios를 통해 /api/video/uploadfiles 로 보낸다.

    Axios.post('/api/video/uploadfiles', formData, config).then((response) => {
      if (response.data.success) {
        // 성공시 할것 적기
        console.log(response.data);

        let variable = {
          filePath: response.data.filePath,
          fileName: response.data.fileName,
        };
        setFilePath(response.data.filePath);

        Axios.post('/api/video/thumbnail', variable).then((response) => {
          console.log(variable);
          if (response.data.success) {
            setDuration(response.data.fileDuration);
            setThumbnailPath(response.data.thumbsFilePath);
          } else {
            alert('썸네일 생성에 실패했습니다.');
          }
        });
      } else {
        alert('비디오 업로드를 실패했습니다.');
      }
    });
  };

  /* onSubmit : 백엔드에 DB에 넣을 데이터 보내기 */
  const onSubmit = (e) => {
    e.preventDefault();

    const variables = {
      writer: user.userData._id, // 리덕스의 state 의 user 가져와서 쓰기
      title: VideoTitle,
      description: Description,
      privacy: Private,
      filePath: FilePath,
      category: Category,
      duration: Duration,
      thumbnail: ThumbnailPath,
    };

    Axios.post('/api/video/uploadVideo', variables) // variables 보내기
      .then((response) => {
        if (response.data.success) {
          // console.log(response.data);
          message.success('성공적으로 업로드를 했습니다.');
          setTimeout(() => {
            props.history.push('/');
          }, 3000);
        } else {
          alert('비디오 업로드에 실패했습니다.');
        }
      });
  };

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Title level={2}> Upload Video</Title>
      </div>

      <Form onSubmit={onSubmit}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* multiple 은 한번에 파일을 여러개 올릴건지 설정하는것이다. maxSize 를 통해서 최대파일크기를 지정할수있다.*/}
          <Dropzone
            accept="video/*"
            onDrop={onDrop}
            multiple={false}
            maxSize={800000000}
          >
            {({ getRootProps, getInputProps }) => (
              <div
                style={{
                  width: '300px',
                  height: '240px',
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

          {ThumbnailPath !== '' && (
            <div>
              <img
                src={`http://localhost:5000/${ThumbnailPath}`}
                alt="thumbnail"
              />
            </div>
          )}
        </div>
        <br />
        <br />
        <label>Title</label>
        {/* onchange가 있어야 input에 타이핑이 된다. */}
        <Input onChange={onTitleChange} value={VideoTitle} /> <br />
        <br />
        <label>Description</label>
        <TextArea onChange={onDescriptionChange} value={Description} />
        <br />
        <br />
        <select onChange={onPrivateChange}>
          {PrivateOptions.map((
            item,
            index // option은 map을 이용했다.
          ) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />
        <select onChange={onCategoryChange}>
          {CategoryOptions.map((item, index) => (
            <option key={index} value={item.label}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />
        <Button type="primary" size="large" onClick={onSubmit}>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default UploadVideoPage;
