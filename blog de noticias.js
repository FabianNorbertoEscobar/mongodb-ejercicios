use blogNoticias;
db;
show collections;

db.createCollection("autor", {
	validator: {
		$and: [
			{nombre: {$type: "string"}},
			{cuenta: {$type: "string"}},
			{descripcion: {$type: "string"}}
		]
	}
});

db.autor.insert({
	_id: "Frank_blog",
	nombre: "Frank",
	cuenta_twitter: "Frank_USE",
	descripcion: "blogger aficionado",
	telefono: [73128989, 43278984],
	direccion: {
		calle: "Av. de los Castros",
		numero: 2256,
		cp: 39005,
		ciudad: "Santander"
	}
});

db.autor.insert({
	_id: "Peter_blog",
	nombre: "Peter",
	cuenta_twitter: "Pete",
	descripcion: "blogger aficionado",
	telefono: [808080, 4323424],
	direccion: {
		calle: "Av. de los Castros",
		numero: 289,
		cp: 39005,
		ciudad: "Santander"
	}
});

db.autor.find({});

db.autor.createIndex({"nombre": 1}, {unique: true});
db.autor.createIndex({"cuenta_twitter": 1}, {unique: true});

db.autor.createIndex({"cp": 1}, {sparse: true});

db.createCollection("noticia");

db.noticia.insert({
	titulo: "Noticia de impacto",
	cuerpo: "cuerpo de la noticia",
	fecha: new Date("2014-10-21"),
	tags: ["A","B"],
	autor: "Frank_blog"
});

db.noticia.find({});

db.noticia.createIndex({"titulo": 1});
db.noticia.createIndex({"autor": 1});
db.noticia.createIndex({"fecha": -1});

//retornar al autor com id Frank_blog
db.autor.find({_id: "Frank_blog"});

//listar los autores llamados Peter
db.autor.find({nombre: "Peter"});

//listar nombre y cuenta de twitter de los autores con cp mayor a 39005
db.autor.find({cp: {$gt: 39005}}, {_id: false, nombre: true, cuenta_twitter: true});

//listar la cantidad de noticias publicadas por cada autor
db.noticia.aggregate([{$group: {_id: "$autor", "noticias": {$sum: 1}}}]);

//listar las diez últimas noticias publicadas
db.noticia.find({}).sort({fecha:-1}).limit(10);

//listar las noticias publicadas en marzo o abril del 2018
db.noticia.find({fecha: {$gte: new Date("2018-03-01"), $lte: new Date("2018-04-30")}});

//listar la cantidad de personas que tiene cada cd
db.autor.aggregate([{$group: {_id: "$direccion.cp", "personas": {$sum: 1}}}]);

//listar los titulos y autores de las noticias que no tengan algún comentario
db.noticia.find({comentario: {$exists: false}}, {_id: false, titulo: true, autor: true});

//agregar el teléfono 1526895654 al usuario de twitter pastrolcata
db.autor.update({cuenta_twitter: "pastrolcata"}, {$push: {telefono: 1526895654}});