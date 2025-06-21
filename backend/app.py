from flask import Flask, request, jsonify
from flask_cors import CORS
from parser import parse_mutation_file
import os
import json

app = Flask(__name__)

CORS(app)
ANNOTATION_PATH = os.path.join("data", "mutation_annotations.json")

@app.route("/upload", methods=["POST"])
def upload_file():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400
        file = request.files["file"]

        print("Received file:", file.filename)
        file.seek(0)
        print("File preview:\n", file.read(200))
        file.seek(0)

        mutations = parse_mutation_file(file)

        with open("data/mutation_annotations.json", "r") as f:
            annotations = json.load(f)

        results = []
        for m in mutations:
            key = f"{m['gene']}:{m['mutation']}"
            data = annotations.get(key, {})
            results.append({
                "gene": m["gene"],
                "mutation": m["mutation"],
                "type": data.get("type", "unknown"),
                "significance": data.get("significance", "unknown"),
                "disease": data.get("disease", "unknown")
            })

        return jsonify(results)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Internal Server Error", "message": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)

