const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");
const Order = require("../models/Order");
const Product = require("../models/Product");

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

const createPaymentPreference = async (req, res) => {
  try {
    const body = req.body || {};
    const producto = body.producto || body.product || body.item || null;
    const usuario = body.usuario || body.user || body.nombre || "Cliente";
    const correo = body.correo || body.email || "";
    const telefono = body.telefono || body.phone || "";
    const telefonoSecundario =
      body.telefonoSecundario || body.secondaryPhone || "";
    const montoPago = body.montoPago ?? body.amount ?? body.price ?? 0;
    const orderData = body.orderData || {};

    if (!producto) {
      return res.status(400).json({ message: "Product data is required" });
    }

    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      return res
        .status(500)
        .json({ message: "Mercado Pago access token is not configured" });
    }

    const productName = producto.name || producto.title || "Producto";
    const productPrice = 1;
    const preferenceTitle = `Seña de ${productName}`;

    const order = await Order.create({
      usuario: usuario || "Cliente",
      correo,
      telefono,
      telefonoSecundario,
      producto,
      montoPago: productPrice,
      statusPago: "pending",
      direction: orderData?.direction || "",
    });

    const preference = new Preference(client);

    const successUrl = `https://lorecunas-new.vercel.app/checkout/payment/success/${order.id    }`;
    const failureUrl = `https://lorecunas-new.vercel.app/checkout/payment/failed/${order.id}`;
    const pendingUrl = `https://lorecunas-new.vercel.app/checkout/payment/pending/${order.id}`;

    const response = await preference.create({
      body: {
        items: [
          {
            id: producto._id,
            title: preferenceTitle,
            quantity: 1,
            unit_price: productPrice,
            currency_id: "ARS",
          },
        ],
        payer: {
          name: usuario,
          email: correo || "test@test.com",
          phone: {
            number: telefono || "",
          },
        },
        back_urls: {
          success: successUrl,
          failure: failureUrl,
          pending: pendingUrl,
        },
        auto_return: "approved",
        external_reference: order._id.toString(),
        metadata: {
          usuario: usuario || "",
          correo: correo || "",
          telefono: telefono || "",
          telefonoSecundario: telefonoSecundario || "",
          producto: JSON.stringify(producto),
          orderData: JSON.stringify(orderData),
          orderId: order._id.toString(),
        },
      },
    });

    await Order.findByIdAndUpdate(order._id, {
      mercadoPagoId: response.id,
    });

    res.status(200).json({
      init_point: response.init_point,
      preferenceId: response.id,
      sandbox_init_point: response.sandbox_init_point,
      orderId: order._id,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const handleMercadoPagoWebhook = async (req, res) => {
  try {
    const body = req.body || {};
    const paymentId = body?.data?.id;
    const type = body?.type;

    if (!paymentId || type !== "payment") {
      return res.status(200).json({ received: true });
    }

    const paymentService = new Payment(client);
    const paymentDetails = await paymentService.get({ id: paymentId });
    const paymentStatus = paymentDetails?.status || body?.action || "pending";
    const mappedStatus =
      paymentStatus === "approved"
        ? "approved"
        : paymentStatus === "rejected"
          ? "rejected"
          : paymentStatus === "cancelled"
            ? "cancelled"
            : paymentStatus === "refunded"
              ? "refunded"
              : "pending";

    const orderId =
      paymentDetails?.external_reference || paymentDetails?.metadata?.orderId;

    if (!orderId) {
      return res.status(200).json({ received: true, message: "No matching order found" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(200).json({ received: true, message: "No matching order found" });
    }

    const previousStatus = order.statusPago;
    order.statusPago = mappedStatus;
    await order.save();

    if (mappedStatus === "approved" && previousStatus !== "approved") {
      const productId =
        order.producto?._id || order.producto?.id || order.producto;

      if (productId) {
        await Product.findOneAndUpdate(
          { _id: productId, stock: { $gt: 0 } },
          { $inc: { stock: -1 } },
        );
      }
    }

    res
      .status(200)
      .json({ received: true, orderId: order._id, statusPago: mappedStatus });
  } catch (error) {
    console.error("Mercado Pago webhook error:", error);
    res.status(200).json({ received: true, message: error.message });
  }
};

module.exports = {
  createPaymentPreference,
  handleMercadoPagoWebhook,
};
