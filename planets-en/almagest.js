// Lunar, solar and planetary orbital constants adopted in Ptolemy's Almagest

// Sun

nsunlong  = Array(  0,59, 8,17,13,12,31);
mlongsun0 = Array(330,45, 0, 0, 0, 0, 0);
apogeesun = Array( 65,30, 0, 0, 0, 0, 0);
eccsun    = Array(  0, 2,30, 0, 0, 0, 0);
obliquity = Array( 23,51,20, 0, 0, 0, 0);
ptropsun  = Array(365,14,48, 0, 0, 0, 0);
rsun      = 1210;

// Moon

nlongmoon   = Array( 13,10,34,58,33,30,30);
nanommoon   = Array( 13, 3,53,56,17,51,59);
nlatargmoon = Array( 13,13,45,39,48,56,37);
nelongmoon  = Array( 12,11,26,41,20,17,59);
mlongmoon0  = Array( 41,22, 0, 0, 0, 0, 0);
manommoon0  = Array(268,49, 0, 0, 0, 0, 0);
latargmoon0 = Array(354,15, 0, 0, 0, 0, 0);
melongmoon0 = Array( 70,37, 0, 0, 0, 0, 0);
epimoon     = Array(  0, 6,20, 0, 0, 0, 0);  
eccmoon     = Array(  0,12,29, 0, 0, 0, 0);
incmoon     = Array(  5, 0, 0, 0, 0, 0, 0);
psynmoon    = Array( 29,31,50, 8,20, 0, 0);

// Saturn

nlongsat    = Array(  0, 2, 0,33,31,28,51);
nepianomsat = Array(  0,57, 7,43,41,43,40);
apogeesat0  = Array(224,10, 0, 0, 0, 0, 0);
episat      = Array(  0, 6,30, 0, 0, 0, 0);  
eccsat      = Array(  0, 3,25, 0, 0, 0, 0);
incsat0     = Array(  2,30, 0, 0, 0, 0, 0);
incsat1     = Array(  4,30, 0, 0, 0, 0, 0);
nodesat     = Array( 50, 0, 0, 0, 0, 0, 0);
rsat        = 17026;

// Jupiter

nlongjup    = Array(  0, 4,59,14,26,46,31);
nepianomjup = Array(  0,54, 9, 2,46,26, 0);
apogeejup0  = Array(152, 9, 0, 0, 0, 0, 0);
epijup      = Array(  0,11,30, 0, 0, 0, 0);
eccjup      = Array(  0, 2,45, 0, 0, 0, 0);
incjup0     = Array(  1,30, 0, 0, 0, 0, 0);
incjup1     = Array(  2,30, 0, 0, 0, 0, 0);
nodejup     = Array(340, 0, 0, 0, 0, 0, 0);
rjup        = 11503.5;

// Mars

nlongmar    = Array(  0,31,26,36,53,51,33);
nepianommar = Array(  0,27,41,40,19,20,58);
apogeemar0  = Array(106,40, 0, 0, 0, 0, 0);
epimar      = Array(  0,39,30, 0, 0, 0, 0);
eccmar      = Array(  0, 6, 0, 0, 0, 0, 0);
incmar0     = Array(  1, 0, 0, 0, 0, 0, 0);
incmar1     = Array(  2,15, 0, 0, 0, 0, 0);
nodemar     = Array(  0, 0, 0, 0, 0, 0, 0);
rmar        = 5040;

// Venus

nepianomven = Array(  0,36,59,25,53,11,28);
apogeeven0  = Array( 46,10, 0, 0, 0, 0, 0);
epiven      = Array(  0,43,10, 0, 0, 0, 0);
eccven      = Array(  0, 1,15, 0, 0, 0, 0);
incven0     = Array(  0,10, 0, 0, 0, 0, 0);
incven1     = Array(  2,30, 0, 0, 0, 0, 0);
incven2     = Array(  3,30, 0, 0, 0, 0, 0);
rven        = 622.5;

// Mercury

nepianommer = Array(  3, 6,24, 6,59,35,50);
apogeemer0  = Array(181,10, 0, 0, 0, 0, 0);
epimer      = Array(  0,22,30, 0, 0, 0, 0);
eccmer      = Array(  0, 3, 0, 0, 0, 0, 0);
incmer0     = Array(  0,45, 0, 0, 0, 0, 0);
incmer1     = Array(  6,15, 0, 0, 0, 0, 0);
incmer2     = Array(  7, 0, 0, 0, 0, 0, 0);
rmer        = 115;
  
//  DTR  --  Degrees to radians

function dtr(x){
  return (Math.PI*x)/180;
}

//  RTD  --  Radians to degrees

function rtd(x){
  return (180*x)/Math.PI;
}

//  DEGMOD  --  Range reduce angle in degrees

function degmod(x){
  return x-360*(Math.floor(x/360));
}

//  RADMOD  --  Range reduce angle in radians

function radmod(x){
  return x-(2*Math.PI)*(Math.floor(x/(2*Math.PI)));
}

//  ROUND --  Round to 5 significant decimals

function round(x,n){
  if(n == 1) f=10;
  if(n == 2) f=100;
  if(n == 3) f=1000;
  if(n == 4) f=10000;
  if(n == 5) f=100000;
  if(n == 6) f=1000000;
  return Math.round(f*x)/f;
}

//  SEX2DEC2 -- Converts sexagesimal notation into decimal notation

function sex2dec(s){
  d = 0;
  for(i=0;i<7;i++){
    d = s[6-i]+d/60;
  } 
  return d;
}

//  DEC2SEX --  Converts decimal notation into sexagesimal notation (dd;mm,ss)

function dec2sex(x){
    asign = " ";
    if(x < 0) asign = "-";
    s = abs(x);
    s0 = Math.floor(s);
    f = 60*(s-s0);
    s1 = Math.floor(f);
    s2 = Math.round(60*(f-s1));
    if(s2 == 60){
      s1 = s1+1;
      s2 = 0;
    }  
    if(s1 == 60){
      s0 = s0+1;
      s1 = 0;
    }  
    if(s1 < 10) s1 = "0"+s1;
    if(s2 < 10) s2 = "0"+s2;
    return asign+s0+";"+s1+","+s2;
}

//  DEC2SEX0 --  Converts decimal notation into sexagesimal notation (dd;mm,ss - disregards arithmetical sign)

function dec2sex0(x){
    s = abs(x);
    s0 = Math.floor(s);
    f = 60*(s-s0);
    s1 = Math.floor(f);
    s2 = Math.round(60*(f-s1));
    if(s2 == 60){
      s1 = s1+1;
      s2 = 0;
    }
    if(s1 == 60){
      s0 = s0+1;
      s1 = 0;
    }
    if(s1 < 10) s1 = "0"+s1;
    if(s2 < 10) s2 = "0"+s2;
    return s0+";"+s1+","+s2;
}

//  DEC2SEX1 --  Converts decimal notation into sexagesimal notation (dd;mm - disregards arithmetical sign)

function dec2sex1(x){
    s = Math.abs(x);
    s0 = Math.floor(s);
    s1 = Math.round(60.*(s-s0));
    if(s1 == 60){
      s0 = s0+1;
      s1 = 0;
    }
    if(s1 < 10) s1 = "0"+s1;
    if(s2 < 10) s2 = "0"+s2;
    return s0+";"+s1;
}

//  SIND  --  Sine of an angle in degrees

function sind(x){
    return Math.sin(dtr(degmod(x)));
}

//  COSD  --  Cosine of an angle in degrees

function cosd(x){
    return Math.cos(dtr(degmod(x)));
}

//  TAND  --  Tangent of an angle in degrees

function tand(x){
    return Math.tan(dtr(degmod(x)));
}

//  ASIND  --  Arc-sine with output angle in degrees

function asind(x){
    return rtd(Math.asin(x));
}

//  ATAND  --  Arc-tangent with output angle in degrees

function atand(x){
    return rtd(Math.atan(x));
}

//  ATAND2  --  Arc-tangent of a quotient with output angle in degrees

function atand2(x,y){
    return rtd(Math.atan2(x,y));
}

//  SQRT  --  Square root function

function sqrt(x){
    return Math.sqrt(x);
}

//  ABS  --  Absolute value function

function abs(x){
    return Math.abs(x);
}

//  SGN  -- Signum function

function sgn(x){
    asign = 0;
    if(x < 0) asign = -1;
    if(x > 0) asign = +1;
    return asign;
}

// Calculates the equation of centre (prosthaphairesis), equation of centre and the
// geocentric distance of Mercury

function eqme(n,ecc,epi,meccanom,mepianom){
  ecos = ecc*cosd(meccanom);
  esin = ecc*sind(meccanom);
  ecoscos = 2*ecc*cosd(meccanom/2)*cosd(3*meccanom/2);
  ecossin = 2*ecc*cosd(meccanom/2)*sind(3*meccanom/2);
  a = ecos+ecoscos+sqrt(1-ecossin*ecossin);
  pros = -atand(esin/a);
  b = sqrt(a*a+esin*esin);
  fcos = epi*cosd(mepianom-pros); 
  fsin = epi*sind(mepianom-pros);
  eq = atand(fsin/(b+fcos));
  gcos = ecc*(cosd(meccanom)+cosd(2*meccanom));
  gsin = ecc*(sind(meccanom)+sind(2*meccanom));
  pp = sqrt(1-gsin*gsin)+gcos;
  qq = sqrt(pp*pp+ecc*ecc+2*ecc*pp*cosd(meccanom));
  px = qq+fcos;
  py = fsin;
  dist = sqrt(px*px+py*py);
  if(n == 1) output = pros;
  if(n == 2) output = eq;
  if(n == 3) output = dist;
  return output;
}

