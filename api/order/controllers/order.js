"use strict";
const stripe = require("stripe")(process.env.STRIPE_KEY);

module.exports = {
  create: async (ctx) => {
    const { gift, quantity, amount, message, background } = ctx.request.body;

    // Charge the customer
    try {
      await stripe.charges.create({
        // Transform cents to dollars.
        amount,
        currency: "sgd",
        description: `Order ${new Date()} for ${ctx.state.gift.name} x ${
          ctx.state.quantity
        }`,
        source: token,
      });

      // Register the order in the database
      try {
        const order = await strapi.services.order.create({
          gift: ctx.state.gift.id,
          background: ctx.state.background.id,
          quantity,
          message,
          amount,
        });

        return order;
      } catch (err) {
        // Silent
      }
    } catch (err) {
      // Silent
    }
  },
};
