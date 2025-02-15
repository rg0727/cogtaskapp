import iris 
import os
from clip import get_image_embedding
def connect_to_iris():
    username = 'demo'
    password = 'demo'
    hostname = os.getenv('IRIS_HOSTNAME', 'localhost')
    port = '1972' 
    namespace = 'USER'
    CONNECTION_STRING = f"{hostname}:{port}/{namespace}"

    connection = iris.connect(CONNECTION_STRING, username, password)
    
    cursor = connection.cursor()
    tableName = householdObjects
    tableDefinition = "(name VARCHAR(255), description_vector VECTOR(DOUBLE, 384))"
    # storing vector embeddings in table - store embeddings from CLIP or raw image data for vector searc?
    try:
        cursor.execute(f"DROP TABLE {tableName}")  
    except:
        pass
    cursor.execute(f"CREATE TABLE {tableName} {tableDefinition}")
    
    sql = f"""
        INSERT INTO {tableName}
        (name, vector) 
        VALUES (?, TO_VECTOR(?))
    """
    for name in os.listdir(data):
        path = os.path.join(directory, name)
        vector = get_image_embedding(path)
        data = [(name, str(vector))]
        cursor.execute(sql, data)

    
    return cursor

def store_embedding(cursor, image_name, embedding):
    sql = f"""
        INSERT INTO {tableName}
        (name, vector) 
        VALUES (?, TO_VECTOR(?))
    """
    data = [(imag_name, str(embedding))]
    cursor.execute(sql, data)

def vectorSearch(cursor, searchImagePath, tableName):
    sql = f"""
        SELECT TOP ? name, vector
        FROM {tableName}
        ORDER BY VECTOR_DOT_PRODUCT(description_vector, TO_VECTOR(?)) DESC
    """
    # Q1: how can i upload an image not in my data store and get an image embedding for it?
    numberOfResults = 1
    searchVector = get_image_embedding("    ")
    cursor.execute(sql, [numberOfResults, str(searchVector)])
    results = cursor.fetchall()
    return results[0]


def get_embedding(iris, image_name):
    ## TBD