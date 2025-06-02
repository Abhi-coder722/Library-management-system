from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import configparser
import logging
import psycopg2
from psycopg2 import sql
<<<<<<< HEAD

# Initialize the Flask app and enable CORS for all routes
app = Flask(__name__, static_url_path='/static', static_folder='static')
CORS(app)

# Configure logging for debugging purposes
=======
from neo4j import GraphDatabase
import json
import os

# Initialize the Flask app and enable CORS
app = Flask(__name__, static_url_path='/static', static_folder='static')
CORS(app)

# Configure logging
>>>>>>> fa6c970 (Neo4j)
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s %(levelname)s %(message)s',
    handlers=[logging.StreamHandler()]
)

<<<<<<< HEAD
# Load the configuration from config.ini
config = configparser.ConfigParser()
config.read('config.ini')

# Database configuration settings from the config.ini
=======
# Load configuration
config = configparser.ConfigParser()
config.read('config.ini')

# PostgreSQL configuration
>>>>>>> fa6c970 (Neo4j)
DB_HOST = config.get('Database', 'DB_HOST', fallback='localhost')
DB_PORT = config.get('Database', 'DB_PORT', fallback='5432')
DB_NAME = config.get('Database', 'DB_NAME', fallback='mydatabase')
DB_USER = config.get('Database', 'DB_USER', fallback='myuser')
DB_PASSWORD = config.get('Database', 'DB_PASSWORD', fallback='mypassword')

<<<<<<< HEAD
logging.info("Database configuration loaded successfully.")

