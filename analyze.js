// functions/analyze.js – Updated for Gemini Free Tier
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { image, tab } = body;
  
  // Extract base64 data from the data URL
  const base64Data = image.split(',')[1];

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = "You are a snake ID assistant. Analyze the image and return ONLY JSON in this format: " +
      '{"scoreA": 80, "scoreB": 20, "notes": [{"trait": "Pattern", "text": "Details here"}]}';

    const result = await model.generateContent([
      prompt,
      { inlineData: {  base64Data, mimeType: "image/jpeg" } }
    ]);

    return { 
      statusCode: 200, 
      body: result.response.text().replace(/```json/g, '').replace(/```/g, '') 
    };
  } catch (e) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({scoreA: 50, scoreB: 50, notes: [{trait: 'Error', text: 'Gemini API failed'}]}) 
    };
  }
};
