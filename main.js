window.onload = () => {
var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight

var points = []
points.push({
    x: 100,
    y: 100,
    oldx: 80,
    oldy: 80
})
points.push({
    x: 200,
    y: 100,
    oldx: 200,
    oldy: 100
})
points.push({
    x: 100,
    y: 200,
    oldx: 100,
    oldy: 200
})
points.push({
    x: 200,
    y: 200,
    oldx: 200,
    oldy: 200
})

var sticks = []
sticks.push({
    p0: points[0],
    p1: points[1],
    length: distance(points[0], points[1])
})
sticks.push({
    p0: points[2],
    p1: points[3],
    length: distance(points[2], points[3])
})
sticks.push({
    p0: points[0],
    p1: points[2],
    length: distance(points[0], points[2])
})
sticks.push({
    p0: points[1],
    p1: points[3],
    length: distance(points[1], points[3])
})
sticks.push({
    p0: points[0],
    p1: points[3],
    length: distance(points[0], points[3])
})


var dampening = 0.9 // This is how much energy is preserved in the bounce. 1 = 100%, 0.9 = 90% and so on...
var friction = 0.999 // This is how much energy is preserved after friction / air resistance.
var planarFriction = 0.6
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
            // Y FRICTION
            vy = (p.y - p.oldy) * planarFriction
            p.oldy = p.y
            p.y += vy
        }
        else if (p.x <= 0){
            vx = p.x - p.oldx
            p.x = 0
            p.oldx = p.x + vx * dampening
            // Y FRICTION
            vy = (p.y - p.oldy) * planarFriction
            p.oldy = p.y
            p.y += vy
        }
        // Y screen constraints
        else if (p.y >= height){
            vy = p.y - p.oldy
            p.y = height
            p.oldy = p.y + vy * dampening
            // X FRICTION
            vx = (p.x - p.oldx) * planarFriction
            p.oldx = p.x
            p.x += vx
        }
        else if (p.y <= 0){
            vy = p.y - p.oldy
            p.y = 0
            p.oldy = p.y + vy * dampening
            // X FRICTION
            vx = (p.x - p.oldx) * planarFriction
            p.oldx = p.x
            p.x += vx
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
    let maxIterations = 99999
    for (i = 0; i < maxIterations; i++){
        updateSticks()
        constrainPoints()
    }
    renderPoints()
    renderSticks()
    requestAnimationFrame(update)
}

}