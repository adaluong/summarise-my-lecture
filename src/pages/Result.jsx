import React, { useEffect, useState, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Alert, Card } from 'react-bootstrap';
import './Result.css';
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Loader from 'react-loader-spinner';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useReactToPrint } from 'react-to-print'; 
import QnaCards from '../components/QnaCards';

const Result = () => {
  const history = useHistory();
  const componentRef = useRef();
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

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `summarised`,

  });

  /*
  const downloadPDF = () => {
    
   

    const input = document.querySelector('.Result');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('temp/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'JPEG', 0, 0);
        pdf.save("temp.pdf");
        history.push("/temp.pdf");
      })
    
    const doc = new jsPDF();
    doc.html(document.body, {callback: function (doc) {
        doc.save("temp.pdf");
        history.push("/temp.pdf");
      },
      x: 10,
      y: 10
    });
  }
  */

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

  useEffect(() => {
    console.log(qna);
  }, [qna]);

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