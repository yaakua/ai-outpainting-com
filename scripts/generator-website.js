const { openAIChat4 } = require('./openai-chat')
const fs = require('fs')
const path = require('path')
/**
 * 1. 基于给定的关键词，生成TDK，并给出一些合适的网站名称
 * 2. 基于给定的关键词，生成4篇文章标题、描述和详情内容
 * 3. 基于给定的关键词，生成4篇文章的图片
 * 4. 基于给定的关键词，生成网站logo
 */
// 网站关键词
const keyword = 'extend image ai'
// 网站该要描述
const description = '利用AI技术实现对图片进行扩展，在保证原始图片不变的前提下，扩展四周的内容，且能与原图片保持内容延续性'
// 参考的网站地址
const website_likes = []
const store_path = path.join(__dirname)

// 生成网站TDK
async function generateTDK() {
  const prompt = `
    我希望你扮演一位SEO专家。作为一位SEO专家，你拥有广泛的知识和经验，能够帮助网站提高在搜索引擎结果中的排名，吸引更多的流量和用户。
    你熟悉各种搜索引擎的算法和规则，并能运用各种策略和技巧来优化网站的内容、结构和链接，以提升其在搜索结果中的可见性。
    我正在开发一个网站，网站的关键词是:${keyword}，网站的主要功能是：${description},请基于这些信息给出合适的TDK(使用英文返回)。
    请使用json格式返回。返回格式示例：{"title":"","description":"","keywords":""}
    `
  const tdk = await openAIChat4(prompt)
  // 将结果写入文件目录中使用json保存
  fs.writeFileSync(path.join(store_path, 'tdk.json'), JSON.stringify(JSON.parse(tdk), null, 2))

  console.log('tdk:\n', tdk)
}

async function generateHero() {
  const prompt = `
    我希望你扮演一位SEO专家。作为一位SEO专家，你拥有广泛的知识和经验，能够帮助网站提高在搜索引擎结果中的排名，吸引更多的流量和用户。
    你熟悉各种搜索引擎的算法和规则，并能运用各种策略和技巧来优化网站的内容、结构和链接，以提升其在搜索结果中的可见性。
    我正在开发一个网站，网站的关键词是:${keyword}，网站的主要功能是：${description},请基于这些信息给出合适的网站首屏宣传标语(使用英文返回)。
    请使用json格式返回。返回格式示例：{"title":"","description":""}
    `
  const hero = await openAIChat4(prompt)
  // 将结果写入文件目录中使用json保存
  fs.writeFileSync(path.join(store_path, 'hero.json'), JSON.stringify(JSON.parse(hero), null, 2))

  console.log('hero:\n', hero)
}

async function generateFAQ() {
  const prompt = `
    我希望你扮演一位SEO专家。作为一位SEO专家，你拥有广泛的知识和经验，能够帮助网站提高在搜索引擎结果中的排名，吸引更多的流量和用户。
    你熟悉各种搜索引擎的算法和规则，并能运用各种策略和技巧来优化网站的内容、结构和链接，以提升其在搜索结果中的可见性。
    我正在开发一个网站，网站的关键词是:${keyword}，网站的主要功能是：${description},请基于这些信息给出合适的faq(使用英文返回)。
    请使用json格式返回。返回格式示例：{"question":'',"answer":''}
    `
  const faq = await openAIChat4(prompt)
  // 将结果写入文件目录中使用json保存
  fs.writeFileSync(path.join(store_path, 'faq.json'), JSON.stringify(JSON.parse(faq), null, 2))

  console.log('faq:\n', faq)
}


async function generateBlogs() {
  const prompt = `
    我希望你扮演一位SEO专家。作为一位SEO专家，你拥有广泛的知识和经验，能够帮助网站提高在搜索引擎结果中的排名，吸引更多的流量和用户。
    你熟悉各种搜索引擎的算法和规则，并能运用各种策略和技巧来优化网站的内容、结构和链接，以提升其在搜索结果中的可见性。
    我正在开发一个网站，网站的关键词是:${keyword}，网站的主要功能是：${description}
    请你帮我根据以上素材，并且在网络上搜索一些与可能会出现的关键词相关的独一无二的，有趣的信息，帮我完成博客文章的标题和概要描述（使用英文返回）。
    要求：
        1. 提升 ${keyword} 的关键词密度 2. SEO 优秀。3. 以用户视角提问方式编写标题。4.至少3篇以上
    请使用json格式返回。返回格式示例：{"title":"","description":""}
    `
    const blogs = await openAIChat4(prompt);

    try {
      // Attempt to parse the response directly as JSON
      const parsedBlogs = JSON.parse(blogs);
      fs.writeFileSync(path.join(store_path, 'blogs.json'), JSON.stringify(parsedBlogs, null, 2));
      console.log('blogs:\n', parsedBlogs);
    } catch (e) {
      // If the direct JSON parsing fails, use regex to extract the JSON content
      console.log('blogs:\n', blogs);
      const reg = /```json\n(.*?)```/s;
      const blogsJson = reg.exec(blogs);
      
      if (blogsJson) {
        try {
          const blogsContent = blogsJson[1];
          // Write the extracted JSON content to a file
          fs.writeFileSync(
            path.join(store_path, 'blogs.json'),
            JSON.stringify(JSON.parse(blogsContent), null, 2),
          );
        } catch (parseError) {
          console.error('Failed to parse extracted JSON content:', parseError);
        }
      } else {
        console.error('Could not find JSON content within markdown block');
      }
    }
  }


