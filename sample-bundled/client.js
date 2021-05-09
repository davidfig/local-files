import { dir, load } from '../'

const $ = query => document.querySelector(query)
const showDir = async () => {
    const files = await dir()
    files.forEach(file => {
        const button = document.createElement('button')
        button.innerHTML = file
        button.addEventListener('click', async e => {
            const data = await load(e.currentTarget.innerText)
            $('.file-results').innerHTML = data.file.replaceAll('\n', '<br>').replaceAll('  ', '&nbsp;&nbsp')
        })
        $('.files').appendChild(button)
    })
}

window.onload = showDir