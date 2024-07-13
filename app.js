const { ApolloClient, InMemoryCache, HttpLink, ApolloLink, gql } = apolloClient;
const { setContext } = apolloLinkContext;

const GRAPHQL_ENDPOINT = 'YOUR_GRAPHQL_ENDPOINT';
const API_KEY = 'YOUR_API_KEY';

const httpLink = new HttpLink({ uri: GRAPHQL_ENDPOINT });

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'x-api-key': API_KEY,
    }
  };
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache()
});

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

fetchBooks();
