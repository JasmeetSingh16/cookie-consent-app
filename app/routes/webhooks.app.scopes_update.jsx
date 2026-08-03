import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  try {
    const { payload, session, topic, shop } = await authenticate.webhook(request);
    console.log(`Received ${topic} webhook for ${shop}`);
    const current = payload.current;
    if (session) {
      await db.session.update({
        where: { id: session.id },
        data: { scope: current.toString() },
      });
    }
    return new Response();
  } catch (error) {
    console.error("app/scopes_update webhook error:", error);
    return new Response("Unauthorized", { status: 401 });
  }
};
