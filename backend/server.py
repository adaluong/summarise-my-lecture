from flask import Flask, request
from get_transcript import id_to_transcript
from get_chat import id_to_chat
from magic import magic
from get_video import id_to_name
from chat_downloader.errors import NoChatReplay, ChatDownloaderError
from youtube_transcript_api._errors import TranscriptsDisabled, CouldNotRetrieveTranscript
from get_video import CouldNotGetName
from errors import *

APP = Flask(__name__)

@APP.errorhandler(APIError)
def handle_exception(err):
    response = {"error": err.description}
    response["message"] = "" if len(err.args) == 0 else err.args[0]
    APP.logger.error(f"{err.description}: {response['message']}")
    return response, err.code

@APP.route("/transcript", methods=["get"])
def get_transcript_from_id():
    video_id = request.args.get("id")

    transcript = id_to_transcript(video_id)

    transcriptString = "\n".join(transcript)

    return {
        "transcript": transcriptString
    } 

@APP.route("/title", methods=["get"])
def get_title():
    video_id = request.args.get("id")

    try:
        name = id_to_name(video_id)
    except CouldNotGetName:
        raise APIVideoError("Could not retrieve this video. Please check that the link is correct.")
    except:
        raise APIError("Could not retrieve this video.")

    return {
        "name": name
    }

@APP.route("/magic", methods=["get"])
def get_magic():
    video_id = request.args.get("id")

    try:
        qna = magic(id_to_transcript(video_id), id_to_chat(video_id))
    except TranscriptsDisabled:
        raise APITranscriptError("Transcripts have been disabled on this video.")
    except CouldNotRetrieveTranscript:
        raise APITranscriptError("Transcript could not be retrieved from this video.")
    except NoChatReplay:
        raise APIChatError("This video does not have a chat replay.")
    except ChatDownloaderError:
        raise APIChatError("Chat could not be retrieved from this video.")
    except:
        raise APIError("Could not retrieve video details.")

    return {
        "qna": qna
    }
