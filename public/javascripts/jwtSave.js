// 获取登录按钮
const loginButton = document.getElementById('loginButton');

const f = function () {
    const username = document.querySelector('input[name="username"]').value;
    const password = document.querySelector('input[name="password"]').value;

    // 获取当前时间戳（可以用来保证每次密码都是不一样的）
    const currentTime = Date.now();

    // 将密码与当前时间戳拼接
    const passwordWithTime = password + currentTime;

    // 使用 TextEncoder 将字符串转换为 Uint8Array
    const encoder = new TextEncoder();
    const data = encoder.encode(passwordWithTime);

    // 使用浏览器原生的 Web Crypto API 进行 SHA-256 哈希
    crypto.subtle.digest('SHA-256', data)
        .then(hashBuffer => {
            // 将 ArrayBuffer 转换为十六进制字符串
            const hashArray = Array.from(new Uint8Array(hashBuffer)); // ArrayBuffer 转换为字节数组
            const hashedPassword = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

            console.log(username, hashedPassword, currentTime);

            // 发送 AJAX 请求到后端
            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: hashedPassword, // 发送哈希后的密码
                    time: currentTime
                })
            })
                .then(response => response.json())  // 解析返回的 JSON
                .then(data => {
                    if (data.token) {
                        // 跳转到另一个页面，或者做其他处理
                        window.location.href = data.token;
                    } else {
                        // 显示错误信息
                        document.querySelector('.error-message').textContent = 'Login failed';
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    document.querySelector('.error-message').textContent = 'An error occurred';
                });
        })
        .catch(error => {
            console.error('Error during hashing:', error);
            document.querySelector('.error-message').textContent = 'Error occurred while hashing password';
        });
};

loginButton.addEventListener('click', f);