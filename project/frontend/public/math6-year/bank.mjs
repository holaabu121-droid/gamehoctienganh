// Generated practice for Math 6 lessons 3–43.
// The lesson order and headings follow the user's textbook table of contents.
// Question instances are original algorithmic exercises, not transcriptions of SGK.
// REVIEW NOTE: Generated question banks require pedagogical checking before official use.

const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b)[a,b]=[b,a%b];return a;};
const lcm=(a,b)=>Math.abs(a*b)/gcd(a,b);
const frac=(a,b)=>{if(b===0)throw Error("denominator 0");if(b<0){a=-a;b=-b;}let d=gcd(a,b);return (a/d)+"/"+(b/d);};
const roman=n=>{const vals=[[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];let o="";for(const [v,s] of vals)while(n>=v){o+=s;n-=v;}return o;};
const f2=n=>Number(n.toFixed(2)).toString();
const rnd=(a,n)=>a+n;
const single=(prompt,answer,options,hint,explanation)=>({mode:"single",prompt,answer:String(answer),options:[...new Set(options.map(String))],hint,explanation});
const number=(prompt,answer,hint,explanation)=>({mode:"number",prompt,answer:String(answer),hint,explanation});
const decimal=(prompt,answer,hint,explanation)=>({mode:"decimal",prompt,answer:f2(answer),hint,explanation});
const fraction=(prompt,a,b,hint,explanation)=>({mode:"fraction",prompt,answer:frac(a,b),hint,explanation});
const choose=(prompt,correct,wrong,hint,why)=>{
 const options=[String(correct),...wrong.map(String)].filter((x,i,arr)=>arr.indexOf(x)===i);
 if(options.length<2)throw Error("Need 2 options: "+prompt);
 return single(prompt,correct,options,hint,why);
};
const intHint="Xác định dữ kiện, viết phép tính rồi kiểm tra kết quả theo từng bước.";
const ctx=(n,practice,real,abstract)=>practice?abstract:real;
const names=["An","Bình","Chi","Dũng","Hà","Lan","Mai","Minh","Quân","Vy"];
const sides=["hình tam giác đều","hình vuông","hình lục giác đều"];
const geos=["hình chữ nhật","hình bình hành","hình thoi","hình thang cân"];

function make(n,k){
 const t=k+1,practice=k<30;
 const u=2+(k%11),v=3+(k%13),w=4+(k%9),A=10+k*3,B=7+k*2;
 switch(n){
 case 3:{
   const a=30+17*t,b=a+1+(k%19);
   return k%3===0?number(ctx(n,practice,"Một dãy vé có số "+a+". Số vé liền sau mang số nào?","Số tự nhiên liền sau của "+a+" là số nào?"),a+1,"Số liền sau hơn số đã cho 1 đơn vị.",a+" + 1 = "+(a+1)+".")
   :choose(ctx(n,practice,"Hai lớp thu gom được "+a+" và "+b+" vỏ lon. Số nào lớn hơn?","Trong hai số "+a+" và "+b+", số nào lớn hơn?"),b,[a,a-1], "So sánh lần lượt chữ số theo hàng từ trái qua phải.",b+" > "+a+".");
 }
 case 4:{
   const a=80+7*t,b=12+3*t;
   const subtract=k%2===0,answer=subtract?a-b:a+b;
   return number(ctx(n,practice,"Kho có "+a+" quyển vở, "+(subtract?"xuất":"nhập")+" "+b+" quyển. Còn "+(subtract?"lại":"tất cả")+" bao nhiêu quyển?","Tính "+a+(subtract?" − ":" + ")+b+"."),answer,"Dùng phép "+(subtract?"trừ":"cộng")+" số tự nhiên.",a+(subtract?" − ":" + ")+b+" = "+answer+".");
 }
 case 5:{
   const a=5+(k%23),b=2+(k%9);
   if(k%2===0)return number(ctx(n,practice,"Mỗi hộp có "+a+" bút. "+b+" hộp có bao nhiêu bút?","Tính "+a+" × "+b+"."),a*b,"Nhân số bút mỗi hộp với số hộp.",a+" × "+b+" = "+a*b+".");
   return number(ctx(n,practice,"Chia đều "+a*b+" bút thành "+b+" hộp. Mỗi hộp có bao nhiêu bút?","Tính "+a*b+" : "+b+"."),a,"Phép chia ngược lại phép nhân.",a*b+" : "+b+" = "+a+".");
 }
 case 6:{
   const base=2+(k%20),exponent=2+(k%3),res=base**exponent;
   return k%4!==0?number(ctx(n,practice,"Một hệ thống nhân lượng đồ vật lên "+base+" lần ở mỗi lượt, qua "+exponent+" lượt. Hệ số tăng tổng cộng là bao nhiêu?","Tính "+base+"^"+exponent+"."),res,"Lũy thừa là tích của các thừa số bằng nhau.",base+"^"+exponent+" = "+Array(exponent).fill(base).join(" × ")+" = "+res+".")
   :choose("Trong biểu thức "+base+"^"+exponent+", số mũ là số nào?",exponent,[base,res], "Số mũ là số ghi phía trên bên phải cơ số.",exponent+" là số mũ.");
 }
 case 7:{
   const a=3+(k%13),b=4+(k%8),c=2+(k%6);
   const p=k%2===0,expr=p? a+" + "+b+" × "+c:"("+a+" + "+b+") × "+c,res=p?a+b*c:(a+b)*c;
   return number(ctx(n,practice,"Máy tính ghi phép tính "+expr+". Kết quả đúng theo thứ tự phép tính là bao nhiêu?","Tính giá trị biểu thức "+expr+"."),res,"Thực hiện trong ngoặc trước; nhân chia trước cộng trừ.",expr+" = "+res+".");
 }
 case 8:{
   const d=2+(k%9),a=(3+(k%14))*d;
   const q=k%2===0;
   return q?number(ctx(n,practice,"Xếp "+a+" quả bóng thành các nhóm "+d+" quả, được bao nhiêu nhóm?","Vì "+a+" chia hết cho "+d+", tính "+a+" : "+d+"."),a/d,"Chia hết nghĩa là phép chia có số dư bằng 0.",a+" : "+d+" = "+a/d+".")
   :choose("Phép chia "+(a+1)+" cho "+d+" có số dư bằng bao nhiêu?",(a+1)%d,[0,2,3,4], "Tính bội gần nhất không vượt quá số bị chia.",(a+1)+" = "+d+" × "+(a/d)+" + 1.");
 }
 case 9:{
   const d=[2,3,5,9][k%4],t=1000+k,m=d*t;
   return choose(ctx(n,practice,"Cần chọn số để chia đều vào các nhóm "+d+". Số nào chia hết cho "+d+"?","Số nào sau đây chia hết cho "+d+"?"),m,[m+1,m+d+1,m-1], "Dùng dấu hiệu chia hết cho "+d+".",m+" chia hết cho "+d+" vì "+m+" = "+d+" × "+t+".");
 }
 case 10:{
   const prime=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131][k%32];
   const composites=[4,6,8,9,10,12,14,15,16,18,20,21][k%12];
   return k%2===0?choose("Trong các số "+[prime,composites,1,composites*2].join(", ")+"; số nào là số nguyên tố?",prime,[1,composites,composites*2], "Số nguyên tố có đúng hai ước dương: 1 và chính nó.",prime+" là số nguyên tố.")
   :number(ctx(n,practice,"Có "+prime+" viên bi. Số này có bao nhiêu ước dương?","Số nguyên tố "+prime+" có bao nhiêu ước dương?"),2,"Số nguyên tố có đúng hai ước dương.",prime+" có các ước dương 1 và "+prime+".");
 }
 case 11:{
   const a=4+(k%12),b=5+(k%10),d=2+(k%9),x=d*a,y=d*b,res=gcd(x,y);
   return number(ctx(n,practice,"Có "+x+" bút và "+y+" vở; chia thành nhiều phần quà giống nhau nhất. Chia được nhiều nhất bao nhiêu phần?","Tìm ƯCLN("+x+", "+y+")."),res,"Số phần quà nhiều nhất là ước chung lớn nhất.", "ƯCLN("+x+", "+y+") = "+res+".");
 }
 case 12:{
   const a=2+(k%17),b=3+(k%11),res=lcm(a,b);
   return number(ctx(n,practice,"Đèn A chớp mỗi "+a+" phút, đèn B mỗi "+b+" phút. Cả hai vừa chớp cùng lúc; sau ít nhất bao nhiêu phút cùng chớp?","Tìm BCNN("+a+", "+b+")."),res,"Bội chung nhỏ nhất là số dương nhỏ nhất chia hết cho cả hai số.","BCNN("+a+", "+b+") = "+res+".");
 }
 case 13:{
   const a=2+k,b=4+2*k;
   if(k%3===0)return number(ctx(n,practice,"Nhiệt độ là "+(-a)+"°C. Khoảng cách từ nhiệt độ này tới 0°C bằng bao nhiêu độ?","Giá trị tuyệt đối của "+(-a)+" là bao nhiêu?"),a,"Giá trị tuyệt đối là khoảng cách tới 0 trên trục số.","|"+(-a)+"| = "+a+".");
   return choose("Số nào lớn hơn trên trục số: "+(-a)+" hay "+(-b)+"?",Math.max(-a,-b),[Math.min(-a,-b)],"Trong hai số nguyên âm, số có giá trị tuyệt đối nhỏ hơn thì lớn hơn.",Math.max(-a,-b)+" là số lớn hơn.");
 }
 case 14:{
   const a=4+(k%28),b=2+(k%20);
   const x=k%2===0?-a:a,y=k%3===0?-b:b,subtract=k%4===0,res=subtract?x-y:x+y;
   return number(ctx(n,practice,"Nhiệt độ ban đầu "+x+"°C, thay đổi "+(subtract?"bớt đi":"thêm")+" "+y+"°C. Giá trị tính được là bao nhiêu?","Tính "+x+(subtract?" − (" :" + (")+y+")."),res,"Cộng trừ số nguyên theo dấu; trừ số nguyên bằng cộng số đối.",x+(subtract?" − (" :" + (")+y+") = "+res+".");
 }
 case 15:{
   const a=6+(k%17),b=3+(k%12),c=2+(k%9),res=a-(b-c);
   return number("Bỏ dấu ngoặc rồi tính: "+a+" − ("+b+" − "+c+").",res,"Có dấu trừ trước ngoặc: đổi dấu mỗi hạng tử trong ngoặc.",a+" − ("+b+" − "+c+") = "+a+" − "+b+" + "+c+" = "+res+".");
 }
 case 16:{
   const a=2+(k%14),b=3+(k%11),x=k%2===0?-a:a,y=k%3===0?-b:b,res=x*y;
   return number(ctx(n,practice,"Một phép tính theo hai chiều âm/dương là ("+x+") × ("+y+"). Kết quả là bao nhiêu?","Tính ("+x+") × ("+y+")."),res,"Hai số cùng dấu tích dương, khác dấu tích âm.",x+" × "+y+" = "+res+".");
 }
 case 17:{
   const a=2+(k%11),b=2+(k%9),x=-a*b,y=-b,res=a;
   return number("Tính phép chia hết số nguyên: ("+x+") : ("+y+").",res,"Chia hai số cùng dấu được kết quả dương.",x+" : "+y+" = "+res+".");
 }
 case 18:{
   const side=2+k,type=k%3,perimeter=side*[3,4,6][type];
   if(k%4===0)return choose("Hình "+sides[type]+" có bao nhiêu cạnh?",[3,4,6][type],[2,5,8],"Đếm các cạnh của đa giác đều.",sides[type]+" có "+[3,4,6][type]+" cạnh.");
   return number(ctx(n,practice,"Làm khung "+sides[type]+" có cạnh "+side+" cm. Cần bao nhiêu cm dây cho đường viền?","Tính chu vi "+sides[type]+" có cạnh "+side+" cm."),perimeter,"Chu vi của đa giác đều bằng số cạnh nhân độ dài mỗi cạnh.",[3,4,6][type]+" × "+side+" = "+perimeter+" cm.");
 }
 case 19:{
   const type=k%4;
   const facts=[
   ["Hình chữ nhật","Có bốn góc vuông","Hình thoi","Hình thang cân"],
   ["Hình thoi","Có bốn cạnh bằng nhau","Hình chữ nhật","Hình thang cân"],
   ["Hình bình hành","Có hai cặp cạnh đối song song","Hình thang cân","Hình tam giác"],
   ["Hình thang cân","Có một cặp cạnh đối song song và hai góc kề cùng một đáy bằng nhau","Hình thoi","Hình tam giác đều"]
   ][type];
   const labels=["tấm kính","mặt bàn","khung tranh","biển hiệu","miếng bìa"][Math.floor(k/4)%5];
   return choose("Mẫu tứ giác số "+t+" trên "+labels+" được mô tả: “"+facts[1]+"”. Tên hình phù hợp nhất là?",facts[0],[facts[2],facts[3]],"Nhớ các dấu hiệu nhận biết từng hình tứ giác.",facts[0]+" có tính chất đã cho.");
 }
 case 20:{
   const type=k%5,a=4+(k%20),b=3+(k%11),h=2+(k%8);
   let ans,desc,hint;
   if(type===0){ans=a*b;desc="hình chữ nhật có chiều dài "+a+" cm và chiều rộng "+b+" cm";hint="Diện tích hình chữ nhật bằng dài nhân rộng.";}
   if(type===1){ans=4*a;desc="hình vuông cạnh "+a+" cm";hint="Chu vi hình vuông bằng bốn lần cạnh.";}
   if(type===2){ans=a*h;desc="hình bình hành có đáy "+a+" cm và chiều cao "+h+" cm";hint="Diện tích hình bình hành bằng đáy nhân chiều cao.";}
   if(type===3){ans=a*b;desc="hình thoi có hai đường chéo dài "+(2*a)+" cm và "+b+" cm";hint="Diện tích hình thoi bằng nửa tích hai đường chéo.";}
   if(type===4){ans=(a+b)*h;desc="hình thang có hai đáy "+(2*a)+" cm, "+(2*b)+" cm và chiều cao "+h+" cm";hint="Diện tích hình thang bằng nửa tổng hai đáy nhân chiều cao.";}
   return number(ctx(n,practice,"Một mảnh vườn dạng "+desc+". Tính "+(type===1?"chu vi":"diện tích")+" (theo đơn vị tương ứng).","Tính "+(type===1?"chu vi":"diện tích")+" của "+desc+"."),ans,hint,"Áp dụng công thức cho kết quả "+ans+(type===1?" cm.":" cm²."));
 }
 case 21:{
   const type=k%4,shape=["hình vuông","hình chữ nhật không phải hình vuông","hình tam giác đều","hình tròn"][type];
   const res=["4","2","3","Vô số"][type];
   return choose("Một tấm bìa là "+shape+" có "+(type===3?"bán kính ":"độ dài cạnh ")+(3+t)+" cm. Số trục đối xứng của hình là?",res,["0","1","2","3","4","Vô số"].filter(x=>x!==res),"Trục đối xứng chia hình thành hai nửa chồng khít khi gấp lại.",shape+" có "+res+" trục đối xứng.");
 }
 case 22:{
   const type=k%6,shape=["hình chữ nhật","hình bình hành","hình vuông","hình tam giác đều","hình tròn","hình thang cân không phải hình chữ nhật"][type];
   const yes=[true,true,true,false,true,false][type];
   return choose("Một tấm bìa hình "+shape+" có kích thước đặc trưng "+(5+t)+" cm. Hình có tâm đối xứng hay không?",yes?"Có":"Không",[yes?"Không":"Có"],"Quay hình nửa vòng quanh một điểm và xét có chồng khít không.",shape+(yes?" có":" không có")+" tâm đối xứng.");
 }
 case 23:{
   const a=1+(k%9),b=2+(k%8)+a,factor=2+(k%8);
   return fraction("Viết một phân số bằng "+a+"/"+b+". (Có thể nhân cả tử số và mẫu số với "+factor+".)",a*factor,b*factor,"Nhân tử và mẫu với cùng một số nguyên khác 0 được phân số bằng nhau.",a+"/"+b+" = "+(a*factor)+"/"+(b*factor)+".");
 }
 case 24:{
   const a=1+(k%13),b=4+(k%9),c=1+(k%11),d=5+(k%8),left=a*d,right=c*b;
   const result=left<right?"<":left>right?">":"=";
   return choose("Điền dấu đúng: "+a+"/"+b+" __ "+c+"/"+d+".",result,["<",">","="].filter(x=>x!==result),"Đưa về cùng mẫu dương hoặc nhân chéo để so sánh.",a+" × "+d+" "+result+" "+c+" × "+b+", nên "+a+"/"+b+" "+result+" "+c+"/"+d+".");
 }
 case 25:{
   const a=1+(k%8),b=3+(k%9),c=1+(k%7),d=(k%2===0?b:4+(k%8)),minus=k%3===0;
   const numerator=minus?a*d-c*b:a*d+c*b,denominator=b*d;
   return fraction(ctx(n,practice,"Một phần "+a+"/"+b+" lít nước, "+(minus?"dùng bớt":"đổ thêm")+" "+c+"/"+d+" lít. Phần thay đổi tính được là?","Tính "+a+"/"+b+(minus?" − ":" + ")+c+"/"+d+"."),numerator,denominator,"Quy đồng mẫu rồi "+(minus?"trừ":"cộng")+" tử số.",a+"/"+b+(minus?" − ":" + ")+c+"/"+d+" = "+frac(numerator,denominator)+".");
 }
 case 26:{
   const a=1+(k%9),b=2+(k%8),c=1+(k%7),d=3+(k%9),divide=k%2===1;
   const num=divide?a*d:a*c,den=divide?b*c:b*d;
   return fraction("Tính "+a+"/"+b+(divide?" : ":" × ")+c+"/"+d+".",num,den,"Muốn chia phân số hãy nhân với phân số nghịch đảo; nhân thì nhân tử với tử và mẫu với mẫu.",frac(a,b)+(divide?" : ":" × ")+frac(c,d)+" = "+frac(num,den)+".");
 }
 case 27:{
   const den=2+(k%9),num=1+(k%(den-1)),base=3+(k%18),total=den*base,inverse=k%2===1;
   if(inverse)return number("Biết "+num+"/"+den+" của một số bằng "+num*base+". Tìm số đó.",total,"Chia giá trị đã biết cho phân số được cho.",num*base+" : "+num+"/"+den+" = "+total+".");
   return number(ctx(n,practice,"Lớp có "+total+" học sinh; "+num+"/"+den+" số học sinh tham gia câu lạc bộ. Có bao nhiêu em?","Tìm "+num+"/"+den+" của "+total+"."),num*base,"Nhân số đã cho với phân số.",total+" × "+num+"/"+den+" = "+num*base+".");
 }
 case 28:{
   const whole=3+(k%77),tenths=k%10,hundredths=(k*3)%10,one=whole+tenths/10+hundredths/100;
   const place=k%2===0?tenths:hundredths,label=k%2===0?"phần mười":"phần trăm";
   return number("Trong số thập phân "+one.toFixed(2).replace(".",",")+", chữ số hàng "+label+" là chữ số nào?",place,"Xác định vị trí chữ số sau dấu phẩy: thứ nhất là phần mười, thứ hai là phần trăm.","Chữ số hàng "+label+" là "+place+".");
 }
 case 29:{
   const a=120+k*7,b=50+k*3,mul=k%3===0,minus=k%3===1;
   const x=a/10,y=b/10,res=mul?x*y:minus?x-y:x+y;
   return decimal(ctx(n,practice,"Một cửa hàng cần tính "+f2(x)+(mul?" × ":minus?" − ":" + ")+f2(y)+". Hãy tính kết quả.","Tính "+f2(x)+(mul?" × ":minus?" − ":" + ")+f2(y)+"."),res,"Đặt dấu phẩy đúng vị trí khi tính với số thập phân.",f2(x)+(mul?" × ":minus?" − ":" + ")+f2(y)+" = "+f2(res)+".");
 }
 case 30:{
   const a=12+(k%45),dec=(k*7)%100,num=a+dec/100;
   const places=k%3===0?0:1,pow=10**places,res=Math.round(num*pow)/pow;
   return decimal("Làm tròn số "+num.toFixed(2).replace(".",",")+" đến hàng "+(places===0?"đơn vị":"phần mười")+".",res,"Quan sát chữ số liền bên phải hàng cần làm tròn, từ 5 trở lên thì tăng 1.",num.toFixed(2)+" làm tròn được "+f2(res)+".");
 }
 case 31:{
   const p=5*(1+(k%15)),count=20*(2+(k%20)),res=p*count/100;
   return number(ctx(n,practice,"Một cửa hàng có "+count+" sản phẩm, "+p+"% được bán trong ngày. Đã bán bao nhiêu sản phẩm?","Tìm "+p+"% của "+count+"."),res,"Lấy số lượng nhân với tỉ số phần trăm rồi chia 100.",count+" × "+p+"/100 = "+res+".");
 }
 case 32:{
   const letters=["A","B","C","M","N","P"],a=letters[k%6],b=letters[(k+1)%6];
   return choose("Trong hình vẽ đánh số "+t+", qua hai điểm phân biệt "+a+" và "+b+" xác định được bao nhiêu đường thẳng?",1,[0,2,3],"Qua hai điểm phân biệt có một và chỉ một đường thẳng.","Có đúng một đường thẳng đi qua "+a+" và "+b+".");
 }
 case 33:{
   const a=2+(k%10),b=3+(k%15),letters=["A","B","C","M","N","P"],start=k%4;
   const pts=letters.slice(start,start+3);
   const mid=pts[1];
   return choose("Ba điểm "+pts.join(", ")+" cùng thuộc một đường thẳng theo thứ tự đó, khoảng cách hai đoạn liên tiếp là "+a+" cm và "+b+" cm. Điểm nào nằm giữa hai điểm còn lại?",mid,[pts[0],pts[2]],"Điểm giữa là điểm đứng thứ hai trong thứ tự đã cho.",mid+" nằm giữa "+pts[0]+" và "+pts[2]+".");
 }
 case 34:{
   const ab=2+(k%19),bc=3+(k%21),findTotal=k%2===0;
   const ans=findTotal?ab+bc:bc;
   return number("Trên một đường thẳng, B nằm giữa A và C, "+(findTotal?"AB = "+ab+" cm, BC = "+bc+" cm. Tính AC.":"AB = "+ab+" cm, AC = "+(ab+bc)+" cm. Tính BC."),ans,"Khi B nằm giữa A và C: AB + BC = AC.","Độ dài cần tìm là "+ans+" cm.");
 }
 case 35:{
   const half=2+k,res=k%2===0?half:half*2;
   return number(k%2===0?"M là trung điểm của đoạn AB có độ dài "+(2*half)+" cm. Tính AM.":"M là trung điểm đoạn AB, AM = "+half+" cm. Tính AB.",res,"Trung điểm chia đoạn thẳng thành hai phần bằng nhau.","Độ dài cần tìm bằng "+res+" cm.");
 }
 case 36:{
   const letters=["O","M","A","B","C","P"],apex=letters[k%6],first=["x","y","u","v"][k%4],second=["y","z","v","w"][k%4];
   return choose("Trong hình minh họa số "+t+", hai tia "+apex+first+" và "+apex+second+" chung gốc "+apex+". Đỉnh của góc tạo bởi hai tia là điểm nào?",apex,letters.filter(z=>z!==apex).slice(0,3),"Đỉnh của góc là gốc chung của hai tia.",apex+" là đỉnh của góc.");
 }
 case 37:{
   const degree=k%9===0?90:k%11===0?180:(1+(k*17)%179);
   const label=degree<90?"Góc nhọn":degree===90?"Góc vuông":degree<180?"Góc tù":"Góc bẹt";
   return choose("Góc đánh dấu số "+t+" có số đo "+degree+"°. Đó là loại góc nào?",label,["Góc nhọn","Góc vuông","Góc tù","Góc bẹt"].filter(x=>x!==label),"Góc nhọn nhỏ hơn 90°, vuông bằng 90°, tù nằm giữa 90° và 180°, bẹt bằng 180°.",degree+"° là "+label.toLowerCase()+".");
 }
 case 38:{
   const label=["màu yêu thích","số quyển sách","chiều cao","môn thể thao yêu thích","số anh chị em","loại quả yêu thích"][k%6];
   const numeric=[false,true,true,false,true,false][k%6];
   return choose("Phiếu điều tra số "+t+" có mục “"+label+"”. Mục này thuộc loại dữ liệu nào?",numeric?"Dữ liệu số":"Dữ liệu không phải số",[numeric?"Dữ liệu không phải số":"Dữ liệu số"],"Dữ liệu dạng số biểu thị một số lượng hoặc số đo.",label+" là "+(numeric?"dữ liệu số.":"dữ liệu không phải số."));
 }
 case 39:{
   const icon=2+(k%7),count=3+(k%15),res=icon*count;
   return number("Trong một biểu đồ tranh, mỗi hình ngôi sao biểu thị "+icon+" quyển sách. Có "+count+" ngôi sao. Biểu đồ biểu thị bao nhiêu quyển sách?",res,"Lấy số hình nhân số đối tượng mỗi hình đại diện.",count+" × "+icon+" = "+res+" quyển.");
 }
 case 40:{
   const a=10+(k%31),b=5+(k*3%27),res=Math.max(a,b);
   return number("Biểu đồ cột cho biết lớp 6A trồng "+a+" cây, lớp 6B trồng "+b+" cây. Số cây của lớp trồng nhiều nhất là bao nhiêu?",res,"Đọc chiều cao của hai cột, chọn cột lớn hơn.","Số cây lớn nhất là "+res+".");
 }
 case 41:{
   const a=10+(k%25),b=8+(k*3%20),c=7+(k*5%18),d=5+(k*7%16),res=k%2===0?Math.abs(a-b):a+c;
   return number("Biểu đồ cột kép có số cây lớp 6A năm 1: "+a+", năm 2: "+b+"; lớp 6B năm 1: "+c+", năm 2: "+d+". "+(k%2===0?"Độ chênh lệch của lớp 6A giữa hai năm là bao nhiêu?":"Tổng số cây của hai lớp trong năm 1 là bao nhiêu?"),res,"Xác định đúng hai cột cần đọc rồi tính theo yêu cầu.", "Kết quả là "+res+" cây.");
 }
 case 42:{
   const type=k%4;
   const count=type===0?2**(1+(k%3)):type===1?6**(1+(k%2)):type===2?3+(k%9):5+(k%20);
   const thing=type===0?(1+(k%3))+" lần tung đồng xu":type===1?(1+(k%2))+" lần gieo xúc xắc sáu mặt":type===2?"vòng quay chia "+count+" ô đều được đánh số khác nhau":"bốc một thẻ trong "+count+" thẻ đánh số từ 1 đến "+count;
   return number("Xét trò chơi số "+t+": "+thing+". Có bao nhiêu kết quả cơ bản có thể xảy ra (phân biệt thứ tự khi có nhiều lần thử)?",count,"Liệt kê tất cả kết quả có thể của một lần thử.", "Có "+count+" kết quả phân biệt.");
 }
 case 43:{
   const trials=10*(3+(k%20)),wins=3+(k*7%(trials-3));
   return fraction("Trong "+trials+" lần thử, sự kiện A xảy ra "+wins+" lần. Viết tỉ số thực nghiệm số lần A xảy ra trên số lần thử dưới dạng phân số.",wins,trials,"Xác suất thực nghiệm bằng số lần sự kiện xảy ra chia tổng số lần thử.","Tỉ số thực nghiệm là "+wins+"/"+trials+" = "+frac(wins,trials)+".");
 }
 default: throw Error("Unknown lesson "+n);
 }
}

