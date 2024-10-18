const fs = require('fs').promises;
const path = require('path');
const localeNames = require(path.join(__dirname, '../framework/locale/localeConfig'));
const directoryPath = path.join(__dirname, '../translations');
const { translate } = require('./openai-chat');

async function enhanceWordDensity(language, word) {
    console.log(`正在处理语言：${language}, ${localeNames[language]}, 目标词：${word}`);

    const filePath = path.join(directoryPath, `${language}/messages.json`);
    const data = await fs.readFile(filePath, 'utf8');
    const json = JSON.parse(data);
    const keys = Object.keys(json);

    const needEnhanceKeys = {};
    keys.forEach(function (key) {
        if (json[key]['translation']) {
            needEnhanceKeys[key] = json[key]['translation'];
        }
    });

    if (Object.keys(needEnhanceKeys).length === 0) {
        console.log("当前语言文件没有需要增强的翻译");
        return;
    }

    console.log(`当前语言:${language}, 需要增强的key数量:${Object.keys(needEnhanceKeys).length}`);

    const prompt = `
        - 你是一个擅长提升文案词密度的AI专家，具备丰富的语言表达能力和创意思维。
        - 请在以下文案中增加词"${word}"的使用频率，将其词密度提升到3%以上，使文案更加丰富和生动，但保持原意不变。
        - 如果原文中没有包含"${word}"，请适当地将其融入文案中，但不要勉强硬凑。
        - 输出格式为JSON，key保持不变，直接输出json内容，不要加\`\`\`json\`\`\`标签。
        - 保证json格式准确性，确保key与内容成对出现。
        - 目标语言为：${localeNames[language]}
        - 不要做任何解释，直接输出json内容
        - 输入JSON数据：
            ${JSON.stringify(needEnhanceKeys, null, 2)}
    `;

    let msg = await translate(prompt);
    console.log("AI返回值:", JSON.stringify(msg));
    enhancedTranslations = msg.choices[0].message.content;


    keys.forEach(function (key) {
        if (enhancedTranslations[key]) {
            json[key]['translation'] = enhancedTranslations[key];
        }
    });
   
    const jsonStr = JSON.stringify(json, null, 2);
    await fs.writeFile(filePath, jsonStr, 'utf8');
    console.log(`${language}语言文件处理完成`);
}

async function main(language, word) {
    try {
        if (!language || !word) {
            console.error('请指定要处理的语言、目标词和词密度');
            console.error('使用方式: node scripts/add-word-locale.js <语言代码> <目标词> <词密度>');
            return;
        }
        await enhanceWordDensity(language, word);
    } catch (err) {
        console.error('错误:', err);
    }
}
// 印尼语言
// main('id', 'perluas foto ai');
// 意大利
main('it', 'espandi immagine ai gratis');
// 英语
main('en', 'outpainting');