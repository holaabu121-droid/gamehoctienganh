import type { CommonRound } from "../skills-common/SkillsSection";

export type Unit6Phase2GameId="wishes"|"dialogue"|"customs"|"advice"|"mission"|"reading"|"evidence"|"custom_facts"|"speaking"|"summary"|"listening"|"details"|"order"|"writing"|"email"|"vocabulary"|"collocations"|"advice_review"|"some_any"|"review"|"plan"|"research"|"notes"|"writer"|"present";
type Status=CommonRound["source_status"];
type Seed={context:string;prompt:string;answer:string;status:Status;audio?:string};
type Custom={activity:string;country:string};
export type Unit6Phase2Source={
  lesson_id:"unit6-phase2";source_status:"user-provided-reference";usage_scope:"personal-family";source_note:string;
  communication:{wish_model:string;wish_suggestions:string[];picture_customs:Custom[];world_customs:Custom[]};
  skills1:{passages:Array<{speaker:string;country:string;text:string}>;who_statements:Array<{statement:string;speaker:string}>;memory_items:Array<{item:string;appears:boolean}>;speaking_activities:string[];advice_activities:Array<{activity:string;answer:"should"|"shouldn't"}>};
  skills2:{visible_items:string[];visible_questions:Array<{question:string;answer:string}>;replacement_audio:{source_status:"ai-generated";script:string};writing_prompts:string[];email_stems:string[]};
  looking_back:{collocations:string[];vocabulary_answers:string[];advice_sentences:Array<{cue:string;answer:"should"|"shouldn't"}>;some_any_answers:Array<"some"|"any">};
  project:{title:string;steps:string[];example_wishes:string[];now_i_can:string[]};
};
export type Unit6Phase2Built=Unit6Phase2Source&{games:Record<Unit6Phase2GameId,CommonRound[]>;help:Record<Unit6Phase2GameId,{source_title:string;teaching_vi:string;steps:string[]}>};

const ref="user-provided-reference" as const,ai="ai-generated" as const;
const seed=(context:string,prompt:string,answer:string,status:Status=ai,audio?:string):Seed=>({context,prompt,answer,status,audio});
function options(answer:string,pool:string[],index:number){const other=[...new Set(pool)].filter(item=>item!==answer);return [answer,other[index%other.length],other[(index+2)%other.length],other[(index+4)%other.length]].filter((item,i,all)=>all.indexOf(item)===i).slice(0,4);}
function build(prefix:string,seeds:Seed[],pool?:string[]):CommonRound[]{const bank=pool??seeds.map(item=>item.answer);return seeds.map((item,index)=>({id:`${prefix}-${String(index+1).padStart(2,"0")}`,source_status:item.status,context:item.context,prompt:item.prompt,options:options(item.answer,bank,index),answer:item.answer,explanation_vi:`Đáp án phù hợp là “${item.answer}”.`,...(item.audio?{audio_text:item.audio,audio_source_status:"ai-generated" as const}:{})}));}

