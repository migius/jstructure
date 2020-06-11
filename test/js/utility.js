//UI

document.getElementById('JSONFile').addEventListener('change', readFile, false);

function readFile (evt) {
	var files = evt.target.files;
	var file = files[0];           
	var reader = new FileReader();
	reader.onload = function() {
		//caricaJSON(this.result)
		$('#jsontext').val(" " + this.result);            
	}
	reader.readAsText(file)
}

$('#myTab a').click(function (e) {
	e.preventDefault()
	$(this).tab('show')
})


//Logical

function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

function getItemfromId(id,NodeList){
	return NodeList.filter( function(item){return (item.Id==id);} )[0];
}

//Logger

function MyLog(text) {
	console.log(JSON.stringify(text));
}


//Math

function ProdottoMatriciale(matrice1,matrice2){	
	var matrice = []
	for(var i=0; i<matrice1.length; i++) {
		matrice[i] = [];
	}

	for(var i=0;i<matrice1.length;i++ ) {
		for(var j=0; j<matrice1.length;j++ ) {
			matrice[i][j] = 0;
			for(var k=0; k<matrice1[0].length;k++) {
				matrice[i][j] = matrice[i][j] + matrice1[i][k]*matrice2[k][j];
			}
		}
	}
	return matrice;
}

function Matricetrasposta(mat) {
	var matrice = [];

	for(var i=0; i<mat[0].length; i++ ) {
		matrice[i] = [];
		for(var j=0; j<mat.length; j++ ) {
			matrice[i][j] = mat[j][i];
		}
	}	
	return matrice;
}



function RisolviSistemaLineare(A,x,b) {

	//TODO, validazione input

	MyLog("Sistema da risolvere:");
	MyLog("A: ");
	MyLog(A);
	MyLog("x: ");
	MyLog(x);
	MyLog("b: ");
	MyLog(b);

	//inizializzo vettore soluzione con i valori del vettore dei termini noti
	x = b.slice(0);

	//riduzione gaussiana in avanti
	for(var i=0; i < x.length; i++ ) {
		for (var j = i+1; j < x.length; j++) {
			//divido tutta la riga per il termine diagonale:
			A[i][j] = A[i][j] / A[i][i];
		}
		//divido anche gli spostamenti per il termine diagonale:
		x[i] = x[i] / A[i][i];

		//triangolizzo la matrice A
		A[i][i] = 1;
		
		for (var jj = i+1; jj < x.length; jj++) {
			for (var kk = i+1; kk < x.length; kk++) {
				//divido tutta la riga per il termine diagonale:
				A[jj][kk] = A[jj][kk] - A[i][kk] * A[jj][i];
			}
			x[jj] = x[jj] - x[i] * A[jj][i];
			A[jj][i] = 0;
		}
	}

	//Sostituzione all'indietro	
	
	for(var iii=x.length-1 ; iii >= 0 ; iii-- ) {
		for (var kkk = iii+1; kkk < x.length; kkk++) {
			x[iii] = x[iii] - x[kkk] * A[iii][kkk];
		}
	}
	
	MyLog("Sistema risolto:");
	MyLog("x: ");
	MyLog(x);
}



