// window.onload = function () {
//     console.log('Fetching books from the API...');
    
//     const username = sessionStorage.getItem('username');
//     const role = sessionStorage.getItem('role'); // Optional, if you're using roles

//     const loginSection = document.getElementById('loginSectionForm');
//     const addBookSection = document.getElementById('bookformaddition');
//     const userInfo = document.getElementById('userInfo');
//     const currentUser = document.getElementById('currentUser');

//     if (username) {
//         // User is logged in
//         loginSection.style.display = 'none';
//         addBookSection.style.display = 'block';
//         userInfo.style.display = 'block';
//         currentUser.textContent = username;
//     } else {
//         // Not logged in
//         loginSection.style.display = 'block';
//         addBookSection.style.display = 'none';
//         userInfo.style.display = 'none';
//     }

//     document.getElementById('logoutBtn').addEventListener('click', function () {
//         sessionStorage.clear();
//         location.reload(); // Refresh to reset view
//     });

//     document.querySelectorAll('input').forEach((input) => {
//         input.addEventListener('focus', () => {
//           input.setAttribute('autocomplete', 'off');
//         });
//       });

//     // Fetch the books from the API
//     fetch('http://localhost:5000/api/books')
//         .then(response => response.json())
//         .then(data => {
//             console.log('Data fetched from /api/books:', data);
//             const books = data;
//             const bookTable = document.getElementById('book-table');
//             const borrowBookSelect = document.getElementById('borrowBookId');
//             const returnBookSelect = document.getElementById('returnBookId');

//             // Clear existing options
//             borrowBookSelect.innerHTML = '<option value="">Select a Book</option>';
//             returnBookSelect.innerHTML = '<option value="">Select a Book</option>';

//             // Loop through each book and populate the table
//             books.forEach(book => {
//                 const id = book.BookId;
//                 const title = book.Title;
//                 const authorName = book.Author || 'Unknown';
//                 const publisherName = book.Publisher || 'Unknown';
//                 const genreName = book.Genre || 'Unknown';
//                 const isBorrowed = book.BorrowState;

//                 // Create table row for each book
//                 const row = document.createElement('tr');
//                 row.setAttribute('data-id', id);

//                 // Populate row with book details
//                 row.innerHTML = `<td>${id}</td>
//                                 <td style="color: black;">${title}</td>
//                                 <td>${authorName}</td>
//                                 <td>${publisherName}</td>
//                                 <td>${genreName}</td>
//                                 <td>${isBorrowed ? book.Borrower : ''}</td>
//                                 <td>${isBorrowed ? book.BorrowDate : ''}</td>
//                                 <td>${isBorrowed ? book.ReturnDate : ''}</td>
//                                 <td>${isBorrowed ? 'Borrowed' : 'Available'}</td>`;
//                 bookTable.appendChild(row);

//                 // Populate the appropriate dropdown
//                 if (!isBorrowed) {
//                     // Add book to Borrow dropdown
//                     const option = document.createElement('option');
//                     option.value = id;
//                     option.textContent = `${id} - ${title}`;
//                     borrowBookSelect.appendChild(option);
//                 } else {
//                     // Add book to Return dropdown
//                     const returnOption = document.createElement('option');
//                     returnOption.value = id;
//                     returnOption.textContent = `${id} - ${title}`;
//                     returnBookSelect.appendChild(returnOption);
//                 }
//             });
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });

//         document.getElementById('loginForm').addEventListener('submit', function (event) {
//             event.preventDefault();
            
//             const username = document.getElementById('username').value.trim();
//             const password = document.getElementById('password').value.trim();
        
//             fetch('/api/login', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ username, password })
//             })
//             .then(res => res.json())
//             .then(data => {
//                 if (data.role) {
//                     alert(`Welcome, ${username}! You are logged in as ${data.role}.`);
//                     sessionStorage.setItem('userRole', data.role);
//                     applyRolePermissions(data.role);

