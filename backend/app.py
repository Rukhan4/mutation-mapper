from flask import Flask, request, jsonify
from parser import parse_mutation_file
import os
import json

app = Flask(__name__)
ANNOTATION_PATH = os.path.join("data", "mutation_annotations.json")

@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return "No file uploaded", 400
    file = request.files["file"]

    mutations = parse_mutation_file(file)

    with open(ANNOTATION_PATH, "r") as f:
        annotations = json.load(f)

    results = []
    for mutation in mutations:
        key = f"{mutation['gene']}:{mutation['mutation']}"
        data = annotations.get(key)
        if data:
            results.append({
                "gene": mutation["gene"],
                "mutation": mutation["mutation"],
                "type": data["type"],
                "significance": data["significance"],
                "disease": data["disease"]
            })

    return jsonify(results)

if __name__ == "__main__":
    app.run(debug=True)