// Calculates the equation of centre (prosthaphairesis), equation of centre and the geocentric
// distance of a planet (Venus, Mars, Jupiter, Saturn)

function eqplan(n,ecc,epi,meccanom,mepianom){
  esin = ecc*sind(meccanom);
  ecos = ecc*cosd(meccanom);
  a = ecos+sqrt(1-esin*esin);
  pros = -atand(2*esin/a);
  b = sqrt(a*a+4*esin*esin);
  fsin = epi*sind(mepianom-pros);
  fcos = epi*cosd(mepianom-pros);
  eq = atand(fsin/(b+fcos));
  eps = asind(esin);
  px = epi*cosd(mepianom)+ecc*cosd(meccanom)+cosd(eps);
  py = epi*sind(mepianom)-2*ecc*sind(meccanom);
  dist = sqrt(px*px+py*py);
  if(n == 1) output = pros;
  if(n == 2) output = eq;
  if(n == 3) output = dist;
  return output;
}

// Calculates the latitude for the outer planets (Mars, Jupiter & Saturn)

function latout(epi,ecc,inc0,inc1,node,latarg,tepianom){
  lat = 0;
  rho1 = epi*cosd(tepianom);
  rho2 = epi*sind(tepianom);
  rholatmax = 1+ecc*cosd(node);
  rholatmin = 1-ecc*cosd(node);
  rho3 = sqrt((rholatmax+rho1)*(rholatmax+rho1)+rho2*rho2);
  rho4 = sqrt((rholatmin+rho1)*(rholatmin+rho1)+rho2*rho2);
  latmax = (inc0*(rho1+rholatmax)-inc1*rho1)/rho3;
  latmin = (inc0*(rho1+rholatmin)-inc1*rho1)/rho4;
  carg = cosd(latarg);
  lat = carg*((latmax+latmin)+sgn(carg)*(latmax-latmin))/2;
  return lat;
}

// Egyptian terms from Bouche-Leclercq (1899), p. 207

function egyptianterms(x){
  n = 0;
  if((x>0 && x<6) || (x>44 && x<52) || (x>66 && x<72) || (x>109 && x<116) || (x>120 && x<126) || 
     (x>167 && x<171) || (x>194 && x<201) || (x>229 && x<234) || (x>240 && x<252) || (x>277 && x<284) || 
     (x>313 && x<320) || (x>342 && x<346)) {n = 1};
  if((x>20 && x<25) || (x>57 && x<60) || (x>77 && x<84) || (x>90 && x<97) || (x>144 && x<150) || 
     (x>171 && x<178) || (x>208 && x<217) || (x>266 && x<270) || (x>296 && x<300) || (x>320 && x<325) ||
     (x>349 && x<358)) {n = 2};
  if((x>6 && x<12) || (x>30 && x<38) || (x>72 && x<77) || (x>97 && x<103) || (x>126 && x<131) || 
     (x>157 && x<167) || (x>201 && x<208) || (x>217 && x<221) || (x>252 && x<257) || (x>284 && x<292) || 
     (x>307 && x<313) || (x>330 && x<342)) {n = 4};
  if((x>12 && x<20) || (x>38 && x<44) || (x>60 && x<66) || (x>103 && x<109) || (x>138 && x<144) || 
     (x>150 && x<157) || (x>186 && x<194) || (x>221 && x<229) || (x>257 && x<261) || (x>270 && x<277) ||
     (x>300 && x<307) || (x>346 && x<349)) {n = 5};
  return n;
}

// Ptolemy's terms from Bouche-Leclercq (1899), p. 211

function ptolemyterms(x){
  n = 0;
  if((x>0 && x<6) || (x>45 && x<52) || (x>67 && x<73) || (x>96 && x<103) || (x>139 && x<145) || 
     (x>163 && x<168) || (x>191 && x<199) || (x>216 && x<224) || (x>240 && x<248) || (x>282 && x<289) || 
     (x>320 && x<325) || (x>338 && x<344)) {n = 1};
  if((x>21 && x<26) || (x>56 && x<60) || (x>80 && x<86) || (x>90 && x<96) || (x>145 && x<150) || 
     (x>174 && x<180) || (x>204 && x<216) || (x>265 && x<270) || (x>289 && x<295) || (x>325 && x<330) ||
     (x>350 && x<356)) {n = 2};
  if((x>6 && x<14) || (x>30 && x<38) || (x>73 && x<80) || (x>110 && x<117) || (x>133 && x<139) || 
     (x>157 && x<163) || (x>186 && x<191) || (x>224 && x<231) || (x>248 && x<254) || (x>270 && x<276) || 
     (x>312 && x<320) || (x>330 && x<338)) {n = 4};
  if((x>14 && x<21) || (x>38 && x<45) || (x>60 && x<67) || (x>103 && x<110) || (x>126 && x<133) || 
     (x>150 && x<157) || (x>199 && x<204) || (x>231 && x<237) || (x>254 && x<259) || (x>276 && x<282) ||
     (x>306 && x<312) || (x>344 && x<350)) {n = 5};
  return n;
}

// Ptolemy's terms in Vettius Valens (Anthologiae I.3)

function ptolemyvalensterms(x){
  n = 0;
  if((x>0 && x<6) || (x>45 && x<52) || (x>67 && x<73) || (x>96 && x<103) || (x>139 && x<145) || 
     (x>163 && x<168) || (x>191 && x<199) || (x>216 && x<224) || (x>240 && x<248) || (x>282 && x<289) || 
     (x>320 && x<325) || (x>338 && x<344)) {n = 1};
  if((x>21 && x<26) || (x>56 && x<60) || (x>80 && x<86) || (x>90 && x<96) || (x>145 && x<150) || 
     (x>174 && x<180) || (x>206 && x<216) || (x>265 && x<270) || (x>289 && x<295) || (x>325 && x<330) ||
     (x>350 && x<356)) {n = 2};
  if((x>6 && x<14) || (x>30 && x<38) || (x>73 && x<80) || (x>110 && x<117) || (x>133 && x<139) || 
     (x>157 && x<163) || (x>199 && x<206) || (x>224 && x<231) || (x>248 && x<254) || (x>270 && x<276) || 
     (x>312 && x<320) || (x>330 && x<338)) {n = 4};
  if((x>14 && x<21) || (x>38 && x<45) || (x>60 && x<67) || (x>103 && x<110) || (x>126 && x<133) || 
     (x>150 && x<157) || (x>186 && x<191) || (x>231 && x<237) || (x>254 && x<259) || (x>276 && x<282) ||
     (x>306 && x<312) || (x>344 && x<350)) {n = 5};
  return n;
}

// Chaldean terms from Bouche-Leclercq (1899), p. 210

function chaldeandayterms(x){
  y = x%120;
  n = 0;
  if((y>0 && y<8) || (y>56 && y<60) || (y>81 && y<86) || (y>98 && y<105)) {n = 1};
  if((y>26 && y<30) || (y>51 && y<56) || (y>75 && y<81) || (y>90 && y<98)) {n = 2};
  if((y>8 && y<15) || (y>30 && y<38) || (y>86 && y<90) || (y>105 && y<111)) {n = 4};
  if((y>21 && y<26) || (y>45 && y<51) || (y>68 && y<75) || (y>116 && y<120)) {n = 5};
  return n;
}

function chaldeannightterms(x){
  y = x%120;
  n = 0;
  if((y>0 && y<8) || (y>56 && y<60) || (y>81 && y<86) || (y>98 && y<105)) {n = 1};
  if((y>26 && y<30) || (y>51 && y<56) || (y>75 && y<81) || (y>90 && y<98)) {n = 2};
  if((y>8 && y<15) || (y>30 && y<38) || (y>86 && y<90) || (y>105 && y<111)) {n = 4};
  if((y>15 && y<21) || (y>38 && y<45) || (y>60 && y<68) || (y>111 && y<116)) {n = 5};
  return n;
}

// Valens's terms from Bouche-Leclercq (1899), p. 214

function valensdayterms(x){
  y = x%120;
  n = 0;
  if((y>3 && y<8) || (y>55 && y<60) || (y>76 && y<81) || (y>98 && y<103)) {n = 1};
  if((y>25 && y<30) || (y>47 && y<52) || (y>68 && y<73) || (y>90 && y<95)) {n = 2};
  if((y>0 && y<3) || (y>52 && y<55) || (y>73 && y<76) || (y>95 && y<98)) {n = 3};
  if((y>8 && y<13) || (y>30 && y<35) || (y>81 && y<86) || (y>103 && y<108)) {n = 4};
  if((y>21 && y<25) || (y>43 && y<47) || (y>64 && y<68) || (y>116 && y<120)) {n = 5};
  if((y>13 && y<17) || (y>35 && y<39) || (y>86 && y<90) || (y>108 && y<112)) {n = 6};
  return n;
}

function valensnightterms(x){
  y = x%120;
  n = 0;
  if((y>0 && y<5) || (y>52 && y<57) || (y>73 && y<78) || (y>95 && y<100)) {n = 1};
  if((y>25 && y<30) || (y>47 && y<52) || (y>68 && y<73) || (y>90 && y<95)) {n = 2};
  if((y>5 && y<8) || (y>57 && y<60) || (y>78 && y<81) || (y>100 && y<103)) {n = 3};
  if((y>12 && y<17) || (y>34 && y<39) || (y>85 && y<90) || (y>107 && y<112)) {n = 4};
  if((y>17 && y<21) || (y>39 && y<43) || (y>60 && y<64) || (y>112 && y<116)) {n = 5};
  if((y>8 && y<12) || (y>30 && y<34) || (y>81 && y<85) || (y>103 && y<107)) {n = 6};

  return n;
}