export function buildUnit6Phase2(source:Unit6Phase2Source):Unit6Phase2Built{
  const wishAnswers=[...source.communication.wish_suggestions,"good health all year","joy with your family","many happy adventures","peace and happiness","a wonderful new year"];
  const wishes=build("u6-cw",wishAnswers.map((answer,index)=>seed(index<5?answer:`A wish for ${answer}.`,"Choose the suitable New Year's wish.",`Wishing you ${answer}!`,index<5?ref:ai)),wishAnswers.map(item=>`Wishing you ${item}!`));
  const dialogueSeeds=[
    seed(source.communication.wish_model,"Which sentence is the New Year's wish?",source.communication.wish_model,ref),
    seed("A friend says: Happy New Year!","Choose a polite reply.","Thank you. The same to you!",ref),
    seed("A friend wants success in school.","Choose the wish.","Wishing you success in your studies!",ref),
    seed("A family wants a fun year.","Choose the wish.","Wishing you a year full of fun!",ref),
    seed("A card is for the whole year.","Choose the wish.","Wishing you happy days from January to December!",ref),
    seed("Lan Anh wishes Minh Khoa good health.","Choose Minh Khoa's reply.","Thank you, Lan Anh!"),seed("Begin a New Year card.","Choose the greeting.","Dear Bảo Ngọc,"),seed("Finish a New Year card.","Choose the closing.","Best wishes,"),seed("A friend wishes you happiness.","Choose a response.","Thank you. I wish you happiness too."),seed("You meet a teacher at New Year.","Choose the greeting.","Happy New Year!")
  ];
  const dialogue=build("u6-cd",dialogueSeeds);
  const allCustoms=[...source.communication.picture_customs,...source.communication.world_customs,{country:"Viet Nam",activity:"give children lucky money"}];
  const customs=build("u6-cc",allCustoms.map((item,index)=>seed(item.activity,"Which country is linked to this custom?",item.country,index<9?ref:ai)),allCustoms.map(item=>item.country));
  const facts=[
    ["Japan","ring bells 108 times at midnight"],["Spain","put 12 grapes in their mouth at midnight"],["Switzerland","drop ice cream on the floor"],["Romania","throw coins into a river"],["Thailand","throw water on other people"],
    ["Japan","throw water on other people"],["Spain","ring bells 108 times"],["Romania","drop ice cream on the floor"],["the USA","watch the New Year's Eve Ball drop"],["Viet Nam","give children lucky money"]
  ];
  const advice=build("u6-ca",facts.map(([country,activity],index)=>{const truePair=allCustoms.some(item=>item.country===country&&item.activity.includes(activity));return seed(`${country}: ${activity}`,"Is the country-custom pair correct?",truePair?"Correct":"Incorrect",index<5?ref:ai);}),["Correct","Incorrect"]);
  const mission=build("u6-cm",allCustoms.map((item,index)=>seed(`Mystery custom: ${item.activity}`,"Choose the country.",item.country,index<9?ref:ai)),allCustoms.map(item=>item.country));

  const readingSeeds=[...source.skills1.who_statements.map(item=>seed(item.statement,"Who says this?",item.speaker,ref)),seed("Who goes to Times Square with parents?","Choose the speaker.","Russ"),seed("Who visits grandparents on New Year's Day?","Choose the speaker.","Wu"),seed("Who explains that dogs are lucky animals?","Choose the speaker.","Mai"),seed("Who sees colourful fireworks at midnight?","Choose the speaker.","Russ"),seed("Who receives lucky money after saying wishes?","Choose the speaker.","Wu")];
  const reading=build("u6-s1r",readingSeeds,["Russ","Wu","Mai"]);
  const evidenceItems=[...source.skills1.memory_items,{item:"Times Square",appears:true},{item:"ice hole",appears:false}];
  const evidence=build("u6-s1e",evidenceItems.map((item,index)=>seed(item.item,"Does this appear in the passages?",item.appears?"Appears":"Does not appear",index<8?ref:ai)),["Appears","Does not appear"]);
  const customFactSeeds=[...source.skills1.who_statements.map(item=>seed(item.statement,"Choose the speaker.",item.speaker,ref)),seed("Colourful fireworks light up the sky at midnight.","Choose the speaker.","Russ"),seed("Children go to their grandparents' houses.","Choose the speaker.","Wu"),seed("People buy salt for good luck.","Choose the speaker.","Mai"),seed("Everybody cheers and sings at Times Square.","Choose the speaker.","Russ"),seed("A cat's cry sounds like poor in Vietnamese.","Choose the speaker.","Mai")];
  const custom_facts=build("u6-s1c",customFactSeeds,["Russ","Wu","Mai"]);
  const speakingActivities=[...source.skills1.speaking_activities,"help decorate the house","visit relatives","make a New Year's wish","watch the clock at midnight"];
  const speaking=build("u6-s1s",speakingActivities.map((activity,index)=>seed(activity,"Choose a complete speaking sentence.",`I ${activity} during Tet.`,index<6?ref:ai)),speakingActivities.map(item=>`I ${item} during Tet.`));
  const adviceActivities=[...source.skills1.advice_activities,{activity:"say Happy New Year","answer":"should" as const}];
  const summary=build("u6-s1m",adviceActivities.map((item,index)=>seed(item.activity,"What should children do?",item.answer,index<9?ref:ai)),["should","shouldn't"]);

  const script=source.skills2.replacement_audio.script;
  const heard=[...source.skills2.visible_items.map(item=>[item,"Heard"] as const),["ice cream","Not heard"] as const,["loud music","Not heard"] as const,["coins","Not heard"] as const,["grapes","Not heard"] as const];
  const listening=build("u6-s2l",heard.map(([item,answer],index)=>seed(item,"Do you hear this in the message?",answer,index<6?ref:ai,script)),["Heard","Not heard"]);
  const detailExtra=[
    {question:"What flowers decorate the house?",answer:"peach flowers"},{question:"What do the children get?",answer:"lucky money"},{question:"What do they make for good luck?",answer:"wishes"},{question:"What does the mother cook?",answer:"banh chung"},{question:"How should the children behave?",answer:"well"}
  ];
  const detailItems=[...source.skills2.visible_questions,...detailExtra];
  const details=build("u6-s2d",detailItems.map((item,index)=>seed(item.question,"Choose the short answer.",item.answer,index<5?ref:ai,script)),detailItems.map(item=>item.answer));
  const orderSteps=["throw away old things","clean the house","decorate with peach flowers","buy new clothes","buy cakes","cook banh chung","prepare red envelopes","make wishes","welcome the New Year","say Happy New Year"];
  const order=build("u6-s2o",orderSteps.map((step,index)=>seed(`Step ${index+1}`,"Choose the preparation step.",step)),orderSteps);
  const writingPrompts=[...source.skills2.writing_prompts,"Children should say thank you.","Children shouldn't fight.","Children should visit relatives.","Children shouldn't eat too many sweets.","Children should make kind wishes.","Children shouldn't play games all night."];
  const writing=build("u6-s2w",writingPrompts.map((sentence,index)=>seed(sentence,"Choose should or shouldn't.",sentence.includes("shouldn't")?"shouldn't":"should",index<4?ref:ai)),["should","shouldn't"]);
  const emailSentences=["help decorate the house","behave well","break things","play loud music","visit relatives","say Happy New Year","eat too many sweets","make a kind wish","help with housework","fight"];
  const email=build("u6-s2e",emailSentences.map((action,index)=>{const negative=["break things","play loud music","eat too many sweets","fight"].includes(action);return seed(index<4?source.skills2.email_stems[index]:action,"Complete the email sentence.",`We ${negative?"shouldn't":"should"} ${action}.`,index<4?ref:ai);}),emailSentences.map(action=>`We ${["break things","play loud music","eat too many sweets","fight"].includes(action)?"shouldn't":"should"} ${action}.`));

  const vocabularyClues=[
    ["money in red envelopes","lucky money"],["tidying a room","cleaning"],["a traditional square cake","banh chung"],["a pink Tet flower","peach"],["family members together","gathering"],
    ["bright lights in the sky","fireworks"],["a hopeful thought","wish"],["tables and chairs","furniture"],["food for a celebration","special food"],["buying things","shopping"]
  ];
  const vocabulary=build("u6-lbv",vocabularyClues.map(([clue,answer],index)=>seed(clue,"Choose the word or phrase.",answer,index<5?ref:ai)),vocabularyClues.map(item=>item[1]));
  const collocationItems=[...source.looking_back.collocations,"visit relatives","clean the furniture","celebrate Tet","buy peach flowers"];
  const collocations=build("u6-lbc",collocationItems.map((phrase,index)=>{const [verb,...rest]=phrase.split(" ");return seed(rest.join(" "),"Choose the matching verb.",verb,index<6?ref:ai);}),collocationItems.map(item=>item.split(" ")[0]));
  const adviceReview=[...source.looking_back.advice_sentences,{cue:"say thank you for lucky money",answer:"should" as const},{cue:"break a vase",answer:"shouldn't" as const},{cue:"help decorate the house",answer:"should" as const},{cue:"play loud music at night",answer:"shouldn't" as const},{cue:"make a polite wish",answer:"should" as const}];
  const advice_review=build("u6-lba",adviceReview.map((item,index)=>seed(item.cue,"Choose should or shouldn't.",item.answer,index<5?ref:ai)),["should","shouldn't"]);
  const someAnyContexts=[
    ["There are ___ balloons.","some"],["The picture uses ___ old magazines.","some"],["I didn't use ___ paint.","any"],["I don't have ___ flowers yet.","any"],["The plant needs ___ water.","some"],["It doesn't need ___ sunlight.","any"],
    ["We bought ___ cakes.","some"],["Do you have ___ lucky money?","any"],["There aren't ___ fireworks now.","any"],["She needs ___ colour paper.","some"]
  ];
  const some_any=build("u6-lbs",someAnyContexts.map(([context,answer],index)=>seed(context,"Choose some or any.",answer,index<6?ref:ai)),["some","any"]);
  const reviewSeeds=[seed("give ___","Choose the phrase.","lucky money",ref),seed("cook ___","Choose the phrase.","special food",ref),seed("He ___ run about the house.","Choose the word.","shouldn't",ref),seed("There are ___ balloons.","Choose the word.","some",ref),seed("I didn't use ___ paint.","Choose the word.","any",ref),seed("A polite New Year greeting.","Choose the sentence.","Happy New Year!"),seed("watch ___","Choose the noun.","fireworks"),seed("Children ___ behave well.","Choose the word.","should"),seed("Money in red envelopes.","Choose the phrase.","lucky money"),seed("People meet their family.","Choose the phrase.","family gathering")];
  const review=build("u6-lbr",reviewSeeds);

  const planSteps=[...source.project.steps,"Choose a kind wish.","Write one clear sentence.","Do not include private information.","Read the wish politely.","Listen to classmates.","Return the paper to the tree."];
  const plan=build("u6-pp",planSteps.map((step,index)=>seed(`Project step ${index+1}`,"Choose the correct action.",step,index<4?ref:ai)),planSteps);
  const researchWishes=[...source.project.example_wishes,"I want to learn to swim.","I want to read ten books.","I want to help my family.","I want to visit a museum.","I want to make new friends.","I want to grow a small garden.","I want to learn a new song."];
  const research=build("u6-pr",researchWishes.map((wish,index)=>seed(wish,"What kind of sentence is this?","a personal wish",index<3?ref:ai)),["a personal wish","a New Year rule","a country custom"]);
  const noteItems=[
    ["I want to read more books.","Safe project note"],["My home address is 12 River Street.","Private information"],["I want to help my parents.","Safe project note"],["My phone number is 0900000000.","Private information"],["I want to visit Singapore.","Safe project note"],
    ["My password is 1234.","Private information"],["I want to learn English well.","Safe project note"],["I want to plant a tree.","Safe project note"],["My exact school schedule is here.","Private information"],["I want to make my family happy.","Safe project note"]
  ];
  const notes=build("u6-pn",noteItems.map(([context,answer])=>seed(context,"Can this go on the class wish tree?",answer)),["Safe project note","Private information"]);
  const writer=build("u6-pw",researchWishes.map((wish,index)=>seed(wish.replace("I want to ",""),"Choose a complete wish.",wish,index<3?ref:ai)),researchWishes);
  const selfCheckAreas=["Vocabulary","Pronunciation","Grammar","Grammar","Communication","Reading","Speaking","Listening and writing"];
  const presentSeeds=source.project.now_i_can.map((skill,index)=>seed(`Now I can: ${skill}`,"Which learning area does this self-check belong to?",selfCheckAreas[index],ref));
  presentSeeds.push(seed("A classmate reads a wish aloud.","What should the class do?","Guess kindly"),seed("The wish has been guessed.","Choose the polite final action.","Thank the reader"));
  const present=build("u6-pt",presentSeeds,["Vocabulary","Pronunciation","Grammar","Communication","Reading","Speaking","Listening and writing","Guess kindly","Thank the reader"]);

  const games={wishes,dialogue,customs,advice,mission,reading,evidence,custom_facts,speaking,summary,listening,details,order,writing,email,vocabulary,collocations,advice_review,some_any,review,plan,research,notes,writer,present};
  const titles:Record<Unit6Phase2GameId,[string,string]>={
    wishes:["Communication · Bài 1–2","Luyện lời chúc năm mới."],dialogue:["Communication · Wish Dialogue","Chọn lời chúc và phản hồi lịch sự."],customs:["Communication · Bài 3–4","Ghép phong tục với quốc gia."],advice:["Communication · Custom Check","Kiểm tra cặp quốc gia và phong tục."],mission:["Communication · Bài 5","Đoán quốc gia từ phong tục."],
    reading:["Skills 1 · Bài 1","Đọc ba đoạn và xác định người nói."],evidence:["Skills 1 · Bài 2","Ghi nhớ chi tiết xuất hiện trong bài."],custom_facts:["Skills 1 · Reading Facts","Tìm bằng chứng về phong tục."],speaking:["Skills 1 · Bài 3","Xây câu nói về hoạt động ngày Tết."],summary:["Skills 1 · Bài 4","Phân loại điều nên và không nên làm."],
    listening:["Skills 2 · Bài 1","Nghe script mới về chuẩn bị Tết."],details:["Skills 2 · Bài 2","Nghe và chọn câu trả lời ngắn."],order:["Skills 2 · Preparation Order","Sắp xếp việc chuẩn bị Tết."],writing:["Skills 2 · Bài 3","Lập danh sách should/shouldn't."],email:["Skills 2 · Bài 4","Hoàn chỉnh email về Tết."],
    vocabulary:["Looking Back · Bài 2","Ôn từ vựng ngày Tết."],collocations:["Looking Back · Bài 1","Ghép động từ với danh từ."],advice_review:["Looking Back · Bài 3","Viết lời khuyên với should/shouldn't."],some_any:["Looking Back · Bài 4","Dùng some/any trong đoạn văn."],review:["Looking Back · Final Mix","Ôn tập tổng hợp Unit 6."],
    plan:["Project · I wish","Nắm bốn bước làm cây điều ước."],research:["Project · Wish Research","Nhận biết câu điều ước."],notes:["Project · Safe Notes","Chọn ghi chú phù hợp và bảo vệ riêng tư."],writer:["Project · Wish Writer","Viết câu điều ước hoàn chỉnh."],present:["Project · Show & Tell","Chuẩn bị đọc và đoán điều ước."]
  };
  const help=Object.fromEntries(Object.entries(titles).map(([id,[source_title,teaching_vi]])=>[id,{source_title,teaching_vi,steps:["Hoàn thành đủ 10 lượt.","Đọc hoặc nghe bằng chứng trước khi chọn.","Điểm phụ thuộc thời gian, trợ giúp và số lần sai; hệ thống giữ thành tích tốt nhất."]}])) as Unit6Phase2Built["help"];
  help.plan.steps=["Bốn bước trong trang Project là gợi ý của trò chơi, không phải kiến thức nền.","Chọn đúng trình tự viết, treo, đọc và đoán điều ước.","Hoàn thành 10 lượt; câu sai có phản hồi và thành tích tốt nhất được giữ lại."];
  help.present={source_title:"Project · Now I can...",teaching_vi:"Dùng bảng Now I can để tự kiểm tra kỹ năng trước khi đọc và đoán điều ước.",steps:["Tám lượt đầu lấy trực tiếp các tiêu chí Now I can.","Hai lượt cuối kiểm tra cách đoán và phản hồi lịch sự.","Hoàn thành đủ 10 lượt; câu sai có phản hồi và thành tích tốt nhất được giữ lại."]};
  return {...source,games,help};
}

