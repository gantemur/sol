function setskip() {
    skip = 20;
    wavlen = 15;
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

function buttoncolors() {
    if (wave) document.getElementById('WAVE').style.backgroundColor = "#0000FF";
    else document.getElementById('WAVE').style.backgroundColor = "#000000";
    if (wind) document.getElementById('WIND').style.backgroundColor = "#0000FF";
    else document.getElementById('WIND').style.backgroundColor = "#000000";
    if (energy==0) {
        document.getElementById('TEMPN').style.backgroundColor = "#0000FF";
        document.getElementById('TEMPH').style.backgroundColor = "#000000";
        document.getElementById('TEMPL').style.backgroundColor = "#000000";
    }
    if (energy==1) {
        document.getElementById('TEMPH').style.backgroundColor = "#0000FF";
        document.getElementById('TEMPN').style.backgroundColor = "#000000";
        document.getElementById('TEMPL').style.backgroundColor = "#000000";
    }
    if (energy==-1) {
        document.getElementById('TEMPL').style.backgroundColor = "#0000FF";
        document.getElementById('TEMPN').style.backgroundColor = "#000000";
        document.getElementById('TEMPH').style.backgroundColor = "#000000";
    }
    if (expanse==0) {
        document.getElementById('SCALEN').style.backgroundColor = "#0000FF";
        document.getElementById('SCALEH').style.backgroundColor = "#000000";
        document.getElementById('SCALEL').style.backgroundColor = "#000000";
    }
    if (expanse==1) {
        document.getElementById('SCALEH').style.backgroundColor = "#0000FF";
        document.getElementById('SCALEN').style.backgroundColor = "#000000";
        document.getElementById('SCALEL').style.backgroundColor = "#000000";
    }
    if (expanse==-1) {
        document.getElementById('SCALEL').style.backgroundColor = "#0000FF";
        document.getElementById('SCALEN').style.backgroundColor = "#000000";
        document.getElementById('SCALEH').style.backgroundColor = "#000000";
    }
}

function templ() {
    energy = -1;
    vmax = vmaxl;
    buttoncolors();
}

function tempn() {
    vmax = vmaxn;
    if (energy<0) heating();
    energy = 0;
    buttoncolors();
}

function temph() {
    vmax = vmaxh;
    if (energy<1) heating();
    energy = 1;
    buttoncolors();
}

function scalen() {
    expanse = 0;
    rescale = 1;
    buttoncolors();
    if (ring==0) draw();
}

function scalel() {
    expanse = -1;
    rescale = 0.6;
    buttoncolors();
    if (ring==0) draw();
}

function scaleh() {
    expanse = 1;
    rescale = 1.6;
    buttoncolors();
    if (ring==0) draw();
}

function windn() {
    windd = 1;
    wind = 1 - wind;
    oring = ring;
    beginning = 0;
    if (wind) {    
        torus = 1;
        if (wave) beginning=1;
        wave = 0;
    }
    buttoncolors();
    if (beginning) {
        restart();
        if (oring) start();
    }
}

function waven() {
    wave = 1 - wave;
    oring = ring;
    beginning = 0;
    if (wave) {
        t = 0;
        torus = 0;
        if (windd) beginning=1;
        wind = 0;
    } else beginning=1;
    buttoncolors();
    if (beginning) {
        windd = 0;
        restart();
        if (oring) start();
    }
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
//    rescale = sWidth / width;
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
    document
        .getElementById('TEXT3')
        .setAttribute("style", "width:" + sWidth + "px");
    document
        .getElementById('TEXT3')
        .style
        .width = '' + sWidth + 'px';

    if (ring == 0) 
        draw();
    }

function resizedraw() {
    resize();
    draw();
}

function heating() {
    for (i = 0; i < n1; i++) {
        for (j = 0; j < n2; j++) vxd[i][j]=Math.random()*vmax;
        for (j = 0; j < n2; j++) vyd[i][j]=Math.random()*vmax;
    }
}

function init() {
    ring = 0;

    for (i = 0; i < n1; i++) {
        xm[i] = [];
        for (j = 0; j < n2; j++) xm[i][j]=hh*j+hh2;
        ym[i] = [];
        for (j = 0; j < n2; j++) ym[i][j]=hh*i+hh2;
        vxm[i] = [];
        for (j = 0; j < n2; j++) vxm[i][j]=0;
        vym[i] = [];
        for (j = 0; j < n2; j++) vym[i][j]=0;
        xd[i] = [];
        for (j = 0; j < n2; j++) xd[i][j]=Math.random()*rmax;
        yd[i] = [];
        for (j = 0; j < n2; j++) yd[i][j]=Math.random()*rmax;
        vxd[i] = [];
        for (j = 0; j < n2; j++) vxd[i][j]=Math.random()*vmax*vink;
        vyd[i] = [];
        for (j = 0; j < n2; j++) vyd[i][j]=Math.random()*vmax*vink;
    }

    setskip();
    buttoncolors();

    document.addEventListener("keydown", keyb)
    window.addEventListener("orientationchange", resize, false);
    window.addEventListener("resize", resize, false);
    resize();

}

function restart() {
    stop();

    init();
    
    draw();
}

function pulse(t) {
    if (t<3*dt) return 50;
    else return 0;
}

function sinusoid(t) {
    return 20*Math.sin(t*3);
}

function drawplus() {
    t += dt;
    var x1,x2,y1,y2,dmean,dx,dy;
    for(i=0;i<n1;i++)
        for(j=0;j<n2;j++) {
            if (wind) {
                xm[i][j] += windx*dt;
                ym[i][j] += windy*dt;
            } else  if (wave) {
                if (j==0) x1=-hh2+sinusoid(t); else x1=xm[i][j-1];
                if (j==n2-1) x2=xbox+hh2; else x2=xm[i][j+1];
//                if (i==0) if (j==0) x1=-hh2+30*Math.sin(t*8);
                dmean =  x1+x2-2*xm[i][j];
                dx = xm[i][j] - (hh*j+hh2);
                if (Math.abs(dx)>rrmax) vxm[i][j] -= vxm[i][j]*fric;
                if (j>pml) vxm[i][j] -= vxm[i][j]*(j-pml)*pmlf*dt;
                vxm[i][j] += klong*dmean*dt;
                xm[i][j] += vxm[i][j]*dt;
                if (i==0) y1=-hh2; else y1=ym[i-1][j];
                if (i==n1-1) y2=ybox+hh2; else y2=ym[i+1][j];
                dmean = y1+y2-2*ym[i][j];
                dy = ym[i][j] - (hh*i+hh2);
                if (Math.abs(dy)>rrmax) vym[i][j] -= vym[i][j]*fric;
                vym[i][j] += klong*dmean*dt;
                ym[i][j] += (windy + vym[i][j])*dt;    
            }
            vxd[i][j] -= kk*xd[i][j]*dt*(1+xd[i][j]*xd[i][j]);
            if (Math.abs(vxd[i][j]) > vmax) vxd[i][j] -= fric*vxd[i][j]
            vyd[i][j] -= kk*yd[i][j]*dt*(1+yd[i][j]*yd[i][j]);
            if (Math.abs(vyd[i][j]) > vmax) vyd[i][j] -= fric*vyd[i][j]
            xd[i][j] += vxd[i][j]*dt;
            yd[i][j] += vyd[i][j]*dt;
    }

    draw();

}

function draw() {

    var x,y;
    ctx.clearRect(0, 0, sWidth, sHeight); // clear canvas

    for(i=0;i<n1;i++)
        for(j=0;j<n2;j++) {
            x = xm[i][j] + xd[i][j];
            y = ym[i][j] + yd[i][j];
            if (torus) {
                x = x % xbox;
                if (x < 0) x += xbox;
                y = y % ybox;
                if (y < 0) y += xbox;
            }
            ctx.fillStyle = emi_style;
            ctx.beginPath();
            ctx.arc(rescale*x, rescale*y, emi_rad, 0, Math.PI * 2, false);
            ctx.fill();    
    }
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
