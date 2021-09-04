import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import './Result.css';

const Result = () => {
  const { videoId } = useParams();
  const [qna, setQna] = useState([]);
  const [videoName, setVideoName] = useState("");

  const timestampToSeconds = (timestamp) => {
    const splitTime = timestamp.split(":");
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    if (splitTime.length === 2) {
      minutes = splitTime[0];
      seconds = splitTime[1];
    } else if (splitTime.length === 3) {
      hours = splitTime[0];
      minutes = splitTime[1];
      seconds = splitTime[2];
    }
    return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
  }

  useEffect(() => {
    // this code is executed when the page is loaded/reloaded
    // fetch sends a query to our server with the id of the Youtube video
    // change the url as required
    fetch(`/magic?id=${videoId}`)
      .then(r => r.json())
      .then(data => {
        setQna(data.qna);
        setVideoName(data.name);
      });
  }, []);

  return (
    <div className="Result">
      <h1>
        {videoName}
      </h1>
      <div className="qna">
        {qna.map((element, idx) => (
          <Card className="qnaCard" key={idx}>
            <Card.Header className="qnaQuestion">
              <strong><a rel="noreferrer" target="_blank" href={`https://youtube.com/watch?v=${videoId}&t=${timestampToSeconds(element.time)}`}>{element.time}</a> </strong>
              {element.question}
            </Card.Header>
            <Card.Text className="qnaAnswer">
              <strong>A: </strong>{element.answer}
            </Card.Text>
          </Card>
        ))}
      </div>
   </div>
  );
}

export default Result;