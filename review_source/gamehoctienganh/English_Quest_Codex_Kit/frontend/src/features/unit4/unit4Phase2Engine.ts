import type { CommonRound } from "../skills-common/SkillsSection";

export type Unit4Phase2GameId = "directions" | "landmarks" | "dialogue" | "route" | "mission" | "reading" | "evidence" | "map" | "speaking" | "summary" | "listening" | "details" | "order" | "writing" | "paragraph" | "places" | "directions_review" | "adjectives" | "comparatives" | "review" | "plan" | "project_map" | "notes" | "writer" | "present";
type Status = CommonRound["source_status"];
type Seed = { context: string; prompt: string; answer: string; status: Status; explanation?: string; audio?: string };
export type Unit4Phase2Source = {
  lesson_id:"unit4-phase2";source_status:"user-provided-reference";usage_scope:"personal-family";source_note:string;
  communication:{title:string;dialogues:Array<{ask:string;answer:string}>;audio_task:string;linkers:string[];replacement_guide:{source_status:"ai-generated";text:string;answers:string[]}};
  skills1:{title:string;vocabulary:string[];blog_paragraphs:string[];likes:string[];dislikes:string[];questions:Array<{question:string;answer:string}>;speaking_prompts:string[]};
  skills2:{title:string;visible_statements:string[];replacement_audio:{source_status:"ai-generated";text:string;truth:boolean[];details:string[]};writing_items:string[];paragraph_frames:string[]};
  looking_back:{places:string[];adjectives:string[];comparatives:Array<{adjective:string;answer:string}>;picture_comparisons:Array<{prompt:string;answer:string}>};
  project:{title:string;steps:string[];now_i_can:string[];fictional_map:{source_status:"ai-generated";start:string;places:string[]}};
};
export type Unit4Phase2Built = Unit4Phase2Source & {games:Record<Unit4Phase2GameId,CommonRound[]>;help:Record<Unit4Phase2GameId,{source_title:string;teaching_vi:string;steps:string[]}>};
const ref="user-provided-reference" as const,ai="ai-generated" as const;

function options(answer:string,pool:string[],index:number,count=3){
  const others=[...new Set(pool)].filter(item=>item!==answer);
  const selected:string[]=[];
  for(let offset=0;selected.length<Math.min(count-1,others.length);offset++){const value=others[(index+offset)%others.length];if(!selected.includes(value))selected.push(value);}
  return [answer,...selected];
}
function build(prefix:string,seeds:Seed[],pool?:string[]):CommonRound[]{
  const bank=pool??seeds.map(item=>item.answer);
  return seeds.map((item,index)=>({id:`${prefix}-${String(index+1).padStart(2,"0")}`,source_status:item.status,context:item.context,prompt:item.prompt,options:options(item.answer,bank,index,bank.length===2?2:3),answer:item.answer,explanation_vi:item.explanation??`Đáp án phù hợp là “${item.answer}”.`,...(item.audio?{audio_text:item.audio,audio_source_status:"ai-generated" as const}:{})}));
}
const s=(context:string,prompt:string,answer:string,status:Status=ai,explanation?:string,audio?:string):Seed=>({context,prompt,answer,status,explanation,audio});

