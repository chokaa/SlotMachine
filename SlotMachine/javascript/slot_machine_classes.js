var number_of_rows=3;
var number_of_fruits = 12;
/*
I used only one canvas element because i found on internet some examples

of slot games and all of them, in their core, had only one canvas element,

this could be done with multiple html elements but this was a little bit more

challenging , so ofcourse, i took the hard way.

number_of_fruits can be any number greater than 4, if u want new icons 

u just need to add in html file img with id iconNUMBER where NUMBER is next number in 

line in html file, number of rows can be changed but i recommend

to change bellow global variables width and height of fruits so they

dont leave canvas ( window ) 
*/
const width = window.innerWidth*(1/5);
const height = window.innerHeight*(127/1000);

var jackpot = new Audio("jackpot.mp3");




var interval_value = [];
var spinning = 0;

//array with all icons used later for random selection of fruits
var initial_fruits = [];

class Fruit{

	constructor( x , y , value , image_source){
		this.image = image_source;
		this.value = value;
		this.x = x;
		this.y = y;
		this.draw();
	}
	static get width(){
		return width;
	}

	static get height(){
		return height;
	}

	draw(wheel,i){
		
		//when called from constructor it will only draw image, if called from
		//spin wheel it will move image
		kanvas.save();

		kanvas.beginPath();
  		kanvas.rect(window.innerWidth*8/100, window.innerHeight*1/20, Fruit.width*3+window.innerWidth*52/100, Fruit.height*4);
  		kanvas.clip();

		if(wheel !== undefined && i!==undefined){

			if(this.y>wheel.size-Fruit.height)
				this.y=wheel.y;

			this.y+=i;

			kanvas.drawImage(this.image ,this.x,this.y+i,Fruit.width,Fruit.height);

			if(slotMachine.rows.indexOf(wheel)==number_of_rows-1 && wheel.fruits.indexOf(this)==number_of_fruits-1){
				kanvas.drawImage(slotMachineBackground,0,0,kanvas.width,kanvas.height);
				slotMachine.draw();
			}

		}

		else
			
		kanvas.drawImage(this.image ,this.x,this.y,Fruit.width,Fruit.height);

		kanvas.restore();
				
	}
}


class Row{

	constructor(x,y){
		this.x=x;
		this.y=y;
		this.fruits=[];
		for(let i=0;i<number_of_fruits;i++){
			var fruit = new Fruit( this.x , this.y + (i*Fruit.height) , i+2, document.getElementById('icon'+i.toString()) )
			this.fruits.push(fruit);
		}
		this.size = this.y+this.fruits.length*Fruit.height;
	}

	draw(){
		var row_caller = this;
		this.fruits.forEach(function(element){
			element.draw(row_caller);
		})

	}

	spinWheel(j){

			var wheel = this;
			var move = j;
			//calls draw for every fruit in Row moved for j value
			for(let i=0;i<wheel.fruits.length;i++){

					wheel.fruits[i].draw(wheel,move);
			}

	}

}

class Slot{

	constructor(){
		this.kredit = 5000;
		this.bet = 5;
		this.income = 0;
		this.width=window.innerWidth;
		this.height=window.innerHeight;
		this.x_row_position = this.width*8/100;
		this.y_row_position = this.height*1/20-Fruit.height/2;
		this.rows = [];
		for(let i=0;i<number_of_rows;i++)
			this.rows.push(new Row( this.x_row_position+i*Fruit.width*155/100 , this.y_row_position ));
	}

	draw(){
		for(let i=0;i<this.rows.length;i++){
			for(let j=0;j<this.rows[i].fruits.length;j++)
				this.rows[i].fruits[j].draw();
		}
	}

	spinSlot(){

	kanvas.beginPath();
  	kanvas.rect(0, 0, window.innerWidth, window.innerHeight);
  	kanvas.clip();
	
  	kanvas.save();

	for(let i = 0 ; i < this.rows.length ; i++ ){
		for(let j=0;j<this.rows[i].fruits.length;j++){

			//random number for index in initial_fruits to get image and value
			let random_fruit_index = Math.floor(Math.random()*number_of_fruits);

			let new_random_fruit = new Fruit(this.rows[i].x , this.rows[i].y+j*Fruit.height, initial_fruits[random_fruit_index].value,initial_fruits[random_fruit_index].image )

			this.rows[i].fruits[j] = new_random_fruit;
		}
	}

	var slotScope = this;

	//seting intervals to move fruits in every row
	for(let j=0;j<Fruit.height;j+=1){
		for(let i = 0 ; i < this.rows.length ; i++ ){
				var interval = setInterval(function(element){ 
					slotScope.rows[i].spinWheel(Fruit.height/10); 
				},5);
				interval_value.push(interval);
			}
		}
		
	}

