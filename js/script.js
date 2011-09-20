/* Author: 

*/
var sombra_bg = '<div id="sombra-top"><img src="img/sombra-top.png" /></div><div id="sombra-bottom"><img src="img/sombra-bottom.png" /></div>';
var estrela_ie = '<span style="font-family:Wingdings;font-size:16px;">¬</span>';
var html_element,
    body_element,
    fichas_elements,
    is_iPhone,
    is_iPad,
    is_webApp;

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
    $('#stage').prepend(sombra_bg); 
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
      ficha.addClass('animacao-out');
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

function entraCartas(){
  console.log('foo');
  for(var i=0; i<3; i++){
    setTimeout(function(carta){
      $('#carta-'+carta).addClass('animacao-out');
      $('#carta-'+carta).addClass('final');
    },i*150, 2-i);
  }
}

function updateDimensions(){
  var new_stage_height = Math.max($('#container').height(),$(window).height());
  // $('#debug').html($('#stage').css('height')+' '+$('#container').height());
  if ((is_iPhone)&&(!is_webApp)){
    if ((window.orientation == 0) || (window.orientation == 180)){
      //add extra body size and scroll to remove the browser bar
      new_stage_height += 160;
    }
    window.scrollTo(0, 1);
  }
  $('#stage').css('height',new_stage_height);
}
function loaded(){
  body_element.addClass('loaded');
  entraCartas();
}
function changeViewport(){
  var metas = document.getElementsByTagName('meta');
  var i;
  for (i=0; i < metas.length; i++){
    if (metas[i].name == "viewport") {
      if (is_iPhone){
        metas[i].content = "width=device-width; initial-scale=0.4;";
      }else if (is_iPad){
        metas[i].content = "width=device-width,initial-scale=1,maximum-scale=1";
      }
    }
  }
}
function init(){
  html_element = $('html');
  body_element = $('body');
  fichas_elements = [$('#ficha-0'),$('#ficha-1'),$('#ficha-2')];
  is_iPhone = (navigator.userAgent.match(/iPhone/i) !== null);
  is_iPad = (navigator.userAgent.match(/iPad/i) !== null);
  is_webApp = (window.navigator.standalone === true);
  addBrowserClasses();
  changeViewport();
  tweakContentForIE();
  addShadow();
  $(window).resize(updateDimensions);
  $(window).load(loaded);
  updateDimensions();
}
$(init);




















