# Prácticas de MongoDB

Ejercicios y apuntes para aprender a modelar, consultar y modificar datos con **MongoDB**, una base de datos NoSQL orientada a documentos. El repositorio reúne sesiones de consola, conjuntos de datos y ejemplos de consultas sobre personas, libros, inventario y un blog de noticias.

No es una aplicación web ni una API: los archivos son material de práctica para ejecutar y adaptar en una consola de MongoDB.

## Stack y conceptos

- **MongoDB**: bases de datos, colecciones y documentos almacenados en BSON.
- **Mongo shell / JavaScript**: consultas, variables, cursores y operaciones sobre las colecciones. Los apuntes registran una sesión con MongoDB shell 3.2.22; también hay ejemplos posteriores que utilizan funcionalidades de MongoDB 3.4.
- **MongoDB Database Tools**: `mongodump` y `mongorestore` para respaldos y restauración de datos BSON.
- **JSON y BSON**: datos de ejemplo y respaldos; además, una comparación conceptual de una consulta en SQL, MongoDB y XML/XQuery.

MongoDB permite que los documentos de una colección tengan estructuras diferentes y también permite definir reglas de validación. A diferencia de lo que afirmaba la descripción anterior de este repositorio, las versiones actuales admiten tanto transacciones como relaciones entre colecciones mediante etapas como `$lookup`; este último aparece en los ejercicios de inventario.

## Qué se practica

| Tema | Ejemplos |
| --- | --- |
| Operaciones básicas | Creación de bases y colecciones, inserción, búsqueda, actualización y eliminación de documentos. |
| Consultas | Filtros de comparación, expresiones regulares, proyecciones, ordenamiento, paginación y recorrido de cursores. |
| Documentos y arreglos | Campos anidados, notación de punto, `$elemMatch`, `$push`, `$addToSet`, `$pull` y `$slice`. |
| Agregaciones | Etapas `$match`, `$group`, `$project`, `$sort`, `$limit`, `$unwind` y `$out`; acumuladores como `$sum`, `$avg`, `$min` y `$max`. |
| Consultas entre colecciones | `$lookup` para relacionar artículos con sus descripciones; `$facet` y `$bucket` para agrupar valores en intervalos. |
| Validación e índices | Validadores de colección, índices únicos y dispersos, y análisis de consultas con `explain("executionStats")`. |
| Operaciones en lote | Inserciones, actualizaciones y eliminaciones con operaciones masivas ordenadas y no ordenadas. |
| Respaldo y restauración | Ejemplos de `mongodump`, `mongorestore` y archivos BSON con metadatos de colecciones. |

## Contenido del repositorio

| Archivo o carpeta | Contenido |
| --- | --- |
| `consultas.js` | Recorrido de comandos de consola: CRUD, arreglos, agregaciones, documentos anidados, validación e índices. |
| `personas1.js` | Creación de la colección `personas.persona` y carga masiva de documentos de ejemplo. |
| `personas2.js` | Consultas y pipelines sobre las personas: agrupaciones, proyecciones, estadísticas y análisis de etiquetas. |
| `personasABM.js` | Creación y carga inicial de una colección de personas para practicar altas, bajas y modificaciones. |
| `personas.json` | Conjunto de documentos de personas escrito con constructores de la shell, como `NumberInt()` e `ISODate()`. |
| `items.js` | Operaciones masivas, agrupación por intervalos y relación de artículos con descripciones. |
| `blog de noticias.js` | Modelo de autores y noticias, índices y consultas por autor, fecha y código postal. |
| `practicando mongoDB.txt` | Registro de una sesión interactiva, con comandos, resultados y errores de aprendizaje. |
| `backup-restore mongoDB.txt` | Registro de ejemplos de respaldo y restauración. |
| `comparación SQL, mongoDB, XML.txt` | Apunte comparativo de una consulta en distintos modelos de datos. |
| `dump/` | Respaldos BSON y metadatos de las bases de ejemplo, entre ellas `biblioteca`, `items`, `usuarios` y `trabajadores`. |

## Cómo empezar

