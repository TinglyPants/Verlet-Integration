window.onload = () => {
var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight

var points = []
// Add some random points
size = 450
for (let i = 0; i < 1000; i++){
    let x = (Math.random() * size)
    let y = (Math.random() * size)
    points.push({
        x: x,
        y: y,
        oldx: x + Math.random() * 4,
        oldy: y + Math.random() * 4
    })
}

var sticks = []
// Add some random sticks
for (let i = 0; i < 2000; i++){
    let index0 = Math.floor(Math.random() * points.length)
    let index1 = Math.floor(Math.random() * points.length)
    if (index1 == index0){
        if (index1 == points.length - 1){
            index1 -= 1
        }
        else{
            index1 += 1
        }
    }
    sticks.push({
        p0: points[index0],
        p1: points[index1],
        length: distance(points[index0], points[index1])
    })
}


var dampening = 0.9 // This is how much energy is preserved in the bounce. 1 = 100%, 0.9 = 90% and so on...
var friction = 0.999 // This is how much energy is preserved after friction / air resistance.
update()

function updatePoints(){
    for (let i = 0; i < points.length; i++){
        var p = points[i]

        // Preserving motion
        vx = (p.x - p.oldx) * friction
        vy = (p.y - p.oldy) * friction
        p.oldx = p.x
        p.oldy = p.y
        p.x += vx
        p.y += vy

        // GRAVITY
        p.y += 0.5
    }
}

function renderPoints(){
    context.clearRect(0, 0, width, height)
    for (let i = 0; i < points.length; i++){
        var p = points[i]
        context.beginPath()
        context.arc(p.x, p.y, 5, 0, Math.PI * 2)
        context.fill()
    }
}

function constrainPoints(){
    for (let i = 0; i < points.length; i++){
        var p = points[i]

        // X screen constraints
        if (p.x >= width){
            vx = p.x - p.oldx
            p.x = width
            p.oldx = p.x + vx * dampening
        }
        else if (p.x <= 0){
            vx = p.x - p.oldx
            p.x = 0
            p.oldx = p.x + vx * dampening
        }
        // Y screen constraints
        else if (p.y >= height){
            vy = p.y - p.oldy
            p.y = height
            p.oldy = p.y + vy * dampening
        }
        else if (p.y <= 0){
            vy = p.y - p.oldy
            p.y = 0
            p.oldy = p.y + vy * dampening
        }
    }
}

function distance(p0, p1){
    let dx = p0.x - p1.x
    let dy = p0.y - p1.y
    return Math.sqrt(dx * dx + dy * dy)
}

function updateSticks(){
    for (let i = 0; i < sticks.length; i++){
        var s = sticks[i]
        var dx = s.p0.x - s.p1.x
        var dy = s.p0.y - s.p1.y
        var pointDist = distance(s.p0, s.p1)
        var difference = s.length - pointDist
        var percent = difference / pointDist / 2
        var offsetX = dx * percent
        var offsetY = dy * percent

        // adjust points
        s.p0.x += offsetX
        s.p0.y += offsetY
        s.p1.x -= offsetX
        s.p1.y -= offsetY
    }
}

function renderSticks(){
    context.beginPath()
    for (i = 0; i < sticks.length; i++){
        var s = sticks[i]
        context.moveTo(s.p0.x, s.p0.y)
        context.lineTo(s.p1.x, s.p1.y)
    }
    context.stroke()
}

function update(){
    updatePoints()
    let maxIterations = 5
    for (i = 0; i < maxIterations; i++){
        updateSticks()
        constrainPoints()
    }
    renderPoints()
    renderSticks()
    requestAnimationFrame(update)
}

}