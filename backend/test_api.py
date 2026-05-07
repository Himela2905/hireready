import requests

base_url = "http://127.0.0.1:5000"

# Test 1: Home route
print("Test 1 - Home:")
r = requests.get(f"{base_url}/")
print(r.json())

# Test 2: Resume analysis with PDF
print("\nTest 2 - Resume Analysis:")
pdf_path = r"C:\Users\Himela\Documents\Himela Biswas Resume.pdf"
jd_text = """
Python Developer with machine learning, scikit-learn, 
pandas, numpy, SQL, REST APIs, docker, git, tensorflow.
"""
with open(pdf_path, 'rb') as f:
    files = {'file': ('Himela Biswas Resume.pdf', f, 'application/pdf')}
    data = {'jd_text': jd_text}
    r = requests.post(f"{base_url}/analyze", files=files, data=data)
    print(r.json())

# Test 3: Offer letter analysis
print("\nTest 3 - Offer Analysis:")
offer_text = """
Employee must serve bond period of 2 years or pay Rs 1,00,000.
Employee will receive 12 days paid leave annually.
Employee shall not join any competitor for 1 year after leaving.
Employee must serve 90 days notice period before resignation.
"""
r = requests.post(f"{base_url}/analyze-offer", 
                  json={"offer_text": offer_text})
print(r.json())