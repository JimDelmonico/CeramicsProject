/*Variable declaration*/
var ab = 1;
var tgG = 1;
var ta = 0;
var ofg = 50;
var eG = 70;
var xc = 0;
var ag = 0;

/*function to calculate ab*/
function calculate(ab, tgG, ta, ofg, eG, xc){
    var top = ofg * 10;
    var temp = tgG - ta;
    var bottom = temp * eG * xc;
    var mid = top/bottom;
    var final = mid + ab;
    return final;
}

/*tester*/
ab=calculate(ab, tgG, ta, ofg, eG, xc);
