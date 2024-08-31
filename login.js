document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("login-form");

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const socket = new WebSocket("ws://192.168.43.7:16000");
        // 需要链接其他主机作为服务器时，将localhost改为对方主机ip地址即可，端口号按需修改

        socket.onopen = function() {
            console.log("WebSocket connection opened");
            const request = {
                action: "login",
                username: username,
                password: password
            };
            socket.send(JSON.stringify(request));
        };

        socket.onmessage = function(event) {
            const response = JSON.parse(event.data);
            console.log(response);

            if (response.action === "login") {
                if (response.success) {
                    alert("登录成功");

                    // 保存用户信息到 sessionStorage
                    sessionStorage.setItem("user_id", response.user_id);
                    sessionStorage.setItem("username", username);

                    window.location.href = "books.html";
                } else {
                    alert("登录失败，用户名或密码错误");
                }
            }
        };

        socket.onerror = function(error) {
            console.error("WebSocket error:", error);
            alert("连接错误，请检查网络连接");
        };

        socket.onclose = function() {
            console.log("WebSocket connection closed");
        };
    });
});
