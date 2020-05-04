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

//set the defined schema as a model for Mongoose to use
const newUser = mongoose.model("User", User, "Administration"); // "namd of model", schemaObject, "name of collection in DB"
//set the defined schema as a model for Mongoose to use
const newProvider = mongoose.model("Provider", Provider, "Provider"); // "namd of model", schemaObject, "name of collection in DB"

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
const getAllProvider = async() => {
    // use a try catch becuase of IO code
    try{
        // the moduleObject.find() will return a document or documents if no filter is specified.
        await newProvider.find().exec((err, Users) => {
            if(err){
                console.log(err);
            }
            //if we don't have an error, do something with them
            console.log({ Users });
        });
    }catch(err){
        console.log(err);
    }
}


const getProviderBySearch = async(searchCriteriaObj) => {  // searchCriteriaObj is going to be a JSON object containing the keys and values to search against.
    try {
        return newProvider.find(searchCriteriaObj).exec();   // return the Promsie that will contain the Provider searched for.
    }
    catch (err) {
        console.log(err);
    }
}

const addProvider = async(userObj) => {
    try {
        //create a student document based off student object
        const addProvider = new newProvider(userObj); 

        //setting up promise to use to show insertion of document 
        let savePromise = addProvider.save();   
        savePromise.then((addProviderDoc) => {
            //print out insertion doc
            console.log(`The addProvider doc is saved and now has the id of ${addProviderDoc.id} and added to the Provider collection.`);
        });
    }
    catch (err) {
        console.log(err);
    }
}

const updateProvider = async(id) => {   // the id parameter is the exact _id value 
    try {
        // 1.) Find the actual document to modify
        // 2.) change that document
        // 3.) save the modified document
        let foundProviderDoc = await newProvider.findById(id).exec();  // the await keyword resolves the Promise returned by exec() and gets the actual value out it and stores it in foundTreeDoc
        foundProviderDoc.Email = "letsDoThis@yahoo.com";
        let updatePromise = foundProviderDoc.save(); // We really don't need to return this particular Promise returned by save() because it would return what we just updated.
        // If you want something ot happen when this update occurs, use then() on that Promise
        updatePromise.then((theUpdatedProviderr) => {
            console.log(`Updated Provider doc with email of ${theUpdatedProviderr.id}`);
        });
    }
    catch (err) {
        console.log(err);
    }
}

const deleteProvider = async(theActualProviderDocObj) => {  // theActualTreeDocObj is a Provider document being passed in for deletion
    // delete the passed Provider document
    try {
        let deletePromise = theActualProviderDocObj.deleteOne();  // this is the Promise for deleting this one Provider document.
        // if you want ot do something after based on the delete, use then()
        deletePromise.then(() => {
            console.log(`The Provider doc with id of ${theActualProviderDocObj.id} is deleted.`);
        });
    }
    catch (err) {
        console.log(err);
    }
}

const main = async() => {
    // call your other async functions here
    // you can also write regular JS code here as well

    let aNewProvider = {
  
        OrganizationName: "Safe Harbor",
        Email: "wellhome@yahoo.com",
        WebsiteInfo: "safeharbor.com",
        PhoneNumber: "806-258-9632",
        Address: "2547 Maple",
        City: "Amarillo",
        State: "Texas",
        County: "Potter"
    }

    try{
        
        await connectToDB();
        await getAllProvider();
        await addProvider(aNewProvider);

        let searchProviderArray = await getProviderBySearch({ State: "Texas" });
        console.log(`Users found by name = ${searchProviderArray}`);

        if (searchProviderArray.length > 0){
            await updateProvider(searchProviderArray[0].id)
        }

        let searchProviderArrry1 = await getProviderBySearch({ Address: "2547 Maple" });
        console.log(`We will delete the Provider doc with id of ${searchProviderArrry1[0].id}`);
        await deleteProvider(searchProviderArrry1[0]);

    }catch(err){
        console.log(err);   // It's a good idea to surround any async function calls in a try/catch block
    }
    


}

//calling the main entry point
main();