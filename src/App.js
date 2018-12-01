import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

class BooksApp extends React.Component {
  state = {
     books: [],
     showSearchPage: false,
     searchedBooks: []
  }

  componentDidMount() {
    BooksAPI.getAll().then(books => {
      this.setState({ books });
    });
  }

  updateBook = (e, index, searchedBooks) => {
    const books = this.state.books;

    if(searchedBooks){

      const newBook = this.state.searchedBooks[index];
      let addNewBook = true;
      this.state.books.forEach((bookS, i) => {
        if(newBook.id === bookS.id){
          books[i].shelf = e.target.value;
          addNewBook = false;
        }
      })
      if(addNewBook){
        newBook.shelf = e.target.value;
        books.push(newBook)
      }
    } else {
      books[index].shelf = e.target.value;
    }
    this.setState({
      books
    })
  }

  addBook = (book, index, searchedBooks = false) => {
    return (
      <li key={index}>
        <div className="book">
          <div className="book-top">
            <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: 'url("' + book.imageLinks.thumbnail + '")' }}></div>
            <div className="book-shelf-changer">
              <select onChange={e => this.updateBook(e, index, searchedBooks)} value={searchedBooks ? this.state.searchedBooks[index].shelf : this.state.books[index].shelf}>
                <option value="move" disabled>Move to...</option>
                <option value="currentlyReading">Currently Reading</option>
                <option value="wantToRead">Want to Read</option>
                <option value="read">Read</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>
          <div className="book-title">{book.title}</div>
          <div className="book-authors">{book.authors[0]}</div>
        </div>
      </li>
    )
  }

  searchBook = (e) => {
    BooksAPI.search(e.target.value).then(books => {
      this.setState({
        searchedBooks: Array.isArray(books) ? books.filter((book) => {return (book.imageLinks !== undefined) }).map((book) => {
          book.shelf = "none";
          this.state.books.forEach((bookS) => {
            if(book.id === bookS.id){
              book.shelf = bookS.shelf;
            }
          })
          if(book.authors === undefined) book.authors = [];
          return book;}) : []
      })
    });
  }

  searchPage = () => {
    const searchedBooksList = [];
    this.state.searchedBooks.forEach((book, index) => {
      searchedBooksList.push(this.addBook(book, index, true))
    })
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link to="/"><button className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</button></Link>
          <div className="search-books-input-wrapper">
            {/*
              NOTES: The search from BooksAPI is limited to a particular set of search terms.
              You can find these search terms here:
              https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

              However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
              you don't find a specific author or title. Every search is limited by search terms.
            */}
            <input type="text" placeholder="Search by title or author" onChange={this.searchBook}/>
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            {searchedBooksList}
          </ol>
        </div>
      </div>
    )
  }

  homePage = () => {
    const currentlyReading = [];
    const wantToRead = [];
    const read = [];

    console.log(this.state.searchedBooks)
    this.state.books.forEach((book, index) => {
      if(book.shelf === "currentlyReading"){
        currentlyReading.push(this.addBook(book, index))
      }
      if(book.shelf === "wantToRead"){
        wantToRead.push(this.addBook(book, index))
      }
      if(book.shelf === "read"){
        read.push(this.addBook(book, index))
      }
    })
    return (
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        <div className="list-books-content">
          <div>
            <div className="bookshelf">
              <h2 className="bookshelf-title">Currently Reading</h2>
              <div className="bookshelf-books">
                <ol className="books-grid">
                  {currentlyReading}
                </ol>
              </div>
            </div>
            <div className="bookshelf">
              <h2 className="bookshelf-title">Want to Read</h2>
              <div className="bookshelf-books">
                <ol className="books-grid">
                  {wantToRead}
                </ol>
              </div>
            </div>
            <div className="bookshelf">
              <h2 className="bookshelf-title">Read</h2>
              <div className="bookshelf-books">
                <ol className="books-grid">
                  {read}
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div className="open-search">
          <Link to="/search"><button>Add a book</button></Link>
        </div>
      </div>
    )
  }

  render() {
    return (
      <Router>
      <div className="app">

          <Route exact path="/" component={this.homePage} />
          <Route exact path="/search" component={this.searchPage} />

      </div>
      </Router>
    )
  }
}

export default BooksApp