export function generateBank(lesson){
 if(!Number.isInteger(lesson)||lesson<3||lesson>43)throw new RangeError("lesson 3..43");
 const bank=[];
 for(let k=0;k<50;k++){
   const row=make(lesson,k);
   if(!row.prompt||row.answer===undefined||!row.hint||!row.explanation)throw Error("Incomplete exercise lesson "+lesson+"-"+k);
   if(row.mode==="single"&&!row.options.includes(String(row.answer)))throw Error("Wrong option in "+lesson+"-"+k);
   bank.push({...row,id:"M6-B"+String(lesson).padStart(2,"0")+"-"+(k<30?"L":"V")+String(k<30?k+1:k-29).padStart(2,"0"),lesson,knowledge:1,level:k<30?"practice":"application",source:"original-algorithmic-unreviewed"});
 }
 if(new Set(bank.map(q=>q.prompt)).size!==50)throw Error("Repeated prompts in lesson "+lesson);
 return bank;
}

export function checkGeneratedAnswer(q,value){
 if(q.mode==="single")return typeof value==="string"&&value===q.answer;
 if(q.mode==="number"){
  if(typeof value!=="string" || !/^[+-]?(?:0|[1-9][0-9]*)$/.test(value.trim()))return false;
  return Number(value.trim())===Number(q.answer);
 }
 if(q.mode==="decimal"){
  if(typeof value!=="string")return false;
  const s=value.trim().replace(",",".");
  return /^[-+]?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?$/.test(s) && Math.abs(Number(s)-Number(q.answer))<1e-9;
 }
 if(q.mode==="fraction"){
  if(typeof value!=="string")return false;
  const s=value.trim().replace(/\s/g,"");
  if(!/^-?\d+(?:\/-?\d+)?$/.test(s))return false;
  let [n,d]=s.split("/").map(Number);if(!Number.isSafeInteger(n)||!Number.isSafeInteger(d)||d===0)return false;
  const [a,b]=q.answer.split("/").map(Number);return n*b===a*d;
 }
 return false;
}

export function drawGeneratedQuiz(bank,random=Math.random){
 const shuffle=xs=>{const a=xs.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
 const q=shuffle([...shuffle(bank.filter(x=>x.level==="practice")).slice(0,6),...shuffle(bank.filter(x=>x.level==="application")).slice(0,4)]);
 if(q.length!==10||new Set(q.map(x=>x.id)).size!==10)throw Error("Invalid quiz");
 return q;
}

export function pointsAt(seconds,wrongs){
 const n=Math.max(0,Number(seconds)||0);
 return wrongs>=2?0:Math.max(0,100-10*Math.floor(Math.max(0,n-10)/10)-(wrongs?50:0));
}
