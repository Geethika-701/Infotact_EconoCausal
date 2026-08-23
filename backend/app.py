from flask import Flask, jsonify

app = Flask(__name__)


@app.route("/")
def home():
    return jsonify({
        "project": "EconoCausal",
        "status": "Backend is running successfully"
    })


if __name__ == "__main__":
    app.run(debug=True)