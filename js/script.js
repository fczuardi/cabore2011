/* Author: 

*/
var sombra_bg = '<div id="sombra-top"><img src="img/sombra-top.png" /></div><div id="sombra-bottom"><img src="img/sombra-bottom.png" /></div>';
var estrela_ie = '<span style="font-family:Wingdings;font-size:16px;">¬</span>';
var html_element,
    body_element,
    fichas_elements;

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
  var is_ie_6_or_7 = html_element.hasClass('ie6')||html_element.hasClass('ie7');
  if (!is_ie_6_or_7){ 
    body_element.prepend(sombra_bg); 
  }
}

function desceFichas(targetX){
  for (var i=0; i<fichas_elements.length; i++){
    fichas_elements[i].css('left', targetX);
  }
  setTimeout(function(){
    var ficha,
        targetY = -40;
    for (var i=0; i<fichas_elements.length; i++){
      ficha = fichas_elements[i];
      ficha.addClass('animacao');
      ficha.css('top', targetY - (Math.random()*40));
      if (i > 0){
        ficha.css('top', targetY - (Math.random()*40));
        ficha.css('left', targetX +(Math.random()*62 - 31));
      } else {
        ficha.css('top', targetY);
      }
    }
  },200, targetX);
}
function init(){
  html_element = $('html');
  body_element = $('body');
  fichas_elements = [$('#ficha-0'),$('#ficha-1'),$('#ficha-2')];
  addBrowserClasses();
  tweakContentForIE();
  addShadow();
}
$(init);




















