""" MATCH STUDENT QUESTIONS FROM THE LIVE CHAT WITH RESPONSES FROM MODERATORS """

import get_chat
import re

def get_unique_users(chat):
    """ get a set of unique users from the chat """
    users = {message['user'] for message in chat}
    return users 

def get_tagged_user(line, unique_users):
    """ given a chat message, return the user tagged"""
    tagged_user = None
    for user in unique_users:
        tagged_user = re.match(f"@{user}", line)
        if tagged_user != None:
            tagged_user = tagged_user.group(0).replace("@", "")
            line = line.replace(f"@{user} ", "")
            break
    return (tagged_user, line)

def find_corresponding_question(chat, tagged_user, prev_mod_index, index, q):
    """ given a moderator message, find the corresponding question """
    for i in range(index, prev_mod_index, -1):
        message = chat[i]
        if message['user'] == tagged_user:
            message = message['text']
            return message
    return None

def match_chat(chat):
    """ search through questions in the live chat and match them with 
    answers from moderators in the chat """ 

    unique_users = get_unique_users(chat)
    qna = []
    prev_mod_index = 0     # index of the last message sent by a moderator

    for index, message in enumerate(chat):

        privilege, text = message['privilege'], message['text']

        if privilege in ['moderator', 'owner']:

            # match q&a if the moderator tags the person they're answering

            (tagged_user, answer) = get_tagged_user(text, unique_users)
            if tagged_user == None:
                continue

            question = find_corresponding_question(chat, tagged_user, prev_mod_index, index, text)
            if question == None:
                continue

            qna.append(
                {
                    "question": question,
                    "answer": answer,
                    "time": message['time'],
                    "user": tagged_user,
                    "moderator": message['user']
                }
            )
                
            prev_mod_index = index

    return qna
    
if __name__ == '__main__':

    chat = get_chat.id_to_chat_split('4WBbrxZguqk')
    qna = match_chat(chat)

    for pair in qna:
        print(f"\nQUESTION: {pair['question']}")
        print(f"ANSWER: {pair['answer']}\n")
