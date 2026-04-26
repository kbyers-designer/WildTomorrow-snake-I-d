const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "MISSING_KEY");
  const body = JSON.parse(event.body);
  const { image, tab } = body;

  try {
    if (!process.env.GEMINI_API_KEY) throw new Error("API Key is missing in Netlify settings!");
    
    const match = image.match(/^data:(.*);base64,(.*)$/);
    if (!match) throw new Error("Invalid image data");
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(["Analyze snake image. Return JSON: {\"scoreA\": 80, \"scoreB\": 20, \"notes\": [{\"trait\": \"Test\", \"text\": \"Success\"}]}", { inlineData: { data: match[2], mimeType: match[1] } }]);
    
    return { statusCode: 200, body: result.response.text().replace(/```json/g, '').replace(/```/g, '') };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({scoreA: 0, scoreB: 0, notes: [{trait: "Error", text: e.message}]}) };
  }
};