	drawWholeSlot(){

	kanvas.save();

	kanvas.drawImage(slotMachineBackground,0,0,this.width,this.height);
	
	//drawing data about current state of slot
	let responsive = window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight;

	kanvas.font = "bold "+responsive*(1/25).toString()+"px Comic Sans MS";
	kanvas.fillStyle = "rgb(255,255,255)";
	kanvas.textAlign = "end";
	kanvas.fillText(this.kredit.toString(), kanvas.width*90/100, kanvas.height*65/100);

	kanvas.font = "bold "+responsive*(1/25).toString()+"px Comic Sans MS";
	kanvas.fillStyle = "rgb(255,255,255)";
	kanvas.textAlign = "end";
	kanvas.fillText(this.bet.toString(), kanvas.width*60/100, kanvas.height*65/100);

	kanvas.font = "bold "+responsive*(1/25).toString()+"px Comic Sans MS";
	kanvas.fillStyle = "rgb(255,255,255)";
	kanvas.textAlign = "end";
	kanvas.fillText( this.income.toString(), kanvas.width*30/100, kanvas.height*65/100);

	kanvas.beginPath();
  	kanvas.rect(window.innerWidth*8/100, window.innerHeight*1/20, Fruit.width*3+window.innerWidth*52/100, Fruit.height*4);
  	kanvas.clip();
		
	this.draw();

	kanvas.restore();

	}

	calculateIncome(){

		//order fruits by their y position
		for(let i=0;i<this.rows.length;i++)
			this.rows[i].fruits.sort(function(a, b){return a.y - b.y});

		let lowest_position = this.rows[0].y;

		for(let i=0;i<this.rows.length;i++){
				for(let j=0;j<this.rows[i].fruits.length;j++){
					this.rows[i].fruits[j].y=lowest_position+Fruit.height*j;
				}
			}
		//we make array of verticals and horizontals which contains array of values
		//so after we insert values in arrays we check if array contains same values
		//and if it does we add that value multiplied by bet to income, diagonals are
		//separated arrays so we walk through each of them and do the same thing
		var verticals = [];
		var horizontals = [];
		let current_income = 0;
		let first_diagonal = [];
		let second_diagonal = [];
		let vertical_array = [];
		let horizontals_array = [];
		for(let i=0;i<this.rows.length;i++){
			for(let j=1; j < this.rows.length+1 ;j++){
				vertical_array.push(this.rows[i].fruits[j].value);
				horizontals_array.push(this.rows[j-1].fruits[i+1].value);
				if(i==(j-1)){
					first_diagonal.push(this.rows[i].fruits[j].value);
				}
				if(i+(j-1)==(number_of_rows-1))
					second_diagonal.push(this.rows[i].fruits[j].value);
			}
			verticals.push(vertical_array);
			horizontals.push(horizontals_array);
			vertical_array=[];
			horizontals_array=[];
		}

		verticals.forEach(function(element){
			var element_value = element[0];
			var add_value = 1;
			element.forEach(function(element_of_array){
				if(element_of_array!==element_value)
					add_value = 0;
			})
			if(add_value)
				current_income+=(element_value*slotMachine.bet);
		})

		horizontals.forEach(function(element){
			var element_value = element[0];
			var add_value = 1;
			element.forEach(function(element_of_array){
				if(element_of_array!==element_value)
					add_value = 0;
			})
			if(add_value)
				current_income+=(element_value*slotMachine.bet);
		})

		let element_value_first_diagonal = first_diagonal[0];
		let add_value_first = 1;
		first_diagonal.forEach(function(element_of_array){
		if(element_of_array!==element_value_first_diagonal)
			add_value_first = 0;
		})
		if(add_value_first)
			current_income+=(element_value_first_diagonal*slotMachine.bet);


		let element_value_second_diagonal = second_diagonal[0];
		let add_value_second = 1;
		second_diagonal.forEach(function(element_of_array){
		if(element_of_array!==element_value_second_diagonal)
			add_value_second = 0;
		})
		if(add_value_second)
			current_income+=(element_value_second_diagonal*slotMachine.bet);


		verticals.length=0;
		horizontals.length=0;
		console.log(current_income);

		this.income+=current_income;
		this.kredit+=this.income;
		//if player won, we play winning music 
		if(this.income>0)
			jackpot.play();

		this.drawWholeSlot();
  		this.income=0;

	}

}
