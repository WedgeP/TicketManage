// File: public/javascripts/admin.js

document.addEventListener('DOMContentLoaded', function () {
    // Tab switching functionality
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');

    // Hide all panels and display the first one by default
    contents.forEach(content => content.style.display = 'none');
    if (tabs.length > 0 && contents.length > 0) {
        tabs[0].classList.add('active');
        contents[0].style.display = 'block';
    }

    // Add click event to each tab to show corresponding panel
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.style.display = 'none');
            tab.classList.add('active');
            contents[index].style.display = 'block';
        });
    });

    // Automatic station form submission and table update
    const stationTabContent = document.getElementById('stationTabContent');
    if (stationTabContent) {
        const stationForm = stationTabContent.querySelector("form[action='/add-station']");
        if (stationForm) {
            stationForm.addEventListener('submit', function (event) {
                event.preventDefault();

                // Extract form data into a JSON object
                const formData = new FormData(stationForm);
                const data = Object.fromEntries(formData.entries());

                // Send POST request to the /add-station endpoint
                fetch('/add-station', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                    .then(response => response.json())
                    .then(result => {
                        if (result.stations) {
                            const tbody = stationTabContent.querySelector('table tbody');
                            tbody.innerHTML = ''; // Clear previous rows

                            result.stations.forEach(station => {
                                const row = document.createElement('tr');
                                row.innerHTML = `
                <td>${station.id}</td>
                <td>${station.name}</td>
                <td>${station.address}</td>
                <td>${station.contact_info}</td>
                <td>
                  <button>操作1</button>
                  <button>操作2</button>
                </td>
              `;
                                tbody.appendChild(row);
                            });
                        } else if (result.errorMessage) {
                            alert(result.errorMessage);
                        }
                    })
                    .catch(error => {
                        console.error('Error submitting station form:', error);
                    });
            });
        }
    }
});