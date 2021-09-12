# lecture repeats the question
from fuzzywuzzy import fuzz
import get_transcript
import get_chat
from errors import NoQuestionsFound

def magic(transcript, chat):
    keywords = ["ask", "questions", "ask", "question"]
    qna = []

    for i in range(len(transcript) - 20):
        line = transcript[i]
        line_set = set(line.split(" "))
        keywords_set = set(keywords)
        
        if not keywords_set.isdisjoint(line_set):
            question = transcript[i:i+3]
            answer = transcript[i+3:i+20]

            # print(f'Question: {" ".join(question)}\n')
            # print(f'Answer: {" ".join(answer)}\n')
        
            for comment in chat:
                time = comment.split(" | ")[0]
                potential_question = comment.split(" | ")[1]
                if (fuzz.ratio(question, potential_question) > 48):
                    print(f'{potential_question}')
                    print(f'Question: {" ".join(question)}') 
                    print(f'Answer: {" ".join(answer)}\n')
                    qna.append(
                        {
                            "question": " ".join(question),
                            "answer": " ".join(answer),
                            "time": time
                        }
                    )

    return qna

if __name__ == '__main__':
    with open("transcript.txt") as f:
        transcript = [line.strip() for line in f.readlines()]

    with open("chat.txt") as g:
        chat = [line.strip() for line in g.readlines()]

    videoId = "4WBbrxZguqk"
    transcript = get_transcript.id_to_transcript(videoId)
    chat = get_chat.id_to_chat(videoId)
    
    print(magic(transcript,chat))

    marc = "what about alphabetical ordering of matt and mark"
    chat = "What about alphabetical ordering of matt and marc"
    # print(fuzz.ratio(marc, chat))

    chat2 = "all of the students will do final exam at the same time?"

    marc = "is it just returning one zero or negative one or does it return the magnitude of the difference"
    chat = "Is it just returning 1/0/-1 or does it return the magnitude of the diffference?"
    # print(fuzz.ratio(marc, chat))
