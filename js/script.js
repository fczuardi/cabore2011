/* Author: 

*/
var cachebust = 'v15';
var sombra_bg = '<div id="sombra-top"><img src="/img/sombra-top.png" /></div><div id="sombra-bottom"><img src="/img/sombra-bottom.png" /></div>';
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
    item_descida = null,
    previous_selected_section,
    template_name,
    current_category = '';

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
function desceFichas(name){
  // console.log('desceFichas');
  var menuitem, item_width, item_left, targetX, espera=0;
  if ((!name)||(name == '{{page_section}}')){return false;}
  body_element.removeClass('section-'+previous_selected_section);
  body_element.addClass('animacao');
  body_element.addClass('section-'+name);
  if (body_element.data('page-name') != item_descida){
    loadSection(name);
  }
  previous_selected_section = name;
  
  menuitem = $('#link-'+name);
  item_width = menuitem.width();
  item_left = menuitem.position().left;
  logo_width = 108;
  nav_left = 91;
  targetX = item_left+item_width/2 + logo_width + nav_left;
  for (var i=0; i<fichas_elements.length; i++){
    $(fichas_elements[i]).css('left', targetX);
  }
  if(name == 'promocao'){
    espera = 500;
  }
  setTimeout(function(){
    if (Modernizr.csstransitions){
      desceFichasModerno(targetX);
    } else {
      desceFichasFallback(targetX);
    }  
  }, espera);
}
function sobeFichas(){
  var   ficha
      , durations = [700, 300, 500]; //from cabore.css
  $('#page-content').fadeOut();
  for (var i=0; i<fichas_elements.length; i++){
    ficha = $(fichas_elements[i]);
    ficha.removeClass('animacao-out');
    ficha.addClass('animacao-in');
    ficha.addClass('animacao');
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
function fichaTransitioned(event){
  //ficha terminou de subir
  if ($(this).hasClass('animacao-in')){
    $(this).removeClass('animacao-in');
    $(this).removeClass('animacao');
    if ((!$('.ficha').hasClass('animacao')) && (item_descida !== null)){
      desceFichas(item_descida);
    }
  }
}
function updateOutlineHeight(){
  setTimeout(function(){
    if($('#candidate-content-container').length > 0){
      $('#main').height($('#candidate-content-container').innerHeight());
    } else {
      $('#main').attr('style','');
      $('#main').height($('#main').height());
    }
  }, 10);
}

function loadSection(name){
  $('#page-content').html('');
  $('#page-content').load('/content/'+name+'.html'+'?cachebust='+cachebust, function() {
    $('#page-content').fadeIn();
    body_element.data('page-name', item_descida);
    body_element.removeClass('detail');
    body_element.removeClass('categoria');
    current_category = '';
    updateOutlineHeight();
    if (body_element.hasClass('section-indicados')){
      $('#page-content ul a').bind('click',categoriaLinkClicked);
    }
    if (body_element.hasClass('section-home')){
      entraCartas();
      $('#carta-2 a').bind('click',menuitemClicked);
    }
  });
}
function loadCategoria(path){
  var content_path = path.replace('indicados', 'content');
  var path_parts = content_path.split('/');
  if (path_parts.length == 6){
    content_path = path_parts.join('/');
    template_name = 'detalhes';
  }else{
    template_name = 'lista';
  }
  current_category = '';
  $('#page-content').fadeOut(500, function(){
    body_element.removeClass('detail');
    body_element.removeClass('categoria');
    $('#page-content').html('');
    $('#page-content').load(content_path+template_name+'.html'+'?cachebust='+cachebust, function() {
      current_category = path_parts[3];
      body_element.data('page-name', item_descida);
      $('#main nav.back a').bind('click',backClicked);
      if (template_name == 'lista'){
        $('#page-content .card .content a').bind('click',categoriaLinkClicked);
        body_element.addClass('categoria');
      }else{
        body_element.addClass('detail');
        cardAnimationInit(); //função definida em card-switch-animation.js
      }
      updateOutlineHeight();
      $('#page-content').fadeIn(500);
    });
  });
}
function categoriaLinkClicked(event){
  event.preventDefault();
  if (typeof $(this).attr('href') != 'undefined') {
    if ($(this).attr('href').length > 2 ){
      loadCategoria($(this).attr('href'));
    }
  }
}
function loadIndicado(path){
  var content_path = path.replace('indicados', 'content');
  var path_parts = content_path.split('/');
  var content_div = $('#candidate-content-container');
  content_div.fadeOut(500, function(){
    $(this).html('');
    $(this).load(content_path+'detalhes.html'+'?cachebust='+cachebust+' #candidate-content', function() {
      updateOutlineHeight();
      $('#candidate-content-container').delay(500).fadeIn(1000);
    });
  })
}
function menuitemClicked(event){
  // console.log('menuitemClicked');
  var   link = $(this)
      , item_nome = link.attr('href').substring(1)
      , item = $('#link-'+item_nome)
      , espera = 0;
  event.preventDefault();
  if (item.hasClass('selected')){ return false; }
  if(navigation_elements.hasClass('selected')){
    //some other link was selected
    navigation_elements.removeClass('selected');
    if(item_descida == 'promocao'){
      espera = 500;
    }
  }
  item_descida = item_nome;
  setTimeout(sobeFichas, espera);
  item.addClass('selected');
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
function backClicked(event){
  // console.log('backClicked')
  event.preventDefault();
  if (body_element.hasClass('categoria')){
      $('#page-content').fadeOut(500, function(){
        loadSection('indicados');
      });
  } else {
    $('#page-content').fadeOut(500, function(){ 
      loadCategoria('/indicados/categoria/'+current_category+'/'); 
    });
  }
}
function loaded(){
  var page_name = body_element.data('page-name');
  previous_selected_section = page_name;
  $('#stage').addClass('loaded');
  $('#stage').css('visibility','visible');
  if (html_element.hasClass('ie6')){
    DD_belatedPNG.fix('#stage, #header-logo, .ficha, .card.basica, .card.back, #patrocinio-1, #patrocinio-2, #patrocinio-3, #patrocinio-4, #patrocinio-5, #patrocinio-6, #patrocinio-7');
  }
  if (page_name == 'home'){
    entraCartas();
  }
   // else {
  if(true) {
    item_descida = page_name;
    // $('#page-content').fadeOut();
    $('#link-'+page_name).addClass('selected');
    // setTimeout(sobeFichas, 1000);
    desceFichas(page_name);
  }
  if (body_element.hasClass('section-home')){
    $('#carta-2 a').bind('click',menuitemClicked);
  }
}
function changeViewport(){
  if (is_iPhone || is_iPad) {
    var viewportmeta = document.querySelector('meta[name="viewport"]');
    if (viewportmeta) {
      if (is_iPhone){
        viewportmeta.content = "width=device-width; initial-scale=0.4, maximum-scale=0.4";
      } else if (is_iPad){
        viewportmeta.content = "width=device-width,initial-scale=1,maximum-scale=1";
      }
      //give back to the user the ability to pinch zoom
      document.body.addEventListener('gesturestart', function() {
        viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.6';
      }, false);
    }
  }
}
function init(){
  html_element = $('html');
  body_element = $('body');
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
  if (!is_iPhone){
    $(window).resize(updateDimensions);
  }
  $(window).load(loaded);
  updateDimensions();
}
$(init);




















