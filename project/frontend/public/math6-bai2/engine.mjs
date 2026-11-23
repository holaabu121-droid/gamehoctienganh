// Pure, browser/Node-compatible grading rules for Math 6 Lesson 2.
// The lesson uses its OWN scoring logic; English activities are untouched.
export function toRoman(n) {
  if (!Number.isInteger(n) || n < 1 || n > 30) throw new RangeError("Số La Mã trong bài từ 1 đến 30.");
  let out="";
  for (const [value, glyph] of [[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]]) {
    while (n>=value) {out+=glyph;n-=value;}
  }
  return out;
}
export function romanValue(text) {
  if (typeof text !== "string") return null;
  const glyph=text.trim().toUpperCase();
  if (!/^[IVX]+$/.test(glyph)) return null;
  for(let i=1;i<=30;i++) if(toRoman(i)===glyph) return i;
  return null;
}
export function normalizeNumber(input) {
  if(typeof input !== "string" && typeof input !== "number")return null;
  const raw=String(input).trim();
  const plain=/^(0|[1-9][0-9]*)$/;
  const grouped=/^[1-9][0-9]{0,2}(?:[ .][0-9]{3})+$/;
  if(!plain.test(raw)&&!grouped.test(raw))return null;
  const numeric=Number(raw.replace(/[ .]/g,""));
  return Number.isSafeInteger(numeric)?numeric:null;
}
export function checkAnswer(q, input){
  if(q.mode==="single") return typeof input==="string" && input===q.answer;
  if(q.mode==="multi"){
    if(!Array.isArray(input))return false;
    const a=[...new Set(input)].sort(), b=[...new Set(q.answer)].sort();
    return a.length===b.length&&a.every((v,i)=>v===b[i])&&input.length===a.length;
  }
  if(q.mode==="order" || q.mode==="match"){
    return Array.isArray(input)&&input.length===q.answer.length&&input.every((v,i)=>v===q.answer[i]);
  }
  if(q.mode==="number"){
    const result=normalizeNumber(input);
    return result!==null&&result===normalizeNumber(q.answer);
  }
  if(q.mode==="roman"){
    const n=romanValue(input);
    return n!==null&&toRoman(n)===q.answer;
  }
  throw new Error("Unsupported question mode: "+q.mode);
}
export function isComplete(q,input){
  if(q.mode==="single" || q.mode==="number" || q.mode==="roman")return typeof input==="string"&&input.trim().length>0;
  if(q.mode==="multi")return Array.isArray(input)&&input.length>0;
  if(q.mode==="order")return Array.isArray(input)&&input.length===q.tiles.length;
  if(q.mode==="match")return Array.isArray(input)&&input.length===q.rows.length&&input.every(x=>typeof x==="string"&&x.length>0);
  return false;
}
export function scoreForTime(seconds,wrongs=0) {
  if(wrongs>=2)return 0;
  const elapsed=Math.max(0,Number(seconds)||0);
  const intervals=Math.floor(Math.max(0,elapsed-10)/10);
  return Math.max(0,100-10*intervals-(wrongs>0?50:0));
}
export function selectQuiz(bank, knowledge, random=Math.random) {
  const filtered=bank.filter(q=>q.knowledge===knowledge);
  const shuffled=arr=>{const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
  const practice=shuffled(filtered.filter(q=>q.level==="practice")).slice(0,6);
  const application=shuffled(filtered.filter(q=>q.level==="application")).slice(0,4);
  if(practice.length!==6 || application.length!==4)throw new Error("Not enough questions");
  const selected=shuffled([...practice,...application]);
  if(new Set(selected.map(q=>q.id)).size!==10)throw new Error("Duplicated questions");
  return selected;
}
export function newRecord(q){
  return {questionId:q.id,value:q.mode==="multi"||q.mode==="order"||q.mode==="match"?[]:"",wrongs:0,seconds:0,phase:"answering",score:null};
}
export function bestHistory(history,knowledge){
  return (history?.[knowledge]||[]).reduce((best,row)=>!best || row.score>best.score?row:best,null);
}
