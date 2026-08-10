# OohInsightLab Design System — DESIGN.md
> **모든 앱 개발 시 이 파일을 참고해서 디자인 일관성을 유지할 것.**
> **새 기능 작성 시 반드시 curl로 읽고 스타일 맞출 것:**
> `curl https://raw.githubusercontent.com/gon2800/design/main/DESIGN.md`

---

## 1. CSS 변수 (디자인 토큰)

```css
:root {
  /* 배경 */
  --bg: #F5F6FB;
  --card: #FFFFFF;

  /* 텍스트 */
  --ink: #1F2437;
  --sub: #7A809A;

  /* 선 */
  --line: #EBEDF4;
  --line-strong: #D3D8E6;

  /* 액센트 (인디고/퍼플) */
  --accent: #5B54E8;
  --accent-dark: #4C46D6;
  --accent-soft: #EEEDFD;

  /* 위험/삭제 */
  --danger: #EF6C6C;
  --danger-soft: #FDECEC;

  /* 그림자 */
  --shadow: 0 1px 2px rgba(31,36,55,.04), 0 8px 24px rgba(31,36,55,.06);

  /* 반경 */
  --radius: 18px;
}
```

---

## 2. 폰트

```css
font-family: -apple-system, "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", system-ui, sans-serif;
```

- 기본 크기: 16px
- 앱 타이틀: 20px, font-weight 700, letter-spacing -0.3px
- 탭 텍스트: 14px, font-weight 700 (비활성) / 800 (활성)
- 카드 제목: 17px, font-weight 800
- 라벨/보조: 11~13px, color var(--sub)

---

## 3. 레이아웃

- 최대 너비: **430px**, margin: 0 auto
- 좌우 패딩: 10~16px
- 카드 간격: 10~12px margin-bottom
- safe-area-inset 적용 필수

---

## 4. 헤더

```html
<div class="app-header">
  <div class="header-icon">
    <img src="/icon-192.png" alt="앱 이름">
  </div>
  <span class="header-title">앱 이름</span>
  <button class="header-settings">
    <i class="ti ti-settings"></i>
  </button>
</div>
```

```css
.app-header {
  background: transparent;
  padding: max(env(safe-area-inset-top), 14px) 16px 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.header-icon {
  width: 42px; height: 42px;
  border-radius: 13px; overflow: hidden; flex-shrink: 0;
}
.header-title {
  font-size: 20px; font-weight: 700;
  color: var(--ink); letter-spacing: -0.3px;
}
.header-settings {
  margin-left: auto;
  width: 40px; height: 40px;
  border-radius: 9px; border: none;
  background: transparent; color: #000;
  font-size: 24px;
  display: flex; align-items: center; justify-content: center;
}
.header-settings:active { background: rgba(0,0,0,.06); }
```

---

## 5. 탭바 — 견출지 스타일 (핵심)

활성 탭이 아래 카드와 자연스럽게 이어지는 견출지 효과.

```css
.tab-bar {
  display: flex;
  padding: 0 10px;
  overflow-x: auto;
  background: transparent;
}
.tab-bar::-webkit-scrollbar { display: none; }

.tab-item {
  position: relative;
  flex: 1; min-width: 66px;
  padding: 11px 2px 10px;
  text-align: center;
  font-size: 14px; font-weight: 700;
  color: var(--sub);
  background: transparent;
  border-radius: 8px 8px 0 0;
  cursor: pointer; white-space: nowrap;
}
.tab-item.active {
  background: var(--card);
  color: var(--accent);
  font-weight: 800;
  border-bottom: 1px solid var(--card);
  margin-bottom: -1px;
}
/* 견출지 좌우 연결 곡선 */
.tab-item.active::before,
.tab-item.active::after {
  content: "";
  position: absolute; bottom: 0;
  width: 8px; height: 8px;
  pointer-events: none;
}
.tab-item.active::before {
  left: -8px;
  background: radial-gradient(circle at top left, transparent 8px, var(--card) 8px);
}
.tab-item.active::after {
  right: -8px;
  background: radial-gradient(circle at top right, transparent 8px, var(--card) 8px);
}
.tab-item:first-child.active::before { content: none; }
.tab-item:last-child.active::after { content: none; }
.tab-item:first-child.active { border-top-left-radius: var(--radius); }
.tab-item:last-child.active { border-top-right-radius: var(--radius); }
```

