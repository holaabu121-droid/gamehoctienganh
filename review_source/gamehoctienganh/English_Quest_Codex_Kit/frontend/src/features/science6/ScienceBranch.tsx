import { useEffect, useState } from "react";
import { ScienceLesson } from "./ScienceLesson";
import { loadScienceLesson, type ScienceLessonSpec } from "./scienceCurriculum";

export function ScienceBranch({branchId}:{branchId:string}){
  const [result,setResult]=useState<{branchId:string;spec?:ScienceLessonSpec;error?:string}>({branchId});
  useEffect(()=>{
    let active=true;
    setResult({branchId});
    void loadScienceLesson(branchId)
      .then(spec=>{if(active)setResult(spec?{branchId,spec}:{branchId,error:"Không tìm thấy bài Khoa học tự nhiên này."});})
      .catch(()=>{if(active)setResult({branchId,error:"Không tải được bài Khoa học tự nhiên. Hãy thử lại."});});
    return()=>{active=false;};
  },[branchId]);
  if(result.branchId!==branchId||(!result.spec&&!result.error))return <section className="lesson-card auth-loading" role="status"><strong>Đang tải nội dung bài học…</strong></section>;
  if(result.error)return <section className="lesson-card auth-loading" role="alert"><strong>{result.error}</strong></section>;
  return <ScienceLesson spec={result.spec!}/>;
}
