'use strict';

/* Controllers */

//JStructure.controller('Controller' , function($scope) 
function Controller($scope) {

	//costanti
	$scope.costanti = new Gruppo();
	$scope.costanti.elencoDirezioni= new Array();
	$scope.costanti.elencoDirezioni.push(new Direzione(0,"Orizzontale"));
	$scope.costanti.elencoDirezioni.push(new Direzione(1,"Verticale"));
	$scope.costanti.elencoDirezioni.push(new Direzione(2,"Rotazionale"));
	
	//input geometria
	$scope.problema = new Gruppo();
	$scope.problema.elencoNodi = new Array();
	$scope.problema.indiceProssimoNodo = 0;
	$scope.problema.elencoAste = new Array();
	$scope.problema.indiceProssimaAsta = 0;
	$scope.problema.elencoMateriali = new Array();
	$scope.problema.indiceProssimoMateriale = 0;
	$scope.problema.elencoSezioni = new Array();
	$scope.problema.indiceProssimaSezione = 0;

	//input condzioni
	$scope.problema.elencoVincoli = new Array();
	$scope.problema.indiceProssimoVincolo = 0;
	$scope.problema.elencoAsservimenti = new Array();
	$scope.problema.indiceProssimoAsservimento = 0;
	$scope.problema.elencoNodali = new Array();
	$scope.problema.indiceProssimoNodale = 0;
	$scope.problema.elencoDistribuiti = new Array();
	$scope.problema.indiceProssimoDistribuito = 0;


	//dati di calcolo
	$scope.calcolo = new Gruppo();

	//grafica
	$scope.mostraNodo = true;
	$scope.mostraLabelNodo = true;
	$scope.mostraAsta = true;
	$scope.mostraLabelAsta = true;
	$scope.mostraVincoli = true;
	$scope.mostraNodali = true;


	$scope.addNodo = function() {
		if(isNumber($scope.coordinataX) && isNumber($scope.coordinataY)) {
			var nuovoNodo = new Nodo($scope.problema.indiceProssimoNodo,
									 $scope.coordinataX, 
									 $scope.coordinataY);
			$scope.problema.elencoNodi.push(nuovoNodo);
			$scope.problema.indiceProssimoNodo = $scope.problema.indiceProssimoNodo + 1;
		}
	}

	$scope.addMateriale = function() {
		var nuovoMateriale = new Materiale($scope.problema.indiceProssimoMateriale,
										  $scope.NomeMateriale,
										  $scope.E,
										  $scope.nu,
										  $scope.alfa,
										  $scope.gamma)
		$scope.problema.elencoMateriali.push(nuovoMateriale);
		$scope.problema.indiceProssimoMateriale = $scope.problema.indiceProssimoMateriale + 1;
	}

	$scope.addSezione = function() {
		var nuovaSezione = new Sezione($scope.problema.indiceProssimaSezione,
									  $scope.NomeSezione,
									  $scope.A,
									  $scope.I,
									  $scope.h,
									  $scope.xi)
		$scope.problema.elencoSezioni.push(nuovaSezione);
		$scope.problema.indiceProssimaSezione = $scope.problema.indiceProssimaSezione + 1;
	}

	$scope.addAsta = function() {
		if($scope.nodo1Asta!= null && $scope.nodo2Asta!= null && $scope.nodo1Asta !== $scope.nodo2Asta) {
			if($scope.nodo1Asta > $scope.nodo2Asta) {
				var temp = $scope.nodo1Asta
				$scope.nodo1Asta = $scope.nodo2Asta;
				$scope.nodo2Asta = temp;
			}
			var nuovaAsta = new Asta($scope.problema.indiceProssimaAsta,
									 '',
									 getItemfromId($scope.nodo1Asta,$scope.problema.elencoNodi), 
									 getItemfromId($scope.nodo2Asta,$scope.problema.elencoNodi),
									 getItemfromId($scope.materialeAsta,$scope.problema.elencoMateriali),									 
									 getItemfromId($scope.sezioneAsta,$scope.problema.elencoSezioni));
			$scope.problema.elencoAste.push(nuovaAsta);
			$scope.problema.indiceProssimaAsta = $scope.problema.indiceProssimaAsta + 1;
		}
	}

	$scope.addVincolo = function() {
		if($scope.nodoVincolo!= null && $scope.direzioneVincolo!= null ) {
			var nuovoVincolo = new Vincolo($scope.problema.indiceProssimoVincolo,
											getItemfromId($scope.nodoVincolo,$scope.problema.elencoNodi), 
											getItemfromId($scope.direzioneVincolo,$scope.costanti.elencoDirezioni));
			$scope.problema.elencoVincoli.push(nuovoVincolo);
			$scope.problema.indiceProssimoVincolo = $scope.problema.indiceProssimoVincolo + 1;
		}
	}

	$scope.addNodale = function() {
		if($scope.nodoNodale!= null && $scope.direzioneNodale!= null ) {
			var nuovoNodale = new Nodale($scope.problema.indiceProssimoNodale,
											getItemfromId($scope.nodoNodale,$scope.problema.elencoNodi), 
											getItemfromId($scope.direzioneNodale,$scope.costanti.elencoDirezioni),
											$scope.intensitaNodale);
			$scope.problema.elencoNodali.push(nuovoNodale);
			$scope.problema.indiceProssimoNodale = $scope.problema.indiceProssimoNodale + 1;
		}
	}

	$scope.preparaJSON = function()	{
		var data = "text/json;charset=utf-8,";
		data = data + JSON.stringify($scope.problema);
		//data = data + JSON.stringify($scope.calcolo);
		var link = "<a href='data:" + data + "'' download='data.json'>download JSON</a>";
		alert("generazione completata");
		document.getElementById("downloadJSON").innerHTML += link;
	}

	$scope.caricaJSON = function() {
		var JSONproblema = JSON.parse($scope.jsontext);

		$scope.problema = new Gruppo();

		//input geometria
		$scope.problema.elencoNodi = new Array();
		$scope.problema.elencoAste = new Array();
		$scope.problema.elencoMateriali = new Array();
		$scope.problema.elencoSezioni = new Array();
		$scope.problema.indiceProssimoNodo = JSONproblema.indiceProssimoNodo;
		$scope.problema.indiceProssimaAsta = JSONproblema.indiceProssimaAsta;
		$scope.problema.indiceProssimoMateriale = JSONproblema.indiceProssimoMateriale;
		$scope.problema.indiceProssimaSezione = JSONproblema.indiceProssimaSezione;

		//input condzioni
		$scope.problema.elencoVincoli = new Array();
		$scope.problema.indiceProssimoVincolo = JSONproblema.indiceProssimoVincolo;
		$scope.problema.elencoAsservimenti = new Array();
		$scope.problema.indiceProssimoAsservimento = JSONproblema.indiceProssimoAsservimento;
		$scope.problema.elencoNodali = new Array();
		$scope.problema.indiceProssimoNodale = JSONproblema.indiceProssimoNodale;
		$scope.problema.elencoDistribuiti = new Array();
		$scope.problema.indiceProssimoDistribuito = JSONproblema.indiceProssimoDistribuito;
		
		$(JSONproblema.elencoNodi).each(function(){ 
			$scope.problema.elencoNodi.push(new Nodo(this.Id, 
													 this.Punto.CoorX, 
													 this.Punto.CoorY)) });

		$(JSONproblema.elencoMateriali).each(function(){ 
			$scope.problema.elencoMateriali.push(new Materiale( this.Id,
																this.Nome,
																this.ModuloYoung,
																this.ModuloPoisson,
																this.CoeffDilatazioneTerm,
																this.PesoSpecifico)) });

		$(JSONproblema.elencoSezioni).each(function(){ 
			$scope.problema.elencoSezioni.push(new Sezione( this.Id,
															this.Nome,
															this.Area,
															this.MomentoInerzia,
															this.Altezza,
															this.FattoreTaglio)) });
		$(JSONproblema.elencoAste).each(function(){ 
			$scope.problema.elencoAste.push(new Asta(this.Id, 
													 this.nome, 
													 getItemfromId(this.Nodo1.Id,$scope.problema.elencoNodi), 
													 getItemfromId(this.Nodo2.Id,$scope.problema.elencoNodi),
													 getItemfromId(this.Materiale.Id,$scope.problema.elencoMateriali),
													 getItemfromId(this.Sezione.Id,$scope.problema.elencoSezioni))) 
		});

		$(JSONproblema.elencoVincoli).each(function(){ 
			$scope.problema.elencoVincoli.push(new Vincolo(this.Id, 
													 getItemfromId(this.Nodo.Id,$scope.problema.elencoNodi), 
													 getItemfromId(this.Direzione.Id,$scope.costanti.elencoDirezioni))) 
		});

		$(JSONproblema.elencoNodali).each(function(){ 
			$scope.problema.elencoNodali.push(new Nodale(this.Id,
											getItemfromId(this.Nodo.Id,$scope.problema.elencoNodi), 
											getItemfromId(this.Direzione.Id,$scope.costanti.elencoDirezioni),
											this.Intensita))
		});

	}

	$scope.risolvi = function() {
		//Matrice GDL
		InizializzaMatriceGDL($scope.calcolo, $scope.problema.elencoNodi);
		ApplicaVincoliRigidiGDL($scope.calcolo, $scope.problema.elencoVincoli);
		ApplicaAsservimentiGDL($scope.calcolo, $scope.problema.elencoAsservimenti);
		NumerazioneGDL($scope.calcolo, $scope.problema.elencoAsservimenti);

		//Rigidezza globale
		$scope.calcolo.matriceRigidezzaGlobale = InizializzaMatricceRigidezzaGlobale($scope.calcolo);

		//calcolo rigidezza locale
		$($scope.problema.elencoAste).each( function() {
			var matriceRigidezzaLocale = CalcolaRigidezza($scope.calcolo,this)
			var matriceTrasformazione = CalcoloMatriceTrasformazione($scope.calcolo,this)

			//salvarmi le 2 matrici da qualche parte per la risalita agli sforzi

			var matriceRigidezzaLocaleTrasformata = ProdottoMatriciale(
													ProdottoMatriciale(matriceTrasformazione,
																		matriceRigidezzaLocale)
													,Matricetrasposta(matriceTrasformazione));

			var vettoreGDLAsta = DeterminaGDLAsta($scope.calcolo,this);


			IncasellaMatriceLocvaleInGlobale($scope.calcolo,matriceRigidezzaLocaleTrasformata,vettoreGDLAsta);
		});
		MyLog($scope.calcolo.matriceRigidezzaGlobale);

		//Vettore delle forze globale
		$scope.calcolo.vettoreCarichiGlobale = [];
		for (var i = 0; i < $scope.calcolo.numeroGDL; i++) $scope.calcolo.vettoreCarichiGlobale[i] = 0;

		//calcolo vetore delle forze locale
		//each carico nodale
		$($scope.problema.elencoNodali).each( function() {
			$scope.calcolo.vettoreCarichiGlobale[$scope.calcolo.matriceGDL[this.Nodo.Id][this.Direzione.Id]] = this.Intensita;
			MyLog($scope.calcolo.vettoreCarichiGlobale);
		})

		//TODO: each carico distribuito

		//TODO: applicazione cedimenti

		//soluzione del sistema
		//inizializzo vettore degli spostamenti 
		$scope.calcolo.vettoreSpostamenti = [];
		RisolviSistemaLineare($scope.calcolo.matriceRigidezzaGlobale,$scope.calcolo.vettoreSpostamenti,$scope.calcolo.vettoreCarichiGlobale)

		//ricostruzione degli sforzi

	}
	//TODO: Disegnare deformata
	//TODO: Disegnare azioni interne
  }







