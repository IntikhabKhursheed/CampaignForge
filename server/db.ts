import { MongoClient, Db, Document } from "mongodb";

let client: MongoClient | undefined;
let cachedDb: Db | undefined;

export async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || "campaignforge";
  if (!uri) {
    throw new Error("MONGODB_URI must be set to use the database");
  }
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  if (!cachedDb) {
    cachedDb = client.db(dbName);
  }
  return cachedDb;
}

export async function getCollection<T extends Document>(name: string) {
  const db = await getDb();
  return db.collection<T>(name);
}
