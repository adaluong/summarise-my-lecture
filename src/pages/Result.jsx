import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import './Result.css';
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Loader from 'react-loader-spinner';
import { useReactToPrint } from 'react-to-print'; 
import QnaCards from '../components/QnaCards';

const Result = () => {
  const componentRef = useRef();
  const { videoId } = useParams();
  const [qna, setQna] = useState([]);
  const [videoName, setVideoName] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const LoadingIndicator = () => {
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

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `summarised`
  });


  useEffect(() => {
    // this code is executed when the page is loaded/reloaded
    // fetch sends a query to our server with the id of the Youtube video
    // change the url as required
    fetch(`/title?id=${videoId}`)
      .then(r => r.json())
      .catch(e => setError(e))
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
          .catch(e => setError(e))
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
        <strong>{videoName}</strong>
      </h1>
      <LoadingIndicator></LoadingIndicator>
      {error && (
        <Alert variant="danger">
          <Alert.Heading>{error} !</Alert.Heading>
          <p>{errorMessage} <Alert.Link as={Link} to="/">Try again.</Alert.Link></p>
        </Alert>
      )}
      {qna.length !== 0 && !error && loaded && (
        <div className="buttonDiv">
          <button className="primaryButton" onClick={handlePrint}>Download as PDF</button>
        </div>
      )}
      <QnaCards qna={qna} videoId={videoId} ref={componentRef} />
   </div>
  );
}

export default Result;