# library_management_task
Basic Library Management System entity-model </br></br>
![image](https://github.com/user-attachments/assets/342f03e3-daff-4931-b4d0-c004897ec592)

### Steps
1. Open cmd/terminal and clone the repository (ensure git is installed or use GutHub Desktop)
```bash
git clone https://github.com/clumsyspeedboat/library_management_task.git
```
2. "cd" into the repository
```bash
cd <path_to_your_dir>/library_management_task
```
3. Create virtual environment (ensure python is installed and added to PATH)
```bash
python -m venv env
```
4. Activate virtual environment
```bash
env\Scripts\activate # on Windows
source env/bin/activate # on Linux/Mac
```
5. Install dependencies/packages
```bash
pip install -r requirements.txt
```
5. Run Flask app
```bash
python app.py
```
6. Navigate to localhost (port will be displayed in terminal)
```bash
http://localhost:5000 # Most probably
```


Type in SQL Prompt
```
CREATE TABLE Library (
    BookId char(5),
    Title varchar(255),
    Author varchar(255),
    Publisher varchar(255),
    Genre varchar(255),
    Borrower varchar(255),
    BorrowDate DATE, 
	ReturnDate DATE,
	BorrowState boolean
	
);
```

then insert
```
INSERT INTO Library (BookId, Title, Author, Publisher, Genre, Borrower, BorrowDate, ReturnDate, BorrowState)
VALUES
('B0001', 'To Kill a Mockingbird', 'Harper Lee', 'J.B. Lippincott & Co.', 'Fiction', NULL, NULL, NULL, FALSE),
('B0002', '1984', 'George Orwell', 'Secker & Warburg', 'Dystopian', NULL, NULL, NULL, FALSE),
('B0003', 'Pride and Prejudice', 'Jane Austen', 'T. Egerton', 'Romance', NULL, NULL, NULL, FALSE),
('B0004', 'The Catcher in the Rye', 'J.D. Salinger', 'Little, Brown and Company', 'Fiction', NULL, NULL, NULL, FALSE),
('B0005', 'Moby-Dick', 'Herman Melville', 'Harper & Brothers', 'Adventure', NULL, NULL, NULL, FALSE),
('B0006', 'The Great Gatsby', 'F. Scott Fitzgerald', 'Charles Scribner''s Sons', 'Fiction', NULL, NULL, NULL, FALSE),
('B0007', 'Brave New World', 'Aldous Huxley', 'Chatto & Windus', 'Dystopian', NULL, NULL, NULL, FALSE),
('B0008', 'The Hobbit', 'J.R.R. Tolkien', 'George Allen & Unwin', 'Fantasy', NULL, NULL, NULL, FALSE),
('B0009', 'The Odyssey', 'Homer', 'Various', 'Epic Poetry', NULL, NULL, NULL, FALSE),
('B0010', 'War and Peace', 'Leo Tolstoy', 'The Russian Messenger', 'Historical Fiction', NULL, NULL, NULL, FALSE),
('B0011', 'The Picture of Dorian Gray', 'Oscar Wilde', 'Lippincott''s Monthly Magazine', 'Gothic Fiction', NULL, NULL, NULL, FALSE),
('B0012', 'The Catcher in the Rye', 'J.D. Salinger', 'Little, Brown and Company', 'Fiction', NULL, NULL, NULL, FALSE),
('B0013', 'The Little Prince', 'Antoine de Saint-Exupéry', 'Reynal & Hitchcock', 'Children''s Fiction', NULL, NULL, NULL, FALSE),
('B0014', 'Frankenstein', 'Mary Shelley', 'Lackington, Hughes, Harding, Mavor & Jones', 'Gothic Fiction', NULL, NULL, NULL, FALSE),
('B0015', 'The Brothers Karamazov', 'Fyodor Dostoevsky', 'The Russian Messenger', 'Philosophical Fiction', NULL, NULL, NULL, FALSE),
('B0016', 'Don Quixote', 'Miguel de Cervantes', 'Francisco de Robles', 'Satire', NULL, NULL, NULL, FALSE),
('B0017', 'Anna Karenina', 'Leo Tolstoy', 'The Russian Messenger', 'Realist Fiction', NULL, NULL, NULL, FALSE),
('B0018', 'The Alchemist', 'Paulo Coelho', 'HarperCollins', 'Adventure', NULL, NULL, NULL, FALSE),
('B0019', 'The Road', 'Cormac McCarthy', 'Knopf', 'Post-apocalyptic Fiction', NULL, NULL, NULL, FALSE),
('B0020', 'A Brief History of Time', 'Stephen Hawking', 'Bantam Books', 'Science', NULL, NULL, NULL, FALSE);
```
