def icontains(string: str | None, substring: str | None) -> bool:
    if string is None or substring is None:
        return False
    return substring.lower() in string.lower()
