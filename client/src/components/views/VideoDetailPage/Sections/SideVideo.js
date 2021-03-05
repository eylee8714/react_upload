import Axios from 'axios';
import React, { useEffect, useState } from 'react';

function SideVideo() {
  const [sideVideos, setsideVideos] = useState([]);

  useEffect(() => {
    Axios.get('/api/video/getVideos') //
      .then((response) => {
        if (response.data.success) {
          // 서버에서 데이터를 성공적으로 가져왔다면,
          //   console.log(response.data);
          setsideVideos(response.data.videos);
        } else {
          alert('비디오 가져오기를 실패했습니다.');
        }
      });
  }, []);

  const renderSideVideo = sideVideos.map((video, index) => {
    var minutes = Math.floor(video.duration / 60);
    var seconds = Math.floor(video.duration - minutes * 60);

    return (
      <div
        key={index} // index를 key로 넣어줘야 에러가 안난다.
        style={{ display: 'flex', marginTop: '1rem', padding: '0 2rem' }}
      >
        <div style={{ width: '40%', marginRight: '1rem' }}>
          <a href={`/video/${video._id}`} style={{ color: 'gray' }}>
            <img
              style={{ width: '100%' }}
              src={`http://localhost:5000/${video.thumbnail}`}
              alt="thumbnail"
            />
          </a>
        </div>

        <div style={{ width: '50%' }}>
          <a href={`/video/${video._id}`} style={{ color: 'gray' }}>
            <span style={{ fontSize: '1rem', color: 'black' }}>
              {video.title}{' '}
            </span>
            <br />
            <span>{video.writer.name}</span>
            <br />
            <span>{video.views}</span>
            <br />
            <span>
              {minutes} : {seconds}
            </span>
            <br />
          </a>
        </div>
      </div>
    );
  });

  return <React.Fragment>{renderSideVideo}</React.Fragment>;
}

export default SideVideo;
