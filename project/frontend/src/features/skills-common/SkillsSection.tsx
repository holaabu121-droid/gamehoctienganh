import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import type { QuestionScore } from "../../progress/scoringEngine";
import { useActivityScoring } from "../../progress/useActivityScoring";
import { SpeechQueue } from "../word-magnet/speechQueue";
import { useAuth } from "../../auth/AuthProvider";
import type { QuestionProgress, UnitSummary } from "../../auth/authApi";
import type { ReviewTarget } from "../../reviewTarget";
import { firstUnfinishedQuestion, foundationSpeechText, normalizeFoundationItem, stableShuffle, type FoundationItem } from "./learningUx";

export type CommonRound = { id: string; source_status: "user-provided-reference" | "ai-generated"; context: string; context_vi?: string; prompt: string; prompt_vi?: string; options: string[]; answer: string; explanation_vi: string; wrong_feedback?: Record<string, string>; audio_text?: string; audio_source_status?: "ai-generated"; read_aloud?: string; completed_text?: string };
type Help = { source_title: string; teaching_vi: string; steps: string[] };
export type GameMeta<Id extends string> = { id: Id; icon: string; title: string; description: string; activityId: string; listening?: boolean; timedSeconds?: number };
type Props<Id extends string> = {
  sectionLabel: string; trailTitle: string; introTitle: string; introTitleVi: string; introDescription: string;
  foundations: Array<{ title: string; items: FoundationItem[] }>;
  privacyNote?: string; games: Record<Id, CommonRound[]>; help: Record<Id, Help>; meta: GameMeta<Id>[]; listening: boolean;
  questionEmphasis?: "context" | "prompt";
  speechLang?: string;
  foundationVisual?: ReactNode;
  foundationVisualIndex?: number;
  reviewTarget?: ReviewTarget | null;
  unitId: string;
};

function FoundationBlocks({ foundations, speech, speechLang = "en-US", compact = false, visual, visualIndex = 1 }: { foundations: Props<string>["foundations"]; speech: SpeechQueue; speechLang?: string; compact?: boolean; visual?: ReactNode; visualIndex?: number }) {
  const [revealed, setRevealed] = useState<string | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  async function play(blockIndex: number, itemIndex: number, item: FoundationItem) {
    const key = `${blockIndex}-${itemIndex}`;
    setRevealed(current => current === key ? null : key);
    setPlaying(key);
    await speech.replace({ text: foundationSpeechText(item), lang: speechLang, rate: .82 });
    setPlaying(current => current === key ? null : current);
  }
  return <div className={compact ? "skills-foundations skills-foundations--compact" : "skills-foundations"}>
    {foundations.map((block, blockIndex) => <section className="acl-foundation" key={block.title}>
      <header><span>{compact ? "Kiến thức nền" : `Kiến thức nền ${blockIndex + 1}`}</span><h4>{block.title}</h4></header>
      <ol>{block.items.map((source, itemIndex) => { const item = normalizeFoundationItem(source); const key = `${blockIndex}-${itemIndex}`; const open = revealed === key; return <li className={source.toString().includes(":") ? "foundation-item foundation-item--dialogue" : "foundation-item"} key={`${item.text}-${itemIndex}`}>
        <button type="button" aria-expanded={open} onClick={() => void play(blockIndex, itemIndex, source)}><span>{item.text}</span><small>{playing === key ? "Đang phát…" : item.pronunciationVi ? "🔊 Nghe âm và xem cách đọc" : "🔊 Nghe và xem nghĩa"}</small></button>
        {open && <aside><strong>{item.detailLabel ?? (item.pronunciationVi ? "Cách phát âm" : item.englishGuide ? "Hướng dẫn tiếng Anh" : item.translation ? "Bản dịch" : "Ghi chú")}</strong><span lang={item.englishGuide ? "en" : "vi"}>{item.pronunciationVi ?? item.englishGuide ?? item.translation ?? `Nội dung này thuộc phần “${block.title}”. Em nghe câu, sau đó đối chiếu lời giảng và ví dụ trong trò chơi.`}</span></aside>}
      </li>; })}</ol>
      {!compact && blockIndex === visualIndex && visual && <div className="foundation-visual-slot">{visual}</div>}
    </section>)}
  </div>;
}

