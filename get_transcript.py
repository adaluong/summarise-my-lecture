from youtube_transcript_api import YouTubeTranscriptApi

def id_to_transcript(video_id: str) -> list:
    """ given a YouTube video ID return a list of dictionaries 
    containing the transcript text and the timestamp for the speech """

    transcript = YouTubeTranscriptApi.get_transcript(video_id)
    
    return [message['text'] for message in transcript]
