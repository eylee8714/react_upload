import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import SingleComment from './SingleComment';

function ReplyComment(props) {
  const [ChildCommentNumber, setChildCommentNumber] = useState(0);
  const [OpenReplyComments, setOpenReplyComments] = useState(false);

  useEffect(() => {
    //대댓글수 가져오기
    let commentNumber = 0;
    props.commentLists.map((comment) => {
      if (comment.responseTo === props.parentCommentId) {
        commentNumber++;
      }
    });
    setChildCommentNumber(commentNumber);
  }, [props.commentLists]); //commentLists가 바뀔때마다 전체부분을 다시한번 실행한다.

  let renderReplyComment = () =>
    props.commentLists.map((comment, index) => (
      <React.Fragment key={index}>
        {comment.responseTo === props.parentCommentId && ( // 해당 대댓글만 나타내기위해서, comment.responseTo 와 props.parentCommentId 같은것 만 나타내기
          <div style={{ width: '80%', marginLeft: '40px' }}>
            <SingleComment
              refreshFunction={props.refreshFunction} // 새댓글이 나타나도록 refreshFunction 을 전달해준다.
              comment={comment}
              postId={props.videoId}
            />
            <ReplyComment
              commentLists={props.commentLists}
              postId={props.videoId}
              refreshFunction={props.refreshFunction}
              parentCommentId={comment._id}
            />
          </div>
        )}
      </React.Fragment>
    ));

  //토글 만드는 방법
  const onHandleChange = () => {
    setOpenReplyComments(!OpenReplyComments);
  };

  return (
    <div>
      {ChildCommentNumber > 0 && (
        <p
          style={{ fontSize: '14px', margin: 0, color: 'gray' }}
          onClick={onHandleChange}
        >
          View {ChildCommentNumber} more comment(s)
        </p>
      )}
      {/* OpenReplyComments 가 true일때만 보이도록하기 */}
      {OpenReplyComments && renderReplyComment(props.parentCommentId)}
    </div>
  );
}

export default ReplyComment;