//                     sessionStorage.setItem('username', username); 
//                     // window.onload();
//                 } else {
//                     alert(data.error);
//                 }
//             })
//             .catch(err => {
//                 console.error('Login failed:', err);
//                 alert('Login error. Try again.');
//             });
//         });

//         function applyRolePermissions(role) {
//             if (role === 'user') {
//                 document.querySelector('#bookformaddition').style.display = 'none'; // Hide add form
//             } else if (role === 'admin') {
//                 document.querySelector('#bookformaddition').style.display = 'block'; // Show add form
//             }
        
//             // You can also hide/show clear button, edit features, etc.
//         }
    
//         document.getElementById('addBookForm').addEventListener('submit', function (event) {
//             event.preventDefault();
        
//             const bookId = document.getElementById('bookId').value.trim();  // Book ID (e.g., B0001)
//             const title = document.getElementById('title').value.trim();    // Title of the book
//             const author = document.getElementById('author').value.trim();  // Author name
//             const publisher = document.getElementById('publisher').value.trim(); // Publisher name
//             const genre = document.getElementById('genre').value.trim();    // Genre of the book
        
//             if (!bookId || !title || !author || !publisher || !genre) {
//                 alert('Please fill in all required fields.');
//                 return;
//             }
        
//             const newBookData = {
//                 BookId: bookId,
//                 Title: title,
//                 Author: author,
//                 Publisher: publisher,
//                 Genre: genre,
//                 Borrower: '',    // Leave Borrower empty
//                 BorrowDate: null, // BorrowDate is null when the book is not borrowed
//                 ReturnDate: null, // ReturnDate is null when the book is not borrowed
//                 BorrowState: false // Book is available
//             };
        
//             // Send data to backend to add the book
//             fetch('/api/add_book', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(newBookData)
//             })
//             .then(response => response.json())
//             .then(data => {
//                 if (data.message) {
//                     alert('Book added successfully!');
//                     // Optionally clear the form
//                     document.getElementById('addBookForm').reset();
//                 } else {
//                     alert('Error adding book: ' + data.error);
//                 }
//             })
//             .catch(error => {
//                 alert('Failed to add book. Please try again.');
//                 console.error('Error:', error);
//             });
//         });

//         document.getElementById('borrowForm').addEventListener('submit', function (event) {
//             event.preventDefault();
//             const bookId = document.getElementById('borrowBookId').value;
//             const borrowDate = document.getElementById('borrowDate').value;
//             const borrowerName = sessionStorage.getItem('username'); // use logged-in user
        
//             if (!bookId || !borrowDate) {
//                 alert('Please fill in all fields.');
//                 return;
//             }
        
//             if (!borrowerName) {
//                 alert('You must be logged in to borrow a book.');
//                 return;
//             }
        
//             if (!confirm(`Are you sure you want to borrow Book ID ${bookId}?`)) return;
        
//             const row = document.querySelector(`#book-table tr[data-id="${bookId}"]`);
//             if (row) {
//                 const currentState = row.cells[8].textContent;
//                 if (currentState === 'Borrowed') {
//                     alert('This book is already borrowed.');
//                     return;
//                 }
        
//                 const returnDate = new Date(borrowDate);
//                 returnDate.setMonth(returnDate.getMonth() + 3);
        
//                 // Update the table
//                 row.cells[5].textContent = borrowerName;
//                 row.cells[6].textContent = borrowDate;
//                 row.cells[7].textContent = returnDate.toISOString().split('T')[0];
//                 row.cells[8].textContent = 'Borrowed';
//                 row.classList.add('borrowed');
        
