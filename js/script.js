/* Author: 

*/
var sombra_bg = '<div id="sombra-top"><img src="img/sombra-top.png" /></div><div id="sombra-bottom"><img src="img/sombra-bottom.png" /></div>';
var estrela_ie = '<span style="font-family:Wingdings;font-size:16px;">¬</span>';
var html_element,
    body_element,
    fichas_elements,
    cartas_elements,
    navigation_elements,
    is_iPhone,
    is_iPad,
    is_webApp,
    cartaCount,
    posicao_descida = null;

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
    if ((!fichas_elements.hasClass('animacao')) && (posicao_descida !== null)){
      console.log(posicao_descida);
      desceFichas(posicao_descida);
    }
  }
}
function menuitemClicked(event){
  var   link = $(this)
      , item_nome = link.attr('href').substring(1)
      , item = $('#link-'+item_nome)
      , item_width = item.width()
      , item_left = item.position().left
      , targetX = item_left+item_width/2+203-60;
  event.preventDefault();
  if (item.hasClass('selected')){
  }else {
    if(navigation_elements.hasClass('selected')){
      //some other link was selected
      navigation_elements.removeClass('selected');
      posicao_descida = targetX;
      sobeFichas();
    } else {
      desceFichas(targetX);
      posicao_descida == null;
    }
    item.addClass('selected');
  }
}
function addListeners(){
  for (var i=0; i<fichas_elements.length; i++){
    if (fichas_elements[i].addEventListener){  
      fichas_elements[i].addEventListener("transitionend", fichaTransitioned, true);
      fichas_elements[i].addEventListener("oTransitionEnd", fichaTransitioned, true);
      fichas_elements[i].addEventListener("webkitTransitionEnd", fichaTransitioned, true);      
    } else if (fichas_elements[i].attachEvent){  
      fichas_elements[i].attachEvent("transitionend", fichaTransitioned);
    }
  }
  navigation_elements.bind('click',menuitemClicked);
  $('#carta-2 a').bind('click',menuitemClicked);
}

function desceFichasModerno(targetX){
  //o set timeout aqui é para dar um tempo para a mudanca de css ('left') tomar efeito
  setTimeout(function(){
    var ficha,
        targetY = -36;
    for (var i=0; i<fichas_elements.length; i++){
      ficha = $(fichas_elements[i]);
      ficha.addClass('animacao');
      ficha.removeClass('animacao-in');
      ficha.addClass('animacao-out');
      if (i > 0){
        ficha.css('top', targetY - (Math.random()*40));
        ficha.css('left', targetX +(Math.random()*62 - 31));
      } else {
        ficha.css('top', targetY);
      }
    }
  },200, targetX);
}
function desceFichasFallback(targetX){
  var   ficha
      , targetY = -40
      , transition
      , durations = [700, 300, 500]; //from cabore.css
  for (var i=0; i<fichas_elements.length; i++){
    ficha = $(fichas_elements[i]);
    ficha.addClass('animacao');
    ficha.delay(200);
    transition = {
      queue:false, 
      duration:durations[i],
      easing:'easeOutCirc'
    }
    if (i > 0){
      ficha.animate({
          'top': targetY - (Math.random()*40)
        , 'left': targetX + (Math.random()*62 - 31)
      }, transition);
    } else {
      ficha.animate({
        'top': targetY
      }, transition);
    }
  }
}
function desceFichas(targetX){
  for (var i=0; i<fichas_elements.length; i++){
    $(fichas_elements[i]).css('left', targetX);
  }
  if (Modernizr.csstransitions){
    desceFichasModerno(targetX);
  } else {
    desceFichasFallback(targetX);
  }  
}
function sobeFichas(){
  var   ficha
      , durations = [700, 300, 500]; //from cabore.css
  if (!$(fichas_elements[0]).hasClass('animacao')){return false;}
  for (var i=0; i<fichas_elements.length; i++){
    ficha = $(fichas_elements[i]);
    ficha.removeClass('animacao-out');
    ficha.addClass('animacao-in');
    if (Modernizr.csstransitions){
      ficha.css('top', ficha.position().top - 130);
    } else {
      ficha.animate({'top': ficha.position().top - 130},{
        queue:false, 
        duration:durations[i],
        complete:fichaTransitioned,
        easing:'easeInQuart'
      });
    }  
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
      },
      {
          'left':140
        , 'top':32
      },
      {
         'top':32
      }]
      , transition = {
          queue:false, 
          duration:500,
          easing:'easeOutCirc'
      };
  if (!html_element.hasClass('oldie')){
    attributes[0].opacity = 1;
    attributes[1].opacity = 1;
    attributes[0].transform = 'rotate(11deg)';
    attributes[1].transform = 'rotate(-11deg)';
  }
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
  fichas_elements = $('.ficha');
  cartas_elements = [$('#carta-0'),$('#carta-1'),$('#carta-2')];
  navigation_elements = $('header nav a');
  is_iPhone = (navigator.userAgent.match(/iPhone/i) !== null);
  is_iPad = (navigator.userAgent.match(/iPad/i) !== null);
  is_webApp = (window.navigator.standalone === true);
  addListeners();
  addBrowserClasses();
  changeViewport();
  tweakContentForIE();
  addShadow();
  $(window).resize(updateDimensions);
  $(window).load(loaded);
  updateDimensions();
}
$(init);




















