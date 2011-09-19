/* Author: 

*/
var sombra_bg = '<div id="sombra-top"><img src="img/sombra-top.png" /></div><div id="sombra-bottom"><img src="img/sombra-bottom.png" /></div>';
var estrela_ie = '<span style="font-family:Wingdings;font-size:16px;">¬</span>';
var html_element,
    body_element;

function addBrowserClasses(){
  if ($.browser.msie){
    html_element.addClass('ie');
  } else{
    html_element.addClass('notie');
  }
}
function tweakContentForIE(){
  if ($.browser.msie){
    $('nav a.vegas').html(estrela_ie+' '+$('nav a.vegas').html()+' '+estrela_ie); 
  }
}
function addShadow(){
  var is_ie_6 = html_element.hasClass('ie6');
  if (!is_ie_6){ 
    body_element.append(sombra_bg); 
  }
}

function init(){
  html_element = $('html');
  body_element = $('body');
  addBrowserClasses();
  tweakContentForIE();
  addShadow();
}
$(init);




















