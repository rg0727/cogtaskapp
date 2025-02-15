from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/hello')
def hello():
    return {"message": "Hello from Flask!"}

if __name__ == '__main__':
    app.run(debug=True)
