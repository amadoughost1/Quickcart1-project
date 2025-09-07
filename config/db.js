import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}
async function connectDB() {
    try {
        if (cached.conn) {
            return cached.conn;
        }

        if (!cached.promise) {
            const opts = {
                bufferCommands: false,
            }

            // Vérifier que MONGODB_URI est définie
            if (!process.env.MONGODB_URI) {
                throw new Error('MONGODB_URI environment variable is not defined');
            }

            cached.promise = mongoose.connect(`${process.env.MONGODB_URI}/quickcart`, opts).then((mongoose) => {
                return mongoose;
            });
        }

        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        console.error('Database connection error:', error);
        // Réinitialiser le cache en cas d'erreur
        cached.conn = null;
        cached.promise = null;
        throw error;
    }
}

export default connectDB;