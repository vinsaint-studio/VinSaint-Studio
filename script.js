
const title = document.getElementById("title")

document.addEventListener("mousemove",(e)=>{

const x = (e.clientX / window.innerWidth - 0.5) * 30
const y = (e.clientY / window.innerHeight - 0.5) * 30

title.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg)`

})
