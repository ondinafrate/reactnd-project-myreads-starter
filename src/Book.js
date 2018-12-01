import React from 'react'

class Book extends React.Component {

  render(){
    const { book, index, searchedBooks = false, stateSearchedBooks, books, updateBook } = this.props;
    return (
      <li key={index}>
        <div className="book">
          <div className="book-top">
            <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: 'url("' + book.imageLinks.thumbnail + '")' }}></div>
            <div className="book-shelf-changer">
              <select onChange={e => updateBook(e, index, searchedBooks)} value={searchedBooks ? stateSearchedBooks[index].shelf : books[index].shelf}>
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

}

export default Book;
