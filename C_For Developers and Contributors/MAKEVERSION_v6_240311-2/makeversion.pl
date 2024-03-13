#!/usr/bin/perl
#	makeversion.pl	Version 240311-2
#	Author: Bernhard Jaun, ETH Zurich, 11 March 2024
# INPUT: source files
# Convention on naming the source files:
# MOSFECCS_vy_SVG_DEV_xxxxxx-z.html is the source file for development containing numerous console.log 
# and display statements for debugging purposes.
# MOSFECCS_vy_SVG_xxxxxx-z is the same source file where all lines matching //CL, //CLP, &//CLF or //DSP
# have been deleted.
# makeversion_ETH.pl can use either of the two to generate the production files, 
# provided this naming convention is followed.
# USAGE: put makeversion.pl (execute permissions), the bash-script acc.sh (execute permissions),
#        the source code either as development source MOSFECCS_vy_SVG_DEV_xxxxxx-y 
#        or the production source MOSFECCS_vy_SVG_xxxxxx-y.html
#        and the subfolder "specific_code"
#        into a folder.
#        cd to this folder in terminal shell
#        run ./makeversion.pl (which calls acc.sh for compilation with closure compiler in ADVANCED mode)
# RESULT: a file MOSFECCS_vy_xxxxxx.html with the normal version (without SVG)
#                version and build as well as title are adjusted from xxxxxx-y in source file name
#         a file MOSFECCS_vy_xxxxxxcc.html with the compiled normal version (-> "main file" in Moodle)
#         a file mv_xxxxxx.js containing the code to compile (script2) 
#         a file mv_xxxxxxcc.js containing the compiled code of script2
#         a file mostest_xxxxxx.js (run with nodeJS with XX_testMol.txt file as input)
#         a file msvg_xxxxxx.js (run with nodeJS with BP_..._CDE.txt file as input)
# Tests:  products generated from MOSFECCS_v6_SVG_2240311-2.html (source) were
#         tested manually (MOSFECCS_V6_240311.html and MOSFECCS_v6_240311cc.html)
#         mostest_v6_240311-2.js with BJ_all_testMol_240311.txt
#         msvg_240311.js with BP_W2024.
#
#         B.Jaun 11 March 2024. 
               
use strict;

use Cwd;
use File::Basename;
use Text::ParseWords;


my $timestamp = `date`;
chomp $timestamp;

#---------current directory-----------
my $dir = cwd();
my $mainversion='';
my $version='';
my $build = '';
my $title = '';
my $line = '';
my $command = '';
my @files;
my $logfile = $dir . "/makeversion.log";
my $source = '';

my $editsource = 1;
my $n_svg_dev_files;
my $n_svg_files;
my $linesdeleted=0;
my $devsource = ''; # the MOSFECCS_v6_DEV_SVG_xxxxxx-y.html development source file
my $prodsource = ''; # the product souce file: MOSFECCS_v6_SVG_xxxxxx-y.html

# filenames of input template files (not imported portions of code)
my $mvframe = $dir . "/specific_code/mosfeccs_frame.txt";
my $mvpms = $dir . "/specific_code/mosfeccs_pms.txt";
my $mostestframe = $dir . "/specific_code/mostest_frame.txt";
my $mostestsvg = $dir . "/specific_code/mostest_SVG.txt";
my $mostestpms = $dir . "/specific_code/mostest_pms.txt";

# filenames of output files
my $mvhtml = ''; # the final MOSFECCS_vy_xxxxxx.html file
my $mvhtml_tmp = '';
my $mvfacc = ''; # the code part to compile: mvy_xxxxxx.js
my $mvcc = ''; # the compiled code: mvy_xxxxxxcc.js
my $mvcchtml = ''; # the final file with compiled code between the 2nd script tags MOSFECCS_v5_xxxxxxcc.html
my $mostest = ''; # the final mostest_xxxxxx.js file
my $mostest_tmp = '';


open (LOG, ">$logfile") || die "Error: Could not open Log file\n";

open (LOG, ">$logfile") || die "Error: Could not open Log file\n";
print LOG "makeversion_ETH.pl run at $timestamp\n=================================\n";

