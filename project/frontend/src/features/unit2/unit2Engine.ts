import type { CommonRound } from "../skills-common/SkillsSection";

export type Unit2GameId="dialogue"|"family"|"gap_fill"|"house_types"|"fact_check"|"room_map"|"spelling"|"rooms"|"furniture"|"room_item"|"sound"|"rhythm"|"possessive"|"possessive_forms"|"prepositions"|"positions"|"memory";
type Status=CommonRound["source_status"];
type Seed={context:string;prompt:string;answer:string;status:Status;audio?:string};
export type Unit2Source={lesson_id:"unit2-phase1";source_status:"user-provided-reference";usage_scope:"personal-family";source_note:string;unit:{number:2;title:string;title_vi:string};getting_started:{title:string;dialogue:Array<{speaker:string;text:string}>;family_members:string[];gap_answers:string[];house_types:string[]};closer_look_1:{rooms:string[];furniture:string[];sound_words:Array<{word:string;sound:"/s/"|"/z/"}>;sound_conversation_words:string[]};closer_look_2:{possessive_answers:string[];possessive_forms:string[];prepositions:string[];picture_positions:Array<{subject:string;answer:string}>;true_false:Array<{statement:string;answer:"True"|"False"}>}};
export type Unit2Built=Unit2Source&{games:Record<Unit2GameId,CommonRound[]>;help:Record<Unit2GameId,{source_title:string;teaching_vi:string;steps:string[]}>};
const ref="user-provided-reference" as const,ai="ai-generated" as const;
const seed=(context:string,prompt:string,answer:string,status:Status=ai,audio?:string):Seed=>({context,prompt,answer,status,audio});
function options(answer:string,pool:string[],index:number){const other=[...new Set(pool)].filter(item=>item!==answer);return [answer,other[index%other.length],other[(index+2)%other.length],other[(index+4)%other.length]].filter((item,i,all)=>all.indexOf(item)===i).slice(0,4);}
function build(prefix:string,seeds:Seed[],pool?:string[]):CommonRound[]{const bank=pool??seeds.map(item=>item.answer);return seeds.map((item,index)=>({id:`${prefix}-${String(index+1).padStart(2,"0")}`,source_status:item.status,context:item.context,prompt:item.prompt,options:options(item.answer,bank,index),answer:item.answer,explanation_vi:`Đáp án phù hợp là “${item.answer}”.`,...(item.audio?{audio_text:item.audio,audio_source_status:"ai-generated" as const}:{})}));}

