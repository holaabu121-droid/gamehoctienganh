import { lazy, Suspense, useEffect, useState } from "react";
import bonusJson from "../../../../data/lessons/unit8_bonus.json";
import { useAuth } from "../../auth/AuthProvider";
import type { UnitSummary } from "../../auth/authApi";
import { useProgress } from "../../progress/ProgressProvider";
import type { ReviewTarget } from "../../reviewTarget";
import { validateBonusLesson, type BonusLesson } from "../bonus/bonusEngine";
import { Unit8Section } from "./Unit8Sections";
import type { Unit8SectionId } from "./unit8Engine";

const Bonus=lazy(()=>import("../bonus/Bonus").then((module)=>({default:module.Bonus})));
const bonusLesson=validateBonusLesson(bonusJson as BonusLesson);
type Unit8View=Unit8SectionId|"bonus";

const SECTIONS:Array<{id:Unit8View;title:string;titleVi:string}>=[
  {id:"getting",title:"Getting Started",titleVi:"At the Gym"},
  {id:"acl1",title:"A Closer Look 1",titleVi:"Từ vựng · âm e–æ"},
  {id:"acl2",title:"A Closer Look 2",titleVi:"Quá khứ đơn · mệnh lệnh"},
  {id:"communication",title:"Communication",titleVi:"Chúc mừng · thể thao"},
  {id:"skills1",title:"Skills 1",titleVi:"Đọc · nói"},
  {id:"skills2",title:"Skills 2",titleVi:"Nghe · viết"},
  {id:"looking_back",title:"Looking Back",titleVi:"Ôn tập Unit 8"},
  {id:"project",title:"Project",titleVi:"Trò chơi dân gian"},
  {id:"bonus",title:"Bonus",titleVi:"3 màn thưởng"},
];

function Dashboard({section}:{section:Unit8View}){
  const {user,logout,getUnitSummary}=useAuth(),{lastResult}=useProgress();
  const [summary,setSummary]=useState<UnitSummary|null>(null),[error,setError]=useState("");
  useEffect(()=>{void getUnitSummary("unit8").then((value)=>{setSummary(value);setError("");}).catch((value)=>setError(value instanceof Error?value.message:"Không tải được tiến độ Unit 8."));},[getUnitSummary,section,lastResult]);
  const percent=Math.max(0,Math.min(100,Math.round(summary?.completion_percent??0))),completed=summary?.progress?.filter((item)=>item.completed).length??0;
  return <section className="unit-dashboard" aria-label="Tiến độ Unit 8"><div className="student-chip"><span aria-hidden="true">🏅</span><div><small>Người học</small><strong>{user?.username}</strong></div></div><div className="unit-metrics"><div><span aria-hidden="true">✅</span><small>Đã hoàn thành</small><strong>{completed}/42</strong></div><div><span aria-hidden="true">⭐</span><small>Điểm Unit 8</small><strong>{summary?`${summary.earned_score??0}/${summary.max_score??42000}`:"—"}</strong></div><div className="unit-completion"><span aria-hidden="true">🎯</span><small>Tỷ lệ điểm</small><strong>{summary?`${percent}%`:"—"}</strong><span className="unit-completion-track" aria-hidden="true"><i style={{width:`${percent}%`}}/></span></div></div><div className="student-actions">{error&&<button type="button" onClick={()=>location.reload()} title={error}>Tải lại</button>}<button type="button" onClick={()=>void logout()}>Đăng xuất</button></div></section>;
}

export function Unit8(){
  const [section,setSection]=useState<Unit8View>("getting"),[reviewTarget,setReviewTarget]=useState<ReviewTarget|null>(null);
  function improve(target:ReviewTarget){setReviewTarget(target);const id=target.activityId;if(id.startsWith("unit8-getting-"))setSection("getting");else if(id.startsWith("unit8-acl1-"))setSection("acl1");else if(id.startsWith("unit8-acl2-"))setSection("acl2");else if(id.startsWith("unit8-communication-"))setSection("communication");else if(id.startsWith("unit8-skills1-"))setSection("skills1");else if(id.startsWith("unit8-skills2-"))setSection("skills2");else if(id.startsWith("unit8-looking-back-"))setSection("looking_back");else if(id.startsWith("unit8-project-"))setSection("project");}
  const selected=SECTIONS.find((item)=>item.id===section)!;
  return <><Dashboard section={section}/><header className="unit-header"><span className="eyebrow">English Quest</span><div className="unit-identity"><span className="unit-number" aria-label="Unit 8">8</span><div><span>Unit 8</span><h1>Sports and Games</h1><p>Thể thao và trò chơi</p></div></div><nav className="major-nav" aria-label="Các phần lớn của Unit 8">{SECTIONS.map((item)=><button type="button" key={item.id} aria-current={section===item.id?"page":undefined} onClick={()=>{setReviewTarget(null);setSection(item.id);}}><strong>{item.title}</strong><span>{item.titleVi}</span></button>)}</nav></header><section className="section-overview" aria-labelledby="unit8-section-title"><div className="section-guide"><span className="section-kicker">Lời dẫn</span><h2 id="unit8-section-title">{selected.title}</h2><p>{selected.titleVi}</p></div><div className="section-objectives"><strong>Mục tiêu Unit 8</strong><ul><li>Dùng từ về thể thao, trò chơi và dụng cụ.</li><li>Phân biệt âm e và æ mà không đọc dấu gạch chéo.</li><li>Dùng quá khứ đơn và câu mệnh lệnh.</li><li>Đọc về danh thủ, nghe và viết về môn thể thao hoặc trò chơi.</li></ul></div></section><Suspense fallback={<section className="lesson-card auth-loading" role="status"><span aria-hidden="true">🏅</span><strong>Đang mở Unit 8…</strong></section>}>{section==="bonus"?<Bonus unitId="unit8" branchTitle="Unit 8" lesson={bonusLesson} onImprove={improve}/>:<Unit8Section section={section} reviewTarget={reviewTarget}/>}</Suspense></>;
}
