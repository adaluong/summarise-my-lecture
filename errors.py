class APIError(Exception):
    code = 500
    description = "Error"

class APITranscriptError(APIError):
    code = 400
    description = "Transcript error"

class APIChatError(APIError):
    code = 400
    description = "Live chat error"

class APIVideoError(APIError):
    code = 400
    description = "Video error"

class CouldNotGetName(Exception):
    pass

class NoQuestionsFound(Exception):
    code = 400
    description = "No questions found"