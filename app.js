ctx = document.getElementById("canvas").getContext('2d');

let drawCircle = (x, y, r) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
};

points = [];

NUMPOINTS = 16;
RADIUS = 20;
CLICKRADIUS = 22;
FRAMERATE = 60.0;
W = 400;
H = 400;

let SPEEDLIMIT = 5;
let FRICTION = 0;
let BOUNCE = 0.8;
let mouseX = 0, mouseY = 0;
let successClicks = 0;
let clicks = 0;

let init = () => {
    for (let i = 0; i < NUMPOINTS; i++) {
        points.push({
            x: Math.random() * W,
            y: Math.random() * H,
            dx: 0,
            dy: 0,
            clicked: false,
            finalX: ((i % 4) + 1) * 80,
            finalY: (Math.floor(i / 4) + 1) * 80
        });
    }

    document.getElementById("canvas").addEventListener('mousemove', (evt) => {
        mouseX = evt.clientX - canvas.getBoundingClientRect().left;
        mouseY = evt.clientY - canvas.getBoundingClientRect().top;
    }, false);

    document.getElementById("canvas").addEventListener('mousedown', (evt) => {
        click(evt);
    }, false);
};

let click = (evt) => {
    for (point of points) {
        if (!point.clicked) {
            mx = evt.clientX - canvas.getBoundingClientRect().left;
            my = evt.clientY - canvas.getBoundingClientRect().top;
            r = Math.sqrt((mx - point.x) * (mx - point.x) + (my - point.y) * (my - point.y));
            if (r <= CLICKRADIUS) {
                successClicks++;
                point.clicked = true;
            }
        }
    }
    clicks++;
    document.getElementById('numclicks').innerHTML = successClicks + '/' + clicks;
};

let loop = () => {
    let force_func = (r) => {
        return Math.pow(1.05, r);
    }

    for (point of points) {

        if (point.clicked) {
            point.x += (point.finalX - point.x) * 0.1;
            point.y += (point.finalY - point.y) * 0.1;
        }
        else {
            // force from other points
            for (otherpoint of points) {
                let r2 = (point.x - otherpoint.x) * (point.x - otherpoint.x) + (point.y - otherpoint.y) * (point.y - otherpoint.y);
                if (r2 == 0) r2 = 0.01;

                let r = Math.sqrt(r2);

                let f = 5.0 / force_func(r);

                let f_x = f * (point.x - otherpoint.x) / r;
                let f_y = f * (point.y - otherpoint.y) / r;

                point.dx += f_x;
                point.dy += f_y;
            }

            // force from mouse
            let r2 = (point.x - mouseX) * (point.x - mouseX) + (point.y - mouseY) * (point.y - mouseY);
            if (r2 == 0) r2 = 0.01;
            let r = Math.sqrt(r2);

            let f = 5.0 / force_func(r);

            let f_x = f * (point.x - mouseX) / r;
            let f_y = f * (point.y - mouseY) / r;

            point.dx += f_x;
            point.dy += f_y;

            // attraction force towards center

            point.dx += 0.005 * ((0.5 * W) - point.x);
            point.dy += 0.005 * ((0.5 * H) - point.y);

            if (point.dx > SPEEDLIMIT)
                point.dx = SPEEDLIMIT;
            if (point.dx < -SPEEDLIMIT)
                point.dx = -SPEEDLIMIT;
            if (point.dy > SPEEDLIMIT)
                point.dy = SPEEDLIMIT;
            if (point.dy < -SPEEDLIMIT)
                point.dy = -SPEEDLIMIT;

            point.x += point.dx;
            point.y += point.dy;

            // bounds
            if (point.x < 0) {
                point.x = 0;
                point.dx *= -BOUNCE;
            }
            if (point.x > W) {
                point.x = W;
                point.dx *= -BOUNCE;
            }
            if (point.y < 0) {
                point.y = 0;
                point.dy *= -BOUNCE;
            }
            if (point.y > H) {
                point.y = H;
                point.dy *= -BOUNCE;
            }
        }
    }
};
let draw = () => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);
    
    ctx.fillStyle = "#ff0000";
    for (point of points) {
        if (point.clicked)
            drawCircle(point.x, point.y, RADIUS);
    }
    ctx.fillStyle = "#000000";
    for (point of points) {
        if (!point.clicked)
            drawCircle(point.x, point.y, RADIUS);
    }
};

init();
setInterval(
    () => {
        loop();
        draw();
    },
    1000 / FRAMERATE);