// Delete all existing nodes and relationships (for reset purposes)
MATCH (n)
DETACH DELETE n;

// Constraint to ensure unique Book ID
CREATE CONSTRAINT book_id_unique IF NOT EXISTS
FOR (b:Book)
REQUIRE b.id IS UNIQUE;

// Create sample books
CREATE (:Book {id: 'B001', title: '1984', author: 'George Orwell'}),
       (:Book {id: 'B002', title: 'To Kill a Mockingbird', author: 'Harper Lee'}),
       (:Book {id: 'B003', title: 'Pride and Prejudice', author: 'Jane Austen'});

// Create sample borrowers
CREATE (:Borrower {name: 'U001'}),
       (:Borrower {name: 'U002'});

// Example borrow relationships
MATCH (b:Borrower {name: 'U001'}), (bk:Book {id: 'B001'})
CREATE (b)-[:BORROWED]->(bk);

MATCH (b:Borrower {name: 'U002'}), (bk:Book {id: 'B002'})
CREATE (b)-[:BORROWED]->(bk);