function RoundGuide({ item }: { item: CommonRound }) {
  return <aside className="skills-round-guide">
    <div><span aria-hidden="true">💡</span><p><strong>Gợi ý bản dịch</strong><span>{item.context_vi ?? "Đọc cụm tiếng Anh bên dưới và dựa vào từ khóa để suy ra nghĩa."}</span></p></div>
    <div><span aria-hidden="true">🎯</span><p><strong>Yêu cầu bài tập</strong><span>{item.prompt_vi ?? "Đọc yêu cầu tiếng Anh, sau đó chọn đáp án phù hợp nhất."}</span></p></div>
  </aside>;
}

function QuestionBlock({ item, emphasis }: { item: CommonRound; emphasis: "context" | "prompt" }) {
  if (emphasis === "prompt") return <article className="skills-prompt skills-prompt--prompt-primary">
    <p className="skills-question-context">{item.context}</p>
    <h4 className="skills-primary-question">{item.prompt}</h4>
  </article>;
  return <article className="skills-prompt skills-prompt--context-primary">
    <h4 className="skills-primary-question">{item.context}</h4>
    <p className="skills-secondary-guidance"><strong>Gợi ý</strong><span>{item.prompt}</span></p>
  </article>;
}

function useScoredGame(unitId: string, activityId: string, index: number, initialIndex: number, onComplete: () => void) {
  const scoring = useActivityScoring(10, initialIndex); const { saveQuestionProgress, completeActivity } = useAuth();
  const [questionScore, setQuestionScore] = useState<QuestionScore | null>(null); const [saving, setSaving] = useState(false); const [saveError, setSaveError] = useState("");
  const pendingRef = useRef<{ index: number; score: QuestionScore; status: "scored" | "skipped" } | null>(null);
  useEffect(() => { scoring.startQuestion(); pendingRef.current = null; setQuestionScore(null); setSaveError(""); }, [index, scoring.startQuestion]);
  async function saveCurrent(status: "scored" | "skipped") {
    if (saving) return false;
    setSaving(true); setSaveError("");
    try {
      let pending = pendingRef.current;
      if (!pending || pending.index !== index || pending.status !== status) {
        if (status === "scored") scoring.breakWrongStreak();
        const score = status === "scored" ? scoring.completeQuestion() : scoring.skipQuestion();
        pending = { index, score, status }; pendingRef.current = pending; setQuestionScore(score);
      }
      await saveQuestionProgress(unitId, activityId, index, pending.score.earned, status);
      pendingRef.current = null;
      return true;
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Chưa lưu được câu này. Em thử lại nhé.");
      return false;
    } finally { setSaving(false); }
  }
  async function finishGame() { if (saving) return; setSaving(true); setSaveError(""); try { await completeActivity(unitId, activityId); onComplete(); } catch (error) { setSaveError(error instanceof Error ? error.message : "Chưa hoàn tất được trò chơi. Em thử lại nhé."); } finally { setSaving(false); } }
  return { recordHelp: scoring.recordHelp, recordWrong: scoring.recordWrong, markCorrect: () => saveCurrent("scored"), skipCurrent: () => saveCurrent("skipped"), finishGame, questionScore, saving, saveError };
}