//                 // Send borrow info to backend
//                 fetch('/api/data', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({
//                         BookId: bookId,
//                         Borrower: borrowerName,
//                         BorrowDate: borrowDate
//                     })
//                 })
//                 .then(response => response.json())
//                 .then(data => {
//                     if (data.message) {
//                         alert(`Book ID ${bookId} has been successfully borrowed.`);
//                         // Update dropdowns
//                         document.querySelector(`#borrowBookId option[value="${bookId}"]`)?.remove();
//                         const returnSelect = document.getElementById('returnBookId');
//                         const newOption = document.createElement('option');
//                         newOption.value = bookId;
//                         newOption.textContent = `${bookId} - ${row.cells[1].textContent}`;
//                         returnSelect.appendChild(newOption);
//                         document.getElementById('borrowForm').reset();
//                     } else {
//                         alert('Error updating borrow information.');
//                     }
//                 })
//                 .catch(error => {
//                     alert('Failed to update borrow information.');
//                     console.error('Error:', error);
//                 });
//             } else {
//                 alert('No book found with that ID.');
//             }
//         });
//     // Handle Borrow Form Submission
//     // document.getElementById('borrowForm').addEventListener('submit', function (event) {
//     //     event.preventDefault();
//     //     const bookId = document.getElementById('borrowBookId').value;
//     //     const borrowerName = document.getElementById('borrowerName').value.trim();
//     //     const borrowDate = document.getElementById('borrowDate').value;

//     //     if (!bookId || !borrowerName || !borrowDate) {
//     //         alert('Please fill in all fields.');
//     //         return;
//     //     }

//     //     if (!confirm(`Are you sure you want to borrow Book ID ${bookId}?`)) return;

//     //     const row = document.querySelector(`#book-table tr[data-id="${bookId}"]`);
//     //     if (row) {
//     //         const currentState = row.cells[8].textContent;
//     //         if (currentState === 'Borrowed') {
//     //             alert('This book is already borrowed.');
//     //             return;
//     //         }

//     //         const returnDate = new Date(borrowDate);
//     //         returnDate.setMonth(returnDate.getMonth() + 3); // Set the return date 3 months later

//     //         // Update the table with borrower info and return date
//     //         row.cells[5].textContent = borrowerName;
//     //         row.cells[6].textContent = borrowDate;
//     //         row.cells[7].textContent = returnDate.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
//     //         row.cells[8].textContent = 'Borrowed';
//     //         row.classList.add('borrowed');

//     //         // Send data to the backend to update the database
//     //         fetch('/api/data', {
//     //             method: 'POST',
//     //             headers: { 'Content-Type': 'application/json' },
//     //             body: JSON.stringify({
//     //                 BookId: bookId,
//     //                 Borrower: borrowerName,
//     //                 BorrowDate: borrowDate
//     //             })
//     //         })
//     //         .then(response => response.json())
//     //         .then(data => {
//     //             if (data.message) {
//     //                 alert(`Book ID ${bookId} has been successfully borrowed.`);

//     //                 // Remove the borrowed book from Borrow Form dropdown
//     //                 const borrowBookSelect = document.getElementById('borrowBookId');
//     //                 const optionToRemove = borrowBookSelect.querySelector(`option[value="${bookId}"]`);
//     //                 if (optionToRemove) optionToRemove.remove();

//     //                 // Add the borrowed book to Return Form dropdown
//     //                 const returnBookSelect = document.getElementById('returnBookId');
//     //                 const newReturnOption = document.createElement('option');
//     //                 newReturnOption.value = bookId;
//     //                 newReturnOption.textContent = `${bookId} - ${row.cells[1].textContent}`;
//     //                 returnBookSelect.appendChild(newReturnOption);

//     //                 // Clear the form
//     //                 document.getElementById('borrowForm').reset();
//     //             } else {
//     //                 alert('Error updating borrow information.');
//     //             }
//     //         })
//     //         .catch(error => {
//     //             alert('Failed to update borrow information. Please try again.');
//     //             console.error('Error:', error);
//     //         });
//     //     } else {
//     //         alert('No book found with that ID.');
//     //     }
//     // });

