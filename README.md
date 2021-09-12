# summarise my lecture
### https://summarise-my-lecture.herokuapp.com/
A web app that automatically generates Q&A summaries from a given Youtube video link with questions from live lecture chats and the corresponding answer from moderators in the chat or the lecturer.

Want to give it a try? Paste this link https://www.youtube.com/watch?v=4WBbrxZguqk&t=7s or any lecture into the app and hit summarise!

Watch the product pitch [here](https://www.youtube.com/watch?v=fJBVRQbtfBo&list=PLtdbwEd-4QWHZTWOyB2W73nn9hwAoLj6c&index=19). 

## how it works
Paste in lecture video link which was Livestreamed on Youtube, hit the summarise button and our app will:
- Fetch the transcript and live chat data from the video
- Use intelligent string matching that employs natural language processing techniques such as Levenshtein distance to return a list of questions asked by students along with the corresponding answers provided by moderators or the lecturer.
- Provides a timestamp and a direct hyperlink to exactly when the question was answered. 

## getting started (running locally)
- add `"proxy": "http://localhost:5000"` to package.json
- `yarn install` to install JS dependencies
- `yarn start-backend` to start the server
- `yarn start` to start the frontend

If things aren't working you might have to install the python dependencies
- `python3 -m venv venv`
- `source venv/bin/activate`
- `pip install -r requirements.txt`
