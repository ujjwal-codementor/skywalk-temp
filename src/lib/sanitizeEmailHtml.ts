import sanitizeHtml from "sanitize-html";

// Server-side HTML sanitizer tailored for email-safe content.
// Allows a conservative subset of tags and inline CSS commonly supported by major email clients.
export function sanitizeEmailHtml(dirtyHtml: string): string {
  const clean = sanitizeHtml(dirtyHtml || "", {
    allowedTags: [
      "a","b","strong","i","em","u","p","div","span","ul","ol","li","br",
      "img","table","thead","tbody","tr","td","th","h1","h2","h3","h4","h5","h6","hr"
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "style"],
      img: ["src", "alt", "width", "height", "style"],
      table: ["width", "align", "border", "cellpadding", "cellspacing", "role", "style"],
      td: ["width", "align", "valign", "colspan", "rowspan", "style"],
      th: ["width", "align", "valign", "colspan", "rowspan", "style"],
      div: ["align", "style"],
      p: ["align", "style"],
      span: ["style"],
      h1: ["style"], h2: ["style"], h3: ["style"], h4: ["style"], h5: ["style"], h6: ["style"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowProtocolRelative: true,
    // Restrict inline CSS to a safe subset typically supported in emails
    allowedStyles: {
      "*": {
        // text styles
        color: [/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, /^rgb\(/i, /^rgba\(/i, /^[a-z]+$/i],
        "background-color": [/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, /^rgb\(/i, /^rgba\(/i],
        "font-family": [/^[a-zA-Z0-9,\-\s"']+$/],
        "font-size": [/^[0-9.]+(px|pt|em|rem|%)$/],
        "font-weight": [/^(normal|bold|[1-9]00)$/],
        "font-style": [/^(normal|italic|oblique)$/],
        "text-decoration": [/^(none|underline|line-through)$/],
        "text-align": [/^(left|right|center|justify)$/],
        "line-height": [/^[0-9.]+(px|pt|em|rem|%)?$/],

        // box model
        margin: [/^[0-9.\s]+(px|pt|em|rem|%)?$/],
        padding: [/^[0-9.\s]+(px|pt|em|rem|%)?$/],
        border: [/^[0-9.\s]+(px|pt|em|rem)?\s+(solid|dashed|dotted)\s+.+$/],
        "border-radius": [/^[0-9.]+(px|pt|em|rem|%)$/],

        // layout
        display: [/^(block|inline|inline-block|none|table|table-row|table-cell)$/],
        width: [/^[0-9.]+(px|pt|em|rem|%)$/],
        "max-width": [/^[0-9.]+(px|pt|em|rem|%)$/],
        height: [/^[0-9.]+(px|pt|em|rem|%)$/],
        "vertical-align": [/^(top|middle|bottom|baseline)$/],
      },
    },
    // Disallow unknown protocols in URLs
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { target: "_blank", rel: "noopener noreferrer" }),
    },
    // Escape any CSS not allowed rather than dropping entire attribute
    enforceHtmlBoundary: true,
  });
  return clean;
}