function buildGames(source:Unit2Source):Record<Unit2GameId,CommonRound[]>{
  const dialogueItems=[
    seed(source.getting_started.dialogue[0].text,"Whose room is it?","Elena's room",ref),
    seed(source.getting_started.dialogue[2].text,"Where is the TV?","behind Nick",ref),
    seed(source.getting_started.dialogue[4].text,"Where does Mi live now?","in a town house",ref),
    seed(source.getting_started.dialogue[5].text,"Where does Nick live?","in a country house",ref),
    seed(source.getting_started.dialogue[6].text,"Who lives with Mi?","her parents and younger brother",ref),
    seed(source.getting_started.dialogue[8].text,"Who lives near Mi's new flat?","her aunt",ref),
    seed(source.getting_started.dialogue[9].text,"What does Nick ask about?","the rooms in the new flat",ref),
    seed(source.getting_started.dialogue[10].text,"How many bedrooms are there?","three",ref),
    seed("Mi is moving next month.","What kind of home is she moving to?","a flat"),
    seed("Nick talks about Elena.","Who is Elena?","Nick's sister")
  ];
  const dialogue=build("u2-gd",dialogueItems);
  const familyClues=["Mi lives with them.","Elena is Nick's ___.","Mi has a younger ___.","She lives near Mi's new flat.","Mi can play with this family member.","my mother's son","my father's sister","my aunt's child","my parents' daughter","my mother and father"];
  const familyAnswers=[...source.getting_started.family_members,"brother","aunt","cousin","sister","parents"];
  const family=build("u2-gf",familyAnswers.map((answer,index)=>seed(familyClues[index],"Choose the family word.",answer,index<5?ref:ai)),source.getting_started.family_members);
  const gapContexts=["Elena is Nick's ___.","There is a ___ in Elena's room.","Now Mi lives in a ___ house.","Nick lives in a ___ house.","Mi's new flat has ___ bedrooms.","Mi is moving to a ___.","Mi's ___ lives near the new flat.","Nick's sister is ___.","There are two ___ in Mi's new flat.","Mi lives with her parents and younger ___."];
  const gapAnswers=[...source.getting_started.gap_answers,"flat","aunt","Elena","bathrooms","brother"];
  const gap_fill=build("u2-gg",gapAnswers.map((answer,index)=>seed(gapContexts[index],"Choose the missing word.",answer,index<5?ref:ai)),gapAnswers);
  const houseClues=["a house in a town","a house in the countryside","a home in an apartment building","a large detached home","Mi's present type of home","Nick's type of home","Mi's next home","a spacious home with a garden","a home close to shops","a home among fields"];
  const houseAnswers=[...source.getting_started.house_types,"town house","country house","flat","villa","town house","country house"];
  const house_types=build("u2-gh",houseAnswers.map((answer,index)=>seed(houseClues[index],"Choose the type of house.",answer,index<4?ref:ai)),source.getting_started.house_types);
  const facts=[
    ["Elena is Nick's sister.","True"],["There is a TV behind Nick.","True"],["Mi lives in a country house now.","False"],["Nick lives in a country house.","True"],["Mi's new flat has three bedrooms.","True"],
    ["Mi lives alone.","False"],["Mi's aunt lives near the new flat.","True"],["The new flat has one bathroom.","False"],["Mi can play with her cousin.","True"],["Elena's room looks small.","False"]
  ];
  const fact_check=build("u2-gc",facts.map(([context,answer],index)=>seed(context,"True or false?",answer,index<5?ref:ai)),["True","False"]);
  const roomClues=["the entrance area","a room for cooking","a room for sleeping","a room with a shower","a room with a sofa","a room with a bed","a room with a sink and fridge","a room for guests and family","a room with a toilet","the space near the front door"];
  const roomAnswers=[...source.closer_look_1.rooms,"bedroom","kitchen","living room","bathroom","hall"];
  const room_map=build("u2-gr",roomAnswers.map((answer,index)=>seed(roomClues[index],"Choose the room.",answer,index<5?ref:ai)),source.closer_look_1.rooms);
  const spellingWords=[...source.getting_started.house_types,...source.closer_look_1.rooms.slice(0,4),"sofa","fridge"];
  const spelling=build("u2-gs",spellingWords.map((answer,index)=>seed(`Spell the home word you hear: ${answer}`,"Choose the correct spelling.",answer,index<8?ref:ai,answer)),spellingWords);

  const rooms=build("u2-ar",roomAnswers.map((answer,index)=>seed(roomClues[index],"Name the room.",answer,index<5?ref:ai)),source.closer_look_1.rooms);
  const furnitureClues=["gives light","a bathroom seat","hangs on a wall","stores dishes or clothes","water flows into it","a seat for several people","washes dishes","keeps food cold","water falls from it","stores folded clothes"];
  const furniture=build("u2-af",source.closer_look_1.furniture.map((answer,index)=>seed(furnitureClues[index],"Choose the thing.",answer,ref)),source.closer_look_1.furniture);
  const itemRooms=["bedroom","bathroom","living room","kitchen","bathroom","living room","kitchen","kitchen","bathroom","bedroom"];
  const room_item=build("u2-ai",source.closer_look_1.furniture.map((item,index)=>seed(item,"Which room commonly has this item?",itemRooms[index],ref)),source.closer_look_1.rooms);
  const soundItems=[...source.closer_look_1.sound_words,{word:"books",sound:"/s/" as const},{word:"beds",sound:"/z/" as const}];
  const sound=build("u2-as",soundItems.map((item,index)=>seed(item.word,"Which final sound?",item.sound,index<8?ref:ai,item.word)),["/s/","/z/"]);
  const soundMap:Record<string,string>={bowls:"/z/",chopsticks:"/s/",things:"/z/",homes:"/z/",lamps:"/s/",beds:"/z/",books:"/s/",rooms:"/z/",sinks:"/s/",sofas:"/z/"};
  const rhythmWords=[...source.closer_look_1.sound_conversation_words,"beds","books","rooms","sinks","sofas"];
  const rhythm=build("u2-az",rhythmWords.map((word,index)=>seed(word,"Choose the final sound you hear.",soundMap[word],index<5?ref:ai,word)),["/s/","/z/"]);

  const possessiveContexts=["My ___ house is in Ha Noi. (grandmother)","This is my ___ desk. (sister)","My ___ dad is my uncle. (cousin)","___ house is small. (Nam)","There are two bedrooms in ___ flat. (An)","This is Lan Anh's room.","That is Minh Khoa's sofa.","It is Bảo Ngọc's lamp.","This is my mother's chair.","That is my brother's bed."];
  const possessiveAnswers=[...source.closer_look_2.possessive_answers,"Lan Anh's","Minh Khoa's","Bảo Ngọc's","mother's","brother's"];
  const possessive=build("u2-ap",possessiveAnswers.map((answer,index)=>seed(possessiveContexts[index],"Choose the possessive form.",answer,index<5?ref:ai)),possessiveAnswers);
  const formContexts=["Thuc Anh is ___ cousin. (Mi)","This is ___ chair. (their teacher)","Where is ___ computer? (Nick)","My ___ motorbike is in the garden. (father)","My ___ bedroom is next to the living room. (brother)","This is ___ room. (Elena)","That is ___ flat. (An)","It is ___ desk. (Nam)","This is ___ house. (grandmother)","That is ___ dad. (cousin)"];
  const formAnswers=[...source.closer_look_2.possessive_forms,"Elena's","An's","Nam's","grandmother's","cousin's"];
  const possessive_forms=build("u2-ao",formAnswers.map((answer,index)=>seed(formContexts[index],"Complete the possessive form.",answer,index<5?ref:ai)),formAnswers);
  const prepContexts=["The book is ___ the box.","The book is ___ the box lid.","The person is ___ the chair.","The chair is ___ the person.","The dog is ___ the television.","The book is ___ the table.","The table is ___ two lamps.","The cat is ___ the chair.","The dog is ___ the cupboard.","The cat is ___ the table."];
  const prepAnswers=["in","on","next to","behind","in front of","under","between","behind","in","under"];
  const prepositions=build("u2-al",prepAnswers.map((answer,index)=>seed(prepContexts[index],"Choose the preposition.",answer,index<7?ref:ai)),source.closer_look_2.prepositions);
  const positionItems=[...source.closer_look_2.picture_positions,{subject:"school bag",answer:"under the table"},{subject:"books",answer:"on the table"},{subject:"clock",answer:"between the pictures"}];
  const positions=build("u2-ax",positionItems.map((item,index)=>seed(item.subject,"Where is it?",item.answer,index<7?ref:ai)),positionItems.map(item=>item.answer));
  const memoryItems=[...source.closer_look_2.true_false,{statement:"The books are on the table.",answer:"True" as const},{statement:"The school bag is under the table.",answer:"True" as const},{statement:"The clock is between the pictures.",answer:"True" as const},{statement:"The dog is on the bed.",answer:"False" as const},{statement:"The cat is behind the computer.",answer:"False" as const}];
  const memory=build("u2-am",memoryItems.map((item,index)=>seed(item.statement,"True or false?",item.answer,index<5?ref:ai)),["True","False"]);
  return {dialogue,family,gap_fill,house_types,fact_check,room_map,spelling,rooms,furniture,room_item,sound,rhythm,possessive,possessive_forms,prepositions,positions,memory};
}

