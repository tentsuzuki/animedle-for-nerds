import json

with open('./titles/oldtitles.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

entries = data["data"]

modified_entries = []

for entry in entries:
    modified_entry = {'title': entry['title'], 'synonyms': entry['synonyms']}
    modified_entries.append(modified_entry)

data["data"] = modified_entries

with open('./titles/titles.json', 'w', encoding='utf-8') as file:
    json.dump(data, file, ensure_ascii=False)