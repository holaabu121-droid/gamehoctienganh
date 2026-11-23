import type { CommonRound } from "../skills-common/SkillsSection";

export type Unit4GameId = "suggestions" | "story_order" | "direction_match" | "map_navigator" | "route_builder" | "place_hunt" | "direction_spelling" | "places" | "is_there" | "profile" | "sound" | "rhythm" | "builder" | "rule_sorter" | "letter" | "compare" | "qa";
export type Unit4Source = {
  lesson_id: "unit4-phase1"; source_status: "user-provided-reference"; usage_scope: "personal-family"; source_note: string;
  unit: { number: 4; title: string; title_vi: string }; objectives: string[];
  getting_started: { title: string; dialogue: Array<{speaker:string;text:string}>; event_order:string[]; directions:string[]; map_places:string[] };
  closer_look_1: { places:string[]; adjectives:string[]; sound_words:Array<{word:string;sound:"/ɪ/"|"/iː/"}>; chant:string[] };
  closer_look_2: { comparatives:Array<{adjective:string;answer:string}>; letter_context:string; neighbourhoods:{urban:string;rural:string}; comparison_adjectives:string[] };
};
export type Unit4BuiltData = Unit4Source & { games: Record<Unit4GameId,CommonRound[]>; help: Record<Unit4GameId,{source_title:string;teaching_vi:string;steps:string[]}> };
type Status = CommonRound["source_status"];
const round=(id:string,status:Status,context:string,prompt:string,options:string[],answer:string,explanation_vi:string,extra:Partial<CommonRound>={}):CommonRound=>({id,source_status:status,context,prompt,options,answer,explanation_vi,...extra});
const ai="ai-generated" as const, ref="user-provided-reference" as const;

