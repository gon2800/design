/* lock.js — 잠금 화면 동작의 구조 (My Vault v1.1.8 기준)
   들어 있는 것: PIN 입력(점·지우기·6자리 채우면 확인), PC 키보드 입력, 지문 자동 실행,
                 취소·실패 처리, 지문창 겹침 방지, 오류 흔들림과 문구.
   들어 있지 않은 것(앱이 직접 연결): PIN 검증, 암호화, 지문 등록·인증 함수 본체.
   → 아래 "여기에 앱의 ... 연결" 표시가 있는 세 자리만 채운다. 그 밖의 부분은 건드리지 않아도 된다.
   이 파일에 실제 PIN·키·지문 정보를 쓰지 않는다. */

var PIN_LENGTH = 6;

var pinBuffer = "";   // 지금까지 누른 숫자 (화면에 점으로만 보인다)
var dotsEl = document.getElementById("dots");
var lockSubEl = document.getElementById("lock-sub");
var LOCK_HINT = "PIN 6자리를 입력하세요";

/* ---------- 앱이 연결하는 자리 (1/3) ---------- */
// 여기에 앱의 PIN 검증 함수를 연결한다. PIN이 맞으면 true, 틀리면 false(또는 예외)를 돌려준다.
async function verifyPin(pin){
  throw new Error("verifyPin: 앱의 PIN 검증 함수를 연결하세요");
}
// 여기에 앱의 지문 등록 여부 확인을 연결한다. (등록 상태를 어디에 저장하는지는 앱이 정한다)
function fpIsRegistered(){
  return false;
}
// 여기에 앱의 지문 인증(시스템 지문창 띄우기)을 연결한다. 성공하면 잠금 해제에 필요한 값을 돌려주고,
// 취소·실패하면 예외를 던진다. 이 파일은 그 안을 알 필요가 없다.
async function authenticateFingerprint(){
  throw new Error("authenticateFingerprint: 앱의 지문 인증 함수를 연결하세요");
}
/* ---------- 앱이 연결하는 자리 끝 ---------- */

// 잠금이 풀렸을 때 앱이 호출한다 (잠금 화면 숨기기 + 앱 화면 보이기).
function unlockApp(){
  fpAutoTried = false; // 다시 잠기면 자동 실행 기회를 새로 준다
  document.getElementById("lock-screen").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
}

/* ---------- PIN 점과 숫자 입력 ---------- */
function renderDots(){
  var dots = dotsEl.querySelectorAll(".dot");
  for (var i = 0; i < dots.length; i++) dots[i].classList.toggle("filled", i < pinBuffer.length);
}
function shakeDots(){ // 틀렸을 때 점이 좌우로 흔들린다 (0.38초)
  dotsEl.classList.add("shake");
  setTimeout(function(){ dotsEl.classList.remove("shake"); }, 400);
}
function pressKey(k){
  if (k === "back"){
    pinBuffer = pinBuffer.slice(0, -1);
    renderDots();
    return;
  }
  if (pinBuffer.length >= PIN_LENGTH) return;
  pinBuffer += k;
  renderDots();
  if (pinBuffer.length === PIN_LENGTH) setTimeout(handlePinComplete, 120); // 마지막 점이 채워지는 모습이 보이게 잠깐 기다림
}
document.getElementById("keypad").addEventListener("click", function(e){
  var btn = e.target.closest(".key");
  if (!btn || !btn.dataset.k) return;
  pressKey(btn.dataset.k);
});

async function handlePinComplete(){
  var pin = pinBuffer;
  var ok = false;
  try { ok = await verifyPin(pin); } catch (err){ ok = false; }
  if (ok){
    pinBuffer = "";
    renderDots();
    unlockApp();
    return;
  }
  // 틀렸을 때: 점이 흔들리고, 문구가 바뀌고, 입력이 지워진다. 1.4초 뒤 원래 안내 문구로 돌아온다.
  shakeDots();
  lockSubEl.textContent = "PIN이 올바르지 않습니다";
  pinBuffer = "";
  renderDots();
  setTimeout(function(){ lockSubEl.textContent = LOCK_HINT; }, 1400);
}

