class Book{
    constructor(title,author,isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}


class UI{
    addBookToList(book){
        const list = document.getElementById('book-list');
        const row = document.createElement('tr');
        // Insert Cols
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">X</a></td>
        `;
        list.appendChild(row);
    }

    showAlert(message,className){
        const div = document.createElement('div');
        div.className = `alert ${className}`;
        div.textContent = message;
    
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
    
        container.insertBefore(div,form);
        setTimeout(function(){
            document.querySelector('.alert').remove();
        },2000);
    }

    removeBook(target){
        target.parentElement.parentElement.remove();
    }

    clearFields(){
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
}

// Local Storage Class
class Store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books')===null)
            books = [];
        else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static displayBooks(){
        const Books = Store.getBooks();
        const ui = new UI();

        Books.forEach(function(book){
            ui.addBookToList(book);
        })
    }

    static addBooks(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books',JSON.stringify(books));
    }

    static deleteBook(isbn){
        const books = Store.getBooks();
        books.forEach(function(book,index){
            if(book.isbn == isbn){
                books.splice(index,1);
            }
        })
        localStorage.setItem('books',JSON.stringify(books));
    }
}

document.addEventListener('DOMContentLoaded',function(){
    Store.displayBooks();
})


document.getElementById('book-form').addEventListener('submit',function(e){
    const title = document.getElementById('title').value,
          author = document.getElementById('author').value,
          isbn = document.getElementById('isbn').value;

    // Instantiate Book
    const book = new Book(title,author,isbn);
    
    // Instantiate UI
    const ui = new UI();

    //Validate
    if(title === '' || author === '' || isbn === ''){
        ui.showAlert('Please fill in all fields','error');
    }else{
        ui.addBookToList(book);
        Store.addBooks(book);
        ui.showAlert('Book Added!','success');
        ui.clearFields();
    }

    e.preventDefault();
})

document.getElementById('book-list').addEventListener('click',function(e){
    const ui = new UI();
    if(e.target.className == 'delete'){
        ui.removeBook(e.target);
        Store.deleteBook(e.target.parentElement.previousElementSibling.textContent);
        ui.showAlert('Book Removed!','success');
    }
    e.preventDefault();
})