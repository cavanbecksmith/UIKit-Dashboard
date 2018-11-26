export default class Widget {
	constructor(){

		this.actions = [
				"GROUP_CHAT",
				"POST_BOARDS",
				"TEXT_BLOCK", 
				"CODE_BLOCK"
		];

		this.handleAction("GROUP_CHAT");

	}

	handleAction(input){
		if(this.actions.includes(input)){
			console.log("We found a match here");
		}
	}

}