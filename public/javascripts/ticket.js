document.addEventListener("DOMContentLoaded", function() {
    const ticketTab = document.getElementById("ticketTab");
    const buyTicketTab = document.getElementById("buyTicketTab");
    const ticketForm = document.getElementById("ticketForm");
    const buyTicketForm = document.getElementById("buyTicketForm");

    // 切换标签页
    ticketTab.addEventListener("click", function() {
        ticketTab.classList.add("active");
        buyTicketTab.classList.remove("active");
        ticketForm.style.display = "block";
        buyTicketForm.style.display = "none";
    });

    buyTicketTab.addEventListener("click", function() {
        buyTicketTab.classList.add("active");
        ticketTab.classList.remove("active");
        buyTicketForm.style.display = "block";
        ticketForm.style.display = "none";
    });

    // 加载车次选项
    const departureSelect = document.getElementById('departure');
    const destinationSelect = document.getElementById('destination');
    const trainIdSelect = document.getElementById('trainId');

    function loadTrainOptions() {
        const departure = departureSelect.value;
        const destination = destinationSelect.value;

        if (!departure || !destination) return;

        fetch(`/get-trains?departure=${departure}&destination=${destination}`)
            .then(response => response.json())
            .then(data => {
                trainIdSelect.innerHTML = '<option value="">Select a train</option>';
                if (data.trains && data.trains.length > 0) {
                    data.trains.forEach(train => {
                        const option = document.createElement('option');
                        option.value = train.id;
                        option.textContent = `${train.trainName} - ${train.time}`;
                        trainIdSelect.appendChild(option);
                    });
                } else {
                    const option = document.createElement('option');
                    option.value = "";
                    option.textContent = "No trains available";
                    trainIdSelect.appendChild(option);
                }
            })
            .catch(error => {
                console.error("Error loading train options:", error);
            });
    }

    departureSelect.addEventListener("change", loadTrainOptions);
    destinationSelect.addEventListener("change", loadTrainOptions);

    // 提交购买车票请求
    const buyTicketFormElement = document.querySelector('form.buy-ticket-form');
    buyTicketFormElement.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(buyTicketFormElement);
        const departure = formData.get('departure');
        const destination = formData.get('destination');
        const trainId = formData.get('trainId');

        if (!trainId) {
            alert('Please select a train.');
            return;
        }

        fetch('/buy-ticket', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                departure,
                destination,
                trainId
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Ticket purchased successfully!');
                    // 可能的话，刷新用户票务列表或清空表单
                } else {
                    alert('Failed to purchase ticket. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while purchasing the ticket.');
            });
    });
});
//显示用户车票
// ticket.js

document.addEventListener('DOMContentLoaded', function() {
    const ticketForm = document.querySelector('form.ticket-form');

    if (ticketForm) {
        ticketForm.addEventListener('submit', function(event) {
            event.preventDefault(); // 阻止表单的默认提交行为

            const ticketCount = document.getElementById('ticketCount').value;
            const month = document.getElementById('month').value;

            // 简单的表单验证
            if (!ticketCount || !month) {
                alert('Please fill in all fields!');
                return;
            }

            // 创建一个包含表单数据的对象
            const formData = {
                ticketCount: ticketCount,
                month: month
            };

            // 发送 AJAX 请求到后端
            fetch('/tickets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
                .then(response => response.json()) // 解析返回的 JSON
                .then(data => {
                    if (data.errorMessage) {
                        alert(data.errorMessage); // 显示错误消息
                    } else {
                        // 清空现有的票务列表
                        const ticketsTable = document.querySelector('table tbody');
                        ticketsTable.innerHTML = '';

                        // 渲染新的票务数据
                        data.tickets.forEach(ticket => {
                            const row = document.createElement('tr');
                            row.innerHTML = `
                            <td>${ticket.id}</td>
                            <td>${ticket.type}</td>
                            <td>${ticket.created_at}</td>
                            <td>${ticket.status}</td>
                        `;
                            ticketsTable.appendChild(row);
                        });
                    }
                })
                .catch(error => {
                    console.error('Error fetching tickets:', error);
                    alert('There was an error fetching your tickets');
                });
        });
    }
});