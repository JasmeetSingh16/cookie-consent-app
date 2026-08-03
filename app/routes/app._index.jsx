import { useEffect, useState } from "react";
import { useLoaderData, useFetcher } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const settings = await db.bannerSettings.findUnique({
    where: { shop: session.shop },
  });
  return { settings };
};

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();

  const data = {
    bannerText: formData.get("bannerText"),
    bannerTextFr: formData.get("bannerTextFr"),
    acceptText: formData.get("acceptText"),
    acceptTextFr: formData.get("acceptTextFr"),
    rejectText: formData.get("rejectText"),
    rejectTextFr: formData.get("rejectTextFr"),
    customizeText: formData.get("customizeText"),
    customizeTextFr: formData.get("customizeTextFr"),
    position: formData.get("position"),
    bgColor: formData.get("bgColor"),
    textColor: formData.get("textColor"),
    buttonColor: formData.get("buttonColor"),
  };

  await db.bannerSettings.upsert({
    where: { shop: session.shop },
    update: data,
    create: { shop: session.shop, ...data },
  });

  return { success: true };
};

export default function Index() {
  const { settings } = useLoaderData();
  const fetcher = useFetcher();
  const shopify = useAppBridge();

  const [form, setForm] = useState({
    bannerText:
      settings?.bannerText ||
      "We use cookies to improve your experience. By using our site, you agree to our use of cookies.",
    bannerTextFr:
      settings?.bannerTextFr ||
      "Nous utilisons des cookies pour améliorer votre expérience. En utilisant notre site, vous acceptez notre utilisation des cookies.",
    acceptText: settings?.acceptText || "Accept",
    acceptTextFr: settings?.acceptTextFr || "Accepter",
    rejectText: settings?.rejectText || "Reject",
    rejectTextFr: settings?.rejectTextFr || "Refuser",
    customizeText: settings?.customizeText || "Customize",
    customizeTextFr: settings?.customizeTextFr || "Personnaliser",
    position: settings?.position || "bottom",
    bgColor: settings?.bgColor || "#1a1a1a",
    textColor: settings?.textColor || "#ffffff",
    buttonColor: settings?.buttonColor || "#00a86b",
  });

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const isSaving = fetcher.state === "submitting";

  useEffect(() => {
    if (fetcher.data?.success) {
      shopify.toast.show("Settings saved");
    }
  }, [fetcher.data, shopify]);

  const handleSave = () => {
    fetcher.submit(form, { method: "POST" });
  };

  const fieldStyle = { width: "100%", padding: "8px", marginTop: "4px", marginBottom: "12px", boxSizing: "border-box" };
  const colorFieldStyle = { ...fieldStyle, width: "60px", padding: "2px", display: "block" };

  return (
    <s-page heading="Cookie Consent Banner Settings">
      <s-button slot="primary-action" onClick={handleSave} {...(isSaving ? { loading: true } : {})}>
        Save settings
      </s-button>

      <s-section heading="Banner text — English">
        <div>
          <label>Banner text</label>
          <textarea value={form.bannerText} onChange={update("bannerText")} rows={2} style={fieldStyle} />

          <label>Accept button text</label>
          <input type="text" value={form.acceptText} onChange={update("acceptText")} style={fieldStyle} />

          <label>Reject button text</label>
          <input type="text" value={form.rejectText} onChange={update("rejectText")} style={fieldStyle} />

          <label>Customize button text</label>
          <input type="text" value={form.customizeText} onChange={update("customizeText")} style={fieldStyle} />
        </div>
      </s-section>

      <s-section heading="Banner text — Français">
        <div>
          <label>Texte de la bannière</label>
          <textarea value={form.bannerTextFr} onChange={update("bannerTextFr")} rows={2} style={fieldStyle} />

          <label>Texte du bouton Accepter</label>
          <input type="text" value={form.acceptTextFr} onChange={update("acceptTextFr")} style={fieldStyle} />

          <label>Texte du bouton Refuser</label>
          <input type="text" value={form.rejectTextFr} onChange={update("rejectTextFr")} style={fieldStyle} />

          <label>Texte du bouton Personnaliser</label>
          <input type="text" value={form.customizeTextFr} onChange={update("customizeTextFr")} style={fieldStyle} />
        </div>
      </s-section>

      <s-section heading="Appearance">
        <div>
          <label>Banner position</label>
          <select value={form.position} onChange={update("position")} style={fieldStyle}>
            <option value="bottom">Bottom</option>
            <option value="top">Top</option>
          </select>

          <label>Background color</label>
          <input type="color" value={form.bgColor} onChange={update("bgColor")} style={colorFieldStyle} />

          <label>Text color</label>
          <input type="color" value={form.textColor} onChange={update("textColor")} style={colorFieldStyle} />

          <label>Button color</label>
          <input type="color" value={form.buttonColor} onChange={update("buttonColor")} style={colorFieldStyle} />
        </div>
      </s-section>
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};