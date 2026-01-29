export async function askAI(prompt: string) {
  const API_KEY = "AIzaSyCPKK4YBQNyJJVB_eidndVU5Bn1CgQlXHE";

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  const data = await res.json();
  return data.candidates[0].content.parts[0].text;
}