//     // Handle Return Form Submission
//     // document.getElementById('returnForm').addEventListener('submit', function (event) {
//     //     event.preventDefault();
//     //     const bookId = document.getElementById('returnBookId').value;
//     //     const returnDateInput = document.getElementById('returnDate').value;

//     //     if (!bookId || !returnDateInput) {
//     //         alert('Please fill in all fields.');
//     //         return;
//     //     }

//     //     if (!confirm(`Are you sure you want to return Book ID ${bookId}?`)) return;

//     //     const row = document.querySelector(`#book-table tr[data-id="${bookId}"]`);
//     //     if (row) {
//     //         const currentState = row.cells[8].textContent;
//     //         if (currentState !== 'Borrowed') {
//     //             alert('This book is not currently borrowed.');
//     //             return;
//     //         }

//     //         // Update the table to clear borrowing details and set status to "Present"
//     //         row.cells[5].textContent = '';  // Clear Borrower Name
//     //         row.cells[6].textContent = '';  // Clear Borrow Date
//     //         row.cells[7].textContent = '';  // Clear Return Date
//     //         row.cells[8].textContent = 'Present';  // Update Status to "Present"
//     //         row.classList.remove('borrowed');

//     //         // Send data to backend to update database (remove borrower details and set status to "Present")
//     //         fetch('/api/data', {
//     //             method: 'POST',
//     //             headers: { 'Content-Type': 'application/json' },
//     //             body: JSON.stringify({
//     //                 BookId: bookId,
//     //                 ReturnDate: returnDateInput
//     //             })
//     //         })
//     //         .then(response => response.json())
//     //         .then(data => {
//     //             if (data.message) {
//     //                 alert(`Book ID ${bookId} has been successfully returned.`);

//     //                 // Remove the returned book from Return Form dropdown
//     //                 const returnBookSelect = document.getElementById('returnBookId');
//     //                 const optionToRemove = returnBookSelect.querySelector(`option[value="${bookId}"]`);
//     //                 if (optionToRemove) optionToRemove.remove();

//     //                 // Add the returned book back to Borrow Form dropdown
//     //                 const borrowBookSelect = document.getElementById('borrowBookId');
//     //                 const newBorrowOption = document.createElement('option');
//     //                 newBorrowOption.value = bookId;
//     //                 newBorrowOption.textContent = `${bookId} - ${row.cells[1].textContent}`;
//     //                 borrowBookSelect.appendChild(newBorrowOption);

//     //                 // Clear the form
//     //                 document.getElementById('returnForm').reset();
//     //             } else {
//     //                 alert('Error updating return information.');
//     //             }
//     //         })
//     //         .catch(error => {
//     //             alert('Failed to update return information. Please try again.');
//     //             console.error('Error:', error);
//     //         });
//     //     } else {
//     //         alert('No book found with that ID.');
//     //     }
//     // });

//     document.getElementById('returnForm').addEventListener('submit', function (event) {
//         event.preventDefault();
//         const bookId = document.getElementById('returnBookId').value;
//         const returnDateInput = document.getElementById('returnDate').value;
//         const username = sessionStorage.getItem('username');
    
//         if (!bookId || !returnDateInput) {
//             alert('Please fill in all fields.');
//             return;
//         }
    
//         if (!username) {
//             alert('You must be logged in to return a book.');
//             return;
//         }
    
//         if (!confirm(`Are you sure you want to return Book ID ${bookId}?`)) return;
    
//         const row = document.querySelector(`#book-table tr[data-id="${bookId}"]`);
//         if (row) {
//             const currentState = row.cells[8].textContent;
//             const borrowerName = row.cells[5].textContent;
    
//             if (currentState !== 'Borrowed') {
//                 alert('This book is not currently borrowed.');
//                 return;
//             }
    
//             if (borrowerName !== username) {
//                 alert('You can only return books you borrowed.');
//                 return;
//             }
    
