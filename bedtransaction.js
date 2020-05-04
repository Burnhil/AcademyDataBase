import mongoose from 'mongoose';  //import your packages 

// setting mongoose to global
mongoose.Promise = global.Promise;

// setting schema to global  
const Schema = mongoose.Schema;

// create variables for connection to MongoDB
const mongoDBUrl = "localhost"; //url
const mongoDBPort = "27017";    //port used
const mongoDBDatabase = "AcadameyDatabase"; //database name 

//create a schema object representing User
const User = new Schema({

    FirstName: { type: "String", required: true},
    LastName: { type: "String", required: true},
    Oraganization: { type: "String", required: true},
    PhoneNumber: { type: "String", required: true},
    Email: { type: "String", required: true},
    UserType: { type: "String", required: true},
    UserPassword: { type: "String", required: true},
    LastLogin: { type: Date, required: true},
    Diabled: { type: Boolean, required: true},

});

//create a schema object representing Providers
const Provider = new Schema({

    OrganizationName: { type: "String", required: true},
    Email: { type: "String", required: true},
    WebsiteInfo: { type: "String", required: true},
    PhoneNumber: { type: "String", required: true},
    Address: { type: "String", required: true},
    City: { type: "String", required: true},
    State: { type: "String", required: true},
    County: { type: "String", required: true}

});

//create a schema object representing ServicesOffered
const ServicesOffered = new Schema({

    AvaliableBeds: { type: "Number", required: true},
    TotalBeds: { type: "Number", required: true},
    VolunteerOpportunities: { type: "Number", required: true},
    VolunteersNeeded: { type: "Number", required: true},
    ServiceType: { type: "String", required: true},
    ServicesDescription: { type: "String", required: true},
    CriteriaForService: { type: "String", required: true},
    WarmingStation: { type: "String", required: true}

});

//create a schema object representing BedTransaction
const BedTransaction = new Schema({

    CurrentBedCount: { type: "Number", required: true},
    UpdatedBedCount: { type: "Number", required: true},
    DateTime: { type: "String", required: true}

});

//set the defined schema as a model for Mongoose to use
const newUser = mongoose.model("User", User, "Administration"); // "namd of model", schemaObject, "name of collection in DB"
const newProvider = mongoose.model("Provider", Provider, "Provider"); 
const newServicesOffered = mongoose.model("ServicesOffered", ServicesOffered, "ServicesOffered"); 
const newBedTransaction = mongoose.model("BedTransaction", BedTransaction, "BedTransaction");

// asynchronous functions to connect to DB
const connectToDB = async() => {
    //This function will extablish the connection to the MongoDB DBMS
    try {
        //try to connect to database
        const connectionInfo = `mongodb://${mongoDBUrl}:${mongoDBPort}/${mongoDBDatabase}`; //how we make our connection string
        const mongoDBConfigObject = {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        };

        //insert our connection string and jason file
        await mongoose.connect(connectionInfo, mongoDBConfigObject); 

    }catch (err){
        // show error code if unable to connect
        console.log(err);
    }
}


const getAllBedTransaction = async() => {
    // use a try catch becuase of IO code
    try{
        // the moduleObject.find() will return a document or documents if no filter is specified.
        await newBedTransaction.find().exec((err, newBedTransaction) => {
            if(err){
                console.log(err);
            }
            //if we don't have an error, do something with them
            console.log({ newBedTransaction });
        });
    }catch(err){
        console.log(err);
    }
}


const getBedTranactionBySearch = async(searchCriteriaObj) => {  // searchCriteriaObj is going to be a JSON object containing the keys and values to search against.
    try {
        return newBedTransaction.find(searchCriteriaObj).exec();   // return the Promsie that will contain the Provider searched for.
    }
    catch (err) {
        console.log(err);
    }
}

const addBedTransaction = async(userObj) => {
    try {
        //create a BedTransaction document based off BedTransaction object
        const addBedTransaction = new newBedTransaction(userObj); 

        //setting up promise to use to show insertion of document 
        let savePromise = addBedTransaction.save();   
        savePromise.then((addBedTranactionDoc) => {
            //print out insertion doc
            console.log(`The BedTransaction doc is saved and now has the id of ${addBedTranactionDoc.id} and added to the BedTransaction collection.`);
        });
    }
    catch (err) {
        console.log(err);
    }
}

const updateBedTransaction = async(id) => {   // the id parameter is the exact _id value 
    try {
        // 1.) Find the actual document to modify
        // 2.) change that document
        // 3.) save the modified document
        let foundBedTransactionDoc = await newBedTransaction.findById(id).exec();  // the await keyword resolves the Promise returned by exec() and gets the actual value out it and stores it in foundTreeDoc
        foundBedTransactionDoc.CurrentBedCount = 11;
        let updatePromise = foundBedTransactionDoc.save(); // We really don't need to return this particular Promise returned by save() because it would return what we just updated.
        // If you want something ot happen when this update occurs, use then() on that Promise
        updatePromise.then((theUpdatedBedTransaction) => {
            console.log(`Updated bed count ${theUpdatedBedTransaction.id}`);
        });
    }
    catch (err) {
        console.log(err);
    }
}

const deleteBedTranaction = async(theActualBedTranactionDocObj) => {  // theActualTreeDocObj is a Tree document being passed in for deletion
    // delete the passed Tree document
    try {
        let deletePromise = theActualBedTranactionDocObj.deleteOne();  // this is the Promise for deleting this one Tree document.
        // if you want ot do something after based on the delete, use then()
        deletePromise.then(() => {
            console.log(`The Beds doc with id of ${theActualBedTranactionDocObj.id} is deleted.`);
        });
    }
    catch (err) {
        console.log(err);
    }
}

const main = async() => {
    // call your other async functions here
    // you can also write regular JS code here as well

    let aNewBedTransaction = {

        CurrentBedCount: 5,
        UpdatedBedCount: 10,
        DateTime: "01-01-2015"
    }

    try{
        
        await connectToDB();
        await getAllBedTransaction();
        await addBedTransaction(aNewBedTransaction);

        let searchBedTransactionArray = await getBedTranactionBySearch({ DateTime: "01-01-2015" });
        console.log(`search by bed count = ${searchBedTransactionArray}`);

        if (searchBedTransactionArray.length > 0){
            await updateBedTransaction(searchBedTransactionArray[0].id)
        }

        let searchBedTransactionArrry1 = await getBedTranactionBySearch({ CurrentBedCount: 5 });
        console.log(`We will delete the bed doc with id of ${searchBedTransactionArrry1[0].id}`);
        await deleteBedTranaction(searchBedTransactionArrry1[0]);

    }catch(err){
        console.log(err);   // It's a good idea to surround any async function calls in a try/catch block
    }
    


}

//calling the main entry point
main();