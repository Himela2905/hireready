# HireReady

An end-to-end career toolkit that helps freshers navigate the hiring process — from resume screening to offer letter analysis.

## What it does

**Resume Screener**
Upload your resume PDF and paste a job description. HireReady uses sentence embeddings (all-MiniLM-L6-v2) to compute a semantic match score and identify missing skills.

**Offer Letter Analyser**
Paste your offer letter. HireReady automatically detects and flags risky clauses — bond periods, non-compete agreements, IP ownership, and unusual notice periods — with plain language explanations.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Flask (Python) |
| ML - Resume Matching | Sentence Transformers (Transfer Learning) |
| ML - Clause Detection | Logistic Regression trained on custom dataset |
| PDF Parsing | PyMuPDF |

## ML Approach

**Resume Matching:**
- Text preprocessing pipeline (lowercasing, stopword removal, URL cleaning)
- Semantic similarity using `all-MiniLM-L6-v2` sentence embeddings
- Cosine similarity for match scoring
- Keyword gap analysis using curated tech skills whitelist

**Offer Letter Classification:**
- Custom labeled dataset of 62 offer letter clauses across 5 classes
- TF-IDF vectorization + Logistic Regression classifier
- 92.31% accuracy on test set
- Confidence-based uncertainty handling

## Project Structure
hireready/
├── backend/
│   ├── app.py               # Flask API
│   ├── ml_engine.py         # Resume matching engine
│   ├── offer_engine.py      # Offer letter classifier
│   ├── offer_classifier.pkl # Trained model
│   └── offer_vectorizer.pkl # Trained vectorizer
└── frontend/
├── src/
│   ├── App.jsx
│   ├── ResumeScreener.jsx
│   └── OfferAnalyser.jsx
└── ...
## How to Run Locally

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

## What I Learned

- NLP preprocessing pipeline from scratch
- TF-IDF vectorization and cosine similarity
- Sentence embeddings and Transfer Learning
- Training and evaluating a text classifier (precision, recall, F1)
- Building a REST API with Flask
- Connecting React frontend to a Python backend
- PDF text extraction with PyMuPDF

## Limitations and Future Improvements

- Offer letter classifier trained on small dataset (62 examples) — accuracy would improve with more data
- Resume matching uses semantic similarity which can produce false positives across unrelated domains
- Planned: deploy backend on Railway, add PDF support for offer letters, expand skills whitelist

## Built by

Himela Biswas — 4th year IT student  
[GitHub](https://github.com/Himela2905) | himelabiswas@gmail.com