import type { CommonRound } from "../skills-common/SkillsSection";

export type Unit5GameId="dialogue"|"wonders_fill"|"nature_match"|"quiz"|"fact_check"|"travel_word"|"spelling"|"items"|"context"|"packing"|"sound"|"rhythm"|"countability"|"quantifiers"|"gap_fill"|"modal"|"rules";
type Status=CommonRound["source_status"];
type Seed={context:string;prompt:string;answer:string;status:Status;audio?:string;explanation?:string};
export type Unit5Source={
  lesson_id:"unit5-phase1";source_status:"user-provided-reference";usage_scope:"personal-family";source_note:string;
  unit:{number:5;title:string;title_vi:string};
  getting_started:{title:string;dialogue:Array<{speaker:string;text:string}>;word_box:string[];fill_sentences:Array<{sentence:string;answer:string}>;nature_words:string[];quiz:Array<{question:string;answer:string;distractor:string}>};
  closer_look_1:{travel_items:string[];context_answers:string[];sound_words:Array<{word:string;sound:"/t/"|"/d/"}>;sound_sentences:string[]};
  closer_look_2:{countability:Array<{noun:string;answer:"countable"|"uncountable"}>;quantifier_choices:Array<{sentence:string;answer:string;distractor:string}>;gap_answers:string[];modal_sentences:Array<{sentence:string;answer:"must"|"mustn't"}>;visible_rules:string[]};
};
export type Unit5Built=Unit5Source&{games:Record<Unit5GameId,CommonRound[]>;help:Record<Unit5GameId,{source_title:string;teaching_vi:string;steps:string[]}>};
const ref="user-provided-reference" as const,ai="ai-generated" as const;
const seed=(context:string,prompt:string,answer:string,status:Status=ai,audio?:string,explanation?:string):Seed=>({context,prompt,answer,status,audio,explanation});
function options(answer:string,pool:string[],index:number){const others=[...new Set(pool)].filter(item=>item!==answer);return [answer,others[index%others.length],others[(index+2)%others.length]].filter((v,i,a)=>a.indexOf(v)===i);}
function build(prefix:string,seeds:Seed[],pool?:string[]):CommonRound[]{const bank=pool??seeds.map(item=>item.answer);return seeds.map((item,index)=>({id:`${prefix}-${String(index+1).padStart(2,"0")}`,source_status:item.status,context:item.context,prompt:item.prompt,options:options(item.answer,bank,index),answer:item.answer,explanation_vi:item.explanation??`Đáp án phù hợp là “${item.answer}”.`,...(item.audio?{audio_text:item.audio,audio_source_status:"ai-generated" as const}:{})}));}
function games(source:Unit5Source):Record<Unit5GameId,CommonRound[]>{
  const dialogue=build("u5-di",[
    seed(source.getting_started.dialogue[0].text,"Which club are the students joining?","Geography Club",ref),
    seed(source.getting_started.dialogue[1].text,"What must Elena remember?","be on time",ref),
    seed(source.getting_started.dialogue[3].text,"What is Alice going to talk about?","natural wonders of Viet Nam",ref),
    seed(source.getting_started.dialogue[5].text,"Where is Ganh Da Dia?","in Phu Yen",ref),
    seed(source.getting_started.dialogue[6].text,"How does Elena describe it?","amazing",ref),
    seed(source.getting_started.dialogue[7].text,"Which place is in picture 2?","Ha Long Bay",ref),
    seed(source.getting_started.dialogue[9].text,"What does Ha Long Bay have?","many islands",ref),
    seed(source.getting_started.dialogue[10].text,"How is the scenery?","wonderful",ref),
    seed(source.getting_started.dialogue[10].text,"Which island is shown?","Tuan Chau",ref),
    seed("Alice says: You must always be on time.","Is this a rule or a description?","a rule")
  ]);
  const fill=build("u5-fi",source.getting_started.fill_sentences.map(item=>seed(item.sentence,"Choose the missing word.",item.answer,ref)).concat([
    seed("Fansipan is a natural ___.","Choose the missing word.","wonder"),seed("The view from the mountain is ___.","Choose the missing word.","amazing"),seed("Con Dao has many beautiful ___.","Choose the missing word.","islands"),seed("The river and trees make wonderful ___.","Choose the missing word.","scenery"),seed("A cave is a ___ feature.","Choose the missing word.","natural")
  ]),[...source.getting_started.word_box,"wonder"]);
  const natureClues:[[string,string],...Array<[string,string]>]=[["A very high area of land.","mountain"],["Water flowing in a long channel.","river"],["Water falling from a high place.","waterfall"],["A large area covered with trees.","forest"],["A large hole in a hill or mountain.","cave"],["A very dry area with sand.","desert"],["A sandy place beside the sea.","beach"],["Land surrounded by water.","island"],["A natural area with many trees and animals.","national park"],["A large body of salt water.","sea"]];
  const nature_match=build("u5-na",natureClues.map(([context,answer],index)=>seed(context,"Which natural feature is it?",answer,index<8?ref:ai)),natureClues.map(item=>item[1]));
  const quiz=build("u5-qu",source.getting_started.quiz.map(item=>seed(item.question,"Choose the correct answer.",item.answer,ref)).concat([
    seed("Which place is famous for thousands of islands?","Choose the answer.","Ha Long Bay"),seed("Which wonder is in Phu Yen?","Choose the answer.","Ganh Da Dia"),seed("Which mountain is the highest in Viet Nam?","Choose the answer.","Fansipan"),seed("Which cave is in Quang Binh?","Choose the answer.","Son Doong"),seed("Which island is shown in Alice's picture?","Choose the answer.","Tuan Chau")
  ]));
  const facts:[[string,string,Status],...Array<[string,string,Status]>]=[
    ["Ganh Da Dia is in Phu Yen.","True",ref],["Ha Long Bay has many islands.","True",ref],["Tuan Chau is a large island.","True",ref],["Fansipan is in Quang Binh.","False",ref],["Ban Gioc Waterfall is in Cao Bang.","True",ref],
    ["A desert is usually very wet.","False",ai],["A cave can be inside a mountain.","True",ai],["An island is surrounded by water.","True",ai],["A forest has many trees.","True",ai],["A waterfall is a kind of mountain.","False",ai]
  ];
  const fact_check=build("u5-fa",facts.map(([context,answer,status])=>seed(context,"True or false?",answer,status)),["True","False"]);
  const travel_word=build("u5-tw",[
    seed("It helps you find north.","Which travel item?","compass"),seed("It carries your things.","Which travel item?","backpack"),seed("You sleep in it while camping.","Which travel item?","sleeping bag"),seed("It protects your skin from the sun.","Which travel item?","suncream"),seed("You put it on a small cut.","Which travel item?","plaster"),seed("You use them to cut paper.","Which travel item?","scissors"),seed("It gives light at night.","Which travel item?","torch"),seed("It holds drinking water.","Which travel item?","water bottle"),seed("You wear it on your head in the sun.","Which travel item?","hat"),seed("It shows routes and places.","Which travel item?","map")
  ]);
  const spellingWords=[...source.getting_started.nature_words,"suncream","backpack"];
  const spelling=build("u5-sp",spellingWords.map((word,index)=>seed(`Spell the word you hear: ${word}`,"Choose the correct spelling.",word,index<8?ref:ai,word)),spellingWords);
  const itemClues=[["For a cut","plaster"],["For strong sunlight","suncream"],["For sleeping outdoors","sleeping bag"],["For cutting","scissors"],["For carrying things","backpack"],["For finding direction","compass"],["For drinking","water bottle"],["For seeing at night","torch"],["For protecting your head","hat"],["For finding a route","map"]];
  const items=build("u5-it",itemClues.map(([context,answer],index)=>seed(context,"Choose the useful item.",answer,index<6?ref:ai)),itemClues.map(item=>item[1]));
  const contextSentences=[
    ["We're lost. Please give me the ___.","compass"],["It's so sunny today. I need to put on some ___.","suncream"],["A ___ is very useful when you go camping overnight.","sleeping bag"],["I've finished packing. All my things are in my ___.","backpack"],["My foot hurts. I need to put a ___ on my foot.","plaster"],
    ["Use the ___ to cut this paper.","scissors"],["Take a ___ so you can see at night.","torch"],["Put some water in your ___.","water bottle"],["Look at the ___ to find the river.","map"],["Wear a ___ in the hot sun.","hat"]
  ];
  const context=build("u5-co",contextSentences.map(([text,answer],index)=>seed(text,"Choose the missing item.",answer,index<5?ref:ai)),contextSentences.map(item=>item[1]));
  const packing=build("u5-pa",[
    seed("A sunny beach trip","Which item is most useful?","suncream"),seed("Camping overnight","Which item is most useful?","sleeping bag"),seed("A forest hike","Which item helps with direction?","compass"),seed("Carrying six travel items","Where should they go?","backpack"),seed("A small cut","Which item helps?","plaster"),seed("Cutting a bandage","Which item helps?","scissors"),seed("Walking after dark","Which item helps?","torch"),seed("A long hot walk","Which item is essential?","water bottle"),seed("Following a trail","Which item helps?","map"),seed("Protecting your head","Which item helps?","hat")
  ]);
  const soundSource=[...source.closer_look_1.sound_words,{word:"tent",sound:"/t/" as const},{word:"road",sound:"/d/" as const}];
  const sound=build("u5-so",soundSource.map((item,index)=>seed(item.word,"Which final sound group?",item.sound,index<8?ref:ai,item.word)),["/t/","/d/"]);
  const rhythmLines=[...source.closer_look_1.sound_sentences,"Take a tent on the trip.","The guide found the island.","Pack the map in your backpack.","We stayed beside the road.","The waterfall looked great."];
  const rhythm=build("u5-rh",rhythmLines.map((line,index)=>{const answer=line.replace(/[?.!]/g,"").split(" ").at(-1)!;return seed(line,"Choose the last word you hear.",answer,index<5?ref:ai,line);}),rhythmLines.map(line=>line.replace(/[?.!]/g,"").split(" ").at(-1)!));
  const countSeeds=[...source.closer_look_2.countability.map(item=>seed(item.noun,"Countable or uncountable?",item.answer,ref)),seed("rocks","Countable or uncountable?","countable"),seed("island","Countable or uncountable?","countable"),seed("cream","Countable or uncountable?","uncountable"),seed("chocolate","Countable or uncountable?","uncountable"),seed("caves","Countable or uncountable?","countable")];
  const countability=build("u5-cn",countSeeds,["countable","uncountable"]);
  const quantifierSeeds=[...source.closer_look_2.quantifier_choices.map(item=>seed(item.sentence,"Choose the correct option.",item.answer,ref)),seed("There are ___ islands in the bay.","Choose the quantifier.","many"),seed("We have ___ water left.","Choose the quantifier.","a little"),seed("Only ___ visitors know this path.","Choose the quantifier.","a few"),seed("There isn't ___ sugar.","Choose the quantifier.","much"),seed("We need ___ travel items.","Choose the quantifier.","some")];
  const quantifiers=build("u5-qt",quantifierSeeds,["many","much","a few","a little","some","little"]);
  const gapTexts=[["How ___ books are there in your bag?","many"],["There isn't ___ milk in the fridge.","any"],["How ___ sugar do you need?","much"],["We need to buy ___ new furniture.","some"],["There is ___ big cave in this area.","a"],["There are ___ waterfalls here.","some"],["Is there ___ water in the bottle?","any"],["How ___ islands can you see?","many"],["We don't have ___ time.","much"],["I saw ___ amazing mountain.","an"]];
  const gap_fill=build("u5-ga",gapTexts.map(([text,answer],index)=>seed(text,"Choose the missing word.",answer,index<5?ref:ai)),["a","an","any","some","much","many"]);
  const modalSeeds=[...source.closer_look_2.modal_sentences.map(item=>seed(item.sentence,"Choose must or mustn't.",item.answer,ref)),seed("Visitors ___ drop litter in the forest.","Choose the modal.","mustn't"),seed("You ___ bring enough water.","Choose the modal.","must"),seed("We ___ touch the cave walls.","Choose the modal.","mustn't"),seed("Hikers ___ follow the guide.","Choose the modal.","must"),seed("You ___ swim near the waterfall.","Choose the modal.","mustn't")];
  const modal=build("u5-mo",modalSeeds,["must","mustn't"]);
  const ruleSeeds=[
    seed(source.closer_look_2.visible_rules[0],"Necessary or not allowed?","necessary",ref),seed(source.closer_look_2.visible_rules[1],"Necessary or not allowed?","not allowed",ref),
    seed("We must listen to the teacher.","Necessary or not allowed?","necessary"),seed("We mustn't run in the classroom.","Necessary or not allowed?","not allowed"),seed("We must keep the classroom clean.","Necessary or not allowed?","necessary"),seed("We mustn't write on the desks.","Necessary or not allowed?","not allowed"),seed("We must help our classmates.","Necessary or not allowed?","necessary"),seed("We mustn't be late.","Necessary or not allowed?","not allowed"),seed("We must bring our books.","Necessary or not allowed?","necessary"),seed("We mustn't shout during lessons.","Necessary or not allowed?","not allowed")
  ];
  const rules=build("u5-ru",ruleSeeds,["necessary","not allowed"]);
  return {dialogue,wonders_fill:fill,nature_match,quiz,fact_check,travel_word,spelling,items,context,packing,sound,rhythm,countability,quantifiers,gap_fill,modal,rules};
}
const helper=(title:string,teaching_vi:string)=>({source_title:title,teaching_vi,steps:["Hoàn thành đủ 10 lượt.","Đọc hoặc nghe kỹ bằng chứng rồi chọn đáp án.","Điểm phụ thuộc thời gian, trợ giúp và số lần sai; hệ thống giữ thành tích tốt nhất."]});
export function buildUnit5(source:Unit5Source):Unit5Built{const builtGames=games(source);const titles:Record<Unit5GameId,[string,string]>={
  dialogue:["Getting Started · Geography Club","Đọc hiểu hội thoại về kỳ quan Việt Nam."],wonders_fill:["Getting Started · Bài 2","Dùng từ vựng để hoàn chỉnh câu."],nature_match:["Getting Started · Bài 3","Nhận biết tám dạng địa hình tự nhiên."],quiz:["Getting Started · Bài 4","Trả lời câu hỏi địa lý cơ bản."],fact_check:["Getting Started · Fact Check","Phân biệt thông tin đúng và sai."],travel_word:["Getting Started · Travel Word","Đoán vật dụng từ chức năng."],spelling:["Getting Started · Spelling","Nhận biết cách viết đúng."],
  items:["A Closer Look 1 · Bài 1","Gọi tên vật dụng du lịch."],context:["A Closer Look 1 · Bài 2","Chọn vật dụng theo ngữ cảnh."],packing:["A Closer Look 1 · Bài 3","Chọn đồ hữu ích cho chuyến đi."],sound:["A Closer Look 1 · Bài 4","Nghe nhận biết /t/ và /d/, không chấm giọng nói."],rhythm:["A Closer Look 1 · Bài 5","Nghe câu và luyện nhịp, không chấm giọng nói."],
  countability:["A Closer Look 2 · Bài 1","Phân biệt danh từ đếm được và không đếm được."],quantifiers:["A Closer Look 2 · Bài 2","Chọn lượng từ phù hợp."],gap_fill:["A Closer Look 2 · Bài 3","Dùng a, an, any, some, much, many."],modal:["A Closer Look 2 · Bài 4","Dùng must và mustn't."],rules:["A Closer Look 2 · Bài 5","Hiểu quy tắc cần làm và không được làm."]};const help=Object.fromEntries(Object.entries(titles).map(([id,[title,teaching]])=>[id,helper(title,teaching)])) as Unit5Built["help"];return {...source,games:builtGames,help};}
