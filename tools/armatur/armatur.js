
function compute(m,n,lq,d) {
	var tmp;
	var ss = "";
	var r = [];
	var qq = 0;
	var totallength = 0;
	for (i=0;i<n;++i) totallength += lq[i].l*lq[i].q;
	lq.sort(function(a,b){return parseFloat(b.l)-parseFloat(a.l);});
	var t = totallength;
	if (lq[0].l>m) return "Стандарт арматурын урт богинодож байна.";
	ss += "Диаметр: "+d+" мм.<br/>";
	while (t>0) {
		r = step(m,n,lq);
		var tt = 1E9;
		for (i=0;i<n;++i) if (r[i]>0) {
			tmp = Math.floor(lq[i].q/r[i]);
			if (tmp<tt) tt = tmp;
		}
		qq += tt;
		tmp = 0;
		ss += tt+"ш төмрийг тус бүр: ";
		for (i=0;i<n;++i) if (r[i]>0) {
			ss += lq[i].l+" урттайгаар "+r[i]+" тасла. ";
			tmp += r[i]*lq[i].l;
			lq[i].q -= tt*r[i];
		}
		ss += "Үлдэгдэл " + (m-tmp) + " x " + tt + ".<br/>"
		t -= tt*tmp;		
	}
	ss += "<br/>Нийт "+qq+"ш төмөр хэрэгтэй. Нийт хаягдлын урт "+Math.round(qq*m-totallength,2)+" буюу "+(100-100*totallength/(qq*m)).toFixed(2)+"%.";
	ss += "<br/>Нийт жин "+(0.888/1000/144*d*d*qq*m).toFixed(2)+"кг.";
	ss += "<br/>Нийт жинг томъёоны сортаментаар бодов. Үйлдвэрийн сортамент өөр байх боломжтойг анхаарна уу.";
	return ss;
}



function step(m,n,lq) {
	var r = [];
	var s = 0;
	for (i=0;i<n;++i) {
		r[i] = Math.floor((m-s)/lq[i].l);
		if (r[i]>lq[i].q) r[i]=lq[i].q;
		s += lq[i].l*r[i];
	}
	return r;
}

