    function oninfo() {
        document.getElementById("overlay").style.display = "block";
    }

    function offinfo() {
        document.getElementById("overlay").style.display = "none";
    }

    function slider_input() {
        dd = parseInt(slider.value);
        if (dd == 0) stop();
        else start(dd);
    }

    function trailer_input() {
        tt = parseInt(trailer.value);
        if (tt == 0) stoptrail();
        else starttrail(tt);
    }

    function dayer_change() {
        trailon = 0;
        traillen = 0;
        trailer.value = 0;
        trailx.length = 0;
        traily.length = 0;
        t = parseInt(dayer.value);
        draw();
    }

    function year_change() {
        trailon = 0;
        traillen = 0;
        trailer.value = 0;
        trailx.length = 0;
        traily.length = 0;
        var y = parseInt(date_year.value);
        var m = parseInt(date_month.value);
        var d = parseInt(date_day.value);
        t = date2jdn(y, m, d);
        dayer.value = t;
        draw();
    }

    function month_change() {
        trailon = 0;
        traillen = 0;
        trailer.value = 0;
        trailx.length = 0;
        traily.length = 0;
        var y = parseInt(date_year.value);
        var m = parseInt(date_month.value);
        var d = parseInt(date_day.value);
        t = date2jdn(y, m, d);
        dayer.value = t;
        draw();
    }

    function day_change() {
        trailon = 0;
        traillen = 0;
        trailer.value = 0;
        trailx.length = 0;
        traily.length = 0;
        var y = parseInt(date_year.value);
        var m = parseInt(date_month.value);
        var d = parseInt(date_day.value);
        t = date2jdn(y, m, d);
        dayer.value = t;
        draw();
    }

    function keyb(e) {
        if (e.keyCode == 73) oninfo();
        else offinfo();
        if (e.keyCode == 32) startstop();
        if (e.keyCode == 84) trail();
        if (e.keyCode == 65) {
            slider.value--;
            slider.oninput();
        }
        if (e.keyCode == 83) {
            slider.value++;
            slider.oninput();
        }
        if (e.keyCode == 88) {
            trailer.value = parseInt(trailer.value) + dtrail;
            trailer.oninput();
        }
        if (e.keyCode == 90) {
            trailer.value = parseInt(trailer.value) - dtrail;
            trailer.oninput();
        }
    }

    function trail() {
        if (trailon == 0) starttrail(trail0);
        else stoptrail();
    }

    function starttrail(tt) {
        trailon = 1;
        traillen = tt;
        trailer.value = tt;
        draw();
    }

    function stoptrail() {
        trailon = 0;
        traillen = 0;
        trailer.value = 0;
        draw();
    }

    function startstop() {
        //     	canvas.style.left = "10px";
        //     	canvas.style.position = "absolute";
        if (ring == 0) start(dt0s);
        else stop();
    }

    function start(dd) {
        dt = dd * ddt;
        slider.value = dd;
        if (ring == 0) timer = window.setInterval(drawplus, speed);
        ring = 1;
    }

    function stop() {
        ring = 0;
        dt = 0;
        slider.value = 0;
        window.clearInterval(timer);
    }

    function resize() {
        var cHeight = document.documentElement.clientHeight;
        var cWidth = document.documentElement.clientWidth;
        var oWidth = sWidth;
        sWidth = cWidth;
        sHeight = cHeight;
        sHeight -= vpadding;
//        if (sWidth > 650) sWidth = 650;
//        if (sHeight > 650) sHeight = 650;
        sWidth = Math.min(sWidth, sHeight);
        sHeight = sWidth;
        var kk = sWidth / oWidth;
        ctx.canvas.width = sWidth;
        ctx.canvas.height = sHeight;
        var dx = sWidth / 2 - x0;
        var dy = sHeight / 2 - y0;
        x0 += dx;
        y0 += dy;

        var tmp = x0 * 0.99;
        if (tmp < 2) tmp = 2;
        if (tmp > 5) tmp = 5;
        rescale = (x0 - tmp) / Rcosmos;
        document.getElementById('SLIDER1').setAttribute("style", "width:" + sWidth + "px");
        document.getElementById('SLIDER1').style.width = '' + sWidth + 'px';
        document.getElementById('SLIDER2').setAttribute("style", "width:" + sWidth + "px");
        document.getElementById('SLIDER2').style.width = '' + sWidth + 'px';
        document.getElementById('TEXT1').setAttribute("style", "width:" + sWidth + "px");
        document.getElementById('TEXT1').style.width = '' + sWidth + 'px';
        document.getElementById('TEXT2').setAttribute("style", "width:" + sWidth + "px");
        document.getElementById('TEXT2').style.width = '' + sWidth + 'px';
        document.getElementById('CCONT').setAttribute("style", "width:" + sWidth + "px");
        document.getElementById('CCONT').style.width = '' + sWidth + 'px';
        document.getElementById('CCONT').setAttribute("style", "height:" + sHeight + "px");
        document.getElementById('CCONT').style.height = '' + sHeight + 'px';

        for (i = 0; i<trailx.length; i++) {
            trailx[i] *= kk;
            traily[i] *= kk;
        }
        if (ring == 0) draw();
    }

    function resizedraw() {
        resize();
        draw();
    }

    function init() {
        resize();
        var today = new Date();
        date_day.value = today.getDate();
        date_month.value = today.getMonth() + 1; //January is 0!
        date_year.value = today.getFullYear();
        t = date2jdn(today.getFullYear(), today.getMonth() + 1, today.getDate());
        dayer.value = t;
        ring = 0;
        dt = 0;
        slider.max = dtmax * sscale;
        slider.min = -dtmax * sscale;
        slider.value = dt * sscale;
        trailer.max = trailermax;
        trailer.value = traillen;

        document.addEventListener("keydown", keyb)
        window.addEventListener("orientationchange", resize, false);
        window.addEventListener("resize", resize, false);
        draw();
    }

    function drawplus() {
        draw();
        t += dt;
        trailx.push(Px);
        traily.push(Py);
        if (trailx.length > trailmax) {
            trailx.splice(0, trailx.length - traillen);
            traily.splice(0, traily.length - traillen);
        }
    }