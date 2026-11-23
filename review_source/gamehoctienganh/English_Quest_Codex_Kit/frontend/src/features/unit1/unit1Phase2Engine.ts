import type { CommonRound } from "../skills-common/SkillsSection";

export type Unit1Phase2GameId="introducing"|"dialogue"|"questions"|"friends"|"mission"|"reading"|"evidence"|"school"|"speaking"|"summary"|"listening"|"details"|"order"|"writing"|"paragraph"|"vocabulary"|"collocations"|"present_simple"|"frequency"|"review"|"plan"|"research"|"notes"|"writer"|"present";
type Status=CommonRound["source_status"];
type Seed={context:string;prompt:string;answer:string;status:Status;audio?:string};
export type Unit1Phase2Source={
  lesson_id:"unit1-phase2";source_status:"user-provided-reference";usage_scope:"personal-family";source_note:string;
  communication:{introduction_dialogue:Array<{speaker:string;text:string}>;candidate_questions:Array<{question:string;suitable:boolean}>;friend_quiz:string[]};
  skills1:{passages:Array<{school:string;text:string}>;matches:Array<{school:string;description:string}>;fill_answers:string[];questions:Array<{question:string;answer:string}>};
  skills2:{visible_choices:Array<{question:string;answer:string}>;replacement_audio:{source_status:"ai-generated";script:string};writing_prompts:string[]};
  looking_back:{vocabulary_answers:string[];collocations:string[];present_simple_answers:string[];text_forms:string[];frequency_sentences:string[]};
  project:{title:string;steps:string[];design_prompts:string[];now_i_can:string[];fictional_school:{source_status:"ai-generated";name:string;location:string;classes:string;activities:string;highlight:string}};
};
export type Unit1Phase2Built=Unit1Phase2Source&{games:Record<Unit1Phase2GameId,CommonRound[]>;help:Record<Unit1Phase2GameId,{source_title:string;teaching_vi:string;steps:string[]}>};

const ref="user-provided-reference" as const,ai="ai-generated" as const;
const seed=(context:string,prompt:string,answer:string,status:Status=ai,audio?:string):Seed=>({context,prompt,answer,status,audio});
function options(answer:string,pool:string[],index:number){const other=[...new Set(pool)].filter(item=>item!==answer);return [answer,other[index%other.length],other[(index+2)%other.length],other[(index+4)%other.length]].filter((item,i,all)=>all.indexOf(item)===i).slice(0,4);}
function build(prefix:string,seeds:Seed[],pool?:string[]):CommonRound[]{const bank=pool??seeds.map(item=>item.answer);return seeds.map((item,index)=>({id:`${prefix}-${String(index+1).padStart(2,"0")}`,source_status:item.status,context:item.context,prompt:item.prompt,options:options(item.answer,bank,index),answer:item.answer,explanation_vi:`Đáp án phù hợp là “${item.answer}”.`,...(item.audio?{audio_text:item.audio,audio_source_status:"ai-generated" as const}:{})}));}