//             // Update table
//             row.cells[5].textContent = '';
//             row.cells[6].textContent = '';
//             row.cells[7].textContent = '';
//             row.cells[8].textContent = 'Present';
//             row.classList.remove('borrowed');
    
//             // Update backend
//             fetch('/api/data', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     BookId: bookId,
//                     ReturnDate: returnDateInput
//                 })
//             })
//             .then(response => response.json())
//             .then(data => {
//                 if (data.message) {
//                     alert(`Book ID ${bookId} has been successfully returned.`);
//                     document.querySelector(`#returnBookId option[value="${bookId}"]`)?.remove();
    
//                     const borrowSelect = document.getElementById('borrowBookId');
//                     const newOption = document.createElement('option');
//                     newOption.value = bookId;
//                     newOption.textContent = `${bookId} - ${row.cells[1].textContent}`;
//                     borrowSelect.appendChild(newOption);
//                     document.getElementById('returnForm').reset();
//                 } else {
//                     alert('Error updating return information.');
//                 }
//             })
//             .catch(error => {
//                 alert('Failed to update return information.');
//                 console.error('Error:', error);
//             });
//         } else {
//             alert('No book found with that ID.');
//         }
//     });
// };

window.onload = function () {
    initializeUI();
    initializeEventListeners();
    fetchAndPopulateBooks();
};

function initializeUI() {
    // const username = sessionStorage.getItem('username');
    // const loginSection = document.getElementById('loginSectionForm');
    // const addBookSection = document.getElementById('bookformaddition');
    // const userInfo = document.getElementById('userInfo');
    // const currentUser = document.getElementById('currentUser');

    // if (username) {
    //     loginSection.style.display = 'none';
    //     addBookSection.style.display = 'block';
    //     userInfo.style.display = 'block';
    //     currentUser.textContent = username;
    // } else {
    //     loginSection.style.display = 'block';
    //     addBookSection.style.display = 'none';
    //     userInfo.style.display = 'none';
    // }

    const username = sessionStorage.getItem('username');
    const role = sessionStorage.getItem('userRole'); // Get role from session storage

    const loginSection = document.getElementById('loginSectionForm');
    const addBookSection = document.getElementById('bookformaddition');
    const userInfo = document.getElementById('userInfo');
    const currentUser = document.getElementById('currentUser');

    if (username) {
        loginSection.style.display = 'none';
        userInfo.style.display = 'block';
        currentUser.textContent = username;

        if (role === 'admin') {
            addBookSection.style.display = 'block';
        } else {
            addBookSection.style.display = 'none';
        }
    } else {
        loginSection.style.display = 'block';
        addBookSection.style.display = 'none';
        userInfo.style.display = 'none';
    }
}

function initializeEventListeners() {
    document.getElementById('logoutBtn').addEventListener('click', () => {
        sessionStorage.clear();
        location.reload();
    });

    document.querySelectorAll('input').forEach((input) => {
        input.addEventListener('focus', () => {
            input.setAttribute('autocomplete', 'off');
        });
    });

    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('addBookForm').addEventListener('submit', handleAddBook);
    document.getElementById('borrowForm').addEventListener('submit', handleBorrow);
    document.getElementById('returnForm').addEventListener('submit', handleReturn);
}

