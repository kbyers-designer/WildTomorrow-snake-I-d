
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const body = JSON.parse(event.body);
  const { image, tab } = body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // The prompt now uses the 'tab' variable to handle per-pair logic on the server
    const prompt = `You are a snake ID assistant. Analyze the image and return ONLY JSON in this format: 
    {"scoreA": number, "scoreB": number, "notes": [{"trait": string, "text": string}]}
    Focus on ${tab === 'cc' ? 'Copperhead vs Corn Snake' : 'the provided snake pair'}.`;

    const base64 = image.split(',')[1];
    const mime = image.split(':')[1].split(';')[0];

    const result = await model.generateContent([
      prompt,
      { inlineData: {  base64, mimeType: mime } }
    ]);

    return { 
      statusCode: 200, 
      body: result.response.text().replace(/```json/g, '').replace(/```/g, '') 
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({scoreA: 0, scoreB: 0, notes: [{trait: "Error", text: e.message}]}) };
  }
};
