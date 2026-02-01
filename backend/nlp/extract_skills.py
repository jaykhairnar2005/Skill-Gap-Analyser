import spacy
import sys
import json
import re

nlp = spacy.load("en_core_web_sm")

# Predefined skill list (important)
SKILLS = [
    "python", "java", "javascript", "react", "node", "node.js",
    "express", "html", "css", "sql", "mongodb",
    "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch",
    "machine learning", "deep learning", "nlp",
    "aws", "linux", "git", "docker", "kubernetes"
]

text = sys.argv[1].lower()

found_skills = set()

# 1️⃣ Direct keyword match (best for skills like pandas)
for skill in SKILLS:
    pattern = r"\b" + re.escape(skill) + r"\b"
    if re.search(pattern, text):
        found_skills.add(skill)

# 2️⃣ spaCy entity/word scan (backup)
doc = nlp(text)
for token in doc:
    if token.text.lower() in SKILLS:
        found_skills.add(token.text.lower())

print(json.dumps(list(found_skills)))
