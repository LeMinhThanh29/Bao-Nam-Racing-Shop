// === CONFIG (sửa theo dự án của bạn) ===
const SHEETS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycby1iICPfT6v4A91K9s_ZTU-V1CqiLMyZV3A8d5vBZCLyhcm7r8poKkG_f9TJ3Q_0qlDJQ/exec"; // Dán URL Web App sau khi deploy
const MESSENGER_URL = "https://www.facebook.com/profile.php?id=61578657786148"; // Thay bằng trang của bạn nếu khác

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id && id.length > 1) { e.preventDefault(); document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// Countdown timer
(function () {
  const el = document.getElementById('countdown'); if (!el) return;
  const deadlineStr = el.getAttribute('data-deadline');
  const deadline = deadlineStr ? new Date(deadlineStr) : null;
  const fmt = n => String(n).padStart(2, '0');
  const render = rem => {
    el.innerHTML = '';
    [['Ngày', rem.days], ['Giờ', rem.hours], ['Phút', rem.minutes], ['Giây', rem.seconds]].forEach(([label, val]) => {
      const box = document.createElement('div'); box.className = 'timebox';
      box.innerHTML = `<b>${fmt(val)}</b><div class="muted">${label}</div>`; el.appendChild(box);
    });
  };
  const tick = () => {
    const now = new Date();
    const ms = (deadline ? deadline : new Date(now.getTime() + 7 * 24 * 3600 * 1000)) - now; // fallback 7 ngày
    const s = Math.max(0, Math.floor(ms / 1000));
    render({ days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60 });
  };
  tick(); setInterval(tick, 1000);
})();

// Lead form + Google Sheets
(function () {
  const form = document.getElementById('leadForm'); if (!form) return;
  const success = document.getElementById('formSuccess');
  document.getElementById('year').textContent = new Date().getFullYear();

  const messengerBtn = document.getElementById('messengerBtn');
  if (messengerBtn && MESSENGER_URL) { messengerBtn.href = MESSENGER_URL; }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const payload = {
      name: (fd.get('name') || '').toString().trim(),
      phone: (fd.get('phone') || '').toString().trim(),
      email: (fd.get('email') || '').toString().trim(),
      model: fd.get('model'),
      message: (fd.get('message') || '').toString().trim(),
      page: location.href, source: 'landing-bnr-separated', userAgent: navigator.userAgent
    };

    // Validate
    const phoneOK = (/(\+?84|0)(\d){9,10}$/).test(payload.phone.replace(/\s|\./g, '')) || (/^0798\s?466\s?669$/).test(payload.phone);
    if (!payload.name) {
      showError('Thông tin không hợp lệ', 'Vui lòng nhập họ tên');
      return;
    }
    if (!phoneOK) {
      showError('Thông tin không hợp lệ', 'Vui lòng nhập số điện thoại');
      return;
    }
    if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      showError('Thông tin không hợp lệ', 'Email chưa hợp lệ'); return;
    }
    if (!document.getElementById('consent').checked) {
      showError('Thông tin không hợp lệ', 'Vui lòng đồng ý cho phép liên hệ'); return;
    }

    // Backup to localStorage
    try {
      const arr = JSON.parse(localStorage.getItem('bnr_leads') || '[]'); arr.push({ ...payload, ts: new Date().toISOString() });
      localStorage.setItem('bnr_leads', JSON.stringify(arr));
    } catch (err) { }

    // Send to Google Sheets (Apps Script)
    // let ok=false;
    // if(SHEETS_WEBAPP_URL.includes('YOUR_DEPLOYMENT_ID')){
    //   console.warn('Chưa cấu hình SHEETS_WEBAPP_URL');
    // }else{
    //   try{
    //     const res = await fetch(SHEETS_WEBAPP_URL, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload), mode:'cors'});
    //     ok = res.ok;
    //   }catch(err){
    //     try{
    //       await fetch(SHEETS_WEBAPP_URL, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload), mode:'no-cors'});
    //       ok = true;
    //     }catch(e2){}
    //   }
    // }

    // Send to Google Sheets (Apps Script)
    Swal.fire({
      title: 'Đang gửi...',
      text: 'Vui lòng chờ trong giây lát',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });
    let ok = false;
    if (SHEETS_WEBAPP_URL.includes('YOUR_DEPLOYMENT_ID')) {
      console.warn('Chưa cấu hình SHEETS_WEBAPP_URL');
      showError("Vui lòng thử lại sau hoặc liên hệ qua Messenger.");
      Swal.close(); // tắt loading
    } else {
      try {
        await fetch(SHEETS_WEBAPP_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          mode: 'no-cors'  // 🔑 fix CORS
        });
        ok = true; // coi như thành công vì request đã gửi đi
        showSuccess("Cảm ơn bạn!", "Yêu cầu của bạn đã được gửi. Chúng tôi sẽ liên hệ lại sớm nhất có thể.");
      } catch (err) {
        showError("Gửi yêu cầu thất bại", "Vui lòng thử lại sau hoặc liên hệ qua Messenger.");
      }
    }


    form.reset();
    success.style.display = 'block';
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
})();


