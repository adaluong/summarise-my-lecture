from youtubesearchpython import *
import json
from errors import CouldNotGetName

def id_to_name(video_id) -> str:
    """ get the title of a YouTube video given its video id """
    vid = Video.getInfo(video_id, mode=ResultMode.json)
    try:
        vid = json.loads(vid)
    except:
        raise CouldNotGetName("Video id invalid")

    return vid['title']

if __name__ == "__main__":
    print(id_to_name('9eycvQuXQkw'))