from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import JSONFormatter

video_id ='Vi231_PujYI'
video_id = '4WBbrxZguqk' # lecture 7 21T1

def id_to_transcript(video_id: str) -> list:
    transcript = YouTubeTranscriptApi.get_transcript(video_id)
    # for message in transcript:
    #     print(message)
    text = [message['text'] for message in transcript]

    return text

if __name__ == "__main__":
    text = id_to_transcript(video_id)
    print(text)
