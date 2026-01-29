const API_URL = "https://raw.githubusercontent.com/USERNAME/REPO_NAME/main/db.json";

let students = [];

fetch(API_URL)
    .then(res => {
        if (!res.ok) {
            throw new Error("Không load được db.json");
        }
        return res.json();
    })
    .then(data => {
        students = data.students;
        render(students);
    })
    .catch(err => {
        console.error("LỖI:", err);
    });

function render(list) {
    const tbody = document.getElementById("student-table");
    tbody.innerHTML = "";

    list.forEach(s => {
        tbody.innerHTML += `
            <tr>
                <td>${s.id}</td>
                <td>${s.name}</td>
                <td>${s.class}</td>
                <td>${s.email}</td>
            </tr>
        `;
    });
}

document.getElementById("search").addEventListener("input", e => {
    const keyword = e.target.value.toLowerCase();
    const filtered = students.filter(s =>
        s.name.toLowerCase().includes(keyword)
    );
    render(filtered);
});