const helper=(source_title:string,teaching_vi:string)=>({source_title,teaching_vi,steps:["Hoàn thành đủ 10 lượt.","Đọc hoặc nghe bằng chứng trước khi chọn.","Điểm phụ thuộc thời gian, trợ giúp và số lần sai; hệ thống giữ thành tích tốt nhất."]});
export function buildUnit2(source:Unit2Source):Unit2Built{const games=buildGames(source);const titles:Record<Unit2GameId,[string,string]>={dialogue:["Getting Started · A look inside","Đọc hiểu hội thoại về nhà và phòng."],family:["Getting Started · Bài 2","Nhận biết thành viên gia đình."],gap_fill:["Getting Started · Bài 3","Điền thông tin từ hội thoại."],house_types:["Getting Started · Bài 4","Học các loại nhà."],fact_check:["Getting Started · Fact Check","Kiểm tra chi tiết hội thoại."],room_map:["Getting Started · Room Map","Nhận biết các phòng."],spelling:["Getting Started · Spelling","Nghe và nhận biết cách viết."],rooms:["A Closer Look 1 · Bài 1","Gọi tên các phòng trong nhà."],furniture:["A Closer Look 1 · Bài 2","Học đồ nội thất và vật dụng."],room_item:["A Closer Look 1 · Bài 3","Ghép đồ vật với phòng."],sound:["A Closer Look 1 · Bài 4","Nghe âm cuối /s/ và /z/, không chấm giọng nói."],rhythm:["A Closer Look 1 · Bài 5","Nghe từ trong hội thoại và nhận biết âm cuối."],possessive:["A Closer Look 2 · Bài 1","Dùng sở hữu cách với tên và danh từ."],possessive_forms:["A Closer Look 2 · Bài 2","Hoàn thành cụm sở hữu."],prepositions:["A Closer Look 2 · Bài 3","Dùng giới từ chỉ vị trí."],positions:["A Closer Look 2 · Picture Positions","Mô tả vị trí đồ vật."],memory:["A Closer Look 2 · Bài 4–5","Ghi nhớ vị trí trong căn phòng."]};const help=Object.fromEntries(Object.entries(titles).map(([id,[title,teaching]])=>[id,helper(title,teaching)])) as Unit2Built["help"];return {...source,games,help};}
function hasImage(value:unknown):boolean{if(!value||typeof value!=="object")return false;if(Array.isArray(value))return value.some(hasImage);return Object.entries(value).some(([key,item])=>/^(image|photo|illustration|image_url)$/i.test(key)||hasImage(item));}
export function validateUnit2(source:Unit2Source):Unit2Built{if(source.lesson_id!=="unit2-phase1"||source.source_status!==ref||source.usage_scope!=="personal-family"||!source.source_note.includes("Track 10–12"))throw new Error("Unit 2 provenance is invalid");if(hasImage(source))throw new Error("Unit 2 must not embed textbook images");if(source.getting_started.dialogue.length!==11||source.getting_started.family_members.length!==5||source.getting_started.gap_answers.length!==5||source.getting_started.house_types.length!==4||source.closer_look_1.rooms.length!==5||source.closer_look_1.furniture.length!==10||source.closer_look_1.sound_words.length!==8||source.closer_look_1.sound_conversation_words.length!==5||source.closer_look_2.possessive_answers.length!==5||source.closer_look_2.possessive_forms.length!==5||source.closer_look_2.prepositions.length!==7||source.closer_look_2.picture_positions.length!==7||source.closer_look_2.true_false.length!==5)throw new Error("Unit 2 source anchors changed");const built=buildUnit2(source);if(Object.keys(built.games).length!==17||Object.values(built.games).some(rounds=>rounds.length!==10||new Set(rounds.map(item=>item.id)).size!==10))throw new Error("Unit 2 phase 1 needs 17 games of ten rounds");for(const [id,rounds] of Object.entries(built.games))for(const item of rounds){if(!item.options.includes(item.answer)||new Set(item.options).size!==item.options.length||item.options.length<2||item.options.length>4)throw new Error(`${id}/${item.id} has an invalid answer`);if(item.audio_text&&item.audio_source_status!==ai)throw new Error(`${id}/${item.id} audio must be AI-labelled`);}return built;}
