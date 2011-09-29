# -*- coding: utf-8 -*-

from __future__ import with_statement

import os, sys, re, codecs
base = os.path.abspath(os.path.dirname(__file__))
templates_dir = os.path.join(base,os.path.pardir, 'templates')
content_dir = os.path.join(base,os.path.pardir, 'content')
output_dir = os.path.join(base,os.path.pardir, 'build')


sys.path.append(os.path.join(base, 'lib'))
import pystache
loader = pystache.Loader()
template = loader.load_template('main', templates_dir, 'utf-8', 'html')

def extract_meta(html):
  pattern = re.compile('<!--\n*([^>]*?)\n*-->([^¥]*)')
  matches = pattern.match(html)
  meta = {}
  if (matches):
    for key_value in matches.group(1).split('\n'):
      (key, value) = key_value.split(':')
      meta[key] = value.strip()
  return meta

for fname in os.listdir(content_dir):
  f = open(os.path.join(content_dir, fname), 'r')
  content = unicode(f.read(), 'utf-8')
  metadata = extract_meta(content)
  filename_parts = fname.split('.')
  print '\n\n\n----------'
  if (len(filename_parts) == 2):
    section_name = filename_parts[0]
    data = {
      'page_title': metadata['title'] if 'title' in metadata else 'Caboré 2011',
      'extra_classes': metadata['extra_classes'] if 'extra_classes' in metadata else '',
      'page_section': section_name,
      'content': content
    }
    print 'sessao: {}\n----------'.format(section_name)
    output = pystache.render(template, data)
    # print output
    index_file_path = os.path.join(output_dir, section_name if section_name != 'home' else '', 'index.html')
    index_file = codecs.open(index_file_path, encoding='utf-8', mode='w+')
    index_file.write(output)
    ajax_file_path = os.path.join(output_dir, section_name, 'ajax.html')
    ajax_file_path = codecs.open(ajax_file_path, encoding='utf-8', mode='w+')
    ajax_file_path.write(content)
  else:
    pass
    # print 'interna\n----------'

# print pystache.render('Hi {{person}}!', {'person': 'Mom'})