function ChoiceGame<Id extends string>({ unitId, id, meta, rounds, help, foundations, priorQuestions, speech, speechLang, listening, questionEmphasis, initialIndex, onBack, onComplete }: { unitId: string; id: Id; meta: GameMeta<Id>; rounds: CommonRound[]; help: Help; foundations: Props<Id>["foundations"]; priorQuestions: QuestionProgress[]; speech: SpeechQueue; speechLang: string; listening: boolean; questionEmphasis: "context" | "prompt"; initialIndex: number; onBack: () => void; onComplete: () => void }) {
  const [index,setIndex]=useState(initialIndex), [correct,setCorrect]=useState(false), [busy,setBusy]=useState(false), [busyMessage,setBusyMessage]=useState(""), [open,setOpen]=useState(false);
  const [attempting,setAttempting]=useState(()=>!priorQuestions.some(question=>question.question_index===initialIndex));
  const [feedback,setFeedback]=useState(listening&&rounds[initialIndex].audio_text ? "Nhấn Nghe rồi chọn đáp án phù hợp." : "Đọc kỹ rồi chọn đáp án có bằng chứng.");
  const item=rounds[index], helpId=useId(), scored=useScoredGame(unitId,meta.activityId,index,initialIndex,onComplete);
  const options=useMemo(()=>stableShuffle(item.options,item.id),[item]);
  const prior=priorQuestions.find(question=>question.question_index===index);
  useEffect(()=>setOpen(false),[index]);
  async function playPrompt() { if (busy) return; setBusy(true); setBusyMessage("🔊 Đang phát câu hỏi…"); try { await speech.enqueue({ text:item.audio_text ?? item.context, lang:speechLang, rate:.8 }); } finally { setBusy(false); setBusyMessage(""); } }
  async function choose(option:string) { if (busy||correct||scored.saving) return; setBusy(true); setBusyMessage("🔊 Đang đọc đáp án em chọn…"); try { await speech.enqueue({ text:option.replace(/^[^\p{L}\p{N}]+/u,""), lang:speechLang, rate:.84 }); if (option===item.answer) { setBusyMessage("💾 Đang lưu tiến độ câu này…"); const saved=await scored.markCorrect(); if (!saved) return; setCorrect(true); setFeedback(item.explanation_vi); const full=item.completed_text ?? item.read_aloud; if(full) { setBusyMessage("🔊 Đang đọc câu hoàn chỉnh…"); await speech.enqueue({text:full,lang:speechLang,rate:.82}); } } else { scored.recordWrong(); setFeedback(item.wrong_feedback?.[option] ?? (listening&&item.audio_text ? "Chưa đúng. Em nghe lại từ khóa chính và thử lần nữa." : "Chưa đúng. Em quay lại chi tiết làm bằng chứng nhé.")); } } finally { setBusy(false); setBusyMessage(""); } }
  function advance(nextIndex:number){setIndex(nextIndex);setCorrect(false);setAttempting(!priorQuestions.some(question=>question.question_index===nextIndex));setFeedback(listening&&rounds[nextIndex].audio_text?"Nhấn Nghe rồi chọn đáp án phù hợp.":"Đọc kỹ rồi chọn đáp án có bằng chứng.");}
  async function next() { if(index===rounds.length-1){await scored.finishGame();return;} advance(index+1); }
  async function skip(){if(busy||scored.saving)return;setBusyMessage("💾 Đang lưu câu bỏ qua…");const saved=await scored.skipCurrent();setBusyMessage("");if(!saved)return;if(index===rounds.length-1){await scored.finishGame();return;}advance(index+1);}
  return <section className="lesson-card acl-game skills-game" aria-busy={busy||scored.saving}>
    <button className="back-to-games" type="button" onClick={onBack}>← Danh sách trò chơi</button>
    <header className="acl-game-header"><div><span className="eyebrow">{meta.icon} {meta.title}</span><h3>{meta.title}</h3></div><button className="acl-help-button" type="button" aria-label="Xem lời giảng gợi ý" aria-expanded={open} aria-controls={helpId} onClick={()=>setOpen(current=>{if(!current)scored.recordHelp();return !current;})}>?</button></header>
    {open&&<aside className="acl-help-panel" id={helpId}><span className="eyebrow">Lời giảng gợi ý</span><h4>{help.teaching_vi}</h4><p lang="en"><em>{help.source_title}</em></p><ol>{help.steps.map(step=><li key={step}>{step}</li>)}</ol></aside>}
    <div className="acl-progress"><strong>{index+1}/{rounds.length}</strong><div className="progress-track"><span style={{width:`${((index+(correct?1:0))/rounds.length)*100}%`}} /></div></div>
    <RoundGuide item={item}/>
    <div className="skills-source-row"><span className={item.source_status==="user-provided-reference"?"skills-source skills-source--reference":"skills-source"}>{item.source_status==="user-provided-reference"?(item.audio_source_status==="ai-generated"?"Nội dung theo trang nguồn · câu nghe mới":"Theo trang nguồn"):"Luyện tập bổ sung"}</span>{listening&&item.audio_text&&<button className="skills-listen-button" type="button" disabled={busy} onClick={()=>void playPrompt()}>🔊 {busy?"Đang phát…":"Nghe / nghe lại"}</button>}</div>
    {prior&&!attempting?<aside className="question-replay-choice"><strong>{prior.status==="skipped"?"Câu này đã được chọn bỏ qua.":`Câu này đã được chấm ${prior.earned_score}/100 điểm.`}</strong><p>Em có thể bỏ qua để tiếp tục hoặc làm lại để cải thiện điểm tốt nhất.</p><div><button className="secondary-button" type="button" onClick={()=>void skip()}>Bỏ qua câu đã làm</button><button className="primary-button" type="button" onClick={()=>setAttempting(true)}>Làm lại câu này</button></div></aside>:<><QuestionBlock item={item} emphasis={questionEmphasis}/>
    <div className="acl2-option-grid skills-options">{options.map(option=><button key={option} type="button" disabled={busy||correct} onClick={()=>void choose(option)}>{option}</button>)}</div></>}
    {busyMessage&&<p className="skills-busy-status" role="status" aria-live="polite">{busyMessage}</p>}<p className="acl-feedback" role="status">{feedback}</p>{scored.questionScore&&<p className="acl2-question-score">+{scored.questionScore.earned}/100 điểm · {scored.questionScore.rankLabel}</p>}{scored.saveError&&<p className="auth-error" role="alert">{scored.saveError}</p>}
    {correct&&<div className="acl-finish-action"><button className="primary-button" type="button" disabled={busy||scored.saving} onClick={()=>void next()}>{index===rounds.length-1?(scored.saving?"Đang lưu…":"Hoàn thành"):"Câu tiếp theo"}</button></div>}
    <FoundationBlocks foundations={foundations} speech={speech} speechLang={speechLang} compact />
  </section>;
}