function fetchAndPopulateBooks() {
    fetch('http://localhost:5000/api/books')
        .then(response => response.json())
        .then(data => {
            const bookTable = document.getElementById('book-table');
            const borrowBookSelect = document.getElementById('borrowBookId');
            const returnBookSelect = document.getElementById('returnBookId');

            borrowBookSelect.innerHTML = '<option value="">Select a Book</option>';
            returnBookSelect.innerHTML = '<option value="">Select a Book</option>';

            data.forEach(book => {
                const row = document.createElement('tr');
                row.setAttribute('data-id', book.BookId);
                row.innerHTML = `
                    <td>${book.BookId}</td>
                    <td style="color: black;">${book.Title}</td>
                    <td>${book.Author || 'Unknown'}</td>
                    <td>${book.Publisher || 'Unknown'}</td>
                    <td>${book.Genre || 'Unknown'}</td>
                    <td>${book.BorrowState ? book.Borrower : ''}</td>
                    <td>${book.BorrowState ? book.BorrowDate : ''}</td>
                    <td>${book.BorrowState ? book.ReturnDate : ''}</td>
                    <td>${book.BorrowState ? 'Borrowed' : 'Available'}</td>`;
                bookTable.appendChild(row);

                const option = document.createElement('option');
                option.value = book.BookId;
                option.textContent = `${book.BookId} - ${book.Title}`;

                if (book.BorrowState) {
                    returnBookSelect.appendChild(option);
                } else {
                    borrowBookSelect.appendChild(option);
                }
            });
        })
        .catch(error => console.error('Error fetching books:', error));
}

function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.role) {
            alert(`Welcome, ${username}! You are logged in as ${data.role}.`);
            sessionStorage.setItem('userRole', data.role);
            sessionStorage.setItem('username', username);
            applyRolePermissions(data.role);
            initializeUI();
        } else {
            alert(data.error);
        }
    })
    .catch(err => {
        console.error('Login failed:', err);
        alert('Login error. Try again.');
    });
}

function applyRolePermissions(role) {
    document.querySelector('#bookformaddition').style.display = role === 'admin' ? 'block' : 'none';
}

function handleAddBook(event) {
    event.preventDefault();

    const bookData = {
        BookId: document.getElementById('bookId').value.trim(),
        Title: document.getElementById('title').value.trim(),
        Author: document.getElementById('author').value.trim(),
        Publisher: document.getElementById('publisher').value.trim(),
        Genre: document.getElementById('genre').value.trim(),
        Borrower: '',
        BorrowDate: null,
        ReturnDate: null,
        BorrowState: false
    };

    if (!bookData.BookId || !bookData.Title || !bookData.Author || !bookData.Publisher || !bookData.Genre) {
        alert('Please fill in all required fields.');
        return;
    }

    fetch('/api/add_book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert('Book added successfully!');
            document.getElementById('addBookForm').reset();
            location.reload(); // Reload to refresh table
        } else {
            alert('Error adding book: ' + data.error);
        }
    })
    .catch(error => {
        alert('Failed to add book. Please try again.');
        console.error('Error:', error);
    });
}

// function handleBorrow(event) {
//     event.preventDefault();

//     const bookId = document.getElementById('borrowBookId').value;
//     const borrowDate = document.getElementById('borrowDate').value;
//     const borrowerName = sessionStorage.getItem('username');

//     if (!bookId || !borrowDate) return alert('Please fill in all fields.');
//     if (!borrowerName) return alert('You must be logged in to borrow a book.');
//     if (!confirm(`Are you sure you want to borrow Book ID ${bookId}?`)) return;

//     const row = document.querySelector(`#book-table tr[data-id="${bookId}"]`);
//     if (!row || row.cells[8].textContent === 'Borrowed') {
//         return alert('This book is already borrowed or not found.');
//     }

//     const returnDate = new Date(borrowDate);
//     returnDate.setMonth(returnDate.getMonth() + 3);