# look for MOSFECCS_vy_SVG_DEV_xxxxxx.html as source file and extract the version
@files = glob "MOSFECCS_v*_SVG_DEV_*.html";
$n_svg_dev_files = $#files;
print LOG "Number of files in glob for SVG_DEV=" . $n_svg_dev_files . "\n";
if ($n_svg_dev_files > 0) { # more than one SVG_DEV present: ambiguous -> abort!
	print LOG "Error: More than one MOSFECCS_vy_SVG_DEV_xxxxxx.html file in this directory!\n";
	die;
} elsif ($n_svg_dev_files == 0) { # just one SVG_DEV file, must be edited to SVG 
  $editsource = 1;
  print LOG "edit source=" . $editsource . "\n";
	$devsource = $dir . "/" . $files[0];
} elsif ($n_svg_dev_files == -1) { # no svg_dev file, look for svg file
  @files = glob "MOSFECCS_v*_SVG_*.html";
  $n_svg_files = $#files;
  if ($n_svg_files == 0) { # no SVG_DEV but SVG present. Skip editing.
    print LOG "Number of files in glob for SVG=" . $n_svg_files . "\n";
    $editsource = 0;
    print LOG "edit source=" . $editsource . "\n";
    $prodsource = $dir . "/" . $files[0];
    if ($prodsource =~ /MOSFECCS_v(\d{1,2})_SVG_(\d{6}-?\d?)\.html/) {
      $mainversion = $1;
      $version=$2;
      print LOG "version initial=" . $version . "\n";
      if ($version =~ /(\d{6})-(\d{1,2})/) {
        $version = $1 . "-" . $2;
      } else {
        $version = $version . "-1";
      }
    }
    print LOG "production source: " . $prodsource . "\n";  
    print LOG "mainversion=" . $mainversion . "\nversion=" . $version  . "\n"; 
} else { 
    print LOG "Error: no file matching /MOSFECCS_v*_SVG_*.html/ in this directory!\n";
    close LOG;
    die;
  }
}
if ($editsource == 1) { # edit the DEV source to give product source
  print LOG "development source: " . $devsource . "\n";
  if ($devsource =~ /MOSFECCS_v(\d{1,2})_SVG_DEV_(\d{6}-?\d?)\.html/) {
    $mainversion = $1;
    $version=$2;
    print LOG "version initial=" . $version . "\n";
    if ($version =~ /(\d{6})-(\d{1,2})/) {
      $version = $1 . "-" . $2;
    } else {
      $version = $version . "-1";
    }
  }
  print LOG "mainversion=" . $mainversion . "\nversion=" . $version . "\n"; 
  # the filename of the output file to be generated
  $prodsource = $dir . "/MOSFECCS_v" . $mainversion . "_SVG_" . $version . ".html";
  print LOG $devsource . " will be edited to production source: " . $prodsource . "\n";
  
  # Making the MOSFECCS_vm_SVG_xxxxxx-y.html file
  #==============================================
  open (IN,$devsource) || die "Could not open $devsource file for reading\n";
  open (OUT, ">$prodsource") || die "Error: Could not open $prodsource file\n";
  
  while ($line = <IN>) {
    if ($line =~ /\/\/CL$|\/\/CLP|\/\/CLF$|\/\/DSP$/) { 
      $linesdeleted++;
      next; 
    }
    print OUT $line;
  }
  close IN;
  close OUT;
  print LOG $prodsource . " written. " . $linesdeleted . " lines deleted\n";
}

$source = $prodsource;
# print LOG "makeversion.pl run at $timestamp\n=================================\n";
print "source: " . $source . "\n";
print "products:\n";
print LOG "source: " . $source . "\n";
print LOG "products:\n";

if ($source =~ /MOSFECCS_v(\d{1,2})_SVG_(\d{6}-?\d?)\.html/) {
  $mainversion = $1;
  $version=$2;
  if ($version =~ /(\d{6})-(\d{1,2})/) {
    $version = $1;
    $build = $1 . "." . $2;
  } else {
    $version = $1;
    $build = $1 . ".1";
  }
  $title = "    <title>MOSFECCS_v" . $mainversion . "_" . $version . "(build " . $build . ")</title>";
}
# the filenames of the output files to be generated
$mvhtml = $dir . "/MOSFECCS_v" . $mainversion . "_" . $version . ".html";
$mvhtml_tmp = $dir . "/MOSFECCS_v" . $mainversion . "_tmp" . $version . ".html";
$mvfacc = $dir . "/mv" . $mainversion . "_" . $version . ".js";
$mvcc = $dir . "/mv" . $mainversion . "_" . $version . "cc" . ".js";
$mvcchtml = $dir . "/MOSFECCS_v" . $mainversion . "_" . $version . "cc" . ".html";
$mostest = $dir . "/mostest_" . $version . ".js";
$mostest_tmp = $dir . "/mostest_tmp" . $version . ".js";