function TimedPracticeGame<Id extends string>({unitId,meta,rounds,help,foundations,speech,questionEmphasis,initialIndex,onBack,onComplete}:{unitId:string;meta:GameMeta<Id>;rounds:CommonRound[];help:Help;foundations:Props<Id>["foundations"];speech:SpeechQueue;questionEmphasis:"context"|"prompt";initialIndex:number;onBack:()=>void;onComplete:()=>void}){
  const required=meta.timedSeconds??60,{confirmPractice}=useAuth(),[index,setIndex]=useState(initialIndex),[correct,setCorrect]=useState(false),[elapsed,setElapsed]=useState(0),[started,setStarted]=useState(false),[busy,setBusy]=useState(false),[saving,setSaving]=useState(false),[error,setError]=useState(""),[feedback,setFeedback]=useState("Nhấn nghe hoặc chọn đáp án để bắt đầu tính thời gian chủ động."),[open,setOpen]=useState(false),helpId=useId(),item=rounds[index];
  useEffect(()=>{const timer=window.setInterval(()=>{if(started&&document.visibilityState==="visible")setElapsed(value=>Math.min(required,value+1));},1000);return()=>window.clearInterval(timer);},[required,started]);
  function begin(){setStarted(true);}
  async function listen(){begin();setBusy(true);await speech.enqueue({text:item.audio_text??item.context,lang:"en-US",rate:.78});setBusy(false);}
  async function choose(option:string){if(busy||correct)return;begin();setBusy(true);await speech.enqueue({text:option,lang:"en-US",rate:.82});if(option===item.answer){setCorrect(true);setFeedback(item.explanation_vi);}else setFeedback("Chưa đúng. Em nghe lại và thử tiếp; câu sai không bị dùng để đánh giá phát âm.");setBusy(false);}
  function next(){const nextIndex=index===rounds.length-1?0:index+1;setIndex(nextIndex);setCorrect(false);setFeedback("Tiếp tục nghe và luyện cho đến khi đủ 60 giây chủ động.");}
  async function finish(){if(elapsed<required||saving)return;setSaving(true);setError("");try{await confirmPractice(unitId,meta.activityId,elapsed);onComplete();}catch(value){setError(value instanceof Error?value.message:"Chưa lưu được điểm luyện tập.");}finally{setSaving(false);}}
  const options=stableShuffle(item.options,item.id);
  return <section className="lesson-card acl-game skills-game"><button className="back-to-games" type="button" onClick={onBack}>← Danh sách trò chơi</button><header className="acl-game-header"><div><span className="eyebrow">Tính điểm theo thời gian · không chấm giọng nói</span><h3>{meta.icon} {meta.title}</h3></div><button className="acl-help-button" type="button" aria-expanded={open} aria-controls={helpId} onClick={()=>{begin();setOpen(value=>!value);}}>?</button></header>{open&&<aside className="acl-help-panel" id={helpId}><h4>{help.teaching_vi}</h4><ol>{help.steps.map(step=><li key={step}>{step}</li>)}</ol></aside>}<div className="practice-confirmation"><strong>Thời gian chủ động: {elapsed}/{required} giây</strong><p>Đủ {required} giây nhận 1.000 điểm. Đồng hồ dừng khi trang bị ẩn.</p><div className="progress-track"><span style={{width:`${elapsed/required*100}%`}} /></div></div><div className="acl-progress"><strong>{index+1}/{rounds.length}</strong><div className="progress-track"><span style={{width:`${(index+(correct?1:0))/rounds.length*100}%`}} /></div></div><RoundGuide item={item}/><QuestionBlock item={item} emphasis={questionEmphasis}/>{item.audio_text&&<button className="skills-listen-button" type="button" disabled={busy} onClick={()=>void listen()}>🔊 Nghe / nghe lại</button>}<div className="acl2-option-grid skills-options">{options.map(option=><button key={option} type="button" disabled={busy||correct} onClick={()=>void choose(option)}>{option}</button>)}</div><p className="acl-feedback" role="status">{feedback}</p>{correct&&<button className="secondary-button" type="button" onClick={next}>{index===rounds.length-1?"Luyện lại 10 lượt":"Lượt tiếp theo"}</button>}<div className="acl-finish-action"><button className="primary-button" type="button" disabled={elapsed<required||saving} onClick={()=>void finish()}>{saving?"Đang lưu…":elapsed>=required?"Hoàn thành và lưu 1.000 điểm":"Tiếp tục luyện đủ 60 giây"}</button></div>{error&&<p className="auth-error">{error}</p>}<FoundationBlocks foundations={foundations} speech={speech} compact /></section>;
}

