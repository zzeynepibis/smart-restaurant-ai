// ============================================================
// RESTORAN DEĞERLENDİRME SİSTEMİ — APPS SCRIPT
// Google Apps Script olarak yapıştır ve Web App olarak yayınla
// ============================================================

// ⚠️ BURAYA KENDİ SHEET ID'Nİ YAZ
// Sheet URL'sindeki /d/XXXXX/edit kısmındaki XXXXX değeri
const SHEET_ID = "BURAYA_SHEET_ID_YAZ";

const SHEET_FORM_RESPONSES = "Form_Responses";
const SHEET_DAILY_SUMMARY  = "DailySummary";

// ============================================================
// ANA GİRİŞ NOKTALARI
// ============================================================

function doGet(e) {
  const page = e.parameter.page || "kasiyer";
  const template = HtmlService.createTemplateFromFile(page === "yonetici" ? "yonetici" : "kasiyer");
  return template.evaluate()
    .setTitle(page === "yonetici" ? "Yönetici Paneli" : "Kasiyer Paneli")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const action = data.action;

  if (action === "getCode")       return ContentService.createTextOutput(JSON.stringify(getCodeInfo(data.code))).setMimeType(ContentService.MimeType.JSON);
  if (action === "useCode")       return ContentService.createTextOutput(JSON.stringify(useCode(data.code))).setMimeType(ContentService.MimeType.JSON);
  if (action === "getDailySummary") return ContentService.createTextOutput(JSON.stringify(getDailySummary())).setMimeType(ContentService.MimeType.JSON);
  if (action === "getAnalyzed")   return ContentService.createTextOutput(JSON.stringify(getAnalyzedFeedback())).setMimeType(ContentService.MimeType.JSON);
  if (action === "getCritical")   return ContentService.createTextOutput(JSON.stringify(getCriticalFeedback())).setMimeType(ContentService.MimeType.JSON);
  if (action === "saveSummary")   return ContentService.createTextOutput(JSON.stringify(saveDailySummary(data))).setMimeType(ContentService.MimeType.JSON);
  if (action === "saveAnalyzed")  return ContentService.createTextOutput(JSON.stringify(saveAnalyzedFeedback(data))).setMimeType(ContentService.MimeType.JSON);
  if (action === "saveCritical")  return ContentService.createTextOutput(JSON.stringify(saveCriticalFeedback(data))).setMimeType(ContentService.MimeType.JSON);

  return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Bilinmeyen işlem" })).setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
// KASİYER FONKSİYONLARI
// ============================================================

function getCodeInfo(code) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_FORM_RESPONSES);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const codeCol = headers.indexOf("Ödül Kodu");
  const statusCol = headers.indexOf("Kod Durumu");
  const nameCol = headers.indexOf("Adınız ve Soyadınız");
  const emailCol = headers.indexOf("E-posta Adresiniz (Hediye lokma kuponunuz bu adrese gelecektir.)");

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][codeCol]).trim() === String(code).trim()) {
      return {
        success: true,
        found: true,
        row: i + 1,
        name: data[i][nameCol] || "-",
        email: data[i][emailCol] || "-",
        status: data[i][statusCol] || "Aktif"
      };
    }
  }
  return { success: true, found: false };
}

function useCode(code) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_FORM_RESPONSES);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const codeCol = headers.indexOf("Ödül Kodu");
  const statusCol = headers.indexOf("Kod Durumu");

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][codeCol]).trim() === String(code).trim()) {
      sheet.getRange(i + 1, statusCol + 1).setValue("Kullanıldı");
      return { success: true };
    }
  }
  return { success: false, error: "Kod bulunamadı" };
}

// ============================================================
// YÖNETİCİ FONKSİYONLARI — VERİ OKUMA
// ============================================================

function getDailySummary() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_DAILY_SUMMARY);
  if (!sheet) return { success: true, rows: [] };
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return { success: true, rows: [] };
  const headers = data[0];
  const rows = data.slice(1).map(r => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = r[i]);
    return obj;
  });
  return { success: true, rows: rows.reverse() };
}

function getAnalyzedFeedback() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName("AnalyzedFeedback");
  if (!sheet) return { success: true, rows: [] };
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return { success: true, rows: [] };
  const headers = data[0];
  const rows = data.slice(1).map(r => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = r[i]);
    return obj;
  });
  return { success: true, rows: rows.reverse() };
}

function getCriticalFeedback() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName("CriticalFeedback");
  if (!sheet) return { success: true, rows: [] };
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return { success: true, rows: [] };
  const headers = data[0];
  const rows = data.slice(1).map(r => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = r[i]);
    return obj;
  });
  return { success: true, rows: rows.reverse() };
}

// ============================================================
// YÖNETİCİ FONKSİYONLARI — VERİ KAYDETME (Workflow'dan çağrılır)
// ============================================================

function saveDailySummary(data) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_DAILY_SUMMARY);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_DAILY_SUMMARY);
    sheet.appendRow(["Tarih", "Toplam Yanıt", "Ortalama Puan", "Özet", "Kritik Sayısı"]);
  }
  sheet.appendRow([data.date, data.totalResponses, data.avgScore, data.summary, data.criticalCount]);
  return { success: true };
}

function saveAnalyzedFeedback(data) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName("AnalyzedFeedback");
  if (!sheet) {
    sheet = ss.insertSheet("AnalyzedFeedback");
    sheet.appendRow(["Tarih", "Müşteri Adı", "Email", "Puan", "Duygu", "Analiz Özeti"]);
  }
  sheet.appendRow([data.date, data.name, data.email, data.score, data.sentiment, data.summary]);
  return { success: true };
}

function saveCriticalFeedback(data) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName("CriticalFeedback");
  if (!sheet) {
    sheet = ss.insertSheet("CriticalFeedback");
    sheet.appendRow(["Tarih", "Müşteri Adı", "Email", "Puan", "Sorun", "Aciliyet"]);
  }
  sheet.appendRow([data.date, data.name, data.email, data.score, data.issue, data.urgency]);
  return { success: true };
}