export function buildUnit1Phase2(source:Unit1Phase2Source):Unit1Phase2Built{
  const intro=source.communication.introduction_dialogue;
  const introducingSeeds=[
    ...intro.map(item=>seed(item.text,"Who says this?",item.speaker,ref)),
    seed("Lan Anh, this is Minh Khoa, my classmate.","Who is being introduced?","Minh Khoa"),
    seed("Bảo Ngọc, meet my friend Lan Anh.","Who is the new friend?","Lan Anh"),
    seed("This is our new classmate, Nam.","Who is introduced?","Nam"),
    seed("Mai, this is my friend Hoa.","Choose the polite reply.","Nice to meet you, Hoa."),
    seed("A new student meets the class.","Choose the introduction.","Class, this is Minh Khoa."),
    seed("Duy meets Vy for the first time.","Choose a polite greeting.","Nice to meet you, Vy."),
    seed("Introduce Bảo Ngọc to Lan Anh.","Choose the sentence.","Lan Anh, this is Bảo Ngọc.")
  ];
  const introducing=build("u1-cin",introducingSeeds);
  const dialogueSeeds=[
    seed(intro[0].text,"Choose Phong's next line.",intro[1].text,ref),
    seed(intro[1].text,"Choose Duy's reply.",intro[2].text,ref),
    seed(intro[2].text,"What does this reply express?","a polite first meeting",ref),
    seed("This is Lan Anh, my new friend.","Choose a reply.","Hi, Lan Anh. Nice to meet you."),
    seed("Nice to meet you, Minh Khoa.","Choose a reply.","Nice to meet you too."),
    seed("Introduce a classmate.","Choose a complete sentence.","This is Bảo Ngọc, my classmate."),
    seed("A teacher introduces Nam.","Choose the greeting.","Hello, Nam. Welcome to our class."),
    seed("Two new friends finish an introduction.","Choose the closing.","See you in class."),
    seed("Lan Anh meets Duy.","Choose the natural first line.","Hi, Duy. I'm Lan Anh."),
    seed("Minh Khoa meets a new classmate.","Choose the polite response.","It's nice to meet you.")
  ];
  const dialogue=build("u1-cdi",dialogueSeeds);
  const questionSeeds=[...source.communication.candidate_questions.map(item=>seed(item.question,"Is this suitable for a new school friend?",item.suitable?"Suitable":"Not suitable",ref)),seed("Which club do you like?","Is this suitable for a new school friend?","Suitable"),seed("What is your family password?","Is this suitable for a new school friend?","Not suitable")];
  const questions=build("u1-cqu",questionSeeds,["Suitable","Not suitable"]);
  const friendItems=[...source.communication.friend_quiz,"Do you greet a new classmate?","Do you speak kindly to your classmates?"];
  const friends=build("u1-cfr",friendItems.map((item,index)=>seed(item,"Which answer shows a good-friend habit?","Yes",index<8?ref:ai)),["Yes","No"]);
  const answerBank=["Yes, I live near here.","Yes, I like music.","Science is my favourite subject.","Yes, I play football.","I go to school by bicycle.","I like the art club.","I study English after school.","Yes, I enjoy reading.","I usually have lunch at school.","I like maths lessons."];
  const mission=build("u1-cmi",[...source.communication.candidate_questions.filter(item=>item.suitable).map((item,index)=>seed(item.question,"Choose a suitable fictional answer.",answerBank[index],ref)),seed("Which club do you like?","Choose a suitable fictional answer.",answerBank[5]),seed("What do you study after school?","Choose a suitable fictional answer.",answerBank[6]),seed("Do you enjoy reading?","Choose a suitable fictional answer.",answerBank[7]),seed("Where do you have lunch?","Choose a suitable fictional answer.",answerBank[8]),seed("Which lesson do you like?","Choose a suitable fictional answer.",answerBank[9])],answerBank);

  const readingSeeds=[...source.skills1.matches.map(item=>seed(item.description,"Which school is described?",item.school,ref)),seed("Students study and live at school.","Which school?","Sunrise",ref),seed("The school has only eight classes.","Which school?","An Son",ref),seed("Students learn with English-speaking teachers.","Which school?","Dream",ref),seed("Students come from all over Australia.","Which school?","Sunrise",ref),seed("There is a garden and a playground.","Which school?","An Son",ref),seed("Students join clubs in the afternoon.","Which school?","Dream",ref),seed("This school is in Sydney.","Which school?","Sunrise",ref)];
  const reading=build("u1-s1r",readingSeeds,["Sunrise","An Son","Dream"]);
  const fillContexts=["Sunrise is a ___ school.","An Son School is in ___.","There are ___ around An Son School.","___ has an art club.","At Dream School, students learn English with ___."];
  const evidence=build("u1-s1e",[...source.skills1.fill_answers.map((answer,index)=>seed(fillContexts[index],"Choose the missing words.",answer,ref)),seed("Sunrise has about ___ students.","Choose the answer.","1,200"),seed("An Son has ___ classes.","Choose the answer.","8"),seed("Dream is an ___ school.","Choose the answer.","international"),seed("An Son has a computer room and a ___.","Choose the answer.","library"),seed("Dream students join clubs in the ___.","Choose the answer.","afternoon")]);
  const school=build("u1-s1c",[...source.skills1.questions.map(item=>seed(item.question,"Choose the answer.",item.answer,ref)),seed("Where is Sunrise School?","Choose the answer.","Sydney"),seed("How many students go to Sunrise?","Choose the answer.","about 1,200"),seed("What surrounds An Son School?","Choose the answer.","mountains and green fields"),seed("What rooms does An Son have?","Choose the answer.","a computer room and a library"),seed("Who teaches English at Dream?","Choose the answer.","English-speaking teachers"),seed("Which club has painting?","Choose the answer.","the art club")]);
  const choiceReasons=["It is a boarding school.","It has a garden and playground.","It has interesting clubs.","Students study and live there.","It is near mountains and green fields.","Students learn with English-speaking teachers.","It has an art club.","It has a library.","Students play sports and games.","It welcomes students from across Australia."];
  const schoolChoices=["Sunrise","An Son","Dream","Sunrise","An Son","Dream","Dream","An Son","Dream","Sunrise"];
  const speaking=build("u1-s1s",choiceReasons.map((reason,index)=>seed(reason,"Which school matches this reason?",schoolChoices[index],index<3?ref:ai)),["Sunrise","An Son","Dream"]);
  const summary=build("u1-s1m",readingSeeds.map((item,index)=>seed(item.context,"Choose the school for the summary.",item.answer,index<3?ref:ai)),["Sunrise","An Son","Dream"]);

  const script=source.skills2.replacement_audio.script;
  const listenExtras=[{question:"Where is Palmer School?",answer:"in America"},{question:"How long does Janet study Vietnamese each week?",answer:"two hours"},{question:"What lesson will be on a farm?",answer:"biology"},{question:"Where does Janet do homework?",answer:"in the library"},{question:"What is Janet talking about?",answer:"her school"}];
  const listenItems=[...source.skills2.visible_choices,...listenExtras];
  const listening=build("u1-s2l",listenItems.map((item,index)=>seed(item.question,"Listen and choose the answer.",item.answer,index<5?ref:ai,script)),listenItems.map(item=>item.answer));
  const details=build("u1-s2d",listenItems.map((item,index)=>seed(item.question,"Choose the short answer from the talk.",item.answer,index<5?ref:ai,script)),listenItems.map(item=>item.answer));
  const orderSteps=["Janet names Palmer School.","She talks about her science teacher.","She says she is not wearing a uniform.","She mentions Vietnamese lessons.","She explains where she does homework.","She mentions a farm lesson.","The school is in America.","Vietnamese takes two hours a week.","Homework is usually done in the library.","The biology lesson will be on a farm."];
  const order=build("u1-s2o",orderSteps.map((item,index)=>seed(`Listening detail ${index+1}`,"Choose the matching detail.",item)),orderSteps);
  const fictional=source.project.fictional_school;
  const fixedWritingAnswers=[fictional.name,fictional.location,fictional.classes,fictional.activities,fictional.highlight];
  const writing=build("u1-s2w",[...source.skills2.writing_prompts.map((prompt,index)=>seed(prompt,"Choose the fictional note.",fixedWritingAnswers[index],ref)),seed("Which note protects privacy?","Choose the safe note.","The school is in a small town."),seed("What can students do?","Choose the fictional note.","They can read and play sports."),seed("What is near the classrooms?","Choose the fictional note.","a green playground"),seed("Who helps students?","Choose the fictional note.","friendly teachers"),seed("What should the writer avoid?","Choose the answer.","real addresses and private details")]);
  const paragraphSentences=["My school is River School.","It is in a small town.","It has twelve classes.","Students study and play sports there.","They read in the library.","They also work in the garden.","The teachers are friendly.","The playground is green.","I like the school library.","River School is a friendly place."];
  const paragraph=build("u1-s2p",paragraphSentences.map(sentence=>seed(sentence,"Choose a sentence for the fictional paragraph.",sentence)),paragraphSentences);

  const vocabClues=["clothes students wear at school","a tool that makes pencils sharp","a book for writing notes","a tool for drawing circles","a tool for calculations","a tool for drawing straight lines","a case for pens and pencils","a bag for school books","a book of lessons","a tool for removing pencil marks"];
  const vocabAnswers=[...source.looking_back.vocabulary_answers,"pencil case","school bag","textbook","rubber"];
  const vocabulary=build("u1-lbv",vocabAnswers.map((answer,index)=>seed(vocabClues[index],"Choose the school word.",answer,index<6?ref:ai)),vocabAnswers);
  const collocationItems=[...source.looking_back.collocations,"play football","do homework","have English","study science","wear shoes"];
  const collocations=build("u1-lbc",collocationItems.map((phrase,index)=>{const[verb,...rest]=phrase.split(" ");return seed(rest.join(" "),"Choose the matching verb.",verb,index<5?ref:ai);}),["study","do","play","have","wear"]);
  const presentContexts=["He ___ from Da Nang.","___ Russian? — No, I don't.","She always ___ to school.","I often ___ my homework.","Mr Nam ___ history.","Hoang's house ___ near his school.","He ___ breakfast at six.","Then he ___ to school.","Hoang and his friends ___ in grade 6.","Hoang ___ his new school."];
  const presentAnswers=[...source.looking_back.present_simple_answers,...source.looking_back.text_forms];
  const present_simple=build("u1-lbp",presentAnswers.map((answer,index)=>seed(presentContexts[index],"Choose the correct present-simple form.",answer,index<5?ref:ai)),presentAnswers);
  const frequency=build("u1-lbf",[...source.looking_back.frequency_sentences.map((sentence,index)=>seed(sentence,"Choose the adverb in the sentence.",["always","usually","often","rarely","sometimes"][index],ref)),seed("Lan Anh never arrives late.","Choose the adverb.","never"),seed("Minh Khoa often reads after school.","Choose the adverb.","often"),seed("We usually have lunch at school.","Choose the adverb.","usually"),seed("I sometimes play football.","Choose the adverb.","sometimes"),seed("Bảo Ngọc always does her homework.","Choose the adverb.","always")],["always","usually","often","sometimes","rarely","never"]);
  const reviewSeeds=[seed("clothes students wear at school","Choose the word.","uniform",ref),seed("make a pencil sharp","Choose the object.","pencil sharpener",ref),seed("___ new words","Choose the verb.","study",ref),seed("He ___ from Da Nang.","Choose the form.","comes",ref),seed("I ___ remember my homework.","Choose the adverb.","always",ref),seed("draw a straight line","Choose the object.","ruler"),seed("___ exercise","Choose the verb.","do"),seed("She ___ to school.","Choose the form.","walks"),seed("0% of the time","Choose the adverb.","never"),seed("a book for writing notes","Choose the word.","notebook")];
  const review=build("u1-lbr",reviewSeeds);

  const planItems=[...source.project.steps,"Choose a safe fictional school.","Answer the design questions.","Make short notes.","Write a clear description.","Practise speaking clearly.","Do not include private information.","Listen politely to presentations."];
  const plan=build("u1-pp",planItems.map((item,index)=>seed(`Project step ${index+1}`,"Choose the project action.",item,index<3?ref:ai)),planItems);
  const research=build("u1-pr",[...source.project.design_prompts.map((prompt,index)=>seed(prompt,"Choose a fictional design answer.",["in a small town","No, it isn't.","Yes, it is.","Yes, it does.","No, it doesn't.","Yes, it does."][index],ref)),seed("Does it have a library?","Choose a fictional answer.","Yes, it does."),seed("Does it have a green playground?","Choose a fictional answer.","Yes, it does."),seed("Where do students read?","Choose a fictional answer.","in the library"),seed("What is the school called?","Choose a fictional answer.",fictional.name)]);
  const noteItems=[
    ["River School is in a small town.","Safe project note"],["My home address is 12 River Street.","Private information"],["It has twelve classes.","Safe project note"],["My phone number is 0900000000.","Private information"],["Students read in the library.","Safe project note"],
    ["My password is school123.","Private information"],["There is a green playground.","Safe project note"],["The teachers are friendly.","Safe project note"],["Here is my exact daily route.","Private information"],["Students work in the garden.","Safe project note"]
  ];
  const notes=build("u1-pn",noteItems.map(([context,answer])=>seed(context,"Can this go in a school project?",answer)),["Safe project note","Private information"]);
  const writerSentences=["My dream school is River School.","It is in a small town.","It has twelve classes.","There is a swimming pool.","There is a green playground.","Students can read in the library.","Students can work in the garden.","The teachers are friendly.","I like the art club.","It is a safe and happy school."];
  const writer=build("u1-pw",writerSentences.map(item=>seed(item,"Choose a complete project sentence.",item)),writerSentences);
  const selfCheckAreas=["Vocabulary","Pronunciation","Grammar","Grammar","Communication","Reading","Speaking","Listening","Writing"];
  const presentSeeds=source.project.now_i_can.map((skill,index)=>seed(`Now I can: ${skill}`,"Which learning area does this self-check belong to?",selfCheckAreas[index],ref));
  presentSeeds.push(seed("Your dream-school page is ready.","What is the final Project action?","Presentation"));
  const present=build("u1-pt",presentSeeds,["Vocabulary","Pronunciation","Grammar","Communication","Reading","Speaking","Listening","Writing","Presentation"]);

  const games={introducing,dialogue,questions,friends,mission,reading,evidence,school,speaking,summary,listening,details,order,writing,paragraph,vocabulary,collocations,present_simple,frequency,review,plan,research,notes,writer,present};
  const titles:Record<Unit1Phase2GameId,[string,string]>={
    introducing:["Communication · Bài 1–2","Giới thiệu một người bạn mới."],dialogue:["Communication · Introduction Dialogue","Chọn lời chào và phản hồi lịch sự."],questions:["Communication · Bài 3","Nhận biết câu hỏi phù hợp."],friends:["Communication · Bài 4","Nhận biết thói quen của một người bạn tốt."],mission:["Communication · Bài 5","Luyện phỏng vấn với câu trả lời hư cấu."],
    reading:["Skills 1 · Bài 1","Đọc và nhận biết ba trường học."],evidence:["Skills 1 · Bài 2","Hoàn thành câu từ bằng chứng bài đọc."],school:["Skills 1 · Bài 3","Trả lời câu hỏi đọc hiểu."],speaking:["Skills 1 · Bài 4","Nói về trường muốn theo học."],summary:["Skills 1 · School Summary","Tóm tắt thông tin từng trường."],
    listening:["Skills 2 · Bài 1–2","Nghe script AI về Palmer School."],details:["Skills 2 · Detail Catcher","Nghe và chọn chi tiết."],order:["Skills 2 · Listening Order","Theo dõi trình tự thông tin."],writing:["Skills 2 · Bài 3","Lập ghi chú hư cấu về trường học."],paragraph:["Skills 2 · Bài 4","Xây đoạn văn về River School."],
    vocabulary:["Looking Back · Bài 1","Ôn đồ dùng học tập."],collocations:["Looking Back · Bài 2","Ôn động từ đi với danh từ."],present_simple:["Looking Back · Bài 3–4","Ôn hiện tại đơn."],frequency:["Looking Back · Bài 5","Đặt trạng từ tần suất."],review:["Looking Back · Final Mix","Ôn tổng hợp Unit 1."],
    plan:["Project · Your Dream School","Nắm quy trình dự án."],research:["Project · Design Questions","Trả lời câu hỏi thiết kế."],notes:["Project · Safe Notes","Chọn ghi chú an toàn."],writer:["Project · School Writer","Viết câu mô tả trường mơ ước."],present:["Project · Show & Tell","Chuẩn bị trình bày trước lớp."]
  };
  const help=Object.fromEntries(Object.entries(titles).map(([id,[source_title,teaching_vi]])=>[id,{source_title,teaching_vi,steps:["Hoàn thành đủ 10 lượt.","Đọc hoặc nghe bằng chứng trước khi chọn.","Điểm phụ thuộc thời gian, trợ giúp và số lần sai; hệ thống giữ thành tích tốt nhất."]}])) as Unit1Phase2Built["help"];
  help.plan.steps=["Các bước trong trang Project là gợi ý của trò chơi, không phải kiến thức nền.","Chọn đúng trình tự thiết kế, vẽ và trình bày trường học mơ ước.","Hoàn thành 10 lượt; câu sai có phản hồi và thành tích tốt nhất được giữ lại."];
  help.present={source_title:"Project · Now I can...",teaching_vi:"Dùng bảng Now I can để tự kiểm tra kỹ năng trước khi trình bày.",steps:["Mỗi lượt lấy một tiêu chí thật từ bảng Now I can.","Chọn đúng nhóm kỹ năng rồi hoàn tất lượt trình bày cuối.","Hoàn thành đủ 10 lượt; câu sai có phản hồi và thành tích tốt nhất được giữ lại."]};
  return {...source,games,help};
}

