//libraries
var   sys = require('sys')
    , fs = require('fs')
    , Mu = require('./lib/mu');

//constants
var   TEMPLATES_DIR = __dirname+'/../templates'
    , CONTENT_DIR =  __dirname+'/../content'
    , BUILD_DIR =  __dirname+'/../build'
    , TEMPLATES_EXTENSION = 'html'
    , SECTION_NAMES = [   'home'
                        , 'cabore'
                        , 'indicados'
                        , 'votacao'
                        , 'premiacao'
                        , 'festa'
                      ]
    , TITLE_PREFIX = "Caboré 2011";

//global vars
var contexts = {
        'home':       { 'title': TITLE_PREFIX + ''}
      , 'cabore':     { 'title': TITLE_PREFIX + ' - Sobre o Prêmio'}
      , 'indicados':  { 'title': TITLE_PREFIX + ' - Indicados'}
      , 'votacao':    { 'title': TITLE_PREFIX + ' - Votação'}
      , 'premiacao':  { 'title': TITLE_PREFIX + ' - Premiação'}
      , 'festa':      { 'title': TITLE_PREFIX + ' - Festa'}
    }
    , pages = {}
    , compiled_pages = {}
    , content_filenames
    , main_template = fs.readFileSync(TEMPLATES_DIR+'/index.html', 'utf-8');
    

//Template engine settings
Mu.templateRoot = TEMPLATES_DIR;
Mu.templateExtension = TEMPLATES_EXTENSION;

//Functions
//rederer callback, store the generated pages on the pages global object
function renderOnData(slug, c){
  if (typeof pages[slug] === 'undefined'){ pages[slug] = ''; }
  pages[slug] += c;
}
function renderOnEnd(slug, c){
  //    TBD TBD TBD ESCREVER NO DISCO 
  console.log(pages[slug]);
}

//generate session pages
SECTION_NAMES.forEach(function(slug){
  var   partials = {
          'content':  fs.readFileSync(TEMPLATES_DIR+'/#page-content/'+slug+'.html', 'utf-8')
        };
  compiled_pages[slug] = Mu.compileText(main_template, partials);
  compiled_pages[slug](contexts[slug])
                          .addListener('data', renderOnData.bind(null, slug))
                          .addListener('end', renderOnEnd.bind(null, slug))
});
