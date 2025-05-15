//conexión a la BD y para luego crear el modelo
import { Schema, model, connect } from "mongoose"

process.loadEnvFile()

const URI_DB = process.env.URI_DB || ""

const connectMongoDb = async () => {
  try {
    await connect(URI_DB)
    console.log("✅ Conectado a MongoDB")
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB")
  }
}

interface IGrandSlamTournament {
    name: 'Australian Open' | 'Roland-Garros' | 'Wimbledon' | 'US Open';
    year: number;
    surface: 'Hard' | 'Clay' | 'Grass';
    location: 'Australia' | 'France' | 'England' | 'USA';
    menSinglesChampion: string;
    womenSinglesChampion: string;
}

const GrandSlamTournamentSchema = new Schema({
  name: { type: String, required: true, unique: true, enum: ['Australian Open', 'Roland-Garros', 'Wimbledon', 'US Open'] },
  year: { type: Number, required: true },
  surface: { type: String, required: true, enum: ['Hard', 'Clay', 'Grass'] },
  location: { type: String, required: true, enum: ['Australia', 'France', 'England', 'USA'] },
  menSinglesChampion: { type: String; required: true },
  womenSinglesChampion: { type: String; required: true }
}, {
  versionKey: false
})


//conexión a la BD
  connectMongoDb()