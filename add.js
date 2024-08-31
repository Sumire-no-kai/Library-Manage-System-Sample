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

    document.getElementById("add-book-form").addEventListener("submit", function(event) {
        event.preventDefault();

        const title = document.getElementById("title").value;
        const author = document.getElementById("author").value;
        const publication_year = document.getElementById("publication_year").value;
        const publisher = document.getElementById("publisher").value;
        const entry_date = document.getElementById("entry_date").value;

        const request = {
            action: "insert_book",
            title: title,
            author: author,
            publication_year: publication_year,
            publisher: publisher,
            entry_date: entry_date
        };

        socket.send(JSON.stringify(request));
    });

    socket.onmessage = function(event) {
        const response = JSON.parse(event.data);
        if (response.action === "insert_book") {
            if (response.success) {
                alert("书籍添加成功");
                window.location.href = "books.html";
            } else {
                alert("书籍添加失败");
            }
        }
    };

    document.getElementById("logout-btn").addEventListener("click", function() {
        sessionStorage.clear();
        window.location.href = "index.html";
        alert("注销成功");
    });
});