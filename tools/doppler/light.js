function setskip() {
    skip = 20;
    wavlen = 15;
}

function speed_change() {
    v = parseInt(speeder.value);
    beta = v / c;
    gamma = 1 / Math.sqrt(1 - beta * beta);
    setskip();
    draw();
}

function nm_change() {
    nm = parseInt(nmer.value);
    emi_style = nm2color(nm)[0];
    draw();
}

function keyb(e) {
    if (e.keyCode == 32) 
        startstop();
    if (e.keyCode == 82) 
        restart();
    if (e.keyCode == 77) 
        mute();
    }

function startstop() {
    //     	canvas.style.left = "10px";     	canvas.style.position = "absolute";
    if (ring == 0) 
        start();
    else 
        stop();
    }

function start() {
    if (ring == 0) 
        timer = window.setInterval(drawplus, speed);
    ring = 1;
}

function stop() {
    ring = 0;
    window.clearInterval(timer);
}

function resize() {
    var cHeight = document.documentElement.clientHeight;
    var cWidth = document.documentElement.clientWidth;
    var oWidth = sWidth;
    sWidth = cWidth;
    sHeight = cHeight;
    sHeight -= vpadding;
    // if (sWidth > 650) sWidth = 650;        if (sHeight > 650) sHeight = 650;
    // sWidth = Math.min(sWidth, sHeight);        sHeight = sWidth;
    ctx.canvas.width = sWidth;
    ctx.canvas.height = sHeight;
    rescale = sWidth / width;
    x0 = sWidth / 2;
    y0 = sHeight / 2;
    document
        .getElementById('TEXT1')
        .setAttribute("style", "width:" + sWidth + "px");
    document
        .getElementById('TEXT1')
        .style
        .width = '' + sWidth + 'px';
    document
        .getElementById('TEXT2')
        .setAttribute("style", "width:" + sWidth + "px");
    document
        .getElementById('TEXT2')
        .style
        .width = '' + sWidth + 'px';

    if (ring == 0) 
        draw();
    }

function resizedraw() {
    resize();
    draw();
}

function init() {
    ring = 0;
    speeder.value = v;
    nmer.value = nm;

    setskip();

    document.addEventListener("keydown", keyb)
    window.addEventListener("orientationchange", resize, false);
    window.addEventListener("resize", resize, false);
    resize();

}

function restart() {
    stop();

    Ex = -width / 2;
    Ey = 0;
    t = 0;
    steps = 0;
    wavt = [];
    wavx = [];
    wavy = [];
    wavcnt = 0;

    draw();
}

function drawplus() {
    t += dt;
    Ex += v * dt;
    if (Ex * 2 > width) {
        stop();
        return;
    }

    //Waves
    var cnt = 0;
    var r,
        rr;
    //        n0 = wavx.length - wavlen;        if (n0 < 0) n0 = 0;
    for (i = wavx.length - 1; i > 0; i--) {
        r = (t - wavt[i]) * c;
        rr = (wavx[i] - Rx) * (wavx[i] - Rx) + (wavy[i] - Ry) * (wavy[i] - Ry);
        if (r * r > rr) 
            cnt += 1;
        }
    amp = cnt - wavcnt;
    if (amp < 0) 
        amp = 0;
    wavcnt = cnt;

    draw();

    steps += 1;
    if ((steps - 1) % skip) 
        return;
    wavt.push(t);
    wavx.push(Ex);
    wavy.push(Ey);
    if (wavx.length > wavmaxlen) {
        wavx.splice(0, wavx.length - wavlen);
        wavy.splice(0, wavy.length - wavlen);
        wavt.splice(0, wavt.length - wavlen);
    }
}

function draw() {

    ctx.clearRect(0, 0, sWidth, sHeight); // clear canvas

    //Emitter
    ctx.fillStyle = emi_style;
    ctx.beginPath();
    ctx.arc(x0 + Ex * rescale, y0 + Ey * rescale, emi_rad, 0, Math.PI * 2, false);
    ctx.fill();

    //Waves
    n0 = wavx.length - wavlen;
    if (n0 < 0) 
        n0 = 0;
    ctx.lineWidth = 5;
    for (var theta = 0; theta < ppi; theta += dtheta) {
        var cosine = Math.cos(theta);
        var ll = nm * gamma * (1 - beta * cosine);
        var s = nm2color(ll);
        var st = 'rgba(' + s[1] * 100 + '%,' + s[2] * 100 + '%,' + s[3] * 100 + '%,';
        var opp = s[4];
        var dopp,
            r;
        if (wavlen > 0) 
            dopp = opp / wavlen;
        else 
            dopp = 1;
        for (i = wavx.length - 1; i > n0; i--) {
            r = (t - wavt[i]) * c;
            ctx.strokeStyle = st + opp + ')';
            ctx.beginPath();
            ctx.arc(
                x0 + wavx[i] * rescale,
                y0 + wavy[i] * rescale,
                r * rescale,
                theta,
                theta + dtheta,
                false
            );
            ctx.stroke();
            opp -= dopp;
        }
    }

    //Reciever
    var dr = 0;
    if (amp > 0) {
        dr = 3;
        ctx.fillStyle = rec_style;
    } else 
        ctx.fillStyle = rec_style;
    ctx.beginPath();
    ctx.arc(
        x0 + Rx * rescale,
        y0 + Ry * rescale,
        rec_rad + dr,
        0,
        Math.PI * 2,
        false
    );
    ctx.fill();

}

// takes wavelength in nm and returns an rgba value
function nm2color(wl) {
    var r,
        g,
        b,
        alpha,
        colorSpace,
        gamma = 1;

    if (wl >= 380 && wl < 440) {
        R = -1 * (wl - 440) / (440 - 380);
        G = 0;
        B = 1;
    } else if (wl >= 440 && wl < 490) {
        R = 0;
        G = (wl - 440) / (490 - 440);
        B = 1;
    } else if (wl >= 490 && wl < 510) {
        R = 0;
        G = 1;
        B = -1 * (wl - 510) / (510 - 490);
    } else if (wl >= 510 && wl < 580) {
        R = (wl - 510) / (580 - 510);
        G = 1;
        B = 0;
    } else if (wl >= 580 && wl < 645) {
        R = 1;
        G = -1 * (wl - 645) / (645 - 580);
        B = 0.0;
    } else if (wl >= 645 && wl <= 780) {
        R = 1;
        G = 0;
        B = 0;
    } else {
        R = 0;
        G = 0;
        B = 0;
    }

    // intensty is lower at the edges of the visible spectrum.
    if (wl > 780 || wl < 380) {
        alpha = 0;
    } else if (wl > 700) {
        alpha = (780 - wl) / (780 - 700);
    } else if (wl < 420) {
        alpha = (wl - 380) / (420 - 380);
    } else {
        alpha = 1;
    }

    colorSpace = [
        "rgba(" + (
            R * 100
        ) + "%," + (
            G * 100
        ) + "%," + (
            B * 100
        ) + "%, " + alpha + ")",
        R,
        G,
        B,
        alpha
    ]
    // colorSpace is an array with 5 elements. The first element is the complete
    // code as a string. Use colorSpace[0] as is to display the desired color. use
    // the last four elements alone or together to access each of the individual r,
    // g, b and a channels.
    return colorSpace;
}