function aspect(x1,x2,orbval,p1,p2){
  asp = "--";
  if(orbval == 0) {
    s1 = Math.floor(x1/30);
    s2 = Math.floor(x2/30);
    ds = (s1-s2+18)%12-6;
    if(Math.abs(ds) == 6) asp = "opposition";
    if(Math.abs(ds) == 4) asp = "trine";
    if(Math.abs(ds) == 3) asp = "quartile";
    if(Math.abs(ds) == 2) asp = "sextile";
    if(Math.abs(ds) == 0) asp = "conjunction";
  }
  if(orbval > 0) {
    if(orbval == 1) orb = Math.max(orbds[p1],orbds[p2]);
    if(orbval == 2) orb = 12;
    x = degmod(x1-x2+180)-180;
    if(Math.abs(x) > (180-orb)) asp = "opposition";
    if(Math.abs(Math.abs(x)-120) < orb) asp = "trine";
    if(Math.abs(Math.abs(x)-90) < orb) asp = "quartile";
    if(Math.abs(Math.abs(x)-60) < orb) asp = "sextile";
    if(Math.abs(x) < orb) asp = "conjunction";
  }
  return asp;
}

function sunaspect(x1,x2,orbval,p1,p2){
  asp = "--";
  if(orbval == 0) {
    s1 = Math.floor(x1/30);
    s2 = Math.floor(x2/30);
    ds = (s1-s2+18)%12-6;
    if(Math.abs(ds) == 6) asp ="opposition";
    if(Math.abs(ds) == 4) asp = "trine";
    if(Math.abs(ds) == 3) asp ="quartile";
    if(Math.abs(ds) == 2) asp = "sextile";
    if(Math.abs(ds) == 0) asp = "conjunction";
  }
  if(orbval > 0) {
    if(orbval == 1) orb = Math.max(orbds[p1],orbds[p2]);
    if(orbval == 2) orb = 12;
    x = degmod(x1-x2+180)-180;
    if(Math.abs(x) > (180-orb)) asp = "opposition";
    if(Math.abs(Math.abs(x)-120) < orb) asp = "trine";
    if(Math.abs(Math.abs(x)-90) < orb) asp = "quartile";
    if(Math.abs(Math.abs(x)-60) < orb) asp = "sextile";
    if(Math.abs(x) < orb) asp = "conjunction";
  }
  return asp;
}

function addhundredyears(){ 
  ddays = ddays+36500;
  updatecalendar(ddays);
}

function subtracthundredyears(){
  ddays = ddays-36500;
  updatecalendar(ddays);
}

function addtenyears(){ 
  ddays = ddays+3650;
  updatecalendar(ddays);
}

function subtracttenyears(){
  ddays = ddays-3650;
  updatecalendar(ddays);
}

function addoneyear(){ 
  ddays = ddays+365;
  updatecalendar(ddays);
}

function subtractoneyear(){
  ddays = ddays-365;
  updatecalendar(ddays);
}

function addonemonth(){ 
  ddays = ddays+30;
  updatecalendar(ddays);
}

function subtractonemonth(){
  ddays = ddays-30;
  updatecalendar(ddays);
}

function addtendays(){ 
  ddays = ddays+10;
  updatecalendar(ddays);
}

function subtracttendays(){
  ddays = ddays-10;
  updatecalendar(ddays);
}

function addoneday(){ 
  ddays = ddays+1;
  updatecalendar(ddays);
}

function subtractoneday(){
  ddays = ddays-1;
  updatecalendar(ddays);
}

function addtwelvehours(){
  ddays = ddays+0.5;
  updatecalendar(ddays);
}

function subtracttwelvehours(){
  ddays = ddays-0.5;
  updatecalendar(ddays);
}

function addonehour(){
  ddays = ddays+1/24;
  updatecalendar(ddays);
}

function subtractonehour(){
  ddays = ddays-1/24;
  updatecalendar(ddays);
}

function addtenminutes(){
  ddays = ddays+1/144;
  updatecalendar(ddays);
}

function subtracttenminutes(){
  ddays = ddays-1/144;
  updatecalendar(ddays);
}

function addoneminute(){
  ddays = ddays+1/1440;
  updatecalendar(ddays);
}

function subtractoneminute(){
  ddays = ddays-1/1440;
  updatecalendar(ddays);
}

function addtenseconds(){
  ddays = ddays+1/8640;
  updatecalendar(ddays);
}

function subtracttenseconds(){
  ddays = ddays-1/8640;
  updatecalendar(ddays);
}

function addonesecond(){
  ddays = ddays+1/86400;
  updatecalendar(ddays);
}

function subtractonesecond(){
  ddays = ddays-1/86400;
  updatecalendar(ddays);
}

function addjupsatconj(){
  ddays = ddays+360/(sex2dec(nlongjup)-sex2dec(nlongsat));
  updatecalendar(ddays);
}

function subtractjupsatconj(){
  ddays = ddays-360/(sex2dec(nlongjup)-sex2dec(nlongsat));
  updatecalendar(ddays);
}

function addmetoncyc(){
  ddays = ddays+235*sex2dec(psynmoon);
  updatecalendar(ddays);
}

function subtractmetoncyc(){
  ddays = ddays-235*sex2dec(psynmoon);
  updatecalendar(ddays);
}

function addonetropyear(){
  ddays = ddays+sex2dec(ptropsun);
  updatecalendar(ddays);
}

function subtractonetropyear(){
  ddays = ddays-sex2dec(ptropsun);
  updatecalendar(ddays);
}

function addthirteenlunations(){
  ddays = ddays+13*sex2dec(psynmoon);
  updatecalendar(ddays);
}

function subtractthirteenlunations(){
  ddays = ddays-13*sex2dec(psynmoon);
  updatecalendar(ddays);
}

function addtwelvelunations(){
  ddays = ddays+12*sex2dec(psynmoon);
  updatecalendar(ddays);
}

function subtracttwelvelunations(){
  ddays = ddays-12*sex2dec(psynmoon);
  updatecalendar(ddays);
}

function addonelunation(){
  ddays = ddays+sex2dec(psynmoon);
  updatecalendar(ddays);
}

function subtractonelunation(){
  ddays = ddays-sex2dec(psynmoon);
  updatecalendar(ddays);
}

function updatecalendar(ddays){
  id = Math.floor(ddays);
  fd = ddays-id;
  year = Math.floor(id/365);
  id = id-365*year;
  month = Math.floor(id/30);
  day = id-30*month;
  year = year+1;
  day = day+1;

  hour = Math.floor(24*fd);
  rmin = 60*(24*fd-hour);
  min = Math.floor(rmin);
  sec = Math.round(60*(rmin-min));  
  
  document.calendar.day1.value = day;
  document.calendar.month1.selectedIndex = month;
  document.calendar.year1.value = year;
  document.calendar.hour1.value = hour;
  document.calendar.min1.value = min;
  document.calendar.sec1.value = sec;
  almagestpos();
}

