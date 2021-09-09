from chat_downloader import ChatDownloader
import os

def id_to_chat(videoId: str) -> list:
    chat = ChatDownloader().get_chat(f'https://www.youtube.com/watch?v={videoId}')
    chat_list = []
    for message in chat:
        chat_list.append(chat.format(message))
    return chat_list

def id_to_chat_split(videoId: str) -> list:
    """ return a list of dictionaries consisting of the chat message, user, 
    timestamp, and moderator status"""
    
    chat = ChatDownloader().get_chat(f'https://www.youtube.com/watch?v={videoId}')
    chat_list = []
    for message in chat:
        msg = {

        }

        msg['time'] = message['time_text']
        msg['text'] = message['message']
        msg['user'] = message['author']['name']

        try:
            msg['privilege'] = message['author']['badges'][0]['icon_name']
        except:
            msg['privilege'] = 'member'

        chat_list.append(msg)

    return chat_list


if __name__ == "__main__":
    # pass in youtube link
    url = input("Youtube Link: ")

    # generate valid filename
    i = 0
    while os.path.exists(f"./chat/chat_{i}.txt"):
        i += 1

    # create new file
    file = open(f"./chat/chat_{i}.txt", "w")

    # create a generator, iterate over messages, write to file
    chat = ChatDownloader().get_chat(url)
    for message in chat:
        file.write(chat.format(message) + "\n")
    
    file.close()