function hasImage(value:unknown):boolean{if(!value||typeof value!=="object")return false;if(Array.isArray(value))return value.some(hasImage);return Object.entries(value).some(([key,child])=>/^(image|photo|illustration|image_url)$/i.test(key)||hasImage(child));}
export function validateUnit5(source:Unit5Source):Unit5Built{
  if(source.lesson_id!=="unit5-phase1"||source.source_status!==ref||source.usage_scope!=="personal-family"||!source.source_note.trim())throw new Error("Unit 5 provenance is invalid");
  if(hasImage(source))throw new Error("Unit 5 must not embed textbook images");
  if(source.getting_started.dialogue.length!==11||source.getting_started.fill_sentences.length!==5||source.getting_started.nature_words.length!==8||source.getting_started.quiz.length!==5||source.closer_look_1.travel_items.length!==6||source.closer_look_1.sound_words.length!==8||source.closer_look_2.countability.length!==5||source.closer_look_2.modal_sentences.length!==5)throw new Error("Unit 5 source anchors changed");
  const built=buildUnit5(source);if(Object.keys(built.games).length!==17||Object.values(built.games).some(rounds=>rounds.length!==10||new Set(rounds.map(item=>item.id)).size!==10))throw new Error("Unit 5 phase 1 needs 17 games of ten rounds");
  for(const [id,rounds] of Object.entries(built.games))for(const item of rounds){if(!item.options.includes(item.answer)||new Set(item.options).size!==item.options.length||item.options.length<2||item.options.length>4)throw new Error(`${id}/${item.id} has an invalid answer`);if(item.audio_text&&item.audio_source_status!==ai)throw new Error(`${id}/${item.id} audio must be AI-labelled`);}
  return built;
}
