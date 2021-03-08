import React, { useState } from 'react';
import { Button, Input } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux'; // 리덕스의 store에서 userId 가져오기위해 적어주었다.
import SingleComment from './SingleComment';
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
        setComment(''); // 쓴 댓글 없애기
        props.refreshFunction(response.data.result);
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
      {/* VideoDetailPage에서 받아온 commentList들을 SingleComment에 map으로 돌린다. */}
      {props.commentLists &&
        props.commentLists.map(
          (comment, index) =>
            // 몽고db에서 가져왔을때 responseTo가 없는 댓글들만 나타내기
            !comment.responseTo && (
              <SingleComment
                refreshFunction={props.refreshFunction} // 새댓글이 나타나도록 refreshFunction 을 전달해준다.
                comment={comment}
                postId={videoId}
                key={index}
              />
            )
        )}

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
