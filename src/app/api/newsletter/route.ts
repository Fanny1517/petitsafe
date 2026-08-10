import { NextResponse } from "next/server";
import { demanderGuideDDPP } from "@/app/actions/newsletter";

export async function POST(req: Request) {
  try {
    let email = "";
    let website = "";

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      email = body.email || "";
      website = body.website || "";
    } else if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      email = formData.get("email")?.toString() || "";
      website = formData.get("website")?.toString() || "";
    }

    const result = await demanderGuideDDPP({ email, website });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Guide DDPP 2026 envoyé par email avec succès." });
  } catch (error) {
    console.error("Erreur API /api/newsletter :", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
