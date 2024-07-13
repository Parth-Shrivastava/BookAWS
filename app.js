import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, gql } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Use environment variables for the GraphQL endpoint and API key
const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// Create an HTTP link to the GraphQL endpoint
const httpLink = new HttpLink({ uri: GRAPHQL_ENDPOINT });

// Add API key to the headers
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'x-api-key': API_KEY,
    }
  };
});

// Create an Apollo Client
const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache()
});

// Define GraphQL queries and mutations
const LIST_BOOKS = gql`
  query ListBooks {
    listBooks {
      Book
      Author
      Volumes
      Rating
    }
  }
`;

const GET_BOOK = gql`
  query GetBook($Book: String!) {
    getBook(Book: $Book) {
      Book
      Author
      Volumes
      Rating
    }
  }
`;

const CREATE_BOOK = gql`
  mutation CreateBook($Book: String!, $Author: String!, $Volumes: Int, $Rating: Float) {
    createBook(Book: $Book, Author: $Author, Volumes: $Volumes, Rating: $Rating) {
      Book
      Author
      Volumes
      Rating
    }
  }
`;

// Fetch and display all books
const fetchBooks = async () => {
  try {
    const result = await client.query({ query: LIST_BOOKS });
    const booksList = document.getElementById('books-list');
    booksList.innerHTML = '';
    result.data.listBooks.forEach(book => {
      const bookItem = document.createElement('div');
      bookItem.textContent = `${book.Book} by ${book.Author} - Volumes: ${book.Volumes}, Rating: ${book.Rating}`;
      booksList.appendChild(bookItem);
    });
  } catch (error) {
    console.error('Error fetching books:', error);
  }
};

// Fetch and display a single book
const fetchBook = async (bookTitle) => {
  try {
    const result = await client.query({ query: GET_BOOK, variables: { Book: bookTitle } });
    const singleBook = document.getElementById('single-book');
    singleBook.innerHTML = '';
    if (result.data.getBook) {
      const book = result.data.getBook;
      const bookItem = document.createElement('div');
      bookItem.textContent = `${book.Book} by ${book.Author} - Volumes: ${book.Volumes}, Rating: ${book.Rating}`;
      singleBook.appendChild(bookItem);
    } else {
      singleBook.textContent = 'Book not found';
    }
  } catch (error) {
    console.error('Error fetching book:', error);
  }
};

// Add a new book
const addBookForm = document.getElementById('add-book-form');
addBookForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const book = document.getElementById('book').value;
  const author = document.getElementById('author').value;
  const volumes = parseInt(document.getElementById('volumes').value);
  const rating = parseFloat(document.getElementById('rating').value);

  try {
    await client.mutate({
      mutation: CREATE_BOOK,
      variables: { Book: book, Author: author, Volumes: volumes, Rating: rating }
    });
    fetchBooks();
    addBookForm.reset();
  } catch (error) {
    console.error('Error adding book:', error);
  }
});

// Handle fetching a single book
const getBookForm = document.getElementById('get-book-form');
getBookForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const bookTitle = document.getElementById('get-book').value;
  fetchBook(bookTitle);
});

// Initial fetch of all books
fetchBooks();
