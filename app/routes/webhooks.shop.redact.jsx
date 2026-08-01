import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  const { shop, topic } = await authenticate.webhook(request);
  console.log(`Received ${topic} webhook for ${shop}`);

  await db.bannerSettings.deleteMany({ where: { shop } });
  await db.consentEvent.deleteMany({ where: { shop } });

  return new Response();
};