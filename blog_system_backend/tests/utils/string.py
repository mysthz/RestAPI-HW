import random
import re
import string


def generate_str(*, min_length: int, max_length: int, pattern: str | re.Pattern[str]) -> str:
    characters = string.ascii_lowercase + string.ascii_uppercase + string.digits + string.punctuation

    while True:
        length = random.randint(min_length, max_length)
        result = "".join(random.choice(characters) for _ in range(length))
        if re.fullmatch(pattern, result):
            return result
