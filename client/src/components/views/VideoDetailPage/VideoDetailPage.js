import React, { useEffect, useState } from 'react';
import { List, Avatar, Row, Col } from 'antd';
import Axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';

function VideoDetailPage(props) {
  const videoId = props.match.params.videoId; // 주소에있는 videoId 를 가져온다. App.js 에서 /:videoId 적었기때문에 가져올수있다.  /: 뒤가 parameter로 전해질 props 이름이다.
  const variable = { videoId: videoId };

  //서버에서 데이터 받아오기
  const [VideoDetail, setVideoDetail] = useState([]);

  useEffect(() => {
    Axios.post('/api/video/getVideoDetail', variable) //
      .then((response) => {
        if (response.data.success) {
          setVideoDetail(response.data.videoDetail); // 서버에서 mongoDB 내용을 넣어준 vidoeDetail 데이터를 받는다.
        } else {
          alert('비디오 정보 가져오기를 실패했습니다.');
        }
      });
  }, []);
  if (VideoDetail.writer) {
    // VideoDetail.writer 가 렌더 되기 전에 오류가나서, 이렇게 넣어주었다.
    return (
      <Row>
        <Col lg={18} xs={24}>
          <div
            className="postPage"
            style={{ width: '100%', padding: '3rem 4em' }}
          >
            <video
              style={{ width: '100%' }}
              src={`http://localhost:5000/${VideoDetail.filePath}`}
              controls
            ></video>

            {/* antd의 규칙때문에 [<Subscribe/>] 대괄호를 붙여주었다. */}
            {/* userTo로 props이용해서 작성자 정보를 Subscribe 컴포넌트에 보내준다. */}
            {/* userFrom으로 props이용해서 로그인한 유저정보를 Subscribe 컴포넌트에 보내준다. */}
            <List.Item
              actions={[
                <Subscribe
                  userTo={videoId}
                  userFrom={localStorage.getItem('userId')}
                />,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={VideoDetail.writer && VideoDetail.writer.image}
                  />
                }
                title={VideoDetail.title}
                description={VideoDetail.description}
              />
              <div></div>
            </List.Item>

            {/* <Comments
            CommentLists={CommentLists}
            postId={VideoDetail._id}
            refreshFunction={updateComment}
          /> */}
          </div>
        </Col>
        <Col lg={6} xs={24}>
          <SideVideo />
        </Col>
      </Row>
    );
  } else {
    return <div>Loading...</div>;
  }
}

export default VideoDetailPage;
