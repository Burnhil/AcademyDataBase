import mongoose from 'mongoose';  //import your packages 

// setting mongoose to global
mongoose.Promise = global.Promise;

// setting schema to global  
const Schema = mongoose.Schema;

// create variables for connection to MongoDB
const mongoDBUrl = "localhost"; //url
const mongoDBPort = "27017";    //port used
const mongoDBDatabase = "AcadameyDatabase"; //database name 

//create a schema object representing students
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

//set the defined schema as a model for Mongoose to use
const newUser = mongoose.model("User", User, "Administration"); // "namd of model", schemaObject, "name of collection in DB"

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


const getAll = async() => {
    // use a try catch becuase of IO code
    try{
        // the moduleObject.find() will return a document or documents if no filter is specified.
        await newUser.find().exec((err, Users) => {
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


const getUserBySearch = async(searchCriteriaObj) => {  // searchCriteriaObj is going to be a JSON object containing the keys and values to search against.
    try {
        return newUser.find(searchCriteriaObj).exec();   // return the Promsie that will contain the Trees searched for.
    }
    catch (err) {
        console.log(err);
    }
}

const addUser = async(userObj) => {
    try {
        //create a User document based off User object
        const addUser = new newUser(userObj); 

        //setting up promise to use to show insertion of document 
        let savePromise = addUser.save();   
        savePromise.then((addUserDoc) => {
            //print out insertion doc
            console.log(`The addUser doc is saved and now has the id of ${addUserDoc.id} and added to the Administration collection.`);
        });
    }
    catch (err) {
        console.log(err);
    }
}

const updateUser = async(id) => {   // the id parameter is the exact _id value 
    try {
        // 1.) Find the actual document to modify
        // 2.) change that document
        // 3.) save the modified document
        let foundUserDoc = await newUser.findById(id).exec();  // the await keyword resolves the Promise returned by exec() and gets the actual value out it and stores it in foundTreeDoc
        foundUserDoc.Email = "letsDoThis@yahoo.com";
        let updatePromise = foundUserDoc.save(); // We really don't need to return this particular Promise returned by save() because it would return what we just updated.
        // If you want something ot happen when this update occurs, use then() on that Promise
        updatePromise.then((theUpdatedUser) => {
            console.log(`Updated newUser doc with email of ${theUpdatedUser.id}`);
        });
    }
    catch (err) {
        console.log(err);
    }
}

const deleteUser = async(theActualUserDocObj) => {  // theActualTreeDocObj is a User document being passed in for deletion
    // delete the passed User document
    try {
        let deletePromise = theActualUserDocObj.deleteOne();  // this is the Promise for deleting this one Tree document.
        // if you want to do something after based on the delete, use then()
        deletePromise.then(() => {
            console.log(`The User doc with id of ${theActualUserDocObj.id} is deleted.`);
        });
    }
    catch (err) {
        console.log(err);
    }
}

const main = async() => {
    // call your other async functions here
    // you can also write regular JS code here as well

    let aNewUser = {
        FirstName: 'Tom',
        LastName: 'Sanders',
        Oraganization: 'Bed and Blankets',  
        PhoneNumber: '806-214-9852',        
        Email: 'something@gmail.com',       
        UserType: 'Provider',
        UserPassword: '***********',        
        LastLogin: "02/02/2020",
        Diabled: true 
    }

    try{
        
        await connectToDB();
        await getAll();
        await addUser(aNewUser);

        let searchUserArray = await getUserBySearch({ UserType: "Provider" });
        console.log(`Users found by name = ${searchUserArray}`);

        if (searchUserArray.length > 0){
            await updateUser(searchUserArray[0].id)
        }

        let searchUserArrry1 = await getUserBySearch({ LastName: "Sanders" });
        console.log(`We will delete the User doc with id of ${searchUserArrry1[0].id}`);
        await deleteUser(searchUserArrry1[0]);

    }catch(err){
        console.log(err);   // It's a good idea to surround any async function calls in a try/catch block
    }
    


}

//calling the main entry point
main();