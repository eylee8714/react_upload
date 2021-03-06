import Axios from 'axios';
import React, { useState } from 'react';
import { useEffect } from 'react';

function Subscribe(props) {
  const userTo = props.userTo;
  const userFrom = props.userFrom;

  const [SubscribeNumber, setSubscribeNumber] = useState(0);
  const [Subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    let subscribeNumberVariables = {
      userTo: userTo,
      userFrom: userFrom,
    };
    Axios.post('/api/subscribe/subscribeNumber', subscribeNumberVariables) // 글 작성자 의 정보를 가져오면 몇명이 구독했는지 알 수 있다.
      .then((response) => {
        if (response.data.success) {
          setSubscribeNumber(response.data.subscribeNumber);
        } else {
          alert('구독자 수 정보를 받아오지 못했습니다.');
        }
      });

    let subscribedVariable = {
      userTo: userTo,
      userFrom: userFrom,
    }; // userFrom 정보는 local storage에있는 userId 로 가져온다.
    Axios.post('/api/subscribe/subscribed', subscribedVariable) // userTo, userFrom 보내서 서버에서 정보 가져온다.
      .then((response) => {
        if (response.data.success) {
          setSubscribed(response.data.subscribed);
        } else alert('정보를 받아오지 못했습니다.');
      });
  }, []);

  const onSubscribe = () => {
    let subscribedVariable = {
      userTo: userTo,
      userFrom: userFrom,
    };
    // 이미 구독중이라면 구독취소하기
    if (Subscribed) {
      Axios.post('/api/subscribe/unSubscribe', subscribedVariable).then(
        (response) => {
          // 서버에서 response를 받아와서 할 내용
          if (response.data.success) {
            // 서버에서 response를 받아와서 할 내용
            setSubscribeNumber(SubscribeNumber - 1); // 구독수를 -1해준다.
            setSubscribed(!Subscribed); // 지금상태와 반대의 상태를 준다.
          } else {
            alert(' 구독취소하는데 실패했습니다.');
          }
        }
      );
    } else {
      // 아직 구독중이 아니라면 구독하기
      Axios.post('/api/subscribe/subscribe', subscribedVariable).then(
        (response) => {
          // 서버에서 response를 받아와서 할 내용
          if (response.data.success) {
            setSubscribeNumber(SubscribeNumber + 1); // 구독수를 -1해준다.
            setSubscribed(!Subscribed); // 지금상태와 반대의 상태를 준다.
          } else {
            alert(' 구독하는데 실패했습니다.');
          }
        }
      );
    }
  };
  return (
    <div>
      <button
        onClick={onSubscribe}
        style={{
          backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`,
          borderRadius: '4px',
          color: 'white',
          padding: '10px 16px',
          fontWeight: '500',
          fontSize: '1rem',
          textTransform: 'uppercase',
        }}
      >
        {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
      </button>
    </div>
  );
}

export default Subscribe;
