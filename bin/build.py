# -*- coding: utf-8 -*-

from __future__ import with_statement

import os, sys
base = os.path.abspath(os.path.dirname(__file__))
templates_dir = os.path.join(base,os.path.pardir, 'templates')
content_dir = os.path.join(base,os.path.pardir, 'content')
output_dir = os.path.join(base,os.path.pardir, 'www')


sys.path.append(os.path.join(base, 'lib'))
import pystache
loader = pystache.Loader()
template = loader.load_template('main', templates_dir, 'utf-8', 'html')

pessoas = {
  'JairoLeal': {
    'nome': 'Jairo Leal',
    'description': ''
  }
}
categorias = [
  {
    'slug': 'empresario_ou_dirigente',
    'title': 'Empresário ou dirigente da indústria da comunicação'
    'concorrentes': [
      'Jairo Leal',
      'description',
      ''
    ]
  },
  {
    'slug': 'agencia',
  },
  {
    'slug': 'profissional_criacao',
  },
  {
    'slug': 'profissional_atendimento',
  },
  {
    'slug': 'profissional_planejamento',
  },
  {
    'slug': 'veiculo_midia_eletronica',
  },
  {
    'slug': 'veiculo_midia_impressa',
  },
  {
    'slug': 'profissional_midia',
  },
  {
    'slug': 'profissional_veiculo',
  },
  {
    'slug': 'anunciante',
  },
  {
    'slug': 'profissional_marketing',
  },
  {
    'slug': 'servico_especializado',
  },
  {
    'slug': 'producao_publicitaria',
  }  
]
page_arguments = {
  'cabore':{
    'page_title': 'Caboré 2011',
    'page_section': 'cabore',
    'extra_classes': '',
    'content': open(os.path.join(content_dir, 'cabore.html'), 'r').read()
  },
  'indicados':{
    'page_title': 'Caboré 2011 - Indicados',
    'page_section': 'indicados',
    'extra_classes': '',
    'content': open(os.path.join(content_dir, 'indicados.html'), 'r').read()
  },
  'indicados.categoria':{
    'page_title': 'Caboré 2011 - Indicados',
    'page_section': 'indicados',
    'extra_classes': '',
    'content': open(os.path.join(content_dir, 'indicados.categoria.html'), 'r').read()
  },
  'indicados.categoria.detalhes':{
    'page_title': 'Caboré 2011 - Votação',
    'page_section': 'cabore',
    'extra_classes': '',
    'content': open(os.path.join(content_dir, 'cabore.html'), 'r').read()
  },
  'cabore':{
    'page_title': 'Caboré 2011 - Votação',
    'page_section': 'cabore',
    'extra_classes': '',
    'content': open(os.path.join(content_dir, 'cabore.html'), 'r').read()
  },
  'cabore':{
    'page_title': 'Caboré 2011 - Votação',
    'page_section': 'cabore',
    'extra_classes': '',
    'content': open(os.path.join(content_dir, 'cabore.html'), 'r').read()
  },
  'cabore':{
    'page_title': 'Caboré 2011 - Votação',
    'page_section': 'cabore',
    'extra_classes': '',
    'content': open(os.path.join(content_dir, 'cabore.html'), 'r').read()
  },
  'cabore':{
    'page_title': 'Caboré 2011 - Votação',
    'page_section': 'cabore',
    'extra_classes': '',
    'content': open(os.path.join(content_dir, 'cabore.html'), 'r').read()
  },
  'cabore':{
    'page_title': 'Caboré 2011 - Votação',
    'page_section': 'cabore',
    'extra_classes': '',
    'content': open(os.path.join(content_dir, 'cabore.html'), 'r').read()
  },
}

print page_arguments

# for fname in os.listdir(content_dir):
#   f = open(os.path.join(content_dir, fname), 'r')
#   content = f.read()


# print pystache.render('Hi {{person}}!', {'person': 'Mom'})
