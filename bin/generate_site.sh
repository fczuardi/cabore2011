#!/bin/bash
rm -rf build

mkdir build
mkdir build/cabore
mkdir build/festa
mkdir build/home
mkdir build/indicados
mkdir build/premiacao
mkdir build/promocao
mkdir build/votacao

python bin/build.py

#copy assets
cp -Rfv css build/
cp -Rfv js build/
cp -Rfv img build/
cp -Rfv fonts build/
cp -Rfv photos build/

