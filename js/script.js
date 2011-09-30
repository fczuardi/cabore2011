/* Author: 

*/
var cache_version = 3;
var sombra_bg = '<div id="sombra-top"><img src="/img/sombra-top.png" /></div><div id="sombra-bottom"><img src="/img/sombra-bottom.png" /></div>';
var estrela_ie = '<span style="font-family:Wingdings;font-size:16px;">¬</span>';
var html_element,
    body_element,
    fichas_elements,
    navigation_elements,
    is_iPhone,
    is_iPad,
    is_webApp,
    cartaCount,
    section_descida = null,
    path_descida = null,
    previous_selected_section,
    is_section_internal = false,
    template_name;

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
  var menuitem, item_width, item_left, targetX, espera=0;
  if ((!name)||(name == '{{page_section}}')){return false;}
  body_element.removeClass('section-'+previous_selected_section);
  body_element.addClass('animacao');
  body_element.addClass('section-'+name);
  if (! is_section_internal) {
    loadSection(name);
  } else{
    loadCategoria(path_descida);
    is_section_internal = false;
  }
  previous_selected_section = name;
  
  if (name == 'home'){ return false; }
  
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
    if ((!$('.ficha').hasClass('animacao')) && (section_descida !== null)){
      desceFichas(section_descida);
    }
  }
}
function updateMeta(){
  var html = $('#page-content').html();
  var pattern = /<!--([^<]*)-->/;
  var first_comment_matches = html.match(pattern);
  var comment_lines, comment_line_parts;
  var meta = {
    'title': 'Caboré 2011'
  }
  if (first_comment_matches){
    comment_lines = first_comment_matches[0].split('\n');
    for (var i=1; i < comment_lines.length-1; i++){
      comment_line_parts = comment_lines[i].split(':');
      meta[comment_line_parts[0]] = comment_line_parts[1].trim();
    }
  }
  document.title = meta.title;
  // if (typeof meta.title !== 'undefined'){
  // }
}
function loadContent(path){
  var pattern = /([^\/]+)/ig;
  var path_parts = path.match(pattern);
  var page_name;
  console.log(path_parts)
  if (path_parts == null){
    section_descida = 'home';
    sobeFichas();
  } else {
    page_name = path_parts[0];
    section_descida = page_name;
    $('#link-'+page_name).addClass('selected');
    if (path_parts.length == 1){
      //section
      if (path_parts[0] != previous_selected_section){
        sobeFichas();
      } else {
        console.log('FOO');
        setTimeout(function(){
          loadSection(section_descida);
        }, 500);
      }
    } else {
      //categoria
      if (path_parts[0] != previous_selected_section){
        is_section_internal = true;
        path_descida = path;
        sobeFichas();
      } else {
        loadCategoria(path);
      }
    }
  }
}
function loadSection(name){
  console.log('LoadSection '+name);
  $('#page-content').html('');
  $('#page-content').load('/'+name+'/ajax.html?v='+cache_version, sectionLoaded);
}
function sectionLoaded(){
  console.log('sectionLoaded')
  updateMeta();
  $('#page-content').fadeIn();
  body_element.removeClass('detail');
  body_element.removeClass('categoria');
  if (body_element.hasClass('section-home')){
    console.log('hey');
    entraCartas();
  }
  if (body_element.hasClass('section-indicados')){
    $('#page-content ul a').bind('click',categoriaLinkClicked);
  }
}
function loadCategoria(path){
  var content_path = path.replace('indicados', 'content');
  var path_parts = content_path.split('/');
  if (path_parts.length == 6){
    path_parts.splice(4,1);
    content_path = path_parts.join('/');
    template_name = 'detalhes';
  }else{
    template_name = 'lista';
  }
  $('#page-content').fadeOut(500, function(){
    body_element.removeClass('detail');
    body_element.removeClass('categoria');
    $('#page-content').html('');
    $('#page-content').load(content_path+template_name+'.html', function() {
      updateMeta();
      if (template_name == 'lista'){
        $('#page-content .card .content a').bind('click',categoriaLinkClicked);
        body_element.addClass('categoria');
      }else{
        body_element.addClass('detail');
        cardAnimationInit();
      }
      $('#page-content').fadeIn();
    });
  });
}
function categoriaLinkClicked(event){
  event.preventDefault();
  if (Modernizr.history){
    history.pushState(null, null, $(this).attr('href'));
  }
  loadCategoria($(this).attr('href'));
}
function menuitemClicked(event){
  event.preventDefault();
  var   link = $(this)
      , item_nome = link.attr('href').replace(/\/|\#/g,'')
      , item = $('#link-'+item_nome.substring(1))
      , espera = 0;
  if (Modernizr.history){
    history.pushState(null, null, $(this).attr('href'));
  }
  if (item.hasClass('selected')){ return false; }
  if(navigation_elements.hasClass('selected')){
    //some other link was selected
    navigation_elements.removeClass('selected');
    if(section_descida == 'promocao'){
      espera = 500;
    }
  }
  loadContent(item_nome)
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
  window.addEventListener("popstate", function(e) {
      loadContent(location.pathname);
  }, true);
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

//first load
function loaded(){
  console.log('loaded')
  var page_name = body_element.data('page-name');
  previous_selected_section = page_name;
  body_element.addClass('loaded');
  $('#stage').css('visibility','visible');
  if (html_element.hasClass('ie6')){
    DD_belatedPNG.fix('#stage, #header-logo, .ficha, .card.basica, .card.back, #patrocinio-1, #patrocinio-2, #patrocinio-3, #patrocinio-4, #patrocinio-5, #patrocinio-6, #patrocinio-7');
  }
  console.log('page_name ' + page_name)
  if (page_name == 'home'){
    entraCartas();
  } else {
    section_descida = page_name;
    loadContent(page_name)
    // $('#page-content').css('opacity', 0)
    // $('#page-content').css('display', 'none')
    // sectionLoaded();
  }
  if (body_element.hasClass('section-home')){
    $('#carta-2 a').bind('click',menuitemClicked);
  }
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
  fichas_elements = $('.ficha');
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




















