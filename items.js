db.items.find();
var bulk = db.items.initializeUnorderedBulkOp();
bulk;
bulk.insert({item: "mesa", valor: 5000, existencia: 2});
bulk.insert({item: "fuente", valor: 300, existencia: 10});
bulk.insert({item: "maseta", valor: 150, existencia: 16});
bulk.insert({item: "escoba", valor: 200, existencia: 5});
bulk.insert({item: "silla", valor: 600, existencia: 20});
db.items.find();
bulk;
bulk.find({});
bulk.execute();
bulk;
db.items.find();
var b = db.items.initializeOrderedBulkOp();
b;
b.find({item: "abc123"}).remove();
b.find({item: "caja", valor: 50}).remove();
b.find({item: "escoba"}).update({$inc: {existencia: 10}});
b.execute();
b;
db.items.find();
db.items.aggregate([{
    $facet: {
        "nums": [{
                $bucket: {
                    groupBy: "$valor",
                    boundaries: [0, 200, 400, 600, 800, 1000],
                    output: {
                        "prom": {$avg: "$valor"},
                        "count": {$sum: "$existencia"}
                    }
                }
            }
        ]
    }
}]);
db.createCollection("descs");
db.descs.insert({item: "caja", material: "papel madera"});
db.descs.insert({item: "silla", material: "plastico"});
db.descs.insert({item: "mesa", material: "madera"});
db.descs.insert({item: "escoba", material: "paja"});
db.descs.insert({item: "fuente", material: "porcelana"});
db.descs.insert({item: "botellas", material: "vidrio"});
db.descs.insert({item: "latas", material: "aluminio"});
db.descs.insert({item: "maseta", material: "ceramica"});
db.descs.find();
db.items.aggregate([{
    $lookup: {
        from: "descs",
        localField: "item",
        foreignField: "item",
        as: "desc"
    }
}]);