# Function to create and return a database connection
def get_db_connection():
    try:
        conn = psycopg2.connect(
=======
# Neo4j configuration
NEO4J_URI = config.get('Neo4j', 'NEO4J_URI', fallback='bolt://localhost:7687')
NEO4J_USER = config.get('Neo4j', 'NEO4J_USER', fallback='neo4j')
NEO4J_PASSWORD = config.get('Neo4j', 'NEO4J_PASSWORD', fallback='your_password')

# Initialize Neo4j driver
neo4j_driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

# Helper: PostgreSQL connection
def get_db_connection():
    try:
        return psycopg2.connect(
>>>>>>> fa6c970 (Neo4j)
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
<<<<<<< HEAD
        return conn
    except Exception as e:
        logging.error("Error creating database connection: %s", e)
        raise

# Route to fetch books from the database
=======
    except Exception as e:
        logging.error("PostgreSQL connection error: %s", e)
        raise

# Helper: Log borrow action in Neo4j
def log_borrow_in_neo4j(book_id, borrower):
    try:
        with neo4j_driver.session() as session:
            session.run("""
                MERGE (b:Borrower {name: $borrower})
                MERGE (bk:Book {id: $book_id})
                MERGE (b)-[:BORROWED]->(bk)
            """, borrower=borrower, book_id=book_id)
    except Exception as e:
        logging.error("Neo4j log error: %s", e)

# Get books from PostgreSQL
>>>>>>> fa6c970 (Neo4j)
@app.route('/api/books', methods=['GET'])
def get_books():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM Library ORDER BY BookID;')
<<<<<<< HEAD
        rows = cursor.fetchall()  # Fetch all records from the Library table
        cursor.close()
        conn.close()

        # Format the results as a list of dictionaries
        books = []
        for row in rows:
            books.append({
                'BookId': row[0],
                'Title': row[1],
                'Author': row[2],
                'Publisher': row[3],
                'Genre': row[4],
                'Borrower': row[5],
                'BorrowDate': row[6],
                'ReturnDate': row[7],
                'BorrowState': row[8]
            })

        return jsonify(books)

    except Exception as e:
        logging.error("Error fetching data from database: %s", e)
        return jsonify({'error': str(e)}), 500

# Route to insert data into the library table
# @app.route('/api/data', methods=['POST'])
# def insert_data():
#     data = request.json
#     try:
#         conn = get_db_connection()
#         cursor = conn.cursor()

#         # Check if returnDate is present in the request, decide whether it's a borrow or return
#         if 'ReturnDate' in data:
#             # It's a return, update returnDate and set borrowState to False
#             query = sql.SQL("""
#                 UPDATE Library 
#                 SET Borrower = NULL, BorrowDate = NULL, ReturnDate = %s, BorrowState = %s 
#                 WHERE BookId = %s
#             """)
#             cursor.execute(query, (data['ReturnDate'], False, data['BookId']))

#         else:
#             # It's a borrow, update Borrower, BorrowDate and set BorrowState to True
#             query = sql.SQL("""
#                 UPDATE Library 
#                 SET Borrower = %s, BorrowDate = %s, BorrowState = %s 
#                 WHERE BookId = %s
#             """)
#             cursor.execute(query, (data['Borrower'], data['BorrowDate'], True, data['BookId']))

#         # Commit the changes
#         conn.commit()
#         cursor.close()
#         conn.close()

#         return jsonify({'message': 'Data updated successfully'}), 200
#     except Exception as e:
#         logging.error("Error updating data: %s", e)
#         return jsonify({'error': 'Error updating data'}), 500
=======
        rows = cursor.fetchall()
        cursor.close()
        conn.close()

        books = [{
            'BookId': row[0],
            'Title': row[1],
            'Author': row[2],
            'Publisher': row[3],
            'Genre': row[4],
            'Borrower': row[5],
            'BorrowDate': row[6],
            'ReturnDate': row[7],
            'BorrowState': row[8]
        } for row in rows]

        return jsonify(books)
    except Exception as e:
        logging.error("Error fetching books: %s", e)
        return jsonify({'error': str(e)}), 500

# Borrow or return book
>>>>>>> fa6c970 (Neo4j)
@app.route('/api/data', methods=['POST'])
def insert_data():
    data = request.json
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

<<<<<<< HEAD
        # Check if returnDate is present in the request, decide whether it's a borrow or return
        if 'ReturnDate' in data:
            # It's a return, update returnDate and set borrowState to False
=======
        if 'ReturnDate' in data:
>>>>>>> fa6c970 (Neo4j)
            query = sql.SQL("""
                UPDATE Library 
                SET Borrower = NULL, BorrowDate = NULL, ReturnDate = %s, BorrowState = %s 
                WHERE BookId = %s
            """)
            cursor.execute(query, (data['ReturnDate'], False, data['BookId']))
<<<<<<< HEAD

        else:
            # It's a borrow, update Borrower, BorrowDate, and set BorrowState to True
=======
        else:
>>>>>>> fa6c970 (Neo4j)
            query = sql.SQL("""
                UPDATE Library 
                SET Borrower = %s, BorrowDate = %s, BorrowState = %s, ReturnDate = NULL 
                WHERE BookId = %s
            """)
            cursor.execute(query, (data['Borrower'], data['BorrowDate'], True, data['BookId']))
<<<<<<< HEAD

        # Commit the changes
=======
            log_borrow_in_neo4j(data['BookId'], data['Borrower'])

>>>>>>> fa6c970 (Neo4j)
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'message': 'Data updated successfully'}), 200
    except Exception as e:
        logging.error("Error updating data: %s", e)
        return jsonify({'error': 'Error updating data'}), 500

<<<<<<< HEAD

@app.route('/api/add_book', methods=['POST'])
def add_book():
    try:
        data = request.json  # Get the data from the request

        # Extract the details of the book from the request body
=======
# Add a new book
@app.route('/api/add_book', methods=['POST'])
def add_book():
    try:
        data = request.json
>>>>>>> fa6c970 (Neo4j)
        book_id = data.get('BookId')
        title = data.get('Title')
        author = data.get('Author')
        publisher = data.get('Publisher')
        genre = data.get('Genre')
