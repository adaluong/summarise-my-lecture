# matches questions from live chat with responses from moderators 

import get_chat
import re
from fuzzywuzzy import fuzz

def get_unique_users(chat):
    """ get a dictionary of unique users from the chat """
    
    unique_users = { }

    for message in chat:
        unique_users[message['user']] = message['privilege']

    return unique_users 

def is_question(message, unique_users, q):
    """ returns the message if it is a question and None if it is not"""
    
    line = get_tagged_user(message['text'], unique_users)[1]

    if '?' in line:
        return line

    START_WORDS = ['can', 'do', 'will', 'how', 'when', 'what', 'where',
        'why', 'is', 'does', "doesn't", 'if', 'for', 'did', 'is']

    for word in START_WORDS:
        if line.lower().startswith(word):
            return line

    if fuzz.ratio(line, q) > 20:
        return line

    return None


def find_question_expanded(message, unique_users, q):
    """ finding potential questions with extra checks"""

    user_tagged = get_tagged_user(message['text'], unique_users)[0]

    # check if this message is an answer to another student's question
    if user_tagged != None and unique_users[user_tagged] == 'member':
        return None

    # check if message is a question
    question = is_question(message, unique_users, q)

    return question

def get_tagged_user(line, unique_users):
    """ given a chat message, return the user tagged"""
    tagged_user = None

    for user in unique_users:
    
        tagged_user = re.search(f"@{user}\s*", line)
    
        if tagged_user != None:
            tagged_user = tagged_user.group(0).replace("@", "").strip()
            line = line.replace(f"@{user} ", "")
            break
    
    return (tagged_user, line)

def find_corresponding_question(chat, tagged_user, prev_mod_index, index, q, unique_users):
    """ given a moderator message, find the corresponding question """

    # searches from the previous message sent by the moderator
    for i in range(index, prev_mod_index[1], -1):
        message = chat[i]
        if message['user'] == tagged_user:
            question = is_question(message, unique_users, q)
            if question != None:
                return question
    
    # expanding the search space ft. some additional checks
    for i in range(prev_mod_index[1], prev_mod_index[0], -1):
        message = chat[i]
    
        if message['user'] == tagged_user:
            question = find_question_expanded(message, unique_users, q)
    
            if question != None:
                return question

    return None

def match_chat(chat):
    """ search through questions in the live chat and match them with 
    answers from moderators in the chat """ 

    unique_users = get_unique_users(chat)
    qna = {}
    prev_mod_index = (0, 0) # index of the last message sent by a moderator

    for index, message in enumerate(chat):

        privilege, text = message['privilege'], message['text']

        if privilege in ['moderator', 'owner']:

            # match q&a if the moderator tags the person they're answering
            (tagged_user, answer) = get_tagged_user(text, unique_users)
            if tagged_user == None:
                continue
            
            # moderator probably asked a clarifying question. ignore these.
            if '?' in answer:
                continue

            question = find_corresponding_question(chat, tagged_user, prev_mod_index, index, text, unique_users)
            if question == None:
                continue

            if question in qna:
                qna[question]['answer'] += f'\n{answer}'
            else:
                qna[question] = {
                    "question": question,
                    "answer": f'(MODERATOR) {answer}',
                    "time": message['time'],
                    "user": tagged_user,
                    "moderator": message['user'],
                    "moderator_response": True
                }
            
            # updates qna search space 
            prev_mod_index = (prev_mod_index[0], index)

    qna = list(qna.values())
    return qna
    
if __name__ == '__main__':

    chat = get_chat.id_to_chat_split('PVUM2ezD9OE')
    qna = match_chat(chat)

    for question in qna:
        print(f"QUESTION: {question}")
        print(f"ANSWER: {qna[question]['answer']}\n")