export function SkillsSection<Id extends string>(props: Props<Id>) {
  const unitId=props.unitId,{summary,getUnitSummary}=useAuth(),[externalSummary,setExternalSummary]=useState<UnitSummary|null>(null),activeSummary=summary?.unit_id===unitId?summary:externalSummary,speech=useMemo(()=>new SpeechQueue(),[]), targetGame=props.meta.find(item=>item.activityId===props.reviewTarget?.activityId);
  const [screen,setScreen]=useState<"intro"|"hub"|Id>(()=>targetGame?.id??"intro"), [completed,setCompleted]=useState<Set<Id>>(()=>new Set()), [muted,setMuted]=useState(false), [lessonPlaying,setLessonPlaying]=useState(false);
  useEffect(()=>()=>speech.dispose(),[speech]);
  useEffect(()=>{if(summary?.unit_id!==unitId)void getUnitSummary(unitId).then(setExternalSummary).catch(()=>setExternalSummary(null));},[getUnitSummary,summary?.unit_id,unitId,screen]);
  useEffect(()=>{const saved=new Set(props.meta.filter(game=>activeSummary?.progress?.some(item=>item.activity_id===game.activityId&&item.completed)).map(game=>game.id));setCompleted(current=>new Set([...current,...saved]));},[props.meta,activeSummary]);
  useEffect(()=>{if(targetGame)setScreen(targetGame.id);},[targetGame]);
  function open(next:"intro"|"hub"|Id){speech.cancel();setScreen(next);} function finish(id:Id){setCompleted(current=>new Set(current).add(id));open("hub");}
  async function playFullLesson(){if(lessonPlaying)return;setLessonPlaying(true);const text=[props.introTitle,...props.foundations.flatMap(block=>block.items.map(foundationSpeechText))].join(". ");await speech.replace({text,lang:props.speechLang??"en-US",rate:.8});setLessonPlaying(false);}
  function toggleMuted(){const next=!muted;setMuted(next);speech.setMuted(next);} const audioButton=<button className="sound-button" type="button" aria-pressed={muted} onClick={toggleMuted}>{muted?"Bật âm thanh":"Tắt âm thanh"}</button>;
  if(screen==="intro")return <section className="lesson-card acl-intro skills-intro"><header className="lesson-heading"><div><span className="eyebrow">{props.sectionLabel}</span><h3>{props.introTitle}</h3><p className="acl-intro-translation">{props.introTitleVi}</p></div><div className="lesson-audio-actions"><button className="primary-button" type="button" disabled={lessonPlaying||muted} onClick={()=>void playFullLesson()}>🔊 {lessonPlaying?"Đang nghe toàn bài…":"Nghe toàn bài"}</button>{audioButton}</div></header><p className="lesson-lead">{props.introDescription}</p><FoundationBlocks foundations={props.foundations} speech={speech} speechLang={props.speechLang} visual={props.foundationVisual} visualIndex={props.foundationVisualIndex}/>{props.privacyNote&&<p className="acl-practice-tip">🔐 {props.privacyNote}</p>}<div className="acl-intro-actions"><button className="primary-button" type="button" onClick={()=>open("hub")}>Bắt đầu {props.meta.length} trò chơi</button></div></section>;
  if(screen==="hub")return <section className="lesson-card acl-hub skills-hub"><header className="lesson-heading"><div><span className="eyebrow">{props.sectionLabel}</span><h3>{props.trailTitle}</h3><p className="lesson-lead">Mỗi thử thách có 10 lượt và lưu điểm cao nhất của em.</p></div>{audioButton}</header><div className="acl-progress"><strong>{completed.size}/{props.meta.length}</strong><div className="progress-track"><span style={{width:`${completed.size*(100/props.meta.length)}%`}} /></div></div><div className="acl-game-grid">{props.meta.map((game,index)=><button type="button" key={game.id} className={completed.has(game.id)?"acl-game-card acl-game-card--done":"acl-game-card"} onClick={()=>open(game.id)}><span className="acl-game-number">{completed.has(game.id)?"✓":index+1}</span><span className="acl-game-icon" aria-hidden="true">{game.icon}</span><strong>{game.title}</strong><span>{game.description}</span></button>)}</div><button className="secondary-button acl-review-intro" type="button" onClick={()=>open("intro")}>Xem lại kiến thức nền</button></section>;
  const id=screen as Id, meta=props.meta.find(item=>item.id===id)!;
  const priorQuestions=activeSummary?.progress?.find(item=>item.activity_id===meta.activityId)?.question_scores??[];
  const initialIndex=props.reviewTarget?.activityId===meta.activityId?Math.max(0,Math.min(props.reviewTarget.questionIndex,props.games[id].length-1)):firstUnfinishedQuestion(props.games[id].length,priorQuestions);
  const questionEmphasis=props.questionEmphasis??"context";
  if(meta.timedSeconds)return <TimedPracticeGame key={`${meta.activityId}-${initialIndex}`} unitId={unitId} meta={meta} rounds={props.games[id]} help={props.help[id]} foundations={props.foundations} speech={speech} questionEmphasis={questionEmphasis} initialIndex={initialIndex} onBack={()=>open("hub")} onComplete={()=>finish(id)}/>;
  return <ChoiceGame key={meta.activityId} unitId={unitId} id={id} meta={meta} rounds={props.games[id]} help={props.help[id]} foundations={props.foundations} priorQuestions={priorQuestions} speech={speech} speechLang={props.speechLang??"en-US"} listening={meta.listening??props.listening} questionEmphasis={questionEmphasis} initialIndex={initialIndex} onBack={()=>open("hub")} onComplete={()=>finish(id)} />;
}
