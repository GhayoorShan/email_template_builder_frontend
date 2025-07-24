export const compileMjml = async (mjmlCode: string): Promise<{ html: string }> => {
  // This relative path '/api/compile' is handled by the Vite dev server proxy
  // (configured in vite.config.ts) and will be forwarded to your backend.
  const response = await fetch("/api/compile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mjml: mjmlCode }),
  });

  if (!response.ok) {
    // Get the raw error text for better debugging.
    // The text could be an HTML error page or a plain text stack trace.
    const errorText = await response.text();
    throw new Error(
      `Server error: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  // response.ok guarantees the body is parsable as JSON in our case
  return response.json();
};