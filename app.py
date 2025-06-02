from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import configparser
import logging
import psycopg2
from psycopg2 import sql
from neo4j import GraphDatabase
import json
import os

# Initialize the Flask app and enable CORS
app = Flask(__name__, static_url_path='/static', static_folder='static')
CORS(app)

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s %(levelname)s %(message)s',
    handlers=[logging.StreamHandler()]
)

# Load configuration
config = configparser.ConfigParser()
config.read('config.ini')

# PostgreSQL configuration
DB_HOST = config.get('Database', 'DB_HOST', fallback='localhost')
DB_PORT = config.get('Database', 'DB_PORT', fallback='5432')
DB_NAME = config.get('Database', 'DB_NAME', fallback='mydatabase')
DB_USER = config.get('Database', 'DB_USER', fallback='myuser')
DB_PASSWORD = config.get('Database', 'DB_PASSWORD', fallback='mypassword')

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
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
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
@app.route('/api/books', methods=['GET'])
def get_books():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM Library ORDER BY BookID;')
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
@app.route('/api/data', methods=['POST'])
def insert_data():
    data = request.json
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        if 'ReturnDate' in data:
            query = sql.SQL("""
                UPDATE Library 
                SET Borrower = NULL, BorrowDate = NULL, ReturnDate = %s, BorrowState = %s 
                WHERE BookId = %s
            """)
            cursor.execute(query, (data['ReturnDate'], False, data['BookId']))
        else:
            query = sql.SQL("""
                UPDATE Library 
                SET Borrower = %s, BorrowDate = %s, BorrowState = %s, ReturnDate = NULL 
                WHERE BookId = %s
            """)
            cursor.execute(query, (data['Borrower'], data['BorrowDate'], True, data['BookId']))
            log_borrow_in_neo4j(data['BookId'], data['Borrower'])

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'message': 'Data updated successfully'}), 200
    except Exception as e:
        logging.error("Error updating data: %s", e)
        return jsonify({'error': 'Error updating data'}), 500

# Add a new book
@app.route('/api/add_book', methods=['POST'])
def add_book():
    try:
        data = request.json
        book_id = data.get('BookId')
        title = data.get('Title')
        author = data.get('Author')
        publisher = data.get('Publisher')
        genre = data.get('Genre')
        borrower = data.get('Borrower', "")
        borrow_date = data.get('BorrowDate', "")
        return_date = data.get('ReturnDate', "")
        borrow_state = data.get('BorrowState', "Available")

        conn = get_db_connection()
        cursor = conn.cursor()

        query = sql.SQL("""
            INSERT INTO Library (BookId, Title, Author, Publisher, Genre, Borrower, BorrowDate, ReturnDate, BorrowState)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """)
        cursor.execute(query, (book_id, title, author, publisher, genre, borrower, borrow_date, return_date, borrow_state))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'message': 'Book added successfully!'}), 200
    except Exception as e:
        logging.error("Error adding book: %s", str(e))
        return jsonify({'error': str(e)}), 500

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
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/viewer.html')
def viewer():
    return render_template('viewer.html')

# Login with local JSON file
USER_FILE = 'users.json'

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
    except Exception as e:
        logging.error("Login error: %s", e)
        return jsonify({'error': 'Internal server error'}), 500

# Shutdown Neo4j driver
@app.teardown_appcontext
def close_neo4j_driver(exception=None):
    if neo4j_driver:
        neo4j_driver.close()

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
