/* Author: 

*/
var sombra_bg = '<div id="sombra-top"><img src="img/sombra-top.png" /></div><div id="sombra-bottom"><img src="img/sombra-bottom.png" /></div>';

function init(){
  var is_ie_6 = $('html').hasClass('ie6');
  if (!is_ie_6){ $('body').append(sombra_bg); }
}
$(init);




















