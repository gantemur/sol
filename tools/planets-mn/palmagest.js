// Lunar, solar and planetary orbital constants adopted in Ptolemy's Almagest

// Sun

const nsunlong  = Array(  0,59, 8,17,13,12,31);
const mlongsun0 = Array(330,45, 0, 0, 0, 0, 0);
const apogeesun = Array( 65,30, 0, 0, 0, 0, 0);
const eccsun    = Array(  0, 2,30, 0, 0, 0, 0);
const obliquity = Array( 23,51,20, 0, 0, 0, 0);
const ptropsun  = Array(365,14,48, 0, 0, 0, 0);
const rsun      = 1210;

// Moon

const nlongmoon   = Array( 13,10,34,58,33,30,30);
const nanommoon   = Array( 13, 3,53,56,17,51,59);
const nlatargmoon = Array( 13,13,45,39,48,56,37);
const nelongmoon  = Array( 12,11,26,41,20,17,59);
const mlongmoon0  = Array( 41,22, 0, 0, 0, 0, 0);
const manommoon0  = Array(268,49, 0, 0, 0, 0, 0);
const latargmoon0 = Array(354,15, 0, 0, 0, 0, 0);
const melongmoon0 = Array( 70,37, 0, 0, 0, 0, 0);
const epimoon     = Array(  0, 6,20, 0, 0, 0, 0);  
const eccmoon     = Array(  0,12,29, 0, 0, 0, 0);
const incmoon     = Array(  5, 0, 0, 0, 0, 0, 0);
const psynmoon    = Array( 29,31,50, 8,20, 0, 0);

// Saturn

const nlongsat    = Array(  0, 2, 0,33,31,28,51);
const nepianomsat = Array(  0,57, 7,43,41,43,40);
const apogeesat0  = Array(224,10, 0, 0, 0, 0, 0);
const episat      = Array(  0, 6,30, 0, 0, 0, 0);  
const eccsat      = Array(  0, 3,25, 0, 0, 0, 0);
const incsat0     = Array(  2,30, 0, 0, 0, 0, 0);
const incsat1     = Array(  4,30, 0, 0, 0, 0, 0);
const nodesat     = Array( 50, 0, 0, 0, 0, 0, 0);
const rsat        = 17026;

// Jupiter

const nlongjup    = Array(  0, 4,59,14,26,46,31);
const nepianomjup = Array(  0,54, 9, 2,46,26, 0);
const apogeejup0  = Array(152, 9, 0, 0, 0, 0, 0);
const epijup      = Array(  0,11,30, 0, 0, 0, 0);
const eccjup      = Array(  0, 2,45, 0, 0, 0, 0);
const incjup0     = Array(  1,30, 0, 0, 0, 0, 0);
const incjup1     = Array(  2,30, 0, 0, 0, 0, 0);
const nodejup     = Array(340, 0, 0, 0, 0, 0, 0);
const rjup        = 11503.5;

// Mars

const nlongmar    = Array(  0,31,26,36,53,51,33);
const nepianommar = Array(  0,27,41,40,19,20,58);
const apogeemar0  = Array(106,40, 0, 0, 0, 0, 0);
const epimar      = Array(  0,39,30, 0, 0, 0, 0);
const eccmar      = Array(  0, 6, 0, 0, 0, 0, 0);
const incmar0     = Array(  1, 0, 0, 0, 0, 0, 0);
const incmar1     = Array(  2,15, 0, 0, 0, 0, 0);
const nodemar     = Array(  0, 0, 0, 0, 0, 0, 0);
const rmar        = 5040;

// Venus

const nepianomven = Array(  0,36,59,25,53,11,28);
const apogeeven0  = Array( 46,10, 0, 0, 0, 0, 0);
const epiven      = Array(  0,43,10, 0, 0, 0, 0);
const eccven      = Array(  0, 1,15, 0, 0, 0, 0);
const incven0     = Array(  0,10, 0, 0, 0, 0, 0);
const incven1     = Array(  2,30, 0, 0, 0, 0, 0);
const incven2     = Array(  3,30, 0, 0, 0, 0, 0);
const rven        = 622.5;

// Mercury

const nepianommer = Array(  3, 6,24, 6,59,35,50);
const apogeemer0  = Array(181,10, 0, 0, 0, 0, 0);
const epimer      = Array(  0,22,30, 0, 0, 0, 0);
const eccmer      = Array(  0, 3, 0, 0, 0, 0, 0);
const incmer0     = Array(  0,45, 0, 0, 0, 0, 0);
const incmer1     = Array(  6,15, 0, 0, 0, 0, 0);
const incmer2     = Array(  7, 0, 0, 0, 0, 0, 0);
const rmer        = 115;
  

function date2jdn(Year, Month, Day) {
  var a = Math.floor((14 - Month) / 12);
  var y = Year + 4800 - a;
  var m = Month + 12 * a - 3;
  return Day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function jdn2date (jd,dat) {
  var l, n, i, j, k;
  l = jd + 68569;
  n = Math.floor(Math.floor(4 * l) / 146097);
  l = l - Math.floor((146097 * n + 3) / 4);
  i = Math.floor(4000 * (l + 1) / 1461001);
  l = l - Math.floor(1461 * i / 4) + 31;
  j = Math.floor(80 * l / 2447);
  k = l - Math.floor(2447 * j / 80);
  l = Math.floor(j / 11);
  j = j + 2 - 12 * l;
  i = 100 * (n - 49) + i + l;

  dat.year  = i;
  dat.month = j;
  dat.day   = k.toFixed(0);
  return dat;
}


// Julian day number into Nabonassar day nuymber
function jdn2ndn(t) {
  return t - 1448637 - (22 - (17 + 34.0/60) / 60) / 24;
}

// Nabonassar day number into Julian day nuymber
function ndn2jdn(n) {
  return n + 1448637 + (22 - (17 + 34.0/60) / 60) / 24;
}

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

function eqplan(n,ecc,epi,meccanom,mepianom) {
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

