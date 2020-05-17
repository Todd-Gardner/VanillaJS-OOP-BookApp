// TODO: Add animation to buttons and alrts

//----- Book Class: Represents a Book -----
class Book {
  /** Just to show **
   * @param {String} title
   * @param {String} author
   * @param {String} isbn
   */
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

//----- UI Class: Handles UI Tasks -----
//static methods so don't have to instantiate every time & avail. outside class
class UI {
  static displayBooks() {
    //hard-coding before adding storage
    /*  const storedBooks = [
      {
        title: "Book One",
        author: "Some Guy",
        isbn: "65465411",
      },
      {
        title: "Book Two",
        author: "Todd Gardner",
        isbn: "12365461",
      },
    ];
    const books = storedBooks; */

    const books = Store.getBooks();
    // Loop through all of the books
    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    // Target tbody
    const list = document.querySelector("#book-list");
    // Create row(s) in the tbody
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href='#' class='btn btn-danger btn-sm delete'>X</a></td>
    `;
    // Or can maybe use button/icon - something like:
    // <td><button><i class="fas fa-trash delete"</button></td>
    
    // Append list elements to tbody
    list.appendChild(row);
  }

  static deleteBook(element) {
    if (element.classList.contains("delete")) {
      element.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const form = document.querySelector("#book-form");
    form.prepend(div); //move above button?
    //const container = document.querySelector(".container");
    //container.insertBefore(div, form); --replaced with prepend()--
    
    // Remove alert after 3 seconds
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }

  static clearFields() {
    /* document.querySelector("#title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = ""; */
    document.getElementById("book-form").reset();
  }
}

//----- Store Class: Handles Local Storage -----
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books")); //convert to Array
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

//----- Events -----
// Event: Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks); //*** Entry point ***//

// Event: Add a Book (collect values, validate, instantiate, add)
document.querySelector("#book-form").addEventListener("submit", (e) => {
  // Prevent actual submit action
  e.preventDefault();

  // Get for values (or .querySelector(#title))
  const title = document.querySelector("#title").value;
  const author = document.getElementById("author").value;
  const isbn = document.getElementById("isbn").value;

  // Validate Fields
  if (title === "" || author === "" || isbn === "") {
    //alert("Please fill in all of the fields");
    UI.showAlert("Please fill in all of the fields", "danger");
  } else {
    // Instantiate book
    const book = new Book(title, author, isbn);
    //console.log("book", book);

    // Add Book to UI
    UI.addBookToList(book);

    // Add Book to Store
    Store.addBook(book);

    // Clear Fields
    UI.clearFields();

    // Show Success Message
    UI.showAlert("Book successfully added!", "success");
  }
});

// Event: Remove a Book
document.querySelector("#book-list").addEventListener("click", (e) => {
  // Remove Book From UI
  UI.deleteBook(e.target);

  // Remove Book From Store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // Show Success Message
  UI.showAlert("Book successfully removed!", "success");
});