# MOSFECCS_vy Making the MOSFECCS_vy_xxxxxx.html file
#=========================================
# open the temporary mvhtml_tmp.html file for writing
  open (OUT, ">$mvhtml_tmp") || die "Error: Could not open $mvhtml_tmp file\n";
# open the mv_frame.txt file and copy it to the temporary mvhtml_tmp file
  open (IN, $mvframe) || die "Error: mosfeccs_frame.txt not found!\n";
  while ($line = <IN>) {
    $line =~ s/std_full_rs/std_min_rs/g;
    $line =~ s/tablet_full_rs/tablet_min_rs/g;
    $line =~ s/desktop_full_rs/desktop_min_rs/g;
    print OUT $line;
  }
  close IN;
  close OUT;

# open mv_SVG HTML source file and extract the INTERACTIVE,SVG,COMMON,MV_SVG_DEV_PMS,PMS and HTML-TERM parts.
	open (SRC, $source) || die "Error: could not open $source for reading\n";
  open (OUT, ">>$mvhtml_tmp") || die "Error: Could not open $mvhtml_tmp file\n"; #append mode
	
	while (<SRC>) { 
	  print OUT if (/^<!-- START INTERACTIVE -->/../^\/\/END INTERACTIVE/);
	}
	close SRC;
	open (SRC, $source) || die "Error: could not open $source for reading\n";
	while (<SRC>) { 
	  print OUT if (/^\/\/START COMMON/../^\/\/END COMMON/);
	}
# append the  
	close SRC;
  open (SRC, $source) || die "Error: could not open $source for reading\n";
	while (<SRC>) { 
	  print OUT if (/^\/\/START MV_SVG_DEV PMS/../\/\/END MV_SVG_DEV PMS/); # mv and mv_SVG_DEV have the same PMS
	}
	close SRC;
	open (SRC, $source) || die "Error: could not open $source for reading\n";
	while (<SRC>) { 
	  print OUT if (/^\/\/START PMS/../\/\/END PMS/);
	}
	close SRC;
	open (SRC, $source) || die "Error: could not open $source for reading\n";
	while (<SRC>) { 
	  print OUT if (/^\/\/START HTML-TERM/../<!--END HTML-TERM-->/);
	}
  close SRC;
  close OUT;
  
  # replace versions and builds and drawCanvas function call in mvhtml_tmp.html and copy the result to mvhtml.html
  open (IN, $mvhtml_tmp) || die "Error: could not open $mvhtml_tmp for reading\n";
  open (OUT, ">$mvhtml") ||  die "Error: Could not open file $mvhtml for writing \n";
  while ($line = <IN>) {
    if ($line =~ /const version/) {
      $line = '        const version = ' . '"' . "v" . $mainversion . "_" . $version . '"' . "\n";
    }
    if ($line =~ /const build/) {
      $line = '        const build = ' . '"' . $build . '"' . "\n";
    }
    if ($line =~ /<title>/) {
      $line = $title . "\n";
    }
    if ($line =~ /^\s+drwCanv/) {
      $line = "      drwCanv(pad,phone,app,arrows,helpWindow,{});" . "\n";
    }
#     $line =~ s/clearSelection\(/clearSelection_svg\(/g;
#     $line =~ s/deleteAtom\(/deleteAtom_svg\(/g;
#     $line =~ s/getboundrect\(/getboundrect_svg\(/g;
    print OUT $line;
  }    
  close IN;
  close OUT;

