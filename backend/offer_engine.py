
import re
import pickle
import numpy as np
from nltk.corpus import stopwords
import nltk
nltk.download("stopwords", quiet=True)

stop_words = set(stopwords.words("english"))

classifier = pickle.load(open("offer_classifier.pkl", "rb"))
vectorizer = pickle.load(open("offer_vectorizer.pkl", "rb"))

RISK_LABELS = {
    "bond": {
        "risk": "High Risk",
        "color": "red",
        "explanation": "This clause binds you to the company for a fixed period. Leaving early may cost you money."
    },
    "non_compete": {
        "risk": "High Risk", 
        "color": "red",
        "explanation": "This restricts where you can work after leaving. May limit your career options."
    },
    "ip_ownership": {
        "risk": "Medium Risk",
        "color": "amber",
        "explanation": "The company claims ownership of work you produce. Check if this includes personal side projects."
    },
    "notice": {
        "risk": "Medium Risk",
        "color": "amber", 
        "explanation": "Long notice periods can make it hard to switch jobs quickly."
    },
    "normal": {
        "risk": "Standard",
        "color": "green",
        "explanation": "This appears to be a standard employment clause."
    }
}

def clean_clause(text):
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r"[^a-z\s]", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    words = text.split()
    words = [w for w in words if w not in stop_words]
    return " ".join(words)

def analyze_clause(text):
    cleaned = clean_clause(text)
    vectorized = vectorizer.transform([cleaned])
    label = classifier.predict(vectorized)[0]
    confidence = classifier.predict_proba(vectorized).max() * 100

    risk_info = RISK_LABELS[label]

    return {
        "clause": text,
        "label": label,
        "risk": risk_info["risk"] if confidence >= 40 else "Uncertain",
        "color": risk_info["color"] if confidence >= 40 else "gray",
        "explanation": risk_info["explanation"] if confidence >= 40 else "Could not determine risk level confidently. Review manually.",
        "confidence": round(confidence, 2)
    }

def analyze_offer_letter(offer_text):
    sentences = [s.strip() for s in offer_text.split(".") if len(s.strip()) > 20]
    results = [analyze_clause(s) for s in sentences]

    high_risk = [r for r in results if r["risk"] == "High Risk"]
    medium_risk = [r for r in results if r["risk"] == "Medium Risk"]

    return {
        "total_clauses": len(results),
        "high_risk_count": len(high_risk),
        "medium_risk_count": len(medium_risk),
        "clauses": results
    }
