from chat_downloader import ChatDownloader

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
            msg['privilege'] = 'student'

        chat_list.append(msg)

    return chat_list

if __name__ == "__main__":
    url = 'https://www.youtube.com/watch?v=Vi231_PujYI'
    url = 'https://www.youtube.com/watch?v=4WBbrxZguqk'
    # chat = ChatDownloader().get_chat(url)       # create a generator
    # for message in chat:                        # iterate over messages
    #     print(chat.format(message))             # print the formatted message
    #     print(message)
    
    chat = id_to_chat_split('4WBbrxZguqk')
    print(chat)