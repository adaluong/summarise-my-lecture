import React, { Component } from 'react';
import { Card } from 'react-bootstrap';
import './QnaCards.css';

class QnaCards extends Component {
  render() {
    const { qna, videoId, videoTitle } = this.props;

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

    return (
      <div className="qna">
        <h1 className="hiddenTitle"><strong>{videoTitle}</strong></h1>
        {qna.map((element, idx) => (
          <div key={idx}>
          <div className="pageBreak" key={`break-${idx}`} />
          <Card className="qnaCard" key={`card${idx}`}>
            <Card.Header className="qnaQuestion">
              <strong><a rel="noreferrer" target="_blank" href={`https://youtube.com/watch?v=${videoId}&t=${timestampToSeconds(element.time)}`}>{element.time}</a> </strong>
              {element.question}
            </Card.Header>
            <Card.Text className="qnaAnswer">
              <strong>A: </strong>{element.answer}
            </Card.Text>
          </Card>
          </div>
        ))}
      </div>
    )
  }
}

export default QnaCards;