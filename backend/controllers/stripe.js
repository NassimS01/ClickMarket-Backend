const express = require("express");
const User = require("../models/user");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const Stripe = require("stripe");
const Order = require("../models/order");
const stripe = require("stripe")(
  "sk_test_51NkcvmCpEyawkJLLNKTOcBBzLewiwbDUhuH4dOPfLyLNZTSVFhWgr2pFJAidtDqUmrynsGGHfHYlcud5P2oEyoXn00dZe1siUA"
);

router.post(
  "/create-checkout-session",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      const cartItems = req.body.cartItems.map((item) => {
        return {
          quantity: item.quantity,
          productId: item._id.toString(),
          name: item.name,
          images: [item.images.url],
        };
      });
      console.log(cartItems);
      if (!user) {
        return next(new ErrorHandler("Usuario no encontrado", 400));
      }

      const customer = await stripe.customers.create({
        metadata: {
          userId: req.user.id,
          cart: JSON.stringify(cartItems),
        },
      });

      const line_items = req.body.cartItems.map((item) => {
        return {
          price_data: {
            currency: "ars",
            product_data: {
              name: item.name,
              description: item.description,
              images: [item.images.url],
              metadata: {
                id: item._id,
              },
            },
            unit_amount: item.price * 100,
          },
          quantity: item.quantity,
        };
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        shipping_address_collection: {
          allowed_countries: ["AR"],
        },
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: {
                amount: 3000 * 100,
                currency: "ars",
              },
              display_name: "Despachado al siguiente día",
              delivery_estimate: {
                minimum: {
                  unit: "business_day",
                  value: 1,
                },
                maximum: {
                  unit: "business_day",
                  value: 1,
                },
              },
            },
          },
        ],
        customer: customer.id,
        line_items,
        mode: "payment",
        success_url: `${process.env.SERVER_URL}/profile/orders`,
        cancel_url: `${process.env.SERVER_URL}/profile/cart`,
      });

      res.send({ url: session.url });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Create Order
const createOrder = async (customer, data) => {
  // const Items = JSON.parse(customer.metadata.cartItems);

  const newOrder = new Order({
    userId: customer.metadata.userId,
    customerId: data.customer,
    paymentIntentId: data.payment_intent,
    products: JSON.parse(customer.metadata.cart),
    subtotal: data.amount_subtotal,
    total: data.amount_total,
    shipping: data.customer_details,
    payment_status: data.payment_status,
  });

  const userId = customer.metadata.userId;
  const user = await User.findById(userId);

  try {
    const saveOrder = await newOrder.save();
    user.order.push(newOrder);
    user.cart = [];

    await user.save();

    console.log("Processed Order:", saveOrder);
  } catch (err) {
    console.log(err);
  }
};

// Stripe webhook
let endpointSecret;

// endpointSecret = "whsec_f10da141a1fc8b452ba3762b1e5c84196a123a537b4d8dc41c19205c63febfdf";

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];
    let data;
    let eventType;

    if (endpointSecret) {
      let event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        console.log("Webhook verified.");
      } catch (err) {
        console.log(`Webhook Error: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }

      data = event.data.object;
      eventType = event.type;
    } else {
      data = req.body.data.object;
      eventType = req.body.type;
    }

    if (eventType === "checkout.session.completed") {
      stripe.customers
        .retrieve(data.customer)
        .then((customer) => {
          createOrder(customer, data);
        })
        .catch((err) => console.log(err.message));
    }
    // Return a 200 response to acknowledge receipt of the event
    res.send().end();
  }
);

router.get(
  "/get-all-orders",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.find().sort({ createdAt: -1 });

      res.status(201).json({
        success: true,
        order,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

module.exports = router;
