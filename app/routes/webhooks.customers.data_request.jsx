import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  try {
    const { shop, topic, payload } = await authenticate.webhook(request);
    console.log(`Received ${topic} webhook for ${shop}`);
    console.log("Customer data request payload:", payload);
    return new Response();
  } catch (error) {
    console.error("customers/data_request webhook error:", error);
    return new Response("Unauthorized", { status: 401 });
  }
};