// Toggle product specs overlay on tap (mobile)
document.querySelectorAll('.product .p-img').forEach(el => {
  el.addEventListener('click', (e) => {
    const product = el.closest('.product');
    product.classList.toggle('show-spec');
    e.stopPropagation();
  });
});
document.addEventListener('click', () => {
  document.querySelectorAll('.product.show-spec').forEach(p => p.classList.remove('show-spec'));
});

// === v7: Product specs tooltip at cursor ===

(function () {
  const popup = document.createElement('div');
  popup.id = 'specPopup';
  popup.className = 'spec-popup';
  popup.style.display = 'none';
  document.body.appendChild(popup);

  function show(html) {
    popup.innerHTML = html;
    popup.style.display = 'block';
  }
  function hide() {
    popup.style.display = 'none';
  }
  function move(e) {
    if (popup.style.display === 'none') return;
    const pad = 14;
    popup.style.left = '0px';
    popup.style.top = '0px';
    const rect = popup.getBoundingClientRect();
    let x = e.clientX + pad, y = e.clientY + pad;
    if (x + rect.width > window.innerWidth - pad) x = e.clientX - rect.width - pad;
    if (y + rect.height > window.innerHeight - pad) y = e.clientY - rect.height - pad;
    popup.style.left = x + 'px';
    popup.style.top = y + 'px';
  }

  const container = document.querySelector('#product-list');

  // Hover / mousemove
  container.addEventListener('mouseenter', (e) => {
    const product = e.target.closest('.product');
    if (!product) return;
    const spec = product.querySelector('.p-spec');
    if (spec) show(spec.innerHTML);
  }, true);

  container.addEventListener('mousemove', (e) => {
    if (e.target.closest('.product')) move(e);
  });

  container.addEventListener('mouseleave', (e) => {
    if (e.target.closest('.product')) hide();
  }, true);

  // Touch (mobile)
  container.addEventListener('touchstart', (e) => {
    const product = e.target.closest('.product');
    if (product) {
      const spec = product.querySelector('.p-spec');
      if (spec) {
        const t = e.touches[0];
        show(spec.innerHTML);
        move({ clientX: t.clientX, clientY: t.clientY });
      }
    } else {
      hide();
    }
  }, { passive: true });
})();

// === v12: hero background slider ===
(function () {
  const root = document.querySelector('.hero-slider'); if (!root) return;
  const slides = Array.from(root.querySelectorAll('.slide')); if (slides.length < 2) return;
  let i = 0; let timer;
  const next = () => {
    slides[i].classList.remove('active');
    i = (i + 1) % slides.length;
    slides[i].classList.add('active');
  };
  const start = () => { stop(); timer = setInterval(next, 4000); };
  const stop = () => { if (timer) clearInterval(timer); };
  start();
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
})();



var splide = new Splide('.splide', {
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


AOS.init({
  once: true,   // chỉ chạy 1 lần duy nhất
  mirror: false // không animate lại khi scroll ngược
});


function showSuccess(title, text) {
  Swal.fire({
    icon: 'success',
    title: title,
    text: text,
    confirmButtonText: 'OK',
    confirmButtonColor: '#f3be57',
  });
}

function showError(title, text) {
  Swal.fire({
    icon: 'error',
    title: title,
    text: text,
    confirmButtonText: 'OK',
    confirmButtonColor: '#f3be57',
  });
}