/* Author: 

*/
var cachebust = 'v29';
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
  // if (body_element.data('page-name') != item_descida){
    loadSection(name);
  // }
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
  if($('#candidate-content-container').length > 0){
    $('#main').height($('#candidate-content-container').innerHeight());
    $('#stage').css('height',Math.max($(window).height(),$('#candidate-content-container').innerHeight()+200+185));
  } else {
    $('#main').height(Math.max(325,$('#page-content').innerHeight()));
    updateDimensions();
    setTimeout(updateDimensions, 1000)
  }
}

function IeHrefFix(){
  $('a').each(function(){
    var href = $(this).attr('href');
    var end_of_domain_name_local = href.lastIndexOf(':8888');
    var end_of_domain_name_test = href.lastIndexOf('saocarlos.wiki.br');
    var end_of_domain_name_production = href.lastIndexOf('cabore.com.br');
    if (end_of_domain_name_local != -1){
      href = href.substring(end_of_domain_name_local+':8888'.length);
    } else if (end_of_domain_name_test != -1){
      href = href.substring(end_of_domain_name_test+'saocarlos.wiki.br'.length);
    } else if (end_of_domain_name_production != -1){
      href = href.substring(end_of_domain_name_production+'cabore.com.br'.length);
    }
    $(this).attr('_href', href);
  });
}
function loadSection(name){
  $('#page-content').html('');
  $('#page-content').load('/content/'+name+'.html'+'?cachebust='+cachebust, function() {
    updateOutlineHeight();
    $('#page-content').fadeIn(500);
    IeHrefFix();
    body_element.data('page-name', item_descida);
    body_element.removeClass('detail');
    body_element.removeClass('categoria');
    current_category = '';
    if (body_element.hasClass('section-indicados')){
      $('#page-content ul a').bind('click',categoriaLinkClicked);
    }
    if (body_element.hasClass('section-home')){
      entraCartas();
      $('#carta-2 a').bind('click',menuitemClicked);
    }
  });
}
function insertVideoEmbeds(){
  if ($('#candidate-content .video-container').length < 1) {return }
  var src = $('#candidate-content .video-container').data('scriptsrc');
  var s = document.createElement('script');
  $('#candidate-content .video-container')[0].appendChild(s);
  s.src = src;
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
      IeHrefFix();
      current_category = path_parts[3];
      body_element.data('page-name', item_descida);
      $('#main nav.back a').bind('click',backClicked);
      if (template_name == 'lista'){
        $('#page-content .card .content a').bind('click',categoriaLinkClicked);
        body_element.addClass('categoria');
        updateOutlineHeight();
      }else{
        body_element.addClass('detail');
        cardAnimationInit(); //função definida em card-switch-animation.js
        // $('.video-link').click(videoClicked);
        insertVideoEmbeds();
      }
      $('#page-content').fadeIn(500);
    });
  });
}
function categoriaLinkClicked(event){
  event.preventDefault();
  if (typeof $(this).attr('href') != 'undefined') {
    if ($(this).attr('href').length > 2 ){
      loadCategoria($(this).attr('_href'));
    }
  }
}
function canPlayMP4Natively(){
  var canPlay = false;
  var v = document.createElement('video');
  if(v.canPlayType && v.canPlayType('video/mp4').replace(/no/, '')) {
      canPlay = true;
  }
  return canPlay;
}
function videoClicked(event){
  event.preventDefault();
  var mp4_url = $(this).attr('href');
  var flash_player_id = $(this).data('m');
  var flash_player_script_tag = document.createElement("script");
  flash_player_script_tag.type = "text/javascript";
  flash_player_script_tag.src = 'http://player.sambatech.com.br/current/samba-player.js?playerWidth=405&playerHeight=228&ph=17e62166fc8586dfa4d1bc0e1742c08b&m='+flash_player_id +'&profileName=sambaPlayer-embed.xml';
  var flash_player_object_ie_html = '<object id="'+flash_player_id+'" name="'+flash_player_id+'" type="application/x-shockwave-flash" data="http://player.sambatech.com.br/current/profiles/samba/sambaPlayer.swf"codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0"width="405" height="228"><param name="wmode" value="transparent" /><param name="allowfullscreen" value="true"/><param name="allowscriptaccess" value="always"/><param name="movie" value="http://player.sambatech.com.br/current/profiles/samba/sambaPlayer.swf" /><param name="flashvars" value="playerHash=17e62166fc8586dfa4d1bc0e1742c08b&idmedia='+flash_player_id+'&thumbnailPreview=true&thumbnailUrl=null&scaleMode=fit&autoStart=true&autoLoad=true&connectionTimeout=null&liveUrl=null&liveFallbackUrl=null&width=405&height=228&endPointAMF=http%3A%2F%2Ffast.player.liquidplatform.com%2F2.0%2Fmessagebroker%2Fplayer%2F&endPointREST=http%3A%2F%2Ffast.player.liquidplatform.com%2F2.0%2Fapi%2F&showRelated=false&customizationFile=%3Cparameters+xmlns%3Ans2%3D%22EC%3AWebServices%22+xmlns%3Ans3%3D%22http%3A%2F%2Fwww.liquidplatform.com%2FSCHEMAS%2FWebcastServices%22%3E%3CcontrolBar+backgroundAlpha%3D%2290%22+backgroundColor%3D%220x2e2e2e%22+margin%3D%220%22+mode%3D%22bottom%22+showOnFullscreen%3D%22true%22+space%3D%22%22%2F%3E%3CdurationTimeLabel+color%3D%220x797979%22+visible%3D%22true%22+x%3D%22%22+y%3D%226%22%2F%3E%3CembedButton+visible%3D%22false%22+x%3D%22%22+y%3D%22%22%2F%3E%3CfacebookButton+visible%3D%22false%22+x%3D%22%22+y%3D%22%22%2F%3E%3CfullScreenButton+baseColor%3D%22%22+highlightColor%3D%220xe1e1e1%22+iconColor%3D%220x888888%22+tip%3D%22%22+visible%3D%22true%22+x%3D%22%22+y%3D%22%22%2F%3E%3CshareButton+visible%3D%22false%22+x%3D%22%22+y%3D%22%22%2F%3E%3ClinkButton+visible%3D%22false%22+x%3D%22%22+y%3D%22%22%2F%3E%3CoutputButton+baseColor%3D%220x2b2b2b%22+borderColor%3D%220x797979%22+fontColor%3D%220xe1e1e1%22+highlightColor%3D%22%22+iconColor%3D%220x888888%22+iconOffColor%3D%220xFFFFFF%22+iconOnColor%3D%220x0071BD%22+visible%3D%22false%22+x%3D%22%22+y%3D%22%22%3E%3Coutput+id%3D%22240p%22+label%3D%22240p%22%2F%3E%3Coutput+id%3D%22360p%22+label%3D%22360p%22%2F%3E%3Coutput+id%3D%22480p%22+label%3D%22480p%22%2F%3E%3Coutput+id%3D%22720p%22+label%3D%22720p%22%2F%3E%3Coutput+id%3D%221080p%22+label%3D%221080p%22%2F%3E%3C%2FoutputButton%3E%3CpauseButton+baseColor%3D%22%22+highlightColor%3D%220xe1e1e1%22+iconColor%3D%220x888888%22+tip%3D%22%22+visible%3D%22true%22+x%3D%22%22+y%3D%22%22%2F%3E%3CplayButton+baseColor%3D%22%22+highlightColor%3D%220xe1e1e1%22+iconColor%3D%220x888888%22+tip%3D%22%22+visible%3D%22true%22+x%3D%22%22+y%3D%22%22%2F%3E%3CplayerParams+__baseEndPoint%3D%22http%3A%2F%2F204.232.187.98%3A7092%2F%22+__endPointAMF%3D%22messagebroker%2Fplayer%2F%22+__endPointREST%3D%22api%2F%22+__endPointReportVideo%3D%22%2FaddMediaRequestTime%22+allFailMsg%3D%22Can\'t+play+this+video+without+more+recent+flash+plugin+or+a+browser.%22+autoLoad%3D%22true%22+autoStart%3D%22true%22+connectionTimeout%3D%22null%22+defaultOutput%3D%22Original%22+fakeStreamParam%3D%22ec_seek%22+fallback%3D%22true%22+flashVersion%3D%2210%22+height%3D%22330%22+liveFallbackUrl%3D%22null%22+liveUrl%3D%22null%22+metadata%3D%22true%22+playerHeight%3D%22360%22+playerTheme%3D%22default%22+playerWideHeight%3D%22493%22+playerWideWidth%3D%22876%22+playerWidth%3D%22640%22+primaryPlayer%3D%22flash%22+redirectURL%3D%22%22+scaleMode%3D%22fit%22+seekBar%3D%22default%22+showControlsOnFullscreen%3D%22true%22+showRelated%3D%22false%22+showRelatedPerPage%3D%224%22+showWidgetsOnFullscreen%3D%22true%22+thumbnailPreview%3D%22true%22+width%3D%22640%22%2F%3E%3CprogressBar+backgroundColor%3D%220xebebeb%22+height%3D%22%22+loadedColor%3D%220xacacac%22+mode%3D%22top%22+timeColor%3D%220xf4ba31%22+visible%3D%22true%22+width%3D%22%22+x%3D%22%22+y%3D%22%22%2F%3E%3CprogressTimeLabel+color%3D%220xe1e1e1%22+enableTimeChange%3D%22true%22+visible%3D%22true%22+x%3D%22%22+y%3D%226%22%2F%3E%3Crelated+arrowPosition%3D%22FIXED%22+backgroundAlpha%3D%2210%22+backgroundColor%3D%220xFFFFFF%22+channelFontColor%3D%220x6DBEF4%22+highlightAlpha%3D%22100%22+highlightColor%3D%220x0071BD%22+numberOfColumns%3D%222%22+numberOfElements%3D%222%22+skinModel%3D%22SHOWRATING%22+textOrientation%3D%22RIGHT%22+titleFontColor%3D%220xFFFFFF%22+viewsFontColor%3D%220x6DBEF4%22%2F%3E%3CtwitterButton+visible%3D%22false%22+x%3D%22%22+y%3D%22%22%2F%3E%3CvolumeControl+buttonBaseColor%3D%22%22+dragbarBackgroundColor%3D%220x888888%22+dragbarFillColor%3D%220xf4ba31%22+iconOffColor%3D%220x888888%22+iconOnColor%3D%220x888888%22+scrubberColor%3D%22%22+visible%3D%22true%22+width%3D%22%22+x%3D%22%22+y%3D%22%22%2F%3E%3CwideButton+baseColor%3D%22%22+highlightColor%3D%220xe1e1e1%22+iconColor%3D%220x888888%22+tip%3D%22%22+visible%3D%22false%22+x%3D%22%22+y%3D%22%22%2F%3E%3CwidgetBar+backgroundAlpha%3D%220%22+backgroundColor%3D%22%22+margin%3D%225%22+showOnFullscreen%3D%22true%22+width%3D%22%22%2F%3E%3Cwatermark+idmedialogo%3D%22%22+imageHeight%3D%22%22+imageSize%3D%22%22+imageWidth%3D%22%22+position%3D%22%22+urlLogo%3D%22%22%2F%3E%3CbaseHtml%3E%26lt%3Bdiv+class%3D%22ui-samba-player-fullscreen%22%26gt%3B%26lt%3Bdiv+class%3D%22ui-samba-player%22%26gt%3B%26lt%3Bdiv+class%3D%22ui-video-holder%22+style%3D%22width%3A640px%3B+height%3A360px%3B%22%26gt%3B%26lt%3Bdiv+class%3D%22ui-samba-player-video-play+central-button%22+title%3D%22Assistir%22%26gt%3B%26lt%3B%2Fdiv%26gt%3B%26lt%3Bspan+class%3D%22ui-samba-player-publicity+hidden%22%26gt%3BPublicidade%26lt%3B%2Fspan%26gt%3B%26lt%3Ba+href%3D%22%23%22+class%3D%22ui-samba-player-replay+hidden%22+title%3D%22Assista+novamente%22%26gt%3B%26lt%3Bspan+class%3D%22ui-icon+ui-icon-replay%22%26gt%3B%26lt%3B%2Fspan%26gt%3BAssista+novamente%26lt%3B%2Fa%26gt%3B%26lt%3Bdiv+class%3D%22ui-samba-player-syndication%22%26gt%3B%26lt%3Ba+href%3D%22%23%22+rel%3D%22onTweet%22+title%3D%22Compartilhe+no+Twitter%22%26gt%3B%26lt%3Bspan+class%3D%22ui-icon+ui-icon-twitter%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-icon-text%22%26gt%3BTwitter%26lt%3B%2Fspan%26gt%3B%26lt%3B%2Fa%26gt%3B%26lt%3Ba+href%3D%22%23%22++rel%3D%22onFacebook%22+title%3D%22Compartilhe+no+Facebook%22%26gt%3B%26lt%3Bspan+class%3D%22ui-icon+ui-icon-facebook%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-icon-text%22%26gt%3BFacebook%26lt%3B%2Fspan%26gt%3B%26lt%3B%2Fa%26gt%3B%26lt%3B%2Fdiv%26gt%3B%26lt%3Bimg+src%3D%22%22+width%3D%22100%25%22+height%3D%22100%25%22+%2F%26gt%3B%26lt%3B%2Fdiv%26gt%3B%26lt%3Bdiv+class%3D%22ui-samba-player-video-controls+hidden%22%26gt%3B%26lt%3Bdiv+class%3D%22ui-samba-player-video-seek%22%26gt%3B%26lt%3B%2Fdiv%26gt%3B%26lt%3Bdiv+class%3D%22ui-samba-player-video-options%22%26gt%3B%26lt%3Bdiv+class%3D%22ui-samba-player-video-play%22%26gt%3B%26lt%3Ba+href%3D%22%23%22+class%3D%22ui-icon+ui-icon-play%22+title%3D%22Assistir%22%26gt%3B%26lt%3B%2Fa%26gt%3B%26lt%3B%2Fdiv%26gt%3B%26lt%3Bdiv+class%3D%22ui-samba-player-video-time%22%26gt%3B%26lt%3Bspan+class%3D%22ui-current-time%22+title%3D%22Total+assistido%22%26gt%3B00%3A00%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-total-time%22+title%3D%22Tamanho+do+video%22%26gt%3B%2F+00%3A00%26lt%3B%2Fspan%26gt%3B%26lt%3B%2Fdiv%26gt%3B%26lt%3Bdiv+class%3D%22ui-samba-player-advanced-options%22%26gt%3B%26lt%3Bdiv+class%3D%22ui-video-output%22%26gt%3B%26lt%3Bdiv%26gt%3B%26lt%3Ba+href%3D%22%23%22+style%3D%22display%3Anone%3B%22+rel%3D%221080p%22+title%3D%221080p+HD%22%26gt%3B1080p%26lt%3Bsup%26gt%3BHD%26lt%3B%2Fsup%26gt%3B%26lt%3B%2Fa%26gt%3B%26lt%3Ba+href%3D%22%23%22+style%3D%22display%3Anone%3B%22+rel%3D%22720p%22+title%3D%22720p+HD%22%26gt%3B720p%26lt%3Bsup%26gt%3BHD%26lt%3B%2Fsup%26gt%3B%26lt%3B%2Fa%26gt%3B%26lt%3Ba+href%3D%22%23%22+style%3D%22display%3Anone%3B%22+rel%3D%22480p%22+title%3D%22480p%22%26gt%3B480p%26lt%3Bsup%26gt%3B%26lt%3B%2Fsup%26gt%3B%26lt%3B%2Fa%26gt%3B%26lt%3Ba+href%3D%22%23%22+style%3D%22display%3Anone%3B%22+rel%3D%22360p%22+title%3D%22360p%22%26gt%3B360p%26lt%3Bsup%26gt%3B%26lt%3B%2Fsup%26gt%3B%26lt%3B%2Fa%26gt%3B%26lt%3Ba+href%3D%22%23%22+style%3D%22display%3Anone%3B%22+rel%3D%22240p%22+title%3D%22240p%22%26gt%3B240p%26lt%3Bsup%26gt%3B%26lt%3B%2Fsup%26gt%3B%26lt%3B%2Fa%26gt%3B%26lt%3Bspan+class%3D%22ui-arrow%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3B%2Fdiv%26gt%3B%26lt%3B%2Fdiv%26gt%3B%26lt%3Ba+href%3D%22%23%22+class%3D%22ui-icon+ui-icon-share%22+title%3D%22Compartilhamento%22%26gt%3BCompartilhe%26lt%3B%2Fa%26gt%3B%26lt%3Ba+href%3D%22%23%22+class%3D%22ui-icon+ui-icon-fullscreen%22+title%3D%22Tela+cheia%22%26gt%3BTela+cheia%26lt%3B%2Fa%26gt%3B%26lt%3Bdiv+class%3D%22ui-samba-player-volume-bar%22%26gt%3B%26lt%3Ba+class%3D%22ui-icon+ui-icon-volume%22+title%3D%22Volume+Ligado%22%26gt%3B%26lt%3B%2Fa%26gt%3B%09%26lt%3Bspan+class%3D%22ui-volume-bar%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-volume-bar%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-volume-bar%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-volume-bar%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-volume-bar%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-volume-bar%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-volume-bar%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-volume-bar%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-volume-bar%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-volume-bar%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-volume-bar+ui-volume-bar-off%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-volume-bar%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-volume-bar+ui-volume-bar-off%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-volume-bar%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-volume-bar+ui-volume-bar-off%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-volume-bar%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-volume-bar+ui-volume-bar-off%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-volume-bar%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-volume-bar+ui-volume-bar-off%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-volume-bar%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3B%2Fdiv%26gt%3B%26lt%3B%2Fdiv%26gt%3B%26lt%3B%2Fdiv%26gt%3B%26lt%3B%2Fdiv%26gt%3B%26lt%3B%2Fdiv%26gt%3B%26lt%3B%2Fdiv%26gt%3B%3C%2FbaseHtml%3E%3C%2Fparameters%3E&embedCode=%253Cscript%2520src%253D%2522http%253A%2F%2Fplayer.sambatech.com.br%2Fcurrent%2Fsamba-player.js%253FplayerWidth%253D405%2526playerHeight%253D228%2526ph%253D17e62166fc8586dfa4d1bc0e1742c08b%2526m%253D'+flash_player_id+'%2526profileName%253DsambaPlayer-embed.xml%2522%253E%253C%2Fscript%253E&contextUrl=http%253A%2F%2Flocalhost%253A8888%2Ftestvideo.html&ad_program=&startButton=&startOutput=&mediaInfoObject=%7B%22title%22%3A%22Indicados+Cabor%C3%83%C2%A9+2011+-+Mood%22%2C%22id%22%3A%22'+flash_player_id+'%22%2C%22qualifierName%22%3A%22VIDEO%22%2C%22categoryName%22%3A%22Pr%C3%83%C2%AAmio+Cabor%C3%83%C2%A9+2011%22%2C%22views%22%3A6%2C%22ratings%22%3A0%2C%22ratingAverage%22%3A0%2C%22shared%22%3Afalse%2C%22hasAdvertising%22%3Afalse%2C%22defaultOutput%22%3A%22360p%22%2C%22outputList%22%3A%5B%7B%22labelText%22%3A%22720p%22%2C%22format%22%3A%22H264%22%2C%22title%22%3A%22Indicados+Cabor%C3%83%C2%A9+2011+-+Mood%22%2C%22id%22%3A%222c9f94b6332bbfdd01334c9d78f22082%22%2C%22url%22%3A%22http%3A%2F%2Fmm.sambatech.com.br%2F00238F%2Faccount%2F43%2F1%2Fmedia%2Fvideo%2F2c9f94b6332bbfdd01334c9d78f22082%2F1319840346028mp4.mp4%22%2C%22qualifierName%22%3A%22VIDEO%22%2C%22videoCodec%22%3A%22H264%22%2C%22audioCodec%22%3A%22AAC%22%2C%22duration%22%3A63088%2C%22height%22%3A720%2C%22width%22%3A1280%2C%22fileSize%22%3A15473407%7D%2C%7B%22labelText%22%3A%22480p%22%2C%22format%22%3A%22H264%22%2C%22title%22%3A%22Indicados+Cabor%C3%83%C2%A9+2011+-+Mood%22%2C%22id%22%3A%222c9f94b6332bbfdd01334c9d7e212083%22%2C%22url%22%3A%22http%3A%2F%2Fmm.sambatech.com.br%2F00238F%2Faccount%2F43%2F1%2Fmedia%2Fvideo%2F2c9f94b6332bbfdd01334c9d7e212083%2F1319840348619mp4.mp4%22%2C%22qualifierName%22%3A%22VIDEO%22%2C%22videoCodec%22%3A%22H264%22%2C%22audioCodec%22%3A%22AAC%22%2C%22duration%22%3A63088%2C%22height%22%3A480%2C%22width%22%3A854%2C%22fileSize%22%3A8031048%7D%2C%7B%22labelText%22%3A%22_RAW%22%2C%22format%22%3A%22H264%22%2C%22title%22%3A%22Indicados+Cabor%C3%83%C2%A9+2011+-+Mood%22%2C%22id%22%3A%222c9f94b6332bbfdd01334c9d6e682081%22%2C%22url%22%3A%22http%3A%2F%2Fmm.sambatech.com.br%2F00238F%2Faccount%2F43%2F1%2Fmedia%2Fvideo%2F2c9f94b6332bbfdd01334c9d6e682081%2F1319840343635mp4.mp4%22%2C%22qualifierName%22%3A%22VIDEO%22%2C%22videoCodec%22%3A%22H264%22%2C%22audioCodec%22%3A%22AAC%22%2C%22duration%22%3A63065%2C%22height%22%3A720%2C%22width%22%3A1280%2C%22fileSize%22%3A16316700%7D%2C%7B%22labelText%22%3A%22360p%22%2C%22format%22%3A%22H264%22%2C%22title%22%3A%22Indicados+Cabor%C3%83%C2%A9+2011+-+Mood%22%2C%22id%22%3A%222c9f94b6332bbfdd01334c9d85342085%22%2C%22url%22%3A%22http%3A%2F%2Fmm.sambatech.com.br%2F00238F%2Faccount%2F43%2F1%2Fmedia%2Fvideo%2F2c9f94b6332bbfdd01334c9d85342085%2F1319840350721mp4.mp4%22%2C%22qualifierName%22%3A%22VIDEO%22%2C%22videoCodec%22%3A%22H264%22%2C%22audioCodec%22%3A%22AAC%22%2C%22duration%22%3A63088%2C%22height%22%3A360%2C%22width%22%3A640%2C%22fileSize%22%3A5046393%7D%2C%7B%22labelText%22%3A%22240p%22%2C%22format%22%3A%22H264%22%2C%22title%22%3A%22Indicados+Cabor%C3%83%C2%A9+2011+-+Mood%22%2C%22id%22%3A%222c9f94b6332bbfdd01334c9d81372084%22%2C%22url%22%3A%22http%3A%2F%2Fmm.sambatech.com.br%2F00238F%2Faccount%2F43%2F1%2Fmedia%2Fvideo%2F2c9f94b6332bbfdd01334c9d81372084%2F1319840349990mp4.mp4%22%2C%22qualifierName%22%3A%22VIDEO%22%2C%22videoCodec%22%3A%22H264%22%2C%22audioCodec%22%3A%22AAC%22%2C%22duration%22%3A63111%2C%22height%22%3A240%2C%22width%22%3A428%2C%22fileSize%22%3A2985599%7D%5D%2C%22thumbnailList%22%3A%5B%7B%22id%22%3A%222c9f94b6332bbfdd01334c9da6ed2089%22%2C%22qualifierName%22%3A%22THUMBNAIL%22%2C%22url%22%3A%22http%3A%2F%2Fmm.sambatech.com.br%2F00238F%2Faccount%2F43%2F1%2Fmedia%2Fthumbnail%2F2c9f94b6332bbfdd01334c9da6ed2089%2F1319840343635mp4_640_505_1757049132466271302.jpg%22%2C%22width%22%3A640%2C%22height%22%3A505%7D%2C%7B%22id%22%3A%222c9f94b6332bbfdd01334c9da6fd208a%22%2C%22qualifierName%22%3A%22THUMBNAIL%22%2C%22url%22%3A%22http%3A%2F%2Fmm.sambatech.com.br%2F00238F%2Faccount%2F43%2F1%2Fmedia%2Fthumbnail%2F2c9f94b6332bbfdd01334c9da6fd208a%2F1319840343635mp4_425_344_823662935622712849.jpg%22%2C%22width%22%3A425%2C%22height%22%3A344%7D%2C%7B%22id%22%3A%222c9f94b6332bbfdd01334c9da6bb2087%22%2C%22qualifierName%22%3A%22THUMBNAIL%22%2C%22url%22%3A%22http%3A%2F%2Fmm.sambatech.com.br%2F00238F%2Faccount%2F43%2F1%2Fmedia%2Fthumbnail%2F2c9f94b6332bbfdd01334c9da6bb2087%2F1319840343635mp4_360_240_4376565005691606706.jpg%22%2C%22width%22%3A360%2C%22height%22%3A240%7D%2C%7B%22id%22%3A%222c9f94b6332bbfdd01334c9da6602086%22%2C%22qualifierName%22%3A%22THUMBNAIL%22%2C%22url%22%3A%22http%3A%2F%2Fmm.sambatech.com.br%2F00238F%2Faccount%2F43%2F1%2Fmedia%2Fthumbnail%2F2c9f94b6332bbfdd01334c9da6602086%2F1319840343635mp4_480_270_1300924639104761757.jpg%22%2C%22width%22%3A480%2C%22height%22%3A270%7D%2C%7B%22id%22%3A%222c9f94b6332bbfdd01334c9da70c208b%22%2C%22qualifierName%22%3A%22THUMBNAIL%22%2C%22url%22%3A%22http%3A%2F%2Fmm.sambatech.com.br%2F00238F%2Faccount%2F43%2F1%2Fmedia%2Fthumbnail%2F2c9f94b6332bbfdd01334c9da70c208b%2F1319840343635mp4_640_360_811185044633005179.jpg%22%2C%22width%22%3A640%2C%22height%22%3A360%7D%2C%7B%22id%22%3A%222c9f94b6332bbfdd01334c9da6dd2088%22%2C%22qualifierName%22%3A%22THUMBNAIL%22%2C%22url%22%3A%22http%3A%2F%2Fmm.sambatech.com.br%2F00238F%2Faccount%2F43%2F1%2Fmedia%2Fthumbnail%2F2c9f94b6332bbfdd01334c9da6dd2088%2F1319840343635mp4_480_385_2727187789393396178.jpg%22%2C%22width%22%3A480%2C%22height%22%3A385%7D%2C%7B%22id%22%3A%222c9f94b6332bbfdd01334c9da71c208c%22%2C%22qualifierName%22%3A%22THUMBNAIL%22%2C%22url%22%3A%22http%3A%2F%2Fmm.sambatech.com.br%2F00238F%2Faccount%2F43%2F1%2Fmedia%2Fthumbnail%2F2c9f94b6332bbfdd01334c9da71c208c%2F1319840343635mp4_640_330_27913532493643360.jpg%22%2C%22width%22%3A640%2C%22height%22%3A330%7D%5D%2C%22monetizationConfig%22%3A%7B%22googleEnabled%22%3Afalse%2C%22sambaAdsEnabled%22%3Afalse%2C%22googleAdSense%22%3A%7B%22publisherCode%22%3A%22%22%7D%2C%22yahooAds%22%3A%7B%22publisherCode%22%3A%22%22%7D%2C%22sambaAds%22%3A%7B%22advertisingVastList%22%3A%5B%7B%22vastTag%22%3A%22http%3A%2F%2Fox-d.sambaads.com%2Fv%2F1.0%2Fav%3Fauid%3D109634%26tid%3D8%22%2C%22name%22%3A%22pos%3APREROLL%2Csec%3APremio+Cabore+2011_10993%22%2C%22type%22%3A%22PREROLL%22%7D%2C%7B%22vastTag%22%3A%22http%3A%2F%2Fox-d.sambaads.com%2Fv%2F1.0%2Fav%3Fauid%3D109635%26tid%3D8%22%2C%22name%22%3A%22pos%3APOSTROLL%2Csec%3APremio+Cabore+2011_10993%22%2C%22type%22%3A%22POSTROLL%22%7D%2C%7B%22vastTag%22%3A%22http%3A%2F%2Fox-d.sambaads.com%2Fv%2F1.0%2Fav%3Fauid%3D109636%26tid%3D8%22%2C%22name%22%3A%22pos%3AMIDROLL%2Csec%3APremio+Cabore+2011_10993%22%2C%22type%22%3A%22MIDROLL%22%7D%2C%7B%22vastTag%22%3A%22http%3A%2F%2Fox-d.sambaads.com%2Fv%2F1.0%2Fav%3Fauid%3D109637%26tid%3D8%22%2C%22name%22%3A%22pos%3AOVERLAY%2Csec%3APremio+Cabore+2011_10993%22%2C%22type%22%3A%22OVERLAY%22%7D%5D%7D%7D%7D&isLive=false&isJs=true"/></object>';


  var flash_player_object_html = '<object id="'+flash_player_id+'" name="'+flash_player_id+'" type="application/x-shockwave-flash" data="http://player.sambatech.com.br/current/profiles/samba/sambaPlayer.swf" width="405" height="228"><param name="wmode" value="transparent"><param name="allowfullscreen" value="true"><param name="allowscriptaccess" value="always"><param name="flashvars" value="playerHash=17e62166fc8586dfa4d1bc0e1742c08b&amp;idmedia='+flash_player_id+'&amp;autoStart=true&amp;autoLoad=true&amp;width=405&amp;height=228&amp;endPointAMF=http%3A%2F%2Ffast.player.liquidplatform.com%2F2.0%2Fmessagebroker%2Fplayer%2F&amp;endPointREST=http%3A%2F%2Ffast.player.liquidplatform.com%2F2.0%2Fapi%2F&amp;showRelated=false&amp;customizationFile=%3Cparameters+xmlns%3Ans2%3D%22EC%3AWebServices%22+xmlns%3Ans3%3D%22http%3A%2F%2Fwww.liquidplatform.com%2FSCHEMAS%2FWebcastServices%22%3E%3CcontrolBar+backgroundAlpha%3D%2290%22+backgroundColor%3D%220x2e2e2e%22+margin%3D%220%22+mode%3D%22bottom%22+showOnFullscreen%3D%22true%22+space%3D%22%22%2F%3E%3CdurationTimeLabel+color%3D%220x797979%22+visible%3D%22true%22+x%3D%22%22+y%3D%226%22%2F%3E%3CembedButton+visible%3D%22false%22+x%3D%22%22+y%3D%22%22%2F%3E%3CfacebookButton+visible%3D%22false%22+x%3D%22%22+y%3D%22%22%2F%3E%3CfullScreenButton+baseColor%3D%22%22+highlightColor%3D%220xe1e1e1%22+iconColor%3D%220x888888%22+tip%3D%22%22+visible%3D%22true%22+x%3D%22%22+y%3D%22%22%2F%3E%3CshareButton+visible%3D%22false%22+x%3D%22%22+y%3D%22%22%2F%3E%3ClinkButton++visible%3D%22false%22+x%3D%22%22+y%3D%22%22%2F%3E%3CoutputButton+baseColor%3D%220x2b2b2b%22+borderColor%3D%220x797979%22+fontColor%3D%220xe1e1e1%22+highlightColor%3D%22%22+iconColor%3D%220x888888%22+iconOffColor%3D%220xFFFFFF%22+iconOnColor%3D%220x0071BD%22+visible%3D%22false%22+x%3D%22%22+y%3D%22%22%3E%3Coutput+id%3D%22240p%22+label%3D%22240p%22%2F%3E%3Coutput+id%3D%22360p%22+label%3D%22360p%22%2F%3E%3Coutput+id%3D%22480p%22+label%3D%22480p%22%2F%3E%3Coutput+id%3D%22720p%22+label%3D%22720p%22%2F%3E%3Coutput+id%3D%221080p%22+label%3D%221080p%22%2F%3E%3C%2FoutputButton%3E%3CpauseButton+baseColor%3D%22%22+highlightColor%3D%220xe1e1e1%22+iconColor%3D%220x888888%22+tip%3D%22%22+visible%3D%22true%22+x%3D%22%22+y%3D%22%22%2F%3E%3CplayButton+baseColor%3D%22%22+highlightColor%3D%220xe1e1e1%22+iconColor%3D%220x888888%22+tip%3D%22%22+visible%3D%22true%22+x%3D%22%22+y%3D%22%22%2F%3E%3CplayerParams+__baseEndPoint%3D%22http%3A%2F%2F204.232.187.98%3A7092%2F%22+__endPointAMF%3D%22messagebroker%2Fplayer%2F%22+__endPointREST%3D%22api%2F%22+__endPointReportVideo%3D%22%2FaddMediaRequestTime%22+allFailMsg%3D%22Can\'t+play+this+video+without+more+recent+flash+plugin+or+a+browser.%22+autoLoad%3D%22true%22+autoStart%3D%22true%22+connectionTimeout%3D%22null%22+defaultOutput%3D%22Original%22+fakeStreamParam%3D%22ec_seek%22+fallback%3D%22true%22+flashVersion%3D%2210%22+height%3D%22330%22+liveFallbackUrl%3D%22null%22+liveUrl%3D%22null%22+metadata%3D%22true%22+playerHeight%3D%22360%22+playerTheme%3D%22default%22+playerWideHeight%3D%22493%22+playerWideWidth%3D%22876%22+playerWidth%3D%22640%22+primaryPlayer%3D%22flash%22+redirectURL%3D%22%22+scaleMode%3D%22fit%22+seekBar%3D%22default%22+showControlsOnFullscreen%3D%22true%22+showRelated%3D%22false%22+showRelatedPerPage%3D%224%22+showWidgetsOnFullscreen%3D%22true%22+thumbnailPreview%3D%22true%22+width%3D%22640%22%2F%3E%3CprogressBar+backgroundColor%3D%220xebebeb%22+height%3D%22%22+loadedColor%3D%220xacacac%22+mode%3D%22top%22+timeColor%3D%220xf4ba31%22+visible%3D%22true%22+width%3D%22%22+x%3D%22%22+y%3D%22%22%2F%3E%3CprogressTimeLabel+color%3D%220xe1e1e1%22+enableTimeChange%3D%22true%22+visible%3D%22true%22+x%3D%22%22+y%3D%226%22%2F%3E%3Crelated+arrowPosition%3D%22FIXED%22+backgroundAlpha%3D%2210%22+backgroundColor%3D%220xFFFFFF%22+channelFontColor%3D%220x6DBEF4%22+highlightAlpha%3D%22100%22+highlightColor%3D%220x0071BD%22+numberOfColumns%3D%222%22+numberOfElements%3D%222%22+skinModel%3D%22SHOWRATING%22+textOrientation%3D%22RIGHT%22+titleFontColor%3D%220xFFFFFF%22+viewsFontColor%3D%220x6DBEF4%22%2F%3E%3CtwitterButton+visible%3D%22false%22+x%3D%22%22+y%3D%22%22%2F%3E%3CvolumeControl+buttonBaseColor%3D%22%22+dragbarBackgroundColor%3D%220x888888%22+dragbarFillColor%3D%220xf4ba31%22+iconOffColor%3D%220x888888%22+iconOnColor%3D%220x888888%22+scrubberColor%3D%22%22+visible%3D%22true%22+width%3D%22%22+x%3D%22%22+y%3D%22%22%2F%3E%3CwideButton+baseColor%3D%22%22+highlightColor%3D%220xe1e1e1%22+iconColor%3D%220x888888%22+tip%3D%22%22+visible%3D%22false%22+x%3D%22%22+y%3D%22%22%2F%3E%3CwidgetBar+backgroundAlpha%3D%220%22+backgroundColor%3D%22%22+margin%3D%225%22+showOnFullscreen%3D%22true%22+width%3D%22%22%2F%3E%3Cwatermark+idmedialogo%3D%22%22+imageHeight%3D%22%22+imageSize%3D%22%22+imageWidth%3D%22%22+position%3D%22%22+urlLogo%3D%22%22%2F%3E%3CbaseHtml%3E%26lt%3Bdiv+class%3D%22ui-samba-player-fullscreen%22%26gt%3B%26lt%3Bdiv+class%3D%22ui-samba-player%22%26gt%3B%26lt%3Bdiv+class%3D%22ui-video-holder%22+style%3D%22width%3A640px%3B+height%3A360px%3B%22%26gt%3B%26lt%3Bdiv+class%3D%22ui-samba-player-video-play+central-button%22+title%3D%22Assistir%22%26gt%3B%26lt%3B%2Fdiv%26gt%3B%26lt%3Bspan+class%3D%22ui-samba-player-publicity+hidden%22%26gt%3BPublicidade%26lt%3B%2Fspan%26gt%3B%26lt%3Ba+href%3D%22%23%22+class%3D%22ui-samba-player-replay+hidden%22+title%3D%22Assista+novamente%22%26gt%3B%26lt%3Bspan+class%3D%22ui-icon+ui-icon-replay%22%26gt%3B%26lt%3B%2Fspan%26gt%3BAssista+novamente%26lt%3B%2Fa%26gt%3B%26lt%3Bdiv+class%3D%22ui-samba-player-syndication%22%26gt%3B%26lt%3Ba+href%3D%22%23%22+rel%3D%22onTweet%22+title%3D%22Compartilhe+no+Twitter%22%26gt%3B%26lt%3Bspan+class%3D%22ui-icon+ui-icon-twitter%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-icon-text%22%26gt%3BTwitter%26lt%3B%2Fspan%26gt%3B%26lt%3B%2Fa%26gt%3B%26lt%3Ba+href%3D%22%23%22++rel%3D%22onFacebook%22+title%3D%22Compartilhe+no+Facebook%22%26gt%3B%26lt%3Bspan+class%3D%22ui-icon+ui-icon-facebook%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-icon-text%22%26gt%3BFacebook%26lt%3B%2Fspan%26gt%3B%26lt%3B%2Fa%26gt%3B%26lt%3B%2Fdiv%26gt%3B%26lt%3Bimg+src%3D%22%22+width%3D%22100%25%22+height%3D%22100%25%22+%2F%26gt%3B%26lt%3B%2Fdiv%26gt%3B%26lt%3Bdiv+class%3D%22ui-samba-player-video-controls+hidden%22%26gt%3B%26lt%3Bdiv+class%3D%22ui-samba-player-video-seek%22%26gt%3B%26lt%3B%2Fdiv%26gt%3B%26lt%3Bdiv+class%3D%22ui-samba-player-video-options%22%26gt%3B%26lt%3Bdiv+class%3D%22ui-samba-player-video-play%22%26gt%3B%26lt%3Ba+href%3D%22%23%22+class%3D%22ui-icon+ui-icon-play%22+title%3D%22Assistir%22%26gt%3B%26lt%3B%2Fa%26gt%3B%26lt%3B%2Fdiv%26gt%3B%26lt%3Bdiv+class%3D%22ui-samba-player-video-time%22%26gt%3B%26lt%3Bspan+class%3D%22ui-current-time%22+title%3D%22Total+assistido%22%26gt%3B00%3A00%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-total-time%22+title%3D%22Tamanho+do+video%22%26gt%3B%2F+00%3A00%26lt%3B%2Fspan%26gt%3B%26lt%3B%2Fdiv%26gt%3B%26lt%3Bdiv+class%3D%22ui-samba-player-advanced-options%22%26gt%3B%26lt%3Bdiv+class%3D%22ui-video-output%22%26gt%3B%26lt%3Bdiv%26gt%3B%26lt%3Ba+href%3D%22%23%22+style%3D%22display%3Anone%3B%22+rel%3D%221080p%22+title%3D%221080p+HD%22%26gt%3B1080p%26lt%3Bsup%26gt%3BHD%26lt%3B%2Fsup%26gt%3B%26lt%3B%2Fa%26gt%3B%26lt%3Ba+href%3D%22%23%22+style%3D%22display%3Anone%3B%22+rel%3D%22720p%22+title%3D%22720p+HD%22%26gt%3B720p%26lt%3Bsup%26gt%3BHD%26lt%3B%2Fsup%26gt%3B%26lt%3B%2Fa%26gt%3B%26lt%3Ba+href%3D%22%23%22+style%3D%22display%3Anone%3B%22+rel%3D%22480p%22+title%3D%22480p%22%26gt%3B480p%26lt%3Bsup%26gt%3B%26lt%3B%2Fsup%26gt%3B%26lt%3B%2Fa%26gt%3B%26lt%3Ba+href%3D%22%23%22+style%3D%22display%3Anone%3B%22+rel%3D%22360p%22+title%3D%22360p%22%26gt%3B360p%26lt%3Bsup%26gt%3B%26lt%3B%2Fsup%26gt%3B%26lt%3B%2Fa%26gt%3B%26lt%3Ba+href%3D%22%23%22+style%3D%22display%3Anone%3B%22+rel%3D%22240p%22+title%3D%22240p%22%26gt%3B240p%26lt%3Bsup%26gt%3B%26lt%3B%2Fsup%26gt%3B%26lt%3B%2Fa%26gt%3B%26lt%3Bspan+class%3D%22ui-arrow%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3B%2Fdiv%26gt%3B%26lt%3B%2Fdiv%26gt%3B%26lt%3Ba+href%3D%22%23%22+class%3D%22ui-icon+ui-icon-share%22+title%3D%22Compartilhamento%22%26gt%3BCompartilhe%26lt%3B%2Fa%26gt%3B%26lt%3Ba+href%3D%22%23%22+class%3D%22ui-icon+ui-icon-fullscreen%22+title%3D%22Tela+cheia%22%26gt%3BTela+cheia%26lt%3B%2Fa%26gt%3B%26lt%3Bdiv+class%3D%22ui-samba-player-volume-bar%22%26gt%3B%26lt%3Ba+class%3D%22ui-icon+ui-icon-volume%22+title%3D%22Volume+Ligado%22%26gt%3B%26lt%3B%2Fa%26gt%3B%09%26lt%3Bspan+class%3D%22ui-volume-bar%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-volume-bar%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-volume-bar%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-volume-bar%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-volume-bar%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-volume-bar%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-volume-bar%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-volume-bar%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-volume-bar%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-volume-bar%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-volume-bar+ui-volume-bar-off%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-volume-bar%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-volume-bar+ui-volume-bar-off%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-volume-bar%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-volume-bar+ui-volume-bar-off%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-volume-bar%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-volume-bar+ui-volume-bar-off%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-volume-bar%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-volume-bar+ui-volume-bar-off%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3Bspan+class%3D%22ui-volume-bar%22%26gt%3B%26lt%3B%2Fspan%26gt%3B%26lt%3B%2Fdiv%26gt%3B%26lt%3B%2Fdiv%26gt%3B%26lt%3B%2Fdiv%26gt%3B%26lt%3B%2Fdiv%26gt%3B%26lt%3B%2Fdiv%26gt%3B%26lt%3B%2Fdiv%26gt%3B%3C%2FbaseHtml%3E%3C%2Fparameters%3E&amp;embedCode=%253Cscript%2520src%253D%2522http%253A%2F%2Fplayer.sambatech.com.br%2Fcurrent%2Fsamba-player.js%253FplayerWidth%253D405%2526playerHeight%253D228%2526ph%253D17e62166fc8586dfa4d1bc0e1742c08b%2526m%253D'+flash_player_id+'%2526profileName%253DsambaPlayer-embed.xml%2522%253E%253C%2Fscript%253E&amp;&amp;ad_program=&amp;startButton=&amp;startOutput=&amp;mediaInfoObject=%7B%22title%22%3A%22Indicados+Cabor%C3%83%C2%A9+2011+-+Mood%22%2C%22id%22%3A%22'+flash_player_id+'%22%2C%22qualifierName%22%3A%22VIDEO%22%2C%22categoryName%22%3A%22Pr%C3%83%C2%AAmio+Cabor%C3%83%C2%A9+2011%22%2C%22views%22%3A6%2C%22ratings%22%3A0%2C%22ratingAverage%22%3A0%2C%22shared%22%3Afalse%2C%22hasAdvertising%22%3Afalse%2C%22defaultOutput%22%3A%22360p%22%2C%22outputList%22%3A%5B%7B%22labelText%22%3A%22720p%22%2C%22format%22%3A%22H264%22%2C%22title%22%3A%22Indicados+Cabor%C3%83%C2%A9+2011+-+Mood%22%2C%22id%22%3A%222c9f94b6332bbfdd01334c9d78f22082%22%2C%22url%22%3A%22http%3A%2F%2Fmm.sambatech.com.br%2F00238F%2Faccount%2F43%2F1%2Fmedia%2Fvideo%2F2c9f94b6332bbfdd01334c9d78f22082%2F1319840346028mp4.mp4%22%2C%22qualifierName%22%3A%22VIDEO%22%2C%22videoCodec%22%3A%22H264%22%2C%22audioCodec%22%3A%22AAC%22%2C%22duration%22%3A63088%2C%22height%22%3A720%2C%22width%22%3A1280%2C%22fileSize%22%3A15473407%7D%2C%7B%22labelText%22%3A%22480p%22%2C%22format%22%3A%22H264%22%2C%22title%22%3A%22Indicados+Cabor%C3%83%C2%A9+2011+-+Mood%22%2C%22id%22%3A%222c9f94b6332bbfdd01334c9d7e212083%22%2C%22url%22%3A%22http%3A%2F%2Fmm.sambatech.com.br%2F00238F%2Faccount%2F43%2F1%2Fmedia%2Fvideo%2F2c9f94b6332bbfdd01334c9d7e212083%2F1319840348619mp4.mp4%22%2C%22qualifierName%22%3A%22VIDEO%22%2C%22videoCodec%22%3A%22H264%22%2C%22audioCodec%22%3A%22AAC%22%2C%22duration%22%3A63088%2C%22height%22%3A480%2C%22width%22%3A854%2C%22fileSize%22%3A8031048%7D%2C%7B%22labelText%22%3A%22_RAW%22%2C%22format%22%3A%22H264%22%2C%22title%22%3A%22Indicados+Cabor%C3%83%C2%A9+2011+-+Mood%22%2C%22id%22%3A%222c9f94b6332bbfdd01334c9d6e682081%22%2C%22url%22%3A%22http%3A%2F%2Fmm.sambatech.com.br%2F00238F%2Faccount%2F43%2F1%2Fmedia%2Fvideo%2F2c9f94b6332bbfdd01334c9d6e682081%2F1319840343635mp4.mp4%22%2C%22qualifierName%22%3A%22VIDEO%22%2C%22videoCodec%22%3A%22H264%22%2C%22audioCodec%22%3A%22AAC%22%2C%22duration%22%3A63065%2C%22height%22%3A720%2C%22width%22%3A1280%2C%22fileSize%22%3A16316700%7D%2C%7B%22labelText%22%3A%22360p%22%2C%22format%22%3A%22H264%22%2C%22title%22%3A%22Indicados+Cabor%C3%83%C2%A9+2011+-+Mood%22%2C%22id%22%3A%222c9f94b6332bbfdd01334c9d85342085%22%2C%22url%22%3A%22http%3A%2F%2Fmm.sambatech.com.br%2F00238F%2Faccount%2F43%2F1%2Fmedia%2Fvideo%2F2c9f94b6332bbfdd01334c9d85342085%2F1319840350721mp4.mp4%22%2C%22qualifierName%22%3A%22VIDEO%22%2C%22videoCodec%22%3A%22H264%22%2C%22audioCodec%22%3A%22AAC%22%2C%22duration%22%3A63088%2C%22height%22%3A360%2C%22width%22%3A640%2C%22fileSize%22%3A5046393%7D%2C%7B%22labelText%22%3A%22240p%22%2C%22format%22%3A%22H264%22%2C%22title%22%3A%22Indicados+Cabor%C3%83%C2%A9+2011+-+Mood%22%2C%22id%22%3A%222c9f94b6332bbfdd01334c9d81372084%22%2C%22url%22%3A%22http%3A%2F%2Fmm.sambatech.com.br%2F00238F%2Faccount%2F43%2F1%2Fmedia%2Fvideo%2F2c9f94b6332bbfdd01334c9d81372084%2F1319840349990mp4.mp4%22%2C%22qualifierName%22%3A%22VIDEO%22%2C%22videoCodec%22%3A%22H264%22%2C%22audioCodec%22%3A%22AAC%22%2C%22duration%22%3A63111%2C%22height%22%3A240%2C%22width%22%3A428%2C%22fileSize%22%3A2985599%7D%5D%2C%22thumbnailList%22%3A%5B%7B%22id%22%3A%222c9f94b6332bbfdd01334c9da6ed2089%22%2C%22qualifierName%22%3A%22THUMBNAIL%22%2C%22url%22%3A%22http%3A%2F%2Fmm.sambatech.com.br%2F00238F%2Faccount%2F43%2F1%2Fmedia%2Fthumbnail%2F2c9f94b6332bbfdd01334c9da6ed2089%2F1319840343635mp4_640_505_1757049132466271302.jpg%22%2C%22width%22%3A640%2C%22height%22%3A505%7D%2C%7B%22id%22%3A%222c9f94b6332bbfdd01334c9da6fd208a%22%2C%22qualifierName%22%3A%22THUMBNAIL%22%2C%22url%22%3A%22http%3A%2F%2Fmm.sambatech.com.br%2F00238F%2Faccount%2F43%2F1%2Fmedia%2Fthumbnail%2F2c9f94b6332bbfdd01334c9da6fd208a%2F1319840343635mp4_425_344_823662935622712849.jpg%22%2C%22width%22%3A425%2C%22height%22%3A344%7D%2C%7B%22id%22%3A%222c9f94b6332bbfdd01334c9da6bb2087%22%2C%22qualifierName%22%3A%22THUMBNAIL%22%2C%22url%22%3A%22http%3A%2F%2Fmm.sambatech.com.br%2F00238F%2Faccount%2F43%2F1%2Fmedia%2Fthumbnail%2F2c9f94b6332bbfdd01334c9da6bb2087%2F1319840343635mp4_360_240_4376565005691606706.jpg%22%2C%22width%22%3A360%2C%22height%22%3A240%7D%2C%7B%22id%22%3A%222c9f94b6332bbfdd01334c9da6602086%22%2C%22qualifierName%22%3A%22THUMBNAIL%22%2C%22url%22%3A%22http%3A%2F%2Fmm.sambatech.com.br%2F00238F%2Faccount%2F43%2F1%2Fmedia%2Fthumbnail%2F2c9f94b6332bbfdd01334c9da6602086%2F1319840343635mp4_480_270_1300924639104761757.jpg%22%2C%22width%22%3A480%2C%22height%22%3A270%7D%2C%7B%22id%22%3A%222c9f94b6332bbfdd01334c9da70c208b%22%2C%22qualifierName%22%3A%22THUMBNAIL%22%2C%22url%22%3A%22http%3A%2F%2Fmm.sambatech.com.br%2F00238F%2Faccount%2F43%2F1%2Fmedia%2Fthumbnail%2F2c9f94b6332bbfdd01334c9da70c208b%2F1319840343635mp4_640_360_811185044633005179.jpg%22%2C%22width%22%3A640%2C%22height%22%3A360%7D%2C%7B%22id%22%3A%222c9f94b6332bbfdd01334c9da6dd2088%22%2C%22qualifierName%22%3A%22THUMBNAIL%22%2C%22url%22%3A%22http%3A%2F%2Fmm.sambatech.com.br%2F00238F%2Faccount%2F43%2F1%2Fmedia%2Fthumbnail%2F2c9f94b6332bbfdd01334c9da6dd2088%2F1319840343635mp4_480_385_2727187789393396178.jpg%22%2C%22width%22%3A480%2C%22height%22%3A385%7D%2C%7B%22id%22%3A%222c9f94b6332bbfdd01334c9da71c208c%22%2C%22qualifierName%22%3A%22THUMBNAIL%22%2C%22url%22%3A%22http%3A%2F%2Fmm.sambatech.com.br%2F00238F%2Faccount%2F43%2F1%2Fmedia%2Fthumbnail%2F2c9f94b6332bbfdd01334c9da71c208c%2F1319840343635mp4_640_330_27913532493643360.jpg%22%2C%22width%22%3A640%2C%22height%22%3A330%7D%5D%2C%22monetizationConfig%22%3A%7B%22googleEnabled%22%3Afalse%2C%22sambaAdsEnabled%22%3Afalse%2C%22googleAdSense%22%3A%7B%22publisherCode%22%3A%22%22%7D%2C%22yahooAds%22%3A%7B%22publisherCode%22%3A%22%22%7D%2C%22sambaAds%22%3A%7B%22advertisingVastList%22%3A%5B%7B%22vastTag%22%3A%22http%3A%2F%2Fox-d.sambaads.com%2Fv%2F1.0%2Fav%3Fauid%3D109634%26tid%3D8%22%2C%22name%22%3A%22pos%3APREROLL%2Csec%3APremio+Cabore+2011_10993%22%2C%22type%22%3A%22PREROLL%22%7D%2C%7B%22vastTag%22%3A%22http%3A%2F%2Fox-d.sambaads.com%2Fv%2F1.0%2Fav%3Fauid%3D109635%26tid%3D8%22%2C%22name%22%3A%22pos%3APOSTROLL%2Csec%3APremio+Cabore+2011_10993%22%2C%22type%22%3A%22POSTROLL%22%7D%2C%7B%22vastTag%22%3A%22http%3A%2F%2Fox-d.sambaads.com%2Fv%2F1.0%2Fav%3Fauid%3D109636%26tid%3D8%22%2C%22name%22%3A%22pos%3AMIDROLL%2Csec%3APremio+Cabore+2011_10993%22%2C%22type%22%3A%22MIDROLL%22%7D%2C%7B%22vastTag%22%3A%22http%3A%2F%2Fox-d.sambaads.com%2Fv%2F1.0%2Fav%3Fauid%3D109637%26tid%3D8%22%2C%22name%22%3A%22pos%3AOVERLAY%2Csec%3APremio+Cabore+2011_10993%22%2C%22type%22%3A%22OVERLAY%22%7D%5D%7D%7D%7D&amp;isLive=false&amp;isJs=true"></object>';
  var flash_player_html = '<div class="samba-player">'+
                          ($('html').hasClass('notie') ? flash_player_object_html : flash_player_object_ie_html)+'</div>';
  var html5video_player_html =  '<video id="'+flash_player_id+'" width="405" height="228" poster="'+$(this).children('.poster').attr('src')+'" controls>'+
                                '<source src="'+mp4_url+'" type="video/mp4" />'+
                                '</video>';
  if (canPlayMP4Natively()){
    $(this).replaceWith(html5video_player_html);
    $('#'+flash_player_id)[0].addEventListener('canplay', function() { this.play(); } ); 
  }else{
    $(this).replaceWith(flash_player_html);
  }
}
function loadIndicado(path){
  var content_path = path.replace('indicados', 'content');
  var path_parts = content_path.split('/');
  var content_div = $('#candidate-content-container');
  content_div.fadeOut(500, function(){
    $(this).html('');
    $(this).load(content_path+'detalhes.html'+'?cachebust='+cachebust+' #candidate-content', function() {
      IeHrefFix();
      insertVideoEmbeds();
      // $('.video-link').click(videoClicked);
      updateOutlineHeight();
      $('#candidate-content-container').delay(500).fadeIn(1000);
    });
  })
}
function menuitemClicked(event){
  // console.log('menuitemClicked');
  var   link = $(this)
      , item_nome = link.attr('_href').substring(1)
      , item = $('#link-'+item_nome)
      , espera = 0;
  // if (link.attr('id') == 'link-votacao') { return true; }
  event.preventDefault();
  if (item.hasClass('selected')&&(item_nome != 'indicados')){ return false; }
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
  IeHrefFix();
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
    $('#link-'+page_name).addClass('selected');
    desceFichas(page_name);
  }
  if (body_element.hasClass('section-home')){
    // $('#carta-2 a').bind('click',menuitemClicked);
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




















