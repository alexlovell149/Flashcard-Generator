var BasicCard = function(front,back) {
	this.front = front;
	this.back = back;

}

BasicCard.prototype.printCard = function() {
	console.log("Front: " + this.front + "," + "\nBack: " +this.back);

}

BasicCard.prototype.printFront = function() {
	console.log(this.front);
}

BasicCard.prototype.printAnswer = function() {
	console.log("Sorry the right answer is: " + this.back);
}

module.exports = BasicCard;




































module.exports = BasicCard;