/* Author: 

*/
var sombra_bg = '<div id="sombra-top"><img src="img/sombra-top.png" /></div><div id="sombra-bottom"><img src="img/sombra-bottom.png" /></div>';
var estrela_ie = '<span style="font-family:Wingdings;font-size:16px;">¬</span>';
var html_element,
    body_element,
    fichas_elements,
    cartas_elements,
    is_iPhone,
    is_iPad,
    is_webApp,
    cartaCount;

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
function fichaTransitioned(event){
  //ficha terminou de subir
  if ($(this).hasClass('animacao-in')){
    $(this).removeClass('animacao-in');
    $(this).removeClass('animacao');
  }
}
function addTransitionEvents(){
  for (var i=0; i<fichas_elements.length; i++){
    fichas_elements[i][0].addEventListener("transitionend", fichaTransitioned, true);
  }
}
function desceFichas(targetX){
  for (var i=0; i<fichas_elements.length; i++){
    fichas_elements[i].css('left', targetX);
  }
  //o set timeout aqui é para dar um tempo para esta mudanca de css acima tomar efeito
  setTimeout(function(){
    var ficha,
        targetY = -40;
    for (var i=0; i<fichas_elements.length; i++){
      ficha = fichas_elements[i];
      ficha.addClass('animacao');
      ficha.removeClass('animacao-in');
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
function sobeFichas(){
  var ficha;
  if (!fichas_elements[0].hasClass('animacao')){return false;}
  for (var i=0; i<fichas_elements.length; i++){
    ficha = fichas_elements[i];
    ficha.removeClass('animacao-out');
    ficha.addClass('animacao-in');
    ficha.css('top', ficha.position().top - 130);
  }
}
function animaCartaModerno(){
  var carta = $('#carta-'+cartaCount);
  carta.addClass('animacao-out');
  carta.addClass('final');
}
function animaCartaFallback(){
  var attributes = [{
          'left':382
        , 'top':32
        , 'opacity':1
        , 'transform':'rotate(11deg)'
      },
      {
          'left':140
        , 'top':32
        , 'opacity':1
        , 'transform':'rotate(-11deg)'
      },
      {
         'top':32
        , 'opacity':1
      }]
      , transition = {
          queue:false, 
          duration:500,
          easing:'easeOutCirc'
      };
  $('#carta-'+cartaCount).animate(attributes[cartaCount], transition);
}
function entraCartas(){
  cartaCount = 0;
  $('#carta-2').addClass('loaded');
  for(var i=0; i<3; i++){
    setTimeout(function(){
      if (Modernizr.csstransitions && Modernizr.csstransforms){
        animaCartaModerno();
      } else {
        animaCartaFallback();
      }
      cartaCount++;
    },i*150);
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
  if (html_element.hasClass('ie6')){
    DD_belatedPNG.fix('#stage, #header-logo, .ficha, .card.basica, .card.back, #patrocinio-1, #patrocinio-2, #patrocinio-3, #patrocinio-4, #patrocinio-5, #patrocinio-6, #patrocinio-7');
  }
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
  cartas_elements = [$('#carta-0'),$('#carta-1'),$('#carta-2')];
  is_iPhone = (navigator.userAgent.match(/iPhone/i) !== null);
  is_iPad = (navigator.userAgent.match(/iPad/i) !== null);
  is_webApp = (window.navigator.standalone === true);
  addTransitionEvents();
  addBrowserClasses();
  changeViewport();
  tweakContentForIE();
  addShadow();
  $(window).resize(updateDimensions);
  $(window).load(loaded);
  updateDimensions();
}
$(init);




















