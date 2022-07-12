const ipcRenderer = require('electron').ipcRenderer

function getPostList () {
    const postElems = document.querySelectorAll('.entry-list>li.item')
    const list = []
    postElems.forEach(item => {
        const linkElem = item.querySelector('.title-row a') || {}
        list.push({
            title: linkElem.innerText || '',
            link: linkElem.href || ''
        })
    })
    return list
}

function main () {
    console.log("fuvk")
    // 延迟时间等dom渲染
    setTimeout(() => {
        const list = getPostList()
        ipcRenderer.sendToHost('data', JSON.stringify(list))
    }, 100)
}

main()
