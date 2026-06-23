const HTML_XML_XSS_REGEX = /<script|<iframe|javascript:|onload\s*=|onerror\s*=|onclick\s*=|href\s*=|src\s*=|(?:\b(?:html|xml|svg|body|div|span|object|embed|applet|meta|link|style)\b)|<\/[a-z]+>|<[a-z]+/i;
const SQL_INJECTION_REGEX = /'\s*or\s*['\d]|"\s*or\s*["\d]|'\s*and\s*['\d]|"\s*and\s*["\d]|--|UNION\s+SELECT|DROP\s+TABLE|INSERT\s+INTO|DELETE\s+FROM|UPDATE\s+.*?\s+SET/i;
const PATH_TRAVERSAL_REGEX = /\.\.\/|\.\.\\/i;

export function checkForMischief(value: string): { hasMischief: boolean; reason?: string } {
  if (!value) return { hasMischief: false };

  if (HTML_XML_XSS_REGEX.test(value)) {
    return { hasMischief: true, reason: "HTML, XML, or script injection is not allowed." };
  }

  if (SQL_INJECTION_REGEX.test(value)) {
    return { hasMischief: true, reason: "SQL injection patterns are not allowed." };
  }

  if (PATH_TRAVERSAL_REGEX.test(value)) {
    return { hasMischief: true, reason: "File path traversal sequences are not allowed." };
  }

  return { hasMischief: false };
}

export function sanitizeSearch(value: string): string {
  if (!value) return "";
  return value.replace(/[<>]/g, "");
}
