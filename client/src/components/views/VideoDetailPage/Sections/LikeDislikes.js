import React, { useEffect } from 'react';
import { Tooltip, Icon } from 'antd';
import Axios from 'axios';
import { useState } from 'react';

function LikeDislikes(props) {
  const [Likes, setLikes] = useState(0); // 좋아요의 데이터
  const [Dislikes, setDislikes] = useState(0); // 싫어요의 데이터

  const [LikeAction, setLikeAction] = useState(null); // 좋아요를 눌렀는지에 대한 데이터
  const [DisLikeAction, setDisLikeAction] = useState(null); // 싫어요를 눌렀는지에 대한 데이터

  let variable = {};

  //video에서 온거면, video 좋아요, 싫어요 이기떄문에 videoId, userId가 있어야한다.
  if (props.video) {
    variable = { videoId: props.videoId, userId: props.userId };
    // 아니면, 댓글의 좋아요, 싫어요 이기떄문에, commentId, userId가 있어야한다.
  } else {
    variable = { commentId: props.commentId, userId: props.userId };
  }

  useEffect(() => {
    Axios.post('/api/like/getLikes', variable) //
      .then((response) => {
        if (response.data.success) {
          // 얼마나 많은 좋아요를 받았는지 받아온다.
          setLikes(response.data.likes.length);

          // 내가 이미 그 좋아요를 눌렀는지
          response.data.likes.map((like) => {
            if (like.userId === props.userId) {
              // like의 userId 와 로그인한 userId가 같으면,
              setLikeAction('liked'); // 내가 이미 눌렀다고 나타낸다.
            }
          });
        } else {
          alert('Like의 정보를 가져오지 못했습니다.');
        }
      });

    Axios.post('/api/like/getDislikes', variable).then((response) => {
      if (response.data.success) {
        // 얼마나 많은 싫어요를 받았는지 받아온다.
        setDislikes(response.data.dislikes.length);

        // 내가 이미 그 싫어요를 눌렀는지
        response.data.dislikes.map((dislike) => {
          if (dislike.userId === props.userId) {
            // dislike의 userId 와 로그인한 userId가 같으면,
            setDisLikeAction('disliked'); // 내가 이미 눌렀다고 나타낸다.
          }
        });
      } else {
        alert('DisLike의 정보를 가져오지 못했습니다.');
      }
    });
  }, []);

  const onLike = () => {
    if (LikeAction === null) {
      // 아직 클릭이 안되었을때 좋아요
      Axios.post('/api/like/upLike', variable).then((response) => {
        if (response.data.success) {
          setLikes(Likes + 1); // 1 올리기
          setLikeAction('liked'); // liked 상태로 주기

          // 싫어요를 눌렀던 상태라면
          if (DisLikeAction !== null) {
            setDisLikeAction(null); //
            setDislikes(Dislikes - 1); // 싫어요 1 내리기
          }
        } else {
          alert('Like를 올리지 못했습니다.');
        }
      });
    } else {
      /* 좋아요 취소하기 */
      Axios.post('/api/like/unLike', variable) //
        .then((response) => {
          if (response.data.success) {
            setLikes(Likes - 1); // 1 내리기
            setLikeAction(null); // null 상태로 주기
          } else {
            alert('Like를 내리지 못했습니다.');
          }
        });
    }
  };

  const onDislike = () => {
    if (DisLikeAction !== null) {
      // DisLikeAction이 null 일때  (클릭이 안되어있을때)
      Axios.post('/api/like/unDisLike', variable) //
        .then((response) => {
          if (response.data.success) {
            setDislikes(Dislikes - 1); // 1 내리기
            setDisLikeAction(null); // null 상태로 주기
          }
        });
    } else {
      /* 싫어요 누르기 */
      Axios.post('/api/like/upDislike', variable) //
        .then((response) => {
          if (response.data.success) {
            setDislikes(Dislikes + 1); // 싫어요 1 올리기
            setDisLikeAction('disliked');

            // 좋아요를 눌렀던 상태라면
            if (LikeAction !== null) {
              setLikeAction(null); //
              setLikes(Likes - 1); // 싫어요 1 내리기
            }
          } else {
            alert('dislike를 지우지 못했습니다.');
          }
        });
    }
  };

  return (
    <div>
      <span key="comment-basic-like">
        <Tooltip title="Like">
          <Icon
            type="like"
            theme={LikeAction === 'liked' ? 'filled' : 'outlined'} // LikeAction에서 좋아요를 눌렀으면, 색칠된 아이콘, 아니면 빈 아이콘
            onClick={onLike}
          />
        </Tooltip>
        {/* LIkes 의 갯수 */}
        <span style={{ paddingLeft: '8px', cursor: 'auto' }}> {Likes} </span>
      </span>

      <span key="comment-basic-dislike">
        <Tooltip title="Dislike">
          <Icon
            type="dislike"
            theme={DisLikeAction === 'disliked' ? 'filled' : 'outlined'}
            onClick={onDislike}
          />
        </Tooltip>
        {/* DoslIkes 의 갯수 */}
        <span style={{ paddingLeft: '8px', cursor: 'auto' }}> {Dislikes} </span>
      </span>
    </div>
  );
}

export default LikeDislikes;
