#!/bin/bash
# bash script for compilation of .js file with closure compiler in the ADVANCED mode
# USAGE: ./acc.sh infilename.js
# the first and only argument is the filename of the .js file to be compiled,
# which must reside in the current directory

input=$1

pat=".js"
subst="cc.js"
substerr="aerr.txt"

output=${input/$pat/$subst}
stderr=${input/$pat/$substerr}
/Users/bj/MOSFECCS/MOSFECCS_DEV/closure_compiler/compiler --compilation_level ADVANCED $input > $output 2>$stderr
echo $input "compiled to " $output