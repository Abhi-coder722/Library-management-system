window.onload = function () {
    console.log('Fetching books from the API...');

    // Fetch the books from the API
    fetch('http://localhost:5000/api/books')
        .then(response => response.json())
        .then(data => {
            console.log('Data fetched from /api/books:', data);
            const books = data;
            const bookTable = document.getElementById('book-table');
            const borrowBookSelect = document.getElementById('borrowBookId');
            const returnBookSelect = document.getElementById('returnBookId');

            // Clear existing options
            borrowBookSelect.innerHTML = '<option value="">Select a Book</option>';
            returnBookSelect.innerHTML = '<option value="">Select a Book</option>';

            // Loop through each book and populate the table
            books.forEach(book => {
                const id = book.BookId;
                const title = book.Title;
                const authorName = book.Author || 'Unknown';
                const publisherName = book.Publisher || 'Unknown';
                const genreName = book.Genre || 'Unknown';
                const isBorrowed = book.BorrowState;

                // Create table row for each book
                const row = document.createElement('tr');
                row.setAttribute('data-id', id);

                // Populate row with book details
                row.innerHTML = `<td>${id}</td>
                                <td style="color: black;">${title}</td>
                                <td>${authorName}</td>
                                <td>${publisherName}</td>
                                <td>${genreName}</td>
                                <td>${isBorrowed ? book.Borrower : ''}</td>
                                <td>${isBorrowed ? book.BorrowDate : ''}</td>
                                <td>${isBorrowed ? book.ReturnDate : ''}</td>
                                <td>${isBorrowed ? 'Borrowed' : 'Available'}</td>`;
                bookTable.appendChild(row);

                // Populate the appropriate dropdown
                if (!isBorrowed) {
                    // Add book to Borrow dropdown
                    const option = document.createElement('option');
                    option.value = id;
                    option.textContent = `${id} - ${title}`;
                    borrowBookSelect.appendChild(option);
                } else {
                    // Add book to Return dropdown
                    const returnOption = document.createElement('option');
                    returnOption.value = id;
                    returnOption.textContent = `${id} - ${title}`;
                    returnBookSelect.appendChild(returnOption);
                }
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
    
        document.getElementById('addBookForm').addEventListener('submit', function (event) {
            event.preventDefault();
        
            const bookId = document.getElementById('bookId').value.trim();  // Book ID (e.g., B0001)
            const title = document.getElementById('title').value.trim();    // Title of the book
            const author = document.getElementById('author').value.trim();  // Author name
            const publisher = document.getElementById('publisher').value.trim(); // Publisher name
            const genre = document.getElementById('genre').value.trim();    // Genre of the book
        
            if (!bookId || !title || !author || !publisher || !genre) {
                alert('Please fill in all required fields.');
                return;
            }
        
            const newBookData = {
                BookId: bookId,
                Title: title,
                Author: author,
                Publisher: publisher,
                Genre: genre,
                Borrower: '',    // Leave Borrower empty
                BorrowDate: null, // BorrowDate is null when the book is not borrowed
                ReturnDate: null, // ReturnDate is null when the book is not borrowed
                BorrowState: false // Book is available
            };
        
            // Send data to backend to add the book
            fetch('/api/add_book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBookData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert('Book added successfully!');
                    // Optionally clear the form
                    document.getElementById('addBookForm').reset();
                } else {
                    alert('Error adding book: ' + data.error);
                }
            })
            .catch(error => {
                alert('Failed to add book. Please try again.');
                console.error('Error:', error);
            });
        });
    
    // Handle Borrow Form Submission
    document.getElementById('borrowForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const bookId = document.getElementById('borrowBookId').value;
        const borrowerName = document.getElementById('borrowerName').value.trim();
        const borrowDate = document.getElementById('borrowDate').value;

        if (!bookId || !borrowerName || !borrowDate) {
            alert('Please fill in all fields.');
            return;
        }

        if (!confirm(`Are you sure you want to borrow Book ID ${bookId}?`)) return;

        const row = document.querySelector(`#book-table tr[data-id="${bookId}"]`);
        if (row) {
            const currentState = row.cells[8].textContent;
            if (currentState === 'Borrowed') {
                alert('This book is already borrowed.');
                return;
            }

            const returnDate = new Date(borrowDate);
            returnDate.setMonth(returnDate.getMonth() + 3); // Set the return date 3 months later

            // Update the table with borrower info and return date
            row.cells[5].textContent = borrowerName;
            row.cells[6].textContent = borrowDate;
            row.cells[7].textContent = returnDate.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
            row.cells[8].textContent = 'Borrowed';
            row.classList.add('borrowed');

            // Send data to the backend to update the database
            fetch('/api/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    BookId: bookId,
                    Borrower: borrowerName,
                    BorrowDate: borrowDate
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(`Book ID ${bookId} has been successfully borrowed.`);

                    // Remove the borrowed book from Borrow Form dropdown
                    const borrowBookSelect = document.getElementById('borrowBookId');
                    const optionToRemove = borrowBookSelect.querySelector(`option[value="${bookId}"]`);
                    if (optionToRemove) optionToRemove.remove();

                    // Add the borrowed book to Return Form dropdown
                    const returnBookSelect = document.getElementById('returnBookId');
                    const newReturnOption = document.createElement('option');
                    newReturnOption.value = bookId;
                    newReturnOption.textContent = `${bookId} - ${row.cells[1].textContent}`;
                    returnBookSelect.appendChild(newReturnOption);

                    // Clear the form
                    document.getElementById('borrowForm').reset();
                } else {
                    alert('Error updating borrow information.');
                }
            })
            .catch(error => {
                alert('Failed to update borrow information. Please try again.');
                console.error('Error:', error);
            });
        } else {
            alert('No book found with that ID.');
        }
    });

    // Handle Return Form Submission
    document.getElementById('returnForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const bookId = document.getElementById('returnBookId').value;
        const returnDateInput = document.getElementById('returnDate').value;

        if (!bookId || !returnDateInput) {
            alert('Please fill in all fields.');
            return;
        }

        if (!confirm(`Are you sure you want to return Book ID ${bookId}?`)) return;

        const row = document.querySelector(`#book-table tr[data-id="${bookId}"]`);
        if (row) {
            const currentState = row.cells[8].textContent;
            if (currentState !== 'Borrowed') {
                alert('This book is not currently borrowed.');
                return;
            }

            // Update the table to clear borrowing details and set status to "Present"
            row.cells[5].textContent = '';  // Clear Borrower Name
            row.cells[6].textContent = '';  // Clear Borrow Date
            row.cells[7].textContent = '';  // Clear Return Date
            row.cells[8].textContent = 'Present';  // Update Status to "Present"
            row.classList.remove('borrowed');

            // Send data to backend to update database (remove borrower details and set status to "Present")
            fetch('/api/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    BookId: bookId,
                    ReturnDate: returnDateInput
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(`Book ID ${bookId} has been successfully returned.`);

                    // Remove the returned book from Return Form dropdown
                    const returnBookSelect = document.getElementById('returnBookId');
                    const optionToRemove = returnBookSelect.querySelector(`option[value="${bookId}"]`);
                    if (optionToRemove) optionToRemove.remove();

                    // Add the returned book back to Borrow Form dropdown
                    const borrowBookSelect = document.getElementById('borrowBookId');
                    const newBorrowOption = document.createElement('option');
                    newBorrowOption.value = bookId;
                    newBorrowOption.textContent = `${bookId} - ${row.cells[1].textContent}`;
                    borrowBookSelect.appendChild(newBorrowOption);

                    // Clear the form
                    document.getElementById('returnForm').reset();
                } else {
                    alert('Error updating return information.');
                }
            })
            .catch(error => {
                alert('Failed to update return information. Please try again.');
                console.error('Error:', error);
            });
        } else {
            alert('No book found with that ID.');
        }
    });
};
