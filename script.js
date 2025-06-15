let current = 0
const profiles = ['sofiane','axelle']
const checkBtn = document.getElementById('check-btn')
const cheatBtn = document.getElementById('cheat-btn')
const toast = document.getElementById('success-toast')

function showProfile(idx){
  profiles.forEach((id,i)=>{
    document.getElementById(id).classList.toggle('active', i===idx)
  })
}
function showToast(msg){
  toast.textContent=msg;toast.classList.add('show')
  setTimeout(()=>toast.classList.remove('show'),1500)
}

checkBtn.onclick = ()=>{
  const user = profiles[current]
  showToast(`${user} a résisté !`)
  current = (current+1)%profiles.length
  showProfile(current)
}
cheatBtn.onclick = ()=>{
  const user = profiles[current]
  showToast(`${user} fait un cheat-meal !`)
  current = (current+1)%profiles.length
  showProfile(current)
}

showProfile(0)
