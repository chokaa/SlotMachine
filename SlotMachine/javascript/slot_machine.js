var broj_redova=3;
var broj_dugmica=3;
var dugmici = [];
var ikonice = [];
var vockice = new Array(broj_redova);
for (var i = 0; i < broj_redova; i++) {
  vockice[i] = new Array(broj_redova);
}
var slotic;


var init = function(){

for(let i=2;i<10;i++){
	var vockica = { slika : document.getElementById('ikonica'+i.toString()), vrednost : i, ime : document.getElementById('ikonica'+i.toString()).id }
	ikonice.push(vockica);
}

var c = document.querySelector('canvas');

c.width = window.innerWidth;
c.height = window.innerHeight;

kanvas = c.getContext('2d');

var background = document.getElementById('pozadina');

kanvas.drawImage(background,0,0,c.width,c.height);

slotic = new Slot();
slotic.draw();

for(let i=0;i<broj_dugmica;i++){
	var dugme = new Dugme(1200,720-i*75);
	if(i==broj_dugmica-1)
		dugme.raiseBet=1;
	if(i==broj_dugmica-2)
		dugme.dropBet=1;
	dugmici.push(dugme);
}

dugmici.forEach(function(element){
	element.draw();
})

for(let i=0;i<broj_redova;i++)
	for(let j=0;j<broj_redova;j++)
	vockice[i][j] = new Vockica(i,j);

for(let i=0;i<broj_redova;i++)
	for(let j=0;j<broj_redova;j++)
		vockice[i][j].draw(i,j);

c.addEventListener('click', function(event) {
	var x = event.clientX;
    var y = event.clientY;

    dugmici.forEach(function(element){
		if(  x > element.x && x < ( element.x+element.width ) && y > element.y && y < ( element.y+element.height ) )
			slotic.update(element);
    });

    	
});

}
$(document).ready(function() {

init();

});


function Slot(){
	
	this.kredit = 5000;
	this.bet = 5;
	this.income = 0;
	this.x_kredit = 1200;
	this.y_kredit = 200;
	this.width=window.innerWidth*(2/3);
	this.height=window.innerHeight*(4/5);
	this.image=document.getElementById('slika_slota');
	
	this.drawWholeSlot = function(){
		this.draw();
		for(let i=0;i<broj_redova;i++)
			for(let j=0;j<broj_redova;j++)
				vockice[i][j].draw();
		dugmici.forEach(function(element){
			element.draw();
		})
	}

	this.draw = function(){


		kanvas.drawImage(this.image,(window.innerWidth-this.width)/2,(window.innerHeight-this.height)/2,this.width,this.height);


		kanvas.font = "30px Comic Sans MS";
		kanvas.fillStyle = "rgb(0,255,0)";
		kanvas.textAlign = "start";
		kanvas.fillText("Kredit : " + this.kredit.toString(), this.x_kredit, this.y_kredit);

		kanvas.font = "30px Comic Sans MS";
		kanvas.fillStyle = "rgb(0,255,0)";
		kanvas.textAlign = "start";
		kanvas.fillText("Bet : " + this.bet.toString(), this.x_kredit, this.y_kredit+50);

		kanvas.font = "30px Comic Sans MS";
		kanvas.fillStyle = "rgb(0,255,0)";
		kanvas.textAlign = "start";
		kanvas.fillText("Income : " + this.income.toString(), this.x_kredit, this.y_kredit+100);
	}
	this.update = function(element){

		if(element.raiseBet){
			this.bet+=5;
			this.drawWholeSlot();
		}
		else if(element.dropBet){
			if(this.bet>5)
				this.bet-=5;
			this.drawWholeSlot();
		}
		else{
		this.kredit-=this.bet;
		for(let i=0;i<broj_redova;i++)
			for(let j=0;j<broj_redova;j++)
				vockice[i][j].spin();

		this.income = this.izracunajDobitak();

		this.kredit+=this.income;

		this.drawWholeSlot();

		this.income=0;
		}
	}
	this.izracunajDobitak = function(){
		var dobitak = 0;
		let zbir_dijagonale = "";
		let zbir_vertikale = "";
		let zbir_horizontale = "";
		for(let i=0;i<broj_redova;i++){
			for(let j=0;j<broj_redova;j++){
				zbir_vertikale+=vockice[i][j].ime;
				zbir_horizontale+=vockice[j][i].ime;
				/*
				if(i==j)
					zbir_dijagonale+=vockice[i][j].ime;
				*/
			}
			if(zbir_vertikale === zbir_vertikale.substring(0,vockice[i][i].ime.length).repeat(broj_redova))
				dobitak = dobitak + (vockice[i][broj_redova-1].vrednost_vockice * this.bet);
			zbir_vertikale="";
			if(zbir_horizontale === zbir_horizontale.substring(0,vockice[i][i].ime.length).repeat(broj_redova))
				dobitak = dobitak + (vockice[broj_redova-1][i].vrednost_vockice * this.bet);
			zbir_horizontale="";
			/*
			if(zbir_dijagonale === zbir_dijagonale.substring(0,vockice[i][i].ime.length).repeat(broj_redova)){
				let vrednost_dijagonale = ikonice.filter(x=>x.ime===zbir_dijagonale.substring(0,vockice[i][i].ime.length))[0].vrednost;
				dobitak = dobitak + (vrednost_dijagonale*broj_redova*this.bet);
			}
			*/
		}
		/*
		zbir_dijagonale="";
		for(let m=broj_redova-1;m>=0;m--)
			for(let k=broj_redova-1;k>=0;k--)
				if(m==k)
					zbir_dijagonale+=vockice[m][k].ime;

		if(zbir_dijagonale === zbir_dijagonale.substring(0,vockice[m][m].ime.length).repeat(broj_redova)){
			let vrednost_dijagonale = ikonice.filter(x=>x.ime===zbir_dijagonale.substring(0,vockice[m][m].ime.length))[0].vrednost;
			dobitak = dobitak + (vrednost_dijagonale*broj_redova*this.bet);
		}
		*/
		return dobitak;
		
	}
	this
}

