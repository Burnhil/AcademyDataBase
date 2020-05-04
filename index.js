import mongoose from 'mongoose';  //import your packages 
//import Admin from "./administration.js";

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
const BedTransaction = mongoose.model("BedTransaction", BedTransaction, "BedTransaction");

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



const main = async() => {


}

//calling the main entry point
main();