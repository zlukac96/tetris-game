const TetrisWidth = 10;
const TetrisHeight = 20;
const TetrisDimensions = TetrisHeight * TetrisWidth;
var gridContent = [];
var gridContentTemp = [];
var oldGridContent = [];

const tetrominoes = {
	shape:[
	[[1,0],[1,1],[1,2],[1,3]], // [y,x]     Itetromino
	[[0,0],[0,1],[1,0],[1,1]], //           Otetromino
	[[0,0],[0,1],[0,2],[1,1]], //           Ttetromino
	[[0,0],[1,0],[1,1],[1,2]], //           Jtetromino
	[[0,2],[1,0],[1,1],[1,2]], //           Ltetromino
	[[0,1],[0,2],[1,0],[1,1]], //           Stetromino
	[[0,0],[0,1],[1,1],[1,2]]  //           Ztetromino
	],
	name: [
		"Itetromino",
		"Otetromino",
		"Ttetromino",
		"Jtetromino",
		"Ltetromino",
		"Stetromino",
		"Ztetromino"
	]
};

var activeTetromino = tetrominoes.shape[0];
var activeTetrominoColor = "Itetromino";
var xTetrominoPosition = 0;
var yTetrominoPosition = 0;
var yTetrominoProjection = 0;


function cloneMatrix(inputMatrix = [[]]){
	var outputMatrix = [];
	for (let j = 0; j < inputMatrix.length; j++) {
		outputMatrix.push([]);
		for (let i = 0; i < inputMatrix[j].length; i++) {
			outputMatrix[j].push(inputMatrix[j][i]);
		}
	}
	return outputMatrix;
}


function initialization(){
	
	let getGridContainer = document.getElementById("TetrisGridContainer");
	
	for(let j = 0; j < TetrisHeight; j++){
		gridContent.push([]);
		let tableRow = document.createElement("tr");
		for(let i = 0; i < TetrisWidth; i++){
			gridContent[j].push("E");
			let tableData = document.createElement("td");
			tableData.id = "pixel-" + j + "x" + i;
			tableRow.appendChild(tableData);
		}
		getGridContainer.appendChild(tableRow);
	}
	
	gridContentTemp = cloneMatrix(gridContent);
	oldGridContent = cloneMatrix(gridContent);
}

function displayGridContent() {

	for(let j = 0; j < TetrisHeight; j++){

		for(let i = 0; i < TetrisWidth; i++){
			
			if(gridContentTemp[j][i] !== oldGridContent[j][i]){
				let pixelTemp = document.getElementById("pixel-" + j + "x" + i);
				if(gridContentTemp[j][i] !== "E") pixelTemp.className = gridContentTemp[j][i];
				else pixelTemp.className = "";
				oldGridContent[j][i] = gridContentTemp[j][i];
			}
			
		}
	}
	
	//oldGridContent = cloneMatrix(gridContentTemp);
	
}

function rotateTetromino(tetromino, direction = "clockwise") {
	
	let maxNumber=0;
	let tetrominoMatrix = [];
	let tetrominoOutput = [];
	for (let i=0; i<tetromino.length; i++) {
		if (tetromino[i][0] > maxNumber) maxNumber = tetromino[i][0];
		if (tetromino[i][1] > maxNumber) maxNumber = tetromino[i][1];
	}
	
	
	for(let j = 0; j <= maxNumber; j++){
		tetrominoMatrix.push([]);
		for(let i = 0; i <= maxNumber; i++){
			tetrominoMatrix[j].push(0);
			for(let t = 0; t < tetromino.length; t++){
				if(tetromino[t][0] === j &&
				   tetromino[t][1] === i) {
					   tetrominoMatrix[j][i] = 1;
				}
			}
		}
	}
	
	if (direction === "clockwise") tetrominoMatrix = tetrominoMatrix[0].map((val, index) => tetrominoMatrix.map(row => row[index]).reverse());
	else tetrominoMatrix = tetrominoMatrix[0].map((val, index) => tetrominoMatrix.map(row => row[index])).reverse();

	for(let j=0; j<tetrominoMatrix.length; j++){
		for(let i=0; i<tetrominoMatrix[j].length; i++){
			if(tetrominoMatrix[j][i] === 1) tetrominoOutput.push([j,i]);
		}
	}
	
	return tetrominoOutput;
}

