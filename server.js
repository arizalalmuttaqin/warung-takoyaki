const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const dataFilePath = path.join(__dirname, "transactions.json");

function ensureDataFile() {
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([]));
  }
}

function readTransactions() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(raw || "[]");
  } catch (err) {
    console.error("Gagal membaca file transaksi:", err);
    return [];
  }
}

function writeTransactions(transactions) {
  fs.writeFileSync(dataFilePath, JSON.stringify(transactions, null, 2));
}

app.use(express.json());
app.use(express.static(__dirname));

app.post("/api/checkout", (req, res) => {
  const {
    orderType,
    paymentMethod,
    shippingLabel,
    shippingCost,
    subtotal,
    totalAmount,
    items,
    timestamp,
  } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Tidak ada item untuk dibayar.",
    });
  }

  const itemsJson = JSON.stringify(items);
  const transactions = readTransactions();
  const nextId = transactions.length ? transactions[transactions.length - 1].id + 1 : 1;
  const newTransaction = {
    id: nextId,
    orderType,
    paymentMethod,
    shippingLabel,
    shippingCost,
    subtotal,
    totalAmount,
    items: itemsJson,
    timestamp,
  };

  transactions.push(newTransaction);
  writeTransactions(transactions);

  res.json({
    success: true,
    paymentId: nextId,
  });
});

app.get("/api/payments", (req, res) => {
  const rows = readTransactions().slice(-50).reverse();
  const payments = rows.map((row) => ({
    ...row,
    items: row.items ? JSON.parse(row.items) : [],
  }));
  res.json({
    success: true,
    payments,
  });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