/* ---------- PC 키보드 입력 ---------- */
// 잠금 화면이 보일 때만 처리하고, 아니면 키 입력을 가로채지 않는다.
// e.key는 윗줄 숫자("0"~"9")와 숫자패드를 똑같이 돌려주므로 따로 나눌 필요가 없다.
function isLockScreenShown(){
  return !document.getElementById("lock-screen").classList.contains("hidden");
}
document.addEventListener("keydown", function(e){
  if (!isLockScreenShown()) return;
  if (e.ctrlKey || e.metaKey || e.altKey) return; // 복사·새로고침 같은 단축키는 그대로 둔다
  if (/^[0-9]$/.test(e.key)){
    e.preventDefault();
    pressKey(e.key);
  } else if (e.key === "Backspace"){
    e.preventDefault();
    pressKey("back");
  }
});

/* ---------- 지문 자동 실행, 취소·실패 처리, 겹침 방지 ---------- */
var fpBusy = false;       // 지문창이 떠 있는 동안 true. 이 동안은 새로 띄우지 않는다(겹쳐 뜨는 것 방지)
var fpAutoTried = false;  // 이번 잠금 화면에서 자동 실행을 이미 했는지. 한 번 했으면 취소·실패 뒤에 다시 띄우지 않는다

async function fpUnlock(auto){
  if (fpBusy) return;
  fpBusy = true;
  try {
    await authenticateFingerprint(); // 앱 쪽 함수: 지문창을 띄우고, 성공하면 잠금 해제에 필요한 처리까지 한다
    pinBuffer = "";
    renderDots();
    unlockApp();
  } catch (err){
    // 취소나 실패: PIN 화면을 그대로 둔다.
    // 자동 실행일 때는 오류 문구도 보여주지 않는다(브라우저가 자동 실행을 막은 경우도 여기로 온다).
    // 아이콘을 눌러 직접 실행했을 때만 짧은 안내를 보여준다. 오류 이름·내용 같은 기술 문구는 화면에 내지 않는다.
    if (!auto) lockSubEl.textContent = "지문 인증에 실패했습니다. PIN으로 열 수 있습니다";
    if (!auto) setTimeout(function(){ lockSubEl.textContent = LOCK_HINT; }, 2000);
  } finally {
    fpBusy = false;
  }
}

// 앱을 열었을 때(잠금 화면이 떠 있을 때) 지문창을 한 번만 자동으로 띄운다.
function autoFingerprint(){
  if (fpAutoTried || fpBusy) return;
  if (!isLockScreenShown()) return;
  if (document.visibilityState !== "visible") return; // 화면에 안 보이는 동안에는 띄우지 않는다
  if (!window.PublicKeyCredential || !fpIsRegistered()) return; // 지문 미등록·미지원 기기는 자동 실행 없이 PIN만
  fpAutoTried = true;
  fpUnlock(true);
}

// 지문 아이콘을 누르면 다시 지문창. (사용자가 직접 누른 것이라 브라우저가 막지 않는다)
document.getElementById("fp-btn").addEventListener("click", function(e){
  e.currentTarget.classList.remove("pulse");
  void e.currentTarget.offsetWidth;
  e.currentTarget.classList.add("pulse");
  if (!fpIsRegistered()){
    lockSubEl.textContent = "등록된 지문이 없습니다. PIN으로 열어 주세요";
    setTimeout(function(){ lockSubEl.textContent = LOCK_HINT; }, 2000);
    return;
  }
  fpUnlock(false);
});

/* ---------- 시작 ---------- */
lockSubEl.textContent = LOCK_HINT;
autoFingerprint();
// 다른 앱에 갔다가 돌아왔을 때 잠금 화면이 떠 있고 아직 자동 실행을 안 했다면 한 번 실행한다.
// (fpAutoTried 덕분에 취소한 뒤 돌아와도 다시 뜨지 않는다.)
document.addEventListener("visibilitychange", function(){
  if (document.visibilityState === "visible") autoFingerprint();
});
