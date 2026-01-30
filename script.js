const API = "http://localhost:3000";
let selectedProductId = null;

/* ===== UTIL ===== */
function maxId(list) {
  return Math.max(0, ...list.map(i => Number(i.id)));
}

/* ===== LOAD PRODUCTS (HIỂN THỊ CẢ XOÁ MỀM) ===== */
async function loadProducts() {
  const res = await fetch(`${API}/products`);
  const products = await res.json();

  const tbody = document.getElementById("product-table");
  tbody.innerHTML = "";

  products.forEach(p => {
    tbody.innerHTML += `
      <tr class="${p.isDeleted ? "deleted" : ""}"
          onclick="selectProduct('${p.id}')">
        <td>${p.id}</td>
        <td><img src="${p.image}" width="60"></td>
        <td>${p.name}</td>
        <td>${p.price.toLocaleString()} đ</td>
        <td>
          ${p.isDeleted ? "" :
            `<button class="btn btn-danger btn-sm"
              onclick="event.stopPropagation(); deleteProduct('${p.id}')">
              X
            </button>`
          }
        </td>
      </tr>
    `;
  });
}
loadProducts();

/* ===== ADD PRODUCT (ID = max + 1, CHUỖI) ===== */
async function addProduct(name, price, image) {
  const res = await fetch(`${API}/products`);
  const products = await res.json();

  const newId = (maxId(products) + 1).toString();

  await fetch(`${API}/products`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      id: newId,
      name,
      price,
      image,
      isDeleted: false
    })
  });

  loadProducts();
}

/* ===== DELETE PRODUCT (SOFT) ===== */
async function deleteProduct(id) {
  await fetch(`${API}/products/${id}`, {
    method: "PATCH",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ isDeleted: true })
  });
  loadProducts();
}

/* ===== SELECT PRODUCT ===== */
function selectProduct(id) {
  selectedProductId = id;
  document.getElementById("comment-title").innerText =
    `Comments (Product ID = ${id})`;
  loadComments();
}

/* ===== LOAD COMMENTS (HIỂN THỊ XOÁ MỀM) ===== */
async function loadComments() {
  const res = await fetch(`${API}/comments?productId=${selectedProductId}`);
  const comments = await res.json();

  const ul = document.getElementById("comment-list");
  ul.innerHTML = "";

  comments.forEach(c => {
    ul.innerHTML += `
      <li class="list-group-item d-flex justify-content-between
          ${c.isDeleted ? "deleted" : ""}">
        ${c.content}
        ${c.isDeleted ? "" :
          `<div>
            <button class="btn btn-sm btn-warning me-1"
              onclick="editComment('${c.id}')">Sửa</button>
            <button class="btn btn-sm btn-danger"
              onclick="deleteComment('${c.id}')">X</button>
          </div>`
        }
      </li>
    `;
  });
}

/* ===== ADD COMMENT (ID TỰ TĂNG, CHUỖI) ===== */
async function addComment() {
  const content = document.getElementById("cmt").value;
  if (!content || !selectedProductId) return;

  const res = await fetch(`${API}/comments`);
  const comments = await res.json();
  const newId = (maxId(comments) + 1).toString();

  await fetch(`${API}/comments`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      id: newId,
      productId: selectedProductId,
      content,
      isDeleted: false
    })
  });

  document.getElementById("cmt").value = "";
  loadComments();
}

/* ===== UPDATE COMMENT ===== */
async function editComment(id) {
  const newContent = prompt("Sửa comment:");
  if (!newContent) return;

  await fetch(`${API}/comments/${id}`, {
    method: "PATCH",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ content: newContent })
  });

  loadComments();
}

/* ===== DELETE COMMENT (SOFT) ===== */
async function deleteComment(id) {
  await fetch(`${API}/comments/${id}`, {
    method: "PATCH",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ isDeleted: true })
  });

  loadComments();
}