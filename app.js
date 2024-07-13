import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, gql } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Provided GraphQL endpoint and API key
const GRAPHQL_ENDPOINT = 'https://odlqrjdtvfbuvjtpxkw3hrxeoq.appsync-api.eu-north-1.amazonaws.com/graphql';
const API_KEY = 'da2-mzumx42bxrdndp3vjtsiwmttca';

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

// Fetch and display books
const fetchBooks = async () => {
  const result = await client.query({ query: LIST_BOOKS });
  const booksList = document.getElementById('books-list');
  booksList.innerHTML = '';
  result.data.listBooks.forEach(book => {
    const bookItem = document.createElement('div');
    bookItem.textContent = `${book.Book} by ${book.Author} - Volumes: ${book.Volumes}, Rating: ${book.Rating}`;
    booksList.appendChild(bookItem);
  });
};

// Add a book
const addBookForm = document.getElementById('add-book-form');
addBookForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const book = document.getElementById('book').value;
  const author = document.getElementById('author').value;
  const volumes = parseInt(document.getElementById('volumes').value);
  const rating = parseFloat(document.getElementById('rating').value);

  await client.mutate({
    mutation: CREATE_BOOK,
    variables: { Book: book, Author: author, Volumes: volumes, Rating: rating }
  });

  fetchBooks();
  addBookForm.reset();
});

// Initial fetch of books
fetchBooks();
