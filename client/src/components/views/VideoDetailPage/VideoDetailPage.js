import React, { useEffect, useState } from 'react';
import { List, Avatar, Row, Col } from 'antd';
import Axios from 'axios';
import SideVideo from './Sections/SideVideo';

function VideoDetailPage(props) {
  const videoId = props.match.params.videoId; // 주소에있는 videoId 를 가져온다. App.js 에서 /:videoId 적었기때문에 가져올수있다.  /: 뒤가 parameter로 전해질 props 이름이다.
  const variable = { videoId: videoId };

  //서버에서 데이터 받아오기
  const [VideoDetail, setVideoDetail] = useState([]);

  useEffect(() => {
    Axios.post('/api/video/getVideoDetail', variable) //
      .then((response) => {
        if (response.data.success) {
          console.log(response.data.video);
          setVideoDetail(response.data.videoDetail); // 서버에서 mongoDB 내용을 넣어준 vidoeDetail 데이터를 받는다.
        } else {
          alert('비디오 정보 가져오기를 실패했습니다.');
        }
      });
  }, []);

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

          <List.Item
          // actions={[
          //   <LikeDislikes
          //     video
          //     videoId={videoId}
          //     userId={localStorage.getItem('userId')}
          //   />,
          //   <Subscriber
          //     userTo={Video.writer._id}
          //     userFrom={localStorage.getItem('userId')}
          //   />,
          // ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar src={VideoDetail.writer && VideoDetail.writer.image} />
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
}

export default VideoDetailPage;
