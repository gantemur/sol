// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Tsogtgerel Gantumur
(function(root,factory){
  const api=factory();
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  else root.OvalFamilyText=api;
})(globalThis,()=>{
"use strict";
const STRINGS={
mn:{
 familyName:"Зууван зам",language:"Хэл сонгох",oldWorkshop:"Өмнөх 8:4 хувилбар",
 category:"Математикийн тоглоом",heading:"Зууван зам",
 intro:"Цөөн хөдөлгөөнөөс олон сэлгэлт бүтээ. Жижиг тоглоомоос эхэлж, ямар байрлалууд боломжтойг ол.",
 journeyEyebrow:"Алхам алхмаар",journeyTitle:"Эхлэх тоглоомууд",journeyNote:"3:2 → 4:2 → 4:3 → 5:2",
 caseLabel:"Тоглоом сонгох",case32:"6 сэлгэлт",case42:"24 боломж",case43:"8 хүрч болно",case52:"Ерөнхийлөх",
 exploreVariant:"Бүх n:k хувилбарыг судлах",nLabel:"Дугуйн тоо n",kLabel:"Эргүүлгийн хэмжээ k",openVariant:"Сонгох",
 exploreNote:"3 ≤ n ≤ 8, 2 ≤ k ≤ 4. Эхний дөрөвт удирдамжтай дасгал бий; бусад хувилбарыг чөлөөтэй судал.",
 reachable:"Хүрч болох байрлал",playTitle:"Тоглох талбар",atHome:"Эх байдал",mixed:"Байрлал өөрчлөгдсөн",
 trackNote:"Байрлалууд 1→2→…→n чиглэлд зам дагана. Өнгөөр ялгасан k байрлалыг T урвуулна.",
 moveControls:"Хөдөлгөөнүүд",moveR:"Нэг алхам баруун",moveT:"k байрлалыг урвуулах",moveL:"Нэг алхам зүүн",
 savedOperations:"Хадгалсан үйлдлүүд",undo:"↶ Буцаах",resetBoard:"↺ Эхлэх",history:"Хөдөлгөөнүүд",
 emptyHistory:"Хөдөлгөөн хийгээгүй",operationCount:"товч",primitiveCount:"энгийн алхам",
 modeLabel:"Тоглох горим",build:"Бүтээх",free:"Чөлөөт тоглолт",lessonEyebrow:"Нээлтийн дасгал",lessonHeading:"Үйлдэл бүтээх",
 target:"Зорилго (замын дагуу)",predictQuestion:"Энэ сэлгэлт боломжтой юу?",possible:"Боломжтой",impossible:"Боломжгүй",
 check:"Бүтээсэн үйлдлээ шалгах",checkEmpty:"Эхлээд үйлдэл хийнэ үү.",checkWrong:"Энэ оролдлого зорилгод нийцэхгүй байна. Үргэлжлүүлж эсвэл дахин эхлээрэй.",
 checkPick:"Эхлээд боломжтой эсэхийг сонго.",checkCorrect:"Зөв! Одоо нээлтээ баталгаажуулаарай.",
 checkCorrectPrediction:"Зөв таамаглалаа! Учрыг нь дүрслэлээс хараарай.",
 confirm:"Нээлтээ баталж үргэлжлүүлэх",
 originalRecipe:"Чиний дараалал:",shortRecipe:"Нэг богино хувилбар:",useShort:"Богино хувилбарыг хадгалах",
 toolName:"Үйлдлийн нэр",saveTool:"Хадгалах",saved:"Үйлдэл хадгалагдлаа:",
 nameInvalid:"1–12 үсэг, тоо, _ эсвэл - оруул.",nameTaken:"Энэ нэр аль хэдийн бий.",
 hint:"Сэжүүр",explain:"Тайлбар",prev:"← Өмнөх",next:"Дараах →",
 complete:"Энэ бүлгийн дасгалуудыг хийлээ.",nextCase:"Дараагийн тоглоом руу ор.",
 noLessonTitle:"Энэ хувилбарын нээлтийн дасгал дараа нэмэгдэнэ",noLessonDesc:"Одоохондоо зам, олон өнцөгт, графыг өөрчилж ажиглах эсвэл чөлөөтэй тоглоорой.",
 freeEyebrow:"Өөрөө бодоорой",freeTitle:"Эх байдлыг сэргээ",freeDescription:"Дугуйг хууль ёсны хөдөлгөөнөөр хольж, эх байрлалд нь буцаа.",
 scrambleSize:"Холих алхам",scramble:"Шинэ эвлүүлэг",freeSolved:"Бүх дугуй эхэндээ орлоо!",freeInProgress:"Дугуйнуудыг яг эх байрлалд нь буцаа.",
 showRoute:"Буцах нэг замыг үзэх",hideRoute:"Замыг нуух",solutionRoute:"Буцах дараалал:",nonoptimal:"Хамгийн богино байх албагүй.",
 toolbox:"Миний хэрэгслүүд",toolboxNote:"Хадгалсан үйлдлүүд аль хэдийн боломжтой хөдөлгөөнүүдийн товчлол юм.",
 learnedL:"L = Rⁿ⁻¹ (нэг зүүн алхам)",toolR:"Замыг баруун тийш",toolT:"k байрлалын урвуу",toolL:"Замыг зүүн тийш",
 seeMath:"Математик дүрслэл",mapsTitle:"Дүрслэлүүд",viewTabs:"Математик дүрслэл сонгох",
 cayley:"Кэлигийн граф",polygon:"Олон өнцөгт",swapGraph:"Солих граф",
 viewCayley:"R ба T-ийн ирмэгүүдээр бүх байрлалыг холбосон төлөвийн граф. Тод цэг нь одоогийн байрлал.",
 viewCayleyDisconnected:"Бүх 24 байрлал гурван тусдаа 8 цэгтэй хэсэгт хуваагдана. Эхлэлээс зөвхөн нэг хэсэгт хүрнэ.",
 viewCayleyLarge:"Энэ хувилбарын Кэлигийн граф хэт том тул бүх цэгийг дэлгэсэнгүй. Жижиг 3:2, 4:2, 4:3 тоглоомд бүтнээр нь үзээрэй.",
 viewPolygon:"Саарал хүрээ бол байрлалын тогтмол n-өнцөгт. Өнгөт шугамууд анх хөрш байсан дугуйг холбодог; дотогш татсан шугам нь хажуу хөршийн харьцаа алдагдсаныг харуулна.",
 viewSwaps:"Зураас бүр тухайн хоёр байрлалыг дангаар нь сольж чадахыг илэрхийлнэ. Энэ нь Кэлигийн граф биш: цэгүүд нь байрлалууд.",
 graphClicked:"Сонгосон байрлал:",graphReachable:"Эхлэлээс хүрч болно.",graphUnreachable:"Эхлэлээс хүрч болохгүй.",
 graphStep:"R: сумтай ирмэг · T: эргэх ирмэг",
 originalSides:"Анхны хөрш холбоос хадгалагдсан:",shapeRotation:"Эргэлтийн тэгш хэм",shapeReflection:"Тольдолтын тэгш хэм",shapeBroken:"Хатуу олон өнцөгтийн тэгш хэм биш",
 swapCount:"Дангаар сольж болох хос:",swapAll:"Энд бүх хосыг сольж болно.",swapNone:"Энд ганцхан хосыг дангаар сольж болохгүй.",
 impossibleExample:"Боломжгүй байрлалыг үзэх",moreMath:"Сэлгэлтийг дэлгэрэнгүй үзэх",
 currentBoard:"Дугуйнуудын байрлал",cycleNotation:"Циклүүд",generators:"Үндсэн үйлдлүүд",
 notation:"Хөдөлгөөний үгсийг зүүнээс баруун тийш дарааллаар уншина. Байрлал бүр тогтмол, дугуйнууд шилжинэ.",
 classicBottom:"Өмнөх 8:4 хэрэгсэл",
 caseIntro32:"Гурван дугуй, хоёр байрлал урвуулах хэсэг. Зургаан сэлгэлтийг бүгдийг нь Кэлигийн граф дээр харж болно.",
 caseIntro42:"Дөрвөн дугуй, хөрш хоёрыг солих боломжтой. Бүх 24 байрлал холбогдоно.",
 caseIntro43:"Мөн дөрвөн дугуй, харин T=(1 3). Зөвхөн 8 байрлал хүрч болно; бусад 16 нь тусдаа хэсгүүдэд байна.",
 caseIntro52:"Таван дугуйн хөрш солих үйлдэл. Өмнөх дүгнэлт ерөнхий n-д хүчинтэй юу?",
 caseIntroOther:"Энэ n:k хувилбарт T нь эхний k байрлалыг урвуулна. Эргүүлэх, урвуулах хөдөлгөөнөөр бүлгийг судлаарай.",
 progress:"Ахиц энэ төхөөрөмжид хадгалагдана.",lessonDone:"Бүтээж шалгасан",viewNotReady:"Энэ дүрслэл одоогоор харагдахгүй.",
 routeImpossible:"Энэ байрлалд хүрэх хууль ёсны дараалал алга."
},
en:{
 familyName:"Oval track",language:"Choose language",oldWorkshop:"Previous 8:4 workshop",
 category:"Mathematical puzzle",heading:"Oval track",
 intro:"Build many permutations from a few simple moves. Start with small puzzles, then discover which arrangements are possible.",
 journeyEyebrow:"Step by step",journeyTitle:"First puzzles",journeyNote:"3:2 → 4:2 → 4:3 → 5:2",
 caseLabel:"Choose puzzle",case32:"Six states",case42:"All 24",case43:"Only eight",case52:"Generalize",
 exploreVariant:"Explore every n:k variant",nLabel:"Number of disks n",kLabel:"Turntable size k",openVariant:"Open",
 exploreNote:"3 ≤ n ≤ 8, 2 ≤ k ≤ 4. The first four cases have guided experiments; the others are free to explore.",
 reachable:"Reachable arrangements",playTitle:"Puzzle board",atHome:"At home",mixed:"Rearranged",
 trackNote:"Positions follow the oval 1→2→…→n. T reverses the k highlighted positions.",
 moveControls:"Moves",moveR:"One step clockwise",moveT:"Reverse k positions",moveL:"One step anticlockwise",
 savedOperations:"Saved operations",undo:"↶ Undo",resetBoard:"↺ Restart",history:"Move history",
 emptyHistory:"No moves yet",operationCount:"buttons",primitiveCount:"basic steps",
 modeLabel:"Play mode",build:"Construct",free:"Free play",lessonEyebrow:"Discover",lessonHeading:"Build operations",
 target:"Target (track order)",predictQuestion:"Is this arrangement reachable?",possible:"Possible",impossible:"Impossible",
 check:"Check my construction",checkEmpty:"Make at least one move before checking.",
 checkWrong:"Not yet. Continue your word or restart and try again.",checkPick:"Choose possible or impossible first.",
 checkCorrect:"Correct! Confirm your discovery to continue.",checkCorrectPrediction:"Correct prediction! The diagrams explain why.",
 confirm:"Confirm and continue",
 originalRecipe:"Your sequence:",shortRecipe:"One shorter equivalent:",useShort:"Save the shorter version",
 toolName:"Operation name",saveTool:"Save",saved:"Saved operation:",
 nameInvalid:"Use 1–12 letters, numbers, _ or -.",nameTaken:"This name is already used.",
 hint:"Hint",explain:"Explanation",prev:"← Previous",next:"Next →",
 complete:"You have completed this case.",nextCase:"Try the next puzzle.",
 noLessonTitle:"More guided challenges will be added here",noLessonDesc:"For now, explore the track, polygon and graph, or open Free play.",
 freeEyebrow:"Solve freely",freeTitle:"Restore the track",freeDescription:"The disks were scrambled by legal moves. Return them to their exact home positions.",
 scrambleSize:"Scramble length",scramble:"New scramble",freeSolved:"Solved! Every disk is at home.",freeInProgress:"Restore every disk to its precise starting position.",
 showRoute:"Show one route back",hideRoute:"Hide route",solutionRoute:"One route back:",nonoptimal:"Not necessarily a shortest route.",
 toolbox:"My operations",toolboxNote:"Named moves are shortcuts for operations already possible from R and T.",
 learnedL:"L = Rⁿ⁻¹ (one left step)",toolR:"Rotate clockwise",toolT:"Reverse k positions",toolL:"Rotate anticlockwise",
 seeMath:"Mathematical views",mapsTitle:"Visualizations",viewTabs:"Select mathematical view",
 cayley:"Cayley graph",polygon:"Regular polygon",swapGraph:"Swap graph",
 viewCayley:"Each dot is an arrangement; R and T edges link states reachable by one move. The bright dot is your current state.",
 viewCayleyDisconnected:"All 24 arrangements form three disconnected eight-state islands. Only the home island is reachable.",
 viewCayleyLarge:"This Cayley graph is too large to display clearly here. Open 3:2, 4:2 or 4:3 to inspect all its vertices.",
 viewPolygon:"The pale outline is the fixed regular polygon of positions. Colored lines join disks that were original neighbors; chords show which neighbor relationships no longer lie on the perimeter.",
 viewSwaps:"Each edge joins two positions that can be exchanged without moving any other disks. This is not a Cayley graph: its vertices are positions.",
 graphClicked:"Selected arrangement:",graphReachable:"Reachable from home.",graphUnreachable:"Not reachable from home.",
 graphStep:"R: directed edges · T: reversible edges",
 originalSides:"Original neighbor links preserved:",shapeRotation:"Rotational symmetry",shapeReflection:"Reflection symmetry",shapeBroken:"Not a rigid symmetry of the polygon",
 swapCount:"Pairs that can be swapped alone:",swapAll:"Every pair can be swapped.",swapNone:"No isolated two-position swap is possible.",
 impossibleExample:"Show an unreachable arrangement",moreMath:"Show permutation details",
 currentBoard:"Disks at positions",cycleNotation:"Cycle notation",generators:"Basic moves",
 notation:"Move words run chronologically from left to right. The positions are fixed while disks move.",
 classicBottom:"Previous 8:4 workshop",
 caseIntro32:"Three disks and a two-slot turntable. All six permutations can be followed on a Cayley graph.",
 caseIntro42:"Four disks with an adjacent swap. All 24 configurations belong to one connected component.",
 caseIntro43:"Four disks again, but now T=(1 3). Only eight configurations are reachable; the other 16 lie in separate components.",
 caseIntro52:"Five disks and an adjacent swap. Can you extend the argument to arbitrary n?",
 caseIntroOther:"T reverses the first k positions of this n:k puzzle. Explore the generated group using rotation and reversal.",
 progress:"Progress stays on this device.",lessonDone:"Constructed and checked",viewNotReady:"This view is not available here.",
 routeImpossible:"There is no legal sequence to this arrangement."
}
};
const LESSONS={
 "3:2":[
 {id:"inverse-t",type:"word",target:[2,1,3],reward:"t",
  mn:{title:"1. T-ийн урвуу",description:"Эх байрлалаас T-ийн урвуу үйлдлийг бүтээ. Хийсэн үйлдлээ бэлэн гэж үзвэл шалгаарай.",hint:"T-г хоёр удаа хийвэл яах вэ?",explain:"T²=e тул T⁻¹=T. Ижил T товчоо дахин ашиглана."},
  en:{title:"1. Invert T",description:"Starting at home, build an operation that undoes T. When you think it is ready, check it.",hint:"What happens if you perform T twice?",explain:"T²=e, so T⁻¹=T. The same T button is its own inverse."}},
 {id:"inverse-r",type:"word",target:[2,3,1],reward:"L",
  mn:{title:"2. R-ийн урвуу",description:"Одоогоор зүүн эргүүлэх товч алга. R-ийн урвууг T ба R ашиглан бүтээгээд шалга. Нээвэл L нэг алхмаар зүүн эргэнэ.",hint:"R-г гурван удаа хийхэд эх байрлалд ирнэ. Тэгвэл урвуу нь?",explain:"R³=e, тэгэхээр R⁻¹=R². Шинэ L товч хоёр R-г нэг зүүн хөдөлгөөнөөр орлоно."},
  en:{title:"2. Invert R",description:"There is no left button yet. Build R's inverse using R and T, then check. The earned L button will move one step left.",hint:"Three R moves return everything home. How do you undo a single R?",explain:"R³=e, so R⁻¹=R². The new L button performs one direct left rotation."}},
 {id:"conjugate",type:"word",target:[3,2,1],reward:"save",defaultName:"U",
  mn:{title:"3. Солих үйлдлийг шилжүүлэх",description:"T нь 1 ба 2-ыг сольдог. Одоо зөвхөн 1 ба 3-ыг сольж, 2-ыг байранд нь үлдээ.",hint:"R, T, L-ийг дараалан туршаад, эхэндээ буцаж очдог эргэлтийг ажигла.",explain:"RTL=(1 3). Эргэлтээр T-ийн үйлчлэх байрлалыг сольсон нь конъюгацийн анхны жишээ."},
  en:{title:"3. Move the swap",description:"T swaps positions 1 and 2. Now exchange only 1 and 3, keeping position 2 fixed.",hint:"Try R, T, then L. Think of moving T's position along the track.",explain:"RTL=(1 3). Rotating, swapping, and rotating back moves the location of an operation: conjugation."}}
 ],
 "4:2":[
 {id:"shift-swap",type:"word",target:[1,3,2,4],reward:"save",defaultName:"U",
  mn:{title:"1. Хөрш солилтыг шилжүүлэх",description:"T нь 1 ба 2-ыг солино. Одоо зөвхөн 2 ба 3-ыг солих үйлдэл бүтээ.",hint:"L T R дарааллыг бодоорой. L хараахан нээгдээгүй бол R³ ашиглаж болно.",explain:"LTR=(2 3). Хөрш солилтыг замын дагуу өөр байрлалд шилжүүллээ."},
  en:{title:"1. Shift an adjacent swap",description:"T exchanges positions 1 and 2. Construct a move exchanging only 2 and 3.",hint:"Try L T R. Before L is known, use R³ in its place.",explain:"LTR=(2 3). You can transport a neighboring swap to another pair."}},
 {id:"distant-swap",type:"word",target:[3,2,1,4],reward:"save",defaultName:"V",
  mn:{title:"2. Хөрш биш хоёр байрлал",description:"Зөвхөн 1 ба 3-ыг соль. Хөрш солилтыг хэд хэд дараалуулбал боломжтой юу?",hint:"(1 2), (2 3), (1 2) гэсэн гурван солилтыг дараал.",explain:"(1 2)(2 3)(1 2)=(1 3). Хөршүүдийг солих чадвараас дурын сэлгэлт үүснэ."},
  en:{title:"2. Exchange non-neighbors",description:"Swap only positions 1 and 3. Can a sequence of adjacent swaps do this?",hint:"Perform the swaps (1 2), (2 3), (1 2) in that order.",explain:"(1 2)(2 3)(1 2)=(1 3). A connected network of pair swaps generates every permutation."}}
 ],
 "4:3":[
 {id:"other-diagonal",type:"word",target:[1,4,3,2],reward:"save",defaultName:"D",
  mn:{title:"1. Нөгөө диагональ",description:"T нь (1 3). Зөвхөн (2 4)-ийг сольж чадах уу?",hint:"Замыг нэг алхам шилжүүлээд T хийж, эргүүлж буцаа.",explain:"LTR=(2 4). Хоёр диагоналийн солилт боломжтой."},
  en:{title:"1. The other diagonal",description:"T exchanges positions 1 and 3. Can you exchange 2 and 4?",hint:"Rotate the track, flip, and rotate back.",explain:"LTR=(2 4). Both diagonal transpositions are possible."}},
 {id:"impossible-neighbor",type:"predict",target:[2,1,3,4],answer:"no",
  mn:{title:"2. Боломжгүй сэлгэлт",description:"Зөвхөн 1 ба 2-ыг сольж болох уу? Кэлигийн графын гурван тусдаа хэсгийг ажиглан таамаг дэвшүүл.",hint:"T зөвхөн нэг диагоналийн хоёр үзүүрийг сольдог, R нь хоёр диагоналийг бүхлээр нь солих боломжтой.",explain:"(1 2) боломжгүй. Сондгой ба тэгш байрлалын хосууд бүхлээрээ хадгалагдана (эсвэл бүхлээр солигдоно). 24 байрлал гурван 8-тай хэсэгт хуваагдана."},
  en:{title:"2. An impossible permutation",description:"Can you exchange only positions 1 and 2? Inspect the three separate islands of the 24-state graph.",hint:"T swaps within one diagonal, while R exchanges the two diagonals as whole sets.",explain:"(1 2) is impossible. The partition into odd and even positions is preserved up to exchanging the entire classes. The 24 states form three islands of eight."}}
 ],
 "5:2":[
 {id:"all-reachable",type:"predict",target:[2,1,3,4,5],answer:"yes",
  mn:{title:"Ерөнхий зарчим",description:"Таван дугуйн ямар ч сэлгэлтийг R ба T-ээр бүтээж чадах уу? Хөрш солилтуудыг шилжүүлж болно гэдгийг сана.",hint:"R ашиглан T=(1 2)-ыг (2 3), (3 4), (4 5) болгож шилжүүл.",explain:"Хөрш солилтууд холбогдсон зам үүсгэдэг. Тэдгээрээр ямар ч дугуйг байрлалд нь зөөж болно. Иймээс R ба T нь S₅-ийг үүсгэнэ."},
  en:{title:"The general principle",description:"Can R and T build every permutation of five disks? Remember how adjacent swaps can be transported.",hint:"Use R to move T=(1 2) to (2 3), (3 4), and (4 5).",explain:"Adjacent swaps form a connected path. They can move every disk to its intended position, so R and T generate all of S₅."}}
 ]
};
const CASE_DESCRIPTIONS={mn:{"3:2":"caseIntro32","4:2":"caseIntro42","4:3":"caseIntro43","5:2":"caseIntro52"},en:{"3:2":"caseIntro32","4:2":"caseIntro42","4:3":"caseIntro43","5:2":"caseIntro52"}};
function text(lang,key){return (STRINGS[lang]||STRINGS.mn)[key]||STRINGS.mn[key]||key;}
function lessons(caseId){return LESSONS[caseId]||[];}
function lesson(caseId,index,lang){const l=lessons(caseId)[index];return l?{...l,...l[lang]}:null;}
return Object.freeze({STRINGS,LESSONS,CASE_DESCRIPTIONS,text,lessons,lesson});
});