**주의: 탭에 이모지 아이콘 사용하지 않음. 텍스트만.**

---

## 6. 카드

```css
.tab-card {
  background: var(--card);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 14px 14px 74px;
  min-height: 220px;
  position: relative;
}
/* 첫 번째 탭 활성 시: 왼쪽 상단 각짐 */
.tab-card.corner-first {
  border-radius: 0 var(--radius) var(--radius) var(--radius);
}
/* 마지막 탭 활성 시: 오른쪽 상단 각짐 */
.tab-card.corner-last {
  border-radius: var(--radius) 0 var(--radius) var(--radius);
}
```

---

## 7. 탭 전환 (스와이프 포함)

- 탭 클릭/탭바 스와이프 시 슬라이드 애니메이션 (.25s ease)
- **스와이프는 탭바 영역에서만 작동** (콘텐츠 스크롤과 충돌 방지)
- calc-note의 switchTab() 함수 참고

```javascript
// 핵심 로직
oldPane.style.transform = `translateX(${forward ? -100 : 100}%)`;
newPane.style.transform = 'translateX(0)';
// transition: 'transform .25s ease'
```

---

## 8. 버튼

### 주요 액션 (저장/확인)
```css
.btn-primary {
  width: 100%; height: 46px;
  border-radius: 14px;
  background: var(--accent); color: #fff;
  border: none; font-size: 16px; font-weight: 700;
}
.btn-primary:active { background: var(--accent-dark); }
```

### 보조 버튼
```css
.btn-secondary {
  height: 40px; padding: 0 14px;
  border-radius: 10px;
  border: 2px solid var(--line);
  background: var(--card); color: var(--sub);
  font-size: 13px; font-weight: 700;
}
.btn-secondary:active {
  background: var(--accent-soft);
  color: var(--accent);
  border-color: var(--accent);
}
```

### 삭제 버튼 (아이콘)
```css
.icon-btn {
  width: 34px; height: 34px;
  border-radius: 9px; border: none;
  background: var(--danger-soft); color: var(--danger);
  font-size: 15px;
}
```

### FAB (플로팅 추가 버튼)
```css
.fab {
  position: absolute; bottom: 16px; right: 16px;
  width: 44px; height: 44px;
  background: var(--accent); border: none;
  border-radius: 50%; color: #fff;
  box-shadow: 0 2px 8px rgba(91,86,200,.4);
  font-size: 22px;
}
.fab:active { background: var(--accent-dark); }
```

---

## 9. 입력 필드

```css
.field-row label {
  display: block;
  font-size: 12px; font-weight: 700;
  color: var(--sub); margin-bottom: 5px;
}
.field-row input, .field-row textarea {
  width: 100%; height: 40px;
  border-radius: 10px;
  border: 2px solid var(--accent);
  padding: 0 10px;
  font-size: 15px; font-weight: 500;
  background: var(--card); color: var(--ink);
}
.field-row textarea {
  height: auto; min-height: 64px;
  padding: 8px 10px; resize: vertical;
}
.field-row select {
  width: 100%; height: 40px;
  border-radius: 10px;
  border: 1.5px solid var(--line);
  padding: 0 8px;
  font-size: 15px; font-weight: 700;
  background: var(--bg); color: var(--ink);
  -webkit-appearance: none;
}
```

---

## 10. 바텀 시트 (모달)

```css
.sheet {
  position: fixed; left: 0; right: 0; bottom: 0;
  background: var(--card);
  border-radius: 24px 24px 0 0;
  padding: 8px 20px calc(20px + env(safe-area-inset-bottom));
  transform: translateY(100%);
  transition: transform .25s cubic-bezier(.32,.72,0,1);
  z-index: 21;
  max-width: 430px; margin: 0 auto;
  max-height: 86vh; overflow-y: auto;
}
.sheet.show { transform: translateY(0); }
.handle {
  width: 40px; height: 4px;
  background: var(--line); border-radius: 3px;
  margin: 6px auto 14px;
}
```

---

## 11. 테이블

