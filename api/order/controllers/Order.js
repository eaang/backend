"use strict";
const stripe = require("stripe")(
  "sk_test_51ICPwDH03RVvNeTInbCjtQMlamgFH47aY7hf2ry9kgE85pFzV5949nJfjv8Svf1sdyvt4CIiqPxfCcOgqsn0Ug3k00lV39zSy1"
);
const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

module.exports = {
  async create(ctx) {
    let entity;

    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.api.order.services.order.create(data, { files });
    } else {
      const {
        user,
        gift,
        quantity,
        price,
        message,
        background,
        token,
      } = ctx.request.body;

      await stripe.charges.create({
        amount: price * 100,
        currency: "sgd",
        description: `Order for ${quantity} x ${gift.name}`,
        source: token,
      });

      entity = await strapi.api.order.services.order.create({
        user,
        gift,
        quantity,
        price,
        message,
        background,
      });
    }
    return sanitizeEntity(entity, { model: strapi.query("order").model });
  },
};
