card_visual_order = [0, 1, 2]; //de baixo para cima
card_css_top_values_for_slot = [154, 102, 50]; //valores para o top em cada um dos slots imaginários

function init(){	
	//aplica onClick nas cartas
	$('#carta-0 a').click(function(event){
    event.preventDefault();  
		changeCardOrder(0);
	});
	$('#carta-1 a').click(function(event){
    event.preventDefault();  
		changeCardOrder(1);
	});
	$('#carta-2 a').click(function(event){
    event.preventDefault();  
		changeCardOrder(2);
	});
}

function picTouchStart(event){
  event.preventDefault();
  var index = $(event.target).data('index');
	changeCardOrder(index);
}

function changeCardOrder(id){
	//descobre o index do card em questão no array de ordem das cartas
	var index = $.inArray(id, card_visual_order);

  //ignora se ja estiver rolando animacao
  if ($('#carta-'+id).queue('fx').length > 0){return false};
  

	if(card_visual_order[index] != card_visual_order[card_visual_order.length - 1]){
		//altera a ordem do array
		var removed_element = card_visual_order.splice(index, 1);
		card_visual_order.push(removed_element[0]);
		
		//atualiza a posição e o z-index
		// updateCardPosition();
		updateCardPositionAnimated(750);		
	} else {
		//
		console.log("não preciso trabalhar, senhor");
	}
}

function updateCardPosition(){
	//percorre as cartas
	for(var i=0; i< card_visual_order.length; i++){
		var cardId = card_visual_order[i];
		//ajusta a posição das cartas de acordo com as instruções do array
		$('#carta-' + cardId).css("top", card_css_top_values_for_slot[i]);
		//ajusta o z-index
		$('#carta-' + cardId).css("z-index", i);
	}
}

fila1 = $({});

function updateCardPositionAnimated(time){
	var default_x = 100;
	var offset_x = 176 + 10;
	if(Math.random() > .5){offset_x *= -1}
	var out_x = default_x + offset_x;
	//percorre as cartas
	for(var i=0; i< card_visual_order.length; i++){
		var cardId = card_visual_order[i];
		var carta = $('#carta-' + cardId);
		var meioCaminho = (card_css_top_values_for_slot[i] + carta.position().top)/2;
		
		if(i == card_visual_order.length - 1){
			//anima o top até a metade do caminho
			carta.animate( {
				'top': [meioCaminho, 'linear'],
				'left': [out_x, 'easeInOutQuart']
				}, time * .4);

			//ajusta o z-index
			carta.animate( {
				'z-index':i
				}, 0);

			//anima o top até a posição final
			carta.animate( {
				'top': [card_css_top_values_for_slot[i], 'linear'],
				'left': [default_x, 'easeInOutQuart']
				}, time * .6);
		} else {
			//anima o top até a metade do caminho
			carta.animate( {
				'top': [meioCaminho, 'easeInQuart']
				}, time * .5);

			//ajusta o z-index
			carta.animate( {
				'z-index':i
				}, 0);

			//anima o top até a posição final
			carta.animate( {
				'top': [card_css_top_values_for_slot[i], 'easeOutQuart']
				}, time * .5);		
		}
	}
}

//chama o init quando carregar o DOM
$(init);