function hasImage(value:unknown):boolean{if(!value||typeof value!=="object")return false;if(Array.isArray(value))return value.some(hasImage);return Object.entries(value).some(([key,item])=>/^(image|photo|illustration|image_url)$/i.test(key)||hasImage(item));}
export function validateUnit1Phase2(source:Unit1Phase2Source):Unit1Phase2Built{
  if(source.lesson_id!=="unit1-phase2"||source.source_status!==ref||source.usage_scope!=="personal-family"||!source.source_note.includes("Track 8–9"))throw new Error("Unit 1 phase 2 provenance is invalid");
  if(hasImage(source))throw new Error("Unit 1 phase 2 must not embed textbook images");
  if(source.communication.introduction_dialogue.length!==3||source.communication.candidate_questions.length!==8||source.communication.friend_quiz.length!==8||source.skills1.passages.length!==3||source.skills1.matches.length!==3||source.skills1.fill_answers.length!==5||source.skills1.questions.length!==4||source.skills2.visible_choices.length!==5||source.skills2.replacement_audio.source_status!==ai||source.skills2.writing_prompts.length!==5||source.looking_back.vocabulary_answers.length!==6||source.looking_back.collocations.length!==5||source.looking_back.present_simple_answers.length!==5||source.looking_back.text_forms.length!==5||source.looking_back.frequency_sentences.length!==5||source.project.steps.length!==3||source.project.design_prompts.length!==6||source.project.now_i_can.length!==9||source.project.fictional_school.source_status!==ai)throw new Error("Unit 1 phase 2 anchors changed");
  const built=buildUnit1Phase2(source);
  if(Object.keys(built.games).length!==25||Object.values(built.games).some(rounds=>rounds.length!==10||new Set(rounds.map(item=>item.id)).size!==10))throw new Error("Unit 1 phase 2 needs 25 games of ten rounds");
  for(const [id,rounds] of Object.entries(built.games))for(const item of rounds){if(!item.options.includes(item.answer)||new Set(item.options).size!==item.options.length||item.options.length<2||item.options.length>4)throw new Error(`${id}/${item.id} has an invalid answer`);if(item.audio_text&&item.audio_source_status!==ai)throw new Error(`${id}/${item.id} audio must be AI-labelled`);}
  return built;
}
