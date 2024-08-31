document.addEventListener('DOMContentLoaded', () => {
    const socket = new WebSocket('ws://192.168.43.7:16000');
    // 需要链接其他主机作为服务器时，将localhost改为对方主机ip地址即可，端口号按需修改

    socket.onopen = () => {
        console.log('WebSocket connection opened.');
    };

    socket.onmessage = (event) => {
        const response = JSON.parse(event.data);
        console.log('Response:', response);
        if (response.action === 'register' && response.success) {
            alert('注册成功！');
            window.location.href = 'index.html';  // Redirect to login page
        } else {
            alert('注册失败！');
        }
    };

    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    document.getElementById('registerForm').onsubmit = (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            alert('密码不一致，请重新输入。');
            return;
        }

        const request = {
            action: 'register',
            username: username,
            password: password
        };

        console.log('Sending request:', request);  // Debugging line
        socket.send(JSON.stringify(request));
    };
});
