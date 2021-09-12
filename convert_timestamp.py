def timestamp_to_seconds(timestamp):
    split_time = timestamp.split(":")
    hours = 0
    minutes = 0
    seconds = 0
    if (len(split_time) == 2):
        minutes = split_time[0]
        seconds = split_time[1]
    elif (len(split_time) == 3):
        hours = split_time[0]
        minutes = split_time[1]
        seconds = split_time[2]
 
    return int(hours) * 3600 + int(minutes) * 60 + int(seconds)
