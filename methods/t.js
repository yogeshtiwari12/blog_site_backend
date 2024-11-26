const genAI = new GoogleGenerativeAI("AIzaSyDWrPSt5soXS8SMgQ6Wg74ys9KzzpqaB2g");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = "Write a story about a magic backpack".

const result = await model.generateContent(prompt);
console.log(result.response.text());
