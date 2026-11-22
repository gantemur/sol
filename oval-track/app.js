// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Tsogtgerel Gantumur
// Construct operations from earlier moves; no state is uploaded or tracked.
(() => {
  "use strict";
  const M = window.OvalTrack, W = window.OvalWorkshop;
  if (!M || !W) throw new Error("Oval Track model and workshop must load first");
  const el = id=>document.getElementById(id);
  const I = {
    mn: {
      back:"← Sol", language:"Хэл сонгох", eyebrow:"Математикийн тоглоом", title:"Зууван зам",
      intro:"Найман дугуйг эргүүлж, дөрвийг нь урвуулаарай. Цөөн хөдөлгөөнөөр ямар сэлгэлт хийж болох бол?",
      playTitle:"Тоглох талбар", home:"Эхлэл", moveControls:"Зам ба эргүүлдэг хэсгийн хөдөлгөөнүүд",
      secondaryControls:"Тоглоомын удирдлага", left:"Зүүн", right:"Баруун", flip:"Урвуулах",
      undo:"↶ Буцаах", scramble:"⤨ Холих", reset:"↺ Эхлэл",
      history:"Хөдөлгөөний дараалал", chronological:"Зүүнээс баруун руу →",
      emptyHistory:"Хөдөлгөөн алга", moreHistory:"өмнөх хөдөлгөөн",
      shortcuts:"Товчлуур: ← / → зам эргүүлэх, F дөрвийг урвуулах, Z буцаах.",
      aligned:"● Эх байдал", rotated:"◌ Дараалал зөв, байрлал зөрсөн", mixed:"● Байрлал өөрчлөгдсөн",
      moveCount:"хөдөлгөөн", boardAria:"1–8-р байрлал дахь дугуйнууд:",
      discoverEyebrow:"Ажиглаж нээгээрэй", discoverTitle:"Гурван туршилт",
      hint:"Сэжүүр", explain:"Тайлбар", previous:"← Өмнөх", next:"Дараах →",
      mathTitle:"Математикийг үзэх", mathLead:"Дугуй бүр анхныхаа байрлалаас хаашаа очсоныг сэлгэлт гэж үзье.",
      positions:"Байрлал 1–8 дээрх дугуйнууд", permMapping:"Дугуй 1–8-ийн очсон байрлал",
      cycles:"Циклээр бичвэл", order:"Энэ сэлгэлтийн зэрэг",
      mathConventions:"Байрлалууд тогтмол. (1 3) гэдэг нь эхлээд 1-р байранд байсан дугуй 3-р байр руу, 3-р байрны дугуй 1-р байр руу очсоныг илэрхийлнэ. RT гэвэл эхлээд R, дараа нь T хийнэ.",
      groupTitle:"Групп гэж юу вэ?",
      groupBody:"Хөдөлгөөнүүдийг дараалуулан хийж болно; хөдөлгөөн бүрийг буцааж болно; юу ч өөрчлөхгүй хөдөлгөөн бий. Дараалуулах үйлдэл хаалттай, ассоциатив. Эдгээр нь группийн гол шинжүүд. Энэ тоглоомын R ба T хөдөлгөөнөөр 8! = 40 320 сэлгэлт бүгд үүснэ.",
      backBottom:"← Sol-ийн хэрэгслүүд",
      ex1Title:"Буцааж болох уу?", ex1Desc:"Нэг хөдөлгөөнийг хийгээд дахин хийвэл яах бол? Харин замыг тойруулж эргүүлбэл хэдэн алхмын дараа бүх дугуй эхэндээ ирэх вэ?",
      ex1Hint:"T-г хоёр удаа, эсвэл R-г найман удаа хийгээд харьцуул.",
      ex1Explain:"T² = e, R⁸ = e. R-ийн урвуу нь R⁻¹, T-ийн урвуу нь T өөрөө. Аливаа дарааллыг буцаахын тулд урвуу хөдөлгөөнүүдийг эсрэг дарааллаар хийнэ.",
      ex2Title:"Дараалал чухал уу?", ex2Desc:"Эх байдлаас R дараа T хий. Дахин эхлээд T дараа R хий. Хоёр үр дүн ижил үү?",
      ex2Hint:"RT ба TR-ийг тус тусад нь туршихдаа эх байдалд заавал эргэн оч.",
      ex2Explain:"RT ≠ TR. RT нь [3 2 1 8 4 5 6 7], харин TR нь [8 4 3 2 1 5 6 7] болно. Иймээс хөдөлгөөнүүдийн дараалал үр дүнд нөлөөлдөг.",
      ex3Title:"Олон алхам, өчүүхэн өөрчлөлт", ex3Desc:"R дараа T гэдгийг таван удаа давт. Арван хөдөлгөөн хийсэн атлаа хэдэн дугуй байрлалаа сольсон бэ?",
      ex3Hint:"Нэг удаагийн RT нь (1 3)(4 5 6 7 8). Энэ хоёр цикл 2 ба 5 урттай.",
      ex3Explain:"RT = (1 3)(4 5 6 7 8). Үүнийг тав давтахад таван гишүүнт цикл буцаж хэвэндээ орно, харин (1 3) хэвээр үлдэнэ. Өөрөөр хэлбэл арван алхам зөвхөн 1, 3-р дугуйг сольжээ. Дахин тав давтвал бүгд хэвэндээ орно.",
      tryTT:"T · T", tryR8:"R × 8", tryRT:"R дараа T", tryTR:"T дараа R",
      trySwap:"(RT) × 5", tryReturn:"(RT) × 10",
      noteTT:"T-г хоёр удаа хийхэд эх байдалд эргэж ирэв.",
      noteR8:"R-г найман удаа хийхэд эх байдалд эргэж ирэв.",
      noteRT:"RT-ийн дараах байдал:", noteTR:"TR-ийн дараах байдал:",
      noteSwap:"Зөвхөн 1 ба 3 дугуй байрлалаа солив.", noteReturn:"Арван RT хослолын дараа бүгд эхэндээ ирэв.",
      compare:"Хоёр үр дүн ялгаатай байна.",
      busy:"Хөдөлгөөнүүдийг тоглуулж байна…"
    },
    en: {
      back:"← Sol", language:"Choose language", eyebrow:"Mathematical puzzle", title:"Oval track",
      intro:"Rotate eight numbered disks, or reverse four at once. Which permutations can you make with these simple moves?",
      playTitle:"Puzzle board", home:"Home", moveControls:"Track and turntable moves",
      secondaryControls:"Puzzle controls", left:"Left", right:"Right", flip:"Flip",
      undo:"↶ Undo", scramble:"⤨ Scramble", reset:"↺ Reset",
      history:"Move history", chronological:"Read left to right →",
      emptyHistory:"No moves yet", moreHistory:"earlier moves",
      shortcuts:"Keyboard: ← / → move the track, F flips four disks, Z undoes.",
      aligned:"● At home", rotated:"◌ In order, but rotated", mixed:"● Rearranged",
      moveCount:"moves", boardAria:"Tiles at positions 1–8:",
      discoverEyebrow:"Explore and discover", discoverTitle:"Three experiments",
      hint:"Hint", explain:"Explain", previous:"← Previous", next:"Next →",
      mathTitle:"Show the mathematics", mathLead:"Think of each disk's destination, relative to its original position, as a permutation.",
      positions:"Tiles at positions 1–8", permMapping:"Destinations of tiles 1–8",
      cycles:"Cycle notation", order:"Order of this permutation",
      mathConventions:"Positions stay fixed. (1 3) means the disk originally at position 1 went to position 3, and the disk originally at 3 went to 1. In a move word RT, do R first, then T.",
      groupTitle:"What is a group?",
      groupBody:"We can combine moves, undo every move, and do nothing (the identity). Combining moves is associative, and the collection is closed under combination. These are the essential group properties. Here R and T generate all 8! = 40,320 permutations.",
      backBottom:"← Other Sol tools",
      ex1Title:"Can you undo a move?", ex1Desc:"What happens if you repeat a flip? How many track rotations bring all eight disks home?",
      ex1Hint:"Try T twice or R eight times, starting from home.",
      ex1Explain:"T² = e and R⁸ = e. The inverse of R is R⁻¹; T is its own inverse. To undo a sequence, invert each move and perform the inverses in reverse order.",
      ex2Title:"Does order matter?", ex2Desc:"Starting at home, try R then T. Reset and try T then R. Do you get the same arrangement?",
      ex2Hint:"Compare RT with TR, making sure both start from home.",
      ex2Explain:"RT ≠ TR. RT produces [3 2 1 8 4 5 6 7], while TR produces [8 4 3 2 1 5 6 7]. The order of operations changes the result.",
      ex3Title:"Many moves, tiny change", ex3Desc:"Repeat R then T five times. After ten moves, how many disks are in different positions?",
      ex3Hint:"One RT has cycle form (1 3)(4 5 6 7 8), with cycles of lengths 2 and 5.",
      ex3Explain:"RT = (1 3)(4 5 6 7 8). Repeating it five times cancels the 5-cycle but leaves the transposition (1 3). Ten simple moves have exchanged only disks 1 and 3! Five more repetitions return all eight home.",
      tryTT:"T · T", tryR8:"R × 8", tryRT:"R then T", tryTR:"T then R",
      trySwap:"(RT) × 5", tryReturn:"(RT) × 10",
      noteTT:"Two flips returned every disk home.",
      noteR8:"Eight track rotations returned every disk home.",
      noteRT:"After RT:", noteTR:"After TR:",
      noteSwap:"Only disks 1 and 3 have exchanged positions.", noteReturn:"Ten RT pairs returned every disk home.",
      compare:"The two results are different.",
      busy:"Playing move sequence…"
    }
  };

  Object.assign(I.mn, {
    intro:"Зөвхөн R ба T хөдөлгөөнөөр эхлээрэй. Эвлүүлэг бодож шинэ үйлдэл нээн, өөрийн хэрэгслийг бүтээ.",
    modeLabel:"Тоглох горим", modeLearn:"Үйлдэл бүтээх", modeFree:"Чөлөөт тоглолт",
    available:"Боломжтой үйлдлүүд", restart:"↺ Дахин", shortcutsNew:"Товчлуур: → R, F = T, Z буцаах. L нээгдсэний дараа ← ашиглана.",
    discoverEyebrowNew:"Бүтээх дасгал", discoverTitleNew:"Үйлдлийн сан",
    target:"Зорилтот байрлал", nameOperation:"Үйлдэлд нэр өгөх", forge:"Үйлдлийг нэмэх", completed:"Энэ үйлдлийг өмнө нь нээсэн.",
    addT:"Оллоо! T-г дахин хийхэд T-ийн урвуу болно: T⁻¹ = T. Тусдаа товч хэрэггүй.",
    addL:"R-ийн урвуу хөдөлгөөнийг оллоо! Үүнийг L гэж нэрлээд нэг алхмаар зүүн тийш хөдөлгөдөг товч нээе.",
    addP:"Шинэ нийлмэл үйлдэл: энэ хөдөлгөөний дараалалд нэр өг. Дараа нь нэг товчоор дахин ашиглаж болно.",
    addS:"Гайхамшигтай! Зөвхөн 1 ба 3-р байрны дугуйнууд солигдлоо. Энэ дарааллыг нэрлээд хэрэгсэл болго.",
    nextTool:"Дараагийн дасгал →", nameInvalid:"Нэр 1–12 үсэг, тоо, _ эсвэл - байх ёстой.", nameUsed:"Энэ нэр аль хэдийн ашиглагдсан.",
    buildDone:"Хэрэгсэл нэмэгдлээ: ", savedProgress:"Ахиц хадгалагдсан", resetProgress:"Сургалтыг шинээр эхлэх",
    resetProgressConfirm:"Нээсэн үйлдлүүд болон өөрийн хадгалсан хэрэгслүүдийг устгаж, шинээр эхлэх үү?",
    lesson0Title:"1. T-ийн урвууг ол", lesson0Desc:"Дөрвөн дугуйг T хөдөлгөөнөөр урвуулжээ. Зөвхөн R ба T ашиглан дугуйг эх байдалд нь буцаа. Хамгийн энгийн шийдэл юу вэ?",
    lesson0Hint:"Нэг T-г дахин хийж үз. Нэг хөдөлгөөн хэдэн удаа хийгдвэл анхны байдалдаа орох вэ?",
    lesson0Explain:"T нь 4 байрлалыг урвуулаад T дахин хийхэд буцааж хэвэнд оруулна. T² = e, иймээс T⁻¹ = T.",
    lesson1Title:"2. R-ийн урвууг бүтээ", lesson1Desc:"Замыг нэг удаа баруун тийш эргүүлжээ. Одоо зүүн эргүүлэх товч алга! R ба T-ээр эх байдалд буцаах дараалал ол.",
    lesson1Hint:"Тойрог дээр найман байрлал бий. R-г дахин долоон удаа хийвэл юу болох вэ?",
    lesson1Explain:"R⁸ = e тул R⁻¹ = R⁷. Олсон урвууг L гэж нэрлээд цаашид нэг товчоор нэг алхам зүүн тийш хөдөлгөнө.",
    lesson2Title:"3. Хоёр хөдөлгөөнийг нэгтгэ", lesson2Desc:"Эх байдлаас R хийгээд T хий. Ингэж үүссэн шинэ сэлгэлтийг нэг нэртэй, дахин ашиглах үйлдэл болго.",
    lesson2Hint:"Эхлээд R, дараа нь T дар. Дарааллыг зүүнээс баруун руу уншина.",
    lesson2Explain:"RT = (1 3)(4 5 6 7 8). R дараа T гэсэн дарааллыг нэг хэрэгсэл болгож хадгалж болно. Энэ нь шинэ физик хөдөлгөөн биш, өмнөх хоёрын товчлол.",
    lesson3Title:"4. Хоёрхон байрлалыг соль", lesson3Desc:"1 ба 3-р байрлалын дугуйг солиод бусад зургааг хөдөлгөхгүй орхи. Өмнөх бүтээсэн үйлдлүүдээ ашигла.",
    lesson3Hint:"RT нь (1 3)(4 5 6 7 8). Таван гишүүнт циклийг арилгахын тулд RT-г хэдэн удаа давтах вэ?",
    lesson3Explain:"(RT)⁵ = (1 3). Хоёр гишүүнт цикл хэвээр, таван гишүүнт цикл тав давтагдаад алга болно. Ийм нийлмэл үйлдэл нэг товч дарахад өөрийн бүх хөдөлгөөнийг үзүүлнэ.",
    freeEyebrow:"Чөлөөтэй бод",freeTitle:"Эх байдлыг сэргээ",freeLead:"Дугуйнуудыг хууль ёсны хөдөлгөөнөөр хольжээ. Бүх дугуйг яг анхны байрлалд буцаа. Санамсаргүй оролдохын оронд хөдөлгөөнүүдийн урвууг бодож үз.",
    difficulty:"Холих алхмын тоо",newScramble:"Шинэ эвлүүлэг",freeHint:"Буцах нэг аргыг харах",freeSolved:"Боллоо! Дугуй бүр зөв байрлалд байна.",freePlaying:"Эхний байрлалд бүх дугуйг буцаагаарай.",freeRoute:"Хольсон дарааллын урвуу нэг боломжит шийдэл:",
    freeRouteNote:"Энэ нь хамгийн богино шийдэл байх албагүй.",
    customHeader:"Өөрийн үйлдэл хадгалах",customLead:"Одоогийн товч даралтуудаа дараалал болгон хадгал. Нэртэй товч түүнийг дахин тоглуулна.",
    customLabel:"Нэр",customSave:"Хадгалах",customEmpty:"Эхлээд хэдэн хөдөлгөөн хийгээрэй.",customLimit:"Одоохондоо 6 хүртэл өөрийн үйлдэл хадгална.",customTooLong:"Дараалал хэт урт байна.",customSaved:"Шинэ хэрэгсэл хадгалагдлаа: ",
    libraryEyebrow:"Хэрэгслийн сан",libraryTitle:"Миний үйлдлүүд",libraryNote:"Шинэ үйлдэл бүр өмнөх хөдөлгөөний товчлол. Боломжит сэлгэлтийн тоо өөрчлөгдөхгүй.",
    toolR:"Баруун нэг алхам",toolT:"Дөрөв урвуулах",toolL:"Зүүн нэг алхам",toolMacro:"Нийлмэл үйлдэл",
    movesShort:"хэрэгсэл",moveCount:"үйлдэл",playback:"Тоглуулж байна",unknownTool:"Үйлдлийг тоглуулах боломжгүй.",
    showMore:"Математик дэлгэрэнгүй",lessonDone:"Зорилт биеллээ!",maxMoves:"Энэ үйлдэл хэт олон хөдөлгөөнтэй.",
    notesT:"T⁻¹ = T",notesL:"L = R⁷",notesP:"Нэртэй нийлмэл үйлдэл",notesS:"Хоёр байрлалыг солих",
    groupBody:"R болон T-г нийлүүлж, урвуу хөдөлгөөнтэй болох, нэртэй үйлдэл бүтээх боломжтой. Хэрэгслүүдийг нэмж байгаа ч хийж болох сэлгэлтийн групп өөрчлөгдөхгүй: R ба T аль хэдийн S₈-ийн 40 320 элементийг үүсгэдэг. Нэртэй товч бол нэг сэлгэлтийн товчлол юм."
  });
  Object.assign(I.en, {
    intro:"Begin with only R and T. Solve puzzles to discover new operations, name them, and add them to your toolbox.",
    modeLabel:"Play mode", modeLearn:"Build operations", modeFree:"Free play",
    available:"Available operations", restart:"↺ Restart", shortcutsNew:"Keyboard: → for R, F for T, Z to undo. After discovering L, ← becomes available.",
    discoverEyebrowNew:"Construction puzzles", discoverTitleNew:"Build your toolbox",
    target:"Target positions",nameOperation:"Name this operation",forge:"Add to toolbox",completed:"You have already unlocked this operation.",
    addT:"Found it! T is its own inverse: T⁻¹ = T. No new button is needed.",
    addL:"You found the inverse of R! Call it L. The new button moves left one step immediately.",
    addP:"You made a composite move! Name the sequence and save it for reuse with one button.",
    addS:"Excellent! Only positions 1 and 3 were exchanged. Name your special sequence and make it a tool.",
    nextTool:"Next puzzle →", nameInvalid:"Use 1–12 letters, numbers, _ or -.", nameUsed:"This name is already used.",
    buildDone:"Added tool: ",savedProgress:"Progress saved",resetProgress:"Start lessons over",
    resetProgressConfirm:"Erase your unlocked operations and custom tools to start again?",
    lesson0Title:"1. Find the inverse of T",lesson0Desc:"The four top disks have been flipped once. With only R and T, return all the disks to their home positions. What is the simplest solution?",
    lesson0Hint:"Try T once more. How often must a move be repeated before it becomes the identity?",
    lesson0Explain:"T reverses the four top positions. Doing T twice restores them all, so T² = e and T⁻¹ = T.",
    lesson1Title:"2. Invent the inverse of R",lesson1Desc:"The track has been rotated right once, but you have no left-move button. Find a sequence of R and T that undoes this rotation.",
    lesson1Hint:"The track has eight positions. What happens if you press R seven more times?",
    lesson1Explain:"R⁸ = e, so R⁻¹ = R⁷. Name this inverse L and thereafter use one quick left move instead of seven right moves.",
    lesson2Title:"3. Package two moves",lesson2Desc:"Start at home, do R and then T. Give the resulting composite operation a short name so you can reuse it.",
    lesson2Hint:"Press R, followed by T. Read operation words left to right, in chronological order.",
    lesson2Explain:"RT = (1 3)(4 5 6 7 8). You can save the sequence R then T as one operation. It is a shorthand for the original moves, not a new physical move.",
    lesson3Title:"4. Swap just two positions",lesson3Desc:"Exchange the disks in positions 1 and 3, leaving all six others exactly where they began. Use the operations you have built.",
    lesson3Hint:"RT has cycles (1 3)(4 5 6 7 8). How many repetitions cancel the five-cycle?",
    lesson3Explain:"(RT)⁵ = (1 3). Repeating five times cancels the 5-cycle but leaves the 2-cycle. Your new button plays its underlying sequence, rather than teleporting the disks.",
    freeEyebrow:"Unrestricted puzzle",freeTitle:"Restore the track",freeLead:"The disks were scrambled using legal moves. Return all eight to their exact starting positions. If random moves are frustrating, think about inverses.",
    difficulty:"Scramble length",newScramble:"New scramble",freeHint:"Show one route back",freeSolved:"Solved! Every disk is home.",freePlaying:"Get every disk back to its exact home position.",freeRoute:"One way back is the inverse of the scramble:",
    freeRouteNote:"This route may not be shortest.",
    customHeader:"Save your own operation",customLead:"Save the moves you have just performed as a named operation. One button will replay its definition.",
    customLabel:"Name",customSave:"Save",customEmpty:"Make some moves first.",customLimit:"You can save up to six custom operations for now.",customTooLong:"That sequence is too long.",customSaved:"Saved a new tool: ",
    libraryEyebrow:"Your toolbox",libraryTitle:"My operations",libraryNote:"Every newly saved tool is a shorthand for existing moves. The set of reachable permutations does not change.",
    toolR:"One step right",toolT:"Flip four",toolL:"One step left",toolMacro:"Composite move",
    movesShort:"tools",moveCount:"operations",playback:"Playing",unknownTool:"Unable to play that operation.",
    showMore:"More mathematics",lessonDone:"Target reached!",maxMoves:"This operation is too long to play.",
    notesT:"T⁻¹ = T",notesL:"L = R⁷",notesP:"Named composite operation",notesS:"Two-position swap",
    groupBody:"Combine R and T, discover inverse moves, and create named operations. Your toolbox grows, but the group of possible permutations does not change: R and T already generate all 8! = 40,320 elements of S₈. A named operation is simply a convenient shorthand."
  });

  const STORAGE="oval-track-workshop-v2";
  const POINTS=[
    {x:91,y:103},{x:164,y:103},{x:236,y:103},{x:309,y:103},
    {x:309,y:223},{x:236,y:223},{x:164,y:223},{x:91,y:223}
  ];
  const COLORS=["#f7d79f","#b7ddd0","#f0cbb3","#c3d6f1","#f5d797","#b8d9cf","#e8d1df","#b9d8e3"];
  const svgNS="http://www.w3.org/2000/svg";
  const reduced=window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
  const diskNodes=new Map();
  const state={
    lang:"mn",mode:"learn",level:0,progress:0,
    definitions:{},custom:[],nextCustom:1,freeDifficulty:5,
    sessions:{learn:null,free:null},reveal:null,freeShowSolution:false,
    feedback:"",customFeedback:""
  };
  const pending=[];
  let moving=false,epoch=0,cancelAnimation=null,lastPalette="";
  function t(key){return I[state.lang][key] ?? I.mn[key] ?? key;}
  function text(id,value){el(id).textContent=value;}
  function storageRead(){try{return JSON.parse(localStorage.getItem(STORAGE)||"null")}catch(_){return null}}
  function storageWrite(){
    try{localStorage.setItem(STORAGE,JSON.stringify({
      progress:state.progress,definitions:state.definitions,custom:state.custom,
      nextCustom:state.nextCustom
    }))}catch(_){/* local storage is optional */}
  }
  function definitions(){
    const lib={};
    if(state.progress>=3)lib.P=state.definitions.P || {name:"P",recipe:W.canonicalP()};
    if(state.progress>=4)lib.S=state.definitions.S || {name:"S",recipe:W.canonicalS()};
    for(const item of state.custom)lib[item.id]=item;
    return lib;
  }
  function toolName(id){
    return id==="R"||id==="T"||id==="L"?id:(definitions()[id]?.name||id);
  }
  function allOperations(){
    const result=["R","T"];
    if(state.progress>=2)result.push("L");
    if(state.progress>=3)result.push("P");
    if(state.progress>=4)result.push("S");
    return result.concat(state.custom.map(item=>item.id));
  }
  function available(id){return allOperations().includes(id);}
  function labelWord(word){return W.compact(word,toolName);}
  function safeName(candidate,exclude){
    const valid=W.validateName(candidate);
    if(!valid)return {error:"nameInvalid"};
    if(allOperations().some(id=>id!==exclude &&
      (id.toLowerCase()===valid.toLowerCase()||toolName(id).toLowerCase()===valid.toLowerCase()))) {
      return {error:"nameUsed"};
    }
    if(["r","t","l","p","s"].includes(valid.toLowerCase()) && valid.toLowerCase()!==String(exclude||"").toLowerCase()){
      return {error:"nameUsed"};
    }
    return {name:valid};
  }
  function loadProgress(){
    const raw=storageRead();
    if(!raw||!Number.isInteger(raw.progress))return;
    const progress=Math.max(0,Math.min(4,raw.progress));
    state.progress=progress;
    const saved=raw.definitions||{};
    if(progress>=3){
      try{
        const recipe=saved.P?.recipe||W.canonicalP();
        if(!W.isTarget(2,recipe,{}))throw Error("invalid saved P");
        state.definitions.P={name:W.validateName(saved.P?.name)||"P",recipe:[...recipe]};
      }catch(_){state.definitions.P={name:"P",recipe:W.canonicalP()};}
    }
    if(progress>=3 && Array.isArray(raw.custom)){
      for(const item of raw.custom.slice(0,6)){
        if(!item || !/^C[1-6]$/.test(item.id)||!W.validateName(item.name)||!Array.isArray(item.recipe))continue;
        if(state.custom.some(x=>x.id===item.id)||safeName(item.name,item.id).error)continue;
        try{
          const lib=definitions();
          W.flatten(item.recipe,lib,96);
          if(item.recipe.length<1)continue;
          state.custom.push({id:item.id,name:item.name,recipe:[...item.recipe]});
        }catch(_){/* bad persisted macro ignored */}
      }
    }
    // Restore custom tools first: a discovered S may use a custom recipe made earlier.
    if(progress>=4){
      try{
        const recipe=saved.S?.recipe||W.canonicalS();
        if(!W.isTarget(3,recipe,definitions()))throw Error("invalid saved S");
        state.definitions.S={name:W.validateName(saved.S?.name)||"S",recipe:[...recipe]};
      }catch(_){state.definitions.S={name:"S",recipe:W.canonicalS()};}
    }
    state.nextCustom=1+state.custom.reduce((m,x)=>Math.max(m,Number(x.id.slice(1))||0),0);
  }
  function createSession(initial,scrambleWord=[]){
    return {initial:[...initial],board:[...initial],history:[],won:false,
      draft:null,abandoned:false,scrambleWord:[...scrambleWord]};
  }
  function newLesson(level){
    state.level=level;
    state.sessions.learn=createSession(W.SEEDS[level]);
    state.reveal=null;state.feedback="";
    el("operationName").value=level===2?"P":level===3?"S":"L";
  }
  function newFree(){
    const n=Number(el("difficulty").value)||5;
    state.freeDifficulty=n;
    const word=W.scramble(n,state.progress>=2);
    state.sessions.free=createSession(M.word([...M.HOME],word),word);
    state.freeShowSolution=false;
  }
  function session(){return state.sessions[state.mode];}
  function abortPlayback(){
    epoch++;
    pending.length=0;
    if(cancelAnimation){const done=cancelAnimation;cancelAnimation=null;done();}
  }
  function restart(){
    abortPlayback();
    if(state.mode==="learn")newLesson(state.level);
    else {
      const s=state.sessions.free;
      state.sessions.free=createSession(s.initial,s.scrambleWord);
      state.freeShowSolution=false;
    }
    render();
  }
  function homeForPractice(){
    if(state.mode!=="free")return;
    abortPlayback();
    const s=createSession(M.HOME);
    s.abandoned=true;
    state.sessions.free=s;
    state.freeShowSolution=false;
    render();
  }
  function switchMode(mode){
    if(!["learn","free"].includes(mode)||mode===state.mode)return;
    abortPlayback();
    state.mode=mode;
    render();
  }
  function createDisk(tile){
    const group=document.createElementNS(svgNS,"g");
    group.setAttribute("class","disk");
    group.setAttribute("data-tile",tile);
    const shadow=document.createElementNS(svgNS,"circle");
    shadow.setAttribute("r","23");shadow.setAttribute("class","disk-shadow");
    const body=document.createElementNS(svgNS,"circle");
    body.setAttribute("r","23");body.setAttribute("class","disk-body");
    group.style.setProperty("--tile",COLORS[tile-1]);
    const glint=document.createElementNS(svgNS,"path");
    glint.setAttribute("d","M-15 -9 A17 17 0 0 1 8 -16");
    glint.setAttribute("class","disk-glint");
    const number=document.createElementNS(svgNS,"text");
    number.setAttribute("y","1");number.textContent=String(tile);
    group.append(shadow,body,glint,number);
    el("diskLayer").appendChild(group);
    diskNodes.set(tile,group);
  }
  function putTile(tile,x,y){
    diskNodes.get(tile).setAttribute("transform", "translate("+x.toFixed(2)+" "+y.toFixed(2)+")");
  }
  function drawBoard(board=session().board){
    board.forEach((tile,pos)=>putTile(tile,POINTS[pos].x,POINTS[pos].y));
    const highlight=state.mode==="learn"&&state.level===3&&session().won?[1,3]:[];
    diskNodes.forEach((node,tile)=>node.classList.toggle("highlighted",highlight.includes(tile)));
  }
  function animate(before,after,code,duration){
    if((reduced&&reduced.matches)||typeof requestAnimationFrame!=="function"){
      after.forEach((tile,pos)=>putTile(tile,POINTS[pos].x,POINTS[pos].y));
      return Promise.resolve();
    }
    const starts=new Map(before.map((tile,index)=>[tile,index]));
    const ends=new Map(after.map((tile,index)=>[tile,index]));
    return new Promise(resolve=>{
      let frame=0,started=null,finished=false;
      function finish(){
        if(finished)return;
        finished=true;
        if(frame)cancelAnimationFrame(frame);
        if(cancelAnimation===finish)cancelAnimation=null;
        resolve();
      }
      cancelAnimation=finish;
      function tick(time){
        if(finished)return;
        if(started===null)started=time;
        const amount=Math.min(1,Math.max(0,(time-started)/duration));
        const eased=amount*amount*(3-2*amount);
        for(const tile of M.HOME){
          const fi=starts.get(tile), ti=ends.get(tile), a=POINTS[fi],b=POINTS[ti];
          let x=a.x+(b.x-a.x)*eased,y=a.y+(b.y-a.y)*eased;
          if(code==="T"&&fi<4){
            x=200+(a.x-200)*Math.cos(Math.PI*eased);
            y=103+(a.x-200)*.65*Math.sin(Math.PI*eased);
          }else if(code==="R"&&fi===3)x+=29*Math.sin(Math.PI*eased);
          else if(code==="R"&&fi===7)x-=29*Math.sin(Math.PI*eased);
          else if(code==="L"&&fi===4)x+=29*Math.sin(Math.PI*eased);
          else if(code==="L"&&fi===0)x-=29*Math.sin(Math.PI*eased);
          putTile(tile,x,y);
        }
        if(amount<1)frame=requestAnimationFrame(tick);else finish();
      }
      frame=requestAnimationFrame(tick);
    });
  }
  function askAction(id){
    if(!available(id)||(state.mode==="learn"&&session().won))return;
    if(pending.length>=30)return;
    pending.push({kind:"apply",id,mode:state.mode,level:state.level});
    drain();
  }
  function undo(){
    if(!session().history.length && !pending.length)return;
    pending.push({kind:"undo",mode:state.mode,level:state.level});
    drain();
  }
  async function drain(){
    if(moving)return;
    moving=true;
    const ownEpoch=epoch;
    try{
      while(pending.length&&epoch===ownEpoch){
        const action=pending.shift();
        if(action.mode!==state.mode||action.level!==state.level&&action.mode==="learn")continue;
        const s=session();
        const initialBoard=[...s.board];
        let codes=[];
        let removed=null;
        if(action.kind==="undo"){
          removed=s.history[s.history.length-1];
          if(!removed)continue;
          codes=W.inversePrimitives(removed.codes);
          s.won=false;s.draft=null;
        }else{
          if(s.won)continue;
          try{codes=W.flatten([action.id],definitions());}
          catch(_){state.feedback=t("unknownTool");continue;}
        }
        const duration=codes.length>1?Math.max(85,Math.min(145,1900/codes.length)):230;
        for(const code of codes){
          const before=[...s.board],after=M.move(before,code);
          await animate(before,after,code,duration);
          if(epoch!==ownEpoch)break;
          s.board=after;
          drawBoard(s.board);
        }
        if(epoch!==ownEpoch){s.board=[...initialBoard];break;}
        if(action.kind==="undo"){
          s.history.pop();
        }else{
          s.history.push({id:action.id,codes:[...codes]});
          if(state.mode==="learn"&&!s.won && s.history.length &&
              W.equal(s.board,W.TARGETS[state.level])){
            s.won=true;
            s.draft=s.history.map(e=>e.id);
            state.feedback=t("lessonDone");
            if(state.level===2)el("operationName").value="P";
            if(state.level===3)el("operationName").value="S";
          }
        }
        render();
      }
    }finally{
      moving=false;
      render();
      if(pending.length)drain();
    }
  }
  function makeButton(id){
    const button=document.createElement("button");
    button.type="button";button.className="tool-button";
    button.dataset.kind=id;
    const macro=!(id==="R"||id==="T"||id==="L");
    button.dataset.macro=String(macro);
    const symbol=document.createElement("span");
    symbol.className="tool-icon";symbol.setAttribute("aria-hidden","true");
    symbol.textContent=id==="R"?"↷":id==="T"?"⤾":id==="L"?"↶":"◇";
    const label=document.createElement("span");
    label.className="tool-name";label.textContent=toolName(id);
    const detail=document.createElement("span");
    detail.className="tool-description";
    detail.textContent=id==="R"?"R":id==="T"?"T · 180°":id==="L"?"L":
      labelWord(definitions()[id].recipe);
    button.append(symbol,label,detail);
    button.title=id==="R"?t("toolR"):id==="T"?t("toolT"):id==="L"?t("toolL"):
      t("toolMacro")+": "+detail.textContent;
    button.setAttribute("aria-label",button.title+", "+toolName(id));
    button.addEventListener("click",()=>askAction(id));
    return button;
  }
  function renderPalette(){
    const ids=allOperations();
    const key=JSON.stringify({ids,names:ids.map(toolName),lang:state.lang});
    if(key!==lastPalette){
      const buttons=ids.map(makeButton);
      el("toolButtons").replaceChildren(...buttons);
      lastPalette=key;
    }
    const frozen=state.mode==="learn"&&session().won;
    [...el("toolButtons").children].forEach(button=>button.disabled=frozen);
    text("paletteCount",ids.length+" "+t("movesShort"));
  }
  function renderLibrary(){
    const container=el("libraryItems");container.replaceChildren();
    const pairs=[["R",t("toolR")],["T",t("toolT")]];
    if(state.progress>=1)pairs.push(["T⁻¹",t("notesT")]);
    if(state.progress>=2)pairs.push(["L",t("notesL")]);
    if(state.progress>=3)pairs.push([toolName("P"),labelWord(definitions().P.recipe)]);
    if(state.progress>=4)pairs.push([toolName("S"),labelWord(definitions().S.recipe)]);
    for(const c of state.custom)pairs.push([c.name,labelWord(c.recipe)]);
    for(const [name,recipe] of pairs){
      const row=document.createElement("div");row.className="library-item";
      const label=document.createElement("span");label.className="name";label.textContent=name;
      const value=document.createElement("span");value.className="recipe";value.textContent=recipe;
      row.append(label,value);container.appendChild(row);
    }
  }
  function renderHistory(){
    const s=session(),log=el("moveHistory");
    log.replaceChildren();
    if(!s.history.length){
      const e=document.createElement("span");e.className="history-empty";e.textContent=t("emptyHistory");log.appendChild(e);
      return;
    }
    const overflow=s.history.length-22;
    if(overflow>0){
      const note=document.createElement("span");note.className="history-overflow";
      note.textContent="…"+overflow+" "+t("moreHistory");log.appendChild(note);
    }
    for(const item of s.history.slice(-22)){
      const chip=document.createElement("span");chip.className="history-chip";
      chip.textContent=toolName(item.id);chip.title=labelWord(item.codes);
      log.appendChild(chip);
    }
  }
  function renderLesson(){
    const level=state.level,s=state.sessions.learn;
    text("stepIndicator",(level+1)+" / 4");
    text("challengeTitle",t("lesson"+level+"Title"));
    text("challengeDescription",t("lesson"+level+"Desc"));
    text("targetArray",W.TARGETS[level].join(" "));
    el("challengeReveal").hidden=!state.reveal;
    if(state.reveal)text("challengeReveal",t("lesson"+level+(state.reveal==="hint"?"Hint":"Explain")));
    text("experimentResult",s.won?t("lessonDone"):state.feedback);
    el("unlockPanel").hidden=!s.won;
    if(s.won){
      const isNew=level>=state.progress;
      text("unlockText",isNew?t(["addT","addL","addP","addS"][level]):t("completed"));
      el("nameRow").hidden=!isNew||level<2;
      el("forgeBtn").hidden=!isNew;
      text("forgeBtn",level===0?t("nextTool"):t("forge"));
    }
    el("prevBtn").disabled=level===0;
    el("nextBtn").disabled=level===3||level>=state.progress;
    [...el("stepDots").children].forEach((dot,i)=>dot.classList.toggle("active",i===level));
  }
  function routeForCurrentFree(){
    const s=state.sessions.free;
    let path=s.abandoned?[]:[...s.scrambleWord];
    for(const item of s.history)path=path.concat(item.codes);
    return W.visibleInverse(path,state.progress>=2);
  }
  function renderFree(){
    const s=state.sessions.free;
    const done=M.isHome(s.board);
    text("freeResult",s.abandoned?t("freePlaying"):done?t("freeSolved"):t("freePlaying"));
    el("freeSolution").hidden=!state.freeShowSolution;
    if(state.freeShowSolution){
      const word=routeForCurrentFree();
      text("freeSolution",t("freeRoute")+"\n"+(word.length?labelWord(word):"e")+"\n"+t("freeRouteNote"));
    }
  }
  function renderInfo(){
    const s=session();
    text("boardStatus",M.isHome(s.board)?t("aligned"):M.isCyclicOrder(s.board)?t("rotated"):t("mixed"));
    text("moveCounter",s.history.length+" "+t("moveCount"));
    el("undoBtn").disabled=!s.history.length&&!pending.length;
    el("scrambleBtn").hidden=state.mode!=="free";
    text("scrambleBtn",state.mode==="free"?"↺ "+t("home"):"");
    text("resetBtn",t("restart"));
    el("saveWorkbench").hidden=state.progress<3;
    el("ovalBoard").setAttribute("aria-label",t("boardAria")+" "+s.board.join(" "));
    text("boardArray",s.board.join(" "));
    const p=M.permutationOf(s.board);
    text("permMapping",p.join(" "));
    text("cycleOutput",M.cycleText(p));
    text("orderOutput",String(M.orderOf(p)));
    renderHistory();
  }
  function render(){
    el("modeLearn").setAttribute("aria-pressed",String(state.mode==="learn"));
    el("modeFree").setAttribute("aria-pressed",String(state.mode==="free"));
    el("lessonPanel").hidden=state.mode!=="learn";
    el("freePanel").hidden=state.mode!=="free";
    renderInfo();renderPalette();renderLibrary();
    if(state.mode==="learn")renderLesson();
    else renderFree();
    drawBoard();
  }
  function saveCompletion(){
    if(state.mode!=="learn")return;
    const s=state.sessions.learn,level=state.level;
    if(!s.won||!s.draft || level!==state.progress)return;
    if(level===2||level===3){
      const id=level===2?"P":"S";
      const check=safeName(el("operationName").value,id);
      if(check.error){state.feedback=t(check.error);text("experimentResult",state.feedback);return;}
      try{
        const recipe=[...s.draft];
        const lib=definitions();
        if(!W.isTarget(level,recipe,lib))throw Error("Incorrect constructed operation");
        const entry={name:check.name,recipe};
        state.definitions[id]=entry;
      }catch(_){state.feedback=t("unknownTool");text("experimentResult",state.feedback);return;}
    }
    state.progress=level+1;
    storageWrite();
    state.feedback=t("buildDone")+(level===0?"T⁻¹ = T":level===1?"L":toolName(level===2?"P":"S"));
    lastPalette="";
    if(level===0)newLesson(1); // The first observation needs no separate tool button.
    render();
  }
  function saveCustom(){
    const s=session();
    const feedback=message=>{text("customFeedback",t(message));};
    if(state.progress<3)return;
    if(state.custom.length>=6){feedback("customLimit");return;}
    if(!s.history.length){feedback("customEmpty");return;}
    const parsed=safeName(el("customName").value,null);
    if(parsed.error){feedback(parsed.error);return;}
    const recipe=s.history.map(e=>e.id);
    try{W.flatten(recipe,definitions(),96);}
    catch(_){feedback("customTooLong");return;}
    let next=1;
    while(state.custom.some(item=>item.id==="C"+next))next++;
    const item={id:"C"+next,name:parsed.name,recipe};
    state.custom.push(item);
    storageWrite();lastPalette="";
    text("customFeedback",t("customSaved")+item.name);
    el("customName").value="";
    render();
  }
  function setLanguage(lang,push=false){
    if(lang!=="en"&&lang!=="mn")return;
    state.lang=lang;
    document.documentElement.lang=lang;
    document.title=t("title")+" · Sol";
    document.querySelectorAll("[data-i18n]").forEach(node=>{
      node.textContent=t(node.dataset.i18n);
      if(node.tagName.toLowerCase()==="summary" && node.closest?.("#mathPanel")){
        const icon=document.createElement("span");icon.className="summary-icon";
        icon.setAttribute("aria-hidden","true");icon.textContent="⌄";node.appendChild(icon);
      }
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(node=>node.setAttribute("aria-label",t(node.dataset.i18nAria)));
    document.querySelectorAll("[data-lang]").forEach(btn=>btn.setAttribute("aria-pressed",String(btn.dataset.lang===lang)));
    try{localStorage.setItem("sol-language",lang);}catch(_){/* optional */}
    if(push){
      try{const u=new URL(location.href);u.searchParams.set("lang",lang);history.replaceState(null,"",u);}catch(_){/* optional */}
    }
    lastPalette="";render();
  }
  function startLanguage(){
    let q=null;
    try{q=new URLSearchParams(location.search).get("lang");}catch(_){/* optional */}
    if(q==="mn"||q==="en")return q;
    try{const saved=localStorage.getItem("sol-language");if(saved==="mn"||saved==="en")return saved;}catch(_){}
    return "mn";
  }
  function resetAllProgress(){
    if(typeof window.confirm==="function"&&!window.confirm(t("resetProgressConfirm")))return;
    abortPlayback();state.progress=0;state.definitions={};state.custom=[];
    state.reveal=null;state.feedback="";state.freeShowSolution=false;
    newLesson(0);newFree();lastPalette="";storageWrite();render();
  }
  M.HOME.forEach(createDisk);
  loadProgress();
  newLesson(Math.min(3,state.progress));
  newFree();
  setLanguage(startLanguage());
  el("modeLearn").addEventListener("click",()=>switchMode("learn"));
  el("modeFree").addEventListener("click",()=>switchMode("free"));
  el("undoBtn").addEventListener("click",undo);
  el("resetBtn").addEventListener("click",restart);
  el("scrambleBtn").addEventListener("click",homeForPractice);
  el("newScramble").addEventListener("click",()=>{abortPlayback();newFree();render();});
  el("difficulty").addEventListener("change",()=>{state.freeDifficulty=Number(el("difficulty").value);});
  el("prevBtn").addEventListener("click",()=>{
    if(state.level===0)return;abortPlayback();newLesson(state.level-1);render();
  });
  el("nextBtn").addEventListener("click",()=>{
    if(state.level>=state.progress||state.level>=3)return;
    abortPlayback();newLesson(state.level+1);render();
  });
  el("hintBtn").addEventListener("click",()=>{
    state.reveal=state.reveal==="hint"?null:"hint";renderLesson();
  });
  el("answerBtn").addEventListener("click",()=>{
    state.reveal=state.reveal==="explain"?null:"explain";renderLesson();
  });
  el("forgeBtn").addEventListener("click",saveCompletion);
  el("saveCustom").addEventListener("click",saveCustom);
  el("resetProgress").addEventListener("click",resetAllProgress);
  el("freeHint").addEventListener("click",()=>{
    state.freeShowSolution=!state.freeShowSolution;renderFree();
  });
  document.querySelectorAll("[data-lang]").forEach(btn=>
    btn.addEventListener("click",()=>setLanguage(btn.dataset.lang,true)));
  document.addEventListener("keydown",event=>{
    if(event.altKey||event.ctrlKey||event.metaKey||
      /^(INPUT|TEXTAREA|SELECT|BUTTON|SUMMARY)$/.test(document.activeElement?.tagName||""))return;
    if(event.key==="ArrowRight"){event.preventDefault();askAction("R");}
    else if(event.key==="ArrowLeft"&&available("L")){event.preventDefault();askAction("L");}
    else if(event.key.toLowerCase()==="f"){event.preventDefault();askAction("T");}
    else if(event.key.toLowerCase()==="z"){event.preventDefault();undo();}
  });

})();
