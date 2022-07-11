import fetch from 'node-fetch'

(async () => {
  const body = await (await fetch('https://baidu.com/')).text()
  console.log("fuck!!!!!!!!")
  console.log(body)
})()
