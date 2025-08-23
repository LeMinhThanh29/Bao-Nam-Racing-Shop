/**
 * Google Apps Script - Lưu lead vào Google Sheet
 * B1: Tạo Google Sheet và lấy SPREADSHEET_ID (giữa /d/ và /edit trên URL)
 * B2: Vào Extensions → Apps Script, dán code này, sửa SPREADSHEET_ID
 * B3: Deploy → New deployment → Web app (Execute as: Me, Access: Anyone)
 */
const SPREADSHEET_ID = "PUT_YOUR_SHEET_ID_HERE";

function doPost(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName("Leads") || ss.insertSheet("Leads");
    const raw = e.postData && e.postData.contents ? e.postData.contents : "{}";
    const data = JSON.parse(raw);

    const headers = ["timestamp","name","phone","email","model","message","source","userAgent","page"];
    if (sheet.getLastRow() === 0) sheet.appendRow(headers);

    const row = [
      new Date(),
      data.name || "",
      data.phone || "",
      data.email || "",
      data.model || "",
      data.message || "",
      data.source || "",
      data.userAgent || "",
      data.page || ""
    ];
    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(err)})).setMimeType(ContentService.MimeType.JSON);
  }
}