function buildGames(source:Unit4Phase2Source):Record<Unit4Phase2GameId,CommonRound[]>{
  const dialoguePool=[...source.communication.dialogues.map(item=>item.answer),"Go straight and turn left.","Take the second turning on the right.","It's opposite the park.","Go past the bank.","Cross the road at the lights.","It's next to the market.","Go along this street and turn right.","The library is on your left."];
  const directions=build("u4-cd",[
    ...source.communication.dialogues.map(item=>s(item.ask,"Choose the correct reply.",item.answer,ref)),
    s("How can I get to the library?","Choose the clearest direction.","Go straight and turn left."),s("Where is the café?","Choose the direction.","It's opposite the park."),s("Could you tell me the way to the market?","Choose the direction.","Cross the road at the lights."),s("Where's the nearest bank?","Choose the direction.","Go past the bank."),s("How do I get to the bus stop?","Choose the direction.","Take the second turning on the right."),s("Where is the cinema?","Choose the direction.","It's next to the market."),s("Could you tell me the way to the school?","Choose the direction.","Go along this street and turn right."),s("Where is the library?","Choose the direction.","The library is on your left.")
  ],dialoguePool);
  const landmarkSeeds:[string,string][]=[["You can watch films here.","cinema"],["You can send letters here.","post office"],["You can see old objects here.","museum"],["You can watch a play here.","opera house"],["You can borrow books here.","library"],["You can buy food here.","market"],["You can wait for a bus here.","bus stop"],["You can see a doctor here.","hospital"],["You can drink coffee here.","café"],["You can exercise outdoors here.","park"]];
  const landmarks=build("u4-cl",landmarkSeeds.map(([context,answer],index)=>s(context,"Which landmark is it?",answer,index<4?ref:ai)),landmarkSeeds.map(item=>item[1]));
  const dialogue=build("u4-cg",[
    s("Excuse me. Could you tell me the way to the cinema, please?","Choose B's reply.",source.communication.dialogues[0].answer,ref),s("Excuse me. Where's the nearest post office, please?","Choose B's reply.",source.communication.dialogues[1].answer,ref),
    s("___ Could you tell me the way to the cinema, please?","Choose the polite opening.","Excuse me.",ref),s("Go along this street. ___","Complete the direction.","It's on your left.",ref),
    s("Excuse me. Where's the nearest library, please?","Choose the helpful reply.","Go straight. It's on your right."),s("Could you tell me the way to the park?","Choose the helpful reply.","Turn left at the bank."),s("Where is the nearest bus stop?","Choose the helpful reply.","Go out of the school and turn right."),s("How can I get to the market?","Choose the helpful reply.","Cross the road. It's opposite the café."),s("Could you show me the way to the hospital?","Choose the helpful reply.","Take the first turning on the left."),s("Thank you for your help.","Choose the polite response.","You're welcome.")
  ],[...dialoguePool,"Excuse me.","It's on your left.","Go straight. It's on your right.","Turn left at the bank.","Go out of the school and turn right.","Cross the road. It's opposite the café.","Take the first turning on the left.","You're welcome."]);
  const route=build("u4-cr",[
    s("___, go to the museum.","Choose the opening linker.","First",ref),s("First, go straight. ___, turn left.","Choose the next linker.","Then",ref),s("Visit the museum. ___, walk to the opera house.","Choose the linker.","After that",ref),s("___, return to the starting point.","Choose the final linker.","Finally",ref),
    s("Begin the tour.","Which linker begins a route?","First"),s("Add the second action.","Which linker is suitable?","Then"),s("Add another later action.","Which linker is suitable?","After that"),s("End the tour.","Which linker is suitable?","Finally"),s("First → ___ → After that → Finally","Complete the sequence.","Then"),s("First → Then → ___ → Finally","Complete the sequence.","After that")
  ],["First","Then","After that","Finally"]);
  const guide=source.communication.replacement_guide;
  const mission=build("u4-cm",[
    s(guide.text,"What is the first direction?","go straight",ai,undefined,guide.text),s(guide.text,"Which turning should the visitor take?","the second turning",ai,undefined,guide.text),s(guide.text,"Where is the museum after the turn?","on the right",ai,undefined,guide.text),s(guide.text,"Where is the workshop?","opposite Tan Ky House",ai,undefined,guide.text),
    s("First, go straight. Then turn left.","Which action happens first?","go straight"),s("After the museum, visit the workshop.","Which place comes last?","the workshop"),s("The café is opposite the museum.","Where is the café?","opposite the museum"),s("Take the first turning on the right.","Which turning is needed?","the first turning"),s("The cinema is on your left.","Where is the cinema?","on the left"),s("Finally, return to the station.","What is the final destination?","the station")
  ],["go straight","the second turning","on the right","opposite Tan Ky House","the workshop","opposite the museum","the first turning","on the left","the station"]);

  const reading=build("u4-s1r",[
    s("I live in the suburbs of Da Nang City.","What does suburbs mean here?","areas outside the city centre",ref),s("There are two things I dislike about it.","What does dislike mean?","not like",ref),s("It's great for outdoor activities.","What does outdoor mean?","done outside",ref),
    s(source.skills1.blog_paragraphs[1],"Which activity fits the paragraph?","walking in a park",ai),s(source.skills1.blog_paragraphs[1],"Which place is mentioned?","sandy beaches",ai),s(source.skills1.blog_paragraphs[1],"What can people buy food at?","markets",ai),s(source.skills1.blog_paragraphs[2],"Which buildings does Khang dislike?","modern buildings and offices",ai),s(source.skills1.blog_paragraphs[2],"Which words describe the streets?","busy and crowded",ai),s(source.skills1.blog_paragraphs[0],"Which city is named?","Da Nang City",ai),s(source.skills1.blog_paragraphs[1],"How is the food compared with other places?","better",ai)
  ]);
  const likeDislike=[...source.skills1.likes.map(item=>s(item,"Classify Khang's opinion.","like",ref)),...source.skills1.dislikes.map(item=>s(item,"Classify Khang's opinion.","dislike",ref)),s("clean air","Classify this new positive feature.","like"),s("heavy traffic","Classify this new negative feature.","dislike")];
  const evidence=build("u4-s1e",likeDislike,["like","dislike"]);
  const map=build("u4-s1m",[
    ...source.skills1.questions.map(item=>s(source.skills1.blog_paragraphs.join(" "),item.question,item.answer,ref)),
    s(source.skills1.blog_paragraphs[1],"Name one outdoor place.","beautiful parks"),s(source.skills1.blog_paragraphs[1],"Name another outdoor place.","sandy beaches"),s(source.skills1.blog_paragraphs[1],"What is the weather like?","fine"),s(source.skills1.blog_paragraphs[1],"What three shopping or eating places are listed?","shops, restaurants, and markets"),s(source.skills1.blog_paragraphs[2],"How many kinds of things does Khang dislike?","two"),s(source.skills1.blog_paragraphs[1],"How is the food?","better than in other places")
  ]);
  const speaking=build("u4-s1s",[
    s("Sample interview about fictional Green Town",source.skills1.speaking_prompts[0],"I live in Green Town."),s("Sample interview about fictional Green Town",source.skills1.speaking_prompts[1],"I like its quiet parks."),s("Sample interview about fictional Green Town",source.skills1.speaking_prompts[2],"I dislike the heavy traffic."),
    s("Ask about location.","Choose the correct question.","Where do you live?"),s("Ask about a positive feature.","Choose the correct question.","What do you like about it?"),s("Ask about a negative feature.","Choose the correct question.","What do you dislike about it?"),s("Answer about friendly people.","Choose a complete answer.","The people are helpful and friendly."),s("Answer about streets.","Choose a complete answer.","The streets are peaceful."),s("Give a reason.","Complete: I like the park because ...","it is beautiful"),s("Report a classmate's answer.","Choose the clear report.","Lan Anh likes the quiet streets.")
  ]);
  const summary=build("u4-s1u",[
    s("Khang lives in the ___ of Da Nang City.","Complete the summary.","suburbs",ref),s("The neighbourhood is great for ___ activities.","Complete the summary.","outdoor",ref),s("It has beautiful parks and sandy ___.","Complete the summary.","beaches",ref),s("The people are ___.","Complete the summary.","friendlier",ref),s("The food is ___.","Complete the summary.","better",ref),s("The streets are busy and ___.","Complete the summary.","crowded",ref),s("There are many modern buildings and ___.","Complete the summary.","offices",ref),s("Khang likes the fine ___.","Complete the summary.","weather"),s("He can shop at markets and ___.","Complete the summary.","shops"),s("He dislikes ___ things about the neighbourhood.","Complete the summary.","two")
  ]);

  const listening=build("u4-s2l",source.skills2.visible_statements.map((statement,index)=>s(statement,"True or false according to the replacement recording?",source.skills2.replacement_audio.truth[index]?"True":"False",ai,"Đây là script luyện nghe mới vì Track 29 không có trong đầu vào.",source.skills2.replacement_audio.text)).concat([
    s("Vy likes the helpful people.","True or false?","True",ai,undefined,source.skills2.replacement_audio.text),s("Vy likes the dirty air.","True or false?","False",ai,undefined,source.skills2.replacement_audio.text),s("There are no shops near Vy.","True or false?","False",ai,undefined,source.skills2.replacement_audio.text),s("Vy dislikes the noisy streets.","True or false?","True",ai,undefined,source.skills2.replacement_audio.text),s("The streets are crowded.","True or false?","True",ai,undefined,source.skills2.replacement_audio.text)
  ]),["True","False"]);
  const detailContexts=["many shops, restaurants, and ___","___ streets","helpful and ___ people","too ___ schools","noisy and ___ streets"];
  const details=build("u4-s2d",source.skills2.replacement_audio.details.map((answer,index)=>s(detailContexts[index],"Listen and choose the missing detail.",answer,ai,"Script nghe thay thế có đáp án xác định.",source.skills2.replacement_audio.text)).concat([
    s("Vy lives near the ___.","Choose the missing detail.","city centre",ai,undefined,source.skills2.replacement_audio.text),s("There is a big ___ near her house.","Choose the missing detail.","market",ai,undefined,source.skills2.replacement_audio.text),s("There are some ___ nearby.","Choose the missing detail.","factories",ai,undefined,source.skills2.replacement_audio.text),s("Vy dislikes the dirty ___.","Choose the missing detail.","air",ai,undefined,source.skills2.replacement_audio.text),s("Vy likes many shops and ___.","Choose the missing detail.","restaurants",ai,undefined,source.skills2.replacement_audio.text)
  ]));
  const order=build("u4-s2o",[
    s("city centre → market → streets","Which topic comes first in the recording?","city centre"),s("market → streets → schools","Which topic comes second?","streets"),s("streets → schools → factories","Which topic comes last?","factories"),s("likes → dislikes","Which section comes first?","likes"),s("shops → streets → people","Which liked feature comes second?","streets"),s("schools → air → streets","Which disliked feature comes last?","streets"),s("location → places → opinions","Which topic begins a profile?","location"),s("First: location. Then: features. Finally: opinions.","What comes finally?","opinions"),s("wide but noisy and crowded","Which adjective is positive?","wide"),s("helpful and friendly","Which word comes after helpful?","friendly")
  ]);
  const writing=build("u4-s2w",source.skills2.writing_items.map((item,index)=>s(`Lan Anh's fictional Green Town profile: ${item}`,"How does Lan Anh classify this feature?",["like","dislike","dislike","like","like","like","like","like"][index],ai,"Đây là sở thích của nhân vật hư cấu, không phải một đáp án đúng chung cho mọi học sinh.")).concat([s("Lan Anh's fictional profile: dirty air","How does Lan Anh classify this feature?","dislike"),s("Lan Anh's fictional profile: beautiful parks","How does Lan Anh classify this feature?","like")]),["like","dislike"]);
  const paragraph=build("u4-s2p",[
    s("Fictional paragraph opening","Choose the best opening.","I live in a quiet neighbourhood."),s("Fictional paragraph: introduce likes","Choose the best sentence.",source.skills2.paragraph_frames[1]),s("Fictional paragraph: introduce dislikes","Choose the best linker.",source.skills2.paragraph_frames[2]),
    s("Positive detail","Choose a complete sentence.","It has beautiful parks and good cafés."),s("People","Choose a complete sentence.","The people are helpful and friendly."),s("Negative detail","Choose a complete sentence.","The traffic is heavy and noisy."),s("Reason","Complete: I like the park because ...","it is peaceful"),s("Contrast","Choose the correct linker.","However"),s("Closing opinion","Choose the best ending.","Overall, it is a great place to live."),s("Paragraph order","Which sentence should come first?","I live in Green Town.")
  ]);

  const placeClues=[["A religious building.","temple"],["Trains stop here.","railway station"],["An open area in a town.","square"],["You can see paintings here.","art gallery"],["A large important church.","cathedral"],["You can borrow books here.","library"],["You can watch films here.","cinema"],["You can buy food here.","market"],["You can exercise here.","gym"],["You can wait for a bus here.","bus stop"]];
  const places=build("u4-lp",placeClues.map(([context,answer],index)=>s(context,"Name the place.",answer,index<5?ref:ai)),placeClues.map(item=>item[1]));
  const directionsReview=build("u4-ld",[
    s("↰","Choose the direction.","turn left"),s("↱","Choose the direction.","turn right"),s("↑","Choose the direction.","go straight"),s("A road is in front of you.","Choose the safe action.","cross the road"),s("The destination is beside the park.","Choose the position phrase.","next to the park"),s("The bank faces the café.","Choose the position phrase.","opposite the café"),s("The cinema is to your right.","Choose the direction.","on your right"),s("Use the second road on the left.","Choose the instruction.","take the second turning on the left"),s("Continue on this street.","Choose the instruction.","go along this street"),s("The library is behind the school.","Choose the position phrase.","behind the school")
  ]);
  const syllables:Record<string,string>={fast:"one syllable",heavy:"two syllables",hot:"one syllable",noisy:"two syllables",large:"one syllable",quiet:"two syllables",expensive:"three syllables",beautiful:"three syllables",exciting:"three syllables",modern:"two syllables"};
  const adjectives=build("u4-la",Object.entries(syllables).map(([word,answer],index)=>s(word,"How many syllables?",answer,index<9?ref:ai)),["one syllable","two syllables","three syllables"]);
  const compSeeds=[...source.looking_back.comparatives.map(item=>s(item.adjective,"Choose the comparative form.",item.answer,ref)),s("modern","Choose the comparative form.","more modern")];
  const comparatives=build("u4-lc",compSeeds,compSeeds.map(item=>item.answer));
  const review=build("u4-lr",source.looking_back.picture_comparisons.map(item=>s(item.prompt,"Complete the comparison.",item.answer,ref)).concat([
    s("The city is ___ than the village. (busy)","Complete the comparison.","busier"),s("This park is ___ than that one. (beautiful)","Complete the comparison.","more beautiful"),s("The new road is ___ than the old road. (wide)","Complete the comparison.","wider"),s("The market is ___ than the shop. (crowded)","Complete the comparison.","more crowded"),s("The village is ___ than the city. (quiet)","Complete the comparison.","quieter"),s("The station is ___ than the bus stop. (large)","Complete the comparison.","larger")
  ]));

  const plan=build("u4-pp",[
    s(source.project.steps[0],"What is the first project action?","draw a neighbourhood map",ref),s(source.project.steps[0],"How many places are needed at least?","five",ref),s(source.project.steps[1],"What do partners practise?","asking for and giving directions",ref),s(source.project.steps[1],"How should partners work?","take turns",ref),
    s("Plan a map.","What should be chosen first?","a starting point"),s("Add useful locations.","Which place helps travellers?","a bus stop"),s("Make routes clear.","What should roads have?","street names"),s("Check the map.","What must every route reach?","a destination"),s("Prepare to speak.","What should the speaker rehearse?","direction sentences"),s("Respect privacy.","Which map is safest for the app?","a fictional map")
  ]);
  const mapPlaces=source.project.fictional_map.places;
  const projectMap=build("u4-pm",[
    s("Start at the school. Go straight. It is on your left.","Which place is it?","park"),s("Start at the school. Turn right at the park.","Which place is it?","cinema"),s("The café is opposite the library.","Which place faces the café?","library"),s("The bus stop is next to the market.","Which place is beside the market?","bus stop"),s("The hospital is behind the library.","Which place is behind the library?","hospital"),s("You can borrow books here.","Which place?","library"),s("You can see a film here.","Which place?","cinema"),s("You can buy vegetables here.","Which place?","market"),s("You can wait for transport here.","Which place?","bus stop"),s("You can see a doctor here.","Which place?","hospital")
  ],mapPlaces);
  const notes=build("u4-pn",[
    s("Map requirement","Choose the useful note.","Include at least five places."),s("Direction requirement","Choose the useful note.","Use clear direction verbs."),s("Speaking requirement","Choose the useful note.","Take turns with a partner."),s("Starting point","Choose the useful note.","Mark You are here."),s("Road design","Choose the useful note.","Give streets simple names."),s("Landmarks","Choose the useful note.","Use familiar public places."),s("Route order","Choose the useful note.","Use first, then and finally."),s("Grammar","Choose the useful note.","Use imperatives for directions."),s("Privacy","Choose the useful note.","Do not add a real home address."),s("Final check","Choose the useful note.","Make sure every route is possible.")
  ]);
  const writer=build("u4-pw",[
    s("school → park","Choose a clear direction.","Go straight. The park is on your left."),s("park → cinema","Choose a clear direction.","Turn right at the park."),s("cinema → café","Choose a clear direction.","Go along Green Street."),s("café → library","Choose a clear direction.","The library is opposite the café."),s("library → hospital","Choose a clear direction.","The hospital is behind the library."),s("school → market","Choose a route opener.","First, go straight."),s("Add the next action.","Choose a linker.","Then, turn left."),s("Add another action.","Choose a linker.","After that, cross the road."),s("End the route.","Choose a linker.","Finally, the market is on your right."),s("Ask for a route.","Choose the polite question.","Could you tell me the way to the library, please?")
  ]);
  const selfCheckAreas=["Vocabulary","Pronunciation","Grammar","Communication","Reading","Speaking","Listening","Writing"];
  const present=build("u4-pt",source.project.now_i_can.map((skill,index)=>s(`Now I can: ${skill}`,"Which learning area does this self-check belong to?",selfCheckAreas[index],ref)).concat([
    s("Your neighbourhood map is complete.","What should you do with a partner?","Practise directions"),
    s("Your route is clear and correct.","What is the final Project action?","Presentation")
  ]),["Vocabulary","Pronunciation","Grammar","Communication","Reading","Speaking","Listening","Writing","Practise directions","Presentation"]);
  return {directions,landmarks,dialogue,route,mission,reading,evidence,map,speaking,summary,listening,details,order,writing,paragraph,places,directions_review:directionsReview,adjectives,comparatives,review,plan,project_map:projectMap,notes,writer,present};
}