# MOSFECCS_COMPILED Making the MOSFECCS_vy_xxxxxxcc.html file
#============================================================
  
  # making the mv_xxxxxx.js file for closure compiler 
  open (IN, $mvhtml) ||  die "Error: Could not open file $mvhtml for reading \n"; 
  open (OUT, ">$mvfacc") ||  die "Error: Could not open file $mvfacc for writing \n";
	while (<IN>) { 
	  print OUT if (/^\/\/START CODE TO COMPILE/../\/\/END CODE TO COMPILE/);
	}
  close IN;
  close OUT; 
  
  unlink $mvhtml_tmp;
  print $mvhtml . " written" . "\n";
  print LOG $mvhtml . " written" . "\n";
  print $mvfacc . " written" . "\n";
  print LOG $mvfacc . " written" . "\n";
  
  # compiling the mv_xxxxxx.js file with closure compiler
  # call the bash shell script acc.sh (which calls the compiler on mfacc.js) 
  $command = $dir . "/acc.sh $mvfacc";
  system($command);
    
  # making a copy of MOSFECCS_vy_xxxxxx.html with the script 2 code replaced by compiled code
  open (IN, $mvhtml) ||  die "Error: Could not open file $mvhtml for reading \n"; 
  open (OUT, ">$mvcchtml") ||  die "Error: Could not open file $mvcchtml for writing \n";
	while (<IN>) { 
	  print OUT if (/<!-- START MOSFECCS_SVG FRAME -->/../\/\/START CODE TO COMPILE/);
  }
  close IN;
  open (IN, $mvcc) || die "Error: could not open $mvcc for reading \n";
	while (<IN>) { 
	  print OUT;
  }
  close IN;
  open (IN, $mvhtml) ||  die "Error: Could not open file $mvhtml for reading \n"; 
	while (<IN>) { 
	  print OUT if (/\/\/END CODE TO COMPILE/../<!--END HTML-TERM-->/);
  }
  close IN;
  close OUT;
  print $mvcchtml . " written" . "\n";
  print LOG $mvcchtml . " written" . "\n";


# MOSTEST Making the mostest_xxxxxx.html file
#============================================
# open the mostest_versionnumber.js file for writing
  open (OUT, ">$mostest_tmp") || die "Error: Could not open $mostest file for writing\n";

# open the mostest_frame.txt file
  open (IN, $mostestframe) || die "Error: File $mostestframe not found!\n";
  while (<IN>) {
    print OUT;
  }
  close IN;
  close OUT;

# open the mostest_SVG.txt file
  open (OUT, ">>$mostest_tmp") || die "Error: Could not open file $mostest_tmp for writing \n";
  open (IN, $mostestsvg) || die "Error: template file $mostestsvg not found!\n";
  while (<IN>) {
    print OUT;
  }
  close IN;

# open mv_SVG_DEV HTML file and extract the INTERACTIVE,SVG,COMMON parts.
	open (SRC, $source) || die "Error: could not open $source for reading\n";
	while (<SRC>) { 
	  print OUT if (/\/\/START SVG/../^\/\/END SVG/);
	}
	close SRC;
	open (SRC, $source) || die "Error: could not open $source for reading\n";
	while (<SRC>) { 
	  print OUT if (/^\/\/START COMMON/../^\/\/END COMMON/);
	}
	close SRC;
	
# open the mostest_pms.txt file
  open (IN, $mostestpms) || die "Error: template file $mostestpms not found!\n";
  while (<IN>) {
    print OUT;
  }
  close IN;

# open mv_SVG HTML file and extract the PMS part.
	open (SRC, $source) || die "Error: could not open $source for reading\n";
	while (<SRC>) { 
	  print OUT if (/^\/\/START PMS/../\/\/END PMS/);
	}
	close SRC;
  close OUT;
  
  # replace mv function calls by mostest function calls
  open (IN, $mostest_tmp) || die "Error: could not open $mostest_tmp for reading\n";
  open (OUT, ">$mostest") ||  die "Error: Could not open file $mostest for writing \n";
  while ($line = <IN>) {
    if ($line =~ /\/\/ mostest_/) {
      $line = "// mostest_" . $version . ".js" . "\n";
    }
    if ($line =~ /const version/) {
      $line = '        const version = ' . '"' . "mostest_" . $version . '"' . "\n";
    }
    if ($line =~ /const build/) {
      $line = '        const build = ' . '"' . $build . '"' . "\n";
    }
    if ($line =~ /end of drawCanvas\(\) function/) {
      $line = "    } )(); // end of mostest() IFFE function" . "\n";
    }  
#     $line =~ s/clearSelection\(/clearSelection_svg\(/g;
#     $line =~ s/deleteAtom\(/deleteAtom_svg\(/g;
#     $line =~ s/getboundrect\(/getboundrect_svg\(/g;
    print OUT $line;
  }    
  close IN;
  close OUT;
  unlink $mostest_tmp;
  print $mostest . " written" . "\n";
  print LOG $mostest . " written" . "\n";
  
  close LOG;