function buildGames(source:Unit4Source):Record<Unit4GameId,CommonRound[]>{
  const events=source.getting_started.event_order,dirs=source.getting_started.directions;
  const suggestions:[string,string,string,Status][]=[
    ["Let's go to Chua Cau.","Which sentence makes a suggestion?","Let's go to Chua Cau.",ref],
    ["Tan Ky House is nearer.","Suggest going there first.","Shall we go there first?",ref],
    ["Where shall we go first?","Which suggestion follows naturally?","Let's visit Chua Cau.",ref],
    ["The museum is open.","Make a suggestion.","Let's go to the museum.",ai],
    ["We can visit the square.","Choose the polite suggestion.","Shall we visit the square?",ai],
    ["The park is near here.","Suggest walking there.","Let's walk to the park.",ai],
    ["It is lunchtime.","Choose a suggestion.","Shall we find a café?",ai],
    ["The railway station is far.","Suggest taking a bus.","Let's take a bus.",ai],
    ["We have a map.","Suggest using it.","Shall we use the map?",ai],
    ["The street is crowded.","Choose the safe suggestion.","Let's cross at the lights.",ai]
  ];
  const suggestionRounds=suggestions.map((x,i)=>round(`u4-su-${i+1}`,x[3],x[0],x[1],[x[2],"Go straight.","It is beautiful."],x[2],"Let's… và Shall we…? được dùng để đưa ra gợi ý."));
  const storyPrompts:[[number,string],[number,string]][]=[[[0,"What happens first?"],[0,events[0]]],[[1,"What do the friends decide next?"],[1,events[1]]],[[2,"What problem happens after they start walking?"],[2,events[2]]],[[3,"What does Phong do after they get lost?"],[3,events[3]]],[[4,"What happens last?"],[4,events[4]]],[[1,"Which event comes before they get lost?"],[1,events[1]]],[[3,"Which event comes after they get lost?"],[3,events[3]]],[[0,"Which event is number 1?"],[0,events[0]]],[[2,"Which event is number 3?"],[2,events[2]]],[[4,"Which event is number 5?"],[4,events[4]]]];
  const storyRounds=storyPrompts.map((pair,i)=>{const[index,prompt]=pair[0],[,answer]=pair[1];return round(`u4-st-${i+1}`,ref,"Lost in the old town!",prompt,[answer,events[(index+1)%5],events[(index+2)%5]],answer,`Đây là sự kiện số ${index+1} trong hội thoại.`);});
  const directionRounds=Array.from({length:10},(_,i)=>{const answer=dirs[i%5],contexts=["↱","⇧ crossing","↰","↑","↰ at the second street"];return round(`u4-di-${i+1}`,i<5?ref:ai,contexts[i%5],i<5?"Match the diagram with the direction.":"Choose the direction that matches the route.",[answer,dirs[(i+1)%5],dirs[(i+2)%5]],answer,`Chỉ dẫn phù hợp là “${answer}”.`);});
  const mapTasks:[string,string,Status][]=[
    ["From You are here, go straight along Ly Thuong Kiet Street. The place is on your left.","cinema",ref],
    ["From You are here, turn right into Le Hoan Street. It is on your left.","gym",ref],
    ["Go straight to Quang Trung Street. It is beside the park.","café",ref],
    ["Go to the top of Ly Thuong Kiet Street. It is opposite the bus stop.","railway station",ref],
    ["Go along Le Hoan Street. It is next to the gym.","bank",ref],
    ["Go straight. It is between Le Loi Street and Quang Trung Street.","park",ai],
    ["Go to Le Loi Street. It is at the right end of the street.","bus stop",ai],
    ["Go straight from You are here. It is on your left before the cinema.","temple",ai],
    ["Which place can you visit for a film?","cinema",ai],
    ["Which place can you visit to exercise?","gym",ai]
  ];
  const mapRounds=mapTasks.map((x,i)=>{const distractors=source.getting_started.map_places.filter(place=>place!==x[1]);return round(`u4-ma-${i+1}`,x[2],x[0],"Which place is it?",[x[1],distractors[i%distractors.length],distractors[(i+3)%distractors.length]],x[1],`Lộ trình dẫn đến ${x[1]}.`);});
  const routeData:[string,string,string[]][]=[
    ["___, cross the road, and then turn left.","First",["First","Finally","Behind"]],
    ["Go straight. ___ the second turning on the left.","Take",["Take","Cross","Visit"]],
    ["Take the second turning on the left, and ___ turn right.","then",["then","than","there"]],
    ["___ the road at the lights.","Cross",["Cross","Turn","Go"]],
    ["Go straight and the bank is ___ your right.","on",["on","in","under"]],
    ["Turn left ___ Le Loi Street.","into",["into","behind","between"]],
    ["The café is next ___ the park.","to",["to","at","from"]],
    ["Walk past the cinema, ___ turn right.","then",["then","than","this"]],
    ["The temple is ___ your left.","on",["on","at","by"]],
    ["Go straight ___ you reach the square.","until",["until","under","opposite"]]
  ];
  const routeRounds=routeData.map((x,i)=>round(`u4-ro-${i+1}`,i<5?ref:ai,x[0],"Complete the route instruction.",x[2],x[1],`“${x[1]}” hoàn thành chỉ dẫn đúng ngữ pháp.`));
  const placeClues:[string,string,Status][]=[
    ["Trains arrive and leave here.","railway station",ref],["You can watch a film here.","cinema",ref],["People pray or visit an old religious building here.","temple",ref],["You can exercise here.","gym",ref],["You can keep or withdraw money here.","bank",ref],["Buses stop here for passengers.","bus stop",ref],["You can drink coffee here.","café",ref],["There are trees and flowers here.","park",ref],["You can see paintings here.","art gallery",ai],["It is an open public space in a town.","square",ai]
  ];
  const huntRounds=placeClues.map((x,i)=>round(`u4-hu-${i+1}`,x[2],x[0],"Find the place.",[x[1],placeClues[(i+3)%10][1],placeClues[(i+6)%10][1]],x[1],`Địa điểm đúng là ${x[1]}.`));
  const spellings:[string,string,string[]][]=[
    ["turn right","turn right",["turn right","tern right","turn write"]],["cross the road","cross the road",["cross the road","cros the road","cross road the"]],["turn left","turn left",["turn left","tern left","turn lift"]],["go straight","go straight",["go straight","go strait","go straigth"]],["second turning","second turning",["second turning","second turnning","secont turning"]],["railway station","railway station",["railway station","railway staton","railwey station"]],["bus stop","bus stop",["bus stop","buss stop","bus stob"]],["art gallery","art gallery",["art gallery","art galery","arts gallery"]],["cathedral","cathedral",["cathedral","cathedrel","catheral"]],["neighbourhood","neighbourhood",["neighbourhood","neigbourhood","neighbourhod"]]
  ];
  const spellingRounds=spellings.map((x,i)=>round(`u4-sp-${i+1}`,i<7?ref:ai,`Spell: ${x[0]}`,"Choose the correct spelling.",x[2],x[1],`Cách viết đúng là “${x[1]}”.`,{audio_text:x[1],audio_source_status:"ai-generated"}));

  const places=[
    ["An open area in the centre of a town.","square",ref],["A place where people see paintings.","art gallery",ref],["A large important church.","cathedral",ref],["A religious building.","temple",ref],["A place where trains stop.","railway station",ref],
    ["A place to watch films.","cinema",ai],["A place to exercise.","gym",ai],["A place with grass and trees.","park",ai],["A place where buses pick up passengers.","bus stop",ai],["A place to keep money.","bank",ai]
  ] as [string,string,Status][];
  const placeRounds=places.map((x,i)=>round(`u4-pl-${i+1}`,x[2],x[0],"Which place is described?",[x[1],places[(i+2)%10][1],places[(i+5)%10][1]],x[1],`Mô tả nói về ${x[1]}.`));
  const isThereData:[string,string,Status][]=[
    ["a square","Yes, there is.",ref],["an art gallery","No, there isn't.",ai],["a temple","Yes, there is.",ai],["a railway station","No, there isn't.",ai],["a cathedral","Yes, there is.",ai],["a park","Yes, there is.",ai],["a café","Yes, there is.",ai],["a bank","No, there isn't.",ai],["a cinema","Yes, there is.",ai],["a bus stop","Yes, there is.",ai]
  ];
  const isThereRounds=isThereData.map((x,i)=>round(`u4-it-${i+1}`,x[2],`Is there ${x[0]} in the neighbourhood?`,"Choose the sample answer for this fictional neighbourhood.",[x[1],x[1].startsWith("Yes")?"No, there isn't.":"Yes, there is.","Yes, it is."],x[1],`Câu trả lời đúng là “${x[1]}” vì hồ sơ khu phố hư cấu đã cho sẵn.`));
  const adjectiveClues:[string,string,Status][]=[
    ["There are cars and people everywhere.","busy",ref],["There is very little sound.","quiet",ref],["Many people live and walk here.","crowded",ref],["The buildings are new and stylish.","modern",ref],["There is a lot of traffic sound.","noisy",ref],["The lake and trees make it calm.","peaceful",ref],["The streets and flowers look lovely.","beautiful",ref],["There is nothing interesting to do.","boring",ref],["Shops are close and transport is easy.","convenient",ai],["Festivals and cafés make it fun.","exciting",ai]
  ];
  const profileRounds=adjectiveClues.map((x,i)=>round(`u4-pr-${i+1}`,x[2],x[0],"Choose the best adjective.",[x[1],adjectiveClues[(i+3)%10][1],adjectiveClues[(i+6)%10][1]],x[1],`Từ phù hợp nhất là ${x[1]}.`));
  const soundSource=[...source.closer_look_1.sound_words,{word:"village",sound:"/ɪ/" as const},{word:"street",sound:"/iː/" as const}];
  const soundRounds=soundSource.map((x,i)=>round(`u4-so-${i+1}`,i<8?ref:ai,x.word,"Which sound group does the highlighted vowel belong to?",["/ɪ/","/iː/"],x.sound,`${x.word} được xếp vào nhóm ${x.sound}.`,{audio_text:x.word,audio_source_status:"ai-generated"}));
  const chantLines=[...source.closer_look_1.chant,"The street is clean and peaceful.","This is an exciting place to live."];
  const rhythmRounds=chantLines.map((line,i)=>round(`u4-rh-${i+1}`,i<8?ref:ai,line,"Listen and choose the last word you hear.",[line.replace(/[.!?]$/g,"").split(" ").at(-1)!,"town","area"],line.replace(/[.!?]$/g,"").split(" ").at(-1)!,"Chọn đúng từ cuối của dòng chant.",{audio_text:line,audio_source_status:"ai-generated"}));

  const comps=source.closer_look_2.comparatives.slice(0,10);
  const builderRounds=comps.map((x,i)=>round(`u4-bu-${i+1}`,i<5?ref:ai,`${x.adjective} → ?`,"Choose the comparative form.",[x.answer,`more ${x.adjective}`,`${x.adjective}er`].filter((v,j,a)=>a.indexOf(v)===j),x.answer,`Dạng so sánh hơn của ${x.adjective} là ${x.answer}.`));
  const rules:[string,string][]=[["tall","add -er"],["noisy","change y to i and add -er"],["big","double the final consonant and add -er"],["peaceful","use more"],["exciting","use more"],["hot","double the final consonant and add -er"],["small","add -er"],["wide","drop e and add -er"],["delicious","use more"],["cheap","add -er"]];
  const ruleRounds=rules.map((x,i)=>round(`u4-ru-${i+1}`,i<5?ref:ai,x[0],"Which comparative rule applies?",[x[1],"use less","do not change the adjective"],x[1],`Với ${x[0]}, quy tắc là: ${x[1]}.`));
  const letterData:[string,string,Status][]=[
    ["The weather is ___ than that in Ha Noi. (hot)","hotter",ref],["The houses are ___ than those in Ha Noi. (small)","smaller",ref],["The buildings are ___. (old)","older",ref],["The streets are ___ with less traffic. (wide)","wider",ref],["The seafood here is ___. (delicious)","more delicious",ref],["The seafood is ___ than in Ha Noi. (cheap)","cheaper",ref],
    ["The beach is ___ than the city centre. (peaceful)","more peaceful",ai],["The town is ___ in summer. (busy)","busier",ai],["The hotel is ___ than our house. (modern)","more modern",ai],["The road is ___ than before. (clean)","cleaner",ai]
  ];
  const letterRounds=letterData.map((x,i)=>round(`u4-le-${i+1}`,x[2],x[0],"Complete Vy's letter.",[x[1],i%2?"more old":"more hot",i%2?"wideer":"cheapier"],x[1],`Dạng đúng trong thư là ${x[1]}.`));
  const comparisons:[string,string,Status][]=[
    ["Binh Minh has more traffic than Long Son.","Binh Minh is noisier than Long Son.",ref],["Long Son has fields and few vehicles.","Long Son is more peaceful than Binh Minh.",ai],["Binh Minh has tall new buildings.","Binh Minh is more modern than Long Son.",ai],["Long Son has fewer people.","Long Son is quieter than Binh Minh.",ai],["Binh Minh has many cars and shops.","Binh Minh is busier than Long Son.",ai],["Long Son has open fields.","Long Son is less crowded than Binh Minh.",ai],["Binh Minh has more entertainment.","Binh Minh is more exciting than Long Son.",ai],["Long Son has cleaner air.","Long Son is cleaner than Binh Minh.",ai],["Binh Minh has more people.","Binh Minh is more crowded than Long Son.",ai],["Long Son has fewer modern buildings.","Long Son is less modern than Binh Minh.",ai]
  ];
  const compareRounds=comparisons.map((x,i)=>round(`u4-co-${i+1}`,x[2],x[0],"Choose the best comparison.",[x[1],comparisons[(i+2)%10][1],comparisons[(i+5)%10][1]],x[1],`So sánh phù hợp là “${x[1]}”`));
  const qaData:[string,string,Status][]=[
    ["Is Binh Minh noisier than Long Son?","Yes, it is.",ref],["Is Long Son more modern than Binh Minh?","No, it isn't.",ref],["Is Long Son quieter than Binh Minh?","Yes, it is.",ai],["Is Binh Minh busier than Long Son?","Yes, it is.",ai],["Is Long Son more crowded than Binh Minh?","No, it isn't.",ai],["Is Binh Minh more peaceful than Long Son?","No, it isn't.",ai],["Is Binh Minh more modern than Long Son?","Yes, it is.",ai],["Is Long Son cleaner than Binh Minh?","Yes, it is.",ai],["Is Binh Minh quieter than Long Son?","No, it isn't.",ai],["Is Long Son less busy than Binh Minh?","Yes, it is.",ai]
  ];
  const qaRounds=qaData.map((x,i)=>round(`u4-qa-${i+1}`,x[2],x[0],"Choose the answer.",[x[1],x[1].startsWith("Yes")?"No, it isn't.":"Yes, it is.","Yes, there is."],x[1],`Dựa vào hai tranh hư cấu, đáp án là “${x[1]}”`));
  return {suggestions:suggestionRounds,story_order:storyRounds,direction_match:directionRounds,map_navigator:mapRounds,route_builder:routeRounds,place_hunt:huntRounds,direction_spelling:spellingRounds,places:placeRounds,is_there:isThereRounds,profile:profileRounds,sound:soundRounds,rhythm:rhythmRounds,builder:builderRounds,rule_sorter:ruleRounds,letter:letterRounds,compare:compareRounds,qa:qaRounds};
}

