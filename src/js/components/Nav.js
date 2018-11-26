const ACTIONS = [
	{id: 'TOGGLE_NAV', func: }
]

let NavInfo = {
	container: '.MAIN_NAV',
	items: [],
	getItems: () => {
		var elements = document.querySelectorAll('.MAIN_NAV li');
		Array.prototype.forEach.call(elements, function(el, i){
			console.log(el,i);
		});
	}
};

 


export {NavInfo};