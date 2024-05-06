const transactionSchema = {
  userId: String, // ID pengguna yang melakukan transaksi
  amount: Number, // Jumlah transaksi
  date: {
    type: Date,
    default: Date.now, // Tanggal dan waktu transaksi, secara default diatur saat ini
  },
};

module.exports = transactionSchema;
