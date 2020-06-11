//Operazioni sulla matrice dei gradi di libertà
function InizializzaMatriceGDL(calcolo, elencoNodi) {
	var matriceGDL = [];
	for(var i=0; i<elencoNodi.length; i++) {
	    matriceGDL[i] = [];
	    for(var j=0; j<3; j++) {
	        matriceGDL[i][j] = 0;
	    }
	}
	calcolo.matriceGDL = matriceGDL;
}

function ApplicaVincoliRigidiGDL(calcolo,elencoVincoli) {
	for(var i=0; i<elencoVincoli.length;i++) {
		calcolo.matriceGDL[elencoVincoli[i].Nodo.Id][elencoVincoli[i].Direzione.Id] = -1;
	}
}

function ApplicaAsservimentiGDL(calcolo,elencoAsservimenti) {
	for(var i=0; i<elencoAsservimenti.length;i++) {
		calcolo.matriceGDL[elencoAsservimenti[i].NodoSlave.Id][elencoVincoli[i].Direzione.Id] = elencoAsservimenti[i].NodoMaster.Id;
	}
}

function NumerazioneGDL(calcolo) {
	var contatore = 0;
	for(var i=0; i<calcolo.matriceGDL.length; i++) {
	    for(var j=0; j<calcolo.matriceGDL[i].length; j++) {
	    	if( calcolo.matriceGDL[i][j] == 0 )
	    	{
		        calcolo.matriceGDL[i][j] = contatore;
		        contatore = contatore + 1;	    		
	    	}
	    	else if( calcolo.matriceGDL[i][j] > 0 ) {
	    		var master = calcolo.matriceGDL[i][j];
	    		calcolo.matriceGDL[i][j] = calcolo.matriceGDL[master][j];
	    	}
	    }
	}
	calcolo.numeroGDL = contatore;
	MyLog(calcolo.matriceGDL);
}

//Calcolo della matrice di rigidezza
function CalcolaRigidezza(calcolo,asta) {

	//asta
	var l = asta.Lunghezza();
	
	//materiale
	var E = asta.Materiale.ModuloYoung;
	var nu = asta.Materiale.ModuloPoisson;
	
	//sezione
	var A = asta.Sezione.Area;	
	var I = asta.Sezione.MomentoInerzia;
	var chi = asta.Sezione.FattoreTaglio;
	
	//Modulo rigidezza trasversale 
	var G = E / ( 2 * (1 + nu));
	
	//Coefficiente di deformabilità a taglio
	var fi = 12 * chi * (E / G) * (I / A) / Math.pow(l,2);
	
	//Matrice di rigidezza
	//init
	var matrice = [];
	for(var i=0; i<6; i++) {
	    matrice[i] = [];
		for(var j=0; j<6; j++) {
			matrice[i][j] = 0;
		}
	}

	//valorizzo
	matrice[0][0] = E * A / l;
	matrice[1][1] = 12 * E * (I / ((1+fi)*(Math.pow(l,3))));
	matrice[2][1] = 6 * E * (I / ((1+fi)*(Math.pow(l,2))));
	matrice[2][2] = (4+fi) * E * (I / ((1+fi)*l));
	matrice[5][2] = (2-fi) * E * (I / ((1+fi)*l));
	matrice[3][0] = - matrice[0][0];
	matrice[3][3] = matrice[0][0];
	matrice[4][1] = -matrice[1][1];
	matrice[4][4] = matrice[1][1];
	matrice[4][2] = -matrice[2][1];
	matrice[5][1] = matrice[2][1];
	matrice[5][4] = -matrice[2][1];
	matrice[5][5] = matrice[2][2];

	//Grazie alla simmetria
	for(var i=0; i<6; i++) {
		for(var j=i+1; j<6;j++) {
			matrice[i][j] = matrice[j][i];
		}
	}
	calcolo.matriceRigidezzaLocale = matrice;

	MyLog("Matrice di rigidezza locale asta n:" + asta.Id);
	MyLog(calcolo.matriceRigidezzaLocale);

	return matrice;
}

function CalcoloMatriceTrasformazione(calcolo,asta) {
	S = asta.Seno();
	C = asta.Coseno();

	var matrice = []
	for(var i=0; i<6; i++) {
		matrice[i] = [];
		for(var j=0; j<6; j++) {
			matrice[i][j] = 0;
		}
	}

	matrice[0][0] = C;
	matrice[0][1] = -S;
	matrice[1][0] = S;
	matrice[1][1] = C;
	matrice[2][2] = 1;
	matrice[3][3] = C;
	matrice[3][4] = -S;
	matrice[4][3] = S;
	matrice[4][4] = C;
	matrice[5][5] = 1;

	calcolo.matriceTrasformazione = matrice;
	
	MyLog("Matrice di trasformazione asta n:" + asta.Id);
	MyLog(calcolo.matriceTrasformazione);

	return matrice;

}

function InizializzaMatricceRigidezzaGlobale(calcolo) {
	var matrice = [];
	for(var i=0; i<calcolo.numeroGDL; i++) {
	    matrice[i] = [];
	    for(var j=0; j<calcolo.numeroGDL; j++) {
	        matrice[i][j] = 0;
	    }
	}

	return matrice;
}

function DeterminaGDLAsta(calcolo,asta) {
	var vettore = [];
	for(var i=0;i<3;i++) {
		vettore[i] = calcolo.matriceGDL[asta.Nodo1.Id][i];
		vettore[i+3] = calcolo.matriceGDL[asta.Nodo2.Id][i];
	}
	return vettore;
}

function IncasellaMatriceLocvaleInGlobale(calcolo,matriceLocale,vettoreGDL) {
	for(i=0; i< vettoreGDL.length; i++) {
		var iGlobale = vettoreGDL[i];
		if(iGlobale>= 0) {
			for(j=0; j< vettoreGDL.length; j++ ) {
				var jGlobale = vettoreGDL[j];
				if(jGlobale>= 0) {
					calcolo.matriceRigidezzaGlobale[iGlobale][jGlobale] = calcolo.matriceRigidezzaGlobale[iGlobale][jGlobale] + matriceLocale[i][j]
				}
			}			
		}
	}
}










