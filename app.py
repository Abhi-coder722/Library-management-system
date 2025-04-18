from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import configparser
import logging
import psycopg2
from psycopg2 import sql

# Initialize the Flask app and enable CORS for all routes
app = Flask(__name__, static_url_path='/static', static_folder='static')
CORS(app)

# Configure logging for debugging purposes
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s %(levelname)s %(message)s',
    handlers=[logging.StreamHandler()]
)

# Load the configuration from config.ini
config = configparser.ConfigParser()
config.read('config.ini')

# Database configuration settings from the config.ini
DB_HOST = config.get('Database', 'DB_HOST', fallback='localhost')
DB_PORT = config.get('Database', 'DB_PORT', fallback='5432')
DB_NAME = config.get('Database', 'DB_NAME', fallback='mydatabase')
DB_USER = config.get('Database', 'DB_USER', fallback='myuser')
DB_PASSWORD = config.get('Database', 'DB_PASSWORD', fallback='mypassword')

logging.info("Database configuration loaded successfully.")

# Function to create and return a database connection
def get_db_connection():
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        return conn
    except Exception as e:
        logging.error("Error creating database connection: %s", e)
        raise

# Route to fetch books from the database
@app.route('/api/books', methods=['GET'])
def get_books():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM Library;')
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
@app.route('/api/data', methods=['POST'])
def insert_data():
    data = request.json
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if returnDate is present in the request, decide whether it's a borrow or return
        if 'ReturnDate' in data:
            # It's a return, update returnDate and set borrowState to False
            query = sql.SQL("""
                UPDATE Library 
                SET Borrower = NULL, BorrowDate = NULL, ReturnDate = %s, BorrowState = %s 
                WHERE BookId = %s
            """)
            cursor.execute(query, (data['ReturnDate'], False, data['BookId']))

        else:
            # It's a borrow, update Borrower, BorrowDate and set BorrowState to True
            query = sql.SQL("""
                UPDATE Library 
                SET Borrower = %s, BorrowDate = %s, BorrowState = %s 
                WHERE BookId = %s
            """)
            cursor.execute(query, (data['Borrower'], data['BorrowDate'], True, data['BookId']))

        # Commit the changes
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'message': 'Data updated successfully'}), 200
    except Exception as e:
        logging.error("Error updating data: %s", e)
        return jsonify({'error': 'Error updating data'}), 500


# Route to serve the home page (index.html)
@app.route('/')
def home():
    return render_template('index.html')

# Route to serve the viewer page (viewer.html)
@app.route('/viewer.html')
def viewer():
    return render_template('viewer.html')

if __name__ == '__main__':
    app.run(debug=True)
    print("Registered Routes:")
    for rule in app.url_map.iter_rules():
        print(rule)

