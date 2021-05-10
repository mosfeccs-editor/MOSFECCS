//START CODE TO COMPILE

// MOSFECCS_v5_SVG_200309(build200309.js based on version 200210 (ES5) passed through ESlint 200210-1415
// transformed with lebab let, arrow, arrow-return 200225-1500
// test-compiled with ADVANCED without errors 200225-1530
// mod:200227-2140
// mod:200229-1745 changes in formatting of for loops, lebab includes, ixina and isina replaced by indexOf and includes
//                 test-compiled with ADVANCED without errors 200229-1745
//                 all for loops remain ES5 (no automatic for-of)
// mod:200229-1900 changed rcstr = [] into rcstr = {} in clearMol(). Changed all comments about pseudohash(es) and hashes to dict
//                 test-compiled with ADVANCED, the compiled with SIMPLE to nv5_200229cc.js
// mod: 200301-1645 order of functions changed such that all functions needed for mostest are contiguous
//                  before getsmiles.
// mod: 200822-0840 changed atomSmiles() to give square brackets whenever the valency is not normal
//                  Changed parseSMILES() check for radical section to exclude radicals from eD < 1
//                  Changed ringCoord() chend section to give better drawing when angular center has hypervalency      
// mod: 201203-0800 New design with lewis and rxn tool in one horizontal toolbar, adaption for phones and the MoodleMobileApp      
// mod: 201212-1600 async/promise loading of icon bars in drawCanvas() main and new loadEditor()

      "use strict";
                  
  // MAIN CANVAS FUNCTION (IIFE)
    
      function drawCanvas(pad,phone,app,arrico,helpWindow,svgWindow) {
    

  // pseudoconstants
        const version = "v6_210506"
        const build = "210506.1"
        const lewis_rxnarw_yn = (arrico==='yes')? true : false;
        const emfuSmiles = true;  // use small letters for atoms in mancude rings for SMILES.
  //      var pad = (screen.width > 1390)? false:true; // for automatic tablet recognition
  //      var pad = false;  // absolute, for beamer/desktop, no tablet, only standard layout
  //      var pad = true; // absolute for HR-tablets, always tablet layout
//         const phone = (screen.width < 760)? true:false;
        //graphics constants      
        // not dependent on bondlength
        const pdx=10; // padding between canvas and mrect
        const titH=36; // height of title region
        const toolbarW=34; // width  of toolbar image 
        const toolbarH=503; //height of toolbar image
        const iconH=36; // width and height of one element icon.
        const drwsnap = 15;  // 15° angle snap when drawing
        const chainsnap = 15; // drawing of chain with chain tool uses 15° snap for main chain direction
        const dbratio = 24; // distance between lines of double bond expressed as ratio bondlength/distance

        let bondlength = (pad)? 45:30;  // initial length of a bond in px. Can be varied in steps of 5 between 20 and 50
      
        // dependent on bondlength
        let charH = Math.floor(6+(bondlength-15)*(8/30)); //integer for font pt statements
        let charW = 5+(bondlength-15)/5; //can be real number, used to calculate length of text 
        let charHs = Math.floor(8+(bondlength-15)*(8/30)); //integer for font pt statements
        let charWs = 6.5+(bondlength-15)/5; //can be real number, used to calculate length of text 
        let crit = bondlength/5;  // critical distance for mouse from atoms
        let hlAtRad = (pad)? ((phone)? bondlength/2 : 2*crit) : crit+4; // radius of highlighted circle on atoms
        let rhR = (pad)? 2*crit : crit+4; // radius of rotation handle
        let clickCrit = bondlength/10; //mouse down and up within clickCrit: considered as click
        let mmcrit = bondlength/10; // criterion for mousemove: moved by mmcrit -> mmove is true
        let bcrit = bondlength/5;  // critical distance for mouse from bond centers
        let hlBoRad = (pad)? ((phone)? bondlength/3 : 2*bcrit) : bcrit+2; // radius of highlighted circle on atoms
        let chainincr = 0.86603*bondlength; // incremental horizontal component of 120° horizontal zig-zag chain
        let ofs = Math.round(150*bondlength/dbratio)/100;  // distance between lines of double bond in px
        let downlw = 6*ofs;  // linewidth for dashed wedges
        let stdlw = (bondlength > 30)? 2:1.5;  // linewidth of a single bond in px
        // keybord shortcuts
        const ESkbds = [" c","h","o","n","s","p","f","C","b","i","x",".","+","-"]; // keyboard shortcuts elements 1st row
        const ESkbds2 = [" ","","e","r"," "," "," ","v"," "," "," "," ","Y","y"];  // keyboard shortcuts elements 2nd. row
        const TSkbds = ["1","2","t","u or <","d or >","3","4","5","6","a","7-9","w","m","l"]; //keybooard shortcuts tools
        // chemical constants
        const atsym = ["C", "H", "O", "N", "S", "P", "F", "Cl", "Br", "I", "X", "•", "+", "–"]; // the symbols in the element icons
        //  regexp for matching valid element symbols
        const chemsymregexp = /^Ac|Ag|Al|Am|Ar|As|At|Au|Ba|Be|Bh|Bi|Bk|Br|Ca|Cd|Ce|Cf|Cl|Cm|Co|Cr|Cs|Cu|Db|Ds|Dy|Er|Es|Eu|Fe|Fm|Fr|Ga|Gd|Ge|He|Hf|Hg|Ho|Hs|In|Ir|K|Kr|La|Li|Lr|Lu|Md|Mg|Mn|Mo|Mt|Na|Nb|Nd|Ne|Ni|No|Np|Os|Pa|Pb|Pd|Pm|Po|Pr|Pt|Pu|Ra|Rb|Re|Rf|Rg|Rh|Rn|Ru|Sb|Sc|Se|Sg|Si|Sm|Sn|Sr|Ta|Tb|Tc|Te|Th|Ti|Tl|Tm|Xe|Yb|Zn|Zr|B|C|F|H|I|N|O|P|S|U|V|W|Y$/g;
        const resreg = /^R[1234]?$/g; // pattern characterizing allowed residue symbols R,R1,R2,R3,R4
        const residues = ["R","R1","R2","R3","R4"]; //allowed residue symbols R,R1,R2,R3,R4
        const sextets = ["C:","N:"]; // carbenes and nitrenes
        //  array of all element symbols as strings
        const elesym = ["H","He","Li","Be","B","C","N","O","F","Ne","Na","Mg","Al","Si","P","S","Cl","Ar","K","Ca","Sc","Ti","V","Cr","Mn","Fe","Co","Ni","Cu","Zn","Ga","Ge","As","Se","Br","Kr","Rb","Sr","Y","Zr","Nb","Mo","Tc","Ru","Rh","Pd","Ag","Cd","In","Sn","Sb","Te","I","Xe","Cs","Ba","La","Ce","Pr","Nd","Pm","Sm","Eu","Gd","Tb","Dy","Ho","Er","Tm","Yb","Lu","Hf","Ta","W","Re","Os","Ir","Pt","Au","Hg","Tl","Pb","Bi","Po","At","Rn","Fr","Ra","Ac","Th","Pa","U","Np","Pu"];
        //  normal valency of all elements in elesym[]. 0 stands for no normal valency defined
        const val = [0,1,0,0,0,3,4,3,2,1,0,0,0,3,4,3,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,3,2,1,0,1,2,0,0,0,0,0,0,0,0,1,2,3,4,3,2,1,0,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        const elpos = ["B","Al"]; // electropositive elements with hydride ligands
        const prim = [1, 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97,
              101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,
              233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,
              383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,
              547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,
              701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,
              877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997,1009,1013 ,1019,1021,1031,
              1033,1039,1049,1051,1061,1063,1069,1087,1091,1093,1097,1103,1109,1117,1123,1129,1151,1153,1163,1171,
              1181,1187,1193,1201,1213,1217]; // primes from 1->2 to 200->1217
        const organic = ["B", "C", "N", "O", "P", "S", "F", "Cl", "Br", "I","Si"]; // the elements considered to be "organic"
        const emfuAtoms = ["B","C", "N", "O", "P", "S", "As", "Se"]; // elements that can be part of an EMFU-ring
        const emfuElesym = ["b","c", "n", "o", "p", "s", "as", "se"]; // symbol of emfu-Element in SMILES
        // strings characterizing the bonding situations for each element that is considered as possible stereogenic center. format: "ElementSymbol:number of ligands:number of implicit hydrogens:charge"
        const pSC = ["C:4:0:0","C:3:1:0","Si:4:0:0","Si:3:1:0","Ge:4:0:0","Ge:3:1:0","Sn:4:0:0","Sn:3:1:0","N:4:0:1","P:4:0:1","B:4:0:-1","B:3:1:-1","P:4:0:0","As:4:0:1","N:3:0:az","P:3:0:0","As:3:0:0","P:2:1:0","As:2:1:0","S:4:0:0","S:4:0:1","S:3:0:0","S:3:0:1","Se:4:0:0","Se:4:0:1","Se:3:0:0","Se:3:0:1"];
        // strings characterizing the bonding situation of potentially stereogenic (trigonal pyramidal) three-valent centers
        const pyrSC = ["N:3:0:az","P:3:0:0","P:2:1:0","As:3:0:0","As:2:1:0","S:3:0:0","S:3:0:1","Se:3:0:0","Se:3:0:1"]; // no implicit H at pyramidal stereocenters allowed

  // variables with "global" scope inside drawCanvas()
        // canvases and their context and other DOM elements
        let i=0;
        let osc = 1;  //overall scale
        let iconscale = 1.0;
        let cont; // container
        let bgc; // background canvas object (white background)
        let bgctx; // background canvas context
        let igc; // foreground canvas object (transparent)
        let igctx; // foreground canvas context
        let pdc;  // provisional drawing canvas (/)transparent)
        let pdctx;  // provisional drawing canvas context
        let can; // main canvas object 
        let ctx; // main canvas context
        let sho; // shortcut display canvas (transparent)
        let shoctx; // shortcut display canvas context
        // other DOM elements (text in/output, palm reject for tablets)
        let sbox; // the smiles display 
        let sboxOK; // the OK button in smilesbox
        let sboxTxt; // the textarea of the smilesbox (text is not editable)
        let xbox; // the xelement ot ring-size text input box
        let xboxOK; // the OK button in xbox
        let xboxTxt; // the text input in xbox
        let abox; // the annotation text input box
        let aboxAtxt; // text input above arrow
        let aboxBtxt; // text input below arrow
        let aboxOK; // OK button of annotation text input box
        let smixbox; // the Smiles input box
        let smixboxTxt; // the text input area in smixbox (editable)
        let smixboxCan; // the Cancel button in the smixbox
        let smixboxAdd; // the ADD button in smixbox
        let smixboxRpl; // the REPLACE button in smixbox
        let butreg;
        let shift;
        let alt;
        let vps = 1.0;
        let eImg = new Image();
        let tImg = new Image();
        let lImg = new Image();
        const iconsImgUrlAr = ['elebar.svg','toolbar.svg','lewis_rxnarrows.svg'];

        // rectangles defining areas on canvas
        const trect = new Rect(pdx,titH+6,toolbarW,toolbarH); // rectangle enclosing the toolbar (vertical)
        const erect = new Rect(iconH+2,titH+2,14*(iconH+2),iconH); //rectangle enclosing the elements bar (horizontal)
        const lrect = new Rect(pdx,titH+toolbarH+10,(iconH-2)*4,iconH); // rectangle enclosing lewis and rxn tool icons 
        const mrect = new Rect(pdx,0,10,10); // the area reacting to mouse, actual size set in setrects()
        const drect = new Rect(toolbarW+pdx+4,0,10,10); // the drawing area as a rect, actual size set in setrects()
        const arect = new Rect(0,0,10,10); // the active drawing area (drect without the security margin), actual size set in setrects()
        const rrect = new Rect(0,0,0,0);
        let gb = new Rect(0,0,0,0);  // rect to contain the bounding rectangle of a drawn object (structure or tree)
        let gbs = new Rect(0,0,0,0);
        let rbr = new Rect(0,0,0,0);
        let pbr = new Rect(0,0,0,0);
        // zoom icons
        let zi = {x: 0, y: 0, r: 12};
        let zo = {x: 0, y: 0, r: 12}; 
                

        // MAIN DATA STRUCTURES
        const da = new Atom(0, "", 0, 0, 0, 0, 0); // dummy atom
        // arrays of Atom objects
        const m = [new Atom(0, "", 0, 0, 0, 0, 0)]; // index 0 contains a dummy atom, the real atoms start with m[1]
        const m_s = [new Atom(0, "", 0, 0, 0, 0, 0)]; // shadow copy of m for smiles calculation (without explicit H), filled by genshadow()
        const m_s0 = [new Atom(0, "", 0, 0, 0, 0, 0)]; // temporary copy of m_s for ring detection via hidebond(), filled by genshadow()
        const m_st = [new Atom(0, "", 0, 0, 0, 0, 0)];  // temporary copy of m_s for substructure (tree) determination,filled by genshadow()
        let m4cc = [new Atom(0, "", 0, 0, 0, 0, 0)];  // used for storing cumulenes in get_ccSense_one(), reset in clearMol(), filled by genshadow()
      
        const dbo = new Bond(0,0,0); // dummy bond
        // arrays of Bond objects
        const b = [new Bond(0,0,0)]; // index 0 contains a dummy bond, the real bonds start with b[1]
        const b_s = [new Bond(0,0,0)]; // shadow copy of m for smiles calculation (without explicit H) filled by genshadow()
        const b_s0 = [new Bond(0,0,0)]; // temporary copy of b_s for ring detection via hidebond() filled by genshadow()
        const b_st = [new Bond(0,0,0)]; // temporary copy of b_s for substructure (tree) determination filled by genshadow()
      
        // other arrays of data objects
        let savedStates = []; // array of State objects for undo()
        let meshAt = []; // array of atom indices; filled in mousemove, used in mouseup
        let lig = [new Branch(0,0)];
        let arro = []; //array storing the Arrow{} objects
        let arro_s = []; //shadow array of arrows for SMILES
        let rxnarro = []; // array storing Rxnarw{} objects
        let rxn_s = []; // shadow array of rxn arrows for SMILES
      
        // primitive variables used in SMILES Input und conversion
        let inSmiles = ''; //the SMILES string entered
      
        //arrays used by functions in several sections: have to be in the drawCanvas scope
        let bisectors = []; // array containing the directions in ° of the bisectors between all bonds at an atom
        let bridgeheads = []; // array with atom indices of bridgeheads. Filled by findBridgeheads() !!used also by stereobonds()
        let ccSense = {}; // dict: key is string with atom index of central atom, value is @ or @@
        let cumulat = []; // array with the atom indices of all cumulene atoms  !! used in getsmiles() and parseSMILES()
        let ezCC = []; // array of cumulene objects containing even cumulenes !!used also by parseSMILES()
        let incoming = []; // array specifiying for each atom the "incoming" atom. index is parallel to m[]. Filled by dfsRC !!used also by flipBranch()
        let mol_brects = []; // the bounding rects of all molecules
        let molgrp_brects = []; // the bounding rects of molgrps
        let productTrees = []; // the tree numbers of product Trees
        let pscCC = []; // array of potentially stereogenic cumulenes !!used also in smiles parsing
        let rcstr = {}; // dict with the atom index as key and the ring closures string as value. Filled by dfsRC() !! used also by smiles parsing
        let reactantTrees = []; // the tree numbers of reactant Trees
        let ringatoms = []; // array containing atom indices off all atoms in rings. Filled by findRingBonds() !!used also in smiles parsing
        let ringbonds = []; // array of indices in b-type arrays. Filled in findRingBonds(), required by isSCcandidate,!! used by several sections
        let ringclosures = []; // array of strings xx:yy with xx and yy being atom indices of atoms in ring closure !!used by several sections
        let rings = [];  // 2D array. rings[ringnumber][index in ring]. Values are the atom indices !!used by several sections
        let sectors = []; // array of Sector{} objects containing the sectors between bonds around an atom !! used in several sections
        let selAt = []; // the atoms inside the selection span rectangle
        let selTrees = []; // the tree numbers of selected Trees
        let smilesarray = []; // array of atom indices in the order from dfsSmiles !! used in several sections
        let visnodesDFS = []; // array of the nodes visited by dfs(). Values are atom indices !!used by several sections
        let warnAtoms = []; //!!used in getsmiles and parseSMILES: the atoms that will be shown with a red square
      
        // primitive variables
        let ae = 0;  // index of the active element/radical/charge tool
        let at = 0; // index of the active bond/ring/chain/erase tool
        let getTxtcaller=""; // remembers the caller function of getText()
        let gtxt = '';
        let kc=0; // alt and shift key state 0=none, 10=shift, 1=alt 11=alt and shift
        let nmol = 0; // number of molecules (trees)
        let nRings = 0; // the number of rings. Calculated from the number of bonding partners of each atom by numRings()
        let nTSring=0; //current ring-size for n-ring tool
        let svg = '';

      
        // variables required to remember things from one mouse event to the next one
        let atToConnect=0; // transfer from mousemove to addMesh 
        let cex = 0;
        let cey = 0;
        let chainstx = 0; 
        let chainsty = 0;
        let curv = 0;
        let hlArw = -1; // the index of the highlighted arrow (-1 if none) in arro[]
        let hlAt = 0; // the index of the highlighted atom (0 if none) in m[]
        let hlBo = 0; // the index of the highlighted bond (0 if none) in b[]
        let hlRxa = -1; // the index of the highlighted rxn arrow (-1 if none) in rxnarro[]
        let imgx=0;
        let imgy=0;
        let lastcurv = 0;
        let lastmdir = -1;
        let lastsx = 0;
        let lastsy = 0;
        let lastx1 = 0; // last mouse coordinates. Transfer from mousemove to mouseup
        let lastx2 = 0;
        let lasty1 = 0;
        let lasty2 = 0;
        let lmdisn = 0; // last mouse down near atom
        let lmdisnb = 0; // last mouse down near bond
        let lmdx=0, lmdy=0; // lmdx, lmdy contain the last mouse down position
        let lmmisn = 0; // last mouse move near atom
        let lmmisna = -1; // last mouse move near arrow
        let lmmisnrxa = -1; // // last mouse move near rxn arrow
        let lmmisnb = 0; // last mouse move near bond
        let lmmx=0, lmmy=0; // lmmx, lmmy contain the last mouse move position
        let lmuisn = 0;  // last mouse up near atom
        let lmuisna = -1; // last mouse up near arrow
        let lmuisnrxa = -1; // last mouse up near rxn arrow
        let lmuisnb = 0; // last mouse up near bond
        let lmux=0, lmuy=0;  // lmux, lmuy contain the last mouse up position
        let meshToConnect=-1; // transfer from mousemove to addMesh
        let newx=0;
        let newy=0;
        let oldchdir = ""; // chain direction, transfer from mousemove to mouseup
        let olddev = 1; // chain deviation, transfer from mousemove to mouseup
        let oldlmmx = 0;
        let oldlmmy = 0;      
        let oldmeshdir = 0;
        let oldnc = 0; // number of chain members, transfer from mousemove to mouseup 
        let oldnewx = 0;
        let oldnewy = 0;
        let oldx=0;
        let oldy=0;
        let oox=0;
        let ooy=0;
        let pDM =""; // the provisional drawing mode
        let permstodo = 1; // counter for permutations remaining to be done
        let permu = 1; // total permutations due to ties
        let pinch = false;
        let pinch_cur_dist = 0;
        let pinch_start_dist = 0;
        let rxnco = [];
        let selectWhat = 'reactant';
        let smiles = "";  // the SMILES string
        let vpg = 1; // direction of ring draw relative to bond. Transfer from mousemove to mouseup
        let x;  // x,y contain the current mouse positon as set by the mouse and touch events
        let y;  

        // boolean variables and flags
        // alternators for provisional drawing      
        let bondOnAtom = false; // drawing starts at atom
        let chainDrawn = false;
        let chainOnAtom = false;
        let click = false;  // true if mouse down and mouse up occur inside 2 px in x and/or y    
        let clickOnAtom = false; // true after click on atom
        let clickOnBond = false; // true after click on bond
        let clickOnArrow = false; // true after click on arrow
        let clickOnRxnArrow = false; // true after click on rxn arrow
        let dummy = true;
        let hasStereo = false;
        let mdraw = false;  // true when mouse is drawing (left button pressed while moving)
        let meshDrawn = false;
        let meshOnAtom = false;
        let mmoved = false; // true when left button pressed and mouse moved by ≥ mmcrit px
        let mouseisdown = false; // true when left mouse button is pressed
        let nolinedash = false;  // indicator for browsers that do not support linedash
        let provArrow = false; 
        let provBond = false;
        let provBondsToPartners = false;
        let provBondWithPartners = false;
        let provRing = false;
        let righthanded = true;  // for tablet indictes the state of the right/left-handed toggle
        let sboxVis = false; // visbility of SMILES output box (for result of getsmiles)
        let selected = false; // true if something is selected
        let shortcuts = false;
        let showatnum = false; // flag used in diagnostic
        let showsymnum = false; // flag used in diagnostic
      
        // types (groups) of tools and elements
        let benzene = false; // true if benzene tool is selected
        let EScharge = false; // true if one of the •|+|- symbols is selected
        let ESelem = false; // true if element is selected
        let ESxelem = false; // true if X-element is selected
        let TSbond = true; // true if single-,double-,triple bond or wedge up, wedge down selected
        let TSchain = false; // true id chain tool selected
        let TSerase = false; // true if erase tool selected
        let TSlewis = false; // true if one of the Lewis tools is selected
        let TSmesh = false; // true if mesh tool selected
        let TSring = false; // true if one of the ring tools is selected
        let TSrxn = false; // true if one of the rxn tools is selected

  // END of variable declarations
  
//DRAW CANVAS MAIN

    
  // canvases          
    // get the 5 overlayed canvases and their contexts      
      cont = document.getElementById("container"); 
      bgc = document.getElementById("bgc");  //background canvas
      igc = document.getElementById("igc");  //intermediate graphics canvas (selection rectangles etc.)
      pdc = document.getElementById("pdc");  //provisional drawing canvas
      can = document.getElementById("can");  //the main drawing canvas
      sho = document.getElementById("sho");  //the shortcut labels canvas

  // diagnostic borders
//       bgc.style.border = "solid 2px red";
//       igc.style.border = "solid 2px blue";
//       pdc.style.border = "solid 2px blue";
//       can.style.border = "solid 2px green";
//       sho.style.border = "solid 2px blue";

  // canvas 2d-contexts    
      bgctx = bgc.getContext("2d");
      igctx = igc.getContext("2d");
      pdctx = pdc.getContext("2d");
      ctx = can.getContext("2d");
      shoctx = sho.getContext("2d");
      

      // workaround for browsers that do not support canvas.context.line-dash               
      if (!ctx.setLineDash) {
        nolinedash = true;
      }

      bgctx.save();
      igctx.save();
      pdctx.save();
      ctx.save();
      shoctx.save();
      
      // button region
      butreg = document.getElementById("buttonregion");
      butreg.style.position = "absolute";
//       butreg.style.border = "solid 2px green";
      
      shift = document.getElementById("shift");
      alt = document.getElementById("alt");
      
                
      let imgData = ctx.getImageData(0,0,1,1);
          
    
  //Text input/output boxes
      //X-element and ring size
      xbox = document.getElementById("xbox");
      xboxOK = document.getElementById("xok");
      xboxTxt = document.getElementById("xtxa");
      // Annotation text input
      abox = document.getElementById("abox");
      aboxAtxt = document.getElementById("atxa");
      aboxBtxt = document.getElementById("btxa");
      aboxOK = document.getElementById("aok");
      //SMILES output
      sbox = document.getElementById("smilesbox");
      sboxOK = document.getElementById("smilesok");
      sboxTxt = document.getElementById("smitxa");
      sboxVis = false;
      //SMILES input
      smixbox = document.getElementById("smixbox");
      smixboxTxt = document.getElementById("smixtxa");
      smixboxCan = document.getElementById("smixcancel");
      smixboxAdd = document.getElementById("smixadd");    
      smixboxRpl = document.getElementById("smixok");
          
  //draw the keyboardshortcuts on hidden canvas
      drawshortcuts();

  // do initial save_for undo
      pushStateToStack();
    
  // switch on the EventListeners
      addListeners();

  // on tablets: react to orientation changes    
      if (pad) {      
      // Detect whether device supports orientationchange event, otherwise fall back to resize event.
        const supportsOrientationChange = "onorientationchange" in window,
            orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";

        window.addEventListener(orientationEvent, function() {
          setTimeout(resizeCanvas, 500);
          setTimeout(resizeCanvas, 100);
          setTimeout(function () { window.scrollTo(0,0); },500);
         }, false);
      }

      loadEditor();

      if ((app) && (!phone)) {
        setTimeout(resizeCanvas, 500);
      }
      
      //diagnostic: border of rects
//       drawrects();     
          
    
  //END of drawCanvas() MAIN CODE  

    
    
  // FUNCTIONS INSIDE drawCanvas
  //===================================================================================  

  // async function to load images and wait for loading to be complete
      async function loadEditor() {
          const promiseArray = []; // create an array for promises
          const tstart = performance.now();
          
          promiseArray.push(new Promise(resolve => {
              eImg.onload = function() {
                 resolve();
              };
              eImg.src = 'elebar.svg';
          }));
          promiseArray.push(new Promise(resolve => {
              tImg.onload = function() {
                 resolve();
              };
              tImg.src = 'toolbar.svg';
          }));
          if (lewis_rxnarw_yn) {
            promiseArray.push(new Promise(resolve => {
                lImg.onload = function() {
                   resolve();
                };
                lImg.src = 'lewis_rxnarrows.svg';
            }));
          }

          await Promise.all(promiseArray); // wait for all the images to be loaded
          
          resizeCanvas();
          
          bgc.style.visibility = 'visible';
          igc.style.visibility = 'visible';
          pdc.style.visibility = 'visible';
          can.style.visibility = 'visible';
          sho.style.visibility = 'hidden';
          if (pad) {
            shift.style.visibility = 'visible';
            alt.style.visibility = 'visible';
          }
          var hiddenbuts = document.getElementsByClassName("but");
          sleep(100).then(() => { 
            for (i = 0; i < hiddenbuts.length; i++) 
            {
              hiddenbuts[i].style.visibility = 'visible';
            } 
          });

      }
  
  
  // functions to add and remove listeners

      function addListeners() {
        can.addEventListener("mousedown", mouseDown, false);
        can.addEventListener("mousemove", mouseMove, false);
        can.addEventListener("touchstart", touchDown, false);
        can.addEventListener("touchmove", touchMove, true);
        can.addEventListener("touchend", touchUp, false);

        document.body.addEventListener("mouseup", mouseUp, false);
        document.body.addEventListener("touchcancel", touchCancel, false);

        document.body.addEventListener("keydown", keyisdown, false);
        document.body.addEventListener("keypress", keyispressed, false);
        document.body.addEventListener("keyup", keyisup, false);
        if (!pad) {
          window.addEventListener("resize", debounce( resizeCanvas, 100 ), false);
        }
      }    

      function removeListeners() {
        can.removeEventListener("mousedown", mouseDown, false);
        can.removeEventListener("mousemove", mouseMove, false);
        can.removeEventListener("touchstart", touchDown, false);
        can.removeEventListener("touchmove", touchMove, true);
        can.removeEventListener("touchend", touchUp, false);

        document.body.removeEventListener("mouseup", mouseUp, false);
        document.body.removeEventListener("touchcancel", touchCancel, false);

        document.body.removeEventListener("keydown", keyisdown, false);
        document.body.removeEventListener("keypress", keyispressed, false);
        document.body.removeEventListener("keyup", keyisup, false);

      }  
      
      function debounce(func, time){
        time = time || 100; // 100 by default if no param
        let timer;
        return event => {
          if(timer) {
            clearTimeout(timer);
          }
          timer = setTimeout(func, time, event);
        };
      }

      function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }


  //EVENT HANDLERS
      
      function resizeCanvas() {
        let tgb = new Rect(0,0,0,0);
        let sw = screen.width;
        let sh = screen.height;
        let screenWidth=screen.width;
        let screenHeight=screen.height;
        let tmp;
        
        if (Math.abs(window.orientation)===90) { //landscape
          if (screen.width < screen.height) { //iOS)
            screenWidth = screen.height;
            screenHeight = screen.width;
          } else {
            screenWidth = screen.width;
            screenHeight = screen.height;
          }
        } else { // android etc.
          screenWidth = screen.width;
        }
        
        vps = screenWidth/window.innerWidth;

        if(m.length>1) {
          clearSelection();
          tgb = getboundrect(m,0,'s');
        }
        
        if (phone) {
          if (Math.abs(window.orientation) === 90) { 
            if (!app) {        
              iconscale = 0.71;
            } else {
              iconscale = 0.6;
            }
          } else {
            iconscale = 1.0;
          }
        } else if (pad) {
          if (screenWidth/window.innerWidth < 0.9) {
            iconscale = window.innerWidth/screenWidth;
          } else {
            iconscale = 1.0;
          }
        } else {
          iconscale = 1.0;
        }
                

        // all
        if (!pad) { // desk-/laptop with resizable windows
          bgc.width = Math.max(window.innerWidth-pdx,Math.max(tgb.l+tgb.w+2*pdx,590));
          can.width = bgc.width;
          igc.width = bgc.width;
          pdc.width = bgc.width;
          sho.width = bgc.width;
          bgc.height = Math.max(window.innerHeight-pdx,Math.max(tgb.t+tgb.h+2*pdx,674));
          can.height = Math.max(window.innerHeight-94-pdx,Math.max(tgb.t+tgb.h+2*pdx,596));
          igc.height = can.height;
          pdc.height = can.height;
          sho.height = bgc.height;
        } else if (phone) { //phone new for v6_201130
          if (Math.abs(window.orientation) === 90) { //landscape
            bgc.width = 1.4*screenWidth;
            if (!app) {
              bgc.height = Math.min(1.4*screenHeight,window.innerHeight);
            } else {
              bgc.height = 1.18*screenHeight;
            } 
            can.width = bgc.width;
            can.height = bgc.height - butreg.clientHeight-10;
            igc.width = bgc.width;
            igc.height = can.height;
            pdc.width = bgc.width;
            pdc.height = can.height;
            sho.width = bgc.width;
            sho.height = bgc.height;
            butreg.style.marginTop = '5px';
          } else { // portrait
            bgc.width = 1.6*screenWidth;
            bgc.height = 1.2*screenHeight;
            can.width = bgc.width;
            can.height = bgc.height - butreg.clientHeight-10;
            igc.width = bgc.width;
            igc.height = can.height;
            pdc.width = bgc.width;
            pdc.height = can.height;
            sho.width = bgc.width;
            sho.height = bgc.height;            
            butreg.style.marginTop = '10px';
          }            
        } else { //tablet
          bgc.width = Math.max(window.innerWidth-pdx,Math.max(tgb.l+tgb.w+2*pdx,590));
          igc.width = bgc.width;
          pdc.width = bgc.width;
          can.width = bgc.width;
          sho.width = bgc.width;
          if (Math.abs(window.orientation) === 90) { 
            bgc.height = window.innerHeight;
            can.height = window.innerHeight-52;
            igc.height = can.height;
            pdc.height = can.height;
            sho.height = bgc.height;  
          } else {
            bgc.height = window.innerHeight-20;
            can.height = window.innerHeight-80;
            igc.height = can.height;
            pdc.height = can.height;
            sho.height = bgc.height;
          }
       }       
       setRects();
       drawshortcuts();
       butreg.style.top = String(can.height+4)+'px';
       if (pad)  { // TABLET OR PHONE
         if (Math.abs(window.orientation) === 90) { //landscape
           smixbox.style.top = '20px';
         }
         butreg.style.width = String(bgc.width-10)+'px';
         butreg.style.left = String(pdx)+'px';
       } else { // laptop/desktop with resizable windows
          if (document.getElementById("svg")) {
            butreg.style.width = '580px'; //use 580px for SVG version
          } else {
            butreg.style.width = '550px'; //use 550px for non-SVG version
          }
         butreg.style.height = '40px';
         butreg.style.marginLeft = String(lrect.l)+'px';
       }
       if (app && phone) {
         osc = 0.6;
         cont.style.transform = "scale("+String(osc)+","+String(osc)+")";
       }
       refresh();
     } //mod: 201120 for MoodleMobile app
     
  // Keys down, pressed or released
      
      function keyisdown(e){
        let i=0;
        let jj=0;
        let tselMols=[];
        
        if (e.shiftKey) { // do not react to shift of external keyboard on pad
          if (kc===0) { 
            kc = 10;
            document.getElementById('shift').className = "shift "+"selected";
          }
          else if (kc===1) {
            kc = 11;
            document.getElementById('shift').className = "shift "+"selected";
          }
        }
        if (e.altKey) { // do not react to alt of external keyboard on pad
          if (kc===0) { 
            kc = 1;
            document.getElementById('alt').className = "alt "+"selected";
          } else if (kc===10) {
            kc = 11;
            document.getElementById('alt').className = "alt "+"selected";
          }
        }         
        if (e.which) {
          if((e.which === 8) && (sboxVis === false)) {
            e.stopPropagation();
            e.preventDefault();
            if ((selected) || (selTrees.length > 0)) {
              tselMols = selTrees.slice(0);
              if ((rxnarro.length > 0) && (tselMols.length > 0)) { // BUGFIX 190420.1 check for rxn arrows involving selected tree(s)
                for (let i=0;i<tselMols.length;i++) { // BUGFIX 190420.1
                  for (let jj=0;jj<rxnarro.length;jj++) { // BUGFIX 190420.1
                    if ((rxnarro[jj].stn.includes(tselMols[i])) || (rxnarro[jj].etn.includes(tselMols[i]))) { // BUGFIX 190420.1
                      deleteRxnArrow(jj); // BUGFIX 190420.1
                      jj--; // BUGFIX 190420.1
                    } // BUGFIX 190420.1
                  } // BUGFIX 190420.1
                  tselMols.splice(i,1);
                  i--;
                } // BUGFIX 190420.1
              } // BUGFIX 190420.1
              for (i=1;i<m.length;i++) {
                m[i].s=0;
                if (selTrees.includes(m[i].t)) {
                  m[i].s=1;
                }
              }
              deleteTree(1);
              clearSelection();
            } else {              
              undo();
            }
          }
        }           
//         demo.innerHTML='kc='+String(kc);
      }
      
      function keyispressed(e) {  
      let cCode;
      let i=0;
    
      if (e.charCode) {
        cCode = e.charCode;
      } else {
        cCode = e.keyCode;
      }
      switch (cCode) {
        // element icons
        case 113: //q
          setES(0);
          setTool(0);
        break;
        case 99: //c
          setES(0);
          break;
        case 72: //H
          let mwx = window.screenX;
          helpWindow = window.open("help/MOSFECCS_Help.html","Structural Formula Editor Help","dependent=yes,scrollbars=yes,resizable=yes");
          helpWindow.resizeTo(900,900);
          helpWindow.moveTo(mwx-helpWindow.outerWidth-5,20);
          break;
        case 104: //h
          setES(1);
          break;
        case 79: //O
        case 111: //o
        case 101://e
          setES(2);
          break;
        case 78: //N
        case 110: //n
        case 114: // r
          setES(3);
          break;
        case 83: //S
        case 115: //s
          setES(4);
          break;
        case 80: //P
        case 112: //p
          setES(5);
          break;
        case 70:  //F
        case 102: //f
          setES(6);
          break;
        case 118: //v
          setES(7);
          break;
        case 98: //b
          setES(8);
          break;
        case 73: //I
        case 105: //i
          setES(9);
          break;
        case 88: //X
        case 120: //x
          setES(10);
          break;
        case 46: //.
          setES(11);
          break;
        case 43: //+
        case 89: //Y
          setES(12);
          break;
        case 45: //-
        case 121: //y
          setES(13);
        //tool icons
          break;
        case 49: //1
          setTool(0);
          break;
        case 50: //2
          setTool(1);
          break;
        case 116: //t
          setTool(2);
          break;
        case 117: //u
        case 60:  //<
          setTool(3);
          break;
        case 100: //d
        case 62: //>
          setTool(4);
          break;
        case 51: //3
          setTool(5);
          break;
        case 52: //4
          setTool(6);
          break;
        case 53: //5
          setTool(7);
          break;
        case 54: //6
          setTool(8);
          break;
        case 55: //7
          setNumRing("7");
          setTool(10);
          break;
        case 56: //8
          setNumRing("8");
          setTool(10);
          break;
        case 57: //9
          setNumRing("9");
          setTool(10);
          break;
        case 97: //a
          setTool(9);
          break;
        case 119: //w
          setTool(11);
          break;
        case 109: //m
          setTool(12);
          break;
        case 76: //L
        case 108: //l
          setTool(13);
          break;
        case 103: //g
          if (sbox.style.visibility  === 'visible') { return false; }
          clearSelection();
          e.preventDefault();
          smile();
          break;
        case 107: //k
          if (shortcuts) {
            displayshortcuts(0);
            shortcuts = false;
          } else {
            displayshortcuts(1);
            shortcuts = true;
          }
          break;
        // keys used for development
        case 69: //E
          ctx.clearRect(drect.l+1,drect.t+1,drect.w-2,drect.h-2);       
          clearSelection();
          clearMol();
          break;      
        case 74: //J
          showsymnum = (showsymnum)? false : true;
          if (showsymnum) {
            drawMol_s(ctx,0); //es
          } else {
            drawMol(ctx,0,true);
          }
          break;
        case 48: //0
          showatnum = (showatnum)? false : true;
          if (showatnum === true) { showsymnum = false; }
          drawMol(ctx,0,true);
          break;
        case 84: //T
          showatnum = (showatnum)? false : true;
          if (showatnum === true) { showsymnum = false; }
          if (showatnum) {
            drawMol_m_s_anbn(ctx,0,true);
          } else {
            drawMol(ctx,0,true);
          }
          break;
        case 63: // ?
          molgrp_brects = [];
          get_molgrp_brects();
          markMolgrps('red');
          mark_molgr_ellipses('red');
          nmol = getAll_s_Trees();
          for (i=1;i<=nmol;i++){
            markTree(i,String(i),'blue',true,'s');
          }
          clearSelection();
          break;
        case 33: // !
          refresh();
          break;
        case 35: // #
          for (i=1; i<=nmol;i++) {
            markTree(i,String(i),'green',true,'t');
          }
          break;
        case 77: //M
          break;
        default:
          break;
      } // end switch cCode
    }
      
    function keyisup(e) {  
      // shift and alt are both set to false if one is released
      // because, if both were pressed, it is uncertain which one triggers the final keyup event
      if ((e.which===16) || (e.which===18) || ((pad === true) && (kc > 0) && (e.which===0))) {
        kc = 0;
        document.getElementById('shift').className = "shift";
        document.getElementById('alt').className = "alt";
      }
              
    }

  // TOUCH HANDLERS-------------
  
    function touchDown(e) {
      let isn;
    
      if (!e) {
        e = window.event;
      }      
      console.log("touchstart with "+e.touches.length+" fingers");
      if (e.touches.length===2) {
        pinch = true;
        pinch_start_dist = Math.hypot(e.targetTouches[0].pageX - e.targetTouches[1].pageX,e.targetTouches[0].pageY - e.targetTouches[1].pageY);
        console.log("pinchStart: distance="+f1(pinch_start_dist));
        return;
      }
      
      e.preventDefault();
      e.stopPropagation();
      x = (e.targetTouches[0].pageX - can.offsetLeft)/osc;
      y = (e.targetTouches[0].pageY - can.offsetTop)/osc;
      if (inrect(arect,x,y)) {
  
        isn = 0;
        lmdisn = 0;
        lmdisnb = 0;


        // find out whether touchdown was near atom or bond
        isn = isnear(m,b,x,y);
        if (isn > 0) { 
          lmdisn = isn;
          lmdisnb = 0;
          drawAtomHighlighted(m[lmdisn].x,m[lmdisn].y);
          hlAt=lmdisn;
        } else if (isn < 0) {
          lmdisnb = (-1)*isn;
          lmdisn = 0;
          drawBondHighlighted(lmdisnb);
          hlBo=lmdisnb;
        } else {
          lmdisn = 0;
          lmdisnb = 0;
        }
      }    
    
      mouseDown();
    
    }

    function touchMove(e) {
      if (!e) {
        e = window.event;
      }
      if ((pinch===true) && (e.touches.length===2)) {
        pinch_cur_dist = Math.hypot(e.targetTouches[0].pageX - e.targetTouches[1].pageX,e.targetTouches[0].pageY - e.targetTouches[1].pageY);
        return;
      }
      e.preventDefault();
      x = (e.targetTouches[0].pageX - can.offsetLeft)/osc;
      y = (e.targetTouches[0].pageY - can.offsetTop)/osc;

    
      trackMouse();
    }
  
    function touchCancel(e) {
      x = (e.changedTouches[0].pageX - can.offsetLeft)/osc;
      y = (e.changedTouches[0].pageY - can.offsetTop)/osc;
      pinch = false;
      pinch_cur_dist=0;
      pinch_start_dist=0;
    }
  
    function touchUp(e) {
      if (!e) {
        e = window.event;
      }
      
      if ((e.touches.length === 0) && (pinch)) {
        console.log("pinch ended with pinch_cur_dist="+f1(pinch_cur_dist));
        if (pinch_cur_dist < pinch_start_dist) {
          console.log("pinch");
        } else if (pinch_cur_dist > pinch_start_dist) {
          console.log("zoom");
        }
        pinch = false;
        pinch_cur_dist=0;
        pinch_start_dist=0;
        return;
      }
    
      x = (e.changedTouches[0].pageX - can.offsetLeft)/osc;
      y = (e.changedTouches[0].pageY - can.offsetTop)/osc;
    
    
      mouseUp();
    }
    
  // END TOUCHHANDLERS---------------------------------------------

  // MOUSE EVENT HANDLERS-------------

  //MOUSEDOWN---------------------MOUSEDOWN---------------------MOUSEDOWN---------------------      
      function mouseDown () {
          let isn=0;
        
        

          mouseisdown = true;
          pDM = "";
        
          lmdx = x;
          lmdy = y;
          
          if (inrect(arect,lmdx, lmdy)) {
            lmmx = 0;
            lmmy = 0;
            oldlmmx = lmdx;
            oldlmmy = lmdy;

              isn = 0;
              lmdisn = 0;
              lmdisnb = 0;


              // find out whether mouse down was near atom or bond
              isn = isnear(m,b,lmdx,lmdy);
              if (isn > 0) { 
                lmdisn = isn;
                lmdisnb = 0;
              } else if (isn < 0) {
                lmdisnb = (-1)*isn;
                lmdisn = 0; 
              } else {
                lmdisn = 0;
                lmdisnb = 0;
              }
          }
          mmoved = false;          
        }  // end of mousedown

  //MOUSEMOVE----------------MOUSEMOVE----------------MOUSEMOVE----------------      
      function mouseMove(e) {
        if (!e) {
          e = window.event;
        }

          // register the current mouse position in global variable        
          x = (e.pageX-can.offsetLeft)/osc;
          y = (e.pageY-can.offsetTop)/osc;
//           kx.innerHTML=f1(x);
//           ky.innerHTML=f1(y);
          trackMouse();
        
        }

  //TRACKMOUSE----------------            
      function trackMouse() {
          let i=0;
          let cx, cy, dx=0, dy=0, dega, drwdist, rotby =0;
          let bx1, bx2, by1, by2, bx, by, mvx, mvy, bvx, bvy, vp=1;
          let chaindir, nc, chdir, dev, mdrawdist=0;
          let movex, movey;
          let meshstx=0, meshsty=0, tdir=0, mdir=0, testat=0, testmesh=-1, dirdiff=0, behindT=false;
          let isn = 0;
          let isna = -1;
          let isnrxa = -1;
          let anchor = 0;
          let resix=-1;
        

          lmmx = x;
          if (lmmx > (arect.l + arect.w)) { lmmx = arect.l + arect.w; } // restrict mouse move to arect
          if (lmmx < arect.l) { lmmx = arect.l; }
          lmmy = y;
          if (lmmy > (arect.t + arect.h)) { lmmy = arect.t + arect.h; }
          if (lmmy < arect.t) { lmmy = arect.t; }


        
          if (!(inrect(drect,x,y))) { 
            resetDV();
            return;
          }
        
        
  // check if mouse is near atom, bond, arrow or reaction arrow
          if (!((pDM === 'moveTree') || (pDM === 'copyTree') || (pDM === 'rotateTree'))) {              
            isn = isnear(m,b,x,y);
            isna = (arro.length > 0)? isneararrow(x,y): -1;
            isnrxa = (rxnarro.length > 0)?  isnearRxa(x,y) : -1;
          }
        
          if (isn > 0) {  // near an atom
            lmmisn = isn;
            lmmisnb = 0;
          } else if (isn < 0) { // near a bond
            lmmisnb = (-1)*isn;
            lmmisn = 0; 
          } else { // not near atom or bond
            lmmisn = 0;
            lmmisnb = 0;
          }
          
          // check if mouse is near arrow
          if (isna > -1) {
            lmmisna = isna;
          } else {
            lmmisna = -1;
          }
          // check if mouse is near rxn arrow          
          if (isnrxa > -1) {
            lmmisnrxa = isnrxa;
          } else {
            lmmisnrxa = -1;
          }

  // allow to control redraw in provisional drawing by requiring a minimal move of mmcrit 
        
          mmoved = (Math.sqrt((lmmx-oldlmmx)*(lmmx-oldlmmx) + (lmmy-oldlmmy)*(lmmy-oldlmmy)) > (mmcrit));

  // handle mouse moves coming near atom or bond or arrow
          if ((pDM !== "moveAllMol") && (pDM !== "moveTree") && (pDM !== 'copyTree') && (pDM !== 'rotateTree') && (!selected) && (mmoved)) {
            if (lmmisn > 0) { //mouse is near an Atom
              resix = residues.indexOf(m[lmmisn].el);
//               if ((hlAt === 0) && (resix < 0))  {  // no highlighting for residues //BF210505.2
              if ((hlAt === 0))  { 
                cx = m[lmmisn].x; cy = m[lmmisn].y;
                drawAtomHighlighted(m[lmmisn].x,m[lmmisn].y);
                hlAt = lmmisn;
              }
            } else if ((lmmisnb > 0) && (lmmisnb !== lmdisnb) && (pDM !== "provMeshDraw") && (pDM !== "provChainDraw") && (pDM !== "moveAtom")) { // mouse is near a bond
              if (hlBo === 0) { // the bond is not highlighted yet
                // find out the bonds center
                drawBondHighlighted(lmmisnb);
                hlBo=lmmisnb;
              }
            } else if (lmmisna > -1) {
              if (hlArw < 0) { // the arrow is not highlighted yet
                drawArrowHighlighted(lmmisna);
                hlArw = lmmisna;
              }
            } else if (lmmisnrxa > -1) {
              if (hlRxa < 0) { // the arrow is not highlighted yet
                drawRxaHighlighted(lmmisnrxa);
                hlRxa = lmmisnrxa;
              }
            } else { // mouse is not near an atom or bond
              if (hlAt > 0)  {  // if an atom was highlighted, erase highlight 
                hlAt = 0;
                clearIGC();
              }
              if (hlBo > 0)  {  // if a bond center was highlighted, erase highlight 
                hlBo = 0;
                clearIGC();
              }
              if (hlArw > -1)  {  // if a curved arrow was highlighted, erase highlight 
                hlArw = -1;
                clearIGC();
              }
              if (hlRxa > -1)  {  // if a reaction arrow was highlighted, erase highlight 
                hlRxa = -1;
                clearIGC();
              }
            }
          }

  // detect mouse drawing
          if (!mouseisdown) {  return; } // the rest of code is only relevant if mouse is down
        
          // test for mouse-draw => if yes set mdraw=true
          if (pDM === "") { // only for initial move
            drwdist = Math.sqrt((lmmx-lmdx)*(lmmx-lmdx) + (lmmy-lmdy)*(lmmy-lmdy));
            if (drwdist > 0.5*crit ) { 
              mdraw = true;  // mdraw (drawn outside 0.5 crit with mouse down) is one condition for provisional drawing
            } else {
              mdraw = false; 
            }            
          }
          
  // decide on the type of provisional draw (pDM) if it is not yet set
          // mouse drawn in empty area: start selection rectangle

          if ((mdraw) && (pDM === "") && (((lmdisn === 0) && (lmdisnb === 0)) && (kc <= 1) && (m.length > 1) &&
          (inrect(arect,lmdx,lmdy))))  { //initial draw not on atom or bond with k=0 or 1.
            if ((selTrees.length===1) && (lmdx > gb.l+gb.w/2-rhR) && (lmdx < gb.l+gb.w/2+rhR) && (lmdy > gb.t-2*rhR) && (lmdy < gb.t+ 2*rhR)) { // in rotation handle of single selected Mol 
              pDM = "rotateTree";
              return;            
            }
            if ((in_selRect(lmdx,lmdy)===0) && (kc===0))  { // mdraw outside selected brect
                pDM='spanSelRect';
                igctx.save();
                igctx.clearRect(drect.l,drect.t,drect.w,drect.h);
                igctx.strokeStyle = 'magenta';
                igctx.setLineDash([2,3]);
                igctx.strokeRect(lmdx, lmdy,lmmx-lmdx,lmmy-lmdy);
                igctx.restore();
            } else if (in_selRect(lmdx,lmdy) > 0) { // mdraw in selected brect: move all selected mols
                selMultiTrees(selTrees,1);
                gbs = getboundrect(m,1,'s');
                clearIGC();
                igctx.save();
                igctx.strokeStyle = 'magenta';
                drawMol(igctx,1,false);
                if (kc === 0) {
                  gtxt = 'MOVE';
                } else if (kc===1) {
                  gtxt = 'COPY';
                }
                for (i=0;i<selTrees.length;i++) {
                  markTree(selTrees[i],gtxt,'magenta',true,'t');
                }
                imgData = igctx.getImageData(gbs.l-2, gbs.t-charH, gbs.w+4, gbs.h+charH+2);
                igctx.strokeRect(gbs.l,gbs.t,gbs.w,gbs.h);
                igctx.restore();
                imgx = gbs.l-2;
                imgy = gbs.t-charH;
                if (kc===0) {
                  pDM='moveSelMol';
                } else if (kc===1) {
                  pDM='copySelMol';
                }
            }
          }
          if ((mdraw) && (pDM === "") && (((lmdisn > 0) || (lmdisnb > 0)) || ((selected) && (kc <= 1)) || (m.length === 1) || (!selected) && (kc > 0))) {
          // initial draw on (atom or bond) or (selected with kc=0 or 1) or (no atoms yet) or (no selection and alt and/or shift pressed)
            switch (true) {
              case ((kc === 0) && (selected) &&
                  (lmdx > gb.l) && (lmdx < gb.l+gb.w) && (lmdy > gb.t) && (lmdy < gb.t+gb.h)):
                if (lmdisnb > 0) {
                  anchor = b[lmdisnb].fra;
                } else if (lmdisn > 0) {
                  anchor = lmdisn;
                }
                if ((lmdisnb > 0) || (lmdisn > 0)) {
                  getTree(anchor);
                  gb = getboundrect(m,1,'s');
                }
              
                drawMol(igctx,1,false);
                igctx.save();
                igctx.lineWidth=1;
                igctx.setLineDash([2,3]);
                igctx.strokeRect(gb.l, gb.t, gb.w, gb.h);
                imgData = igctx.getImageData(gb.l, gb.t, gb.w, gb.h);
                igctx.font = '8pt sans-serif';
                igctx.fillStyle = "magenta";
                igctx.fillText("MOVE",gb.l,gb.t-4);
                igctx.restore();
                imgx = gb.l;
                imgy = gb.t;
                pDM = "moveTree";
//                break;
                return;
                
              case ((kc===1) && ((lmdisn > 0) || (lmdisnb > 0))):
              case ((kc===1) && (selected) && (inrect(gb,lmdx,lmdy))):
                if (lmdisnb > 0) {
                  anchor = b[lmdisnb].fra;
                } else if (lmdisn > 0) {
                  anchor = lmdisn;
                }
                if ((lmdisn > 0) || (lmdisnb > 0)) {
                  getTree(anchor);
                  gb = getboundrect(m,1,'s');
                }
                drawMol(igctx,1,false);
                igctx.save();
                igctx.lineWidth=1;
                igctx.setLineDash([2,3]);
                igctx.strokeRect(gb.l, gb.t, gb.w, gb.h);
                imgData = igctx.getImageData(gb.l, gb.t, gb.w, gb.h);
                igctx.font = '8pt sans-serif';
                igctx.fillStyle = "magenta";
                igctx.fillText("COPY",gb.l,gb.t-4);
                igctx.restore();
                imgx = gb.l;
                imgy = gb.t;
                pDM = "copyTree";
                break;
              case ((kc < 10) && (lmdisnb === 0) && (TSbond) && ((ESelem) || (ESxelem))):
                if ( lmdisn > 0) { // draw from existing atom
                  resix = residues.indexOf(m[lmdisn].el); // is it a residue?
                  if ((resix < 0) || (m[lmdisn].bpa.length === 0)) { // not a residue or isolated 
                    pDM = "provBondDraw";
                    bondOnAtom = true;
                  } else {
                    pDM = "";                  
                    bondOnAtom = false;
                  }
                } else if ((m.length === 1) || ((kc % 2) === 1)) {
                  pDM = "provBondDraw";
                  bondOnAtom = false;
                } else {
                  pDM = "";
                  bondOnAtom = false;
                }  
                break;
              case ((kc < 10) && (TSchain) && (lmdisnb === 0)):
                pDM = "provChainDraw";
                if ( lmdisn > 0) { // draw from existing atom
                  resix = residues.indexOf(m[lmdisn].el); // is it a residue?
                  if ((resix < 0) || (m[lmdisn].bpa.length === 0)) { // not a residue or isolated residue
                    chainstx = m[lmdisn].x;
                    chainsty = m[lmdisn].y;
                    chainOnAtom = true;
                  } else {
                    pDM = "";                  
                    chainOnAtom = false;
                  }
                } else if ((m.length === 1) || ((kc % 2) === 1)) {  // draw from mouse down position
                  chainstx = lmdx;
                  chainsty = lmdy;
                  chainOnAtom = false;
                } else {
                  pDM = "";                  
                  chainOnAtom = false;
                }
                break;
              case ((kc < 10) && (TSmesh) && (lmdisnb === 0)):
                pDM = "provMeshDraw";
                if ( lmdisn > 0) { // draw from existing atom
                  resix = residues.indexOf(m[lmdisn].el); // is it a residue?
                  if ((resix < 0) || (m[lmdisn].bpa.length === 0)) { // not a residue or isolated residue
                    meshstx = m[lmdisn].x;
                    meshsty = m[lmdisn].y;
                    meshOnAtom = true;
                    oldmeshdir  = -1;
                  } else {
                    pDM = "";                  
                    meshOnAtom = false;              
                  }
                } else if ((m.length === 1) || ((kc % 2) === 1)) {  // draw from mouse down position
                  meshstx = lmdx;
                  meshsty = lmdy;
                  meshOnAtom = false;                
                  oldmeshdir  = -1;
                } else {
                  pDM = "";                  
                }            
                break;
              case ((kc===0) && (TSring) && (lmdisnb > 0)):
                pDM = "provRingDraw"
                break;
              case ((kc===10) && (lmdisn > 0)):
              // MD on atom, drawing with shift key => moveAtom
                pDM = "moveAtom";
                break;
              case ((kc===10) && (lmdisnb > 0)):
                lastx1 = lmdx;
                lasty1 = lmdy;
                provBondWithPartners = true;
                hlBo=0;
                pDM = "moveBond";
                break;

              case ((kc===10) && (lmdisn === 0) && (lmdisnb === 0) && (m.length > 1)):
                pDM = "moveAllMol";
                clearSelection();
                igctx.save();
                gb = getboundrect(m,0,'s');
                drawMol(igctx,1,false);
                igctx.lineWidth=1;
                igctx.strokeStyle = 'magenta';
                igctx.setLineDash([2,3]);
                igctx.strokeRect(gb.l, gb.t, gb.w, gb.h);
                imgData = igctx.getImageData(gb.l, gb.t, gb.w, gb.h);
                igctx.font = '8pt sans-serif';
                igctx.fillStyle = "magenta";
                igctx.fillText("MOVE ALL",gb.l,gb.t-4);
                igctx.restore();
                imgx = gb.l;
                imgy = gb.t;
                break;
             case ((kc===11) && ((lmdisn > 0) || (lmdisnb > 0))): // alt & shift and draw on atom or bond
                if (lmdisnb > 0) {
                  anchor = b[lmdisnb].fra;
                } else if (lmdisn > 0) {
                  anchor = lmdisn;
                }
                if ((lmdisnb > 0) || (lmdisn > 0)) {
                  getTree(anchor);
                  gb = getboundrect(m,1,'s');
                }

                drawMol(igctx,1,false);
                igctx.save();
                igctx.lineWidth=1;
                igctx.setLineDash([2,3]);
                igctx.strokeRect(gb.l, gb.t, gb.w, gb.h);
                imgData = igctx.getImageData(gb.l, gb.t, gb.w, gb.h);
                igctx.font = '8pt sans-serif';
                igctx.fillStyle = "magenta";
                igctx.fillText("MOVE",gb.l,gb.t-4);
                igctx.restore();
                imgx = gb.l;
                imgy = gb.t;
                igctx.putImageData(imgData,imgx+10,imgy+10);
                pDM = "moveTree";
                break;
              case (((at===16) || (at===17)) && ((lmdisn > 0) || (lmdisnb > 0))):
                pDM="provArrowDraw";
                mdir = getdirangle(lmdx,lmdy,lmmx,lmmy);
                provArrow=false;
                if (lmdisn > 0) {
                  cx=m[lmdisn].x;
                  cy=m[lmdisn].y;
                } else if (lmdisnb > 0) {
                  cx=(m[b[lmdisnb].fra].x + m[b[lmdisnb].toa].x)/2; 
                  cy=(m[b[lmdisnb].fra].y + m[b[lmdisnb].toa].y)/2;
                }
                lastx1=cx;
                lasty1=cy;
                break;
              default:
                resetDV();
                drawMol(ctx,0,true);            
            } // switch determining the drawing mode
            if (pDM === "") {
              clearSelection();
            }
          } // end if ((mdraw) && (pDM===""))
        
  // provisional drawing for each pDM case
          if ((mmoved) && (pDM !== "")) {
            switch(pDM) {
              case 'provBondDraw':
                if ((!bondOnAtom) && ((m.length === 1) || ((kc % 2) === 1))) {  // last mouse down was not on valid atom
                  // drawing in free DA is only allowed for the first atom
                  cx = lmdx;
                  cy = lmdy;  
                } else {
                  cx = m[lmdisn].x;
                  cy = m[lmdisn].y;
                }
                if (provBond) {
                  drawProvBond(pdctx,lastx1, lasty1, lastx2, lasty2,"erase");
                  provBond = false;
                }
                dega = getdirangle(cx,cy,lmmx,lmmy);
                dega = drwsnap*Math.floor(dega/drwsnap);
                dx = Math.cos(Math.PI*dega/180)*bondlength;
                dy = (-1)*Math.sin(Math.PI*dega/180)*bondlength;
                if (inrect(arect,cx+dx,cy+dy)) { // check for in arect of new position            } 
                  drawProvBond(pdctx,cx,cy,cx+dx,cy+dy, "draw");
                  lastx1 = cx;
                  lasty1 = cy;
                  lastx2 = cx+dx;
                  lasty2 = cy+dy;
                  provBond = true;
                } 
                break;
              case 'provRingDraw':
              // figure out from draw-direction on which side of the bond 
                bx1 = m[b[lmdisnb].fra].x;
                by1 = m[b[lmdisnb].fra].y;
                bx2 = m[b[lmdisnb].toa].x;
                by2 = m[b[lmdisnb].toa].y;
                bx = (bx1 + bx2)/2;
                by = (by1 + by2)/2;
                mvx = x - bx;    // mv is the vector between mouse and bond center
                mvy = y - by;
                bvx = bx2 - bx1;  // bv is the vector along the bond (fra -> toa)
                bvy = by2 - by1;
                vp = vecprod2d(bvx, bvy, mvx, mvy);

          
                if (((at > 4) && (at < 9)) || (at === 10)) { // saturated rings
                  if (at === 10) { 
                    nc = nTSring; 
                  } else {
                    nc = at-2;
                  }
                
                  dummy = drawProvRing(pdctx, nc, lmdisnb, "bond", vp, "test");
                  if (dummy === true) {  // test if one of the atoms would be outside arect
                    if (provRing) {
                      dummy = drawProvRing(pdctx, nc, lmdisnb, "bond", vp, "erase");
                      provRing = false;
                    } else {
                      dummy = drawProvRing(pdctx, nc, lmdisnb, "bond", vp, "draw");
                      provRing = true;
                    }
                  }
                } else if (at === 9) { // benzene
                  dummy = drawProvRing(pdctx, 6, lmdisnb, "bond", vp, "test");
                  if (dummy === true) {  // test if one of the atoms would be outside arect
                    if (provRing) {
                      dummy = drawProvRing(pdctx, 6, lmdisnb, "bond", vp, "erase");
                      provRing = false;
                    } else {
                      dummy = drawProvRing(pdctx, 6, lmdisnb, "bond", vp, "draw");
                      provRing = true;
                    }
                  }
                }
                vpg = vp;
                break;
              case 'moveAtom':
                if (lmdisn > 0) {  // last mouse down was on valid atom, redundant check
                  if (provBondsToPartners) {
                    drawProvBondsToPartners(pdctx, lmdisn, lastx1, lasty1,"erase");
                    provBondsToPartners = false;
                  }
                  drawProvBondsToPartners(pdctx, lmdisn, lmmx, lmmy,"draw");
                  lastx1 = lmmx;
                  lasty1 = lmmy;
                  provBondsToPartners = true;
                }
                break;
              case 'moveBond':
                if (lmdisnb > 0) {  // last mouse down was on valid bond, redundant check
                  if (provBondWithPartners) {
                    drawProvBondWithPartners(pdctx, lmdisnb, lastx1-lmdx, lasty1-lmdy,"erase");
                    provBondWithPartners = false;
                  }
                  drawProvBondWithPartners(pdctx, lmdisnb, lmmx-lmdx, lmmy-lmdy,"draw");
                  lastx1 = lmmx;
                  lasty1 = lmmy;
                  provBondWithPartners = true;
                }
                break;
              case 'moveAllMol':
                movex = lmmx - lmdx;
                movey = lmmy - lmdy;
                if ((inrect(arect,imgx+movex+gb.w, imgy+movey+gb.h)) && (inrect(arect,imgx+movex, imgy+movey))) {
                  can.style.cursor = 'move';
                  igctx.save();
                  igctx.fillStyle = 'white';
                  igctx.fillRect(drect.l, drect.t, drect.w, drect.h);
                  igctx.restore();
                  igctx.putImageData(imgData,imgx+movex,imgy+movey);
                  igctx.font = '8pt sans-serif';
                  igctx.fillStyle = "magenta";
                  igctx.fillText("MOVE ALL",imgx+movex,imgy+movey-4);

                  lastx1 = movex;
                  lasty1 = movey;
                } 
                break;
              case 'moveSelMol':
              case 'copySelMol':
                movex = lmmx - lmdx;
                movey = lmmy - lmdy;
                if ((inrect(arect,imgx+movex+gbs.w, imgy+movey+gbs.h)) && (inrect(arect,imgx+movex, imgy+movey))) {
                  can.style.cursor = 'move';
                  igctx.save();
                  igctx.fillStyle = 'white';
                  igctx.fillRect(drect.l, drect.t, drect.w, drect.h);
                  igctx.putImageData(imgData,imgx+movex,imgy+movey);
                  igctx.restore();
                  lastx1 = movex;
                  lasty1 = movey;
                } 
                break;
              case 'moveTree':
              case 'copyTree':
                movex = 0;
                movey = 0;
                const gbl = new Rect(gb.l+lmmx-lmdx,gb.t-rhR-2+lmmy-lmdy,gb.w,gb.h+2*rhR+2);
                if (rectInRect(gbl,arect)) {
                  movex = lmmx - lmdx;
                  movey = lmmy - lmdy;
                } else {
                  movex = lmmx - lmdx;
                  movey = lmmy - lmdy;
                  if (gbl.l < arect.l ) { 
                    movex = arect.l + 4 - imgx; 
                  } 
                  if (gbl.t < arect.t + 1 ) { 
                    movey = arect.t + rhR + 4 - imgy;
                  } 
                  if (gbl.l+gbl.w > arect.l+arect.w) { 
                    movex = arect.l+arect.w -4 - gb.w - imgx;
                  }
                  if (gbl.t+gbl.h > arect.t+arect.h) {
                    movey = arect.t+arect.h - gb.h - 4 - imgy; 
                  }
                }
                can.style.cursor = 'move';
                igctx.save();
                igctx.fillStyle = 'white';
                igctx.fillRect(mrect.l, mrect.t, mrect.w, mrect.h);
                igctx.restore();
                igctx.putImageData(imgData,imgx+movex,imgy+movey);
                igctx.font = '8pt sans-serif';
                igctx.fillStyle = "magenta";
                if (pDM === 'moveTree') {
                  igctx.fillText("MOVE",imgx+movex,imgy+movey-4);
                } else {
                  igctx.fillText("COPY",imgx+movex,imgy+movey-4);
                }
                lastx1 = movex;
                lasty1 = movey;
                break;
              case 'rotateTree':
                igctx.save();
                igctx.fillStyle = 'white';
                igctx.fillRect(drect.l, drect.t, drect.w, drect.h);
                igctx.restore();
                cex = gb.l+gb.w/2;
                cey = gb.t+gb.h/2;
                rotby = Math.round(180*Math.atan2(lmmx-cex,cey-lmmy)/Math.PI);
                igctx.save();
                igctx.translate(cex,cey);
                igctx.rotate(Math.PI*rotby/180);
                igctx.translate(-cex,-cey);
                drawMol(igctx,1,false);
                igctx.strokeStyle = 'magenta';
                igctx.fillStyle = 'magenta';
                igctx.beginPath();
                igctx.arc(cex, cey, 4, 0, Math.PI * 2);
                igctx.stroke();
                igctx.beginPath();
                igctx.arc(cex, cey, 2, 0, Math.PI * 2);
                igctx.fill();
                igctx.beginPath();
                igctx.strokeRect(cex-gb.w/2, cey-gb.h/2, gb.w, gb.h);
                igctx.lineWidth = '1';
                igctx.fillStyle = 'magenta';
                igctx.beginPath();
                igctx.moveTo(gb.l+gb.w/2-rhR-4,gb.t-rhR-2);
                igctx.lineTo(gb.l+gb.w/2-rhR+2,gb.t-rhR+6);
                igctx.lineTo(gb.l+gb.w/2-rhR+4,gb.t-rhR-4);
                igctx.closePath();
                igctx.fill();
                igctx.beginPath();
                igctx.moveTo(gb.l+gb.w/2+rhR-4,gb.t-rhR-4);
                igctx.lineTo(gb.l+gb.w/2+rhR-2,gb.t-rhR+6);
                igctx.lineTo(gb.l+gb.w/2+rhR+4,gb.t-rhR-2);
                igctx.closePath();
                igctx.fill();
                igctx.lineWidth = '1';
                igctx.beginPath();
                igctx.arc(cex, gb.t-rhR, rhR, 0, Math.PI * 2); 
                igctx.stroke();
                igctx.font = '10pt sans-serif';
                igctx.fillStyle = 'magenta';
                igctx.fillText(String(rotby) + "°",cex+rhR+4,gb.t-rhR);
                igctx.restore();
                break;
              case 'spanSelRect':
                if (inrect(arect,lmmx,lmmy)) {
                  igctx.save();
                  igctx.clearRect(arect.l,arect.t,arect.w,arect.h);
                  if (selTrees.length > 0) {
                    for (i=0;i<selTrees.length;i++) {
                      markTree(selTrees[i],'','magenta',false,'t');
                    }
                  }
                  gb.l=Math.min(lmdx,lmmx); 
                  gb.t=Math.min(lmdy,lmmy); 
                  gb.w=Math.abs(lmdx-lmmx); 
                  gb.h=Math.abs(lmdy-lmmy); 
                  igctx.strokeStyle = 'magenta';
                  igctx.setLineDash([2,3]);
                  igctx.strokeRect(lmdx, lmdy,lmmx-lmdx,lmmy-lmdy);
                  igctx.restore();
                  if (TSrxn) {
                    igctx.fillStyle = 'magenta';
                    if (selectWhat==='reactant') {
                    igctx.fillText('arrow start', gb.l, gb.t-8);
                    } else if (selectWhat==='product') {
                      igctx.fillText('arrow end', gb.l, gb.t-8);
                    }
                  }
                } else {
                  igctx.clearRect(drect.l,drect.t,drect.w,drect.h);
                  pDM = "";
                }                
                break;
              case 'provChainDraw':
                mdrawdist = Math.sqrt((lmmx - chainstx)*(lmmx - chainstx)+(lmmy - chainsty)*(lmmy - chainsty));
                nc = Math.floor(mdrawdist/chainincr);
                chaindir = getdirangle(chainstx, chainsty,lmmx,lmmy);
                chdir = chainsnap*Math.floor(chaindir/chainsnap);
                dev = ((chaindir % chainsnap) > (chainsnap/2)) ? 1 : -1;

                if (((nc != oldnc) || (oldchdir != chdir) || (olddev != dev)) && (nc >= 1)) {
                  if (chainDrawn) {
                    drawProvChain(pdctx, oldnc, chainstx, chainsty, oldchdir, olddev, true, "erase");
                    chainDrawn = false;
                  }
                  drawProvChain(pdctx, nc, chainstx, chainsty, chdir, dev, true, "draw");
                  oldnc = nc;
                  oldchdir = chdir;
                  olddev = dev;
                  chainDrawn = true;
                }
                break;
              case 'provMeshDraw':
                if ( meshAt.length === 0) { // create the first mesh node
                  meshAt.push(new Coord(meshstx, meshsty));   // PUSH
                  meshDrawn = false;
                }
                if (meshAt.length === 1) { // create the mesh node which takes its direction from the initial mousedraw
                  mdir = getdirangle(meshAt[meshAt.length-1].x, meshAt[meshAt.length-1].y, lmmx, lmmy);
                  tdir = norma(30*Math.floor(mdir/30));
                  dx = bondlength*Math.cos(Math.PI*tdir/180);
                  dy = (-1)*bondlength*Math.sin(Math.PI*tdir/180);
                  newx = meshAt[meshAt.length-1].x + dx;
                  newy = meshAt[meshAt.length-1].y + dy;
                  if (inrect(arect,newx, newy)) {
                    if (tdir != oldmeshdir) {
                      if (meshDrawn === true) {
                        drawProvMesh(pdctx, meshAt[meshAt.length-1].x, meshAt[meshAt.length-1].y, oldnewx, oldnewy,true,"erase");
                        meshDrawn = false;
                      }
                      if (meshDrawn === false) {                
                        drawProvMesh(pdctx, meshAt[meshAt.length-1].x, meshAt[meshAt.length-1].y, newx, newy,true,"prov");
                        oldnewx = newx;
                        oldnewy = newy;
                        oldmeshdir = tdir;
                        meshDrawn = true;
                      }
                    }
                    mdrawdist = Math.sqrt(((lmmx - lmdx)*(lmmx - lmdx)) + ((lmmy - lmdy)*(lmmy -lmdy)));
                    if (mdrawdist > bondlength - crit) { 
                      if (meshDrawn === true) {
                        drawProvMesh(pdctx, meshAt[meshAt.length-1].x, meshAt[meshAt.length-1].y, oldnewx, oldnewy,true,"erase");
                        meshDrawn = false;
                      }
                      // test for nearness to existing atom here
                      if (hlAt > 0) {
                        testat = lmmisn;
                      } else {
                        testat = isnear(m,b,newx, newy);
                      }
                      testmesh = isnearmesh(newx, newy);
                      if (testmesh >= 0) {
                        drawAtomHighlighted(meshAt.x,meshAt.y);
                      }
                      if (testat > 0) { // near an existing Atom
                        atToConnect = testat;
                        drawProvMesh(pdctx, meshAt[meshAt.length-1].x, meshAt[meshAt.length-1].y, newx, newy,true,"prov");
                        meshDrawn = true;
                      } else if (testmesh >= 0) { // near meshAt member, do not add this atom but remember it
                        meshToConnect = testmesh;
                        drawProvMesh(pdctx, meshAt[meshAt.length-1].x, meshAt[meshAt.length-1].y, newx, newy,true,"prov");
                        meshDrawn = true;
                      } else {
                        meshToConnect=-1;
                      }
                      meshAt.push(new Coord(newx, newy)); // PUSH
                      drawProvMesh(pdctx, meshAt[meshAt.length-2].x, meshAt[meshAt.length-2].y, newx, newy,true,"draw");
                      // remember the last two nodes for direction of next one
                      oox = lmdx;
                      ooy = lmdy;
                      oldx = newx;
                      oldy = newy;
                    } else {
                      newx = meshAt[meshAt.length-1].x;
                      newy = meshAt[meshAt.length-1].y;
                    }
                  } else {
                    newx = meshAt[meshAt.length-1].x;
                    newy = meshAt[meshAt.length-1].y;
                  }
                }
                if (meshAt.length > 1) { // create the next mesh node which takes its direction from the bond between the last two
                  if (meshOnAtom === false) {
                    ctx.font = '12pt Calibri';
                    ctx.fillStyle = 'white';
                    ctx.fillText("C",meshAt[0].x-6,meshAt[0].y+6);
                  }
                  oldx = meshAt[meshAt.length-1].x;
                  oldy = meshAt[meshAt.length-1].y;
                  oox = meshAt[meshAt.length-2].x;
                  ooy = meshAt[meshAt.length-2].y;
                  mdir = getdirangle(lmmx, lmmy, oldx, oldy);
                  tdir = getdirangle(oox, ooy, oldx, oldy);
                  dirdiff = norma(mdir-tdir);
                  behindT = ((dirdiff < 90) || (dirdiff > 270)); // mouse behind T-line
                  if (!behindT) {
                    vp = vecprod2d(oldx-oox, oldy-ooy, lmmx-oldx, lmmy-oldy);
                    tdir = (vp > 0) ? norma(tdir - 60) : norma(tdir + 60); // decide which way to go
                    dx = bondlength*Math.cos(Math.PI*tdir/180);
                    dy = (-1)*bondlength*Math.sin(Math.PI*tdir/180);
                    newx = oldx + dx;
                    newy = oldy + dy;
                    if (inrect(arect,newx, newy)) {
                      if (tdir != oldmeshdir) {
                        if (meshDrawn === true) {
                          drawProvMesh(pdctx, meshAt[meshAt.length-1].x, meshAt[meshAt.length-1].y, oldnewx, oldnewy,true,"erase");
                          meshDrawn = false;
                        }
                        if (meshDrawn === false) {                
                          drawProvMesh(pdctx, meshAt[meshAt.length-1].x, meshAt[meshAt.length-1].y, newx, newy,true,"prov");
                          oldnewx = newx;
                          oldnewy = newy;
                          oldmeshdir = tdir;
                          meshDrawn = true;
                        }
                      }
                      mdrawdist = Math.sqrt((lmmx - oldx)*(lmmx - oldx) + (lmmy - oldy)*(lmmy - oldy));
                      if ( mdrawdist > bondlength - crit) {
                        if (meshDrawn === true) {
                          drawProvMesh(pdctx, meshAt[meshAt.length-1].x, meshAt[meshAt.length-1].y, oldnewx, oldnewy,true,"erase");
                          meshDrawn = false;
                        }
                        // test for nearness to existing atom here
                        if (hlAt > 0) {
                          testat = lmmisn;
                        } else {
                          testat = isnear(m,b,newx, newy);
                        }
                        testmesh = isnearmesh(newx, newy);
                        if (testmesh >= 0) {
                          drawAtomHighlighted(meshAt.x,meshAt.y);
                        }
                        if (testat > 0) { // near an existing Atom
                          atToConnect = testat;
                          drawProvMesh(pdctx, meshAt[meshAt.length-1].x, meshAt[meshAt.length-1].y, newx, newy,true,"prov");
                          meshDrawn = true;
                        } else if (testmesh >= 0) { // near meshAt member, do not add this atom but remember it
                          meshToConnect = testmesh;
                          drawProvMesh(pdctx, meshAt[meshAt.length-1].x, meshAt[meshAt.length-1].y, newx, newy,true,"prov");
                          meshDrawn = true;
                        } else {
                          meshToConnect=-1;
                        }

                        meshAt.push(new Coord(newx, newy)); // PUSH
                        drawProvMesh(pdctx, oldx, oldy, newx, newy,true,"draw");
                        oox = oldx;
                        ooy = oldy;
                        oldx = newx;
                        oldy = newy;
                      } else {
                        newx = oldx; // correct back to old coord if not saved to array
                        newy = oldy;
                        mdrawdist = 0;
                      }
                    } else {
                      newx = oldx; // correct back to old coord if not saved to array
                      newy = oldy;
                      mdrawdist = 0;
                    }              
                  } else { // behindT, 
                    if (meshDrawn) {
                      drawProvMesh(pdctx, meshAt[meshAt.length-1].x, meshAt[meshAt.length-1].y, oldnewx, oldnewy,true,"erase");
                    }
                    drawProvMesh(pdctx, meshAt[meshAt.length-2].x, meshAt[meshAt.length-2].y, meshAt[meshAt.length-1].x, meshAt[meshAt.length-1].y,true,"erase");
                    meshAt.pop();
                    behindT = false;
                  }
                      
                }
                break;
              case "provArrowDraw":
                lastmdir = mdir;
                if ((lastx2 !== 0) && (lasty2 !== 0)) {
                  mdir = getdirangle(lastx2,lasty2,lmmx,lmmy);
                  if ((lastmdir > -1) && (curv === 0)) {
                    mvx =  Math.cos(Math.PI*mdir/180);  // mv is the vector between mouse and bond center
                    mvy = (-1)*Math.sin(Math.PI*mdir/180);
                    bvx = Math.cos(Math.PI*lastmdir/180);  // bv is the vector along the bond (fra -> toa)
                    bvy = (-1)*Math.sin(Math.PI*lastmdir/180);
                    curv = (-1)*vecprod2d(bvx, bvy, mvx, mvy);
                  }
                }
                if (provArrow) {
                  pdctx.clearRect(0, 0, pdc.width, pdc.height);
                  provArrow = false;
                }
                if (inrect(arect,lmmx,lmmy)) { // check for in arect of new position            } 
                  drawProvArrow(pdctx,lastx1,lasty1,lmmx,lmmy,curv, "draw");
                  lastx2 = lmmx;
                  lasty2 = lmmy;
                  lastcurv = curv;
                  provArrow = true;
                } 
                break;  
            } // end switch
          }

        } // end trackMouse

  //MOUSEUP--------------------MOUSEUP--------------------MOUSEUP--------------------MOUSEUP--------------------
    // mouse up event
      function mouseUp(){
 
      let i=0, jj=0, k=0, p=0;
      let isn = 0;
      let isna = -1;
      let isnrxa = -1;
      let tx, ty, cx, cy, dega, dx, dy, rotby, vl;
      let bi1 = 0;
      let ele = "";
      let nring = 0;
      let newindex = 1;
      let ntr = 0;
      let oldindex = 1;
      let fax, fay, tax, tay, fisn, tisn;
      let resix = -1;
      let bix = -1;
      let bo = 0;
      let va = 0;
      let ox, box, iox, biox, obp, nbp;
      let mxo = [];
      let mxc = [];
      let modRx = [];
      let targ = 0;
      let src = 0;
      let tmpArrow = {};
      let tbr = new Rect(0,0,0,0);
      let tselMols=[];

      mouseisdown = false;
        

      lmux = x;
      lmuy = y;


      if ((pDM !== "") && (!inrect(arect,lmux,lmuy))) {  
      // gracefully end prov draw if mousUP occurred outside active drawing area
        drawMol(ctx,0,true);
        resetDV();
        return;
      }
      if (!(inrect(mrect,lmux,lmuy))) { 
      // don't react to mouseUP outside the active Y region and tools (title, buttons etc)
        resetDV();
        return; 
      } // not inside the active mrect => return
    
    
      // was it a click?
      click = false;
      if ((pad) && ((inrect(trect,lmux,lmuy)) || (inrect(erect,lmux,lmuy)) || (inrect(lrect,lmux,lmuy)) || (inrect(rrect,lmux,lmuy)))) {
        if (Math.sqrt((lmux - lmdx)*(lmux - lmdx)+(lmuy - lmdy)*(lmuy - lmdy)) < iconH/2)  {
          click = true;
        }
      } else if (Math.sqrt((lmux - lmdx)*(lmux - lmdx)+(lmuy - lmdy)*(lmuy - lmdy)) < clickCrit)  {
        click = true;
      }
      
      if ((click) && (inrect(rrect,lmux,lmuy))) { // refresh if redraw icon is hit
        igctx.save();
        igctx.fillStyle = 'LightGrey';
        igctx.fillRect(rrect.l+2,rrect.t+2,rrect.w-4,rrect.h-4);
        igctx.restore();
        setTimeout(function () {       
          refresh();
          kc = 0;
          document.getElementById('shift').className = "shift";
          document.getElementById('alt').className = "alt";
        },100);
        return;
      }
      
      if ((click) && (Math.hypot(lmux-zi.x,lmuy-zi.y) < zi.r)) {
        igctx.save();
        igctx.fillStyle = 'LightGray';
        igctx.beginPath();
        igctx.arc(zi.x,zi.y,zi.r-2,0,2*Math.PI);
        igctx.fill();
        igctx.restore();
        setTimeout(function () { zoom('in'); },100);
      }
      if ((click) && (Math.hypot(lmux-zo.x,lmuy-zo.y) < zo.r)) {
        igctx.save();
        igctx.fillStyle = 'LightGray';
        igctx.beginPath();
        igctx.arc(zo.x,zo.y,zo.r-2,0,2*Math.PI);
        igctx.fill();
        igctx.restore();
        setTimeout(function () { zoom('out'); },100);      
      }
 
      if ((click) && (lmuy > drect.t+drect.h) && (lmux > lrect.l+lrect.w) && (lmux < rrect.l)) { //diagostics
        displayDims();
        return;
      } 
      if ((click) && (inrect(trect,lmux,lmuy))) {  // click in the tools x-region
        i = Math.floor((lmuy-trect.t)/(trect.h/14)); // calculate which tool
        if (i < 0) { i = 0; }
        if (i > 13) { i = 13; }
        setTool(i);
        if ((TSchain) || (TSmesh) || (TSerase) || (TSring) ) { // set element tool to carbon for erase,ring,chain,mesh
          setES(0);
        }
        clearSelection();
        resetDV();
        clearIGC();
        return;
      }
      if ((lewis_rxnarw_yn) && (click) && (inrect(lrect,lmux,lmuy))) { //Lewis tool clicked
        i = 14+Math.floor((lmux-lrect.l)/(lrect.w/8)); // calculate which tool
        if (i < 14) { i = 14; }
        if (i > 21) { i = 21; } //BF201031.1
        setTool(i);
        setES(0);
      }
      if ((click) && (inrect(erect,lmux,lmuy))) {  // click in the element tool-region
        i = Math.floor((lmux-erect.l)/(erect.w/14)); // calculate the element
        if (i < 0) { i = 0; }
        if (i > 13) { i = 13; }
        setES(i);
        clearSelection();
        resetDV();
        clearIGC();
        return;
      }
      
      if (inrect(arect,lmux,lmuy)) { // mouse up in the active drawing area
    
        if (!((pDM === 'moveTree') || (pDM === 'copyTree') || (pDM === 'rotateTree'))) {
          isn = isnear(m,b,lmux, lmuy);
          isna = isneararrow(lmux,lmuy);
          isnrxa = isnearRxa(lmux,lmuy);
        }
      
        if (isn > 0) {
          lmuisn = isn;
          lmuisnb = 0;
          lmuisna = -1;
          lmuisnrxa = -1;
        } else if (isn < 0) {
          lmuisnb = (-1)*isn;
          lmuisn = 0;
          lmuisna = -1;
          lmuisnrxa = -1;
        } else {
          lmuisn = 0;
          lmuisnb = 0;
          lmuisna = -1;
          lmuisnrxa = -1;
        }
        
        if (isna > -1) {
          lmuisna = isna;
        }
        if (isnrxa > -1) {
          lmuisnrxa = isnrxa;
        }
         
        clickOnAtom = false;
        clickOnBond = false;
        clickOnArrow = false;
        clickOnRxnArrow = false;
      
        if (click)  { // case click===========================
          if ((lmuisn > 0) && (mdraw === false)) { 
            clickOnAtom = true;
            resix =  residues.indexOf(m[lmuisn].el);
          }
          if ((lmuisnb > 0) && (mdraw === false)) { 
            clickOnBond = true;
          }
          if ((lmuisna > -1) && (mdraw === false)) { 
            clickOnArrow = true;
          }
          if ((lmuisnrxa > -1) && (mdraw === false)) { 
            clickOnRxnArrow = true;
          }
      
          if (clickOnAtom) {  // click on atom
            if (TSerase) {
              if (rxnarro.length > 0) { // delete associated rxn arrows
                findRingBonds(m,b);
                if ((ringatoms.includes(lmuisn) && (m[lmuisn].bpa.length > 2)) || (!ringatoms.includes(lmuisn) && (m[lmuisn].bpa.length > 1))) {
                  for (jj=0;jj<rxnarro.length;jj++) {
                    if ( rxnarro[jj].stn.includes(m[lmuisn].t) ||  rxnarro[jj].etn.includes(m[lmuisn].t)) {
                      deleteRxnArrow(jj);
                      jj--; //BUGFIX 190420.1
                    }
                  }
                }
              }
              deleteAtom(m,b,lmuisn,true);
              saveState();
              resetDV();
              drawMol(ctx,0,true);
              return;
            }
            if (TSlewis) { // increment/decrement number of LP but not for residues //BF210505.3
              if (residues.includes(m[lmuisn].el)) { // Residue: do nothing
                 resetDV();
                 return;
              } else if (at===14) {             
              // allow one lone pair more than octet rule but never more than 4
                va = 0;
                for (k = 0;k<m[lmuisn].bpa.length;k++) {
                  bo = m[lmuisn].bpa[k].t;
                  if ((bo === 4) || (bo === 5)) { bo = 1; }
                  va += bo;
                }
                if ((m[lmuisn].nlp < (5-va)) && (m[lmuisn].nlp <= 3)) {
                  m[lmuisn].nlp += 1;
                }
              } else if ((at===15) && (m[lmuisn].nlp > 0)) {
                 m[lmuisn].nlp -= 1;
              }
              saveState();
              resetDV();
              drawMol(ctx,0,true);
              return;
            }
            if (TSring) { 
              if (resix >= 0 ) { // no ring with residue as atom
                resetDV();
                drawMol(ctx,0,true);
                return;              
              } 
              
              if (((at > 4) && (at < 9)) || (at === 10)) { // saturated rings, addRing expects a current atom
                if (at === 10) { // n-ring
                  if (nTSring > 0) {
                    nring = nTSring;
                  } else {
                    resetDV();
                    return;
                  }
                } else { // cyclopropane to cyclohexane
                  nring = at -2;
                }
                dummy = drawProvRing(pdctx, nring, lmuisn, "atom", 1, "test"); 
                if (dummy === true) {
                  addRing(nring, lmuisn, 1,"atom"); 
                }              
              } else if (at === 9) { // benzene
                dummy = drawProvRing(pdctx, 6, lmuisn, "atom", 1, "test"); 
                if (dummy === true) {
                  addRing(-6, lmuisn, 1,"atom"); 
                }              
              }
              saveState();
              resetDV();
              drawMol(ctx,0,true);
              return;
            }
            if ((ESelem) && (m[lmuisn].el !== atsym[ae])) { // TE set to another element
              if (m[lmuisn].an === 1) {  // if it was explicit H, decrement eh of bonding partners
                for (jj=0;jj<m[lmuisn].bpa.length;jj++) {
                  m[m[lmuisn].bpa[jj].p].eh -= 1;
                }
              }
              m[lmuisn].el = atsym[ae];
              m[lmuisn].an = getAtomicNumber(atsym[ae]);
              m[lmuisn].nlp = 0; // changing to other element resets number of lone pairs to 0
              if (m[lmuisn].an === 1) { // if new element is H, increment eh of bonding partners
                for (jj=0;jj<m[lmuisn].bpa.length;jj++) {
                  m[m[lmuisn].bpa[jj].p].eh += 1;
                  if (m[lmuisn].bpa[jj].t > 3) { // check for stereo Bond
                    bix = getBondIndex(b,m[lmuisn].bpa[jj].p,lmuisn);
                    if (b[bix].fra === lmuisn) {
//                       changeBondType(m,b,bix,-1,true); // BF200222.1 
                        changeBondType(m,b,bix,1,true);
                    }
                  }
                }
              }
              saveState();
              resetDV();
              drawMol(ctx,0,true);
              return;
            }
            if (ESxelem)  {
              getTxt('x'); // calls setXelement() on ok or return
            }
            if ((EScharge) && (!residues.includes(m[lmuisn].el))) { // increment/decrement charge or toggle radical but not for residues //BF210505.3
              if (ae === 11) {// toggle radical center
                if (m[lmuisn].r) {  m[lmuisn].r = false; } else { m[lmuisn].r = true; }
              } else if ( ae === 12) { // increase charge
                m[lmuisn].c += 1;
              } else if ( ae === 13) { // decrease charge
                m[lmuisn].c -= 1;
              }          
              saveState();
              resetDV();
              drawMol(ctx,0,true);
              return;
            }
            drawMol(ctx,0,true);
          } else if (clickOnArrow) {
            if ((kc===0) && (lmuisna > -1) && inrect(arect,x,y) && (TSerase)) { // click on arrow with eraser tool active
              deleteArrow(lmuisna);
              saveState();
              resetDV();
              drawMol(ctx,0,true);
              return;
            }            
            if ((kc===0) && (lmuisna > -1) && inrect(arect,x,y)) { // click on arrow but eraser tool not active: flip arrow
              arro[lmuisna].crv = (arro[lmuisna].crv > 0)? -1 : 1; 
              saveState();
              resetDV();
              drawMol(ctx,0,true);
              return;
            }            
          } else if (clickOnRxnArrow) {
            if ((kc===0) && (lmuisnrxa > -1) && inrect(arect,x,y) && (TSerase)) { // click on rxn arrow with eraser tool active
              deleteRxnArrow(lmuisnrxa);
              saveState();
              resetDV();
              drawMol(ctx,0,true);
              return;
            }            
            if ((kc===0) && (lmuisnrxa > -1) && inrect(arect,x,y) && (at===21)) { // click on rxn arrow with Text tool active
              getAtxt(lmuisnrxa);
            }            
          } else if (clickOnBond) {              
            if ((kc===10) && (lmuisnb > 0) && inrect(arect,x,y)) { // shift-click flip bond
              flipBranch(m,b,lmuisnb,1,false);
              // check whether branch is within arect
              tbr = getboundrect(m,1,'s');
              if(!(rectInRect(tbr, arect))) {
                flipBranch(m,b,lmuisnb,-1,false);
              }
              for (jj=1;jj<m.length;jj++) {
                if (m[jj].s===1) {
                  sort_abop_by_dir(m,jj);
                }
              }
              drawMol(ctx,0,true);
              checkCollisions();
              clearSelection();
              saveState();
              resetDV();
              if (pad) {
                x=0;
                y=0;
              }            
              return;
            } else if (TSbond) {
              if (at+1 !== b[lmuisnb].btyp) { //active bond tool different from bond's type
                changeBondType(m,b,lmuisnb, at+1,true);            
              } else if ((at === 3)||(at === 4)) { //stereo bond of the same type as the bond's
                changeBondType(m,b,lmuisnb, -1,true); // reverse polarity            
              }
              saveState();
              resetDV();
              drawMol(ctx,0,true);
              return;
            } else if ((TSerase) && (lmuisnb > 0)) { // erase bond
              if (rxnarro.length > 0) { // check for associated rxn arrows
                findRingBonds(m,b);
                if (!isringbond(b,b[lmuisnb].fra,b[lmuisnb].toa)) { // not ring bond
                  for (jj=0;jj<rxnarro.length;jj++) {
                    if (rxnarro[jj].stn.includes(m[b[lmuisnb].fra].t) || rxnarro[jj].stn.includes(m[b[lmuisnb].toa].t) || rxnarro[jj].etn.includes(m[b[lmuisnb].fra].t) || rxnarro[jj].etn.includes(m[b[lmuisnb].toa].t)) {
                      deleteRxnArrow(jj);
                      jj--;
                    }
                  }
                }
              }
              deleteBond(m,b,lmuisnb);
              saveState();
              resetDV();
              drawMol(ctx,0,true)
              return;
            } else {
              resetDV();
              drawMol(ctx,0,true);
              return;
            }
          } else { // click in DA but not on atom or bond
            if ((selected) && (m.length > 1) && (kc === 0)) { // click in empty DA eliminates any selection
              // click in one of the 180° 3D rotation handles
              if ((lmux < gb.l+gb.w/2+20) && (lmux > gb.l+gb.w/2-20) && (lmuy < gb.t+gb.h+30) && (lmuy > gb.t+gb.h)) {
                rotTree180(m,b,'y',1);
              }
              if ((lmux < gb.l+gb.w+30) && (lmux > gb.l+gb.w) && (lmuy < gb.t+gb.h/2+20) && (lmuy > gb.t+gb.h/2-20)) {
                rotTree180(m,b,'x',1);
              }
              clearSelection();
            }
            if ((TSbond) && ((ESelem) || (ESxelem))) { // no atom creation with charge or radical tools
              if ((m.length === 1) || ((kc % 2) === 1)) { // trap the no atom yet or new fragment case
                tx = lmux; ty = lmuy;
                dummy = inrect(arect,tx, ty);
                if (dummy === true) {
                  if (ESelem) {
                    ele = atsym[ae];
                  } else {
                    ele = "C";
                  }
                  newindex = addAtom(m,ele,tx,ty,false);  // first atom added here
                  if ((newindex > 0) && (ESxelem)) {
                    getTxt('x');
                  }
                }
                if (!ESxelem) {
                  saveState();                  
                  drawMol(ctx,0,true);
                }
                resetDV();
                return;
              }
            }
            if ((TSring) && ((m.length === 1) || ((kc % 2) === 1))) {
              if (((at > 4) && (at < 9)) || (at === 10)) { // saturated rings, addRing expects a current atom 
                if (at === 10) {
                  if (nTSring > 0) {
                    nring = nTSring;
                  } else {
                    resetDV();
                    return;
                  }
                } else {
                  nring = at-2;
                }
                dummy = drawProvRing(pdctx, nring, 0, "freespace", 1, "test");
                if (dummy === true) {
                  addRing(nring, 0, 1, "atom");
                }
              } else if (at === 9) { // benzene
                dummy = drawProvRing(pdctx, 6, 0, "freespace", 1, "test");
                if (dummy === true) {
                  addRing(-6, 0, 1,"atom");
                }
              }
              saveState();
              resetDV();
              drawMol(ctx,0,true);
              return;
            }
            clearIGC();
          }
          clearIGC();
          clearSelection();
      } // end of case click===================

      // case DRAW =================================

        if (mdraw) { // case mouse was drawn with mouse down before mouse up
      
          switch (pDM) {
            case 'provBondDraw':
              if ((!bondOnAtom) && ((m.length === 1) || ((kc % 2) === 1))) {
                oldindex = addAtom(m,"C",lmdx,lmdy,false);
                cx = lmdx;
                cy = lmdy;
              } else {
                oldindex = lmdisn;  
                cx = m[lmdisn].x;
                cy = m[lmdisn].y;
              }
              dega = getdirangle(cx,cy,lmux,lmuy);
              dega = drwsnap*Math.floor(dega/drwsnap);
              dx = Math.cos(Math.PI*dega/180)*bondlength;
              dy = (-1)*Math.sin(Math.PI*dega/180)*bondlength;
              tx = cx + dx;
              ty = cy + dy;
        
              if (inrect(arect,tx, ty)) {  // only mouseup inside arect      
                if ((TSbond) && ((ESelem) || (ESxelem)) && (!TSchain)) {
                  if (lmuisn === 0) { // mouse up was not near valid atom
                    if (ESelem) {
                      ele = atsym[ae];
                    } else {
                      ele = "C";
                    }
                    newindex = addAtom(m,ele,tx,ty,false);
                    if (newindex > 0) {
                      if ((m[newindex].an === 1) && (m[lmdisn].an !== 1)) { //BF191101.1
                        m[lmdisn].eh += 1;
                      }
                      addBond(m,b,oldindex, newindex, at + 1);
                      if (ESxelem) {
                        getTxt('x');
                      }
                    }
                  } else if (lmuisn != lmdisn) { // mouse up was near atom but not lmdisn            
                    bi1 = getbpix(m,lmdisn,lmuisn);
                    if (bi1 >= 0) { // bond redrawn
                      newindex = lmuisn;
                      changeBondOrder(m,b,lmdisn, lmuisn, '+');
                    } else { // ring formed manually or molecules connected
                      // prevent stereo-inconsistency
                      if (((at === 3) && (m[lmuisn].z === -1)) || ((at === 4) && (m[lmuisn].z === 1))) {
                        drawMol(ctx,0,true);
                        resetDV();
                        return;
                      } else {
                        addBond(m,b,lmdisn, lmuisn, at + 1);
                        newindex = lmuisn;
                        if ((rxnarro.length > 0) && (m[lmdisn].t !== m[lmuisn].t)) { // bond joins two molecules
                          // delete any associated arrows
                          for (jj=0;jj<rxnarro.length;jj++) {
                            if (rxnarro[jj].stn.includes(m[lmdisn].t) || rxnarro[jj].stn.includes(m[lmuisn].t) || rxnarro[jj].etn.includes(m[lmdisn].t) || rxnarro[jj].etn.includes(m[lmuisn].t)) {
                              deleteRxnArrow(jj);
                              jj--;
                            }
                          }
                        }
                      }
                    }
                  } else if (lmuisn === lmdisn) {
                    drawMol(ctx,0,true);
                    resetDV();
                    return;            
                  }
                  drawMol(ctx,0,true);
                  saveState();
                  resetDV();
                  return;
                }
              } else {
                drawMol(ctx,0,true);
                resetDV();
                return;            
              }  
              drawMol(ctx,0,true);
              saveState();
              resetDV();
              break;    
            case 'provChainDraw':    
              addChain(oldnc, lmdx, lmdy, oldchdir, olddev);
              chainOnAtom = false;
              drawMol(ctx,0,true);
              saveState();
              resetDV();
              pDM="";
              break;
            case 'provMeshDraw':    
              addMesh(meshAt.length);
              meshOnAtom = false;
              meshAt.length = 0;
              drawMol(ctx,0,true);
              saveState();
              resetDV();
              pDM=""
              break;
            case 'provRingDraw':    
              if (((at > 4) && (at < 9)) || (at === 10)) { // saturated rings
                if (at === 10) {
                  if (nTSring > 0) {
                    nring = nTSring;
                  } else {
                    resetDV();
                    return;
                  }
                } else {
                  nring = at-2;
                }    
                dummy = drawProvRing(pdctx, nring, lmdisnb, "bond", vpg, "test");
                if (dummy === true) {
                  addRing(nring, lmdisnb, vpg, "bond");
                }
              } else if (at === 9) { // benzene
                dummy = drawProvRing(pdctx, 6, lmdisnb, "bond", vpg, "test");
                if (dummy === true) {
                  addRing(-6, lmdisnb, vpg, "bond");
                }
              }
              drawMol(ctx,0,true);
              saveState();
              resetDV();
              pDM="";
              break;
            case 'moveAtom':
              if ((lmmisn > 0) && (lmmisn !== lmdisn)) { // move of atom ends within crit of existing atom
                // prevent stereo-inconsistency
                if ((m[lmdisn].z !== 0) && (m[lmmisn].z !==0) && (m[lmmisn].z !== m[lmdisn].z)) { 
                  drawMol(ctx,0,true);
                  resetDV();
                  return;
                } else {
                  fuseAtoms(lmmisn, lmdisn);
                }
              } else {  
                m[lmdisn].x = lmmx;
                m[lmdisn].y = lmmy;
              }
              saveState();
              drawMol(ctx,0,true);
              resetDV();
              pDM="";
              break;            
            case 'moveBond':
              fax = m[b[lmdisnb].fra].x + lmux-lmdx;
              fay = m[b[lmdisnb].fra].y + lmuy-lmdy;
              tax = m[b[lmdisnb].toa].x + lmux-lmdx;
              tay = m[b[lmdisnb].toa].y + lmuy-lmdy;
              // check if one or both atoms end up within crit of existing atoms
              fisn = isnear(m,b,fax, fay);
              tisn = isnear(m,b,tax,tay);
              if (((fisn > 0) && (fisn !== b[lmdisnb].fra)) && ((tisn > 0) && (tisn !== b[lmdisnb].toa)) && (getbpix(m,fisn,tisn) >= 0)) { // both atoms near existing one
                fuseBonds(fisn,tisn,b[lmdisnb].fra,b[lmdisnb].toa);
              } else if ((fisn > 0) && (fisn !== b[lmdisnb].fra)) { // fra near existing one
                m[b[lmdisnb].toa].x = tax;
                m[b[lmdisnb].toa].y = tay;
                fuseAtoms(fisn,b[lmdisnb].fra);
              } else if ((tisn > 0) && (tisn !== b[lmdisnb].toa)) { // toa near existing one
                m[b[lmdisnb].fra].x = fax;
                m[b[lmdisnb].fra].y = fay;
                fuseAtoms(tisn,b[lmdisnb].toa);
              } else {
                m[b[lmdisnb].fra].x = fax;
                m[b[lmdisnb].fra].y = fay;
                m[b[lmdisnb].toa].x = tax;
                m[b[lmdisnb].toa].y = tay;
              }      
              saveState();
              drawMol(ctx,0,true);
              resetDV();
              pDM="";
              break;            
            case 'moveAllMol':
              for (i=0;i<m.length;i++) {
                m[i].x += lastx1;
                m[i].y += lasty1;
              }
              if (rxnarro.length > 0) {
                for (i=0;i<rxnarro.length;i++) {
                  rxnarro[i].sco.x += lastx1;
                  rxnarro[i].sco.y += lasty1;
                  rxnarro[i].eco.x += lastx1;
                  rxnarro[i].eco.y += lasty1;
                }
              }
              drawMol(ctx,0,true);
              saveState();
              resetDV();
              pDM="";
              break;
            case 'spanSelRect':
              const selrect = new Rect(Math.min(lmdx,lmux), Math.min(lmdy,lmuy), Math.abs(lmux-lmdx), Math.abs(lmuy-lmdy));
              let atinselrect = false;

              i=1;
              selAt=[];
              while ( i < m.length) {  
                if (inrect(selrect, m[i].x,m[i].y)) {
                  selAt.push(i);
                  atinselrect = true;
                }
                i++;
              }
              if (selAt.length===0) {
                clearIGC();
                resetDV();
                return;
              }
              if (!TSrxn) { // not in rxn mode. selection of single or multiple molecules 
                getTreesOfSelAt(selAt);                  
                if (selTrees.length===1) {
                  selectTree(selAt[0]);
                  selected=true;
                } else if (selTrees.length > 1) {
                  clearIGC();
                  for (i=0;i<selTrees.length;i++) {
                    markTree(selTrees[i],'','magenta',false,'t');
                  }
                  selected=true;
                }
                if ((TSerase) && ((selected) || (selTrees.length > 0))) { 
                  tselMols = selTrees.slice(0);
                  if ((rxnarro.length > 0) && (tselMols.length > 0)) { // BUGFIX 190420.1 check for rxn arrows involving selected tree(s)
                    for (i=0;i<tselMols.length;i++) { // BUGFIX 190420.1
                      for (jj=0;jj<rxnarro.length;jj++) { // BUGFIX 190420.1
                        if ((rxnarro[jj].stn.includes(tselMols[i])) || (rxnarro[jj].etn.includes(tselMols[i]))) { // BUGFIX 190420.1
                          deleteRxnArrow(jj); // BUGFIX 190420.1
                          jj--; // BUGFIX 190420.1
                        } // BUGFIX 190420.1
                      } // BUGFIX 190420.1
                      tselMols.splice(i,1);
                      i--;
                    } // BUGFIX 190420.1
                  } // BUGFIX 190420.1
                  for (i=1;i<m.length;i++) {
                    m[i].s=0;
                    if (selTrees.includes(m[i].t)) {
                      m[i].s=1;
                    }
                  }
                  deleteTree(1);
                  clearSelection();
                }          
                break;
              }
              if ((TSrxn) && (atinselrect)) { // reaction arrow
                if (selectWhat==='reactant') {
                  for (i=0;i<m.length;i++) { // reset selection property of all atoms to zero
                    m[i].s = 0;
                  }
                  selTrees = [];
                }
                ntr = getTreesOfSelAt(selAt);
                if (ntr > 0) { // at least one molecule selected
                  if (selectWhat === 'reactant') { // select trees are at the start of the arrow
                    igctx.clearRect(drect.l, drect.t,drect.w,drect.h);
                    reactantTrees = selTrees.slice(0);
                    selMultiTrees(reactantTrees,1); //sets all m[].s properties of atoms in the trees listed in reactantTrees to 1
                    rbr = getboundrect(m,1,'s');
                    igctx.clearRect(drect.l, drect.t,drect.w,drect.h);
                    if ((at-17) === 1) { // irreversible arrow
                      markTree(1,'reactant(s)','blue',true,'s');
                    } else { // other arrows
                      markTree(1,'arrow start','blue',true,'s');
                    }                  
                    selectWhat = 'product'; //trigger next step: selection of trees at the end of the arrow
                  } else if (selectWhat === 'product') {
                    if ((reactantTrees.length > 0) && (selTrees.length > reactantTrees.length)) {
                      productTrees = selTrees.slice(reactantTrees.length);
                      if (productTrees.length===0) {
                        abortRxnArw();
                        resetDV();
                        return;                      
                      }
                      selMultiTrees(productTrees,2);
                      pbr = getboundrect(m,2,'s');
                      igctx.clearRect(drect.l, drect.t,drect.w,drect.h);
                      if ((at-17) === 1) {
                        markTree(2,'reactant(s)','blue',true,'s');
                        markTree(2,'product(s)','green',true,'s');
                      } else {
                        markTree(2,'arrow start','blue',true,'s');
                        markTree(2,'arrow end','green',true,'s');
                      }                  
                      igctx.restore();
                      selectWhat = 'arrow';
                    } else {
                      abortRxnArw();
                      resetDV();
                      return;
                    }
                  } else {
                    abortRxnArw();
                    resetDV();
                    return;
                  }
                } else {
                  abortRxnArw();
                  resetDV();
                  return;
                }
                if ((selectWhat==='arrow') && (reactantTrees.length > 0) && (productTrees.length > 0)) {
                  igctx.clearRect(drect.l, drect.t,drect.w,drect.h);
                  rxnco = [];
                  calcNewRxnArwCoord(reactantTrees,productTrees,rbr,pbr);
                  if ((at-17) === 1) {
                    markTree(1,'reactant(s)','blue',true,'s');
                    markTree(2,'product(s)','green',true,'s');
                  } else {
                    markTree(1,'arrow start','blue',true,'s');
                    markTree(2,'arrow end','green',true,'s');
                  }
                  // create new Rxna{} und push it to rxnarro[]                  
                  rxnarro.push(new Rxna(reactantTrees,productTrees,(at-17),'','',rxnco[0],rxnco[1],rxnco[2],rxnco[3]));
                  // register the rxn arrow start and end trees in the atoms m[].rxs and .rxe properties
                  for (i=1;i<m.length;i++) {
                    if (m[i].s === 1) {
                      m[i].rxs.push(rxnarro.length-1);
                    }
                    if (m[i].s === 2) {
                      m[i].rxe.push(rxnarro.length-1);
                    }
                    // clear the selections
                    m[i].s=0;
                  }
                  i=rxnarro.length-1;
                  i=0;
                  selectWhat='reactant';
                  reactantTrees = [];
                  productTrees = [];
                  selTrees = [];
                  clearSelection();
                  clearIGC();
                  saveState();
                  drawMol(ctx,0,true);
                }
              } else if (TSrxn) {
                 abortRxnArw();
                 resetDV();
                 return;
              }
              if ((TSerase) && (atinselrect)) {
                deleteTree(1);
                clearSelection();
              }
              if (!atinselrect) {
                igctx.clearRect(drect.l, drect.t,drect.w,drect.h);
                abortRxnArw();
                resetDV();
                return;
              }
              pDM = "";
              break;
            case 'moveTree':
            case 'moveSelMol':
              selTrees=[];
              for (i=1;i<m.length;i++) {
                if (m[i].s === 1) {
                  // shift the coordinates of all atoms
                  m[i].x += lastx1;
                  m[i].y += lasty1;
                  if (! selTrees.includes(m[i].t)) {
                    selTrees.push(m[i].t); // collect the tree numbers of the selected molecule(s)
                  }
                }
              }
              if (rxnarro.length > 0) { // if there are any rxn arrows
                modRx = [];
                reactantTrees=[];
                productTrees=[];
                for (i=0;i<rxnarro.length;i++) { // collect the rxn arrows that are linked to the selected trees in modRx[]
                  reactantTrees = intersect(rxnarro[i].stn, selTrees);
                  productTrees = intersect(rxnarro[i].etn, selTrees);
                  if ((reactantTrees.length > 0) || (productTrees.length > 0)) { 
                    modRx.push(i); 
                  }
                }                
                if (modRx.length > 0) {
                  for (i=0;i<modRx.length;i++) {
                    reCalcRxnArwCoord(modRx[i]); // recalculate the coordinates of linked rxn arrows
                  }
                }
              }
              igctx.clearRect(drect.l, drect.t, drect.w, drect.h);
              drawMol(ctx,0,true);
              checkCollisions();
              clearSelection();
              saveState();
              reactantTrees = [];
              productTrees = [];
              selTrees = [];
              resetDV();
              pDM="";
              break;
            case 'copyTree':
            case 'copySelMol': 
            // WORKTODO: replace this section by addTree()
              mxo=[];
              mxc=[];
              iox = m.length;
              biox = b.length;
              for (i=0; i<iox;i++) { // copy the atoms
                if (m[i].s === 1) { // in the selection
                  ox = m.length;
                  deep_copyAtom(m,m,i,ox);
                  // remove association with rxn arrows
                  m[ox].rxs = [];
                  m[ox].rxe = [];
                  // the new atom still contains the old bonding partners in its bpa[].p values
                  mxo.push(i); // parallel arrays of indices in m[] of original 
                  mxc.push(ox); // and copy
                  m[ox].x = m[i].x + lastx1; // coordinate shift
                  m[ox].y = m[i].y + lasty1;
                }
              }

              for (i=0; i<iox;i++) { // for all original atoms
                if (m[i].s === 1) { // in the selection
                  jj= -1;
                  k = -1;                
                  for (p=0;p<m[i].bpa.length;p++) { // go through all bonding partners and translate their indices
                    obp = m[i].bpa[p].p;
                    jj =  mxo.indexOf(obp); //translate the index of the old bp
                    k =  mxo.indexOf(i); // translate the index of the central atom
                    if ((jj > -1) && (k > -1)) {
                      nbp = mxc[jj];                  
                      m[mxc[k]].bpa[p].p = nbp;
                    }                  
                  }
                  jj= -1;
                  k = -1;
                  for (p=0; p<biox;p++) { // go through all original bonds
                    if (b[p].fra === i) { // look for bonds with selected m[i] as fra
                      box = b.length; // append copy of bond to end of b[]
                      deep_copyBond(b,b,p,box); // type of bond is copied as well here
                      k =  mxo.indexOf(i); // translate the index of the central atom
                      b[box].fra = mxc[k]; // fra is the copied atom itself
                      jj =  mxo.indexOf(b[p].toa);
                      if ((jj > -1) && (k > -1)) { 
                        b[box].toa = mxc[jj]; //translate the index of toa
                      }
                    }
                  }
                }
              
              }
            
              igctx.clearRect(drect.l, drect.t, drect.w, drect.h);
              pDM="";
              resetDV();
              drawMol(ctx,0,true);
              checkCollisions();
              clearSelection();
              saveState();
              break;
            case 'rotateTree':
              // check whether molecule will be within arect
            
              rotby = norma(180*Math.atan2(lmux-cex,cey-lmuy)/Math.PI);
              for (i = 1;i<m.length;i++) {
                if (m[i].s === 1) { // only for atoms in tree 1
                // calculate rotated coordinates
                  dega = norma(180*Math.atan2(m[i].x - cex, cey - m[i].y)/Math.PI);
                  vl = Math.sqrt((m[i].x-cex)*(m[i].x-cex) + (m[i].y-cey)*(m[i].y-cey));
                  dx = vl*Math.sin(Math.PI*norma(dega + rotby)/180);
                  dy = -vl*Math.cos(Math.PI*norma(dega + rotby)/180);
                  m[i].x = cex + dx;
                  m[i].y = cey + dy;
                }
              }
              igctx.clearRect(drect.l, drect.t, drect.w, drect.h);
              // check whether molecule is within arect
              tbr = getboundrect(m,1,'s');
              if(!(rectInRect(tbr, arect))) {
                undo();
              }
              for (jj=1;jj<m.length;jj++) {
                if (m[jj].s===1) {
                  sort_abop_by_dir(m,jj);
                }
              }            
              drawMol(ctx,0,true);
              saveState();
              resetDV();
              pDM="";
              clearSelection();
              break;
            case 'provArrowDraw':
              targ = isnear(m,b,lmux, lmuy);
              src = isnear(m,b,lmdx,lmdy);
              if ((src !== 0) && (targ !== 0) && (src !== targ)) {
              // no curved arrows starting or ending at residues or bond to residue //BF210505.3 starts
               if ((((src > 0) && (targ > 0)) && (residues.includes(m[targ].el) || residues.includes(m[src].el)))
                  || ((src < 0) && (residues.includes(m[b[Math.abs(src)].fra].el) || residues.includes(m[b[Math.abs(src)].toa].el)))
                  || ((targ < 0) && (residues.includes(m[b[Math.abs(targ)].fra].el) || residues.includes(m[b[Math.abs(targ)].toa].el)))) { //BF210505.3
                  clearIGC();
                  clearSelection(); //BF210505.3 ends
                } else {
                  tmpArrow = new Arrow(src,targ,'',0);
                  tmpArrow.ty = (at===16)? 'f' : 'h' ;
                  tmpArrow.crv = lastcurv;
                  arro.push(tmpArrow);
                  saveState();
                }
              }              
              drawMol(ctx,0,true);
              resetDV();
              pDM="";
              break;
            default:
              clearIGC();
              clearSelection();
          } // end of switch
          resetDV();
        } // end of case mdraw    
      } // end of if inrect(arect,lmux,lmuy)
      
      // functions inside mouseUp()
      
      function abortRxnArw() {
        selectWhat='reactant';
        reactantTrees = [];
        productTrees = [];
        selTrees = [];
        clearSelection();
        clearIGC();
        resetDV();
        pDM='';
      }

       
    } // end of mouseUp()
  
    // reset all drawing variables
      function resetDV() {    // mouse up always completes action, reset drawing variables
      can.style.cursor = 'default';
      markactive("erase");
      markactive("mark");
      provBondsToPartners = false;
      provBondWithPartners = false;
      provBond = false;
      chainDrawn = false;
      meshDrawn = false;
      meshOnAtom = false;
      provArrow = false;
      click = false;
      clickOnAtom = false;
      clickOnBond = false;
      clickOnArrow = false;
      clickOnRxnArrow = false;
      curv = 0;
      lastcurv = 0;
      mmoved = false;
      mdraw = false;
      mouseisdown = false;
      hlArw = -1;
      hlAt = 0;
      hlBo = 0;
      lmmisn = 0;
      lmmisna = -1;
      lmdisn = 0;
      lmdisnb = 0;
      lmuisn = 0;
      lmmisnb = 0;
      lmuisna = -1;
      lmuisnb = 0;
      lastx1 = 0;
      lasty1 = 0;
      cex = 0;
      cey = 0;
      vpg = 1;

    } //called after each mouseUp           

  // END MOUSE EVENT HANDLERS---------------------------------------------
      
  //END OF EVENT HANDLERS

  // SELECTION
      function selectTree(anchor) {
      getTree(anchor);
      gb = getboundrect(m,1,'s');
      if (inrect(drect,gb.l,gb.t-rhR-2) && (inrect(drect,gb.l+gb.w, gb.t+gb.h))) {
          drawMol(igctx,1,false);
          igctx.save();
          igctx.linewidth = "1";
          igctx.strokeRect(gb.l, gb.t, gb.w, gb.h);
          cex = gb.l + gb.w/2;
          cey = gb.t + gb.h/2;
          igctx.lineWidth = (pad)? 2: 1;
          igctx.strokeStyle = 'magenta';
          igctx.fillStyle = 'magenta';
          igctx.beginPath(); // the central circular mark
          igctx.arc(cex, cey, 4, 0, Math.PI * 2);
          igctx.stroke();
          igctx.beginPath();
          igctx.arc(cex, cey, 2, 0, Math.PI * 2);
          igctx.fill();
          igctx.lineWidth = '1';
          igctx.beginPath(); // the rotation sign sign top
          igctx.moveTo(gb.l+gb.w/2-rhR-4,gb.t-rhR-2);
          igctx.lineTo(gb.l+gb.w/2-rhR+2,gb.t-rhR+6);
          igctx.lineTo(gb.l+gb.w/2-rhR+4,gb.t-rhR-4);
          igctx.closePath();
          igctx.fill();
          igctx.beginPath();
          igctx.moveTo(gb.l+gb.w/2+rhR-4,gb.t-rhR-4);
          igctx.lineTo(gb.l+gb.w/2+rhR-2,gb.t-rhR+6);
          igctx.lineTo(gb.l+gb.w/2+rhR+4,gb.t-rhR-2);
          igctx.closePath();
          igctx.fill();
          igctx.beginPath();
          igctx.arc(cex, gb.t-rhR, rhR, 0, Math.PI * 2); 
          igctx.stroke();
          igctx.beginPath(); // the vertical 180° 3D rotation sign on the bottom
          igctx.moveTo(gb.l+gb.w/2,gb.t+gb.h);
          igctx.lineTo(gb.l+gb.w/2,gb.t+gb.h+30);
          igctx.stroke();
          igctx.beginPath();
          igctx.moveTo(gb.l+gb.w/2-20,gb.t+gb.h+15);
          igctx.bezierCurveTo(gb.l+gb.w/2-20,gb.t+gb.h+5,gb.l+gb.w/2+20,gb.t+gb.h+5,gb.l+gb.w/2+20,gb.t+gb.h+15);
          igctx.bezierCurveTo(gb.l+gb.w/2+20,gb.t+gb.h+25,gb.l+gb.w/2-20,gb.t+gb.h+25,gb.l+gb.w/2-20,gb.t+gb.h+15);
          igctx.stroke();
          igctx.beginPath();
          igctx.moveTo(gb.l+gb.w/2+20,gb.t+gb.h+16);
          igctx.lineTo(gb.l+gb.w/2+16,gb.t+gb.h+24);
          igctx.lineTo(gb.l+gb.w/2+12,gb.t+gb.h+16);
          igctx.closePath();
          igctx.fill();
          igctx.beginPath();
          igctx.strokeStyle = 'white';
          igctx.lineWidth = '3';
          igctx.moveTo(gb.l+gb.w/2,gb.t+gb.h+15);
          igctx.lineTo(gb.l+gb.w/2,gb.t+gb.h+22);
          igctx.stroke();
          igctx.fillStyle = 'magenta';        
          igctx.font = "10px Arial";
          igctx.fillText("180°",gb.l+gb.w/2-10,gb.t+gb.h+38);
          igctx.beginPath(); // the vertical 180° 3D rotation sign on the bottom
          igctx.moveTo(gb.l+gb.w,gb.t+gb.h/2);
          igctx.lineTo(gb.l+gb.w+30,gb.t+gb.h/2);
          igctx.strokeStyle = 'magenta';
          igctx.lineWidth = '1';
          igctx.stroke();
          igctx.beginPath();
          igctx.moveTo(gb.l+gb.w+15,gb.t+gb.h/2-20);
          igctx.bezierCurveTo(gb.l+gb.w+5,gb.t+gb.h/2-20,gb.l+gb.w+5,gb.t+gb.h/2+20,gb.l+gb.w+15,gb.t+gb.h/2+20);
          igctx.bezierCurveTo(gb.l+gb.w+25,gb.t+gb.h/2+20,gb.l+gb.w+25,gb.t+gb.h/2-20,gb.l+gb.w+15,gb.t+gb.h/2-20);
          igctx.stroke();
          igctx.beginPath();
          igctx.moveTo(gb.l+gb.w+16,gb.t+gb.h/2+20); // arrow
          igctx.lineTo(gb.l+gb.w+24,gb.t+gb.h/2+16);
          igctx.lineTo(gb.l+gb.w+16,gb.t+gb.h/2+12);
          igctx.closePath();
          igctx.fill();
          igctx.beginPath();
          igctx.strokeStyle = 'white';
          igctx.lineWidth = '3';
          igctx.moveTo(gb.l+gb.w+15,gb.t+gb.h/2);
          igctx.lineTo(gb.l+gb.w+22,gb.t+gb.h/2);
          igctx.stroke();
          igctx.fillStyle = 'magenta';        
          igctx.font = "10px Arial";
          igctx.fillText("180°",gb.l+gb.w+32,gb.t+gb.h/2+3);
          igctx.restore();
          selected = true;
      } else {
          igctx.clearRect(drect.l,drect.t,drect.w,drect.h);
      }
    } // select tree containing anchor atom, draw selection rectangle
  
      function clearSelection() {
      let i;
    
      for (i=0;i<m.length;i++) {
        m[i].s = 0;
      }
      selTrees=[];
      selAt = [];
      selected = false;
    } // clear selection


  // TEMPORARY/PROVISIONAL DRAWING WHILE MOVING THE MOUSE
      function drawProvBond(cox,x1,y1,x2,y2, mode) {

        if (mode === "erase") {
          clearDA(cox);
          return;
        }
      
        cox.save();
        cox.strokeStyle = 'magenta';
        cox.lineWidth = stdlw;
      
        if (inrect(drect,x2,y2)) { // clip to drawing area
          cox.beginPath();
          cox.moveTo(x1,y1);
          cox.lineTo(x2,y2);
          cox.stroke();
        }
        cox.restore();
      }
    
      function drawProvBondsToPartners(cox, a1, lx, ly, mode) { // lx, ly are the last coord
        let bpx, bpy, bp, lw, ss, bt; 
        let i=0;

        if (mode === "erase") {
          clearDA(pdctx);
          return;
        }      
        ss = 'magenta';
        lw = stdlw;

        i=0;
        while (i < m[a1].bpa.length) {
          bp = m[a1].bpa[i].p;
          bt = m[a1].bpa[i].t;
          bpx = m[bp].x;
          bpy = m[bp].y;
          drawBond(cox, bpx, bpy, lx, ly, bt, lw, ss); //es
          i++;  
        }
      }
      
      function drawProvBondWithPartners(cox, bx, dmmx, dmmy, mode) { // provisional draw during bond move
        let fa, ta, bpx, bpy, bp, lw, ss, bt, nfa, nta; 
        let i=0;

        if (mode === "erase") {
          clearDA(cox);
          return;
        }      
        ss = 'magenta';
        lw = stdlw;

        fa = b[bx].fra;
        ta = b[bx].toa;
      
        drawBond(cox,m[fa].x+dmmx, m[fa].y+dmmy, m[ta].x+dmmx, m[ta].y+dmmy, b[bx].btyp, lw, ss); //es
        nfa=0;
        nfa = isnear(m,b,m[fa].x+dmmx, m[fa].y+dmmy);
        nta=0;
        nta = isnear(m,b,m[ta].x+dmmx, m[ta].y+dmmy);
        if ((nfa > 0) && (nfa !== fa) && (nfa !== ta) && (nta === 0)) { // one end of moving bond is near existing atom
          drawAtomHighlighted(m[nfa].x,m[nfa].y);
          hlAt = nfa;
        } else if ((nta > 0) && (nta !== ta) && (nta !== fa) && (nfa === 0)) { // one end of moving bond is near existing atom
          drawAtomHighlighted(m[nta].x,m[nta].y);
          hlAt = nta;
        } else if ((nta > 0) && (nfa > 0) && (nfa !== fa) && (nta !== ta)) { // both ends of moving bond are near existing atoms
          drawAtomHighlighted(m[nta].x,m[nta].y);
          drawAtomHighlighted(m[nfa].x,m[nfa].y);
        } else if ((nfa===0) && (nta===0) && (hlAt > 0)) {
          hlAt = 0;
          clearIGC();
        }
        i=0;
        while (i < m[fa].bpa.length) {
          if (m[fa].bpa[i].p !== ta) {
            bp = m[fa].bpa[i].p;
            bt = m[fa].bpa[i].t;
            bpx = m[bp].x;
            bpy = m[bp].y;
            drawBond(cox,bpx, bpy, m[fa].x+dmmx, m[fa].y+dmmy,bt, lw, ss); //es           
          }
          i++;
        }
        i=0;
        while (i < m[ta].bpa.length) {
          if (m[ta].bpa[i].p !== fa) {
            bp = m[ta].bpa[i].p;
            bt = m[ta].bpa[i].t;
            bpx = m[bp].x;
            bpy = m[bp].y;
            drawBond(cox,bpx, bpy, m[ta].x+dmmx, m[ta].y+dmmy,bt, lw, ss); //BF200222.2 9th argument removed
          }
          i++;  
        }
      }
                  
      function drawProvRing(cox, n, indx, mode, side, drawmode) { // n is the number of vertices. 
      // mode: "atom" => existing atom becomes a member of the ring
      //       "bond" => the two existing atoms of the bond become one of the ring's bonds
      //    "freespace" => the ring is drawn in free space 
        let i, cx, cy, dx, dy, bp, bpx, bpy, angdeg1, deltadeg, inideg, newangdeg; 
        let benz = false;
        let nit, firstat, lastat;
        let lw, ss;
        let ccw = true;
        let result = true;
        const rxof = [0, 0, 0, -0.5*bondlength, -0.5*bondlength, -0.5*bondlength, 0,0,0,0,0,0,0];
        const ryof = [0,0,0,-0.28868*bondlength, 0.5*bondlength,-0.80902*bondlength, bondlength,0,0,0,0,0,0];

        ccw = (side > 0) ? true : false;
      
        if (drawmode === "erase" ) { lw=stdlw+2; ss='white';}  else if (drawmode === "draw") { lw = stdlw; ss='magenta';}
        if ((m.length > 1) && (mode === "atom") && (indx != lmuisn))  {return;}  
        if (n  < 0) { benz = true; benzene = true; n = Math.abs(n); }

        nit = n;
        if (mode === "bond") { nit = n-1; }
        deltadeg = 360/n;
        inideg = (180 - deltadeg)/2;
        angdeg1 = Math.pow(-1,n)*inideg;
        if (n === 6) { angdeg1 = 90; }
      
              
    // atom mode, indx is the index of the atom in the m[] array
        if ((mode === "freespace") && (drawmode === "test")) {
            cx = lmdx + rxof[n];
            cy = lmdy + ryof[n]; // start at coordinates of last mousedown
        }        
        if (mode === "atom") {
          if ((indx > 0) && (m.length === 2)) { // one atom present but no Bond
            cx = m[indx].x;
            cy = m[indx].y; // the indx becomes a vertex
          } else if ((indx > 0) && (m[indx].bpa.length === 1)) { // one bond to indx
            cx = m[indx].x;
            cy = m[indx].y; // the indx becomes a vertex
            bp = m[indx].bpa[0].p;
            bpx = m[bp].x;
            bpy = m[bp].y;
            angdeg1 = getdirangle(bpx, bpy, cx, cy); // seen towards indx
          } else if ((indx > 0) && (m[indx].bpa.length === 2) && (benz === false)) { // two bonds: spiro ring
            cx = m[indx].x;
            cy = m[indx].y; // the indx becomes a vertex
            angdeg1 = getPrefBisect(m,indx);          
          } else { return;}
          firstat = indx;
          lastat = indx;
        } // end atom mode        
    // bond mode, indx is the index of the bond in b[]                
        if ((mode === "bond") && (b[indx].btyp > 0)) {
          firstat = b[indx].fra;
          lastat = b[indx].toa;            
          cx = m[firstat].x;
          cy = m[firstat].y;
          bpx = m[lastat].x;
          bpy = m[lastat].y;
          angdeg1 = getdiranglefromAt(m,firstat, lastat); // bond direction firstat->lastat (fra->toa)  normed.      
          inideg= 180 - 360/n; // always > 0 since n>2
          if ( !ccw ) {
            inideg = (-1)*inideg;
            deltadeg = (-1)*deltadeg;
          }
        } // end bond mode
        // draw all the bonds iteratively        
        newangdeg = norma(angdeg1 - inideg);
        oldx = cx;
        oldy = cy;
        if (!(drawmode === "test")) {
          cox.save();
          cox.lineWidth = lw;
          cox.strokeStyle = ss;
          cox.beginPath();
          cox.moveTo(oldx,oldy);
        }
        for (i = 0; i<nit-1;i++) { // over all bonds of the ring
          dx = bondlength * Math.cos(Math.PI * newangdeg/180);
          dy = bondlength * (-1)*Math.sin(Math.PI * newangdeg/180);
          newx = cx + dx;
          newy = cy + dy;
          if (drawmode === "test") {
            result = inrect(arect,newx, newy); // the actual test in test mode
            if (result === false) {  // the first failure triggers return with false
              ccw = true;
              benzene = false;
              return result;
            }
          } else {
            cox.lineTo(newx, newy);
          }
          newangdeg = norma(newangdeg + deltadeg);
          cx = newx;
          cy = newy;
          oldx = newx;
          oldy = newy
        }
        if (!(drawmode === "test")) {
          cox.lineTo(m[lastat].x, m[lastat].y);
          cox.stroke();        
          cox.restore();
        }
        ccw = true;
        benzene = false;
        return result;

      }
    
      function drawProvMesh(conx, x1,y1,x2,y2,nmbr,mode) {
        let cv, latstr, labdir, cvrad;

        conx.save();
        if (mode === "draw") {
          conx.lineWidth = stdlw;
          conx.strokeStyle='black';
          conx.fillStyle = 'black';

        } else if (mode === "erase") {
          conx.lineWidth = stdlw+2;
          conx.strokeStyle='white';
          conx.fillStyle = 'white';
        } else if (mode === "prov") {
          conx.lineWidth = stdlw;
          conx.strokeStyle='magenta';
          conx.fillStyle = 'magenta';
        }
  
        conx.beginPath();
        conx.moveTo(x1,y1);
        conx.lineTo(x2,y2);
        conx.stroke();

        if(nmbr) {
          latstr = (meshOnAtom)? String(meshAt.length-1) : String(meshAt.length);
          labdir= getPrefDirForMeshAt(meshAt.length-1, x2, y2);
          cvrad = (latstr.length === 2) ? 2*charH : 1.5*charH;
          cv = calcCstrOffsetVector(cvrad,labdir);
          conx.font = '12pt Calibri';
          if (mode === "erase") { 
            conx.strokeText(latstr, lastsx, lastsy);
          } else if (mode === "prov") {
            conx.fillText(latstr, x1+cv.x-charW*latstr.length/2, y1+cv.y+charH/2);
            lastsx = x1+cv.x-charW*latstr.length/2;
            lastsy =  y1+cv.y+charH/2;
          }
        }

        conx.restore();
      }

      function drawProvChain(conx, n, sx, sy, inidir, devi, nmbr, mode) {

        let dx, dy, stx, sty, cox, nt =0, iter=0;

    
        iter = ((nt % 2) === 0) ? 1 : -1;
        dx = bondlength*Math.cos(Math.PI*norma(inidir + iter*devi*30)/180);
        dy = -bondlength*Math.sin(Math.PI*norma(inidir + iter*devi*30)/180);

        stx = sx;
        sty = sy;

        conx.save();
        if (mode === "draw") {
          conx.lineWidth = stdlw;
          conx.strokeStyle='magenta';
          conx.fillStyle = 'magenta';

        } else if (mode === "erase") {
          conx.lineWidth = stdlw+2;
          conx.strokeStyle='white';
          conx.fillStyle = 'white';
        }

    
        conx.beginPath();
        conx.moveTo(stx, sty);
        for (nt = 0; nt<n;nt++) {
          conx.lineTo(stx,sty);
          iter = ((nt % 2) === 0) ? 1 : -1;
          dx = bondlength*Math.cos(Math.PI*norma(inidir + iter*devi*30)/180);
          dy = -bondlength*Math.sin(Math.PI*norma(inidir + iter*devi*30)/180);
          stx += dx;
          sty += dy;
        }
        conx.stroke();

        if (nmbr) {            
          if (dx < 0) {cox = -8;} else {cox = 4;}
          if (lmdisn > 0) { nt = n-1; } else { nt = n; }
          conx.font = '12pt Calibri';
          if (mode === "erase") { conx.strokeText(nt, stx-dx+cox, sty-dy);}
          conx.fillText(nt, stx-dx+cox, sty-dy);
        }
        conx.restore();
      }
      
      function drawProvArrow(conx,x1,y1,x2,y2,curve,mode) {
        //params: conx context of provisional drawing canvas pdc
        //        x1,y1: coord of starting atom or bond
        //        x2,y2: coord of current mouse position
        //        curve: right (-1) or left (+1) side of direct connection (determined by first mouse move)
        //        mode: 'draw' or 'erase'
        let pc1x, pc1y, pc2x, pc2y; //the points controlling the shape of the bezier curve
        let deltax, deltay, rat, adir, bdir, di;
        adir = getdirangle(x1,y1,x2,y2);
        bdir = norma(adir-curve*90);
        
        di = Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
        rat = 0.5;
        
        deltax = (-1)*curve*rat*di*Math.sin(Math.PI*adir/180);
        deltay = (-1)*curve*rat*di*Math.cos(Math.PI*adir/180);
        
        pc1x = x1+deltax;
        pc1y = y1+deltay;
        pc2x = x2+deltax;
        pc2y = y2+deltay;

        conx.save();
        if (mode === 'draw') {
          conx.lineWidth = stdlw;
          conx.strokeStyle='magenta';
          conx.fillStyle = 'magenta';

        } else if (mode === 'erase') {
          conx.lineWidth = stdlw+2;
          conx.strokeStyle='white';
          conx.fillStyle = 'white';
        }
        conx.beginPath();
        conx.moveTo(x1, y1);
        conx.bezierCurveTo(pc1x,pc1y,pc2x,pc2y, x2, y2);
        conx.stroke();
        conx.beginPath();
        conx.moveTo(x2, y2);
        conx.lineTo(x2-8*Math.cos(Math.PI*norma(bdir-curv*30)/180), y2+8*Math.sin(Math.PI*norma(bdir-curv*30)/180));
        if (at===16) {
          conx.moveTo(x2, y2);
          conx.lineTo(x2-8*Math.cos(Math.PI*norma(bdir+curv*45)/180), y2+8*Math.sin(Math.PI*norma(bdir+curv*45)/180));
        }
        conx.stroke();
        
        conx.restore();
      
      } // provisional draw of arrow from starting atom/bond to current mouse position

      function getPrefDirForMeshAt(mix,newx,newy) {
        let d1=0, d2=0;
      
        if ((meshAt.length > mix) && (mix > 0)) { // test that there is a meshAt below mix
          d1 = getdirangle(meshAt[mix].x,meshAt[mix].y,meshAt[mix-1].x,meshAt[mix-1].y);
          d2 = getdirangle(meshAt[mix].x,meshAt[mix].y,newx,newy)
          return norma(getbisectorfromDir(d1, d2) + 180);
        } else if ((meshAt.length === 1) && (mix === 0)) { // one atom in mesh and it is mix
          return 270; // label below atom
        } else {
          return -1;
        }
      } // returns the preferred direction for number label on mesh
      

  // FUNCTIONS GETTING OR SETTING SOME VALUES

      function getTree(anchor) {
        let i, start, tl;
      
        for (i=0;i<m.length;i++) { // reset selection number of all atoms to zero      
          m[i].s = 0;
        }
        visnodesDFS = [];
        start = anchor;
        tl = dfs(m,start);
        for (i=0; i<tl;i++) {
          m[visnodesDFS[i]].s = 1;
        }
      } // selects a tree starting at anchor (atom or bond), uses dfs() sets property  m[].s = 1 for all atoms in tree

       
      function getTreesOfSelAt(selatar) {
        //param: selatar: array of indices in m[] of selected atoms
        let i=0;
        for (i=0;i<selatar.length;i++) {
          if (!selTrees.includes(m[selatar[i]].t)) {
            selTrees.push(m[selatar[i]].t);
          }
        }
        return selTrees.length;
      } // fills selTrees[] with tree numbers of atoms listed in selatar[] array
                
      function markTree(tn,txt,col,dash,prop) {
        // param: tn is tree number (m[].s or m[].t depending on prop 's' or 't')
        igctx.save();
        gb = getboundrect(m,tn,prop);
        igctx.strokeStyle = col;
        if (dash) {
          igctx.setLineDash([2,3]);
        }
        igctx.strokeRect(gb.l,gb.t,gb.w,gb.h);
        igctx.fillStyle = col;
        igctx.fillText(txt,gb.l,gb.t-2);
        igctx.restore();
      }

      function markMolgrps(col) {
        // param: col: color
        let i=0;
        let txt='';
        
        if (molgrp_brects.length === 0) { return -1; }
        clearIGC();
        while (i < molgrp_brects.length) {
          txt = String(i);
          igctx.save();
          igctx.strokeStyle = col;
//          igctx.setLineDash([2,3]);
          igctx.strokeRect(molgrp_brects[i].l,molgrp_brects[i].t,molgrp_brects[i].w,molgrp_brects[i].h);
          igctx.fillStyle = col;
          igctx.font = "14px sans-serif";
          igctx.fillText(txt,molgrp_brects[i].l+molgrp_brects[i].w-charW,molgrp_brects[i].t-4);
          igctx.restore();
          i++;
        }
      }
      
      function mark_molgr_ellipses(col) {
        let i=0;
        let phi=0;
        let r=0;
        let a;
        let b;
        let mcx=0;
        let mcy=0;
        
        if (molgrp_brects.length===0) { return -1;}
        igctx.save();
        igctx.setLineDash([2,3]);
        for (i=0;i<molgrp_brects.length;i++) {
          a=molgrp_brects[i].w/1.6;
          b=molgrp_brects[i].h/1.6;
          phi=0;
          mcx=molgrp_brects[i].l+molgrp_brects[i].w/2;
          mcy=molgrp_brects[i].t+molgrp_brects[i].h/2;
          phi=0;
          r=a*b/(Math.sqrt(a*a*Math.sin(Math.PI*phi/180)*Math.sin(Math.PI*phi/180)+b*b*Math.cos(Math.PI*phi/180)*Math.cos(Math.PI*phi/180)));
          igctx.beginPath();
          igctx.strokeStyle=col;
          igctx.moveTo(mcx+r*Math.cos(Math.PI*phi/180),mcy-r*Math.sin(Math.PI*phi/180));
          for (phi=5;phi<=360;phi=phi+5) {
            r=a*b/(Math.sqrt(a*a*Math.sin(Math.PI*phi/180)*Math.sin(Math.PI*phi/180)+b*b*Math.cos(Math.PI*phi/180)*Math.cos(Math.PI*phi/180)));
            igctx.lineTo(mcx+r*Math.cos(Math.PI*phi/180),mcy-r*Math.sin(Math.PI*phi/180));
          }
          igctx.stroke();
        }
        igctx.restore();
      }
      
  //GEOMETRIC TRANSFORMS
      function scale2D(mar,selector,cex,cey,factor,reset) {
        let i=0;
        for (i=1;i<mar.length;i++) {
          if ((selector === -1) || (mar[i].s === selector)) {
            mar[i].x = cex + (mar[i].x - cex)*factor;
            mar[i].y = cey + (mar[i].y - cey)*factor;
          }
          if (reset) {
            mar[i].s = 0;
          }
        }
      } // scales coordinates of a selected tree by a factor

      function scaleRxnArrows(rxa,cex,cey,factor) {
        let i=0;
        if (rxa.length === 0) { return -1; }
        for (i=0;i<rxa.length;i++) { // for all rxn arrows 
          rxa[i].sco.x = cex + (rxa[i].sco.x-cex)*factor;
          rxa[i].sco.y = cey + (rxa[i].sco.y-cey)*factor;
          rxa[i].eco.x = cex + (rxa[i].eco.x-cex)*factor;
          rxa[i].eco.y = cey + (rxa[i].eco.y-cey)*factor;
        }
      }

      function scaleRectArray(rctar,cex,cey,factor) {
        let i=0;
        if (rctar.length === 0) { return -1; }
        for (i=0;i<rctar.length;i++) {
          rctar[i].l = cex + (rctar[i].l-cex)*factor;
          rctar[i].t = cey + (rctar[i].t-cey)*factor;
          rctar[i].w = (rctar[i].w)*factor;
          rctar[i].h = (rctar[i].h)*factor;
        }
      }

      function getTxt(who) {
        let headertxt = "";
        removeListeners();
        getTxtcaller = who;
        if (who === 'x') {
          headertxt = 'Enter Element Symbol:';
        } else if (who === 'n') { 
          headertxt = 'Number of Atoms in ring:';
        }
        document.getElementById('xheader').innerHTML = headertxt;
        xbox.style.visibility="visible";
        xbox.addEventListener('click', e => { 
          e.preventDefault();
        },false);
        xbox.addEventListener('mouseup', e => { 
          e.preventDefault();
        },false);
        xboxTxt.focus();
        xboxTxt.value = "";
        xboxOK.addEventListener('click', e => {
          const xe = xboxTxt.value;
          e.preventDefault();
          if (getTxtcaller === 'x') {
            setXelement(xe);

          } else if (getTxtcaller === 'n') {
              setNumRing(xe);
          }
          xboxTxt.value = "";
          xboxTxt.blur();
          addListeners();
          xbox.style.visibility="hidden";  
        },false);
        xbox.addEventListener('keypress', e => { // return should work also for close
          if (e.which === 13) {
          const xe = xboxTxt.value;
            e.preventDefault();
            if (getTxtcaller === 'x') {
              setXelement(xe);
            } else if (getTxtcaller === 'n') {
              setNumRing(xe);
            }
            xboxTxt.value = "";
            xboxTxt.blur();
            addListeners();
            xbox.style.visibility="hidden";
          }                 
        }, false);
      }  //display text input box for X-element or ring-size
      
      function getAtxt(rxn) {
        removeListeners();
        abox.style.visibility="visible";
        aboxAtxt.value = (rxnarro[rxn].aa === undefined)? '' : rxnarro[rxn].aa;
        aboxBtxt.value = (rxnarro[rxn].ab === undefined)? '' : rxnarro[rxn].ab;
        aboxAtxt.focus();
        abox.addEventListener('click', e => { 
          e.preventDefault();
        },false);
        abox.addEventListener('mouseup', e => { 
          e.preventDefault();
        },false);
        aboxOK.addEventListener('click', function aboxclick(e) {
          const rtxt = aboxAtxt.value+'|'+aboxBtxt.value;
          setAnnotation(rxn,rtxt);
          e.preventDefault();
          aboxAtxt.blur();
          aboxBtxt.blur();
          aboxOK.removeEventListener('click',aboxclick,false);
          addListeners();
          abox.style.visibility="hidden";
          saveState();
          resetDV();
          drawMol(ctx,0,true);
        },false);
        abox.addEventListener('keypress', function aboxret(e) { // return should work also for close
          if (e.which === 13) {
            const rtxt = aboxAtxt.value+'|'+aboxBtxt.value;
            setAnnotation(rxn,rtxt);
            e.preventDefault();
            aboxAtxt.blur();
            aboxBtxt.blur();
            abox.removeEventListener('keypress',aboxret,false);
            addListeners();
            abox.style.visibility="hidden";
            saveState();
            resetDV();
            drawMol(ctx,0,true);
          } 
        },false);
      }  //display text input box for reaction annotations
     
      function setAnnotation(rxix,anno) {
        let atxt='';
        let btxt='';
        let annar = [];
        
        annar = anno.split('|');
        atxt = annar[0];
        btxt = annar[1];
        rxnarro[rxix].aa = (atxt)? atxt.trim() : '';
        rxnarro[rxix].ab = (btxt)? btxt.trim() : '';
      }
      
      function smile() {
        let i;
      
        if (m.length > 1) {
          getsmiles();
          if (warnAtoms.length === 0) {
            smilesDisplay(smiles);
            showatnum = false;
            drawMol(ctx,0,true);
          } else {    
            drawMol(ctx,0,true);
            for (i=0;i<warnAtoms.length;i++) {
              drawAtomWarning(igctx,m_s,warnAtoms[i]);
            }
            alert("WARNING:\nThe drawing of one or more stereogenic centres\nis ambiguous or inconsistent!\n\nCorrect the stereo-drawing of the centers marked by red squares and try again.\n\nThe red squares disappear with the next drawing action");
            warnAtoms=[];
          }
        } else {
          alert("No atoms yet, empty SMILES code!");
        }      

       function smilesDisplay(smilesstring) {

          removeListeners();
          sboxTxt.rows = String(Math.floor(smilesstring.length/sboxTxt.cols)+2);
          sboxTxt.value = smilesstring;
          sbox.style.visibility="visible";
          sboxVis = true;
          sbox.addEventListener('click', e => { 
              e.preventDefault();
              sboxTxt.select();
              sboxTxt.selectionStart=0;
              sboxTxt.selectionEnd=sboxTxt.value.length;
          },false);
          sbox.addEventListener('mouseup', e => { 
              e.preventDefault();
          },false);
          sboxTxt.addEventListener('onfocus', e => { 
            e.preventDefault();
            sboxTxt.select();
            sboxTxt.selectionStart=0;
            sboxTxt.selectionEnd=sboxTxt.value.length;
          },false);
          sboxTxt.focus();
          sboxTxt.selectionStart=0;
          sboxTxt.selectionEnd=sboxTxt.value.length;
          sboxOK.addEventListener('click', () => {
              addListeners();
              sbox.style.visibility="hidden";    
              sboxVis = false;                 
          },false);
          sbox.addEventListener('keypress', e => { // return should work also for close
              if (e.which === 13) {
            sboxTxt.selectionStart=0;
            sboxTxt.selectionEnd=0;
            sboxTxt.blur();
            addListeners();
            sbox.style.visibility="hidden";
            sboxVis = false;
            setES(0);
            setTool(0);
              }                     
          }, false);
      }

      } // handler of "get SMILES" button, calls getsmiles()

      function getInSmiles() {
        let headertxt = "";
        removeListeners();
        headertxt = 'Enter SMILES Code';
        document.getElementById('smixheader').innerHTML = headertxt;
        smixbox.style.visibility="visible";
        smixbox.addEventListener('click', e => { 
          e.preventDefault();
        },false);
        smixbox.addEventListener('mouseup', e => { 
          e.preventDefault();
        },false);
        smixboxTxt.focus();
        smixboxAdd.addEventListener('click', e => {
          const xe = smixboxTxt.value;
          if (xe === '') { 
            e.preventDefault();
            inSmiles = '';
            smixboxTxt.value = "";
            smixboxTxt.blur();
            addListeners();
            smixbox.style.visibility="hidden";  
            return;
          }
          e.preventDefault();
          inSmiles = xe;
          parse_m_SMILES(inSmiles.trim());

          inSmiles='';
          smixboxTxt.value = "";
          smixboxTxt.blur();
          addListeners();
          smixbox.style.visibility="hidden";  
        },false);
        smixboxCan.addEventListener('click', e => {
          e.preventDefault();
          inSmiles = '';
          smixboxTxt.value = "";
          smixboxTxt.blur();
          addListeners();
          smixbox.style.visibility="hidden";  
        },false);
        smixboxRpl.addEventListener('click', e => {
          const xe = smixboxTxt.value;
          if (xe === '') { 
            e.preventDefault();
            inSmiles = '';
            smixboxTxt.value = "";
            smixboxTxt.blur();
            addListeners();
            smixbox.style.visibility="hidden";  
            return;                         
          }
          e.preventDefault();
          inSmiles = xe;
          clearMol(); // remove all old molecules
          drawMol(ctx,0,true);          
          parse_m_SMILES(inSmiles.trim());

          inSmiles='';
          smixboxTxt.value = "";
          smixboxTxt.blur();
          addListeners();
          smixbox.style.visibility="hidden";  
        },false);
        smixbox.addEventListener('keypress', e => { // return should work also for close
          if (e.which === 13) {
            const xe = smixboxTxt.value;
            if (xe === '') { 
              e.preventDefault();
              inSmiles = '';
              smixboxTxt.value = "";
              smixboxTxt.blur();
              addListeners();
              smixbox.style.visibility="hidden";  
              return;
            }
            e.preventDefault();
            inSmiles = xe;
            clearMol(); // remove all old molecules
            parse_m_SMILES(inSmiles.trim());
          
            inSmiles='';
            smixboxTxt.value = "";
            smixboxTxt.blur();
            addListeners();
            smixbox.style.visibility="hidden";
          }
        }, false);
      } //handler of "SMILES->structural formula" button, displays text input box for SMILES to parse and calls parse_m_SMILES()

      function setNumRing(txinp) { // parameter txinp is string, nTSring is integer
        if ((txinp === null) || (txinp === "")) { // cancel clicked or empty input
          return;
        }
    
        if ((parseInt(txinp,10) > 9) || (parseInt(txinp,10) < 3)) {
          alert("Only rings from 3 to 9 atoms supported by ring tools\n\nFor larger rings use general chain tool.");
          nTSring=0;
          return;
        } else {
          nTSring = parseInt(txinp,10);
          setTool(10);
        }
      } // sets global nTSring (for ring tool icon)

      function setXelement(xinp) {
        let xmsg="";
        let resix = -1;
        let sext = -1;
        let jj=0;
        let aixx;
        if (pDM === "") {
          if ((m.length === 2) || ((kc % 2) === 1)) {
            aixx = m.length-1;
          } else {
            aixx = lmuisn;
          }
        } else if (pDM === "provBondDraw") {
          aixx = m.length-1;
        }
      
        if ((xinp === null) || (xinp === "")) { // cancel clicked or empty input
          return;
        }

        resix = residues.indexOf(xinp); // residue, not element symbol?
        sext = sextets.indexOf(xinp); // sextet (carbene or nitrene)
        if ((resix < 0) && (sext < 0)) { // not a residue and not a sextet: test for valid element symbol
          if (xinp.length > 2) { 
            xinp = xinp.substr(0,2); // only 1 or 2-char Strings for elements
          }
          const result =  xinp.match(chemsymregexp);
          if (result !== null) {
            xinp = result[0];
          } else {
            if (m[aixx].el !== "") {
              xinp = m[aixx].el;
              xmsg = "Not a chemical element!";
              alert(xmsg);
            } else {
              xinp = "C";
              xmsg = "Not a chemical element!\nReplacing with C";
              alert(xmsg);
            }
          }
        
        } 
        if (xinp !== m[aixx].el) {
          if ((! residues.includes(xinp)) || (m[aixx].bpa.length <= 1)) {
            m[aixx].el = xinp;
            m[aixx].an = getAtomicNumber(xinp);
            if (m[aixx].an === 1) {
              for (jj=0;jj<m[aixx].bpa.length;jj++) {
                m[m[aixx].bpa[jj].p].eh += 1;
              }
            }
          }
        }
        if ((kc % 2) === 1) { 
          kc--;
          document.getElementById('alt').className = "alt";
        }
        saveState();
        resetDV();
        drawMol(ctx,0,true);
        return;
      } //checks X-element input for valid element or residue   

      function setTool(ts) {
        markactive("erase");
        if ((at === 10) && (ts !== 10)) {
          drawRingNumber("n");
          nTSring = 0;
        }
        at = ts;
        setToolFlags(ts);
        markactive("mark");
        if (ts === 10) { // n-ring tool
          if (nTSring === 0) { 
            getTxt('n');
          } else if ((nTSring > 2) && (nTSring < 10)) {
            drawRingNumber(String(nTSring));
          }
        }      
      } // selects the vertical tool icon
    
      function setToolFlags(ts) {
        if ((ts >= 0) && (ts <= 4)) { 
          TSbond = true;
          TSring = false;
          TSchain = false;
          TSmesh = false;
          TSerase =  false;
          TSlewis = false;
          TSrxn = false;
        } else if ((ts >= 5) && (ts <= 10)) {
          TSbond = false;
          TSring = true;
          TSchain = false;
          TSmesh = false;
          TSerase =  false;
          TSlewis = false;
          TSrxn = false;
        } else if (ts === 11) {  
          TSbond = false;
          TSring = false;
          TSchain = false;
          TSmesh = true;
          TSerase =  false;
          TSlewis = false;
          TSrxn = false;
        } else if (ts === 12) {  
          TSbond = false;
          TSring = false;
          TSchain = true;
          TSmesh = false;
          TSerase =  false;
          TSlewis = false;
          TSrxn = false;
        } else if (ts === 13) {  
          TSbond = false;
          TSring = false;
          TSchain = false;
          TSmesh = false;
          TSerase =  true;
          TSlewis = false;
          TSrxn = false;
        } else if ((ts >= 14) && (ts <= 17)) {  
          TSbond = false;
          TSring = false;
          TSchain = false;
          TSmesh = false;
          TSerase = false;
          TSlewis = true;
          TSrxn = false;
         } else if ((ts >= 18) && (ts <= 21)) {  
          TSbond = false;
          TSring = false;
          TSchain = false;
          TSmesh = false;
          TSerase = false;
          TSlewis = false;
          TSrxn = true;
       }
        if ((TSring || TSchain || TSmesh || TSerase) && (ae !== 0)) { // ring, chain and mesh are mandatory carbon
          setES(0);
        } 
        if (TSbond && EScharge) { // no bond drawing with charge ES active
          setES(0);
        }    
      } //sets tool-group from selected tool-icon
    
      function setES(es) {
        if ((es !== 0) && (TSring || TSmesh || TSchain || TSlewis || TSrxn)) {
          setTool(0);
        }
        ae = es;
        setESFlags(es);
        markactive("erase");
        markactive("mark");
      } //selects the horizontal element/charge/radical icon
    
      function setESFlags(es) {
        if ((es >= 0) && (es < 10)) { 
          ESelem = true;
          ESxelem = false;
          EScharge = false;
        } else if ((es === 10)) {
          ESelem = false;
          ESxelem = true;
          EScharge = false;
        } else if (es > 10) {  
          ESelem = false;
          ESxelem = false;
          EScharge = true;
        } 
      } // sets element/charge-group from selected icon
    
  // FUNCTIONS TESTING CONDITIONS
 
  // tests for graphics conditions
    
      function in_selRect(mx,my) {
        let i=0;
        
        if (selTrees.length===0) { return 0; }
        
        for (i=1;i<=nmol;i++) {
          if ((inrect(mol_brects[i],mx,my)) && (selTrees.includes(i))) {
            return i;
          }
        }
        return 0;
      }

      function rectInRect(irect,orect) {
        return ((irect.t > orect.t) && (irect.l > orect.l) && (irect.l+irect.w < orect.l+orect.w) && (irect.t+irect.h < orect.t+orect.h))
      } // returns true if irect is inside orect

          
      function checkCollisions() {
        let i, k;
        let dist;
        const collisions = [];
        for (i = 1;i<m.length;i++) {
          if( m[i].s === 1)  {
            for (k = 1;k<m.length;k++) {
              if (k !== i) {
                dist = Math.sqrt((m[k].x-m[i].x)*(m[k].x-m[i].x) + (m[k].y-m[i].y)*(m[k].y-m[i].y));
                if (dist <= crit) {
                  collisions.push(i);
                }              
              }
            }
          }      
        }
        if (collisions.length > 0) {        
          for (i=0;i<collisions.length;i++) {
            drawAtomWarning(ctx,m,collisions[i]);
          }
        }
      } // shows warning red square if two atoms or bonds get on top of each other

  // detect if coordinates are near a valid atom or bond
      function isnearmesh(xm,ym) {
        let i;
        let dist = 2*crit;
      
        for (i = 0;i<meshAt.length;i++) {
          dist = Math.sqrt((xm-meshAt[i].x)*(xm-meshAt[i].x) + (ym-meshAt[i].y)*(ym-meshAt[i].y));
          if (dist <= crit) {
            return i;
          }
        }
        return -1;
      } // detects if (xm|ym) is within crit of mesh atom in meshAt[] (returns index in meshAt or -1) 
      
      function isneararrow(xa,ya) {
        let i, pc1x, pc1y, pc2x, pc2y, x1, y1, x2, y2;
        let ptx, pty;        
        let deltax, deltay, rat, adir, di, dist, stb, enb;
        
        for (i=0;i<arro.length;i++) {        
          stb = 0;
          enb = 0;
          if (arro[i].st > 0) { //atom start
            x1 = m[arro[i].st].x;
            y1 = m[arro[i].st].y;
          } else if (arro[i].st < 0) { // bond start
            stb = (-1)*arro[i].st;
            x1 = (m[b[stb].fra].x+m[b[stb].toa].x)/2;
            y1 = (m[b[stb].fra].y+m[b[stb].toa].y)/2;
          }
          if (arro[i].en > 0) { //atom end
            x2 = m[arro[i].en].x;
            y2 = m[arro[i].en].y;
          } else if (arro[i].en < 0) { // bond end
            enb = (-1)*arro[i].en;
            x2 = (m[b[enb].fra].x+m[b[enb].toa].x)/2;
            y2 = (m[b[enb].fra].y+m[b[enb].toa].y)/2;
          }
          adir = getdirangle(x1,y1,x2,y2);
        
          di = Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
          rat = 0.8*bondlength/di;
        
          deltax = (-1)*arro[i].crv*rat*di*Math.sin(Math.PI*adir/180);
          deltay = (-1)*arro[i].crv*rat*di*Math.cos(Math.PI*adir/180);
        
          pc1x = x1+deltax;
          pc1y = y1+deltay;
          pc2x = x2+deltax;
          pc2y = y2+deltay;
          ptx = (pc1x+pc2x+x1+x2)/4+0.25*(pc1x-x1);
          pty = (pc1y+pc2y+y1+y2)/4+0.25*(pc1y-y1);
          
          dist = Math.sqrt((xa-ptx)*(xa-ptx)+(ya-pty)*(ya-pty));
          if (dist < crit) {
            return i;
          } 
        }
        return -1;
      } // returns the index of arrow in arro[] if (xy|ya) is within crit of the midpoint of an arrow, -1 otherwise
    
       function isnearRxa(xa,ya) {
        let i=0;
        let cx=0;
        let cy=0;
        let dist=0;
        
        for (i=0;i<rxnarro.length;i++) {        
          cx = (rxnarro[i].sco.x + rxnarro[i].eco.x)/2;
          cy = (rxnarro[i].sco.y + rxnarro[i].eco.y)/2;
          dist = Math.sqrt((xa-cx)*(xa-cx) + (ya-cy)*(ya-cy));
          if (dist < crit) {
            return i;
          }
        }
        return -1;
       } // returns the index of an rxn arrow if its midpoint is within crit of (xa|ya), -1 otherwise
       
 // get/test properties of atoms
  // get or set rectangles corresponding to areas on canvas
      function setRects() {
        
        trect.l = pdx; // tool icons rectangle
        trect.t = titH+6;
        trect.w = toolbarW*iconscale;
        trect.h = toolbarH*iconscale;
        erect.l = iconH*iconscale+14; // element icons rectangle
        erect.t = titH+2;
        erect.w = 14*(iconH+2)*iconscale;
        erect.h = iconH*iconscale;
        lrect.l = pdx; // lone-pairs, curved arrow, reaction arrow tools
        lrect.t = Math.max(can.height-iconH*iconscale-10,trect.t+trect.h+5); // depends on can.height
        lrect.w = (lewis_rxnarw_yn)? 8*(iconH-2)*iconscale : 5;
        lrect.h = iconH*iconscale;
        rrect.l = (lewis_rxnarw_yn)? lrect.l+lrect.w+50 : pdx + toolbarW*iconscale + 4;;
        rrect.t = lrect.t+4;
        rrect.w = 50;
        rrect.h = lrect.h-4;
        mrect.t = titH;
        mrect.w = can.width-2*pdx; 
        mrect.h = lrect.t+lrect.h+5-titH-2;
        drect.l = pdx + toolbarW*iconscale + 4; // drawing area
        drect.t = mrect.t+ iconH*iconscale+12;
        drect.w = mrect.w-trect.w-4;
        drect.h = mrect.h-2*iconH*iconscale-16;
        arect.l = drect.l+2*crit;  // area inside the security border (2*crit border)
        arect.t = drect.t+2*crit;
        arect.w = drect.w-4*crit;
        arect.h = drect.h-4*crit;
        //zoom icons
        zi.x = rrect.l+rrect.w+30;
        zi.y = rrect.t+rrect.h/2-4;
        zo.x = rrect.l+rrect.w+80;
        zo.y = rrect.t+rrect.h/2-4;
        
      } // sets the active area rectangles based on canvas dimensions
            
      function getboundrect(mar,selector,tors) {
        let i, prop, lats=0, rats=0, lmarg=0, rmarg=0, maxXix=0, minXix=0, maxX=0, maxY=0, minX=10000, minY=10000;
      
        if (selector > 0) { // only gather the boundrect of tree selector
          for (i=1;i<m.length;i++) {
            if (tors === 't') { 
              prop = m[i].t;
            } else {
              prop = m[i].s;
            }
            if (prop === selector) {
              if (mar[i].x > maxX) { maxX = mar[i].x; maxXix = i;}
              if (mar[i].y > maxY) { maxY = mar[i].y;}
              if (mar[i].x < minX) { minX = mar[i].x; minXix = i;}
              if (mar[i].y < minY) { minY = mar[i].y;}
            }        
          }
        } else { // gather boundrect aver all trees      
          for (i=1;i<m.length;i++) {
            if (mar[i].x > maxX) { maxX = mar[i].x; maxXix = i;}
            if (mar[i].y > maxY) { maxY = mar[i].y;}
            if (mar[i].x < minX) { minX = mar[i].x; minXix = i;}
            if (mar[i].y < minY) { minY = mar[i].y;}        
          }
        }
        if ((minXix > 0) && (maxXix > 0)) {
          lats = getAtStr(mar,minXix) + getCstr(mar,minXix);
          rats = getAtStr(mar,maxXix) + getCstr(mar,maxXix);
        }
        lmarg = charW*lats.length+8;
        rmarg = charW*rats.length+2;
        const tboundrect = new Rect(minX-lmarg, minY-3*charH/2-4, maxX-minX+lmarg+rmarg+4, maxY-minY+3*charH/2+18);
        return tboundrect;
      } // returns rectangle around a selected structure/substructure 
            
      function get_mol_brects() {
        let i=0;
        let nm=0;
        
        mol_brects = [new Rect(0,0,0,0)];
        if (m.length===1) { 
          return; 
        }
        nm = getAll_t_Trees();
        for (i=1; i<=nm;i++) {
          mol_brects.push(getboundrect(m,i,'t'));
        }
        return nm;
      } // fills the array of bounding rects mol_brects[] for all molecules, returns number of molecules
      
      function get_molgrp_brects() {
        let i=0;
        let jj=0;
        const vistrees = [];
        
        if (rxnarro.length === 0) { return -1; }
        molgrp_brects=[];
        for (jj=1;jj<m.length;jj++) {
          m[jj].s = -1;
        }
        for (i=0;i<rxnarro.length;i++) {
          if (!(vistrees.includes(rxnarro[i].stn.join('-')))) {
            selMultiTrees(rxnarro[i].stn,i+100);
            molgrp_brects.push(getboundrect(m,i+100,'s'));
            vistrees.push(rxnarro[i].stn.join('-'));
          } 
          if (!(vistrees.includes(rxnarro[i].etn.join('-')))) {
            selMultiTrees(rxnarro[i].etn,i+200);
            molgrp_brects.push(getboundrect(m,i+200,'s'));
            vistrees.push(rxnarro[i].etn.join('-'));
          }
        }
        clearSelection();
      } // fills the array molgrp_brects[] with bounding rects for all molgrps from .stn and .etn 
      
                 
  // END CONDITION TESTING FUNCTIONS

  // MARKING FUNCTIONS

  // mark/unmark the active tool and atomtype
      function markactive(flag) {   // marks the active tool and element    
        let atox, tix, hashift = 0, lewisshift = 0;
      
        if (flag === "erase") {
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 7;
          ctx.beginPath();
          ctx.moveTo(erect.l,erect.t+erect.h+4);
          ctx.lineTo(erect.l+erect.w, erect.t+erect.h+4); //BF201031.1
          ctx.stroke();                   
          ctx.beginPath();
          ctx.moveTo(trect.l-4,trect.t);
          ctx.lineTo(trect.l-4,trect.t+trect.h); //BF201031.1
          ctx.stroke();                   
          ctx.beginPath();
          ctx.moveTo(lrect.l,lrect.t+lrect.h+4);
          ctx.lineTo(lrect.l+lrect.w, lrect.t+lrect.h+4); //BF201031.1
          ctx.stroke();                   
        } else if (flag === "mark") {
          atox = ae;
          tix = at;
          ctx.strokeStyle = 'red';
          ctx.lineWidth = 5;
        }
        ctx.beginPath();
        ctx.moveTo(erect.l+(atox)*(erect.w/14), erect.t+erect.h+4);
        ctx.lineTo(erect.l+(atox + 1)*(erect.w/14), erect.t+erect.h+4);
        ctx.stroke();
        if ((tix >= 14) && (tix <= 21)) {
          ctx.beginPath();
          ctx.moveTo(lrect.l+(tix-14)*(lrect.w/8),lrect.t+lrect.h+4);
          ctx.lineTo(lrect.l+(tix-13)*(lrect.w/8),lrect.t+lrect.h+4);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.moveTo(trect.l-5, trect.t+(tix)*trect.h/14);
          ctx.lineTo(trect.l-5, trect.t+(tix + 1)*trect.h/14-2);
          ctx.stroke();
        }
      } // red bar along currently selected tool/element icon

      function drawAtomHighlighted(tcx,tcy) {
        igctx.save();
        if (pad) {
          igctx.fillStyle = 'rgba(255,0,0,0.1)';
          igctx.beginPath();
          igctx.arc(tcx, tcy, 3*hlAtRad, 0, Math.PI * 2);
          igctx.fill();
        }
        igctx.lineWidth = (pad)? 2: 1;
        igctx.strokeStyle = 'red';
        igctx.beginPath();
        igctx.arc(tcx, tcy, hlAtRad, 0, Math.PI * 2);
        igctx.stroke();
        igctx.restore();
      } // draw circle around atom near mouse

      function drawBondHighlighted(bix) {
        const tcx = (m[b[bix].fra].x+m[b[bix].toa].x)/2;
        const tcy = (m[b[bix].fra].y+m[b[bix].toa].y)/2;
        igctx.save();
        if (pad) {
          igctx.fillStyle = 'rgba(0,0,255,0.1)';
          igctx.beginPath();
          igctx.arc(tcx, tcy, 3*hlBoRad, 0, Math.PI * 2);
          igctx.fill();
        }
        igctx.lineWidth = (pad)? 2: 1;
        igctx.strokeStyle = 'blue';
        igctx.beginPath();
        igctx.arc(tcx, tcy, hlBoRad, 0, Math.PI * 2);
        igctx.stroke();
        igctx.restore();
      }  // draw filled circle in center of bond near mouse

      function drawArrowHighlighted(arrox) {
        const st = arro[arrox].st;
        const en = arro[arrox].en;
        const crv = arro[arrox].crv;
      
        let x1 = 0;
        let y1 = 0;
        let x2 = 0;
        let y2 = 0;
        let pc1x, pc1y, pc2x, pc2y; //the points controlling the shape of the bezier crv
        let deltax, deltay, rat, adir, di;
        
        if (st < 0) {
          x1 = (m[b[(-1)*st].fra].x + m[b[(-1)*st].toa].x)/2;
          y1 = (m[b[(-1)*st].fra].y + m[b[(-1)*st].toa].y)/2;
        } else if (st > 0) {
          x1 = m[st].x;
          y1 = m[st].y;
        }
        if (en < 0) {
          x2 = (m[b[(-1)*en].fra].x + m[b[(-1)*en].toa].x)/2;
          y2 = (m[b[(-1)*en].fra].y + m[b[(-1)*en].toa].y)/2;
        } else if (en > 0) {
          x2 = m[en].x;
          y2 = m[en].y;
        }

        adir = getdirangle(x1,y1,x2,y2);
        
        di = Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
        rat = 0.8*bondlength/di;
        
        deltax = (-1)*crv*rat*di*Math.sin(Math.PI*adir/180);
        deltay = (-1)*crv*rat*di*Math.cos(Math.PI*adir/180);
        
        pc1x = x1+deltax;
        pc1y = y1+deltay;
        pc2x = x2+deltax;
        pc2y = y2+deltay;

        igctx.save();
        if (pad) {
          igctx.fillStyle = 'rgba(0,255,0,0.4)';
          igctx.beginPath();
          igctx.arc((pc1x+pc2x+x1+x2)/4+0.25*(pc1x-x1), (pc1y+pc2y+y1+y2)/4+0.25*(pc1y-y1) , 3*crit, 0, Math.PI * 2);
          igctx.fill();
        }
        igctx.strokeStyle = 'green';
        igctx.linewidth = 1.5;
        igctx.beginPath();
        igctx.arc((pc1x+pc2x+x1+x2)/4+0.25*(pc1x-x1), (pc1y+pc2y+y1+y2)/4+0.25*(pc1y-y1) , 4, 0, Math.PI * 2);
        igctx.stroke();
        
        igctx.restore();
      
      } // draws the small red point in the midpoint of arro[arrox]
            
      function drawRxaHighlighted(rxix) {
        let cx=0;
        let cy=0;
        let i=0;
        
        cx = (rxnarro[rxix].sco.x+rxnarro[rxix].eco.x)/2; 
        cy = (rxnarro[rxix].sco.y+rxnarro[rxix].eco.y)/2;
        igctx.save();
        if (pad) {
          igctx.fillStyle = 'LightGray';
          igctx.beginPath();
          igctx.arc(cx,cy,3*crit,0,Math.PI * 2);
          igctx.fill();
        }
        igctx.fillStyle = 'DarkGray';
        igctx.beginPath();
        igctx.arc(cx, cy, hlBoRad, 0, Math.PI * 2);
        igctx.fill();
        igctx.restore();
        for (i=0;i<rxnarro[rxix].stn.length;i++) {
          markTree(rxnarro[rxix].stn[i],'reactant','blue',true,'t');
        }
        for (i=0;i<rxnarro[rxix].etn.length;i++) {
          markTree(rxnarro[rxix].etn[i],'product','green',true,'t');
        }
      } //draw the rxn arrow highlighted

      function drawAtomWarning(cox,mar,at) {
        const tcx = mar[at].x;
        const tcy = mar[at].y;
        cox.save();
        cox.beginPath();
        cox.lineWidth = 2; cox.strokeStyle = 'red';
        cox.strokeRect(tcx-crit-2, tcy-crit-2, 2*crit+4, 2*crit+4);
        cox.restore();
      } // draw red square around the atoms in warnAtoms[]


  // DRAWING FUNCTIONS
    
  // draw the sketcher frame        
      function sketcherframe() {
        let ig=0;
        let i=0;
        let vsstr = '';
        // Write title
        vsstr=version+"("+build+")";
        ctx.save();
        ctx.font = '12pt Sans-Serif';
        ctx.fillStyle = 'black';
        ctx.fillText("Structural Formula Editor  MOSFECCS", 50, 28);
        ctx.fillStyle = 'black';
        ctx.font = '10pt Sans-Serif';
        ctx.fillText(vsstr, drect.l+drect.w-ctx.measureText(vsstr).width,28);
        ctx.font = '9pt Sans-Serif';      
        ctx.fillText("© B.Jaun ETHZ", drect.l+drect.w-90, drect.t+drect.h+15);
        ctx.restore();
        // draw the element and charge icons
        ctx.drawImage(eImg, erect.l, erect.t, erect.w, erect.h);
        // draw the tool icons
        ctx.drawImage(tImg, trect.l, trect.t, trect.w, trect.h);
        // draw the lewis- and arrows icons 
        if (lewis_rxnarw_yn) {         
          ctx.drawImage(lImg, lrect.l, lrect.t, lrect.w, lrect.h);
        }
        //draw the redraw-icon   
        ctx.save();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(rrect.l,rrect.t,rrect.w,rrect.h);
        ctx.font = '10pt Sans-Serif';
        ctx.fillStyle = 'black';
        ctx.fillText('redraw', rrect.l+rrect.w/2-ctx.measureText('redraw').width/2,rrect.t+rrect.h/2+4);
        ctx.restore();
         //draw the zoom-in-icon   
        ctx.save();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1.5;
        ctx.beginPath()
        ctx.arc(zi.x,zi.y,zi.r,0,2*Math.PI);
        ctx.stroke();
        ctx.font = '14pt Sans-Serif';
        ctx.fillStyle = 'black';
        ctx.fillText('+', rrect.l+rrect.w+30-ctx.measureText('+').width/2,rrect.t+rrect.h/2);
        ctx.restore();
         //draw the zoom-out-icon   
        ctx.save();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1.5;
        ctx.beginPath()
        ctx.arc(zo.x,zo.y,zo.r,0,2*Math.PI);
        ctx.stroke();
        ctx.font = '14pt Sans-Serif';
        ctx.fillStyle = 'black';
        ctx.fillText('–', zo.x-ctx.measureText('–').width/2,zo.y+5);
        ctx.restore();
        // bondlength indicator
        ctx.save();
        ctx.font = '10pt Sans-Serif';
        ctx.fillStyle = 'black';
        ctx.fillText('Bondlength',zi.x-7,zi.y+26);
        ctx.fillText(String(Math.round(bondlength)),(zi.x+zo.x)/2-6,zi.y+6);        
        // mark active tool and element
        markactive("erase");
        markactive("mark");
      
        // Draw rect as drawing aerea
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.strokeRect(drect.l, drect.t, drect.w, drect.h);
        ctx.restore();
      } // draw all items of the main canvas frame: title, icon bars, framed drawing area

//diagnostic: draw borders on rectangles
      function drawrects() {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = 'magenta';
        ctx.lineWidth = 1;
        ctx.strokeRect(mrect.l, mrect.t, mrect.w, mrect.h);
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.strokeRect(drect.l, drect.t, drect.w, drect.h);
        ctx.beginPath();
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 1;
        ctx.strokeRect(arect.l, arect.t, arect.w, arect.h);
        ctx.beginPath();
        ctx.strokeStyle = 'green';
        ctx.lineWidth = 2;
        ctx.strokeRect(erect.l, erect.t, erect.w, erect.h);
        ctx.beginPath();
        ctx.strokeStyle = 'green';
        ctx.lineWidth = 2;
        ctx.strokeRect(trect.l, trect.t, trect.w, trect.h);
        ctx.beginPath();
        ctx.strokeStyle = 'green';
        ctx.lineWidth = 2;
        ctx.strokeRect(lrect.l, lrect.t, lrect.w, lrect.h);
        ctx.restore();
      }

      function displayDims() {
        let outstr = '';
        let screenWidth=screen.width;
        let screenHeight=screen.height;
        
        if (Math.abs(window.orientation)===90) { //landscape
          if (screen.width < screen.height) { //iOS)
            screenWidth = screen.height;
            screenHeight = screen.width;
          } else {
            screenWidth = screen.width;
            screenHeight = screen.height;
          }
        } else { // android etc.
          screenWidth = screen.width;
        }
        vps = screenWidth/window.innerWidth;
        
        outstr += "\norientation="+String(window.orientation)+" phone="+phone;
        outstr += "\nvps="+f3(vps)+" iconscale="+f3(iconscale);
        outstr += "\ns.w="+String(screenWidth)+" s.h="+String(screenHeight);
        outstr += "\nw.iW="+String(window.innerWidth)+" w.iH="+String(window.innerHeight);
        outstr += "\nbgc.w="+String(bgc.width)+" bgc.h="+String(bgc.height);
        outstr += "\ncan.w="+String(can.width)+" can.h="+String(can.height);
        outstr += "\ntrect%="+f1(100*(trect.t+trect.h)/bgc.height)+"%";
        outstr += "\nbutreg.style.top="+String(butreg.style.top);
        alert(outstr); 
      }
      
      function drawRingNumber(nStr) {  // expects number as a string
        ctx.save();
        ctx.beginPath();
        ctx.arc(trect.l+toolbarW*iconscale/2,trect.t+10.5*iconH*iconscale,8,0*Math.PI,2*Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.font = '10pt sans-serif';
        ctx.fillStyle = 'black';
        ctx.fillText(nStr,trect.l+toolbarW*iconscale/2-(nStr.length/2)*8,trect.t+10.5*iconH*iconscale+4);
        ctx.restore();
      }  // draw the ring-size digit inside ring-tool icon

      
  //draw shortcuts
      function drawshortcuts() { // draw all shortcut symbols on hidden canvas sho (done upon initialization and window resize ) //BF200104.1
        let i;
        const ho=[7,7,7,7,7,7,7,10,10,5,7,5,7,7];
        const ESkLeft = erect.l;
        const TSkLeft = trect.l+trect.w+8;
        shoctx.save();
        shoctx.clearRect(0,0,sho.width,sho.height);
        shoctx.font = '12pt Sans-Serif';
        shoctx.fillStyle = 'blue';
        for (i=0;i<ESkbds.length;i++) {
          shoctx.fillText(ESkbds[i],ESkLeft+i*(iconH+2)+iconH/2-ho[i], erect.t+iconH+25);
        }  
        for (i=0;i<ESkbds.length;i++) {
          shoctx.fillText(ESkbds2[i],ESkLeft+i*(iconH+2)+iconH/2-ho[i], erect.t+iconH+42);
        }
        for (i=0;i<TSkbds.length;i++) {
          if (TSkbds[i] === 'l') {
            shoctx.font = 'italic 14pt serif';
          } else {
            shoctx.font = '12pt Sans-Serif';
          }
          shoctx.fillText(TSkbds[i],TSkLeft, trect.t + 4 + i*36+20);
        }
        shoctx.font = '12pt Sans-Serif';
        shoctx.fillText("q",trect.l-3+iconH/2,trect.t-12);
        if (pad) {
          shoctx.fillText("E",60,lrect.t+60);
          shoctx.fillText("backsp",115,lrect.t+60);
          shoctx.fillText("g",220,lrect.t+60);
          shoctx.fillText("H",400,lrect.t+60);
          shoctx.fillText("!",rrect.l-10,rrect.t+20);
        } else {
          shoctx.fillText("E",60,lrect.t+110);
          shoctx.fillText("backsp",130,lrect.t+110);
          shoctx.fillText("g",240,lrect.t+110);
          shoctx.fillText("H",445,lrect.t+110);
          shoctx.fillText("!",354,lrect.t+53);
        }
        shoctx.save();
        shoctx.strokeStyle = 'blue';
        shoctx.lineWidth = 1;
        shoctx.beginPath();
        shoctx.moveTo(trect.l+iconH/2+8,erect.t-12);  
        shoctx.lineTo(erect.l,erect.t);  
        shoctx.moveTo(trect.l-3+iconH/2+4,erect.t-10);  
        shoctx.lineTo(trect.l-3+iconH/2+4,erect.t+4);
        shoctx.stroke();
        shoctx.restore();
        
      } // draw all shortcut symbols on hidden canvas sho (done upon initialization)

  // display shortcuts
      function displayshortcuts(flag) {
        if (flag === 0) {
        sho.style.visibility = 'hidden';
      } else if (flag === 1) {
        sho.style.visibility = 'visible';
        }
      } // switches shortcut display on/off. toggle linked to keypress 'k'.


  // THE MOLECULE DRAWING FUNCTIONS

      function drawMol(ctxx,s,ayn) {
        let i, k, a1, a2, a1x, a1y, a2x, a2y, bt;
        let bondColor="black", atsymColor="black";
  //      var atstr = "";
        
        clearDA(ctxx);
        clearIGC();
        clearDA(pdctx);
        if(m.length === 1) {
          return;
        }
        bondColor = (s === 1)? "magenta":"black";
        if (b.length >= 2) {  // draw all bonds
          for (k = 1;k<b.length;k++) {
            a1 = b[k].fra;
            a2 = b[k].toa;
            if (((s === 1) && ((m[a1].s === 1) || (m[a2].s === 1)) || (pDM === "moveAllMol")) || (s === 0)) {
              a1x = m[a1].x;
              a1y = m[a1].y;
              a2x = m[a2].x;
              a2y = m[a2].y;
              bt = b[k].btyp;
              drawBond(ctxx, a1x, a1y, a2x, a2y, bt, stdlw, bondColor); //es
            }
          }
        }

        atsymColor = (s === 1)? "magenta":"black";
        for (i=1;i<m.length;i++) { // draw the atom symbols  
          if (((s === 1) && ((m[i].s === 1)) || (pDM === "moveMol")) || (s === 0)) {
            drawAtomLabel(ctxx,i,atsymColor);
          }
        } // end loop over atoms
        
        if ((arro.length > 0) && (ayn)) {
          for (i=0;i<arro.length;i++) {
            drawArrow(ctxx,i,'red');
          }
        }
        if ((rxnarro.length > 0) && (ayn)) {
          for (i=0;i<rxnarro.length;i++) {
            drawRxnArrow(ctxx,i,'black');
          }
        }
        click = false;
        clickOnAtom = false;
        clickOnBond = false;
      } // draw the molecular data as structural formula
  // end of drawMol

      function drawMol_m_s_anbn(ctxx,s,ayn) {
        let i, k, a1, a2, a1x, a1y, a2x, a2y, bt;
        let bondColor="black", atsymColor="black";
        
        clearDA(ctxx);
        clearIGC();
        clearDA(pdctx);
        if(m_s.length === 1) {
          return;
        }
        bondColor = (s === 1)? "magenta":"black";
        if (b_s.length >= 2) {  // draw all bonds
          for (k = 1;k<b_s.length;k++) {
            a1 = b_s[k].fra;
            a2 = b_s[k].toa;
            if (((s === 1) && ((m_s[a1].s === 1) || (m_s[a2].s === 1)) || (pDM === "moveAllMol")) || (s === 0)) {
              a1x = m_s[a1].x;
              a1y = m_s[a1].y;
              a2x = m_s[a2].x;
              a2y = m_s[a2].y;
              bt = b_s[k].btyp;
              drawBond(ctxx, a1x, a1y, a2x, a2y, bt, stdlw, bondColor); //es
            }
          }
        }

        atsymColor = (s === 1)? "magenta":"black";
        for (i=1;i<m_s.length;i++) { // draw the atom symbols  
          if (((s === 1) && ((m_s[i].s === 1)) || (pDM === "moveMol")) || (s === 0)) {
            drawAtomLabel(ctxx,i,atsymColor);
          }
        } // end loop over atoms
        
        if ((arro.length > 0) && (ayn)) {
          for (i=0;i<arro.length;i++) {
            drawArrow(ctxx,i,'red');
          }
        }
        if ((rxnarro.length > 0) && (ayn)) {
          for (i=0;i<rxnarro.length;i++) {
            drawRxnArrow(ctxx,i,'black');
          }
        }
        click = false;
        clickOnAtom = false;
        clickOnBond = false;
      } // diagnostic: linked to key 'T'. Draw the molecular data as structural formula. 
  // end of drawMol_m_s_anbn
  
      function drawMol_s(ctxx,s) { //es
        let i, k, a1, a2, a1x, a1y, a2x, a2y, bt;
        const bondColor="black", atsymColor="magenta";
        
        clearDA(ctxx);
        clearIGC();
        clearDA(pdctx);
        if(m_s.length === 1) {
          return;
        }
        if (b_s.length >= 2) {  // draw all bonds
          for (k = 1;k<b_s.length;k++) {
            a1 = b_s[k].fra;
            a2 = b_s[k].toa;
            if (((s === 1) && ((m_s[a1].s === 1) || (m_s[a2].s === 1)) || (pDM === "moveAllMol")) || (s === 0)) {
              a1x = m_s[a1].x;
              a1y = m_s[a1].y;
              a2x = m_s[a2].x;
              a2y = m_s[a2].y;
              bt = b_s[k].btyp;
              drawBond(ctxx, a1x, a1y, a2x, a2y, bt, stdlw, bondColor); //es
            }
          }
        }

        for (i=1;i<m_s.length;i++) { // draw the atom symbols  
            drawAtomClass(ctxx,i,atsymColor);
        } // end loop over atoms
        
        click = false;
        clickOnAtom = false;
        clickOnBond = false;
      } // diagnostic: linked to key 'J'. Draw shadow molecule m_s,b_s with class numbers

  // draw Bond
       function drawBond(ctxx,x1,y1,x2,y2,bt,lw,ss) {  //es
        // x1, y1, x2, y2 : coordinates of the two atoms of the Bond
        // bt: bond type
        // lw : the lineWidth
        // ss : the strokeStyle (color)
      
        let xofs=0, yofs=0, ang=0, degang=0;
      
        degang = getdirangle(x1, y1, x2, y2);
        ang = Math.PI /2 + (degang / 180) * Math.PI ; // angle of offsets
        yofs = (-1)*ofs*Math.sin(ang);
        xofs = ofs*Math.cos(ang);
        if (bt === 0) { return; } // skip deleted bonds in array
        if (bt === 1)  { // single bond
          ctxx.beginPath();
          ctxx.strokeStyle = ss;
          ctxx.lineWidth = lw;
          ctxx.moveTo(x1, y1);
          ctxx.lineTo(x2, y2);
          ctxx.stroke();
        } 
        if (bt === 2) {  // double bond
          ctxx.beginPath();
          ctxx.strokeStyle = ss;
          ctxx.lineWidth = lw;
          ctxx.moveTo(x1+xofs, y1+yofs);
          ctxx.lineTo(x2+xofs, y2+yofs);
          ctxx.stroke();
          ctxx.beginPath();
          ctxx.moveTo(x1-xofs, y1-yofs);
          ctxx.lineTo(x2-xofs, y2-yofs);
          ctxx.stroke();
        }
        if (bt === 3) {  // triple bond
          ctxx.strokeStyle = ss;
          ctxx.lineWidth = lw;
          ctxx.beginPath(); // central line
          ctxx.moveTo(x1, y1);
          ctxx.lineTo(x2, y2);
          ctxx.stroke();
          ctxx.beginPath(); 
          ctxx.moveTo(x1+2*xofs, y1+2*yofs);
          ctxx.lineTo(x2+2*xofs, y2+2*yofs);
          ctxx.stroke();
          ctxx.beginPath();
          ctxx.moveTo(x1-2*xofs, y1-2*yofs);
          ctxx.lineTo(x2-2*xofs, y2-2*yofs);
          ctxx.stroke();
        }
        if (bt === 4) {  // stereo up
          ctxx.beginPath();
          ctxx.fillStyle = ss;
          ctxx.moveTo(x1, y1);
          ctxx.lineTo(x2-1.5*xofs, y2-1.5*yofs);
          ctxx.lineTo(x2+1.5*xofs, y2+1.5*yofs);
          ctxx.lineTo(x1, y1);
          ctxx.fill();
        }
        if (bt === 5) {  // stereo down
          if (nolinedash) {
            ctxx.beginPath();
            ctxx.strokeStyle = ss;
            ctxx.moveTo(x1-xofs, y1-yofs);
            ctxx.lineTo(x1+xofs, y1+yofs);
            ctxx.lineTo(x2, y2);
            ctxx.lineTo(x1-xofs, y1-yofs);
            ctxx.linewidth = lw;
            ctxx.stroke();
          } else {
            ctxx.save();
            ctxx.beginPath();
            ctxx.moveTo(x1, y1);
            ctxx.lineTo(x2-2*xofs, y2-2*yofs);
            ctxx.lineTo(x2+2*xofs, y2+2*yofs);
            ctxx.lineTo(x1, y1);
            ctxx.clip();
            ctxx.beginPath();
            ctxx.strokeStyle = ss;
            ctxx.setLineDash([2,3]);
            ctxx.moveTo(x1, y1);
            ctxx.lineWidth = downlw;
            ctxx.lineTo(x2, y2);
            ctxx.stroke();
            ctxx.restore();
          }
        }
      } // draw bond

      function drawAtomLabel(ctxx,ix,alCo) {
        let i=0;
        let atdi = '';
        let atstrsector = -1;
        let cv=new Coord(0,0);
        let cw, xpos=0, ypos=0, obi=0, chof=0, cstr='', atstr='';
        let atsubstr = [];
        let csubstr = [];
        let lpdirs = []; // array of directions for lone pairs (deg)
        let lprads = [charH,charH,charH,charH]; // array of radii for lone pairs
        let zif = '';
        let cdig = '';
        let ele ='';
        const cd = 0;
        let cvrad = charH;
        let rrad = charH;
        let ba = 0;
        let chovl = false;
        let csect=-1;
        let lpsect=[];
      
        ctxx.save();
        ctxx.font = String(charH) +'pt Arial, Helvetica, sans-serif';
        ctxx.fillStyle = alCo;
        
        atstr = getAtStr(m,ix); // atom label
        if (((atstr.length < 2) || (elesym.includes(atstr))) || (atstr.includes(':')) || (showatnum) || (residues.includes(atstr))) { //BF210505.1
        // simple: one char, element symbol, carbene/nitrene or atom number
          atdi ='simple';
        } else if (atsubstr = atstr.match(/([A-Za-z]{1,2})H(\d{0,2})/)) { // right side ele-H
          atdi = 'right';
        } else if (atsubstr = atstr.match(/H(\d{0,2})([A-Za-z]{0,2})/)) { // left side H-ele
          atdi = 'left'
        }
        chof = ctxx.measureText(m[ix].el.charAt(0)).width/2;
        cstr = getCstr(m,ix); // charge string
        if ((cstr!=='') && (csubstr = cstr.match(/(\d{1,2})/))) { // multiple charge
          cdig = csubstr[1];
        }
        
        getBisectorsAt(m,ix,true);
        if (atdi==='right') {
          atstrsector = isInSector(m,ix,0);
        } else if (atdi==='left') {
          atstrsector = isInSector(m,ix,180);        
        }
        chovl = false;
        for (i=0;i<m[ix].bpa.length;i++) {
          ba = getdiranglefromAt(m,ix,m[ix].bpa[i].p);
          if (((atdi==='right') && ((ba < 30) || (ba > 330))) || ((atdi==='left') && ((ba > 150) && (ba < 210)))) {
            chovl = true;
          }
        }
        
        if ((m[ix].el === 'H') && (m[ix].bpa.ength === 0)) {
          obi = 60;
        }
        // RADICAL
        if (m[ix].r) { // radical center, • is placed in preferred bisector direction
          if (atdi==='simple') {
            switch (m[ix].bpa.length) {
              case 0:
                obi=180;
                lpdirs = [norma(obi+90),norma(obi-90),norma(obi+180),obi];
                if (atstr.length===2) {
                  lprads[2] += 0.5*charH;
                }
                if (m[ix].nlp > 3) {
                  rrad += charH;
                } 
                break;
              case 1:
                obi=bisectors[0];
                lpdirs = [norma(obi+90),norma(obi-90),obi,norma(obi+180)];
                if (atstr==='') { // carbon
                  rrad = 0.6*charH;
                } else if (atstr.length===1) {
                  lprads = [1.1*charH,1.1*charH,1.1*charH,1.1*charH];
                  if (m[ix].nlp < 3) {
                    rrad = 0.9*charH;
                  } else {
                    rrad = lprads[2]+0.6*charH;
                  }
                } else if (atstr.length === 2) {
                  lprads = [1.1*charH,1.1*charH,1.5*charH,1.2*charH];                    
                  if ((obi <= 45) || (obi >= 315)) { // right
                    lprads = [1.1*charH,1.1*charH,1.5*charH,1.2*charH];                    
                    if (m[ix].nlp < 3) {
                      rrad = 1.7*charH;
                    } else {
                      rrad = lprads[2]+0.6*charH;
                    }
                  } else if ((obi >= 135) && (obi <= 225)) { // left
                    lprads = [1.1*charH,1.1*charH,1.2*charH,1.2*charH];                    
                    rrad = (m[ix].nlp < 3)? 0.9*charH : lprads[2]+0.6*charH; 
                  } else if ((obi > 225) && (obi < 315)) { // down
                    lprads = [1.5*charH,1.0*charH,1.1*charH,1.2*charH];
                    rrad = (m[ix].nlp < 3)? 1.2*charH : lprads[2]+0.6*charH; 
                  } else if ((obi > 45) && (obi < 135)) { //up
                    lprads = [1.0*charH,1.5*charH,1.1*charH,1.2*charH];
                    rrad = (m[ix].nlp < 3)? 1.2*charH : lprads[2]+0.6*charH; 
                  } else {
                    rrad = 1.6*charH;
                    lprads[2] = charH;
                  }
                }
                break;
              case 2:
                 obi=bisectors[0];
                if ((m[ix].nlp === 0) && (hasDB(m,b,ix)===1)) { //BF191115.3
                  obi = norma(obi+180); //BF191115.3
                } //BF191115.3
                if (m[ix].nlp===1) { // if  1 LP: set LP params
                  lpdirs = [norma(obi+180)];
                  if (atstr.length===0) {
                    lprads[0] = 0.8*charH;
                  } else {
                    lprads[0] = 1.1*charH;
                  }         
                } else if (m[ix].nlp > 1) {
                  lpdirs = [norma(obi+135),norma(obi-135),obi];
                  if (atstr.length===0) {
                   lprads = [0.8*charH,0.8*charH,0.8*charH];                 
                  } else if (atstr.length===1) {
                    lprads = [1.0*charH,1.0*charH,1.0*charH];
                  } else if (atstr.length===2) {
                    for (i=0; i<m[ix].nlp;i++) { // increase radius for LP in direction of atstr
                      if ((lpdirs[i] < 30) || (lpdirs[i] > 330)) {
                        lprads[i] += 0.7*charH;
                      } else if ((lpdirs[i] < 75) || (lpdirs[i] > 285)) {
                         lprads[i] += 0.42*charH;
                      }
                    }
                  }
                }
                // set rrad
                if (m[ix].nlp === 0) { // no LP
                  rrad = 1.0*charH;
                  if (hasDB(m,b,ix) >= 1) { //BF191115.3
                    rrad = 1.1*charH; //BF191115.3
                  } else if (atstr==='') {
                    rrad = 0.84*charH;
                  } else if ((atstr.length===2) && ((obi < 60) || (obi > 300))) {
                    rrad += 0.6*charH;
                  }
                } else if (m[ix].nlp <= 2) { // 1 or 2 LP
                  if (atstr.length > 0) {
                    rrad = (((obi < 60) || (obi > 300)) && (atstr.length===2))? 1.6*charH : 1.1*charH;
                  } else {
                    rrad = 0.7*charH;
                  }
                } else if (m[ix].nlp > 2) { //3 or 4 LP
                  rrad = lprads[2] + 0.5*charH;
                }
                break;
             default: // 3 or more bonds
                obi=bisectors[bisectors.length-2]; // radical goes to 2nd largest sector
                rrad = 1.0*charH;
                lpdirs = [bisectors[bisectors.length-1],bisectors[bisectors.length-3]];
                lprads = [1.3*charH,1.3*charH];
                if (atstr.length===2) {
                  rrad = ((obi < 60) || (obi > 300))? 1.5*charH : 1.0*charH;
                  lprads = [1.3*charH,1.3*charH];
                }
                if (atstr==='') {
                  rrad = 0.8*charH;
                }
                break;
            }
            // end radical for SIMPLE           
          } else { // radical for COMPLEX
            if (m[ix].bpa.length===0) {
              lpdirs = [270,90,180,0];
              lprads = [1.2*charH,1.2*charH,1.2*charH,ctxx.measureText(atstr).width];         
              obi = 180;
              if (m[ix].nlp > 2) {
                rrad = 2*charH;
              }
            } else if (m[ix].bpa.length===1) {
              obi=bisectors[0];
              lprads = [1.2*charH,1.2*charH,1.2*charH,1.2*charH];         
              rrad = 1.1*charH;
              if ((obi > 45) && (obi <= 90)) { // up right
                lpdirs = [180,90,270,0];
                obi= 90;
              } else if ((obi > 90) && (obi < 135)) { // up left
                lpdirs = [0,90,270,180];
                rrad = 1.1*charH;
                obi = 90;
              } else if ((obi >=270) && (obi < 315)) { // down right
                lpdirs = [180,270,90,0];
                rrad = 1.1*charH;
                obi= 270;
              } else if ((obi > 225) && (obi < 270)) { // down left
                lpdirs = [0,270,90,180];
                rrad = 1.1*charH;
                obi = 270;
              } else if ((obi <= 45) || (obi >= 315)) { //right
                lpdirs = [90,270,180,0];
                rrad = 1.1*charH;
                obi = 270;
              } else if ((obi >= 135) && (obi <= 225)) { //left
                lpdirs = [90,270,0,180];
                rrad = 1.1*charH;
                obi = 270;
              }
              if (m[ix].nlp > 1) {
                rrad += 0.6*charH;
              }            
            } else if (m[ix].bpa.length===2) {
              obi=bisectors[0]; // small sector
              lprads[2] += 0.6*charH;
              if ((obi > 45) && (obi < 135)) {
                lpdirs = [obi,(atdi==='right')? norma(obi+120) : norma(obi-120),(atdi==='right')? norma(obi-120) : norma(obi+120),norma(obi-90)];
              } else {
                lpdirs = [obi,(atdi==='right')? norma(obi-120) : norma(obi+120),(atdi==='right')? norma(obi+120) : norma(obi-120),norma(obi-90)];
              }
              if ((obi < 45) || (obi > 315) || ((obi > 135) && (obi < 225))) { // right or left
                lprads[1] += 0.6*charH;
              }
              obi = lpdirs[1];
              if (m[ix].nlp < 2) {
                rrad = 1.3*charH;
              } else {
                rrad = 2*charH;
                if ((atdi==='right') && ((obi > 0) && (obi < 90))) {
                  rrad = 2*charH;
                  lprads[1] = rrad - 0.6*charH;
                }
              }
              if (m[ix].nlp > 2) {
                lprads[2] = ctxx.measureText(atstr).width;
                if (atdi==='left') {
                  lpdirs = [270,90,180,0];
                }
              }
            } else { // three bonds or more
              lprads = [1.2*charH,1.2*charH,1.2*charH];
              if (atdi==='simple') { // SIMPLE: LP with radical 
                obi = bisectors[bisectors.length-2];                
                lpdirs = [bisectors[bisectors.length-1],bisectors[bisectors.length-2],bisectors[bisectors.length-3]];
                rrad = (m[ix].nlp > 1)? lprads[1]+0.6*charH : 1.3*charH;
              } else { // COMPLEX: LP with radical
                if (atstrsector!==bisectors.length-1) { 
                  lpdirs = [bisectors[bisectors.length-1],bisectors[bisectors.length-2],bisectors[bisectors.length-3]];
                  obi = bisectors[bisectors.length-2];
                  rrad = (m[ix].nlp > 1)? lprads[1]+0.6*charH : 1.3*charH;
                } else {
                  lpdirs = [bisectors[bisectors.length-2],bisectors[bisectors.length-3],bisectors[bisectors.length-1]];
                  obi = bisectors[bisectors.length-3];                
                  rrad = (m[ix].nlp > 1)? lprads[1]+0.6*charH : 1.3*charH;
                }
              }
            }
          }   
          cv=calcCstrOffsetVector(rrad,obi);
          ctxx.save();
          ctxx.font = String(1.5*charH) +'pt Arial, Helvetica, sans-serif';
          ctxx.fillStyle='red';
          ctxx.fillText('•',m[ix].x+cv.x-ctxx.measureText('•').width/2, m[ix].y+cv.y+0.7*charH);
          ctxx.restore(); 
        } else if (m[ix].nlp > 0) { 
        // LONE PAIR params not radical
          switch (m[ix].bpa.length) {
            case 0:
              obi=0;
              lpdirs = [norma(obi+180),norma(obi+90),norma(obi-90),obi]; //[180,90,270,0]
              if (atstr.length===2) {
                lprads = [charH,charH,charH,ctxx.measureText(atstr).width];
              }
              if (m[ix].nlp > 3) {
                cvrad += charH;
              } 
              break;
            case 1:
              obi=bisectors[0]; //there is only one sector, its bisector points in dir of bond ligand->ix
              if (atdi==='simple') { // parallel|orthogonal to bond
                if ((m[ix].bpa[0].t===2) && (m[ix].nlp <= 2)) { // terminal DB ligand: Keto
                  lpdirs = [norma(obi+60),norma(obi-60),norma(obi+180)];
                  lprads = [charH,charH,charH,charH];
                } else if ((m[ix].bpa[0].t===3)) {
                  lpdirs = [obi,norma(obi-90),norma(obi-90)];
                  lprads = [charH,charH,charH,charH];                
                } else {
                  lpdirs = [norma(obi+90),norma(obi-90),obi, norma(obi+180)]; // as seen along bond: [left,rigth,ahead,onbond]
                  lprads = [charH,charH,charH,charH];
                }
                if (atstr.length===2) { // 2 char simple //BF200212.1
                  for (i=0; i<m[ix].nlp;i++) { // increase radius for LP in direction of atstr
                    if ((lpdirs[i] < 30) || (lpdirs[i] > 330)) {
                      lprads[i] += 0.5*charH;
                    } else if ((lpdirs[i] < 75) || (lpdirs[i] > 285)) {
                       lprads[i] += 0.3*charH;
                    }
                  }
                } //BF200212.1
              } else { // right or left complex: parallel|orthogonal to atstr
                if ((obi <45) || (obi > 315)) { // right
                  lpdirs = [90,270,180,0];
                  lprads = [charH,1.2*charH,charH,1.2*charH];
                } else if ((obi >= 135) && (obi <= 225)) { // left
                  lpdirs = [270,90,0,180];
                  lprads = [1.2*charH,charH,ctxx.measureText(atstr.charAt(0)).width];
                } else if ((obi >= 45) && (obi <= 90)) { // up right
                  lpdirs = [90,180,270,0];
                  lprads = [ctxx.measureText(atstr.charAt(0)).width,charH,1.2*charH];
                } else if ((obi > 90) && (obi < 135)) { // up left
                  lpdirs = [90,0,270,180];
                  lprads = [ctxx.measureText(atstr.charAt(0)).width,charH,1.2*charH];
                } else if ((obi >= 270) && (obi <= 315)) { // down right
                  lpdirs = [270,180,90,0];
                  lprads = [1.2*charH,charH,1.3*charH,1.2*charH];
                } else if ((obi > 225) && (obi < 270)) { //down left
                  lpdirs = [270,0,90,180];
                  lprads = [1.2*charH,charH,1.3*charH,1.2*charH];
                }
              }
              break;
            case 2:
              if (atdi==='simple') { // SIMPLE: LP without radical       
                obi = norma(bisectors[0]+180);
                if (m[ix].nlp === 1) {
                  lpdirs = [obi];
                  if (atstr.length===2) {
                    lprads[0]= ((obi < 45) || (obi > 315))? 1.3*charH : 0.9*charH;
                  } else {
                    lprads[0]= 1.0*charH;
                  }
                } else if (m[ix].nlp > 1) {
                  lpdirs = [norma(obi+45),norma(obi-45),norma(obi+180)];
                  if (atstr.length === 2) {
                    for (i=0;i<m[ix].nlp;i++) {
                      if (((lpdirs[i] < 60) || (lpdirs[i] > 300)) && (i < 2)) {
                       lprads[i] += 0.5*charH;
                      } else if (((lpdirs[i] < 80) || (lpdirs[i] > 280)) && (i === 2)) {
                       lprads[i] += 0.25*charH;
                      }
                    }
                  }
                }
              } else {  // COMPLEX: LP without radical            
                obi=bisectors[0]; // small sector
                lprads[2] += 0.6*charH;
                if ((obi > 45) && (obi < 135)) {
                  lpdirs = [obi,(atdi==='right')? norma(obi+120) : norma(obi-120),(atdi==='right')? norma(obi-120) : norma(obi+120),norma(obi-90)];
                } else {
                  lpdirs = [obi,(atdi==='right')? norma(obi-120) : norma(obi+120),(atdi==='right')? norma(obi+120) : norma(obi-120),norma(obi-90)];
                }
                if ((obi < 45) || (obi > 315) || ((obi > 135) && (obi < 225))) { // right or left
                  lprads[1] += 0.6*charH;
                }
              }
              break;
            default: // 3 and more bonds
              if (atdi==='simple') { // SIMPLE: LP without radical 
                lpdirs = [bisectors[bisectors.length-1],bisectors[bisectors.length-3],bisectors[bisectors.length-2]];
                lpsect=[bisectors.length-1,bisectors.length-3,bisectors.length-2];
                lprads = [1.2*charH,1.2*charH,1.2*charH];
                if (atstr.length === 2) {
                  for (i=0;i<m[ix].nlp;i++) {
                    if (((lpdirs[i] < 60) || (lpdirs[i] > 300)) && (i < 2)) {
                     lprads[i] += 0.5*charH;
                    }
                  }
                }
              } else { // COMPLEX: LP without radical
                if (atstrsector!==bisectors.length-1) { 
                  lpdirs = [bisectors[bisectors.length-1],bisectors[bisectors.length-2],bisectors[bisectors.length-3]];
                  lpsect=[bisectors.length-1,bisectors.length-2,bisectors.length-3];
                } else {
                  lpdirs = [bisectors[bisectors.length-2],bisectors[bisectors.length-3],bisectors[bisectors.length-1]];
                  lpsect=[bisectors.length-2,bisectors.length-3,bisectors.length-1];
                }
                lprads = [1.2*charH,1.2*charH,1.2*charH];
              }
              break;
          } // end lone pair params         
        }
        //ATSTR FOR SIMPLE
        // atstr less than 2 chars or element and at least one bond,  or carbene/nitrene
        // put atstr centered on atom and place charge string independently
        if ((atdi==='simple') && (atstr !== '')) {
          xpos = m[ix].x - chof;
          ypos = m[ix].y + charH/2;
          
          // carbene/nitrene
          if (atstr.includes(':')) { // start of BF191029.1   carbene or nitrene
            if (atsubstr = atstr.match(/([CN]):(H)(\d{0,1})/)) { //right side atom label with H
              atstr = atsubstr[1]+atsubstr[2]+atsubstr[3]; //BF200101.3
              ctxx.save();
              ctxx.font = String(charH)+"pt Times New Roman serif bold";
              ctxx.fillStyle='DarkGreen';
              ctxx.clearRect(xpos, ypos-charH, ctxx.measureText(atstr).width+cd, charH+cd); 
              ctxx.fillText(atsubstr[1],xpos,ypos);
              ctxx.restore();
              xpos += ctxx.measureText(atsubstr[1]).width;
              ctxx.fillText(atsubstr[2],xpos,ypos);
              if (atsubstr[3]!=='') {//BF200101.3
                xpos += ctxx.measureText(atsubstr[2]).width; //BF200101.3
                ypos += 4; //BF200101.3
                ctxx.save();
                ctxx.font = String(charH-2)+"pt Arial";
                ctxx.fillText(atsubstr[3],xpos,ypos);
                ctxx.restore();                
              } //BF200101.3 
              
            } else if (atsubstr = atstr.match(/(\d{0,1}H)([CN]):/)) { // left side atom label with H
              atstr = atsubstr[2];
              ctxx.clearRect(xpos, ypos-charH, ctxx.measureText(atstr).width+cd, charH+cd); 
              ctxx.save();
              ctxx.font = String(charH)+"pt Times New Roman serif bold";
              ctxx.fillStyle='DarkGreen';
              ctxx.fillText(atstr,xpos,ypos);
              ctxx.restore();
              atstr = atsubstr[1];
              xpos -= ctxx.measureText(atsubstr[1]).width;
              ctxx.clearRect(xpos, ypos-charH, ctxx.measureText(atstr).width+cd, charH+cd); 
              ctxx.fillText(atstr,xpos,ypos);
            } else {
              atstr = atstr.replace(':','');
              ctxx.save();
              ctxx.font = String(charH)+"pt Times New Roman serif bold";
              ctxx.fillStyle='DarkGreen';
              ctxx.clearRect(xpos, ypos-charH, ctxx.measureText(atstr).width+cd, charH+cd); 
              ctxx.fillText(atstr,xpos,ypos);
              ctxx.restore();
            } 
          // not carbene/nitrene             
          } else {
            ctxx.clearRect(xpos-1, ypos-charH, ctxx.measureText(atstr).width+cd+2, charH+cd+1); 
            ctxx.fillText(atstr,xpos,ypos);
          } // end of BF191029.1
        }
        //CHARGE FOR SIMPLE or bond-charge collision with complex and >= 3 bonds
        if  ((cstr !== '') && ((atdi==='simple') || (chovl))) { 
          switch (m[ix].bpa.length) {
            case 0:
              obi=30;
              cvrad = (atstr.length===1)? 1.2*charH : 1.6*charH; //BF200101.4a
              if (m[ix].nlp > 2) {
                cvrad += 0.6*charH;
              }
              if ((m[ix].r) && (m[ix].nlp > 2)) {
                cvrad = lprads[2] + 0.8*charH;
              }
              break;
            case 1:
              obi = bisectors[0];
              if ((obi > 150) && (obi < 200)) { //left
                obi = norma(obi-15);
              } else if ((obi > 340) || (obi < 20)) { //rigth
                obi = norma(obi+15);
              }
              if ((atstr.length < 2) && (!chovl)) {
                cvrad = 1.3*charH;
                if (atstr==='') {
                  cvrad = 0.8*charH;
                }
                if ((cdig!=='') && (obi > 120) && (obi < 240)) {
                  cvrad = ctxx.measureText(cstr).width + 0.6*charH;
                }
                if (m[ix].nlp > 2) { 
                  cvrad += 0.8*charH;
                }
                if ((m[ix].nlp > 0) && (m[ix].bpa[0].t===2)) { 
                  cvrad = lprads[0] + 0.6*charH;
                }
              } else if (atstr.length===2) {
                if ((obi < 45) || (obi > 315)) { // right
                  cvrad = (cdig!=='')? 1.2*charH : 1.8*charH ;
                } else if ((obi > 135) && (obi < 225)) { //left
                  cvrad = (cdig!=='')? 1.2*charH : 1.4*charH ;
                } else if ((obi <= 135) && (obi >= 45)) { // up
                  cvrad = (cdig!=='')? 0.8*charH : 1.2*charH ;
                } else if ((obi >= 225) && (obi <= 315)) { //down
                  cvrad = 1.0*charH;
                } 
                if (cdig!=='') {
                  cvrad += 0.4*charH;
                }
                if (m[ix].nlp > 2) {
                  cvrad += 1.2*charH;
                }
              }
              if (m[ix].r) {
//                 cvrad += 0.5*charH;
                cvrad = rrad + 1.2*charH;
              }
              break;
            case 2:
              obi = bisectors[0]; 
              if (m[ix].r) {
                cvrad = rrad + 1.0*charH;
              } else if ((atstr.length > 1) && ((obi < 45) ||(obi > 315))) {
                cvrad = 1.8*charH;
              } else {
                cvrad = 1.4*charH;
              }
              if ((m[ix].nlp > 2) && (!m[ix].r)) {
               cvrad = lprads[2] + 0.5*charH;
              }
              break;
            case 3:
            case 4:
            case 5:
            case 6:
              if ((atstrsector===bisectors.length-2) && (chovl)) { // atstr in 2nd largest sector with overlap
                if (m[ix].nlp < 2) { // less than 2 LP: free sector available for charge
                  obi = bisectors[bisectors.length-3]; // charge goes to 3rd largest sector
                  csect=bisectors.length-3;
                  cvrad = 1.4*charH;
                } else { // 2 LP: charge goes in same sector as LP2
                  cvrad = lprads[1] + 0.6*charH;
                }                  
              } else { // 2nd largest sector is free for charge
                obi = bisectors[bisectors.length-2]; // charge goes to 2nd largest sector
                csect=bisectors.length-2;
                cvrad = 1.4*charH;
                if ((atstr.length===2) && ((obi < 60) || (obi > 300))) { // right
                  cvrad += 0.2*charH;
                }
              }
              if (m[ix].r) {
                cvrad = rrad + 1.0*charH;
              }
              if (atstr==='') {
                cvrad -= 0.2*charH;
              }
              break;
            default:
              break;
          }
          cv = calcCstrOffsetVector(cvrad,obi);
          xpos = m[ix].x+cv.x;
          ypos = m[ix].y+cv.y;
          ctxx.font = String(charH+2)+'pt';
          if (cdig.length > 0) { 
            xpos = m[ix].x+cv.x-0.6*ctxx.measureText('+').width;
            ypos = m[ix].y+cv.y+charH/2;
            ctxx.fillStyle = 'black';
            ctxx.fillText(cdig,xpos,ypos);
            xpos += (ctxx.measureText(cdig).width+charH/2);
            ypos -= 0.6*ctxx.measureText('+').width;
          }          
          drawPlusMinus(ctxx,xpos,ypos,(m[ix].c > 0)? '+' : '–');
        }  // end charge for simple        
        
        if ((atdi==='right') || (atdi==='left')) { // COMPLEX ATSTR together with CHARGE
          if (atdi==='left') { // left side
            cw = (-1)*(ctxx.measureText(atstr).width - chof);
          } else {
            cw = (-1)*chof;
          }

          // RIGHT
          if (atsubstr = atstr.match(/([A-Za-z]{1,2})H(\d{1,2})/)) { // ele-H-zif-charge
            ele = atsubstr[1];
            zif=atsubstr[2];
            xpos = m[ix].x-ctxx.measureText(ele.charAt(0)).width/2; // middle of first char is at m[].x
            ypos = m[ix].y+charH/2; // middle of first char is at m[].y
            ctxx.clearRect(xpos, ypos-charH, ctxx.measureText(ele + "H").width, charH); 
            ctxx.fillText(ele + "H",xpos,ypos);
            xpos += ctxx.measureText(ele + "H").width;
            ypos += 4; // zif is subscript
            ctxx.clearRect(xpos, ypos-charH, ctxx.measureText(zif).width, charH); 
            ctxx.fillText(zif,xpos,ypos);
            xpos += ctxx.measureText(zif).width+2;
            ypos -= 4; // back to baseline
            if ((cstr !='') && (!chovl)) { // charge
              ypos -= 0.6*charH;
              if (cdig.length > 0) { 
                ctxx.fillStyle = 'black';
                ctxx.fillText(cdig,xpos,ypos);
                xpos += (ctxx.measureText(cdig).width+0.2*charH);
              }          
              ypos -= 0.6*ctxx.measureText('+').width;
              drawPlusMinus(ctxx,xpos+4,ypos,(m[ix].c > 0)? '+' : '–');
            }
          // LEFT 
          } else if (atsubstr = atstr.match(/H(\d{1,2})([A-Za-z]{1,2})/)) { // charge-H-zif-ele
            ele = atsubstr[2];
            zif = atsubstr[1];
            xpos = m[ix].x+cw;
            ypos = m[ix].y + charH/2;
            ctxx.clearRect(xpos, ypos-charH, ctxx.measureText("H").width, charH); 
            ctxx.fillText("H",xpos,ypos);
            xpos += ctxx.measureText("H").width;
            ypos += 4;
            ctxx.clearRect(xpos, ypos-charH, ctxx.measureText(zif).width, charH); 
            ctxx.fillText(zif,xpos,ypos);
            xpos += ctxx.measureText(zif).width;
            ypos -= 4;
            ctxx.clearRect(xpos, ypos-charH, ctxx.measureText(ele).width, charH); 
            ctxx.fillText(ele,xpos,ypos);
            xpos = m[ix].x+cw;
            if ((cstr !='') && (!chovl)) { // charge
              ypos -= 0.6*charH; // charge is superscript
              xpos -= (ctxx.measureText('+').width);         
              ypos -= (0.6*ctxx.measureText('+').width);
              drawPlusMinus(ctxx,xpos,ypos,(m[ix].c > 0)? '+' : '–');
              if (cdig.length > 0) { 
                ctxx.fillStyle = 'black';
                ypos += (0.6*ctxx.measureText('+').width);
                xpos -= (ctxx.measureText(cdig).width+charH/2);
                ctxx.fillText(cdig,xpos,ypos);
              } 
            }
          } else {        
            if ((atstr.match(/^H/) && (!((atstr === 'H') && (m[ix].bpa.length===0))))) { // leftside atstr: begins with single H
              xpos = m[ix].x-ctxx.measureText(atstr).width+ctxx.measureText(atstr.charAt(0)).width/2;
              ypos = m[ix].y+charH/2;
              ctxx.clearRect(xpos, ypos-charH,ctxx.measureText(atstr).width, charH); 
              ctxx.fillStyle = 'black'; 
              ctxx.fillText(atstr,xpos,ypos);
            if ((cstr !='') && (!chovl)) { // charge
                ypos -= 0.6*charH;
                xpos -= (ctxx.measureText('+').width);         
                ypos -= (0.6*ctxx.measureText('+').width);
                drawPlusMinus(ctxx,xpos,ypos,(m[ix].c > 0)? '+' : '–');
                if (cdig.length > 0) { 
                  ctxx.fillStyle = 'black';
                  xpos -= (ctxx.measureText(cdig).width+charH/2);
                  ypos += 0.6*ctxx.measureText('+').width;
                  ctxx.fillText(cdig,xpos,ypos);
                } 
              }
            } else { // right atstr ending with single H
              xpos = m[ix].x-ctxx.measureText(atstr.charAt(0)).width/2
              ypos = m[ix].y+charH/2;
              ctxx.clearRect(xpos, ypos - charH, ctxx.measureText(atstr).width, charH); 
              ctxx.fillStyle = 'black'; 
              ctxx.fillText(atstr,xpos,ypos);
              xpos += ctxx.measureText(atstr).width+0.5*charH;                
              if ((cstr !='') && (!chovl)) { // charge
                if (m[ix].nlp > 3) { xpos += 0.8*charH; }
                ypos -= 4;
                if (cdig.length > 0) { 
                  xpos -= 0.4*charH;
                  ctxx.fillStyle = 'black';
                  ctxx.fillText(cdig,xpos,ypos);
                  xpos += (ctxx.measureText(cdig).width+charH/2);
                }          
                ypos -= 0.6*ctxx.measureText('+').width;
                drawPlusMinus(ctxx,xpos,ypos,(m[ix].c > 0)? '+' : '–');
              }
            }
          }
        }
        ctxx.restore();
        if (m[ix].nlp > 0) {
          drawLonePairs(ctxx,ix);
        }
        
      //functions inside scope of drawAtomLabels
      
        function drawLonePairs(ctxx,ix) {
            //param:  ctxx: canvas context
            //        ix: index of atom
            // position/direction of lone pairs as defined in lpdirs[] and lprads[] (filled in drawAtomLabels())

          let i=0;
          const lpw = 4;
          const lpC = {x1:0, y1:0, x2:0, y2:0};
          let lpcx = 0;
          let lpcy = 0;
          const lpd = 0.3*charH;
          const nlp = String(m[ix].nlp);
          
    
          ctxx.save();
          ctxx.fillStyle = 'blue';
          for (i=0; i<nlp;i++) {
            lpcx = m[ix].x + lprads[i]*Math.cos(Math.PI*norma(lpdirs[i])/180);
            lpcy = m[ix].y - lprads[i]*Math.sin(Math.PI*norma(lpdirs[i])/180);
            lpC.x1 = lpcx + lpd*Math.cos(Math.PI*norma(lpdirs[i]+90)/180);
            lpC.y1 = lpcy - lpd*Math.sin(Math.PI*norma(lpdirs[i]+90)/180);
            lpC.x2 = lpcx + lpd*Math.cos(Math.PI*norma(lpdirs[i]-90)/180);
            lpC.y2 = lpcy - lpd*Math.sin(Math.PI*norma(lpdirs[i]-90)/180);

            ctxx.beginPath();
            ctxx.arc(lpC.x1, lpC.y1, lpw/2, 0, Math.PI * 2);
            ctxx.fill();
            ctxx.beginPath();
            ctxx.arc(lpC.x2, lpC.y2, lpw/2, 0, Math.PI * 2);
            ctxx.fill();
          }
          ctxx.restore();
        }

        function drawPlusMinus(ctxx,cx,cy,pm) {
          ctxx.save();
          ctxx.font = String(charH+2)+'pt';
          ctxx.strokeStyle = 'black';
          ctxx.lineWidth = 1;
          ctxx.beginPath();
          ctxx.arc(cx, cy, 0.6*ctxx.measureText('+').width, 0, Math.PI * 2);
          ctxx.moveTo(cx-0.6*ctxx.measureText('+').width,cy);
          ctxx.lineTo(cx+0.6*ctxx.measureText('+').width,cy);
          if (pm==='+') {
            ctxx.moveTo(cx,cy-0.6*ctxx.measureText('+').width);
            ctxx.lineTo(cx,cy+0.6*ctxx.measureText('+').width);
          }
          ctxx.stroke();
          ctxx.restore();
        } //draws the '+' and '–' of charges with circle

      } //draw the atom and charge labels, calls drawLonePairs() if there are any
      //mod:200304-1440

      function drawAtomClass(ctxx,ix,alCo) {
        let xpos, ypos;
        const clstr=String(m_s[ix].cl);        
        
        ctxx.save();
        ctxx.font = String(charH) +'pt Arial, Helvetica, sans-serif';
        ctxx.fillStyle = alCo;
        xpos = m[ix].x - 0.5*ctxx.measureText(clstr).width;
        ypos = m[ix].y + charH/2;
        ctxx.clearRect(xpos, ypos-charH, ctxx.measureText(clstr).width, charH); 
        ctxx.fillText(clstr,xpos,ypos);
        ctxx.restore();
      
      } // diagnostic: called from drawMol_s(): draw the atoms class number
      
      function drawArrow(conx,arrox,arwCo) {
        //param:  conx: canvas context
        //        arrox: index in arro[]
        //        arwCo: the color of the arrow
        const st = arro[arrox].st;
        const en = arro[arrox].en;
        const ty = arro[arrox].ty;
        const crv = arro[arrox].crv;
      
        let x1 = 0;
        let y1 = 0;
        let x2 = 0;
        let y2 = 0;
        let pc1x, pc1y, pc2x, pc2y; //the points controlling the shape of the bezier crv
        let deltax, deltay, rat, adir, bdir, di;
        
        if (st < 0) {
          x1 = (m[b[(-1)*st].fra].x + m[b[(-1)*st].toa].x)/2;
          y1 = (m[b[(-1)*st].fra].y + m[b[(-1)*st].toa].y)/2;
        } else if (st > 0) {
          x1 = m[st].x;
          y1 = m[st].y;
        }
        if (en < 0) {
          x2 = (m[b[(-1)*en].fra].x + m[b[(-1)*en].toa].x)/2;
          y2 = (m[b[(-1)*en].fra].y + m[b[(-1)*en].toa].y)/2;
        } else if (en > 0) {
          x2 = m[en].x;
          y2 = m[en].y;
        }

        adir = getdirangle(x1,y1,x2,y2);
        bdir = norma(adir-crv*90);
        
        di = Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
        rat = 0.8*bondlength/di;
        
        deltax = (-1)*crv*rat*di*Math.sin(Math.PI*adir/180);
        deltay = (-1)*crv*rat*di*Math.cos(Math.PI*adir/180);
        
        pc1x = x1+deltax;
        pc1y = y1+deltay;
        pc2x = x2+deltax;
        pc2y = y2+deltay;

        conx.save();
        conx.lineWidth = stdlw;
        conx.strokeStyle = arwCo;
        conx.fillStyle = arwCo;
        conx.beginPath();
        conx.moveTo(x1,y1);
        conx.bezierCurveTo(pc1x,pc1y,pc2x,pc2y,x2,y2);
        conx.stroke();
        conx.beginPath();
        conx.moveTo(x2,y2);
        conx.lineTo(x2-8*Math.cos(Math.PI*norma(bdir-crv*30)/180), y2+8*Math.sin(Math.PI*norma(bdir-crv*30)/180));
        if (ty==='f') {
          conx.moveTo(x2,y2);
          conx.lineTo(x2-8*Math.cos(Math.PI*norma(bdir+crv*45)/180), y2+8*Math.sin(Math.PI*norma(bdir+crv*45)/180));
        }
        conx.stroke();        
        conx.restore();
      
      } // draw the curved arrows

      function reCalcRxnArwCoord(rx) {
        let sbr = new Rect(0,0,0,0);
        let ebr = new Rect(0,0,0,0);
        
        clearSelection();
        selMultiTrees(rxnarro[rx].stn,10);
        sbr = getboundrect(m,10,'s');
        selMultiTrees(rxnarro[rx].etn,20);
        ebr = getboundrect(m,20,'s');
        rxnco = [];
        calcNewRxnArwCoord(rxnarro[rx].stn,rxnarro[rx].etn,sbr,ebr);
        rxnarro[rx].sco.x = rxnco[0];
        rxnarro[rx].sco.y = rxnco[1];
        rxnarro[rx].eco.x = rxnco[2];
        rxnarro[rx].eco.y = rxnco[3];
        rxnco=[];
        clearSelection();
      } // calculates start and end points of reaction arrow and stores them in .sco and .eco properties of Rxna{}
                    
      function drawRxnArrow(conx,rxix,col) {
        // params: conx: canvas context; rxix: index of reaction arrow in rxnarro[].
        let s = new Coord(rxnarro[rxix].sco.x,rxnarro[rxix].sco.y);
        let e = new Coord(rxnarro[rxix].eco.x,rxnarro[rxix].eco.y);
        let f=0;
        let d=0;
        let ds=2*crit;
        const ty = rxnarro[rxix].ty;
        const o = new Coord(0,0);
        let ardir=0;
        let atxtlen=0;
        let btxtlen=0;
        
        ardir = getdirangle(s.x,s.y,e.x,e.y);
        if (ty === 2) { // equilibrium: reverse arrow
          o.x = (-1)*crit*Math.cos(Math.PI*norma(ardir-90)/180);
          o.y = crit*Math.sin(Math.PI*norma(ardir-90)/180);
          s = vadd2d(s,o);
          e = vadd2d(e,o);
        }
        conx.save();
        conx.strokeStyle = col;
        conx.fillStyle = col;
        conx.lineWidth = 2;
        conx.beginPath();
        if (ty===3) { // resonance structures: arrow head at start
          conx.moveTo(s.x,s.y);
          conx.lineTo(s.x+2*crit*Math.cos(Math.PI*norma(ardir+30)/180),s.y-2*crit*Math.sin(Math.PI*norma(ardir+30)/180));
          conx.moveTo(s.x,s.y);
          conx.lineTo(s.x+2*crit*Math.cos(Math.PI*norma(ardir-30)/180),s.y-2*crit*Math.sin(Math.PI*norma(ardir-30)/180));          
        }
        // forward arrow
        conx.moveTo(s.x,s.y);
        conx.lineTo(e.x,e.y);
        conx.lineTo(e.x-2*crit*Math.cos(Math.PI*norma(ardir+30)/180),e.y+2*crit*Math.sin(Math.PI*norma(ardir+30)/180));
        conx.moveTo(e.x,e.y);
        conx.lineTo(e.x-2*crit*Math.cos(Math.PI*norma(ardir-30)/180),e.y+2*crit*Math.sin(Math.PI*norma(ardir-30)/180));
        conx.stroke();
        if (ty === 2) { // equilibrium: reverse arrow
          s = vsub2d(s,o);
          e = vsub2d(e,o);
          s = vsub2d(s,o);
          e = vsub2d(e,o);
          conx.beginPath();
          conx.moveTo(e.x,e.y);
          conx.lineTo(s.x,s.y);
          conx.lineTo(s.x+2*crit*Math.cos(Math.PI*norma(ardir+30)/180),s.y-2*crit*Math.sin(Math.PI*norma(ardir+30)/180));
          conx.moveTo(s.x,s.y);
          conx.lineTo(s.x+2*crit*Math.cos(Math.PI*norma(ardir-30)/180),s.y-2*crit*Math.sin(Math.PI*norma(ardir-30)/180));
          conx.stroke();
          s = vadd2d(s,o);
          e = vadd2d(e,o);          
        }
        if ((rxnarro[rxix].aa !== '') && (ty !== 3)) {
          conx.font = String(charH)+'pt sans-serif';
          conx.textBaseline = 'middle';
          ds = (ty===1)? 2*crit : 4*crit;
          atxtlen = conx.measureText(rxnarro[rxix].aa).width;
          f= ((ardir > 270) || (ardir < 90))? 1 : -1;
          d= Math.abs((atxtlen/2)*Math.sin(Math.PI*ardir/180))+ds;
          conx.fillText(rxnarro[rxix].aa,(s.x+e.x)/2-f*d*Math.sin(Math.PI*ardir/180)-atxtlen/2,(s.y+e.y)/2-f*d*Math.cos(Math.PI*ardir/180));          
        }
        if ((rxnarro[rxix].ab !== '') && (ty !== 3)) {
          conx.font = String(charH)+'pt sans-serif';
          conx.textBaseline = 'middle';
          ds = (ty===1)? 2*crit : 4*crit;
          btxtlen = conx.measureText(rxnarro[rxix].ab).width;
          f= ((ardir > 270) || (ardir < 90))? -1 : 1;
          d= Math.abs((btxtlen/2)*Math.sin(Math.PI*ardir/180))+ds;
          conx.fillText(rxnarro[rxix].ab,(s.x+e.x)/2-f*d*Math.sin(Math.PI*ardir/180)-atxtlen/2,(s.y+e.y)/2-f*d*Math.cos(Math.PI*ardir/180));          
        }
        conx.restore();
      }
      
  // clearing a canvas
      function clearDA(cotxx) { 
        cotxx.clearRect(drect.l+2, drect.t+2, drect.w-4, drect.h-4);
      }  // clears the drawing area (drect) of a canvas context   

      function clearIGC() { 
        igctx.clearRect(0, 0, igc.width, igc.height); //171030
      } // clears the intermediate graphics canvas      

  // refresh
      function refresh() {
        bgctx.fillStyle = "white";
        bgctx.clearRect(0,0,bgc.width,bgc.height);
        igctx.clearRect(0,0,igc.width,igc.height);
        pdctx.clearRect(0,0,pdc.width,pdc.height);
        ctx.clearRect(0,0,can.width,can.height);
        sketcherframe();
        resetDV();

        if (m.length > 1) {
          center_scale_all();
        }
        drawMol(ctx,0,true);
        setTool(0);
        setES(0);
      } // called by resizeCanvas(). CURRENTLY also bound to keypress "!", clears all canvases resets drawing variables and redraws frame and molecule(s)


  // FUNCTIONS CHANGING THE MOLECULAR DATA
  // add Atom    
      function addAtom(mar,symbol,xx,yy,dum) {
        let i, newix, dup=0, aNum=0;
      
      // check for existing atoms within crit
        for (i=1;i<mar.length;i++) {
          dup = isnear(m,b,xx,yy);
        }
        if (dup !== 0) { return -dup;} 
        // return the negative index of the existing atom in this place 
        // and do not create new atom
      
        aNum = getAtomicNumber(symbol);
        if (dum) {
          symbol = "(" + symbol + ")";
        }
      
        newix = mar.length;
        mar[newix] = new Atom(aNum, symbol, xx, yy, 0, 0, 0);
        mar[newix].oix = newix;
      
        return newix;
      } // creates a new atom without it's bonds

  // delete Atom
      function deleteAtom(mar, bar, del,arwflag) {
        //params: del: the index of the atom to delete in mar
        //        arwflag:if true: delete arrows in arro[] associated with atom del
        //                if false: do not delete arrows in arro[] associated with atom del
        let i, k;
        let delArw = false;
      
        // trivial case: only one Atom
        if ((mar.length === 2) && (mar === m)) { 
          mar.splice(1,1);
          return;      
        }
        if (arwflag) {
          // delete arrows involving del 
          for (i=0;i<arro.length;i++) {
            delArw = false;
            if ((arro[i].st === del) || (arro[i].en === del)) {
              delArw = true;
            }
            if ((arro[i].st < 0) && (Number.isInteger(arro[i].st)) && ((bar[(-1)*arro[i].st].fra === del) || (bar[(-1)*arro[i].st].toa === del))) {
              delArw = true;
            }
            if ((arro[i].en < 0) && (Number.isInteger(arro[i].en)) && ((bar[(-1)*arro[i].en].fra === del) || (bar[(-1)*arro[i].en].toa === del))) {
              delArw = true;
            }
            if (delArw) {
              deleteArrow(i);
              i--; // step back to reexamine the element that was shifted down by the deleteArrow()
            }
          }
        }
        // bonds array
        for (i=1;i<bar.length;i++) {
          if ((bar[i].fra === del) || (bar[i].toa === del )) { // bond to atom to be deleted
            if (arwflag) {
              for (k=0;k<arro.length;k++) { // delete any arrow involving bond to be deleted
                if ((arro[k].st === (-1)*i) || (arro[k].st === (-1)*i)) {
                  deleteArrow(k);
                }
              } 
              decrBixArw(arro,i);
            } else if ((bar===b_st) && (arro_s.length > 0))  { // deleteAtom called from within stripExplH and arrows present
              decrBixArw(arro_s,i);
            }
            bar.splice(i,1); // remove bond containing atom del
            i--;  // step back to reexamine the bond that was shifted down by the splice
          }
        }
        for (i=1;i<bar.length;i++) { // decrement all atom indices > del in bonds by 1 
          if ( bar[i].fra > del ) { bar[i].fra -= 1 ;} // 
          if ( bar[i].toa > del ) { bar[i].toa -= 1 ;} // 
        }

        // bopa arrays of all atoms
        // first, remove del as bonding partner of all atoms
        for (i=1;i<mar.length ;i++) { // always leave the 0-element as dummy
          if ( i=== del) { continue;} // skip the atom to delete
          for (k= 0;k<mar[i].bpa.length;k++) {
            if (mar[i].bpa[k].p === del ) { 
              if ((mar[del].an === 1) && (mar === m)) { // an explicit H is deleted from m[], not m_s[]
              // the second condition is necessary because deleteAtom() is also used to remove all explicit H
              // from the m_s array before SMILES generation, where we want to keep the eh property unchanged
                mar[i].eh -= 1; // decrement the explicit H count
              } 
              mar[i].bpa.splice(k,1) ;
            }  // del appears in the bpa => remove element.
            // step back not necessary because no atom can occur in bpa twice
          }
        }
        // decrement all indices in all abops if they are larger than del
        for (i=1;i<mar.length ;i++) {
          for (k= 0;k<mar[i].bpa.length;k++) {
            if ( i=== del) { continue;} // skip the atom to delete
            if (mar[i].bpa[k].p > del ) {  mar[i].bpa[k].p -= 1 ;}  // decrement indices higher than del in the abops
          }
        }
        
        // decrement all atom indices in arrows if they are larger than del
        if (arwflag) { // for arro[] if called outside getsmiles()
          for (i=0;i<arro.length;i++) {
            if (arro[i].st > del) {
              arro[i].st -= 1;
            }
            if (arro[i].en > del) {
              arro[i].en -= 1;
            }
          }
        } else if ((bar===b_st) && (arro_s.length > 0)) { // for arro_s[] if called from getsmiles()
          for (i=0;i<arro_s.length;i++) {
            if (arro_s[i].st > del) {
              arro_s[i].st -= 1;
            }
            if (arro_s[i].en > del) {
              arro_s[i].en -= 1;
            }
          }
        }        
        // finally, remove the atom del
        mar.splice(del,1);
        if (arwflag) {      
          drawMol(ctx,0,true);
        }
        
        
        function decrBixArw(arwar,dbix) {
          let i=0;
          for (i=0;i<arwar.length;i++) {
            // only change true bond indexes (negative integer), not -x.5 standing for atom to which explH is bound
            if ((arwar[i].st < 0) && (Number.isInteger(arwar[i].st)) && ((-1)*arwar[i].st > dbix)) { //BUGFIX 190412.1
              arwar[i].st += 1;
            }          
            if ((arwar[i].en < 0) && (Number.isInteger(arwar[i].en)) && ((-1)*arwar[i].en > dbix)) { //BUGFIX 190412.1
              arwar[i].en += 1;
            }                  
          }
        }
      } // delete atom, recompacting arrays and adjusting indices of remaining atoms, bonds and arrows 

  // fuse Atoms
      function fuseAtoms(a1,a2) { // fuse atoms a1 and a2, a2 is deleted and the bonding partners of a2 are added to those of a1.
        let i;
      
        for (i=0;i<m[a2].bpa.length;i++) {      
          addBond(m,b, m[a2].bpa[i].p, a1, m[a2].bpa[i].t);
        }
        deleteAtom(m,b, a2, true);
      }  // a1 receives the bonds of a2, which is deleted

  // delete Bond
      function deleteBond(mar,bar,bix) {

        let i = 0, found = -1;
        let from_at, to_at;
        
//      delete arrows starting or ending at the bond to delete
        for (i=0;i<arro.length;i++) {
          if ((arro[i].st === (-1)*bix) || (arro[i].en === (-1)*bix)) {
            deleteArrow(i);
            i--;
          }
        }
//         for all bonds encoded in remaining arrows that have a bond index > bix, reduce index by one
        for (i=0;i<arro.length;i++) {
          if (arro[i].st < 0) { // start at bond 
            if (Math.floor(Math.abs(arro[i].st)) > bix) {
              arro[i].st += 1;
            }
          } 
          if (arro[i].en < 0) { // end at bond 
            if (Math.floor(Math.abs(arro[i].en)) > bix) {
              arro[i].en += 1;
            }
          }
        }

        // remove the bpa entry in both atoms        
        from_at = bar[bix].fra;
        to_at = bar[bix].toa;
        found = -1;
        for (i=0;i<mar[from_at].bpa.length;i++) {
          if (mar[from_at].bpa[i].p === to_at) {
            found = i;
          }
        }
        if ( found >= 0) { mar[from_at].bpa.splice(found,1); }
        found = -1;
        for (i=0;i<mar[to_at].bpa.length;i++) {
          if (mar[to_at].bpa[i].p === from_at) {
            found = i;
          }
        }
        if (found >= 0) {mar[to_at].bpa.splice(found,1); }
        found = -1;
        // remove the bond from the b array
        bar.splice(bix,1);
        
      } // delete bond, recompacting arrays and adjusting indices
    
  // fuse bonds
      function fuseBonds(fa1,ta1,fa2,ta2) {// fuse bond fa2-ta2 with fa1-ta1 and delete atoms fa2 and ta2.
      // atom fa2 will be fused with fa1 and atom ta2 with ta1.
        let bix;
        let ta1x, ta1y, ta1nix, ta2x, ta2y, ta2nix;

        // remember coordinates of ta1 and ta2
        ta1x = m[ta1].x; 
        ta1y = m[ta1].y;  
        ta2x = m[ta2].x; 
        ta2y = m[ta2].y;  
      
        bix = getBondIndex(b,fa2,ta2);
        deleteBond(m,b,bix);
        fuseAtoms(fa1,fa2); // attn: this changes all atom indices!
        // from the saved coordinates, find out the new indices of ta1 and ta2
        ta1nix = isnear(m,b,ta1x,ta1y);
        ta2nix = isnear(m,b,ta2x,ta2y);
        fuseAtoms(ta1nix,ta2nix);        
      }
                
  // add ring
      function addRing(n, indx, side, mode) { // n is the number of vertices. 
      // mode: "atom" => existing atom becomes a member of the ring
      //       "bond" => the two existing atoms of the bond become one of the ring's bonds 
        let i, k, cx, cy, dx, dy, angdeg1, deltadeg, inideg, newangdeg; 
        let newindex=0, newat = 0, oldat = 0, bty = 1;
        let nit, firstat, lastat, fromat, toat;
        let ccw = true;
        let adjdbl = 0;
        const rxof = [0, 0, 0, -0.5*bondlength, -0.5*bondlength, -0.5*bondlength, 0,0,0,0,0,0,0];
        const ryof = [0,0,0,-0.28868*bondlength, 0.5*bondlength,-0.80902*bondlength, bondlength,0,0,0,0,0,0];
      
        if (n === -6) { benzene = true;}
        if(side > 0) {ccw = true; } else if (side < 0) { ccw = false; }
        nit = (n > 0 ) ? n : -n ;  // benz 6 atoms but parameter was negative
      
        // determine the starting point and directional angle of the first bond
        deltadeg = 360/Math.abs(n);
        inideg = (180 - deltadeg)/2;
        angdeg1 = Math.pow(-1,nit)*inideg;
        if (nit === 6) { angdeg1 = 90; }
      
    // atom mode, indx is the index of the atom in the m[] array
        if (mode === "atom") {
          if ((m.length === 1) || ((kc % 2) === 1)) { // no atom yet or isolated ring
          // add an atom where the last mouse up was 
            cx = lmux + rxof[nit];
            cy = lmuy + ryof[nit];
            newindex = addAtom(m,"C", cx, cy,false); 
            if (newindex > 0) {  
              indx = newindex;
            }
          }      
          if ((indx > 0) && (m[indx].bpa.length === 0)) { // atom present but no Bond
            cx = m[indx].x;
            cy = m[indx].y; // the indx becomes a vertex
          } else if ((indx > 0) && (m[indx].bpa.length === 1)) { // one bond to indx
            cx = m[indx].x;
            cy = m[indx].y; // the indx becomes a vertex
            angdeg1 = getPrefBisect(m,indx);
          } else if ((indx > 0) && (m[indx].bpa.length === 2) && (m[indx].bpa[0].t === 1) && (m[indx].bpa[1].t === 1) && (n > 0)) { 
          // two bonds: spiro ring but never with benz
            cx = m[indx].x;
            cy = m[indx].y; // the indx becomes a vertex
            angdeg1 = getPrefBisect(m,indx);// seen towards CA
          } else { return; }// no spiro rings for atoms with more than 2 bonds
          firstat = indx;
          lastat = indx; 
        } // end atom mode        
    // bond mode indx is the index of the bond in the b[] array        
        if (mode === "bond") {
          if (b[indx].btyp === 0) { return; } // trap if not valid bond
      
        // direction is based on bond direction of b[indx]
        // the question of on which side has to be solved
        // the iteration goes over one bond less

          nit--;  // one atom less to add in bond mode
          // what's the bond type of the fusion-bond?
          if ((b[indx].btyp === 4) || (b[indx].btyp === 5)) { // if stereo, make it single
            changeBondType(m,b,indx, 1,true);
          }
          if (( b[indx].btyp === 1 ) && ( n === -6)) { // benz fusion, fusion bond is single
            // determine whether it is adjacent to a double bond
            fromat = b[indx].fra;
            toat = b[indx].toa;
            adjdbl = 0;
            k = 0;
            while (k < m[fromat].bpa.length) {
              if ( m[fromat].bpa[k].t === 2 ) {
                adjdbl += 1;
                break;
              }
              k++;
            }
            k=0;
            while (k < m[toat].bpa.length) {
              if ( m[toat].bpa[k].t === 2 ) {
                adjdbl += 1;
                break;
              }
              k++;
            }
            if ( adjdbl === 0) { changeBondType(m,b,indx, 2, true); }  // single bond with no adjacent double bonds => make it double
            // the case of two adjacent double bonds ( adjdbl === 2) is accepted for fusion of benz rings to benz rings
          } else if (b[indx].btyp > 2 ) { // no ring fusion to triple bonds!
            benzene = false;
            return; 
          }           

          firstat = b[indx].fra;            
          lastat = b[indx].toa;            
          cx = m[firstat].x;
          cy = m[firstat].y;
          bty = 1;
          angdeg1 = getdiranglefromAt(m,firstat, lastat); // bond direction firstat->lastat (fra->toa)  normed.      
          inideg= 180 - 360/Math.abs(n); // always > 0 since n>2
          if ( !ccw ) {
            inideg = (-1)*inideg;
            deltadeg = (-1)*deltadeg;
          }
        }  // end bond mode
      // add all the atoms and bonds iteratively        
      newangdeg = norma(angdeg1 - inideg);
      oldat = firstat;
      for (i = 0; i<nit-1;i++) { // over all bonds of the ring
        dx = bondlength * Math.cos(Math.PI * newangdeg/180);
        dy = bondlength * (-1)*Math.sin(Math.PI * newangdeg/180);
        newx = cx + dx;
        newy = cy + dy;
        newat = addAtom(m,"C", newx, newy,false);
        if (newat < 0) { // 
          newat = Math.abs(newat); // use existing atom for newat
        }
        if (n === -6) { 
          bty = ((i % 2) + 1); // always start with single bond, and alternate thereafter
        } else {
          bty = 1;  // not benz: all bonds are single
        }
        addBond(m,b,oldat, newat, bty);
        oldat = newat;

        newangdeg = norma(newangdeg + deltadeg);
        cx = newx;
        cy = newy;
      }
      if ((n === -6) && (bty === 1)) { bty = 2; } else { bty = 1; }        
      addBond(m,b,oldat, lastat, bty);

      ccw = true;
      benzene = false;
    
    } 

  // add chain
      function addChain(na, chainx, chainy, inidir, devi) {
        let stx, sty, dx, dy, nt=0, iter;
        let oldatom, newatom;
      

        iter = ((nt % 2) === 0) ? 1 : -1;
        dx = bondlength*Math.cos(Math.PI*norma(inidir + iter*devi*30)/180);
        dy = -bondlength*Math.sin(Math.PI*norma(inidir + iter*devi*30)/180);
      
        if (!chainOnAtom) {
          oldatom = addAtom(m,"C", chainx, chainy,false);  
          if (!oldatom > 0) { 
            return;
          }      
        } else {
          oldatom = lmdisn;
        }          
        stx = m[oldatom].x;
        sty = m[oldatom].y;
        oldx = stx;
        oldy = sty;
        for (nt = 0; nt<na-1;nt++) {
          iter = ((nt % 2) === 0) ? 1 : -1;
          dx = bondlength*Math.cos(Math.PI*norma(inidir + iter*devi*30)/180);
          dy = -bondlength*Math.sin(Math.PI*norma(inidir + iter*devi*30)/180);
          stx += dx;
          sty += dy;
          newatom = addAtom(m,"C", stx, sty,false);
          if (newatom < 0) {
            newatom = Math.abs(newatom);
          }
          addBond(m,b,oldatom, newatom, 1);
          oldatom = newatom;
          oldx = stx;
          oldy = sty;
        }
      } // straight chain
    
  // add mesh
      function addMesh(na) {
        let cox=0, coy=0;
      
        let stx, sty, nt=0;
        let oldatom, newatom, atToLink=-1;


        if (meshOnAtom === false) {  // drawn in free space, the first atom in meshAt must be added to m
          cox = meshAt[0].x;
          coy = meshAt[0].y;
          oldatom = addAtom(m,"C", cox, coy, false);
          if (oldatom < 0) {
            oldatom = Math.abs(oldatom);
          }      
          if ((meshToConnect >= 0) && ( meshToConnect === 0)) {
            atToLink = oldatom;
          }
        } else {  // drawn starting at existing atom, dont use the first element of meshAt
          oldatom = lmdisn;
        }          
        stx = m[oldatom].x;
        sty = m[oldatom].y;
        oldx = stx;
        oldy = sty;
        for (nt = 1; nt<na ;nt++) { // start with the second element of meshAt
          cox = meshAt[nt].x;
          coy = meshAt[nt].y;
          stx = cox;
          sty = coy;
          newatom = addAtom(m,"C", stx, sty,false);
          if (newatom < 0) {
            newatom = Math.abs(newatom);
          }
          if ((meshToConnect >= 0) && ( nt === meshToConnect)) {
            atToLink = newatom;
          }
          addBond(m,b,oldatom, newatom, 1);
          oldatom = newatom;
          oldx = stx;
          oldy = sty;
        }
        if (atToConnect > 0) {
          newatom = atToConnect;
          addBond(m,b,oldatom, newatom, 1);
          atToConnect = 0;
        }
        if (atToLink >= 0) {
          newatom = atToLink;
          addBond(m,b,oldatom, newatom, 1);
          atToLink = -1;
        }
      }  // variable chain
    
  // delete tree
      function deleteTree(sel) {
        let i=0;
        let jj=0;
        let tnr=0;
      
        i = 1;
        while (i < m.length) {
          if (m[i].s === sel) {
            tnr = m[i].t;
            deleteAtom(m,b,i,true);
            i--;
          }
          i++;
        }
        i = 1;
        while (i < m.length) {
          if (m[i].t > tnr) {
            m[i].t -= 1;
          }
          i++;
        }
        if (rxnarro.length > 0) {
          for (i=0;i<rxnarro.length;i++) {
            // if the deleted tree is on either end of a rxn arrow, delete the rxn arrow
            if (((rxnarro[i].stn.length===1) && (rxnarro[i].stn[0]===tnr)) || ((rxnarro[i].etn.length===1) && (rxnarro[i].etn[0]===tnr))) {
              deleteRxnArrow(i);
              i--;
              continue;
            }  
            // remove the tree to be deleted from rxn arrow's .stn and .etn
            if (rxnarro[i].stn.includes(tnr)) {
              rxnarro[i].stn.splice(rxnarro[i].stn.indexOf(tnr),1);
            }
            if (rxnarro[i].etn.includes(tnr)) {
              rxnarro[i].etn.splice(rxnarro[i].etn.indexOf(tnr),1);
            }
            // decrement all tree numbers above tnr in rxn arrows' .stn and .etn properties
            for (jj=0;jj<rxnarro[i].stn.length;jj++) {
              if (rxnarro[i].stn[jj] > tnr) {
                 rxnarro[i].stn[jj] -= 1;
              }
            }
            for (jj=0;jj<rxnarro[i].etn.length;jj++) {
              if (rxnarro[i].etn[jj] > tnr) {
                 rxnarro[i].etn[jj] -= 1;
              }
            }
          }
        }
        if (rxnarro.length > 0) {
          for (i=0;i<rxnarro.length;i++) {
             reCalcRxnArwCoord(i);
          }
        }
        clearIGC();
        clearSelection();
        saveState();
        resetDV();
        drawMol(ctx,0,true);
      } // deletes a tree and if linked to reaction arrow(s), also the reaction arrow(s)

      function deleteRxnArrow(rxix) {
        // param: rxix: index of arrow to delete in rxnarro[]
        let i=0;
        let jj=0;
        
        if (rxnarro[rxix] !== undefined) { 
          // remove registry of this arrow in all atoms
          for (i=1;i<m.length;i++) {
            if ( m[i].rxs.includes(rxix)) {
              m[i].rxs.splice( m[i].rxs.indexOf(rxix),1);
            }
            if ( m[i].rxe.includes(rxix)) {
              m[i].rxe.splice( m[i].rxe.indexOf(rxix),1);
            }
          }
          // decrement all rxnarro indices in m[].rxs and m[].rxe that are larger than rxix by one
          for (i=1;i<m.length;i++) {
            for (jj=0;jj<m[i].rxs.length;jj++) {
              if (m[i].rxs[jj] > rxix) {
                m[i].rxs[jj] -= 1;
              }
            }
            for (jj=0;jj<m[i].rxe.length;jj++) {
              if (m[i].rxe[jj] > rxix) {
                m[i].rxe[jj] -= 1;
              }
            }
          }
          // delete the rxn arrow 
          rxnarro.splice(rxix,1);
        }
      } // delete reaction arrow
      
  // clear molecule
      function clearMol() {

        // reset variables in drawCanvas() scope
        m.length = 1; // index 0 contains a dummy atom
        m_s.length = 1; // index 0 contains a dummy atom
        m_s0.length = 1; // index 0 contains a dummy atom
        m_st.length = 1; // index 0 contains a dummy atom
        m4cc.length = 0; // index 0 contains a dummy atom
        b.length = 1; // index 0 contains a dummy bond
        b_s.length = 1; // index 0 contains a dummy bond
        b_s0.length = 1; // index 0 contains a dummy bond
        b_st.length = 1; // index 0 contains a dummy bond
        arro = []; // array storing curved arrows
        rxnarro = []; // array storing Rxnarw{} objects
        nmol=0;
        

        savedStates = []; // array of State objects for undo()
        meshAt = []; // array of atom indices; filled in mousemove, used in mouseup
        arro = []; //array storing the Arrow{} objects
        arro_s = []; //shadow array of arrows for SMILES
        rxnarro = []; // array storing Rxnarw{} objects
        rxn_s = []; // shadow array of rxn arrows for SMILES

        lig.length = 1; // index 0 contains a dummy bond;
      
        //arrays used by functions in several sections: have to be in the drawCanvas scope
        bridgeheads = []; // array with atom indices of bridgeheads. Filled by findBridgeheads() !!used also by stereobonds()
        ccSense = {}; // dict: key is string with atom index of central atom, value is @ or @@
        cumulat = []; // array with the atom indices of all cumulene atoms  !! used in getsmiles() and parseSMILES()
        ezCC = []; // array of cumulene objects containing even cumulenes !!used also by parseSMILES()
        incoming = []; // array specifiying for each atom the "incoming" atom. index is parallel to m[]. Filled by dfsRC !!used also by flipBranch()
        mol_brects = []; // the bounding rects of all trees
        molgrp_brects = []; // the bounding rects of molgrps
        productTrees = []; // the tree numbers of product Trees
        pscCC = []; // array of potentially stereogenic cumulenes !!used also in smiles parsing
        rcstr = {}; // dict with the atom index as key and the ring closures string as value. Filled by dfsRC() !! used also by smiles parsing
        reactantTrees = []; // the tree numbers of reactant Trees
        ringatoms = []; // array containing atom indices off all atoms in rings. Filled by findRingBonds() !!used also in smiles parsing
        ringbonds = []; // array of indices in b-type arrays. Filled in findRingBonds(), required by isSCcandidate,!! used by several sections
        ringclosures = []; // array of strings xx:yy with xx and yy being atom indices of atoms in ring closure !!used by several sections
        rings = [];  // 2D array. rings[ringnumber][index in ring]. Values are the atom indices !!used by several sections
        sectors = []; // array of Sector{} objects containing the sectors between bonds around an atom !! used in several sections
        selAt = []; // the atoms inside the selection span rectangle
        selTrees = []; // the tree numbers of selected Trees
        smilesarray = []; // array of atom indices in the order from dfsSmiles !! used in several sections
        visnodesDFS = []; // array of the nodes visited by dfs(). Values are atom indices !!used by several sections
        warnAtoms = []; //!!used in getsmiles and parseSMILES: the atoms that will be shown with a red square

        // primitive variables
        ae = 0;  // index of the active element/radical/charge tool
        at = 0; // index of the active bond/ring/chain/erase tool
        getTxtcaller=""; // remembers the caller function of getText()
        kc=0; // alt and shift key state 0=none, 10=shift, 1=alt 11=alt and shift
        nmol = 0; // number of molecules (trees)
        nRings = 0; // the number of rings. Calculated from the number of bonding partners of each atom by numRings()
        nTSring=0; //current ring-size for n-ring tool
        
        // globals required to remember things from one mouse event to the next one
        atToConnect=0; // transfer from mousemove to addMesh 
        cex = 0;
        cey = 0;
        chainstx = 0; 
        chainsty = 0;
        curv = 0;
        hlArw = -1; // the index of the highlighted arrow (-1 if none) in arro[]
        hlAt = 0; // the index of the highlighted atom (0 if none) in m[]
        hlBo = 0; // the index of the highlighted bond (0 if none) in b[]
        hlRxa = -1; // the index of the highlighted rxn arrow (-1 if none) in rxnarro[]
        imgx=0;
        imgy=0;
        lastcurv = 0;
        lastmdir = -1;
        lastsx = 0;
        lastsy = 0;
        lastx1 = 0; // last mouse coordinates. Transfer from mousemove to mouseup
        lastx2 = 0;
        lasty1 = 0;
        lasty2 = 0;
        lmdisn = 0; // last mouse down near atom
        lmdisnb = 0; // last mouse down near bond
        lmdx=0, lmdy=0; // lmdx, lmdy contain the last mouse down position
        lmmisn = 0; // last mouse move near atom
        lmmisna = -1; // last mouse move near arrow
        lmmisnrxa = -1; // // last mouse move near rxn arrow
        lmmisnb = 0; // last mouse move near bond
        lmmx=0, lmmy=0; // lmmx, lmmy contain the last mouse move position
        lmuisn = 0;  // last mouse up near atom
        lmuisna = -1; // last mouse up near arrow
        lmuisnrxa = -1; // last mouse up near rxn arrow
        lmuisnb = 0; // last mouse up near bond
        lmux=0, lmuy=0;  // lmux, lmuy contain the last mouse up position
        meshToConnect=-1; // transfer from mousemove to addMesh
        newx=0;
        newy=0;
        oldchdir = ""; // chain direction, transfer from mousemove to mouseup
        olddev = 1; // chain deviation, transfer from mousemove to mouseup
        oldlmmx = 0;
        oldlmmy = 0;      
        oldmeshdir = 0;
        oldnc = 0; // number of chain members, transfer from mousemove to mouseup 
        oldnewx = 0;
        oldnewy = 0;
        oldx=0;
        oldy=0;
        oox=0;
        ooy=0;
        pDM =""; // the provisional drawing mode
        permstodo = 1; // counter for permutations remaining to be done
        permu = 1; // total permutations due to ties
        rxnco = [];
        selectWhat = 'reactant';
        smiles = "";  // the SMILES string
        vpg = 1; // direction of ring draw relative to bond. Transfer from mousemove to mouseup
        x=0;  // x,y contain the current mouse positon as set by the mouse and touch events
        y=0;  

        // boolean variables
        bondOnAtom = false; // drawing starts at atom
        chainDrawn = false;
        chainOnAtom = false;
        click = false;  // true if mouse down and mouse up occur inside 2 px in x and/or y    
        clickOnAtom = false; // true after click on atom
        clickOnBond = false; // true after click on bond
        clickOnArrow = false; // true after click on arrow
        clickOnRxnArrow = false; // true after click on rxn arrow
        dummy = true;
        hasStereo = false;
        mdraw = false;  // true when mouse is drawing (left button pressed while moving)
        meshDrawn = false;
        meshOnAtom = false;
        mmoved = false; // true when left button pressed and mouse moved by ≥ mmcrit px
        mouseisdown = false; // true when left mouse button is pressed
        nolinedash = false;  // indicator for browsers that do not support linedash
        provArrow = false; 
        provBond = false;
        provBondsToPartners = false;
        provBondWithPartners = false;
        provRing = false;
        sboxVis = false; // visbility of SMILES output box (for result of getsmiles)
        selected = false; // true if something is selected
        shortcuts = false;
        showatnum = false; // flag used in diagnostic
        showsymnum = false; // flag used in diagnostic
        
        // types of tools and elements
        benzene = false; // true if benzene tool is selected
        EScharge = false; // true if one of the •|+|- symbols is selected
        ESelem = false; // true if element is selected
        ESxelem = false; // true if X-element is selected
        TSbond = true; // true if single-,double-,triple bond or wedge up, wedge down selected
        TSchain = false; // true id chain tool selected
        TSerase = false; // true if erase tool selected
        TSlewis = false; // true if one of the Lewis tools is selected
        TSmesh = false; // true if mesh tool selected
        TSring = false; // true if one of the ring tools is selected
        TSrxn = false; // true if one of the rxn tools is selected

        // reset bondlength and dependent constants
        bondlength = (pad)? 45:30;
        updateBondlength(); 
        // dependent on bondlength
        charH = Math.floor(6+(bondlength-15)*(8/30)); //integer for font pt statements
        charW = 5+(bondlength-15)/5; //can be real number, used to calculate length of text 
        charHs = Math.floor(8+(bondlength-15)*(8/30)); //integer for font pt statements
        charWs = 6.5+(bondlength-15)/5; //can be real number, used to calculate length of text 
        crit = bondlength/5;  // critical distance for mouse from atoms
        hlAtRad = (pad)? ((phone)? bondlength/2 : 2*crit) : crit+4; // radius of highlighted circle on atoms        rhR = (pad)? 2*crit : crit+4; // radius of rotation handle
        clickCrit = bondlength/10; //mouse down and up within clickCrit: considered as click
        mmcrit = bondlength/10; // criterion for mousemove: moved by mmcrit -> mmove is true
        bcrit = bondlength/5;  // critical distance for mouse from bond centers
        hlBoRad = (pad)? 15: bcrit+2; // radius of filled circle in center of touched bond
        chainincr = 0.86603*bondlength; // incremental horizontal component of 120° horizontal zig-zag chain
        ofs = Math.round(150*bondlength/dbratio)/100;  // distance between lines of double bond in px
        downlw = 6*ofs;  // linewidth for dashed wedges
        stdlw = (bondlength > 30)? 2:1.5;  // linewidth of a single bond in px

      
        dummy = true;
        setTool(0);
        setES(0);
        drawRingNumber('n');
        showatnum = false; // flag used in diagnostic molDraw_s
        clearIGC();
        pushStateToStack();
      } // clears the drawing area, deletes all molecules and re-initializes all global variables
    
      function adjust_bondlength(factor) {
        bondlength *= factor;
        charH = Math.floor(6+(bondlength-15)*(8/30)); //integer for font pt statements
        charW = 5+(bondlength-15)/5; //can be real number, used to calculate length of text 
        charHs = Math.floor(8+(bondlength-15)*(8/30)); //integer for font pt statements
        charWs = 6.5+(bondlength-15)/5; //can be real number, used to calculate length of text 
        crit = bondlength/5;  // critical distance for mouse from atoms
        hlAtRad = (pad)? ((phone)? bondlength/2 : 2*crit) : crit+4; // radius of highlighted circle on atoms
        rhR = (pad)? 2*crit : crit+4; // radius of rotation handle
        clickCrit = bondlength/10; //mouse down and up within clickCrit: considered as click
        mmcrit = bondlength/10; // criterion for mousemove: moved by mmcrit -> mmove is true
        bcrit = bondlength/5;  // critical distance for mouse from bond centers
        hlBoRad = (pad)? ((phone)? bondlength/3 : 2*bcrit) : bcrit+2;  // radius of filled circle in center of touched bond
        chainincr = 0.86603*bondlength; // incremental horizontal component of 120° horizontal zig-zag chain
        ofs = Math.round(150*bondlength/dbratio)/100;  // distance between lines of double bond in px
        downlw = 6*ofs;  // linewidth for dashed wedges
        stdlw = (bondlength > 30)? 2:1.5;  // linewidth of a single bond in px
      } // adjusts the bondlength if molecule(s) entered via parseSMILES do not fit onto canvas. Reset to original bondlength by clearMol()    
      
      function updateBondlength() {
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.fillRect(zi.x+16,zi.y-6,20,12);
        ctx.font = '10pt Sans-Serif';
        ctx.fillStyle = 'black';
        ctx.fillText(String(Math.round(bondlength)),(zi.x+zo.x)/2-6,zi.y+6);
        ctx.restore();        
      }

      function zoom(inout) {
        let newBl = bondlength;
        const currBl = 5*Math.floor(bondlength/5);
        let factor = 1;
        let gbr = new Rect(0,0,0,0);
        
        clearIGC();
        
        if (m.length < 2) { return; }
        
        if (inout==='in') {
          newBl = currBl+5;
          if (newBl > 50) {
            newBl = 50;
          }
        } else if (inout==='out') {
          newBl = currBl-5;
          if (newBl < 20) {
            newBl = 20;
          }
        }
        factor = newBl/bondlength;
        if (factor > 1) {
          for (i=1;i<m.length;i++) {
            m[i].s = 9;
          }
          gbr = getboundrect(m,9,'s');
          for (i=1;i<m.length;i++) {
            m[i].s = 0;
          }          
          if ((factor*gbr.w > drect.w) || (factor*gbr.h > drect.h)) {
            return;
          }
        }
        adjust_bondlength(factor);
        updateBondlength();
        scaleAllMols(factor);
        clearDA(ctx);
        drawMol(ctx,0,true);
      }
      
      function scaleAllMols(f) {
        let bdr = new Rect(0,0,0,0);
        let i=0;

        for (i=1;i<m.length;i++) {
          m[i].s = 9;
        }
        bdr = getboundrect(m,9,'s');
        shiftTree(m,(arect.l+arect.w/2)-(bdr.l + bdr.w/2),(arect.t+arect.h/2)-(bdr.t + bdr.h/2),9);
        if (rxnarro.length > 0) {
          shiftRxnArrows(rxnarro,(arect.l+arect.w/2)-(bdr.l + bdr.w/2),(arect.t+arect.h/2)-(bdr.t + bdr.h/2));
          shiftMolgrp_brects((arect.l+arect.w/2)-(bdr.l + bdr.w/2),(arect.t+arect.h/2)-(bdr.t + bdr.h/2));
        }
        scale2D(m,9,arect.l+arect.w/2,arect.t+arect.h/2,f,false); 
        if (rxnarro.length > 0) {
          scaleRxnArrows(rxnarro,arect.l+arect.w/2,arect.t+arect.h/2,f);
          scaleRectArray(molgrp_brects,arect.l+arect.w/2,arect.t+arect.h/2,f);
        }
        clearSelection();
        drawMol(ctx,0,true);
      }

      
      function rotTree180(mar,bar,xy,selector) {
        //param: xy: 'x' or 'y' for rotation around x (vertical flip) or y (horizontal flip) axis
        //     selector (number): selects the atoms with mar[].s===selector or, if selector is -1, all atoms for rotation
        let i=0;
        let jj=0;
        let gbr = new Rect(0,0,0,0);
        let hshift = 0;
        let vshift = 0;
      
        if (selected === false) { return;}
        gbr = getboundrect(mar,selector,'s');
        if (xy === 'y') {
          hshift = (-1)*(gbr.l+gbr.w/2);
          vshift = 0;
        } else if (xy === 'x') {
          vshift = (-1)*(gbr.t+gbr.h/2);
          hshift = 0;      
        }
        shiftTree(mar,hshift,vshift,selector);
        for (i=1;i<mar.length;i++) {
          if ((selector === -1) || (mar[i].s === selector)) {
            if (xy==='y') {
              mar[i].x *= -1;
            } else if (xy==='x') {
              mar[i].y *= -1;
            }
            if (mar[i].z !== 0) {
              for (jj=0;jj<mar[i].bpa.length;jj++) {
                if (mar[i].bpa[jj].t === 4) {
                  changeBondType(m,b,getBondIndex(bar,i,mar[i].bpa[jj].p),5,false);
                } else if (mar[i].bpa[jj].t === 5) {
                  changeBondType(m,b,getBondIndex(bar,i,mar[i].bpa[jj].p),4,false);
                }
              }
            }            
          }
        }
        shiftTree(mar,(-1)*hshift,(-1)*vshift,selector);
        for (jj=1;jj<mar.length;jj++) {
          if ((selector === -1) || (mar[jj].s === selector)) {
            sort_abop_by_dir(mar,jj);
          }
        }
        for (i=0;i < arro.length; i++) { // invert curvature of all arrows starting within the selected tree //BF201221.1
          if (arro[i].st > 0) {
            if ((m[arro[i].st].s===selector) || (selector===-1)) {
              arro[i].crv = (arro[i].crv > 0)? -1 : 1;
            }
          } else {
            if ((m[b[(-1)*arro[i].st].fra].s===selector) || (selector===-1)) {
              arro[i].crv = (arro[i].crv > 0)? -1 : 1;
            }
          }
        }
        clearSelection();
        saveState();
        resetDV();
        drawMol(ctx,0,true);
        return;
      
      } // rotates tree in 3D around x or y axis by 180° (thereby conserving the stereoconfiguration)

  // END OF FUNCTIONS CHANGING THE MOLECULE

  // COPY SAVE AND RESTORE FUNCTIONS

      function saveState() { 
        nmol=get_mol_brects();
        get_molgrp_brects();
        pushStateToStack();
      }
    
      function pushStateToStack() {
        let i;
        const asrc = m;
        const bsrc = b;
        const arwsrc = arro;
        const rxarwsrc = rxnarro;
        let atrg, btrg, arwtrg, rxarwtrg;

        const tstate = new State();
      
        atrg = tstate.aa;
        btrg = tstate.ba;
        arwtrg = tstate.arw;
        rxarwtrg = tstate.rxa;
      
        atrg.length = 1;
        btrg.length = 1;
        arwtrg.length = 0;
        rxarwtrg.length = 0;
      
        for (i=1;i<asrc.length;i++) {
          deep_copyAtom(asrc,atrg,i,i);
        }
        for (i=1;i<bsrc.length;i++) {
          deep_copyBond(bsrc,btrg,i,i);
        }
        for (i=0;i<arwsrc.length;i++) {
          deep_copyArrow(arwsrc,arwtrg,i,i);
        }
        for (i=0;i<rxarwsrc.length;i++) {
          deep_copyRxnArrow(rxarwsrc,rxarwtrg,i,i);
        }
        tstate.nm = nmol;
        tstate.step = savedStates.length+1;
        tstate.at = at;
        tstate.ae = ae;
      
        savedStates.push(tstate);
      } // adds current State to savedStates[]
    
      function recoverState() {
        let tstate = new State(); // temp target state
        let i, asrc, bsrc, csrc, dsrc, atrg, btrg, ctrg, dtrg;
      
        if ( savedStates.length < 2 ) { return; }
        savedStates.pop(); // the last saved state === the current State, pop it away
        // now the last array element contains the second-last state, which we need
        // to deep-copy to the current state
        tstate = savedStates[savedStates.length-1];
        asrc = tstate.aa;
        bsrc = tstate.ba;
        csrc = tstate.arw;
        dsrc = tstate.rxa;
        atrg = m;
        btrg = b;
        ctrg = arro;
        dtrg = rxnarro;
      
        atrg.length = 1;
        btrg.length = 1;
        ctrg.length = 0;
        dtrg.length = 0;
      
        for (i=1;i<asrc.length;i++) {
          deep_copyAtom(asrc,atrg,i,i);
        }
        for (i=1;i<bsrc.length;i++) {
          deep_copyBond(bsrc,btrg,i,i);
        }
        for (i=0;i<csrc.length;i++) {
          deep_copyArrow(csrc,ctrg,i,i);
        }
        for (i=0;i<dsrc.length;i++) {
          deep_copyRxnArrow(dsrc,dtrg,i,i);
        }
        if (tstate.at === 10) {
          at = 0;
        } else {
          at = tstate.at;
        }
        ae = tstate.ae;
      } //loads last saved State       
      
      function undo() {
        recoverState();
        setTool(at);
        setES(ae);
        drawMol(ctx,0,true);
      }
    
/** @constructor */
      function State() { //constructor
        this.aa = [da];  // the atoms array
        this.ba = [dbo];  // the bonds array
        this.arw = [];  // the arro[] array of curved arrows
        this.rxa = [];  // the rxnarro[] array of reaction arrows
        this.step = 0;  // so many steps done
        this.nm = 0;    // number of molecules (trees)
        this.at = 0;  // the current tool
        this.ae = 0;  // the current element symbol
      } // object describing the current atom array (m[]), bond array (b[]), the number of drawing steps done and the current tools/elements settings 

  // BUTTON HANDLERS
      // prevent mousup propagation to canvas from buttons
      document.getElementById('buttonregion').addEventListener('mouseup', e => {
        if (!e) {
          e = window.event;
        }
        e.preventDefault();
        e.stopPropagation();        
        return false;                    
      }, false);

  // undo button
      document.getElementById('undo').addEventListener('click', () => {
        if (sbox.style.visibility  === 'visible') { return false; } 
      
        clearSelection();
        undo();
        document.getElementById('undo').blur();
        
      }, false);
    
  // clear button and can clearing. Deletes molecule
      document.getElementById('clear').addEventListener('click', () => {
        if (sbox.style.visibility  === 'visible') { return false; }
      
  //      location.reload(true);      
      
        ctx.clearRect(drect.l+1,drect.t+1,drect.w-2,drect.h-2);
      
        clearSelection();
        clearMol();
        document.getElementById('clear').blur();    
      }, false);

  // get smiles button
      document.getElementById('smiles').addEventListener('click', () => {
      
        if (sbox.style.visibility  === 'visible') { return false; }
        clearSelection();
        smile(); 
        document.getElementById('smiles').blur();    

      }, false);

  // SMILES->Structural Formula button
      document.getElementById('sm2str').addEventListener('click', () => {
      
        if (smixbox.style.visibility  === 'visible') { return false; }
        getInSmiles();
        document.getElementById('sm2str').blur();    

      }, false);

  // help button
      document.getElementById('help').addEventListener('click', () => {
        let mwx;
      
        mwx = window.screenX;
        helpWindow = window.open("help/MOSFECCS_Help.html","Structural Formula Editor Help","dependent=yes,scrollbars=yes,resizable=yes");
        helpWindow.resizeTo(900,900);
        helpWindow.moveTo(mwx-helpWindow.outerWidth-5,20);
        document.getElementById('help').blur();    

      }, false);


  // for Tablets: the shift and alt simulator buttons
      document.getElementById('shift').addEventListener('click', () => {
        if (kc < 10) { // shift wasn't on
          kc += 10;
          document.getElementById('shift').className = "shift "+"selected";
        } else {  // shift was on
          kc -= 10;
          document.getElementById('shift').className = "shift";
        }
      }, false);

      document.getElementById('alt').addEventListener('click', () => {
        if (kc % 2 === 0) { // alt wasn't on
          kc += 1;
          document.getElementById('alt').className = "alt "+"selected";
        } else {  // alt was on
          kc -= 1;
          document.getElementById('alt').className = "alt";
        }
      }, false);      

//END INTERACTIVE
//START COMMON    
      //COMMON TO MV, MV_SVG_DEV, MOSTEST, MSVG

      function getAll_t_Trees() {
        let i, tn, start, tl;
      
        for (i=0;i<m.length;i++) { // reset tree number of all atoms to zero      
          m[i].t = 0;
        }
        start = 1;
        tn = 0;
        while (start > 0) {
          start = 0;
          for (i=1;i<m.length;i++) { // search for the next atom to use as start
            if (m[i].t === 0) {
              start = i;
              break;
            }
          }
          if (start === 0) { break; }
          visnodesDFS = [];        
          tl = dfs(m,start);
          for (i=0; i<tl;i++) {
            m[visnodesDFS[i]].t = tn;
          }
          tn++;
        }
        return tn-1;
      } // searches m[] for trees and labels the m[].t with tree number, returns number of trees

      function getAll_s_Trees() {
        let i, tn, start, tl;
      
        for (i=0;i<m.length;i++) { // reset tree number of all atoms to zero      
          m[i].s = 0;
        }
        start = 1;
        tn = 0;
        while (start > 0) {
          start = 0;
          for (i=1;i<m.length;i++) { // search for the next atom to use as start
            if (m[i].s === 0) {
              start = i;
              break;
            }
          }
          if (start === 0) { break; }
          visnodesDFS = [];        
          tl = dfs(m,start);
          for (i=0; i<tl;i++) {
            m[visnodesDFS[i]].s = tn;
          }
          tn++;
        }
        return tn-1;
      } // searches m[] for trees and labels the m[].t with tree number, returns number of trees
      
      function selMultiTrees(tAr,jnr) {
        // param: tAr is an array of tree numbers (m[].t); jnr is the new selection number (m[].s) for the joined tree
        let i=0;
        let jj=0;
        if (tAr.length===0) { return -1; }        
        for (i=0;i<tAr.length;i++) {
          for (jj=1;jj<m.length;jj++) {
            if ((m[jj].t === tAr[i]) && (m[jj].s !== jnr)) {
              m[jj].s = jnr;
            }
          }
        }
      } // joins trees listed in tAr[] into a common selection jnr by setting the m[].s property to jnr        

      function getAtomicNumber(symb) {
        let i=0;
        if ((symb === "") || (symb === undefined)) {return -1;}
        if (symb === "C:") { return 6; }
        if (symb === "N:") { return 7; }
        for (i=0;i<elesym.length;i++) {
          if (elesym[i] === symb) {
            return i+1;
          }
        }
        const result = symb.match(resreg);
        if (result !== null) {
          return 0;
        }
        return -1;
      } // get Atomic Number from element symbol
    
      function inrect(rec,testx,testy) {
        if (( testx > rec.l) && ( testx < rec.l+rec.w ) && (testy > rec.t) && (testy < rec.t + rec.h)) {
          return true;
        } else {
          return false;
        }
      } // returns true if point testx|testy is inside rec

      function isnear(mar,bar,xm,ym) {
        let i, fa, ta, bonx, bony;
        let dist = 10;
        for (i = 1;i<mar.length;i++) {
          dist = Math.sqrt((xm-mar[i].x)*(xm-mar[i].x) + (ym-mar[i].y)*(ym-mar[i].y));
          if (dist <= crit) {
            return i;
          }
        }
        for (i = 1;i<bar.length;i++) {
          fa = bar[i].fra;
          ta = bar[i].toa;
          bonx = (mar[fa].x + mar[ta].x) / 2;
          bony = (mar[fa].y + mar[ta].y) / 2;
          dist = Math.sqrt((xm-bonx)*(xm-bonx) + (ym-bony)*(ym-bony));
          if (dist <= crit) {
            return (-i);
          }  
        }
        return 0;
      } // detects if (xm|ym) is within crit of atom (returns index in m[]) or bond (returns -index in b[]) or 0

      function getbpix(mar,a1,a2) { 
        let i;
      
        for (i=0;i<mar[a1].bpa.length;i++) { // loop through all bondig partners of a1      
          if ( mar[a1].bpa[i].p === a2) { return i }
        }
        return -1; // returns -1 if a2 is not in the bpa array of a1
      } // returns the index of a2 in bpa[] of a1 or -1 if a2 is not a bonding partner of a1
    
      function is_cumuleneAt(mar,bar,a) { //returns boolean, a is the index of the atom to be tested
        let i, k;
    
        i=0;
        k=0;
        while (i < mar[a].bpa.length ) {
          if (mar[a].bpa[i].t === 2) { k++; } // count the double bonds
          i++;
        }
        if (k === 2) { return true; } else { return false; }
      } // returns true if a is a cumulene atom
    
      function valency(a) { 
        let i, ival, vals = 0;
        for (i=0;i<m[a].bpa.length;i++) {
          ival = m[a].bpa[i].t;
          if ((ival === 4) || (ival === 5)) { ival = 1;} // stereo bonds count as single
          vals += ival;
        }
        return vals;        
      } // sums up the bond orders of atom a
    
  // labels
      function getAtStr(mar,ix) {
        let astr = "";
        let nH = 0;
        let bi;

        astr = "";
        if (showatnum) {
          astr = String(ix);
          return astr;
        } else if (showsymnum) {
          astr = String(mar[ix].cl);
          return astr;
        }
        // for all elements except C or C with only explicit H or C in cumulenes: Element symbol is part of atom label
        if ((mar[ix].el !== "C") || (mar[ix].bpa.length===mar[ix].eh) || (is_cumuleneAt(mar,b,ix))) {
            astr = mar[ix].el;
        }
        // automatic extension of atom label with H, calculation of number of H to write
        // condition: not C, not H, normal valency defined as > 0
        //    or
        // C with only explicit H as ligands
        if (((mar[ix].el !== "C") && (mar[ix].el !== "H") && (val[mar[ix].an] > 0)) || ((mar[ix].el === "C") && (mar[ix].bpa.length===mar[ix].eh))) { //BF191029.1
          nH = getAutoH(mar,ix,false);
          if (nH > 0) { // only when the number of automatic H is calculated as > 0 will there be any H's in the atom label
            bi = getPrefBisect(mar,ix);
            if ((bi > 90) && (bi < 270)) { // left side
              if (nH > 1) { astr = String(nH) + astr; }
              astr = "H" + astr;
            } else {  // right side
              astr += "H";
              if (nH > 1) { astr += String(nH); }
            }
          }
        }
        return astr;
      } // compose the atom label
      
      function getAutoH(mar,ix,ehflag) {
        //params: ehflag: true -> take explicit H into account
        let naH = 0;
        let bo = 0;
        let av = 0;
        let nv = 0;
        let k;
      
        if ((mar[ix].el !== "H") && (val[mar[ix].an] > 0))  { //BF191029.1
          nv = val[mar[ix].an];
          if (sextets.includes(mar[ix].el)) { // reduce normal valence for carbenes and nitrenes
            nv -= 2;
          }
          av = (ehflag? mar[ix].eh : 0);
          bo = 0;
          // sum up the bond order
          // explicit H are included in actual valence av because they are bonding partners      
          for (k = 0;k<mar[ix].bpa.length;k++) {
            bo = mar[ix].bpa[k].t;
            if ((bo === 4) || (bo === 5)) { bo = 1; }
            av += bo;
          }
          // number of automatic H's is "normal valence - actual valence + charge : +charge increases number of H
          naH = nv - av + mar[ix].c;
          // special cases 
          // +charge decreases and -charge increases number of H: electropositive elements (B, Al)
          // single carbon with only explicit H and charge >= 0
          if ((elpos.includes(mar[ix].el)) || ((mar[ix].el === "C") && (mar[ix].c > 0))) {
            naH = nv - av - mar[ix].c;
          }
          if (mar[ix].r) { naH--;} // one H less if radical
        }
        return Math.max(naH,0);              
      } // calculate the number of implicitH
    
      function getCstr(mar,ix) {
        let cstr = ""; // charge string
        if (Math.abs(mar[ix].c) > 1) {
          cstr += String(Math.abs(mar[ix].c));
        } 
        if (mar[ix].c > 0) { 
          cstr += "+" ;
        } else if (mar[ix].c < 0) {
          cstr += "–";
        }
        return cstr;
      } // compose the charge label
    
      function calcNewRxnArwCoord(rtn,ptn,srct,erct) {
        let i=0;
        const s = new Coord(0,0);
        const e = new Coord(0,0);
        let ardir=0;
        const minal = 4*crit;
        const csx = srct.l+srct.w/2;
        const csy = srct.t+srct.h/2;
        const cex = erct.l+erct.w/2;
        const cey = erct.t+erct.h/2;
        const cdist = Math.sqrt((cex-csx)*(cex-csx)+(cey-csy)*(cey-csy));
        const sa = srct.w/1.6;
        const sb = srct.h/1.6;
        const ea = erct.w/1.6;
        const eb = erct.h/1.6;
        let rs = 0;
        let re = 0;
        let edx=0;
        let edy=0;
        let dae_cs=0;
        let das_cs=0;
        let tmp=0;
        
        ardir = getdirangle(csx,csy,cex,cey);
        rs = sa*sb/(Math.sqrt(sa*sa*Math.sin(Math.PI*ardir/180)*Math.sin(Math.PI*ardir/180)+sb*sb*Math.cos(Math.PI*ardir/180)*Math.cos(Math.PI*ardir/180)));
        re = ea*eb/(Math.sqrt(ea*ea*Math.sin(Math.PI*ardir/180)*Math.sin(Math.PI*ardir/180)+eb*eb*Math.cos(Math.PI*ardir/180)*Math.cos(Math.PI*ardir/180)));
        // check for ellipse overlap
        if (cdist-rs-re < minal) {
          if (cdist-rs-re > 0) {
            edx = 1.05*Math.abs(minal+rs+re-cdist)*Math.cos(Math.PI*ardir/180);
            edy = -1.05*Math.abs(minal+rs+re-cdist)*Math.sin(Math.PI*ardir/180);
          } 
          for (i=0;i<ptn.length;i++) {
            shiftMol(m,edx,edy,ptn[i]);          
          }
        }
        s.x = csx + rs*Math.cos(Math.PI*ardir/180);
        s.y = csy - rs*Math.sin(Math.PI*ardir/180);
        e.x = cex - re*Math.cos(Math.PI*ardir/180)+edx;
        e.y = cey + re*Math.sin(Math.PI*ardir/180)+edy;
        dae_cs = Math.sqrt((e.x-csx)*(e.x-csx)+(e.y-csy)*(e.y-csy));
        das_cs = Math.sqrt((s.x-csx)*(s.x-csx)+(s.y-csy)*(s.y-csy));
        if (dae_cs < das_cs) { // arrow inverted
          tmp = s.x;
          s.x = e.x;
          e.x = tmp;
          tmp = s.y;
          s.y = e.y;
          e.y = tmp;
        }
        rxnco.push(s.x,s.y,e.x,e.y);
        return;
      } // calculates the start and end points of a newly drawn reaction arrow      
            
      function shiftMol(mar,dx,dy,ml) {
        //params: mar: atoms array, (dx|dy): shift vector, ml: molecule number (mar[].t+1)
        let i;
        for (i=1;i<mar.length;i++) {
          if (mar[i].t === ml) {
            mar[i].x += dx;
            mar[i].y += dy;
          }
        }
      } // shifts the x|y coordinates of a molecule (atoms with mar[].t===ml) by (dx|dy)
        
  // add Bond      
      function addBond(mar,bar,fromat, toat, btype) {
        let i, vfra, vtoa, bty, tmpa;
    
        // no bonds to non-existing atoms!!
        if ((fromat >= mar.length) || (toat >= mar.length)) { return; }
      
        // no bonds of an atom with itself
        if (fromat === toat ) { return; }
      
        // no duplication of bonds
        for (i = 1;i<bar.length;i++) {
          if (((bar[i].fra === fromat) && (bar[i].toa === toat)) || ((bar[i].fra === toat) && (bar[i].toa === fromat))) { return; }
        }
      
        // valence test for benzene
        bty = btype;
        if (benzene) {
          vfra = valency(fromat);
          vtoa = valency(toat);
          if ((((vfra + btype) > 4 ) && (mar[fromat].el === "C")) || (((vtoa + btype) > 4) && (mar[toat].el === "C"))) {
            bty=1;
          }
        }

        // attempt to make wedge bond with explicit H atom at narrow end: reverse polarity and up/down type        
        if ((bty === 4) && (mar[fromat].el === "H")) {
          tmpa = fromat;
          fromat = toat;
          toat = tmpa;
          bty = 5;  
        } else if ((bty === 5) && (mar[fromat].el === "H")) {
          tmpa = fromat;
          fromat = toat;
          toat = tmpa;
          bty = 4;  
        }

        bar[bar.length] = new Bond(fromat, toat, bty);
        if (bty === 4) { // stereo up bond, register positive pz for toat
          mar[toat].z = 1;
        }
        if (bty === 5) { // stereo down bond, register negative pz for toat
          mar[toat].z = -1;
        }
        // adjust bpa[] of the involved atoms
        mar[fromat].bpa.push(new Bop(toat, bty));
        mar[toat].bpa.push(new Bop(fromat, bty));

        if (mar === m) {
          sort_abop_by_dir(mar,fromat);
          sort_abop_by_dir(mar,toat);
        }                  
      }

  // change bond order
      function changeBondOrder(mar,bar,a1, a2, mode) { // mode can be '+' or '-' for increase|decrease
      let bi1 = 0;
      let bi2 = 0;
      let bt1 = 0;
      let bt2 = 0;
      let i, nt = 0;
      
        bi1 = getbpix(mar,a1, a2);
        bi2 = getbpix(mar,a2, a1);
        if ((bi1 >= 0) && (bi2 >= 0)) { // check for mutual bonding
          bt1 = mar[a1].bpa[bi1].t;
          bt2 = mar[a2].bpa[bi2].t;
          if (bt1 === bt2) { // check for same bond type
            switch (mode) { // determine the new bond type
              case '+':
                if ((bt1 === 1) || (bt1 === 2)) { // single or double can be increased by one
                  nt = bt1 + 1;
                } else if ((bt1 === 4) || (bt1 === 5)) { // stereo single go to double
                  nt = 2;
                }
                break;
              case '-':
                if ((bt1 === 2) || (bt1 === 3)) { // double or triple can be decreased by one{
                  nt = bt1 - 1;
                }
                break;
            }
            // change the atoms and bond array elements
            if (nt > 0) {
              mar[a1].bpa[bi1].t = nt;
              mar[a2].bpa[bi2].t = nt;
              for (i=1;i<bar.length;i++) { // search the b-array and change btyp of bond
                if (bar[i].btyp === 0) { continue; } // skip non-valid bonds
                if (((bar[i].fra === a1) && (bar[i].toa === a2)) || ((bar[i].toa === a1) && (bar[i].fra === a2))) {
                  bar[i].btyp = nt;
                }
              }
            }
          }
        }
    
      } //increase/decrease bond order between atoms a1 and a2

  // changeBondType
      function changeBondType(mar,bar,bo, newt, check) {
        let i, fromat, toat, oldt, bix, bec, zadd, temp;
      
        fromat = bar[bo].fra;
        toat =   bar[bo].toa;
        oldt = bar[bo].btyp;
      
        if (((oldt === 4) || (oldt === 5)) && (newt === -1)) { // change polarity of wedge
          // prevent reversing stereo bond to narrow end at H
          if (mar[toat].el === "H") {
            return;
          } 

          // analyse for new inconsistency 
          bec = 0; // count broad ends at fromat
          zadd = 0;
          i = 0;
          while (i < mar[fromat].bpa.length) {
            if ((mar[fromat].bpa[i].t === 4) || (mar[fromat].bpa[i].t === 5)){ // wedge at toat now
              bix = getBondIndex(bar, fromat, mar[fromat].bpa[i].p);
              if (bar[bix].toa === fromat) { // broad end at toat
                bec++; // bec: broad end counter
                if (mar[fromat].bpa[i].t === 4) {
                  zadd++;
                } else if (mar[fromat].bpa[i].t === 5) {
                  zadd--;
                }
              }                         
            }
            i++;
          }
          if (((bec > 0) && (Math.abs(zadd)!== bec)) || ((zadd > 0) && (oldt === 5)) || ((zadd < 0) && (oldt === 4))) {  // stereoconflict 1
            return;
          }
          bec = 0; // count broad ends at toat
          zadd = 0;
          i = 0;
          while (i < mar[toat].bpa.length) {
            if ((mar[toat].bpa[i].t === 4) || (mar[toat].bpa[i].t === 5)){ // wedge at toat now
              bix = getBondIndex(bar, toat, mar[toat].bpa[i].p);
              if (bar[bix].toa === toat) { // broad end at toat
                bec++; // bec: broad end counter
                if (mar[toat].bpa[i].t === 4) {
                  zadd++;
                } else if (mar[toat].bpa[i].t === 5) {
                  zadd--;
                }
              }                         
            }
            i++;
          }
          if ((bec < 2) && ((oldt === 4) || (oldt === 5 ))) {  
            mar[toat].z = 0; // pz of future fromat to 0
          }
          temp = fromat; // swap fromat and toat
          fromat = toat;
          toat = temp;
          if (bar[bo].btyp === 4) {mar[toat].z = +1;} else { mar[toat].z = -1;} // set pz of new toat
          bar[bo].fra = fromat;    // copy to bar[] element  
          bar[bo].toa = toat;
                      
        } else if (oldt !== newt) { // change bond type
          if (check === true) {
            // analyse for new inconsistency and for more than one "broad end" at toat
            bec = 0; // counter for broad ends at toat
            zadd = 0;
            i = 0;
            while (i < mar[toat].bpa.length) {
              if ((mar[toat].bpa[i].t === 4) || (mar[toat].bpa[i].t === 5)){ // wedge at toat now
                bix = getBondIndex(bar, toat, mar[toat].bpa[i].p);
                if (bar[bix].toa === toat) { // broad end at toat
                  bec++; // bec: broad end counter
                  if (mar[toat].bpa[i].t === 4) {
                    zadd++;
                  } else if (mar[toat].bpa[i].t === 5) {
                    zadd--;
                  }
                }                         
              }
              i++;
            }
            // single wedge broad end at toat now, change to non-wedged bond-> change z to 0
            if (Math.abs(zadd) !== bec) { // collision in old situation
              return;
            }
            if ((bec > 1) && (((oldt === 4) && (newt === 5)) || (oldt === 5) && (newt === 4))) { // stereoconflict 2
              // avoid new up/down inconsistency at toat
              return;
            }
            if ((bec > 1) && (((zadd > 0) && (newt === 5)) || ((zadd < 0) && (newt === 4)))) { // stereoconflict 3
              return;
            }
          } 
          if (newt === 4) { mar[toat].z = +1 ;} // change the pseudoz for stereo up
          if (newt === 5) { mar[toat].z = -1 ;} // change the pseudoz for stereo down
          // BUGFIX 181006.1
          if ((newt === 1) && (bec < 2)) { mar[toat].z = 0; } // change the pseudoz of toat to 0 if it had max one broad edge
          bar[bo].btyp = newt; // change the bond type in bar

          i = 0; // change the bond type in the bpa[] of fromat and toat
          while (i < mar[fromat].bpa.length) {
            if (mar[fromat].bpa[i].p === toat) {
              mar[fromat].bpa[i].t = newt;
            }
            i++;
          }
          i=0;    
          while (i < mar[toat].bpa.length) {
            if (mar[toat].bpa[i].p === fromat) {
              mar[toat].bpa[i].t = newt;
            }
            i++;
          }    
        }
      } // change bond type

  //add tree
      function addTree(smar,sbar,tmar,tbar,selector,dx,dy) {
      // params:   smar: source array of Atom objects
      //    sbar: source array of Bond objects
      //    tmar: target array of Atoms to which the substructure will be appended
      //    tbar: target array of Bonds to which the bonds of the substructure will be appended
      //    selector: only atoms with smar[i].s === selector are copied
      //          if selector === -1: all atoms are copied
      //    dx,dy: coordinate shifts that are added to the (x|y) coordinates of the copied atoms
    
        let i=0;
        let jj=0;
        let k=0;
        let p = 0;
        let mxo=[];
        let mxc=[];
        let iox = 0;
        let biox = 0;
        let nix = 0;
        let bix = 0;
        let obp = 0;
        let nbp = 0;
      
        mxo=[];
        mxc=[];
        iox = smar.length;
        biox = sbar.length;
        for (i=1; i<iox;i++) { // copy the atoms starting with index 1 (index 0 is always a dummy atom)
          if ((selector === -1) || (smar[i].s === selector)) { // in the selection
            nix = tmar.length;
            deep_copyAtom(smar,tmar,i,nix);
            // the new atom still contains the old bonding partners in its bpa[].p values
            mxo.push(i); // parallel arrays of indices in smar[] of original 
            mxc.push(nix); // and copy
            tmar[nix].x = smar[i].x + dx; // coordinate shift
            tmar[nix].y = smar[i].y + dy;
            if (selector > -1) {
              tmar[nix].t = selector; // label the molecule (m[].t property)
            }
          }
        }

        for (i=1; i<iox;i++) { // for all original atoms
          if ((selector === -1) || (smar[i].s === selector)) { // in the selection
            jj= -1;
            k = -1;                
            for (p=0;p<smar[i].bpa.length;p++) { // go through all bonding partners and translate their indices
              obp = smar[i].bpa[p].p;
              jj =  mxo.indexOf(obp); //translate the index of the old bp
              k =  mxo.indexOf(i); // translate the index of the central atom
              if ((jj > -1) && (k > -1)) {
                nbp = mxc[jj];                  
                tmar[mxc[k]].bpa[p].p = nbp;
              }                  
            }
            jj= -1;
            k = -1;
            for (p=1; p<biox;p++) { // go through all original bonds starting with index 1 (0 is dummy bond)
              if (sbar[p].fra === i) { // look for bonds with selected smar[i] as fra
                bix = tbar.length; // append copy of bond to end of tbar[]
                deep_copyBond(sbar,tbar,p,bix); // type of bond is copied as well here
                k =  mxo.indexOf(i); // translate the index of the central atom
                tbar[bix].fra = mxc[k]; // fra is the copied atom itself
                jj =  mxo.indexOf(sbar[p].toa);
                if ((jj > -1) && (k > -1)) { 
                  tbar[bix].toa = mxc[jj]; //translate the index of toa
                }
              }
            }
          }
        
        }
      
      
      } // add a molecule stored in smar[], sbar[] to the structure(s) in tmar[],tbar[] as a new substructure

      function deleteArrow(arwix) {
        if (arro[arwix] !==undefined) {
          arro.splice(arwix,1);
        }
      } // deletes a curved arrow

  // graphic transforms on parts (trees, selections) or the whole molecule    
      function flipBranch(mar,bar,bixfl,fb,clearsel) {
      //param:  bixfl: bond index in bar[] of the bond to flip around 
      //    fb: 1,-1 flip in opposite direction
      //    clearsel: if true the selection is cleared before return

        let i=0;
        let jj=0;
        let rotang = 0;
        let tvx=0;
        let tvy=0;
        let p1 = bar[bixfl].toa; // the point translated to (0|0) and the rotation center
        let p2 = bar[bixfl].fra; // the incoming of p1 coming from ca1
        let p1p2size = 0;
        let p2p1size = 0;
        let p1p2nodes =  [];
        let p2p1nodes = [];
      
        // no flip if ring bond or multiple bond
        findRingBonds(mar,bar);
        if ((isringbond(bar,bar[bixfl].fra,bar[bixfl].toa)) || (bar[bixfl].btyp === 2) || (bar[bixfl].btyp === 3)) { //bugfix 190208.1
          return;
        }
        
        // find out which side of the bond to flip (the one with less atoms)
        dfsU(mar,p1,p2);
        p1p2nodes = visnodesDFS.slice(0);
        p1p2size=p1p2nodes.length;
        dfsU(mar,p2,p1);
        p2p1nodes = visnodesDFS.slice(0);  
        p2p1size=p2p1nodes.length;
        if (p2p1size < p1p2size) {
          p1 = bar[bixfl].fra;
          p2 = bar[bixfl].toa;
          visnodesDFS = p2p1nodes.slice(0);
        } else {
          p1 = bar[bixfl].toa;
          p2 = bar[bixfl].fra;
          visnodesDFS = p1p2nodes.slice(0);
        }  

        // visnodesDFS[] now contains all atoms of the smaller branch
        for (i=1;i<mar.length;i++) {
          mar[i].s = 0;
        }
        for (i=1;i<visnodesDFS.length;i++) { // select all atoms in the branch except the first one (p1) //bugfix 190208.1
          mar[visnodesDFS[i]].s = 1;
        }

        tvx = mar[p1].x;
        tvy = mar[p1].y;
        rotang = norma(fb*getdiranglefromAt(mar,p1,p2));
        translate2D(mar,1,(-1)*tvx,(-1)*tvy,false);
        rot2D(mar,1,mar[p1].x,mar[p1].y,fb*rotang,false);
        reflect2D(mar,bar,1,'y',getBondIndex(bar,p1,p2), false); //bugfix 190208.1
        rot2D(mar,1,mar[p1].x,mar[p1].y,(-1)*fb*rotang,false);
        translate2D(mar,1,tvx,tvy,false);
        for (jj=1;jj<m.length;jj++) {
          if (m[jj].s===1) {
            sort_abop_by_dir(m,jj);
          }
        }
        if (clearsel) {            
          clearSelection();
        }
      } // flip smaller part of molecule around non-cyclic single bond

      function shiftTree(mar,dx,dy,selector) {
        let i;
        for (i=1;i<mar.length;i++) {
          if ((selector === -1) || (mar[i].s === selector)) {
            mar[i].x += dx;
            mar[i].y += dy;
          }
        }
      } // shifts tree or selection by dx|dy. If selector===-1, shifts all atoms

      function shiftRxnArrows(rxar,dx,dy) {
        let i=0;
        for (i=0;i<rxar.length;i++) {
          rxar[i].sco.x += dx;
          rxar[i].sco.y += dy;
          rxar[i].eco.x += dx;
          rxar[i].eco.y += dy;
        }
      } // shifts a reaction arrow by dx|dy

      function shiftMolgrp_brects(dx,dy) {
        if (molgrp_brects.length===0) { return -1; }
        let k=0;
        for (k=0;k<molgrp_brects.length;k++) {
          molgrp_brects[k].l += dx;
          molgrp_brects[k].t += dy;
        }
      } // shifts the molgrp_brects[] by dx,dy
                        
      function center_scale_all() { 
        let i=0;     
        let xratio = 1;
        let yratio = 1;
        let gbr = new Rect(0,0,0,0);
        let scf = 1;
        let currBl = bondlength;
        let newBl = bondlength;
        
        // select all atoms
        for (i=1;i<m.length;i++) {
          m[i].s = 9;
        }

        // center molecules on canvas and scale if too large
        gbr = getboundrect(m,9,'s');
        shiftTree(m,(arect.l+arect.w/2)-(gbr.l + gbr.w/2),(arect.t+arect.h/2)-(gbr.t + gbr.h/2),9);
        if (rxnarro.length > 0) {
          shiftRxnArrows(rxnarro,(arect.l+arect.w/2)-(gbr.l + gbr.w/2),(arect.t+arect.h/2)-(gbr.t + gbr.h/2));
          shiftMolgrp_brects((arect.l+arect.w/2)-(gbr.l + gbr.w/2),(arect.t+arect.h/2)-(gbr.t + gbr.h/2));
        }
        xratio = gbr.w/arect.w;
        yratio = gbr.h/arect.h;
        if ((xratio > 1) || (yratio > 1)) {
          scf = 1/(1.1*Math.max(xratio,yratio));
          newBl = 5*Math.floor(currBl*scf/5);
          scf = newBl/currBl;
          scale2D(m,9,arect.l+arect.w/2,arect.t+arect.h/2,scf,false); //bugfix 190206.1: factor 1.1
          adjust_bondlength(scf); //bugfix 190206.1: factor 1.1
          charH = Math.floor(6+(bondlength-15)*(8/30));
          ctx.save();
          ctx.fillStyle = 'white';
          ctx.fillRect(zi.x+16,zi.y-6,20,12);
          ctx.font = '10pt Sans-Serif';
          ctx.fillStyle = 'black';
          ctx.fillText(String(Math.round(bondlength)),(zi.x+zo.x)/2-6,zi.y+6);
          ctx.restore();        

          
          if (rxnarro.length > 0) {
            scaleRxnArrows(rxnarro,arect.l+arect.w/2,arect.t+arect.h/2,scf);
            scaleRectArray(molgrp_brects,arect.l+arect.w/2,arect.t+arect.h/2,scf);
          }
        }
        clearSelection();
      }

      function deep_copyAtom(src,trg,satox,tatox) { // src and trg are m[] arrays
        let i;
        let agot = new Atom(0,'',0,0,0,0,0);
        const trga = new Atom(0,'',0,0,0,0,0);
  
        agot = src[satox];
        trga.s = agot.s;
        trga.oix = agot.oix;
        trga.an = agot.an;
        trga.el = agot.el;
        trga.x = agot.x;
        trga.y = agot.y;
        trga.c = agot.c;
        trga.eh = agot.eh;
        trga.hx = agot.hx;
        trga.hy = agot.hy;
        trga.hz = agot.hz;
        trga.z = agot.z;
        trga.r = agot.r;
        trga.cl = agot.cl;
        trga.ar = agot.ar;
        trga.rs = agot.rs;
        trga.nlp = agot.nlp;
        trga.t = agot.t;        
        trga.rxs = agot.rxs.slice(0);
        trga.rxe = agot.rxe.slice(0);
        for (i=0;i<agot.bpa.length;i++) {
          trga.bpa.push(new Bop(agot.bpa[i].p, agot.bpa[i].t));
        }
        trg[tatox] = trga;
      }

      function deep_copyBond(src,trg,sbix,tbix) { // src, trg are b[] arrays
        let bgot = new Bond(0,0,0);
        const trgb = new Bond(0,0,0);
  
        bgot = src[sbix];
        trgb.s = bgot.s;
        trgb.obix = bgot.obix;        
        trgb.fra = bgot.fra;
        trgb.toa = bgot.toa;
        trgb.btyp = bgot.btyp;
        trg[tbix] = trgb;  
      }

      function deep_copyArrow(src,trg,saix,taix) { // src, trg are arro[] arrays
        let agot = new Arrow(0,0,'',0); //BF200222.2
        const trga = new Arrow(0,0,'',0); //BF200222.2
  
        agot = src[saix];
        trga.st = agot.st;
        trga.en = agot.en;
        trga.ty = agot.ty;
        trga.crv = agot.crv;
      
        trg[taix] = trga;  
      }

      function deep_copyRxnArrow(src,trg,saix,taix) {
        let agot = new Rxna([],[],0,'','',0,0,0,0);
        const trga = new Rxna([],[],0,'','',0,0,0,0);
  
        agot = src[saix];
        trga.stn = agot.stn.slice(0);
        trga.etn = agot.etn.slice(0);
        trga.ty = agot.ty;
        trga.aa = agot.aa;
        trga.ab = agot.ab;
        trga.sco.x = agot.sco.x;
        trga.sco.y = agot.sco.y;
        trga.eco.x = agot.eco.x;
        trga.eco.y = agot.eco.y;
      
        trg[taix] = trga;  
      }
          
  // FUNCTIONS USED BY MORE THAN ONE SECTION

      function genshadow(mar1,mar2,bar1,bar2) {
        let i;
      
        mar2.length = 1;
        bar2.length = 1;
      
        for (i=1;i<mar1.length;i++) {
          deep_copyAtom(mar1,mar2,i,i);
        }
        for (i=1;i<bar1.length;i++) {
          deep_copyBond(bar1,bar2,i,i);
        }
      } // copy data structure into shadow structure
    
      function findCC(mar) {
        let i, jj, ndb;
        let tcu ={c:0,e1:0,e2:0,n:0};
        const ccc = [];
      
        cumulat = [];
        pscCC = [];
        ezCC = [];

        // collect =C=
        for (i=1;i<mar.length;i++) { // loop over all atoms in mar[] to collect =C= in ccc[]
          if ((mar[i].el === "C") || (mar[i].bpa.length === 2)) { // only carbons with two bonding partners
            ndb = 0;
            for (jj=0;jj<mar[i].bpa.length;jj++) {
              if (mar[i].bpa[jj].t === 2) { // double bond
                ndb++;
              }
            }
            if ( ndb == 2) { // =C=
              ccc.push(i);
            }
          }
        }
        // find extent of each cumulene and store it in temp object tcu
        for (i=0;i<ccc.length;i++) {
          if (cumulat.includes(ccc[i])) { // don't consider atoms that have already been registered as part of a cumulene
          } else {
            //follow the cumulene and store it as cumulene object 
            tcu = followCumulene(mar,ccc[i]);
            if ((mar[tcu.e1].bpa.length === 1) || (mar[tcu.e2].bpa.length === 1)) { // cumulene with =CH2 end.
              continue;
            }      
            if (tcu.n % 2 === 0) { // even number of C atoms in cumulene system: can't be chiral
              ezCC.push(tcu); // store cumulene for later E/Z analysis by ezCCconfig()
              continue;
            } else { // odd number of C in cumulene: could be chiral 
              pscCC.push(tcu);          
            }
          }
        }
      } // find cumulenes and store them in ezCC[] (even) or pscCC[] (odd) arrays of cumulene objects
      
          
      function followCumulene(mar,ax) { // find out the extent of a cumulene system
        let i, k, n;
        let end1 = -1;
        let end2 = -1;
        let ca;
        let iscu = false;
        let cua = [];
        const tcu = new Cumulene(0,0,0,0);
        let cz = 0;
      
        cua = [];
        ca = ax;
      
        cua.push(ca); // record the starting atom in cua[]
        k=0;
        while ((end1 < 0) && (k <= 20)) { // follow the cumulene until one end is reached
          iscu = false;
          for (i=0;i<mar[ca].bpa.length;i++) { // for all bonding partners of the current node
            if ((mar[ca].bpa[i].t === 2) && (!(cua.includes(mar[ca].bpa[i].p)))) {
            // if current node has a DB to another node, which is not yet registered in cua[] 
              ca = mar[ca].bpa[i].p; // make it the new node to be examined
              cua.push(ca); // register the new node in cua[]
              iscu = true; //
              break;
            }
          }
          if (iscu === false) {
            end1 = ca; // one end of cumulene system identified
          }
          k++;
        }
        cua = [];
        ca = end1; // start a new search along cumlene system starting with the first end
        cua.push(ca);
        cumulat.push(ca);
        k=0;
        while ((end2 < 0) && (k <= 20)) { // follow the cumulene until the other end 
          iscu = false;
          for (i=0;i<mar[ca].bpa.length;i++) {
            if ((mar[ca].bpa[i].t === 2) && (!(cua.includes(mar[ca].bpa[i].p)))) {
              ca = mar[ca].bpa[i].p;
              cua.push(ca);
              cumulat.push(ca); // this time, we record the center in cumulat[], 
              // a global array storing all members of any cumulene system              
              iscu = true;
              break;
            }
          }
          if (iscu === false) {
            end2 = ca; // the other end is found, store it
          }
          k++;
        }

        n = cua.length;
        if (n % 2 !== 1) { // even number of C in Cumulene
          tcu.c = 0;
          tcu.e1 = end1;
          tcu.e2 = end2;
          tcu.n = n;
        } else { // odd number 
          cz = Math.floor(n/2);
          tcu.c = cua[cz];
          tcu.e1 = end1;
          tcu.e2 = end2;
          tcu.n = n;
        }
        return tcu;

      } // auxiliary to explore extent of cumulenes, returns cumulene object

      function get_ccSense_one(mar,bar,scCu,mode) {
        // param: mode: 'gen' for SMILES generation; 'parse' for SMILES parsing
        let jj;
        const tcu = new Cumulene(0,0,0,0);
        let lige1 = [0,0];
        let lige2 = [0,0];
        let tet = [];
        let tetat = [];
        let origtetat = [];
        let set_z_0 = [];
        let cwwe = [];
        let steli = [];
        let incend = 0;
        let xHe1 = 0;
        let yHe1 = 0;
        let zHe1 = 0;
        let xHe2 = 0;
        let yHe2 = 0;
        let zHe2 = 0;
        let e2DB = 0;
        let e1DB = 0;
        let xav = 0;
        let yav = 0;
        let dx=0;
        let dy=0;
        let ve1cx = 0;
        let ve1cy = 0;
        let ve2cx = 0;
        let ve2cy =  0;
        let d = 0;
        let ix0 = -1;
        let ix1 = -1;
        let bix = -1;
        let dh = 0;
        let sense = '';
      
        tcu.c = scCu.c;
        tcu.e1 = scCu.e1;
        tcu.e2 = scCu.e2;
        tcu.n = scCu.n;
      
      
        // vectors from cental atom to ends of cumulene
        ve1cx = mar[tcu.e1].x-mar[tcu.c].x;
        ve1cy = mar[tcu.e1].y-mar[tcu.c].y;
        ve2cx = mar[tcu.e2].x-mar[tcu.c].x;
        ve2cy = mar[tcu.e2].y-mar[tcu.c].y;
      
      
        lige1 = [];
        lige2 = [];
        set_z_0 = [];
        cwwe = [];
        origtetat = [];
        tetat = [];
        steli = [];
      
        // inspect out-of-plane end
        for (jj=0;jj<mar[tcu.e1].bpa.length;jj++) {
          // test for central wedge wide ends
          if ((mar[tcu.e1].z !==0) && (mar[tcu.e1].bpa[jj].t > 3)){
            bix = getBondIndex(bar,tcu.e1,mar[tcu.e1].bpa[jj].p);
            if (bar[bix].toa === tcu.e1) {
              cwwe.push(mar[tcu.e1].bpa[jj].p);
            }
          }
          if ( mar[tcu.e1].bpa[jj].p === incoming[tcu.e1] ) { // the incoming ligand of tcu.e1
            if (!(mar[tcu.e1].bpa[jj].t === 2)) { // not the DB
              incend = 1; // remember the incoming side
              lige1.push(mar[tcu.e1].bpa[jj].p); // put ligand into temp array lige1[] for e1
            }
          } else if (!(mar[tcu.e1].bpa[jj].t === 2)) { // not the incoming ligand and not DB ligand
            lige1.push(mar[tcu.e1].bpa[jj].p); // put ligand into temp array lige1[] for e1
          }
          if (mar[tcu.e1].bpa[jj].t === 2) {
            e1DB = mar[tcu.e1].bpa[jj].p; // remember the DB partner of e1 for implicit H calc
          }
        }
        // inspect in-plane end
        for (jj=0;jj<mar[tcu.e2].bpa.length;jj++) {
          // test for endo wide end
          if (mar[mar[tcu.e2].bpa[jj].p].z !== 0) {
            set_z_0.push(mar[tcu.e2].bpa[jj].p);
          }
          if ( mar[tcu.e2].bpa[jj].p === incoming[tcu.e2] ) { // the incoming ligand of tcu.e2
            if (!(mar[tcu.e2].bpa[jj].t === 2)) { // not the DB
              incend = 2; // remember the incoming side
              lige2.push(mar[tcu.e2].bpa[jj].p); // put ligand into temp array lige2[] for e2
            }
          } else if (!(mar[tcu.e2].bpa[jj].t === 2)) { // not the incoming ligand and not DB ligand
            lige2.push(mar[tcu.e2].bpa[jj].p); // put ligand into temp array lige2[] for e2
          }
          if (mar[tcu.e2].bpa[jj].t === 2) {
            e2DB = mar[tcu.e2].bpa[jj].p; // remember the DB partner of e2 for implicit H calc
          }
        }
        if ((mode==='parse') && (lige2.length===2)) { // bugfix 190205.1 
          if (lige2[0] > lige2[1]) { // for parsing, the ligand coming first in SMILES is the incoming ligand, swap if necessary
            lige2.reverse();
          }  
        }
        // H at out-of-plane end
        if (lige1.length === 1) { // only one non-H single bonded ligand at e1: there must be a H
          if (mar[tcu.e1].eh > 0) { // explicit H
            xHe1 = mar[tcu.e1].hx;
            yHe1 = mar[tcu.e1].hy;
            zHe1 = mar[tcu.e1].hz;
          } else { // implicit H: we have to calculate its coordinates from other ligands
            xav = (mar[e1DB].x + mar[lige1[0]].x)/2;
            yav = (mar[e1DB].y + mar[lige1[0]].y)/2;
            dx = mar[tcu.e1].x - xav; // vector from average to e2, x-coord
            dy = mar[tcu.e1].y - yav; // vector from average to e2, y-coord
            d = Math.sqrt(dx*dx + dy*dy); // vector from average to e2, length
            xHe1 = mar[tcu.e1].x + bondlength*dx/d;
            yHe1 = mar[tcu.e1].y + bondlength*dy/d;
            zHe1 = (-1)*mar[lige1[0]].z; // must be opposite to other ligand in z
          }
          lige1.unshift(-1);
        }
        // H at in-plane end
        if (lige2.length === 1) { // only one non-H single bonded ligand at e2
          if (mar[tcu.e2].eh > 0) { // explicit H
            xHe2 = mar[tcu.e2].hx;
            yHe2 = mar[tcu.e2].hy;
            zHe2 = mar[tcu.e2].hz;
          } else { // implicit H: we have to calculate its coordinates from other ligands
            xav = (mar[e2DB].x + mar[lige2[0]].x)/2;
            yav = (mar[e2DB].y + mar[lige2[0]].y)/2;
            dx = mar[tcu.e2].x - xav; // vector from average to e2, x-coord
            dy = mar[tcu.e2].y - yav; // vector from average to e2, y-coord
            d = Math.sqrt(dx*dx + dy*dy); // vector from average to e2, length
            xHe2 = mar[tcu.e2].x + bondlength*dx/d;
            yHe2 = mar[tcu.e2].y + bondlength*dy/d;
            zHe2 = (-1)*mar[lige2[0]].z; // must be opposite to other ligand in z
          }
          lige2.unshift(-1);          
        }
        // we now have the lige1 and lige2 arrays filled with the 4 relevant ligands, with H first, if present.
      
        // fill the m4cc[] atoms array in the correct order. 
        // x,y coordinates of ligands are shifted to shrink tetrahedron as if ligands were on central atom.
      
      
        // element 0 is the central cumulene C with coordinates (0|0|0)
        m4cc = [];          
        m4cc[0] = new Atom(mar[tcu.c].an, mar[tcu.c].el, mar[tcu.c].x, mar[tcu.c].y, 0, 0, 0);
        origtetat.push(tcu.c);
        if (incend === 1) { // incoming side is e1
          // incoming end
          if (lige1[0] === incoming[tcu.e1]) { // incoming is lige1[0], put it to m4cc first then lige1[1] into m4cc next
            m4cc[1] = new Atom(mar[lige1[0]].an, mar[lige1[0]].el, mar[lige1[0]].x-ve1cx, mar[lige1[0]].y-ve1cy,0, 0, mar[lige1[0]].z);
            origtetat.push(lige1[0]);
            steli.push(1);              
            if (lige1[1] !== -1) { // not H
              m4cc[2] = new Atom(mar[lige1[1]].an, mar[lige1[1]].el, mar[lige1[1]].x-ve1cx, mar[lige1[1]].y-ve1cy,0, 0, mar[lige1[1]].z);
              origtetat.push(lige1[1]);
              steli.push(2);              
            } else { // it is H
              m4cc[2] = new Atom(1, "H", xHe1-ve1cx, yHe1-ve1cy,0, 0, zHe1);
              origtetat.push(-1);
              steli.push(2);              
            }                
          } else { // lige1[1] is the incoming: put it into m4cc first, then lige1[0] next
            m4cc[1] = new Atom(mar[lige1[1]].an, mar[lige1[1]].el, mar[lige1[1]].x-ve1cx, mar[lige1[1]].y-ve1cy,0, 0, mar[lige1[1]].z);              
            origtetat.push(lige1[1]);
            steli.push(1);              
            if (lige1[0] !== -1) { // not H
              m4cc[2] = new Atom(mar[lige1[0]].an, mar[lige1[0]].el, mar[lige1[0]].x-ve1cx, mar[lige1[0]].y-ve1cy,0, 0, mar[lige1[0]].z);
              origtetat.push(lige1[0]);
              steli.push(2);              
            } else { // it is H
              m4cc[2] = new Atom(1, "H", xHe1-ve1cx, yHe1-ve1cy,0, 0, zHe1);
              origtetat.push(-1);
              steli.push(2);              
            }
          }
          // outgoing end
          if (lige2[0] === -1) { // it is H 
            m4cc[3] = new Atom(mar[lige2[1]].an, mar[lige2[1]].el, mar[lige2[1]].x-ve2cx, mar[lige2[1]].y-ve2cy,0, 0, mar[lige2[1]].z);
            origtetat.push(lige2[1]);              
            m4cc[4] = new Atom(1, "H", xHe2-ve2cx, yHe2-ve2cy,0, 0, zHe2); // H on outgoing end comes after non-H ligand
            origtetat.push(-1);              
          } else { // both lige2[0] and lige2[1] are non-H
          // figure out which one of lige2[] comes first in the smiles array
            if (mode === 'parse') {
              ix0 = Math.min(lige2[0],lige2[1]);
              ix1 = Math.max(lige2[0],lige2[1]);
            } else {
              ix0 = smilesarray.indexOf(lige2[0]);
              ix1 = smilesarray.indexOf(lige2[1]);
            }
            if (ix0 < ix1) { // lige2[0] comes first
              m4cc[3] = new Atom(mar[lige2[0]].an, mar[lige2[0]].el, mar[lige2[0]].x-ve2cx, mar[lige2[0]].y-ve2cy,0, 0, mar[lige2[0]].z);
              origtetat.push(lige2[0]);              
              m4cc[4] = new Atom(mar[lige2[1]].an, mar[lige2[1]].el, mar[lige2[1]].x-ve2cx, mar[lige2[1]].y-ve2cy,0, 0, mar[lige2[1]].z);
              origtetat.push(lige2[1]);              
            } else {
              m4cc[3] = new Atom(mar[lige2[1]].an, mar[lige2[1]].el, mar[lige2[1]].x-ve2cx, mar[lige2[1]].y-ve2cy,0, 0, mar[lige2[1]].z);
              origtetat.push(lige2[1]);              
              m4cc[4] = new Atom(mar[lige2[0]].an, mar[lige2[0]].el, mar[lige2[0]].x-ve2cx, mar[lige2[0]].y-ve2cy,0, 0, mar[lige2[0]].z);
              origtetat.push(lige2[0]);
            }              
          }
        } else if (incend === 2) { // incoming side is e2
          // incoming end
          if (lige2[0] === incoming[tcu.e2]) { // lige2[0] is incoming, put lige2[1] into m4cc next
            m4cc[1] = new Atom(mar[lige2[0]].an, mar[lige2[0]].el, mar[lige2[0]].x-ve2cx, mar[lige2[0]].y-ve2cy,0, 0, mar[lige2[0]].z);
            origtetat.push(lige2[0]);              
            if (lige2[1] !== -1) { // not H
              m4cc[2] = new Atom(mar[lige2[1]].an, mar[lige2[1]].el, mar[lige2[1]].x-ve2cx, mar[lige2[1]].y-ve2cy,0, 0, mar[lige2[1]].z);
              origtetat.push(lige2[1]);              
            } else { // it is H
              m4cc[2] = new Atom(1, "H", xHe2, yHe2,0, 0, zHe2);
              origtetat.push(-1);              
            }                
          } else { // lige2[1] is incoming: put lige2[0] into m4cc next
            m4cc[1] = new Atom(mar[lige2[1]].an, mar[lige2[1]].el, mar[lige2[1]].x-ve2cx, mar[lige2[1]].y-ve2cy,0, 0, mar[lige2[1]].z);
            origtetat.push(lige2[1]);              
            if (lige2[0] !== -1) { // not H
              m4cc[2] = new Atom(mar[lige2[0]].an, mar[lige2[0]].el, mar[lige2[0]].x-ve2cx, mar[lige2[0]].y-ve2cy,0, 0, mar[lige2[0]].z);
              origtetat.push(lige2[0]);              
            } else { // it is H
              m4cc[2] = new Atom(1, "H", xHe2-ve2cx, yHe2-ve2cy,0, 0, zHe2);
              origtetat.push(-1);              
            }
          }
          // outgoing end
          if (lige1[0] === -1) { // it is H
            m4cc[3] = new Atom(mar[lige1[1]].an, mar[lige1[1]].el, mar[lige1[1]].x-ve1cx, mar[lige1[1]].y-ve1cy,0, 0, mar[lige1[1]].z);
            origtetat.push(lige1[1]);
            steli.push(3);              
            m4cc[4] = new Atom(1, "H", xHe1-ve1cx, yHe1-ve1cy,0, 0, zHe1); // H on outgoing end comes after non-H ligand
            origtetat.push(-1);              
            steli.push(4);
          } else { // both lige1[0] and lige1[1] are non-H
          // figure out which one of lige1[] comes first in the smiles array
            if (mode === 'parse') {
              ix0 = Math.min(lige1[0],lige1[1]);
              ix1 = Math.max(lige1[0],lige1[1]);
            } else {
              ix0 = smilesarray.indexOf(lige1[0]);
              ix1 = smilesarray.indexOf(lige1[1]);
            }
            if (ix0 < ix1) { // lige1[0] comes first
              m4cc[3] = new Atom(mar[lige1[0]].an, mar[lige1[0]].el, mar[lige1[0]].x-ve1cx, mar[lige1[0]].y-ve1cy,0, 0, mar[lige1[0]].z);
              origtetat.push(lige1[0]);
              steli.push(3);              
              m4cc[4] = new Atom(mar[lige1[1]].an, mar[lige1[1]].el, mar[lige1[1]].x-ve1cx, mar[lige1[1]].y-ve1cy,0, 0, mar[lige1[1]].z);
              origtetat.push(lige1[1]);              
              steli.push(4);              
            } else { // lige1[1] comes first
              m4cc[3] = new Atom(mar[lige1[1]].an, mar[lige1[1]].el, mar[lige1[1]].x-ve1cx, mar[lige1[1]].y-ve1cy,0, 0, mar[lige1[1]].z);
              origtetat.push(lige1[1]);              
              steli.push(3);              
              m4cc[4] = new Atom(mar[lige1[0]].an, mar[lige1[0]].el, mar[lige1[0]].x-ve1cx, mar[lige1[0]].y-ve1cy,0, 0, mar[lige1[0]].z);
              origtetat.push(lige1[0]);              
              steli.push(4);              
            }
          }
        } // end of filling m4cc
        // correct z-coordinates for endo wide end ligands
        for (jj=1;jj<origtetat.length;jj++) {
          if (set_z_0.includes(origtetat[jj])) {
            m4cc[jj].z = 0;
          }
        }
        // correct z-coordinates for central wide end ligands
        for (jj=1;jj<origtetat.length;jj++) {
          if (cwwe.includes(origtetat[jj])) {
            m4cc[jj].z = (-1)*mar[tcu.e1].z;
          }
        }
        // test for same z for both ligands on the stereo-end
        if (m4cc[steli[0]].z === m4cc[steli[1]].z) {
          warnAtoms.push(origtetat[0]);
          return;
        }
        tetat = [0,1,2,3,4,];
        // determine the sense
        tet = getTet(m4cc,tetat,[0,0,0,0,0],[0,0,0,0,0],4110,mode);
        dh = volTet(tet);
        if (dh > 0) {
          ccSense[String(tcu.c)] = "@";
          mar[tcu.c].rs = "@";
          sense = '@';
        } else if (dh < 0) {
          ccSense[String(tcu.c)] = "@@";
          mar[tcu.c].rs = "@@";
          sense = '@@';        
        } else if (dh === 0) { 
          return '';
        }
        if (mode === 'parse') {
          return sense;
        }
      } // determines the sense of chirality of a chiral cumulene and sets the rs property of the central atom

      function get_scSense_one(mar, bar, scat, scStr, sortar, mode) { // determines the chirality sense of one stereogenic center (returns @ or @@)
      // used in SMILES generation and SMILES parsing, depending on flag mode ('gen' | 'parse')
      // requires that the smiles array sortar[] and ringclosures[] have been filled beforehand
      // parameters:   mar is the atoms array (generation: m_s[]; parsing: m[]) 
      //      scat ist the scAtom for which the sense shall be determined
      //      scStr generation: the valence configuration of scat; parsing: empty string '' 
      //      sortar generation: the array of atom indices corresponding to onumsmiles; parsing: the array of the 5 atoms in the right order 

        let i, jj, k;
        let c1="", c2="";
        let c1c2 = [];
        let r1=0, r2=0;
        let inc =0;
        let nh=0;
        let ligat = [];
        let rigat = [];
        let tet = [];
        let tetat = [];
        const centroWE = [];
        const endoWE = [];
        let scix = -1;
        let incix = -1;
        let lincix = -1;
        let dh = 0;
        let bix = 0;
        let cbix =0;
        let hasEndoWE = false;
        let stereocode1 = 0;
        let stereocode2 = 0;
        let result = "";
      
        ligat = [];
        rigat = [];
        tet = [];
        nh = 0;
        inc = 0;
      
        // get stereocode1
        stereocode1 = getStereoCode_at(mar,bar,scat,mode);
      
        if (mode === 'gen') { // part one as used for SMILES generation
  // part one: determine the sequence of five atoms of the tetrahedron => tetat[scat, inc, ligat[0,1,2]]        
          scix = sortar.indexOf(scat); // index of scat in sortar
          // determine the incoming of scat in the smiles array sortar[]
          // inc is the last bonding partner of scat listed before scat in sortar[]
          lincix = -1;
          for (i=0;i<mar[scat].bpa.length;i++) {
            incix =  sortar.indexOf(mar[scat].bpa[i].p);
            if ((incix >= 0) && (incix < scix)) {
              if (incix > lincix) {
                lincix = incix;
              }
            } 
          }
          if (lincix >=0) {
            inc = sortar[lincix];
          }
      
      
          nh = getImplicitH(mar,scat);
          if (pyrSC.includes(scStr)) { // it is a pyramidal stereogenic center
            ligat.push(0); // stands for lone pair. If present, it comes first in ligat[]
          } 
          if ((nh === 1) && (!(inc === 0))) { // if there is an implicit H
                            // and if it is not the incoming atom.  
            if (mar[scat].eh !== 0) { // was explicit H => use coordinates in SC    
              ligat.push(-1); 
            } else {
              ligat.push(0); // implicit H, no lone pair => coordinates from other ligands
            }
          }
          // deal with ring closures as ligands
          if (rcstr[String(scat)] !== undefined) { // SC has ring closures, they come next in ligat[]
            // ringclosures have been sorted in numeric order by strRC, search from low to high
            for (jj=0;jj<ringclosures.length;jj++) { //
              c1c2 = ringclosures[jj].split(':'); // extract atoms from ring closures
              c1 = c1c2[0];
              c2 = c1c2[1];
              r1 = parseInt(c1,10);
              r2 = parseInt(c2,10);
              if ((r1 === scat) && (r2 !== inc)) { 
              // if a ring closure contains SC, the other number is a ligand
                ligat.push(r2);
              } else if ((r2 === scat) && (r1 !== inc)) {
                ligat.push(r1);
              }
            }
      
          }
      
          // construction of the rigat[] array of ligands
          for (jj=0;jj<mar[scat].bpa.length;jj++) { // for all bonding partners of SC
            if (mar[scat].bpa[jj].p !== inc)  { // except the incoming one
              if (!(ligat.includes(mar[scat].bpa[jj].p))) { // and not yet in ligat (ring closure)
                rigat.push(mar[scat].bpa[jj].p); // store ligand in rigat[]                                
              }
            }
          }
      
          rigat = sort_by_numSmiles(rigat,scat,sortar); // sort ligands in rigat according to left-right in Smiles
      
      
          for (jj=0;jj<rigat.length;jj++) { // concatenate ligat[] and rigat[]
            ligat.push(rigat[jj]);
          }
          if ((scix === 0) && (ligat[0] === 0)) {  
          //if this is the first atom in the smiles, consider implicit H as "incoming" atom
          //## might need correction: for volTet(), we need the coordinates of the incoming atom in every case
            ligat.shift();
          }
          tetat.push(scat,inc,ligat[0],ligat[1],ligat[2]);
        
        } else if (mode === 'parse') { // part one as used for SMILES parsing
          tetat = sortar.slice(0); // the five atoms for the tetrahedron are already defined in the right order in sortar[]
          ligat = tetat.slice(2);
        }
        // test SC for central wedge wide end (CWWE).
        centroWE.push(0);
        for (jj=1;jj<tetat.length;jj++) {
          if (tetat[jj] > 0) { // only to drawn ligands
            bix = getBondIndex(bar, scat, tetat[jj]);
            if ((bar[bix].btyp > 3) && (bar[bix].toa === scat)) { // CWWE at scat
              centroWE.push(1);
            } else {
              centroWE.push(0);
            }
          } else {
            centroWE.push(0);
          }
        }
        // test ligands for wedged bonds to atoms other than SC (endoWWE).
        endoWE.push(0);
        for (jj=1;jj<tetat.length;jj++) {
          cbix = getBondIndex(bar,tetat[jj],tetat[0]);
          hasEndoWE = false;          
          if (tetat[jj] > 0) { // only to drawn ligands
            for (k=0;k<mar[tetat[jj]].bpa.length;k++) {
              bix = getBondIndex(bar,tetat[jj],mar[tetat[jj]].bpa[k].p);
              if ((bar[bix].btyp > 3) && (bar[bix].toa ===  tetat[jj]) && (bar[bix].fra !== tetat[0])) {
                hasEndoWE = true;
              }   
              if ((hasEndoWE === true) && (bar[cbix].btyp > 3) && (bar[cbix].toa ===  tetat[jj])) {
                hasEndoWE = false; // no correction if wedge bond also between tetat[jj] and central atom
              }    
            }
          }
          if (hasEndoWE === true) {
            endoWE.push(1);
          } else {
            endoWE.push(0);
          }
        }
        // get stereocode1
        stereocode1 = getStereoCode_at(mar,bar,scat,mode);
      
        // get 3D-coordinates for all five atoms      
        tet = getTet(mar,tetat,centroWE,endoWE,stereocode1,mode);
        if (tet === null) {
          warnAtoms.push(scat);
          return "";
        }

      
        // determine the clock/anticlock sense of the ligands and return @@ or @
        if (ligat.length === 3) {
          stereocode2 = getStereoCodeTet(tet);
          tet = adjustTet(tet,tetat,stereocode2);
          tet = normalizeTet(tet);
          if (insideTet(tet) === false) {
            warnAtoms.push(scat);
            dh = 0;
          } else {
            dh = volTet(tet);
            if (dh === null) {
              warnAtoms.push(scat);
              dh = 0;
            }
          }
          if (dh > 0) {
            result = "@";
          } else if (dh < 0) {
            result = "@@";
          } else {
            result = "";
          }
        }
        return result;    
      } // determines the sense of a single chirality center
      // returns "@" or "@@"
    
      function getStereoCode_at(mar,bar,ca,mode) {
        // stereocode:   1st digit: number of ligands
        //      2nd digit: number of stereo-up ligands
        //      3rd digit: number of stereo-down ligands
        let i, bix;
        let n0=0;
        let n1=0;
        let n2=0;
      
        n0 = mar[ca].bpa.length;
      
        // take explicit H into account in 'gen' mode
        if ((mar[ca].eh > 0 ) && (mode !== 'parse')) {
          n0++;
          if (mar[ca].hz > 0) {
            n1++;
          } else if (mar[ca].hz < 0) {
            n2++;
          }
        }
        for (i=0;i<mar[ca].bpa.length;i++) {
          bix = getBondIndex(bar,ca,mar[ca].bpa[i].p);
          if(mar[ca].bpa[i].t === 4) {
            if (bar[bix].fra === ca) { // up-wedge narrow end at ca
              n1++;
            } else if (bar[bix].toa === ca) { // up-wedge wide end at ca
            // will be converted to down-wedge with narrow end at ca
              n2++;
            }
          }
          if(mar[ca].bpa[i].t === 5) {
            if (bar[bix].fra === ca) {  // down-wedge narrow end at ca
              n2++;
            } else if (bar[bix].toa === ca) { // down-wedge wide end at ca
            // will be converted to up-wedge with narrow end at ca
              n1++;
            }
          }
        }
        return n0*1000+n1*100+n2*10;
      } // calculates stereocode for SC

      function dfs(mar, stnode) { // mar is an array of atoms
      //dfs makes a DFS just counting the size of the tree
        const stack = []; // stack for nodes in DFP
        let node;
        let i = 0;
        let k = 0;
        let known = false;
      
        visnodesDFS = [];
        node = stnode;

        stack.push(node); // put the initial node onto stack for the initial pop
        k=0;
        while (stack.length > 0) {
  // SECTION A
          node = stack.pop(); // get the next node from stack
          known =  visnodesDFS.includes(node);
          if (!known) {
            visnodesDFS.push(node); // record of all isina nodes
          }            
  // SECTION B          
          for (i=0;i<mar[node].bpa.length;i++) { // for all bonding partners of node
            known =  visnodesDFS.includes(mar[node].bpa[i].p); // unless they are already visited
            if (!known) {
              stack.push(mar[node].bpa[i].p); // put them on the stack
            }
          }
          k++;
          if (k > 200 ) {break; } // safety for infinite loop
        } // end of while
        return visnodesDFS.length;
      } // makes a DFS just counting the size of the tree

      function dfsU(mar, stnode, inc) { // mar is an array of atom objects
      //dfsU makes a directed DFS avoiding backtracking towards inc (if inc is > 0)
      // dfsU generates a class_string and fills visnodesDFS[]
      // If inc > 0, inc and stnode are the first two atoms in visnodesDFS[]
      // dfsU is called by break_ties() and compareLigStereo()
    
        const stack = []; // stack for nodes in DFS
        let node;
        let i = 0;
        let k = 0;
        let known = false;
        let clastr = "";
      
        visnodesDFS = [];
        node = stnode;
      
        if (inc > 0) {
          visnodesDFS.push(inc);
          visnodesDFS.push(stnode);          
          clastr += String(mar[inc].cl) + "-";
          clastr += String(mar[stnode].cl);
        }

        stack.push(node); // put the initial node onto stack for the initial pop
        k=0;
        while (stack.length > 0) {
  // SECTION A
          node = stack.pop(); // get the next node from stack
          known =  visnodesDFS.includes(node);
          if (!known) {
            visnodesDFS.push(node); // record of all visited nodes
            if (k > 0) { clastr += "-";}
            clastr += String(mar[node].cl);
          } 
        
  // SECTION B                
          for (i=0;i<mar[node].bpa.length;i++) { // for all bonding partners of node
            known =  visnodesDFS.includes(mar[node].bpa[i].p); // unless they are already visited
            if (!known) {
              stack.push(mar[node].bpa[i].p); // put them on the stack
            } 
          }
          k++;
          if (k > 200 ) {break; } // safety for infinite loop
        } // end of while
      
        return clastr;
      } // generates a class_string and fills visnodesDFS[]
      // directed DFS avoiding backtracking towards inc (if inc is > 0)

      function sort_by_numSmiles(lar,sat,sortar) {
        let tligat=[];
        const tindex={};
        let tix = -1;
        let i;
      
        tligat = lar.slice(0);
        for (i=0;i<tligat.length;i++) {
          tix =  sortar.indexOf(tligat[i]);
          if (tix >=0) {
            tindex[String(tligat[i])] = tix;
          }
        }
        tligat.sort((a, b) => // a and b are elements of tabob (i.e the bpa array of ca)

        tindex[String(a)] - tindex[String(b)]);
      
        return tligat;
      

      } // sort ligands of atom according to order of appearance in numSMILES

      function getImplicitH(mar,ca) {
        let nv = 0; // normal valency
        let v = 0;  // actual valency
        let bo = 0; // bond order
        let nH = 0; // number of attached hydrogens
        let i=0;
        let normal = false;
      
        nv = val[mar[ca].an];
        v = 0;
        for (i=0;i<mar[ca].bpa.length;i++) {
          bo = mar[ca].bpa[i].t
          if ((bo === 4) || (bo === 5)) { bo = 1;} // stereo single bonds
          v += bo;
        }
        if (v <= nv) {
          normal = true;
        }
        if (mar[ca].c !== 0) {
          normal = false;
        }
        // higher valencies of S and P are also allowed in SMILES but then we do not attach implicit H
        if ((mar[ca].el === "S") && ((v === 4) || (v === 6))) { normal = false;} 
        if ((mar[ca].el === "P") && (v === 5)) { normal = false;}
        if (mar[ca].el === "C") {
          nH = nv - v - Math.abs(mar[ca].c);
        } else if ((organic.includes(mar[ca].el)) && (normal)){
          nH = nv - v + mar[ca].c; // number of attached H
        } else if (mar[ca].eh > 0) {
          nH = mar[ca].eh;
        } else {
          nH = 0;
        }
        return nH;      
      } // returns the number of implicit H at an atom
    
      function is_TBatom(mar,at) {
        let i=0;
        for (i=0;i<mar[at].bpa.length;i++) {
          if (mar[at].bpa[i].t === 3) {
            return mar[at].bpa[i].p;
          }
        }
        return 0;
      } // returns the other atom of a triple bond if at is part of a triple bond; 0 otherwise      

      function hasDB(mar,bar,ax) {
        let i=0;
        let result = 0;
        if (mar[ax].bpa.length > 0) {
          for (i=0;i<mar[ax].bpa.length;i++) {
            if (mar[ax].bpa[i].t === 2) {
              result++;
            }
          }
        }
        return result;      
      } // returns the number of double bonds at an atom     

      function is_ezCCend(at) {  // returns the other end of EZ_cumulene if at is end of ezCC cumulene
        let i;
        for (i=0;i<ezCC.length;i++) {
          if (at === ezCC[i].e1) {
            return ezCC[i].e2;
          } else if (at === ezCC[i].e2) {
            return ezCC[i].e1;
          }
        }
        return -1;
      } // returns the other end of cumulene if at is end of ezCC cumulene
    
      function getBondIndex(bar, fa, ta) { // parameters: bar b[]-type array, fa, ta two atoms
        let i;
        for (i=1;i<bar.length;i++) {
          if (((bar[i].fra === fa) && (bar[i].toa === ta)) || ((bar[i].fra === ta) && (bar[i].toa === fa))) {
            return i;
          }
        }
        return -1;
      } // returns index of bond in bar if fa and ta are the two atoms of a bond, -1 otherwise

      function hideBond(bix) {
        let i = 0, found = -1;
        let from_at, to_at;

        // remove the bpa entry in both atoms        
        from_at = b_s0[bix].fra;
        to_at = b_s0[bix].toa;
        found = -1;
        for (i=0;i<m_s0[from_at].bpa.length;i++) {
          if (m_s0[from_at].bpa[i].p === to_at) {
            found = i;
          }
        }
        if ( found >= 0) { m_s0[from_at].bpa.splice(found,1); }
        found = -1;
        for (i=0;i<m_s0[to_at].bpa.length;i++) {
          if (m_s0[to_at].bpa[i].p === from_at) {
            found = i;
          }
        }
        if (found >= 0) {m_s0[to_at].bpa.splice(found,1); }
        found = -1;
        // remove the bond from the b_s0 array
        b_s0.splice(bix,1);
      
      } // removes bond from data structures m_s0, b_s0. Used to detect ringbonds

      function findRingBonds(mar, bar) {
        let count = 0, i= 0;
        let frat=0; //bugfix 190319.1
        let known = false;
              
      // ringbonds[] contains the indices in b[] of ring bonds . b[ringbonds[i]] is a ring bond
        ringbonds = [];
        ringatoms = [];
        for (i=1;i<bar.length;i++) {  // for all bonds in the molecule
          count = 0;
          frat = bar[i].fra; //bugfix 190319.1
          genshadow(mar, m_s0, bar, b_s0);        // make shadow copy of shadow
          count = dfs(m_s0,frat); //bugfix 190319.1
          hideBond(i);        // hide bond with index i
//           count = dfs(m_s0, 1); bugfix 190319.1
          if (count === dfs(m_s0,frat)) { // still all atoms found in dfs: hidden bond is in ring: //bugfix 190319.1
            ringbonds.push(i);
            known =  ringatoms.includes(bar[i].fra);
            if (!known) { ringatoms.push(bar[i].fra); }
            known =  ringatoms.includes(bar[i].toa);
            if (!known) { ringatoms.push(bar[i].toa); }
          }
        }
      } // identifies ring bonds via DFS and hide bond. Fills ringbonds[] and ringatoms[]

      function isringbond(bar,fa,ta) { 
      // Requires that findRingBonds() has been called beforehand
      // returns true if fa-ta or ta-fa is a ring bond. 
        let i;
        let rb = -1;
        let found = false;
      
        for (i=0;i<ringbonds.length;i++) {
      
          rb = ringbonds[i];
          if (((bar[rb].fra === fa) && (bar[rb].toa === ta)) || ((bar[rb].fra === ta) && (bar[rb].toa === fa))) {
            found = true;
          } 
        }
        return found;
      } //returns true if atoms fa and ta are in a ring bond

  // AUXILIARY FUNCTIONS USED BY ALL SECTIONS
        
      function checkPB(ins) { //param: ins is a string
        let i=0;
        let npro=0;
        let nprc=0;
        let npso=0;
        let npsc=0;
        for (i=0;i<ins.length;i++) {
          if (ins.charAt(i)==='(') {
            npro++;
          }
          if (ins.charAt(i)===')') {
            nprc++;
          }
          if (ins.charAt(i)==='[') {
            npso++;
          }
          if (ins.charAt(i)===']') {
            npsc++;
          }          
        }
        if (npro !== nprc) {
          return 1;
        } else if (npso !== npsc) {
          return -1;
        } else {
          return 0;
        }      
      } // checks balancing of parathesis () and [] in SMILES //BF191122.1
        
      function sameArray(a1,a2) {
        let a1s = '';
        let a2s = '';
    
        if (a1.length !== a2.length) { return false; }
        a1s = a1.join();
        a2s = a2.join();
        if (a1s === a2s) { 
          return true;
        } else {
          return false;
        }
      } // returns true if two arrays of primitives contain the same elements in the same order
      
      function sameArrayElements(a1,a2) {
        const ta1=a1.slice(0);
        const ta2=a2.slice(0);
        if (sameArray(ta1.sort((a, b) => a-b),ta2.sort((a, b) => a-b))) {
          return true;
        } else {
          return false;
        }
      } // returns true if two arrays have the same elements in any order

      function isarinar(ar,ar2d) {
        let i=0;
        const str1=ar.join();
        let str2='';
        
        for (i=0;i<ar2d.length;i++) {        
          str2=ar2d[i].join();
          if (str1===str2) {
            return true;
          }
        }
        return false;
      } //tests whether array ar[] is present in the 2D array ar2d[])

      function merge_array(array1, array2) {
        const result_array = [];
        const arr = array1.concat(array2);
        let len = arr.length;
        const assoc = {};

        while(len--) {
          const item = arr[len];

          if(!assoc[item]) { 
            result_array.unshift(item);
            assoc[item] = true;
          }
        }

        return result_array;
      } // merges two arrays

      function intersect(ar1,ar2) {
        const common=[];
        let k=0;
    
        for (k=0;k<ar2.length;k++) {
    
          if (ar1.includes(ar2[k])) {
            common.push(ar2[k]);
          }
        }
        return common;
      } // returns an array of elements that are common to arrays ar1,ar2
      
      function f1(ii) {
        return String(Math.round(10*ii)/10);
      } // float xxx.x formating

      function f2(ii) {
        return String(Math.round(100*ii)/100);
      } // float xxx.xx 
           
      function f3(ii) {
        return String(Math.round(1000*ii)/1000);
      } // float xxx.xxx      

      
      
  // ANGLE FUNCTIONS: all directional angles are in degrees counterclockwise (0 : east, 90: nord, 180: west, 270: south)

      function norma(ang) { // keep angles in the 0 to <360 region
        ang %= 360;
        if (ang < 0) { ang += 360 }
        return ang % 360;
      } // angle normalization to 0-360
    
      function getdirangle(x1,y1,x2,y2) { // vector x1|y1 - >x2|y2
        let dx=0, dy=0, ata=0, deg=0;

        dx = x2 - x1;
        dy = y2 - y1;
          ata = Math.atan2(dy, dx);
        if (ata < 0) { 
          ata = ata + 2*Math.PI ; 
        }
        deg = 180*ata/Math.PI;
        return norma(360 - deg);
      } // get angle of direction (x1|y1)->(x2|y2)
    
      function getdiranglefromAt(mar,a1,a2) {  // vector a1-> a2      
        return getdirangle(mar[a1].x, mar[a1].y, mar[a2].x, mar[a2].y);
      } // get angle of direction a1->a2 
    
      function getbondangle(x1,y1,x2,y2,x3,y3) {  // angle 2-1-3, 1 in vertex, in deg

        let d12x=0, d12y=0, d13x=0, d13y=0, vsp=0, bd12=0, bd13=0, co=0, res=0;
      
        d12x = x2-x1; d12y = y2-y1; d13x = x3-x1; d13y = y3-y1;
        vsp = d12x*d13x + d12y*d13y;
        bd12 = Math.sqrt(d12x*d12x + d12y*d12y);
        bd13 = Math.sqrt(d13x*d13x + d13y*d13y);
        co = vsp/(bd12*bd13);
        if (co > 1) { co=1; } //BUGFIX 191225.1
        if (co < -1) { co=-1; } //BUGFIX 191225.1 //es
        res = 180*Math.acos(co)/Math.PI;
        return res;
      } // angle 2-1-3, 1 in vertex, in deg
    
      function distAtBond(mar,bar,ax,bx) {
        let bl = 0;
        let alph = 0;
      
        bl = Math.sqrt((mar[bar[bx].fra].x-mar[ax].x)*(mar[bar[bx].fra].x-mar[ax].x)+(mar[bar[bx].fra].y-mar[ax].y)*(mar[bar[bx].fra].y-mar[ax].y));      
        alph = getbondanglefromAt(mar,bar[bx].fra,bar[bx].toa,ax);
        return bl*Math.sin(Math.PI*alph/180);
      }  // returns distance (orthogonal) between atom ax and bond bx

      function getsectorfromDir(d1, d2) {
        return norma(norma(d2)-norma(d1));
      } // returns angle between two directional angles
    
      function getSectorsAt(mar,at,sortwi) {
        //param:   at: atom index in mar[],
        //          sortwi: true -> sorts the sectors along increasing width
        //                  false -> sectors along increasing dir of right flank atom
        let i=0;
        const dirs = [];
        const ligs = [];
        let r = 0;
        let l = 0;
        let w = 0;
      
        sectors = [];
        for (i=0;i<mar[at].bpa.length;i++) {
          if ((mar[mar[at].bpa[i].p].x !== 0) && (mar[mar[at].bpa[i].p].y !== 0)) {
            dirs.push(getdiranglefromAt(mar,at,mar[at].bpa[i].p));
            ligs.push(mar[at].bpa[i].p);
          }        
        }
        // sort the ligs and dirs according to increasing directional angles with east=>0
        dirs.sort((a, b) => a - b);
        ligs.sort((a, b) => getdiranglefromAt(mar,at,a) - getdiranglefromAt(mar,at,b));

        if (ligs.length > 0) {
          for (i=0;i<ligs.length-1;i++) {
            w = getsectorfromDir(dirs[i],dirs[i+1]);
            r = ligs[i];
            l = ligs[i+1];
            sectors.push(new Sector(r,l,w));
          }
          w = getsectorfromDir(dirs[ligs.length-1],dirs[0]);
          r = ligs[ligs.length-1];
          l = ligs[0];
          sectors.push(new Sector(r,l,w));
          if (sortwi) {
            sectors.sort((a, b) => a.wi - b.wi); // sort the sectors according to increasing width
          }
        }      
      } // fills the array sectors[] with the Sectors{} around an atom and optionally sorts the array according to increasing width

      function getBisectorsAt(mar,at,sortwi) {
        let i=0;
        let bid=0;
      
        sectors=[];
        bisectors=[];
        getSectorsAt(mar,at,sortwi);
        if (sectors.length===0) {
          return;
        }
        for (i=0;i<sectors.length;i++) {
          bid = norma(getdiranglefromAt(m,at,sectors[i].ra)+sectors[i].wi/2);
          if ((Math.floor(sectors[i].wi) > 180) || (Math.floor(sectors[i].wi)===0)) {
            bid = norma(180+bid);
          }
          bisectors.push(bid);
        }
      } // calls getSectorsAt() then fills the global bisectors[] with the directions in ° 
        // of the bisecting vector of each sector (index in parallel with sectors[])
      
      function isInSector(mar,at,dir) {
        let i=0;
        let ldir=0;
        let rdir=0;
        
        if (sectors.length===0) {
          return -1;
        } else if (sectors.length===1) {
          return 0;
        } else {
          for (i=0;i<sectors.length;i++) {
            rdir = getdiranglefromAt(mar,at,sectors[i].ra);
            ldir = getdiranglefromAt(mar,at,sectors[i].la);
            if ((ldir < rdir ) || ((rdir===0) && (ldir > rdir))) { // sector spans 0
              if (((dir > rdir) && (dir <= 360)) || ((dir < ldir) && (dir >= 0)))  {
                return i;
              } 
            } else { // sector does not span 0
              if ((dir > rdir) && (dir < ldir)) {
                return i;
              }
            }
          }
        }  
        return -1;
      }  // returns the index of the sector at atom mar[at] that spans the direction dir. If none found: -1
        // requires that getSectorsAt() or getBisectorsAt() have been called beforehand               

      function getbisectorfromDir(d1,d2) {
        return norma(d1 + getsectorfromDir(d1,d2)/2);      
      }  // returns the bisecting direction (deg) bewteen two directional angles (deg)
    
      function getBisectorFrom3At(mar,ac,al1,al2,opp) { 
      // params: ac is the central atom, al1 and al2 are the ligands of ac
      //       if opp===true, the opposite direction is returned
    
        const v1 = new Coord(0,0);
        const v2 = new Coord(0,0);
        let vsum = new Coord(0,0);
        let vsl = 0;
      
        v1.x =  mar[al1].x - mar[ac].x;
        v1.y =  mar[al1].y - mar[ac].y;
        vsl = Math.sqrt(v1.x*v1.x + v1.y*v1.y);
        v1.x = v1.x/vsl;
        v1.y = v1.y/vsl;
      
        v2.x =  mar[al2].x - mar[ac].x;
        v2.y =  mar[al2].y - mar[ac].y;
        vsl = Math.sqrt(v2.x*v2.x + v2.y*v2.y);
        v2.x = v2.x/vsl;
        v2.y = v2.y/vsl;
        vsum = vadd2d(v1,v2);
        vsl = Math.sqrt(vsum.x*vsum.x + vsum.y*vsum.y);
        if (vsl===0) { //es
            return norma(getdiranglefromAt(mar,ac,al1)+((opp===false)? 90 : -90));
        }          
        if (opp===false) {
          return getdirangle(0,0,vsum.x,vsum.y);
        } else {
          return getdirangle(vsum.x,vsum.y,0,0);
        } 
      } // returns the direction of the bisector of bondangle al1-ac-al2 or its 180-opposite if opp===true

      function getbondanglefromAt(mar,ca,a1,a2) {  // angle a1-ca-a2 in deg
      
        return getbondangle(mar[ca].x, mar[ca].y, mar[a1].x, mar[a1].y, mar[a2].x, mar[a2].y); 
      } // bondangle between ca-a1 and ca-a2
    
      function sort_abop_by_dir(mar,ca) {
        const tabop = mar[ca].bpa.slice(0);  // make a local copy of bpa[]
    
        tabop.sort((a, b) => getdiranglefromAt(mar,ca,a.p) - getdiranglefromAt(mar,ca,b.p));
        mar[ca].bpa = tabop.slice(0);
      } // sorts bonding partners according to their direction (starting with 0=east, ccw)

      function getPrefBisect(mar,a) { // return the preferred direction for charge string
      // returns the bisector of the largest sector between two bonds of an atom
      // this function relies on the bonding partners in m[a].bpa being sorted 
      // counterclockwise starting with the lowest directional angle (0 => east)
    
        let i = 0, bang =0, bise =0, bamax = -1, biofmax = 0;
        const dan =[];

        if (mar[a].bpa.length === 0) { return 0; } //isolated atom, preferred dir is 0° (right)
        if (mar[a].bpa.length > 0) {  // at least one bond
          i=0;
          while (i < mar[a].bpa.length) {
            dan.push(getdiranglefromAt(mar,a, mar[a].bpa[i].p));
            if (mar[a].bpa.length === 1) { return norma(180 + dan[dan.length-1]); } //one bond only, preferred dir opposite to bond
            if (i > 0) { // 2nd or higher bond
              bang = getsectorfromDir(dan[i-1], dan[i]);
              bise = getbisectorfromDir(dan[i-1], dan[i]);
              if (bang > bamax) { 
                bamax = bang;
                biofmax = bise;
              }               
            }
            i++;
          }
          if (mar[a].bpa.length > 1) { // close cycle between last and first bond
            bang = getsectorfromDir(dan[dan.length-1], dan[0]);
            bise = getbisectorfromDir(dan[dan.length-1], dan[0]);
            if (bang > bamax) { 
              bamax = bang;
              biofmax = bise;
            }
          }         
        }
        return biofmax;  
      } // find bisecting direction of the largest angle between bonds to a.
          
      function calcCstrOffsetVector(rad, dir) { // returns a coordinate object {x: , y:}
        let birad=0;
        
          birad = Math.PI*dir/ 180; // => radians
          return {x: rad*Math.cos(birad), y: (-1)*rad*Math.sin(birad)} ;
      } // returns offset vector for charge string at atom from direction and radius
      
      function getArrowCoord(arwix,st_en) {
        // param: arwic: index of curved arrow in arro[]; st_en start='st' or end='en'
        let retco = new Coord(0,0);
        if (arro[arwix] !== undefined) {
          switch (st_en) {
            case 'st':
              if (arro[arwix].st < 0) {
                retco.x= (m[b[(-1)*arro[arwix].st].fra].x + m[b[(-1)*arro[arwix].st].toa].x)/2;
                retco.y= (m[b[(-1)*arro[arwix].st].fra].y + m[b[(-1)*arro[arwix].st].toa].y)/2;
              } else if (arro[arwix].st > 0) {
                retco.x= m[arro[arwix].st].x;
                retco.y= m[arro[arwix].st].y;
              }
              return retco;
            case 'en':
              if (arro[arwix].en < 0) {
                retco.x= (m[b[(-1)*arro[arwix].en].fra].x + m[b[(-1)*arro[arwix].en].toa].x)/2;
                retco.y= (m[b[(-1)*arro[arwix].en].fra].y + m[b[(-1)*arro[arwix].en].toa].y)/2;
              } else if (arro[arwix].en > 0) {
                retco.x= m[arro[arwix].en].x;
                retco.y= m[arro[arwix].en].y;
              }
              return retco;
              break;
          }
        }
      } // returns coordinates of start or end point of curved arrow in arro[] 
        // or [0,0] if arro[arwix] is undefined

  //VECTOR ALGEBRA FUNCTIONS
      function coor3d_at(mar,ca) {
        const atc = new Coord3d(0,0,0);
      
        atc.x = mar[ca].x;
        atc.y = mar[ca].y;
        atc.z = 0.5*bondlength*mar[ca].z;
        return atc;
      } // returns Coord3d object with 3D coordinates of atom

      function coor3d_H(mar,ca) {
        const atc = new Coord3d(0,0,0);
      
        atc.x = mar[ca].hx;
        atc.y = mar[ca].hy;
        atc.z = 0.5*bondlength*mar[ca].hz;
        return atc;
      } // returns Coord3d object with 3D coordinates of explicit H stored at ca
    
      function extrapolate_H_LP_coord3d(mar,te,tt,stereocode1) { 
        // param:   te is the tetat[] array of five atom indices
        //    tt is the an array of coord3d objects
        // COORDINATES OF LONE PAIR OR IMPLICIT H (ligat 0)
        // lone pair coordinates are calculated from the other ligands 
        // if present (phosphines and arsines), an explicit H will also be considered
        // H atoms on such centers with a lone pair and a H-ligand must be drawn with explicit H
        // in parse mode, this explicit H must be created as atom

        let jj;
        const atc = new Coord3d(0,0,0);
        let ba = [];
        let oop=-1, ang1=0, ang2=0, ang3=0, maxang=0, minang=0;
        let pl=-1, ml=1, sbl=-1;
        let ipl = [];
        let xsum = 0; 
        let ysum = 0; 
        let zsum = 0; 
        let bd = 0;
        let sumvl = 0;
        let scal = 1;
        let failed = false;
      
        if (tt[0].z !== 0) { 
          failed = true;
        }
        for (jj=1;jj<tt.length;jj++) { //add normalized bond vectors from scAtom to drawn ligands
          // in principle, z of the scAtom is always 0 because no broad ends of wedges are permitted at scAtoms
          if (te[jj] === 0) { continue; } // only consider drawn ligands and explicit H
          bd = Math.sqrt(((tt[jj].x - tt[0].x)*(tt[jj].x - tt[0].x)+(tt[jj].y - tt[0].y)*(tt[jj].y - tt[0].y)+(tt[jj].z - tt[0].z)*(tt[jj].z - tt[0].z)));
          xsum += (tt[jj].x - tt[0].x)*bondlength/bd;
          ysum += (tt[jj].y - tt[0].y)*bondlength/bd;
          zsum += (tt[jj].z - tt[0].z)*bondlength/bd;
        }
        sumvl = Math.sqrt(xsum*xsum+ysum*ysum+zsum*zsum);
        if (sumvl > 0) {
          scal = bondlength/sumvl; // normalize sum vector to bondlength
          xsum  *= scal; 
          ysum  *= scal; 
          zsum  *= scal; 
          atc.x = tt[0].x - xsum; 
          atc.y = tt[0].y - ysum; 
          atc.z = tt[0].z - zsum;
          // the vector (atc) now points from the scAtom in the direction opposite to the geometric center of the ligands
        } else { 
          failed = true;
        }
        switch (stereocode1) {
          case 3100:
          case 3010:
            oop = -1;
            ipl = [];
            for (jj=1;jj<5;jj++) { // pick the in plane and oop ligands
              if (te[jj] === 0) {
                continue; // skip lone pair or implicit H
              }
              if (tt[jj].z === 0) {
                ipl.push(jj);
              } else if (tt[jj].z !== 0) {
                oop = jj;
              }
            }
            ba = [];
            ang1 = norma(getbondangle(tt[0].x,tt[0].y,tt[ipl[0]].x,tt[ipl[0]].y,tt[ipl[1]].x,tt[ipl[1]].y));
            ang2 = norma(getbondangle(tt[0].x,tt[0].y,tt[oop].x,tt[oop].y,tt[ipl[0]].x,tt[ipl[0]].y));
            ang3 = norma(getbondangle(tt[0].x,tt[0].y,tt[oop].x,tt[oop].y,tt[ipl[1]].x,tt[ipl[1]].y));

            ba.push(ang1,ang2,ang3);
            ba.sort((a, b) => a - b);
            if (ba[0] + ba[1] <= 180) { // place LP or H in plane
              atc.z = 0;
            } else { // place LP or H at x,y and -z of the out of plane ligand
              atc.x = tt[oop].x;
              atc.y = tt[oop].y;
              atc.z = (-1)*tt[oop].z;
            }
            break;
          case 3110:
            for (jj=1;jj<5;jj++) { // pick the single bonded and oop ligands
              if ((te[jj] !== 0) && (tt[jj].z === 0)) {
                  sbl = jj;
              } else if ((te[jj] !== 0) && (tt[jj].z !== 0)) {
                if (tt[jj].z > 0) {
                  pl = jj;
                } else if (tt[jj].z < 0) {
                  ml = jj;
                }
              }
            }
            ang1 = norma(getbondangle(tt[0].x,tt[0].y,tt[pl].x,tt[pl].y,tt[ml].x,tt[ml].y));
            ang2 = norma(getbondangle(tt[0].x,tt[0].y,tt[sbl].x,tt[sbl].y,tt[pl].x,tt[pl].y));
            ang3 = norma(getbondangle(tt[0].x,tt[0].y,tt[sbl].x,tt[sbl].y,tt[ml].x,tt[ml].y));
            minang = Math.min(ang2,ang3);
            maxang = ang1+minang;
            if ((maxang >= 180) || ((ang1 > ang2) && (ang1 > ang3))) {
              failed = true;          
            } else {
              atc.z = 0;
            } 
            break;
          case 3200:
          case 3020:
          case 3300:
          case 3030:
          case 3210:
          case 3120:
            atc.z = 0;
        
        }
      

        if (failed === false) {
          return atc;
        } else {
          return null;
        }
      } // extrapolate lone pair or implicit H coordinates
    
      function vadd2d(v1,v2) { // v1 and v2 are 2D vectors (Coord)
        const vres = new Coord(0,0);

        vres.x = v2.x + v1.x;
        vres.y = v2.y + v1.y;
      
        return vres;
      }  // v1+v2 vector addition in 2D, returns Coord{} object
              
      function vsub2d(v1,v2) { // v1 and v2 are 2D vectors (Coord)
        const vres = new Coord(0,0);

        vres.x = v1.x - v2.x;
        vres.y = v1.y - v2.y;
      
        return vres;
      }  // v1-v2 vector subtraction in 2D, returns Coord{} object
      
      function vlen2d(v1) { // v1 is a vector (Coord object)
        return Math.sqrt(v1.x*v1.x+v1.y*v1.y);
      } // determines the length of a vector in 2D
      
      function vdot2d(v1,v2) { // v1 and v2 are 2D vectors (Coord)
        return v1.x*v2.x+v1.y*v2.y;
      }  // v1•v2 scalar product in 2D
            
      function vsub3d(v1,v2) { // v1, v2 are 3D vectors
        const vres = new Coord3d(0,0,0); //BF200222.2
      
        vres.x = v2.x - v1.x;
        vres.y = v2.y - v1.y;
        vres.z = v2.z - v1.z;
      
        return vres;
      } // returns 3D vector v2-v1 (Coord3d{} object)
    
      function vlen3d(v1) {
        return Math.sqrt(v1.x*v1.x+v1.y*v1.y+v1.z*v1.z);
      } // returns length of a 3D vector (x|y|z)
    
      function vscal3d(v1,scalf) {
        const vn = new Coord3d(0,0,0); //BF200222.2
      
        vn.x = v1.x*scalf;
        vn.y = v1.y*scalf;
        vn.z = v1.z*scalf;
        return vn;
      } // scaling of a 3D vector: returns new vector as Coord3D{} object
    
      function vecprodDB(l1,d1,d2,l2) {
        let x1, x2, x3, y1, y2, y3, dx12, dy12, dx13, dy13, vp1, vp2;
      
        x1 = m_s[d1].x;          y1= m_s[d1].y;
        x2 = m_s[d2].x;          y2= m_s[d2].y;
        x3 = m_s[l1].x;          y3= m_s[l1].y;
        dx12 = x2-x1; 
        dy12 = y2-y1;
        dx13 = x3-x1;
        dy13 = y3-y1;
        vp1 = dx12*dy13 - dx13*dy12;
        vp1 = vp1/Math.abs(vp1);
      
        x1 = m_s[d2].x;          y1= m_s[d2].y;
        x2 = m_s[d1].x;          y2= m_s[d1].y;
        x3 = m_s[l2].x;          y3= m_s[l2].y;
        dx12 = x2-x1; 
        dy12 = y2-y1;
        dx13 = x3-x1;
        dy13 = y3-y1;
        vp2 = dx12*dy13 - dx13*dy12;
        vp2 = vp2/Math.abs(vp2);
      
        return vp1*vp2;
      } // used for EZ: vector products at double bond [(l1-d1)x(d1-d2)]•[(d1-d2)x(d2-l2)] normed to cis=-1, trans=1
    
      function vecprod2d(d1x, d1y, d2x, d2y) {
        let vp;
      
          vp = d1x*d2y - d2x*d1y;
          if (Math.abs(vp) === 0) {
            return 0;
          } else {
            return vp/(Math.abs(vp));
          } 
      }  // used by mousemove()
          
      function getTet(mar,te,cwwe,endowe,stereocode1,mode) { // te[0] is SC, te[1] is inc, te[2-4] other ligands
      // mode: 'gen' for SMILES generation; 'parse' for SMILES parsing
      // cwwe[i]===1: double revision needed
      // endowe[i] ===1: ignore z of ligand
      // te[i] === -1 : explicit H
      // te[i] === 0 : implicit H or lone pair
      // returns tt[], an array of Coord3d objects
    
        let tco3d = new Coord3d(0,0,0); //BF200222.2
        const tt = [];
        let i=0;
        let failed = false;
        for (i=0;i<te.length;i++) {  // get the coordinates for drawn ligands and explicit H         
          if (te[i] === -1) {// explicit H
            tco3d = coor3d_H(mar,te[0]);
          } else if (te[i] > 0) {
            tco3d = coor3d_at(mar,te[i]); // drawn ligand            
          } else { // implicit H or LP: place holder (0|0|0) 
            tco3d = {x:0,y:0,z:0};
          }
          tt.push(tco3d);
        }
      
        if (mode === 'gen') {
          for (i=1;i<te.length;i++) {   // check for required double reversion of CWWE      
            if (cwwe[i] === 1) { 
                tt[i].z = (-1)*tt[0].z; 
                tt[0].z = 0;
            }
          }        
          // check for endoWE and correct
          for (i=1;i<te.length;i++) {   // reset z to 0 for endoWE ligands    
            if (endowe[i] === 1) { 
                tt[i].z = 0; 
            }
          }
        }        

        for (i=1;i<te.length;i++) {  // extrapolate LP or implicit H coord    
          if (te[i] === 0) {
            tco3d = extrapolate_H_LP_coord3d(mar,te,tt,stereocode1);
            if (!(tco3d === null)) {
              tt[i].x = tco3d.x;
              tt[i].y = tco3d.y;
              tt[i].z = tco3d.z;
            } else {
              failed = true;
            }
          }  
        }
        for (i=0;i<tt.length;i++) {  // normalize all z to 0 or ± 0.5 bondlength
          if (tt[i].z > 0) { tt[i].z = 0.5*bondlength; }
          if (tt[i].z < 0) { tt[i].z = (-1)*0.5*bondlength; }
        }
        if (!failed) {
          return tt;
        } else {
          return null;
        }
      } // constructs the tetrahedron around a stereogenic atom
    
      function normalizeTet(tt) {
        const v00 = new Coord3d(0,0,0);
        let v01 = new Coord3d(0,0,0);
        let v02 = new Coord3d(0,0,0);
        let v03 = new Coord3d(0,0,0);
        let v04 = new Coord3d(0,0,0);
        let vl1, vl2, vl3, vl4;
              
        // the 4 bond vectors are:
        v01 = vsub3d(tt[0],tt[1]);
        v02 = vsub3d(tt[0],tt[2]);
        v03 = vsub3d(tt[0],tt[3]);
        v04 = vsub3d(tt[0],tt[4]);
        vl1 = vlen3d(v01);
        vl2 = vlen3d(v02);
        vl3 = vlen3d(v03);
        vl4 = vlen3d(v04);
        v01 = vscal3d(v01,bondlength/vl1);
        v02 = vscal3d(v02,bondlength/vl2);
        v03 = vscal3d(v03,bondlength/vl3);
        v04 = vscal3d(v04,bondlength/vl4);
              
        tt=[];
        tt.push(v00);
        tt.push(v01);
        tt.push(v02);
        tt.push(v03);
        tt.push(v04);        
      
        return tt;
    
      } // normalizes the bond lengths of the tetrahedron in 3D
    
      function getStereoCodeTet(tet) {
        let i, np, nm;
        nm=0;
        np=0;
        for (i=1; i<5;i++) {
          if(tet[i].z > 0) {
            np++;
          } else if (tet[i].z < 0) {
            nm++;
          }
        }
        return 4000+np*100+nm*10;
      } // returns the stereocode for a tetrahedral SC: 4000+np*100+nm*10 (np: number of ligands with z>0, nm: number of ligands with z<0)

      function adjustTet(tt,tetat,code) {
        let i=0, zs=0, zi=0, tda=0, dazi=0; //BF200222.3
        const da=[];
        const tixa=[1,2,3,4];
      
        switch (code) {
          case 4100: 
          case 4010:
            // figure out which ligand has z ≠ 0 and whether it is + or -
            for (i=1; i<5;i++) {
              if (tt[i].z !== 0) {
                zs = tt[i].z;
                zi = i;
              }
            }
            // figure out which ligand is opposite to zi in xy
            da.push(0);
            for (i=1; i<5;i++) { 
              tda = getdirangle(tt[0].x,tt[0].y,tt[i].x,tt[i].y);
              da.push(tda);
            }
            dazi = da[zi];
            for (i=1;i<5;i++) {
              da[i] = norma(da[i]-dazi);
            }            
            tixa.sort((a, b) => da[a] - da[b]);

          // move the ligand with z ≠ 0 to x=0, y=0
          // move neighbour ligands out of the xy plane in the direction opposite to the ligand with z ≠ 0
            for (i=1; i<5;i++) { // set neighbour ligands with z=0 to 1/3 of zs opposite
              if ((i !== zi) && (i !== tixa[2])) {
                tt[i].z = -1*zs;
              }
            }
            // move the ligand opposite with to the same z as the one that had z≠0
            tt[tixa[2]].z = zs;
            break;
          case 4200:
            for (i=1; i<5;i++) { // set all ligands with z=0 to z<0
              if (tt[i].z === 0) {
                tt[i].z = -0.5*bondlength;
              }
            }
            break;
          case 4020:
            for (i=1; i<5;i++) { // set all ligands with z=0 to z > 0
              if (tt[i].z === 0) {
                tt[i].z = 0.5*bondlength;
              }
            }
            break;
          case 4300:
          case 4030:
          // move the ligand with z = 0 to z > 0, x=0, y=0
            for (i=1; i<5;i++) {
              if (tt[i].z === 0) {
                zi = i;
              } else {
                zs = tt[i].z;
              }
            }
            for (i=1; i<5;i++) { // set all ligands with z=0 to 1/3 of zs opposite
              if (i === zi) {
                tt[i].x = tt[0].x;
                tt[i].y = tt[0].y;
                tt[i].z = zs > 0? -0.5*bondlength : 0.5*bondlength ;
              }
            }
            break;
          case 4310:
          // move the ligand with z < 0 to x=0, y=0
            for (i=1; i<5;i++) { // move ligand with z<0 to x,y=0
              if (tt[i].z < 0) {
                tt[i].x = tt[0].x;
                tt[i].y = tt[0].y;
              }
            }
            break;
          case 4130:
          // move the ligand with z > 0 to x=0, y=0
            for (i=1; i<5;i++) { 
              if (tt[i].z > 0) {
                tt[i].x = tt[0].x;
                tt[i].y = tt[0].y;
              }
            }
            break;            
        } // end switch
        return tt;
      } // adjusts tetrahedron depending on stereocode
      
      function dot3d(v1,v2) {        
        return v1.x*v2.x + v1.y*v2.y + v1.z*v2.z;      
      } // returns scalar product of vectors v1 and v2 in 3D (both Coord3d objects)
    
      function cross3d(v1,v2)  {
        const crossp = new Coord3d(0,0,0); 

          crossp.x = v1.y*v2.z - v1.z*v2.y;
          crossp.y = v1.z*v2.x - v1.x*v2.z;
          crossp.z = v1.x*v2.y - v1.y*v2.x;
          return crossp;
      } // returns cross product of v1 and v2 in 3D as Coord3d object

      function sameSide(tet,p1,p2,p3,p4,p0) {
        let v12 = new Coord3d(0,0,0);
        let v13 = new Coord3d(0,0,0);
        let v14 = new Coord3d(0,0,0);
        let v10 = new Coord3d(0,0,0);
        let normal = new Coord3d(0,0,0);
        let dotV4, dotV0;
        let sames=false;

        v12 = vsub3d(tet[p1],tet[p2]);  
        v13 = vsub3d(tet[p1],tet[p3]);  
        v14 = vsub3d(tet[p1],tet[p4]);  
        v10 = vsub3d(tet[p1],tet[p0]);  
        normal = cross3d(v12,v13);
        dotV4 = dot3d(normal,v14);
        dotV0 = dot3d(normal,v10);
        sames = dotV4/Math.abs(dotV4) === dotV0/Math.abs(dotV0);
        if ((dotV4 == 0) || (dotV0 == 0)) { return false; }        
        if (sames) {
          return true;
        } else {
          return false;
        }
      } //auxiliary to insideTet()
    
      function insideTet(tet) { 
        let ss123, ss234, ss341, ss412;    
        ss123 = sameSide(tet,1,2,3,4,0);
        ss234 = sameSide(tet,2,3,4,1,0);
        ss341 = sameSide(tet,3,4,1,2,0);
        ss412 = sameSide(tet,4,1,2,3,0);
        return ss123 && ss234 && ss341 && ss412 ;
      } // returns true if the central atom sc is inside the tetrahedron of its 4 ligands
              
      function volTet(tet) {
        let v12 = new Coord3d(0,0,0);
        let v13 = new Coord3d(0,0,0);
        let v14 = new Coord3d(0,0,0);
        let normal = new Coord3d(0,0,0);
        let triple=0;

        v12 = vsub3d(tet[1],tet[2]);  
        v13 = vsub3d(tet[1],tet[3]);  
        v14 = vsub3d(tet[1],tet[4]);  
        normal =  cross3d(v13,v14);
        triple = dot3d(v12,normal);
        if (triple == 0) {
          return null;
        } else {
          return triple/Math.abs(triple);
        }      
      } // determines the sign of the volume of tetrahedron tet    
      
  //GEOMETRIC TRANSFORMS
      function rot2D(mar,selector,cex,cey,rotby,reset) {
      // params:   selector: value of mar[].s to be filtered for
      //    cex,cey: coord of the pivot point
      //    rotby: rotation angle in degrees
      //    reset: true-> reset the selector to 0 for all selected atoms.
    
        let i=0;
        let dega = 0;
        let vl = 0;
        let dx = 0;
        let dy = 0;
        
        let rotAt=[];
        for (i = 1;i<mar.length;i++) {
          if (mar[i].s === selector) { // only for atoms with s equal selector
            rotAt.push(i);
          // calculate rotated coordinates
            dega = norma(180*Math.atan2(mar[i].x - cex, cey - mar[i].y)/Math.PI);
            vl = Math.sqrt((mar[i].x-cex)*(mar[i].x-cex) + (mar[i].y-cey)*(mar[i].y-cey));
            dx = vl*Math.sin(Math.PI*norma(dega + rotby)/180);
            dy = -vl*Math.cos(Math.PI*norma(dega + rotby)/180);
            mar[i].x = cex + dx;
            mar[i].y = cey + dy;
            if (reset) {
              mar[i].s = 0; // reset selection
            }
          }
        }
      } // rotates all atoms with mar[].s===selector by angle rotby around point (cex,cey)
    
      function translate2D(mar,selector,dx,dy,reset) {
      // params:   selector: value of mar[].s to be filtered for. If selector===0, no filtering is done
      //    (dx,dy): translation vector
      //    reset: true-> reset the selector to 0 for all selected atoms.
    
        let i=0;
        for (i = 1;i<mar.length;i++) {
          if ((mar[i].s === selector) || (selector === 0)) { // only for selected atoms
          // calculate translated coordinates
            mar[i].x += dx;
            mar[i].y += dy;
            if (reset) {
              mar[i].s = 0; // reset selection
            }
          }
        }
      } // translates all atoms with mar[].s===selector by (dx,dy)
    
      function reflect2D(mar,bar,selector,xory,exceptbix,reset) { //bugfix 190208.1
      // params:   selector: value of mar[].s to be filtered for. If selector===0, no filtering is done
      //    xory: 'x': reflect at x-axis, 'y': reflect at y-axis, 'xy': reflect on both axes
      //    reset: true-> reset the selector to 0 for all selected atoms.
    
        let i=0;
        let jj=0;
        for (i = 1;i<mar.length;i++) {
          if ((mar[i].s === selector) || (selector === 0)) { // only for selected atoms
          // calculate translated coordinates
            if (/x/.test(xory)) {
              mar[i].x = (-1)*mar[i].x;
            } else if (/y/.test(xory)) {
              mar[i].y = (-1)*mar[i].y;
            }
            if (mar[i].z !== 0) {
              for (jj=0;jj<mar[i].bpa.length;jj++) {
                // do not change the stereo up/down properties of the flipped-around bond //bugfix 190208.1
                if (getBondIndex(bar,i,mar[i].bpa[jj].p) === exceptbix) {
                  continue;
                }
                if (mar[i].bpa[jj].t === 4) {
                  changeBondType(m,b,getBondIndex(bar,i,mar[i].bpa[jj].p),5,false);
                } else if (mar[i].bpa[jj].t === 5) {
                  changeBondType(m,b,getBondIndex(bar,i,mar[i].bpa[jj].p),4,false);
                }
              }
            }            
            if (reset) {
              mar[i].s = 0; // reset selection
            }
          }
        }
      } // reflects all atoms with mar[].s===selector at x- or y-axis (retains absolute configurations)
                    
  // Formatting    
      function intLeadingZero(i,digits) {
        let istr = "";
    
        istr = String(i);
        if (istr.length >= digits) { return istr; }
        while (istr.length < digits) {
          istr = "0" + istr;
        }
        return istr;
      } // returns a string of length digits representing integer number i zero filled from left

      function binLeadingZero(istr,digits) {
        if (istr.length >= digits) { return istr; }
        while (istr.length < digits) {
          istr = "0" + istr;
        }
        return istr;
      } // returns a string of length digits representing binary number istr zero filled from left
      
// DIAGNOSTIC DISPLAYS needed for keypress '#'



  // CONSTRUCTORS          
/** @constructor */
      function Coord(xc,yc) {
        this.x = xc;
        this.y = yc;
      } // 2D coordinates (x|y)
    
/** @constructor */
      function Coord3d(xc3,yc3,zc3) {
        this.x = xc3;
        this.y = yc3;
        this.z = zc3;
      } // 3D coordinates (x|y|z)
    
/** @constructor */
      function Sector(r,l,w) {
        this.ra = r;
        this.la = l;
        this.wi = w;
      }  // sector of circle: right boundary, left boundary, width;  all in ° (0->360)
    
/** @constructor */
      function Rect(left,top,width,height) {
        this.l = left;
        this.t = top;
        this.w = width;
        this.h = height;
      } // rectangle
    
/** @constructor */
      function Branch(root, incoming) {
        this.r = root;
        this.i = incoming;
        this.steco = 0;
        this.mem = [];
        this.gen = [];
        this.par = [];
        this.ste = [];
      } //object describing a ligand (filled by BFS)

/** @constructor */
      function Cumulene(cc,end1,end2,nc) {
        this.c = cc;
        this.e1 = end1;
        this.e2 = end2;
        this.n = nc;
      } // object describing a cumulene

/** @constructor */
      function Bop(bp, bt) { // bondingpartner
        this.p = bp;
        this.t = bt;
      } // bonding partner, objects contained in the bpa array within atom object

/** @constructor */
      function Atom(atnum, elem, atx, aty, chrg, exph, pz) { //constructor
        this.s = 0; // int selector
        this.oix = 0; // pos int: the original index of bond
        this.an = atnum; // atomic number
        this.el = elem; // string: element symbol
        this.x = atx; //x-coordinate
        this.y = aty; //y-coordinate
        this.c = chrg; // ±int
        this.z = pz;  // "z"-coord (±1)
        this.r = false; //radical center or not
        this.cl = 0;  //class (used in canonicalization)
        this.eh = exph; // has explicit H
        this.hx = 0;  // x-coord of explicit H
        this.hy = 0; // y-coord of explicit H
        this.hz = 0; // z-coord of explicit H
        this.rs = ""; // stereo descriptor 'c'|'t'|@|@@
        this.ar = false;  // in mancude ring
        this.nlp = 0; // number of lone pairs
        this.t = 0; // tree (molecule) number
        this.bpa = []; //array of Bop{} objects listing the bonding partners
        this.rxs = []; // array of reaction arrows (indices in rxnarro[]) in which this atom is on the start side
        this.rxe = []; // array of reaction arrows (indices in rxnarro[]) in which this atom is on the end side
      } //object describing an atom

/** @constructor */
      function Bond(fromAtom, toAtom, bondtype) {  // constructor
      // attention: bonds are polar: from-toa
      // each bond occurs only once in b-array
        this.s = 0; //pos int: selector
        this.obix = 0; // pos int: the original index of bond
        this.fra = fromAtom;
        this.toa = toAtom;
        this.btyp = bondtype; //1: single, 2: double, 3: triple, 4: stereo up, 5: stereo down
      } // object describing a bond

/** @constructor */
      function Arrow(st,en,ty,crv) {
        this.st = st;
        this.en = en;
        this.ty = ty;
        this.crv = crv;
      } // object describing an arrow
      
/** @constructor */
      function Rxna(star,enar,ty,aano,abno,sx,sy,ex,ey) {
        this.stn = star.slice(0); // array of tree numbers (m[].t) with trees at start
        this.etn = enar.slice(0); // array of tree numbers (m[].t) with trees at end
        this.ty = ty; //typeof arrow: 1=irrev. rxn, 2=rev. rxn, 3= resonance structures
        this.aa = aano; // text annotation above or to the left
        this.ab = abno;// text annotation below or to the right
        this.sco = new Coord(sx,sy); // coordinates of arrow start
        this.eco = new Coord(ex,ey); // coordinates of arrow end
      } // reaction arrow object


  // SMILES CODE GENERATION
      function getsmiles() {
        let i, jj, k, t;
        let arwSmiles = '';
        let first_tie = -1;
        let key;
        let lpSmiles = '';
        let nextstart = 0;
        let ntrees = 1;
        let numIsolatedRings = 0;
        let onumsmiles = '';
        let old_stc = 0;
        let orig_treeNr = 0;
        let pct = 0;
        let pruned_tie = -1;
        let rxnSmiles = '';
        let sm;
        let startingpoints = [];
        let stc = 0;
        let stp=1;
        let tl=0;
        let tmplig = 0;
        let treesmiles = '';
        let ttot = 0;
      
      //arrays used in SMILES generation
        let altnumsmiles = []; // array of numeric smiles strings generated for one tree from alternative starting points and/or tied paths. indices are parallel to altsmiles
        let altsmiles = []; // array of smiles strings generated for one tree from alternative starting points and/or tied paths
        let altsmiles_orig = []; // array of smiles strings before sorting
        let bps = []; // array of strings containing the bonding partners in class brackets. Index is same as index in m_s
        let emfuRings = []; // only used for diagnostics in displayrings
        const exoDBatR = []; // 2D array containing the exoezh keys for each ring
        const exoezh = {}; // dict of exocyclicEZ-DB objects. Key=String(DBatom1(in ring))+"-"+String(DBatom2(exocyclic). Stored one way
        let exochain = []; // array of duplets of key for exoezh[] describing the exocyclic bond sequence
        let exopaths = []; // sequence of ring-connected exocyclic DBs (as keys in exoezh). 
        const ezh = {}; // dict of EZ-DB objects. Key=String(DBatom1)+"-"+String(DBatom2). Stored both ways
        let gtied = []; // filled in sort_abop_by_class()
        let isolatedRings = []; // filled by findRings() 
        let multismiles = [];// array of SMILES strings of all the trees (individual structures)
        const multinumsmiles = [];
        let multitrees = [];
        let combismiles = [];
        let nrc = []; // number of ring closures at an atom, index is parallel to m[]. Filled by dfsRC() used by dfsSmiles()
        let nsc = []; // array of number of sidechains at each atom (index is parallel to m[])
        let pezBonds = []; // array of potentially ez DB
        let px = []; // array with permutation indices. Length is ptot. Each element is an array with tied_at.length permutation indices
        let ringbondslist = []; // filled as partial copy of ringbonds[] or bridgedringbonds[] in findRings() and used by followRing()
        let scAtoms = [];  // array with the indices of atoms that are stereogenic centers. Filled by findSC
        let scCC = []; // array of stereogenic cumulenes
        let scSense = {}; // dict: key is String(index in scAtoms[]), value is @ or @@
        let scStra = []; // array of strings scStr describing bonding configuration, synchronous to scAtoms
        let tied_at = [];  // array containing the atoms (index in m_s as integer) with ties 
        let ties = []; // array containing for each atom: list of tied bp (format [bp1,bp2][bp3,bp4]) or, if atom has no tie: "". Index is atom index in m_s.
        let tieperms = []; //array for with ties listing the permutations of tied ligands. Index parallel to tied_at[]
        let tie_num_perms = []; //array containing the number of permuations in tieperms[]. Index parallel to tied_at[]
        let visnodes = []; // array of the nodes visited by dfsSmiles(). Values are atom indices
      
      
        warnAtoms = [];
        smiles = "";
        arro_s = []; // make a shadow copy of arro[]
        for (i=0;i<arro.length;i++) {
          deep_copyArrow(arro,arro_s,i,i);
        }
        genshadow(m, m_st, b, b_st); // generate shadow copies
        stripExplH(m_st,b_st); // strip all explicit H (modifies arro_s[] but not arro[])
        // remember the original indices of atoms in the m_st[].oix and bonds in b_st[].oix property.
        for (i=1;i<m_st.length;i++) {
          m_st[i].oix = i;
        }
        for (i=1;i<b_st.length;i++) {
          b_st[i].oix = i;
        }
        t = 1;
        ttot= 0;
        while (ttot < m_st.length-1) { // analyse for substructures and store substructure number in m_st[].s, b_st[].s
          visnodesDFS = [];
          nextstart = 0;
          for (i=1;i<m_st.length;i++) {
            if (m_st[i].s === 0) {
              nextstart = i;
              break;
            }
          }
          if (nextstart === 0) { 
            break;
          }
          tl = dfs(m_st,nextstart);
          ttot += tl;
          for (i=0;i<visnodesDFS.length;i++) {
            m_st[visnodesDFS[i]].s = t;
            for (jj=0;jj<b_st.length;jj++) {
              if ((visnodesDFS.includes(b_st[jj].fra)) || (visnodesDFS.includes(b_st[jj].toa))) {
                b_st[jj].s = t;
              }
            }
          }
          t++;
        }
        t--;
        ntrees=t;

  // loop over all substructure trees
        multismiles = [];
        orig_treeNr = 0;
      
        for (t=1;t<=ntrees;t++) { // loop over all subtrees
          tree_to_m_s(t);
          for (i=1;i<m_s.length;i++) { // reset all stereo designators to ""
            m_s[i].rs="";
            if (ccSense[String(i)] !== undefined) {
              ccSense[String(i)] = "";
            }
            if (scSense[String(i)] !== undefined) {
              scSense[String(i)] = "";
            }
          }
          resetSmilesVar();
          for (key in ezh) { // delete all preexisting ezh[] dict entries // bugfix 190103.1
            if (ezh.hasOwnProperty(key)) {
              delete ezh[key];
            }
          }

          for (key in exoezh) { // delete all preexisting exoezh[] dict entries 
            if (exoezh.hasOwnProperty(key)) {
              delete exoezh[key];
            }
          }
        
          orig_treeNr = m_s[1].t;
          permu = 1;
          permstodo = 1;
          nRings = numRings(m_s); // the number of rings calculated from the number of bonding partners of each atom
          if (nRings > 0) {
            findRings(m_s,b_s);
            if (emfuSmiles) {
              findEmfuRings(m_s,b_s);
            }
          }
          for (i=0;i<rings.length;i++) {
            exoDBatR[i]=[];
          }
        
          getInvariants(m_s);
          symmetricClasses(m_s);
          for (i=1;i<m_s.length;i++) {
            sort_abop_by_class(m_s,b_s,i); // 1st
          }
          findCC(m_s);  // find either potentially chiral or ezStereo cumulenes
          pscCCconfig(m_s,b_s); // verify chirality of potentially chiral cumulenes by comparing ligands 
          ezCCconfig(m_s,b_s); // sets mar[i].rs of central cumulene atom to "c" or "t"
          find_pEZBonds(m_s,b_s);
          ezConfig(m_s,b_s); // sets mar[i].rs of both DB atoms of potential ez Bonds to "c" or "t" if they are ez
          symmetricClasses(m_s);
          hasStereo = false;
          for (i=1;i<m_s.length;i++) {
            sort_abop_by_class(m_s,b_s,i); // 2nd
            if (m_s[i].rs != "") {
              hasStereo = true;
            }
          }
          findSC(m_s,b_s,"reset");
          if (scAtoms.length > 0) {
            hasStereo = true;
          }
        

  // determine the startingpoint (class 1 atoms)
          startingpoints = [];
        
          for (i=1;i<m_s.length;i++) {
            if (m_s[i].cl === 1) {
              startingpoints.push(i);
            }
          }
          // do not iterate over all starting points if all atoms have class 1 
          // or if molecule has no stereodescriptors
          if ((startingpoints.length === m_s.length-1) || (hasStereo === false)) { 
            startingpoints.length = 1;
            // polarize with starting point if molecule has no stereoisomers
            individualize_atom(m_s,b_s,startingpoints[0]);
            symmetricClasses(m_s);
            for (i=1;i<m_s.length;i++) {
              sort_abop_by_class(m_s,b_s,i); //3rd and last
            }
          }                

  // collect all ties              
          get_bps_str(m_s); // fill the bps array of strings
        
          permu = 1;
          tied_at = [];
        
          for (i=1;i<m_s.length;i++) {
            permu *= has_ties(i); // has_ties fills the tied_at[] array
          }
        
  // eliminate automorphism due to first tie if molecule has no stereodescriptors
          if ((tied_at.length > 0) && (hasStereo === false)) {
            dfsRC(m_s,b_s, startingpoints[0]);
            dfsSMILES(m_s,b_s,startingpoints[0]);
          
            for (i = 0;i<visnodes.length;i++) {
              if ((first_tie = tied_at.indexOf(visnodes[i])) > -1) {
                pruned_tie = tied_at[first_tie];
                tied_at.splice(first_tie,1);
                permu /= has_ties(pruned_tie);
                break;
              }            
            }
          }
        
          allperms(); // fills the array tieperms[]
                
          get_px(permu);
        
          for (jj=0;jj<startingpoints.length;jj++) { // loop over all starting points        
        
            stp = startingpoints[jj];        
            permstodo = permu; // set the permutation counter to the total number of permutations
            pct = 0; // counter for permutations
            
            while (permstodo > 0) { // do all permutations due to ties
              // do the next permutation
              for (i=0;i<tied_at.length;i++) { // for each tied atom
              // sort the bpa according to next permutation
                sort_bpa_by_perm(tied_at[i], px[pct][i]);
              }
              // do everything here to get altsmiles for this permutation

              dfsRC(m_s,b_s, stp);
              dfsSMILES(m_s,b_s,stp);
              strRC();
              if (scAtoms.length > 0) {      
                get_scSense_all(m_s, b_s);
              }
              if (scCC.length > 0) {
                get_ccSense_all(m_s,b_s,'gen');
              }            
              old_stc = 0;
              stc = count_stereo(m_s);
              // detect stereogenicity due to configurational differences in ligands
              while (old_stc !== stc) { // iterate until number of stereo-designators is stable
                old_stc = stc;
                ezConfig(m_s,b_s);
                ezCCconfig(m_s,b_s);
                findSC(m_s,b_s,"add");
                if (scAtoms.length > 0) {      
                  get_scSense_all(m_s, b_s);
                }
                pscCCconfig(m_s,b_s);
                if (scCC.length > 0) {
                  get_ccSense_all(m_s,b_s,'gen');
                }
                stc = count_stereo(m_s);
              }
              // ezh[key] { f: ef, t: et; fl1: f_1, fl2: f_2, tl1: t_1, tl2: t_2, r11: e_z};
              // arrange so that fl1 and tl1 are the ligands at each end coming first in smilesarray
              // from set_ezConfig_one() they are in the order of higher priority (genprimproduct)

              // take into account the ring closures here in the order of the ligands:
              // Not only the index in smilesarray but also whether a ligand is a ring closure
              // determines the assignment to fl1,fl2,tl1, tl2.
              // without ringclosures as ligands the order is fl1-f(fl2)=t(tl1)tl2 (same as order of appearance in smilesarray) 
              // with ring closure at f-end: fl2 is ring closure and fl1 is incoming. swap if fl1 is ring closure
              // with ring-closure at t-end: tl1 is ring closure and tl2 is outgoing. swap if tl2 is ring closure
              for (key in ezh) {
                if (ezh.hasOwnProperty(key)) {
                  if ((ezh[key].fl2 !== 0) && (rcstr[String(ezh[key].f)] !== undefined)) { //check for rc-ligand at f
                    if ((rcstr[String(ezh[key].f)] !== undefined) && (rcstr[String(ezh[key].fl1)] === rcstr[String(ezh[key].f)])) {
                      // rc-ligand is fl1, should be fl2: swap fl1 and fl2 and adjust r11
                      tmplig = ezh[key].fl1;
                      ezh[key].fl1 = ezh[key].fl2;
                      ezh[key].fl2 = tmplig;
                      ezh[key].r11 *= (-1);
                    } 
                  } else if ((ezh[key].fl2 !== 0) && (smilesarray.indexOf(ezh[key].fl1) > smilesarray.indexOf(ezh[key].fl2))) { // 2 ligands at f, no rc, but fl1 comes after fl2 in smilesarray
                      // swap fl1 and fl2 and adjust r11
                      tmplig = ezh[key].fl1;
                      ezh[key].fl1 = ezh[key].fl2;
                      ezh[key].fl2 = tmplig;
                      ezh[key].r11 *= (-1);
                  }
                  if ((ezh[key].tl2 !== 0) && (rcstr[String(ezh[key].t)] !== undefined)) { //check for rc-ligand at t
                    if ((rcstr[String(ezh[key].t)] !== undefined) && (rcstr[String(ezh[key].tl2)] === rcstr[String(ezh[key].t)])) {
                      // rc-ligand is tl2, should be tl1: swap tl1 and tl2 and adjust r11
                      tmplig = ezh[key].tl1;
                      ezh[key].tl1 = ezh[key].tl2;
                      ezh[key].tl2 = tmplig;
                      ezh[key].r11 *= (-1);                 
                    }
                  } else if ((ezh[key].tl2 !== 0) && (smilesarray.indexOf(ezh[key].tl1) > smilesarray.indexOf(ezh[key].tl2))) { // 2 ligands at t, no rc, but tl1 comes after tl2 in smilesarray
                      // swap tl1 and tl2 and adjust r11
                      tmplig = ezh[key].tl1;
                      ezh[key].tl1 = ezh[key].tl2;
                      ezh[key].tl2 = tmplig;
                      ezh[key].r11 *= (-1);                 
                  }                
                }
              }
              
              onumsmiles='';
              for (i=0;i<smilesarray.length;i++) {
                if(i>0) {
                  onumsmiles += ',';
                }
                onumsmiles += String(m_s[smilesarray[i]].oix);
              }

              smiles = finalSmiles(m_s);

              if (! altsmiles.includes(smiles)) {
                altsmiles.push(smiles); // store in altsmiles if different from already stored ones
                altnumsmiles.push(onumsmiles);
              }
              pct++;
              permstodo--;
            } // end loop over all permutation due to ties
          } // end loop over all startingpoints
//           console.log("onumsmiles: "+onumsmiles); //BF200823.1
          if (altsmiles.length > 1) {
            altsmiles_orig = altsmiles.slice(0);
            // sort, then select the first one of the alternative SMILES strings
            altsmiles.sort( (a, b) => {
              if (a.length === b.length) { // same length, last in alphabet preferred
                if (a > b) { 
                  return -1;
                } else if (a < b) {
                  return 1;
                } else {
                  return 0;
                }
              } else {
                return a.length - b.length; // shortest smiles preferred
              }
            });
          } 
          // get the onumsmiles corresponding to the new altsmiles[0]
          for (i=0;i<altsmiles_orig.length;i++) {
            if (altsmiles[0] === altsmiles_orig[i]) {
              onumsmiles = altnumsmiles[i];
              break;
            }
          }
//           console.log("altsmiles:");  //BF200823.1
//           for (i=0;i < altsmiles.length;i++) { //BF200823.1
//             console.log("["+i+"] "+altsmiles[i]); //BF200823.1
//           }//BF200823.1

          smiles = altsmiles[0]; // alternative SMILES: choose shortest. If of equal length: alphabetically first
        
          multismiles.push(smiles);
          multinumsmiles.push(onumsmiles);
          multitrees.push(orig_treeNr);
          
           
        } // end loop over all subtrees
        
        combismiles = [];
        for (i=0;i<multismiles.length;i++) {
          combismiles.push(multismiles[i]+'!'+multinumsmiles[i]+'!'+String(multitrees[i]));
        }
              
        // multiple components
        combismiles.sort( (a, b) => { // sort substructure combined smiles according to descending length of SMILES part
          const smia = a.split('!');
          const smib = b.split('!');
          if (smia[0] === smib[0]) { return 0;}
          if (smia[0].length === smib[0].length) { // for same length sort alphabetically
            if (smia[0] > smib[0]) { 
              return -1;
            } else if (smia[0] < smib[0]) {
              return 1;
            } else {
              return 0;
            }
          } else {
            return smib[0].length - smia[0].length; //BF191004.1
          }
        }); // end combismiles sorting
        smiles = '';
        onumsmiles = '';
        treesmiles = '';
        for (i=0;i<combismiles.length;i++) {
          sm = combismiles[i].split('!');
          if (i>0) {
            smiles += '.';
            onumsmiles += '.';
            treesmiles += '.';
          }
          smiles += sm[0];
          onumsmiles += sm[1];
          treesmiles += sm[2];
        }
        smilesarray = onumsmiles.split(/[,.]/);

        if (arro.length > 0) {
          arwSmiles = arrowSmiles(m_st,b_st,smilesarray);
        }

        lpSmiles = lonepairSmiles(m_st,smilesarray);
        
        if (rxnarro.length > 0) {
          rxn_s = [];
          for (i=0;i<rxnarro.length;i++) { // make shadow copy of rxnarro for renumbering
            deep_copyRxnArrow(rxnarro,rxn_s,i,i);
          }
          multitrees = [];
          multitrees = treesmiles.split('.');
          // map old tree numbers to new ones
          for (jj=0;jj<rxn_s.length;jj++) {
            for (k=0;k<rxn_s[jj].stn.length;k++) {
              if ( multitrees.includes(String(rxn_s[jj].stn[k]))) {
                rxn_s[jj].stn[k] = multitrees.indexOf(String(rxn_s[jj].stn[k]))+1;
              }
            }
            for (k=0;k<rxn_s[jj].etn.length;k++) {
              if ( multitrees.includes(String(rxn_s[jj].etn[k]))) {
                rxn_s[jj].etn[k] = multitrees.indexOf(String(rxn_s[jj].etn[k]))+1;
              }
            }
          }
//          displayRxnArrows(rxn_s,'rxn_s after renumbering');  //cons_rxn 
          
          rxnSmiles = reactionSmiles(rxn_s);                  
        }
        smiles = smiles+arwSmiles+lpSmiles+rxnSmiles;

        //END of getsmiles main section

        // functions in getsmiles
    
        function resetSmilesVar() {
        // resets only the variables that are changed inside the loop for trees

          nRings = 0; // the number of ring
          numIsolatedRings = 0;
          smiles = "";
          permu = 1;
          permstodo = 1;

          altnumsmiles = [];
          altsmiles = [];
          bps = [];
          bridgeheads = [];
          ccSense = []; 
          cumulat = [];
          emfuRings = [];
          exochain = [];
          exopaths = [];
          ezCC = []; 
          gtied = [];
          incoming = [];
          nrc = [];
          nsc = [];
          orig_treeNr = 0;
          pezBonds = [];
          pscCC = [];
          rcstr = [];
          px = [];
          ringatoms = [];
          ringbonds = [];
          ringbondslist = [];
          ringclosures = [];
          rings = [];
          scAtoms = [];
          scCC = [];
          scSense = {};
          scStra = [];
          smilesarray = [];
          tied_at = [];
          ties = [];
          tie_num_perms = [];
          tieperms = [];
          visnodes = [];
          visnodesDFS = [];
        } // resets all Smiles related variables on the level of the substructure tree
        
        function stripExplH(mar, bar) {
          let i=0;
          let k=0;
      
          i=1;
          while (i < mar.length) {
            if ((mar[i].an === 1) && (mar[i].bpa.length > 0) && (mar[mar[i].bpa[0].p].an !== 1)) { // explicit H, remember coordinates if H is bound to something else than other H
            // Atoms with several explicit H will never have arrows at more than one
              // look for arrows connected to explicit H (bond must be st:, H atom must be en:)
              if (arro_s.length > 0) {
                for (k=0;k<arro_s.length;k++) {
                  if ((arro_s[k].st < 0) && (Number.isInteger(arro_s[k].st))) { // arrow starts at bond to H
                    if ((bar[(-1)*arro_s[k].st].fra === i) || (bar[(-1)*arro_s[k].st].toa === i)) { // arrow starts at bond to H 
                      arro_s[k].st = (-1)*mar[i].bpa[0].p - 0.5;
                    }
                  }
                  if ((arro_s[k].en > 0) && (Number.isInteger(arro_s[k].en))) { // arrow ends at explH
                    if (arro_s[k].en === i ) { // arrow ends at H
                      arro_s[k].en = mar[i].bpa[0].p + 0.5;
                    }
                  }
                }
              }
//              displayArrows(arro_s,'arro_s in stripExplH after changing arrows connected to expl H ['+i+']'); //cons_lewis
            // for atoms with more than 1 explicit H, this will remember only the last one
            // but this does not matter because stereogenic centers can have at most one H.
              mar[mar[i].bpa[0].p].hx = mar[i].x;
              mar[mar[i].bpa[0].p].hy = mar[i].y;
              mar[mar[i].bpa[0].p].hz = mar[i].z;
              deleteAtom(mar,bar,i,false);
              // note: delete atom adjusts the atom and bond indices in arro_s[]
//              displayArrows(arro_s,'arro_s in stripExplH after deleting explH ['+i+']'); //cons_lewis
              i--; // re-examine last because of deletion and downshift of atoms
            }
            i++;        
          }
    
        } // remove all explicit H
    
        function tree_to_m_s(t) { // fill m_s with a subtree
          let i;
      
          genshadow(m_st,m_s,b_st,b_s);
          i=1;
          while (i < m_s.length) {
            if (m_s[i].s !== t ) {
              deleteAtom(m_s,b_s,i,false);
              i--;
            }
            i++;
          }
        } // fill m_s with a subtree
          
        function getInvariants(mar) { 
        // determines the atomic invariants according to 
        // Weininger et al. jj. Chem. Inf. Comput. Sci. 1989, 97-101
        // 1 number of connections    1 digit
        // 2 number of non-H bonds    2 digit
        // 3 atomic number       2 digits
        // 4 sign of charge       1 digit
        // 5 absolute charge     1 digit
        // 6 number of attached H    2 digits (0-4) or Residue(10-99)
    
          let i, jj, t, resix;
          let nv = 0; // normal valency
          let v = 0;  // actual valency
          let nH = 0; // number of attached hydrogens
          let normal = false;
      
          let inv = "";
      
          for (i=1;i<mar.length;i++) {
            inv = "";
            resix = -1;
            resix =  residues.indexOf(mar[i].el);
            if (resix >= 0) {    // residue, not atom
              inv = "1010600" + String(Math.min(resix + 10,99));
            } else {  // atom
              inv = String(mar[i].bpa.length); // 1 number of connections (1 digit, max 9)
              v = 0;
              nH = 0;
              for (jj=0;jj<mar[i].bpa.length;jj++) { // sum up vnd orders to non hydrogen atoms
              // since we are working on m_s, there are no vnds to explicit H in bpa
                t = mar[i].bpa[jj].t;
                if ((t === 4 ) || (t === 5)) { // stereo single vnd
                  t = 1;
                }
                v += t; 
              }
              inv += intLeadingZero(v,2);  // 2 number of vnds to non-H atoms: two digit string
              inv += intLeadingZero(mar[i].an,2); // 3 atomic number as two digit string
              if (mar[i].c === 0) {   // 4 sign of charge, 1 digit: 0,+,- =>  0,1,2
                inv += "0";    //no charge
              } else if (mar[i].c > 0) {
                inv += "1";  // positive charge
              } else {
                inv += "2";  // negative charge
              }
              inv += String(Math.abs(mar[i].c)); // 5 absolute charge, 1 digit (max ±9)
        // number of H uses the same code as atomSmiles()    
              nv = val[mar[i].an];
              if (v <= nv) {
                normal = true;
              }
              if (mar[i].c !== 0) {
                normal = false;
              }
              if (mar[i].r) {
                normal = false;
              }
              // higher valencies of S and P are also defined as normal in SMILES but here we use the lowest normal valency
              if ((mar[i].el === "S") && ((v === 4) || (v === 6))) { normal = false;} 
              if ((mar[i].el === "P") && (v === 5)) { normal = false;}
              if (mar[i].el === "C:") { // irbene
                nv = 2;
              }
              if (mar[i].el === "N:") { // nitrene
                nv = 1;
              }
              if ((organic.includes(mar[i].el)) && (normal)) {
                if (mar[i].el === "C") {
                  nH = nv - v - Math.abs(mar[i].c); //carbenium and carbanion have one less H
                } else {
                  nH = nv - v + mar[i].c; // number of attached H
                }
              } else if ((organic.includes(mar[i].el)) && (!normal)) {
                if (mar[i].el === "C") {
                  nH = nv - v - Math.abs(mar[i].c); //carbenium and carbanion have one less H
                } else {
                  nH = nv - v + mar[i].c; // number of attached H
                }
                if (mar[i].r) { nH--;}
              } else if ((! organic.includes(mar[i].el)) && (nv !== 0)){ // not organic but normal valency defined
                nH = nv - v + mar[i].c; // number of attached H
                if (mar[i].r) { nH--;}
              } else {
                nH = 0;
              }

              inv += "0"+ String(Math.max(Math.min(nH,4),0)); // 6 bonds to H, 2 digits (max. 4H), 5-99 reserved for residues
              // nH must be >= 0
            }
            mar[i].cl = parseInt(inv,10);
          }
        } // initial invariants of atoms
    
        function individualize_atom(mar,bar,ax) {
          let jj=1;
      
          for (jj=1;jj<mar.length;jj++) {
            mar[jj].cl *=2;
          }
          mar[ax].cl--;
          classify(mar);
        } // individualize atom with index ax in m_s by lowering its class

        function classify(mar) { 
          let i;
          const symnum = [];  //=>classify// order of a class. index=class. Used in classify()
          const tempInv = [];
          let cl = 0;
          let classes = {};
      
          tempInv[0] = 0;
      
          for (i=1;i<mar.length;i++) {
            tempInv[i] = mar[i].cl; // tempInv is a copy of invariants of all atoms as integers
          }
          tempInv.sort ((a, b) => a-b); // sort invariants in ascending order
          classes = {};
          cl = 0;
          for (i=1;i<tempInv.length;i++) { // group into classes of increasing order
            if (tempInv[i] > tempInv[i-1]) {
              cl++;
              symnum[cl] = 1;
              classes[String(tempInv[i])] = cl;
            } else {
              symnum[cl] += 1;
            }          
          }
          for (i=1;i<mar.length;i++) { // replace the invariants with class number
            mar[i].cl = classes[String(mar[i].cl)];
          }
          return cl;
        } // replace initial invariants by class numbers
        
        function symmetricClasses(mar) {
          let nclasses = 0;
          let highestclass = 0;

          highestclass = classify(mar);
          while (highestclass !== nclasses) { // iterate until classification does not change anymore
            nclasses = highestclass;
            getPrimeProd(mar);
            highestclass = classify(mar);
          }
        
          function getPrimeProd(mar) {
            let i, k;
            let tpp=1;
            let bp=0;
            let tcl = 0;
            const tempCl =[];
      
            for (i=1;i<mar.length;i++) {
              tpp = 1;
              for (k=0;k<mar[i].bpa.length;k++) {
                bp = mar[i].bpa[k].p;
                tcl = prim[mar[bp].cl];
                tpp *= tcl;
              }
              tempCl[i] = tpp;
            }
            for (i=0;i<mar.length;i++) {
              mar[i].cl = parseInt(String(mar[i].cl) + intLeadingZero(tempCl[i],12),10);
            }        
          } // add prime product of neighbours classes to class of atom x 10^12
    
        
        } // iterative determination of class numbers without breaking symmetric ties 
    
        function get_bps_str(mar) { // works on m_s
          let i, jj, c, oc;
          let ans = "";
      
          for (i=1;i<mar.length;i++) {
            ans = "";
            oc = "";
            for (jj = 0;jj<mar[i].bpa.length;jj++) {
              c = String(mar[mar[i].bpa[jj].p].cl);
              if (oc === "") { //1st bp 
                ans += "[" + String(mar[i].bpa[jj].p);  
              } else if (c === oc) { // same class as last bp
                ans += "," + String(mar[i].bpa[jj].p);
              } else {
                ans += "];[" + String(mar[i].bpa[jj].p);
              }
              oc = c;
            }
            ans += "]";
            bps[i] = ans;        
          }
        } // fills the bps[] array of strings. bps[] has the same indexes and length as m_s[]      

        function has_ties(ax) { // depends on previous call of get_bps_str()
          let i, jj;
          let cgrp = "";
          let cgrparr = [];
          let bpsarr = [];
          let hastie = false;
          let perms = 1;
          let totperms = 1;
      
          let res_str = ""; 
      
          bpsarr = bps[ax].split(";");
          for (i=0;i<bpsarr.length;i++) {
            perms = 1;
            cgrp = bpsarr[i].replace("[","");
            cgrp = cgrp.replace("]","");
            cgrparr = cgrp.split(",");
            // No ties upon entry into ring with DB and single bond to one tied ligand, respectively (basic SMILES rule: follow DB)
            if (cgrparr.length > 1) {
              if (!isRingTie(ax,parseInt(cgrparr[0],10),parseInt(cgrparr[1],10))) { //BF200222.4
                hastie = true;
                res_str += bpsarr[i];
                for (jj=1;jj<=cgrparr.length;jj++) { // calculate number of permutations
                  perms *= jj;            //of this class group
                }          
                totperms *= perms; // calculate total permutations
              } 
            }
          }
          if (hastie) { 
            tied_at.push(Number(ax));  // store index of tied atom in tied_at[]
            ties[ax] = res_str; 
          } else {
            ties[ax] = ""; 
          }
          return totperms;
          
          function isRingTie(rax,tiedAt0,tiedAt1) {
            let riax=-1;
            let rbp0=-1;
            let rbp1=-1;
            let bix0=-1;
            let bix1=-1;
            
            if (cgrparr.length != 2) { return false; } // only tied of order 2 can be ring ties
            riax=isRingAtom(rax);
            rbp0=isRingAtom(tiedAt0);
            rbp1=isRingAtom(tiedAt1);
            if ((riax === rbp0) && (riax === rbp1) && (riax > -1)) {
              bix0 = getBondIndex(b_s,rax,tiedAt0);
              bix1 = getBondIndex(b_s,rax,tiedAt1);
              
              if (((bix0 > -1) && (bix1 > -1)) && (((b_s[bix0].btyp === 2) && (b_s[bix1].btyp===1)) || ((b_s[bix0].btyp === 1) && (b_s[bix1].btyp===2)))) {
                return true;
              } 
            }
            return false;
          } // tests if atoms rax, ta1 and ta2 are all in the same ring and whether one ligand is bound to rax by DB th ther by single bond
            
        } // fills the ties[] element for parent atom ax, returns the total number of permutations
    
        function allperms() {
          let i, jj, k;
          let at_ties = [];
          let aoap = [[]];
          let tpl = "";
          let tielist = [];
          let tties = "";
          let ttiedim = [];
          let oldperms = [];
          let newperms = [];
      
          for (i = 0;i<tied_at.length;i++) { // for all atoms with ties
              ttiedim = [];
              tties = ties[tied_at[i]];
              tties = tties.replace("][",";");          
              tties = tties.replace("[","");
              tties = tties.replace("]","");
              at_ties = tties.split(";");
              oldperms = [];
              for (jj =0;jj<at_ties.length;jj++) { // combine all ties of atom i
                aoap = [[]];
                newperms = [];
                tielist = at_ties[jj].split(",")  // tielist is an array with the tied ligands for one tie
                // here we have the number of bp in this tie = tielist.length
                ttiedim.push(tielist.length);          
                aoap = permute(tielist); // aoap is now an array of arrays containing all permutations of tie jj
                for (k = 0;k<aoap.length;k++) { // rejoin permutations to have 1D-array of strings
                  tpl = aoap[k].join(); // make string out of permutation array
                  newperms.push(tpl); // add this string to permutation list
                }
                if (oldperms.length > 0) {
                  oldperms = combine_perms(oldperms, newperms);              
                } else {
                  oldperms = newperms;
                }
              }
              tieperms[i] = oldperms.slice(0); // i is index of parent with ties in tied_at[]
              tie_num_perms[i] = oldperms.length; // i is index of parent with ties in tied_at[]
          
          }
        
          function permute(list) { // list is an array of tied bp
            let i, jj;  
            let copy = [];
            let head;
            let rest = [];
            let next = [];
            const result = [];
      
            if (list.length === 0) {return [[]]} // Empty list has one permutation
        
            for (i=0;i<list.length;i++) {
              copy = list.slice(0);   // copy list
              head = copy.splice(i, 1); // cut one element from list
              rest = permute(copy); // permute rest of list
              for (jj=0;jj<rest.length;jj++) {   // Add head to each permutation of rest of list        
                next = head.concat(rest[jj]);
                result.push(next);
              }
            }  
            return result; // result is an array of arrays with all permutations of array list[]
          }

          function combine_perms(aps1,aps2) { // aap1 and aap2 are arrays of strings
                            // containing the permuted atoms, comma separated
            let jj, k;
            let tar1 = [];
            let tar2 = [];
            let ctar = [];
            const result = [];
      
            for (jj = 0;jj<aps1.length;jj++) {
              for (k = 0;k<aps2.length;k++) {
                tar1 = aps1[jj];
                tar2 = aps2[k];
                ctar = tar1 + "," + tar2;
                result.push(ctar);
              }
            }
            return result;
          } // combine permutations for more that one tie at the same atom, auxiliary called from allperms()
    
                    
        
        } // generates the permutations of tied ligands for each atom as array of strings
                    // fills the arrays tieperms[], tie_num_perms[]

        function get_px(ptot) {
          let i, jj;
          let pix = 0; // counter for permutations
          let taix = 0; // counter for atoms with ties
          let dimct = ptot; // counter for number of repetitions
          const tdim = tie_num_perms.slice(0); // make a copy of tie_num_perms[]
          for (jj=0; jj<ptot ;jj++) {
            px[jj] = [];
          }
          for (taix = 0;taix<tied_at.length;taix++) {
            dimct = dimct/tdim[taix];
            pix = 0;
            for (i=0; i<ptot;i++) {
              px[i].push(pix);
              if (((i+1) % dimct) === 0) {
                pix++;
                if (pix === tdim[taix]) {
                  pix = 0;
                }
              }
            }
          }
    
        } // generate arrays with permutation index for all combinations among the atoms with ties
        
        function sort_bpa_by_perm(ax, np) { // ax is the atom index in m_s, np is the nth (base 0) permutation in tieperms[index of ax in tied_at]
          let i, ix;
          const old_ord = [];
          let newperm = [];
          const new_ord = [];
          let newstr = "";
          let per = [];
          const taix = tied_at.indexOf(ax);
          const tbpa = m_s[ax].bpa.slice(0);  // make a local copy of bpa[]
      
          // get the current oder, make a copy just of the atom indices in m_s
          for (i=0;i<m_s[ax].bpa.length;i++) { // for all bp of ax store in old_ord[]
            old_ord[i] = m_s[ax].bpa[i].p;  
          }      
          per = tieperms[taix].slice();
          newstr = per[np];
          newperm = newstr.split(","); // store permuted order of tied bp in newperm[]
          for (i=0;i<newperm.length;i++) { // convert newperm into an array of integers
            newperm[i] = Number(newperm[i]);
          }
          ix = 0;
          for (i=0;i<old_ord.length;i++) { 
            if (newperm.includes(old_ord[i])) { 
              new_ord[i] = newperm[ix]; // tied bp: copy to position according to order in newperm[]
              ix++;
            } else {
              new_ord[i] = old_ord[i]; // non-tied bp: copy to original place
            }
          } // new_ord[] now contains the bp in the correct order
            
          // sort bpa according to bp's position in new_ord[]       
          tbpa.sort((a, b) => // a and b are elements of tbpa ( i.e the bpa array of ca)

          // higher index comes last
          new_ord.indexOf(a.p) - new_ord.indexOf(b.p));
          m_s[ax].bpa = tbpa.slice(0);

        } // sorts the bonding partners of atom m_s[ax] according to the nth permutation of the tied ones
                            // the order according to descending class of all bp is maintained
          
        function find_pEZBonds(mar,bar) {
          let i, rixf, rixt;
      
          pezBonds = [];
          for (i=0;i<bar.length;i++) { // loop over all bonds
            if ((bar[i].btyp ===2) && (mar[bar[i].fra].bpa.length > 1) && (mar[bar[i].toa].bpa.length > 1)) { // double bond but not terminal
              //exclude 2.period atoms with hypervalence //BF210217.1 start
              if (((mar[bar[i].fra].an < 11) && (hasDB(mar,bar,bar[i].fra) > 1)) || ((mar[bar[i].toa].an < 11) && (hasDB(mar,bar,bar[i].toa) > 1))) {
                continue;              
              } 
              if (((mar[bar[i].fra].an < 11) && (mar[bar[i].fra].bpa.length > 3)) || ((mar[bar[i].toa].an < 11) && (mar[bar[i].toa].bpa.length > 3))) {
                continue;              
              } 
              //BF210217.1 end
              if ((!(cumulat.includes(bar[i].fra))) && (!(cumulat.includes(bar[i].toa)))) { // not cumulene DB
                if (!isringbond(bar,bar[i].fra, bar[i].toa)) { // not in ring
                    pezBonds.push(i); // pEZbond
                } else { // ring bond, analyse which type of ring
                  if ((!mar[bar[i].fra].ar) && (!mar[bar[i].toa].ar)) { // not EMFU ring
                    rixf = isRingAtom(bar[i].fra);
                    rixt = isRingAtom(bar[i].toa);
                    if ((rixf === rixt) && (rixf >= 0) && (rixf < numIsolatedRings) && (rings[rixf].length >= 8)) { // in same ring, in isolated ring, and ring size >=8
                      pezBonds.push(i); // pEZbond
                    }
                  }
                }
              }
            }
          }
        } // finds potential ezBonds: DB but not EMFU and not terminal
    
        function ezConfig(mar,bar) {
          let j=0;
          let k=0;
          let dbef = 0;
          let dbet = 0;
          let copy=false;
          let tatkey='';
          let tata = '';
          let tat = 0;
          let tatligs = [];
          let ligdiff=0;
      
      
          for (k=0;k<pezBonds.length;k++) { // deal with exocyclic pezDB (quinodimethanes)
      
      
            dbef = bar[pezBonds[k]].fra;
            dbet = bar[pezBonds[k]].toa;
            isexocyclicEZ(mar,dbef,dbet); // fills the dict exoezh[] and array exoDBatR[ring] with the key to exoezh
          }
          for (k=0;k<pezBonds.length;k++) {
            dbef = bar[pezBonds[k]].fra;
            dbet = bar[pezBonds[k]].toa;
        
            if ((mar[dbef].rs !== "") && (mar[dbet].rs !== "")) {
              continue; // skip bonds in pezBonds where "c" or "t"  is already set in both atoms
            }
            //delete any pre-existing ezh which have no .rs property yet
            if (ezh[String(dbef)+"-"+String(dbet)] !== undefined) {
              delete ezh[String(dbef)+"-"+String(dbet)];
            }
            if (ezh[String(dbet)+"-"+String(dbef)] !== undefined) {
              delete ezh[String(dbet)+"-"+String(dbef)];
            }
            set_ezConfig_one(mar,bar,dbef,dbet);          
          } // end for over all pezBonds k-loop

          getexopaths(); // look for exocyclic DB sequences
          if (exopaths.length > 0) { // if there are exocyclic DB sequences
            for (k=0;k<exopaths.length;k++) {
              copy=true;
              tatkey=exopaths[k][exopaths[k].length-1];
              tata = tatkey.split('-');
              tat = parseInt(tata[1],10);
              lig = [];
              if (mar[tat].bpa.length===3) { // end atom has 2 non-DB ligands
                tatligs = [];
                for (j=0;j<mar[tat].bpa.length;j++) {
                  if (mar[tat].bpa[j].t === 2) { continue; }
                  tatligs.push(mar[tat].bpa[j].p);
                }
                bfs(mar, tatligs[0], tat);
                bfs(mar, tatligs[1], tat);
                ligdiff = compare2Ligs(mar,bar,0,1,false); // compare the two non-DB ligands
                if (ligdiff === 0) {
                  copy = false;
                }
              } else if (mar[tat].bpa.length===1) { // end atom has no non-DB ligands
                copy=false;
              }
              tatkey=exopaths[k][0];
              tata = tatkey.split('-');
              tat = parseInt(tata[1],10);
              lig = [];
              if (mar[tat].bpa.length===3) { // end atom has 2 non-DB ligands
                tatligs = [];
                for (j=0;j<mar[tat].bpa.length;j++) {
                  if (mar[tat].bpa[j].t === 2) { continue;}
                  tatligs.push(mar[tat].bpa[j].p);
                }               
                bfs(mar, tatligs[0], tat);
                bfs(mar, tatligs[1], tat);
                ligdiff = compare2Ligs(mar,bar,0,1,false); // compare the two ligands
                if (ligdiff === 0) {
                  copy = false;
                }
              } else if (mar[tat].bpa.length===1) { // end atom has no non-DB ligands
                copy=false;
              }
              if (copy) {
                for (j=0;j<exopaths[k].length;j++) {
                  exoezh2ezh(mar,exopaths[k][j]);
                }
              }            
            }
          }          
        } // determine c|t of all pezBonds if they turn out to be really EZ (lig comparison by BFS)
    
        function set_ezConfig_one(mar,bar,ef,et) {
          let i;
          const ezflig = [];
          const eztlig = [];
          let f_1 = 0;
          let f_2 = 0;
          let t_1 = 0;
          let t_2 = 0;
          let e_z = 0;
          let ligdiff = 0;

          // ligands at ef-end
          for (i=0;i<mar[ef].bpa.length;i++) { // ef ligands
            if (mar[ef].bpa[i].t !== 2) { // exclude the double bonded ligand 
              ezflig.push(mar[ef].bpa[i].p);
            }          
          }
          if (ezflig.length === 1) { // only one ligand, no comparison needed
            f_1 = ezflig[0];
            f_2 = 0;
          } else if (ezflig.length === 2) {
            // call BFS to fill the lig[] array of branch objects for both ligands
            lig = [];
            bfs(mar, ezflig[0], ef);
            bfs(mar, ezflig[1], ef);
            ligdiff = compare2Ligs(mar,bar,0,1,true); // compare the two ligands
            if (ligdiff === 0) { 
              f_1 = 0;
              f_2 = 0;
            } else { // the ligand with the higher priority (higher primproduct at first different generation) will be f_1
              if (ligdiff === 1) {
                f_1 = ezflig[0];
                f_2 = ezflig[1];  
              }
              if (ligdiff === -1) {
                f_1 = ezflig[1];
                f_2 = ezflig[0];
              }
            }
          }

          // ligands at et-end
          for (i=0;i<mar[et].bpa.length;i++) { // et ligands
            if (mar[et].bpa[i].t !== 2) { // exclude the double bonded ligand 
              eztlig.push(mar[et].bpa[i].p);
            }          
          }
          if (eztlig.length === 1) { // only one ligand, no comparison needed
            t_1 = eztlig[0];
            t_2 = 0;
          } else if (eztlig.length === 2) {
            // call BFS to fill the lig[] array of branch objects for both ligands
            lig = [];
            bfs(mar, eztlig[0], et);
            bfs(mar, eztlig[1], et);
            ligdiff = compare2Ligs(mar,bar,0,1,true); // compare the two ligands
            if (ligdiff === 0) { 
              t_1 = 0;
              t_2 = 0;
            } else { // the ligand with the higher priority (higher primproduct at first different generation) will be t_1
              if (ligdiff === 1) {
                t_1 = eztlig[0];
                t_2 = eztlig[1];
              }
              if (ligdiff === -1) {
                t_1 = eztlig[1];
                t_2 = eztlig[0];  
              }
            }
          }
          if ((f_1 !== 0) && (t_1 !== 0)) { 
            e_z = vecprodDB(f_1, ef, et, t_1);
            if ((e_z === 0) || (e_z != e_z)) { // warn if vecproduct is 0 or nan
              console.log("set_ezConfig_one: vecproduct is 0 or NaN: e_z="+e_z);
              if (getdiranglefromAt(mar,f_1,ef) === getdiranglefromAt(mar,ef,et)) {
                warnAtoms.push(ef);
              }
              if (getdiranglefromAt(mar,t_1,et) === getdiranglefromAt(mar,et,ef)) {
                warnAtoms.push(et);
              }
              e_z=0;              
            }
            if (ezflig.length === 2) {
              //test that the two ligands at ef point to different sides of db and that no ligand is colinear with DB
              if ((vecprodDB(f_1, ef, et, t_1) === vecprodDB(f_2, ef, et, t_1)) || (getdiranglefromAt(mar,f_2,ef) === getdiranglefromAt(mar,ef,et)))  {
                warnAtoms.push(ef);
              }
            } 
            if (eztlig.length === 2) {
              //test that the two ligands at et point to different sides of db and that t2 ligand is not colinear with et=ef
              if ((vecprodDB(t_1, et, ef, f_1) === vecprodDB(t_2, et, ef, f_1)) || (getdiranglefromAt(mar,t_2,et) === getdiranglefromAt(mar,et,ef))) {
                warnAtoms.push(et);
              }
            }           
          } else {
            e_z = 0;
          }
          // store the cis/trans value in the double bond atoms and the ezh dict both ways
          if (e_z === 1) { //trans
          // fl1 and tl1 are the ligands on each end with the higher priority
            ezh[String(ef)+"-"+String(et)] = { f: ef, t: et, fl1: f_1, fl2: f_2, tl1: t_1, tl2: t_2, r11: e_z};
            ezh[String(et)+"-"+String(ef)] = { f: et, t: ef, fl1: t_1, fl2: t_2, tl1: f_1, tl2: f_2, r11: e_z};
            mar[ef].rs = "t";
            mar[et].rs = "t";
          } else if ((e_z === -1) && (!isringbond(bar,ef,et))) { //cis, store only if not ring bond
            ezh[String(ef)+"-"+String(et)] = { f: ef, t: et, fl1: f_1, fl2: f_2, tl1: t_1, tl2: t_2, r11: e_z};
            ezh[String(et)+"-"+String(ef)] = { f: et, t: ef, fl1: t_1, fl2: t_2, tl1: f_1, tl2: f_2, r11: e_z};
            mar[ef].rs = "c";
            mar[et].rs = "c";
          } 
        } // set the c|t property of the atoms of one double bond and the dict ezh both ways if the DB is really EZ
        // called by ezConfig() for all bonds in pezBonds[]
    
        function is_in_exoezh(mar,val,prop) {
          // param: val: value, prop: string describing the property in exoezh object to look for
          for (const key in exoezh) {
            if (exoezh.hasOwnProperty(key)) {
              switch (prop) {
                case 'f':
                  if (exoezh[key].f === val) { return key; }
                case 't':
                  if (exoezh[key].t === val) { return key; }
                case 'fl1':
                  if (exoezh[key].fl1 === val) { return key; }
                case 'fl2':
                  if (exoezh[key].fl2 === val) { return key; }
                case 'tl1':
                  if (exoezh[key].tl1 === val) { return key; }
                case 'tl2':
                  if (exoezh[key].tl2 === val) { return key; }
                case 'rx':
                  if (exoezh[key].rx === val) { return key; }
            
              }
            }
          }
          return '';      
        } // returns key if the value of a prop (object property) of an exoezh[] object is val, empty string otherwise

        function ezCCconfig(mar,bar) {
        // checks even membered cumulenes for ez configuration and sets it as "c" or "t" in the terminal atoms
        // ligands at each end are tested for isomorphism and even membered cumulenes with isomorphic ligands 
        // at one end are skipped.
          let k;
          let ccef = 0;
          let ccet = 0;
              
          for (k=0;k<ezCC.length;k++) {
              
            ccef = ezCC[k].e1;
            ccet = ezCC[k].e2;
            if ((mar[ccef].rs !== "") && (mar[ccet].rs !== "")) {
              continue; // skip cumulenes where "c" or "t"  is already set in both end atoms
            }
            set_ezConfig_one(mar,bar,ccef,ccet);          
          } // end loop over all ez cumulenes
          // reset global arrays
        } // sets mar[i].rs of terminal cumulene (even) atoms to "t" or "c"

        function pscCCconfig(mar,bar) {
        // tests all potentially chiral odd cumulenes for chirality
          let jj, k, fe=0, se=0;
          let scc = false;
          let ssb = false;
          let ussb = false;
          let dssb = false;
          let tcu ={c:0,e1:0,e2:0,n:0};
      

          for (k=0;k<pscCC.length;k++) { // loop over all potentially chiral cumulenes
            tcu = {c:0,e1:0,e2:0,n:0};
            tcu.c = pscCC[k].c;
            tcu.e1 = pscCC[k].e1;
            tcu.e2 = pscCC[k].e2;
            tcu.n = pscCC[k].n;
            if (mar[tcu.c].rs !== "") { // skip if chirality sense is already set
              continue;
            }
            ssb = false;
            ussb = false;
            dssb = false;
            for (jj=0;jj<mar[tcu.e1].bpa.length;jj++) {  // inspect e1 end
              if (mar[tcu.e1].bpa[jj].t === 4 ) { 
                ussb = true;
              }
              if (mar[tcu.e1].bpa[jj].t === 5 ) { 
                dssb = true;
              }
            }
            if ((mar[tcu.e1].eh > 0) && (mar[tcu.e1].hz > 0)) { 
              ussb = true;
            } // explicit H: up
            if ((mar[tcu.e1].eh > 0) && (mar[tcu.e1].hz < 0)) { 
              dssb = true;
            } // explicit H: down
            if (dssb || ussb) { 
              ssb = true;
              se = tcu.e1; // stereo end
              fe = tcu.e2; // flat end
            } // end at e1 has two opposite stereo single bonds
            ussb = false;
            dssb = false;
            for (jj=0;jj<mar[tcu.e2].bpa.length;jj++) {  // inspect e1 end
              if (mar[tcu.e2].bpa[jj].t === 4 ) { 
                ussb = true;
              }
              if (mar[tcu.e2].bpa[jj].t === 5 ) { 
                dssb = true;
              }
            }
            if ((mar[tcu.e2].eh > 0) && (mar[tcu.e2].hz > 0)) { 
              ussb = true;
            } // explicit H: up
            if ((mar[tcu.e2].eh > 0) && (mar[tcu.e2].hz < 0)) {
              dssb = true;
            } // explicit H: down
            if ((dssb || ussb) && (ssb === false)) { // stereo-single bond(s) at e2, none at e1 
              ssb = true;
              se = tcu.e2; // stereo end
              fe = tcu.e1; // flat end
            } else if ((dssb || ussb) && (ssb === true)) { // stereo-single bonds at e2 and at e1: not SC
              ssb = false;
              warnAtoms.push(tcu.c);
            }
            if (ssb) {
              tcu.e1 = se; // the e1 end in the object Cumulene is always the one with stereo-single bonds
              tcu.e2 = fe;
              scc = false;
              scc = compareCCligands(mar,bar,tcu);
              if (scc) {
                scCC.push(tcu);
              }
            }
          } // end loop over potentially chiral cumulenes
        } // verifies chirality of potentially chiral cumulenes 

        function get_ccSense_all(mar,bar,mode) {
          let i=0;
          for (i=0;i<scCC.length;i++) {
            get_ccSense_one(mar,bar,scCC[i],mode);
          }
        } // determines the configuration (@|@@) of all cumulenes and stores it in the .rs property of the central atom
    
        function findSC(mar,bar,flag) {
          // examines all atoms in mar[] for stereogenicity. First tests them as candidates 
          // by calling isSCcandidate() then tests for isomorphic ligands. 
          // Fills the synchronous arrays scAtoms[], scStra[] and resets the pseudo-dict entry scSense[]
          let i;
          let sc = false;
          let allLigsDiffer = true;
          let pSCstr = "";
      
          if (flag === "reset") {
            scAtoms = [];
            scStra = [];
          }
          for (i=1;i<mar.length;i++) {
            if ((flag === "add") && (mar[i].rs !== "")) {
              continue;
            }
            pSCstr = isSCcandidate(mar,bar,i);
            if (pSCstr !== "") {
              sc = true;
            } else {
              sc = false;
            }
            if (sc) { // still candidate for SC
              // check for two or more identical ligands
              allLigsDiffer = compareSCligands(mar,bar, i);
              if (allLigsDiffer === false) { 
                sc = false;
              }
          
              if ((sc) && (!scAtoms.includes(i))) {
                scAtoms.push(i);
                scSense[String(i)] = "";
                scStra.push(pSCstr);
              }
            }
          } // end loop over all atoms in mar[]
        } // finds stereogenic centers, flag: "reset" or "add"

        function isSCcandidate(mar,bar,cat) {
          // tests atom with index cat in mar[] for potential stereo center (without comparing isomorphicity of ligands)
          // returns the pSCstring if mar[cat] is a potential stereo-center, empty string otherwise
          // requires that ringbonds[] has been filled beforehand
          let jj;
          let nh;
          let pSCstr = "";
          let azrb=[];
          let sc = false;
      
          for (jj=0;jj<mar[cat].bpa.length;jj++) { // any atom with at least one stereo single bond is examined
      
            if ((mar[cat].bpa[jj].t === 4) || (mar[cat].bpa[jj].t === 5)) {
              sc = true;
            }
            if ((mar[cat].eh === 1) && (mar[cat].hz !== 0)) { // single explicit H has stereo-single bound //BF200825.1
              sc = true;
            }
          }
          if (sc) {
            nh = getImplicitH(mar,cat);
            pSCstr = mar[cat].el + ":" + String(mar[cat].bpa.length) + ":" + String(nh) + ":" + String(mar[cat].c);
            if (pSCstr === "N:3:0:0") { // 3-valent nitrogen: examine aziridine special case
              azrb = [];
              for (jj=0;jj<mar[cat].bpa.length;jj++) {
                if (isringbond(bar,cat, mar[cat].bpa[jj].p)) {
                  azrb.push(mar[cat].bpa[jj].p);
                }
              }
              if ((azrb.length === 2) && (isringbond(bar,azrb[0],azrb[1]))) {
                pSCstr = "N:3:0:az";
              }
            }
            if (!pSC.includes(pSCstr)) {
              sc = false;
            } // only accept combinations registered as potential stereo centers
            if (nh > 1) { // more than 1 H => not SC
              sc = false;
            } else if (mar[cat].bpa.length <= 2) { // less than 3 ligands: not SC except arsines and phosphines but then the H must be explicit
              if ((((pSCstr === "P:2:1:0") && (mar[cat].bpa.length >= 2)) || ((pSCstr === "As:2:1:0") && (mar[cat].bpa.length >= 2))) && (mar[cat].eh > 0)) {
                sc = true;
              } else {
                sc = false;
              }
            }
          }
          if (sc) { 
            return pSCstr; 
          } else { 
            return "";
          }
        } // collect all potential chirality centers
          
        function get_scSense_all(mar, bar) {
          let i;
          let result = "";
      
          for (i=0;i<scAtoms.length;i++) { // for each stereogenic center
      
            result = "";
            result = get_scSense_one(mar, bar, scAtoms[i], scStra[i], smilesarray,'gen');
            mar[scAtoms[i]].rs = result;
            scSense[String(scAtoms[i])] = result;
          }
        } // determine sc Sense and store it in rs property for all scAtoms
    
        function count_stereo(mar) {
          let i; 
          let cnt = 0;
      
          for (i=1;i<mar.length;i++) {
            if (mar[i].rs !== "") { cnt++;}
          }
          return cnt;
        } // counts the number of atoms with a non empty rs property  
    
    // dfsSMILES
        function dfsSMILES(mar, bar, stnode) { // mar is an array of atoms
        // dfsSMILES constructs the numeric smiles string
        // dfsSmiles requires that dfsRC() has been called beforehand
        // dfsSmiles fills the smilesarray[]
          const stack = []; // stack for nodes in DFS
          let node = 0;
          let sminc = "";

          let i = 0;
          let k = 0;
          let known = false;
      
          visnodes = [];
          smilesarray = [];
          smiles = "";

          node = stnode;
          stack.push(node); // put the initial node onto stack for the initial pop
          k=0;
          while ((stack.length > 0) && (visnodes.length < mar.length-1)) {
    // SECTION A: get next node from stack and examine
            node = stack.pop(); // get the next node from stack
            known = visnodes.includes(node);
            if (!known) { // if not known
          
              visnodes.push(node); // record of all visited nodes

              sminc = "";
              if (nsc[incoming[node]] > 0) { // test for pending side-chains of incoming
                sminc += "(";
                nsc[incoming[node]] -= 1;
              }
              if (node === stnode) {
                sminc += String(node);
              } else {
                sminc += "·" + String(node);

              }
              smilesarray.push(node);
              smiles += sminc;
              // test for end of a sidechain: either the node has only one connection or all connections except the incoming are RC
              if ((mar[node].bpa.length - nrc[node]) === 1) { 
                if ((visnodes.length < mar.length-1) && (node !== stnode)) {  // no ")" after last and first node
                  smiles += ")";
                }
              }                        
    // SECTION B: put connected nodes on stack
              for (i=0;i<mar[node].bpa.length;i++) { // for all presorted bonding partners of node
                known = visnodes.includes(mar[node].bpa[i].p); // unless they are already visited
                if (!known) { // not known
                  stack.push(mar[node].bpa[i].p); // put them on the stack
                }
              } // end for bpa
        
            } // end if !known            
            k++;
            if (k > 200 ) {break; } // safety for infinite loop
          } // end of while
//           console.log("dfsSMILES: smiles= "+smiles+" k="+k); //BF200824.1
        } // compile the numeric SMILES string for one starting point
    
    // dfsRC
        function dfsRC(mar, bar, stnode) { // mar is an array of atoms
        // dfsRC determines all ring closures, as well as the number of ring closures (nrc[] and the number of side chains nsc[] of each node
        // dfsRC fills the incoming[] array
          const stack = []; // stack for nodes in DFS
          let node = 0;
          let rc = "";

          let i = 0;
          let jj = 0;
          let k = 0;
          let known = false;      
          const visnodesRC = [];
      
          // initialize
          node = stnode;
          ringclosures= [];
          incoming = [];
          nsc = [];
          nrc = [];
          nsc[0] = 0;
          nrc[0] = 0;
          for (i=1;i<mar.length;i++) { // store the number of side-chains for each atom
            if ((i === stnode) && (mar[i].bpa.length > 1)) {  //BUGFIX 180429
              // if the stnode is in the middle of a chain, one side of the chain will be in a side chain
              nsc[i] = Math.max(mar[i].bpa.length-1, 0);    //BUGFIX 180429
            } else {                //BUGFIX 180429
              nsc[i] = Math.max(mar[i].bpa.length-2, 0);  //BUGFIX 180429
            }                  //BUGFIX 180429
            nrc[i] = 0;
          }

          stack.push(node); // put the initial node onto stack for the initial pop
          k=0;
          while ((stack.length > 0) && (visnodesRC.length < mar.length-1)) {
    // SECTION A: get next node from stack and examine
            node = stack.pop(); // get the next node from stack
            known =  visnodesRC.includes(node);
            if (!known) { // if not known
              incoming[node] = 0; 
              if (visnodesRC.length > 0) { // determine the incoming node
                for (jj = visnodesRC.length-1; jj >= 0;jj--) { // search visnodes down to first bonding partner of node
                  if (getbpix(m_s,visnodesRC[jj], node) >=0) {
                    incoming[node] = visnodesRC[jj];
                    break;
                  }
                }
              }
              visnodesRC.push(node); // record of all visited nodes
    // SECTION B: put connected nodes on stack
              for (i=0;i<mar[node].bpa.length;i++) { // for all presorted bonding partners of node
                known =  visnodesRC.includes(mar[node].bpa[i].p); // unless they are already visited
                if (known) { // incoming or ring closure
                  if ((mar[node].bpa[i].p !== incoming[node]) && (isringbond(bar,mar[node].bpa[i].p, node))) { // ring closure.
                    rc = String(mar[node].bpa[i].p) + ":" + String(node);
                    if (!isinRingClosure(rc)) {
                      ringclosures.push(rc);
                      nrc[node] += 1;
                      nrc[mar[node].bpa[i].p] += 1;
                      // for each ring closure, reduce the number of side chains by one on both atoms
                      nsc[mar[node].bpa[i].p] = Math.max(nsc[mar[node].bpa[i].p]-1, 0);
                      nsc[node] = Math.max(nsc[node]-1, 0);
                    }                          
                  }  
                } else { // not known
                  stack.push(mar[node].bpa[i].p); // put them on the stack
                }
              } // end for bpa
            }  // end !known          
            k++;
            if (k > 200 ) {break; } // safety for infinite loop
          } // end of while

          function isinRingClosure(rcs) {
            let i=0;
      
            for (i=0;i<ringclosures.length;i++) {
      
              if (ringclosures[i] === rcs) {
                return true;
              }
            }
            return false;
          }
        
        } // DFS which determines all ring closures, the number of ring closures and of side chains of each node. 
                            // Fills the incoming[] array
          
       function bfs(mar, stnode, incoming) {  // BFS 
        // directed breadth-first search filling a ligand object starting from a given atom (stnode)
        // backwards search in the direction of incoming is prevented 
          const queue = [];
          const visited = [];
          const parent = [];
          const generation = {};
          const stereocode = [];
          let stereocount = 0;
      
          const visgen = [];
          const tlig = new Branch(0,0);
      
          let node = 0;
          let child = 0;
          let i=0;
      
          queue.push(stnode);
          visited.push(stnode);
          parent.push(incoming);
          generation[String(stnode)] = 0;
          stereocount = 0;
          stereocode.push(mar[stnode].rs);
          if (mar[stnode].rs !== "") {
            stereocount++;
          }
          while (queue.length > 0) {
            node = queue.shift();
            // examine node here
            for (i=0;i<mar[node].bpa.length;i++) { // for all nodes connected to node
              child = mar[node].bpa[i].p;
              if ((! visited.includes(child)) && (!(child===incoming))) {
                visited.push(child);
                stereocode.push(mar[child].rs);
                if (mar[child].rs !== "") {
                  stereocount++;
                }
                parent.push(node);
                generation[String(child)] = generation[String(node)] + 1;
                queue.push(child);
              }            
            }
          }
          for (i=0;i<visited.length;i++) {
            visgen[i] = generation[String(visited[i])];
          }
          tlig.r = stnode;
          tlig.i = incoming;
          tlig.steco = stereocount;
          tlig.mem = visited.slice(0);
          tlig.gen = visgen.slice(0);
          tlig.par = parent.slice(0);
          tlig.ste = stereocode.slice(0);
          lig.push(tlig);
        } // BFS filling a ligand object starting from a given atom (stnode) without backtracking towards incoming
    
        function compareCCligands(mar,bar,cu) {
        // compares the two ligands at the end of a cumulene for isomorphism. 
        // Returns true if ligands are different at both ends, false if they are isomorphic at one or both ends.
    
          let i, e1, e2; 
          let result1 = 0;
          let result2 = 0;
      
          e1 = cu.e1;
          e2 = cu.e2;
          lig = [];
          for (i=0;i<mar[e1].bpa.length;i++) { // check all ligands of e1
            if ((mar[e1].bpa[i].t === 4) || (mar[e1].bpa[i].t === 5)) { // e1 has one or two stereo-single bonds
                bfs(mar,mar[e1].bpa[i].p,e1);
            }
          }
          if (lig.length === 2) {
            result1 = compare2Ligs(mar,bar,0,1,true);
          } else {
            result1 = 1;
          }
          lig = [];          
          for (i=0;i<mar[e2].bpa.length;i++) { // check all ligands of e2
            if (mar[e2].bpa[i].t === 1)  { // e2 must have one or two single bonds in plane
                bfs(mar,mar[e2].bpa[i].p,e2);
            }
          }
          if (lig.length === 2) {
            result2 = compare2Ligs(mar,bar,0,1,true);
          } else if (lig.length === 0) { // e2 can have 2 hydrogens
            result2 = 0;
          } else {
            result2 = 1;
          }
          if (( result1 !== 0) && (result2 !== 0)) {
            return true;
          } else {
            return false;
          }        
        }  // compares the two ligands at the end of a cumulene for isomorphism. 
                // Returns true if ligands are different at both ends, 
                // false if they are isomorphic at one or both ends.
    
        function compareSCligands(mar,bar,ca) { // compare all ligands of potential stereocenter for isomorphism
        // returns true if all all ligands are different, false if two or more are isomorphic
          let i, jj;
          let result;
              
          lig = [];
          for (i=0;i<mar[ca].bpa.length;i++) { // all connected atoms
              bfs(mar, mar[ca].bpa[i].p, ca); // fill the lig[] array of branch objects with the ligand trees
          }
          for (i=0;i<lig.length-1;i++) {
            for (jj=i+1;jj<lig.length;jj++) {
              result = compare2Ligs(mar,bar,i,jj,true);
              if (result === 0) { // two ligands isomorphic
                return false;
              }
            }
          }
          return true;
        } // compare all ligands of potential stereocenter for isomorphism
            // returns true if all all ligands are different, 
            // false if two or more are isomorphic

        function getexopaths() {
          let sec=0;
          let i=0;
          let k=0;
          let ck='';
          let ckx=-1;
          let i1=0;
          let i2=0;
          let exocp=[];
          const exocpfr=[];
          let copied=[];
          const ec=[];

          if (exochain.length === 0) { return ; }

          exopaths=[];
          //transform exochain into 2D arry ec[][]
          for (i=0;i<exochain.length;i++) { // make 2D array ec[] from exochain[] array of strings
            ec[i]=exochain[i].split(',');          
          } 
          exocp = exochain.join().split(',');
          exocp = exocp.filter((elem, index, self) => index === self.indexOf(elem))
          // exocp now contains all keys occurring in exochains without duplicates
          
          // register all inices in exochain where a given key from exocp appears          
          for (i=0;i<exocp.length;i++) {
            exocpfr.push([]);
            for (k=0;k<ec.length;k++) {
              if ((ec[k][0]===exocp[i]) || (ec[k][1]===exocp[i])) {
                exocpfr[exocpfr.length-1].push(k);
              }
            }
          }
          sec=0;
          i1=0;
          i2=0;
          ck=ec[i1][i2];
          ckx = exocp.indexOf(ck);
          exopaths.push([]);
          copied=[];          
          while ((ck !== '') && (sec < 20)) {
            if (!copied.includes(ck)) {
              exopaths[exopaths.length-1].push(ck); //add current key to current exopath
              copied.push(ck);
            }
            if (copied.length >= exocp.length) { // all keys are copied
              break;
            }
            if (exocpfr[ckx].length===1) { // current key occurs only in one exochain
              if ((i2===0) && (!copied.includes(ec[i1][1]))) { // was first key in exchain and 2nd key is not copied yet
                i2=1;
              } else if ((i2===1) && (!copied.includes(ec[i1][0]))) { // was 2nd key in exchain and 1st key is not copied yet
                i2=0;
              } else { // both keys copied: go to next exochain
                i2=0;
                i1++;
                exopaths.push([]); // create new exopath
              }
            } else if (exocpfr[ckx].length===2) { // current key occurs in 2 exochains: link these exochains
              if (exocpfr[ckx][0]===i1) { // current chain i1 is [0] of the chains in exocpfr[ckx]
                i1 = exocpfr[ckx][1];  // set current chain to [1] of the chains in exocpfr[ckx]
                if (ec[i1][0]===ck) { // the current key is the same as the 1st key in the next chain i1
                  i2=1; // next key is ec[i1][1]
                } else if (ec[i1][1]===ck) { // the current key is the same as the 2nd key in the next chain i1
                  i2=0; // next key is ec[i1][0]
                }
              } else if (exocpfr[ckx][1]===i1) { // current chain i1 is [1] of the chains in exocpfr[ckx]
                i1 = exocpfr[ckx][0]; // set current chain to [0] of the chains in exocpfr[ckx]
                if (ec[i1][0]===ck) { // the current key is the same as the 1st key in the next chain i1
                  i2=1; // next key is ec[i1][1]
                } else if (ec[i1][1]===ck) { // the current key is the same as the 2nd key in the next chain i1
                  i2=0; // next key is ec[i1][0]
                }
              }
            } 
            if (copied.length >= exocp.length) { // all keys are copied
              break;
            }
            ck='';
            if ((ec[i1][i2] !== undefined) && (!copied.includes(ec[i1][i2]))) {
              ck=ec[i1][i2]; // set current key for next iteration
              ckx = exocp.indexOf(ck);
            } else {
              break;
            }
            sec++;
          } // end while
          if (exopaths[exopaths.length-1].length === 0) { // the last exopaths[] is empty
            exopaths.splice(-1,1); // delete it
          }          
        }
        
        function exoezh2ezh(mar,key) {
          //params: key: String(endocyclic DBat)+"-"+String(exocyclic DBat)    
          let revkey = '';

          if ((ezh[key] === undefined) && (exoezh[key] !== undefined)) {
            ezh[key] = { f: exoezh[key].f, t: exoezh[key].t, fl1: exoezh[key].fl1, fl2: exoezh[key].fl2, tl1: exoezh[key].tl1, tl2: exoezh[key].tl2, r11: exoezh[key].r11};
            revkey = String(ezh[key].t)+"-"+String(ezh[key].f);
            mar[ezh[key].f].rs = (ezh[key].r11 === 1)  ? 't' : 'c';            
            mar[ezh[key].t].rs = (ezh[key].r11 === 1)  ? 't' : 'c';            
            if (ezh[revkey] === undefined) {
              ezh[revkey] = { f: exoezh[key].t, t: exoezh[key].f, fl1: exoezh[key].tl1, fl2: exoezh[key].tl2, tl1: exoezh[key].fl1, tl2: exoezh[key].fl2, r11: exoezh[key].r11};
            }
          }
        } // copy the exoezh object into an ezh object and its reverse


        function compare2Ligs(mar,bar,l1,l2,exocheck) { // follows two ligand trees using the prim product of the class of all nodes 
        // of each generation as the criterion. 
        // Parameters are the indices of the two ligands in lig[] array of branches
        // requires that BFS has been called to fill the lig[] array of branches first
        // returns 1 if l1 has priority over l2
        // returns -1 if l2 has priority over l1
        // returns 0 if l1 and l2 have the same priority
          let gix, dif, l1hg, l2hg, cd=0;
      
          l1hg = lig[l1].gen[lig[l1].gen.length-1]; // the generation of the last element in lig[l1].gen[]
          l2hg = lig[l2].gen[lig[l2].gen.length-1]; // the generation of the last element in lig[l1].gen[]
          gix = 0;
          while (gix <= Math.min(l1hg,l2hg)) {
            dif = genprimprod(mar,bar,l1, gix) - genprimprod(mar,bar,l2, gix);
            if (dif !== 0) {
              if (dif > 0) { return 1;}
              if (dif < 0) { return -1;}
            } else if ((gix === l1hg) && (gix === l2hg) && (dif === 0)) { // same highest generation reached for both, no decision
              // look for configurational differences
              cd = compareLigConfig(mar,bar,lig[l1].r,lig[l2].r,lig[l1].i,exocheck);
              if (cd !== 0) {
                return 1;
              } else {
                return 0;
              }
            } else {
              gix++;
              if (gix > l1hg) {
                return -1;
              } else if (gix > l2hg) {
                return 1;
              }
            }
          } // end while

          function genprimprod(mar,bar,lix, gix) {
            let i, res;
      
            res=1;
            i=0;
            while (lig[lix].gen[i] < gix) {
              i++;
            }
            while (lig[lix].gen[i] === gix) {
              res *= prim[mar[lig[lix].mem[i]].cl];
              i++;
            }
            return res;
          }  // generates the primproduct of classes of ligands of one generation in a ligand
            // called by compare2Ligs()

        
        
        }  // follows two ligand trees using the prim product of the class of all nodes 
          // of each generation as the criterion.
    
        function compareLigConfig(mar,bar,st1,st2,inc,exoch) {
        // configuarational differences between 2 ligands are searched for by directed dfsU 
        // inc is the atom to which both ligands are bound, st1 and st2 are the 1st ligand atoms
        // ez Differences and SC differences are searched for
          let i;
          let l1smar = [];
          let l2smar = [];
          let l1EZ = 0;
          let l2EZ = 0;
          let l1ezStr = "";
          let l2ezStr = "";
          let l1pSCstr = "";
          let l2pSCstr = "";
          let sense1 = "";
          let sense2 = "";
          let homo = false;
          let enantio = false;
          let diastereo = false;
          let ezSame = true;
          let joined = false;
          let exokey_inc = '';
          let exokey_rejoin = '';
          let result = 0;
      
      
      
          dfsU(mar,st1,inc);
          l1smar = visnodesDFS.slice(0);
          dfsU(mar,st2,inc);
          l2smar = visnodesDFS.slice(0);
          if (l1smar.length === l2smar.length) {
            for (i=1;i<l1smar.length;i++) { // i=1: start with first ligand atom, not incoming
              if ((exoch) && (l1smar[i]===l2smar[i])) { // capture the first common atom where the 2 paths rejoin
              // paths rejoin
                if (joined === false) { 
                  joined = true;
                  // check whether inc and the identical atom at the rejoin are both f of an exoezh[], if yes, copy these exoezh[] to corresponding ezh
                  exokey_inc = is_in_exoezh(mar,inc,'f');
                  exokey_rejoin = is_in_exoezh(mar,l1smar[i],'f');
                  if ((exokey_inc !== '') && (exokey_rejoin !== '') && (!exochain.includes(exokey_inc+","+exokey_rejoin)) && (!exochain.includes(exokey_rejoin+","+exokey_inc))) {
                    exochain.push(exokey_inc+","+exokey_rejoin);
                  }
                }
              } else {
                joined = false;
              }
              // search for EZ differences inside the ligands
              l1EZ = is_pEZatom(l1smar[i]); // if l1smar[i] is an ez DB atom, l1EZ is the DB partner 
              l2EZ = is_pEZatom(l2smar[i]); // if l2smar[i] is an ez DB atom, l2EZ is the DB partner 
              if ((l1EZ > 0) && (l2EZ > 0)) {// ezDB atom on both ligands
                l1ezStr = mar[l1smar[i]].rs;
                l2ezStr = mar[l2smar[i]].rs;
                if (((l1ezStr === "c") && (l2ezStr === "c")) || ((l1ezStr === "t") && (l2ezStr === "t"))) {
                  continue;
                } else if (((l1ezStr === "c") && (l2ezStr === "t")) || ((l1ezStr === "t") && (l2ezStr === "c"))) {
                  ezSame = false;
                  continue;
                } else {  // not all c/t rs values set yet, get them
                  l1ezStr= get_ez_value(mar,l1smar,l1smar[i],l1EZ);
                  l2ezStr= get_ez_value(mar,l2smar,l2smar[i],l2EZ);
                  if (l1ezStr !== l2ezStr) {
                    ezSame = false;
                    continue;
                  }
                }
              } else { // not ezDB atoms, check for SC candidates inside the ligands             
                l1pSCstr = isSCcandidate(mar,bar,l1smar[i]);
                l2pSCstr = isSCcandidate(mar,bar,l2smar[i]);
                if ((l1pSCstr === l2pSCstr) && (l1pSCstr !== "")) { // both SC candidates with identical pSCstr
                  sense1 = get_scSense_one(mar, bar, l1smar[i], l1pSCstr, l1smar,'gen');
                  sense2 = get_scSense_one(mar, bar, l2smar[i], l2pSCstr, l2smar,'gen');
                  if ((sense1 !== "") && (sense2 !== "")) {
                    if (sense1 === sense2) { // same sense
                      if ((homo === false) && (enantio === false)) {
                        homo = true; // first pair
                      } else if (enantio === true) { // earlier pairs were enantio
                        diastereo = true;
                        homo = false;
                        enantio = false;
                      }
                    } else {  // different senses
                      if ((homo === false) && (enantio === false)) {
                        enantio = true; // first pair
                      } else if (homo === true) { // earlier pairs were homo
                        diastereo = true;
                        homo = false;
                        enantio = false;
                      }
                    }
                  }  
                }
              }
            } // end for all equivalent atoms pairs in l1smar[] and l2smar[]
            if (((homo) && (ezSame)) || ((ezSame) && (!homo) && (!enantio) && (!diastereo))) {
              result = 0;
            } else {
              result = -1;
            }
          } else {
            result = -1;
          }
          return result;
        
          

          function get_ez_value(mar,smar,at1,at2) { // smar ist the array from ligand directional search by dfsU, at1 and at2 are DB atoms
          // the "c" or "t" value returned depends on the orientation (same side, opposite side of DB at1=at2)
          // of the two ligands closest by index to the DB atoms in the smar[] array (filled by directional search by dfsU).
          // if one of the DB atoms at1 or at2 have no ligands (terminal =CH2), an empty string is returned.
            let i;
            let ci;
            let at1ix = -1;
            let at2ix = -1;
            const liga1 = [];
            const liga2 = [];
            const ligix1 = [];
            const ligix2 = [];
            let lig1 = 0;
            let lig2 = 0;
            let tsmar = [];
      
            tsmar = smar.slice(0); // local copy of smar
            at1ix = tsmar.indexOf(at1); // index of at1 in smar
            at2ix = tsmar.indexOf(at2); // index of at2 in smar
            for (i=0;i<mar[at1].bpa.length;i++) { // find the non DB bonding partners of at1
              if (mar[at1].bpa[i].t !== 2) {
                liga1.push(mar[at1].bpa[i].p);
                ligix1.push( tsmar.indexOf(mar[at1].bpa[i].p));
              }
            }
            if (liga1.length === 2) {
              // choose the ligand atom that is closer to at1 in smar[]
              lig1 = (Math.abs(at1ix-ligix1[0]) < Math.abs(at1ix-ligix1[1])) ? liga1[0] : liga1[1]; 
            } else if (liga1.length === 1) {
              lig1 = liga1[0];
            } else {
              return "";
            }
            for (i=0;i<mar[at2].bpa.length;i++) { // find the non DB bonding partners of at2
              if (mar[at2].bpa[i].t !== 2) {
                liga2.push(mar[at2].bpa[i].p);
                ligix2.push( tsmar.indexOf(mar[at2].bpa[i].p));
              }
            }
            if (liga2.length === 2) {
              lig2 = (Math.abs(at2ix-ligix2[0]) < Math.abs(at2ix-ligix2[1])) ? liga2[0] : liga2[1]; 
            } else if (liga2.length === 1) {
              lig2 = liga2[0];
            } else {
              return "";
            }
            ci = vecprodDB(lig1,at1,at2,lig2); // lig2 cis or trans to lig1 ?
            if (ci === -1) { // cis
              mar[at1].rs = "c";
              mar[at2].rs = "c";
              return "c";
            } else { //trans 
              mar[at1].rs = "t";
              mar[at2].rs = "t";
              return "t";      
            }
          } // determines c|t for ligands at DB via dfsU
          
        } // configurational differences (sc or double bond) inside 2 ligands are searched for by directed dfsU
    
        function is_pEZatom(at) { // returns the other atom of the DB if at is part of an ezBond, else returns -1.
          let i;
      
          if (at === 0) { return -1;}
      
          for (i=0;i<pezBonds.length;i++) {
      
            if ((b_s[pezBonds[i]].fra === at) && ((m_s[at].rs === "c") || (m_s[at].rs === "t"))) {
              return b_s[pezBonds[i]].toa;
            } 
            if ((b_s[pezBonds[i]].toa === at) && ((m_s[at].rs === "c") || (m_s[at].rs === "t"))) {
              return b_s[pezBonds[i]].fra;
            } 
          }
          return -1;
        } // returns the other atom of the DB if at is part of an ezBond (b_s[at].rs !=='') else returns -1.
    
    // finalSmiles
        function finalSmiles(mar) { // returns the final SMILES string
        // converts the numeric smiles string into the final one with the element symbols
          let i=0, jj=0;
          const p0 = /^(\d+)/;
          const p1 = /·(\d+)/; //changed to '·' (ASCII 250) from '-' in bugfix 180320.1
      
          const converted = []; // array of atom indexes of converted atoms
          let tsmiles = "";
          let fsmiles = "";
          let matched = "";
          let left_fsmiles = "";
          let right_fsmiles = "";
          let ast = "";
          let ezStr = ""; // the slash that is put in front of mat or ''
          let bord = 0;
          let ezbp = -1; // the bonding partner of an ezDB atom or the other end of a ezCumulene
          let bs = ''; // the string that is inserted instead of the atomindex upon conversion
          let mat = 0;  // the atom index under examination
          let cezhk = ''; // the key of the current ezh[]
          let ct = 1; // initially ezh[].r11, describes relation between fl1 and tl1 and can be modified to -1
          let db2 = 0; // ezh[].t
          let lig11 = 0; // ezh[].fl1
          let lig12 = 0; // ezh[].fl2
          let lig21 = 0; // ezh[].tl1
          let lig22 = 0; // ezh[].t22
          let cix1 = 0;  //bugfix 190102.1
          let cix2 = 0; //bugfix 190102.1
          let rcl21 = 0;
          let rcl22 = 0;
          let ccjl = [];
          let tmplig = 0;
          let conjcode = '';
          const psh = {}; // dict containing the slashes. key: Atom index as string
          let ccjdb1 = 0;
          let refezStr = '';
          let postezStr = '';
          let result; // the final SMILES string
      
          tsmiles = smiles; // smiles is onumsmiles here
          fsmiles = smiles; // smiles is onumsmiles here

          // reset the psh{} dict              
          for (const key in psh) {
            if (psh.hasOwnProperty(key)) {
              delete psh[key];
            }
          }
            
          // first atom, never has a slash or a =,# prefix
          result = tsmiles.match(p0); // match for first atom in numSmiles (without leading -)
          if (result !== null) {  
            matched = String(result[0]);
            tsmiles = tsmiles.slice(result.index + matched.length);
            mat = parseInt(result[1],10);
            bs = "";
            if (rcstr[String(mat)] !== undefined) {
              bs = rcstr[String(mat)]; //bs is ring closure digit(s)
            }
            ast = atomSmiles(mar,mat);
            fsmiles = ast + bs + fsmiles.slice(matched.length); // bs is suffix 
            converted.push(mat);
          }
          // all other atoms
          while ((tsmiles.length !== 0) && (result !== null)) {
            result = fsmiles.match(p1);
            if (result !== null) {
              matched = String(result[0]);
              tsmiles = fsmiles.slice(result.index + matched.length);
              mat = parseInt(result[1],10); // the atom index of the currently examined atom as number
              left_fsmiles = fsmiles.slice(0, result.index);
              right_fsmiles = fsmiles.slice(result.index + matched.length);
              for (i=0;i<mar[mat].bpa.length;i++) { // find the bond order to previous atom
                if ((mar[mat].bpa[i].p === incoming[mat]) || ( converted.includes(mar[mat].bpa[i].p))) {
                  if ((emfuSmiles) && (mar[mat].ar) && (mar[mar[mat].bpa[i].p].ar)) { // emfu bond
                    bord = 0;
                  } else {
                    bord = mar[mat].bpa[i].t;
                  }
                  switch (bord) {
                    case 0:
                    case 1:
                    case 4:
                    case 5:
                      bs = "";
                      break;
                    case 2:
                      bs = "=";
                      break;
                    case 3:
                      bs = "#";
                      break;
                  }
                  if (bs.length > 0) { break; }
                }
            
              } // end loop over bpa
          
              ast = atomSmiles(mar, mat); // function call to generate the atom string
              // test for position of mat in an EZ-DB fl1(fl2)f=t(tl1)tl2
            
              // insert the double bond stereo descriptor (/ or \) if applicable
              ezStr = '';
              ezbp = is_pEZatom(mat); // mat part of ezDB or ezCumulene?
              if (ezbp === -1) {
                ezbp = is_ezCCend(mat); // mat end of ez cumulene ?
              }
              if ((ezbp !== -1) && (mar[mat].rs !== "") && (mar[ezbp].rs !== "")) { // mat is part of ezDB or ezCumulene, ezbp is the other end
                if (!converted.includes(ezbp)) { // the other end has not been converted yet
                // mat is a 1st ezDB or ezCC Atom
              
                  // analyse ezh[mat-ezbp] and store ligand atoms with their pending slashes on stacks
                  // note: if the ezDB atom is db1 with db2 in a sidechain connected via = to the main chain:
                  // ezh here will refer to the main chain=side chain double bond
                  // the slash after db2 in the side chain must refer to the slash before db1 in the main chain
                  // in this case, lig21 must not be put on the stack
              
                  if (ezh[String(mat)+"-"+String(ezbp)] !== undefined) {
                    cezhk = String(mat)+"-"+String(ezbp); // current ezh key
                    conjcode = '';
                    rcl21 = 0;
                    rcl22 = 0;
                    db2 = ezh[cezhk].t;
                    lig11 = ezh[cezhk].fl1;
                    lig12 = ezh[cezhk].fl2;
                    // make sure that lig11 is the ligand immediately before mat in the onumsmiles
                    // necessary if both have been converted already (exocyclic DB)
                    if ((converted.includes(lig11)) && (converted.includes(lig12))) { //bugfix 190102.1
                      cix1 = converted.indexOf(lig11); //bugfix 190102.1
                      cix2 = converted.indexOf(lig12); //bugfix 190102.1
                      lig11 = converted[Math.max(cix1,cix2)]; //bugfix 190102.1
                      lig12 = converted[Math.min(cix1,cix2)]; //bugfix 190102.1
                    } //bugfix 190102.1
                    conjcode += String(((is_pEZatom(lig11) !== -1) || (is_ezCCend(lig11) !== -1))? 1 : 0);
                    conjcode += String(((is_pEZatom(lig12) !== -1) || (is_ezCCend(lig12) !== -1))? 1 : 0);
                    lig21 = ezh[cezhk].tl1;
                    lig22 = ezh[cezhk].tl2;
                    // make sure that lig21 comes before lig22 in onumsmiles (exocyclic DB) but only if they are not ring closure atoms to db2
                    if ((lig21 !== 0) && (lig22 !== 0)) {
                      cix1 = smilesarray.indexOf(lig21); //bugfix 190102.1
                      cix2 = smilesarray.indexOf(lig22); //bugfix 190102.1
                      if ((rcstr[String(lig21)] !== undefined) && (rcstr[String(db2)] !== undefined) && (rcstr[String(lig21)]===rcstr[String(db2)])) {
                        rcl21 = lig21;
                      }
                      if ((rcstr[String(lig21)] !== undefined) && (rcstr[String(db2)] !== undefined) && (rcstr[String(lig21)]===rcstr[String(db2)])) {
                        rcl22 = lig22;
                      }
                      if ((rcl21 === 0) && (rcl22===0)) {
                        lig21 = smilesarray[Math.min(cix1,cix2)]; //bugfix 190102.1
                        lig22 = smilesarray[Math.max(cix1,cix2)]; //bugfix 190102.1
                      } else if ((rcl22 !==0) && (rcl21===0)) {
                        lig22 = lig21;
                        lig21 = rcl22;
                      }
                    }
                    conjcode += String(((is_pEZatom(lig21) !== -1) || (is_ezCCend(lig21) !== -1))? 1 : 0);
                    conjcode += String(((is_pEZatom(lig22) !== -1) || (is_ezCCend(lig22) !== -1))? 1 : 0);
                    ct = ezh[cezhk].r11;
                    // change cis/trans between lig11 and lig21 if lig11/lig12 or lig21/lig22 have been swapped above
                    if (lig11 !== ezh[cezhk].fl1) {
                      ct *= (-1);
                    }
                    if (lig21 !== ezh[cezhk].tl1) {
                      ct *= (-1);
                    }
                    // examine ligands on the incoming (db1) end. 
                    // lig11 is the incoming ligand and has been converted
                    // lig12 will be in () and comes after the db1 atom in the SMILES either in () or,
                    // if ezh[mat-ezbp] is a cross-conjugated DB to a side chain (=lig12), lig12 will be the second atom
                    // of the current ezDB db2 and no slash is recorded for it
                    // if lig21 is a ring closure (necessary for conjcodes 'x1xx'), dba1 will receive a postezStr.
                
                    // decide on slash for lig11 (in front of mat)
                    switch (conjcode) {
                      case '0000':
                      case '0001':
                      case '0010':
                      case '0011':
//                  case '0100': // commented out in bugfix 190102.1
                         if ((!mar[lig11].ar) && (is_cross_conjugated(mar,lig11))) {
                          ccjl = [];
                          ccjdb1 = 0;
                          // mat is bound to cross conjugated DB. Collect the 2 singly bound ligands in ccjl[].
                          for (jj=0;jj<mar[lig11].bpa.length;jj++) {
                            if (mar[lig11].bpa[jj].t === 1) { // singly bound ligand
                              ccjl.push(mar[lig11].bpa[jj].p);
                            } else if (mar[lig11].bpa[jj].t === 2) { // the ccj double bond partner
                              ccjdb1 = mar[lig11].bpa[jj].p;
                            }
                          }
                          if ((ccjl.length === 2) && (converted.includes(ccjdb1)) && (converted.includes(lig11))) {
                            if ( smilesarray.indexOf(ccjl[0]) >  smilesarray.indexOf(ccjl[1])) { // swap to have ccjl[0] first in smilesarry
                              tmplig = ccjl[0];
                              ccjl[0] = ccjl[1];
                              ccjl[1] = tmplig;
                            }
                            if (mat === ccjl[0]) {
                              ezStr = '\\';
                              refezStr = ezStr;
                              psh[String(mat)] = ezStr;
                            } else if ((mat === ccjl[1]) && (psh[String(ccjl[0])] !== undefined)) { // second ligand
                              ezStr = (psh[ccjl[0]] === '\\')?  '/' : '\\'; // opposite type of slash than first ligand
                              refezStr = ezStr;
                              psh[String(mat)] = ezStr;
                            } else { // BF210215.1
                              ezStr = '\\'; // BF210215.1
                              refezStr = ezStr; // BF210215.1
                              psh[String(mat)] = ezStr; // BF210215.1
                            } 
                          } else {
                            ezStr = '\\';
                            refezStr = ezStr;
                            psh[String(mat)] = ezStr;
                          }
                        } else if (has_several_DB_ligands(mar,lig11)) {
                          ccjl = [];
                          ccjdb1 = 0;
                          // mat is bound to atom with 2 DB ligands. Collect the 2 singly bound DB ligands in ccjl[].
                          for (jj=0;jj<mar[lig11].bpa.length;jj++) {
                            // register ezDB ligand atoms of lig11 that are ezDB atoms
                            if ((mar[lig11].bpa[jj].t === 1) && ((mar[mar[lig11].bpa[jj].p].rs==='c') || (mar[mar[lig11].bpa[jj].p].rs==='t'))) {
                              // exclude ezDB atoms bound to lig11 but on he incoming branch
                              if (smilesarray.indexOf(lig11) < smilesarray.indexOf(mar[lig11].bpa[jj].p)) { 
                                ccjl.push(mar[lig11].bpa[jj].p);
                              }
                            } 
                          }
                          if ((ccjl.length > 1) && (converted.includes(lig11))) {
                            ccjl.sort((a, b) => // sort ccj[] according to index in smilesarray
                            smilesarray.indexOf(a) - smilesarray.indexOf(b));
                            if (mat === ccjl[0]) {
                              ezStr = '\\';
                              refezStr = ezStr;
                              psh[String(mat)] = ezStr;
                            } else if ((ccjl.indexOf(mat) > 0) && (psh[String(ccjl[0])] !== undefined)) { // second or higher ligand
                              ezStr = (psh[ccjl[0]] === '\\')?  '/' : '\\'; // opposite type of slash than first ligand
                              refezStr = ezStr;
                              psh[String(mat)] = ezStr;
                            }
                          } else {
                            ezStr = '\\';
                            refezStr = ezStr;
                            psh[String(mat)] = ezStr;
                          }
                        } else { // put slash in front of mat, type free: \
                          ezStr = '\\';
                          refezStr = ezStr;
                          psh[String(mat)] = ezStr;
                        }
                        break;
                      case '0100': //bugfix 190105.1
                        if ((rcstr[String(lig12)] !== undefined) && (converted.includes(lig12))) { // lig12 is a ring closure to a converted atom
                          ezStr = '\\';
                          refezStr = ezStr;
                          psh[String(mat)] = ezStr;
                        }
                        break;
                      case '1000':
                      case '1001':
                      case '1101':
                      case '1010':
                      case '1011':
                      case '1100':
                      case '1111':
                        if (psh[String(mat)] !== undefined) {
                          // put slash of type psh[mat] in front of mat
                          ezStr = psh[String(mat)]; // type of slash dictated by last ezDB
                          refezStr = ezStr;
                        } else if (is_cross_conjugated(mar,lig11)) {
                          // mat is bound to cross conjugated DB: is it the second ligand?
                          for (jj=0;jj<mar[lig11].bpa.length;jj++) {
                            if ((mar[lig11].bpa[jj].t === 1) && (psh[String(mar[lig11].bpa[jj].p)] !== undefined)) {
                              ezStr = (psh[String(mar[lig11].bpa[jj].p)] === '\\')?  '/' : '\\';
                              refezStr = ezStr;
                              psh[String(mat)] = ezStr;
                            } else if (mar[lig11].bpa[jj].t === 1) {
                              ezStr = '\\';
                              refezStr = ezStr;
                              psh[String(mat)] = ezStr;
                            }
                          }          
                        } else {  // put slash in front of mat, type free: \
                          ezStr = '\\';
                          refezStr = ezStr;
                          psh[String(mat)] = ezStr;
                        }
                        break;                
                    }
                    // decide on slash for lig12 
                    switch (conjcode) {
                      case '0100':
                      case '0101':
                      case '1101':
                      case '0111':
                      case '1111':
                      case '1100':
                        // slash goes in front of lig12:
                        // store type to slash in psh[lig12]
                        psh[String(lig12)] = '\\';
                        // in these 4 cases the refezStr is \ although lig11 has no slash
                        if ((conjcode === '0100') || (conjcode === '0101') || (conjcode === '0111')) {
                          refezStr = '\\';
                        }
                        break;
                      case '0110':
                        if (smilesarray.indexOf(lig12) < smilesarray.indexOf(lig21)) {
                          psh[String(lig12)] = '\\';
                          refezStr = '\\';
                          if (ct===1) {
                            psh[String(lig21)] = psh[String(lig12)];
                          } else {
                            psh[String(lig21)] = (psh[String(lig12)] === '\\')? '/' : '\\';
                          }  
                        } else { // lig12 is after lig21 in smilesarray
                          psh[String(lig21)] = '\\';
                          refezStr = '\\';
                          if (ct===1) {
                            psh[String(lig12)] = psh[String(lig21)];
                          } else {
                            psh[String(lig12)] = (psh[String(lig21)] === '\\')? '/' : '\\';
                          }  
                        }  
                        break;                
                    }
                    // examine ligands on the outgoing (db2) end
                    // decide on slash for lig21 
                    switch (conjcode) {
                      case '0000':
                      case '1000':
                      case '1100':
                        // unless slash before lig21
                        if (!((rcstr[String(lig21)] !== undefined) && (rcstr[String(lig21)] === rcstr[String(db2)]))) {
                          // slash in front of lig21 type: normal rel to lig11
                          // store type to slash in psh[lig21]
                          if (ct===1) {
                            psh[String(lig21)] = refezStr;
                          } else {
                            psh[String(lig21)] = (refezStr === '\\')? '/' : '\\';
                          }
                        }
                        break;                  
                      case '0011':
                      case '0010':
                      case '1111':
                        // slash in front of lig21 type: normal rel to lig11
                        // store type to slash in psh[lig21]
                        if (ct===1) {
                          psh[String(lig21)] = refezStr;
                        } else {
                          psh[String(lig21)] = (refezStr === '\\')? '/' : '\\';
                        }
                        break;
                      case '1011':
                      case '1010':
                      // refezStr from lig11
                        if (ct=== 1) {
                          psh[String(lig21)] = refezStr;
                        } else {
                          psh[String(lig21)] = (refezStr === '\\')? '/' : '\\';
                        }
                        break;                    
                      case '0100':
                      case '0111':
                        // slash in front of lig21 normal rel to refezStr
                        // store type to slash in psh[lig21]                    
                        if (ct=== 1) {
                          psh[String(lig21)] = refezStr;
                        } else {
                          psh[String(lig21)] = (refezStr === '\\')? '/' : '\\';
                        }
                        break;
                    }
                  // decide on slash for lig22 
                    switch (conjcode) {
                      case '0000':
                      case '1000':
                      case '1100':
                        if ((rcstr[String(lig21)] !== undefined) && (rcstr[String(lig21)] === rcstr[String(db2)])) {
                          // slash in front of lig22 type: normal rel to lig11
                          // store type to slash in psh[lig22]                    
                          if (ct=== -1) {
                            psh[String(lig22)] = refezStr;
                          } else {
                            psh[String(lig22)] = (refezStr === '\\')? '/' : '\\';
                          }
                        }
                        break; // BUGFIX 190114.2  
                      case '0001':
                      case '1001':
                      case '1011':                
                      case '1101':
                        // slash in front of lig22 type: normal rel to lig11
                        // store type to slash in psh[lig22]                    
                        if (ct=== -1) {
                          psh[String(lig22)] = refezStr;
                        } else {
                          psh[String(lig22)] = (refezStr === '\\')? '/' : '\\';
                        }
                        break;
                      case '0011':
                      case '0111':
                      case '1111':
                        // slash in front of lig22 opposite to lig21
                        // // store type to slash in psh[lig22]                    
                        psh[String(lig22)] = (psh[String(lig21)] === '\\')? '/' : '\\';
                        break;
                      case '0101':
                        // slash in front of lig22 normal rel to lig21 (refezStr)
                        if (ct=== -1) {
                          psh[String(lig22)] = refezStr;
                        } else {
                          psh[String(lig22)] = (refezStr === '\\')? '/' : '\\';
                        }
                        break;
                    }
                  }
                  bs += ezStr + ast; // slash before first ezDB atom unless it goes to sidechain EZ
                } else { // mat is the second DB atom or 2nd end of cumulene
                  if (rcstr[String(mat)] !== undefined) { // BUG fix 180405.1
                  // deal with a ring closure as the ligand of the second DB atom
                    // search for the other atom of ring closure in smilesarray
                    for (i=0;i<smilesarray.length;i++) {
                      if ((smilesarray[i] !== mat) && (rcstr[String(smilesarray[i])] !== undefined)) { 
                        if (rcstr[String(smilesarray[i])] === rcstr[String(mat)]) { // smilesarray[i] belongs to same ring-closure as mat
                        // ring closure receives slash (postezStr) only if the other ligand is absent or the rc-ligand is conjugated
                          if ((lig21 === smilesarray[i]) && ((lig22 === 0) || (conjcode.charAt(2)==='1'))) {
                            if (ct === 1) {
                              postezStr = refezStr;
                            } else {
                              postezStr = (refezStr === '\\')? '/' : '\\';
                            }
                            if ((psh[String(lig22)] !== undefined) && (psh[String(lig22)] !== '') && (conjcode.charAt(3)==='0')) { // bugfix 190106.1
                              psh[String(lig22)] = '';
                            }
                          } else if (lig22 === smilesarray[i]) { // bugfix 190102.1
                            if (ct === 1) {
                              postezStr = (refezStr === '\\')? '/' : '\\';
                            } else {
                              postezStr = refezStr;
                            }
                            if ((psh[String(lig21)] !== undefined) && (psh[String(lig21)] !== '') && (conjcode.charAt(2)==='0')) { // bugfix 190106.1
                              psh[String(lig21)] = '';
                            }
                          }
                        } 
                      }
                    }
                  } // BUG fix 180405.1 and 190102.1
                  bs += ast;
                  bs += postezStr;
                  postezStr = '';                
                }            
              } else { // mat is not an ezDB atom or ezCumulene end
                if ((psh[String(mat)] !== undefined) && (psh[String(mat)] !== '')) {
                  // mat is the pending ligand on a 1st DB atom
                  ezStr = psh[String(mat)];
                } else {
                  ezStr = '';
                }
                bs += ezStr + ast;  // slash before pending ligand atom smiles
              }
              // append the ring closures string. It is stored in rcstr[String(mat)] dict by strRC().
              if (rcstr[String(mat)] !== undefined) {
                bs += rcstr[String(mat)];
              }
          
              fsmiles = left_fsmiles + bs + right_fsmiles;
              converted.push(mat);
            }
          } // end while
          return fsmiles;
        
          function is_cross_conjugated(mar,at) {
            let i, jj;
            let nsp2 = 0;
            let result = false;
      
            // only atoms with 3 bonding partners can be cross conjugated
            if (mar[at].bpa.length !== 3) { 
              result = false;
            } else {        
              nsp2 = 0;
              for (i=0;i<mar[at].bpa.length;i++) {
                if (mar[at].bpa[i].t === 2) { // the double Bond
                  nsp2++;
                } else if (mar[at].bpa[i].t === 1) { // single bonded partner
                  for (jj=0;jj<mar[mar[at].bpa[i].p].bpa.length;jj++) {
                    if (mar[mar[at].bpa[i].p].bpa[jj].t === 2) { // that has a double bonded partner
                      nsp2++;
                    }            
                  }
                }
              }
            }
            if (nsp2 === 3) {
              result = true;
            } else {
              result = false;
            }
            return result;
          } // bool: true if at is DB atom and bound to 2 DB atoms via single bonds 
    
          function has_several_DB_ligands(mar,at) {
            let i, jj;
            let nsp2 = 0;
            let result = false;

            nsp2 = 0;
            for (i=0;i<mar[at].bpa.length;i++) {
              if (mar[at].bpa[i].t === 1) { // single bonded partner
                for (jj=0;jj<mar[mar[at].bpa[i].p].bpa.length;jj++) {
                  if (mar[mar[at].bpa[i].p].bpa[jj].t === 2) { // that has a double bonded partner
                    nsp2++;
                  }            
                }
              }
            }
            if (nsp2 >= 2) {
              result = true;
            } else {
              result = false;
            }
            return result;
          } // bool: checks if an atom has two single bonds to DB atoms

    // atomSmiles
          function atomSmiles(mar,ca) {
            let atstr = "";
            let nv = 0; // normal valency
            let v = 0;  // actual valency
            let bo = 0; // bond order
            let nH = 0; // number of attached hydrogens
            let elstr = "";
            let nHstr = "";
            let cStr = "";
            let scStr = ""; 
            let i=0;
            let normal = false; // used to decide whether square brackets are necessary
      
      
            nv = val[mar[ca].an];
            // sum the bond orders of all bonds to partners
            // summing up the bond oders in m_s misses the bonds to explicit H, add them at the beginning
            v = 0;
            for (i=0;i<mar[ca].bpa.length;i++) {
              bo = mar[ca].bpa[i].t
              if ((bo === 4) || (bo === 5)) { bo = 1;} // stereo single bonds
              v += bo;
            }
            if ((v <= nv) && (nv > 0)) {
              normal = true;
            }
            if (mar[ca].c !== 0) {
              normal = false;
            }
            if (mar[ca].r) {
              normal = false;
            }
            if ((scCC.length > 0) && (ccSense[String(ca)] !== undefined)) {
              scStr = ccSense[String(ca)];
              normal = false;
            } else {
              scStr = "";        
            }
            if ((scAtoms.length > 0) && ( scAtoms.includes(ca))) { // stereogenic center
              if (scSense[String(ca)] !== undefined)  { 
                scStr = scSense[String(ca)];
                if (scStr !== "") {
                  normal = false;
                }
              } else {
                scStr = "";
              }
            }
            // higher valencies of S and P are also defined as normal in SMILES but here we use the lowest normal valency
            if ((mar[ca].el === "S") && ((v === 4) || (v === 6))) { normal = false;} 
            if ((mar[ca].el === "P") && (v === 5)) { normal = false;}
            if (mar[ca].el === "C:") { // carbene
              nv = 2;
            }
            if (mar[ca].el === "N:") { // nitrene
              nv = 1;
            }

            nH = getAutoH(mar,ca,true)+mar[ca].eh;

            if (nH + v !== nv) { //BF200820.1
              normal = false;
            }
            
//            console.log("atom ["+ca+"] el="+mar[ca].el+" nH="+nH+" eh="+mar[ca].eh+" v="+v+" normal="+normal); //BF200820.1


            elstr="";
            if ((mar[ca].ar) && ( emfuAtoms.includes(mar[ca].el))) { // emfu atom
              elstr = mar[ca].el.toLowerCase();
            } else if ( sextets.includes(mar[ca].el)) {
              elstr = mar[ca].el.slice(0,1);
            } else {
              elstr = mar[ca].el;
            }

            if ((normal) && ( organic.includes(mar[ca].el))) {  // organic subset and normal lowest valency
              atstr = elstr;
            } else {
              // full atom spec in square brackets
              if (nH <= 0) {
                nHstr = "";
              } else if (nH === 1) {
                nHstr = "H";
              } else {
                nHstr = "H" + String(nH);
              }
        
        
              if (mar[ca].c === 0) { // charge
                cStr = "";
              } else if (mar[ca].c > 0){
                cStr = "+" + String(mar[ca].c);
                if (mar[ca].c === 1) { cStr = "+"}
              } else if (mar[ca].c < 0) {
                cStr = String(mar[ca].c);
                if (mar[ca].c === -1) { cStr = "-"}
              }
          
              atstr = "[" + elstr + scStr + nHstr + cStr + "]";
            }
            return atstr;        
          } // generates the substring for one atom in the final smiles
                        
        } // converts the numeric smiles string into the final one with the element symbols
        
        function arrowSmiles(mar,bar,sar) {
          let i=0;
          let nix1=0;
          let nix2=0;
          let arwsmiles='¿';
          
          if (arro_s.length > 0) {
            arro_s.sort((a, b) => //BUGFIX 190412.2
            Math.abs(a.st) - Math.abs(b.st)); // sort arro_s[] according to increasing absolute value of the .st property
          } else {
            return '';
          }
          for (i=0;i<arro_s.length;i++) { // for all arrows in arro_s[]
            nix1=0;
            nix2=0;
            // start
            if (arro_s[i].st < 0) { // start at bond
              if (Number.isInteger(arro_s[i].st)) { // not bond to explH 
                nix1 = sar.indexOf(String(bar[(-1)*arro_s[i].st].fra))+1;
                nix2 = sar.indexOf(String(bar[(-1)*arro_s[i].st].toa))+1; 
                arwsmiles += (String(nix1) + '-' + String(nix2) + ':');
              } else { // bond to explH: the real negative number refers to bearing atom, not bond
                nix1 = (-1)*(sar.indexOf(String(Math.floor((-1)*arro_s[i].st)))+1)-0.5;
                arwsmiles += String(nix1)+ ':';
              }
            } else if ((arro_s[i].st > 0) && (Number.isInteger(arro_s[i].st))) { //start at atom, can not be explH
              nix1 = sar.indexOf(String(arro_s[i].st))+1;
              arwsmiles += (String(nix1) + ':');
            }
            // end
            if ((arro_s[i].en < 0) && (Number.isInteger(arro_s[i].en))) { // end at bond, can not be bond to explH
              nix1 = sar.indexOf(String(bar[(-1)*arro_s[i].en].fra))+1;
              nix2 = sar.indexOf(String(bar[(-1)*arro_s[i].en].toa))+1; 
              arwsmiles += (String(nix1) + '-' + String(nix2) + ':');
            } else if (arro_s[i].en > 0) { // end at atom
              if (Number.isInteger(arro_s[i].en)) { //end not at explH
                nix1 = sar.indexOf(String(arro_s[i].en))+1;
                arwsmiles += (String(nix1) + ':');
              } else { //end at explH
                nix1 = sar.indexOf(String(Math.floor(arro_s[i].en)))+1.5;
                arwsmiles += (String(nix1) + ':');
              }
            }
            arwsmiles += arro_s[i].ty + ':';
            arwsmiles += (arro_s[i].crv > 0)? 'l' : 'r';
            if (i < arro_s.length-1) {
              arwsmiles += ';';
            }          
          }
          arwsmiles += '¿';
          return arwsmiles;
        
        } // composes the arrow SMILES and returns it as string
        
        function lonepairSmiles(mar,sar) {
          let i=0;
          let lpsm = '';
          
          for (i=0;i<sar.length;i++) {
          
            if (mar[sar[i]].nlp > 0) {
                lpsm += String(i+1)+':'+String(mar[sar[i]].nlp)+';';
            }
          }
          if (lpsm !== '')  {
            lpsm = '!'+lpsm.slice(0,-1)+'!';
            return lpsm;
          } else {
            return '';
          }
        }
        
        function reactionSmiles(rxnar) {
          let i=0;
          let rxnsm ='§';
          
          //canonicalize by sorting according to the joined .stn and .etn
          if (rxnar.length > 0) {
            for (i=0;i<rxnar.length;i++) { // sort the stn and etn arrays numerically
              rxnar[i].stn.sort( (a, b) => a-b );
              rxnar[i].etn.sort( (a, b) => a-b );
            }
            rxnar.sort((a, b) => { //BUGFIX 190413.2
              const aj = a.stn.join() + a.etn.join();
              const bj = b.stn.join() + b.etn.join();
              if (aj > bj) {
                return 1;
              } else if (bj > aj) {
                return -1
              } else {
                return 0;
              }
            }); // sort arro_s[] according to alphabetic order of concatenated joined .stn and .etn properties
          } else {
            return '';
          }
          for (i=0;i<rxnar.length;i++) {
            rxnsm += rxnar[i].stn.join() + ':' + rxnar[i].etn.join() + ':' + String(rxnar[i].ty) + ':' + rxnar[i].aa + ':' + rxnar[i].ab;
            if (i < rxnar.length-1) {
              rxnsm += ';'
            }
          }
          rxnsm += '§';
          return rxnsm;
        }
    
    // insertRC
        function strRC() { 
          let i, c1="", c2="", i1 = 0, i2 = 0;
          let c1c2 = [];
          let minat = [];
          let gt9 = "";

          if (ringclosures.length === 0) { return; }
          // ring closures insertion
          minat = [];
          for (i=0;i<ringclosures.length;i++) { // presort ring closures such that they are numbered according to insertion order
            c1c2 = ringclosures[i].split(':');
            c1 = c1c2[0];
            c2 = c1c2[1];
            i1 = visnodes.indexOf(parseInt(c1,10)); // index of c1 in visnodes
            i2 = visnodes.indexOf(parseInt(c2,10));  // index of c2 in visnodes
            minat[ringclosures[i]] = Math.min(i1, i2); // the earlier one is stored in minat[] dict
          }
          ringclosures.sort((a, b) => // sort ring closures such that the ones with the earliest insertion come first
          minat[a] - minat[b]);
          // elements of ringclosure are now sorted in the order of increasing ringclosure number

          rcstr = {};
          for (i=0;i<ringclosures.length;i++) { // fill the dict of ringclosure strings
            c1c2 = ringclosures[i].split(':');
            c1 = c1c2[0];
            c2 = c1c2[1];
            if ((i + 1) > 9) { // two digit ring closure number
              gt9 = "%";
            } else {
              gt9 = "";
            }
            if (rcstr[c1] !== undefined) {
              rcstr[c1] += gt9 + String(i+1);  
            } else {
              rcstr[c1] = gt9 + String(i+1);
            }
            if (rcstr[c2] !== undefined) {
              rcstr[c2] += gt9 + String(i+1);  
            } else {
              rcstr[c2] = gt9 + String(i+1);
            }
          }        
        
        } // generates the ring closures string and stores it in dict rcstr{} key: atom index as string
    
        function sort_abop_by_class(mar,bar,ca) { // mar is a m[] type array of atoms
    
          const tabop = mar[ca].bpa.slice(0);  // make a local copy of bpa[]
          // sorting in descending order (smaller - larger) so that the last element (lowest class, or non emfu ring double bond)
          // gets on the stack last
            
          tabop.sort((a, b) => { // a and b are elements of tabop ( i.e the bpa array of ca)
            let abt, bbt;
        
            abt = a.t;
            bbt = b.t;
            if ((abt === 4) || (abt === 5)) { abt = 1; }
            if ((bbt === 4) || (bbt === 5)) { bbt = 1; }
    //          if ((emfuSmiles) && (mar[ca].ar) && (mar[a.p].ar) && (mar[b.p].ar)) {
            if ((emfuSmiles) && (mar[ca].ar)) {
            // emfuSmiles flag is set and the central atom and both bonding partners are emfu atoms: lower class last
              return mar[b.p].cl - mar[a.p].cl;
            } else {
              if (isringbond(bar,ca,a.p) && isringbond(bar,ca,b.p) && (abt !== bbt)) {  
              // if both bonds are ring bonds but not both the same bond order:
              // prefer double (triple) bond over single: higher bond order comes last
                return abt - bbt;
              } else if (((isringbond(bar,ca,a.p)) && (abt === 2)) && ((!isringbond(bar,ca,b.p)) && (bbt === 2))) { //BF200824.1 start
              // a is ring bond, b is not ring bond, both are double (hypervalent centers)
              // prefer the endocyclic bond: a comes last on stack (first in dfs)
                return 1;
              } else if (((!isringbond(bar,ca,a.p)) && (abt === 2)) && ((isringbond(bar,ca,b.p)) && (bbt === 2))) {
              // b is ring bond, a is not ring bond, both are double (hypervalent centers)
              // prefer the endocyclic bond:  b comes last on stack (first in dfs)
                return -1; //BF200824.1 end
              } else if (((isringbond(bar,ca,a.p)) && (abt > 1)) || ((isringbond(bar,ca,b.p)) && (bbt > 1))) {
              // one of a or b is a ring bond and double or triple: double or triple bond in ring comes last
                return abt - bbt;
              } else if (mar[b.p].cl === mar[a.p].cl) { // the 2 bonding partners have the same class!
                gtied.push({pa:ca,bp1:a.p,bp2:b.p});
                return 0;
              } else { // all other cases: lower class comes last
                return mar[b.p].cl - mar[a.p].cl;
              }            
            }
          });
          mar[ca].bpa = tabop.slice(0);
        }  // sort bonding partners of an atom according to class 
          // goal: lowest class last on stack, examined first by DFS
          // takes special rules for ring bonds into account
          // pushes ties to gtied[]


        function numRings(mar) { // works only on m_s without explicit H
          let i=0;
          let sum = 0;
      
          sum = 2;
          for (i=1;i<mar.length;i++) {
            sum += mar[i].bpa.length - 2;
          }
          sum /= 2;
          return sum;
        } // calculates number of rings from number of bonding partners of each atom

        function checkRing(mar,testar) {
          let i=0;
          let k=0;
          let bound=false;
          let tra = [];
          
          if (testar.length < 3) { // no rings with not at least 3 atoms
            return false;
          }
          tra = testar.slice(0);
          tra.push(testar[0]); // append first element again at end
          for (i=0;i<tra.length-1;i++) {
            bound=false;
            for (k=0;k<mar[tra[i]].bpa.length;k++) {
              if (mar[tra[i]].bpa[k].p === tra[i+1]) {
                bound=true;
              }
            }
            if (bound===false) {
              return false;
            }
          }
          return true;
        } // check wether testar (array of atom indices in mar[]) represents a closed ring. Returns true|false                    

        function sameRing(r1,r2) {
          const tr1=r1.slice(0).sort((a, b) => a-b);
          const tr2=r2.slice(0).sort((a, b) => a-b);
          let i=0;      
    
          if (r1.length !== r2.length) {
            return false;
          }

          for (i=0;i<tr1.length;i++) {
            if (tr1[i] !== tr2[i]) {
              return false;
            }
          }
          return true;
        } // r1, r2 are rings (or any other arrays that can be sorted numerically). Returns true|false

        function findRings(mar,bar) {  // works on mar
          let i, jj, k, bhbix, rbix;
          let bonds_in_rings = []; // 2D array bonds_in_rings[ring index][bond indices in b[]]
          let bridgeheadBonds = []; //=>findRings// 2D array bridgeheadBonds[index of bridgehead in bridgeheads] [bonding partners] value: index of atom
          let bridgedringbonds = [];
          let intersectionV = [];
          let fubox = 0;
          let tr1 = [];
          let tr2 = [];
          let tr3 = [];
          let tr1bx = [];
          let tr2bx = [];
          let sbrhx = 0;
          let ebrhx = 0;
          const newrings = [];
          const obsoleterings = [];
          let ringfound = false; //esw
      
          nRings = numRings(mar); // the number of rings calculated from the number of bonding partners of each atom
          findRingBonds(mar,bar);
          // findRingBonds: the arrays ringbonds[] and ringatoms[] are always complete (not dependent on search path ties)
          findBridgeheads(mar,bar);
          // bridgeheads[] is an array of all atoms (index in mar) that are bridgeheads 

          ringbondslist = [];
          for (i=0;i<ringbonds.length;i++) { // make a copy of the ringbonds array containing no bridgehead bonds
            if (!(isbridgeheadBond(bar,i))) {
              ringbondslist.push(ringbonds[i]);
            } 
          }
          // find all isolated and spiro rings
          rings=[];
          bonds_in_rings=[];
          while (ringbondslist.length > 0) { // assemble all rings without bridgeheads
            ringfound=false;
            ringfound=followRing(mar,bar,0,bar[ringbondslist[0]].fra,bar[ringbondslist[0]].toa,0);
          }
          numIsolatedRings = rings.length;
          isolatedRings = rings.slice(0);
          
          // bridged and annulated rings
          if (bridgeheads.length > 0) { // if there are bridged rings
            // get rid of all ringbonds of the isolated or spiro rings
        
            bridgedringbonds = [];
            for (i=0;i<ringbonds.length;i++) { // make a copy of the ringbonds array
                bridgedringbonds.push(ringbonds[i]);
            }
        
            for (i=0;i<rings.length;i++) { // loop over all isolated rings
        
              for (jj=0;jj<rings[i].length-1;jj++) { // loop over all atoms in ring
                rbix = getRingbondIndex(bridgedringbonds, rings[i][jj], rings[i][jj+1]); // get the index of the ring bond
                bridgedringbonds.splice(rbix,1);  // remove the ringbond from bridgedringbonds            
              }
              rbix = getRingbondIndex(bridgedringbonds, rings[i][0], rings[i][rings[i].length-1]); // get the index of the closing bond
              bridgedringbonds.splice(rbix,1);  // remove the closing bond from bridgedringbonds            
            }                      
            bridgeheadBonds = [];
            getBridgeheadBonds(bar);
            for (k=0;k<bridgeheads.length;k++) { // for each bridgehead
            // for each bridgehead start again with full list of all bridgedringbonds 
              for (jj=0;jj<bridgeheadBonds[k].length;jj++) { // for each ring bond of this bridgehead               
                ringbondslist = [];
                for (i=0;i<bridgedringbonds.length;i++) {  // copy ringbonds of bridged rings to ringbondslist
                  ringbondslist[i] = bridgedringbonds[i];
                }
                bhbix = getRingbondIndex(ringbondslist, bridgeheads[k], bridgeheadBonds[k][jj]);
                ringfound=false;
                ringfound=followRing(mar,bar,bhbix, bridgeheads[k], bridgeheadBonds[k][jj],0);
                ringfound=false;
                ringfound=followRing(mar,bar,bhbix, bridgeheads[k], bridgeheadBonds[k][jj],1);
              }   
            }
            // eliminate duplicate rings
            i=numIsolatedRings;
            while (i < rings.length-1) { 
              jj = i+1;
              while (jj < rings.length) { // test all remaining rings above rings[i]
                if (jj > i) { // make sure that rings[i] is never compared to itself
                  if (sameRing(rings[i], rings[jj])) {
                    rings.splice(jj,1); // if identical to rings[i], remove
                    bonds_in_rings.splice(jj,1);
                    jj--; // reexamine because splice shifted all rings above jj down by one
                  }
                }
                jj++;
              }
              i++;
            }
            // decompose larger rings containing all atoms of a smaller ring into two smaller rings
            i=numIsolatedRings; // start with the first non-isolated ring
            while (i < rings.length-1) { 
              jj = i+1;
              while (jj < rings.length) { // test all remaining rings above rings[i]
                if (!(sameRing(rings[i],rings[jj]))) { // make sure that rings[i] is never compared to itself
                  if (rings[i].length > rings[jj].length) { // i larger than jj
                    tr1 = rings[i].slice(0);
                    tr2 = rings[jj].slice(0);
                  } else if (rings[jj].length > rings[i].length) {
                    tr1 = rings[jj].slice(0);
                    tr2 = rings[i].slice(0);
                  } 
                  intersectionV = [];
                  intersectionV = intersect(tr1,tr2);
                  if (sameRing(intersectionV,tr2)) { // smaller ring is fully contained in larger ring (fused, not bridged)
                    tr1bx = [];    
                    for (k=0;k<tr1.length-1;k++) {
                      tr1bx.push(getBondIndex(bar,tr1[k],tr1[k+1]));
                    }
                    tr1bx.push(getBondIndex(bar,tr1[tr1.length-1],tr1[0]));
                    tr2bx = [];    
                    for (k=0;k<tr2.length-1;k++) {
                      tr2bx.push(getBondIndex(bar,tr2[k],tr2[k+1]));
                    }
                    tr2bx.push(getBondIndex(bar,tr2[tr2.length-1],tr2[0]));
                    fubox = 0;
                    for (k=0;k<tr2bx.length;k++) {
                      if (!tr1bx.includes(tr2bx[k])) {
                        fubox = tr2bx[k];
                      }
                    }
                    sbrhx = Math.min(tr1.indexOf(bar[fubox].fra),tr1.indexOf(bar[fubox].toa));
                    ebrhx = Math.max(tr1.indexOf(bar[fubox].fra),tr1.indexOf(bar[fubox].toa));
                    if (!tr2.includes(tr1[sbrhx+1])) {
                      tr3 = tr1.slice(sbrhx,ebrhx-sbrhx+1);
                    } else {
                      tr3 = tr1.slice(ebrhx).concat(tr1.slice(0,sbrhx+1));
                    }
                    newrings.push(tr3);
                    obsoleterings.push(tr1);
                  }
                }
                jj++;
              }
              i++;
            }
            i=0;
            while (i < newrings.length-1) { // eliminate duplicate new rings among the newrings[]
              jj = i+1;
              while (jj < newrings.length) { // test all remaining newrings above newrings[i]
                if (jj > i) { // make sure that newrings[i] is never compared to itself
                  if (sameRing(newrings[i], newrings[jj])) {
                    newrings.splice(jj,1); // if identical to newrings[i], remove
                    jj--; // reexamine because splice shifted all newrings above jj down by one
                  }
                }
                jj++;
              }
              i++;
            }
            i=0;
            while (i < obsoleterings.length-1) { // eliminate duplicate rings among obsoleterings[]
              jj = i+1;
              while (jj < obsoleterings.length) { // test all remaining obsoleterings above obsoleterings[i]
                if (jj > i) { // make sure that obsoleterings[i] is never compared to itself
                  if (sameRing(obsoleterings[i], obsoleterings[jj])) {
                    obsoleterings.splice(jj,1); // if identical to obsoleterings[i], remove
                    jj--; // reexamine because splice shifted all obsoleterings above jj down by one
                  }
                }
                jj++;
              }
              i++;
            }
            for (i=0;i<obsoleterings.length;i++) { // eliminate obsolete rings from rings[]
              for (jj=0;jj<rings.length;jj++) {
                if (sameRing(obsoleterings[i],rings[jj])) {
                  rings.splice(jj,1);
                  jj--;
                }
              }          
            }
            for (k=0;k<newrings.length;k++) {  // add newrings to rings[]
              rings.push(newrings[k]);
            }
            // eliminate false rings
            for (i=0;i<rings.length;i++) {
              if (checkRing(mar,rings[i]) === false) {
                rings.splice(i,1);
                bonds_in_rings.splice(i,1);
                i--;
              }
            }
            // eliminate duplicate rings
            i=0;
            while (i < rings.length-1) { 
              jj = i+1;
              while (jj < rings.length) { // test all remaining rings above rings[i]
                if (jj > i) { // make sure that rings[i] is never compared to itself
                  if (sameRing(rings[i], rings[jj])) {
                    rings.splice(jj,1); // if identical to rings[i], remove
                    bonds_in_rings.splice(jj,1);
                    jj--; // reexamine because splice shifted all rings above jj down by one
                  }
                }
                jj++;
              }
              i++;
            }
            rings.sort((a, b) => a.length - b.length);
            
          } // end of section for bridged rings

          // functions inside findRings()
          
          // followRing        
          function followRing(mar,bar,rbix, fa, ta, flag) {  // works on mar, is called by findRings()
          // parameters:  
          //         rbix: index of starting bond in ringbondslist[] (a copy of ringbonds[])
          //         fa: atom to start with; ta: 2nd atom in ring. Give the direction along which the ring is followed
          //         flag: 0: searches the ringbondslist from first to last element for a fit
          //               1: searches the ringbondslist from last to first element for a fit
          // followRing returns as soon as one ring is closed, even if the ringbondslist is not empty yet.
          // If a ring is closed, it is pushed into the rings[] array and followRings returns true.
          // If no further ring bond fitting the nascent ring is found but the ring is not closed: followRing returns false

            
    
            let stfa=0, stta=0, i=0, k=0, bo=0;
            let fit = -1;
            let closed = false;
            let abort = false;
            let ring = [];
            const bonds_in_ring = [];
    
            ring = [];
            stfa = fa;
            stta = ta;
            ring.push(stfa); // put the starting bond into ring
            ring.push(stta);
            bo = ringbondslist.splice(rbix,1); // remove the starting bond from list
            bonds_in_ring.push(bo); // and record it in bonds_in_ring[].
            k = 0;
            closed = false;
            abort = false;

            while ((! closed) && (! abort) && (ringbondslist.length > 0)) {   // the loop over all ring atoms              
              // look for a ringbond that fits to the last atom in ring[]
              if (flag === 0) { // search for first fit
                i=0;
                fit = -1;
                while  (i < ringbondslist.length) {  // search all remaining ringbonds for a fit to the last atom in ring[]
                  if ((bar[ringbondslist[i]].fra === ring[ring.length-1]) || (bar[ringbondslist[i]].toa === ring[ring.length-1])) { 
                  // one end of bond fits
                    fit = i;
                    break;
                  }
                  i++;
                }
              } else if (flag === 1) { // search for last fit
                i=ringbondslist.length-1;
                fit = -1;
                while (i >= 0) {  // search all remaining ringbonds for a fit to the last atom in ring[]
                  if ((bar[ringbondslist[i]].fra === ring[ring.length-1]) || (bar[ringbondslist[i]].toa === ring[ring.length-1])) { 
                  // one end of bond fits
                    fit = i;
                    break;
                  }
                  i--;
                }        
              }
              if (fit < 0) { // no fit found
                abort = true;
              } else { // a fit was found
                if (bar[ringbondslist[fit]].fra === ring[ring.length-1]) { // fra fits
                  if (! ( ring.includes(bar[ringbondslist[fit]].toa))) {
                    ring.push(bar[ringbondslist[fit]].toa);
                    bo = ringbondslist.splice(fit,1);
                    bonds_in_ring.push(bo);
                  } else if ((bar[ringbondslist[fit]].toa === ring[0]) && (ring.length > 2)) {
                    closed = true;
                    rings.push(ring);
                    bo = ringbondslist.splice(fit,1);
                    bonds_in_ring.push(bo);
                    bonds_in_rings.push(bonds_in_ring);
                  }
                } else { // toa fits
                  if (! ( ring.includes(bar[ringbondslist[fit]].fra))) {
                    ring.push(bar[ringbondslist[fit]].fra);
                    bo = ringbondslist.splice(fit,1);
                    bonds_in_ring.push(bo);
                  } else if ((bar[ringbondslist[fit]].fra === ring[0]) && (ring.length > 2)) {
                    closed = true;
                    rings.push(ring);
                    bo = ringbondslist.splice(fit,1);
                    bonds_in_ring.push(bo);
                    bonds_in_rings.push(bonds_in_ring);
                  }
                }
              } // end if fit
              k++;
              if (k > 20) { return; } // emergency-stop fo runaway while
            } // end while not closed and not aborted
            if (closed) { return true; }
            if (abort) { return false; }
      
          } // auxiliary to findRings
        
          function getRingbondIndex(rba,fa,ta) { // param: rba an array with indices of bonds in b[]. fa= an atom number, ta= another atom number fa and ta
            let i;
      
            for (i=0;i<rba.length;i++) {
      
              if (((b[rba[i]].fra === fa) && (b[rba[i]].toa === ta)) || ((b[rba[i]].fra === ta) && (b[rba[i]].toa === fa))) {
                return i;
              } 
            }
            return -1;
          }
          
    // bridgeheads
          function findBridgeheads(mar,bar) {
            let i, jj, rbp;
      
            bridgeheads = [];
      
            for (i=0;i<ringatoms.length;i++) {
      
              rbp = 0;
              if (mar[ringatoms[i]].bpa.length > 2) { // save time by looking only at centers of degree > 2
                for (jj=0;jj<mar[ringatoms[i]].bpa.length;jj++) {
                  if (isringbond(bar,ringatoms[i], mar[ringatoms[i]].bpa[jj].p)) { 
                    rbp++; 
                  } 
                }
                if (rbp >= 3) { bridgeheads.push(ringatoms[i]); }
              }
            }
          }  // finds all bridgehead atoms. Requires that ringatoms[] is filled beforehand
    
    // isbridgeheadBond
          function isbridgeheadBond(bar,rbix) { // param: index of bond in ringbonds
            let i;
      
            for (i=0;i<bridgeheads.length;i++) {
      
              if ((bar[ringbonds[rbix]].fra === bridgeheads[i]) || (bar[ringbonds[rbix]].toa === bridgeheads[i])) {
                return true;          
              }
            }
            return false;
          }

          function getBridgeheadBonds(bar) {
            let i, k;
            let bhbonds = [];
      
            for (k=0;k<bridgeheads.length;k++) { // for all bridgehead atoms
      
              bhbonds = [];
              for (i=0;i<ringbonds.length;i++) { // collect all ringbonds connected to a given bridgehead
                if (bar[ringbonds[i]].fra === bridgeheads[k]) {
                  bhbonds.push(bar[ringbonds[i]].toa);          
                } else if (bar[ringbonds[i]].toa === bridgeheads[k]) {
                  bhbonds.push(bar[ringbonds[i]].fra);
                }  
              } // end loop over ringbonds
              // store the ring-bp of this bridgehead in array of arrays with the same index as the bridgehead in bridgeheads[]
              bridgeheadBonds[k] = bhbonds.slice(0); 
              
            } // end loop over bridgehead atoms
    
          }
        } // find rings (isolated and bridged)
        // mod:200207-1000

    // find EMFU-Rings
        function findEmfuRings(mar,bar) { // Expects that findRings() has been called beforehand
          // relies on pIsolatedRings[], ringbonds[] and ringatoms[] having been filled 
          // but not on the completeness of the rings[] array for rings in ring systems (fused or bridged)
           
          let i, j, jj, k, ic, dbcount, ringdbcount, ligHasDBcount;
          const r2Atoms = [];
          let r2brghds = [];
          const r2bph = {};
          let lip=[];
          const r2lo={};
          let r2perms=[];
          let binlen=0;
          let bintmpl='';
          let r2permnu=1;
          let pcnt=0;
          let r2brghcp=[];
          let rootn=0;
          let nextR2cycle=[];
          const r2Cycles = [];
      
          // reset all atoms to mar[].ar===false
          for (k=1;k<mar.length;k++) { //BF190821.1
            mar[k].ar = false; //BF190821.1
          } //BF190821.1
          emfuRings = [];
          // delete properties in pseudohashes
          for (key in r2bph) {
            if (r2bph.hasOwnProperty(key)) {
              delete r2bph[key];
            }
          } 
          for (key in r2lo) {
            if (r2lo.hasOwnProperty(key)) {
              delete r2lo[key];
            }
          } 

          // get the subset of r2Atoms (rule 2 compliant atoms in rings systems)
          for (i=0;i<ringatoms.length;i++) { // check all ring atoms for sp2 (rule 2)
            dbcount = 0;
            ringdbcount=0;
            ligHasDBcount=0;
            for (jj=0;jj<mar[ringatoms[i]].bpa.length;jj++) { // loop over all connections
              if (mar[ringatoms[i]].bpa[jj].t ===2) {
                dbcount++;
              }
              if((mar[ringatoms[i]].bpa[jj].t ===2) && (isringbond(bar,ringatoms[i], mar[ringatoms[i]].bpa[jj].p))) {
                ringdbcount++;
              }
              if ((mar[ringatoms[i]].bpa[jj].t !==2) && (hasDB(mar,bar,mar[ringatoms[i]].bpa[jj].p)===1)) {
                ligHasDBcount++;
              } 
            }
            if ((ringdbcount === 1) && (mar[ringatoms[i]].bpa.length <= 3) && (dbcount === 1)) { //rule 2 fulfilled
              r2Atoms.push(ringatoms[i]);
            }
          }
          if (r2Atoms.length < 4) { // only isolated emfu rings, job done
            return;
          }

          // deal with isolated rings (which are always found by find rings) if they contain r2Atoms
          for (i=0;i<isolatedRings.length;i++) { // loop over all isolated rings
            if (alt12r(mar,isolatedRings[i]) && allR2(isolatedRings[i])) {
              emfuRings.push(rings.indexOf(isolatedRings[i]));
              for (jj = 0;jj<isolatedRings[i].length;jj++) {
                mar[isolatedRings[i][jj]].ar = true;
                r2Atoms.splice(r2Atoms.indexOf(isolatedRings[i][jj]),1); // remove from r2Atoms
              }
            } else {
              for (jj = 0;jj<isolatedRings[i].length;jj++) {
                if (r2Atoms.includes(isolatedRings[i][jj])) {
                  r2Atoms.splice(r2Atoms.indexOf(isolatedRings[i][jj]),1); // remove from r2Atoms
                }
              }
            }
          }
          
          // register bridgeheads within r2Atoms: 3 ligands that are all r2Atoms
          r2brghds = [];          
          for (i=0;i<r2Atoms.length;i++) {
            if ((mar[r2Atoms[i]].bpa.length===3) 
                && (r2Atoms.includes(mar[r2Atoms[i]].bpa[0].p)) 
                && (r2Atoms.includes(mar[r2Atoms[i]].bpa[1].p)) 
                && (r2Atoms.includes(mar[r2Atoms[i]].bpa[2].p))) {
                r2brghds.push(r2Atoms[i]);
            }
          }
          
          // deal with fused and bridged rings consisting of r2Atoms
          
          //construct dict with array containing all bonding partners of an r2Atom that are r2Atoms themselves
          //r2bph key=String(atom index in mar) is the connection table for r2Atoms
          
          for (i=0;i<r2Atoms.length;i++) {
          
            for (jj=0;jj<mar[r2Atoms[i]].bpa.length;jj++) {
              if (r2Atoms.includes(mar[r2Atoms[i]].bpa[jj].p)) {  // only BP that are themselves r2Atoms
                if (r2bph[String(r2Atoms[i])] === undefined) {
                  r2bph[String(r2Atoms[i])] = [mar[r2Atoms[i]].bpa[jj].p]; //dict with atom index in mar as key
                } else { 
                  r2bph[String(r2Atoms[i])].push(mar[r2Atoms[i]].bpa[jj].p);
                }
              }
            }
          }

          if (r2brghds.length > 0) {          
            // store outgoing ligand permutation for all r2-bridgeheads with all 3 possible incoming ligs
            // in r2lo[key] (2d array).
            for (i=0;i<r2brghds.length;i++) { // for each r2-bridgehead
              for (j=0; j<3;j++) { // for all of its ligands
                ic=r2bph[String(r2brghds[i])][j]; // set incoming to jth ligand
                key=String(ic)+'-'+String(r2brghds[i]);
                r2lo[key]=[]; // create r2lo[] as array with key String(incoming)-String(r2-bridgehead)
                lip=[];
                for (k=0;k<r2bph[String(r2brghds[i])].length;k++) { // collect the other 2 ligands
                  if (k===j) {continue;}
                  lip.push(r2bph[String(r2brghds[i])][k]);
                }
                r2lo[key].push(lip.slice(0));
                r2lo[key].push(lip.reverse().slice(0));
              }
            }
              
            r2perms=[];
            r2permnu=Math.pow(2,r2brghds.length-1)-1;
            binlen=(r2permnu).toString(2).length;
            bintmpl='';
            for (i=0;i<binlen;i++) {
              bintmpl += '0';
            }
            for (i=0;i<Math.pow(2,r2brghds.length-1);i++) {
              r2perms[i] = binLeadingZero((i).toString(2),binlen);
            }
                    
            for (k=0;k<r2brghds.length;k++) { // for all r2bridgeheads           
                    
            // do dfs searches starting with this r2bridgehead for both permutations at the other ones
              rootn=r2brghds[k];
              r2brghcp = r2brghds.slice(0);
              r2brghcp.splice(r2brghcp.indexOf(rootn),1);

              pcnt=0;
              for (i=0;i<r2bph[String(rootn)].length;i++) { //for all r2 ligands of root node
                for (j=0;j<r2perms.length;j++) { //BF200204.2
                  nextR2cycle = dfsR2c(rootn,r2bph[String(rootn)][i],j); // do dfs
                  pcnt++;
                  if ((checkRing(mar,nextR2cycle)) && (!(isKnownRing(nextR2cycle,r2Cycles)))) {
                    r2Cycles.push(nextR2cycle);
                  }
                }
              }
            }
          } else { // no r2brdghds:  look for the first r2Atom that is not yet set emfu and has a bonding partner in r2Atoms
            rootn=0;
            for (i=0;i<r2Atoms.length;i++) {
              if ((!mar[r2Atoms[i]].ar) && (r2bph[String(r2Atoms[i])] !== undefined) && (r2bph[String(r2Atoms[i])].length > 1)) { //BF200824.1
                rootn=r2Atoms[i];
                break;
              }
            }
            if (rootn!==0) {
              for (k=0;k<r2bph[String(rootn)].length;k++) {
                if ((r2bph[String(r2bph[String(rootn)][k])]!==undefined) && (r2bph[String(r2bph[String(rootn)][k])].length > 1)) {
                  nextR2cycle = dfsR2c(rootn,r2bph[String(rootn)][k],-1); // do dfs //BF200204.4
                  if ((checkRing(mar,nextR2cycle)) && (!(isKnownRing(nextR2cycle,r2Cycles)))) {
                    r2Cycles.push(nextR2cycle);
                    break;        
                  }
                }
              }
            }
          }
//          
          for (i=0;i<r2Cycles.length;i++) {            
            if (alt12r(mar,r2Cycles[i])) {
              for (j=0;j<r2Cycles[i].length;j++) {
                mar[r2Cycles[i][j]].ar=true;
              }            
            }
          }
          
          function isKnownRing(ri,riar) {
            let i=0;
            
            for (i=0;i<riar.length;i++) {
            
              if (sameRing(riar[i],ri)) {
                return true;
              }
            }
          } // test the array of rings riar[][] for presence of ring ri[]
          
          // end main findEmfuRings()
          
          function dfsR2c(root,stnode,pn) {
            // params: root: atom where search starts; stnode: next atom gives direction of search; pn: permutation number
             
            let stack = []; // stack for nodes in DFS
            let node = 0;

            let i = 0;
            let jj = 0;
            let k = 0;
            let pec = -1;
            let known = false;
            let incoming = root;     
            const visnodesR2 = [];
            let r2lig = [];
      
            // initialize
            stack=[];
            node = stnode;

            stack.push(stnode); // put the initial node onto stack for the initial pop
            visnodesR2.push(root); // put the root node into visnodesR2
            k=0;
            while (stack.length > 0) {
      // SECTION A: get next node from stack and examine
              node = stack.pop(); // get the next node from stack
              known =  visnodesR2.includes(node);
              if (!known) { // if not known
                if (visnodesR2.length > 0) { // determine the incoming node
                  for (jj = visnodesR2.length-1; jj >= 0;jj--) { // search visnodes down to first bonding partner of node
                    if (r2bph[String(node)].includes(visnodesR2[jj])) {
                      incoming = visnodesR2[jj];
                      break;
                    }
                  }
                }
                visnodesR2.push(node); // record of all visited nodes
      // SECTION B: put connected nodes on stack
                r2lig=[];
                for (i=0;i<r2bph[String(node)].length;i++) { // for all r2 bonding partners of node
                  if (!(r2bph[String(node)][i]===incoming)) {
                    known = visnodesR2.includes(r2bph[String(node)][i]);
                    if (!known) { // collect only ligands that are neither incoming nor already visited (ring closure)
                      r2lig.push(r2bph[String(node)][i]);
                    } 
                  }
                }
                if (r2lig.length === 2) { // node is r2bridgehead with 2 unvisited ligands: set order on stack according to permutation
                  pec=parseInt(r2perms[pn].charAt(r2brghcp.indexOf(node)),10);
                  if ((r2lo[String(incoming)+'-'+String(node)] !== undefined) && ((pec===0) || (pec===1))) {
                    stack.push(r2lo[String(incoming)+'-'+String(node)][pec][0]);
                  }
                } else if (r2lig.length === 1) { // only one ligand
                  stack.push(r2lig[0]);
                } else { 
                  return visnodesR2.slice(0); // return array
                }
              } // if (!known)
              k++;
              if (k > 200 ) {break; } // safety for infinite loop
            } // end of while
            
          } // directed DFS which searches for rings within r2Atoms from given root and starting towards stnode
          
          function alt12r(mar,ringar) {
            let i=0;
            let k=0;
            let tra = [];
            let mancode='';
            
            if (ringar.length % 2 !== 0) {
              return false;
            }
            tra = ringar.slice(0);
            tra.push(ringar[0]); // append first element again at end
            for (i=0;i<tra.length-1;i++) {
              for (k=0;k<mar[tra[i]].bpa.length;k++) {
                if (mar[tra[i]].bpa[k].p === tra[i+1]) {
                  mancode += (mar[tra[i]].bpa[k].t===2)? '1' : '0';
                }
              }
            }
            if ((/00/.test(mancode)) || (/11/.test(mancode))) {
              return false;
            } else {
              return true;
            }
          } // returns true if an even membered ring consists of alternating single an double bonds
          
          function allR2(ring) {
            let i=0;
            for (i=0;i<ring.length;i++) {
              if (!r2Atoms.includes(ring[i])) {
                return false;
              }
            }
            return true;
          } // test if a ring is made exclusively from r2Atoms
          

        } // identify emfu rings
        //mod:200210-1045
    
        function isRingAtom(at) {
          let i=-1;
      
          for (i=0;i<rings.length;i++) {
      
            if (rings[i].includes(at)) {
              return i;
            }
          }
          return -1;
        }  // returns the index in rings[] of the first ring of which atom at is a member, or -1 otherwise

    // isExocyclicEZ
        function isexocyclicEZ(mar,db1,db2) {
          //params: db1, db2 two atoms of a pezBond
          let i;
          let rdb1 = 0;
          let rdb2 = 0;
          let nrl = 0;
          let nel = 0;
          let rl1 = 0;
          let rl2 = 0;
          let el1 = 0;
          let el2 = 0;
          let exz = 0;
            
          rdb1 = isRingAtom(db1);
          rdb2 = isRingAtom(db2);
      
      
          if ((rdb1 > -1) && (rdb2===-1)) { //db1 is in ring, db2 is not in ring
            nrl = 0;
            for (i=0;i<mar[db1].bpa.length;i++) {
              if (mar[db1].bpa[i].t === 2) {
                continue;
              } else if (isRingAtom(mar[db1].bpa[i].p) === rdb1) {
                if (nrl===0) {
                  rl1 = mar[db1].bpa[i].p;
                } else if (nrl === 1) {
                  rl2 = mar[db1].bpa[i].p;
                }
                nrl++;
              }
            }
            if (nrl === 2) {
              nel=0;
              for (i=0;i<mar[db2].bpa.length;i++) {
                if (mar[db2].bpa[i].t === 2) {
                  continue;
                } else if (nel===0) {
                  el1 = mar[db2].bpa[i].p;
                } else if (nel===1) {
                  el2 = mar[db2].bpa[i].p;
                }
                nel++;
              }
              exz = vecprodDB(rl1, db1, db2, el1);
              exoezh[String(db1)+"-"+String(db2)] = {f: db1, t: db2, fl1: rl1, fl2: rl2, tl1: el1, tl2: el2, r11: exz, rx: [rdb1]};
              if (!(exoDBatR[rdb1].includes((String(db1)+"-"+String(db2))))) {
                exoDBatR[rdb1].push(String(db1)+"-"+String(db2));
              }
              return;
            }      
          } else if ((rdb1===-1) && (rdb2 > -1)) { //db1 is not in ring, db2 is in ring
            nrl = 0;
            for (i=0;i<mar[db2].bpa.length;i++) {
              if (mar[db2].bpa[i].t === 2) {
                continue;
              } else if (isRingAtom(mar[db2].bpa[i].p) === rdb2) {
                if (nrl===0) {
                  rl1 = mar[db2].bpa[i].p;
                } else if (nrl === 1) {
                  rl2 = mar[db2].bpa[i].p;
                }
                nrl++;
              }
            }
            if (nrl === 2) {
              nel=0;
              for (i=0;i<mar[db1].bpa.length;i++) {
                if (mar[db1].bpa[i].t === 2) {
                  continue;
                } else if (nel===0) {
                  el1 = mar[db1].bpa[i].p;
                } else if (nel===1) {
                  el2 = mar[db1].bpa[i].p;
                }
                nel++;
              }
              exz = vecprodDB(rl1, db2, db1, el1);
              exoezh[String(db2)+"-"+String(db1)] = {f: db2, t: db1, fl1: rl1, fl2: rl2, tl1: el1, tl2: el2, r11: exz, rx: [rdb2]};
              if (!(exoDBatR[rdb2].includes((String(db2)+"-"+String(db1))))) {
                exoDBatR[rdb2].push(String(db2)+"-"+String(db1));
              }
              return;
            }      
          } else if (((rdb1 > -1) && (rdb2 > -1)) && (rdb1 !== rdb2)) { // db1=db2 connects two rings
            nrl = 0;
            for (i=0;i<mar[db1].bpa.length;i++) {
              if (mar[db1].bpa[i].t === 2) {
                continue;
              } else if (isRingAtom(mar[db1].bpa[i].p) === rdb1) {
                if (nrl===0) {
                  rl1 = mar[db1].bpa[i].p;
                } else if (nrl === 1) {
                  rl2 = mar[db1].bpa[i].p;
                }
                nrl++;
              }
            }
            if (nrl === 2) {
              nel=0;
              for (i=0;i<mar[db2].bpa.length;i++) {
                if (mar[db2].bpa[i].t === 2) {
                  continue;
                } else if (isRingAtom(mar[db2].bpa[i].p) === rdb2) {
                  if (nel===0) {
                    el1 = mar[db2].bpa[i].p;
                  } else if (nel === 1) {
                    el2 = mar[db2].bpa[i].p;
                  }
                  nel++;
                }
              }
              if (nel === 2) {
                exz = vecprodDB(rl1, db2, db1, el1);
                exoezh[String(db1)+"-"+String(db2)] = {f: db1, t: db2, fl1: rl1, fl2: rl2, tl1: el1, tl2: el2, r11: exz, rx: [rdb1,rdb2]};
                if (!(exoDBatR[rdb2].includes((String(db1)+"-"+String(db2))))) {
                  exoDBatR[rdb2].push(String(db1)+"-"+String(db2));
                }
                if (!(exoDBatR[rdb1].includes((String(db1)+"-"+String(db2))))) {
                  exoDBatR[rdb1].push(String(db1)+"-"+String(db2));
                }
                return;
              }
            }
          }          
          return;
        } // fills the pseudohashes exoezh[] and exoDBarR[]
          
      } // calculate the canonical SMILES of current structure(s)
  // end of getsmiles
  
//END COMMON
//START MV_SVG_DEV PMS
  // SMILES CODE TO STRUCTURE (SMILES PARSING)
      function parse_m_SMILES(msmico) {

        // local use
        let gbr = new Rect(0,0,0,0);
        let i=0;
        let jj=0;
        let j=0;
        let sel = 0;
        let nexH = 0; // counter for explicit H //BF191028.3
        let eshift = 0;
        let onlyH=false;
        const pcrit = 2.0*crit;
        let tree_h_max = 0;
        let tree_rects = [];
        let xratio = 1;
        let yratio = 1;
        let smgr=0;
        let emgr=0;
      
        // variables for SMILES parsing SECTION
        const atInRh={}; // dict for ring atoms. key is the atom index as string,value an array with ring numbers
        let cchains = [];
        let emfuPrings = [];
        const tree_ends = [];
        const heavy_ends = [];
        let matched = []; 
        let m_smico = [];
        let mchain = -1;
        let natofs=0;
        const ncreH = []; // number of created explicit H per molecule  //BF191028.3
        const etbl = {}; // translation map for atom indices  heavy -> incl expl. H  //BF191028.3
        let nmoloffs=0; // offset for molecules to be added by parsing rxnSmiles
        let parserr = ''; //BF191122.1        
        let parwix = -1;
        let parwsmiles = '';
        const path_starts = [];
        const path_ends = [];
        let pats = []; // array of the atom SMILES. Index is atom index in SMILES
        let pb = [new Bond(0,0,0)]; // index 0 contains a dummy bond
        const pbp = [[0]]; // 2D-array of bonding partners
        const pic = []; // array of incoming atom indices
        let pIsolatedRings = [];
        let ploterr='';
        let plpix = -1;
        let plpsmiles = '';
        let pmolgrp = []; // array of Molgrp{} objects
        const prfs = []; // array of the prefixes of atom smiles
        const psfs = []; // array of the suffixes of atom smiles
        let pRingFusions = [];
        let prings = [[0]]; // array storing the atoms in ring, index is ring closure digit as number
        let prxnarro = []; //the array of Rxna{} objects from parsing rxnsmiles
        let prxnix = -1;
        let prxnsmiles = ''; // rxn arrow smiles to parse
        let pscAtoms = []; // array with the atoms that are designated as stereogenic (@ or @@) in the SMILES smico
        let pSpiroRings = [];
        const rclh = {}; // dict storing ringclosure objects. key is the ring closure digit as string
        const pezh = {}; // dict storing EZ double bond objects. key is 'a-b' with a and b the 2 atoms of the double bond
        let rxnaroffs=0; // offset for rxn arrows to be added by parsing rxnSmiles
        const rxn_paths = [];
        let rtchains = [];
        let tchains = [];



        m_smico= [];
      
        if (msmico === '') { return; }
        
        saveState();
        
        // extract the arrow and lone pairs parts (if present) and check for unbalanced delimiters
        matched = msmico.match(/!(.+)!/);
        if (matched !== null) {
          plpsmiles = matched[1];
          plpix = matched.index;
        } else if (msmico.includes('!')) { //BF191123.1
          parserr='unmatched ! (lone pairs section)'; //BF191123.1
        } 
        matched = [];
        matched = msmico.match(/¿(.+)¿/);
        if (matched !== null) {
          parwsmiles = matched[1];
          parwix = matched.index;
        } else if (msmico.includes('¿')) { //BF191123.1
          parserr='unmatched ¿ (curved arrows section)'; //BF191123.1
        }
        matched = [];        
        matched = msmico.match(/§(.+)§/);
        if (matched !== null) {
          prxnsmiles = matched[1];
          prxnix = matched.index;
        } else if (msmico.includes('§')) { //BF191123.1
          parserr='unmatched § (reaction arrows section)'; //BF191123.1
        }
        if (parserr !== '') { //BF191123.1
          alert("Parse-SMILES Error:\n"+parserr+"\nin SMILES: "+msmico); //BF191123.1
          return; //BF191123.1
        } //BF191123.1
        
        if (parwix > -1) { // strip arrow, lone pair, and rxn arrow sections off the end of msmico
          msmico = msmico.substring(0,parwix);
        } else if (plpix > -1) {
          msmico = msmico.substring(0,plpix);
        } else if (prxnix > -1) {
          msmico = msmico.substring(0,prxnix);
        }        

        // check for illegal dot
        if ((/^\./.test(msmico)) || (/\.$/.test(msmico)) || (/\.\./.test(msmico))) { //BF201206
          parserr='illegal dot at start and/or end or multiple dots'; //BF201206
        } //BF201206
        if (parserr !== '') { //BF201206
          alert("Parse-SMILES Error:\n"+parserr+"\nin SMILES: "+msmico); //BF201206
          return; //BF201206
        } //BF201206
        
        m_smico = msmico.split('.');
        tree_rects=[];
        if (m.length > 1) { //ADD mode: pre-existing molecules
          natofs = m.length-1;
          nmol=getAll_t_Trees();
          for (i=1;i<=nmol;i++) { // selector 't' is base 1
            gbr=getboundrect(m,i,'t');
            tree_rects.push(gbr);
            tree_h_max = Math.max(tree_h_max,gbr.h);
          }
          nmoloffs=nmol; // offset for 1st molecule from parsing
          if (rxnarro.length > 0) { // pre-existing rxn arrows
            // determine the preexisting molgroups
            rxnaroffs=0;
            pmolgrp = [];
            get_molgrps(rxnarro); // pmolgrp[] will now contain the pre-existing molgroups (without mol that are not associated to rxn)
            rxnaroffs=rxnarro.length; // offset for rxnarray
          } else {
            rxnaroffs=0;
          }
        } else { // REPLACE MODE no pre-existing molecules
          nmoloffs=0;
          rxnaroffs=0;
        }
        if (prxnsmiles !== '') { // rxn to parse
          parseRxnArrows(prxnsmiles,nmoloffs); // the new rxn arrows will be in prxnarro[] with molnumbers in .stn and .etn incremented by nmoloffs.
        }
        
        // parse the individual SMILES in m_smico[]
        i=0;
        sel=1+nmoloffs; // set selector to next free mol_nr
        while(i < m_smico.length) {
          //check individual SMILES for unbalanced parentesis      
          if (m_smico[i] === '') { break; }
          if (checkPB(m_smico[i])===1) { //BF191122.1
            parserr='unbalanced \(\)'; //BF191122.1
          } else if (checkPB(m_smico[i])=== -1) { //BF191122.1
            parserr='unbalanced \[\]'; //BF191122.1
          } //BF191122.1
          if (parserr !== '') { //BF191122.1
            alert("Parse-SMILES Error:\n"+parserr+"\nin SMILES: "+m_smico[i]); //BF191122.1
            kc = 0;
            document.getElementById('shift').className = "shift";
            document.getElementById('alt').className = "alt";
            return; //BF191122.1
          } //BF191122.1

          parseSMILES(m_smico[i]);
          
          if (ploterr != '') { //BF200103.2
            if (parserr==='') {
              parserr = ploterr;
            } else {
              parserr += '\n'+ploterr;
            }
          }
          
          if (parserr !== '') { //BF191122.1
            alert("Parse-SMILES Error:\n"+parserr+"\nin SMILES: '"+m_smico[i]+"'"); //BF191122.1
            recoverState();
            return; //BF191122.1
          } //BF191122.1
          
          // label substructure
          for (jj=1;jj<m_s.length;jj++) {
            m_s[jj].s = sel;
            m_s[jj].t = sel;
          }
          for (jj=1;jj<b_s.length;jj++) {
            b_s[jj].s = sel;
          }
          // determine the number of explicit H
          nexH = 0; //BF191028.3
          onlyH=false;
          if (m_s[1].an !== 1) { // only for m_s with heavy atoms at the start //BF191101.2
            // excludes trees consisting of only H,H+,H- or H2
            for (jj=1;jj<m_s.length;jj++) { //BF191028.3
              if (m_s[jj].an === 1) { //BF191028.3
                nexH++; //BF191028.3
              } //BF191028.3
            } //BF191028.3
          } else {
            onlyH=true;
            jj=1;
            while (jj < m_s.length) {
              if (m_s[jj].an !== 1) {
                onlyH=false;
              }
              jj++;
            }
          }
          ncreH.push(nexH); //BF191028.3

          // ADD TREE to m[] and b[]
          addTree(m_s,b_s,m,b,sel,0,0); // addTree selects based on mar[].s
          tree_ends.push(m.length-1); // tree_ends is base 0

          // determine the last non expl. H atom
          if (!onlyH) {
            jj=m.length-1;
            while ((jj > 0) && (m[jj].an === 1)) { //BF191028.3
              jj--;
            } //BF191028.3
            heavy_ends.push(jj);
          } else {
            heavy_ends.push(m.length-1);
          }

          // center the tree on canvas
          gbr = getboundrect(m,sel,'s');
          tree_h_max = Math.max(tree_h_max,gbr.h);
          shiftTree(m,(arect.l+arect.w/2)-(gbr.l + gbr.w/2),(arect.t+arect.h/2)-(gbr.t + gbr.h/2),sel);
          gbr.l=0;
          gbr.t=0;
          tree_rects.push(gbr);
          sel++;
          i++;
        } // end while over all molecules to be parsed
                
        nmol = sel-1; // the new total number of molecules
        
        //construct translation table for heavy atom indices to new index after creation of explicit H
        eshift = 0; //BF191028.3
        i=0; //BF191028.3
        j=1; //BF191028.3
        jj=1;
        while (i < nmol) { //loop over all molecules  //BF191028.3
          while (jj <= heavy_ends[i]) { //BF191028.3
            etbl[j] = j + eshift;  //BF191028.3
            j++;  //BF191028.3
            jj++;
          } //BF191028.3
          eshift += ncreH[i]; //BF191028.3
          if (i < nmol-1) {
            jj = tree_ends[i]+1;
          }
          i++; //BF191028.3
        }            
//        
        if (prxnarro.length > 0) {
          get_molgrps(prxnarro); // this appends the molgroups of the newly filled prxnarro[] to pmolgrp[]
                                // (without newly parsed mol that are not associated to rxn)
          //  will the newly generated molgroups have wrong rxnarro numbers in their .mf[].rx and .mt[].rx properties? test
          i=0;
          while (i < prxnarro.length) {
            deep_copyRxnArrow(prxnarro,rxnarro,i,i+rxnaroffs);
            i++;
          }
          // rxnarro[] now contains all reaction arrows (pre-existing and newly parsed)
        }
        // collect all molecules that are not associated with an arrow (pre-existing and newly parsed)
        // and append them to the molgroups that are associated with rxn
        i=1;
        while (i <= nmol) { // mols are base 1
          if (ixinmolgr_from_molnr(i,pmolgrp) < 0) {
            pmolgrp.push(new Molgrp([i])); // pmolgrp[] is base 0
          }
          i++;
        }
        if (rxnarro.length > 0) { // rxn arrows present
          // now determine the rxn network for all rxnarro[] and molgroups.
          get_molgr_net(pmolgrp);
          centerMolgrps(3*crit); //does not change rxnarro or prxnarro
          layout_rxn();
          for (i=0;i<rxnarro.length;i++) {
            for (j=0;j<pmolgrp.length;j++) {
              if (sameArrayElements(pmolgrp[j].mols,rxnarro[i].stn)) {
                smgr=j;
              }
              if (sameArrayElements(pmolgrp[j].mols,rxnarro[i].etn)) {
                emgr=j;
              }
            }
            rxnco=[];
            calcNewRxnArwCoord(rxnarro[i].stn,rxnarro[i].etn,molgrp_brects[smgr],molgrp_brects[emgr]);
            rxnarro[i].sco.x = rxnco[0];
            rxnarro[i].sco.y = rxnco[1];
            rxnarro[i].eco.x = rxnco[2];
            rxnarro[i].eco.y = rxnco[3];
          }         
        } // end if (rxnarro.length > 0)
        
        if (plpsmiles !== '') {
          parseLonePairs(plpsmiles,natofs);
        }
        if (rxnarro.length===0) { // without reactions, use tiling of mols
          tile_trees();
        }
        if (parwsmiles !== '') {
          parseArrows(parwsmiles,natofs);
        }      
        
        center_scale_all(); // center molecules on canvas and scale if too large

        if (warnAtoms.length > 0) { // SMILES parsing produced warnAtoms
          elidup(warnAtoms);
          drawMol(ctx,0,true);  
          for (i=0;i<warnAtoms.length;i++) {
            drawAtomWarning(igctx,m,warnAtoms[i]);
          }
          alert("WARNING:\nParsing of SMILES failed at one or more \nambiguous or inconsistent stereogenic centres!\n\nStereo up/down bonds at centers marked by red squares were replaced by normal single bonds.\n\nThe red squares disappear with the next drawing action");
          warnAtoms=[];
          m_smico=[];
          kc = 0;
          document.getElementById('shift').className = "shift";
          document.getElementById('alt').className = "alt";
          return;
        }
        // check the new molecule against the entered SMILE-code
        getsmiles(); // smiles may contain preexisting molecules, arrows and lone pairs, msmico is vanilla SMILES
        smiles = smiles.trim();
        msmico = msmico.trim();
        if (smiles.includes(msmico)) { // msmico is contained in smiles: parser worked ok.
          // draw the molecule
          drawMol(ctx,0,true);
          kc = 0;
          document.getElementById('shift').className = "shift";
          document.getElementById('alt').className = "alt";
          saveState();
          resetDV();
          m_smico=[];
        } else if (warnAtoms.length > 0) {
          elidup(warnAtoms);
          drawMol(ctx,0,true);
          for (i=0;i<warnAtoms.length;i++) {
            drawAtomWarning(igctx,m,warnAtoms[i]);
          }
//           console.log("parse_m_smiles failed.\n"+msmico+"\nnot contained in result of getsmiles:\n"+smiles);
          alert("WARNING:\nParsing of SMILES produced one or more \nambiguous or inconsistent stereogenic centres!\n\nCheck the stereo-drawing of the centers marked by red squares.\n\nThe red squares disappear with the next drawing action");
          kc = 0;
          document.getElementById('shift').className = "shift";
          document.getElementById('alt').className = "alt";
          warnAtoms=[];
          m_smico=[];
        } else {
          drawMol(ctx,0,true);
          kc = 0;
          document.getElementById('shift').className = "shift";
          document.getElementById('alt').className = "alt";          
          alert("Parsing failed!\nentered SMILES:\n"+msmico+"\n"+smiles+"\nSMILES of parsed structure"); 
//           console.log("Parsing failed!\nentered SMILES:\n"+msmico+"\n"+smiles+"\nSMILES of parsed structure"); 
          saveState();
          resetDV();
          m_smico=[];
        }  
        kc = 0;
        document.getElementById('shift').className = "shift";
        document.getElementById('alt').className = "alt";

  // END of parse_m_SMILES() main section
  
//END MV_SVG_DEV PMS
//START PMS
  
  // Functions inside parse_m_SMILES  
      
        function tile_trees() {
          let hpos=0;
          let i=0;
          let lpos=0;
          let nt=0;
          let rpos = 0;
          let tdx = []; // x-shift of tree_rect from center 
          let tdy = []; // y-shift of tree_rect from center
//
          tree_h_max=0;
          tree_rects=[];
          nt=getAll_s_Trees();          
          for (i=1; i<=nt;i++) {
            gb=getboundrect(m,i,'s');
            shiftTree(m,arect.l-gb.l,arect.t-gb.t,i);
            gb=getboundrect(m,i,'s');
            tree_rects.push(gb);
          }        
          lpos = arect.l+10;
          hpos = arect.t+10;
          tdx=[];
          tdy=[];
          tree_h_max=0;
          for (i=0;i<nt;i++) {
            if (lpos > (arect.l+arect.w-10-tree_rects[i].w)) { // trigger line feed
              lpos = arect.l+10; // reset left position to margin
              hpos += (10+tree_h_max);
              tree_h_max=0;
            }
            tree_h_max = Math.max(tree_h_max,tree_rects[i].h);
            rpos = lpos+tree_rects[i].w;
            tdx.push(lpos-tree_rects[i].l); // register the x-shift for this tree
            tdy.push(hpos-tree_rects[i].t);
            lpos = rpos+10; // left edge of next tree
          }
          for (i=0;i<tree_rects.length;i++) {
            shiftMol(m,tdx[i],tdy[i],i+1);
            tree_rects[i].l += tdx[i];
            tree_rects[i].t += tdy[i];
          }        
        } // distribute trees (substructures) evenly over canvas
        
        function get_molgrps(rxna) {
          //param: rxna: array of Rxna{} objects (the reaction arrows to use), pmolgrp: array of Molgr{} objects to create.
          let i=0;
          let j=0;
          let k=0;
          const stnar = []; //2D array
          const etnar = []; //2D array
          let mergar = [];
          let merge = false;
          let frmgr=-1;
          let tomgr=-1;

          // merge etn-stn mol group pairs with common mols
          for (i=0;i<rxna.length;i++) {
            for (j=0;j<rxna.length;j++) {
              if ((i===j) || (sameArrayElements(rxna[i].stn,rxna[j].etn))) { continue; }
              merge = false;
              for (k=0;k<rxna[j].etn.length;k++) {
                if (rxna[i].stn.includes(rxna[j].etn[k])) {
                  merge = true;
                }
              }
              if (merge) {
                mergar = [];
                mergar = merge_array(rxna[j].etn,rxna[i].stn);
                rxna[j].etn = mergar.slice(0);
                rxna[i].stn = mergar.slice(0);
              }
            }
          }
              
          // collect the mol groups 
          i=0;
          while (i < rxna.length) {
            if (!(isarinar(rxna[i].stn,stnar))) {
              stnar.push(rxna[i].stn);
            }
            if (!(isarinar(rxna[i].etn,etnar))) {
              etnar.push(rxna[i].etn);
            }
            i++;
          }
            
          
          i=0;
          while (i < stnar.length) {
            pmolgrp.push(new Molgrp(stnar[i]));
            i++;
          }
          i=0;
          while (i < etnar.length) {
            if (!(isarinar(etnar[i], stnar))) { // not in both end and start 2D arrays
              pmolgrp.push(new Molgrp(etnar[i]));
            } 
            i++;
          }
          // deduce the .mf and .mt properties of each mol group in pmolgrp[]
          i=0;
          while (i < rxna.length) {
            frmgr = ixinmolgr_from_mols(rxna[i].etn,pmolgrp);
            tomgr = ixinmolgr_from_mols(rxna[i].stn,pmolgrp);
            if ((frmgr > -1) && (tomgr > -1)) {
              pmolgrp[frmgr].mf.push(new Rtm(tomgr,i+rxnaroffs));
              pmolgrp[tomgr].mt.push(new Rtm(frmgr,i+rxnaroffs));
            }
            i++;
          }
          // determine molgrps at start and end of reaction paths
          i=0;
          while (i < pmolgrp.length) {
            if ((pmolgrp[i].mf.length === 0) && (!path_starts.includes(i))) {
              path_starts.push(i);
            }
            if ((pmolgrp[i].mt.length === 0) && (!path_ends.includes(i))) {
              path_ends.push(i);
            }
            i++;
          }
        }
          
        function centerMolgrps(pd) { // depends only on pmolgrp[] 
          let k=0;
          let jj=0;
          let hpos=0;
          let mol=0;
          let mols = [];
          let treeNrs = [];
          let hmax =0;
          let cpos=0;
          const cx=drect.l+drect.w/2;
          const cy=drect.t+drect.h/2;
          let mgrRect = new Rect(0,0,0,0);
          let molRect = new Rect(0,0,0,0);
          
          // center all molecules at center of drect.
          nmol = getAll_t_Trees(); // sets m[].t property of atoms to tree number (base 1)
          tree_rects = [];
          for (jj=1;jj<=nmol;jj++){
            molRect=getboundrect(m,jj,'t');            
            shiftMol(m,cx-(molRect.l+molRect.w/2),cy-(molRect.t+molRect.h/2),jj);
            molRect=getboundrect(m,jj,'t');            
            tree_rects.push(molRect); //tree_rects will be base 0.
          }
          molgrp_brects=[];
          k=0;
          while (k < pmolgrp.length) {
            mols = pmolgrp[k].mols.slice(0);
            hpos=drect.l;
            treeNrs=[];
            for (jj=0;jj<mols.length;jj++) {
              treeNrs.push(mols[jj]);
            }
            hmax = 0;
            for (jj=0;jj<mols.length;jj++) {
              mol = mols[jj];
              cpos = hpos + tree_rects[mol-1].w/2;
              shiftMol(m,cpos-cx,0,mol);
              hpos += tree_rects[mol-1].w+pd;
              hmax = Math.max(hmax,tree_rects[mol-1].h);
              tree_rects[mol-1] = getboundrect(m,mol,'t');
            }
            if (hpos+pd > drect.l+drect.w) {
              hpos = drect.l;
            }
            for (jj=1;jj<m.length;jj++) {
              m[jj].s = -1;
            }
            
            selMultiTrees(treeNrs,k+100);
            mgrRect = getboundrect(m,k+100,'s');
            molgrp_brects.push(mgrRect);
            k++;
          } // end loop over pmolgrp
        } // arranges molecules in a Molgrp horizontally with padding of pd
        
        function get_molgr_net(mg) {
          let i = 0;
          for (i=0;i<path_starts.length;i++) { // loop over all path starts (index of Molgrp in pmolgrp[] for mol groups at start of a path)
            rxn_paths.push({st: path_starts[i], path: pathBFS(mg,path_starts[i],i)});
          }
        } // fills the rxn_paths[] array of objects
        
        function pathBFS(mg,st,pn) {
          let i=0;
          const queue = [];
          const generation = {};
          let node = 0;
          let child = 0;
          let gencount = 0;
          const visited = [];

          queue.push(st);
          visited.push(st);
          generation[String(st)]=0;
          while (queue.length > 0) {
            node = queue.shift();
            for (i=0;i<mg[node].mt.length;i++) {
              child = mg[node].mt[i].mgr;
              if (!visited.includes(child)) {
                visited.push(child);
                generation[String(child)]=generation[String(node)]+1;
                queue.push(child);
              }
            }
          }
          for (i=0;i<visited.length;i++) {
            mg[visited[i]].path=pn;
            mg[visited[i]].gen = generation[String(visited[i])];
            if ((i > 0) && (mg[visited[i]].gen === mg[visited[i-1]].gen)) {
              gencount++;
            } else {
              gencount = 1;
            }
            mg[visited[i]].nr = gencount;
          }
          return visited.slice(0);
        }
        
        function layout_rxn() {
          let branched = false;
          let rxnardir = 1;
          let gen=0;
          let i=0;
          let j=0;
          let mgx=0;
          let mgr=0;
          let rp=0;
          let maxh=0;
          let rowmaxh=0;
          let rowmaxv=0;
          let hpos=0; //hpos is the left of the individual molgrp_brects
          let lastw=0;
          let maxy=arect.l; // keeps record of the highest y-coord for all molgroups plotted so far
          let vpos=0; // vpos is the top of the individual molgrp_brects
          let vrowpos=arect.t; //vrowpos is the central y-coord of the reaction path
          let pathhmax=0; //the predetermined max. height of members of this reaction path
          let cx=0; //the center x of a bounding rect after centerMolgrps()
          let cy=0; //the center y of a bounding rect after centerMolgrps()
          let ncx=0; //the new center x of a bounding rect
          let ncy=0; //the new center y of a bounding rect
          let mgrmax = 0;
          const plottedmgr = [];
          
          const minal=18*crit; // length of rxn arrow
          
          
          for (rp=0;rp<rxn_paths.length;rp++) { // test for branched paths
          
          
            mgx=0;
            branched=false;
            while (mgx < rxn_paths[rp].path.length) { // for all reaction paths
              mgr=rxn_paths[rp].path[mgx];
              if (pmolgrp[mgr].nr > 1) {
                branched = true;
              }
              mgx++;
            }
          
          }
          for (rp=0;rp<rxn_paths.length;rp++) { 
            pathhmax=0;
            mgx=0;
            while (mgx < rxn_paths[rp].path.length) { // determine the height of highest molgrp in the reaction path
              mgr=rxn_paths[rp].path[mgx];
              pathhmax = Math.max(pathhmax,molgrp_brects[mgr].h);
              mgx++;
            }
            hpos=arect.l; // start path at arect.l
            vrowpos = maxy+3*crit+pathhmax/2; // central y-coord of the reaction path is current maxy plus half height of the highest member
            lastw=0;
            gen=0;
            rowmaxh=0;
            rowmaxv=vrowpos;
            mgx=0;
            while (mgx < rxn_paths[rp].path.length) { // follow a path: loop over all molgrps in the path
              mgr=rxn_paths[rp].path[mgx];
              mgrmax = Math.max(mgrmax,mgr); // rememeber the highest molgrp index dealt with
              cx=molgrp_brects[mgr].l+molgrp_brects[mgr].w/2; // the current x-coordinate of the center of the molgrp
              cy=molgrp_brects[mgr].t+molgrp_brects[mgr].h/2; // the current y-coordinate of the center of the molgrp
              maxh = Math.max(maxh,molgrp_brects[mgr].h);
              rowmaxh = Math.max(rowmaxh,maxh);
              vpos = vrowpos - molgrp_brects[mgr].h/2; // new individual top of the molgrp_brect
              rowmaxv = vrowpos;
              if (pmolgrp[mgr].gen !== gen) { // new generation, add arrow and shift horizontally
                gen++;
                hpos += rxnardir*(lastw+minal);
                maxh = 0;
                if ((branched===false) && (rxnardir===1) && (hpos > arect.l+arect.w)) { //unbranched rxn reaches beyond right edge of arect 
                  for (i=0;i<plottedmgr.length;i++) { // determine the lower edge of the lowest (highest y) molgrp_brect plotted so far
                    if ((molgrp_brects[plottedmgr[i]].t+molgrp_brects[plottedmgr[i]].h) > maxy) {
                      maxy = molgrp_brects[plottedmgr[i]].t+molgrp_brects[plottedmgr[i]].h;
                    }
                  }
                  hpos -= rxnardir*(lastw+minal);
                  hpos += rxnardir*(lastw/2-molgrp_brects[mgr].w/2);
                  vrowpos = maxy + minal+ 3*crit;
                  vpos = vrowpos - molgrp_brects[mgr].h/2; // new individual top of the molgrp_brect
                  rowmaxh=0;
                  rxnardir=0;
                } else if ((branched===false) && (rxnardir===0)) {
                  rxnardir= (Math.abs(arect.l+arect.w-hpos)< Math.abs(arect.l-hpos))? -1 : 1;
                  hpos += rxnardir*(lastw+minal);
                } else if ((branched===false) && (rxnardir===-1) && (hpos < arect.l)) {
                  for (i=0;i<plottedmgr.length;i++) { // determine the lower edge of the lowest (highest y) molgrp_brect plotted so far
                    if ((molgrp_brects[plottedmgr[i]].t+molgrp_brects[plottedmgr[i]].h) > maxy) {
                      maxy = molgrp_brects[plottedmgr[i]].t+molgrp_brects[plottedmgr[i]].h;
                    }
                  }
                  hpos -= rxnardir*(lastw+minal);
                  hpos -= rxnardir*(lastw/2-molgrp_brects[mgr].w/2);
                  vrowpos = maxy + minal+ 3*crit;
                  vpos = vrowpos - molgrp_brects[mgr].h/2; // new individual top of the molgrp_brect
                  rowmaxh=0;
                  rxnardir=0;
                } 
              } else if (pmolgrp[mgr].nr > 1) { // several mol in same generation: arrows split
                for (i=1;i<pmolgrp[mgr].nr;i++) {
                  vpos += molgrp_brects[mgr-i].h+3*crit; // staple molgrps of same generation below each other
                }
              }
              ncx = hpos + molgrp_brects[mgr].w/2; // calculate the new x-coordinate of the center of the molgrp
              ncy = vpos + molgrp_brects[mgr].h/2; // calculate the new y-coordinate of the center of the molgrp
              for (j=0;j<pmolgrp[mgr].mols.length;j++) { // shift all molecules in the group accordingly
                shiftMol(m, ncx-cx,ncy-cy,pmolgrp[mgr].mols[j]);                
              }
              molgrp_brects[mgr].l = hpos;  // shift the molgrp_brect in x
              molgrp_brects[mgr].t = vpos;  // shift the molgrp_brect in y
              plottedmgr.push(mgr); // remember the molgrp as plotted
              rowmaxv = Math.max(rowmaxv, vpos + molgrp_brects[mgr].h);
              lastw = molgrp_brects[mgr].w;            
              rowmaxh=0;
              mgx++;          
            } // end over molgrps of path
            for (i=0;i<plottedmgr.length;i++) { // determine the lower edge of the lowest (highest y) molgrp_brect plotted so far
              if ((molgrp_brects[plottedmgr[i]].t+molgrp_brects[plottedmgr[i]].h) > maxy) {
                maxy = molgrp_brects[plottedmgr[i]].t+molgrp_brects[plottedmgr[i]].h;
              }
            }
            vrowpos = Math.max(vrowpos, maxy + 3*crit);
            rowmaxh=0;
          } // end loop over all reaction paths
          if (pmolgrp.length > mgrmax) { // plot molgroups not involved in rxn
            hpos = arect.l;
            vpos = maxy+3*crit;
            rowmaxh = 0;
            for (i=mgrmax+1;i<pmolgrp.length;i++) {
              for (j=0;j<pmolgrp[i].mols.length;j++) {
                shiftMol(m,hpos-molgrp_brects[i].l,vpos-molgrp_brects[i].t,pmolgrp[i].mols[j]);
                rowmaxh = Math.max(rowmaxh,molgrp_brects[i].h);
                molgrp_brects[i].l = hpos;
                molgrp_brects[i].t = vpos;
                hpos += molgrp_brects[i].w+3*crit;
                if (hpos > arect.l+arect.w) {
                  hpos=arect.l;
                  vpos += rowmaxh+3*crit;
                  rowmaxh = 0;
                }
              }
            }
          }
          // now deal with all molecules that are not part of a rxn path and form their own molgrp
        }
                          
        function elidup(arr) {
          let i=0;
          let jj=0;
        
          for (i=0;i<arr.length;++i) {
        
            for (jj=i+1;jj<arr.length;++jj) {
              if(arr[i] === arr[jj]) {
                arr.splice(jj--, 1);
              }
            }
          }
          return arr;
        } // eliminates duplicate elements in array arr
        
        function parseLonePairs(lps,ofs) {
          let i=0;
          let lpar = [];
          let lp = [];

          lpar = lps.split(';');
          for (i=0;i<lpar.length;i++) {
            lp=[];
            lp = lpar[i].split(':');
            m[etbl[parseInt(lp[0],10)]+ofs].nlp = parseInt(lp[1],10);
          }
        }
        
        function parseArrows(arwsm,ofs) {
          let i=0;
          let jj=0;
                    
          let aixp = [];
          let aix1 = 0;
          let aix2 = 0;
          let arwar = [];
          let arw = [];
          let atH = 0;
          let bix = 0;
          let hasExplH = 0;
          let Hdir = 0;
          let st = 0;
          let en = 0;
          let ty = '';
          let crv = 1;
          let arwo = {};
          let nm = 0;
          let arwsc = new Coord(0,0);
          let arwec = new Coord(0,0);
          let arwsT = new Coord(0,0);
          let arweT = new Coord(0,0);
          let arwsTree = 0;
          let arweTree = 0;
          let arwsDir = 0;
          let arweDir = 0;
          let arwimsleft = true;
                    
          arwar = arwsm.split(';');
          for (i=0;i<arwar.length;i++) {
            arw = arwar[i].split(':');
            if (arw.length === 4) {
              if (/\d-\d/.test(arw[0])) { // bond
                aixp = [];
                aixp = arw[0].split('-');
                aix1 = etbl[parseInt(aixp[0],10)]+ofs;
                aix2 = etbl[parseInt(aixp[1],10)]+ofs;
                bix = getBondIndex(b,aix1,aix2);
                if (bix > 0) {
                  st = (-1)*bix;
                }
              } else if (Number(arw[0])) { // atom
                if (Number.isInteger(Number(arw[0]))) {
                  st = etbl[parseInt(arw[0],10)]+ofs;
                } else { // explicit H                
                  st = Number(arw[0]);
                  if (st < 0) { // bond to H is arrow start
                    atH = etbl[Math.floor((-1)*st)]+ofs;
                    hasExplH = 0;
                    for (jj=0;jj<m[atH].bpa.length;jj++) {
                      if ((m[atH].bpa[jj].t === 1) && (m[m[atH].bpa[jj].p].an===1)) {
                        hasExplH = m[atH].bpa[jj].p;
                        break;
                      }
                    }
                    if (hasExplH === 0) {
                      sort_abop_by_dir(m,atH);
                      if (m[atH].bpa.length === 1) {
                        Hdir = norma(getdiranglefromAt(m,m[atH].bpa[0].p,atH) + 60)
                      } else {
                        Hdir = getPrefBisect(m,atH);
                      } 
                      createExplicitH(m,b,atH,Hdir,1);
                      bix = getBondIndex(b,atH,m.length-1);
                      st = (-1)*bix;
                    } else {
                      st = hasExplH;
                    }
                  }
                }
              } 
              if (/\d-\d/.test(arw[1])) { // bond
                aixp = [];
                aixp = arw[1].split('-');
                aix1 = etbl[parseInt(aixp[0],10)]+ofs; //BF191028.3
                aix2 = etbl[parseInt(aixp[1],10)]+ofs; //BF191028.3
                bix = getBondIndex(b,aix1,aix2);
                if (bix > 0) {
                  en = (-1)*bix;
                }
              } else if (Number(arw[1])) { // atom
                if (Number.isInteger(Number(arw[1]))) {
                  en = etbl[parseInt(arw[1],10)]+ofs;
                } else {
                  en = Number(arw[1]);
                  if (en > 0) { // end of arrow at explH
                    atH = etbl[Math.floor(en)]+ofs;
                    hasExplH = 0;
                    for (jj=0;jj<m[atH].bpa.length;jj++) {
                      if ((m[atH].bpa[jj].t === 1) && (m[m[atH].bpa[jj].p].an===1)) {
                        hasExplH = m[atH].bpa[jj].p;
                        break;
                      }
                    }
                    if (hasExplH === 0) {
                      sort_abop_by_dir(m,atH);
                      if (m[atH].bpa.length === 1) {
                        Hdir = norma(getdiranglefromAt(m,m[atH].bpa[0].p,atH) + 60)
                      } else {
                        Hdir = getPrefBisect(m,atH);
                      } 
                      createExplicitH(m,b,atH,Hdir,1);
                      en = m.length-1;
                    } else {
                      en = hasExplH;
                    }
                  }
                }
              }
              ty = arw[2];
              if (arw[3]==='l') {
                crv = 1;
              } else if (arw[3]==='r') {
                crv = -1;
              }
              arwo = new Arrow(st,en,ty,crv);
              arro.push(arwo);
            }                        
          }
          // look for intermolecular curved arrows
          nm = get_mol_brects(); //labels trees (m[].t) and fills mol_brects[].
          for (i=0; i<arro.length;i++) {
            st=arro[i].st;
            en=arro[i].en;
            if (st < 0) {
              st = b[(-1)*st].fra;
            } 
            if (en < 0) {
              en = b[(-1)*en].fra;
            }
            if (m[st].t !== m[en].t) { // intermolecular arrow
              // coordinates of mol_brect centers
              arwsTree=m[st].t;
              arweTree=m[en].t;
              arwimsleft = (mol_brects[arwsTree].l < mol_brects[arweTree].l)? true : false;
              if (!arwimsleft) { // swap left/right mol
                translate2D(m,arwsTree,(-1)*(mol_brects[arweTree].w+pdx),0,false);
                translate2D(m,arweTree,mol_brects[arwsTree].w+pdx,0,false);
                nm = get_mol_brects();
                arwimsleft = true;
              }
              arwsT.x = mol_brects[arwsTree].l + (mol_brects[arwsTree].w)/2
              arwsT.y = mol_brects[arwsTree].t + (mol_brects[arwsTree].h)/2
              arweT.x = mol_brects[arweTree].l + (mol_brects[arweTree].w)/2
              arweT.y = mol_brects[arweTree].t + (mol_brects[arweTree].h)/2
              // coordinates of arrow start and end
              arwsc = getArrowCoord(i,'st');
              arwec = getArrowCoord(i,'en');
              // direction of vectors from center to arrow start/end
              arwsDir = getdirangle(arwsT.x,arwsT.y,arwsc.x,arwsc.y);
              arweDir = getdirangle(arweT.x,arweT.y,arwec.x,arwec.y);
              clearSelection();
              for (jj=0;jj < m.length;jj++) { // t->s for all atoms
                  m[jj].s=m[jj].t;
              }
              switch (true) { 
                case ((arwimsleft) && (arwsDir >= 315) && (arwsDir < 45)): // right side of mol
                  
                  break;
                case ((arwimsleft) && (arwsDir >= 45) && (arwsDir < 135)): // top side of mol: rot CW 90°
                  rot2D(m,arwsTree,arwsT.x,arwsT.y,90,false);
                  break;
                case ((arwimsleft) && (arwsDir >= 135) && (arwsDir < 225)): // left side of mol
                  rotTree180(m,b,'x',arwsTree);
                  break;
                case ((arwimsleft) && (arwsDir >= 225) && (arwsDir < 315)): // bottom side of mol
                  console.log("bottom: rotate tree "+arwsTree+" by 90°"); 
                  rot2D(m,arwsTree,arwsT.x,arwsT.y,-90,false);
                  nm = get_mol_brects();
                  arwsc = getArrowCoord(i,'st');
                  arwec = getArrowCoord(i,'en');
                  console.log("translate arweTree="+arweTree+" arwsc.y="+f1(arwsc.y)+" arwec.y="+f1(arwec.y));
                  translate2D(m,arweTree,mol_brects[arwsTree].l+mol_brects[arwsTree].w-mol_brects[arweTree].l,(arwsc.y-arwec.y),false); 
                  arwsc = getArrowCoord(i,'st');
                  arwec = getArrowCoord(i,'en');
                  console.log("after translation arweTree="+arweTree+" arwsc.y="+f1(arwsc.y)+" arwec.y="+f1(arwec.y));
                  break;
              }
               
              console.log("arro["+i+"] is intermolecular\nst:"+st+" arwsTree="+arwsTree+" en:"+en+" arweTree="+arweTree
              +"\narwsDir="+f1(arwsDir)+" arweDir="+f1(arweDir)+" arwimsleft="+arwimsleft);
            }
          }
        }
        
        function parseRxnArrows(rxnsm,nmof) {
          let i=0;
          let jj=0;
          let rxnarw = [];
          let rxnp = [];
          let ptn = [];
          let stn = [];
          let etn = [];
          let ty = 0;
          let atxt = '';
          let btxt = '';
          
          prxnarro = [];
          rxnarw=rxnsm.split(';'); // extraxt individual rxn arrows
          i=0;
          while (i < rxnarw.length) { // for all rxnarrows
            rxnp = [];
            stn = [];
            etn = [];
            ty = 0;
            atxt = '';
            btxt = '';
            rxnp = rxnarw[i].split(':'); // extraxt the 3 properties stn, etn and type
            ptn = rxnp[0].split(','); // copy members of the stn part to pRxna.stn
            jj=0;
            while (jj<ptn.length) {
              stn.push(parseInt(ptn[jj],10)+nmof);
              jj++;
            }
            ptn = rxnp[1].split(','); // copy members of the etn part to pRxna.etn
            jj=0;
            while (jj<ptn.length) {
              etn.push(parseInt(ptn[jj],10)+nmof);
              jj++;
            }
            ty = parseInt(rxnp[2],10); // copy type part to pRxna.ty
            atxt = (rxnp[3] !== undefined)? rxnp[3] : '';
            btxt = (rxnp[4] !== undefined)? rxnp[4] : '';
            prxnarro.push(new Rxna(stn,etn,ty,atxt,btxt,0,0,0,0));          
            i++;
          }
        }  // transforms the rxnSmiles into the prxnarro[] array of Rxna{} objects
        
        function ixinmolgr_from_molnr(mol,pmolgrp) {
          //params: mol: a molecule Nr (tree Nr), pmolgrp[] an array of Molgrp{} objects
          let i=0;
          while (i < pmolgrp.length) {
            if (pmolgrp[i].mols.includes(mol)) {
              return i;
            }
            i++;
          }
          return -1;
        } // returns the index in pmolgrp if mol is member of a Molgrp's .mols property, -1 otherwise.

        function ixinmolgr_from_mols(mols,pmolgrp) {
          //params: mol: a molecule Nr (tree Nr), pmolgrp[] an array of Molgrp{} objects
          let i=0;
          while (i < pmolgrp.length) {
            if (sameArrayElements(mols,pmolgrp[i].mols)) {
              return i;
            }
            i++;
          }
          return -1;
        } // returns the index in pmolgrp if mol is member of a Molgrp's .mols property, -1 otherwise.
               
        function createExplicitH(mar,bar,ca,eHdir,bty) {
          //param: ca: index of atom to bear H; eHdir: direction in deg (0-360); bty: bond type (1-5)
          let ehx=0;
          let ehy=0;
      
          ehx = mar[ca].x + bondlength*Math.cos(Math.PI*eHdir/180);
          ehy = mar[ca].y + (-1)*bondlength*Math.sin(Math.PI*eHdir/180);
          mar[mar.length] = new Atom(1,'H',ehx,ehy,0,0,+1);
          mar[mar.length-1].t = mar[ca].t;
          mar[ca].eh += 1;
          mar[ca].hx = ehx;
          mar[ca].hy = ehy;
          mar[ca].hz = 0;
          if (bty > 3) {
            mar[ca].hz = (bty === 4)? 1 : -1;
          }
          addBond(mar,bar,ca,mar.length-1,bty);
        } // creates an explicit H at atom ca in direction dir with bond type bty        

        function parseSMILES(smico) {
          let achains = [];
          let alt12='';
          let alt12Path=[];
          let ap=-1;
          let ar_notOneDB=[];
          let ar_OneDB=[];
          let atBondTooClose = [];
          let atLigDirSame = [];
          let autoH = 0;
          let bondTooClose = [];
          let bpf = [];
          let crossingBonds = [];
          let ringAngtooLarge = [];
          let bor = 0;
          const chains = [];
          let chainseq1=[];
          let chainseq2=[];
          let eD = 0;
          let ehd = -1;
          const fusedToh = {};
          let i=0;
          let ic=0;
          let jj=0;
          let k=0;
          let key;
          let largeRing = 0; // index in prings of the largest ring > 8
          let lastatom=0;
          let lastequal=-1;
          let longChain = [];
          let lv0ChPaInRing = 0;
          let mcb ='';
          let nchains = [];
          let nexpH=0;
          let next=0;
          let omcb = '';
          let ost= '';
          let pBridgeAtoms = [];
          let pEa = [];
          let pEaDone=[];
          let pEmfuAtoms = [];
          let pEmfuDB=[];
          const phdir = [[]];
          let pldir=[];
          let plotorder = '';
          const plottedcchains = [];
          let plottedchains = [];
          let plottedrings = [];
          let plottedcomp = 0;
          let pr2rjh = []; // array of ring to ring direct connections (objects {pbix: i, a1: pb[i].fra, a2: pb[i].toa}) 
          const prb = []; // array of ring indices (in prings[]) for each bond (0 if not ring bond), runs parallel to pb[]
          let pRingBridgeAth = {};
          let pringC = new Coord(0,0);
          const pringcenters = [{x:0,y:0}];
          const pringsystems = [];
          let rsys = 1;
          let sec=0;
          let shortpath = []; // array with all atoms from st to en in shortest path
          let six = 0;
          let spbixar = []; // array with bond indexes of all non cylic single bonds on the shortest path except first and last bond
          let sqbar = [];
          let sqbrH = 0;
          let sst=-1;
          let ssec=0;
          let tooClose = [];
          let dba1 = 0;  //1st atom of an ezDB
          let dba2 = 0;  //2nd atom of an ezDB
          let dba1slash = false;  //true: slash before dba1 or one of its ligands
          let dba2slash = false;  //true: slash before one of the ligands of dba2. Only DB with both dba1flash and dba2flash true are ezDB
          let dba1ligs = [];  // singe bond partners of dba1, sorted acc. to appearance in SMILES if 2 ligands 
          let dba2ligs = [];  // singe bond partners of dba2, sorted acc. to appearance in SMILES if 2 ligands
          let rcflig = 0;
          let rctlig = 0;
          let slashcode = '';   // 4-digit string indicating for each ligand of the ezDB whether it has a \ ('1'), a / ('2') or no slash ('0')
                  // 1st digit: dba1 (after fl1); 2nd digit: fl2; 3rd digit: tl1, 4th digit: tl2.
          let rfl1tl1 = '';
          let rr11 = '';
          // the pezh{} dict with key String(dba1)+'-'+String(dba2) is defined in parse_m_SMILES() and contains objects
          // {f:1st DB atom, t:2nd DB atom, fl1:incoming ligand before 1st DB atom, fl2:2nd ligand of 1st DB atom (if there), tl1:1st ligand of 2nd DB atom, tl2:2nd ligand of 2nd DB atom(if there), slc:slashcode}
        
          const sqbregex = /^\[([A-Z]{0,1}[a-z]{0,2})(@{0,2})(H{0,1})([0-9]{0,2})([-|+]{0,1}\d{0,2})\]$/;
                        //        1:ele            2:stereo 3:H       4: nh       5:charge          
          const resregex = /^\[(R{1,1}\d{0,1})\]$/;
        
      
          if (smico.length === 0) { return; } // nothing to parse
      
          // reset global variables used in SMILES parsing
          m_s.length = 1;
          b_s.length = 1;
        
          achains = [];
          cchains = [];
          emfuPrings = []; 
          lv0ChPaInRing = 0;
          mchain = -1;
          pats = []; // array of the atom SMILES. Index is atom index in SMILES
          pb = [new Bond(0,0,0)]; // index 0 contains a dummy bond
          pIsolatedRings = [];
          plotorder = '';
          plottedchains = [];
          plottedrings = [];
          pRingBridgeAth = {};
          pRingFusions = [];
          prings = [[0]]; // array storing the atoms in ring, element 0 is dummy
          pscAtoms = []; // array with the stereogenic atoms (rs=(@|@@))
          pSpiroRings = [];
          rtchains = [];
          tchains = [];
        
          // delete properties in pseudohashes
          for (key in rclh) {
            if (rclh.hasOwnProperty(key)) {
              delete rclh[key];
            }
          }
          for (key in atInRh) {
            if (atInRh.hasOwnProperty(key)) {
              delete atInRh[key];
            }
          }
          for (key in pezh) {
            if (pezh.hasOwnProperty(key)) {
              delete pezh[key];
            }
          }
          for (key in pRingBridgeAth) {
            if (pRingBridgeAth.hasOwnProperty(key)) {
              delete pRingBridgeAth[key];
            }
          }

    
          getChains(smico); // analyze the SMILES for chain structure and ring closures

//uc_msvg           if (parserr !== '') { //msvg_specific
//uc_msvg             logstr += name+": "+answer+" parseSMILES error: "+parserr+" for entered SMILES: "+msmico+"\n"; //msvg_specific
//uc_msvg             return; //msvg_specific
//uc_msvg           } //msvg_specific
     
      
          for (key in rclh) { // rclh{} was filled in getChains().
            if (rclh.hasOwnProperty(key)) {
            // add ring closures as bonds
            pb.push(new Bond(rclh[key].sa,rclh[key].ea,1));

            // determine rings from ring closure and chains
            chainseq1 = [];
            chainseq2 = [];
            ic=rclh[key].sc; // 1st occurrence of ring closure digit
            while (ic >= 0) { // follow chains from 1st rc down to main chain
              chainseq1.push(ic);
              ic = chains[ic].pc;
            }
            ic=rclh[key].ec; // 2nd occurrence of ring closure digit
            while (ic >= 0) { // follow chains from 2nd rcl down to main chain
              chainseq2.push(ic);
              ic = chains[ic].pc;
            }
            // trim chainsequences to first common parent chain
            while ((chainseq1.length > 0) && (chainseq2.length > 0)) {
              if (chainseq1[chainseq1.length-1] === chainseq2[chainseq2.length-1]) {
                lastequal = chainseq1.pop();
                lastequal = chainseq2.pop();
              } else {
                break;
              }
            }
            if (lastequal > -1) {
              chainseq1.push(lastequal);
              chainseq2.push(lastequal);
            }
            // put array of all ring atoms in the prings[key][atoms] array
            fillring(key,chainseq1,chainseq2);

            } // end if hasOwnProperty
          } // end for key in rclh
      
          // register the bonding partners for each atom 
          for (jj=1;jj<pats.length;jj++) {
            pbp[jj]=[];
          }
          for (i=1;i<pb.length;i++) {
            pbp[pb[i].fra].push(pb[i].toa);
            pbp[pb[i].toa].push(pb[i].fra);
          }

          // create the atoms and bonds
          for (i=1;i<pats.length;i++) { // for all atoms found in SMILES
            lastatom = createNextAtom(m_s,b_s,pic[i],pats[i]);
            if (lastatom < 0) { //BF191122.1
              return; //BF191122.1
            } //BF191122.1
          }

            

  // at this point, the m_s[] and b_s[] arrays of atoms and Bonds are known except the coordinates, which are all (0|0|0)  
        
          // check for cumulenes in the structure
          ezCC = []; // reset global variable
          pscCC = []; // reset global variable
          findCC(m_s); // this is a function from getSMILES!
        
          // store the EZ double bonds and EZcumulenes  as objects in pezh{} dict: key: String(dba1)+'-'+String(dba2)
          for (i=1;i<m_s.length;i++) {
            if (prfs[i] === '=')  { // m_s[i] is 2nd atom of a DB
              dba1slash = false;
              dba2slash = false;
              dba1ligs = [];
              dba2ligs = [];
              slashcode = '';
              rcflig = 0;
              rctlig = 0;
              dba1 = pic[i];
              if (is_ezCCend(dba1) > 0) {
                dba2 = is_ezCCend(dba1);
              } else {
                dba2 = i;
              }
            
              // check for ring closures to dba1 or dba2
              for (key in rclh) {
                if (rclh.hasOwnProperty(key)) {
                  if (rclh[key].sa === dba1) {
                    rcflig = rclh[key].ea;
                  } else if (rclh[key].ea === dba1) {
                    rcflig = rclh[key].sa;
                  }
                  if (rclh[key].sa === dba2) {
                    rctlig = rclh[key].ea;
                  } else if (rclh[key].ea === dba2) {
                    rctlig = rclh[key].sa;
                  }
                }
              }
            
              if (/[\\|/]/.test(prfs[dba1])) { // test dba1 for prefix slash -> slash is after fl1
                dba1slash = true;
              }
              // record the singly bound ligands of dba1 in dba1ligs[]
              for (jj=0;jj<m_s[dba1].bpa.length;jj++) {
                if (m_s[dba1].bpa[jj].t !== 2) { // exclude the DB partner
                  dba1ligs.push(m_s[dba1].bpa[jj].p);
                  if ((/[\\|/]/.test(prfs[m_s[dba1].bpa[jj].p])) || (/[\\|/]/.test(psfs[m_s[dba1].bpa[jj].p]))) {
                    dba1slash = true;
                  }                
                }
              }
              if ((rcflig === 0) && (dba1ligs.length === 2)) {
                dba1ligs.sort((a, b) => // sort dba1ligs[] according to increasing atom index (= order of appearance in SMILES)
                a - b);
              } else if ((rcflig > 0) && (dba1ligs.length === 2)) { // bugfix 190102.1
                if (/[\\|/]/.test(prfs[dba1]))  { // dba1 has slash prefix
                  if (rcflig === dba1ligs[0]) {  // rcflig is dba1ligs[0], swap ligands
                    dba1ligs[0] = dba1[1];
                    dba1ligs[1] = rcflig;
                  }
                } else if ((/[\\|/]/.test(psfs[rcflig])) && (rcflig !== dba1ligs[0])) { // rcflig has slash suffix
                  dba1ligs[1] = dba1ligs[0];
                  dba1ligs[0] = rcflig;  // ring closure ligand will be fl1
                } else if ((/[\\|/]/.test(prfs[rcflig])) && (rcflig !== dba1ligs[1])) { // rcflig has slash prefix
                  dba1ligs[0] = dba1ligs[1]; // ring closure ligand will be fl2
                  dba1ligs[1] = rcflig;
                }
              } // bugfix 190102.1
            
              // record the singly bound ligands of dba2 in dba2ligs
              if (/[\\|/]/.test(psfs[dba2])) { // test dba2 for suffix slash -> slash is before ring closure tl1
                dba2slash = true;
              }
              for (jj=0;jj<m_s[dba2].bpa.length;jj++) {
                if (m_s[dba2].bpa[jj].t !== 2) { // exclude the DB partner
                  dba2ligs.push(m_s[dba2].bpa[jj].p);
                  if (/[\\|/]/.test(prfs[m_s[dba2].bpa[jj].p])) {
                    dba2slash = true;
                  }
                }
              }
              if ((rctlig === 0) && (dba2ligs.length === 2)) {
                dba2ligs.sort((a, b) => // sort dba2ligs[] according to increasing atom index (= order of appearance in SMILES)
                a - b);
              } else if ((rctlig > 0) && (dba2ligs.length === 2)) {
                if (/[\\|/]/.test(psfs[dba2])) { // dba2 has suffix slash. This relates to ring closure with rctlig, which must be tl2 in this case
                  if (dba2ligs[0] === rctlig) {
                    dba2ligs[0] = dba2ligs[1]
                    dba2ligs[1] = rctlig;
                  }
                } else if (rctlig !== dba2ligs[0]) {
                  dba2ligs[1] = dba2ligs[0];
                  dba2ligs[0] = rctlig;  // ring closure will be tl1
                }
              } 

              if ((dba1slash === false) || (dba2slash === false)) {  // if not ezDB, go to next atom
                continue;
              }
              // slashcode construction  // bugfix 190102.1: 3rd and 4th digits affected
              // 1st digit
              if (/[\\|/]/.test(prfs[dba1])) { // test dba1 for prefix slash -> slash is after fl1
                slashcode += (prfs[dba1] === '\\')? '1' : '2';
              } else if ((dba1ligs.length === 2) && (/[\\|/]/.test(psfs[dba1ligs[0]]))) {
                slashcode += (psfs[dba1ligs[0]] === '\\')? '1' : '2' ;
              } else {
                slashcode = '0';
              }
              // 2nd digit
              if ((dba1ligs.length === 2) && (/[\\|/]/.test(prfs[dba1ligs[1]]))) {
                slashcode += (prfs[dba1ligs[1]] === '\\')? '1' : '2' ;
              } else {
                slashcode += '0';
              }
              // 3rd digit
              if (/[\\|/]/.test(psfs[dba2])) {
                if (dba2ligs.length === 2) { // bugfix 190124.1
                  slashcode += (psfs[dba2] === '\\')? '2' : '1' ; //original only this
                } else { // bugfix 190124.1
                  slashcode += (psfs[dba2] === '\\')? '1' : '2' ; // bugfix 190124.1
                } // bugfix 190124.1
              } else if (/[\\|/]/.test(prfs[dba2ligs[0]])) {
                slashcode += (prfs[dba2ligs[0]] === '\\')? '1' : '2' ;
              } else {
                slashcode += '0';
              }
              // 4th digit
              if (/[\\|/]/.test(psfs[dba2])) {
                slashcode += '0';
              } else if ((dba2ligs.length === 2) && (/[\\|/]/.test(prfs[dba2ligs[1]]))) {
                slashcode += (prfs[dba2ligs[1]] === '\\')? '1' : '2' ;
              } else {
                slashcode += '0';
              }
              rfl1tl1 = get_fl1_tl1_rel(slashcode);
            
              // record ezDB in pezh[] in both directions            
              if (pezh[String(dba1)+'-'+String(dba2)] === undefined) { // original pezh
                pezh[String(dba1)+'-'+String(dba2)] = {f:dba1,t:dba2,fl1:dba1ligs[0],fl2:0,tl1:dba2ligs[0],tl2:0,slc:slashcode, r11:rfl1tl1};
                if (dba1ligs.length === 2) {
                  pezh[String(dba1)+'-'+String(dba2)].fl2 = dba1ligs[1];
                }
                if (dba2ligs.length === 2) {
                  pezh[String(dba1)+'-'+String(dba2)].tl2 = dba2ligs[1];
                }
                
              }
              if (pezh[String(dba2)+'-'+String(dba1)] === undefined) { // reversed pezh
                rr11 = pezh[String(dba1)+'-'+String(dba2)].r11;
                pezh[String(dba2)+'-'+String(dba1)] = {f:dba2,t:dba1,fl1:0,fl2:0,tl1:0,tl2:0,slc:'',r11:''};
                if (dba2ligs.length === 2) {
                  pezh[String(dba2)+'-'+String(dba1)].fl1 = dba2ligs[1];  //tl2=>fl1
                  pezh[String(dba2)+'-'+String(dba1)].fl2 = dba2ligs[0];  //tl1=>fl2
                  rr11 = (rr11 === 't')? 'c' : 't';
                } else {
                  pezh[String(dba2)+'-'+String(dba1)].fl1 = dba2ligs[0];  //tl1=>fl1
                }
                if (dba1ligs.length === 2) {
                  pezh[String(dba2)+'-'+String(dba1)].tl1 = dba1ligs[1];  //fl2=>tl1
                  pezh[String(dba2)+'-'+String(dba1)].tl2 = dba1ligs[0];  //fl1=>tl2
                  rr11 = (rr11 === 't')? 'c' : 't';
                } else {
                  pezh[String(dba2)+'-'+String(dba1)].tl1 = dba1ligs[0];  //tl1=>fl1
                }
                pezh[String(dba2)+'-'+String(dba1)].r11 = rr11;
                pezh[String(dba2)+'-'+String(dba1)].slc = (rr11 === 't')? '1010' : '1020';
              }
            }
          }


    // RINGS section
    // Determine the MCB (Minimal Cycle Basis)
          // compose the mcb-string
          mcb ='';
          for (i=1;i<prings.length;i++) {
            mcb = mcb + '-'+prings[i].length;
          }
          mcb = mcb.slice(1);

          k=0;  
          // iterate until MCB is stable    
          while ((mcb !== omcb) && (k < 20)) { 
            omcb = mcb;
            analyzeRings();
            mcb = '';
            for (i=1;i<prings.length;i++) {
              mcb = mcb + '-'+prings[i].length;
            }
            mcb = mcb.slice(1);
            k++;
          }
              
          // register ring bonds        
          prb[0] = 0;
          for (i=1;i<pb.length;i++) {
            prb.push(atInSame_pRing(pb[i].fra,pb[i].toa));
          }
      
          // identify emfu rings
          emfuPrings = [];
          for (i=1;i<prings.length;i++) {
            if (isemfuPring(i) === true) { // it is an emfu ring
              emfuPrings[i] = true;
              // place the alternate double bonds
              for (k = 0;k<prings[i].length;k++) {
                if (k % 2 === 1) {
                  prfs[prings[i][k]] = '=';
                }
              }
            } else {
              emfuPrings[i] = false;
            }
          }
      
          // identify ring systems: fused or spiro connected rings form together a ring system
          if (pRingFusions.length > 0) {
            for (i=0;i<pRingFusions.length;i++) {
              if (fusedToh[String(pRingFusions[i].r1)] !== undefined) {
                fusedToh[String(pRingFusions[i].r1)].push(pRingFusions[i].r2);
              } else {
                fusedToh[String(pRingFusions[i].r1)] = [];
                fusedToh[String(pRingFusions[i].r1)].push(pRingFusions[i].r2);
              }
              if (fusedToh[String(pRingFusions[i].r2)] !== undefined) {
                fusedToh[String(pRingFusions[i].r2)].push(pRingFusions[i].r1);
              } else {
                fusedToh[String(pRingFusions[i].r2)] = [];
                fusedToh[String(pRingFusions[i].r2)].push(pRingFusions[i].r1);
              }
            }
          }
          if (pSpiroRings.length > 0) {
            for (i=0;i<pSpiroRings.length;i++) {
              if (fusedToh[String(pSpiroRings[i].r1)] !== undefined) {
                fusedToh[String(pSpiroRings[i].r1)].push(pSpiroRings[i].r2);
              } else {
                fusedToh[String(pSpiroRings[i].r1)] = [];
                fusedToh[String(pSpiroRings[i].r1)].push(pSpiroRings[i].r2);
              }
              if (fusedToh[String(pSpiroRings[i].r2)] !== undefined) {
                fusedToh[String(pSpiroRings[i].r2)].push(pSpiroRings[i].r1);
              } else {
                fusedToh[String(pSpiroRings[i].r2)] = [];
                fusedToh[String(pSpiroRings[i].r2)].push(pSpiroRings[i].r1);
              }
            }
          }

          rsys = 0;
          // collect the fused and spiro ring systems
          for (key in fusedToh) { 
            if (fusedToh.hasOwnProperty(key)) { 
              pringsystems[rsys]=[];
              pringsystems[rsys] = merge_array(pringsystems[rsys],fusedToh[key]);
              for (i=0;i<fusedToh[key].length;i++) {
                pringsystems[rsys] = merge_array(pringsystems[rsys],fusedToh[String(fusedToh[key][i])]);
              }
              pringsystems[rsys] = elidup(pringsystems[rsys]);
              pringsystems[rsys].sort((a, b) => parseInt(a,10) - parseInt(b,10));
              rsys++;
            }
          }
          if (pringsystems.length > 1) {
            // eliminate duplicate ringsystems
            for (i=0;i<pringsystems.length-1;i++) {
              for (jj=i+1;jj<pringsystems.length;jj++) {
                if (sameArray(pringsystems[i], pringsystems[jj]) === true) {
                  pringsystems.splice(jj--,1);
                }
              }
            }
            // check for rings occurring in more than one ring system
            for (i=0;i<pringsystems.length-1;i++) {
              for (jj=i+1;jj<pringsystems.length;jj++) {
                for (k=0;k<pringsystems[i].length;k++) {
                  if (pringsystems[jj].includes(pringsystems[i][k])) {
                    // merge the two ringsystems
                    pringsystems[i] = merge_array(pringsystems[i],pringsystems[jj]);
                    pringsystems.splice(jj--,1);
                    break;
                  }
                }
              }
            }
          }
          // sort ringsystems according to length, the one with the largest number of rings first
          // if they have the same number of rings, the one with more atoms first
          pringsystems.sort((a, b) => { 
            let q=0;
            let aatoms=0;
            let batoms=0;
        
            if (b.length === a.length) {
              for (q=0;q<a.length;q++) {
                aatoms += prings[a[q]].length;
                batoms += prings[b[q]].length;
              }
              return batoms - aatoms;               
            } else {             
              return b.length - a.length;
            }  
          });    
            
  // END OF RING SECTION
  
//           console.log("parseSMILES after ring section:"); //BF200901.1
//           console.log("pringsystems[0]: "+pringsystems[0]); //BF200901.1
//           console.log("emfuPrings: "+emfuPrings); //BF200901.1

          // analyse the chain/ring/connector structure
          // eliminate ring atoms from chains
      

          topo(m_s,b_s);

          // find direct connections between rings through one non-ring bond
          pr2rjh = [];
          for (i=1;i<pb.length;i++) {
            if ((atInRh[String(pb[i].fra)] !== undefined) && (atInRh[String(pb[i].toa)] !== undefined) && (prb[i] === 0)) { 
            // both atoms are connected through one bond, both are ring atoms but in different rings
              pr2rjh.push({pbix: i, a1: pb[i].fra, a2: pb[i].toa}); 
            }
          }
              
          // things to carry out before leaving parseSMILES
        
          // make ring closure bonds
          for (key in rclh) {
            if (rclh.hasOwnProperty(key)) {
              addBond(m_s,b_s,rclh[key].sa,rclh[key].ea,1);
            }
          }
          // find bridges of rings
          find_pRingsBridges(m_s);
      
          incoming = pic.slice(0);  // copy the incoming atoms from pic[]
          

          // establish the coordinates of all atoms by systematic build-up from rings and chains
//uc_msvg           try {
            pCoord(m_s,b_s);
//uc_msvg           } 
//uc_msvg           catch(err) {
//uc_msvg             console.log("Plotting ERROR: "+err);
//uc_msvg             return;
//uc_msvg           }
          
//uc_msvg           if (ploterr !=='') {
//uc_msvg             return;
//uc_msvg           }
          


        // create and plot all explicit H
          phdir[0]=[[0,120,240],[0,120,240],[0,120,240],[0,120,180,240],[30,120,180,240,330]]; 
          phdir[1]=[[120,240],[120,240],[120,180,240],[60,150,210,270]]; 
          lastatom =  m_s.length-1;        
          for (i= 1; i<=lastatom;i++) { //BF191011.2
            // determine the number auf autogenerated H
            autoH=getAutoH(m_s,i,false);
            if (m_s[i].eh > 0) {
//               console.log("atom["+i+"]: m_s[i].eh ="+m_s[i].eh+ " autoH= "+autoH);
              if (m_s[i].eh <= autoH) { // m_s[i].eh is within the normal valency
                m_s[i].eh = Math.max(m_s[i].eh - autoH,0); // BF191103.1 reduce number auf expl. H by number auf auto expanded H
              }
              // but not beyond 0 (radicals will have autoH too high by 1 here, the m_s[].r property is determined further down)
              pldir=[]; // pldir contains the direction to non-H ligands
              for (k=0;k<m_s[i].bpa.length;k++) {
                pldir.push(getdiranglefromAt(m_s,i,m_s[i].bpa[k].p));
              }
              if ((m_s[i].eh > autoH) && (m_s[i].eh > 1)) { //Hypervalent Atom with more than one expl. H
                for (k=0; k<m_s[i].eh;k++) {
                  ehd=propBestDir(m_s,b_s,i);
                  createExplicitH(m_s,b_s,i,ehd,1);
                  m_s[i].eh -= 1; //BF191019.1
                }              
              } else {
                for (k=0; k<m_s[i].eh;k++) { //BF191019.1
                  if ((pldir.length === 0) && (m_s[i].eh < 6)) { //BF191019.1 no non-H ligands and max 5 expl H
                    ehd=phdir[0][m_s[i].eh-1][k];
                  } else if ((pldir.length === 1) && (m_s[i].eh < 5)) { //BF191019.1 one non-H ligand and max 4 expl H
                    ehd=norma(pldir[0]+phdir[1][m_s[i].eh-1][k]);
                  } else { // all other cases: bisect largest sector
                    sectors =  [];
                    getSectorsAt(m_s,i,true); //BF191019.1
                    ehd = getBisectorFrom3At(m_s,i,sectors[sectors.length-1].la,sectors[sectors.length-1].ra,true); //BF191019.1              
                  }   //BF191019.1                 
                  createExplicitH(m_s,b_s,i,ehd,1); //BF191019.1
                  m_s[i].eh -= 1; //BF191019.1
                }
              }
            } //BF191019.1
          } //BF191011.2
          
          //BF200903.2
//           console.log("Atom coordinates: "+(m_s.length-1));
//         
//           jj=1;
//           while (jj < m_s.length) {
//             console.log("["+jj+"] x="+f1(m_s[jj].x)+" y="+f1(m_s[jj].y));
//             jj++;
//           }      

//           console.log("plotorder: "+plotorder); //BF200901.1
        
          // register all emfu atoms and set their double bonds to single bonds
          pEmfuAtoms=[];
          for (i=1;i<m_s.length;i++) {
            if (m_s[i].ar) {
              pEmfuAtoms.push(i);
              for (j=0;j<m_s[i].bpa.length;j++) {
                if (m_s[i].bpa[j].t===2) {
                  changeBondOrder(m_s,b_s,i,m_s[i].bpa[j].p,'-');
                }
              }
            }
          }
//           console.log("there are "+pEmfuAtoms.length+" EMFU atoms which must have "+pEmfuAtoms.length/2+" DB");
          
          
          // fill all emfu systems with alternating double bonds
          if (pEmfuAtoms.length > 1) {
            pEaDone=[];
            pEa=pEmfuAtoms.slice(0);
            sst=pEa[0]; //arbitrarily start with the first one
            alt12='+';
            sec=1;
//             console.log("pEa: "+pEa); //BF200901.1
            while ((pEa.length > 0) && (sec <= pEmfuAtoms.length)) {
              // look for a BP that is also emfu
              bpf=[];
              pEa.splice(pEa.indexOf(sst),1);
              bpf=findBP(m_s,sst,pEa,1);
              next = bpf[0];
              if ((next!==undefined) && (next > -1)) {
                if (alt12==='+') {
                  changeBondOrder(m_s,b_s,sst,next,'+');
//                   console.log("DB made: "+sst+"->"+next);
                  alt12='-';
                } else {
                  alt12='+';
                }
                pEaDone.push(sst);
                sst=next;
              } else if (pEa.length > 0) {
                sst=pEa[0];
                alt12='+';
              }
              sec++;
            } // end while
//             console.log("pEaDone: "+pEaDone); //BF200901.1
          } // end if
          findAllEmfuDB(m_s,b_s,pEmfuAtoms);
//           console.log("pEmfuDB: "+pEmfuDB.length+" emfu-DB");
//           for (i=0;i<pEmfuDB.length;i++) {
//             console.log(b_s[pEmfuDB[i]].fra+"->"+b_s[pEmfuDB[i]].toa);
//           }
          // check for emfu atoms that have not exactly one double bond
          ar_OneDB = [];
          ar_notOneDB = [];          
          for (i=0;i<pEmfuAtoms.length;i++) {
            if (hasEmfuDB(m_s,b_s,pEmfuAtoms[i])===1) {
              ar_OneDB.push(pEmfuAtoms[i]);
            } else {
              ar_notOneDB.push(pEmfuAtoms[i]);
            }
          }
                  
         if (ar_notOneDB.length > 0) { // try with findAltEmfuPath()
//             console.log("ar_notOneDB: "+ar_notOneDB); //BF200901.1
//             console.log("ar_OneDB: "+ar_OneDB); //BF200901.1
            for (i=0;i<ar_notOneDB.length-1;i++) {
              for (k=i+1;k<ar_notOneDB.length;k++) {
//                  ap=findShortestAlt12Path(m_s,b_s,ar_notOneDB[i],ar_notOneDB[k]);
                ap=findAltEmfuPath(m_s,b_s,ar_notOneDB[i],ar_notOneDB[k]);
//                 console.log("after findAltEmfuPath\n k="+k+" ap="+ap+" alt12Path: "+alt12Path); //BF200901.1
                if ((ap===1) && (shiftDB(m_s,b_s,alt12Path)===0)) { //alt12Path found,shift of DB successful
                  ar_notOneDB.splice(ar_notOneDB.indexOf(ar_notOneDB[i]),1);
                  ar_notOneDB.splice(ar_notOneDB.indexOf(ar_notOneDB[k]),1);                  
                  ar_OneDB.push(ar_notOneDB[i]);
                  ar_OneDB.push(ar_notOneDB[k]);
                  break;
                } else {
                  continue;
                }
              }
              if (ar_notOneDB.length===0) {
                break;
              } //for k
            } //for i
           } //if
          // check again for emfu atoms that have not exactly one double bond
          ar_OneDB = [];
          ar_notOneDB = [];          
          for (i=0;i<pEmfuAtoms.length;i++) {
            if (hasEmfuDB(m_s,b_s,pEmfuAtoms[i])===1) {
              ar_OneDB.push(pEmfuAtoms[i]);
            } else {
              ar_notOneDB.push(pEmfuAtoms[i]);
            }
          }
          if (ar_notOneDB.length > 0) { 
            // reset all emfuDB to SB
            for (i=1;i<m_s.length;i++) { 
              if (m_s[i].ar) {
                for (j=0;j<m_s[i].bpa.length;j++) {
                  if ((m_s[i].bpa[j].t===2) && (m_s[m_s[i].bpa[j].p].ar)) {
                    changeBondOrder(m_s,b_s,i,m_s[i].bpa[j].p,'-');
                  }
                }
              }
            }
            for (i=0;i<pEmfuDB.length;i++) {
              changeBondOrder(m_s,b_s,b_s[pEmfuDB[i]].fra,b_s[pEmfuDB[i]].toa,'+');
            }
            
          // try with findShortestAlt12Path()
            for (i=0;i<ar_notOneDB.length-1;i++) {
              for (k=i+1;k<ar_notOneDB.length;k++) {
                ap=findShortestAlt12Path(m_s,b_s,ar_notOneDB[i],ar_notOneDB[k]);
//                 console.log("after findShortestAlt12Path\n k="+k+" ap="+ap+" alt12Path: "+alt12Path);
                if ((ap===1) && (shiftDB(m_s,b_s,alt12Path)===0)) { //alt12Path found,shift of DB successful
                  ar_notOneDB.splice(ar_notOneDB.indexOf(ar_notOneDB[i]),1);
                  ar_notOneDB.splice(ar_notOneDB.indexOf(ar_notOneDB[k]),1);                  
                  ar_OneDB.push(ar_notOneDB[i]);
                  ar_OneDB.push(ar_notOneDB[k]);
                  break;
                } else {
                  continue;
                }
              }
              if (ar_notOneDB.length===0) {
                break;
              } //for k
            } //for i
          } //if
                
//        check for and fix collisions
           fixColl(m_s,b_s);

          if (prings.length > 1) {
            for (i=1;i<prings.length;i++) {
              pringC = pringCofM(m_s,i); // pringC is a 2D Coord object        
              pringcenters[i] = pringC;
            }
          }
       //figure out whether atoms are radical centers, carbenes or nitrenes. Depends on normal valency being defined
          for (i=1;i<m_s.length;i++) {
            if ((pats[i] === undefined) || (val[m_s[i].an] === 0) || (m_s[i].an===1)) { // skip explicit H (have no pats[]) and atoms with val===0
              if ((pats[i]==='[H]') && (m_s.length===2)) { //special case single H atom
                m_s[i].r=true;
              }
              continue; 
            } 
            sqbrH = 0;
            sqbar = [];
            // number of implicit H in square bracket
            sqbar = pats[i].match(sqbregex);
            if (sqbar !== null) {
              if (sqbar[3] === 'H') {
                if (sqbar[4] !== '') {
                  sqbrH = parseInt(sqbar[4],10);
                } else {
                  sqbrH = 1;
                }                
              } 
            } else if (pats[i]==='[H]') {
              sqbrH=1;
            } else {
              continue; // skip rest if atom is not in square braket
            }
            eD = 0;
            nexpH = 0;
            bor=0;
            for (jj=0;jj<m_s[i].bpa.length;jj++) { 
              if ((m_s[i].bpa[jj].t === 4) || (m_s[i].bpa[jj].t === 5)){ 
                bor += 1;
              } else {
                bor += m_s[i].bpa[jj].t;
              }
              if (m_s[m_s[i].bpa[jj].p].an===1) { //count the explicit H
                nexpH++;
              }
            }
            bor += (sqbrH - nexpH); // add the implicit H to actual valence
            
            eD = val[m_s[i].an] + m_s[i].c - bor; // electron deficiency
            if (((Math.abs(eD) % 2) === 1) && (m_s[i].an > 10)) { //no hypervalent radicals for H-Ne //BF190822.1
              m_s[i].r = true;
              if (((m_s[i].an === 17) ||(m_s[i].an === 35) || (m_s[i].an === 53)) && (bor > 1) && (m_s[i].c === 0))  { //BF200820.2 Cl,Br,I eD < 0, no charge
                m_s[i].r = false;
              }
            } else if (((Math.abs(eD) % 2) === 1) && (eD > 0)) { //BF190921.1
              m_s[i].r = true;
              //commented out in BF200820.2
//             } else if (((Math.abs(eD) % 2) === 1) && (m_s[i].an === 7) && (m_s[i].c === 0)) { //BF191024.1                
//               m_s[i].r = true;
//               console.log("radical because of eD odd AN=7 and c=0");
            } else if ((eD === 2) && (m_s[i].c === 0)) { // carbene or nitrene
              if (m_s[i].an === 6) {
                m_s[i].el = "C:";
              }
              if (m_s[i].an === 7) {
                m_s[i].el = "N:";
              }
            } else if ((eD === 2) && (bor - m_s[i].c === 1)) { //BF191016
              if (m_s[i].an === 7) { //BF191016
                m_s[i].el = "N:"; //BF191016
              } //BF191016
            }  //BF191016
            if (emfuElesym.includes(sqbar[1])) {
              //just emfu element symbol in square bracket
              if ((val[m_s[i].an] !== 0) && (val[m_s[i].an]===bor)) { //defined valency fulfilled
                // must be radical if in square brackets
                m_s[i].r=true;
              }
            }
//            console.log("atom ["+i+"]: ["+sqbar[1]+"] sqbrH="+sqbrH+" nexpH="+nexpH+" bor="+bor+" eD="+eD+" m_s[i].r="+m_s[i].r);
          } // end loop over all atoms to find radicals,carbenes,nitrenes
        
          // introduce stereo up and stereo down bonds from stereodescriptors @ and @@
        
          if (pscAtoms.length > 0) { // if there are stereogenic centers with rs=(@|@@)
            stereobonds(m_s,b_s);
            fixColl(m_s,b_s);
          }
      
        
          // for each atom, sort the bonding partners in the bpa[] array according to bond directions beginning with 0 => east
          for (i=1;i<m_s.length;i++) {
            sort_abop_by_dir(m_s,i);
          }
          return;
  // end of parseSMILES main
  
          // named functions inside parseSMILES
      
          function getChains(smico) {
            let i=0;
            let atix = 0; // atom index in SMILES
            let scnr = 0; // sidechain number
            let maxscnr = 0;
            let sqbr = false;
            let explH = false;
            let nl = 0; // nesting level
            let c1 = ''; // one character
            let c2 = ''; // two characters
            let bot = 1; // bond type
            let ats = ''; // local atom string
            let prf = ''; // local prefix string
            let tdringclos = false; // two digit ring closure
            let tdrc = ''; // two digit ring closure
            // external variable: rclh = {} dict of ring closure objects. Key: String(ring closure digit)
            //           filled in this function
            // ring closure object:
            //         sc: chain nr of first occurrence
            //         sx: atom index of first occurrence
            //         ec: chain nr of second occurrence
            //         ex: atom index of second occurrence

        
            chains[scnr] = new Sidechain(0,0,-1,0);
            ats = '';
            prf = '';
            // special cases of H, H+, H-, H2 //bugfix 190306.1
            if (/^\[H[+-]{0,1}\]/.test(smico)) {
              explH = true;
            }
            for (i=0;i<smico.length;i++) {
              // element symbols
              c1 = smico.charAt(i);
              if (i < smico.length-1) { // not last char in smico
                c2 = c1 + smico.charAt(i+1);
              }
              if ((!sqbr) && (organic.includes(c2.charAt(0))) && ( emfuElesym.includes(c2.charAt(1)))) { // avoid false element symbols by emfu symbols like Sn
              } else if ((i < smico.length-1) && ((elesym.includes(c2)) || (emfuElesym.includes(c2)) || (residues.includes(c2)))) { 
              // two letter element symbol
                //new atom
                atix++;
                chains[scnr].atar.push(atix);
                ats += c2;
                if (!sqbr) {
                  chains[scnr].asa[atix] = ats;
                  pats[atix] = ats;
                  prfs[atix] = prf;
                  psfs[atix] = '';
                  chains[scnr].scs += c2;
                  ats = '';
                  prf = '';
                }
                // bond between new atom and last one in chain or parent of chain for first atom
                if (atix > 1) { // not first atom of SMILES
                  if (chains[scnr].atar.length > 1) { // not first atom in chain
                    pic[atix]= chains[scnr].atar[chains[scnr].atar.length-2];
                    pb.push(new Bond(chains[scnr].atar[chains[scnr].atar.length-2],chains[scnr].atar[chains[scnr].atar.length-1],bot));
                  } else { // first atom: bond to parent of chain
                    pic[atix]= chains[scnr].pa;
                    pb.push(new Bond(chains[scnr].pa,chains[scnr].atar[chains[scnr].atar.length-1],bot));
                  }
                  bot = 1; // reset bond type to single
                } else {
                  pic[atix]= 0;
                }
                i++; // skip next char, included in c2
                c1 = '';
                c2 = '';
                continue;
              } 
              if ((!((c1 === 'H') && (sqbr)) || (explH)) && ((elesym.includes(c1)) || (emfuElesym.includes(c1)) || (c1 === 'R'))) { //bugfix 190306.1
                // one letter element symbol, exclude H in square bracket, except H,H+,H-,H2 cases
                //new atom
                atix++;
                chains[scnr].atar.push(atix);
                ats += c1;
                if (!sqbr) {
                  chains[scnr].asa[atix] = ats;
                  pats[atix] = ats;
                  prfs[atix] = prf;
                  psfs[atix] = '';
                  chains[scnr].scs += c1;
                  ats = '';
                  prf = '';
                }
                // bond between new atom and last one in chain or parent of chain for first atom
                if (atix > 1) { // not first atom of SMILES
                  if (chains[scnr].atar.length > 1) { // not first atom in chain
                    pic[atix] = chains[scnr].atar[chains[scnr].atar.length-2];
                    pb.push(new Bond(chains[scnr].atar[chains[scnr].atar.length-2],chains[scnr].atar[chains[scnr].atar.length-1],bot));
                  } else { // first atom: bond to parent of chain
                    pic[atix]= chains[scnr].pa;
                    pb.push(new Bond(chains[scnr].pa,chains[scnr].atar[chains[scnr].atar.length-1],bot));
                  }
                  bot = 1; // reset bond type to single
                } else {
                  pic[atix]= 0;
                }
                continue;
              }
              if ((!sqbr) && (c1.match(/%{1}/) !== null)) { // two digit ring closure follows
                if (sqbr === false) {
                  tdringclos = true;
                  tdrc = '';
                } 
                continue;
              }
              if ((!sqbr) && (c1.match(/[0-9]{1}/) !== null)) { // ring closure digit
                if (tdringclos) { // two digit ring closure
                  tdrc += c1; // add digit to tdrc
                } else {
                  tdrc = c1;
                }
                if ((!tdringclos) || (tdrc.length === 2)) {
                  if (rclh[String(tdrc)] !== undefined) { // second occurrence              
                    rclh[String(tdrc)].ec=scnr;
                    rclh[String(tdrc)].ea=atix;
                    chains[scnr].scs += tdrc;
                    if (prf !== '') { // check for slash before ring closure digit
                      psfs[atix] = prf;
                      prf = '';
                    }
                  } else { // first occurrence
                    rclh[String(tdrc)]= new Ringclosure(scnr,atix,0,0);
                    rclh[String(tdrc)].sc=scnr;
                    rclh[String(tdrc)].sa=atix;
                    chains[scnr].scs += tdrc;
                    if (prf !== '') { // check for slash before ring closure digit
                      psfs[atix] = prf;
                      prf = '';
                    }
                  }
                  tdrc = '';
                  tdringclos = false;
                }
                continue;
              }  
              if (c1 === '(') { // nested sidechain
                nl++;
                maxscnr++
                // parent is the last atom examined in the next lower chain
                chains[maxscnr] = new Sidechain(nl,chains[scnr].atar[chains[scnr].atar.length-1],scnr,0);
                scnr=maxscnr;
                continue;
              }
              if (c1 === ')') { // nested sidechain ends
                nl--;
                scnr = chains[scnr].pc; // go back to parent chain
                continue;            
              }            
              if (c1 === '[') { // square bracket begins
                sqbr=true;
                ats = '[';            
                continue;            
              }            
              if (c1 === ']') { // square bracket ends
                ats += ']';
                chains[scnr].asa[atix] = ats;
                pats[atix] = ats;
                prfs[atix] = prf;
                psfs[atix] = '';
                chains[scnr].scs += ats;
                ats = '';            
                prf = '';            
                sqbr=false;
                continue;            
              }
              if (c1 === '=') {
                chains[scnr].scs += c1;
                prf += c1;
                bot=2;
                continue;
              }
              if (c1 === '#') {
                chains[scnr].scs += c1;
                prf += c1;
                bot=3;
                continue;
              }
              if ((c1 === '\\') || (c1 === '/')) {
                chains[scnr].scs += c1;
                prf += c1;
                continue;
              }
              if ((sqbr) && (c1 === 'H')) {
                ats += c1;
                continue;
              }
              if ((sqbr) && (!(elesym.includes(c1))) && (!(emfuElesym.includes(c1)))) {
                ats += c1;
                continue;
              }
              // none of the above fits: must be an illegal symbol //BF191122.1
              parserr='invalidSymbol in SMILES:'+'"'+c1+'"'; //BF191122.1
              return -1; //BF191122.1
            }  // for i < smico.length
            ringclosures = [];
            for (const key in rclh) {
              if (rclh.hasOwnProperty(key)) {
                ringclosures.push(String(rclh[key].sa)+":"+String(rclh[key].ea));
              }
            }
          }  // determines all chains, fills the pb[] array of bonds, 
            // the pats[] array containing the atom SMILES strings, 
            // the prfs[] array containing the prefixes
            // and the pic[] array with the incoming atoms
            // fills the dict rclh{} storing ringclosure objects. Key is the ring closure digit(s) as string
            // fills the ringclosures array with strings coding ring closures "atomindex1:atomindex2"
      
          function createNextAtom(mar,bar,lix,pas) {
          //params:   lix: atom index of parent atom
          //          pas: atom string of new atom
        
            let aNum = 0;
            let chrg = 0;
            let ele = '';
            let exh = 0;
            let i = 0;
            let jj = 0;
            let manc = false;
            let newix = 0;
            let pbt = 0;
            let sbar = [];
            let sbresar = [];
            let stereodes = '';
        
            if (sbresar = pas.match(resregex)) { // residue
              if (sbresar[1] !== '') {
                ele = sbresar[1];
                aNum = 0;
              }
            } else if (sbar = pas.match(sqbregex)) { // square bracket atom: analyze
              // element
              if (sbar[1] !== '') { // element symbol
                ele = sbar[1];
                // deal with emfu element symbols
                if ( emfuElesym.includes(ele)) {
                  manc = true;
                  ele = ele[0].toUpperCase() + ele.substring(1);
                }
                // check for valid element symbol
                if (!elesym.includes(ele)) { //BF191122.1
                  parserr = 'invalidElement'; //BF191122.1
                  return -1; //BF191122.1
                } //BF191122.1
                aNum = getAtomicNumber(ele);
              }
              // charge
              if (sbar[5] !== '') {
                if (sbar[5] === '+') {  
                  chrg = 1;
                } else if (sbar[5] === '-') {  
                  chrg = -1;
                } else {
                  chrg =parseInt(sbar[5],10);
                }
              }
              if (sbar[2] !== '') { // stereodescriptor
              // deal with stereodescriptors @ and @@ here
                if (sbar[2] === '@' ) {
                  stereodes = '@';
                } else if (sbar[2] === '@@' ) {
                  stereodes = '@@';
                }
              }  
              if (sbar[3] === 'H') { // //BF191024.1 : "&& (val[aNum] === 0)" removed
              // deal with H in square brackets
                if (sbar[4] !== '') { // number of H
                  exh = parseInt(sbar[4],10);
                } else {
                  exh = 1;
                } 
              }
          
            } else { // pas contains just element symbol
              // deal with emfu element symbols
              ele = pas;
              if (emfuElesym.includes(pas)) {
                manc = true;
                ele = ele[0].toUpperCase() + ele.substring(1);
              }
              // check for valid element symbol
              if (!elesym.includes(ele)) { //BF191122.1
                parserr = 'invalidElement'; //BF191122.1
                return -1; //BF191122.1
              } //BF191122.1
              
              aNum = getAtomicNumber(ele);        
            }
        
            // create the atom
            newix = mar.length;
            mar[newix] = new Atom(aNum,ele,0,0,chrg,exh,0);
            if (manc === true) {
              mar[newix].ar = true;
            }
            if (stereodes !=='') {
              mar[newix].rs = stereodes;
              pscAtoms.push(newix);
            }
        
            // add bonds and adjust bpa of new atom accordingly
            for (i=0;i<pbp[newix].length;i++) {
              // figure out bond type of new bond from pb[]
              for (jj=1;jj<pb.length;jj++) {
                if (((pb[jj].fra === newix) && (pb[jj].toa === pbp[newix][i])) || ((pb[jj].toa === newix) && (pb[jj].fra === pbp[newix][i]))) {
                  pbt = pb[jj].btyp;
                  break;
                }
              }
              addBond(mar,bar,newix,pbp[newix][i],pbt);
            }
            return newix;
                
          } // creates next Atom with all properties. Coordinates are still (0|0)
      
          function chainOf(car,ax) {
          // param: car is an array of Sidechains; ax is the atom index (in m_s[])
            let i=0;
            for (i=0;i<car.length;i++) {
              if ( car[i].atar.includes(ax)) {
                return i;
              }
            }
            return -1;
          }

          function findShortestPath(mar,bar,st,en) {
          // params: st=tart node en=end node
          // perform BFS with parent recording

            let child = 0;
            let i = 0;
            let node = 0;
            const parh = {};
            const queue = [];
            const visn = [];

            shortpath = [];
            visn.push(st);
            queue.push(st);
            while (queue.length > 0) {
              node = queue.shift();
              if (node === en) { // the end of search is reached
                break;
              }            
              for (i=0;i<mar[node].bpa.length;i++) {
                child = mar[node].bpa[i].p;
                if (! visn.includes(child)) { // not visted yet
                  visn.push(child);
                  parh[String(child)] = node;
                  queue.push(child);
                }          
              }
            }
            // reconstruct the shortest path
            i=en;
            shortpath = [];
            shortpath.push(en);
            while (parh[String(i)] !== undefined) {
              if (parh.hasOwnProperty(String(i))) {
                shortpath.push(parh[String(i)]);
                i = parh[String(i)];
              }
            }
            shortpath.reverse();
            // collect acyclic single bonds in shortest path
            spbixar = [];
            for (jj=1;jj<shortpath.length-2;jj++) { // without start and end atoms
              if ((atInSame_pRing(shortpath[jj],shortpath[jj+1])>0) || (bar[getBondIndex(bar,shortpath[jj],shortpath[jj+1])].btyp !== 1)) {
                // skip if bond with both atoms in same ring or multiple bond
                continue;
              } else { // single bond, not part of a ring
                spbixar.push(getBondIndex(bar,shortpath[jj],shortpath[jj+1]));
              }  
            }
          } // finds shortest path between two atoms and fills spbixar[] array of flippable bonds on this path
          
          function findAllEmfuDB(mar,bar,pEmfuAtArr) {
            let i=0;
            let k=0;
            
            pEmfuDB=[];
            for (i=1;i<b_s.length;i++) {
              if (pEmfuAtArr.includes(b_s[i].fra) && pEmfuAtArr.includes(b_s[i].toa) && (b_s[i].btyp===2)) { 
                pEmfuDB.push(i);             
              }
            }
          }
          
          function hasEmfuDB(mar,bar,ca) {
            let i=0;
            let k=0;
            let cnt = 0;
                        
            if (pEmfuAtoms.includes(ca)) {
              for (k=0; k<mar[ca].bpa.length;k++) {
                if ((m_s[ca].ar) && (m_s[ca].bpa[k].t===2)) {
                  cnt++;
                }
              }
              return cnt;
            } else {
              return -1;
            }           
          } // counts the double bonds to other emfu atoms.Returns number of DB to emfu atom ca; -1 if ca is not emfu atom
          

          function findAltEmfuPath(mar,bar,st,en) {
          // params: st=start node en=end node
            let i = 0;
            let k=0;
            let node = 0;
            let sbt=1;
            let known = false;
            const stack = [];
            const visn = [];
          
            alt12Path = [];
            stack.push(st);
            sbt=1;
            k=0;
            while (stack.length > 0)  {
  // SECTION A: get next node from stack and examine
              node = stack.pop();
              known = visn.includes(node);
              if (!known) { // if not known
                visn.push(node); // record of all visited nodes
                alt12Path.push(node);
                if (node===en) {
                  return 1;
                  break;
                }
                // SECTION B: put connected nodes on stack
                for (i=0;i<mar[node].bpa.length;i++) { // for all presorted bonding partners of node
                  if (!visn.includes(mar[node].bpa[i].p)) { // unless they are already visited
                    if ((mar[node].bpa[i].t === sbt) && (mar[mar[node].bpa[i].p].ar)) { // EMFU and consistent with alternance
                      stack.push(mar[node].bpa[i].p); // put them on the stack
                    }
                  }
                } // end for bpa
              } // end if
              sbt = (sbt===1)? 2 : 1 // alternate bond type to search for
              k++;
              if (k > 200 ) {break; } // safety for infinite loop
            } // end while         
          } // finds alternating path within an EMFU system between atoms st and en
            // and stores it in alt12Path[]. Returns 1 when en is reached

          function findShortestAlt12Path(mar,bar,st,en) {
          // params: st=tart node en=end node
          // perform BFS with parent recording

            let child = 0;
            let i = 0;
            let node = 0;
            const parh = {};
            const queue = [];
            const visn = [];

            alt12Path = [];
            visn.push(st);
            queue.push(st);
            while (queue.length > 0) {
              node = queue.shift();
              if (node === en) { // the end of search is reached
                break;
              }            
              for (i=0;i<mar[node].bpa.length;i++) { // search for bonding partner meeting the criteria
                if (mar[mar[node].bpa[i].p].ar) {
                   child = mar[node].bpa[i].p;
                  if (! visn.includes(child)) { // not visted yet
                    visn.push(child);
                    parh[String(child)] = node;
                    queue.push(child);
                  }
                }         
              }
            }
            // reconstruct the shortest path
            i=en;
            alt12Path = [];
            alt12Path.push(en);
            while (parh[String(i)] !== undefined) {
              if (parh.hasOwnProperty(String(i))) {
                alt12Path.push(parh[String(i)]);
                i = parh[String(i)];
              }
            }
            alt12Path.reverse();
            if (alt12Path.slice(-1)[0]===en) {
              return 1;
            } else {
              return -1
            }
          } // finds shortest alt12-path between two emfu atoms, returns 1 if successful, -1 otherwise
          //mod:200209-1100
          

          function findBP(mar,ax,far,fbt) {
            //params: ax: index of atom in mar for which BP are searched
            //        far: array of atom indices in mar among which to search (filter array)
            //        fbt: bond type filter: if 0: all bond types
            let i=0;
            const bpar=[];
            for (i=0;i<mar[ax].bpa.length;i++) {
              if ((far.includes(mar[ax].bpa[i].p)) && ((fbt===0) || (mar[ax].bpa[i].t===fbt))) {
                bpar.push(mar[ax].bpa[i].p);
              }
            }
            return bpar.slice(0);
          } // looks for bonding partners of ax in far (array of atom indices )
          // returns array of indices of the bonding partners fulfilling filters in mar, 
          // or empty array if none fulfill condition.
          //mod:200209-1100
          
          function shiftDB(mar,bar,aPath) {
          // aPath: an alt12 sequence of atom indices starting and ending with a single bond
            let i=0;
            let alt='+'; //begin with - -> =

            if ((aPath.length % 2)===1) { // aPath must consist of an even number of atoms
              return -1;
            }
            for (i=0;i<aPath.length-1;i++) {
              changeBondOrder(mar,bar,aPath[i],aPath[i+1],alt);
              alt = (alt==='+')? '-' : '+';
            }
            return 0;
          } // shifts the double bonds in alt12-path aPath and adds one DB
          // -(=-)n ---> =(-=)n
          //mod:200209-1100  

          function find_pRingsBridges(mar) {
            let brdg = [];
            let i=0;
            let jj=0;
            let k=0;
            let la=0;
            let prbrdgcode = '';
            let rix1=0;
            let rix2=0;
            let tspl=[];
        
            pBridgeAtoms = [];
            // collect all atoms in fusions between the same two rings without duplicates and save them in dict pRingBridgeAth{} with key 'ring1-ring2'
            for (i=0;i<pRingFusions.length-1;i++) {
              rix1 = pRingFusions[i].r1;
              rix2 = pRingFusions[i].r2;
              for (jj=i+1;jj<pRingFusions.length;jj++) {
                if (((rix1 === pRingFusions[jj].r1) && (rix2 === pRingFusions[jj].r2)) || ((rix1 === pRingFusions[jj].r2) && (rix2 === pRingFusions[jj].r1))) {
                // more than one common fusion between rings found
                  prbrdgcode = String(Math.min(rix1,rix2)) + "-" + String(Math.max(rix1,rix2));
                  if (pRingBridgeAth[prbrdgcode] !== undefined) {
                    pRingBridgeAth[prbrdgcode] = merge_array(pRingBridgeAth[prbrdgcode],[pRingFusions[jj].at1,pRingFusions[jj].at2,pRingFusions[i].at1,pRingFusions[i].at2]);
                  } else {
                    pRingBridgeAth[prbrdgcode]=[pRingFusions[jj].at1,pRingFusions[jj].at2,pRingFusions[i].at1,pRingFusions[i].at2];
                    pRingBridgeAth[prbrdgcode]= elidup(pRingBridgeAth[prbrdgcode]);
                  }
                }
              }
            }
            // find a bridgehead (end of bridge) among the bridge atoms and then follow the bonds to put the atoms in bonding sequence
            for (const rbrky in pRingBridgeAth) {
              if (pRingBridgeAth.hasOwnProperty(rbrky)) {
                brdg=[];
                for (i=0;i<pRingBridgeAth[rbrky].length;i++) {
                  if (ispBridgehead(mar,pRingBridgeAth[rbrky][i]) > 2) {
                  // take the first bridgehead among the bridge atoms
                    la=pRingBridgeAth[rbrky][i];
                    brdg.push(la);
                    break;
                  }
                }
                k=0;
                while (brdg.length < pRingBridgeAth[rbrky].length) {
                  for (i=0;i<mar[la].bpa.length;i++) {
                    if (( pRingBridgeAth[rbrky].includes(mar[la].bpa[i].p)) && (!brdg.includes(mar[la].bpa[i].p))) {
                      la = mar[la].bpa[i].p;
                      brdg.push(la);
                    }
                  }
                  k++;              
                  if (k>20) {
                    break;
                  }   
                }
                pRingBridgeAth[rbrky] = brdg.slice(0);
            
            
                pBridgeAtoms.concat(pRingBridgeAth[rbrky]);
            
                // check wether the sequence in the bridge is as in the larger of the two rings, if not, reverse it.
                tspl = rbrky.split('-');
                if (prings[parseInt(tspl[0],10)].length >= prings[parseInt(tspl[1],10)].length) {
                  rix1 = parseInt(tspl[0],10);
                } else {
                  rix1 = parseInt(tspl[1],10);
                }
                if (!sameSenseAsRing(pRingBridgeAth[rbrky],prings[rix1])) {
                  pRingBridgeAth[rbrky].reverse();
                }
              }
            }
            elidup(pBridgeAtoms);
          }  // finds bridges in prings and collects them in the dict pRingBridgeAth{}
            // key: "ring1-ring2` (smaller index in prings first)
            // also fills the array pBridgeAtoms[]

          function pCoord(mar,bar) {
          //  1. Select the component to begin with: ring/ring system/chain according to precedence rules
          //  2. Iterate: depending on type of component plotted last plot next component until all components are plotted
          //  Calls the functions chainCoord(),ringSysCoord(),ringCoord() for actual plotting of different component types

            let breaknext = false;
            let i=0;
            let jj=0;
            let k=0;
            let kk=0;
            let latx=0;
            let asx=-1;
            let bch=-1;
            let largRSystem = -1; // index in pringsystems[] of the ring system with the largest number of rings
            let lcomp = ''; // type of last component plotted ('mchain', 'cchain', 'achain', 'ring', 'ringSys')
            let lpltchain = -1;
            let newr = 0;
            let nextchain=0;
            let nrfat = 0;
            let nrfatshift = 0;
            let numcomp = 0;
            let orpa = 0;
            let anch = 0;
            let ringOfpa = 0;
            let ringOfsi = 0;
            let sec =0;
            let found=false;
        
            // calculate total number of components to plot
            numcomp = achains.length + prings.length-1;
            // determine largest ring and if it has rsize > 8
            if (prings.length > 1) {
              k = 1;
              for (i=2;i<prings.length;i++) {
                if (prings[i].length > prings[k].length) {
                  k = i;
                }
              }
              if (prings[k].length > 8) { // the largest ring has rsize > 8
                largeRing = k;
              } else {
                largeRing = -1;
              }
            }
            // the ring system with the largest number of rings is first because pringsystems[] is sorted
            if (pringsystems.length > 0) {
              largRSystem = 0;
            }

            // choose first component to plot            
            switch (true) {
              case ((mchain > -1) || (rtchains.includes(0))): // there is a mchain or achains[0] has a ring at its end
                chainCoord(mar,bar,0,0);
                if (mchain === 0) {
                  lcomp = 'mchain';
                } else {
                  lcomp = 'achain';
                }
                plottedcomp = plottedrings.length+plottedchains.length;
                break;
              case ((achains.length > 0) && cchains.length > 0): // at least one connecting chain
                chainCoord(mar,bar,cchains[0],0);          
                plottedcchains.push(cchains[0]);
                ringOfpa = atInRing(achains[cchains[0]].pa);
                ringOfsi = atInRing(achains[cchains[0]].si);
                nrfat = achains[cchains[0]].pa;
                orpa = achains[cchains[0]].atar[0];            
                k = ringInRingSys(ringOfpa);
                if (k !== -1) {
                  ringSysCoord(mar,bar,k,orpa,nrfat,ringOfpa);
                  lcomp = 'cchain';
                } else {
                  ringCoord(mar,bar,ringOfpa,nrfat,orpa,'chend',1,prings[ringOfpa].indexOf(nrfat),0,0,'',bondlength);
                  lcomp = 'cchain';
                }  
                plottedcomp = plottedrings.length+plottedchains.length;
                break;
                //BF191230.1 ring systems and large ring have priority
              case (pringsystems.length > 0): // at least one ring system
                ringSysCoord(mar,bar,largRSystem,0,0,0);
                lcomp = 'ringSys';
                plottedcomp = plottedrings.length+plottedchains.length;
                break;
              case ((prings.length > 1) && (largeRing > 0) && (prings[largeRing].length > 8)): // there is a largest ring with size > 8
                ringCoord(mar,bar,largeRing,0,0,'first',1,0,drect.l+drect.w/2,drect.t+drect.h/2,'',bondlength);
                lcomp = 'ring';
                plottedcomp = plottedrings.length+plottedchains.length;
                break;
              case ((achains.length > 0) && (mchain < 0) && (achains[0].lv===0)): // there is no mchain but achains[0] is level 0 //BF191215.1
                chainCoord(mar,bar,0,0);  //BF191215.1
                lcomp = 'achain';  //BF191215.1
                plottedcomp = plottedrings.length+plottedchains.length;  //BF191215.1
                break;  //BF191215.1
              case ((achains.length > 0) && (mchain < 0) || (rtchains.length > 0)): // there is no mchain but one or more rtchains with a ring at the end //BF191215.1
                chainCoord(mar,bar,rtchains[0],0);  //BF191215.1
                lcomp = 'achain';  //BF191215.1
                plottedcomp = plottedrings.length+plottedchains.length;  //BF191215.1
                break;  //BF191215.1
              case ((achains.length > 0) && (achains[0].lv === 0) && (lv0ChPaInRing > 0)): // a ring containing the parent of a level 0 chain
                ringCoord(mar,bar,lv0ChPaInRing,0,0,'first',1,0,drect.l+drect.w/2,drect.t+drect.h/2,'',bondlength);
                lcomp = 'ring';
                plottedcomp = plottedrings.length+plottedchains.length;
                break;
              case (pIsolatedRings.length > 0): // only isolated rings, at least one isolated ring, no mchain
                ringCoord(mar,bar,pIsolatedRings[0],0,0,'first',1,0,drect.l+drect.w/2,drect.t+drect.h/2,'',bondlength);
                lcomp = 'ring';
                plottedcomp = plottedrings.length+plottedchains.length;
                break;
              case (achains.length > 0):
                chainCoord(mar,bar,0,0);
                lcomp = 'achain';
                plottedcomp = plottedrings.length+plottedchains.length;
                break;
            }
            
            // now iterate until all components are plotted
            while ((plottedcomp < numcomp ) && (sec < 20)) {
              sec++;
              breaknext = false;
              // try components that are connected to the last plotted component
              if (lcomp === 'cchain') {              
                // plot the ring/ring system that contains si of the last plotted cchain
                nrfat = achains[plottedcchains[plottedcchains.length-1]].si;
                orpa = achains[plottedcchains[plottedcchains.length-1]].atar.slice(-1)[0];            
                ringOfsi = atInRing(achains[plottedcchains[plottedcchains.length-1]].si);
                k = ringInRingSys(ringOfsi);
                if (k !== -1) {
                  ringSysCoord(mar,bar,k,orpa,nrfat,ringOfsi);
                  lcomp = 'ringSys';
                } else {
                  nrfatshift = prings[ringOfsi].indexOf(nrfat);
                  ringCoord(mar,bar,ringOfsi,nrfat,orpa,'chend',1,nrfatshift,0,0,'',bondlength);
                  lcomp = 'ring';
                }  
                plottedcomp = plottedrings.length+plottedchains.length;
                if (plottedcomp === numcomp) { 
                  return;
                } else {
                  continue;
                }
              // end lcomp==='cchain' section
              } else if (lcomp === 'achain') { 
                lpltchain = plottedchains[plottedchains.length-1];
                nrfat = achains[lpltchain].si;
                orpa = achains[lpltchain].atar.slice(-1)[0]; //orpa is the last atom of the last chain plotted
                switch (true) {
                  case ((nrfat > 0) && (orpa !== undefined) && (atInRing(nrfat) > 0) && (!(plottedrings.includes(atInRing(nrfat))))):
                    //case1
//                    sibling of last plotted chain is ≠0 and points to an unplotted ring
                    newr = atInRing(nrfat);
                    k = ringInRingSys(newr);
                    if (k >= 0) { // ring is part of ring system
                      ringSysCoord(mar,bar,k,orpa,nrfat,newr);
                      plottedcomp = plottedrings.length+plottedchains.length;
                      lcomp = 'ringSys';
                      if (plottedcomp === numcomp) { 
                        return; 
                      }              
                    } else { // si is in isolated ring
                      nrfatshift = prings[newr].indexOf(nrfat);
                      ringCoord(mar,bar,newr,nrfat,orpa,'chend',1,nrfatshift,0,0,'',bondlength);
                      plottedcomp = plottedrings.length+plottedchains.length;
                      lcomp = 'ring';
                      if (plottedcomp === numcomp) { 
                        return; 
                      }
                    }
                    break;
                  case ((nrfat>0) && (!hasCoord(mar,nrfat))):  // sibling of last plotted chain is > 0 and unplotted 
                    //case2
                    nextchain=chainOf(achains,nrfat);
                    if (nextchain > -1) {
                      if (nrfat===achains[nextchain].atar[0]) {
                        chainCoord(mar,bar,nextchain, orpa);   
                        plottedcomp = plottedrings.length+plottedchains.length;
                        lcomp = 'achain';
                        if (plottedcomp === numcomp) {                       
                          return;
                        }                            
                      } else if (nrfat===achains[nextchain].atar.slice(-1)[0]) {
                        reverseChain(achains,nextchain);                          
                        chainCoord(mar,bar,nextchain,achains[nextchain].pa);   
                        plottedcomp = plottedrings.length+plottedchains.length;
                        lcomp = 'achain';
                        if (plottedcomp === numcomp) {                       
                          return;
                        }
                      } else {
                        split_achain(achains,nextchain,achains[nextchain].atar.indexOf(nrfat));
                        if (!hasCoord(mar,achains[achains.length-1].pa)) { // pa of new chain is unplotted, use last atom of last plotted chain as pa
                          achains[achains.length-1].pa= achains[lpltchain].atar.slice(-1)[0];
                        }
                        numcomp++;
                        chainCoord(mar,bar,achains.length-1, achains[achains.length-1].pa);   
                        plottedcomp = plottedrings.length+plottedchains.length;
                        lcomp = 'achain';
                        if (plottedcomp === numcomp) {                       
                          return;
                        }
                      }
                    }
                    break;
                  case ((achains[lpltchain].pa > 0) && (!hasCoord(mar,achains[lpltchain].pa))): // lpltchain has parent which is unplotted
                    //case3
                    nextchain=chainOf(achains,achains[lpltchain].pa);
                    if (nextchain > -1) { // parent is in unplotted chain
                      if (achains[lpltchain].pa===achains[nextchain].atar[0]) {
                        chainCoord(mar,bar,nextchain, achains[lpltchain].atar[0]);   
                        plottedcomp = plottedrings.length+plottedchains.length;
                        lcomp = 'achain';
                        if (plottedcomp === numcomp) {                       
                          return;
                        }                            
                      } else if (achains[lpltchain].pa===achains[nextchain].atar.slice(-1)[0]) {
                        reverseChain(achains,nextchain);                          
                        chainCoord(mar,bar,nextchain,achains[lpltchain].atar[0]);   
                        plottedcomp = plottedrings.length+plottedchains.length;
                        lcomp = 'achain';
                        if (plottedcomp === numcomp) {                       
                          return;
                        }
                      } else {
                        split_achain(achains,nextchain,achains[nextchain].atar.indexOf(achains[lpltchain].pa));
                        if (!hasCoord(mar,achains[achains.length-1].pa)) { // pa of new chain is unplotted, use 1st atom of last plotted chain as pa
                          achains[achains.length-1].pa = achains[lpltchain].atar[0];
                        }
                        numcomp++;
                        chainCoord(mar,bar,achains.length-1, achains[achains.length-1].pa);   
                        plottedcomp = plottedrings.length+plottedchains.length;
                        lcomp = 'achain';
                        if (plottedcomp === numcomp) {                       
                          return;
                        }
                      }
                    } else { // is unplotted pa of lastchain in ring ?
                      newr = atInRing(achains[lpltchain].pa);
                      if (newr > 0) { // pa is in ring
                        k = ringInRingSys(newr);
                        if (k >= 0) { // ring is part of ring system
                          ringSysCoord(mar,bar,k,achains[lpltchain].atar[0],achains[lpltchain].pa,newr);
                          plottedcomp = plottedrings.length+plottedchains.length;
                          lcomp = 'ringSys';
                          if (plottedcomp === numcomp) { 
                            return; 
                          }              
                        } else { // pa is in isolated ring
                          nrfatshift = prings[newr].indexOf(achains[lpltchain].pa);
                          ringCoord(mar,bar,newr,achains[lpltchain].pa,achains[lpltchain].atar[0],'chend',1,nrfatshift,0,0,'',bondlength);
                          plottedcomp = plottedrings.length+plottedchains.length;
                          lcomp = 'ring';
                          if (plottedcomp === numcomp) { 
                            return; 
                          }
                        }
                      }                        
                    }
                    break;
                  case (((achains[lpltchain].si===0) || hasCoord(mar,achains[lpltchain].si)) && ((achains[lpltchain].pa===0) || hasCoord(mar,achains[lpltchain].pa))):
                  //case4
                    // both si and pa of last plotted chain are either 0 or already plotted
                    // plot any chain that has a plotted pa or si and is not plotted yet
                    found=false;
                    if  (plottedchains.length > 0) {
                      for (jj=0;jj<achains.length;jj++) { // search through all unplotted achains
                        if (plottedchains.includes(jj)) {
                          continue; //skip plotted chains
                        }
                        if ((achains[jj].pa > 0) && (hasCoord(mar,achains[jj].pa))) {
                          chainCoord(mar,bar,jj,achains[jj].pa);
                          plottedcomp = plottedrings.length+plottedchains.length;
                          lcomp = 'achain';
                          found=true;
                          if (plottedcomp === numcomp) {                       
                            return;
                          }
                        } 
                        if ((!found) && (achains[jj].si > 0) && (hasCoord(mar,achains[jj].si))) {
                        // plot any chain that has a plotted si and is not plotted yet in reverse
                          reverseChain(achains,jj);
                          chainCoord(mar,bar,jj,achains[jj].pa);                      
                          plottedcomp = plottedrings.length+plottedchains.length;
                          lcomp = 'achain';
                          found=true;
                          if (plottedcomp === numcomp) {                       
                            return;
                          }
                        } 
                        if (!found) {
                          asx=achains[jj].atar[0];
                          for (kk=0;kk<mar[asx].bpa.length;kk++) { //search all bonding partners of first atom
                            if (hasCoord(mar,mar[asx].bpa[kk].p)) { // first atom
                              chainCoord(mar,bar,jj, mar[asx].bpa[kk].p);
                              plottedcomp = plottedrings.length+plottedchains.length;
                              lcomp = 'achain';
                              found=true;
                              if (plottedcomp === numcomp) {                       
                                return;
                              }
                            } 
                          }
                        }
                        if (!found) {
                          asx=achains[jj].atar.slice(-1)[0];
                          for (kk=0;kk<mar[asx].bpa.length;kk++) { //search all bonding partners of last atom
                            if (hasCoord(mar,mar[asx].bpa[kk].p)) { // last atom
                              chainCoord(mar,bar,jj, mar[asx].bpa[kk].p);
                              plottedcomp = plottedrings.length+plottedchains.length;
                              lcomp = 'achain';
                              found=true;
                              if (plottedcomp === numcomp) {                       
                                return;
                              }
                            } 
                          }
                        }
                        if(!found) {
                          k=1;
                          while ((k < achains[jj].atar.length-1) && (!found)) { //all inner atomSmiles
                            asx=achains[jj].atar[k];
                            for (kk=0;kk<mar[asx].bpa.length;kk++) { //search all bonding partners of this atom
                              if (hasCoord(mar,mar[asx].bpa[kk].p)) { // last atom
                                chainCoord(mar,bar,jj, mar[asx].bpa[kk].p);
                                plottedcomp = plottedrings.length+plottedchains.length;
                                lcomp = 'achain';
                                found=true;
                                if (plottedcomp === numcomp) {                       
                                  return;
                                }
                              } 
                            }
                            k++;
                          }
                        }
                      }
                    }
                    if ((!found) && (plottedrings.length > 0)) {
                      for (jj=1;jj<prings.length;jj++) {
                        if (plottedrings.includes(jj)) {
                          continue;
                        }
                        for (k=0;k<prings[jj].length;k++) {
                          asx=prings[jj][k];
                          for (kk=0;kk<mar[asx].bpa.length;kk++) {
                            if (hasCoord(mar,mar[asx].bpa[kk].p)) {
                              if (ringInRingSys(jj) > -1) {
                                ringSysCoord(mar,bar,ringInRingSys(jj),mar[asx].bpa[kk].p,asx,jj);
                                lcomp = 'ringSys';
                              } else {
                                ringCoord(mar,bar,jj,asx,mar[asx].bpa[kk].p,'chend',1,k,0,0,'',bondlength);
                                lcomp = 'ring';
                              }
                              found=true;
                              plottedcomp=plottedrings.length+plottedchains.length;
                              if (plottedcomp === numcomp) {                       
                                return;
                              }
                            }                              
                          }
                        }
                      }
                    }
                    break;
                  default:
                    //Case5
                    //last measure: find a bond between unplotted component and plotted atom
                  // check whether the last plotted atom of the last plotted chain is bound to an atom of an unplotted chain 
                    latx = achains[plottedchains.slice(-1)[0]].atar.slice(-1)[0];
                    for (k=0;k<mar[latx].bpa.length;k++) {
                      if (hasCoord(mar,mar[latx].bpa[k].p)===false) { // bonding partner is unplotted
                        //figure out in which chain it is
                        bch=chainOf(achains, mar[latx].bpa[k].p);
                        if ((bch > -1) && (achains[bch].atar[0]===mar[latx].bpa[k].p)) {
                          chainCoord(mar,bar,bch,latx);
                          plottedcomp = plottedrings.length+plottedchains.length;
                          lcomp = 'achain';
                          if (plottedcomp === numcomp) {                       
                            return;
                          } else {
                            breaknext = true; 
                            break;
                          }
                        } else if ((bch > -1) && (achains[bch].atar.slice(-1)[0]===mar[latx].bpa[k].p)) {
                          reverseChain(achains,bch);
                          chainCoord(mar,bar,bch,latx);
                          plottedcomp = plottedrings.length+plottedchains.length;
                          lcomp = 'achain';
                          if (plottedcomp === numcomp) {                       
                            return;
                          } else {
                            breaknext = true; 
                            break;
                          }
                        }
                      }                          
                    }  // end for k
                    break;
                   } // end switch                       
               } else if ((lcomp === 'ring') || (lcomp === 'ringSys')) { // last plotted component was a ring
                  // ring to ring direct connection from plotted to unplotted ring?

                if (pr2rjh.length > 0) {
                  nrfat = 0;
                  newr = 0;
                  orpa = 0;
                  for (jj=0;jj<pr2rjh.length;jj++) {
                    if ((hasCoord(mar,pr2rjh[jj].a1)) && (!hasCoord(mar,pr2rjh[jj].a2))) {
                      nrfat = pr2rjh[jj].a2;
                      newr = atInRing(nrfat); // find out to which ring a2 belongs
                      orpa = pr2rjh[jj].a1;                  
                    } else if ((hasCoord(mar,pr2rjh[jj].a2)) && (!hasCoord(mar,pr2rjh[jj].a1))) { // find out to which ring a1 belongs
                      nrfat = pr2rjh[jj].a1;
                      newr = atInRing(nrfat); // find out to which ring a1 belongs
                      orpa = orpa = pr2rjh[jj].a2;                                      
                    }
                    if (nrfat > 0) {
                      k = ringInRingSys(newr);
                      if (k >= 0) { // ring is part of ring system
                        ringSysCoord(mar,bar,k,orpa,nrfat,newr);
                        plottedcomp = plottedrings.length+plottedchains.length;
                        lcomp = 'ringSys';
                        if (plottedcomp === numcomp) { 
                          return;
                        } else {
                          breaknext = true;
                          break;
                        }  
                      } else { // isolated ring
                        nrfatshift = prings[newr].indexOf(nrfat);
                        ringCoord(mar,bar,newr,nrfat,orpa,'chend',1,nrfatshift,0,0,'',bondlength);
                        plottedcomp = plottedrings.length+plottedchains.length;
                        lcomp = 'ring';
                        if (plottedcomp === numcomp) { 
                          return;
                        } else {
                          breaknext = true;
                          break;
                        }  
                      }
                    } 
                  }
                  if (breaknext) {
                    breaknext = false;
                    continue; // jump to end of while
                  }              
                }
                // plot any unplotted chain that has pa or si in a plotted ring/ring system
                found=false;
                for (jj=0;jj<achains.length;jj++) {
                  if (plottedchains.includes(jj)) { continue; } //skip plotted chains
                  if ((lcomp === 'ring') || (lcomp === 'ringSys')) {
                    if ((atInRing(achains[jj].pa) > 0) && (plottedrings.includes(atInRing(achains[jj].pa)))) {
                      chainCoord(mar,bar,jj,achains[jj].pa);
                      lcomp = 'achain';
                      plottedcomp = plottedrings.length+plottedchains.length;
                      found=true;
                    } else if ((atInRing(achains[jj].si) > 0) && (plottedrings.includes(atInRing(achains[jj].si)))) {
                      reverseChain(achains,jj);
                      chainCoord(mar,bar,jj,achains[jj].pa);
                      lcomp = 'achain';
                      plottedcomp = plottedrings.length+plottedchains.length;
                      found=true;
                    }
                    if (plottedcomp === numcomp) { 
                      return;
                    }
                    if (found) { // exit for over all unplotted chains if one was found and plotted
                      break;
                    }
                  }
                } // end for all chains                  
                if (breaknext) {
                  breaknext = false;
                  continue; // jump to end of while
                }
              } // end ((lcomp === 'ring') || (lcomp === 'ringSys')) section
          
              // whatever the last component was, plot the first unplotted chain that has a plotted pa
              for (i=0;i<achains.length;i++) {
                if (!plottedchains.includes(i)) {
                  if ((achains[i].pa > 0) && (hasCoord(mar,achains[i].pa))) {
                    chainCoord(mar, bar, i,0);
                    lcomp = 'achain';
                    plottedcomp = plottedrings.length+plottedchains.length;
                    if (plottedcomp === numcomp) { 
                      return;
                    } else {
                      break;
                    }
                  }
                }
              }
              // whatever the last component was, plot the first unplotted ring that has an atom bound to a plotted chain atom
              for (i=1;i<prings.length;i++) {
                newr = 0;
                if (!plottedrings.includes(i)) {
                  for (jj=0;jj<prings[i].length;jj++) { // test all atoms jj of this ring
                    for (k=0;k<mar[prings[i][jj]].bpa.length;k++) { // for all bonding partners of this ring atom
                      if ((atInRing(mar[prings[i][jj]].bpa[k].p) === 0) && (hasCoord(mar,mar[prings[i][jj]].bpa[k].p) === true)) { 
                      // bonding partner is not in a ring and is plotted
                        nrfat = prings[i][jj];
                        orpa = mar[prings[i][jj]].bpa[k].p;
                        if (ringInRingSys(i) > -1) {
                          ringSysCoord(mar,bar,ringInRingSys(i),orpa,nrfat,i);                      
                          lcomp = 'ringSys';
                        } else {
                          ringCoord(mar,bar,i,nrfat,orpa,'chend',1,jj,0,0,'',bondlength);
                          lcomp = 'ring';
                        }
                        plottedcomp = plottedrings.length+plottedchains.length;
                        if (plottedcomp === numcomp) { 
                          return;
                        } else {
                          breaknext = true;
                          break;
                        }
                      }              
                    }
                    if (breaknext) {
                      break;
                    }
                  }
                  if (breaknext) {
                    break;
                  }
                }
              }
              if (breaknext) {
                breaknext = false;
                continue;
              }
              // whatever the last component was, plot the first unplotted chain that has its 1st atom bound to a plotted ring atom
              for (i=0;i<achains.length;i++) {
                if (plottedchains.includes(i)) { // search only among the unplotted chains
                  continue;
                }
                for (jj=1;jj<prings.length;jj++) {
                  if (!plottedrings.includes(jj)) { // only consider plotted rings
                    continue;
                  }
                  for (k=0;k<prings[jj].length;k++) { // check all ring atoms
                    if (getBondIndex(bar,prings[jj][k],achains[i].atar[0]) > -1) { // ring atom is bound to 1st chain atom
                      anch = prings[jj][k]; // anch takes over the role of pic for anchoring
                      chainCoord(mar, bar, i,anch);
                      lcomp = 'achain';
                      plottedcomp = plottedrings.length+plottedchains.length;
                      if (plottedcomp === numcomp) { 
                        return;
                      } else {
                        breaknext = true;
                        break;
                      }                    
                    }
                  }
                  if (breaknext) {
                    break;
                  }                
                }
                if (breaknext) {
                  break;
                }
              }          
              if (breaknext) {
                breaknext = false;
                continue;
              }
            } // end while (plottedcomp < numcomp )
            
            if (plottedcomp !== numcomp) {
               ploterr='Not all components plotted';
            }              
                    
          } // calculate all coordinates of the molecule by synthesis from ringsystems/chains/rings
  
          function chainCoord(mar,bar,acx,anc) { // param: acx is the index of the chain in achains[]
            let ax = 0;
            let cumul = [];
            let i;
            let anchor = 0;
            let maxzig = Math.floor(arect.w/(0.866*bondlength))-3;
            let nco = new Coord(0,0);
            let tatar = [];
            let cpezhkey = '';          
            let utnr = 0;
            let turnat = 0;
            let uturnsense = 1;
            let zig = 0;
        
            tatar = achains[acx].atar.slice(0);
            if (anc > 0) {
              anchor = anc;
            } else if (acx !== mchain) {
              anchor = achains[acx].pa;
            }
//             console.log("chainCoord for achains["+acx+"]:");
            for (i=0;i<tatar.length;i++) {
              ax = tatar[i]; // the index of the next chain atom in mar (atom number)
              if (pezh[String(anchor)+'-'+String(ax)] !== undefined) { // next atom is dba2 of ezDB: set cpezhkey 
                cpezhkey = String(anchor)+'-'+String(ax);
              }
              // check for cumulene in ezCC here
              if ((is_ezCCend(ax)) && (cpezhkey === '')) {
                if (pezh[String(ax)+'-'+String(is_ezCCend(ax))] !== undefined) {
                  cpezhkey = String(ax)+'-'+String(is_ezCCend(ax));
                }
              }
              nco = propNextChainCoord(mar,bar,acx,i,pic[ax],anchor);
              // reset cpezhkey if ax was the last ligand of pezh[cpezhkey].t
              if (((cpezhkey !== '') && (prfs[ax]!=='=') && (pezh[cpezhkey].tl2 !==0) && (pezh[cpezhkey].tl2 === ax)) ||
                ((cpezhkey !== '') && (prfs[ax]!=='=') && (pezh[cpezhkey].tl2 ===0) && (pezh[cpezhkey].tl1 === ax))) {
                if (is_pezh_f(ax) !== '') { // t-ligand of one ezDB is also the f of a pezh[] (conj DB)
                  cpezhkey = is_pezh_f(ax);
                } else {
                  cpezhkey = '';
                }
              }
              mar[ax].x = nco.x;
              mar[ax].y = nco.y;  
//               console.log("["+ax+"] x="+f1(mar[ax].x)+" y="+f1(mar[ax].y)); 
            }
            plottedchains.push(acx); // record chain as plotted
            plotorder += "achains["+acx+"] "+achains[acx].atar.join()+"\n";
        
            function propNextChainCoord(mar,bar,ach,acix,lix,ank) { 
            // parameters:
            // ach is the index of the chain in achains
            // acix is the index of the atom in achains[ach].atar[]
            // lix the index of the parent/incomig atom in mar[]
              let jj = 0;
              let refdi = 0;
              let ddi = 0; // delta dir in °
              let ndir = 0; // the new direction
              let dir1 = 0;
              let dir2 = 0;
              let dir3 = 0;
              let dx = 0;
              let dy = 0;
              let bosq = '';
              let paix = -1;
              let lixnrbp =0;
              let bix1 = 0;
              let bix2 = 0;
              const coo = new Coord(0,0);

//               console.log("propNextChainCoord called with ach="+ach+" acix="+acix+" lix="+lix+" ank="+ank);

              paix = ank;
//               console.log("ach="+ach+" mchain="+mchain+" paix="+paix);
              lixnrbp = 0;
              for (jj=0;jj<mar[lix].bpa.length;jj++) {
                if (atInRh[String(mar[lix].bpa[jj].p)] !== undefined) {
                  lixnrbp++;
                }
              }
              if (acix === 0) { // first atom of chain
                if ((ach === mchain) || (plottedcomp===0)) { // main chain: first atom is placed absolute
//                   console.log("drect.l="+drect.l+" drect.t="+drect.t+" drect.h="+drect.h);
                  coo.x = drect.l+20;
                  coo.y = drect.t + drect.h/2;
                } else if ((plottedchains.length === 0) && (cchains.includes(ach))) { // connecting chain
                //the very first chain to be plotted is a connecting chain
                //determine its approx. length and start half of its length to the left of canvas center              
                  coo.x = drect.l+drect.w/2-(achains[ach].atar.length-1)*bondlength*0.866/2;
                  coo.y = drect.t + drect.h/2;              
                } else  {             
                  ndir = propBestDir(mar,bar,paix);
                  coo.x = mar[paix].x + bondlength*Math.cos(Math.PI*ndir/180);
                  coo.y = mar[paix].y - bondlength*Math.sin(Math.PI*ndir/180);
                  if (is_pezh_f(paix) !== '') { // anchor is f of pezh[]
                    cpezhkey = is_pezh_f(paix);
                    if (pezh[cpezhkey].t !== tatar[acix]) {
                      cpezhkey = '';
                    }
                  }
                }
//                 console.log("ach="+ach+" acix="+acix+" coo.x="+f1(coo.x)+" coo.y="+f1(coo.y));
                return coo;
              }
              if (acix === 1) { // 2nd atom in chain
                // determine the reference direction (refdi) from last bond in chain)
                if ((ach === mchain) || ((plottedchains.length === 0) && ((rtchains.includes(ach)) || (cchains.includes(ach))))) { //main chain, rtchain or cchain
                  if ((mar.length===3) || (is_linearChain(mar,tatar)) || ((tatar.length > 2) && (is_TBatom(mar,tatar[acix]) > 0) && (is_TBatom(mar,tatar[acix]) !== tatar[0]))) { //BF191024.2
                    refdi=300; //BF191024.2
//                     console.log("case 1: refdi="+f1(refdi));
                  } else { //BF191024.2
                    refdi = 330; //BF191024.2
//                     console.log("case 2: refdi="+f1(refdi));
                  } //BF191024.2
                } else if (hasCoord(mar,paix) && hasCoord(mar,lix)) { // anchored chain, use bond from achor to 1st atom if both are plotted //BF191231.3
                  refdi = getdiranglefromAt(mar,paix,lix); //BF191231.3
//                   console.log("case 3: refdi="+f1(refdi));
                } else { //BF191231.3
                  refdi = 270; //BF191231.3 chain will start in direction 330°
//                   console.log("case 4: refdi="+f1(refdi));
                }
                // DB from anchor to first atom ?
                bix2 = getBondIndex(bar,paix,lix); //  bond from anchor to 1st atom
                bix1 = getBondIndex(bar,lix,tatar[acix]); // // the current new bond between lix and tatar[acix]
                if ((bix2 > 0) && (bar[bix2].btyp === 2)) { // the bond from anchor to 1st atom of chain is DB
                  if (pezh[String(paix)+'-'+String(lix)] !== undefined) { // ezDB from parent to 1st atom, not ezCumulene
                    cpezhkey = String(paix)+'-'+String(lix);
                    ddi = pezh2dir(mar,cpezhkey,tatar[acix]);
                  } else if ((bar[bix1].btyp === 2) && (mar[lix].bpa.length===2)) {  //BF200130.2
                  // bond between 1st atom and 2nd atom is also a DB and lix has 2 ligands: exocyclic cumulene 
                    cumul[0] = paix;
                    cumul.push(lix);
                    cumul.push(tatar[acix]);
                    ddi = 0; // linear
                  } else {  // singe bond after exocyclic DB
                    ddi = 60;
                  }            
                } else if (bar[bix1].btyp === 3) { // triple bond between 1st and 2nd atom of chain //BF 180901
                  if (mar.length===3) {
                    ddi=60;
                  } else {
                    ddi = 0;  //BF 180901#
                  }          
                } else { // the exocyclic bond is not a DB
                  if (pezh[String(tatar[acix-1])+'-'+String(tatar[acix])] !== undefined) { // ezDB from 1st atom to 2nd
                    cpezhkey = String(tatar[acix-1])+'-'+String(tatar[acix]); //triggered when tatar[acix] is pezh[cpezhkey].t
                  }
                  if ((mar[lix].bpa.length === 4) && ((!pscAtoms.includes(lix)) || (lixnrbp > 1))) {
                    ddi = 0;
                  } else if ((bar[getBondIndex(bar,lix,tatar[acix])].btyp===2) && (mar[lix].an === 6) && (mar[lix].bpa.length===2) && (mar[lix].c === 1) && (mar[tatar[acix]].an > 6)) {
                    ddi = 0;
                  } else {
                    ddi = (acix % 2 === 1)? 60 : -60; //determine the deltadir
                  }
                  zig++;            
                }
              } else if (acix > 1) { // 3rd or higher atom of chain use last bond in chain
                refdi = getdiranglefromAt(mar,tatar[acix-2],lix);              
            
                // determine bond orders
                bix1 = getBondIndex(bar,lix,tatar[acix]);
                bix2 = getBondIndex(bar,tatar[acix-2],lix);
                bosq = String(bar[bix1].btyp)+"."+String(bar[bix2].btyp);
                switch (bosq) { // determine the deltadir
                  case '1.1': // single bond after single bond: zig-zag
                    if (acix > 2) {
                      refdi = getdiranglefromAt(mar,tatar[acix-3],tatar[acix-2]); // refdi from 2nd last bond
                      if (zig >= maxzig) { // right limit of arect reached
                        refdi = getdiranglefromAt(mar,tatar[acix-2],tatar[acix-1]); // refdi from last plotted bond
                        if ((refdi > 180) && (turnat === 0)) { //trigger U-turn only when last bond is right/down or left/down
                          turnat = 1;
                          utnr++;
                          uturnsense = (refdi > 270)? -1 : 1;
                        } else if (turnat === 0) { // refdi was up/right or up/left: one more zig-zag
                          refdi = getdiranglefromAt(mar,tatar[acix-3],tatar[acix-2]); // refdi from 2nd last bond                        
                          ddi = 0;
                          zig++;
                          break;
                        }
                        if ((turnat > 0) && (turnat < 4)) { // the 3 atoms in the turn with cis bonds
                          ddi = uturnsense*60;
                          zig++;
                          turnat++;
                        } else if (turnat === 4) {                    
                          refdi = getdiranglefromAt(mar,tatar[acix-3],tatar[acix-2]);
                          ddi = 0;
                          turnat = 0;
                          maxzig += ((utnr % 2) === 1)? -1 : +1;
                          zig = 3;
                        }
                      } else { // maxzig not reached yet
                        if ((mar[lix].bpa.length === 4) && ((!pscAtoms.includes(lix)) || (lixnrbp > 1))) { // 4 ligands, not sc and not two ring-ligands
                          refdi = getdiranglefromAt(mar,tatar[acix-2],tatar[acix-1]); // refdi from last bond
                          ddi = 0;  // linear
                        } else {
                          dir1 = getdiranglefromAt(mar,tatar[acix-2],tatar[acix-1]);
                          dir2 = getdiranglefromAt(mar,tatar[acix-3],tatar[acix-2]);
                          if (Math.abs(dir1-dir2) > 2) { //last and second last bond are not linear
                            getdiranglefromAt(mar,tatar[acix-3],tatar[acix-2]); // refdi from second-last bond
                            ddi = 0;
                            zig++;
                          } else { // last and second-last bonds are linear
                            if (acix > 3) {
                              dir3 = getdiranglefromAt(mar,tatar[acix-4],tatar[acix-3]); // dir of bond before linear 2-bond stretch
                              if (Math.abs(dir2-dir3) > 2) {
                                refdi = getdiranglefromAt(mar,tatar[acix-4],tatar[acix-3]); // not 3 linear bonds
                                ddi = 0;
                              } else {
                                refdi = getdiranglefromAt(mar,tatar[acix-2],tatar[acix-1]); // 3 linear bonds, enforce zig-zag
                                ddi = (acix % 2 === 1)? 60 : -60;
                              }                              
                            } else {
                              refdi = getdiranglefromAt(mar,tatar[acix-2],tatar[acix-1]);
                              ddi = (acix % 2 === 1)? 60 : -60;
                            }
                            zig++;
                          }
                        }
                      }
                    } else {
                      ddi = (acix % 2 === 1)? 60 : -60;
                      zig++;
                    }
                    break;
                  case '1.2': // single bond after double bond: check for EZ and cumulene
                    if (cpezhkey !== '') { // t-ligand of ezDB or ezCumulene
                        refdi = getdiranglefromAt(mar,tatar[acix-2],tatar[acix-1]);
                        ddi = pezh2dir(mar,cpezhkey,tatar[acix]);
                        cpezhkey = '';
                    } else { // DB or Cumulene was not EZ                   
                      // take refdir from nonEZ-DB bond or last cumulene bond or nonEZ-DB
                      refdi = getdiranglefromAt(mar,tatar[acix-2],tatar[acix-1]);                    
                      ddi = ((refdi > 90 ) && (refdi < 270))? 60 : -60;
                      cumul=[];
                    }
                    break;
                  case '1.3': // single bond after triple bond: straight
                    ddi = 0;
                    break;
                  case '2.1': // double bond after single bond: zig-zag
                      // check for ezDB
                    if (pezh[String(lix)+'-'+String(tatar[acix])] !== undefined) { // ezDB from lix to tatar[acix]
                      cpezhkey = String(lix)+'-'+String(tatar[acix]);
                    }
                    //BUGFIX 181011.2
                    if ((mar[lix].an === 16) && (mar[lix].bpa.length===4)) { //sulfate/sufonate use 4x90°
                      refdi = getdiranglefromAt(mar,tatar[acix-2],tatar[acix-1]);
                      ddi = 0;
                      break;
                    }
                    if ((mar[lix].an === 6) && (mar[lix].bpa.length===2) && (mar[lix].c === 1) && (mar[tatar[acix]].an > 6)) {
                      refdi = getdiranglefromAt(mar,tatar[acix-2],tatar[acix-1]);
                      ddi = 0;
                      break;
                    }  
                    if (acix > 2) {
                      refdi = getdiranglefromAt(mar,tatar[acix-3],tatar[acix-2]);
                      if (Math.abs(getdiranglefromAt(mar,tatar[acix-3],tatar[acix-2])-getdiranglefromAt(mar,tatar[acix-2],tatar[acix-1])) > 2) {                  
                        ddi = 0;
                      } else {
                        ddi = (acix % 2 === 1)? 60 : -60;                    
                      }
                    } else if ((acix === 2) && (paix > 0) && hasCoord(mar,paix)) { //BF201202.1 only if paix is plotted
                      refdi = getdiranglefromAt(mar,paix,tatar[0]);
                      ddi = 0;
                    } else {
                      ddi = (acix % 2 === 1)? 60 : -60;
                    }
                    break;
                  case '2.2': // double bond after double bond: cumulene
                    if (mar[lix].bpa.length===2) {
                      if (cumul.length === 0) { // initial registration of 3 atoms as cumulene
                        cumul.push(tatar[acix-2]);
                        cumul.push(tatar[acix-1]);
                        cumul.push(tatar[acix]);
                      } else { // register atom in existing cumulene
                        cumul.push(tatar[acix]);                  
                      }
                      ddi = 0;
                    } else {
                      ddi = (acix % 2 === 1)? 60 : -60;
                    }
                    break;
                  case '3.1': // triple bond after single bond: straight
                    if (mar[lix].bpa.length===2) {
                      ddi = 0;
                    } else {
                      ddi = (acix % 2 === 1)? 60 : -60;
                    }
                    break;
                  default:
                      ddi = (acix % 2 === 1)? 60 : -60;
                      break;                    
                }
              }
              // determine the final direction
              ndir = norma(refdi + ddi); 
//               console.log("achains["+ach+"]: acix="+acix+" ndir="+f1(ndir)); //BF200903.2
        
              dx = bondlength*Math.cos(Math.PI*ndir/180);
              dy = (-1)*bondlength*Math.sin(Math.PI*ndir/180);
              coo.x = mar[lix].x + dx;
              coo.y = mar[lix].y + dy;        
//               console.log("ach="+ach+" acix="+acix+" lix="+lix+" bl="+bondlength+" ddi="+f1(ddi)+" coo.x="+f1(coo.x)+" coo.y="+f1(coo.y));
              return coo;
            } // proposes the coordinates of the next chain atom based on its incoming atom

          } // calculate all coordinates of an achain
      
          function ringSysCoord(mar,bar,rsy,ancat,fat,firi) {
            // param:
            //  rsy: the index of the ringsystem to be plotted in pringsystems[]
            //   ancat: the achain atom to which a ring system is fixed if it is not the only one, 0 otherwise
            //  fat: the ring atom in firi which is bound to ancat in the anchoring chain
            //  firi: the ring (index in prings[]) that contains the atom bound to ancat
            //
            // Procedure:
            // the ring system is sorted according to ring-size (decreasing).
            // If ancat is 0: 
            //  if a large ring (rsize > 8) is part of the ring system: begin with this ring 
            //  if the ring system contains emfu rings, begin with one of them
            //  otherwise, begin with the largest ring.
            // Then plot the rings that are fused by one bond to the already plotted ones first, then the ones that are fused
            // via a bridge then the ones that are fused in spiro mode
            // All rings of the ring system that are plotted are recorded in plottedRinRS[].
        
            // If ancat > 0, the ring containing the atom bound to ancat is plotted first in the 'chend' mode of ringCoord()
            // then the same sequence as above is used: fused by bond, then fused by bridge, then spiro.
            // 
            // Reapeat until all rings are plotted and plottedRinRS.length === pringsystems[rsy].length.
        
            let at2m1 = 0; // the second last atom of a bridge fusion
            let bl = bondlength;
            let bpo2 = 0; // bonding partner of fat2 in orix
            let brdgky = ''; // the key for the bridge dict
            let fat1 = 0; // the r1 atom of a fusion
            let fat1shift = 0;
            let fat2 = 0; // the r2 atom of a fusion
            let first_ring_to_plot = 0;
            let fusix = -1;
            let i=0;
            let jj=0;
            let k=0;
            let nringsense = 1;
            let nrix = 0; // index of ring to be plotted in prings[]
            let oringsense = 1;
            let orix = 0; // index of plotted ring in prings[]
            const plottedRinRS = [];
            let remainingRingsInRsys = [];
            let ringext = []; // array of ring atoms extended by a copy of the first element at the end.
            let ris = 0;
            let sec = 0;
            let spirix = -1;

            if ((firi > 0) && (pringsystems[rsy].includes(firi))) { // if the rings system is attached via ring firi
              // rotate ringsystem array to get firi first
              while (pringsystems[rsy].indexOf(firi) > 0) {
                pringsystems[rsy] = pringsystems[rsy].splice(1,pringsystems[rsy].length).concat(pringsystems[rsy][0]);
              }
              if (fat > 0) {
                first_ring_to_plot=pringsystems[rsy][0];
                fat1shift = prings[firi].indexOf(fat);            
                ringCoord(mar,bar,pringsystems[rsy][0],fat,ancat,'chend',1,fat1shift,0,0,'',bondlength);
                plottedRinRS.push(pringsystems[rsy][0]);
              }
            } else {           
              // sort rings in ringsystem: rings containing bridge atoms first then according to decreasing size of rings (largest first)
              pringsystems[rsy].sort((a, b) => prings[b].length - prings[a].length);
              // search for the largest mancude ring in the ringsystem
              first_ring_to_plot = pringsystems[rsy][0]; // the largest ring as default
              for (i=0;i<pringsystems[rsy].length;i++) {
                if (mar[prings[pringsystems[rsy][i]][0]].ar) { // first atom in ring is emfu
                  if (largeRing === -1) { // only if there is no largeRing > 8
                    first_ring_to_plot = pringsystems[rsy][i];
                  }
                  break;
                }
              }
              ringCoord(mar,bar,first_ring_to_plot,0,0,'first',1,0,drect.l+drect.w/2,drect.t+drect.h/2,'',bondlength);
              plottedRinRS.push(first_ring_to_plot);
            }    
            remainingRingsInRsys = pringsystems[rsy].slice(0); // make copy of pringsystems[rsy]
            remainingRingsInRsys.splice(remainingRingsInRsys.indexOf(first_ring_to_plot),1); // remove first_ring_to_plot
            remainingRingsInRsys.sort((a, b) => { // sort the remaining rings
              // rings with bridge atoms come first, then according to size
              if (ringHasBridgeAt(mar,a) !== ringHasBridgeAt(mar,b)) {
                return ringHasBridgeAt(mar,a) ? -1 : 1;
              } else {
                return prings[b].length - prings[a].length;
              }
            });
          
            remainingRingsInRsys.unshift(first_ring_to_plot);
            pringsystems[rsy] = remainingRingsInRsys.slice(0);
          
            // first ring
            // for large first ring (>8): shift atoms such that geminal ring fusion bonds are in trans region
            sec=0;
            while ((sec < 20) && (plottedRinRS.length < pringsystems[rsy].length)) {
              // search for one bond fusions between plotted and unplotted rings

              for (i=0;i<plottedRinRS.length;i++) {
                for (jj=0;jj<pringsystems[rsy].length;jj++) { 
                  fusix = -1;
                  ringext = []; 
                  if (!plottedRinRS.includes(pringsystems[rsy][jj])) { // not plotted yet
                    // do rings i and jj have a fusion bond ?
                    fusix = ringFusionsIx(plottedRinRS[i],pringsystems[rsy][jj]);
                    if (fusix > -1) {
                      orix = plottedRinRS[i];
                      nrix = pringsystems[rsy][jj];
                      // check if the two rings are fused via a bridge
                      brdgky = String(Math.min(orix,nrix)) + "-" + String(Math.max(orix,nrix));
                      if (pRingBridgeAth[brdgky] !== undefined) { // there is a bridge between these rings
                      // skip this pair of rings                    
                        continue;
                      }
                      if (sameSenseAsRing([pRingFusions[fusix].at1,pRingFusions[fusix].at2],prings[nrix])) {
                        fat1 = pRingFusions[fusix].at1;
                        fat2 = pRingFusions[fusix].at2;
                      } else {
                        fat1 = pRingFusions[fusix].at2;
                        fat2 = pRingFusions[fusix].at1;
                      }
                      fat1shift = 0;  
                      ringext = prings[nrix].slice(0); // copy of the ring to be plotted
                      ringext.push(prings[nrix][0]); // add the first element again at the end
                      for (k=0;k<ringext.length-1;k++) { // determine the phase shift to have fat1 at the beginning of the ring
                        if (ringext[k]===fat1) {
                          fat1shift = k;
                          break;
                        } 
                      }
                      // search for bonding partners of fusion atoms in old (plotted) and new (to be plotted) ring
                      for (k=0;k<mar[fat2].bpa.length;k++) {
                        if ((mar[fat2].bpa[k].p !== fat1) && (prings[orix].includes(mar[fat2].bpa[k].p)) && (!prings[nrix].includes(mar[fat2].bpa[k].p))) {
                          bpo2 = mar[fat2].bpa[k].p;
                        }
                
                      }
                      // determine the ringsenses of the plotted and the new ring
                      oringsense = getRingSense(mar,fat1,fat2,bpo2);
                      nringsense = (-1)*oringsense;
                      ringCoord(mar,bar,pringsystems[rsy][jj],fat1,fat2,'bond',nringsense,fat1shift,0,0,'',bondlength);
                      plottedRinRS.push(pringsystems[rsy][jj]);
                    } // end section one-bond fused ring
                  }
                } 
              } //end one bond fusion section
              //search for bridged fusions
              for (i=0;i<plottedRinRS.length;i++) {
                for (jj=0;jj<pringsystems[rsy].length;jj++) { 
                  fusix = -1;
                  ringext = []; 
                  if (!plottedRinRS.includes(pringsystems[rsy][jj])) { // not plotted yet
                    // do rings i and jj have a fusion bond ?
                    fusix = ringFusionsIx(plottedRinRS[i],pringsystems[rsy][jj]);
                    if (fusix > -1) {
                      orix = plottedRinRS[i];
                      nrix = pringsystems[rsy][jj];
                      // check if the two rings are fused via a bridge
                      brdgky = String(Math.min(orix,nrix)) + "-" + String(Math.max(orix,nrix));
                      if (pRingBridgeAth[brdgky] === undefined) { // there is no bridge between these rings
                        // skip this pair
                        continue;
                      }
                      if (sameSenseAsRing(pRingBridgeAth[brdgky],prings[nrix])) {
                        fat1 = pRingBridgeAth[brdgky][0]
                        fat2 = pRingBridgeAth[brdgky][pRingBridgeAth[brdgky].length-1];
                        at2m1 = pRingBridgeAth[brdgky][pRingBridgeAth[brdgky].length-2];
                      } else {
                        fat1 = pRingBridgeAth[brdgky][pRingBridgeAth[brdgky].length-1];
                        fat2 = pRingBridgeAth[brdgky][0];
                        at2m1 = pRingBridgeAth[brdgky][1];
                      }
                      fat1shift = 0;  
                      ringext = prings[nrix].slice(0); // copy of the ring to be plotted
                      ringext.push(prings[nrix][0]); // add the first element again at the end
                      for (k=0;k<ringext.length-1;k++) { // determine the phase shift to have fat1 at the beginning of the ring
                        if (ringext[k]===fat1) {
                          fat1shift = k;
                          break;
                        } 
                      }
                      // search for bonding partners of fusion atoms in old (plotted) and new (to be plotted) ring
                      for (k=0;k<mar[fat2].bpa.length;k++) {
                        if ((mar[fat2].bpa[k].p !== fat1) && (prings[orix].includes(mar[fat2].bpa[k].p)) && (!prings[nrix].includes(mar[fat2].bpa[k].p))) {
                          bpo2 = mar[fat2].bpa[k].p;
                        }
                
                      }
                      ris = getRingSense(mar,bpo2,fat2,at2m1);                              
                      if (pRingBridgeAth[brdgky].length > 3) {
                        if ((prings[pringsystems[rsy][jj]].length - pRingBridgeAth[brdgky].length) < pRingBridgeAth[brdgky].length) {
                        // remaining atoms of new ring less than in bridge: shorten bonds
                          bl = 0.8*bondlength;
                        } else if ((prings[pringsystems[rsy][jj]].length - pRingBridgeAth[brdgky].length) >= pRingBridgeAth[brdgky].length) {
                          bl = 1.25*bondlength;
                        }
                      }
                      ringCoord(mar,bar,pringsystems[rsy][jj],fat1,fat2,'bridge',ris,fat1shift,0,0,brdgky,bl);
                      plottedRinRS.push(pringsystems[rsy][jj]);
                    } // end section fused ring
                  }
                } 
              } // end bridge section
              // search for spiro fusions
              for (i=0;i<plottedRinRS.length;i++) {
                for (jj=0;jj<pringsystems[rsy].length;jj++) { 
                  spirix = -1;
                  ringext = []; 
                  if (!plottedRinRS.includes(pringsystems[rsy][jj])) { // not plotted yet
                    // do rings i and jj have a spiro connection ?
                    spirix = spiroRingsIx(plottedRinRS[i],pringsystems[rsy][jj]);
                    if ((spirix === -1) || (atInFusion(pSpiroRings[spirix].at) > -1)) { // not spiro or part of fusion to other rings
                      continue; // skip this pair
                    }
                    fat1shift = 0;
                    orix = plottedRinRS[i];
                    nrix = pringsystems[rsy][jj];
                    fat1 = pSpiroRings[spirix].at;
                    ringext = prings[nrix].slice(0); // copy of the ring to be plotted
                    for (k=0;k<ringext.length;k++) { // determine the phase shift to have fat1 at the beginning of the ring
                      if (ringext[k] === fat1) {
                        fat1shift = k;
                        break;
                      } 
                    }
                    ringCoord(mar,bar,pringsystems[rsy][jj],fat1,0,'atom',1,fat1shift,0,0,'',bondlength);
                    plottedRinRS.push(pringsystems[rsy][jj]);              
                  }
                } 
              } // end spiro section
              sec++;
            } // end while
          } // plot ring system


          function ringCoord(mar,bar,rix,fba1,fba2,mode,sense,atshift,offx,offy,brky,bol) { // BUGFIX 181006.4
            // rix is the index of the ring to be placed in prings[].
            // fba1: atom mode: spiro atom index in mar[]. bond mode: index of first fusion bond atom in mar[]. chend mode: anchored 1st ring atom (nrfat)
            // fba2: atom mode: 0. bond mode: index of second fusion bond atom in mar[]. chend mode: already plotted parent atom in mar[] (orpa).      
            // mode: 'first' => ring is placed at absolute coordinates (offx|offy)
            //      'chend' => ring is placed at end of a chain 
            //     'atom' => placed atom m_s[fba1] is a member of the new spiro ring
            //       'bond' => the two placed atoms of the bond fba1->fba2 become one of the ring's edges
            //      'bridge' => the remaining ring atoms are spanned between the two ends of the already plotted bridge 
            // sense: sense in which ring should be drawn (CCW => +1, CW => -1)
            // atshift: cyclic shift of the starting atom inside the ring
            // offx,offy offset of first atom fromring center for small ring
        
        
            let n, i, jj, k, cx, cy, inideg; 
            let dx =0;
            let dy = 0;
            let angdeg1 = 0;
            let cpezhk = '';
            let dds = 0;
            let deltadeg = 0;
            let newangdeg = 0;
            let bor=0;
            let avx =0;
            let avy = 0;
            let avn = 0;
            let irx=0;
            let itix = 1;
            let abix = 0;
            let nit, fromat, toat;
            const hetpos = [];
            let hetatshift = 0;
            let mancude = false;
            let dbps = 0; // double bond phase shift for mancude rings
            let adjdbl = 0;
            let rdbx = 0;
            let collat = 0;
            let collringsfused = false;
            let rar = []; // copy of the ring atoms array, cyclicly shifted by atshift
            let rart = []; 
            const rdbar = []; // array storing the bond code and EZ of each bond along a ring (index 0 is from last to first)
                  // values: 0 for single bond, 1 for trans double bond, -1 for cis double bond
            let lrdbc = []; // large ring code for syn/anti of a template: 1 for trans, -1 for cis
            let rOfAtar1 = [];
            let rOfAtar2 = [];
            let plrfuar = [];
            let plrcode = '';
            let pltype = 'normal';
            let pezhkey = '';
            let ddar = [];
            let sfar = [];
            let largerplr = 0;
            let smallerplr = 0;
            let sf = 1;
            let nplrfu = 0;
            let templatefit = true;
            let templatefound = false;
            let rot = 0; // rotation shift
            let v = 0; // variant of template
            let variant = 0;
            let templt = []; // the local copy of the template
            const rxof = [0, 0, 0, -0.5*bol, -0.5*bol, -0.5*bol, 0,0,0,0,0,0,0,0,0,0,0];
            const ryof = [0,0,0,-0.28868*bol, 0.5*bol,-0.80902*bol, bol,0,0,0,0,0,0,0,0,0];
            const idi = [0,0,0,300,270,252,270,231.43,225,220,270,270,270,270,270,270,210];
            // templates for rings > 8 (3D array: 1st index = ringsize-9, 2nd index variant, 3rd position in ring)
            const lrdd = [
                [[45,45,45,45,45,45,45,45],[45,45,45,45,90,-45,90,45],[72,72,72,-36,72,72,72,-36]], //8 //bugfix 190124.1
                [[60,60,60,-48,72,72,72,-48,60],[60,40,40,40,40,40,40,60,-60]], // 9
                [[60,60,60,-60,60,60,60,60,-60,60],[60,60,60,-36,72,72,-36,72,72,-36]], //10
                [[60,60,60,-60,60,60,60,-38.53,68.53,68.53,-38.53],[32.73,32.73,32.73,32.73,32.73,32.73,32.73,32.73,32.73,32.73,32.73],[45,45,45,-63,72,72,72,-63,45,45,45],[51.43,51.43,51.43,51.43,51.43,-68.57,60,60,60,60,-68.57],[60,60,60,-30,-18,72,72,72,-18,-30,60]], //11
                [[60,60,60,-60,60,60,60,-60,60,60,60,-60],[72,72,-54,72,72,-54,72,72,-54,72,72,-54],[60,60,60,-48,-36,72,72,72,-36,72,-48,60]], //12
                [[60,60,60,-60,60,-48,72,72,72,-48,60,-60,60],[68.53,68.53,-47.06,68.53,68.53,-68.53,60,60,60,-68.53,68.53,68.53,-47.06]], //13
                [[60,60,60,-60,60,-60,60,60,60,60,-60,60,-60,60],[60,60,60,-60,60,-60,60,60,60,60,-60,60,-60,60]], //14
                [[68.53,68.53,-68.53,60,60,60,-90,60,60,60,-90,60,60,60,-68.53],[72,72,-72,72,72,-72,72,72,-72,72,72,-72,72,72,-72]], //15
                [[60,60,-90,60,60,60,-90,60,60,60,-90,60,60,60,-90,60],[60,60,60,-60,60,-60,60,60,60,-60,60,60,-60,60,60,-60],[45,45,-45,45,45,45,45,-45,45,45,-45,45,45,45,45,-45]] //16 //BF200220.1
                ];
        
            let rotlrdd = []; //bugfix 190204.1
            const hetatbestpos = [0,0,0,1,2,2,2,3,0,0,0,0,0,0,0,0,2];
          
            const shrdd = [[75,69.735,70.53],[75,30,75,75]];  // deltadeg for 5- and 6-membered shrunk rings        
            const shrsf = [[0.89658,0.89658,0.89658],[0.89658,0.89658,1.0,0.89658]]; //bondlength scaling factors for 5- and 6-membered shrunk rings
            const wdd = [[30,131.93,36.136],[30,120,30,30]];  // deltadeg for 5- and 6-membered widened rings        
            const wsf = [[0.75,1.2091,1.2091],[0.75,0.75,1.0,0.75]]; //bondlength scaling factors for 5- and 6-membered widened rings  
            const sqdd = [[140],[120,60],[75,90.964,33.148],[75,69.896,35.104,75],[75,38,42.2,41,58.5],[65,55.2,27.3,32.5,65,55.2]];  // deltadeg for 3-, 4-, 5-, 6-, 7-, 8-membered squew rings
            const sqsf = [[1.3054],[0.6666,1.0],[0.59771,1.1902,0.88169],[0.58232,0.97813,1.0,0.58232],[0.6666,0.75,0.75,1.0,0.75],[0.58333,0.86667,0.975,1.0,0.88333,0.86667]]; //bondlength scaling factors for 3-, 4-, 5-, 6-, 7-, 8-membered squew rings
          
          
            if (plottedrings.includes(rix)) { 
              return; 
            }
            n = prings[rix].length;

            for (i=0;i<prings[rix].length;i++) { // find out the position of heteroatoms
              if (mar[prings[rix][i]].an !== 6) {
                hetpos.push(i);
              }
            }
            // place single heteroatom in the usual positions by phase rotation

            if ((hetpos.length > 0) && (atshift === 0) && (mode === 'first')) { //only shift if atshift was not set by param
              hetatshift = (hetpos[0] - hetatbestpos[n]);

              atshift = hetatshift;
            }
        
            // make a copy of the ring atom array
            // the copy of prings[rix] is rotated if atshift is <> 0
            rar = prings[rix].slice(atshift, prings[rix].length).concat(prings[rix].slice(0, atshift));
//             console.log("ringCoord: ring="+rix+" mode="+mode+" fba1="+fba1+" fba2="+fba1+" rar: "+rar);

            if (emfuPrings[rix]) { // mancude ring
              mancude = true;
            } 
            // construct a template based on the cis/trans-requirements along the ring
            // BUGFIX 190918.1  "else if" replaced by "if": mancude rings >= 8 must be treated by template as well
            if (n > 7) { // Large ring: for rings > 7: check for position of any double bonds in ring and take into account EZ 
              for (i=1;i<rar.length;i++) { // i runs from second to last atom in rar
                rdbx = getBondIndex(bar,rar[i],rar[i-1]);

                if (bar[rdbx].btyp === 2) { // double bond cis: +1, trans -1
                  rdbar[i-1] = 1;
                  // find out if the ring DB is pezh[]  //bugfix 190124.1 begins
                  if (pezh[String(rar[i-1])+"-"+String(rar[i])] !== undefined) {
                    pezhkey=String(rar[i-1])+"-"+String(rar[i]);
                    if ((rar.includes(pezh[pezhkey].fl1) && rar.includes(pezh[pezhkey].tl1)) || (!rar.includes(pezh[pezhkey].fl1) && !rar.includes(pezh[pezhkey].tl1))) {
                      // fl1 and tl1 either both ring atoms or both substituents
                      rdbar[i-1] = (pezh[pezhkey].r11 === 't') ? -1 : 1 ;
                    } else {
                      // one ring atom and one substituent atom among fl1 and tl1
                      rdbar[i-1] = (pezh[pezhkey].r11 === 't') ? 1 : -1 ;
                    }
                  } else {
                    rdbar[i-1] = 0;
                  } // bugfix 190124.1 ends
                } else if (bondInRingBridge(bar,rdbx,3)) { // bond is in a 3-atom ring bridge: must be trans
                  rdbar[i-1] = -1;
                } else if ((atInFusion(rar[i-1]) > -1) && (atInFusion(rar[i]) === atInFusion(rar[i-1])))  {
                  // bond is in ring-ring fusion
                  rdbar[i-1] = 1;                
                } else { // not double bond
                  if (mar[rar[i]].bpa.length > 2) { // rar[i] has substituent  //BF200220.2
                    rdbar[i-1] = 1;
                  } else {
                    rdbar[i-1] = 0;
                  }
                }

              }
              // the last item in the template is always the ring closure bond, which is never double by definition in SMILES
              // therefore, we add a 0 as the last element to the rdbar.    
              rdbar[rar.length-1] = 0;

          
          
              templatefound = false;
              v = 0;
              rotlrdd = lrdd[n-8][v].slice(0); // make a copy of the first variant of lrdd[n-8]  //bugfix 190204.1
              if (n > 7) {
                while ((!templatefound) && (v < lrdd[n-8].length)) { // check as many variants as stored for this ring size 
                // construct the large-ring cis-trans code for the  current template
                // code is +1 if dd at the two vertices has the same sign, -1 if they have different sign
                  lrdbc = [];
                  for (jj=0;jj<lrdd[n-8][v].length-1;jj++) {
                    lrdbc.push(Math.sign(lrdd[n-8][v][jj])*Math.sign(lrdd[n-8][v][jj+1]));
                  }
                  lrdbc.push(Math.sign(lrdd[n-8][v][lrdd[n-8][v].length-1])*Math.sign(lrdd[n-8][v][0]));
            
                  // make a local copy of the current template (to be phase rotated)
                  templt = lrdbc.slice(0);

                  // try all phase rotations to find a fit
                  rot = 0;
                  while (rot < templt.length) {
                    templatefit = true;

                    for (i=0;i<rdbar.length;i++) {

                      if ((rdbar[i] !== 0) && (Math.sign(rdbar[i]*templt[i]) === -1)) {
                        templatefit = false;
                        break;
                      }
                    }
                    if (templatefit === true) {
                      templatefound = true;
                      break;
                    } else {

                      rot++;
                      templt = lrdbc.slice(rot, lrdbc.length).concat(lrdbc.slice(0,rot)); // phase rotate the template

                    }
                  }
                  if (templatefound) {
                    variant = v;
                    // save the rotated lrdd[n-8][variant] that fits
                    rotlrdd = lrdd[n-8][variant].slice(rot, templt.length).concat(lrdd[n-8][variant].slice(0,rot));  //bugfix 190204.1
                    break;
                  } 
                  v++;
                  if (v >= lrdd[n-8].length) {
                    variant = 0;
                  }
                }
              }
            } // n > 7
            nit = n;  



    
            // determine the directional angle of the first bond
            // first mode
            if (mode === 'first') { // no anchor, ring starts with the very first atom coord
              irx=0;
              deltadeg = 360/Math.abs(n);
              inideg = (180 - deltadeg)/2;
              angdeg1 = Math.pow(-1,nit)*inideg;
              if (nit === 6) { angdeg1 = 90; }
              if (nit === 8) { angdeg1 = 90; }
    
            // fix coord of first ring atom 
              cx = offx;
              cy = offy;
              if (nit < 9) {
                cx += rxof[nit];
                cy += ryof[nit];
              }
              mar[rar[0]].x = cx;
              mar[rar[0]].y = cy;


              newangdeg = idi[n];
              irx++;
            }
            if (mode === 'chend') { // anchor is at end of chain or ring is directly connected to a chain atom
              irx=0;
              if ((is_in_cumulene(mar,fba2)) && (is_in_cumulene(mar,fba1))) { //BUGFIX 180928.1
                angdeg1 = getdiranglefromAt(mar,pic[fba2],fba2);
              } else if ((is_pezh_f(fba2) !== '') && (is_pezh_t(fba1) !== '') && (is_pezh_f(fba2)===is_pezh_t(fba1))) { 
                // end of chain connected to ring via ezDB, set cpezhk
                cpezhk = is_pezh_f(fba2);
                if (hasCoord(mar,pezh[cpezhk].f) && hasCoord(mar,pezh[cpezhk].fl1) && hasCoord(mar,pezh[cpezhk].fl2) && (!hasCoord(mar,pezh[cpezhk].t))) { 
                  // f,fl1 and fl2 plotted, t not
                  // deduce angle to t from fl1 and fl2
                  angdeg1 = getBisectorFrom3At(mar,pezh[cpezhk].f,pezh[cpezhk].fl1,pezh[cpezhk].fl2,true);
                } else if (hasCoord(mar,pezh[cpezhk].f) && hasCoord(mar,pezh[cpezhk].fl1) && (!hasCoord(mar,pezh[cpezhk].t))) {
                  // f,fl1 plotted, t not
                  // deduce angle to t from plotted fl1->f
                  angdeg1 = norma(getdiranglefromAt(mar,pezh[cpezhk].fl1,pezh[cpezhk].f)+60);
                } else if (hasCoord(mar,pezh[cpezhk].f) && hasCoord(mar,pezh[cpezhk].fl2) && (!hasCoord(mar,pezh[cpezhk].t))) {
                  // f,fl2 plotted, t not
                  // deduce angle to t from plotted fl2->f
                  angdeg1 = norma(getdiranglefromAt(mar,pezh[cpezhk].fl2,pezh[cpezhk].f)-60);
                } else {
                  angdeg1 = 30;
                }                 
              } else if (is_pezh_t(fba2) !== '') { // end of chain is t of ezDB
                cpezhk = is_pezh_t(fba2);
                if (hasCoord(mar,pezh[cpezhk].f) && hasCoord(mar,pezh[cpezhk].t) && (hasCoord(mar,pezh[cpezhk].fl1) || hasCoord(mar,pezh[cpezhk].fl2))) {
                // f, t, and either fl1 or fl2 of pezh are plotted
                  angdeg1 = norma(getdiranglefromAt(mar,pezh[cpezhk].f,pezh[cpezhk].t) + pezh2dir(mar,cpezhk,fba1));
                } else if (hasCoord(mar,pezh[cpezhk].f) && hasCoord(mar,pezh[cpezhk].t)) { // neither fl1 nor fl2 are plotted but f and t are //BF191225.2
                  angdeg1 = norma(getdiranglefromAt(mar,pezh[cpezhk].f,pezh[cpezhk].t) + 60); //BF191225.2                    
                } else { 
                  angdeg1 = angdeg1 + pezh2dir(mar,cpezhk,fba1);  //BF190818.1 
                }               
              } else if (is_TBatom(mar,fba2) > 0) {
                angdeg1 = getdiranglefromAt(mar,is_TBatom(mar,fba2),fba2);        
              } else {
                angdeg1 = propBestDir(mar,bar,fba2);          
              }
              
              // fix coord of first ring atom 
              cx = mar[fba2].x + bol * Math.cos(Math.PI * angdeg1/180);
              cy = mar[fba2].y + bol * (-1)*Math.sin(Math.PI * angdeg1/180);
              mar[rar[0]].x = cx;
              mar[rar[0]].y = cy;

              // determine the direction and deltadeg for the next atom
              // is the ring connected to chain via EZ DB or ez-Cumulene?
              if (is_pezh_t(fba1) !== '') { // 1st ring atom is t of EZ-DB or EZ-Cumulene
                cpezhk = is_pezh_t(fba1);
                // fix the ring sense such that the ezDB configuration is correct
                dds = Math.sign(pezh2dir(mar,cpezhk,rar[1]));


                newangdeg = angdeg1 + dds*(180-360/Math.abs(n))/2;
                deltadeg = (-1)*dds*360/Math.abs(n);
                sense = (-1)*dds;
              } else if ((mar[fba1].bpa.length > 3) & (numplotlig(mar,fba1) === 1)) {
                bor = 0;
                for (k=0;k < mar[fba1].bpa.length;k++) {
                  bor += mar[fba1].bpa[k].t;
                }
//                 console.log("atom ["+fba1+"] bor="+bor+" val[mar[fba1].an]="+val[mar[fba1].an]);
                if ((val[mar[fba1].an] > 0) && (bor > val[mar[fba1].an]) && (ispBridgehead(mar,fba1)>2))  {
                  //hypervalent angular atom
                  deltadeg = (-1)*360/Math.abs(n);
                  newangdeg =  norma(norma(angdeg1 + 30) - (180-deltadeg/2));
                } else {
                  deltadeg = 360/Math.abs(n);
                  newangdeg = norma(norma(angdeg1 + 30) - (180-deltadeg/2));
                }
              } else if (n > 7) { // large ring in chend mode //bugfix 190204.1
                deltadeg = 360/Math.abs(n); //bugfix 190204.1
                newangdeg = norma(angdeg1 - (180-rotlrdd[irx])/2); //bugfix 190204.1            
              
              } else {
                deltadeg = 360/Math.abs(n);
                newangdeg = norma(angdeg1 - (180-deltadeg)/2);
              }
              irx++;
            }      
      // atom mode for spiro junctions fba1 is the index of the anchor atom in the m_s[] array
            if (mode === 'atom') {
            
              rart = rar.slice(1,rar.length);
              rart.reverse();
              rar = rar.slice(0,1);
              rar = rar.concat(rart);
//               console.log("rar after reversal: "+rar);
              cx = mar[fba1].x;
              cy = mar[fba1].y; // the fba1 becomes a vertex
              // two plotted bonds at fba1: spiro ring
              avx = 0;
              avy = 0;
              avn = 0;
              for (k=0;k<mar[fba1].bpa.length;k++) {
                if ((mar[mar[fba1].bpa[k].p].x !== 0) && (mar[mar[fba1].bpa[k].p].y !== 0)) {
                  avx += mar[mar[fba1].bpa[k].p].x; 
                  avy += mar[mar[fba1].bpa[k].p].y;
                  avn++;
                }
              }          
              if (avn > 0) {
                avx = avx/avn;
                avy = avy/avn;
              }
              angdeg1 = getdirangle(avx,avy,mar[fba1].x,mar[fba1].y); // seen towards CA
              deltadeg = 360/n; 
              newangdeg = norma(angdeg1 - (180-deltadeg)/2); // bisector of ring angle
              irx = 1; 

            } // end atom mode        
      // bond mode:        
            if (mode === 'bond') {    
            // direction is based on direction fba1->fba2
              // what's the bond type of the fusion-bond?
              abix = getBondIndex(bar,fba1,fba2);
              // is the bond a fusion bond of 2 or more rings?

              if ((ispBridgehead(mar,fba1) > 3) && (ispBridgehead(mar,fba2)>3)) { // three rings fused at bond fba1-fba2
                rOfAtar1 = atInRh[String(fba1)].slice(0);
                rOfAtar2 = atInRh[String(fba2)].slice(0);
                rOfAtar1.sort((a, b) => a-b);
                rOfAtar2.sort((a, b) => a-b);
                if(sameArray(rOfAtar1,rOfAtar2)) { // fba1 and fba2 belong to the same rings
                  nplrfu =0;
                  plrfuar = [];
                  plrcode = '';
                  for (k=0;k<rOfAtar1.length;k++) { // determine how many of the fused rings are plotted
                    if (plottedrings.includes(rOfAtar1[k])) {
                      nplrfu++;
                      plrfuar.push(rOfAtar1[k]);
                      plrcode += String(prings[rOfAtar1[k]].length);
                    }
                  }
                  if (nplrfu === 2) { // two of the rings fused at fba1-fba2 are plotted
                    plrcode += String(n);
                    // plot prings[rix] normal, shrunk, widened or squew depending on plrcode

                    largerplr = (prings[plrfuar[0]].length >= prings[plrfuar[1]].length)? plrfuar[0]: plrfuar[1];
                    smallerplr = (prings[plrfuar[0]].length <= prings[plrfuar[1]].length)? plrfuar[0]: plrfuar[1];
                    // decide whether to plot rix as normal, squew, shrunk or wide ring
                    pltype = 'normal';
                    switch (true) {
                      case ((plrcode === '333') || (plrcode === '444') || (plrcode === '777') || (plrcode === '888')):
                        pltype = 'squew';
                        break;
                      case (plrcode.charAt(2) === '3'):
                        pltype = 'normal';
                        break;
                      case (plrcode.charAt(2) === '4'):
                        pltype = 'normal';
                        break;
                      case   (plrcode.charAt(2) === '5'):
                        if (parseInt(plrcode,10) < 700) {
                          pltype = 'wide';
                        } else { 
                          pltype = 'normal';
                        }
                        break;
                      case   (plrcode.charAt(2) === '6'):
                        if (parseInt(plrcode,10) < 770) {
                          pltype = 'wide';
                        } else { 
                          pltype = 'shrunk';
                        }
                        break;
                      case   (parseInt(plrcode.charAt(2),10) > 6):
                        pltype = 'squew';
                        break;
                      default:
                        pltype = 'normal';
                        break;
                    }
                    if (pltype === 'squew') {
                      ddar = sqdd[n-3].slice(0);                  
                      sfar = sqsf[n-3].slice(0);
                    } else if (pltype === 'wide') {
                      ddar = wdd[n-5].slice(0);                  
                      sfar = wsf[n-5].slice(0);
                    } else if (pltype === 'shrunk') {
                      ddar = shrdd[n-5].slice(0);                  
                      sfar = shrsf[n-5].slice(0);
                    }
                    for (k=0;k<mar[fba2].bpa.length;k++) { // find bp of fba2 in largest plotted ring
                      if ( prings[largerplr].includes(mar[fba2].bpa[k].p) && (mar[fba2].bpa[k].p !== fba1) && (pltype !== 'wide')) {
                        // draw normal,squew or shrunk on side of larger ring

                        sense = getRingSense(mar,fba1,fba2,mar[fba2].bpa[k].p);
                      } else if ( prings[smallerplr].includes(mar[fba2].bpa[k].p) && (mar[fba2].bpa[k].p !== fba1) && (pltype === 'wide')) {
                        // draw wide on side of smaller ring

                        sense = getRingSense(mar,fba1,fba2,mar[fba2].bpa[k].p);
                      }  
                    }
                  }
                }                  
              }
              if (( bar[abix].btyp === 1 ) && (mancude)) { // mancude fusion, fusion bond is single
                // determine whether it is adjacent to a double bond
                fromat = fba1;
                toat = fba2;
                adjdbl = 0;
                k = 0;
                while (k < mar[fromat].bpa.length) {
                  if ( mar[fromat].bpa[k].t === 2 ) {
                    adjdbl += 1;
                    break;
                  }
                  k++;
                }
                k=0;
                while (k < mar[toat].bpa.length) {
                  if ( mar[toat].bpa[k].t === 2 ) {
                    adjdbl += 1;
                    break;
                  }
                  k++;
                }
                dbps = (adjdbl > 0)? 1 : 0; // phase shift double bonds in mancude ring if fusion bond has adjacent DB
              } else if ((bar[abix].btyp === 2 ) && (mancude)) {
                dbps = 1; //phase shift double bonds in mancude ring if fusion bond is double bond
              }          
          
              cx = mar[fba2].x;
              cy = mar[fba2].y;
              angdeg1 = getdiranglefromAt(mar,fba1,fba2); // bond direction of fusion bond
              // set the deltadeg between fba1->fba2 and the fba2->rar[2] (first atom to be plotted)    
              if (pltype === 'normal') { // normal
                deltadeg = (n < 9)? 360/n : lrdd[n-8][variant][1] ; // normal for n<9 or large ring
                sf = 1;
              } else { // shrunk, wide, squew
                deltadeg = ddar[0];
                sf = sfar[0];
              }

              // change sign of deltadeg if ring is CW
              if ( sense < 0 ) {
                deltadeg = (-1)*deltadeg;
              }
              newangdeg = norma(angdeg1+deltadeg); // direction of fba2->rar[2]

              irx = 2; // start with the third atom in the fat1shifted rar[]
              // for pltype='normal' (regular n-polygon), deltadeg remains the same during iteration below 
            }  // end bond mode
      // bridge mode:
            if (mode === 'bridge') {          
              cx = mar[fba2].x;
              cy = mar[fba2].y;
              itix = 1;
              angdeg1 = getdiranglefromAt(mar,fba1,fba2); // direction of bridge diagonal fba1->fba2
              deltadeg = sense*bridgedd(mar,bar,n,brky,bol,itix);

              newangdeg = norma(angdeg1 + deltadeg);
              irx = pRingBridgeAth[brky].length; // start with the first atom after the bridge atoms in the fat1shifted rar[]
            }
        
      // add all the atoms iteratively        
            while (irx < rar.length) { // over all remaining atoms of the ring

              dx = sf*bol*Math.cos(Math.PI * newangdeg/180);
              dy = sf*bol*(-1)*Math.sin(Math.PI * newangdeg/180);
              newx = cx + dx;
              newy = cy + dy;
              if ((mar[rar[irx]].x === 0) && (mar[rar[irx]].y === 0)) { // only change coord of atoms that have not been plotted
                if (isnear(m_s,b_s,newx,newy) > 0 ) { // check for pending collision
                  // this collision-avoidance mechanism within ringCoord() should only come into play
                  // if the colliding atoms are in two different rings that are fused or bridge-fused to each other
                  // the atom to be plotted is rar[irx], the colliding atom is the result of isnear(m_s,b_s,newx,newy)
                  // the ring of the atom to be plotted is rix, the ring of the colliding atom has to be found
                  collat = isnear(m_s,b_s,newx,newy);
                  if (atInRh[String(collat)] !== undefined) {
                    collringsfused = false;
                    for (jj=0;jj<atInRh[String(collat)].length;jj++) { // check all rings to which collat belongs
                      // is there a fusion between rix and the ring atInRh[String(collat)][jj]?
                      if (ringFusionsIx(rix,atInRh[String(collat)][jj]) > -1) {
                        collringsfused = true;
                        break;
                      }
                    }
                    if (collringsfused) {

                      dx = bol * Math.cos(Math.PI * (norma(30+newangdeg))/180);
                      dy = bol * (-1)*Math.sin(Math.PI * (norma(30+newangdeg))/180);
                      newx = cx + dx;
                      newy = cy + dy;
                    }
                  }
                }
                // set the coordinates of atom rar[irx]
                mar[rar[irx]].x = newx;  
                mar[rar[irx]].y = newy;
              }
              // if plottype !== 'normal': change the angle and the bond length scaling factor for each new bond 
              if (n > 7) { // large ring: take deltadeg from the rotated template

                deltadeg = rotlrdd[irx];  //bugfix 190204.2
              }
              if (brky !== '')  { // bridge mode: calculate next deltadeg with bridgedd()
                itix++;
                deltadeg = sense*bridgedd(mar,bar,n,brky,bol,itix);

              }
              if (pltype !== 'normal') { // pltype = shrunk || wide || squew (for 3rd ring in propellanes)

                  deltadeg = sense*ddar[irx-1]; // take the next deltadeg from ddar[]
                  sf = sfar[irx-1]; // take the next bondlength scaling factor from sfar[]
              }

              newangdeg = norma(newangdeg + deltadeg);

              cx = newx;
              cy = newy;
          
              // mancude rings: check if bond rar[irx-1]->rar[irx] must be set to double bond
              if (mancude) {

                if ((hasDB(mar,bar,rar[irx]) === 0) && (hasDB(mar,bar,rar[irx-1]) === 0)) {

                  if ((irx % 2) === dbps) {
                    changeBondOrder(mar,bar,rar[irx],rar[irx-1],'+');
                  }
                } 
              }  
              irx++;
            }    
            // mancude rings: check if bond rar[irx-1]->rar[irx] must be set to double bond
            if (mancude) {

              if ((hasDB(mar,bar,rar[irx-1])===0) && (hasDB(mar,bar,rar[0])===0)) {

                if (((irx-1) % 2) === dbps) {
                  changeBondOrder(mar,bar,rar[0],rar[irx-1],'+');
                }
              } 
              // check whole ring for alternating DB and fix if one is missing
              rar.push(rar[0]); // repeat first atom at end of rar
              for (i=1;i<rar.length;i++) {
                if ((hasDB(mar,bar,rar[i]) === 0) && (hasDB(mar,bar,rar[i-1])===0)) { // 2 consecutive atoms without DB
                  changeBondOrder(mar,bar,rar[i],rar[i-1],'+');
                }
              }
            }  
            plottedrings.push(rix);  // record ring as plotted

            plotorder += "prings["+rix+"] "+prings[rix].join()+"\n";

        
          } // plot ring


          function is_in_cumulene(mar,ax) {
            let i=0;
            let ndb=0;
          
            for (i=0;i<mar[ax].bpa.length;i++) {
          
              if (mar[ax].bpa[i].t === 2) {
                ndb++;
              }
            }
            return (ndb === 2)? true : false;
          } // returns true if atom has 2 DB (cumulene atom but not end of cumulene)
        
          function is_linearChain(mar,car) {
          // car:array of indices in mar
            let i=0;
            let result=true;
            
            for (i=1;i<car.length-1;i++) { // from second to second last atom
              if (!(is_TBatom(mar,car[i]) || is_in_cumulene(mar,car[i]))) {
                result=false;
              }
            }
            return result;
          } // checks whether all atoms except first and last in the array car[] are either triple-bonded or in cumulene
        
          function is_pezh_f(ax) {
            let result ='';
          
            for (const key in pezh) {
              if (pezh.hasOwnProperty(key)) {
                if (pezh[key].f === ax) {
                  result = key;
                  break;
                }
              }
            }
            return result;
          } // returns the key of the pezh object that has atom ax as .f property, otherwise empty string

          function is_pezh_t(ax) {
            let result ='';
          
            for (const key in pezh) {
              if (pezh.hasOwnProperty(key)) {
                if (pezh[key].t === ax) {
                  result = key;
                  break;
                }
              }
            }
            return result;
          }
        
          function get_fl1_tl1_rel(slac) {
            let fl1tl1='';            
          // relation of fl1 and tl1
            if ((slac.charAt(0) !== '0') && (slac.charAt(2) !== '0')) {
              if (slac.charAt(0) === slac.charAt(2)) { 
                fl1tl1 = 't';
              } else {
                fl1tl1 = 'c';
              }
            } else if ((slac.charAt(0) !== '0') && (slac.charAt(3) !== '0')) {
              if (slac.charAt(0) === slac.charAt(3)) { 
                fl1tl1 = 'c';
              } else {
                fl1tl1 = 't';
              }
            } else if ((slac.charAt(1) !== '0') && (slac.charAt(2) !== '0')) {
              if (slac.charAt(0) === slac.charAt(2)) { 
                fl1tl1 = 'c';
              } else {
                fl1tl1 = 't';
              }
            } else if ((slac.charAt(1) !== '0') && (slac.charAt(3) !== '0')) {
              if (slac.charAt(0) === slac.charAt(2)) { 
                fl1tl1 = 't';
              } else {
                fl1tl1 = 'c';
              }
            }
            return fl1tl1;
          } // returns the 'c' or 't'relationship between fl1 and tl1 based on the slashcode

          function propBestDir(mar,bar,ax) { //params: ax is the atom to investigate
            let i=0;
            let od = 0;
            const nbp = mar[ax].bpa.length; // number of ligands of the atom ax?
            let ndbp = 0; // number of ligands that have been plotted
            let nrbp = 0;
            const pliar = []; // array with the ligands that have been plotted
            let last3 = [];
            let newd = -1;
            let oppbisdir = 0;
            let brgkey = '';
            let dcligdir = 0;
            let deltadir = 0;
            let ralig = 0;
            let leftOrRight = 0;
            let axc = -1; // the index of the achain to which ax belongs
            let bx = 0;
            let cistrans = 1;
            let samechainlig = [];
            let diffchainlig = [];
        
            // which of the ligands have already been plotted?
            for (i=0; i<nbp;i++) {
              if ((mar[mar[ax].bpa[i].p].x !== 0) && ((mar[mar[ax].bpa[i].p].y !== 0))) {
                pliar.push(mar[ax].bpa[i].p);
              }
            }
            if (atInRh[String(ax)] === undefined) { // ax itself is not in ring
              // determine the number of ligands of ax that are in a ring: nrbp
              for (i=0; i<nbp;i++) {
                if (atInRh[String(mar[ax].bpa[i].p)] !== undefined) { // ligand is in ring
                  nrbp++;
                }
              }
            }
            ndbp = pliar.length;
            pliar.sort((a, b) => chainOf(achains,a) - chainOf(achains,b));
            switch(nbp) {
              case 0:
                newd=270;
                break;
              case 1:
                if (ndbp === 0) {
                  newd = 30;
                }
                break;
              case 2:
                if (ndbp === 0) {
                  newd = 30;
                } else if (ndbp === 1) { // ax is an atom at one of the ends of a plotted chain
                  axc = chainOf(achains,ax);
                  od = getdiranglefromAt(mar,pliar[0],ax);
                  if (achains[axc].atar.length > 2) { // chain of ax has at least 3 atoms
                    if (achains[axc].atar[0] === ax) { // ax is 1st atom of its chain
                      bx = getBondIndex(bar,achains[axc].atar[0],achains[axc].atar[1]);
                      if (bar[bx].btyp === 2) { // the beginning of the chain is a double bond
                        cistrans = pgetEZ(mar,bar,bx);
                      } else {
                        leftOrRight = getRingSense(mar,achains[axc].atar[2],achains[axc].atar[1],achains[axc].atar[0]);
                      }
                    } else if (achains[axc].atar.slice(-1) === ax) { // ax is last atom of its chain
                      last3 = achains[axc].atar.slice(-3);
                      bx = getBondIndex(bar,last3[1],last3[2]);
                      if (bar[bx].btyp === 2) { // the end of the chain is a double bond
                        cistrans = pgetEZ(mar,bar,bx);
                      } else {
                        leftOrRight = getRingSense(mar,last3[0],last3[1],last3[2]);
                      }
                    }
                  } else if (achains[axc].atar.length === 2) { // ax is in a two atom chain
                    if (achains[axc].atar[1] === ax) { // ax is the last atom of its chain
                      if ((achains[axc].pa > 0) && (hasCoord(mar,achains[axc].pa))) {
                        bx = getBondIndex(bar,achains[axc].atar[0],ax);
                        if (bar[bx].btyp === 2) { // the end of the chain is a double bond
                          cistrans = pgetEZ(mar,bar,bx);
                        } else {
                          leftOrRight = getRingSense(mar,achains[axc].pa,achains[axc].atar[0],ax);
                        }
                      } 
                    } else if ((achains[axc].si > 0) && (hasCoord(mar,achains[axc].si))) { // ax is 1st atom of its chain
                      bx = getBondIndex(bar,achains[axc].atar[1],ax)
                      if (bar[bx].btyp === 2) { // the beginning of the chain is a double bond
                        cistrans = pgetEZ(mar,bar,bx);
                      } else {
                        leftOrRight = getRingSense(mar,achains[axc].si,achains[axc].atar[1],ax);
                      }
                    }
                  } 
                  if ((leftOrRight === 0) && (!is_in_cumulene(mar,ax))) { // none of the above and ax not inside cumulene
                    if (Math.cos(Math.PI*od/180)*Math.sin(Math.PI*od/180) > 0) { // 1st & 3rd quadrant
                      leftOrRight = 1;
                    } else {
                      leftOrRight = -1;
                    }
                  }
                  newd = norma(od - cistrans*leftOrRight*60); // zig-zag or cis if cistrans is -1
                } 
                break;
              case 3:
                if (ndbp === 0) {
                  newd = 30;
                } else if (ndbp === 1) { 
                  od = getdiranglefromAt(mar,pliar[0],ax);
                  if (Math.cos(Math.PI*od/180)*Math.sin(Math.PI*od/180) > 0) { // 1st & 3rd quadrant
                    newd = od-60; //CW
                  } else {
                    newd = od+60; //CCW
                  }
                } else if (ndbp === 2) {
                  // chose opposite bisector
                  newd = getBisectorFrom3At(mar,ax,pliar[0],pliar[1],true);
                } 
                break;
              case 4:
                if (ndbp === 0) {
                  newd = 30;
                } else if (ndbp === 1) { 
                  od = getdiranglefromAt(mar,pliar[0],ax);
                  if (pscAtoms.includes(ax) && (nrbp < 2)) { // ax is a stereogenic center with less than 2 ring ligands
                    if (Math.cos(Math.PI*od/180)*Math.sin(Math.PI*od/180) > 0) { // 1st & 3rd quadrant
                      newd = od-60; //CW
                    } else {
                      newd = od+60; //CCW
                    }
                  // BUGFIX 181011.3
                  } else if (mar[ax].an === 16) { //Sulfate/Sulfonate: linear
                    newd =od;
                  } else { // not stereogenic center or more than one ring as ligand or Sulfur
                    if (Math.cos(Math.PI*od/180)*Math.sin(Math.PI*od/180) > 0) { // 1st & 3rd quadrant
                      newd = od-90; //CW
                    } else {
                      newd = od+90; //CCW
                    }
                  }
                } else if (ndbp === 2) {
                  if ((atInRh[String(ax)] !== undefined) || (getbondanglefromAt(mar,ax,pliar[0],pliar[1]) < 140)) { 
                  // ax is ring atom or a stereogenic center with the plotted ligands at < 140° (zig-zag)
                  // chose opposite bisector ± 30
                    newd = getBisectorFrom3At(mar,ax,pliar[0],pliar[1],true);
                    newd = norma(newd+30);
                  } else {
                    od = getdiranglefromAt(mar,pliar[0],ax);
                    newd = norma(od-90); //CW
                  }                  
                } else if (ndbp === 3) {
                  // is ax a bridgehead?
                  if (ispBridgehead(mar,ax) === 3) {
                    if (atInRingBridge(mar,ax) !== '') { // ax is in ring bridge
                      brgkey = atInRingBridge(mar,ax);
                      // find the ligand in the ring bridge
                      for (i=0;i<pliar.length;i++) {
                        if (atInRingBridge(mar,pliar[i]) === brgkey) { // ligand is in ring bridge
                          if (pRingBridgeAth[String(brgkey)][0] === ax) {  
                            newd = getdiranglefromAt(mar,pRingBridgeAth[String(brgkey)][pRingBridgeAth[brgkey].length-1],ax);
                          } else {
                            newd = getdiranglefromAt(mar,pRingBridgeAth[String(brgkey)][0],ax);
                          }
                        }
                      }
                    } else { // not in ring bridge but ring fusion
                      for (i=0;i<pliar.length;i++) {
                        if ((atInRh[String(pliar[i])] !== undefined) && (atInRh[String(pliar[i])].length > 1)) {
                        // ligand is in at least 2 rings
                          newd = getdiranglefromAt(mar,pliar[i],ax);
                          break;  
                        } 
                      }
                    }
                  } else { // ax is normal quaternary chain atom, not bridgehead
                    samechainlig = [];
                    diffchainlig = [];
                    for (i=0;i<pliar.length;i++) {
                      if (chainOf(achains,pliar[i]) === chainOf(achains,ax)) {
                        samechainlig.push(pliar[i]);
                      } else {
                        diffchainlig.push(pliar[i]);
                      }
                    }
                    if (samechainlig.length === 2) {
                      if ((getbondanglefromAt(mar,ax,samechainlig[0],samechainlig[1]) > 175) && (getbondanglefromAt(mar,ax,samechainlig[0],samechainlig[1]) < 185)) {
                        // chain is linear around ax
                        newd = getdiranglefromAt(mar,diffchainlig[0],ax);
                      } else {
                        oppbisdir = getBisectorFrom3At(mar,ax,samechainlig[0],samechainlig[1],true);
                        dcligdir = getdiranglefromAt(mar,ax,diffchainlig[0]);
                        deltadir = Math.abs(dcligdir-oppbisdir);
                        newd = oppbisdir + deltadir;
                        if (Math.abs(newd - dcligdir) < 2) { // colinear
                          newd = oppbisdir - deltadir;
                        }
                      }
                    } else {
                      getSectorsAt(mar,ax,true);
                      if (sectors[sectors.length-1].wi > 175) { // largest sector is 180°
                        for (i=0;i<pliar.length;i++) {
                          if ((pliar[i] !== sectors[sectors.length-1].ra) && (pliar[i] !== sectors[sectors.length-1].la)) {
                            ralig = pliar[i];
                            break;
                          }
                        }
                        newd = getdiranglefromAt(mar,ralig, ax);
                      } else { // largest sector is not 180°
                        newd = getBisectorFrom3At(mar,ax,sectors[sectors.length-1].ra,sectors[sectors.length-1].la,false);
                      }
                    }
                  
                  }
                } 
                break;            
            } // end switch ndp
            return newd;
          } // proposes the best direction for a new ligand                

          function pezh2dir(mar,cpezhk,na) { //BF190818.1, BF191230.2
            let refat = 0;
            let refslc = 0;
            let reverse = false;
            let sens = 1;
            let d1x, d1y, d2x, d2y;
            let vp2d;

            //BF191230.2 start
            if (pezh[cpezhk].slc.charAt(0) !== '0') { // slash after fl1 slashcode digit 0 is 1 or 2
              if (hasCoord(mar,pezh[cpezhk].fl1)) { // fl1 is plotted
                refat = pezh[cpezhk].fl1;
                refslc = pezh[cpezhk].slc.charAt(0);
                reverse = false;
              } else if (hasCoord(mar,pezh[cpezhk].fl2)) { // fl1 is not plotted we have to use fl2 if it is plotted //BF210215.2 fl2 instead of fl1
                refat = pezh[cpezhk].fl2;
                refslc = pezh[cpezhk].slc.charAt(0);
                reverse = true;
              }
            } else if (pezh[cpezhk].slc.charAt(1) !== '0') { // slash before fl2 slashcode digit 1 is 1 or 2
              if (hasCoord(mar,pezh[cpezhk].fl2)) { // fl2 is plotted
                refat = pezh[cpezhk].fl2;
                refslc = pezh[cpezhk].slc.charAt(1);
                reverse = true;
              } else if (hasCoord(mar,pezh[cpezhk].fl1)) { // fl2 is not plotted, we have to use fl1
                refat = pezh[cpezhk].fl1;
                refslc = pezh[cpezhk].slc.charAt(1);
                reverse = false;
              }
            }
            //BF191230.2 end

            // figure out whether the na is tl1 or tl2
            if (na === pezh[cpezhk].tl1) { // next atom is tl1
              if (pezh[cpezhk].slc.charAt(2) !== '0') { // slash before tl1
               if (!reverse) {
                  sens = (pezh[cpezhk].slc.charAt(2) === refslc)? 1: -1;
                } else {
                  sens = (pezh[cpezhk].slc.charAt(2) === refslc)? -1: 1;
                }
              } else { // slash before tl2 use opposite rules for tl1
                if (reverse) {
                  sens = (pezh[cpezhk].slc.charAt(3) === refslc)? 1: -1;
                } else {
                  sens = (pezh[cpezhk].slc.charAt(3) === refslc)? -1: 1;
                }            
              }
            } else if (na === pezh[cpezhk].tl2) { // next atom is tl2
              if (pezh[cpezhk].slc.charAt(3) !== '0') { // slash before tl2
                if (!reverse) {
                  sens = (pezh[cpezhk].slc.charAt(3) === refslc)? 1: -1;
                } else {
                  sens = (pezh[cpezhk].slc.charAt(3) === refslc)? -1: 1;
                }
              } else { // slash before tl1 use opposite rules for tl2
                if (reverse) {
                  sens = (pezh[cpezhk].slc.charAt(2) === refslc)? 1: -1;
                } else {
                  sens = (pezh[cpezhk].slc.charAt(2) === refslc)? -1: 1;
                }            
              }
          
            }
            // use vecprod2d of vectors refat->f and f->t
            if ((hasCoord(mar,refat)) && (hasCoord(mar,pezh[cpezhk].f)) && (hasCoord(mar,pezh[cpezhk].t))) {
              d1x = mar[refat].x - mar[pezh[cpezhk].f].x;
              d1y = mar[refat].y - mar[pezh[cpezhk].f].y;
              d2x = mar[pezh[cpezhk].t].x - mar[pezh[cpezhk].f].x;
              d2y = mar[pezh[cpezhk].t].y - mar[pezh[cpezhk].f].y;
              vp2d = vecprod2d(d1x,d1y,d2x,d2y);
            } else if ((hasCoord(mar,pezh[cpezhk].tl1)) && (hasCoord(mar,pezh[cpezhk].f)) && (hasCoord(mar,pezh[cpezhk].t))) {
              d1x = mar[pezh[cpezhk].tl1].x - mar[pezh[cpezhk].f].x;
              d1y = mar[pezh[cpezhk].tl1].y - mar[pezh[cpezhk].f].y;
              d2x = mar[pezh[cpezhk].t].x - mar[pezh[cpezhk].f].x;
              d2y = mar[pezh[cpezhk].t].y - mar[pezh[cpezhk].f].y;
              vp2d = vecprod2d(d1x,d1y,d2x,d2y);
            } else if ((hasCoord(mar,pezh[cpezhk].tl2)) && (hasCoord(mar,pezh[cpezhk].f)) && (hasCoord(mar,pezh[cpezhk].t))) {
              d1x = mar[pezh[cpezhk].tl2].x - mar[pezh[cpezhk].f].x;
              d1y = mar[pezh[cpezhk].tl2].y - mar[pezh[cpezhk].f].y;
              d2x = mar[pezh[cpezhk].t].x - mar[pezh[cpezhk].f].x;
              d2y = mar[pezh[cpezhk].t].y - mar[pezh[cpezhk].f].y;
              vp2d = vecprod2d(d1x,d1y,d2x,d2y);
            } else {              
              vp2d = 1;
            }
          
            return (-1)*sens*vp2d*60;
        
          } // return the dir for the ligands of pezh[].t 

          function collisionCheck(mar,bar,ccrit,test,comstr) {
            // par: ccrit: if distance between atoms < ccrit ==> collision
            //    test: 0: replaces the PSglobal array tooClose[] with the resulting collisions
            //      1: only counts the Collisions without replacing the PSglobal array
            let dd = 1000;
            let i = 0;
            let j = 0;
            let jj = 0;
            let bix1 =0;
            let bix2 = 0;
            let bix3 =0;
            let bix4 = 0;
            let dist = 0;
            let nearpair = [];
            let pextring = [];
            const tmpColl = [];
            const tmpBondColl = [];
            const tmpAtBondColl = [];
            const tmpLigColl = [];
            let tmpCrossingBonds = [];
            let tmpRingAngtooLarge = [];
            const rcrit = ccrit/2;
            let tcrit = ccrit;
            const abcrit = ccrit/2;
            const bondrect = new Rect(0,0,0,0);
        
            // check for atom-atom collisions based on ccrit
            for (i=1;i<mar.length-1;i++) {
              for (jj=i+1;jj<mar.length;jj++) {
                if ((mar[i].x === 0) && (mar[i].y === 0) && (mar[jj].x === 0) && (mar[jj].y === 0)) {
                  continue; // skip if atoms have no coordinates yet
                }
                dist = Math.sqrt((mar[i].x-mar[jj].x)*(mar[i].x-mar[jj].x)+(mar[i].y-mar[jj].y)*(mar[i].y-mar[jj].y));
                if ((atInRh[String(i)] !== undefined) && (atInRh[String(jj)] !== undefined)) { // 2 ring atoms
                  tcrit = rcrit;
                } else {
                  tcrit = ccrit;
                }
                if (dist < tcrit) {
                  nearpair = [i,jj];
                  tmpColl.push(nearpair);
                }
              }
            }
            if (tmpColl.length > 0) {
              // check collisions pairwise for bond<=>bond collision (only if atom-atom collisions are present)
              for (i=0;i<tmpColl.length-1;i++) {
                for (jj=i+1;jj<tmpColl.length;jj++) {
                  bix1 = getBondIndex(bar,tmpColl[i][0],tmpColl[jj][0]);
                  bix2 = getBondIndex(bar,tmpColl[i][1],tmpColl[jj][1]);
                  bix3 = getBondIndex(bar,tmpColl[i][1],tmpColl[jj][0]);
                  bix4 = getBondIndex(bar,tmpColl[i][0],tmpColl[jj][1]);
                  if ((bix1 > 0) && (bix2 > 0)) {
                    tmpBondColl.push([bix1,bix2]);
                  } else if ((bix3 > 0) && (bix4 > 0)) {
                    tmpBondColl.push([bix3,bix4]);
                  }
                }
              }
            }
            
            // check for atom-bond collisions          
            for (jj=1;jj<bar.length;jj++) {
              bondrect.l=Math.min(mar[bar[jj].fra].x,mar[bar[jj].toa].x); 
              bondrect.t=Math.min(mar[bar[jj].fra].y,mar[bar[jj].toa].y);
              bondrect.w=Math.abs(mar[bar[jj].fra].x-mar[bar[jj].toa].x); 
              bondrect.h=Math.abs(mar[bar[jj].fra].y-mar[bar[jj].toa].y);
              for (i=1;i<mar.length;i++) {
                if ((i!==bar[jj].fra) && (i!==bar[jj].toa)) { // not atom of tested bond
                  if (inrect(bondrect,mar[i].x,mar[i].y)) {
                    if (distAtBond(mar,bar,i,jj) < abcrit) {
                      tmpAtBondColl.push([i,jj]);
                    }
                  }
                }
              }
            }
            
            // check for atoms having bonds to 2 or more ligands pointing in the same direction 
            for (i=1;i<mar.length;i++) { // check each Atom
              if (mar[i].bpa.length < 2) {
                continue;
              }
              for (j=0;j<mar[i].bpa.length-1;j++) { // check all ligand directions pairwise
                for (jj = j+1;jj<mar[i].bpa.length;jj++) {
                  dd = norma(getdiranglefromAt(mar,i, mar[i].bpa[jj].p) - getdiranglefromAt(mar,i, mar[i].bpa[j].p));
                  if (dd < 10) {
                    tmpLigColl.push([i,mar[i].bpa[j].p,mar[i].bpa[jj].p]);
                  }
                }              
              }
            }
            
            //check for bond-bond intersections
            tmpCrossingBonds = [];
            for (i=1;i<bar.length-1;i++) {
              for (j=i+1;j<bar.length;j++) {
                if (geminalBonds(mar,bar,i,j)) { continue; }
//                 if (ispringBond(mar,bar,i) && ispringBond(mar,bar,j)) { continue; } // BF190823 bond crossing between ring bonds accepted
                if ((ispringBond(mar,bar,i) > 0) || (ispringBond(mar,bar,j) > 0)) {
//                    console.log("bond "+i+" is in ring "+ispringBond(mar,bar,i)+" which is in pringsystems["+ringInRingSys(ispringBond(mar,bar,i))+"]");
//                    console.log("bond "+j+" is in ring "+ispringBond(mar,bar,j)+" which is in pringsystems["+ringInRingSys(ispringBond(mar,bar,j))+"]");
                   if ((ringInRingSys(ispringBond(mar,bar,i))>-1) && (ringInRingSys(ispringBond(mar,bar,j))>-1)) {
                     continue;
                   }
                }
                if (bondIntersect(mar,bar,i,j) === 1) {							
                  tmpCrossingBonds.push([i,j]);
                }
              }
            }
            
            //check for rings with n < 8 with inner angles > 175° of single bonds
            tmpRingAngtooLarge = [];
            for (i=1;i<prings.length;i++) {
              if ((prings[i].length > 7 ) || (isemfuPring(i)===true)) { // exempt rings with n >= 8 and emfu rings
                continue;
              }
              pextring = prings[i].slice(0);
              pextring.push(prings[i][0]); // extend ring with 1st Atom
              pextring.unshift(prings[i][prings[i].length-1]); //prefix ring with last Atom
              
              for (j=1;j<pextring.length-1;j++) {
                if (ispBridgehead(mar, pextring[j]) > 2) { // exempt bridgehead atoms
                  continue;
                }
                if (getbondanglefromAt(mar,pextring[j],pextring[j-1],pextring[j+1]) > 165) {
                  tmpRingAngtooLarge.push([i,pextring[j]]); // entry is [ index of ring in prings, index of atom in mar]
                }
              }
            }
                
            

            if (test===0) {
              tooClose = [];
              for (i=0;i<tmpColl.length;i++) {
                tooClose.push(tmpColl[i]);
              }
              bondTooClose = [];
              for (i=0;i<tmpBondColl.length;i++) {
                bondTooClose.push(tmpBondColl[i]);
              }
              atBondTooClose = [];
              for (i=0;i<tmpAtBondColl.length;i++) {
                atBondTooClose.push(tmpAtBondColl[i]);
              }
              atLigDirSame = [];
              for (i=0;i<tmpLigColl.length;i++) {
                atLigDirSame.push(tmpLigColl[i]);
              }
              crossingBonds = [];
              for (i=0;i<tmpCrossingBonds.length;i++) {
                crossingBonds.push(tmpCrossingBonds[i]);
              }
              ringAngtooLarge = [];
              for (i=0;i<tmpRingAngtooLarge.length;i++) {
                ringAngtooLarge.push(tmpRingAngtooLarge[i]);
              } 
// //              diag output of collisions
//               console.log("collisionCheck "+comstr+"\ntotal collisions:"+(tooClose.length+bondTooClose.length+atBondTooClose.length+atLigDirSame.length+crossingBonds.length+ringAngtooLarge.length));
//               if (tooClose.length > 0) {
//                 console.log("tooClose:");
//                 for (i=0; i < tooClose.length;i++) {
//                   console.log("["+i+"] "+tooClose[i]);
//                 }
//               }             
//               if (bondTooClose.length > 0) {
//                 console.log("bondTooClose:");
//                 for (i=0; i < bondTooClose.length;i++) {
//                   console.log("["+i+"] "+bondTooClose[i]);
//                 }
//               }             
//               if (ringAngtooLarge.length > 0) {
//                 console.log("ringAngtooLarge:");
//                 for (i=0; i < ringAngtooLarge.length;i++) {
//                   console.log("["+i+"] "+ringAngtooLarge[i]);
//                 }
//               }             
//               if (atLigDirSame.length > 0) {
//                 console.log("atLigDirSame:");
//                 for (i=0; i < atLigDirSame.length;i++) {
//                   console.log("["+i+"] "+atLigDirSame[i]);
//                 }
//               }             
//               if (crossingBonds.length > 0) {
//                 console.log("crossing Bonds:");
//                 for (i=0; i < crossingBonds.length;i++) {
//                   console.log("["+i+"] "+crossingBonds[i]);
//                   console.log("in rings: "+ispringBond(mar,bar,crossingBonds[i][0])+" and "+ispringBond(mar,bar,crossingBonds[i][1]));
//                 }
//               }             
            }
            if (test===1) {
              return tmpColl.length+tmpBondColl.length+tmpAtBondColl.length+tmpLigColl.length+tmpCrossingBonds.length+tmpRingAngtooLarge.length;
            } else {
              return tooClose.length+bondTooClose.length+atBondTooClose.length+atLigDirSame.length+crossingBonds.length+ringAngtooLarge.length;
            }
            
            function geminalBonds(mar,bar,bx1,bx2) {
              let fra1, fra2, toa1, toa2;
              fra1=bar[bx1].fra;
              fra2=bar[bx2].fra;
              toa1=bar[bx1].toa;
              toa2=bar[bx2].toa;
              if ((fra1===fra2) || (toa1===toa2) || (fra1===toa2) || (fra2 == toa1)) {
                return true;
              } else {
                return false;
              }
            }
              
            
            function bondIntersect(mar,bar,abix,bbix) {
              let a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y;
              let dax, day, dbx, dby, den, da1b1x, da1b1y;
              let denposit = false;
              let snumer, tnumer;
              const epsilon = 1e-8;
           
              a1x = mar[bar[abix].fra].x;
              a1y = mar[bar[abix].fra].y;
              a2x = mar[bar[abix].toa].x;
              a2y = mar[bar[abix].toa].y;
              b1x = mar[bar[bbix].fra].x;
              b1y = mar[bar[bbix].fra].y;
              b2x = mar[bar[bbix].toa].x;
              b2y = mar[bar[bbix].toa].y;
          
              dax = a2x-a1x;
              day = a2y-a1y;
              dbx = b2x-b1x;
              dby = b2y-b1y;
  
                  den = dax*dby - dbx*day;
  
              if (Math.abs(den) < epsilon) {
                return 0; // Collinear
              } else if (den > 0) {
                denposit = true;
              }
              da1b1x = a1x - b1x;
              da1b1y = a1y - b1y;
              snumer = dax*da1b1y - day*da1b1x;
          
              if ((snumer < 0) === denposit) { 
                return 0; // No collision
              } 
              tnumer = dbx*da1b1y - dby*da1b1x;
              if ((tnumer < 0) === denposit) {
                return 0; // No collision 
              }
              if (((snumer > den) === denposit) || ((tnumer > den) === denposit)) {
                return 0; // No collision 
              }
              // Collision detected 
              return 1; 
            } // returns 1 if the two bonds with indices abix and bbix in bar[] intersect, returns 0 otherwise

          } // check for atom-atom, bond-bond, atom-bond, ligand-ligand collisions and crossing bonds
          // mod:200208-1655
        
          function fixColl(mar,bar) {
            let jj=0;
            let k=0;
            let sec = 0;
            let ssec = 0; //BF200820.2
            let bondToChange1 = 0; // bond index in bar
            let bondToChange2 = 0;
            let totcoll = 0;
            let lor = -1;


            totcoll = collisionCheck(mar,bar,pcrit,0," After first checkCollisions");
            if (atLigDirSame.length > 0) { // bonds to ligands at one atom have same direction
              sec=0;
              while ((atLigDirSame.length > 0) && (sec < 6)) {
                fixLigDirSame(mar,bar,0);
                totcoll = collisionCheck(mar,bar,pcrit,0," after fixLigDirSame");
                sec++;
              }
            }
            if (bondTooClose.length > 0) {
              sec=0;
              while ((bondTooClose.length > 0) && (sec <=6)) { // bonds on top of each other
                fixBondColl(mar,bar, bondTooClose[0][0], bondTooClose[0][1]);
                totcoll = collisionCheck(mar,bar,pcrit,0," after fixBondColl");
                if (totcoll===0) {
                  return;
                }
                sec++;
              }
            } else if (crossingBonds.length > 0) {
              sec=0;
//               if (pSpiroRings.length > 0) {
//                 console.log("pSpiroRings: ");
//                 for (k=0;k<pSpiroRings.length;k++) {
//                   console.log("["+k+"] r1="+pSpiroRings[k].r1+" r2="+pSpiroRings[k].r2+" at="+pSpiroRings[k].at);
//                 }
//                 console.log("pringsystems.length="+pringsystems.length);
//               }
              while ((crossingBonds.length > 0) && (sec < 6)) {
                fixCrossingBonds(mar,bar,crossingBonds[0][0],crossingBonds[0][1]);
                if (crossingBonds.length === 0) {
                  continue;
                }
                totcoll = collisionCheck(mar,bar,pcrit,0,"after fixCrossingBonds");
                sec++; 
              }            
            } else if (atBondTooClose.length > 0) { // atom on top of bond
              sec=0;
              while ((atBondTooClose.length > 0) && (sec < 6)) {
                for (jj=0;jj<atBondTooClose.length;jj++) {
                  //try by flipping based on 2 atoms
                  fixAtomAtomCollisonByFlip(mar,bar,atBondTooClose[0][0],bar[atBondTooClose[0][1]].fra);
                  totcoll = collisionCheck(mar,bar,pcrit,0,"atBondTooClose after fixAtomAtomCollisonByFlip with fra");
                  if (totcoll===0) { 
                    return; 
                  } else if (atBondTooClose.length === 0) {
                    break;
                  } else {
                    fixAtomAtomCollisonByFlip(mar,bar,atBondTooClose[0][0],bar[atBondTooClose[0][1]].toa);
                    totcoll = collisionCheck(mar,bar,pcrit,0,"atBondTooClose after fixAtomAtomCollisonByFlip with toa");
                    if (totcoll===0) { 
                      return; 
                    } else if (atBondTooClose.length === 0) {
                      break;
                    }
                  }
                  // try by moving atoms                  
                  fixAtBondCollisions(mar,bar,atBondTooClose[jj][0],atBondTooClose[jj][1]);
                  if (atBondTooClose.length === 0) {
                    continue;
                  }
                }
                totcoll = collisionCheck(mar,bar,pcrit,0," after fixAtBondCollisions by moving atom");
                sec++;
              }
            }
        
            sec=0;
            while ((tooClose.length > 0) && (sec <= 10)) {
              fixAtomAtomCollisonByFlip(mar,bar,tooClose[0][0],tooClose[0][1]);
              totcoll = collisionCheck(mar,bar,pcrit,0," after fixAtomAtomCollisonByFlip inside tooClose() while loop");
              if (totcoll===0) { return; }
              if (tooClose.length > 0) {
                //try stretching a bond
                getsuitableBonds(mar,bar,tooClose[0][0],tooClose[0][1]);
                if (spbixar.length > 0) {
                  if ((spbixar.length % 2) === 0) { // even number of stretchable bonds
                    bondToChange1 = spbixar[Math.floor(spbixar.length/2)-1];
                    bondToChange2 = spbixar[Math.floor(spbixar.length/2)];
                    ssec = 0;
                    while ((tooClose.length > 0) && (ssec < 6)) { //BF200820.3
                      stretchBond(mar,bar,bondToChange1,1.0*crit/bondlength); //BF200820.3
                      totcoll = collisionCheck(mar,bar,pcrit,0," after stretch bond1 even number"); //BF200820.3
//                      console.log("bondstretch (first bond) ssec="+ssec+" totcoll="+totcoll);
                      ssec++; //BF200820.3
                    } //BF200820.3
                    if (totcoll===0) {
                      return;
                    }
//                    console.log("bondstretch (1st bond) failed: totcoll="+totcoll+" ssec="+ssec);
                    // shrink first bond back
                    stretchBond(mar,bar,bondToChange1,(-1.0)*(ssec+1)*crit/bondlength);
                    ssec = 0;
                    // stretch second bond
                    while ((tooClose.length > 0) && (ssec < 6)) { //BF200820.3
                      stretchBond(mar,bar,bondToChange2,1.0*crit/bondlength); //BF200820.3
                      totcoll = collisionCheck(mar,bar,pcrit,0," after stretch bond2 even number"); //BF200820.3
//                      console.log("bondstretch (first bond) ssec="+ssec+" totcoll="+totcoll);
                      ssec++; //BF200820.3
                    } //BF200820.3
                    if (totcoll===0) {
                      return;
                    }
//                    console.log("bondstretch (2nd bond) failed: totcoll="+totcoll+" ssec="+ssec);
                    // shrink second bond back
                    stretchBond(mar,bar,bondToChange2,(-1.0)*(ssec+1)*crit/bondlength);
                    totcoll= collisionCheck(mar,bar,pcrit,0," after stretch bond");
                    if (totcoll===0) {
                      return;
                    }
                    ssec = 0;
                    // try stretching both bonds simultaneously
                    while ((tooClose.length > 0) && (ssec < 6)) { //BF200820.3
                      stretchBond(mar,bar,bondToChange1,1.0*crit/bondlength); //BF200820.3
                      stretchBond(mar,bar,bondToChange2,1.0*crit/bondlength); //BF200820.3
                      totcoll = collisionCheck(mar,bar,pcrit,0," after stretch 2bonds even number"); //BF200820.3
//                      console.log("bondstretch (even) both bonds) ssec="+ssec+" totcoll="+totcoll);
                      ssec++; //BF200820.3
                    } //BF200820.3
                    if (totcoll===0) {
                      return;
                    }
                    // shrink both bonds back
                    stretchBond(mar,bar,bondToChange1,(-1.0)*(ssec+1)*crit/bondlength);
                    stretchBond(mar,bar,bondToChange2,(-1.0)*(ssec+1)*crit/bondlength);                                      
                  } else { // odd number of stretchable bonds
                    bondToChange1 = spbixar[Math.floor(spbixar.length/2)];
                    ssec = 0;
                    while ((tooClose.length > 0) && (ssec < 6)) { //BF200820.3
                      stretchBond(mar,bar,bondToChange1,2*crit/bondlength);
                      totcoll = collisionCheck(mar,bar,pcrit,0," after stretch bond odd number");
//                      console.log("bondstretch (odd 1 bond) ssec="+ssec+" totcoll="+totcoll);
                     ssec++;
                    }
                    if (totcoll===0) {
                      return;
                    } else {
                      // shrink bond back
//                      console.log("bondstretch (odd 1 bond) failed: totcoll="+totcoll+" ssec="+ssec);
                      stretchBond(mar,bar,bondToChange1,(-2)*(ssec+1)*crit/bondlength);
                    }
                  }
                  // try bending suitable bonds on the shortest path
                  // loop from 2nd to 3rd-last atom of shortest path for pivot
                  for (k=1;k<shortpath.length-2;k++) {
                    if (spbixar.includes(getBondIndex(bar,shortpath[k],shortpath[k+1]))) {
                      // bond shortpath[k]->shortpath[k+1] is not ring bond and not multiple
                      lor = getRingSense(mar,shortpath[k+1],shortpath[k],shortpath[k-1]);
                      bendBond(mar,bar,shortpath[k+1],shortpath[k],0,lor);
                      totcoll = collisionCheck(mar,bar,pcrit,0," after bending bond");
                      if (totcoll===0) {
                        return;
                      } else {
                      // bend bond spbix back
                        bendBond(mar,bar,shortpath[k+1],shortpath[k],0,(-1)*lor);                
                      }
                    }                         
                  }
                }
              }
              sec++;            
            } // end while ((tooClose.length > 0) && (sec <= 20))
            
            totcoll=collisionCheck(mar,bar,pcrit,0," after while loop");
            // fix ring angle if one is near 180°
            if ((totcoll !== 0) && (ringAngtooLarge.length > 0)) {
              fix_pRingAngle(mar,bar,ringAngtooLarge[0][0],ringAngtooLarge[0][1]);
              totcoll = collisionCheck(mar,bar,pcrit,0," after while loop: after fix_pRingAngle");
            }
            // if all else failed: shorten bond of ca1 (shortpath[0]) to shortpath[1].
            if ((totcoll !== 0) && (totcoll != crossingBonds.length) && (tooClose.length != 0)) {
              getsuitableBonds(mar,bar,tooClose[0][0],tooClose[0][1]);
              if (shortpath.length > 1) {
                bondToChange1 = getBondIndex(bar,shortpath[0],shortpath[1]);
                stretchBond(mar,bar,bondToChange1,(-2)*crit/bondlength);
                totcoll = collisionCheck(mar,bar,pcrit,0," after while loop: after stretchBond");
              }
            }
            if ((totcoll !== 0) && (totcoll === crossingBonds.length)) { // only crossing bonds remain as collisions
              sec=0;
              while ((crossingBonds.length > 0) && (sec < 6)) {
                fixCrossingBonds(mar,bar,crossingBonds[0][0],crossingBonds[0][1]);
                totcoll = collisionCheck(mar,bar,pcrit,0," after while loop: after fixCrossingBonds");
                sec++;
              } 
            }
            if ((totcoll !== 0) && (totcoll === atBondTooClose.length)) { // only atom-bond collisions remain //BF191009.1  
              fixAtBondCollisions(mar,bar,atBondTooClose[0][0],atBondTooClose[0][1]); //BF191009.1  
              totcoll = collisionCheck(mar,bar,pcrit,0," after while loop: after fixAtBondCollisions"); 
            } //BF191009.1  
        
      // end of fixColl main section
          
            function getsuitableBonds(mar,bar,ca1,ca2) {            
              let cac = 0;
              let swap = false;
          
              cac = 0;
              swap = false;
              switch (true) { // decide about which atom's branch to move
                case ((atInRing(ca1) === 0) && (atInRing(ca2) === 0)): // both atoms not in ring
                  if (chainOf(achains,ca1) < chainOf(achains,ca2)) { // the chain with the higher level
                    swap = true;
                  } 
                  break;
                case ((atInRing(ca1) > 0) && (atInRing(ca2) === 0)):
                    swap = true;
                  break;
                case ((atInRing(ca1) > 0) && (atInRing(ca2) > 0)):
                  // move the branch with the smaller ring
                  if (prings[atInRing(ca1)].length > prings[atInRing(ca2)].length) {
                    swap = true;
                  }
                  break;
              }
              if (swap) {
                // swap ca1 and ca2
                cac = ca2;
                ca2 = ca1;
                ca1 = cac;
              }        
              // at this point, ca1 is the atom in the branch to move, ca2 the other one
              findShortestPath(mar,bar,ca1,ca2);
            } // fills the shortpath[] and spbixar[] arrays for collision tooClose[0]
    
            function fixAtomAtomCollisonByFlip(mar,bar,cat1,cat2) {
              let spbix = 0;
              let mintotcoll = totcoll;
              const origtotcoll = totcoll;
              let testColl = 0;
              let bestFlip = 0;
              
              getsuitableBonds(mar,bar,cat1,cat2);          

              if (spbixar.length > 0) {
                // try to flip all acyclic single bonds on the shortest path between ca1 and ca2
                // and record the one resulting in the lowest number of collisions          
                // loop over all bonds in spbixar[]
                spbix = 0;
                bestFlip = -1;
                while (spbix < spbixar.length) {
                  // flip bond spbixar[spbix]
                  flipBranch(mar,bar,spbixar[spbix],1,true);
                  testColl = collisionCheck(mar,bar,pcrit,1,'');
                  // flip bond spbix back
                  flipBranch(mar,bar,spbixar[spbix],-1,true); // undo the flip
                  if (testColl < mintotcoll) { // lowest number of collisions so far
                    bestFlip = spbix;
                    mintotcoll = testColl;
                  }
                  spbix++;
                }
                if ((mintotcoll < origtotcoll) && (bestFlip !== -1)) {
                  flipBranch(mar,bar,spbixar[bestFlip],1,true);
                  totcoll = collisionCheck(mar,bar,pcrit,0,"inside fixAtomAtomCollisionsByFlip: after flipBranch after bestFlip");
                }                
              }
            } // try to fix atom-atom collision by flip
            
            function fixBondColl(mar,bar, bo1ix, bo2ix) {
              let r1=0;
              let r2=0;
              let s1x = 0;
              let s1y = 0;
              let s2x = 0;
              let s2y = 0;
              let c1x = 0;
              let c1y = 0;
              let c2x = 0;
              let c2y = 0;
              let d1x = 0;
              let d1y = 0;
              let d2x = 0;
              let d2y = 0;
              let dl1 = 1;
              let dl2 = 1;
          
              r1 = ispringBond(mar,bar,bo1ix);
              r2 = ispringBond(mar,bar,bo2ix)
              if ((r1 > 0) && (r2 > 0)) { // 2 rings overlap with one bond
                for (jj=0;jj<prings[r1].length;jj++) {
                  s1x += mar[prings[r1][jj]].x;
                  s1y += mar[prings[r1][jj]].y;
                }
                s1x = s1x/prings[r1].length;
                s1y = s1y/prings[r1].length;
                c1x = (mar[bar[bo1ix].fra].x + mar[bar[bo1ix].toa].x)/2;
                c1y = (mar[bar[bo1ix].fra].y + mar[bar[bo1ix].toa].y)/2;
                for (jj=0;jj<prings[r2].length;jj++) {
                  s2x += mar[prings[r2][jj]].x;
                  s2y += mar[prings[r2][jj]].y;
                }
                s2x = s2x/prings[r2].length;
                s2y = s2y/prings[r2].length;            
                c2x = (mar[bar[bo2ix].fra].x + mar[bar[bo2ix].toa].x)/2;
                c2y = (mar[bar[bo2ix].fra].y + mar[bar[bo2ix].toa].y)/2;
                d1x = s1x - c1x;
                d1y = s1y - c1y;
                d2x = s2x - c2x;
                d2y = s2y - c2y;
                dl1 = Math.sqrt(d1x*d1x+d1y*d1y);
                dl2 = Math.sqrt(d2x*d2x+d2y*d2y)
                d1x = crit*d1x/dl1;          
                d1y = crit*d1y/dl1;          
                d2x = crit*d2x/dl2;          
                d2y = crit*d2y/dl2;
                mar[bar[bo1ix].fra].x += d1x;          
                mar[bar[bo1ix].fra].y += d1y;          
                mar[bar[bo1ix].toa].x += d1x;          
                mar[bar[bo1ix].toa].y += d1y;          
                mar[bar[bo2ix].fra].x += d2x;          
                mar[bar[bo2ix].fra].y += d2y;          
                mar[bar[bo2ix].toa].x += d2x;          
                mar[bar[bo2ix].toa].y += d2y;          
              }
            } // fix bond-bond collisions
          
            function fixAtBondCollisions(mar,bar,ax,bx) {
              let sec = 0;
              let ncol = 0;
              const bov = new Coord(mar[bar[bx].toa].x - mar[bar[bx].fra].x, mar[bar[bx].toa].y - mar[bar[bx].fra].y);
              const fv = new Coord(mar[ax].x - mar[bar[bx].fra].x, mar[ax].y - mar[bar[bx].fra].y);
              const uv = new Coord(bov.x/vlen2d(bov),bov.y/vlen2d(bov)); // normalized bond vector fra->toa
              const pv = new Coord(uv.x*vdot2d(fv,uv),uv.y*vdot2d(fv,uv)); //projection on bond vector
              const nv = new Coord(0,0);
              const mv = new Coord(0,0); // vector of move by crit in direction of normal
              
              nv.x = mar[ax].x - (mar[bar[bx].fra].x + pv.x); // normal vector from bond to ax
              nv.y = mar[ax].y - (mar[bar[bx].fra].y + pv.y); // normal vector from bond to ax
              mv.x = nv.x*pcrit/vlen2d(nv);
              mv.y = nv.y*pcrit/vlen2d(nv);
              
              sec=0;
              while ((atBondTooClose.length > 0) && (atBondTooClose[0][0]===ax) && (atBondTooClose[0][1]===bx) && (sec < 4)) {
                mar[ax].x += mv.x;
                mar[ax].y += mv.y;
                ncol=collisionCheck(mar,bar,pcrit,0," inside fixAtBondCollisions after atom move");
                sec++;
              }
              
            } // fix atom-bond collisions
            
            function fixLigDirSame(mar, bar,ix) {
              const at = atLigDirSame[ix][0];
              const lig1 = atLigDirSame[ix][1];
              const lig2 = atLigDirSame[ix][2];
              let i=0;
              let ligm = 0;
              let ligp = 0;
              let bix1 = 0;
              let bix2 = 0;
              let lsector = 0;
              let olddir = 0;
              let newdir = 0;
              
              sectors=[];
              getSectorsAt(mar,at,true);
//               console.log("sectors:");
//               for (i=0;i<sectors.length;i++) {
//                 console.log("["+i+"] ra:"+sectors[i].ra+" la:"+sectors[i].la+" wi:"+sectors[i].wi);
//               }
//               console.log("lsector="+lsector);
              bix1 = ispringBond(mar,bar,getBondIndex(bar,at,lig1)); //BUFGFIX 190928.2
              bix2 = ispringBond(mar,bar,getBondIndex(bar,at,lig2)); //BUFGFIX 190928.2
              if ((bix1 === 0) && (bix2 === 0)) {  // lig1 and lig2 a not in ring
                ligm = lig1;
                ligp = lig2;
              } else if ((bix1 === 0) && (bix2 > 0)) {  // lig2 is in ring, lig1 is not
                ligm = lig1;
                ligp = lig2;
              } else if ((bix1 > 0) && (bix2 === 0)) {  // lig1 is in ring, lig2 is not
                ligm = lig2;
                ligp = lig1;
              }
              lsector = sectors.length-1;
              for (i=sectors.length-1;i >= 0;i--) {
                // if it is a sector inside a ring: use next smaller sector
                if (atInSame_pRing(sectors[i].ra,sectors[i].la)>0) {
//                   console.log("sectors["+i+"] is in ring "+atInSame_pRing(sectors[i].ra,sectors[i].la));
                  lsector--;
                } else if ((sectors[i].ra===ligm) || (sectors[i].la===ligm)) { //ra or la of sector is ligm
                  lsector--;
                } else {
                  break;
                }                
              }
              if (lsector < 0) { // all sectors are inside rings: use largest sector
                lsector = sectors.length-1;
              }
//               console.log("lsector="+lsector);

//               console.log("lsector="+lsector+" ligm="+ligm+" ligp="+ligp);
              if ((ligm != 0) && (ligp != 0) && (sectors[lsector] !== undefined)) {
                olddir = getdiranglefromAt(mar,at,ligm);
                // BUG on next line: sectors[lsector].ra gives undefined!!!
                newdir = getBisectorFrom3At(mar,at,sectors[lsector].ra,sectors[lsector].la,(sectors[lsector].wi > 180)? true : false);
//                 console.log("olddir="+olddir+" newdir="+newdir);
                bendBond(mar,bar,at,ligm,olddir,1);
                bendBond(mar,bar,at,ligm,newdir,-1);
              }
            } // rotates branch of one of the overlapping ligands of atom mar[ix] to the center of the largest free sector 
              // ring bonds are not rotated.

            function fixCrossingBonds(mar,bar,bix1,bix2) {
              let shops = [];
              let flpar = [];
                              
              // find shortest path between crossing bonds
              findShortestPath(mar,bar,bar[bix1].fra,bar[bix2].fra);
              shops = shortpath.slice(0);
              flpar = spbixar.slice(0);
              findShortestPath(mar,bar,bar[bix1].toa,bar[bix2].fra);
              if (shortpath.length > shops.length) {
                shops = shortpath.slice(0);
                flpar = spbixar.slice(0);
              }
              findShortestPath(mar,bar,bar[bix1].fra,bar[bix2].toa);
              if (shortpath.length > shops.length) {
                shops = shortpath.slice(0);
                flpar = spbixar.slice(0);
              }
              findShortestPath(mar,bar,bar[bix1].toa,bar[bix2].toa);
              if (shortpath.length > shops.length) {
                shops = shortpath.slice(0);
                flpar = spbixar.slice(0);
              }
              shortpath = shops.slice(0);
              spbixar = flpar.slice(0);
              for (i=0;i<spbixar.length;i++) {
                flipBranch(mar,bar,spbixar[i],1,true);
                totcoll=collisionCheck(mar,bar,pcrit,0," inside fixCrossingBonds: after flipBranch");
                if (crossingBonds.length === 0) {
                  return;
                } else {
                  flipBranch(mar,bar,spbixar[i],-1,true);
                }
              }
            }      

            function stretchBond(mar,bar,bixst,fact) {
            // param:   bixst: bond to stretch (index in bar)
            //    fact: factor by which bondlength is increased.
              let i=0;
              let dx = 0;
              let dy = 0;
              let dirang = 0;
              const dbl = bondlength*fact; // the delta bondlength in pix (negative means shortening the bond)
              let obl = 0; // the current bondlength
              let nbl = 0; // the new bondlength
              let nx1 = 0;
              let ny1 = 0;
              let p1 = 0;
              let p2 = 0;

              if ((bixst === undefined) || (bixst < 1) || (bixst > bar.length)) {
                return;
              }          
              // find the pivot atoms: p2 is further from ca1, p1 is closer
              // ca2--------p1-p2--------ca1
              // find the pivot atoms: p2 is earlier than p1 in the shortpath
              p2 = shortpath[Math.min(shortpath.indexOf(bar[bixst].fra),shortpath.indexOf(bar[bixst].toa))];
              p1 = shortpath[Math.max(shortpath.indexOf(bar[bixst].fra),shortpath.indexOf(bar[bixst].toa))];
          
              obl = Math.sqrt((mar[p1].x - mar[p2].x)*(mar[p1].x - mar[p2].x)+(mar[p1].y - mar[p2].y)*(mar[p1].y - mar[p2].y));
              dirang = getdiranglefromAt(mar,p2,p1);
              dx = dbl*Math.cos(Math.PI*dirang/180);
              dy = (-1)*dbl*Math.sin(Math.PI*dirang/180);
              dfsU(mar,p1,p2);
              nx1 = mar[visnodesDFS[1]].x + dx;
              ny1 = mar[visnodesDFS[1]].y + dy;
              nbl = Math.sqrt((mar[visnodesDFS[0]].x - nx1)*(mar[visnodesDFS[0]].x - nx1)+(mar[visnodesDFS[0]].y - ny1)*(mar[visnodesDFS[0]].y - ny1));          
              if (((nbl < obl) && (fact > 0)) || ((nbl > obl) && (fact < 0))) { // wrong extension direction 
                dx *= (-1);
                dy *= (-1);            
              }          
              for (i=1;i<visnodesDFS.length;i++) { // visnodesDFS[0] is fra, leave its coord alone
                mar[visnodesDFS[i]].x += dx;
                mar[visnodesDFS[i]].y += dy;
              }
            }
                
            function bendBond(mar,bar,p1,p2,rotang,fb) {
              //params:  p1: the point translated to (0|0) and the rotation center
              //    p2: the atom before p1 on shortpath ca1->...->ca2, where dfsU starts
              //    fb: 1: CCW, -1: CW
              let i=0;
              let tvx=0;
              let tvy=0;
              let dis = 0;
              const ca1 = shortpath[0];

              // select the branch
              dfsU(mar,p2,p1);
              for (i=0;i<mar.length;i++) {
                mar[i].s = 0;
              }
              for (i=0;i<visnodesDFS.length;i++) { // select all atoms in the branch
                mar[visnodesDFS[i]].s = 1;
              }
              // calculate the rotation angle from the distance of p1 to ca1
              if ((rotang===0) && (ca1 > 0)) {
                dis = Math.sqrt((mar[p1].x-mar[ca1].x)*(mar[p1].x-mar[ca1].x)+(mar[p1].y-mar[ca1].y)*(mar[p1].y-mar[ca1].y));
                rotang = 180*(Math.asin(2*crit/dis))/Math.PI;
              }
              // rotate the branch by rotang
              tvx = mar[p1].x;
              tvy = mar[p1].y;
              translate2D(mar,1,(-1)*tvx,(-1)*tvy,false);
              rot2D(mar,1,mar[p1].x,mar[p1].y,fb*rotang,false);
              translate2D(mar,1,tvx,tvy,false);          
              clearSelection();
            }
            
            function fix_pRingAngle(mar,bar,rix,ax) {
              const atixir = prings[rix].indexOf(ax);
              const oldco = new Coord(mar[ax].x,mar[ax].y);
              const dco = new Coord(0,0);
              let coMco = new Coord(0,0);
              let expdir = 0;

              if (atixir > -1) {
                coMco = pringCofM(mar,rix);
                expdir = getdirangle(coMco.x,coMco.y,oldco.x,oldco.y); // vector from ring center to ax
                dco.x = 2*crit*Math.cos(Math.PI*expdir/180);
                dco.y = -2*crit*Math.sin(Math.PI*expdir/180);
                mar[ax].x = oldco.x+dco.x;
                mar[ax].y = oldco.y+dco.y;
              }            
            }
        
          } // fix collisions mod:200208-1655
      
          function stereobonds(mar,bar) {
          // for each atom having a stereodescriptor m_s[i].rs===(@|@@)
          // check the ligands and figure out existence of implicit H or lone pairs
          // bring the ligand atoms in the order they appear in the SMILES (identical to order in m_s for explicit atoms)
          // check for the order of the ligands as drawn in 2D
          // figure out which bond should be changed to btyp 4 or 5.
          // change the bond of the selected ligand with changeBondType()
          // preference: acyclic single bond of btyp 1.
    
          // depends on pscAtoms[] having been filled by createNextAtom()
    
            let acligs = [];
            let brdghdligs = []; // ligands of bridgehead sc atoms that are bridgeheads themselves
            let cu = new Cumulene(0,0,0,0);
            let culigs1 = []; // ligands at end1 of cumulene
            let culigs2 = []; // ligands at end2 of cumulene
            let ehdir = 0;
            let ehx = 0;
            let ehy = 0;
            let dfb = 0;
            let i=0;
            let inclig = 0; // the incoming ligand
            let jj=0;
            let libix = 0;
            let lig0 = 0; // the ligand (index in mar[]) which will have a z of ±1 and btyp 4 or 5
            let lig1 = 0; // for SC atoms with 4 nonH/LP ligands: the second ligand receiving a stereobond opposite to lig0 
            let ligs = []; // array with the ligand atoms (index in mar)
            let mva = 0; //atom to move
            let rcdig = ''; // a ring closure digit as string
            let rcligs = [];
            let refd = 0;
            let rlct = 0;
            let ros = 0;
            let r2rligs = [];
            let r2rlig = 0;
            let sc = 0;
            let scntr = 0; 
            let scstr = '';
            let sc4ra = true;
            let sec = 0;
            let stereo = 0; // code for the stereodescriptor 1: CCW;  -1: CW
            let temp = 0;
            let te = 0;
            let tetatoms = [];          
            let stereoBridgeKey = '';
            let stereobridgeLig = 0;
            let stereoRing = 0;
            let stereoRingLig = 0;
      
            if (mar === m_s) { // sort the bpa[] arrays of all atoms according to increasing bond directions (CCW, east => 0)
              for (i=1;i<mar.length;i++) {
                sort_abop_by_dir(m_s,i);
              }
            }
        
            warnAtoms = [];
      
            for (i=0;i<pscAtoms.length;i++) { // main loop aver all stereogenic centers
      
              sc = pscAtoms[i];
              ligs = [];
              rcligs = [];
              culigs1 = [];
              culigs2 = [];
              r2rligs = [];
              r2rlig = 0;
              brdghdligs = [];
              rcdig = '';
              lig0 = 0;
              lig1 = 0;
              inclig = 0;
              dfb = 0;
              libix = 0;
              sc4ra = true;
              scstr = '';
              tetatoms = [];
              cu.c = 0;
              cu.e1 = 0;
              cu.e2 = 0;
              cu.n = 0;
              te = 0;
              ehdir = 0;
              ehx = 0;
              ehy = 0;
              sectors = [];
        
              stereo = (mar[sc].rs === '@')? 1 : -1;
              // check for cumulene stereocenter
              if (hasDB(mar,bar,pscAtoms[i]) === 2) {
                // find the two end atoms of the cumulene and the 4 ligands
                cu = followCumulene(mar,pscAtoms[i]);
                // bugfix 190205.1
                // get_ccSense_one requires that cu.e1 is the out of plane end and cu.e2 is the in plane end.
                // below, we will set the z of the ligands at the end without the incoming ligand (the one coming later in the SMILES) to ±1
                // therefore, the end without incoming ligand (which comes later in the SMILES) has to be set to e1
                if (cu.e1 < cu.e2) { //swap e1 and e2
                  te = cu.e1;
                  cu.e1 = cu.e2;
                  cu.e2 = te;
                }   
            
                for (jj=0;jj<mar[cu.e1].bpa.length;jj++) {
            
                  if (mar[cu.e1].bpa[jj].t === 1) {
                    culigs1.push(mar[cu.e1].bpa[jj].p);
                    ligs.push(mar[cu.e1].bpa[jj].p);
                  }
                }
                for (jj=0;jj<mar[cu.e2].bpa.length;jj++) {
                  if (mar[cu.e2].bpa[jj].t === 1) {
                    culigs2.push(mar[cu.e2].bpa[jj].p);
                    ligs.push(mar[cu.e2].bpa[jj].p);
                  }
                }
              } else {
                // make a list of the bpa atoms that are not ring closures in ligs[]            
                // and store the ones that are ring closures in rcligs[[atom],[ring closure digit as number]]
                for (jj=0;jj<mar[sc].bpa.length;jj++) { // check if ligands are ring closures to sc
                  rcdig = getpRingClosureDigit(sc,mar[sc].bpa[jj].p);
                  if (rcdig !== '') {
                    rcligs.push([mar[sc].bpa[jj].p,parseInt(rcdig,10)]);
                  } else {
                    ligs.push(mar[sc].bpa[jj].p);
                  }  
                }
                ligs.sort( (a, b) => a - b); 
                // this brings the ligands into the order they appear in the SMILES
                // because all atoms were created in parseSMILES in this order.
                if (rcligs.length > 0) { // sort the ring closure ligands according to ring closure number
                  rcligs.sort( (a, b) => parseInt(a[1],10) - parseInt(b[1],10));
                  for (jj=rcligs.length-1; jj >= 0 ;jj--) { // insert rcligands at the start of ligs
                    ligs.unshift(rcligs[jj][0]); //  so that they will be in order of increasing rc number
                  }
                }
          
        
                // determine the incoming ligand: the last ligand with lower atom index than the central atom sc
                for (jj=0;jj<ligs.length;jj++) {
                  if (ligs[jj] < sc) {
                    inclig = ligs[jj];
                  }
                }
              }             
        
          // select the ligands to change to z = ±1
              getSectorsAt(mar,sc,true); //BUGFIX 190928.1
              
              if (ligs.length === 4) { // SC atom with 4 nonH/LP ligands
                if (cu.c !== 0) { // cumulene with odd number of C
                  // change the z of ligands at cu.e1
                  changeBondType(mar,bar,getBondIndex(bar,cu.e1,culigs1[0]),5,true);
                  if (bar[getBondIndex(bar,cu.e1,culigs1[0])].toa === cu.e1) { // make sure that the ligand is toa
                    changeBondType(mar,bar,getBondIndex(bar,cu.e1,culigs1[0]),-1,true); 
                  }
                  if (culigs1.length > 1) { // there are 2 ligands at cu.e1
                    changeBondType(mar,bar,getBondIndex(bar,cu.e1,culigs1[1]),4,true);
                    if (bar[getBondIndex(bar,cu.e1,culigs1[1])].toa === cu.e1) { // make sure that the ligand is toa
                      changeBondType(mar,bar,getBondIndex(bar,cu.e1,culigs1[1]),-1,true); 
                    }
                  }
                } else { // not cumulene, stereogenic TH center
                  if (lig0 === 0) { 
                    if (ispBridgehead(mar,sc) > 0) {  // sc is bridgehead
                      // select acyclic angular ligand if present 
                      //  but only for bridgeheads that have an other bridgehead as ligand
                      //  (direct fusion bond)  
                      // if all ligands are ring atoms:
                      // if one of the ligands is in a bridge which already has a stereobond, use this bridge 
                      // if one of the ligands is in ring which already has a stereobond, use this ring 

                      rlct=0;
                      for (jj=0;jj<ligs.length;jj++) { // find the acyclic (angular) ligand 
                        if (ispringBond(mar,bar,getBondIndex(bar,sc,ligs[jj]))) {
                          rlct++;
                          continue;                
                        } else {
                          lig0=ligs[jj];
                          lig1=0;
                        }
                      }
                      if (rlct===4) {
                        sectors=[];
                        getSectorsAt(mar,sc,true);
                        if ((sectors.length === 4) && (sectors[3].wi >= 180)) {
                          //sc has 4 ring bonds within 180°
                          mva=sectors[3].ra;
                          if ( pscAtoms.includes(sectors[3].ra)) {
                            mva=sectors[3].la;
                          }
                          if ( pscAtoms.includes(sectors[3].la)) {
                            mva=sectors[0].ra;
                          }
                          refd=norma(180+getdirangle(mar[sc].x,mar[sc].y,(mar[sectors[3].ra].x+mar[sectors[3].la].x)/2,(mar[sectors[3].ra].y+mar[sectors[3].la].y)/2));
                          ros = -1*vecprod2d(mar[mva].x-mar[sc].x,mar[mva].y-mar[sc].y,Math.cos(Math.PI*refd/180),-1*Math.sin(Math.PI*refd/180));
                          sec=0;
                          while ((sectors[sectors.length-1].wi > 170) && (sec < 6)) {
                            rotLig(mar,sc,mva,ros*15);
                            sectors=[];
                            getSectorsAt(mar,sc,true);
                            sec++;
                          }
                        }
                      }
                      if (lig0 !==0) { // angular acyclic ligand found
                        for (jj=0;jj<ligs.length;jj++) { // find direct fusion bond ligand
                          if (ispBridgehead(mar,ligs[jj]) > -1) { //BF191028
                            dfb = ligs[jj];
                          }              
                        }
                        if (dfb === 0) { // no direct fusion bond
                          lig0=0;
                        }
                      }
                      if (lig0===0) {
                      // stereoBridgeKey is set check whether sc is in same bridge
                        for (jj=0;jj<mar[sc].bpa.length;jj++) { // look for ligand in same bridge as stereoBridgeKey points to
                          if ((stereoBridgeKey !== '') && (atInRingBridge(mar,mar[sc].bpa[jj].p) === stereoBridgeKey) && (atInRingBridge(mar,sc) === stereoBridgeKey)) {
                            lig0 = mar[sc].bpa[jj].p;
                            stereoBridgeKey = '';
                            stereobridgeLig = 0;
                            break;
                          }
                        }
                        // stereoRing is set, check whether sc is in same ring
                        for (jj=0;jj<mar[sc].bpa.length;jj++) { // look for ligand in same ring as stereoRing points to
                          if ((lig0===0) && (stereoRing > 0) && (prings[stereoRing].includes(sc)) && (ispBridgehead(mar,mar[sc].bpa[jj].p)===-1) && (prings[stereoRing].includes(mar[sc].bpa[jj].p))) { // bp in ring that has already a stereobond  
                            lig0 = mar[sc].bpa[jj].p;
                            stereoRing = 0;
                            stereoRingLig = 0;
                            break;
                          }
                        }
                      } 
                      // neither stereoBridgeKey nor stereoRing are set                
                      if (lig0 === 0) {
                        // select the first ligand that is in a ring bridge which also contains sc 
                        for (jj=0;jj<mar[sc].bpa.length;jj++) {
                          if ((stereoBridgeKey === '') && (atInRingBridge(mar,mar[sc].bpa[jj].p) !== '')) {                  
                            if (atInRingBridge(mar,sc) === atInRingBridge(mar,mar[sc].bpa[jj].p)) { // sc in same bridge as ligand            
                              stereoBridgeKey = atInRingBridge(mar,mar[sc].bpa[jj].p);
                              stereobridgeLig = mar[sc].bpa[jj].p;
                              break;
                            }
                          }
                        }
                        // select the first ligand that is in the same ring as sc but not a bridgehead and not in ring bridge
                        for (jj=0;jj<mar[sc].bpa.length;jj++) {
                          if ((stereoRing===0) && (ispBridgehead(mar,mar[sc].bpa[jj].p)===-1) && (atInSame_pRing(sc,mar[sc].bpa[jj].p)) && (atInRingBridge(mar,mar[sc].bpa[jj].p) === '')) {
                            stereoRing = atInSame_pRing(sc,mar[sc].bpa[jj].p);
                            stereoRingLig = mar[sc].bpa[jj].p;
                            break;
                          }
                        }
                        if ((stereoRing !== 0) && (stereoBridgeKey !=='')) {
                        // both bridge and ring ligands found
                          // if the stereoBridgeLig is not stereocenter itself and other end of bridge is a stereocenter: chose bridge ligand
                          //BUGFIX 190928.1 begins
                          if (((pRingBridgeAth[stereoBridgeKey][0] === stereobridgeLig) && (pRingBridgeAth[stereoBridgeKey][pRingBridgeAth[stereoBridgeKey].length-1].includes(pscAtoms))) || 
                          ((pRingBridgeAth[stereoBridgeKey][pRingBridgeAth[stereoBridgeKey].length-1] === stereobridgeLig) && (pRingBridgeAth[stereoBridgeKey][0].includes(pscAtoms)))) {
                            if (!pscAtoms.includes(stereobridgeLig)) { //BF200228.1
                              lig0 = stereobridgeLig;
                              stereoRing = 0;
                            } else {
                              lig0=0;
                            }
                          }
                          if ((lig0===0) && (!pscAtoms.includes(sectors[0].ra))) { //BF200228.1
                            lig0 = sectors[0].ra;
                            stereoRing = 0;
                            stereoBridgeKey='';
                          } else if (!pscAtoms.includes(sectors[0].la)) {
                            lig0 = sectors[0].la;                           
                            stereoRing = 0;
                            stereoBridgeKey=''; //BUGFIX 190928.1 ends here
                          } else if (!pscAtoms.includes(stereoRingLig)) { // if the ligand is not stereocenter itself: chose ring ligand //BF200228.1
                            lig0 = stereoRingLig;
                            stereoBridgeKey = '';
                          } else { // both are stereocenters, do not chose one of them
                            lig0 = 0;
                          }
                        } else if ((stereoRing !== 0) && (atInSame_pRing(sc,stereoRingLig))) { // ring ligand found
                          lig0 = stereoRingLig;
                        } else if ((stereoBridgeKey !== '') && (atInRingBridge(mar,sc) === stereoBridgeKey)) { // bridge ligand found
                          lig0 = stereobridgeLig;
                        }
                        if (lig0===0) {
                          stereoBridgeKey = '';
                          stereoRing=0;
                        }                      
                      }
                      if (lig0===0)  {  // sc is bridgehead with 4 ring bonds: select any but other bridgehead
                        for (jj=0;jj<ligs.length;jj++) { // find ligand 
                          if (ispBridgehead(mar,ligs[jj]) > 0) { //BF191007.1
                            continue;                
                          } else {
                            lig0=ligs[jj];
                            lig1=0;
                          }
                        }
                      }
                    } // bridgehead section END
                  }
                  if (lig0===0) {
                    if (atInRh[String(sc)] !== undefined) { // sc ring atom but not bridgehead
                      // search for the acyclic ligands
                      acligs = [];                
                      for (jj=0;jj<ligs.length;jj++) { // find the acyclic (angular) ligand 
                        if (ispringBond(mar,bar,getBondIndex(bar,sc,ligs[jj]))) {
                          continue;                
                        } else {
                          acligs.push(ligs[jj]);
                        }
                      }
                      if (acligs.length > 0 ) {
                        lig0 = acligs[0];
                        if (acligs.length > 1) {
                          lig1 = acligs[1];
                        } else {
                          lig1 = 0;
                        }
                      }
                    }

                  }
                  if (lig0 === 0) { // sc is acyclic
                    // four 90° sectors? BUGFIX 181011.1
                    sc4ra = true;
                    getSectorsAt(mar,sc,true); //BUGFIX 190919.1
                    for (jj=0;jj<sectors.length;jj++) {
                      if ((sectors[jj].wi < 88) || (sectors[jj].wi > 92)) {
                        sc4ra = false;
                        break;
                      }
                    }
                    if (sc4ra === true) { // yes, four right angles
                      // find a ligand that is not sc and not ring atom
                      for (jj=0;jj<ligs.length;jj++) {
                        if ((! pscAtoms.includes(ligs[jj])) && (atInRh[String(ligs[jj])] === undefined)) {
                          lig0 = ligs[jj];
                          break;
                        }
                      }
                    }
                  }
                  if (lig0===0) {  // find the smallest sector that has no SC atoms and no ring atoms at its left or right limit
                    getSectorsAt(mar,sc,true);
                    scntr = 0;
                    while (scntr < 4) {
                      lig0 = sectors[scntr].ra;
                      lig1 = sectors[scntr].la;           
                      if ((! pscAtoms.includes(lig0)) && (! pscAtoms.includes(lig1) && (atInRh[String(lig0)] === undefined) && (atInRh[String(lig1)] === undefined))) {
                        break;
                      } else {
                        lig0 = 0;
                        lig1 = 0;
//                         lig0 = sectors[scntr].ra;
//                         lig1 = sectors[scntr].la;           
                      }
                      scntr++;
                    }
                  }
                  if (lig0 === 0) { // no sector between 2 non-SC/non-ring atoms found, try opposite ligands 
                    if ((! pscAtoms.includes(ligs[0])) && (! pscAtoms.includes(ligs[2]))) {
                      lig0 = ligs[0];
                      lig1 = ligs[2];
                    } else if ((! pscAtoms.includes(ligs[1])) && (! pscAtoms.includes(ligs[3]))) {
                      lig0 = ligs[1];
                      lig1 = ligs[3];
                    } 
                  }

                  if (lig0 !== 0) {
                  // arbitrarily set z of lig0 to +1 and the bond type sc->lig0 to 4                
                    libix = getBondIndex(bar,sc,lig0);
                    if (bar[libix].btyp === 1) {
                      if (bar[libix].fra === sc) {
                        changeBondType(mar,bar,libix,4,true);
                      } else {
                        temp = bar[libix].fra;
                        bar[libix].fra = bar[libix].toa;
                        bar[libix].toa = temp;
                        if (mar[lig0].z >= 0 ) {
                          changeBondType(mar,bar,libix,4,true);
                        } else {
                          changeBondType(mar,bar,libix,5,true);
                        }
                      }
                    }
                    if ((lig1 !== 0) && (bar[getBondIndex(bar,sc,lig1)].btyp === 1)) {
                      // set lig1 to stereo up
                      changeBondType(mar,bar,getBondIndex(bar,sc,lig1),5,true);
                      if (bar[getBondIndex(bar,sc,lig1)].toa === sc) { // make sure that the ligand is toa
                        changeBondType(mar,bar,getBondIndex(bar,sc,lig1),-1,true); 
                      }
                    }
                  } else {
                    warnAtoms.push(sc);
                    continue;
                  }
                }
              // end of 4 ligands section
              // 3 or 2 ligands section             
              } else if (ligs.length < 4) { // case with one LP or implicit H: 3 ligands
                if (cu.c !== 0) { // cumulene with odd number of C and three or two ligands
                  changeBondType(mar,bar,getBondIndex(bar,cu.e1,culigs1[0]),5,true);
                  if (bar[getBondIndex(bar,cu.e1,culigs1[0])].toa === cu.e1) { // make sure that the ligand is toa
                    changeBondType(mar,bar,getBondIndex(bar,cu.e1,culigs1[0]),-1,true); 
                  }
                  if (culigs1.length > 1) {
                    changeBondType(mar,bar,getBondIndex(bar,cu.e1,culigs1[1]),4,true);
                    if (bar[getBondIndex(bar,cu.e1,culigs1[1])].toa === cu.e1) { // make sure that the ligand is toa
                      changeBondType(mar,bar,getBondIndex(bar,cu.e1,culigs1[1]),-1,true); 
                    }                
                  }                
                } else { // tetrahedral stereogenic center
                  if (lig0 === 0) {
                    if (ligs.length === 2) { // lone pair and implicit H (phosphine, arsine)
                    // the implicit H must be created as explicit H between the drawn ligands
                      ehdir = getBisectorFrom3At(mar,sc,ligs[0],ligs[1],false);
                      ehx = mar[sc].x + bondlength*Math.cos(Math.PI*ehdir/180);
                      ehy = mar[sc].y + (-1)*bondlength*Math.sin(Math.PI*ehdir/180);
                      mar[mar.length] = new Atom(1,'H',ehx,ehy,0,0,+1);
                      mar[sc].eh += 1;
                      addBond(mar,bar,sc,mar.length-1,4);
                      lig0 = mar.length-1;
                      lig1 = 0;
                      ligs.unshift(mar.length-1);
                    }
                  }
                  if (lig0 === 0) {
                    // 3-ligands
                    if (atInRh[String(sc)] !== undefined) { // sc is ring atom
                      for (jj=0;jj<mar[sc].bpa.length;jj++) {
                        if (is_pr2rj_bond(mar,sc,mar[sc].bpa[jj].p)) { // check for direct ring-ring bond ligand
                          r2rligs.push(mar[sc].bpa[jj].p);
                        }
                      }
                      if (r2rligs.length > 0) {
                        r2rlig = r2rligs[0];
                      }
                    }
                    if ((ispBridgehead(mar,sc) > 0) || (r2rligs.length > 0)) { // sc is bridgehead (has 3 ring bonds)
                      // if the three ring bonds are all within < 180°, select one of them as lig0 and do not create expl H
                      // exception: bridgeheads between 3-membered ring and other ring get explicit H in any case
                      getSectorsAt(mar,sc,true);
                      if ((norma(sectors[0].wi+sectors[1].wi) < 175) && (atIn3Ring(sc) === 0)) {
                      // if one of the ligands of sc is in a bridge which already has a stereobond, use this bridge 
                        for (jj=0;jj<mar[sc].bpa.length;jj++) {
                          if ((stereoBridgeKey !== '') && (atInRingBridge(mar,mar[sc].bpa[jj].p) === stereoBridgeKey)) {
                            lig0 = mar[sc].bpa[jj].p;
                            stereoBridgeKey = '';
                            break;
                          }  
                        }
                        if (lig0===0) {
                          for (jj=0;jj<mar[sc].bpa.length;jj++) { // look for ligand in same ring as stereoRing points to
                            if ((lig0===0) && (stereoRing > 0) && (atInRingBridge(mar,mar[sc].bpa[jj].p) === '') && (ispBridgehead(mar,mar[sc].bpa[jj].p)===-1) && (prings[stereoRing].includes(mar[sc].bpa[jj].p))) { // bp in ring that has already a stereobond  
                              lig0 = mar[sc].bpa[jj].p;
                              stereoRing = 0;
                              break;
                            }
                          }
                        }                                  
                        if (lig0 === 0) {
                          // select the first ligand that is in a ring bridge which also contains sc 
                          for (jj=0;jj<mar[sc].bpa.length;jj++) {
                            if ((stereoBridgeKey === '') && (atInRingBridge(mar,mar[sc].bpa[jj].p) !== '')) {                  
                              if (atInRingBridge(mar,sc) === atInRingBridge(mar,mar[sc].bpa[jj].p)) { // sc in same bridge as ligand            
                                stereoBridgeKey = atInRingBridge(mar,mar[sc].bpa[jj].p);
                                stereobridgeLig = mar[sc].bpa[jj].p;
                                break;
                              }
                            }
                          }
                          // select the first ligand that is in the same ring as sc but not a bridgehead and not in ring bridge
                          for (jj=0;jj<mar[sc].bpa.length;jj++) {
                            if ((stereoRing===0) && (ispBridgehead(mar,mar[sc].bpa[jj].p)===-1) && (atInSame_pRing(sc,mar[sc].bpa[jj].p)) && (atInRingBridge(mar,mar[sc].bpa[jj].p) === '')) {
                              stereoRing = atInSame_pRing(sc,mar[sc].bpa[jj].p);
                              stereoRingLig = mar[sc].bpa[jj].p;
                              break;
                            }
                          }
                          if ((stereoRing !== 0) && (stereoBridgeKey !=='')) {
                          // both bridge and ring ligands found
                            if (!pscAtoms.includes(stereobridgeLig)) { //BF200228.1
                              lig0 = stereobridgeLig;
                              stereoRing = 0;
                            } else if (!pscAtoms.includes(stereoRingLig)) { //BF200228.1
                              lig0 = stereoRingLig;
                              stereoBridgeKey = '';
                            } else {
                              lig0 = 0;
                            }
                          } else if (stereoRing !== 0) { // ring ligand found
                            lig0 = stereoRingLig;
                          } else if (stereoBridgeKey !== '') { // bridge ligand found
                            lig0 = stereobridgeLig;
                          }
                          if (lig0===0) {
                            stereoBridgeKey = '';
                            stereoRing=0;
                          }                      
                        }  
                      } else { // not within 180° or fused 3-membered ring, create explicit H                
                        brdghdligs = [];
                        for (jj=0;jj<ligs.length;jj++) {
                          if ((ispBridgehead(mar,ligs[jj])> 0)  || (pBridgeAtoms.includes(ligs[jj]))) { // bridgehead-bridgehead bond or bridge atom 
                            brdghdligs.push(ligs[jj]);
                          }
                        }
                        if (r2rlig > 0) {
                          for (jj=0;jj<ligs.length;jj++) {
                            if (ligs[jj] !== r2rlig) {
                              lig1 = ligs[jj];
                              break;
                            }
                          }
                        }
                        if (((brdghdligs.length === 1) && (lig1===0)) && (!(sectors[sectors.length-1].wi >=180))) { //BF190925.1
                          lig1 = brdghdligs[0];
                        } else if (lig1===0) {
                          lig1 = -1;
                        } 
                        // create explicit H opposite to lig1
                        if (lig1 !== 0) {
                          if (lig1 > 0) {
                            ehdir = norma(180+getdiranglefromAt(mar,sc,lig1));
                            lig1 = 0;
                          } else {
                            ehdir = awayFromRings(mar,sc);
                            lig1 = 0;
                          }
                          ehx = mar[sc].x + bondlength*Math.cos(Math.PI*ehdir/180);
                          ehy = mar[sc].y + (-1)*bondlength*Math.sin(Math.PI*ehdir/180);
                          if (isnear(m_s,b_s,ehx,ehy) > 0) { // explicit H would collide with existing atom
                            ehdir = norma(ehdir + 120);
                            ehx = mar[sc].x + bondlength*Math.cos(Math.PI*ehdir/180);
                            ehy = mar[sc].y + (-1)*bondlength*Math.sin(Math.PI*ehdir/180);                      
                          }
                          if (isnear(m_s,b_s,ehx,ehy) > 0) { // explicit H would collide with existing atom
                            ehdir = norma(ehdir - 240);
                            ehx = mar[sc].x + bondlength*Math.cos(Math.PI*ehdir/180);
                            ehy = mar[sc].y + (-1)*bondlength*Math.sin(Math.PI*ehdir/180);                      
                          }
                          mar[mar.length] = new Atom(1,'H',ehx,ehy,0,0,+1);
                          mar[sc].eh += 1;
                          addBond(mar,bar,sc,mar.length-1,4);
                          lig0 = mar.length-1;
                          lig1 = 0;
                          ligs.unshift(mar.length-1);
                        }
                      }
                    }
                  }
                  if (lig0 === 0) {
                    for (jj=0;jj<ligs.length;jj++) {
                    // terminal ligand but not incoming
                      if ((mar[ligs[jj]].bpa.length === 1) && (ligs[jj] !== inclig)) { 
                        lig0 = ligs[jj];
                        break;
                      }
                    }
                  }

                  if (lig0 === 0) {
                    for (jj=0;jj<ligs.length;jj++) {
                    // terminal ligand (incoming)
                      if (mar[ligs[jj]].bpa.length === 1) { 
                        lig0 = ligs[jj];
                        break;
                      }
                    }
                  }
                  if (lig0 === 0) { 
                    for (jj=0;jj<ligs.length;jj++) {
                    // acyclic single bond but not incoming
                      if ((!atInRing(ligs[jj]) > 0) && (bar[getBondIndex(bar,sc,ligs[jj])].btyp === 1) && (ligs[jj] !== inclig)) { 
                        lig0 = ligs[jj];
                        break;
                      }
                    }  
                  }
                  if (lig0 === 0) { 
                    for (jj=0;jj<ligs.length;jj++) {
                    //  acyclic single bond
                      if ((!atInRing(ligs[jj]) > 0) && (bar[getBondIndex(bar,sc,ligs[jj])].btyp === 1)) {
                        lig0 = ligs[jj];
                        break;
                      }
                    }  
                  }
                  if (lig0 === 0) { 
                    for (jj=0;jj<ligs.length;jj++) {
                    // any single bond but not incoming
                      if ((bar[getBondIndex(bar,sc,ligs[jj])].btyp === 1) && (ligs[jj] !== inclig)) {
                        lig0 = ligs[jj];
                        break;
                      }
                    }  
                  }
                  if (lig0 === 0) { 
                    for (jj=0;jj<ligs.length;jj++) {
                    // any single bond
                      if (bar[getBondIndex(bar,sc,ligs[jj])].btyp === 1) {
                        lig0 = ligs[jj];
                        break;
                      }
                    }
                  }
                  if (lig0 === 0) { // safeguard if any of the above did not select lig0
                    lig0 = ligs[1];
                  }
            
                  // make sure that lig0 is not an sc_Atom, otherwise create an explicit H
                  if (pscAtoms.includes(lig0)) {
                    getSectorsAt(mar,sc,true);
                    if (sectors[sectors.length-1].wi > 180) {
                      ehdir = getBisectorFrom3At(mar,sc,sectors[sectors.length-1].la,sectors[sectors.length-1].ra,true);               
                    } else {
                      ehdir = norma(30+getdiranglefromAt(mar,sc,lig0));
                    }                    
                    createExplicitH(mar,bar,sc,ehdir,4);
                    lig0 = m_s.length-1;
                    ligs.push(lig0); // add the expilicit H to end of ligs[]  //bugfix 190213.1
                  } //bugfix 190213.1
                  if ((lig0 !== 0) && (getBondIndex(bar,sc,lig0) > 0)) { // lig0 is not sc_Atom and defined  //bugfix 190213.1: if instead of else if
                    libix = getBondIndex(bar,sc,lig0);
                    // arbitrarily set z of lig0 to +1 and the bond type sc->lig0 to 4
                    if (bar[libix].btyp === 1) {
                      if (bar[libix].fra === sc) {
                        changeBondType(mar,bar,libix,4,true);
                      } else {
                        temp = bar[libix].fra;
                        bar[libix].fra = bar[libix].toa;
                        bar[libix].toa = temp;
                        if (mar[lig0].z >= 0 ) {
                          changeBondType(mar,bar,libix,4,true);
                        } else {
                          changeBondType(mar,bar,libix,5,true);
                        }
                      }
                    }
                  } else {
                    warnAtoms.push(sc);
                    continue;
                  }
                }
              } // end 3 ligands section  

              if (cu.c === 0) { // not cumulene
                // remove the incoming from ligs[]
                ligs.splice(ligs.indexOf(inclig),1); // remove the incoming from ligs[]
                if (ligs.length < 3) { // case with lone pair
                  ligs.unshift(0); // add 0 as first element of ligs[]
                }

                // determine the sense of the 4 ligands
                tetatoms = [sc,inclig,ligs[0],ligs[1],ligs[2]];
        
                scstr = get_scSense_one(mar,bar,sc,'',tetatoms,'parse');
            
              } else { // cumulene
                scstr = get_ccSense_one(mar,bar,cu,'parse');
              }
              if ((scstr !== '') && (scstr !== ((stereo === 1)? '@' : '@@'))) { // the trial sense is not the one in the SMILES
                // mirror one (3 ligs) or 2 (4 ligs) stereobonds in z
                if (cu.c !==0 ) { // cumulene
                  changeBondType(mar,bar,getBondIndex(bar,cu.e1,culigs1[0]),4,true);
                  if (bar[getBondIndex(bar,cu.e1,culigs1[0])].toa === cu.e1) { // make sure that the ligand is toa
                    changeBondType(mar,bar,getBondIndex(bar,cu.e1,culigs1[0]),-1,true); 
                  }
                  if (culigs1.length > 1) {
                    changeBondType(mar,bar,getBondIndex(bar,cu.e1,culigs1[1]),5,true);
                    if (bar[getBondIndex(bar,cu.e1,culigs1[1])].toa === cu.e1) { // make sure that the ligand is toa
                      changeBondType(mar,bar,getBondIndex(bar,cu.e1,culigs1[1]),-1,true); 
                    }                
                  }                
                } else {
                  changeBondType(mar,bar,getBondIndex(bar,sc,lig0),5,false);
                  if ((mar[sc].bpa.length === 4) && (lig1 !== 0)) {
                    changeBondType(mar,bar,getBondIndex(bar,sc,lig1),4,false);
                  }
                }
              } else if (scstr === '') { // get_scSense_one() or get_ccSense_one() failed
              // set the wedge bond back to normal single bond and register sc in warnAtoms[]
                if (cu.c !==0 ) { // cumulene
                  changeBondType(mar,bar,getBondIndex(bar,cu.e1,culigs1[0]),1,true);
                  if (culigs1.length > 1) {
                    changeBondType(mar,bar,getBondIndex(bar,cu.e1,culigs1[1]),1,true);
                  }                
                } else {
                  changeBondType(mar,bar,getBondIndex(bar,sc,lig0),1,true);
                  if ((mar[sc].bpa.length === 4) && (lig1 !== 0)) {
                    changeBondType(mar,bar,getBondIndex(bar,sc,lig1),1,true);
                  }
                }
                warnAtoms.push(sc);
              }
            } // main loop over all SC atoms
          } // set the stereo-up and down bonds to get the correct sc_sense at each sc_atom
          
          function rotLig(mar,ca,lig,rota) {
            const bole = Math.sqrt((mar[lig].x-mar[ca].x)*(mar[lig].x-mar[ca].x)+(mar[lig].y-mar[ca].y)*(mar[lig].y-mar[ca].y));
            
            mar[lig].x = mar[ca].x+bole*Math.cos(Math.PI*rota/180);
            mar[lig].y = mar[ca].y-bole*Math.sin(Math.PI*rota/180);
          }
                      
          function hasCoord(mar,ax) {
            if ((mar[ax].x !== 0) && (mar[ax].y !== 0)) {
              return true;
            } else {
              return false;
            }      
          } // returns false if atom has (x|y) === (0|0), true otherwise
            
          function ringInRingSys(rtx) {
            let i=0;
            if (pringsystems.length === 0) { return -1; }
            for (i=0;i<pringsystems.length;i++) {
              if (pringsystems[i].includes(rtx)) {
                return i;
              } 
            }
            return -1;
          } // returns the index of the ringsystem containing ring rtx or -1 of rtx is not in a ring system
                  
          function spiroRingsIx(rix1,rix2) { //param: rix = index of a ring in prings[]
            let i=0;
        
            for (i=0;i<pSpiroRings.length;i++) {
        
              if (((pSpiroRings[i].r1 === rix1) && (pSpiroRings[i].r2 === rix2)) || ((pSpiroRings[i].r2 === rix1) && (pSpiroRings[i].r1 === rix2))) {
                return i;
              } 
            }
            return -1;
          } // return the index of a spiro ring in pSpiroRings[] or -1 if prings[rix] is not a spiro ring

          function ringFusionsIx(rix1,rix2) { //param: rix1,rix2 = index of rings in prings[]
            let i=0;
        
            for (i=0;i<pRingFusions.length;i++) {
        
              if (((pRingFusions[i].r1 === rix1) && (pRingFusions[i].r2 === rix2)) || ((pRingFusions[i].r2 === rix1) && (pRingFusions[i].r1 === rix2))) {
                return i;
              } 
            }
            return -1;
          } // return the index of a ring fusion in pRingFusions[] if rings prings[rix1] and prings[rix2] are fused to each other, or -1 if prings[rix] is not a spiro ring
    
          function bondInRingBridge(bar,bx,brdglength) {
            let brdgkey = '';

            for (brdgkey in pRingBridgeAth) {
              if (pRingBridgeAth.hasOwnProperty(brdgkey)) {
                if ((pRingBridgeAth[brdgkey].length === brdglength) && (pRingBridgeAth[brdgkey].includes(bar[bx].toa)) && (pRingBridgeAth[brdgkey].includes(bar[bx].fra))) {
                  return brdgkey;
                }      
              }          
            }
          } // returns the key of pRingBridgeAth[] containing both atoms of a bond and having a length of brdglength atoms
      
          function atInRingBridge(mar,ax) {
            let brdgkey = '';

            for (brdgkey in pRingBridgeAth) {
              if (pRingBridgeAth.hasOwnProperty(brdgkey)) {
                if (pRingBridgeAth[brdgkey].includes(ax)) {
                  return brdgkey;
                }      
              }          
            }
            return '';
          } // returns the key of pRingBridgeAth[] containing atom ax
        
          function ringHasBridgeAt(mar,rix) {
            for (i=0;i<prings[rix].length;i++) {
              if (atInRingBridge(mar,prings[rix][i]) !== '') {
                return true;              
              }
            }
            return false;
          } // returns true if prings[rix] has bridge atoms

          function bridgedd(mar,bar,rsize,bky,bl,it) {
            // param: rsize=ringsize; bky=key to pRingBridgeAth{} dict; bl=bond length; it=iteration counter
            let beta = 0;
            const brl = pRingBridgeAth[bky].length;
            let delta = 0;
            let diag = 0;
            let fbra = 0;
            let lbra = 0;
            const maxit = rsize - brl; // number of extrabridge ring atoms to plot 
          
            fbra = pRingBridgeAth[bky][0];
            lbra = pRingBridgeAth[bky][brl-1];
        
            diag = Math.sqrt((mar[lbra].x-mar[fbra].x)*(mar[lbra].x-mar[fbra].x) + (mar[lbra].y-mar[fbra].y)*(mar[lbra].y-mar[fbra].y));
            switch (true) {
              case (it === 1): 
                switch(maxit) {
                  case 1: 
                    beta = 180 - 180*Math.acos(diag/(2*bl))/Math.PI;
                    break;
                  case 2:
                    beta = 180 - 180*Math.acos((Math.abs(diag-bl))/(2*bl))/Math.PI;
                    break;
                  case 3:
                    delta = 2*bl*Math.cos(Math.PI/6);
                    beta = 180 - 180*Math.acos((Math.abs(diag-delta))/(2*bl))/Math.PI;
                    break;
                  case 4:
                    delta = bl*(2*Math.cos(2*Math.PI/7)+1);
                    beta = 180-180*Math.acos((Math.abs(diag-delta))/(2*bl))/Math.PI;
                    break;
                  case 5:
                    delta = 2*bl*(Math.cos(Math.PI/8)+Math.cos(3*Math.PI/8));
                    beta = 180-180*Math.acos((Math.abs(diag-delta))/(2*bl))/Math.PI;
                    break;
                  default:
                    beta = 0;
                }
                break;
              case (it === 2):
                switch(maxit) {
                  case 2:
                    beta = 180*Math.acos((Math.abs(diag-bl))/(2*bl))/Math.PI;
                    break;
                  case 3:
                    delta = 2*bl*Math.cos(Math.PI/6);
                    beta = 180-180*Math.acos((Math.abs(diag-delta))/(2*bl))/Math.PI;
                    beta = beta - 90 + 360/rsize;
                    break;
                  case 4:
                    delta = bl*(2*Math.cos(2*Math.PI/7)+1);
                    beta = 180-180*Math.acos((Math.abs(diag-delta))/(2*bl))/Math.PI;
                    beta = 180 - beta - 360/rsize;
                    break;
                  case 5:
                    delta = 2*bl*(Math.cos(Math.PI/8)+Math.cos(3*Math.PI/8));
                    beta = 180-180*Math.acos((Math.abs(diag-delta))/(2*bl))/Math.PI;
                    beta = 90 - beta + 3*360/(2*rsize);
                    break;
                  default:
                    beta = 0;
                }
                break;
              case (it > 2):
                beta = 360/rsize;
                break;              

            }
            return beta;            
          } // returns the direction (in deg) for plotting of a bridge bond
      
          function sameSenseAsRing(ar1,rar2) { // params: ar1 an array of rings atoms; rar2: the index of a prings[] array
            let i=0;
            let rext =[];
                
            rext = rar2.slice(0);
            rext.push(rar2[0]); // extend ring sequence by first atom
            for (i=0;i<rext.length-1;i++) { // locate the first atom in the array ar1 in the extended ring
              if (ar1[0] === rext[i]) {
                break;
              }
            }
            if (ar1[1] === rext[i+1]) {
              return true;
            } else {
              return false;
            }
          } //returns true if an array of ring atoms ar1 lists them in the same order as in the array rar2, false otherwise
        
          function numplotlig(mar,ax) {
            let i=0;
            let count = 0;
            for (i=0;i<mar[ax].bpa.length;i++) {
              if ((mar[mar[ax].bpa[i].p].x !== 0) && ((mar[mar[ax].bpa[i].p].y !== 0))) {
                count++;
              }
            }
            return count;        
          } // returns the number of ligands of mar[ax] that have been plotted
              
          function pgetEZ(mar,bar,dbix) { //param: dbix: index if DB to be examined in bar[]
            let i = 0;
            let li = 0;
            let eza = '';
            let ezb = '';
            let res = 1;
        
            if (bar[dbix].btyp !== 2) { return 1; } // not DB, return 0
        
            if (prfs[bar[dbix].toa].match(/[\\|/]/) !== null) {
              eza = prfs[bar[dbix].toa].match(/[\\|/]/)[0];
              li=0;
              for (i=0;i<mar[bar[dbix].fra].bpa.length;i++) { // for all bonding partners of the first DB atom
                li = mar[bar[dbix].fra].bpa[i].p;
                if (li !== bar[dbix].toa) { // not the other DB atom 
                  if (/[\\|/]/.test(prfs[li])) { // the ligand has an EZ prefix
                    ezb = prfs[li].match(/[\\|/]/)[0];
                    break;
                  }
                }
              }          
            } else if (prfs[bar[dbix].fra].match(/[\\|/]/) !== null) {
              eza = prfs[bar[dbix].fra].match(/[\\|/]/)[0];
              li=0;
              for (i=0;i<mar[bar[dbix].toa].bpa.length;i++) { // for all bonding partners of the first DB atom
                li = mar[bar[dbix].toa].bpa[i].p;
                if (li !== bar[dbix].fra) { // not the other DB atom 
                  if (/[\\|/]/.test(prfs[li])) { // the ligand has an EZ prefix
                    ezb = prfs[li].match(/[\\|/]/)[0];
                    break;
                  }
                }
              }          
            }
            if ((eza !== '') && (ezb !=='')) {
              if (eza === ezb) {
                res = 1;
              } else {
                res = -1;
              }
            }
            return res;
          } // Analyses the /\ prefixes on both ends of a double bond. returns 1 for trans (/ and /) or (\ and \) and -1 for (\ and /) or (/ and \). returns 1 if bond is not DB
  
      
          function awayFromRings(mar,ax) {
            let i=0;
            const sumv = new Coord(0,0);
        
            if ((atInRh[String(ax)] !== undefined) && (atInRh[String(ax)].length > 0)) {
              for (i=0;i<atInRh[String(ax)].length;i++) {
                sumv.x += (pringcenters[atInRh[String(ax)][i]].x - mar[ax].x);
                sumv.y += (pringcenters[atInRh[String(ax)][i]].y - mar[ax].y);
              }
              return getdirangle(sumv.x,sumv.y,0,0);
            } 
            return -1;
          } // returns the direction opposite to the center of all rings in which ax is a member
      
      
          function getRingSense(mar,at1,at2,at3) {
            let d1x, d1y, d2x, d2y;
      
            d1x = mar[at2].x - mar[at1].x;
            d1y = mar[at2].y - mar[at1].y;
            d2x = mar[at3].x - mar[at2].x;
            d2y = mar[at3].y - mar[at2].y;
            return (-1)*vecprod2d(d1x, d1y, d2x, d2y);
          } // return the ring sense from three plotted ring atoms +1: CCW; -1: CW; 0: linear or error
      
      
          function getpRingClosureDigit(at1,at2) {
            for (const key in rclh) {
              if (rclh.hasOwnProperty(key)) {
                if (((rclh[key].sa === at1) && (rclh[key].ea === at2)) || ((rclh[key].sa === at2) && (rclh[key].ea === at1))) {
                  return key;
                }
              }
            }
            return ''; // if not found return empty string
          }  // returns the ring closure digit as string if the two atoms are in the Ringclosure dict rclh{}
            // or 0 if they are not 

          function fillring(rc,csq1,csq2) {
            let cc= -1; // current chain
            let e0x =-1; // index of parent of rc2 in common chain
            let i=0;
            const lc = csq1[csq1.length-1]; // the common chain
            let pat;
            let s0x=-1; // index of parent of rc1 in common chain
            const st1x = chains[csq1[0]].atar.indexOf(rclh[rc].sa); // index of rc1 in its chain
            const st2x = chains[csq2[0]].atar.indexOf(rclh[rc].ea); // index of rc2 in its chain
            const t0ring = [];
            const t1ring = []; // temp ring arrays
            const t2ring = [];
        
        
            cc = csq1[0];
            if (cc === lc) { // rc1 is in the common chain
              s0x =  chains[lc].atar.indexOf(rclh[rc].sa); //set its index in the common chain
            } else {
              i=st1x;
              while ((i > -1) && (cc !== lc)) { //down the chains
                t1ring.push(chains[cc].atar[i]);
                // remove the ring atom from chains here
                i--;
                if (i < 0) { // last was start of chain
                  pat = chains[cc].pa;
                  cc = chains[cc].pc; // go to parent chain
                  i = chains[cc].atar.indexOf(pat); // find index of parent atom in parent chain
                  if (cc === lc) { // last common chain reached
                    s0x = i; // remember the index of the parent of rc1 inside the common chain
                    break;
                  }
                  i = chains[cc].atar.indexOf(pat); // find index of parent atom in parent chain
                }            
              }
            }
        
            cc = csq2[0]; // set chain to chain containing rc2
            if (cc === lc) { // rc2 is in the common chain
              e0x =  chains[lc].atar.indexOf(rclh[rc].ea); //set its index in the last chain
            } else {
              i=st2x;        
              while ((i > -1) && (cc !== lc)) { //down the chains
                t2ring.unshift(chains[cc].atar[i]);
                // remove the ring atom from chains here
                i--;
                if (i < 0) { // last was start of chain
                  pat = chains[cc].pa;
                  cc = chains[cc].pc; // go to parent chain
                  i = chains[cc].atar.indexOf(pat); // find index of parent atom in parent chain
                  if (cc === lc) { // last common chain reached
                    e0x = i; // remember the index of the parent of rc2 inside the common chain
                    break;
                  }
                }            
              }
            }
            //scan the common chain bewteen rc1 and rc2
            for (i=e0x; i >= s0x;i--) {
              t0ring.unshift(chains[lc].atar[i]);
              // remove the ring atom from chains here
            }      
            prings.push(t0ring.concat(t2ring,t1ring));
          } // extracts rings from chains based on ring closures
      
          function normRing(rx) {
            let i=0;
            let k = 0;
            let lowx = pats.length;
            let slowx = pats.length;
            let tele = 0;
            const tring = [];
        
            // find the lowest  and second-lowest atom indices in the ring
            for (i=0;i<prings[rx].length;i++) {
              if (prings[rx][i] < lowx) {
                lowx = prings[rx][i]; 
              }
            }
            for (i=0;i<prings[rx].length;i++) {
              if ((prings[rx][i] < slowx) && (prings[rx][i] !== lowx)) {
                slowx = prings[rx][i]; 
              }
            }
            if (atixInRing(lowx,rx) > atixInRing(slowx,rx)) { // lowest is later than second-lowest: reverse
              for (i=prings[rx].length-1 ;i >=0;i--) {
                tring.push(prings[rx][i]);
              }
              prings[rx] = tring.slice(0);
            }
            // cyclic shift of ring to get lowest atom index at start
            k=0;
            while (atixInRing(lowx,rx) > 0) {
              tele = prings[rx].shift();
              prings[rx].push(tele);
              k++;
              if (k > 20) { break; }
            }
          } // rotates the prings[] array such that the lowest atom index comes first
      
          function ispringBond(mar,bar,bix) {
            let i=0;
        
            for (i=1;i<prings.length;i++) {
              if ((prings[i].includes(bar[bix].fra)) && (prings[i].includes(bar[bix].toa))) {
                return i;
              }
            }
            return 0;
          } // returns the index of ring in prings[] if bond with index bix is in a ring, 0 otherwise
              
          function atInRing(ax) {
            let i=0;
        
            for (i=1;i<prings.length;i++) {
              if (prings[i].includes(ax)) {
                return i;
              }
            }
            return 0;
          } // returns the index (in prings[]) of the (first) ring containing atom ax, 0 otherwise
      
          function atInRings(ax) {
            for (i=1;i<prings.length;i++) {
              if (prings[i].includes(ax)) {
                if (atInRh[String(ax)] !== undefined) {
                  atInRh[String(ax)].push(i);
                } else {
                  atInRh[String(ax)] = [];
                  atInRh[String(ax)].push(i);
                }
              }
            }
          }  // fills the dict atInRh{}: 
            // key is String(ax), value is an array with the ring indices of the rings containing the atom ax
      
          function atIn3Ring(ax) {
            for (i=1;i<prings.length;i++) {
              if ((prings[i].length === 3) && (prings[i].includes(ax))) {
                return i;
              }
            }
            return 0;        
          } // returns the index of ring in prings[] if ax is in 3-membered ring, 0 otherwise
        
          function atixInRing(ax,rix) {
            return prings[rix].indexOf(ax);
          } // returns index of an atom in prings[rix], if not present: -1

          function isemfuPring(rix) {
            let k=0;
            let result = true;
            let sbar = [];
        
            for (k=0;k<prings[rix].length;k++) {
        
              sbar = [];
              sbar = pats[prings[rix][k]].match(/^\[([a-z]{0,2})(H{0,1})([0-9]{0,2})([-|+]{0,1}\d{0,2})\]$/);
              if (sbar !== null) { // square bracket atom: analyze
                // element
                if (sbar[1] !== '') {
                  // deal with emfu element symbols
                  if (! emfuElesym.includes(sbar[1])) {
                    result = false;
                  } else {
                    if (!pEmfuAtoms.includes(prings[rix][k])) {
                      pEmfuAtoms.push(prings[rix][k]);
                    }
                  }
                }
          
              } else { // pats contains just element symbol
                // deal with emfu element symbols
                if (!emfuElesym.includes(pats[prings[rix][k]])) {
                  result = false;
                } else {
                  if (!pEmfuAtoms.includes(prings[rix][k])) {
                    pEmfuAtoms.push(prings[rix][k]);
                  }
                }
              }
            }
            return result;
          } // returns true if prings[rix] is mancude (EMFU), false otherwise. Fills the pEmfuAtoms[] array.
      
          function atInSame_pRing(ax1,ax2) {
            let i;
            let result = 0;
        
            for (i=1;i<prings.length;i++) {
              if (( prings[i].includes(ax1)) && (prings[i].includes(ax2))) {
                result = i;
                break;
              }
            }
            return result;
          } // returns the index of the first ring in prings containing atoms ax1 and ax2, 0 otherwise
      
          function pringCofM(mar,rix) {
            let i=0;
            const result = new Coord(0,0);
            let sx = 0;
            let sy = 0;
        
            for (i=0;i<prings[rix].length;i++) {
        
              sx += mar[prings[rix][i]].x;
              sy += mar[prings[rix][i]].y;
            }
            result.x = sx/prings[rix].length;
            result.y = sy/prings[rix].length;
            return result;      
          } // returns the 2D coordinates of the center of a ring
      
          function ispBridgehead(mar,ax) {
            let bc = 0;
            let i=0;
        
            for (i=0;i<mar[ax].bpa.length;i++) { //BF191028
        
              if ((atInRing(mar[ax].bpa[i].p) > 0) && (!(is_pr2rj_bond(mar,ax,mar[ax].bpa[i].p)))) { //BF191028
                bc++; //BF191028
              } //BF191028
            } //BF191028
            
            if (bc > 2) {
              return bc;
            } else {
              return -1;
            }
          } // returns the number of ringbonds to ax if ax is a bridgehead, -1 otherwise
        
          function is_pr2rj_bond(mar,at1,at2) {
            let i=0;
            for (i=0;i<pr2rjh.length;i++) {
              if (((pr2rjh[i].a1===at1) && (pr2rjh[i].a2===at2)) || ((pr2rjh[i].a1===at2) && (pr2rjh[i].a2===at1))) {
                return true;
              }
            }
            return false;
          } // returns true if the two atoms at1, at2 form an exocyclic direct ring to ring bond 

          function atInFusion(ax) {
            let i=0;
        
            for (i=0;i<pRingFusions.length;i++) {
        
              if ((ax === pRingFusions[i].at1) || (ax === pRingFusions[i].at2)) {
                return i;
              }
            }
            return -1;
          } // returns the index in pRingFusions if an atom is part of a fusion bond, -1 otherwise  
              
          function analyzeRings() {
        
            let cyclized = false;
            let diffcomb = [];
            let differenceEa = [];
            let differenceEb = [];
            let edgelist='';
            const edges = [[]]; // 2D array of rings: 1st index: ring (index in prings[]), 2nd index edge{} objects describing rings bonds
            let i=0;
            let intersectionE = []; // intersection of edges
            let intersectionV = []; // intersection of vertices
            const isFused = [false];
            const isSpiro = [false];
            let jj=0;
            let k=0;
            let nring = [];
            let tpr = [];
            let tprats = [];

        
            tpr = prings.slice(1,prings.length);
            tpr.sort( (a, b) => a.length - b.length);
            prings = [[0]];
            prings = prings.concat(tpr);

            for (i=1;i<prings.length;i++) { // fill the edges[] array of ring[i]
              edges[i] = [];
              for (jj=0;jj<prings[i].length-1;jj++) {
                edges[i].push(new Edge(prings[i][jj],prings[i][jj+1]));
              }
              edges[i].push(new Edge(prings[i][prings[i].length-1],prings[i][0]));
            }

            for (i=1;i<prings.length-1;i++) {
              for (jj=i+1;jj<prings.length;jj++) {
                intersectionV = intersect(prings[i],prings[jj]);
                // eliminate ring jj if it is the same one as ring i
                if ((intersectionV.length === prings[i].length) && (intersectionV.length === prings[jj].length)) {
                  prings.splice(jj,1);
                  jj--; // step back because element jj in array was removed
                  continue;
                }
                intersectionE=[];  
                differenceEa = [];
                differenceEb = [];            
                commonEdges(i,jj);
                differenceEb = differenceEa.slice(0);
                intersectionE=[];  
                differenceEa = [];            
                commonEdges(jj,i);
                diffcomb = [];
                diffcomb = differenceEb.concat(differenceEa); 
                if (diffcomb.length > 0) {
                  nring = [];
                  cyclized = false;
                  cyclized = cyclizeE(diffcomb,0);
                  if ((cyclized === true) && (nring.length < prings[jj].length)) {
                    prings[jj] = nring;
                  } 
                }
              } // for all rings jj > i
            } // for all rings i
            // edges and atom SMILES of MCB rings
            for (i=1;i<prings.length;i++) { // fill the edges[] array of ring[i]
              normRing(i);
            }
            prings.sort( (a, b) => a[0] - b[0]); // sort rings according to increasing index of first atom
            for (i=1;i<prings.length;i++) { 
              edges[i] = [];
              for (jj=0;jj<prings[i].length-1;jj++) {
                edges[i].push(new Edge(prings[i][jj],prings[i][jj+1]));
              }
              edges[i].push(new Edge(prings[i][prings[i].length-1],prings[i][0]));
              edgelist ='';
              for (jj=0;jj<edges[i].length;jj++) {
                edgelist = edgelist + String(edges[i][jj].f) + "->"+String(edges[i][jj].t)+",";
              }
              edgelist = edgelist.slice(0,-1);
            }
            // fill the atom SMILES array of the MCB rings
            for (k=1;k<prings.length;k++) {
              tprats = [];
              for (i=0;i<prings[k].length;i++) {
                tprats.push(pats[prings[k][i]]);
              }
            }

            pIsolatedRings = [];
            pSpiroRings = [];
            pRingFusions = [];

            for (i=1;i<prings.length-1;i++) {
              for (jj=i+1;jj<prings.length;jj++) {
                intersectionV = [];
                intersectionV = intersect(prings[i],prings[jj]);
                intersectionE=[];
                commonEdges(jj,i);
  
                if (intersectionV.length === 1) { //dd
                  pSpiroRings.push({r1:i,r2:jj,at:intersectionV[0]});
                  isSpiro[i] = true;
                  isSpiro[jj] = true;
                } else if (intersectionE.length > 0) {
                  for (k=0;k<intersectionE.length;k++) {
                    pRingFusions.push({r1:i,r2:jj,at1:intersectionE[k].f,at2:intersectionE[k].t});
                    isFused[i] = true;
                    isFused[jj] = true;
                  }
                }
              }
            }
            for (i=1;i<prings.length;i++) {
              if (((isFused[i] === undefined) || (isFused[i] === false)) && ((isSpiro[i] === undefined) || (isSpiro[i] === false))) {
                pIsolatedRings.push(i);
              }
            }
            // store the ring index of all rings in which an atom is member in the dict atInRh{}
            // key: atom index, value: array with the ring numbers
            for (i=1;i<pats.length;i++) {
              atInRh[String(i)] = undefined; 
              atInRings(i);
            }

            // end main function analyzeRings()
        
        
        
            function commonEdges(ex1,ex2) { 
              let i=0;
              let jj=0;
              let found = false;

              for (i=0;i<edges[ex1].length;i++) { // for each edge in ring[ex1]
                found = false;
                for (jj=0;jj<edges[ex2].length;jj++) { //for each edge in ring[ex2]
                  if (((edges[ex1][i].f === edges[ex2][jj].f) && (edges[ex1][i].t === edges[ex2][jj].t)) || 
                    ((edges[ex1][i].f === edges[ex2][jj].t) && (edges[ex1][i].t === edges[ex2][jj].f))) {
                    intersectionE.push(new Edge(edges[ex1][i].f,edges[ex1][i].t));
                    found = true;
                  }
                }
                if (!found) {
                  differenceEa.push(new Edge(edges[ex1][i].f,edges[ex1][i].t));
                }
              }
          
            } // intersect edges[ex1][] and edges[ex2][] arrays,fills intersectionE[]
        
            function cyclizeE(edgarr,startedge) { // edgarr: array of edges to cyclize, 
            // startedge: index of egde to begin with in edgearr
              let i=0;
              const tedgar = edgarr.slice(0); // make a copy of the edge array
              const ncycle = [];
              let linked = false;          
              const ce = new Edge(tedgar[startedge].f,tedgar[startedge].t);
          
              ncycle.push(new Edge(ce.f,ce.t));
              nring.push(ce.f);
              tedgar.splice(startedge,1); // remove starting edge from array
          
          
              while (tedgar.length > 0) {
                linked = false;
                for (i=0;i<tedgar.length;i++) {
                  if (ce.t === tedgar[i].f ) { // edge fits
                    ce.f = tedgar[i].f;
                    ce.t = tedgar[i].t;
                    ncycle.push(new Edge(ce.f,ce.t)); 
                    nring.push(ce.f);
                    linked = true;
                    tedgar.splice(i,1); // remove edge from array
                    break;
                  } else if (ce.t === tedgar[i].t) { // reverse edge fits
                    ce.t = tedgar[i].f;
                    ce.f = tedgar[i].t;
                    ncycle.push(new Edge(ce.f,ce.t)); 
                    nring.push(ce.f);
                    linked = true;
                    tedgar.splice(i,1); // remove edge from array
                    break;
                  }
                }
                if (!linked) { // no fitting next edge found: links broken
                  return false;
                }
              }
              edgelist = '';
              for (k=0;k<ncycle.length;k++) {
                edgelist = edgelist + String(ncycle[k].f) + "->"+String(ncycle[k].t)+", ";
              }
              edgelist = edgelist.slice(0,-2);
              return true;
          
            } // tries to make a cycle out of a collection of edges. returns true if successful, false otherwise.
              // fills the closure variable edgelist[] of analyzeRings()
          
          
          } // analyzeRings: determines MCB and ring categories
            
      
          function topo(mar,bar) {
        
            let ch1la = 0;
            let ch2fa = 0;
            let cn = 0;
            let cpo = 0; // counter for atoms in chain
            let i=0;
            let jj=0;
            let lanorat =0; // running marker of the last non-ring atom in the chain
            let larat = 0; // running marker of the last ring atom in the chain
            let lasta = 0; 
            const reversedChains = [];
            let splicedone = false;
                

            for (cn=0;cn<chains.length;cn++) {
              cpo=0;
              larat = 0;
              lanorat = 0;
              // this loop generates the achains[] which no longer contain the ring atoms
              while (cpo < chains[cn].atar.length) { // for all chains
                if (atInRing(chains[cn].atar[cpo]) > 0) { //ring atom
                  if ((cpo > 0) && (lanorat > 0)) { // not the first atom of the chain but first ring atom after acyclic stretch
                    achains[achains.length-1].si = chains[cn].atar[cpo]; // set sibling
                    lanorat = 0; // reset the last acyclic atom to none   
                  }
                  larat = chains[cn].atar[cpo];
                } else { // not ring atom, copy to new chain
                  if (cpo === 0) { // first atom in this chain: initiate achain and copy parents from chains[cn]
                    achains[achains.length] = new Sidechain(chains[cn].lv,chains[cn].pa,chains[cn].pc,0);
                  } else if (larat > 0) { //there was a ring stretch before in this chain
                    achains[achains.length] = new Sidechain(0,larat,-2,0); // create new achain
                    larat = 0; // reset last ring atom to none
                  }
                  achains[achains.length-1].atar.push(chains[cn].atar[cpo]);
                  achains[achains.length-1].asa.push(pats[chains[cn].atar[cpo]]);
                  lanorat = chains[cn].atar[cpo];
                }
                cpo++;  
              }
          
            }

            // sort ringsystems according to decreasing number of rings
            pringsystems.sort((a, b) => b.length - a.length);
            // sort achains according to increasing nesting level
            achains.sort( (a, b) => a.lv - b.lv);
            for (i=0;i<achains.length;i++) {
              // reverse chains that have no parent but have a sibling
              if ((achains[i].pa === 0) && (achains[i].si > 0)) { // achain with no parent ending at ring: reverse to give a terminal chain 
                reverseChain(achains,i);
                reversedChains.push(i);            
              }
            }

            if (achains.length > 0) {

              for (i=0;i<achains.length;i++) {
              // deal with achain[0] beginning with starting atom in the middle of chain here:
              // if the reversed achains[0] has si===0 and pa !== 0 but is is bound with the last atom to the first atom of 
              // another chain: ligate the two chains to make a cchain.
              // this is done only once
                if ((achains[i].lv === 0) && (achains[i].si === 0) && (achains[i].pa !== 0)) {
                  for (jj=0;jj<achains.length;jj++) { 
                    if ((i !== jj) && (achains[jj].pa > 0) && (achains[jj].si > 0) && (atInRh[String(achains[jj].si)] !== undefined)) { 
                    // any other chain that has si in a ring
                      ch1la = achains[i].atar[achains[i].atar.length-1];
                      ch2fa = achains[jj].atar[0];
                      if (pbp[ch1la].includes(ch2fa)) {
                        concatchains(i,jj);
                        achains.splice(jj,1);
                        splicedone = true;
                        break;
                      }
                    }
                  }
                }
                if (splicedone === true) {
                  break;
                }
              } 
        
              // group achains into categories
              groupChains(achains);

              findLongestChain(mar,bar); // reorganize chains to accomodate longest chain as achains[0]
              for (i=0;i<achains.length;i++) {
              // reverse chains that have no parent but have a sibling
                if ((achains[i].pa === 0) && (achains[i].si > 0)) { // achain with no pa ending at ring: reverse to give a terminal chain 
                  reverseChain(achains,i);
                  reversedChains.push(i);            
                }
              }
        
              // if the terminal atoms of achains[].atar[] are bound to rings: reintroduce the pa (mainchain only) and si accordingly
        
              if (mar[achains[0].atar[0]].bpa.length > 1) {
                for (i=0;i<mar[achains[0].atar[0]].bpa.length;i++) {
                  if (atInRing(mar[achains[0].atar[0]].bpa[i].p)) {
                    achains[0].pa = mar[achains[0].atar[0]].bpa[i].p;
                    break;
                  }
                }
              }
              for (i=0;i<achains.length;i++) {
                lasta = achains[i].atar[achains[i].atar.length-1];
                if (mar[lasta].bpa.length > 1) {
                  for (jj=0;jj<mar[lasta].bpa.length;jj++) {
                    if ((achains[i].si === 0) && (atInRing(mar[lasta].bpa[jj].p))) {
                      achains[i].si = mar[lasta].bpa[jj].p;
                      break;
                    }
                  }
                }
              }
              groupChains(achains);
            }
        
          } // reorganize chains by eliminating rings and categorize chains
            // fills the achains[] array of Sidechain objects
      
          function groupChains(car) {
            let i=0;
        
            mchain = -1;
            cchains = [];
            rtchains = [];
            tchains = [];
            lv0ChPaInRing = -1;
        
            for (i=0;i<car.length;i++) {
        
              if ((car[i].pa === 0) && (car[i].si === 0)) { //  main chain with pa===0 and si===0 
                mchain = i;
              } else if ((car[i].pa > 0) && (car[i].si > 0)  
                && (atInRh[String(car[i].pa)] !== undefined) && (atInRh[String(car[i].si)] !== undefined)) { 
                  // connecting chains: ring-cchain-ring
                  cchains.push(i);
              } else if ((car[i].si > 0) && (atInRh[String(car[i].si)] !== undefined)) { //achain rooted at other chain and ending at ring
                  // rtchains: connect other chain with ring at the end
                  rtchains.push(i);
              } else if ((car[i].pa > 0) && (car[i].si === 0)) { // terminal achain
                  tchains.push(i);
                  if (car[i].lv === 0) { // special case of level 0 tchain with parent in ring
                    for (jj=1;jj<prings.length;jj++) { // 
                      if ( prings[jj].includes(car[i].pa)) {
                        lv0ChPaInRing = jj;
                      }
                    }
                  }
              }          
            }
          } // fills the chain-type arrays mchain, cchains, rtchains, tchains

          function reverseChain(car,cix) {
          //params: car is an array of Sidechain objects; cix is the index of the chain to be reversed in car[]
            let t;
        
            car[cix].atar.reverse();
            car[cix].asa.reverse();
            // swap parent and sibling
            t = car[cix].si;
            car[cix].si = car[cix].pa;
            car[cix].pa = t;
            // adjust the incoming (pic[]) and the prefixes
            for (t=car[cix].atar.length-1; t > 0;t--) {
              prfs[car[cix].atar[t]] = prfs[car[cix].atar[t-1]];
              pic[car[cix].atar[t]] = car[cix].atar[t-1];
            }
            pic[car[cix].atar[0]] = 0;
            prfs[car[cix].atar[0]] = '';
            prfs[car[cix].atar[0]] = prfs[car[cix].pa]; // prefix of former si -> prefix of first atom
            pic[car[cix].atar[0]] = car[cix].pa;
            if ((pic[car[cix].pa+1]) === car[cix].pa) {
              prfs[car[cix].pa] = prfs[car[cix].pa+1];
              pic[car[cix].pa] = car[cix].pa+1;
            }
          } // reverse direction of a chain in place. Adjust prefixes and pic[]
      
          function concatchains(ch1,ch2) {
            achains[ch1].atar = achains[ch1].atar.concat(achains[ch2].atar);
            achains[ch1].si = achains[ch2].si;
      
          } // concatenate two chains into a single one
          
          function split_achain(car,cx,idx) {
            // params: cx is the index of the chain to split in achains[];  
            //         idx is the index of the element of achains[cx].atar[] before which the split must be done 
            const nachain = new Sidechain(car[cx].lv,car[cx].atar[idx-1],cx,car[cx].si);

            if ((idx < 1) || (car[cx].atar.length < 2)) {
              return; // no split possible with zero or one elements in the achain
            }

            nachain.atar = car[cx].atar.slice(idx);
            nachain.asa = car[cx].asa.slice(idx);             
            car[cx].atar = car[cx].atar.slice(0,idx);
            car[cx].asa = car[cx].asa.slice(0,idx);
            car[cx].si = nachain.atar[0];
            reverseChain(achains,cx);
            car.push(nachain);
          }
            
          function findLongestChain(mar,bar) {
            const achends = [];
            let achse = -1;
            let achss = -1;
            let curch = -1;
            let cus = -1;
            let i=0;
            let jj=0;
            const lachain = new Sidechain(0,0,-1,0);
            let lchsect = [];
            let pathThroughRing = false;
            let t=0;
            let tatar = [];
            let tmp = 0;
        
        
            if (achains.length === 0) { return; }
        
            for (i=0;i<achains.length;i++) {
        
              if (i === mchain) { // mchain
                achends.push(achains[i].atar[0]); // first atom
                achends.push(achains[i].atar[achains[i].atar.length-1]); // last atom
              }
              if ((tchains.length > 0) && (tchains.includes(i)) && (!(atInRing(achains[i].pa > 0)))) { // tchain not rooted at ring
                achends.push(achains[i].atar[achains[i].atar.length-1]); // last atom
              }
              if ((rtchains.length > 0) && (rtchains.includes(i))) { // rtchain chain
                achends.push(achains[i].atar[achains[i].atar.length-1]); // last atom
              }
              if ((cchains.length > 0) && (cchains.includes(i))) { // cchain chain
                achends.push(achains[i].atar[0]); // first atom
                achends.push(achains[i].atar[achains[i].atar.length-1]); // last atom
              }
            }
            elidup(achends);

            longChain = [];

            if (achends.length > 1) { // at least 2 ends
              for (i=0;i<achends.length-1;i++) {
                for (jj=i+1;jj<achends.length;jj++) {
                  pathThroughRing = false;
                  findShortestPath(mar,bar,achends[i],achends[jj]);
                  for (k=0;k<shortpath.length;k++) {
                    if (atInRing(shortpath[k]) > 0) {
                      pathThroughRing = true;
                      break;
                    }
                  }
                  if (pathThroughRing) { // discard paths that go through rings
                    break;
                  }
                  if (shortpath.length > longChain.length) {
                    longChain = shortpath.slice(0);
                  } else if (shortpath.length === longChain.length) { // same length: decide based on rings at end
                    if (((hasBondToRing(mar,shortpath[0]) > 0) && (hasBondToRing(mar,shortpath[shortpath.length-1]) > 0)) 
                      && ((hasBondToRing(mar,longChain[0]) === 0) || (hasBondToRing(mar,longChain[longChain.length-1]) === 0))) {
                      longChain = shortpath.slice(0);
                    }
                  }
                }
              }
    //           if (eepaths.length > 0) {
    //             for (i=0;i<eepaths.length;i++) {
    //             }
    //           }          
            } else {
              longChain = [];
              return; 
            }
        
            if (longChain.length > 3) {
              // determine chain sections involved in longChain
              // lchsect[] is an array of objects { c:, s:, e:} with
              // c: the achain involved, 
              // s: the index of the section start in the achain
              // e: the index of the section end in the achain
              lchsect = [];
              curch = chainOf(achains,longChain[0]);        
              achss = achains[curch].atar.indexOf(longChain[0]);
              achse = -1;
              for (i=1;i<longChain.length;i++) {
                if (chainOf(achains,longChain[i]) !== curch) {
                  achse = achains[chainOf(achains,longChain[i-1])].atar.indexOf(longChain[i-1]);
                  lchsect.push({c:curch, s:achss, e:achse});
                  curch = chainOf(achains,longChain[i]);
                  achss = achains[curch].atar.indexOf(longChain[i]);
                }   
              }
              lchsect.push({c:curch, s:achss, e:achains[chainOf(achains,longChain[longChain.length-1])].atar.indexOf(longChain[longChain.length-1])});
        
              // make copies of the sections in longChain and concatenate them to a new achain
        
              for (i=0;i<lchsect.length;i++) {
        
                if (lchsect[i].s > lchsect[i].e) { // chain section is in reverse order
                  tmp = lchsect[i].s;
                  lchsect[i].s = lchsect[i].e;
                  lchsect[i].e = tmp;
                  tatar = achains[lchsect[i].c].atar.slice(lchsect[i].s,(lchsect[i].e+1));
                  tatar.reverse();
                  // adjust the incoming (pic[]) and the prefixes
                  for (t=tatar.length-1; t > 0;t--) {
                    prfs[tatar[t]] = prfs[tatar[t-1]];
                    pic[tatar[t]] = tatar[t-1];
                  }

                } else {
                  tatar = achains[lchsect[i].c].atar.slice(lchsect[i].s,(lchsect[i].e+1));
                }
                lachain.atar = lachain.atar.concat(tatar);
              }      
        
              // rearrange the achains accordingly: each achain that is containing a section of lachain
              // causes creation of max. two new nchains containing the end sections that are not part of lachain
              // If necessary, they will be reversed and the parents and siblings are adjusted.
        
              // copy the longest chain to nchains[0]
              nchains = [];
              nchains[nchains.length] = new Sidechain(lachain.lv,lachain.pa,lachain.pc,lachain.si);
              nchains[nchains.length-1].atar = lachain.atar.slice(0);
        
              // test each achain for section of lachain and rearrange achains into nchains
              for (i=0;i<achains.length;i++) { 
                cus = -1;
                for (jj=0;jj<lchsect.length;jj++) {
                  if (lchsect[jj].c === i) { // achain contains section jj
                    cus = jj;
                    break;              
                  }
                }
                if (cus > -1) { // achain contains section cus
                  if (lchsect[cus].s > 0) { // there is a initial part not involved in lachain
                    nchains[nchains.length] = new Sidechain(achains[i].lv +1,achains[i].pa,0,achains[i].atar[lchsect[cus].s]);
                    nchains[nchains.length-1].atar = achains[i].atar.slice(0,lchsect[cus].s);
                    reverseChain(nchains,nchains.length-1);            
                  }
                  if (lchsect[cus].e < achains[i].atar.length-1) { // there is a final part not involved in lachain
                    nchains[nchains.length] = new Sidechain(achains[i].lv + 1,achains[i].atar[lchsect[cus].e],0,achains[i].si);
                    nchains[nchains.length-1].atar = achains[i].atar.slice(lchsect[cus].e+1);
                  }
                } else { // chain does not contain section of lachain: copy chain as is to nchains[]
                  if (chainOf(achains,achains[i].pa) > -1) { // parent atom is in a chain
                    nchains[nchains.length] = new Sidechain(achains[chainOf(achains,achains[i].pa)].lv,achains[i].pa,chainOf(achains,achains[i].pa),achains[i].si);
                    nchains[nchains.length-1].atar = achains[i].atar.slice(0);
                    if (nchains[0].atar.includes(nchains[nchains.length-1].pa)) { // correct lv, pc of chain if it is attached to nchains[0]
                      nchains[nchains.length-1].pc = 0;
                      nchains[nchains.length-1].lv = 1;
                    }
                  } else { // parent atom is not in chain, copy pa, pc, si, lv from achains[i]
                    nchains[nchains.length] = new Sidechain(achains[i].lv,achains[i].pa,achains[i].pc,achains[i].si);
                    nchains[nchains.length-1].atar = achains[i].atar.slice(0);                
                  }                    
                }
              }
              // reverse nchain[0] if the index of its 1st atom is higher than the one of the last Atom
              if (nchains[0].atar[0] > nchains[0].atar[nchains[0].atar.length-1]) {
                reverseChain(nchains,0);
              } 
              // adjust lv and pc of nchains from pa and fill the asa[] of each nchain
              for (jj=0;jj<nchains[0].atar.length;jj++) {
                nchains[0].asa.push(pats[nchains[0].atar[jj]]);
              }
              // adjust the pic[] of each chain atom of nchain[0]
              pic[nchains[0].atar[0]] = (nchains[0].pa > 0)? nchains[0].pa : 0 ;           
              for (jj=1;jj<nchains[0].atar.length;jj++) {
                pic[nchains[0].atar[jj]] = nchains[0].atar[jj-1];
              }
              for (i=1;i<nchains.length;i++) {
                if ((nchains[i].pa > 0) && (atInRing(nchains[i].pa) === 0)) {             
                  nchains[i].pc = chainOf(nchains,nchains[i].pa);
                  nchains[i].lv = nchains[nchains[i].pc].lv+1;
                } else {
                  nchains[i].pc = -2;
                  nchains[i].lv = -1;
                }        
                // refill the asa[] of nchains from pats[]
                for (jj=0;jj<nchains[i].atar.length;jj++) {
                  nchains[i].asa.push(pats[nchains[i].atar[jj]]);
                }
                // adjust the pic[] of each chain atom
                pic[nchains[i].atar[0]] = (nchains[i].pa > 0)? nchains[i].pa : 0 ;
                for (jj=1;jj<nchains[i].atar.length;jj++) {
                  pic[nchains[i].atar[jj]] = nchains[i].atar[jj-1];
                }
              }
              achains = [];
              achains = nchains;
              for (i=1;i<achains.length;i++) {
                if ((chainOf(achains,achains[i].pa) === 0) && (prfs[achains[i].pa] !== '')) { // chain has parent with prefix in achain[0]
                }
              }
            } else {
              longChain = [];
            }
            // end if (longChain.length > 3)  
          }  // find the longest chain from shortest paths between chain ends and rearrange the achains accordingly
            // if the longest chain is longer than 3 atoms, the achains are rearranged to make the longest chain achain[0]
            // fills the parse_SMILES()  closure variable longChain[]

          function hasBondToRing(mar,ax) {
            let i=0;
            let jj=0;
            for (i=0;i<mar[ax].bpa.length;i++) { // for all bonding partners of ax
              for (jj=1;jj<prings.length;jj++) {
                if ( prings[jj].includes(mar[ax].bpa[i].p)) {
                  return jj;
                }
              }
            }
            return 0;
          } // returns the ring index in prings[] if ax is bound to a ring atom, 0 otherwise
      
        // Constructors related to parseSMILES
      
/** @constructor */
          function Ringclosure(c1,a1,c2,a2) {
            this.sc = c1;
            this.sa = a1;
            this.ec = c2;
            this.ea = a2;
          } // constructor

      
          /** @constructor */
function Edge(v1,v2) {
            this.f = v1;
            this.t = v2;
          } // constructor
      
/** @constructor */
          function Sidechain(nlev,parentatom,parentchain,sibling) {
            this.lv = nlev; // level of nesting (main chain === 0)
            this.pa = parentatom; // atom index of parent atom (where sidechain is attached)
            this.pc = parentchain; // chain to which this sidechain is attached
            this.si = sibling; // only for connectors: atom to which the last atom of the chain is bound
            this.atar = []; // array of atom indices of all atoms in this sidechain
            this.scs = ''; // SMILES string with all atoms as element symbols (incl. ring closures) of this sidechain. Includes \ // = and #
            this.asa = []; // array of atom strings runs parallel to atar[]
          } // constructor
           
        } // reconstruct molecule from SMILES code

/** @constructor */
        function Molgrp(mo) {
          // param: mo is an array of mol numbers
          this.mols = mo.slice(0); // array of indices ((indx in m_smico + 1) === tree number) of the molecules belonging to this mol group 
          this.mf = []; // array of Rtm{} objects listing other mol groups (index in pmolgrp[]) that have reaction arrows pointing to this group and the rxn arrow index in prxnarro[],
          this.mt = []; // array of Rtm{} objects listing other mol groups (index in pmolgrp[]) to which reaction arrows originating at this group point
          this.path = 0;
          this.gen = 0;
          this.nr = 0;
        }
        
/** @constructor */
        function Rtm(mgrix,rxix) {
          this.mgr=mgrix; // the index of the connected Molgrp{} in pmolgrp[]
          this.rx=rxix;  // the index of the connecting arrow in prxnarro[]
        }

      } // reconstruct multiple-structures from multi-SMILES string


    }  // end of drawCanvas() function

//END PMS
//START HTML-TERM    
    window['drawCanvas'] = drawCanvas;
    
//END CODE TO COMPILE
