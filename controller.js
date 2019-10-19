var x;
var y;

function getCoords(e){
    var elm = document.getElementById('mainbody');
    x = e.pageX - elm.offsetLeft;
    y = e.pageY - elm.offsetTop;
    // document.getElementById('mainbody').innerHTML = x + ', ' + y;
}