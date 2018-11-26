import {log, Endlog, ContinueLog} from '../helpers';

let UserLoggedIn = null;

// --- Firebase login
const FirebaseLogin = (email, password) => {
	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
	  // Handle Errors here.
	  let errorCode = error.code;
	  let errorMessage = error.message;
	  log("Firebase Login: "+errorCode+" "+errorMessage);
	  // ...
	});
};

// --- Loops while waiting for user logged in response
function FirebaseLoginLoop(){
	var maxIterations = 20;
	let counter = 0;
	let userLoginLoop = setInterval(() => {
		counter++;
		console.log(counter);
		if(counter >= maxIterations){
			UserLoggedIn = null;
			counter = 0;
			alert("Session timed out...");
			clearInterval(userLoginLoop);
		}
		if(UserLoggedIn === null){
			console.log('user not logged in')
			// userLoginLoop();
		}
		else if(UserLoggedIn == true){
			console.log('User logged in!')
			clearTimeout(userLoginLoop);
		}
		else{
			console.log("User cannot login");
			clearTimeout(userLoginLoop);
		}
	}, 500);
}


// --- Watch when the state changes for the user
const FirebaseWatchUser = () => {
	FirebaseLoginLoop();
	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    // User is signed in.
	    var displayName = user.displayName;
	    var email = user.email;
	    var emailVerified = user.emailVerified;
	    var photoURL = user.photoURL;
	    var isAnonymous = user.isAnonymous;
	    var uid = user.uid;
	    var providerData = user.providerData;

	    console.log("USER INFO");
	    console.log("---------------");
	    console.log("DisplayName: ", displayName);
	    console.log("Email: ", email);
	    console.log("emailVerified: ", emailVerified);
	    console.log("photoURL: ", photoURL);
	    console.log("isAnonymous: ", isAnonymous);
	    console.log("uid: ", uid);
	    console.log("providerData: ", providerData);
	    UserLoggedIn = true;
	  } else {
	    UserLoggedIn = false;
	  }
	});

};

const FirebaseSignOut = () => {
	firebase.auth().signOut().then(function() {
	  // Sign-out successful.
	  console.log("User successfully signed out");
	}, function(error) {
	  // An error happened.
	  console.log(`Firebase tried to sign out and... 
	  	Decided to throw what looks like an error thingy...`)
	});
};


export {FirebaseLogin, FirebaseWatchUser, FirebaseSignOut, UserLoggedIn};