function hasImage(value:unknown):boolean{if(!value||typeof value!=="object")return false;if(Array.isArray(value))return value.some(hasImage);return Object.entries(value).some(([key,item])=>/^(image|photo|illustration|image_url)$/i.test(key)||hasImage(item));}
export function validateUnit6Phase2(source:Unit6Phase2Source):Unit6Phase2Built{
  if(source.lesson_id!=="unit6-phase2"||source.source_status!==ref||source.usage_scope!=="personal-family"||!source.source_note.includes("Track 41–43"))throw new Error("Unit 6 phase 2 provenance is invalid");
  if(hasImage(source))throw new Error("Unit 6 phase 2 must not embed textbook images");
  if(source.communication.wish_suggestions.length!==5||source.communication.picture_customs.length!==4||source.communication.world_customs.length!==5||source.skills1.passages.length!==3||source.skills1.who_statements.length!==5||source.skills1.memory_items.length!==8||source.skills1.speaking_activities.length!==6||source.skills1.advice_activities.length!==9||source.skills2.visible_items.length!==6||source.skills2.visible_questions.length!==5||source.skills2.replacement_audio.source_status!==ai||source.skills2.writing_prompts.length!==4||source.skills2.email_stems.length!==4||source.looking_back.collocations.length!==6||source.looking_back.vocabulary_answers.length!==5||source.looking_back.advice_sentences.length!==5||source.looking_back.some_any_answers.length!==6||source.project.steps.length!==4||source.project.example_wishes.length!==3||source.project.now_i_can.length!==8)throw new Error("Unit 6 phase 2 anchors changed");
  const built=buildUnit6Phase2(source);
  if(Object.keys(built.games).length!==25||Object.values(built.games).some(rounds=>rounds.length!==10||new Set(rounds.map(item=>item.id)).size!==10))throw new Error("Unit 6 phase 2 needs 25 games of ten rounds");
  for(const [id,rounds] of Object.entries(built.games))for(const item of rounds){if(!item.options.includes(item.answer)||new Set(item.options).size!==item.options.length||item.options.length<2||item.options.length>4)throw new Error(`${id}/${item.id} has an invalid answer`);if(item.audio_text&&item.audio_source_status!==ai)throw new Error(`${id}/${item.id} audio must be AI-labelled`);}
  return built;
}
