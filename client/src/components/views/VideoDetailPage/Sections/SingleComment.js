import React, { useState } from 'react';
import { Comment, Avatar, Button, Input } from 'antd';
import Axios from 'axios';
import { useSelector } from 'react-redux';
// import LikeDislikes from './LikeDislikes';
const { TextArea } = Input;

function SingleComment(props) {
  const user = useSelector((state) => state.user);
  const [CommentValue, setCommentValue] = useState('');
  const [OpenReply, setOpenReply] = useState(false); // 답글이 처음엔 숨겨져있어야하니까 false로 한다.
  const handleChange = (e) => {
    setCommentValue(e.currentTarget.value);
  };

  const openReply = () => {
    setOpenReply(!OpenReply); // 답글보기를 클릭하면 토글이 될수있도록 하기
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const variables = {
      content: CommentValue,
      writer: user.userData._id,
      postId: props.postId,
      responseTo: props.comment._id,
    };

    Axios.post('/api/comment/saveComment', variables).then((response) => {
      if (response.data.success) {
        console.log(response.data.result);
        setCommentValue(''); // 쓴 댓글 없애기
        // setOpenReply(!OpenReply);
        props.refreshFunction(response.data.result);
      } else {
        alert('Failed to save Comment');
      }
    });
  };

  const actions = [
    // <LikeDislikes comment commentId={props.comment._id} userId={localStorage.getItem('userId')} />,
    <span onClick={openReply} key="comment-basic-reply-to">
      Reply to{' '}
    </span>, // 답글보기 토글되도록 만들기
  ];

  console.log(props.comment);
  return (
    <div>
      <Comment
        actions={actions}
        author={props.comment.writer.name}
        avatar={<Avatar src={props.comment.writer.image} alt="image" />}
        content={<p>{props.comment.content}</p>}
      ></Comment>

      {OpenReply && ( // OpenReply가 트루일때만 해당 태그 나타내기
        <form style={{ display: 'flex' }} onSubmit={onSubmit}>
          <TextArea
            style={{ width: '100%', borderRadius: '5px' }}
            onChange={handleChange}
            value={CommentValue}
            placeholder="write some comments"
          />
          <br />
          <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>
            Submit
          </Button>
        </form>
      )}
    </div>
  );
}

export default SingleComment;
