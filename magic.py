# matches questions from live chat with responses from lecturer/speaker 

from fuzzywuzzy import fuzz

def is_responding_to_chat(transcript_text, i):
    """ determines if speech from the transcript is in response to the chat"""

    keywords_set = {"ask", "asking", "asks", "asked", "question", "questions", 
            "chat", "chats", "messages"}

    transcript_line = transcript_text[i]
    transcript_line_set = set(transcript_line.split(" "))
    
    if not keywords_set.isdisjoint(transcript_line_set):
        speech = transcript_text[i:i+3]
        answer = transcript_text[i+3:i+20]
        return (speech, answer)
    
    return (None, None)

def magic(transcript, chat):
    """ matches questions from live chats with answers from lecture video"""
    qna = {}

    for i in range(len(transcript) - 20):

        speech, answer = is_responding_to_chat(transcript, i)
        if speech == None:
            continue

        for comment in chat:
            
            potential_question = comment['text']

            # if the lecturer repeats or paraphrases the question
            if (fuzz.ratio(speech, potential_question) > 48):
                if potential_question not in qna:
                    qna[potential_question] = {
                        "question": potential_question,
                        "answer": " ".join(answer),
                        "time": comment['time'],
                        "moderator_response": False,
                    }
                    break

    qna = list(qna.values())
    return qna