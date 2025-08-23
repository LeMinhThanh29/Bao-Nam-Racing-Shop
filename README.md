# Bảo Nam Racing – Landing Page (Tách CSS/JS, dùng ảnh thật)

Cấu trúc:
```
index.html
assets/
  css/style.css
  js/app.js
  img/            (để trống, nếu bạn muốn thay ảnh cục bộ)
apps_script.gs
```

## Ảnh thật (remote)
- Xe máy điện (hero + gallery):  
  https://www.yadea.com.vn/wp-content/uploads/2025/05/Velax-Anh-nho-ben-tren-480x390.png
- Xe đạp điện (gallery):  
  https://www.yadea.com.vn/wp-content/uploads/2025/03/Anrh-nho-ben-tren-480x361-i8-gau-xanh-sua-480x361.png

Nếu bạn muốn **offline hoàn toàn**, hãy tải 2 ảnh trên về thư mục `assets/img/` và sửa `index.html` thành đường dẫn cục bộ tương ứng.

## Kết nối Google Sheet
1. Mở `apps_script.gs`, dán vào Google Apps Script của Sheet, sửa `SPREADSHEET_ID`.
2. Deploy Web app, copy URL và dán vào `SHEETS_WEBAPP_URL` trong `assets/js/app.js`.
3. Publish lên hosting là nhận lead tự động.

## Zalo / Messenger / Gọi điện
- Zalo: `https://zalo.me/0798466669`
- Messenger: sửa `MESSENGER_URL` trong `assets/js/app.js`
- Gọi: `tel:0798466669`

Chúc bạn bán được thật nhiều xe! 🚀
