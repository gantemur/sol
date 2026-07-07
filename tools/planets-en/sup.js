    function draw() {
        var ddays = jdn2ndn(t);
        var ddayscor = ddays;
        var prectab = ddayscor / cent;
        var apogee = degmod(apogee0 + prectab);
        var mepi = degmod(epi0 + ddayscor * nlong);
        var mepianom = degmod(epianom0 + ddayscor * nepianom);
        var meccanom = degmod(mepi - apogee);

        var esin = ecc * sind(meccanom);
        var ecos = ecc * cosd(meccanom);
        var a = ecos + sqrt(1 - esin * esin);
        var l = a - ecos - ecos;
        var pros = -atand2(2 * esin, a);

        var b = sqrt(a * a + 4 * esin * esin);
        var fsin = epi * sind(mepianom - pros);
        var fcos = epi * cosd(mepianom - pros);
        var eqa = atand2(fsin, b + fcos);

        var tlong = degmod(mepi + pros + eqa);

        var mlongsu = degmod(mlongsu0 + ddays * nsulong);


        var Ox = x0; // put the Earth at the center of the stage
        var Oy = y0;
        ecos = ecc * rescale * cosd(apogee);
        esin = ecc * rescale * sind(apogee);
        var Dx = Ox + ecos; // offset the deferent by the eccentricity e
        var Dy = Oy - esin;
        var Ex = Dx + ecos; // offset the equant by another step in e
        var Ey = Dy - esin;
        var Cx = Ex + l * rescale * cosd(mepi); //locate the (moving) center of the epicycle on the deferent
        var Cy = Ey - l * rescale * sind(mepi);
        Px = Cx + epi * rescale * cosd(mepi + mepianom); // locate the position of Mars on the epicycle
        Py = Cy - epi * rescale * sind(mepi + mepianom);
        var MSx = Ox + Rcosmos * rescale * cosd(mlongsu); //locate a position of the mean sun
        var MSy = Oy - Rcosmos * rescale * sind(mlongsu);
        var PPx = Ox + Rcosmos * rescale * cosd(tlong);
        var PPy = Oy - Rcosmos * rescale * sind(tlong);

        dayer.value = t;
        var dat = {};
        jdn2date(t, dat)
        date_year.value = dat.year;
        date_month.value = dat.month;
        date_day.value = dat.day;
        longer.innerHTML = longitude_text + ": " + tlong.toFixed(1) + 'º';

        ctx.clearRect(0, 0, sWidth, sHeight); // clear canvas

        //draw the deferent circle and the epicycle
        ctx.strokeStyle = def_style;
        ctx.beginPath();
        ctx.arc(Dx, Dy, 1 * rescale, 0, Math.PI * 2, false);
        ctx.stroke();
        ctx.strokeStyle = epi_style;
        ctx.beginPath();
        ctx.arc(Cx, Cy, epi * rescale, 0, Math.PI * 2, false);
        ctx.stroke();

        ctx.strokeStyle = cos_style;
        ctx.beginPath();
        ctx.arc(Ox, Oy, Rcosmos * rescale, 0, Math.PI * 2, false);
        ctx.stroke();

        //line from the earth to the mean Sun
        //    ctx.strokeStyle = 'rgba(255, 255, 0, .6)';
        //    ctx.beginPath();
        //  	ctx.moveTo(Ox, Oy); 
        //		ctx.lineTo(MSx, MSy);
        //    ctx.stroke();

        //line from the equant, to the center of the epicycle, and finally to the planet
        ctx.strokeStyle = rad_style;
        ctx.beginPath();
        ctx.moveTo(Ex, Ey);
        ctx.lineTo(Cx, Cy);
        ctx.lineTo(Px, Py);
        ctx.stroke();

        //Earth
        ctx.fillStyle = earth_style;
        ctx.beginPath();
        ctx.arc(Ox, Oy, earth_rad, 0, Math.PI * 2, false);
        ctx.fill();

        //Equant
        ctx.fillStyle = equ_style;
        ctx.beginPath();
        ctx.arc(Ex, Ey, equ_rad, 0, Math.PI * 2, false);
        ctx.fill();

        //Deferent center
        ctx.fillStyle = cen_style;
        ctx.beginPath();
        ctx.arc(Dx, Dy, cen_rad, 0, Math.PI * 2, false);
        ctx.fill();

        //Trail
        opp = 1;
        if (traillen > 0) dopp = 0.7 / traillen;
        else dopp = 1;
        n0 = trailx.length - traillen;
        if (n0 < 0) n0 = 0;
        if (trailon == 1)
            for (i = trailx.length - 1; i > n0; i--) {
                ctx.fillStyle = trl_style + opp + ')';
                ctx.beginPath();
                ctx.arc(trailx[i], traily[i], trl_rad, 0, Math.PI * 2, false);
                ctx.fill();
                opp -= dopp;
            }

        //Epicycle center
        ctx.fillStyle = epc_style;
        ctx.beginPath();
        ctx.arc(Cx, Cy, epc_rad, 0, Math.PI * 2, false);
        ctx.fill();

        //Mars
        ctx.fillStyle = pla_style;
        ctx.beginPath();
        ctx.arc(Px, Py, pla_rad, 0, Math.PI * 2, false);
        ctx.fill();

        //Mars projection on the celestial sphere
        ctx.fillStyle = plp_style;
        ctx.beginPath();
        ctx.arc(PPx, PPy, plp_rad, 0, Math.PI * 2, false);
        ctx.fill();

        //Mean sun projection on the celestial sphere
        ctx.fillStyle = sun_style;
        ctx.beginPath();
        ctx.arc(MSx, MSy, sun_rad, 0, Math.PI * 2, false);
        ctx.fill();

    }