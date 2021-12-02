const setValue = (value) => localStorage.setItem("ranking", JSON.stringify(value))

const getValue = () => {
  const value = localStorage.getItem("ranking")
  return value ? JSON.parse(value) : []
}

const showRanking = () => {
  const $list = document.querySelector('#list')

  const render = () => {
    const array = getValue()

    const arraySorted = array.sort((a, b) => {
      const aa = Number(a[1])
      const bb = Number(b[1])
      if (aa < bb) return -1;
      return aa > bb ? 1 : 0;
    }).reverse()

    const html = arraySorted.map(([name, total]) => `
      <li>${total} | ${name}</li>
    `)
    $list.innerHTML = html.join('')
  }

  render()
}

document.addEventListener('DOMContentLoaded', showRanking)

