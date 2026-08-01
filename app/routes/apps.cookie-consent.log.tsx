import type { ActionFunctionArgs } from "react-router";
import db from "../db.server";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await request.json();
    const { choice, shop } = body;

    if (!choice || !shop) {
      return Response.json({ error: "Missing choice or shop" }, { status: 400 });
    }

    await db.consentEvent.create({
      data: {
        shop,
        choice,
      },
    });

    return Response.json(
      { success: true },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  } catch (err) {
    console.error("Failed to log consent event:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function loader() {
  return Response.json({ error: "Not found" }, { status: 404 });
}