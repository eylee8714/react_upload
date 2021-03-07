import React, { useState } from 'react';
import { Button, Input } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux'; // 리덕스의 store에서 userId 가져오기위해 적어주었다.
const { TextArea } = Input;

function Comments(props) {
  const videoId = props.postId; // 부모컴포넌트인 VideoDetailPage에서 props로 가져왔다.
  const user = useSelector((state) => state.user);
  const [Comment, setComment] = useState('');

  // textarea 타이핑하면 변경될 수 있도록 적었다.
  const handleChange = (e) => {
    setComment(e.currentTarget.value);
  };

  const onSubmit = (e) => {
    e.preventDefault(); // submit하면 새로고침 하는것 막기

    const variables = {
      content: Comment,
      writer: user.userData._id, // 리덕스의 store에서 userId 가져오기위해 적어주었다. (localstorage에서 가져오는 방법도 있다.)
      postId: videoId,
    };

    axios.post('/api/comment/saveComment', variables).then((response) => {
      if (response.data.success) {
        console.log(response.data.result);
      } else {
        alert('댓글을 저장하지 못했습니다.');
      }
    });
  };

  return (
    <div>
      <br />
      <p> replies</p>
      <hr />
      {/* Comment Lists  */}
      {/* {console.log(props.CommentLists)} */}

      {/* Root Comment Form */}
      <form style={{ display: 'flex' }} onSubmit={onSubmit}>
        <TextArea
          style={{ width: '100%', borderRadius: '5px' }}
          onChange={handleChange}
          value={Comment}
          placeholder="write some comments"
        />
        <br />
        <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>
          Submit
        </Button>
      </form>
    </div>
  );
}

export default Comments;
