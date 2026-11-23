import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import type { CourseExperienceDescriptor } from "../../curriculum/courseRegistry";
import { ScoreProfile } from "../profile/ScoreProfile";
import curriculum from "../../../../data/curriculum/math6_full_year.json";

type Props = {
  courseId: string;
  descriptor: CourseExperienceDescriptor;
  onChooseCourse: () => void;
};

type MathBridgeMessage = {
  source?: unknown;
  kind?: unknown;
  student?: unknown;
  knowledge?: unknown;
  earnedScore?: unknown;
  questionScores?: unknown;
  height?: unknown;
};
type MathLesson = (typeof curriculum.lessons)[number];

const LESSONS = curriculum.lessons as MathLesson[];
const TOPICS = curriculum.chapters;
const savedOriginals = new Set([1,2]);
const titleFor = (n:number) => LESSONS.find(x => x.number===n)?.title ?? "Bài học";

/**
 * All 43 lessons follow the textbook table of contents.
 * Original approved games (1, 2) keep their own HTML and score routines;
 * newly generated examples (3–43) use a shared, explicitly unreviewed
 * practice generator. All result messages are authenticated and separated
 * by lesson ID and school term.
 */
export function Math6Lesson1Experience({ courseId, onChooseCourse }: Props) {
  const semester = courseId === "math-6-semester-2" ? 2 : 1;
  const available = useMemo(() => LESSONS.filter(x=>x.semester===semester),[semester]);
  const { user, saveActivityProgress } = useAuth();
  const [lesson, setLesson] = useState<number>(semester===1?1:23);
  const [page, setPage] = useState<"overview"|"lesson"|"profile">("overview");
  const [height,setHeight] = useState(1100);
  const [syncMessage,setSyncMessage] = useState("");
  const frame = useRef<HTMLIFrameElement|null>(null);
  const student = String(user?.username ?? "");
  const selected = available.find(x=>x.number===lesson) ?? available[0];
  const position = available.findIndex(x=>x.number===selected.number);

  useEffect(()=>{
    setLesson(semester===1?1:23);
    setPage("overview");
    setHeight(1100);
  },[semester]);

  const iframeSrc = useMemo(()=>{
    const l=selected.number;
    const path=l===1?"/math6-bai1/index.html":l===2?"/math6-bai2/index.html":"/math6-year/index.html";
    const args=new URLSearchParams();
    if(l>=3)args.set("lesson",String(l));
    args.set("student",student);
    return path+"?"+args.toString();
  },[selected.number,student]);

  useEffect(()=>{
    const onMessage=(event:MessageEvent)=>{
      if(event.origin !== window.location.origin || event.source !== frame.current?.contentWindow)return;
      const data = event.data as MathBridgeMessage | null;
      if(!data || typeof data !== "object" || data.source !== selected.unitId)return;
      if(data.kind==="resize"){
        const requested=Number(data.height);
        if(Number.isFinite(requested)&&requested>=350&&requested<=22000) setHeight(Math.ceil(requested)+20);
        return;
      }
      if(data.kind!=="quiz-completed" || data.student!==student)return;
      const knowledge=Number(data.knowledge);
      const scores=data.questionScores;
      if(!Array.isArray(scores)||scores.length!==10||scores.some(s=>!Number.isInteger(s)||s<0||s>100))return;
      if(selected.number<=2 && knowledge!==1 && knowledge!==2)return;
      if(selected.number>=3 && knowledge!==1)return;
      const earned=scores.reduce<number>((a,b)=>a+Number(b),0);
      if(data.earnedScore!==earned)return;

      const activityId=selected.number===1?selected.unitId+"-kn"+knowledge:
        selected.number===2?selected.unitId+(knowledge===1?"-tp":"-lm"):
        selected.unitId+"-quiz";
      setSyncMessage("Đang lưu điểm vào hồ sơ học sinh…");
      // Do not upload per-position question scores from randomized papers.
      void saveActivityProgress(selected.unitId,activityId,earned,1000,true)
        .then(()=>setSyncMessage("Điểm bài "+selected.number+" đã đồng bộ vào hồ sơ."))
        .catch(()=>setSyncMessage("Chưa đồng bộ được điểm. Điểm trên trình duyệt vẫn còn; mở lại bài để thử đồng bộ."));
    };
    window.addEventListener("message",onMessage);
    return ()=>window.removeEventListener("message",onMessage);
  },[student,selected.unitId,selected.number,saveActivityProgress]);

  function openLesson(n:number){
    if(!available.some(l=>l.number===n))return;
    setLesson(n);setPage("lesson");setHeight(1100);setSyncMessage("");
  }

  return <main className="app-shell">
    <div className="lesson-shell">
      <nav className="course-branch-nav" aria-label="Điều hướng Toán 6">
        <button type="button" onClick={onChooseCourse}>
          <strong>Thư viện</strong><span>Đổi môn và học kỳ</span>
        </button>
        <button type="button" aria-current={page==="overview"?"page":undefined}
          onClick={()=>setPage("overview")}>
          <strong>Danh sách bài</strong><span>Chương trình học kỳ {semester}</span>
        </button>
        <button type="button" aria-current={page==="profile"?"page":undefined} onClick={()=>setPage("profile")}>
          <strong>Hồ sơ</strong><span>Điểm và tiến độ học</span>
        </button>
      </nav>
      {page==="profile"?<ScoreProfile courseId={courseId}/>:
       page==="overview"?
       <section className="lesson-card" aria-label="Danh mục bài học Toán 6">
         <h1>Toán 6 · Học kỳ {semester}</h1>
         <p>Chọn bài học từ danh sách theo đúng thứ tự sách giáo khoa. Hai bài đầu đã được biên soạn và rà soát; bài 3–43 gồm bài tập sinh tự động, cần thẩm định nội dung trước khi sử dụng chính thức.</p>
         <p>Chương trình có {available.length} bài học trong học kỳ này. Khi đổi bài, điểm số và đề đang làm được lưu riêng từng bài, theo tài khoản.</p>
         {TOPICS.filter(x=>x.semester===semester).map(chapter=>
           <section key={chapter.chapter} style={{marginTop:24}}>
             <h2>Chương {chapter.chapter}: {chapter.title}</h2>
             <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(240px,100%),1fr))",gap:10}}>
               {available.filter(x=>x.chapter===chapter.chapter).map(item=>
                 <button type="button" key={item.unitId} onClick={()=>openLesson(item.number)}
                   style={{textAlign:"left",padding:14,borderRadius:12,border:"1px solid #c9d6e9",background:"#f7faff",color:"inherit",cursor:"pointer"}}>
                   <strong>Bài {item.number}: {item.title}</strong>
                   <span style={{display:"block",fontSize:13,marginTop:5,color:"#64728b"}}>
                     SGK tập {item.volume}, trang {item.printedPage} · {savedOriginals.has(item.number)?"50 câu đã duyệt":"50 biến thể tự tạo · chờ rà soát"}
                   </span>
                 </button>)}
             </div>
           </section>)}
       </section>:
       <section aria-label={"Toán 6 Bài "+selected.number+": "+selected.title}>
         <div className="lesson-card" style={{marginBottom:14}}>
           <h1>Toán 6 · Bài {selected.number}: {selected.title}</h1>
           <p>Chương {selected.chapter} · Tập {selected.volume}, trang {selected.printedPage}. {selected.number<=2?"Bộ 50 câu đã xây dựng riêng.":"Bộ 50 biến thể tự động sinh theo chủ đề, chưa thay thế tài liệu học tập hoặc bài tập chính thức của SGK."}</p>
           <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
             <button type="button" onClick={()=>setPage("overview")}>Danh sách bài</button>
             <button type="button" disabled={position===0} onClick={()=>openLesson(available[position-1]?.number)}>Bài trước</button>
             <button type="button" disabled={position>=available.length-1} onClick={()=>openLesson(available[position+1]?.number)}>Bài tiếp theo</button>
           </div>
           {syncMessage&&<p role="status">{syncMessage}</p>}
         </div>
         <iframe key={selected.unitId} ref={frame} src={iframeSrc}
           title={"Toán 6 – Bài "+selected.number+": "+selected.title}
           style={{width:"100%",height:height+"px",border:0,background:"#f5f7fc",display:"block"}}/>
         <p className="muted small">Đề dở được lưu trên trình duyệt theo từng bài, từng tài khoản. Điểm cao nhất của đề hoàn thành được đồng bộ với hồ sơ chung.</p>
       </section>}
    </div>
  </main>;
}
