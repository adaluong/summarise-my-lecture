import './Search.css';
import React, { useState } from 'react';
import { Form, Button, Card, Nav } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { Formik } from 'formik';

const Search = () => {
  const history = useHistory();
  const[activeTab, setActiveTab] = useState("youtube");

  // parses link for video id
  // returns null if invalid id
  const parseLink = (inputLink) => {
    // regex to parse video id from
    // https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
    const reg = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = inputLink.match(reg);
    if (!match || match[7].length !== 11) {
      return null;
    }
    return match[7];
  }

  const submitLink = (inputLink) => {
    const videoId = parseLink(inputLink);
    history.push(`/result/${videoId}`);
  }

  return (
    <div className="Search">
      <h1>
        Summarise My Lecture
      </h1>
      <Card className="formCard">
        <Card.Header>
          <Nav variant="tabs" defaultActiveKey="youtubeTab">
            <Nav.Item>
              <Nav.Link eventKey="youtubeTab" onSelect={() => setActiveTab("youtube")}>
                Youtube
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="uploadTab" onSelect={() => setActiveTab("upload")}>
                Upload
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body className="formCardBody">
          {activeTab === "youtube" && (
            <Formik
              initialValues={{ youtubeLink: '' }}
              validate={values => {
                const errors = {};
                if (!values.youtubeLink || !parseLink(values.youtubeLink)) {
                  errors.youtubeLink = "Enter valid Youtube link"
                }
                return errors;
              }}
              onSubmit={(values) => {
                submitLink(values.youtubeLink);
              }}
            >
              {({
                handleSubmit,
                handleChange,
                values,
                errors,
              }) => (
                <Form noValidate name="youtubeForm" onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formVideoLink">
                    <Form.Control
                      type="text"
                      name="youtubeLink"
                      value={values.youtubeLink}
                      onChange={handleChange}
                      isInvalid={!!errors.youtubeLink}
                      placeholder="Enter a Youtube link"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.youtubeLink}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Button variant="primary" type="submit">Summarise!</Button>
                </Form>
              )}
            </Formik>
            )}
          {activeTab === "upload" && (
            <Form name="uploadForm">
              <Form.Group controlId="uploadTranscript" className="mb-3">
                <Form.Label>Upload lecture recording</Form.Label>
                <Form.Control type="file" />
              </Form.Group>
              <Form.Group controlId="uploadChat" className="mb-3">
                <Form.Label>Upload chat records</Form.Label>
                <Form.Control type="file" />
              </Form.Group>
              <Button variant="primary" type="submit">
                Summarise!
              </Button>
            </Form>
          )}
        </Card.Body>
     </Card>
   </div>
  );
}

export default Search;