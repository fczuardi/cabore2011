/* Author: 

*/
var sombra_bg = '<div id="sombra-top"><img src="img/sombra-top.png" /></div><div id="sombra-bottom"><img src="img/sombra-bottom.png" /></div>';
var estrela_ie = '<span style="font-family:Wingdings;font-size:16px;">¬</span>';

function init(){
  var is_ie_6 = $('html').hasClass('ie6');
  if (!is_ie_6){ 
    $('body').append(sombra_bg); 
  }
  if ($.browser.msie){
    $('nav a.vegas').html(estrela_ie+' '+$('nav a.vegas').html()+' '+estrela_ie); 
    $('html').addClass('ie');
  } else{
    $('html').addClass('notie');
  }
}
$(init);




















