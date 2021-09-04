from chat_downloader import ChatDownloader
import os

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


def id_to_chat(videoId: str) -> list:
    chat = ChatDownloader().get_chat(f'https://www.youtube.com/watch?v={videoId}')
    chat_list = []
    for message in chat:
        chat_list.append(chat.format(message))
    return chat_list