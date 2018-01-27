var btnAddSatelite = document.createElement('button');
btnAddSatelite.addEventListener('click', onClick);
btnAddSatelite.value = "Add Satellite";
document.getElementById('space-game').parentNode.appendChild(btnAddSatelite);

var canva = document.getElementById('space-game');
var ctx = canva.getContext('2d');

function onClick(){
	ctx.save();
	canva.addEventListener('mousemove', onMove);
	canva.addEventListener('mouseup', function(event){
		canva.removeEventListener('mousemove', onMove);
	});
}

function onMove(e){
	ctx.restore();
	ctx.beginPath();
	ctx.arc(e.clientX,e.clientY,25,0,2*Math.PI);
	ctx.closePath();
	ctx.stroke();
}
