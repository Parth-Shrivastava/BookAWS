const apiUrl = "https://odlqrjdtvfbuvjtpxkw3hrxeoq.appsync-api.eu-north-1.amazonaws.com/graphql";
const apiKey = "da2-xokwvnro7bhtjawm2pj7j2swma";

document.addEventListener("DOMContentLoaded", () => {
    listBooks();

    document.getElementById("getBookForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        const bookTitle = document.getElementById("getBookTitle").value;
        const bookAuthor = document.getElementById("getBookAuthor").value;
        const book = await getBook(bookTitle, bookAuthor);
        document.getElementById("getBookOutput").innerText = JSON.stringify(book, null, 2);
    });

    document.getElementById("createBookForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        const bookTitle = document.getElementById("createBookTitle").value;
        const bookAuthor = document.getElementById("createBookAuthor").value;
        const bookVolumes = parseInt(document.getElementById("createBookVolumes").value, 10);
        const bookRating = parseFloat(document.getElementById("createBookRating").value);
        const newBook = await createBook(bookTitle, bookAuthor, bookVolumes, bookRating);
        document.getElementById("createBookOutput").innerText = JSON.stringify(newBook, null, 2);
        listBooks();
    });

    document.getElementById("deleteBookForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        const bookTitle = document.getElementById("deleteBookTitle").value;
        const bookAuthor = document.getElementById("deleteBookAuthor").value;
        const deletedBook = await deleteBook(bookTitle, bookAuthor);
        document.getElementById("deleteBookOutput").innerText = JSON.stringify(deletedBook, null, 2);
        listBooks();
    });
});

// Function to fetch a specific book
async function getBook(book, author) {
    const query = `
        query GetBook($Book: String!, $Author: String!) {
            getBook(Book: $Book, Author: $Author) {
                Book
                Author
                Volumes
                Rating
            }
        }
    `;

    const variables = { Book: book, Author: author };

    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey
        },
        body: JSON.stringify({ query, variables })
    });

    const responseBody = await response.json();
    return responseBody.data.getBook;
}

// Function to list all books
async function listBooks() {
    const query = `
        query ListBooks {
            listBooks {
                Book
                Author
                Volumes
                Rating
            }
        }
    `;

    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey
        },
        body: JSON.stringify({ query })
    });

    const responseBody = await response.json();
    document.getElementById("listBooksOutput").innerText = JSON.stringify(responseBody.data.listBooks, null, 2);
}

// Function to create a new book
async function createBook(book, author, volumes, rating) {
    const mutation = `
        mutation CreateBook($Book: String!, $Author: String!, $Volumes: Int, $Rating: Float) {
            createBook(Book: $Book, Author: $Author, Volumes: $Volumes, Rating: $Rating) {
                Book
                Author
                Volumes
                Rating
            }
        }
    `;

    const variables = { Book: book, Author: author, Volumes: volumes, Rating: rating };

    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey
        },
        body: JSON.stringify({ query: mutation, variables })
    });

    const responseBody = await response.json();
    return responseBody.data.createBook;
}

// Function to delete a book
async function deleteBook(book, author) {
    const mutation = `
        mutation DeleteBook($Book: String!, $Author: String!) {
            deleteBook(Book: $Book, Author: $Author) {
                Book
                Author
                Volumes
                Rating
            }
        }
    `;

    const variables = { Book: book, Author: author };

    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey
        },
        body: JSON.stringify({ query: mutation, variables })
    });

    const responseBody = await response.json();
    return responseBody.data.deleteBook;
}
