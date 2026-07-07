    function draw() {
        var ddays = jdn2ndn(t);
        var prectab = ddays / cent;
        var apogeesu = degmod(apogeesu0 + ddays * napogeesu / cent);
        var mlongsu = degmod(mlongsu0 + ddays * nsulong);
        var manomsu = degmod(mlongsu - apogeesu);
        var eqsu = atand(eccsu * sind(manomsu) / (1 + eccsu * cosd(manomsu)));
        var tanomsu = degmod(manomsu - eqsu);
        var tlongsu = degmod(mlongsu - eqsu);

        var Ox = x0; // put the Earth at the center of the stage
        var Oy = y0;
        var Dx = Ox + eccsu * rescale * cosd(apogeesu); // offset the deferent by the eccentricity e
        var Dy = Oy - eccsu * rescale * sind(apogeesu);
        Px = Dx + rescale * cosd(mlongsu); // locate the position of Sun
        Py = Dy - rescale * sind(mlongsu);
        var MSx = Ox + Rcosmos * rescale * cosd(mlongsu); //locate a position of the mean sun
        var MSy = Oy - Rcosmos * rescale * sind(mlongsu);
        var PPx = Ox + Rcosmos * rescale * cosd(tlongsu);
        var PPy = Oy - Rcosmos * rescale * sind(tlongsu);

        dayer.value = t;
        var dat = {};
        jdn2date(t, dat)
        date_year.value = dat.year;
        date_month.value = dat.month;
        date_day.value = dat.day;
        longer.innerHTML = longitude_text + ": " + tlongsu.toFixed(1) + 'º';

        ctx.clearRect(0, 0, sWidth, sHeight); // clear canvas

        //draw the "deferent" circle
        ctx.strokeStyle = def_style;
        ctx.beginPath();
        ctx.arc(Dx, Dy, 1 * rescale, 0, Math.PI * 2, false);
        ctx.stroke();
        
        //celestial sphere
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

        //line from the equant, to the center of the deferent to the Sun
        ctx.strokeStyle = rad_style;
        ctx.beginPath();
        ctx.moveTo(Dx, Dy);
        ctx.lineTo(Px, Py);
        ctx.stroke();

        //Earth
        ctx.fillStyle = earth_style;
        ctx.beginPath();
        ctx.arc(Ox, Oy, earth_rad, 0, Math.PI * 2, false);
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

        //Sun
        ctx.fillStyle = pla_style;
        ctx.beginPath();
        ctx.arc(Px, Py, pla_rad, 0, Math.PI * 2, false);
        ctx.fill();

        //Sun projection on the celestial sphere
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