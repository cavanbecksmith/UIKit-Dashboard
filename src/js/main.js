import {FirebaseLogin, FirebaseWatchUser, FirebaseSignOut, UserLoggedIn} from './components/Firebase.js';
import {FA_ICONS, DUMMY_LOGIN, DUMMY_DATA} from './constants.js';
import Widget from './components/Widget.js';

new Widget;

class App{

	constructor(){
		window.app = this;
		this.init();
	}

	// --- Initial setup function
	init(){
		this.setupFirebase();
		this.start();
	}

	// --- Creates the code list
	start(){

	}

	setupFirebase(){
		FirebaseWatchUser();
		FirebaseLogin(DUMMY_LOGIN[0], DUMMY_LOGIN[1]);
	}

	logout(){
		FirebaseSignOut();
	}
}

new App();