```css
.table-wrap {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid var(--line);
}
.data-table {
  width: 100%; border-collapse: collapse;
}
.data-table th {
  font-size: 11px; color: var(--sub); font-weight: 700;
  text-align: center;
  padding: 9px 10px;
  background: var(--bg);
  border-bottom: 1px solid var(--line);
  white-space: nowrap;
}
.data-table td {
  font-size: 13px; padding: 10px;
  border-bottom: 1px solid var(--line);
  color: var(--ink);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
/* 구분, 서비스 필드: 가운데 맞춤 */
.data-table td:nth-child(1),
.data-table td:nth-child(2) { text-align: center; }
.data-table tr:last-child td { border-bottom: none; }
.data-table tbody tr { cursor: pointer; }
.data-table tbody tr:active { background: var(--accent-soft); }
.badge {
  display: inline-block;
  padding: 3px 9px; border-radius: 7px;
  font-size: 11px; font-weight: 700;
  background: var(--accent-soft); color: var(--accent);
}
```

---

## 12. 검색 입력

```css
.search-input {
  width: 100%; height: 38px;
  border-radius: 10px;
  border: 1.5px solid var(--line);
  padding: 0 12px;
  font-size: 14px; font-weight: 500;
  background: var(--bg); color: var(--ink);
  margin-bottom: 10px;
}
.search-input:focus {
  outline: none;
  border-color: var(--accent);
}
```

---

## 13. 오버레이

```css
#overlay {
  position: fixed; inset: 0;
  background: rgba(15,17,30,.42);
  z-index: 20;
  opacity: 0; pointer-events: none;
  transition: opacity .2s ease;
}
#overlay.show { opacity: 1; pointer-events: auto; }
```

---

## 14. 토스트 알림

```css
#toast {
  position: fixed; left: 50%; bottom: 30px;
  transform: translateX(-50%) translateY(20px);
  background: rgba(31,36,55,.92); color: #fff;
  padding: 10px 18px; border-radius: 20px;
  font-size: 13px; font-weight: 600;
  z-index: 60; opacity: 0; pointer-events: none;
  transition: opacity .2s ease, transform .2s ease;
}
#toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
```

---

## 15. 아이콘

- 라이브러리: **Tabler Icons Webfont v3.19.0**
- CDN: `https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css`
- 사용법: `<i class="ti ti-[아이콘명]"></i>`

---

## 16. PWA 필수 파일

- `manifest.webmanifest`: 앱 메타데이터, 아이콘 경로
- `sw.js`: 서비스워커 (오프라인 캐시)
- `icon-192.png`: 앱 아이콘 (붓글씨 한자 캘리그라피 스타일)
- `icon-512.png`: 스플래시 아이콘

### 앱별 아이콘
| 앱 | 한자 | 의미 |
|---|---|---|
| My Calculator | 計算 | 계산 |
| My Weight | 體重 | 체중 |
| My Vault | 金庫 | 금고 |
| My Memo | 記錄 | 기록 (예정) |

---

## 17. 안드로이드 뒤로가기 방어

PWA 설치 시 안드로이드 뒤로가기 버튼이 앱 종료로 연결되는 것을 방지.

```javascript
// 항상 히스토리 트랩 유지
function armBackTrap(){
  history.pushState({ myvaultTrap: true }, "");
}
window.addEventListener("popstate", function(){
  if (document.querySelector(".sheet.show")){
    closeAllSheets(); // 시트가 열려있으면 시트만 닫기
    return;
  }
  armBackTrap(); // 트랩 재설정
});
armBackTrap(); // 앱 시작 시 실행
```

---

## 18. theme-color

```html
<meta name="theme-color" content="#F5F6FB">
```

---

## 19. 새 앱 시작 체크리스트

- [ ] CSS 변수 `:root` 블록 복사
- [ ] 헤더 구조 (아이콘 42px + 타이틀 + 설정버튼) 적용
- [ ] 탭바 견출지 스타일 적용 (이모지 없이 텍스트만)
- [ ] 첫/마지막 탭 `.corner-first` / `.corner-last` 적용
- [ ] 탭 스와이프 (탭바 영역에서만)
- [ ] FAB 버튼 우하단 배치
- [ ] 바텀 시트 + 오버레이
- [ ] 토스트 알림
- [ ] safe-area-inset 패딩 적용
- [ ] Tabler Icons webfont import
- [ ] manifest.webmanifest + sw.js
- [ ] 안드로이드 뒤로가기 방어 코드
- [ ] max-width: 430px

