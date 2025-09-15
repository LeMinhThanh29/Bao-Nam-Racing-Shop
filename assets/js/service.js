document.addEventListener("DOMContentLoaded", function () {
    const serviceList = document.getElementById("serviceList");

    fetch("./assets/js/service_drive.json")
        .then(response => response.json())
        .then(services => {
            services.forEach(item => {
                const li = document.createElement("li");
                li.className = "splide__slide";
                li.innerHTML = `
          <img src="${item.image}" alt="${item.alt}" class="w-full h-60 object-cover rounded-xl" />
        `;
                serviceList.appendChild(li);
            });

            // Khởi tạo Splide slider
            new Splide("#service-carousel", {
                type: 'loop',
                perPage: 1,     // <--- chỉ hiển thị 1 slide
                perMove: 1,     // mỗi lần chạy 1 slide
                autoplay: true,
                interval: 4000,
                arrows: true,
                pagination: true,
            }).mount();
        })
        .catch(err => console.error("Không load được service_drive.json:", err));
});
