import './Search.css';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Formik } from 'formik';

const Search = () => {
  const history = useHistory();

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
          errors
        }) => (
          <form id="youtubeForm" name="youtubeForm" onSubmit={handleSubmit}>
            <div className="field">
              <input 
                type="text"
                name="youtubeLink"
                value={values.youtubeLink}
                onChange={handleChange}
                className={!!errors.youtubeLink ? "isInvalid" : ""}
                placeholder="Enter a Youtube link"
                id="youtubeInput"
              />
              <div className="inputLine">
              </div>
            </div>
            <div className="invalidFeedback">
              {errors.youtubeLink}
            </div>
            <button id="youtubeSubmit" type="submit">Summarise!</button>
          </form>
        )}

      </Formik>
      
      <div className="landingDescription">
        <h1>No time, no worries</h1>
        <p>Summarise My Lecture takes your lectures from Youtube and extracts the questions asked by students like you, with their answers from the lecturer and chat moderators.</p>
      </div>
      
   </div>
  );
}

export default Search;