/* back.js — 안드로이드 뒤로가기 처리 (weight-note v1.0.5에서 그대로)
   규칙
   1) 시트·대화상자 같은 "화면 위에 뜨는 창"은 열 때 히스토리를 하나 쌓는다.
   2) 폰 뒤로가기는 맨 위 창만 닫는다. 열린 창이 없으면(홈) 아무것도 안 해서 앱이 그대로 종료된다.
   3) X 버튼·바깥 터치·저장으로 닫을 때도 history.back()을 거쳐서, 뒤로가기 기록이 쌓여 남지 않는다.

   사용법
     ovOpen("settings", ()=>{ /* 보이게 */ }, ()=>{ /* 숨기게 */ });
     ovClose("settings");              // X·바깥 터치·저장 버튼에서 호출
     // 창을 닫은 "다음에" 다른 창을 열 때: ovAfter=()=>다음창열기(); ovClose("settings");
     //   (닫는 도중에 새 창을 열면 새 창이 같이 닫혀 버린다)
     // keep: 닫기를 막고 싶을 때 true를 돌려주는 함수(선택)
*/
const ovStack=[]; let ovAfter=null;
function ovOpen(id,show,hide,keep){
  if(ovStack.some(o=>o.id===id)) return;
  show(); ovStack.push({id,hide,keep,closing:false}); history.pushState({ov:id},"");
}
function ovClose(id){
  const t=ovStack[ovStack.length-1];
  if(t&&t.id===id){ if(!t.closing){ t.closing=true; history.back(); } return; }
  const i=ovStack.findIndex(o=>o.id===id);
  if(i>=0){ ovStack[i].hide(); ovStack.splice(i,1); }
}
window.addEventListener("popstate",()=>{
  const t=ovStack[ovStack.length-1];
  if(!t) return; // 열린 창이 없으면 개입하지 않는다(홈에서는 그대로 앱 종료)
  if(t.keep&&t.keep()){ t.closing=false; history.pushState({ov:t.id},""); return; }
  ovStack.pop(); t.hide();
  const f=ovAfter; ovAfter=null; if(f) f();
});
if(history.state&&history.state.ov) history.replaceState(null,""); // 새로고침 뒤 남은 표시 정리
