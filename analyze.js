
const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { image, tab } = body;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: [
        { type: "text", text: "Analyze snake photo, return JSON: {scoreA, scoreB, notes: [{trait, text}]}" },
        { type: "image_url", image_url: { url: image } }
      ]}],
      response_format: { type: "json_object" }
    });
    return { statusCode: 200, body: response.choices[0].message.content };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({scoreA: 50, scoreB: 50, notes: [{trait: 'Error', text: 'AI API unavailable'}]}) };
  }
};