<<<<<<< HEAD
        borrower = data.get('Borrower', "")  # Default to None if not provided
        borrow_date = data.get('BorrowDate', "")  # Default to None if not provided
        return_date = data.get('ReturnDate', "")  # Default to None if not provided
        borrow_state = data.get('BorrowState', "Available")  # Book is available by default

        # Establish a database connection
        conn = get_db_connection()
        cursor = conn.cursor()

        # Insert the new book into the database
=======
        borrower = data.get('Borrower', "")
        borrow_date = data.get('BorrowDate', "")
        return_date = data.get('ReturnDate', "")
        borrow_state = data.get('BorrowState', "Available")

        conn = get_db_connection()
        cursor = conn.cursor()

>>>>>>> fa6c970 (Neo4j)
        query = sql.SQL("""
            INSERT INTO Library (BookId, Title, Author, Publisher, Genre, Borrower, BorrowDate, ReturnDate, BorrowState)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """)
<<<<<<< HEAD

        cursor.execute(query, (book_id, title, author, publisher, genre, borrower, borrow_date, return_date, borrow_state))

        # Commit the changes
=======
        cursor.execute(query, (book_id, title, author, publisher, genre, borrower, borrow_date, return_date, borrow_state))

>>>>>>> fa6c970 (Neo4j)
        conn.commit()
        cursor.close()
        conn.close()

<<<<<<< HEAD
        # Return a success response
        return jsonify({'message': 'Book added successfully!'}), 200

=======
        return jsonify({'message': 'Book added successfully!'}), 200
>>>>>>> fa6c970 (Neo4j)
    except Exception as e:
        logging.error("Error adding book: %s", str(e))
        return jsonify({'error': str(e)}), 500

<<<<<<< HEAD
# Route to serve the home page (index.html)
=======
# Neo4j test route
@app.route('/api/neo4j-test', methods=['GET'])
def neo4j_test():
    try:
        with neo4j_driver.session() as session:
            result = session.run("MATCH (n) RETURN n LIMIT 5")
            nodes = [dict(record['n']) for record in result]
            return jsonify(nodes), 200
    except Exception as e:
        logging.error("Neo4j test error: %s", e)
        return jsonify({'error': 'Neo4j connection failed'}), 500

# Serve HTML pages
>>>>>>> fa6c970 (Neo4j)
@app.route('/')
def home():
    return render_template('index.html')

<<<<<<< HEAD
# Route to serve the viewer page (viewer.html)
=======
>>>>>>> fa6c970 (Neo4j)
@app.route('/viewer.html')
def viewer():
    return render_template('viewer.html')

<<<<<<< HEAD

import json
import os

# Path to users.json
USER_FILE = 'users.json'

# Login route
=======
# Login with local JSON file
USER_FILE = 'users.json'

>>>>>>> fa6c970 (Neo4j)
@app.route('/api/login', methods=['POST'])
def login():
    credentials = request.json
    username = credentials.get('username')
    password = credentials.get('password')

    try:
        with open(USER_FILE, 'r') as f:
            users = json.load(f)

        for user in users:
            if user['userid'] == username and user['password'] == password:
                return jsonify({'message': 'Login successful', 'role': user['role']}), 200

        return jsonify({'error': 'Invalid credentials'}), 401
<<<<<<< HEAD

=======
>>>>>>> fa6c970 (Neo4j)
    except Exception as e:
        logging.error("Login error: %s", e)
        return jsonify({'error': 'Internal server error'}), 500

<<<<<<< HEAD

if __name__ == '__main__':
    app.run(debug=True)
    print("Registered Routes:")
    for rule in app.url_map.iter_rules():
        print(rule)

=======
# Shutdown Neo4j driver
@app.teardown_appcontext
def close_neo4j_driver(exception=None):
    if neo4j_driver:
        neo4j_driver.close()

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
>>>>>>> fa6c970 (Neo4j)
