const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const body = JSON.parse(event.body);
  const { image, tab } = body;

  try {
    // Extract mime type and base64 string
    const match = image.match(/^(.*);base64,(.*)$/);
    if (!match) throw new Error("Invalid image format");
    const mimeType = match[1];
    const base64Data = match[2];

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      "Analyze the snake image for the ID guide. Return ONLY JSON: {\"scoreA\": number, \"scoreB\": number, \"notes\":[{\"trait\": string, \"text\": string}]}",
      { inlineData: {  base64Data, mimeType: mimeType } }
    ]);

    return { 
      statusCode: 200, 
      headers: { "Content-Type": "application/json" },
      body: result.response.text().replace(/```json/g, '').replace(/```/g, '') 
    };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: JSON.stringify({scoreA: 50, scoreB: 50, notes: [{trait: 'Error', text: e.message}]}) };
  }
};
