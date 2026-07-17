const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    usuario: {
      type: String,
      required: [true, "Please add the buyer name"],
      trim: true,
    },
    correo: {
      type: String,
      required: [true, "Please add the buyer email"],
      trim: true,
      lowercase: true,
    },
    telefono: {
      type: String,
      required: [true, "Please add the phone number"],
      trim: true,
    },
    telefonoSecundario: {
      type: String,
      trim: true,
      default: "",
    },
    producto: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Please add the purchased product"],
    },
    montoPago: {
      type: Number,
      required: [true, "Please add the payment amount"],
      min: 0,
    },
    statusPago: {
      type: String,
      enum: ["pending", "approved", "rejected", "refunded", "cancelled"],
      default: "pending",
    },
    mercadoPagoId: {
      type: String,
      default: "",
    },
    notas: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Order", orderSchema);
