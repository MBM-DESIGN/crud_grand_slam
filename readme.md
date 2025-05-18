Los torneos de Grand Slam de tenis son los cuatro eventos anuales más prestigiosos del circuito profesional.Y se desarrollan en la modalidad: singles y dobles, femenino, masculino y mixto. Juego tenis desde los 5 años y me encanta seguir el circuito.Por la motivación que me produce, lo elegí como tema.

El objetivo del trabajo es implementar un CRUD (Create, Read, Update, Delete) en MongoDB utilizando Typescript y Mongoose, sin necesidad de crear una API.Voy hacer el CRUD primero desde la terminal de MONGOSH y exportar el resultado de las queries a un archivo en Visual Studio (VS).Y luego voy hacer el CRUD desde el backend y quedará el código guardado en VS.

La base de datos (BD) se llama db-grand-slam y hace referencia a los 4 torneos anuales de tenis más importantes:'Australian Open' | 'Roland-Garros' | 'Wimbledon' | 'US Open'.
"Tournaments" es el nombre de la collection o entidad haciendo referencia a estos 4.Y en los campos o propiedades elegidas están: name: nombre del torneo, year: año del campeonato, surface: superficie en que se jugó, location: país adonde se jugaron los partidos, menSinglesChampion: campeón de single masculino y womenSinglesChampion: campeona de single femenino.Podría agregar en un futuro, los campeones de dobles femenino, masculino y mixto.Pero para mantener la simplicidad de la base de datos, no incluyo estas modalidades en esta oportunidad.

El esquema representará la información de un evento específico de Grand Slam en un año determinado.El archivo tournaments.json contiene información completa de los torneos de Grand Slam de los últimos 10 años (2015-2024), con las propiedades solicitadas y sin incluir \_id.Puesto que cuando importo este archivo a MongoDB Compass, este gestor de BD le genera un \_Id a cada registro.También he incluido el torneo de Wimbledon 2020, que fue cancelado debido a la pandemia de COVID-19, indicando "Cancelled" en los campos de los campeones.

Cuando implemento las funciones CRUD en la terminal MONGOSH,utilizo los siguientes comandos:
use db-grand-slam para switchearme en la base sobre la que voy a trabajar.
db.tournaments.find();
Obtengo el listado completo de todos los torneos de Grand Slam de tenis de los últimos 10 años con las propiedades cargadas en cada uno (con el comando db-grand-slam>it podemos ver del año 2019 en adelante).

1.CREATE:para crear un nuevo documento en la base de datos:
db.tournamets.insertOne({
"name": "Australian Open",
"year": 2025,//Uso este año porque la BD llegaba hasta el 2024.
"surface": "Hard",
"location": "Australia",
"menSinglesChampion": "Jannik Sinner",
"womenSinglesChampion": "Madison Keys"
});
La operación 1 fue procedad con éxito y se le asignó la siguiente Id.
{
acknowledged: true,
insertedId: ObjectId('682a308cb01ef6d370e42d89')
}

2.READ:para obtener (de forma presentable) el nuevo documento agregado a la colección:
db.tournamets.find({\_id:ObjectId('682a308cb01ef6d370e42d89')}).pretty();
La operación 2 fue procedad con éxito y se mostró el nuevo registro.

3.UPDATE:para actualizar un documento existente anexando el motivo de su cancelación:
db.tournaments.updateOne(
{ "name": "Wimbledon", "year": 2020 }, //Criterio para encontrar el torneo que fue cancelado.
{ $set: {
"menSinglesChampion": "Cancelled due to Pandemic",
"womenSinglesChampion": "Cancelled due to Pandemic"
}
}
);
La operación 3 fue procedad con éxito y se modificaron los resultados de 2 campos ("menSinglesChampion","womenSinglesChampion")sin asignar nuevo Id.
{
acknowledged: true,
insertedId: null,
matchedCount: 1,
modifiedCount: 1,
upsertedCount: 0
}

4.DELETE:para eliminar el último documento añadido.No lo voy hacer por su Id ya que el torneo que quiero eliminar es el único del año 2025.Y cuando lo llamo por su nombre y por su año, no hay otros documentos que coincidan.
db.tournaments.deleteOne({ "name": "Australian Open", "year": 2025 });
La operación 4 fue procedad con éxito y se borró.
{
acknowledged: true,
deletedCount: 0
}

Cuando implemento las funciones CRUD contenidas en el archivo:index.ts, parto de la siguiente estructura del modelo.
interface IGrandSlam {
name: string; //nombre del torneo:'Australian Open' | 'Roland-Garros' | 'Wimbledon' | 'US Open';
year: number; //año en que se jugó el torneo.
surface: string; //superficie de la cancha de tenis:'Hard' | 'Clay' | 'Grass';
location: string; //país donde se realiza:'Australian' | 'France' | 'England' | 'USA';
menSinglesChampion: string; //nombre del campeón masculino.
womenSinglesChampion: string; //nombre de la campeona femenina.
}

El esquema del modelo es:
const GrandSlamSchema = new Schema({
name: {type: String,required: true,enum: ['Australian Open', 'Roland-Garros', 'Wimbledon', 'US Open']}, //asegura que el nombre sea uno de los 4 Grand Slams.
year: {type: Number,required: true, min: 1877}, //año de inicio de Wimbledon, como un punto de referencia histórico.
surface: {type: String,required: true,enum: ['Hard', 'Clay', 'Grass']}, //las superficies típicas
location: {type: String,required: true},
menSinglesChampion: {type: String,required: true}, //asumimos que siempre hay un campeón.
womenSinglesChampion: {type: String,required: true} //asumimos que siempre hay una campeona.
}, {
versionKey: false
})

Las funciones disponibles son:
✅Conectar a la Base de Datos: await connectMongoDb()
✅Agregar torneo: await addNewGrandSlam({ name, year, surface, location,menSinglesChampion, womenSinglesChampion })
📜Obtener todos los torneos Grand Slams jugados en los últimos 10 años (2015-2024): await getGrandSlams()
📃Obtener un Grand Slam por su ID: await getGrandSlam(id)
✏️Actualizar un torneo de Grand Slam: await updateGrandSlam(id, { year: 2020 })
🔥Eliminar torneo de Grand Slam: await deleteGrandSlam(id)