const help=(title:string,teaching:string):{source_title:string;teaching_vi:string;steps:string[]}=>({source_title:title,teaching_vi:teaching,steps:["Hoàn thành đủ 10 lượt của trò chơi.","Đọc hoặc nghe kỹ ngữ cảnh rồi chọn đáp án có bằng chứng.","Chọn sai, dùng trợ giúp và thời gian sẽ được phản hồi rõ; thành tích tốt nhất được giữ lại."]});

export function buildUnit4Data(source:Unit4Source):Unit4BuiltData{
  const games=buildGames(source);
  const titles:Record<Unit4GameId,[string,string]>={
    suggestions:["Getting Started · Bài 2","Dùng Let's và Shall we để đưa ra gợi ý."],story_order:["Getting Started · Bài 3","Xác định trình tự sự kiện trong hội thoại."],direction_match:["Getting Started · Bài 4","Ghép câu chỉ đường với hướng di chuyển."],map_navigator:["Getting Started · Bài 5","Theo lộ trình để xác định địa điểm."],route_builder:["Getting Started · Chỉ đường","Hoàn thành một chuỗi chỉ dẫn mạch lạc."],place_hunt:["Getting Started · Find places","Đoán địa điểm từ chức năng hoặc vị trí."],direction_spelling:["Getting Started · Luyện chính tả","Nhận biết cách viết đúng của từ chỉ đường."],places:["A Closer Look 1 · Bài 1","Gọi tên địa điểm trong khu phố."],is_there:["A Closer Look 1 · Bài 2","Hỏi và trả lời với Is there…?"],profile:["A Closer Look 1 · Bài 3","Chọn tính từ mô tả khu phố."],sound:["A Closer Look 1 · Bài 4","Nhận biết /ɪ/ và /iː/; không chấm giọng nói."],rhythm:["A Closer Look 1 · Bài 5","Nghe chant và luyện nhịp; không chấm giọng nói."],builder:["A Closer Look 2 · Bài 1","Tạo dạng so sánh hơn đúng."],rule_sorter:["A Closer Look 2 · Grammar","Phân loại quy tắc tạo so sánh hơn."],letter:["A Closer Look 2 · Bài 2","Hoàn thành lá thư bằng dạng so sánh phù hợp."],compare:["A Closer Look 2 · Bài 3","So sánh hai khu phố hư cấu."],qa:["A Closer Look 2 · Bài 4","Hỏi đáp Yes/No về hai khu phố."]};
  const helps=Object.fromEntries(Object.entries(titles).map(([id,[title,teaching]])=>[id,help(title,teaching)])) as Unit4BuiltData["help"];
  return {...source,games,help:helps};
}

