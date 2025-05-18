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
// Definición del esquema

interface IGrandSlam {
    name: 'Australian Open' | 'Roland-Garros' | 'Wimbledon' | 'US Open'
    year: number
    surface: 'Hard' | 'Clay' | 'Grass'
    location: 'Australia' | 'France' | 'England' | 'USA'
    menSinglesChampion: string
    womenSinglesChampion: string
}
const GrandSlamSchema = new Schema({
name: {type: String,required: true,enum: ['Australian Open', 'Roland-Garros', 'Wimbledon', 'US Open']}, 
year: {type: Number,required: true, min: 1877},
surface: {type: String,required: true,enum: ['Hard', 'Clay', 'Grass']},
location: {type: String,required: true},
menSinglesChampion: {type: String,required: true},
womenSinglesChampion: {type: String,required: true} 
}, {
versionKey: false
})

const GrandSlam = model("GrandSlam", GrandSlamSchema)

// Crear un nuevo torneo en la base de datos:nuevo documento.
const addNewGrandSlam = async (newGrandSlam: IGrandSlam) => {
  try {
    const { name, year, surface, location,menSinglesChampion,womenSinglesChampion } = newGrandSlam
    if (!name || !year || !surface || !location || !menSinglesChampion || !womenSinglesChampion) {
      return { success: false, error: "invalid data" }
    }

    const newFileToDb = new GrandSlam({ name, year, surface, location, menSinglesChampion, womenSinglesChampion })
    await newFileToDb.save()
    return {
      success: true,
      data: newFileToDb,
      message: "tournament added successfully"
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Obtener todos los documentos de la colección:todos los torneos Grand Slams jugados en los últimos 10 años (2015-2024).
const getGrandSlams = async () => {
  try {
    const GrandSlams = await GrandSlam.find()
    return {
      success: true,
      data: GrandSlams,
      message: "tournaments successfully recovered"
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
}

// Obtener un documento por su ID.
const getGrandSlam = async (id: string) => {
  try {
    const foundGrandSlam = await GrandSlam.findById(id)
    if (!foundGrandSlam) {
      return {
        success: false,
        message: "tournament not found"
      }
    }

    return {
      success: true,
      data: foundGrandSlam,
      message: "tournament successfully recovered"
    }
  } catch (error) {

  }
}

// Actualizar un documento existente.
const updateGrandSlam = async (id: string, newData: Partial<IGrandSlam>) => {
  try {
    const updatedGrandSlam = await GrandSlam.findByIdAndUpdate(id, newData, { new: true })
    if (!updatedGrandSlam) return { succes: false, message: "tournament not found" }

    return {
      success: true,
      data: updatedGrandSlam,
      message: "tournament successfully updated"
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
}

// Eliminar un documento por su ID.
const deleteGrandSlam = async (id: string) => {
  try {
    const deletedGrandSlam = await GrandSlam.findByIdAndDelete(id)
    if (!deletedGrandSlam) return { success: false, message: "tournament not found" }
    return {
      success: true,
      data: deletedGrandSlam,
      message: "tournament successfully deleted"
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message
    }
  }
}


//conexión a la BD
const main = async () => {
  connectMongoDb()

  // const savedGrandSlam = await addNewGrandSlam({ "name": "Australian Open","year": 2025,"surface": "Hard","location": "Australia","menSinglesChampion": "Jannik Sinner","womenSinglesChampion": "Madison Keys" })
  const GrandSlam = await getGrandSlams()
  // const GrandSlam = await getGrandSlam("6829398440c7b7f771afa89e")
  // const updatedGrandSlam = await updateGrandSlam("6829398440c7b7f771afa8b4", { menSinglesChampion:Cancelled due to Pandemic })
  // const deletedGrandSlam = await deleteGrandSlam("6829398440c7b7f771afa8c5")

  console.log(GrandSlams)
}

main()