async function generateBlogContent() {
  // 读取blogs.json文件，并创建一个子目录
  const blogs = JSON.parse(fs.readFileSync(path.join(store_path, 'blogs.json'), 'utf-8'))
  const blogDir = path.join(store_path, 'blogs')
  if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir)
  }
  // 循环生成4篇文章
  const articles = blogs['articles']
  for (const blog of articles) {
    const prompt = `
        我希望你扮演一位SEO专家。作为一位SEO专家，你拥有广泛的知识和经验，能够帮助网站提高在搜索引擎结果中的排名，吸引更多的流量和用户。
        你熟悉各种搜索引擎的算法和规则，并能运用各种策略和技巧来优化网站的内容、结构和链接，以提升其在搜索结果中的可见性。
        我正在开发一个网站，网站的关键词是:${keyword}，网站的主要功能是：${description}，博客的标题:${blog.title},博客的描述:${blog.description}
        请你帮我根据以上素材，并且在网络上搜索一些与可能会出现的关键词相关的独一无二的，有趣的信息，帮我完成博客的内容（使用英文返回）。
        要求：
            1. 提升 ${keyword} 的关键词密度 2. SEO 优秀。3.使用markdown格式返回，并遵守以下返回格式
        返回格式示例：
            ---
            title: 'How to Make a Picture Have a Transparent Background Using the Best Online Tools'
            slug: how-to-make-a-picture-have-a-transparent-background
            description: 'Learn how to easily create transparent backgrounds for your pictures using top online tools like Adobe Express and Photoroom. Enhance your images for professional and personal use with simple steps.'
            createdAt: '2024-06-12 10:41:05'
            fileName: How-to-Make-a-Picture-Have-a-Transparent-Background.mdx
            image: https://public-image.fafafa.ai/fa-image/2024/06/bd4b570fbe665c6ca155bd16faea03b4.webp
            ---
            博客内容
        `
        const blogContent = await openAIChat4(prompt)
        console.log('blogContent', blogContent)
    
        // 添加一个正则提取 ```markdown\n   ```的内容
        const reg = /```markdown\n([\s\S]*)\n```/g
        const match = reg.exec(blogContent)
    
        // 正则提取blog.title中的英文单词
        const reg2 = /[a-zA-Z]+/g
        const match2 = reg2.exec(blog.title)
        // 拼接math2列表中的单词，以-连接
        const blogFileName = match2.join('-')
        blog.fileName = `${blogFileName}.mdx`
    
        if (match) {
          const extract_content = match[1]
          fs.writeFileSync(path.join(blogDir, blog.fileName), extract_content)
        } else {
          fs.writeFileSync(path.join(blogDir, blog.fileName), blogContent)
        }
      }
}

async function modifyPrimaryColor(mainColor) {
  const prompt = `主要颜色为：${mainColor}

请修改如下颜色内容：
 primary: {
          DEFAULT: '#ec008c',
          50: 'rgb(255, 230, 204)', // 最浅的橙色调
          100: 'rgb(255, 204, 153)', // 较浅的橙色
          200: 'rgb(255, 178, 102)', // 稍微淡化的橙色
          300: 'rgb(255, 153, 51)',  // 接近原始颜色的橙色
          400: 'rgb(255, 128, 25)',  // 橙色略微加深
          500: '#FF6600',            // 原始的橙色，色彩饱和
          600: 'rgb(204, 82, 0)',    // 明显加深的橙色
          700: 'rgb(153, 61, 0)',    // 深橙色
          800: 'rgb(102, 41, 0)',    // 极深的橙色
          900: 'rgb(76, 30, 0)',     // 几乎黑色的橙色
          950: 'rgb(51, 20, 0)'      // 深邃的橙黑色
        }`

  const result = await openAIChat4(prompt)
  console.log('修改后的主要颜色结果:\n', result)
}

// 生成网页logo
async function generateLogo(word, primaryColor) {
  const prompt = `a website logo with word:"${word}" ,Highlight primary color is ${primaryColor} Use rounded rectangular square to wrap characters`
  console.log('prompt:', prompt)
}

async function generate() {
  // await generateTDK()
  // await generateHero()
  // await generateFAQ()
  await generateBlogs()
  await generateBlogContent()
}

generate().then(() => {
})