function Vockica(i,j){
	
	this.width = 200;
	this.height = 200;
	this.image = ikonice[0].slika;
	this.ime = this.image.id;
	this.vrednost_vockice = ikonice[0].vrednost;
	this.x = window.innerWidth*(1/3)-200+(i*this.width)+(i*25);
	this.y = window.innerHeight*(1/5)+(j*this.height)-20;


	this.draw = function(){
		kanvas.drawImage(this.image,this.x,this.y,this.width,this.height);
	}
	this.spin = function(){
		var vocka = Math.floor(Math.random()*ikonice.length);
		this.image = ikonice[vocka].slika;
		this.vrednost_vockice = ikonice[vocka].vrednost;
		this.ime = ikonice[vocka].ime;
		this.draw();
	}
}

function Dugme(x,y){
	this.raiseBet = 0;
	this.dropBet = 0;
	this.x=x;
	this.y=y;
	this.width = 200;
	this.height = 50;
	this.boja = "red"
	this.x_teksta = this.x+100;
	this.y_teksta = this.y+30;
	this.draw = function(){
		if(this.raiseBet){
			kanvas.fillStyle = this.boja;
	    	kanvas.fillRect(this.x, this.y, this.width, this.height);
			kanvas.font = "30px Comic Sans MS";
			kanvas.fillStyle = "rgb(255,255,255)";
			kanvas.textAlign = "center";
			kanvas.fillText("Raise bet", this.x_teksta, this.y_teksta);
		}
		else if(this.dropBet){
			kanvas.fillStyle = this.boja;
	    	kanvas.fillRect(this.x, this.y, this.width, this.height);
			kanvas.font = "30px Comic Sans MS";
			kanvas.fillStyle = "rgb(255,255,255)";
			kanvas.textAlign = "center";
			kanvas.fillText("Drop bet", this.x_teksta, this.y_teksta);
		}
		else{
			kanvas.fillStyle = this.boja;
	    	kanvas.fillRect(this.x, this.y, this.width, this.height);
			kanvas.font = "30px Comic Sans MS";
			kanvas.fillStyle = "rgb(255,255,255)";
			kanvas.textAlign = "center";
			kanvas.fillText("Spin!", this.x_teksta, this.y_teksta);
		}
		
	}
}