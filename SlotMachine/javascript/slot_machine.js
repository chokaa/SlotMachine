$(document).ready(function() {

var background_music = new Audio("background_sound.mp3");
	background_music.loop = true;
	background_music.play();

	var c = document.querySelector('canvas');

	c.width = window.innerWidth;
	c.height = window.innerHeight;

	kanvas = c.getContext('2d');

	kanvas.width=c.width;
	kanvas.height=c.height;


	slotMachineBackground = document.getElementById('slika_slota');


	slotMachine = new Slot();
			

	slotMachine.drawWholeSlot();

	//we fill in initial_fruits with all posible icons so later we can take
	//random element from this array and use it for spinn
	for(let i=0;i<slotMachine.rows[0].fruits.length;i++)
		initial_fruits.push(slotMachine.rows[0].fruits[i]);


	
	c.addEventListener('click', function(event) {
		
		var x = event.clientX;
		var y = event.clientY;

		//this is a little hardcoded but in canvas there is no onclick on specified part of it
		//so i needed to handle clicks by position where user has clicked
		if(  x > kanvas.width*46.5/100 && x < (kanvas.width*46.5/100 + kanvas.width*12.4/100) && y > (kanvas.height*83/100) && y < (kanvas.height*97/100 )){
			if(slotMachine.kredit>0){
				slotMachine.bet = 5;
				slotMachine.drawWholeSlot();
			}
		}

		if(  x > kanvas.width*63.5/100 && x < (kanvas.width*63.5/100 + kanvas.width*12.4/100) && y > (kanvas.height*83/100) && y < (kanvas.height*97/100 ) ){
			if(slotMachine.kredit>0){
				slotMachine.bet = slotMachine.kredit;
				slotMachine.drawWholeSlot();
			}
		}
		
		if( x > kanvas.width*80.6/100 && x < (kanvas.width*80.6/100 + kanvas.width*12.4/100) && y > (kanvas.height*83/100) && y < (kanvas.height*97/100 )){
			//spinning is varibale which is used to prevent multiple spinns at same time
			//after 1.5 seconds every interval set by method spinSlot() is cleared and slot is stopped
			if(!spinning && slotMachine.kredit>0){
				slotMachine.kredit-=slotMachine.bet;
				slotMachine.drawWholeSlot();
				spinning=1;
				slotMachine.spinSlot();
				setTimeout(function(element){
					interval_value.forEach(function(element){
						clearInterval(element);
					})
					slotMachine.calculateIncome();
					spinning=0;
				},1500)
			}

		}

		});
	
});

