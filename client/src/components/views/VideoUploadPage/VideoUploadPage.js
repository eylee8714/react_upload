import React, { useState, useEffect } from 'react';
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import Dropzone from 'react-dropzone';

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

function UploadVideoPage() {
  /* value 값을 input 태그의 state로 만들어준다. state가 db에 들어가게된다. */
  const [VideoTitle, setTitle] = useState('');
  const [Description, setDescription] = useState('');
  const [Private, setPrivate] = useState(0);
  const [Categories, setCategories] = useState('Film & Animation');

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
    setCategories(event.currentTarget.value);
  };

  const onSubmit = () => {};

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Title level={2}> Upload Video</Title>
      </div>

      <Form onSubmit={onSubmit}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Dropzone multiple={false} maxSize={800000000}>
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

          {/* {thumbnail !== "" &&
                    <div>
                        <img src={`http://localhost:5000/${thumbnail}`} alt="haha" />
                    </div>
                } */}
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
