const API_URL = "https://raw.githubusercontent.com/P-Royl/Buoi2_db.json_NNPTUDM/main/db.json";

let products = [];
let displayList = [];

fetch(API_URL)
    .then(res => res.json())
    .then(data => {
        products = data.products;
        displayList = [...products];
        render(displayList);
    });

function render(list) {
    const tbody = document.getElementById("product-table");
    tbody.innerHTML = "";

    list.forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td>${p.id}</td>
                <td>${p.name}</td>
                <td>${p.price.toLocaleString()}</td>
            </tr>
        `;
    });
}


function onChanged(keyword) {
    displayList = products.filter(p =>
        p.name.toLowerCase().includes(keyword.toLowerCase())
    );
    render(displayList);
}

function sortNameAsc() {
    displayList.sort((a, b) => a.name.localeCompare(b.name));
    render(displayList);
}

function sortNameDesc() {
    displayList.sort((a, b) => b.name.localeCompare(a.name));
    render(displayList);
}


function sortPriceAsc() {
    displayList.sort((a, b) => a.price - b.price);
    render(displayList);
}

function sortPriceDesc() {
    displayList.sort((a, b) => b.price - a.price);
    render(displayList);
}