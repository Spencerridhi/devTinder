const {MongoClient} = require ("mongodb");

const url= "mongodb+srv://spencer:Sinny%40123@learnnode.xp90v7u.mongodb.net/devTinder";
const client = new MongoClient(url);

const dbName= "dB2";

async function main() {
    await client.connect();
    console.log("db successfully connected");
    const db= client.db(dbName);
    const collection= db.collection("User");
// Insert one document
    // const data={fName:"Spencer", lName:"chaug", email:"spencer.chaug@example.com"};
    // const insertResult = await collection.insertMany([data]);
    // // console.log("Document inserted:", insertResult);

    // Read all documents
    const finAllData = await collection.find({}).toArray();
    console.log(finAllData);

    // Update a document
    // const UpdateData= await collection.updateOne({}, {$set: {lName:"Chaugh"}});
    // console.log("Document updated:", UpdateData);

    const UpdateData= await collection.updateOne({}, {$set: {phone:"1234567890"}});
    console.log("Document updated:", UpdateData);
    return "done";
}
main()
.then(console.log)
.catch(console.error)
.finally(client.close());