//     fetch('/api/data', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ BookId: bookId, Borrower: borrowerName, BorrowDate: borrowDate })
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.message) {
//             alert(`Book ID ${bookId} has been successfully borrowed.`);
//             row.cells[5].textContent = borrowerName;
//             row.cells[6].textContent = borrowDate;
//             row.cells[7].textContent = returnDate.toISOString().split('T')[0];
//             row.cells[8].textContent = 'Borrowed';
//             row.classList.add('borrowed');

//             document.querySelector(`#borrowBookId option[value="${bookId}"]`)?.remove();

//             const returnSelect = document.getElementById('returnBookId');
//             const newOption = document.createElement('option');
//             newOption.value = bookId;
//             newOption.textContent = `${bookId} - ${row.cells[1].textContent}`;
//             returnSelect.appendChild(newOption);

//             document.getElementById('borrowForm').reset();
//         } else {
//             alert('Error updating borrow information.');
//         }
//     })
//     .catch(error => {
//         alert('Failed to update borrow information.');
//         console.error('Error:', error);
//     });
// }

function handleBorrow(event) {
    event.preventDefault();

    const bookId = document.getElementById('borrowBookId').value;
    const borrowDate = document.getElementById('borrowDate').value;
    const borrowerName = sessionStorage.getItem('username');

    // Validation checks
    if (!bookId || !borrowDate) return alert('Please fill in all fields.');
    if (!borrowerName) return alert('You must be logged in to borrow a book.');
    if (!confirm(`Are you sure you want to borrow Book ID ${bookId}?`)) return;

    const row = document.querySelector(`#book-table tr[data-id="${bookId}"]`);
    if (!row || row.cells[8].textContent === 'Borrowed') {
        return alert('This book is already borrowed or not found.');
    }

    // Calculate a soft due date for the book
    const returnDate = new Date(borrowDate);
    returnDate.setMonth(returnDate.getMonth() + 3);

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
            row.cells[5].textContent = borrowerName;  // Borrower Name
            row.cells[6].textContent = borrowDate;    // Borrow Date
            row.cells[7].textContent = '';            // Clear Return Date (empty initially)

            // Update book status
            row.cells[8].textContent = 'Borrowed';
            row.classList.add('borrowed');

            // Remove book from borrow options
            document.querySelector(`#borrowBookId option[value="${bookId}"]`)?.remove();

            // Add to return book dropdown
            const returnSelect = document.getElementById('returnBookId');
            const newOption = document.createElement('option');
            newOption.value = bookId;
            newOption.textContent = `${bookId} - ${row.cells[1].textContent}`;
            returnSelect.appendChild(newOption);

            // Reset the borrow form
            document.getElementById('borrowForm').reset();
        } else {
            alert('Error updating borrow information.');
        }
    })
    .catch(error => {
        alert('Failed to update borrow information.');
        console.error('Error:', error);
    });
}

function handleReturn(event) {
    event.preventDefault();

    const bookId = document.getElementById('returnBookId').value;
    const returnDateInput = document.getElementById('returnDate').value;
    const username = sessionStorage.getItem('username');

    if (!bookId || !returnDateInput) return alert('Please fill in all fields.');
    if (!username) return alert('You must be logged in to return a book.');
    if (!confirm(`Are you sure you want to return Book ID ${bookId}?`)) return;

    const row = document.querySelector(`#book-table tr[data-id="${bookId}"]`);
    if (!row || row.cells[8].textContent !== 'Borrowed' || row.cells[5].textContent !== username) {
        return alert('Invalid return. Check that the book is borrowed by you.');
    }

    fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ BookId: bookId, ReturnDate: returnDateInput })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(`Book ID ${bookId} has been successfully returned.`);
            row.cells[5].textContent = '';
            row.cells[6].textContent = '';
            row.cells[7].textContent = '';
            row.cells[8].textContent = 'Available';
            row.classList.remove('borrowed');

            document.querySelector(`#returnBookId option[value="${bookId}"]`)?.remove();

            const borrowSelect = document.getElementById('borrowBookId');
            const newOption = document.createElement('option');
            newOption.value = bookId;
            newOption.textContent = `${bookId} - ${row.cells[1].textContent}`;
            borrowSelect.appendChild(newOption);

            document.getElementById('returnForm').reset();
        } else {
            alert('Error updating return information.');
        }
    })
    .catch(error => {
        alert('Failed to update return information.');
        console.error('Error:', error);
    });
}
