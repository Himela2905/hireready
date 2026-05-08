from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os
import fitz

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ml_engine import analyze_resume
from offer_engine import analyze_offer_letter

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "status": "HireReady API is running",
        "version": "1.0",
        "endpoints": ["/analyze", "/analyze-offer"]
    })

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        jd_text = request.form.get('jd_text', '')
        
        if not jd_text:
            return jsonify({"error": "jd_text is required"}), 400
        
        if 'file' in request.files:
            file = request.files['file']
            if file.filename != '' and file.filename.endswith('.pdf'):
                pdf_bytes = file.read()
                doc = fitz.open(stream=pdf_bytes, filetype="pdf")
                resume_text = ""
                for page in doc:
                    resume_text += page.get_text()
            else:
                return jsonify({"error": "Please upload a valid PDF"}), 400
        else:
            resume_text = request.form.get('resume_text', '')
            if not resume_text:
                return jsonify({"error": "Either file or resume_text is required"}), 400
        
        result = analyze_resume(resume_text, jd_text)
        
        return jsonify({
            "success": True,
            "data": result
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/analyze-offer', methods=['POST'])
def analyze_offer():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        offer_text = data.get('offer_text', '')
        
        if not offer_text:
            return jsonify({"error": "offer_text is required"}), 400
        
        result = analyze_offer_letter(offer_text)
        
        return jsonify({
            "success": True,
            "data": result
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))