import type { LoaderFunctionArgs } from "react-router";
import db from "../db.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  if (!shop) {
    return Response.json({ error: "Missing shop" }, { status: 400 });
  }

  const settings = await db.bannerSettings.findUnique({ where: { shop } });
  const s = settings || ({} as Record<string, string>);

  return Response.json(
    {
      en: {
        bannerText:
          s.bannerText ||
          "We use cookies to improve your experience. By using our site, you agree to our use of cookies.",
        acceptText: s.acceptText || "Accept",
        rejectText: s.rejectText || "Reject",
        customizeText: s.customizeText || "Customize",
      },
      fr: {
        bannerText:
          s.bannerTextFr ||
          "Nous utilisons des cookies pour améliorer votre expérience. En utilisant notre site, vous acceptez notre utilisation des cookies.",
        acceptText: s.acceptTextFr || "Accepter",
        rejectText: s.rejectTextFr || "Refuser",
        customizeText: s.customizeTextFr || "Personnaliser",
      },
      position: s.position || "bottom",
      bgColor: s.bgColor || "#1a1a1a",
      textColor: s.textColor || "#ffffff",
      buttonColor: s.buttonColor || "#00a86b",
    },
    { headers: { "Access-Control-Allow-Origin": "*" } }
  );
}