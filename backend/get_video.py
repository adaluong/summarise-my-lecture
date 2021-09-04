from youtubesearchpython import *
import json

class CouldNotGetName(Exception):
    pass

def id_to_name(video_id) -> str:
    vid = Video.getInfo(video_id, mode=ResultMode.json)

    try:
        vid = json.loads(vid)
    except:
        raise CouldNotGetName("Video id invalid")

    return vid['title']

if __name__ == "__main__":
    print(id_to_name('9eycvQuXQkw'))