function isEmptyCheck(){
	var isAdded = false;
	var isAddedProjection = false;
	var numberOfAdded = 0;
	var numberOfAddedProjection = 0;
	var gridContentOld = cloneMatrix(gridContentTemp);
	
	gridContentTemp = cloneMatrix(gridContent);

	for(let t = 0; t < activeTetromino.length; t++){

				if (gridContent[activeTetromino[t][0] + yTetrominoProjection] !== undefined) {
					if (gridContent[activeTetromino[t][0] + yTetrominoProjection][activeTetromino[t][1] + xTetrominoPosition] === "E") {
						gridContentTemp[activeTetromino[t][0] + yTetrominoProjection][activeTetromino[t][1] + xTetrominoPosition] = activeTetrominoColor[0] + "projection";
						numberOfAddedProjection++;
					}
				}
				
				if (gridContent[activeTetromino[t][0] + yTetrominoPosition] !== undefined) {
					if (gridContent[activeTetromino[t][0] + yTetrominoPosition][activeTetromino[t][1] + xTetrominoPosition] === "E") {
						gridContentTemp[activeTetromino[t][0] + yTetrominoPosition][activeTetromino[t][1] + xTetrominoPosition] = activeTetrominoColor;
						numberOfAdded++;
					}
				}

	}
	
//displayGridContent();
	if (numberOfAdded >= 4) {
		isAdded = true;
		if (numberOfAddedProjection >= 4) isAddedProjection = true;
		//displayGridContent();
	}
	else {
		gridContentTemp = cloneMatrix(gridContentOld);
	}
	//console.log(isAdded);
	//displayGridContent();
	return [isAdded, isAddedProjection];
}


function addActiveTetrominoToGrid(){
	console.time("test");
	yTetrominoProjection = yTetrominoPosition;
	var isAdded = isEmptyCheck()[0];
	
	while (isAdded === true) {
		if (isEmptyCheck()[1] === false) {
			yTetrominoProjection--;
			isEmptyCheck();
			break;
		}
		yTetrominoProjection++;
	}
	if (isAdded === true) displayGridContent();
	console.timeEnd("test");
	return isAdded;
}


function checkFullRows(){
	let numberOfFullElements = 0;
	for(let j = 0; j < gridContent.length; j++){
		numberOfFullElements = 0;
		for(let i = 0; i < gridContent[j].length; i++){
			if(gridContent[j][i] !== "E") numberOfFullElements++;
		}
		if (numberOfFullElements >= 10){
			
			

			for(let jj = j; jj > 0; jj--){
				for(let ii = 0; ii < gridContent[jj].length; ii++){
					gridContent[jj][ii] = gridContent[jj-1][ii];
				}
			}
			
			
			for (let ii=0; ii<gridContent[0].length; ii++) {
				gridContent[0][ii] = "E";
			}
			
			
		}
	}
}

function keyRecognize(event){
	//console.log(event.keyCode);

	if(event.keyCode === 37){
		xTetrominoPosition--;
		if (addActiveTetrominoToGrid() === false) xTetrominoPosition++;
	}
	
	if(event.keyCode === 38){

		activeTetromino = rotateTetromino(activeTetromino);
		
		let shifter = [ 1, -2, 3, -4, 2 ];
		let i=0;
		
		while (addActiveTetrominoToGrid() === false && i<5){
			xTetrominoPosition -= shifter[i];
			if (i === 4) activeTetromino = rotateTetromino(activeTetromino, "counterclockwise");
			i++;
		}

		
	}
	
	if(event.keyCode === 39){
		xTetrominoPosition++;
		if (addActiveTetrominoToGrid() === false) xTetrominoPosition--;
	}
	
	if(event.keyCode === 40){
		yTetrominoPosition++;
		
		if (addActiveTetrominoToGrid() === false) {
			yTetrominoPosition = 0;
			xTetrominoPosition = 3;
			gridContent = cloneMatrix(gridContentTemp);
			checkFullRows();
			
			let randomTetromino = Math.floor(Math.random()*7);
			
			activeTetromino = tetrominoes.shape[randomTetromino];
			activeTetrominoColor = tetrominoes.name[randomTetromino];

			
			addActiveTetrominoToGrid();
		}
	}
}

function gameRunning(){
	initialization();
	displayGridContent();
	addActiveTetrominoToGrid();
}


gameRunning();

document.onkeydown = keyRecognize;