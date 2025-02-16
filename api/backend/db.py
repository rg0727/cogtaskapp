import iris
import os
from clip import get_image_embedding, get_search_embedding
from flask import Flask, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
import base64

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

database_port = None

def connect_to_iris():
    username = 'demo'
    password = 'demo'
    hostname = os.getenv('IRIS_HOSTNAME', 'localhost')
    port = '1972' 
    namespace = 'USER'
    CONNECTION_STRING = f"{hostname}:{port}/{namespace}"

    connection = iris.connect(CONNECTION_STRING, username, password)
    
    cursor = connection.cursor()
    tableName = "householdObjects"
    vector = get_image_embedding("data/chair.jpg")
    vectorLen = len(vector)
    tableDefinition = "(name VARCHAR(255), description_vector VECTOR(DOUBLE,512))"
    # storing vector embeddings in table - store embeddings from CLIP or raw image data for vector searc?
    try:
        cursor.execute(f"DROP TABLE {tableName}")  
    except:
        pass
    cursor.execute(f"CREATE TABLE {tableName} {tableDefinition}")
    
    sql = "INSERT INTO SQLUser.householdObjects (name, description_vector) VALUES (?, ?)"
    for name in os.listdir("data"):
        path = os.path.join("data", name)
        vector = get_image_embedding(path)
        cursor.execute(sql, [name, str(vector)])

    return cursor

def get_cursor():
    return self.database_port

def store_embedding(cursor, image_name, embedding):
    sql = f"""
        INSERT INTO {tableName}
        (name, vector) 
        VALUES (?, TO_VECTOR(?))
    """
    data = [(imag_name, str(embedding))]
    cursor.execute(sql, data)

def vectorSearch(cursor, searchVector, tableName):
    sql = f"""
        SELECT TOP ? name, description_vector
        FROM {tableName}
        ORDER BY VECTOR_DOT_PRODUCT(description_vector, TO_VECTOR(?)) DESC
    """
    # Q1: how can i upload an image not in my data store and get an image embedding for it?
    numberOfResults = 1
    cursor.execute(sql, [numberOfResults, str(searchVector)])
    results = cursor.fetchall()
    return results[0]


def image_to_data_url(image_path):
    with open(image_path, "rb") as img_file:
        encoded_string = base64.b64encode(img_file.read()).decode("utf-8")
    
    mime_type = "image/png" if image_path.endswith(".png") else "image/jpeg"
    
    return f"data:{mime_type};base64,{encoded_string}"

@socketio.on('capture_iris')
def handle_capture_iris(image):
    cursor = connect_to_iris()
    searchVector = get_search_embedding(image)
    most_similar = vectorSearch(cursor, searchVector, "householdObjects")
    print(most_similar[0])
    socketio.emit('response', {"message": most_similar[0]})










