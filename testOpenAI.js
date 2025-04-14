require("dotenv").config(); // Will load from .env by default
console.log("OPENAI_API_KEY loaded:", !!process.env.OPENAI_API_KEY); // Should say true
console.log("Key preview (first 10 chars):", process.env.OPENAI_API_KEY?.slice(0, 10)); // Quick check

const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testOpenAI() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "What are the symptoms of flu?" }],
    });

    console.log("Response from OpenAI:\n", response.choices[0].message.content);
  } catch (error) {
    console.error("❌ OpenAI Test Error:", error.message);
    console.error("Stack trace:", error.stack);
  }
}

testOpenAI();