const gameHelp=(title:string,teaching_vi:string)=>({source_title:title,teaching_vi,steps:["Hoàn thành đủ 10 lượt.","Đọc hoặc nghe bằng chứng trước khi chọn.","Điểm từng câu phụ thuộc thời gian, trợ giúp và số lần sai; hệ thống giữ thành tích tốt nhất."]});
export function buildUnit4Phase2(source:Unit4Phase2Source):Unit4Phase2Built{
  const games=buildGames(source),titles:Record<Unit4Phase2GameId,[string,string]>={
    directions:["Communication · Bài 1–2","Hỏi và chỉ đường lịch sự."],landmarks:["Communication · Places","Nhận biết địa điểm từ chức năng."],dialogue:["Communication · Dialogue Lab","Hoàn chỉnh hội thoại chỉ đường."],route:["Communication · Bài 4","Dùng từ nối để tổ chức lộ trình."],mission:["Communication · Audio guide","Nghe script thay thế và xác định lộ trình."],
    reading:["Skills 1 · Bài 1","Hiểu từ trong ngữ cảnh blog."],evidence:["Skills 1 · Bài 2","Phân loại điều Khang thích và không thích."],map:["Skills 1 · Bài 3","Trả lời bằng bằng chứng trong blog."],speaking:["Skills 1 · Bài 4–5","Chuẩn bị hỏi đáp về khu phố hư cấu."],summary:["Skills 1 · Summary","Tóm tắt blog bằng từ khóa."],
    listening:["Skills 2 · Bài 1","Nghe script mới và xác định đúng/sai."],details:["Skills 2 · Bài 2","Nghe chi tiết và điền từ."],order:["Skills 2 · Listening map","Sắp trình tự thông tin nghe."],writing:["Skills 2 · Bài 3","Phân loại ý thích và không thích."],paragraph:["Skills 2 · Bài 4","Xây đoạn văn khoảng 50 từ."],
    places:["Looking Back · Bài 1","Ôn tên địa điểm."],directions_review:["Looking Back · Directions","Ôn câu chỉ đường và vị trí."],adjectives:["Looking Back · Bài 2","Phân loại tính từ theo số âm tiết."],comparatives:["Looking Back · Bài 3","Viết dạng so sánh hơn."],review:["Looking Back · Bài 4","Hoàn thành câu so sánh."],
    plan:["Project · Bài 1–2","Lập kế hoạch bản đồ và hội thoại."],project_map:["Project · My Map","Đọc bản đồ khu phố hư cấu."],notes:["Project · Notes","Chọn ghi chú thiết kế hữu ích."],writer:["Project · Directions","Viết chỉ dẫn theo bản đồ."],present:["Project · Show and Tell","Chuẩn bị trình bày bản đồ."]
  };
  const help=Object.fromEntries(Object.entries(titles).map(([id,[title,teaching]])=>[id,gameHelp(title,teaching)])) as Unit4Phase2Built["help"];
  help.plan.steps=["Hai yêu cầu trong trang Project là gợi ý của trò chơi, không phải kiến thức nền.","Chọn đúng cách vẽ bản đồ và luyện hỏi–chỉ đường theo cặp.","Hoàn thành 10 lượt; câu sai có phản hồi và thành tích tốt nhất được giữ lại."];
  help.present={source_title:"Project · Now I can...",teaching_vi:"Dùng bảng Now I can để tự kiểm tra kỹ năng trước khi trình bày bản đồ.",steps:["Tám lượt đầu lấy trực tiếp các tiêu chí Now I can.","Hai lượt cuối kiểm tra luyện theo cặp và trình bày.","Hoàn thành đủ 10 lượt; câu sai có phản hồi và thành tích tốt nhất được giữ lại."]};
  return {...source,games,help};
}
function hasImage(value:unknown):boolean{if(!value||typeof value!=="object")return false;if(Array.isArray(value))return value.some(hasImage);return Object.entries(value).some(([key,child])=>/^(image|photo|illustration|image_url)$/i.test(key)||hasImage(child));}
export function validateUnit4Phase2(source:Unit4Phase2Source):Unit4Phase2Built{
  if(source.lesson_id!=="unit4-phase2"||source.source_status!==ref||source.usage_scope!=="personal-family"||!source.source_note.trim())throw new Error("Unit 4 phase 2 provenance is invalid");
  if(hasImage(source))throw new Error("Unit 4 phase 2 must not embed textbook images");
  if(source.communication.dialogues.length!==2||source.communication.linkers.length!==4||source.skills1.vocabulary.length!==3||source.skills1.questions.length!==4||source.skills2.visible_statements.length!==5||source.looking_back.places.length!==5||source.looking_back.comparatives.length!==9||source.project.steps.length!==2||source.project.now_i_can.length!==8)throw new Error("Unit 4 phase 2 source anchors changed");
  if(source.communication.replacement_guide.source_status!==ai||source.skills2.replacement_audio.source_status!==ai||source.project.fictional_map.source_status!==ai)throw new Error("Unit 4 replacement content must be AI-labelled");
  const built=buildUnit4Phase2(source),ids=Object.keys(built.games);
  if(ids.length!==25||Object.values(built.games).some(items=>items.length!==10||new Set(items.map(item=>item.id)).size!==10))throw new Error("Unit 4 phase 2 needs 25 games of ten rounds");
  for(const [id,items] of Object.entries(built.games))for(const item of items){if(!item.options.includes(item.answer)||new Set(item.options).size!==item.options.length||item.options.length<2||item.options.length>4)throw new Error(`${id}/${item.id} has an invalid answer`);if(item.audio_text&&item.audio_source_status!==ai)throw new Error(`${id}/${item.id} replacement audio is not labelled`);}
  return built;
}
