from flask import Flask, request
<<<<<<< HEAD
from backend.get_transcript import id_to_transcript
from backend.get_chat import id_to_chat, id_to_chat_split
from backend.magic import magic
from backend.get_video import id_to_name
from backend.match_chat import match_chat
from chat_downloader.errors import NoChatReplay, ChatDownloaderError
from youtube_transcript_api._errors import TranscriptsDisabled, CouldNotRetrieveTranscript
from backend.errors import *
=======
from get_transcript import id_to_transcript
from get_chat import id_to_chat, id_to_chat_split
from magic import magic
from get_video import id_to_name, CouldNotGetName
from match_chat import match_chat
from chat_downloader.errors import NoChatReplay, ChatDownloaderError
from youtube_transcript_api._errors import TranscriptsDisabled, CouldNotRetrieveTranscript
from errors import *
>>>>>>> b8fae0385e3e81d8b20854792da1cc0e4ff9665b

APP = Flask(__name__, static_folder="../build", static_url_path="/")

@APP.errorhandler(APIError)
def handle_exception(err):
    response = {"error": err.description}
    response["message"] = "" if len(err.args) == 0 else err.args[0]
    APP.logger.error(f"{err.description}: {response['message']}")
    return response, err.code

@APP.route("/")
def index():
    return APP.send_static_file("index.html")

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
        qna.extend(match_chat(id_to_chat_split(video_id)))
    except TranscriptsDisabled:
        raise APITranscriptError("Transcripts have been disabled on this video.")
    except CouldNotRetrieveTranscript as e:
        raise APITranscriptError(f"Transcript could not be retrieved from this video: {e}")
    except NoChatReplay:
        raise APIChatError("This video does not have a chat replay.")
    except ChatDownloaderError:
        raise APIChatError("Chat could not be retrieved from this video.")
    except:
        raise APIError("Could not retrieve video details.")

    return {
        "qna": qna
    }
