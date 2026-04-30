# 🍽️ Smart Restaurant AI — Restoran Değerlendirme Sistemi

> **No Code / Low Code Challenge** — AI Destekli İş Akışı ve Otomasyon Sistemi

Müşteri geri bildirimlerini otomatik olarak toplayan, AI ile analiz eden, israfı önlemeye yönelik içgörüler üreten ve hem kasiyer hem yöneticiye anlık arayüz sunan uçtan uca bir restoran değerlendirme sistemi.

---

## 🎯 Proje Amacı

Restoranlar için geri bildirim toplamak kolay, ancak **değerlendirmek ve aksiyona dönüştürmek** zordur. Bu sistem:

- Müşterileri ankete teşvik eder (lokma tatlısı hediyesiyle 🍬)
- Yanıtları otomatik AI ile analiz eder
- Kritik şikayetleri anında tespit eder
- Yöneticiye günlük özet rapor sunar
- Kasiyerin ödül kodlarını tek ekranda doğrulamasını sağlar

---

## 🏗️ Sistem Mimarisi

```
Müşteri Anketi (Google Forms)
        ↓
Google Sheets (Form_Responses)
        ↓
    n8n Workflows
   ┌────┼────────────────┐
   │    │                │
1_workflow           2_workflow          3_workflow
(Email + Ödül Kodu)  (AI Analiz +       (Kod Doğrulama
                      Kritik Uyarı +     Webhook)
                      Günlük Rapor)
        ↓
Google Apps Script (Web App)
   ┌────┴────────────┐
Kasiyer Paneli   Yönetici Paneli
(Kod Sorgula)    (Raporlar + AI)
```

---

## ⚙️ Kullanılan Araçlar

| Araç | Kullanım |
|------|----------|
| **Google Forms** | Müşteri anketi |
| **Google Sheets** | Veri depolama (Form_Responses, DailySummary, vb.) |
| **n8n** | Otomasyon iş akışları (3 adet workflow) |
| **Google Gemini AI** | Geri bildirim analizi ve duygu tespiti |
| **Google Apps Script** | Web App backend (Kasiyer + Yönetici paneli) |
| **Google Sites** | Panel erişim sayfası |
| **Gmail** | Ödül kodu e-posta gönderimi |

---

## 🔄 Workflow Açıklamaları

### 1️⃣ 1_workflow — E-posta & Ödül Kodu
Form yanıtı geldiğinde otomatik olarak:
- Benzersiz ödül kodu üretir
- Müşteriye lokma kuponunu e-posta ile gönderir
- Google Sheets'teki ilgili satırı günceller

### 2️⃣ 2_workflow — AI Analiz Motoru
Üç paralel bölümden oluşur:
- **AI Analysis Section:** Google Gemini ile her yanıtı analiz eder, duygu ve puan çıkarır
- **Critical Alerts Section:** Negatif geri bildirimleri tespit eder, aciliyet seviyesi belirler
- **Daily Summary Section:** Her gün 22:00'de Gemini ile günlük yönetici özeti üretir

### 3️⃣ 3_workflow — Kod Doğrulama Webhook
Kasiyer panelinden gelen kod sorgulama ve işaretleme isteklerini karşılar:
- Kodu Google Sheets'te arar
- Duruma göre (aktif/kullanıldı) yanıt döner
- "Kullanıldı" olarak işaretler

---

## 📁 Dosya Yapısı

```
smart-restaurant-ai/
├── README.md
├── src/
│   ├── kasiyer_v2.html       # Kasiyer Paneli (Apps Script HTML)
│   ├── yonetici_v2.html      # Yönetici Paneli (Apps Script HTML)
│   └── panel_apps_script.gs  # Google Apps Script backend
├── workflows/
│   ├── 1_workflow.json        # n8n: E-posta & Ödül Kodu
│   ├── 2_workflow.json        # n8n: AI Analiz + Raporlama
│   └── 3_workflow.json        # n8n: Kod Doğrulama Webhook
└── docs/
    └── Smart_Restaurant_AI.pptx  # Proje sunumu
```

---

## 🚀 Kurulum Rehberi

### 1. Google Sheets Hazırlığı
Google Sheets'te şu sekmeleri oluşturun:
- `Form_Responses` — anket yanıtları (Google Forms'a bağlı)
- `DailySummary` — günlük AI özetleri
- `AnalyzedFeedback` — AI analiz sonuçları
- `CriticalFeedback` — kritik uyarılar
- `AIReviewQueue` — manuel inceleme kuyruğu

### 2. Apps Script Kurulumu
1. [script.google.com](https://script.google.com) → Yeni Proje
2. `panel_apps_script.gs` içeriğini yapıştırın
3. `kasiyer_v2.html` ve `yonetici_v2.html` dosyalarını HTML dosyası olarak ekleyin
4. `SHEET_ID` sabitini kendi Google Sheets ID'niz ile güncelleyin
5. **Yayınla → Web Uygulaması olarak dağıt** → Erişim: Herkese açık

### 3. n8n Workflow Kurulumu
1. n8n'de "Import Workflow" ile JSON dosyalarını içe aktarın
2. Google Sheets, Gmail ve Gemini credential'larını bağlayın
3. Webhook URL'lerini Apps Script'teki ilgili alanlarla eşleştirin
4. Workflow'ları **Publish** edin

### 4. Google Forms
- Form yanıtlarının `Form_Responses` sekmesine gittiğinden emin olun
- Form URL'ini QR kod oluşturucu ile masalara yerleştirin

---

## 📊 Sistem Özellikleri

- ✅ **Uçtan uca otomasyon** — formdan rapora sıfır elle müdahale
- ✅ **AI entegrasyonu** — Gemini ile duygu analizi ve özet üretimi
- ✅ **Gerçek zamanlı kod doğrulama** — kasiyere anlık durum
- ✅ **Kritik uyarı sistemi** — olumsuz deneyimler anında tespit
- ✅ **Günlük yönetici raporu** — otomatik saat 22:00 özeti
- ✅ **İsraf analizi** — porsiyon geri bildirimi ile israf tespiti

---

## 👥 Ekip

**YZTA Bootcamp — No Code / Low Code Challenge**

| | İsim |
|--|------|
| 👩‍💻 | Zeynep İbiş |
| 👩‍💻 | Merve Papakçı |
| 👩‍💻 | İrem Tosun |

---

## 📄 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.
