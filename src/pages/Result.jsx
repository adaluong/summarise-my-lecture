import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Alert, Card } from 'react-bootstrap';
import './Result.css';
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Loader from 'react-loader-spinner';

const Result = () => {
  const { videoId } = useParams();
  const [qna, setQna] = useState([]);
  const [videoName, setVideoName] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const LoadingIndicator = props => {
    const { promiseInProgress } = usePromiseTracker();
    return (
      promiseInProgress && loaded &&
      <div
        style={{
        width: "100%",
        height: "100",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
        }}
      >
        <Loader type="ThreeDots" color="#44d9e6" height="100" width="100" />
      </div>
    );  
  }

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
    fetch(`/title?id=${videoId}`)
      .then(r => r.json())
      .then(data => {
        if (data.name) {
          setVideoName(data.name);
          setLoaded(true);
        } else if (data.error) {
          setError(data.error);
          setErrorMessage(data.message);
        }
      })
      .catch(e => setError(e));
  }, []);

  useEffect(() => {
    if (loaded) {
      trackPromise(
        fetch(`/magic?id=${videoId}`)
          .then(r => r.json())
          .then(data => {
            if (data.qna) {
              setQna(data.qna);
            } else {
              setError(data.error);
              setErrorMessage(data.message);
            }
          })
          .catch(e => setError(e))
      );
    }
  }, [loaded])

  return (
    <div className="Result">
      <h1>
        {videoName}
      </h1>
      <LoadingIndicator></LoadingIndicator>
      {error && qna !== [] && (
        <Alert variant="danger">
          <Alert.Heading>{error} !</Alert.Heading>
          <p>{errorMessage} <Alert.Link as={Link} to="/">Try again.</Alert.Link></p>
        </Alert>
      )}
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