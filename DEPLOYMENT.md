# Kay Takoyaki - Panduan Deployment

## Informasi Hosting
- **Nama**: Kay Takoyaki - Takoyaki, Roti Cane & Udon Terbaik
- **URL Vercel**: https://arizalalmuttaqin.vercel.app/
- **Platform**: Vercel (Serverless)

## Struktur Proyek

```
├── index.html           # Frontend utama
├── style.css            # Stylesheet
├── script.js            # Frontend logic
├── server.js            # Backend lokal (untuk development)
├── package.json         # Dependencies
├── vercel.json          # Konfigurasi Vercel
└── api/
    ├── checkout.js      # Endpoint POST /api/checkout
    └── payments.js      # Endpoint GET /api/payments
```

## Deployment ke Vercel

### Prerequisites
- Node.js 16+
- npm atau yarn
- Akun Vercel

### Steps
1. Push kode ke GitHub
2. Hubungkan repository ke Vercel
3. Vercel akan otomatis deploy

Atau gunakan Vercel CLI:
```bash
npm install -g vercel
vercel
```

## Development Lokal

```bash
npm install
npm start
```

Akses di: `http://localhost:3000`

## Catatan Penting

### ⚠️ Penyimpanan Data di Vercel
- **Lokal (server.js)**: Data disimpan ke `transactions.json` (persistent)
- **Vercel**: Data disimpan in-memory (tidak persistent saat function berhenti)

Untuk persistent storage di Vercel, gunakan salah satu:
- Vercel KV Storage
- PostgreSQL / Database eksternal
- MongoDB Atlas
- Firebase

Saat ini Vercel akan mencatat transaksi tetapi tidak tersimpan antar deployment.

## Struktur API

### POST /api/checkout
Simpan transaksi pembayaran

**Request:**
```json
{
  "orderType": "Item Terpilih|Semua Item",
  "paymentMethod": "transfer|ewallet|qris|cash",
  "shippingLabel": "COD|gosend|shopyfood|SiCepat",
  "shippingCost": 0,
  "subtotal": 10000,
  "totalAmount": 10000,
  "items": [{"name": "Takoyaki", "price": 10000, "quantity": 1}],
  "timestamp": "2026-06-08T12:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "id": 1
}
```

### GET /api/payments
Ambil daftar transaksi terakhir (max 200)

**Response:**
```json
{
  "success": true,
  "payments": [
    {
      "id": 1,
      "orderType": "Item Terpilih",
      "paymentMethod": "transfer",
      "shippingLabel": "COD",
      "shippingCost": 0,
      "subtotal": 10000,
      "totalAmount": 10000,
      "items": [...],
      "timestamp": "2026-06-08T12:00:00Z"
    }
  ]
}
```

## Environment Variables
- `VERCEL`: Automatically set pada Vercel deployment
- `PORT`: Default 3000 (lokal) atau auto-assigned (Vercel)

## Troubleshooting

### "Gagal menyimpan transaksi ke server"
- Periksa console browser (F12 > Console)
- Verifikasi API endpoint tersedia di `/api/checkout`
- Di Vercel, cek logs melalui dashboard

### API tidak merespons di Vercel
- Pastikan `vercel.json` sudah benar
- Cek bahwa file di folder `api/` memiliki exports yang tepat
- Verifikasi environment variables (jika ada)

## File Penting untuk Deployment
- ✅ `api/checkout.js`
- ✅ `api/payments.js`
- ✅ `vercel.json`
- ✅ `package.json`
- ✅ `.gitignore`
- ✅ Semua file HTML/CSS/JS

## Tidak Perlu Dipush
- `node_modules/` (gitignored)
- `transactions.json` (gitignored)
- `.git/` (sudah di-setup)
