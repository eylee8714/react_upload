import React, { useEffect, useState } from 'react';
import { Card, Icon, Avatar, Col, Typography, Row } from 'antd';
import axios from 'axios';
import moment from 'moment';
const { Title } = Typography;
const { Meta } = Card;

function SubscriptionPage() {
  /* state에 db에서 가져온 정보를 담는다. */
  const [Video, setVideo] = useState([]);

  useEffect(() => {
    // 로그인된 본인 id 로 구독한 비디오 가져와야한다.
    const variable = { userFrom: localStorage.getItem('userId') };
    axios
      .post('/api/video/getSubscriptionVideos', variable)
      .then((response) => {
        if (response.data.success) {
          setVideo(response.data.videos);
        } else {
          alert('Failed to get subscription videos');
        }
      });
  }, []);

  /* db에서 가져온 video를 map에 넣고돌리기 */

  const renderCards = Video.map((video, index) => {
    var minutes = Math.floor(video.duration / 60);
    var seconds = Math.floor(video.duration - minutes * 60);

    return (
      <Col lg={6} md={8} xs={24} key={index}>
        <div style={{ position: 'relative' }}>
          {/* 비디오디테일로가는 링크를 만든다. */}
          <a href={`/video/${video._id}`}>
            <img
              style={{ width: '100%' }}
              alt="thumbnail"
              src={`http://localhost:5000/${video.thumbnail}`}
            />
            <div
              className=" duration"
              style={{
                bottom: 0,
                right: 0,
                position: 'absolute',
                margin: '4px',
                color: '#fff',
                backgroundColor: 'rgba(17, 17, 17, 0.8)',
                opacity: 0.8,
                padding: '2px 4px',
                borderRadius: '2px',
                letterSpacing: '0.5px',
                fontSize: '12px',
                fontWeight: '500',
                lineHeight: '12px',
              }}
            >
              <span>
                {minutes} : {seconds}
              </span>
            </div>
          </a>
        </div>
        <br />
        <Meta
          avatar={<Avatar src={video.writer.image} />}
          title={video.title}
        />
        <span>{video.writer.name} </span>
        <br />
        <span style={{ marginLeft: '3rem' }}> {video.views}</span>-{' '}
        <span> {moment(video.createdAt).format('MMM Do YY')} </span>
      </Col>
    );
  });

  return (
    <div style={{ width: '85%', margin: '3rem auto' }}>
      <Title level={2}>Subscription</Title>
      <hr />
      {/* map으로 돌린 renderCards 를 적어주었다. */}
      <Row gutter={[32, 16]}>{renderCards}</Row>
    </div>
  );
}

export default SubscriptionPage;
