
import re
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
from nltk.corpus import stopwords
import nltk
nltk.download("stopwords", quiet=True)

# Load model once when file is imported
model = SentenceTransformer("all-MiniLM-L6-v2")
stop_words = set(stopwords.words("english"))

def clean_text(text):
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = text.replace("scikit-learn", "scikitlearn")
    text = text.replace("rest apis", "restapis")
    text = text.replace("machine learning", "machinelearning")
    text = text.replace("deep learning", "deeplearning")
    text = text.replace("natural language processing", "nlp")
    text = text.replace("computer vision", "computervision")
    text = text.replace("data science", "datascience")
    text = text.replace("artificial intelligence", "artificialintelligence")
    text = re.sub(r"http\S+|www\S+", "", text)
    text = re.sub(r"[^a-z\s]", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    words = text.split()
    words = [w for w in words if w not in stop_words]
    return " ".join(words)

def get_match_score(resume_text, jd_text):
    cleaned_resume = clean_text(resume_text)
    cleaned_jd = clean_text(jd_text)
    if not cleaned_resume or not cleaned_jd:
        return 0.0
    resume_embedding = model.encode(cleaned_resume).reshape(1, -1)
    jd_embedding = model.encode(cleaned_jd).reshape(1, -1)
    score = cosine_similarity(resume_embedding, jd_embedding)[0][0]
    return round(float(score * 100), 2)

SKILL_DISPLAY = {
    'restapis': 'REST APIs',
    'scikitlearn': 'scikit-learn',
    'machinelearning': 'Machine Learning',
    'deeplearning': 'Deep Learning',
    'nlp': 'NLP',
    'computervision': 'Computer Vision',
    'datascience': 'Data Science',
    'artificialintelligence': 'Artificial Intelligence',
    'nodejs': 'Node.js',
    'mongodb': 'MongoDB',
    'postgresql': 'PostgreSQL',
    'mysql': 'MySQL',
    'powerbi': 'Power BI',
    'cicd': 'CI/CD',
    'aws': 'AWS',
    'gcp': 'GCP',
    'html': 'HTML',
    'css': 'CSS',
}
KNOWN_SKILLS = {
    'python', 'java', 'javascript', 'typescript', 'react', 'nodejs',
    'flask', 'django', 'fastapi', 'sql', 'mysql', 'postgresql', 'mongodb',
    'docker', 'kubernetes', 'git', 'github', 'linux', 'aws', 'azure', 'gcp',
    'tensorflow', 'pytorch', 'keras', 'scikitlearn', 'pandas', 'numpy',
    'machinelearning', 'deeplearning', 'nlp', 'computervision', 'datascience',
    'restapis', 'graphql', 'html', 'css', 'tailwind', 'flutter', 'swift',
    'kotlin', 'android', 'ios', 'firebase', 'redis', 'kafka', 'spark',
    'hadoop', 'tableau', 'powerbi', 'excel', 'agile', 'scrum', 'devops',
    'cicd', 'jenkins', 'ansible', 'terraform', 'figma', 'opencv'
}
def get_missing_skills(resume_text, jd_text):
    cleaned_resume = clean_text(resume_text)
    cleaned_jd = clean_text(jd_text)
    
    resume_words = set(cleaned_resume.split())
    jd_words = set(cleaned_jd.split())
    
    # Only flag words that are in our known skills list
    missing = jd_words - resume_words
    missing = [w for w in missing if w in KNOWN_SKILLS]

    # Format for display
    missing = [SKILL_DISPLAY.get(w, w.capitalize()) for w in sorted(missing)]
    
    return sorted(missing)
def analyze_resume(resume_text, jd_text):
    score = get_match_score(resume_text, jd_text)
    missing_skills = get_missing_skills(resume_text, jd_text)
    if score >= 60:
        level = "Strong Match"
        advice = "Your resume aligns well with this role."
    elif score >= 40:
        level = "Moderate Match"
        advice = "Consider adding missing skills to strengthen your application."
    elif score >= 20:
        level = "Weak Match"
        advice = "Significant gaps found. Tailor your resume more specifically."
    else:
        level = "Poor Match"
        advice = "This role may not align with your current profile."
    return {
        "score": score,
        "level": level,
        "advice": advice,
        "missing_skills": missing_skills
    }
