const fs = require('fs')
const path = require('path')
const localeNames = require(path.join(__dirname, '../framework/locale/localeConfig'))
const directoryPath = path.join(__dirname, '../blogs')
const { translate } = require('./openai-chat')
const matter = require('gray-matter')

async function translateBlogs() {
  // 获取enFiles目录下的所有文件列表。
  const enFiles = fs.readdirSync(path.join(directoryPath, 'en'))
  for (const file of enFiles) {
    /*
       1. 循环读取语言列表，根据语言列表定位到最终的文件目录。判断指定语言目录下是否存在与file相同名称的文件
       2.如果文件存在，判断文件内容的修改日期与file日期是否一致，不一致则删除该文件，重新翻译。
       3.如果文件不存在，则翻译该文件。
     */
    for (const locale of Object.keys(localeNames)) {
      const language = localeNames[locale]
      if (locale === 'en') {
        continue
      }
      // 获取对应的中文原始文件的修改日期
      const {
        data: frontMatter,
        content
      } = matter(fs.readFileSync(path.join(directoryPath, 'en', file), 'utf-8'))
      let isExist = false
      // 循环读取当前语言目录下的文件，获取文件当中的originalSlug与data.slug是否一致
      const localFileDir = path.join(directoryPath, locale)
      if (!fs.existsSync(localFileDir)) {
        fs.mkdirSync(localFileDir)
      }
      const localFiles = fs.readdirSync(localFileDir)

      for (const localFile of localFiles) {
        const filePath = path.join(directoryPath, locale, localFile)
        const markdownFile = fs.readFileSync(filePath, 'utf-8')
        const { data: frontMatter2 } = matter(markdownFile)
        if (frontMatter2.fileName === file) {
          // 获取文件的修改日期
          const fileModifiedDate = frontMatter.createdAt
          const originalFileModifiedDate = frontMatter2.createdAt
          if (new Date(fileModifiedDate).getTime() !== new Date(originalFileModifiedDate).getTime()) {
            // 删除文件并重新翻译
            fs.unlinkSync(filePath)
            console.log(file + '文件已更新，需要重新翻译为：' + language)
          } else {
            isExist = true
            console.log(file + '文件未更新，无需翻译为：' + language)
          }
          break
        }
      }

      // 判断文件是否存在
      if (!isExist) {
        console.log(file + '在' + locale + '下不存在，需要翻译成新的语言：' + language)
        // await new Promise(resolve => setTimeout(resolve, 3000)); // 等待3秒
        await translateFile(content, localFileDir, language, frontMatter, file)
      }

    }
  }
}

translateBlogs().then(() => {
  console.log('翻译完成')
})


async function translateFile(content, filePath, language, frontMatter, fileName) {
  const prompt = `
                   - 你是一个擅长数据处理和多语言翻译的AI专家，具备高效处理markdown文档和灵活应对多种语言需求的能力。 
                   - 翻译考虑到专业术语和正式风格，适用于正式文档和网站博客编写。不要做任何解释
                   - 翻译考虑使用当地的习惯用语，而不是简单的文字翻译，了解原始文字的意境找到当地的表达方式进行翻译，这个很重要。可以适当的做一些内容改写
                    - 翻译成目标语言为：${language}
                    - 保持markdown格式，不做任何修改
                    - 你需要再回顾一下你翻译的内容是否与原文含义一致，是否有遗漏，是否有错误，是否有需要修改的地方，请你在翻译的过程中注意细节。
                    - title、slug、description字段内容需要适合yaml格式，因此翻译的内容请按yaml格式输出，确保能使用yaml工具正确解析使用两个---包裹的内容。
                    - 输入内容当中的slug字段是用于生成文章url的,内容不要过长，保持在100个字符一行以内，请翻译后确保文字内容适合url地址，不要有特殊符号。允许使用-、_字符将多个单词连接。
                    - description字段内容保持在一行内显示，不要换行，不要有多行内容
                    - 输入内容：
                        ---
                        title: ${frontMatter.title}
                        slug: ${frontMatter.slug}
                        description: ${frontMatter.description}
                        ---
                        \n\n
                        ${content}
                        `

  let msg = await translate(prompt)
  // console.log('openai返回值:', JSON.stringify(msg))
  msg = msg.choices[0].message.content
  try {
    // 添加一个正则提取 ```markdown\n   ```的内容
    const reg = /```markdown\n([\s\S]*)\n```/g
    const match = reg.exec(msg)
    let extractContent;
    let data, content2;
    if (match) {
      extractContent = match[1];
      ({ data, content: content2 } = matter(extractContent));
    } else {
      ({ data, content: content2 } = matter(msg.choices[0].message.content));
    }

    data.originalSlug = frontMatter.slug
    // data.keepWords = frontMatter.keepWords
    data.createdAt = frontMatter.createdAt
    data.fileName = fileName
    data.image = frontMatter.image
    const frontMatterString = matter.stringify('', data)
    // 将 front matter 和内容重新组合成一个新的 Markdown 文件内容
    const newFileContent = `${frontMatterString}\n${content2}`
    // 更新文件名
    const newFilePath = path.join(filePath, `${data.slug}.mdx`)
    // 更新文件内容
    fs.writeFileSync(newFilePath, newFileContent, 'utf8')
  } catch (e) {
    console.log('写入文件失败', e)
    console.log('翻译后的内容:', msg)
  }
}






