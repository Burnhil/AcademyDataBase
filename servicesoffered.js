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

//set the defined schema as a model for Mongoose to use
const newUser = mongoose.model("User", User, "Administration"); // "namd of model", schemaObject, "name of collection in DB"
const newProvider = mongoose.model("Provider", Provider, "Provider"); 
const newServicesOffered = mongoose.model("ServicesOffered", ServicesOffered, "ServicesOffered"); 

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


const getAllServicesOffered = async() => {
    // use a try catch becuase of IO code
    try{
        // the moduleObject.find() will return a document or documents if no filter is specified.
        await newServicesOffered.find().exec((err, newServicesOffered) => {
            if(err){
                console.log(err);
            }
            //if we don't have an error, do something with them
            console.log({ newServicesOffered });
        });
    }catch(err){
        console.log(err);
    }
}


const getServicesOfferedBySearch = async(searchCriteriaObj) => {  // searchCriteriaObj is going to be a JSON object containing the keys and values to search against.
    try {
        return newServicesOffered.find(searchCriteriaObj).exec();   // return the Promsie that will contain the ServicesOffered searched for.
    }
    catch (err) {
        console.log(err);
    }
}

const addServicesOffered = async(userObj) => {
    try {
        //create a ServicesOffered document based off ServicesOffered object
        const addServicesOffered = new newServicesOffered(userObj); 

        //setting up promise to use to show insertion of document 
        let savePromise = addServicesOffered.save();   
        savePromise.then((addServicesOfferedDoc) => {
            //print out insertion doc
            console.log(`The addServicesOffered doc is saved and now has the id of ${addServicesOfferedDoc.id} and added to the ServicesOffered collection.`);
        });
    }
    catch (err) {
        console.log(err);
    }
}

const updateServicesOffered = async(id) => {   // the id parameter is the exact _id value 
    try {
        // 1.) Find the actual document to modify
        // 2.) change that document
        // 3.) save the modified document
        let foundServicesOfferedDoc = await newServicesOffered.findById(id).exec();  // the await keyword resolves the Promise returned by exec() and gets the actual value out it and stores it in foundTreeDoc
        foundServicesOfferedDoc.AvaliableBeds = 7;
        let updatePromise = foundServicesOfferedDoc.save(); // We really don't need to return this particular Promise returned by save() because it would return what we just updated.
        // If you want something ot happen when this update occurs, use then() on that Promise
        updatePromise.then((theUpdatedServicesOffered) => {
            console.log(`Updated ServicesOffered doc with avaliablebeds of ${theUpdatedServicesOffered.id}`);
        });
    }
    catch (err) {
        console.log(err);
    }
}

const deleteServicesOffered = async(theActualServicesOfferedDocObj) => {  // ServicesOffered is a ServicesOffered document being passed in for deletion
    // delete the passed ServicesOffered document
    try {
        let deletePromise = theActualServicesOfferedDocObj.deleteOne();  // this is the Promise for deleting this one ServicesOffered document.
        // if you want to do something after based on the delete, use then()
        deletePromise.then(() => {
            console.log(`The ServicesOffered doc with id of ${theActualServicesOfferedDocObj.id} is deleted.`);
        });
    }
    catch (err) {
        console.log(err);
    }
}

const main = async() => {
    // call your other async functions here
    // you can also write regular JS code here as well

    let aNewServicesOffered = {

        AvaliableBeds: 10,
        TotalBeds: 20,
        VolunteerOpportunities: 5,
        VolunteersNeeded: 2,
        ServiceType: "Food",
        ServicesDescription: "Clothing, Beds, Food",
        CriteriaForService: "ID",
        WarmingStation: "yes"
    }

    try{
        
        await connectToDB();
        await getAllServicesOffered();
        await addServicesOffered(aNewServicesOffered);

        let searchServicesOfferedArray = await getServicesOfferedBySearch({ WarmingStation: "yes" });
        console.log(`Users found by name = ${searchServicesOfferedArray}`);

        if (searchServicesOfferedArray.length > 0){
            await updateServicesOffered(searchServicesOfferedArray[0].id)
        }

        let searchServicesOfferedArrry1 = await getServicesOfferedBySearch({ ServiceType: "Food" });
        console.log(`We will delete the ServicesOffered doc with id of ${searchServicesOfferedArrry1[0].id}`);
        await deleteServicesOffered(searchServicesOfferedArrry1[0]);

    }catch(err){
        console.log(err);   // It's a good idea to surround any async function calls in a try/catch block
    }
    


}

//calling the main entry point
main();