1. Instalá [MongoDB Community Server](https://www.mongodb.com/docs/manual/administration/install-community/) y [mongosh](https://www.mongodb.com/docs/mongodb-shell/install/). Para respaldos y restauración instalá también [MongoDB Database Tools](https://www.mongodb.com/docs/database-tools/installation/installation/).
2. Iniciá el servidor según las instrucciones de tu sistema y conectate a una instancia local de prueba:

   ```sh
   mongosh "mongodb://localhost:27017"
   ```

3. En la consola, creá algunos datos y ejecutá una consulta:

   ```javascript
   use practica_mongodb

   db.items.insertMany([
     { item: "caja", valor: 100, existencia: 20 },
     { item: "caja", valor: 50, existencia: 25 },
     { item: "botella", valor: 50, existencia: 150 }
   ])

   db.items.aggregate([
     { $group: {
       _id: "$item",
       cantidad: { $sum: "$existencia" },
       precioPromedio: { $avg: "$valor" }
     } }
   ])
   ```

   El resultado agrupa los artículos por nombre y calcula la existencia total y el precio promedio. Para repetir la inserción sin duplicados, usá una base de prueba nueva o limpiá la colección de prueba de forma deliberada.

4. Explorá los archivos del repositorio y ejecutá **fragmentos seleccionados**, en orden y sobre las bases indicadas en cada ejemplo. Para practicar con el conjunto de personas, seleccioná `use personas` en la consola y ejecutá la inserción `db.persona.insertMany([...])` de `personas1.js`; luego probá los pipelines de `personas2.js`. La carga vuelve a insertar los documentos si se repite.

### Compatibilidad y precauciones

- Los archivos `.js` son apuntes de sesiones, no scripts garantizados para ejecutarse completos. Incluyen comandos interactivos como `use` y `show`, operaciones que dependen de pasos anteriores y algunos intentos con errores. Por ejemplo, el validador de autores en `blog de noticias.js` exige `cuenta`, pero los documentos de ejemplo contienen `cuenta_twitter`: hay que reconciliar ambos campos antes de insertar.
- Parte del material utiliza métodos históricos como `insert`, `update`, `remove` y `save`, o sintaxis y etapas que pueden variar entre versiones. En versiones actuales consultá la documentación y adaptá los ejemplos; para CRUD preferí, según corresponda, `insertOne`/`insertMany`, `updateOne`/`updateMany`, `replaceOne` y `deleteOne`/`deleteMany`.
- Aunque se llame `personas.json`, su contenido incluye constructores de la shell y **no es JSON estándar** ni Extended JSON listo para importar directamente con `mongoimport`.
- Trabajá en una instancia aislada y con datos descartables: hay ejemplos que modifican o eliminan colecciones completas, usan `dropDatabase()` o escriben resultados con `$out`. No los ejecutes sobre datos importantes.

## Respaldos

El directorio `dump/` contiene datos y metadatos de una sesión anterior. Por ejemplo, desde la raíz del repositorio podés intentar restaurar la base de libros en una instancia de prueba:

```sh
mongorestore --db biblioteca dump/biblioteca
```

La restauración escribe en `biblioteca` y puede producir errores de claves duplicadas si los documentos ya existen. Los respaldos y sus índices son antiguos, por lo que su compatibilidad depende de las versiones del servidor y de Database Tools; revisá la salida del comando y la documentación de la versión utilizada. No uses `--drop` sin entender que elimina las colecciones de destino antes de restaurarlas.

Para crear un respaldo nuevo de una base de práctica:

```sh
mongodump --db practica_mongodb --out respaldo
```

## Recorrido sugerido

1. Empezá por las operaciones básicas y los filtros de `consultas.js`.
2. Probá documentos anidados y arreglos con los ejemplos de alumnos y trabajadores.
3. Cargá las personas y explorá las etapas de agregación en `personas2.js`.
4. Continuá con los artículos, las relaciones y los índices del blog.
5. Revisá los registros de consola y practicá el respaldo y la restauración en una instancia descartable.

Para profundizar, consultá el [manual de MongoDB](https://www.mongodb.com/docs/manual/) y la [referencia de agregaciones](https://www.mongodb.com/docs/manual/aggregation/).
