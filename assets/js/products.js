async function loadProducts() {
  try {
    const response = await fetch("./assets/js/products.json");
    const products = await response.json();

    const container = document.querySelector("#product-list"); // nơi chứa danh sách xe
    container.innerHTML = ""; // xóa cũ nếu có

    products.forEach(product => {
      const productHTML = `
        <div class="product">
          <div class="p-img">
            <div class="product-card">
              <div class="image-container">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <div class="overlay">
                  <div class="title">${product.name}</div>
                  <div class="info">
                    <div class="price">Giá từ: <b>${product.price}</b></div>
                    <div class="manufacturer">Nhà sản xuất: <span class="brand">${product.manufacturer}</span></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="p-spec">
              <ul>
                ${Object.entries(product.specs).map(([key, value]) => `<li><b>${key}</b>: ${value}</li>`).join("")}
              </ul>
              <span class="hint">Di chuột/chạm để đóng</span>
            </div>
          </div>
        </div>
      `;
      container.insertAdjacentHTML("beforeend", productHTML);
    });
  } catch (error) {
    console.error("Lỗi load sản phẩm:", error);
  }
}

// gọi hàm khi tải trang
document.addEventListener("DOMContentLoaded", loadProducts);