function hasImage(value:unknown):boolean{if(!value||typeof value!=="object")return false;if(Array.isArray(value))return value.some(hasImage);return Object.entries(value).some(([key,child])=>/^(image|photo|illustration|image_url)$/i.test(key)||hasImage(child));}
export function validateUnit4Data(source:Unit4Source):Unit4BuiltData{
  if(source.lesson_id!=="unit4-phase1"||source.source_status!=="user-provided-reference"||source.usage_scope!=="personal-family"||!source.source_note.trim())throw new Error("Unit 4 provenance is invalid");
  if(hasImage(source))throw new Error("Unit 4 must not embed textbook images");
  if(source.getting_started.dialogue.length!==14||source.getting_started.event_order.length!==5||source.getting_started.directions.length!==5)throw new Error("Unit 4 Getting Started anchors changed");
  if(source.closer_look_1.places.length!==5||source.closer_look_1.adjectives.length!==8||source.closer_look_2.comparatives.length!==11)throw new Error("Unit 4 source catalogs changed");
  const built=buildUnit4Data(source),ids=Object.keys(built.games);
  if(ids.length!==17||Object.values(built.games).some(items=>items.length!==10||new Set(items.map(item=>item.id)).size!==10))throw new Error("Unit 4 phase 1 needs 17 games of ten rounds");
  for(const [id,items] of Object.entries(built.games)){for(const item of items){if(!item.options.includes(item.answer)||new Set(item.options).size!==item.options.length||item.options.length<2||item.options.length>4)throw new Error(`${id}/${item.id} has an invalid answer`);}}
  return built;
}
