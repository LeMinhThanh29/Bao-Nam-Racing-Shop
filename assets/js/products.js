async function loadProducts() {
  try {
    // Load products và category_type
    const [resProducts, resCategory] = await Promise.all([
      fetch("./assets/js/products.json"),
      fetch("./assets/js/category_type.json")
    ]);
    const products = await resProducts.json();
    const categoryData = await resCategory.json();

    const container = document.querySelector("#product-list .list");
    container.innerHTML = "";

    // Render dropdown Hiệu xe
    const tabsContainer = document.getElementById("tabs");
    const brandSelect = document.getElementById("brandFilter");
    Object.values(categoryData.categories).flat().forEach(c => {
      const option = document.createElement("option");
      option.value = c;
      option.textContent = c;
      brandSelect.appendChild(option);
    });


    // Render products với card chi tiết
    products.forEach(product => {
      const productHTML = `
        <li class="product">
          <div class="product-inner">
            <!-- Mặt trước -->
            <div class="product-front">
              <div class="image-container">
                ${product.colors.map((c, i) => `
                  <img src="${c.image}" alt="${product.name}" 
                       class="product-img ${i === 0 ? 'active' : ''}" data-index="${i}" loading="lazy">`).join('')}
                <div class="overlay">
                  <div class="overlay-info">
                    <div class="title">${product.name}</div>
                    <div class="price">Giá từ: <b>${product.price}</b></div>
                    <div class="manufacturer">Nhà sản xuất: ${product.manufacturer}</div>
                    <div class="color-picker">
                      <label class="color-label">Màu xe:</label>
                      <div class="color-options">
                        ${product.colors.map((c, i) => `
                          <div class="color-btn ${i === 0 ? 'active' : ''}" style="background:${c.hex}" data-index="${i}"></div>`).join('')}
                      </div>
                    </div>
                    <button class="flip-btn">Xem chi tiết</button>
                  </div>
                </div>
              </div>
            </div>
            <!-- Mặt sau -->
            <div class="product-back">
              <h4>Thông số kỹ thuật</h4>
              <ul>
                ${Object.entries(product.specs).map(([k, v]) => `<li><b>${k}</b>: ${v}</li>`).join('')}
              </ul>
              <button class="flip-back-btn">Quay lại</button>
            </div>
            <!-- Ẩn metadata để List.js filter -->
            <div class="name" style="display:none">${product.name}</div>
            <div class="type" style="display:none">${product.type}</div>
            <div class="category" style="display:none">${product.category}</div>
          </div>
        </li>
      `;
      container.insertAdjacentHTML("beforeend", productHTML);
    });

    // Khởi tạo List.js đúng chuẩn
    const productList = new List('product-list', {
      listClass: 'list',
      valueNames: ['name', 'type', 'category'],
      page: 12,
      pagination: true
    });

    document.querySelector('.pagination').addEventListener('click', function (e) {
      const link = e.target.closest('a');
      if (!link) return;
      e.preventDefault();
    });

    // Tạo tab tự động từ types
    tabsContainer.innerHTML = '<span class="tab active" data-filter="all">Tất cả</span>';
    categoryData.types.forEach(type => {
      const tab = document.createElement("span");
      tab.classList.add("tab");
      tab.dataset.filter = type;
      tab.textContent = type;
      tabsContainer.appendChild(tab);
    });

    // Tab filter: Tất cả / Xe máy điện / Xe đạp điện
    const tabs = document.querySelectorAll("#tabs .tab");

    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        const filterType = tab.dataset.filter.trim().toLowerCase(); // loại bỏ khoảng trắng, lowercase
        const categoryVal = brandSelect.value.trim().toLowerCase(); // dropdown lowercase

        productList.filter(item => {
          const itemType = item.values().type.trim().toLowerCase(); // lowercase
          const itemCategory = item.values().category.trim().toLowerCase(); // lowercase

          if (filterType === "all") {
            return categoryVal === "" ? true : itemCategory === categoryVal;
          }

          // Kết hợp filter Type + Category
          return (
            itemType === filterType &&
            (categoryVal === "" ? true : itemCategory === categoryVal)
          );
        });
      });
    });

    // Dropdown Hiệu xe luôn hiển thị và filter kết hợp tab active
    brandSelect.style.display = "inline-block";
    brandSelect.addEventListener("change", () => {
      const val = brandSelect.value.trim().toLowerCase();
      const activeTab = document
        .querySelector("#tabs .tab.active")
        .dataset.filter.trim()
        .toLowerCase();

      productList.filter(item => {
        const itemType = item.values().type.trim().toLowerCase();
        const itemCategory = item.values().category.trim().toLowerCase();

        if (activeTab === "all") return val === "" ? true : itemCategory === val;

        return itemType === activeTab && (val === "" ? true : itemCategory === val);
      });
    });




    // Đổi màu sản phẩm với slider
    container.addEventListener("click", (e) => {
      if (e.target.classList.contains("color-btn")) {
        const btn = e.target;
        const index = parseInt(btn.dataset.index);
        const card = btn.closest(".product");
        const imgs = card.querySelectorAll(".product-img");
        const allBtns = card.querySelectorAll(".color-btn");

        const currentImg = card.querySelector(".product-img.active");
        const nextImg = imgs[index];
        if (currentImg === nextImg) return;

        currentImg.classList.remove("active");
        currentImg.classList.add("slide-out-left");
        nextImg.classList.add("slide-in-right");

        setTimeout(() => {
          currentImg.classList.remove("slide-out-left");
          nextImg.classList.remove("slide-in-right");
          nextImg.classList.add("active");
        }, 600);

        allBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      }
    });

    // Flip card
    container.addEventListener("click", (e) => {
      if (e.target.classList.contains("flip-btn")) {
        e.target.closest(".product").classList.add("flip");
      }
      if (e.target.classList.contains("flip-back-btn")) {
        e.target.closest(".product").classList.remove("flip");
      }
    });

  } catch (error) {
    console.error("Lỗi load sản phẩm:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadProducts);