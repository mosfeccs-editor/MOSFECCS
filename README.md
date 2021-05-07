<h2>MOSFECCS Structural Formula Editor</h2>

<p><strong>MO</strong>lecular <strong>S</strong>tructural <strong>F</strong>ormula <strong>E</strong>ditor <strong>C</strong>alculatig <strong>C</strong>anonical <strong>S</strong>MILES</p>

><img src="mosfeccs.png" > 

###Purpose and Current Use of MOSFECCS

><a href="LICENSE.md"><strong>LICENSE:</strong></a> MOSFECCS is licensed under the GNU Public License 3. <em>See</em> LICENSE.md


><p>MOSFFECS is a HTML-Javascript application that provides an editor for molecular structural formulae in a window. It is typically installed inside a <a href="https://moodle.org/">Moodle course</a> but can also be called by a browser from a local installation on a desktop/laptop.</p>
  <p>With MOSFECCS, users can draw one or several formulae interactively with the mouse or with a stylus (on touch devices). On demand, the program converts the molecular structure into an alphanumeric code (mosfeccs-SMILES) that is bi-unique for the structure and allows to enter the structure(s) into the answer fields of on-line quizzes in on-line learning environments like Moodle.</p>
  <p>MOSFECCS also contains a parser that converts SMILES codes into structural formulae ("put SMILES" button). </p>
  <p>mosfeccs-SMILES are canonical (bi-unique) and mostly, but not always identical with Daylight-SMILES&trade;. For details <em>see</em> MOSFECCS-SMILES technical manual.<br /> SMILES-extensions to specify lone-pairs, curved arrows, and reaction arrows are specific for MOSFECCS.</p> 
  <p><em>MOSFECCS was developed with the didactics of basic organic chemistry in mind</em>. In contrast to most molecular editors that were developed as tools to enter chemical structures for database searches, MOSFECCS does not correct user errors (violations of the laws and conventions of structural theory) and allows to draw "wrong" structures.</p>
  <p>MOSFECCS was coded by Bernhard Jaun, Prof. (emeritus since 2013) at the Laboratory of Organic Chemistry ETH-Zurich. So far (2015-2021), it has been used in the context of the courses Organic Chemistry I&amp;II for students of biology, pharmaceutical sciences, health sciences&amp;technology (Prof. Carlo Thilgen) at ETHZ. This course offers the students a comprehensive set of on-line trainings (quizzes, total of ca. 1000 questions) in the e-learning environment Moodle. About half of the questions require the students to draw molecular structures in an editor, convert the structure into alphanumeric code (mosfeccs-SMILES) and enter the result as answer into the quiz. The correctness of the answer is then checked on the server-side of Moodle in the same way as text or numeric answers.</p>
  <p>Since 2018, the first-year examinations in Organic Chemistry I&amp;II for BIOL./PHARM./HEST (Prof. Thilgen) at ETH are carried out on-line via the Safe Exam Browser (SEB), the Moodle-exam server of ETH, and MOSFECCS as the molecular editor.</p>
  <p>As of today, a total of ca. 1500 students in 6 first-year examinations have already used MOSFECCS in the exam.</p>

><p><strong>MOSFECCS has been shown to work with the following operation systems and browsers:</strong></p>
  <p><em>Mac OS 10.15.7:</em> Firefox 87, Chrome 90.0, Safari 14.0.3, SEB 2.3.2</p>
  <p><em>Windows 10:</em> Firefox 88.0, Chrome 90.0, Edge 90.0.818, SEB 2.3.2</p>
  <p><em>iOS 14.4.2:</em> Firefox, Chrome, Safari, ETH-Moodle.app</p>
  <p><em>Android:</em> Firefox, Chrome, Samsung Internet, ETH-Moodle.app</p>

###Content of the Repository and Installation

####For people who want to install and use MOSFECCS
>Files for installation of MOSFECCS in a Moodle course (main script compiled by Google closure compiler) MOSFECCS\_v6\_install\_in\_Moodle.zip.<br />Consult the file "Installing MOSFECCS in Moodle.pdf" for detailed instructions.

>The file "Example\_Moodle\_Quizz\_with\_MOSFECCS.xml" can be imported into a Moodle course and contains one quiz with 10 questions that illustrate the use of MOSFECCS and MOSFECCS-SMILES in different Moodle question types.

>MOSFECCS can also be installed locally on a computer: download "MOSFECCS\_v6\_local\_install\_on computer.zip" to your computer, unzip and open the file MOSFECCS\_v6\_210506cc.html with your browser.

####Documentation

>MOSFECCS\_MANUAL.pdf (alternatively, use the HELP button in MOSFECCS)

>MOSFECCS-SMILES\_technical\_Manual: describes the conventions and procedures used by MOSFECCS for calculating canonical SMILES. 
 
####For contributors and developers
>This section contains the source code of MOSFECCS and additional tools for development
 and testing.
 
>MAKEVERSION: the perl script makeversion.pl takes the development version of MOSFECCS MOSFECCS\_v6\_SVG\_DEV_210424-1.html(source) and generates the production versions (compiled and uncompiled) as well as the testing application mostest.js (running under nodeJS).

>MOSETEST: mostest.js runs under nodeJS and accepts a file with SMILES-codes (one per line) as input. The SMILES-generator and SMILES-parser of mostest.js are identical to those of MOSFECSS since mostest.js is made by makeversion.pl from MOSFECCS. Each SMILES in the input file is converted into a structure (svg-graphic) by the parser and then the SMILES-code is calculated for the structure. mostest.js compares the input and output SMILES-codes and reports if they are not identical or if an error occurs. <br />
>AllTestMols.txt is a testfile with ca 1300 molecules (SMILES-codes) that can be used as input for mostest.js

###Contacts:
>For BUG reports, suggestions for improvements and other questions related to coding: <strong>jaun@ethz.ch</strong> 

>Questions related to the use of MOSFECCS within Moodle quizzes: <strong>          thilgen@org.chem.ethz.ch</strong>
