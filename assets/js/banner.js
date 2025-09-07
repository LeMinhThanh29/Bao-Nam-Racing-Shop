document.addEventListener("DOMContentLoaded", function () {
    const heroSliderList = document.getElementById("heroSliderList");

    fetch("./assets/js/banner.json")
        .then((res) => {

            if (!res.ok) {
                throw new Error("Không thể tải banner.json: " + res.status);
            }
            return res.json();
        })
        .then((slides) => {


            if (!Array.isArray(slides) || slides.length === 0) {
                throw new Error("Dữ liệu slider không hợp lệ hoặc rỗng!");
            }

            slides.forEach(item => {

                const li = document.createElement("li");
                li.className = "splide__slide";
                li.innerHTML = `<img src="${item.image}" alt="${item.alt}" loading="lazy">`;
                heroSliderList.appendChild(li);
            });

            const splide = new Splide('#heroSlider1', {
                type: 'loop',
                perPage: 1,     // <--- chỉ hiển thị 1 slide
                perMove: 1,     // mỗi lần chạy 1 slide
                autoplay: true,
                interval: 4000,
                arrows: true,
                pagination: true,
            });
            splide.mount();
        })
        .catch(err => console.error("Lỗi slider:", err));
});
