document.addEventListener("DOMContentLoaded", function() {
    const userId = sessionStorage.getItem("user_id");
    const username = sessionStorage.getItem("username");

    if (!userId || !username) {
        alert("用户信息缺失，请重新登录");
        window.location.href = "index.html";
        return;
    }

    document.getElementById("username").innerText = username;
    document.getElementById("user-id").innerText = userId;

    const socket = new WebSocket("ws://192.168.43.7:16000");
    // 需要链接其他主机作为服务器时，将localhost改为对方主机ip地址即可，端口号按需修改

    let currentPage = 1;
    const rowsPerPage = 15;
    let booksData = [];

    socket.onopen = function() {
        loadBooks();
    };

    socket.onmessage = function(event) {
        const response = JSON.parse(event.data);

        if (response.action === "get_books") {
            booksData = response.books;
            displayBooks(booksData);
        } else if (response.action === "delete_book") {
            if (response.success) {
                alert("书籍删除成功");
                loadBooks();
            } else {
                alert("书籍删除失败");
            }
        }
    };

    document.getElementById("search-btn").addEventListener("click", function() {
        const searchQuery = document.getElementById("search-input").value.trim().toLowerCase();
        const filteredBooks = booksData.filter(book =>
            book.title.toLowerCase().includes(searchQuery)
        );
        displayBooks(filteredBooks);
    });

    document.getElementById("add-book-btn").addEventListener("click", function() {
        window.location.href = "add.html";
    });

    document.getElementById("logout-btn").addEventListener("click", function() {
        sessionStorage.clear();
        window.location.href = "index.html";
        alert("注销成功");
    });

    document.getElementById("prev-page").addEventListener("click", function() {
        if (currentPage > 1) {
            currentPage--;
            displayBooks(booksData);
        }
    });

    document.getElementById("next-page").addEventListener("click", function() {
        if (currentPage < Math.ceil(booksData.length / rowsPerPage)) {
            currentPage++;
            displayBooks(booksData);
        }
    });

    function loadBooks() {
        const request = { action: "get_books" };
        socket.send(JSON.stringify(request));
    }

    function displayBooks(books) {
        const tableBody = document.querySelector("#book-table tbody");
        tableBody.innerHTML = "";

        const start = (currentPage - 1) * rowsPerPage;
        const end = Math.min(start + rowsPerPage, books.length);

        for (let i = start; i < end; i++) {
            const book = books[i];
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${book.bookID}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.publication_year}</td>
                <td>${book.publisher}</td>
                <td>${book.entry_date}</td>
                <td>${book.status}</td>
                <td><button class="delete-btn" data-book-id="${book.bookID}">删除</button></td>
            `;
            tableBody.appendChild(row);
        }

        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", function() {
                const bookId = parseInt(this.getAttribute("data-book-id"), 10);
                console.log(`Deleting book with ID: ${bookId}`);  // Debugging line
                if (confirm("确定要删除这本书籍吗？")) {
                    const request = {
                        action: "delete_book",
                        book_id: bookId
                    };
                    socket.send(JSON.stringify(request));
                }
            });
        });
    }
});
