document.addEventListener("DOMContentLoaded", function () {
    console.log("Admin panel script loaded.");

    // 处理 Tab 切换
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');

    function showTab(index) {
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.style.display = 'none');

        tabs[index].classList.add('active');
        contents[index].style.display = 'block';
    }

    if (tabs.length > 0 && contents.length > 0) {
        showTab(0);
    }

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => showTab(index));
    });

    // 处理“修改”和“删除”按钮点击事件
    document.querySelectorAll(".btn-edit, .btn-delete").forEach(button => {
        button.addEventListener("click", function () {
            const row = this.closest("tr"); // 获取当前按钮所在的行
            const rowData = [...row.children].slice(0, -1).map(td => td.textContent.trim()); // 读取行数据，去掉最后的操作列

            console.log(`点击了【${this.classList.contains("btn-edit") ? "修改" : "删除"}】按钮:`, rowData);

            if (this.classList.contains("btn-edit")) {
                alert("修改功能尚未实现");
            } else {
                if (confirm("确定要删除吗？")) {
                    alert("删除功能尚未实现");
                }
            }
        });
    });

    // 处理 select 下拉框变化事件
    document.querySelectorAll("select").forEach(select => {
        select.addEventListener("change", function () {
            console.log("选择了：" + this.value);
        });
    });

    // 处理 车票管理 表单提交
    document.querySelector('form[action="/add-ticket"]').addEventListener("submit", function (event) {
        event.preventDefault();
        const type = this.querySelector('input[name="type"]').value;
        const issue_date = this.querySelector('input[name="issue_date"]').value;
        const status = this.querySelector('select[name="status"]').value;

        console.log("提交车票信息:", { type, issue_date, status });
        alert("车票添加功能尚未实现");
    });

    // 处理 用户管理 表单提交
    document.querySelector('form[action="/add-user"]').addEventListener("submit", function (event) {
        event.preventDefault();
        const type = this.querySelector('input[name="type"]').value;
        const role = this.querySelector('select[name="role"]').value;
        const email = this.querySelector('input[name="email"]').value;
        const password = this.querySelector('input[name="password"]').value;

        console.log("提交用户信息:", { type, role, email, password });
        alert("用户添加功能尚未实现");
    });

    // 处理 列车管理 表单提交
    document.querySelector('form[action="/add-train"]').addEventListener("submit", function (event) {
        event.preventDefault();
        const train_number = this.querySelector('input[name="train_number"]').value;
        const departure_station = this.querySelector('select[name="departure_station"]').value;
        const arrival_station = this.querySelector('select[name="arrival_station"]').value;
        const departure_time = this.querySelector('input[name="departure_time"]').value;
        const arrival_time = this.querySelector('input[name="arrival_time"]').value;

        console.log("提交列车信息:", { train_number, departure_station, arrival_station, departure_time, arrival_time });
        alert("列车添加功能尚未实现");
    });

    // 处理 站点管理 表单提交
    document.querySelector('form[action="/add-station"]').addEventListener("submit", function (event) {
        event.preventDefault();
        const name = this.querySelector('input[name="name"]').value;
        const address = this.querySelector('input[name="address"]').value;
        const contact_info = this.querySelector('input[name="contact_info"]').value;

        console.log("提交站点信息:", { name, address, contact_info });
        alert("站点添加功能尚未实现");
    });
});