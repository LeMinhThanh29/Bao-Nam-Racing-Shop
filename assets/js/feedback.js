
document.addEventListener("DOMContentLoaded", function () {
    const reviewList = document.getElementById("reviewList");

    fetch("./assets/js/feedback.json")
        .then(response => response.json())
        .then(reviews => {
            reviews.forEach(item => {
                const stars = "⭐".repeat(item.rating);

                const li = document.createElement("li");
                li.className = "splide__slide";
                li.innerHTML = `
          <div class="review_card_container">
            <div class="review_card_row">
              <div class="review_card_rating">
                <p>${stars}</p>
              </div>
              <div class="review_card_user_info">
                <div class="review_card_user_avatar">
                  <img src="${item.avatar}" alt="${item.name}" />
                </div>
                <div class="review_card_user_content">
                  <p>${item.name}</p>
                  <span>${item.date}</span>
                </div>
              </div>
              <div class="review_card_user_review">
                <p>${item.review}</p>
              </div>
            </div>
          </div>
        `;
                reviewList.appendChild(li);
            });

            // Khởi tạo Splide sau khi render xong
            var splide = new Splide('#review-carousel', {
                type: 'loop',
                perPage: 3,
                focus: 'center',
                gap: '1rem',
                autoplay: true,
                interval: 3000,
                pauseOnHover: true,
                breakpoints: {
                    1024: { perPage: 2 },
                    640: { perPage: 1 },
                }
            });
            splide.mount();
        })
        .catch(err => console.error("Không load được feedback.json:", err));
});
