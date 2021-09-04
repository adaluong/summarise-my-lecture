from flask import Flask, request
from get_transcript import id_to_transcript
from get_chat import id_to_chat, id_to_chat_split
from magic import magic
from get_video import id_to_name
from match_chat import match_chat

APP = Flask(__name__)

@APP.route("/dummy_transcript", methods=["GET"])
def get_dummy_transcript():
    transcript = id_to_transcript("Vi231_PujYI")

    transcriptString = "\n".join(transcript)

    return {
        "transcript": transcriptString
    }

@APP.route("/transcript", methods=["get"])
def get_transcript_from_id():
    video_id = request.args.get("id")

    transcript = id_to_transcript(video_id)

    transcriptString = "\n".join(transcript)

    return {
        "transcript": transcriptString
    } 

@APP.route("/magic", methods=["get"])
def get_magic():
    video_id = request.args.get("id")

    name = id_to_name(video_id)
    
    qna = magic(id_to_transcript(video_id), id_to_chat(video_id))
    qna.extend(match_chat(id_to_chat_split(video_id)))

    return {
        "name": name,
        "qna": qna
    }


'''
[
            {
                "question": "how do i do a linked list",
                "answer": "i love linked lists !"
            },
            {
                "question": "when is the exam",
                "answer": "the exam is tomorrow"
            }
        ]
'''