    function draw() {
        var ddays = jdn2ndn(t);
        var ddayscor = ddays;
        var prectab = ddayscor / cent;
        var mlong = degmod(mlong0 + ddayscor * nlong);
        var anom = degmod(manom0 + ddayscor * nanom);
        var apogee = degmod(mlong - anom);
        var latarg = degmod(latarg0 + ddayscor * nlatarg);
        var tlong = degmod(mlong - latarg - 90);
        var melong = degmod(melong0 + ddayscor * nelong);

        var esin = ecc * sind(2 * melong);
        var ecos = ecc * cosd(2 * melong);
        var oc = ecos + sqrt(1 - esin * esin);
        var pros = atand(esin / (oc + ecos));
        var tanom = degmod(anom + pros);
        var fsin = epi * sind(tanom);
        var fcos = epi * cosd(tanom);
        var eqmo = atand(fsin / (oc + fcos));

        var tlong = degmod(mlong - eqmo);
        var mlongsu = degmod(mlongsu0 + ddays * nsulong);
        var apogeesu = apogeesu0;
        var manomsu = degmod(mlongsu - apogeesu);
        var eqsu = atand2(eccsu * sind(manomsu), 1 + eccsu * cosd(manomsu));
        var tanomsu = degmod(manomsu - eqsu);
        var tlongsu = degmod(mlongsu - eqsu);
        var elong = degmod(tlong - tlongsu + 180) - 180;

        var Ox = x0; // put the Earth at the center of the stage
        var Oy = y0;
        esin = ecc * rescale * sind(mlongsu - melong);
        ecos = ecc * rescale * cosd(mlongsu - melong);
        var Dx = Ox + ecos; // offset the deferent by the eccentricity e
        var Dy = Oy - esin;
        var Ex = Ox - ecos; // offset the equant by another step in e
        var Ey = Oy + esin;
        var Cx = Ox + oc * rescale * cosd(mlong); //locate the (moving) center of the epicycle on the deferent
        var Cy = Oy - oc * rescale * sind(mlong);
        Px = Cx + epi * rescale * cosd(mlong - tanom); // locate the position of Mars on the epicycle
        Py = Cy - epi * rescale * sind(mlong - tanom);
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
        elonger.innerHTML = elongation_text + ": " + elong.toFixed(1) + 'º';

        ctx.clearRect(0, 0, sWidth, sHeight); // clear canvas

        //Moon phases
        ctx.fillStyle = moon_style;
        var r = moon_rad;
        if (sWidth <= 480) r = moon_small;
        if (sWidth <= 230) r = moon_tiny;
        if (elong < 0) {
            ctx.beginPath();
            ctx.arc(sWidth - r - 1, r + 1, r, 0.5 * Math.PI, 1.5 * Math.PI, false);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(sWidth - r - 1, r + 1, r, 1.5 * Math.PI, 0.5 * Math.PI, false);
            ctx.fill();
        }
        ctx.fillStyle = moon_style;
        if (elong < 90)
            if (elong > -90) ctx.fillStyle = "black";
        var rr = r * cosd(elong);
        if (rr < 0) rr = -rr;
        ctx.beginPath();
        ctx.ellipse(sWidth - r - 1, r + 1, rr, r, 0, Math.PI * 2, false);
        ctx.fill();


        //draw the circles
        ctx.strokeStyle = def_style;
        ctx.beginPath();
        ctx.arc(Ox, Oy, ecc * rescale, 0, Math.PI * 2, false);
        ctx.stroke();
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

        //lines
        ctx.strokeStyle = rad_style;
        ctx.beginPath();
        ctx.moveTo(Dx, Dy);
        ctx.lineTo(Ex, Ey);
        ctx.moveTo(Cx, Cy);
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