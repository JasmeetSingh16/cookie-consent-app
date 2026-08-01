import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  const events = await db.consentEvent.findMany({
    where: { shop: session.shop },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const total = events.length;
  const accepted = events.filter((e) => e.choice === "accepted").length;
  const rejected = events.filter((e) => e.choice === "rejected").length;

  return { events, total, accepted, rejected };
};

export default function ConsentLog() {
  const { events, total, accepted, rejected } = useLoaderData();

  return (
    <s-page heading="Consent Log">
      <s-section heading="Summary">
        <s-stack direction="inline" gap="loose">
          <s-text>Total events: {total}</s-text>
          <s-text>Accepted: {accepted}</s-text>
          <s-text>Rejected: {rejected}</s-text>
        </s-stack>
      </s-section>

      <s-section heading="Recent events">
        {events.length === 0 ? (
          <s-paragraph>No consent events recorded yet.</s-paragraph>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>
                <th style={{ padding: "8px" }}>Choice</th>
                <th style={{ padding: "8px" }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "8px" }}>{event.choice}</td>
                  <td style={{ padding: "8px" }}>
                    {new Date(event.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </s-section>
    </s-page>
  );
}