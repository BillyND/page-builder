import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// Define the type for the cached mongoose connection
interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Add mongoose to the NodeJS global type
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: Cached | undefined;
}

// Initialize cached connection
const cached: Cached = global.mongooseCache || { conn: null, promise: null };

// Save the cached connection to global
if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export default dbConnect;
