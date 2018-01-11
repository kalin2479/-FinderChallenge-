class busqueda{
	constructor(input_selector,button_search,file_json,cardGrid){
		this.url 		= file_json;
		this.input 		= document.getElementById(input_selector);
		this.button 	= document.getElementById(button_search);
		this.search 	= this.search.bind(this);
		this.content 	= cardGrid;
		this.codeKey 	= "";
		this.value 		= "";
		this.loadBook  	= this.loadBook.bind(this);
		// console.log(this.input);
		$(this.input).val("");
		this.bindEvents();
		this.autoComplete(input_selector);
		this.loadBook();
	}
	autoComplete(input){
		var ajax = new XMLHttpRequest();
		// console.log(this.url);
		ajax.open("GET", this.url , true);
		ajax.onload = function() {
			// console.log(JSON.parse(ajax.responseText));
			var list = JSON.parse(ajax.responseText).data.map(function(i) {
				// console.log(i);
				return i.title;
			});
			// console.log(list);
			new Awesomplete(document.querySelector("#"+input),{
				minChars: 3,
				maxItems: 7,
				list: list
			});
		};
		ajax.send();
	}
	bindEvents(){
		this.button.addEventListener("click",()=>{
			this.value = this.input.value;
			this.get(this.url)
			.then(results => {
				this.build(results)
			});
		});
		this.input.addEventListener("keyup",()=>{
			// if(this.input.value == this.value || this.input.value.length < 3){
			if(this.input.value.length < 3){
				//console.log($(this.button).attr('disabled'));
				$(this.button).attr('disabled','disabled');
				return;
			}
			if($(this.button).attr('disabled')){
				$(this.button).removeAttr('disabled');
			}

		});
		this.input.addEventListener("keypress",(e)=>{
			this.value = this.input.value;
			if (e.keyCode == 13) e.preventDefault();
			this.codeKey = e.keyCode;
			this.search();
		});
	}
	buildAll(response){
		//this.datalist.innerHtml = "";
		// console.log(response.data);
		var htmlPost = '';
		var count = 0;
		response.data.forEach(item =>{
			count++;
			if (count < 10){
				htmlPost+='<div class="card">';
				htmlPost+='<figure>';
				htmlPost+='<img src="'+item.image+'" alt="">';
				htmlPost+='</figure>';
				htmlPost+='<hgroup>';
				htmlPost+='<h3>'+item.title+'</h3>';
				htmlPost+='<p>'+item.teaser+'</p>';
				htmlPost+='</hgroup>';
				htmlPost+='</div>';
			}
		});
		$("#"+this.content).html(htmlPost);
	}
	build(response){
		//this.datalist.innerHtml = "";
		// console.log(response.data);
		var htmlPost = '';
		var count = 0;
		response.data.forEach(item =>{
			// console.log(item)
			var buscar = this.value.toUpperCase();
			var cadena = item.title.toUpperCase();
			// console.log(buscar);
			if (cadena.indexOf(buscar) > -1 ){
				count++;
				if (count < 10){
					htmlPost+='<div class="card">';
					htmlPost+='<figure>';
					htmlPost+='<img src="'+item.image+'" alt="">';
					htmlPost+='</figure>';
					htmlPost+='<hgroup>';
					htmlPost+='<h3>'+item.title+'</h3>';
					htmlPost+='<p>'+item.teaser+'</p>';
					htmlPost+='</hgroup>';
					htmlPost+='</div>';
				}
			}
		});
		$("#"+this.content).html(htmlPost);
	}
	search(){
		// console.log(this.value+" >>> " + this.value.length);
		if ( this.codeKey == 13 && this.value.length > 2){
			this.get(this.url)
			.then(results => {
				this.build(results)
			});
		}else{
			if (this.codeKey == 13){
				$(".errorMsje").fadeIn("slow");
				$(".errorMsje p").html("No se puede realizar la búsqueda, dado que hay menos de 3 caracteres.");
			}
		}
	}
	loadBook(){
		this.get(this.url)
		.then(results => {
			this.buildAll(results)
		});
	}
	get(url){

		var xhr = new XMLHttpRequest();

		xhr.open("GET",url);

		xhr.send();

		return new Promise((resolve, reject) => {
			xhr.onreadystatechange = () => {
				if (xhr.readyState == 4){
					if (xhr.status == 200){
						// todo salio bien
						return resolve(JSON.parse(xhr.responseText));
					}else{
						// salio mal
						reject(xhr.status);
					}
				}
			}
		});
	}
}





(function(){
	objForm = new busqueda('libro','buscar','./dist/data/books-schema.json','cardGrid');
	$(".close").click(function(){
		$(".errorMsje").fadeOut("slow");
	});
})();
