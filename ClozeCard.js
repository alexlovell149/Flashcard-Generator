
// Cloze constructor
var Cloze = function(text, cloze) {
    // text
    this.text = text;
    // the letter that needs to be matched with the sentence
    this.cloze = this.text.match(/\(([^)]+)\)/)[1];
    // function allows us to see the letter we are taking out
    this.printCloze = function() {
        console.log(this.cloze);
    }
    // function allows us to see the sentence
    this.printText = function() {
        console.log(this.text);
    }

    this.message = this.text.replace('(' + this.cloze + ')', '________');
        console.log(this.message);
}

Cloze.prototype.printAnswer = function() {

    console.log('Incorrect. Here is the full sentence: \n' + this.text.replace(/[{()}]/g, ''));
}

module.exports = Cloze;