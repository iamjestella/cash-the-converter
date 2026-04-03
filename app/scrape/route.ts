import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Please provide a valid URL." },
        { status: 400 }
      );
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Invalid protocol");
      }
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format. Make sure it starts with https://" },
        { status: 400 }
      );
    }

    // Fetch the page content
    const response = await fetch(parsedUrl.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Could not fetch page (HTTP ${response.status})` },
        { status: 400 }
      );
    }

    const html = await response.text();

    // Extract meaningful text content from HTML
    // Remove scripts, styles, and HTML tags, then clean up whitespace
    const cleaned = html
      // Remove script tags and content
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      // Remove style tags and content
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      // Remove HTML comments
      .replace(/<!--[\s\S]*?-->/g, "")
      // Remove SVG content
      .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, "")
      // Replace common block elements with newlines
      .replace(/<\/(p|div|h[1-6]|li|tr|br|hr)[^>]*>/gi, "\n")
      // Remove remaining HTML tags
      .replace(/<[^>]+>/g, " ")
      // Decode common HTML entities
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ")
      // Clean up whitespace
      .replace(/[ \t]+/g, " ")
      .replace(/\n\s*\n/g, "\n")
      .trim();

    // Truncate to ~8000 chars to stay within reasonable prompt limits
    const truncated = cleaned.length > 8000
      ? cleaned.substring(0, 8000) + "\n\n[Content truncated for length...]"
      : cleaned;

    if (truncated.length < 50) {
      return NextResponse.json(
        { error: "Could not extract meaningful content from that page." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      content: truncated,
      source: parsedUrl.hostname,
    });
  } catch (error: unknown) {
    console.error("Scrape error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch URL content";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
