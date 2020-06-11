function Punto(x,y)
{
	this.CoorX = x;
	this.CoorY = y;
}
function Nodo(id,x,y)
{
	this.Id = id;
	this.Punto = new Punto(x,y);

	this.getDescription = function(){
		return this.Id + ': (' + this.Punto.CoorX + ', ' +  this.Punto.CoorY + ')';
	}
}

function Materiale(id,nome,E,nu,alfa,gamma) 
{
	this.Id=id;
	this.Nome = nome;
	this.ModuloYoung = E;
	this.ModuloPoisson = nu;
	this.CoeffDilatazioneTerm = alfa;
	this.PesoSpecifico = gamma; 
}

function Sezione(id,nome,A,I,h,chi)
{
	this.Id=id;
	this.Nome = nome;
	this.Area = A;
	this.MomentoInerzia = I;
	this.Altezza = h;
	this.FattoreTaglio = chi;

}

function Asta(id,nome,nodo1,nodo2,materiale,sezione)
{
	this.Id = id;
	this.Nome = nome;
	this.Nodo1 = nodo1;
	this.Nodo2 = nodo2;
	this.Materiale = materiale;
	this.Sezione = sezione;

	this.DeltaX = function() {
		return this.Nodo2.Punto.CoorX - this.Nodo1.Punto.CoorX;
	}
	this.DeltaY = function() {
		return this.Nodo2.Punto.CoorY - this.Nodo1.Punto.CoorY;
	}
	this.Lunghezza = function() {
		return Math.sqrt(Math.pow(this.DeltaX(),2) + Math.pow(this.DeltaY(),2));
	}
	this.Seno = function() {
		return this.DeltaY()/this.Lunghezza();
	}
	this.Coseno = function() {
		return this.DeltaX()/this.Lunghezza();
	}

}

function Direzione(c,d)
{
	this.Id = c;
	this.Descrizione = d;
}


function Vincolo(id,nodo,direzione)
{
	this.Id = id;
	this.Nodo = nodo;
	this.Direzione = direzione;
}

function Asservimento(id,nodoMaster,nodoSlave,direzione)
{
	this.Id = id;
	this.NodoMaster = nodoMaster;
	this.NodoSlave = nodoSlave;
	this.Direzione = direzione;
}

function Nodale(id,nodo,direzione, intensita)
{
	this.Id = id;
	this.Nodo = nodo;
	this.Direzione = direzione;
	this.Intensita = intensita;
}

function Gruppo()
{}

