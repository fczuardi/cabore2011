card_visual_order = [0, 1, 2]; //de baixo para cima
card_css_top_values_for_slot = [154, 102, 50]; //valores para o top em cada um dos slots imaginários

function init(){	
	//aplica onClick nas cartas
	$('#carta-0 a').click(function(){
		changeCardOrder(0);
	});
	$('#carta-1 a').click(function(){
		changeCardOrder(1);
	});
	$('#carta-2 a').click(function(){
		changeCardOrder(2);
	});
}

function changeCardOrder(id){
	//descobre o index do card em questão no array de ordem das cartas
	var index = $.inArray(id, card_visual_order);

	if(card_visual_order[index] != card_visual_order[card_visual_order.length - 1]){
		//altera a ordem do array
		var removed_element = card_visual_order.splice(index, 1);
		card_visual_order.push(removed_element[0]);
		//atualiza a posição e o z-index
		updateCardPosition();		
	} else {
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

//chama o init quando carregar o DOM
$(init);