function almagestpos(){
  pl = Array("Saturn","Jupiter","Mars","Sun","Venus","Mercury","Moon");
  sign = Array("Ari","Tau","Gem","Cnc","Leo","Vir","Lib","Sco","Sgr","Cap","Aqr","Psc");
  diom = Array(0,31,62,92,122,152,181,211,241,271,302,333);
  wdn = Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
  sgnrl = Array(2,4,5,6,3,5,4,2,1,0,0,1);
  orbds = Array(9,9,8,15,7,7,12,12);
  
  day1 = parseFloat(document.calendar.day1.value);
  month1 = document.calendar.month1.selectedIndex;
  year1 = parseFloat(document.calendar.year1.value);
  hour1 = parseFloat(document.calendar.hour1.value);
  min1 = parseFloat(document.calendar.min1.value);
  sec1 = parseFloat(document.calendar.sec1.value);
  orbval = document.aspects.orbval.selectedIndex;
  eotcor = document.calendar.eotcor.selectedIndex;
  longsys = document.rulers.longsys.selectedIndex;
  degnotsys = document.rulers.degnotsys.selectedIndex;
  termsys = document.rulers.termsys.selectedIndex;

  dday = 365*(year1-1)+30*month1+(day1-1);
  ddays = dday+(hour1+(min1+sec1/60)/60)/24;
  jday = ddays+1448637+(22-(17+34/60)/60)/24;

  yearph = year1-424;
  yearau = year1-718;
  yearha = year1-863;
  yearan = year1-884;

 document.calendar.yearph.value = yearph;
 document.calendar.yearau.value = yearau;
 document.calendar.yearha.value = yearha;
 document.calendar.yearan.value = yearan;

// Calculate the Callippic calendar date

  caldaynr = Math.floor(ddays-152431.25);
  calper = Math.ceil((caldaynr+.001)/27759);
  cycday = caldaynr-27759*(calper-1);
  delday = Math.floor(cycday/63)+Math.floor(cycday/27759);
  cycday = cycday+delday;
  calmnr = Math.floor(cycday/30);
  calyear = Math.floor(calmnr*19/235);
  yrtp = (12*calyear)%19;
  calmonth = calmnr-Math.floor((235*calyear+18)/19);
  if(yrtp > 6 && calmonth > 5) calmonth = calmonth+2;
  if((yrtp == 0 || yrtp == 3 || yrtp == 4) && (calmonth > 4)) calmonth = calmonth+1;
  if((yrtp == 1 || yrtp == 2 || yrtp == 5 || yrtp == 6) && (calmonth > 5)) calmonth = calmonth+2;
  if((yrtp == 1 || yrtp == 2 || yrtp == 5 || yrtp == 6) && (calmonth > 12)) calmonth = calmonth+1;
  calyear = calyear+1;
  calday = (cycday%30)+1;

  document.calendar.calday.value=calday;
  document.calendar.calmonth.selectedIndex=calmonth;
  document.calendar.calper.value=calper;
  document.calendar.calyear.value=calyear;

// Calculate the Dionysian calendar date (Boeckh/van der Waerden)
  
  diodays = ddays-168500.75;
  qyear = Math.floor(diodays/1461);
  diodays = diodays-1461*qyear;
  dioyear = Math.floor(diodays/365)-Math.floor(diodays/1460);
  diodays = diodays-365*dioyear;
  diomonth = Math.floor(diodays/30);
  if(diomonth == 12) diomonth = 11;
  dioday = diodays-30*diomonth;
  dioyear = Math.floor(4*qyear+dioyear);
  dioday = Math.floor(dioday+1);

  document.calendar.dioday.value = dioday;
  document.calendar.diomonth.selectedIndex = diomonth;
  document.calendar.dioyear.value = dioyear;

// Calculate the Alexandrian calendar date
  
  aldays = ddays+911.25;
  qyear = Math.floor(aldays/1461);
  aldays = aldays-1461*qyear;
  alyear = Math.floor(aldays/365)-Math.floor(aldays/1460);
  aldays = aldays-365*alyear;
  almonth = Math.floor(aldays/30);
  alday = Math.floor(aldays-30*almonth+1);
  alyear = 4*qyear+alyear-1032;

  document.calendar.alday.value = alday;
  document.calendar.almonth.selectedIndex = almonth;
  document.calendar.alyear.value = alyear;
  document.calendar.ddays.value = round(ddays,6);
  document.calendar.jdn.value = round(jday,6);

// Calculate the Julian calendar date

  y = jday+0.5;
  z = Math.floor(y);
  f = y-z;
  z = z+1524;
  j = Math.floor((z-122.1)/365.25);
  jp = Math.floor(365.25*j);
  month3 = Math.floor((z-jp)/30.6001);
  day3 = z-jp-Math.floor(30.60001*month3);
  year3 = j-4716;
  if(month3 > 13){
    year3 = year3+1;
    month3 = month3-12;
  }
  month3 = month3-2;
  
  dhour = 24*f;
  hour3 = Math.floor(dhour);
  dmin = 60*(dhour-hour3);
  min3 = Math.floor(dmin);
  sec3 = Math.round(60*(dmin-min3));

  wd = Math.floor((Math.floor((y+1)%7)+7)%7);

  document.calendar.wkday.value = wdn[wd];
  document.calendar.day3.value = day3;
  document.calendar.month3.selectedIndex = month3;
  document.calendar.year3.value = year3;
  document.calendar.hour3.value = hour3;
  document.calendar.min3.value = min3;
  document.calendar.sec3.value = sec3;

// Calculate the geocentric position of the Sun

  nsulong = sex2dec(nsunlong);
  apogeesu = sex2dec(apogeesun);
  eccsu = sex2dec(eccsun);
  oblq = sex2dec(obliquity);
  
  mlongsu0 = sex2dec(mlongsun0);
  manomsu0 = degmod(mlongsu0-apogeesu);
  eqsu0 = atand(eccsu*sind(manomsu0)/(1+eccsu*cosd(manomsu0)));
  tlongsu0 = degmod(mlongsu0-eqsu0);
  xsu0 = cosd(tlongsu0);
  ysu0 = cosd(oblq)*sind(tlongsu0);
  rasu0 = degmod(atand2(ysu0,xsu0));
  
  mlongsu = degmod(mlongsu0+ddays*nsulong);
  manomsu = degmod(mlongsu-apogeesu);
  eqsu = atand(eccsu*sind(manomsu)/(1+eccsu*cosd(manomsu)));
  tanomsu = degmod(manomsu-eqsu);
  tlongsu = degmod(mlongsu-eqsu);
  latsu = 0;
  xsu = cosd(tlongsu);
  ysu = cosd(oblq)*sind(tlongsu);
  zsu = sind(oblq)*sind(tlongsu);
  rasu = degmod(atand2(ysu,xsu));
  dcsu = atand(zsu/sqrt(xsu*xsu+ysu*ysu));
  eqtimesu = (degmod((rasu0-mlongsu0)-(rasu-mlongsu)+180)-180)/15;
  ddayscor = ddays-eotcor*eqtimesu/24;
  
  mlongsu = degmod(mlongsu0+ddayscor*nsulong);
  manomsu = degmod(mlongsu-apogeesu);
  eqsu = atand(eccsu*sind(manomsu)/(1+eccsu*cosd(manomsu)));
  tanomsu = degmod(manomsu-eqsu);
  tlongsu = degmod(mlongsu-eqsu);
  latsu = 0;
  xsu = cosd(tlongsu);
  ysu = cosd(oblq)*sind(tlongsu);
  zsu = sind(oblq)*sind(tlongsu);
  rasu = degmod(atand2(ysu,xsu));
  dcsu = atand(zsu/sqrt(xsu*xsu+ysu*ysu));
  dist60su = 60*sqrt(1+eccsu*eccsu+2*eccsu*cosd(manomsu));
  distsu = rsun*dist60su/60;
  parsu = asind(1/distsu);
  diamsu = rsun*sind((31+20/60)/120);
  angdiamsu = 2*asind(diamsu/distsu);

// Calculate accumulated precession since the epoch of the tables and the star catalogue

  cent = 36525;
//  cent=36500.;
  prectab = ddayscor/cent;
  precsc = prectab-322660/cent;
  treprate = 0.8*cent;
  trepcyc = 16*treprate;
//  trep=8.-(ddays-215350.)/treprate;
  trep = Math.abs(8-((((ddayscor-215350)%trepcyc)+trepcyc)%trepcyc)/treprate);

  document.precession.prectab.value = dec2sex(prectab);
  document.precession.precsc.value = dec2sex(precsc);
  document.precession.trep.value = dec2sex(trep);
  document.precession.oblq.value = dec2sex(oblq);

  document.sun.mlongsu.value = dec2sex(mlongsu);
  document.sun.apogeesu.value = dec2sex(apogeesu);
  document.sun.manomsu.value = dec2sex(manomsu);
  document.sun.eqsu.value = dec2sex(eqsu);
  document.sun.tanomsu.value = dec2sex(tanomsu);
  document.sun.tlongsu.value = dec2sex(tlongsu);
  document.sun.latsu.value = dec2sex(latsu);
  document.sun.rasu.value = dec2sex(rasu);
  document.sun.dcsu.value = dec2sex(dcsu);
  document.sun.eqtimesu.value = dec2sex(eqtimesu);
  document.sun.dist60su.value = dec2sex0(dist60su);
  document.sun.distsu.value = dec2sex0(distsu);
  document.sun.parsu.value = dec2sex0(parsu);
  document.sun.angdiamsu.value = dec2sex0(angdiamsu);

// Calculate the geocentric position of the Moon

  nlongmo = sex2dec(nlongmoon);
  nanommo = sex2dec(nanommoon);
  epimo = sex2dec(epimoon);  
  eccmo = sex2dec(eccmoon);
  incmo = sex2dec(incmoon);
  
  nlatargmo = sex2dec(nlatargmoon);
  nelongmo = sex2dec(nelongmoon);
  mlongmo = degmod(sex2dec(mlongmoon0)+ddayscor*nlongmo);
  anommo = degmod(sex2dec(manommoon0)+ddayscor*nanommo);
  apogeemo = degmod(mlongmo-anommo);
  latargmo = degmod(sex2dec(latargmoon0)+ddayscor*nlatargmo);
  tlongln = degmod(mlongmo-latargmo-90);
  melongmo = degmod(sex2dec(melongmoon0)+ddayscor*nelongmo);
  
  esin = eccmo*sind(2*melongmo);
  ecos = eccmo*cosd(2*melongmo);
  oc = ecos+sqrt(1-esin*esin);
  prosmo = atand(esin/(oc+ecos));
  tanommo = degmod(anommo+prosmo);
  fsin = epimo*sind(tanommo);
  fcos = epimo*cosd(tanommo);
  eqmo = atand(fsin/(oc+fcos));
  
  tlongmo = degmod(mlongmo-eqmo);
  latargmo = degmod(latargmo-eqmo);
  latmo = incmo*cosd(latargmo);
  xmo = cosd(latmo)*cosd(tlongmo);
  ymo = cosd(latmo)*sind(tlongmo)*cosd(oblq)-sind(latmo)*sind(oblq);
  zmo = cosd(latmo)*sind(tlongmo)*sind(oblq)+sind(latmo)*cosd(oblq);
  ramo = degmod(atand2(ymo,xmo));
  dcmo = atand(zmo/sqrt(xmo*xmo+ymo*ymo));
  elongmo = degmod(tlongmo-tlongsu+180)-180;
  distmo = 60*sqrt(1+epimo*epimo+2*epimo*cosd(tanommo-eqmo));
  parmo = asind(1/distmo);
  diammo = (64+10/60)*sind((31+20/60)/120);
  angdiammo = 2*asind(diammo/distmo);

  document.moon.mlongmo.value = dec2sex(mlongmo);
  document.moon.apogeemo.value = dec2sex(apogeemo);
  document.moon.anommo.value = dec2sex(anommo);
  document.moon.tlongln.value = dec2sex(tlongln);
  document.moon.latargmo.value = dec2sex(latargmo);
  document.moon.melongmo.value = dec2sex(melongmo);
  document.moon.prosmo.value = dec2sex(prosmo);
  document.moon.tanommo.value = dec2sex(tanommo);
  document.moon.eqmo.value = dec2sex(eqmo);
  document.moon.tlongmo.value = dec2sex(tlongmo);
  document.moon.latmo.value = dec2sex(latmo);
  document.moon.ramo.value = dec2sex(ramo);
  document.moon.dcmo.value = dec2sex(dcmo);
  document.moon.elongmo.value = dec2sex(elongmo);
  document.moon.distmo.value = dec2sex0(distmo);
  document.moon.parmo.value = dec2sex0(parmo);
  document.moon.angdiammo.value = dec2sex0(angdiammo);

// Calculate the geocentric position of Jupiter

  nlongju = sex2dec(nlongjup);
  nepianomju = sex2dec(nepianomjup);
  epiju = sex2dec(epijup);
  eccju = sex2dec(eccjup);
  incju0 = sex2dec(incjup0);
  incju1 = sex2dec(incjup1);
  nodeju = sex2dec(nodejup);
  
  apogeeju = degmod(sex2dec(apogeejup0)+prectab);
  mepiju = degmod(184+41/60+ddayscor*nlongju);
  mepianomju = degmod(146+4/60+ddayscor*nepianomju);  
  meccanomju = degmod(mepiju-apogeeju);

  prosju = eqplan(1,eccju,epiju,meccanomju,mepianomju);
  teccanomju = degmod(meccanomju+prosju);
  tepianomju = degmod(mepianomju-prosju);
  eqaju = eqplan(2,eccju,epiju,meccanomju,mepianomju);
  tlongju = degmod(mepiju+prosju+eqaju);
  
  latargju = degmod(teccanomju+nodeju);
  latju = latout(epiju,eccju,incju0,incju1,nodeju,latargju,tepianomju);
  xju = cosd(latju)*cosd(tlongju);
  yju = cosd(latju)*sind(tlongju)*cosd(oblq)-sind(latju)*sind(oblq);
  zju = cosd(latju)*sind(tlongju)*sind(oblq)+sind(latju)*cosd(oblq);
  raju = degmod(atand2(yju,xju));
  dcju = atand(zju/sqrt(xju*xju+yju*yju));
  elongju = degmod(tlongju-tlongsu+180)-180;
  dist60ju = 60*eqplan(3,eccju,epiju,meccanomju,mepianomju);
  distju = rjup*dist60ju/60;
  parju = asind(1/distju);

// Calculate the geocentric position of Saturn

  nlongsa = sex2dec(nlongsat);
  nepianomsa = sex2dec(nepianomsat);
  episa = sex2dec(episat);  
  eccsa = sex2dec(eccsat);
  incsa0 = sex2dec(incsat0);
  incsa1 = sex2dec(incsat1);
  nodesa = sex2dec(nodesat);
    
  apogeesa = degmod(sex2dec(apogeesat0)+prectab);
  mepisa = degmod(296+43/60+ddayscor*nlongsa);
  mepianomsa = degmod(34+2/60+ddayscor*nepianomsa);  
  meccanomsa = degmod(mepisa-apogeesa);

  prossa = eqplan(1,eccsa,episa,meccanomsa,mepianomsa);
  teccanomsa = degmod(meccanomsa+prossa);
  tepianomsa = degmod(mepianomsa-prossa);
  eqasa = eqplan(2,eccsa,episa,meccanomsa,mepianomsa);
  tlongsa = degmod(mepisa+prossa+eqasa);
  
  latargsa = degmod(teccanomsa+nodesa);
  latsa = latout(episa,eccsa,incsa0,incsa1,nodesa,latargsa,tepianomsa);
  xsa = cosd(latsa)*cosd(tlongsa);
  ysa = cosd(latsa)*sind(tlongsa)*cosd(oblq)-sind(latsa)*sind(oblq);
  zsa = cosd(latsa)*sind(tlongsa)*sind(oblq)+sind(latsa)*cosd(oblq);
  rasa = degmod(atand2(ysa,xsa));
  dcsa = atand(zsa/sqrt(xsa*xsa+ysa*ysa));
  elongsa = degmod(tlongsa-tlongsu+180)-180;
  dist60sa = 60*eqplan(3,eccsa,episa,meccanomsa,mepianomsa);
  distsa = rsat*dist60sa/60;
  parsa = asind(1/distsa);

  melongjusa=degmod(mepiju-mepisa+180)-180.;
  melongsaju=-melongjusa;

  document.jupiter.mepiju.value = dec2sex(mepiju);
  document.jupiter.apogeeju.value = dec2sex(apogeeju);
  document.jupiter.mepianomju.value = dec2sex(mepianomju);
  document.jupiter.meccanomju.value = dec2sex(meccanomju);
  document.jupiter.prosju.value = dec2sex(prosju);
  document.jupiter.teccanomju.value = dec2sex(teccanomju);
  document.jupiter.tepianomju.value = dec2sex(tepianomju);
  document.jupiter.eqaju.value = dec2sex(eqaju);
  document.jupiter.latargju.value = dec2sex(latargju);
  document.jupiter.tlongju.value = dec2sex(tlongju);
  document.jupiter.latju.value = dec2sex(latju);
  document.jupiter.raju.value = dec2sex(raju);
  document.jupiter.dcju.value = dec2sex(dcju);
  document.jupiter.elongju.value = dec2sex(elongju);
  document.jupiter.melongjusa.value = dec2sex(melongjusa);
  document.jupiter.dist60ju.value = dec2sex0(dist60ju);
  document.jupiter.distju.value = dec2sex0(distju);
  document.jupiter.parju.value = dec2sex0(parju);

  document.saturn.mepisa.value = dec2sex(mepisa);
  document.saturn.apogeesa.value = dec2sex(apogeesa);
  document.saturn.mepianomsa.value = dec2sex(mepianomsa);
  document.saturn.meccanomsa.value = dec2sex(meccanomsa);
  document.saturn.prossa.value = dec2sex(prossa);
  document.saturn.teccanomsa.value = dec2sex(teccanomsa);
  document.saturn.tepianomsa.value = dec2sex(tepianomsa);
  document.saturn.eqasa.value = dec2sex(eqasa);
  document.saturn.latargsa.value = dec2sex(latargsa);
  document.saturn.tlongsa.value = dec2sex(tlongsa);
  document.saturn.latsa.value = dec2sex(latsa);
  document.saturn.rasa.value = dec2sex(rasa);
  document.saturn.dcsa.value = dec2sex(dcsa);
  document.saturn.elongsa.value = dec2sex(elongsa);
  document.saturn.melongsaju.value = dec2sex(melongsaju);
  document.saturn.dist60sa.value = dec2sex0(dist60sa);
  document.saturn.distsa.value = dec2sex0(distsa);
  document.saturn.parsa.value = dec2sex0(parsa);

// Calculate the geocentric position of Mars

  nlongma = sex2dec(nlongmar);
  nepianomma = sex2dec(nepianommar);
  epima = sex2dec(epimar);
  eccma = sex2dec(eccmar);
  incma0 = sex2dec(incmar0);
  incma1 = sex2dec(incmar1);
  nodema = sex2dec(nodemar);

  apogeema = degmod(sex2dec(apogeemar0)+prectab);
  mepima = degmod(3+32/60+ddayscor*nlongma);
  mepianomma = degmod(327+13/60+ddayscor*nepianomma);  
  meccanomma = degmod(mepima-apogeema);

  prosma = eqplan(1,eccma,epima,meccanomma,mepianomma);
  teccanomma = degmod(meccanomma+prosma);
  tepianomma = degmod(mepianomma-prosma);
  eqama = eqplan(2,eccma,epima,meccanomma,mepianomma);
  tlongma = degmod(mepima+prosma+eqama);
  
  latargma = degmod(teccanomma+nodema);
  latma = latout(epima,eccma,incma0,incma1,nodema,latargma,tepianomma);
  xma = cosd(latma)*cosd(tlongma);
  yma = cosd(latma)*sind(tlongma)*cosd(oblq)-sind(latma)*sind(oblq);
  zma = cosd(latma)*sind(tlongma)*sind(oblq)+sind(latma)*cosd(oblq);
  rama = degmod(atand2(yma,xma));
  dcma = atand(zma/sqrt(xma*xma+yma*yma));
  elongma = degmod(tlongma-tlongsu+180)-180;
  dist60ma = 60*eqplan(3,eccma,epima,meccanomma,mepianomma);
  distma = rmar*dist60ma/60;
  parma = asind(1/distma);

  document.mars.mepima.value = dec2sex(mepima);
  document.mars.apogeema.value = dec2sex(apogeema);
  document.mars.mepianomma.value = dec2sex(mepianomma);
  document.mars.meccanomma.value = dec2sex(meccanomma);
  document.mars.prosma.value = dec2sex(prosma);
  document.mars.teccanomma.value = dec2sex(teccanomma);
  document.mars.tepianomma.value = dec2sex(tepianomma);
  document.mars.eqama.value = dec2sex(eqama);
  document.mars.latargma.value = dec2sex(latargma);
  document.mars.tlongma.value = dec2sex(tlongma);
  document.mars.latma.value = dec2sex(latma);
  document.mars.rama.value = dec2sex(rama);
  document.mars.dcma.value = dec2sex(dcma);
  document.mars.elongma.value = dec2sex(elongma);
  document.mars.dist60ma.value = dec2sex0(dist60ma);
  document.mars.distma.value = dec2sex0(distma);
  document.mars.parma.value = dec2sex0(parma);

// Calculate the geocentric position of Venus

  nepianomve = sex2dec(nepianomven);
  epive = sex2dec(epiven);
  eccve = sex2dec(eccven);
  incve0 = sex2dec(incven0);
  incve1 = -sex2dec(incven1);
  incve2 = sex2dec(incven2);

  apogeeve = degmod(sex2dec(apogeeven0)+prectab);
  mepive = mlongsu;
  mepianomve = degmod(71+7/60+ddayscor*nepianomve);  
  meccanomve = degmod(mepive-apogeeve);

  prosve = eqplan(1,eccve,epive,meccanomve,mepianomve);
  teccanomve = degmod(meccanomve+prosve);
  tepianomve = degmod(mepianomve-prosve);
  eqave = eqplan(2,eccve,epive,meccanomve,mepianomve);
  tlongve = degmod(mepive+prosve+eqave);

  etave = abs(tepianomve-180.);
  pprime = abs(epive*cosd(etave)*sind(incve1));
  xprime = 0.999782-epive*cosd(etave)*cosd(incve1);
  yprime = epive*sind(etave);
  oprime = sqrt(xprime*xprime+yprime*yprime);
  c3ve = atand2(pprime,oprime);
  c6ve = abs(atand2(epive*sind(tepianomve),1+epive*cosd(tepianomve)));
  c4ve = 3.25*c6ve/60;
  xkappa0p = degmod(teccanomve+90);
  latve1 = -sgn(cosd(tepianomve))*c3ve*cosd(xkappa0p);
  latve2 = sgn(sind(tepianomve))*c4ve*cosd(teccanomve); 
  latve3 = incve0*cosd(teccanomve)*cosd(teccanomve);
  latve = latve1+latve2+latve3;

  xve = cosd(latve)*cosd(tlongve);
  yve = cosd(latve)*sind(tlongve)*cosd(oblq)-sind(latve)*sind(oblq);
  zve = cosd(latve)*sind(tlongve)*sind(oblq)+sind(latve)*cosd(oblq);
  rave = degmod(atand2(yve,xve));
  dcve = atand(zve/sqrt(xve*xve+yve*yve));
  elongve = degmod(tlongve-tlongsu+180)-180;
  dist60ve = 60*eqplan(3,eccve,epive,meccanomve,mepianomve);
  distve = rven*dist60ve/60;
  parve = asind(1/distve);

  document.venus.mepive.value = dec2sex(mepive);
  document.venus.apogeeve.value = dec2sex(apogeeve);
  document.venus.mepianomve.value = dec2sex(mepianomve);
  document.venus.meccanomve.value = dec2sex(meccanomve);
  document.venus.prosve.value = dec2sex(prosve);
  document.venus.teccanomve.value = dec2sex(teccanomve);
  document.venus.tepianomve.value = dec2sex(tepianomve);
  document.venus.eqave.value = dec2sex(eqave);
  document.venus.latve1.value = dec2sex(latve1);
  document.venus.latve2.value = dec2sex(latve2);
  document.venus.latve3.value = dec2sex(latve3);
  document.venus.tlongve.value = dec2sex(tlongve);
  document.venus.latve.value = dec2sex(latve);
  document.venus.rave.value = dec2sex(rave);
  document.venus.dcve.value = dec2sex(dcve);
  document.venus.elongve.value = dec2sex(elongve);
  document.venus.dist60ve.value = dec2sex0(dist60ve);
  document.venus.distve.value = dec2sex0(distve);
  document.venus.parve.value = dec2sex0(parve);

// Calculate the geocentric position of Mercury

  nepianomme = sex2dec(nepianommer);
  epime = sex2dec(epimer);
  eccme = sex2dec(eccmer);
  incme0 = -sex2dec(incmer0);
  incme1 = sex2dec(incmer1);
  incme2 = -sex2dec(incmer2);

  apogeeme = degmod(sex2dec(apogeemer0)+prectab);
  mepime = mlongsu;
  mepianomme = degmod(21+55/60+ddayscor*nepianomme);  
  meccanomme = degmod(mepime-apogeeme);
  
  prosme = eqme(1,eccme,epime,meccanomme,mepianomme);
  teccanomme = degmod(meccanomme+prosme);
  tepianomme = degmod(mepianomme-prosme);
  eqame = eqme(2,eccme,epime,meccanomme,mepianomme);
  tlongme = degmod(mepime+prosme+eqame);

  etame = abs(tepianomme-180);
  pprime = abs(epime*cosd(etame)*sind(incme1));
  xprime = 0.94444-epime*cosd(etame)*cosd(incme1);
  yprime = epime*sind(etame);
  oprime = sqrt(xprime*xprime+yprime*yprime);
  c3me = atand2(pprime,oprime);
  c6me = abs(atand2(epime*sind(tepianomme),1+epime*cosd(tepianomme)));
  c4me = 6.8*c6me/60;
  xkappa0p = degmod(teccanomme+270);
  latme1 = -sgn(cosd(tepianomme))*c3me*cosd(xkappa0p);
  xkappa0pp = degmod(teccanomme+180);
  if(cosd(teccanomme) > 0) latme2 = 0.9*sgn(sind(tepianomme))*c4me*cosd(xkappa0pp); 
  if(cosd(teccanomme) < 0) latme2 = 1.1*sgn(sind(tepianomme))*c4me*cosd(xkappa0pp); 
  latme3 = incme0*cosd(teccanomme)*cosd(teccanomme);
  latme = latme1+latme2+latme3;

  xme = cosd(latme)*cosd(tlongme);
  yme = cosd(latme)*sind(tlongme)*cosd(oblq)-sind(latme)*sind(oblq);
  zme = cosd(latme)*sind(tlongme)*sind(oblq)+sind(latme)*cosd(oblq);
  rame = degmod(atand2(yme,xme));
  dcme = atand(zme/sqrt(xme*xme+yme*yme));
  elongme = degmod(tlongme-tlongsu+180)-180;
  dist60me = 60*eqme(3,eccme,epime,meccanomme,mepianomme);
  distme = rmer*dist60me/60;
  parme = asind(1/distme);

  document.mercury.mepime.value = dec2sex(mepime);
  document.mercury.apogeeme.value = dec2sex(apogeeme);
  document.mercury.mepianomme.value = dec2sex(mepianomme);
  document.mercury.meccanomme.value = dec2sex(meccanomme);
  document.mercury.prosme.value = dec2sex(prosme);
  document.mercury.teccanomme.value = dec2sex(teccanomme);
  document.mercury.tepianomme.value = dec2sex(tepianomme);
  document.mercury.eqame.value = dec2sex(eqame);
  document.mercury.latme1.value = dec2sex(latme1);
  document.mercury.latme2.value = dec2sex(latme2);
  document.mercury.latme3.value = dec2sex(latme3);
  document.mercury.tlongme.value = dec2sex(tlongme);
  document.mercury.latme.value = dec2sex(latme);
  document.mercury.rame.value = dec2sex(rame);
  document.mercury.dcme.value = dec2sex(dcme);
  document.mercury.elongme.value = dec2sex(elongme);
  document.mercury.dist60me.value = dec2sex0(dist60me);
  document.mercury.distme.value = dec2sex0(distme);
  document.mercury.parme.value = dec2sex0(parme);

// Calculate the luni-solar and planetary aspects

  sumo = elongmo;
  suln = degmod(tlongln-tlongsu+180)-180;
  susa = elongsa;
  suju = elongju;
  suma = elongma;
  suve = elongve;
  sume = elongme;
  moln = degmod(tlongln-tlongmo+180)-180;
  mosa = degmod(tlongsa-tlongmo+180)-180;
  moju = degmod(tlongju-tlongmo+180)-180;
  moma = degmod(tlongma-tlongmo+180)-180;
  move = degmod(tlongve-tlongmo+180)-180;
  mome = degmod(tlongme-tlongmo+180)-180;
  lnsa = degmod(tlongsa-tlongln+180)-180;
  lnju = degmod(tlongju-tlongln+180)-180;
  lnma = degmod(tlongma-tlongln+180)-180;
  lnve = degmod(tlongve-tlongln+180)-180;
  lnme = degmod(tlongme-tlongln+180)-180;
  saju = degmod(tlongju-tlongsa+180)-180;
  sama = degmod(tlongma-tlongsa+180)-180;
  save = degmod(tlongve-tlongsa+180)-180;
  same = degmod(tlongme-tlongsa+180)-180;
  juma = degmod(tlongma-tlongju+180)-180;
  juve = degmod(tlongve-tlongju+180)-180;
  jume = degmod(tlongme-tlongju+180)-180;
  mave = degmod(tlongve-tlongma+180)-180;
  mame = degmod(tlongme-tlongma+180)-180;
  veme = degmod(tlongme-tlongve+180)-180;

  document.aspects.sumo.value = dec2sex(sumo);
  document.aspects.suln.value = dec2sex(suln);
  document.aspects.susa.value = dec2sex(susa);
  document.aspects.suju.value = dec2sex(suju);
  document.aspects.suma.value = dec2sex(suma);
  document.aspects.suve.value = dec2sex(suve);
  document.aspects.sume.value = dec2sex(sume);

  document.aspects.aspsumo.value = sunaspect(tlongsu,tlongmo,orbval,3,6);
  document.aspects.moln.value = dec2sex(moln);
  document.aspects.mosa.value = dec2sex(mosa);
  document.aspects.moju.value = dec2sex(moju);
  document.aspects.moma.value = dec2sex(moma);
  document.aspects.move.value = dec2sex(move);
  document.aspects.mome.value = dec2sex(mome);

  document.aspects.aspsuln.value = sunaspect(tlongsu,tlongln,orbval,3,7);
  document.aspects.aspmoln.value = aspect(tlongmo,tlongln,orbval,6,7);
  document.aspects.lnsa.value = dec2sex(lnsa);
  document.aspects.lnju.value = dec2sex(lnju);
  document.aspects.lnma.value = dec2sex(lnma);
  document.aspects.lnve.value = dec2sex(lnve);
  document.aspects.lnme.value = dec2sex(lnme);

  document.aspects.aspsusa.value = sunaspect(tlongsu,tlongsa,orbval,0,3);
  document.aspects.aspmosa.value = aspect(tlongmo,tlongsa,orbval,0,6);
  document.aspects.asplnsa.value = aspect(tlongln,tlongsa,orbval,0,7);
  document.aspects.saju.value = dec2sex(saju);
  document.aspects.sama.value = dec2sex(sama);
  document.aspects.save.value = dec2sex(save);
  document.aspects.same.value = dec2sex(same);

  document.aspects.aspsuju.value = sunaspect(tlongsu,tlongju,orbval,1,3);
  document.aspects.aspmoju.value = aspect(tlongmo,tlongju,orbval,1,6);
  document.aspects.asplnju.value = aspect(tlongln,tlongju,orbval,1,7);
  document.aspects.aspsaju.value = aspect(tlongsa,tlongju,orbval,0,1);
  document.aspects.juma.value = dec2sex(juma);
  document.aspects.juve.value = dec2sex(juve);
  document.aspects.jume.value = dec2sex(jume);

  document.aspects.aspsuma.value = sunaspect(tlongsu,tlongma,orbval,2,3);
  document.aspects.aspmoma.value = aspect(tlongmo,tlongma,orbval,2,6);
  document.aspects.asplnma.value = aspect(tlongln,tlongma,orbval,2,7);
  document.aspects.aspsama.value = aspect(tlongsa,tlongma,orbval,0,2);
  document.aspects.aspjuma.value = aspect(tlongju,tlongma,orbval,1,2);
  document.aspects.mave.value = dec2sex(mave);
  document.aspects.mame.value = dec2sex(mame);

  document.aspects.aspsuve.value = sunaspect(tlongsu,tlongve,orbval,3,4);
  document.aspects.aspmove.value = aspect(tlongmo,tlongve,orbval,4,6);
  document.aspects.asplnve.value = aspect(tlongln,tlongve,orbval,4,7);
  document.aspects.aspsave.value = aspect(tlongsa,tlongve,orbval,0,4);
  document.aspects.aspjuve.value = aspect(tlongju,tlongve,orbval,1,5);
  document.aspects.aspmave.value = aspect(tlongma,tlongve,orbval,2,4);
  document.aspects.veme.value = dec2sex(veme);

  document.aspects.aspsume.value = sunaspect(tlongsu,tlongme,orbval,3,5);
  document.aspects.aspmome.value = aspect(tlongmo,tlongme,orbval,5,6);
  document.aspects.asplnme.value = aspect(tlongln,tlongme,orbval,5,7);
  document.aspects.aspsame.value = aspect(tlongsa,tlongme,orbval,0,5);
  document.aspects.aspjume.value = aspect(tlongju,tlongme,orbval,1,5);
  document.aspects.aspmame.value = aspect(tlongma,tlongme,orbval,2,5);
  document.aspects.aspveme.value = aspect(tlongve,tlongme,orbval,4,5);

  tlongcsu = tlongsu;
  tlongcmo = tlongmo;
  tlongcln = tlongln;
  tlongcsa = tlongsa;
  tlongcju = tlongju;
  tlongcma = tlongma;
  tlongcve = tlongve;
  tlongcme = tlongme;

// If selected, apply Theon's sidereal longitude correction.

  if(longsys == 1){
    tlongcsu = degmod(tlongsu+trep);
    tlongcmo = degmod(tlongmo+trep);
    tlongcln = degmod(tlongln+trep);
    tlongcsa = degmod(tlongsa+trep);
    tlongcju = degmod(tlongju+trep);
    tlongcma = degmod(tlongma+trep);
    tlongcve = degmod(tlongve+trep);
    tlongcme = degmod(tlongme+trep);
  }

// Determine the sign and the degree in sign

  nsignsu = Math.floor(tlongcsu/30);
  nsignmo = Math.floor(tlongcmo/30);
  nsignln = Math.floor(tlongcln/30);
  nsignsa = Math.floor(tlongcsa/30);
  nsignju = Math.floor(tlongcju/30);
  nsignma = Math.floor(tlongcma/30);
  nsignve = Math.floor(tlongcve/30);
  nsignme = Math.floor(tlongcme/30);

  document.rulers.signsu.value = sign[nsignsu];
  document.rulers.signmo.value = sign[nsignmo];
  document.rulers.signln.value = sign[nsignln];
  document.rulers.signsa.value = sign[nsignsa];
  document.rulers.signju.value = sign[nsignju];
  document.rulers.signma.value = sign[nsignma];
  document.rulers.signve.value = sign[nsignve];
  document.rulers.signme.value = sign[nsignme];

  dgrsu = tlongcsu%30;
  dgrmo = tlongcmo%30;
  dgrln = tlongcln%30;
  dgrsa = tlongcsa%30;
  dgrju = tlongcju%30;
  dgrma = tlongcma%30;
  dgrve = tlongcve%30;
  dgrme = tlongcme%30;

  document.rulers.dgrsu.value = dec2sex1(dgrsu);
  document.rulers.dgrmo.value = dec2sex1(dgrmo);
  document.rulers.dgrln.value = dec2sex1(dgrln);
  document.rulers.dgrsa.value = dec2sex1(dgrsa);
  document.rulers.dgrju.value = dec2sex1(dgrju);
  document.rulers.dgrma.value = dec2sex1(dgrma);
  document.rulers.dgrve.value = dec2sex1(dgrve);
  document.rulers.dgrme.value = dec2sex1(dgrme);

  if(degnotsys == 0){
    dgrsu = Math.ceil(dgrsu);
    dgrmo = Math.ceil(dgrmo);
    dgrln = Math.ceil(dgrln);
    dgrsa = Math.ceil(dgrsa);
    dgrju = Math.ceil(dgrju);
    dgrma = Math.ceil(dgrma);
    dgrve = Math.ceil(dgrve);
    dgrme = Math.ceil(dgrme);

    document.rulers.dgrsu.value = dgrsu;
    document.rulers.dgrmo.value = dgrmo;
    document.rulers.dgrln.value = dgrln;
    document.rulers.dgrsa.value = dgrsa;
    document.rulers.dgrju.value = dgrju;
    document.rulers.dgrma.value = dgrma;
    document.rulers.dgrve.value = dgrve;
    document.rulers.dgrme.value = dgrme;
  }

// Determine the sign rulers

  document.rulers.sgnrlsu.value = pl[sgnrl[nsignsu]];
  document.rulers.sgnrlmo.value = pl[sgnrl[nsignmo]];
  document.rulers.sgnrlln.value = pl[sgnrl[nsignln]];
  document.rulers.sgnrlsa.value = pl[sgnrl[nsignsa]];
  document.rulers.sgnrlju.value = pl[sgnrl[nsignju]];
  document.rulers.sgnrlma.value = pl[sgnrl[nsignma]];
  document.rulers.sgnrlve.value = pl[sgnrl[nsignve]];
  document.rulers.sgnrlme.value = pl[sgnrl[nsignme]];

// Determine the decan rulers

  document.rulers.dcnrlsu.value = pl[(Math.floor(tlongcsu/10)+2)%7];
  document.rulers.dcnrlmo.value = pl[(Math.floor(tlongcmo/10)+2)%7];
  document.rulers.dcnrlln.value = pl[(Math.floor(tlongcln/10)+2)%7];
  document.rulers.dcnrlsa.value = pl[(Math.floor(tlongcsa/10)+2)%7];
  document.rulers.dcnrlju.value = pl[(Math.floor(tlongcju/10)+2)%7];
  document.rulers.dcnrlma.value = pl[(Math.floor(tlongcma/10)+2)%7];
  document.rulers.dcnrlve.value = pl[(Math.floor(tlongcve/10)+2)%7];
  document.rulers.dcnrlme.value = pl[(Math.floor(tlongcme/10)+2)%7];

// Determine the term rulers

  if(termsys == 0){
    document.rulers.trmrlsu.value = pl[egyptianterms(tlongcsu)];
    document.rulers.trmrlmo.value = pl[egyptianterms(tlongcmo)];
    document.rulers.trmrlln.value = pl[egyptianterms(tlongcln)];
    document.rulers.trmrlsa.value = pl[egyptianterms(tlongcsa)];
    document.rulers.trmrlju.value = pl[egyptianterms(tlongcju)];
    document.rulers.trmrlma.value = pl[egyptianterms(tlongcma)];
    document.rulers.trmrlve.value = pl[egyptianterms(tlongcve)];
    document.rulers.trmrlme.value = pl[egyptianterms(tlongcme)];
  }

  if(termsys == 1){
    document.rulers.trmrlsu.value = pl[ptolemyterms(tlongcsu)];
    document.rulers.trmrlmo.value = pl[ptolemyterms(tlongcmo)];
    document.rulers.trmrlln.value = pl[ptolemyterms(tlongcln)];
    document.rulers.trmrlsa.value = pl[ptolemyterms(tlongcsa)];
    document.rulers.trmrlju.value = pl[ptolemyterms(tlongcju)];
    document.rulers.trmrlma.value = pl[ptolemyterms(tlongcma)];
    document.rulers.trmrlve.value = pl[ptolemyterms(tlongcve)];
    document.rulers.trmrlme.value = pl[ptolemyterms(tlongcme)];
  }

  if(termsys == 2){
    document.rulers.trmrlsu.value = pl[ptolemyvalensterms(tlongcsu)];
    document.rulers.trmrlmo.value = pl[ptolemyvalensterms(tlongcmo)];
    document.rulers.trmrlln.value = pl[ptolemyvalensterms(tlongcln)];
    document.rulers.trmrlsa.value = pl[ptolemyvalensterms(tlongcsa)];
    document.rulers.trmrlju.value = pl[ptolemyvalensterms(tlongcju)];
    document.rulers.trmrlma.value = pl[ptolemyvalensterms(tlongcma)];
    document.rulers.trmrlve.value = pl[ptolemyvalensterms(tlongcve)];
    document.rulers.trmrlme.value = pl[ptolemyvalensterms(tlongcme)];
  }

  if(termsys == 3){
    document.rulers.trmrlsu.value = pl[chaldeandayterms(tlongcsu)];
    document.rulers.trmrlmo.value = pl[chaldeandayterms(tlongcmo)];
    document.rulers.trmrlln.value = pl[chaldeandayterms(tlongcln)];
    document.rulers.trmrlsa.value = pl[chaldeandayterms(tlongcsa)];
    document.rulers.trmrlju.value = pl[chaldeandayterms(tlongcju)];
    document.rulers.trmrlma.value = pl[chaldeandayterms(tlongcma)];
    document.rulers.trmrlve.value = pl[chaldeandayterms(tlongcve)];
    document.rulers.trmrlme.value = pl[chaldeandayterms(tlongcme)];
  }

  if(termsys == 4){
    document.rulers.trmrlsu.value = pl[chaldeannightterms(tlongcsu)];
    document.rulers.trmrlmo.value = pl[chaldeannightterms(tlongcmo)];
    document.rulers.trmrlln.value = pl[chaldeannightterms(tlongcln)];
    document.rulers.trmrlsa.value = pl[chaldeannightterms(tlongcsa)];
    document.rulers.trmrlju.value = pl[chaldeannightterms(tlongcju)];
    document.rulers.trmrlma.value = pl[chaldeannightterms(tlongcma)];
    document.rulers.trmrlve.value = pl[chaldeannightterms(tlongcve)];
    document.rulers.trmrlme.value = pl[chaldeannightterms(tlongcme)];
  }

if(termsys == 5){
    document.rulers.trmrlsu.value = pl[valensdayterms(tlongcsu)];
    document.rulers.trmrlmo.value = pl[valensdayterms(tlongcmo)];
    document.rulers.trmrlln.value = pl[valensdayterms(tlongcln)];
    document.rulers.trmrlsa.value = pl[valensdayterms(tlongcsa)];
    document.rulers.trmrlju.value = pl[valensdayterms(tlongcju)];
    document.rulers.trmrlma.value = pl[valensdayterms(tlongcma)];
    document.rulers.trmrlve.value = pl[valensdayterms(tlongcve)];
    document.rulers.trmrlme.value = pl[valensdayterms(tlongcme)];
  }

  if(termsys == 6){
    document.rulers.trmrlsu.value = pl[valensnightterms(tlongcsu)];
    document.rulers.trmrlmo.value = pl[valensnightterms(tlongcmo)];
    document.rulers.trmrlln.value = pl[valensnightterms(tlongcln)];
    document.rulers.trmrlsa.value = pl[valensnightterms(tlongcsa)];
    document.rulers.trmrlju.value = pl[valensnightterms(tlongcju)];
    document.rulers.trmrlma.value = pl[valensnightterms(tlongcma)];
    document.rulers.trmrlve.value = pl[valensnightterms(tlongcve)];
    document.rulers.trmrlme.value = pl[valensnightterms(tlongcme)];
  }

// Determine the monomoiria

  if(degnotsys == 0){
    document.rulers.monosu.value = pl[(sgnrl[nsignsu]+dgrsu-1)%7];
    document.rulers.monomo.value = pl[(sgnrl[nsignmo]+dgrmo-1)%7];
    document.rulers.monoln.value = pl[(sgnrl[nsignln]+dgrln-1)%7];
    document.rulers.monosa.value = pl[(sgnrl[nsignsa]+dgrsa-1)%7];
    document.rulers.monoju.value = pl[(sgnrl[nsignju]+dgrju-1)%7];
    document.rulers.monoma.value = pl[(sgnrl[nsignma]+dgrma-1)%7];
    document.rulers.monove.value = pl[(sgnrl[nsignve]+dgrve-1)%7];
    document.rulers.monome.value = pl[(sgnrl[nsignme]+dgrme-1)%7];
  }

  if(degnotsys == 1){
    document.rulers.monosu.value = pl[(sgnrl[nsignsu]+Math.floor(dgrsu))%7];
    document.rulers.monomo.value = pl[(sgnrl[nsignmo]+Math.floor(dgrmo))%7];
    document.rulers.monoln.value = pl[(sgnrl[nsignln]+Math.floor(dgrln))%7];
    document.rulers.monosa.value = pl[(sgnrl[nsignsa]+Math.floor(dgrsa))%7];
    document.rulers.monoju.value = pl[(sgnrl[nsignju]+Math.floor(dgrju))%7];
    document.rulers.monoma.value = pl[(sgnrl[nsignma]+Math.floor(dgrma))%7];
    document.rulers.monove.value = pl[(sgnrl[nsignve]+Math.floor(dgrve))%7];
    document.rulers.monome.value = pl[(sgnrl[nsignme]+Math.floor(dgrme))%7];
  }

// Determine the planetary dodekatemoria

  if(degnotsys == 0){
    ddgrsu = degmod(30*nsignsu+13*dgrsu-1);
    ddgrmo = degmod(30*nsignmo+13*dgrmo-1);
    ddgrln = degmod(30*nsignln+13*dgrln-1);
    ddgrsa = degmod(30*nsignsa+13*dgrsa-1);
    ddgrju = degmod(30*nsignju+13*dgrju-1);
    ddgrma = degmod(30*nsignma+13*dgrma-1);
    ddgrve = degmod(30*nsignve+13*dgrve-1);
    ddgrme = degmod(30*nsignme+13*dgrme-1);

    document.rulers.dsignsu.value = sign[Math.floor(ddgrsu/30)];
    document.rulers.ddgrsu.value = (ddgrsu%30)+1;

    document.rulers.dsignmo.value = sign[Math.floor(ddgrmo/30)];
    document.rulers.ddgrmo.value = (ddgrmo%30)+1;

    document.rulers.dsignln.value = sign[Math.floor(ddgrln/30)];
    document.rulers.ddgrln.value = (ddgrln%30)+1;

    document.rulers.dsignsa.value = sign[Math.floor(ddgrsa/30)];
    document.rulers.ddgrsa.value = (ddgrsa%30)+1;

    document.rulers.dsignju.value = sign[Math.floor(ddgrju/30)];
    document.rulers.ddgrju.value = (ddgrju%30)+1;

    document.rulers.dsignma.value = sign[Math.floor(ddgrma/30)];
    document.rulers.ddgrma.value = (ddgrma%30)+1;

    document.rulers.dsignve.value = sign[Math.floor(ddgrve/30)];
    document.rulers.ddgrve.value = (ddgrve%30)+1;

    document.rulers.dsignme.value = sign[Math.floor(ddgrme/30)];
    document.rulers.ddgrme.value = (ddgrme%30)+1;
  }

  if(degnotsys == 1){
    ddgrsu = degmod(30*nsignsu+13*dgrsu);
    ddgrmo = degmod(30*nsignmo+13*dgrmo);
    ddgrln = degmod(30*nsignln+13*dgrln);
    ddgrsa = degmod(30*nsignsa+13*dgrsa);
    ddgrju = degmod(30*nsignju+13*dgrju);
    ddgrma = degmod(30*nsignma+13*dgrma);
    ddgrve = degmod(30*nsignve+13*dgrve);
    ddgrme = degmod(30*nsignme+13*dgrme);

    document.rulers.dsignsu.value = sign[Math.floor(ddgrsu/30)];
    document.rulers.ddgrsu.value = Math.floor(ddgrsu%30)+1;

    document.rulers.dsignmo.value = sign[Math.floor(ddgrmo/30)];
    document.rulers.ddgrmo.value = Math.floor(ddgrmo%30)+1;

    document.rulers.dsignln.value = sign[Math.floor(ddgrln/30)];
    document.rulers.ddgrln.value = Math.floor(ddgrln%30)+1;

    document.rulers.dsignsa.value = sign[Math.floor(ddgrsa/30)];
    document.rulers.ddgrsa.value = Math.floor(ddgrsa%30)+1;

    document.rulers.dsignju.value = sign[Math.floor(ddgrju/30)];
    document.rulers.ddgrju.value = Math.floor(ddgrju%30)+1;

    document.rulers.dsignma.value = sign[Math.floor(ddgrma/30)];
    document.rulers.ddgrma.value = Math.floor(ddgrma%30)+1;

    document.rulers.dsignve.value = sign[Math.floor(ddgrve/30)];
    document.rulers.ddgrve.value = Math.floor(ddgrve%30)+1;

    document.rulers.dsignme.value = sign[Math.floor(ddgrme/30)];
    document.rulers.ddgrme.value = Math.floor(ddgrme%30)+1;
  }

// Determine arc from the point of exaltation

  exsu = Math.abs(degmod(tlongcsu-18.5+180)-180);
  exmo = Math.abs(degmod(tlongcmo-32.5+180)-180);
  exln = Math.abs(degmod(tlongcln-62.5+180)-180);
  exsa = Math.abs(degmod(tlongcsa-200.5+180)-180);
  exju = Math.abs(degmod(tlongcju-104.5+180)-180);
  exma = Math.abs(degmod(tlongcma-297.5+180)-180);
  exve = Math.abs(degmod(tlongcve-356.5+180)-180);
  exme = Math.abs(degmod(tlongcme-164.5+180)-180);

  document.rulers.exsu.value = dec2sex1(exsu,4);
  document.rulers.exmo.value = dec2sex1(exmo,4);
  document.rulers.exln.value = dec2sex1(exln,4);
  document.rulers.exsa.value = dec2sex1(exsa,4);
  document.rulers.exju.value = dec2sex1(exju,4);
  document.rulers.exma.value = dec2sex1(exma,4);
  document.rulers.exve.value = dec2sex1(exve,4);
  document.rulers.exme.value = dec2sex1(exme,4);

}