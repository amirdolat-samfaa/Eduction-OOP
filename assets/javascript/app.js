// PROJECT
class Post{
    constructor(title, author, body) {
        this.title = title;
        this.author = author;
        this.body = body;
    }
}

class Ui{
    addPostToList(post){
        // Get List Post
        const list = document.getElementById("post-list");

        // Create Tr Element
        const row = document.createElement("tr");

        // Insert Cols
        row.innerHTML = `
            <th>${post.title}</th>
            <td>${post.author}</td>
            <td>${post.body}</td>
            <td> <i class="bi bi-x text-danger fs-3 delete"></i>  <i class="bi bi-pencil-square edit text-primary fs-6"></i> </td>
        `;
        list.appendChild(row);
    }

    clearFields() {
        // document.getElementById("title").value = '';
        // document.getElementById("author").value = '';
        // document.getElementById("body").value = '';
        Store.setForm();
        /*
        برای تمیز کردن کد استفاده شده است
        */
    }

    showAlert(message, className) {
        // Create Div
        const div = document.createElement('div');

        // Add Class
        div.className = `alert alert-${className}`;

        // Add Text
        div.appendChild(document.createTextNode(message));

        // Get Parent
        const col = document.querySelector('.col-sm-8');

        // Get Form
        const form = document.querySelector('#post-form');

        // Insert Alert
        col.insertBefore(div, form);

        // TimeOut After 3 Sec
        setTimeout(function(){
            document.querySelector('.alert').remove();
        }, 3000);
    }

    deletePost(target) {
        target.parentElement.parentElement.remove();
    }
}

// Local Storage Class
class Store{
    static getPosts() {
        let posts;
        if(localStorage.getItem('posts') === null){
            posts = [];
        } else {
            posts = JSON.parse(localStorage.getItem('posts'));
        }
        return posts;
    }

    static displayPosts() {
        const posts = Store.getPosts();
        posts.forEach(function(post){
            const ui = new Ui;

            // Add Book To UI
            ui.addPostToList(post);
        });
    }

    static addPost(post) {
        const posts = Store.getPosts();
        posts.push(post);
        localStorage.setItem('posts',JSON.stringify(posts));
    }

    static removePost(title) {
        const posts = Store.getPosts();
        posts.forEach(function(post, index){
            if(post.title === title){
                posts.splice(index, 1);
            }
        });
        localStorage.setItem('posts', JSON.stringify(posts));
    }

    static setForm(obj){
        if(obj){
            document.getElementById("title").value = obj.title;
            document.getElementById("author").value = obj.author;
            document.getElementById("body").value = obj.body;
            /*
            برای پر کردن فرم
            */
        } else{
            document.getElementById("title").value = "";
            document.getElementById("author").value = "";
            document.getElementById("body").value = "";
            /*
                    برای خالی کردن فرم 
            */
        }
    }

    static editPost(title){
        const posts = Store.getPosts();
        posts.forEach(function(post){
            if(post.title === title){
                // document.getElementById("title").value = post.title
                // document.getElementById("author").value = post.author
                // document.getElementById("body").value = post.body
                /*
                    برای تمیزی کد متد پایین رو تعریف کردیم
                */
                Store.setForm(post);
            }
        })
    }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayPosts);

// Event Listener For Add Post
document.getElementById("post-form").addEventListener("submit",function(e){

    // Get Form Value
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const body = document.getElementById("body").value;

    // Instantiate Post
    const post = new Post(title, author, body);
    
    // Instantiate ui
    const ui = new Ui();

    // Validate
    if(title === '' || author === '' || body === '') {
        // Error Alert
        ui.showAlert('تکمیل کردن تمامی فیلد ها الزامی است.', 'danger');
    } else {
        // Add Book To List
        ui.addPostToList(post);

        // Add To LS
        Store.addPost(post);

        // Show Success
        ui.showAlert('پست اضافه شد! ', 'success');

        // Clear Fields
        ui.clearFields();
    }

    e.preventDefault();
})

// Event Listener To Delete
document.getElementById("post-list").addEventListener('click', function(e){

    // instantiate UI
    const ui = new Ui();

    if(e.target.classList.contains('delete')) {

        // Delete Book
        ui.deletePost(e.target);

        // Remove From LS
        const tr = e.target.parentElement.parentElement;
        const title = tr.firstElementChild.textContent;
        Store.removePost(title);

        // Show message
        ui.showAlert('پست با موفقیت حذف شد.', 'success');
    }
    if(e.target.classList.contains('edit')){
        const tr = e.target.parentElement.parentElement;
        const title = tr.firstElementChild.textContent;
        Store.editPost(title);
    }


    e.preventDefault();
})