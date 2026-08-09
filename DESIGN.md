# OohInsightLab Design System — DESIGN.md

> **모든 앱 개발 시 이 파일을 참고해서 디자인 일관성을 유지할 것.**

---

## 1. CSS 변수 (토큰)

```css
:root {
  /* 배경 */
  --bg: #F5F6FB;          /* 앱 전체 배경 */
  --card: #FFFFFF;         /* 카드/시트 배경 */

  /* 텍스트 */
  --ink: #1F2437;          /* 주요 텍스트 */
  --sub: #7A809A;          /* 보조 텍스트, 라벨 */

  /* 선 */
  --line: #EBEDF4;         /* 기본 구분선, 테두리 */
  --line-strong: #D3D8E6;  /* 강조 구분선 */

  /* 액센트 (인디고/퍼플) */
  --accent: #5B54E8;       /* 메인 컬러 — 버튼, 탭 활성, 링크 */
  --accent-dark: #4C46D6;  /* 액센트 hover/active */
  --accent-soft: #EEEDFD;  /* 액센트 연한 배경 */

  /* 위험/삭제 */
  --danger: #EF6C6C;
  --danger-soft: #FDECEC;

  /* 식사량 */
  --food-hi: #E5484D;
  --food-mid: #EAB308;
  --food-lo: #3FB950;

  /* 음주 */
  --drink: #EF6C6C;

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

- 기본 크기: 16px (body)
- 앱 타이틀: 20px, font-weight 700, letter-spacing -0.3px
- 카드 제목: 16px, font-weight 800
- 라벨/보조: 11~13px, color var(--sub)
- 숫자 강조: font-variant-numeric tabular-nums 적용

---

## 3. 레이아웃

- 최대 너비: 430px (calc-note), 520px (weight-note) — 모바일 우선
- 좌우 패딩: 10~14px
- 카드 간격: 10~12px margin-bottom

---

## 4. 헤더

```html
<div class="app-header">
  <div class="header-icon">
    <img src="/icons/icon-192.png" alt="앱 이름">  <!-- 42x42, border-radius 13px -->
  </div>
  <span class="header-title">My Vault</span>
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
.header-icon { width: 42px; height: 42px; border-radius: 13px; overflow: hidden; }
.header-title { font-size: 20px; font-weight: 700; color: var(--ink); letter-spacing: -0.3px; }
```

---

## 5. 탭바 (견출지 스타일)

- 활성 탭이 아래 카드와 이어지는 견출지 효과
- 비활성: color var(--sub), font-weight 700
- 활성: background var(--card), color var(--accent), font-weight 800, border-bottom 제거
- 좌우 라운드 연결을 위한 ::before / ::after 사용

```css
.tab-bar {
  display: flex;
  padding: 0 10px;
  overflow-x: auto;
  background: transparent;
}
.tab-item {
  flex: 1;
  min-width: 54px;
  padding: 10px 2px 9px;
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  color: var(--sub);
  border-radius: 8px 8px 0 0;
  cursor: pointer;
}
.tab-item.active {
  background: var(--card);
  color: var(--accent);
  font-weight: 800;
  border-bottom: 1px solid var(--card);
  margin-bottom: -1px;
}
/* 탭 아이콘: 이모지 (font-size 19px) + 텍스트 조합 */
.tab-item .ti { display: block; font-size: 19px; margin-bottom: 3px; }
```

---

## 6. 카드

```css
.tab-card {
  background: var(--card);
  border-radius: var(--radius);   /* 18px */
  box-shadow: var(--shadow);
  padding: 16px;
}
.tab-card + .tab-card { margin-top: 12px; }

/* 첫 번째 카드: 왼쪽 상단 모서리 각짐 (활성 탭과 이어짐) */
.tab-card.corner-first { border-radius: 0 var(--radius) var(--radius) var(--radius); }
/* 마지막 탭의 첫 번째 카드: 오른쪽 상단 각짐 */
.tab-card.corner-last  { border-radius: var(--radius) 0 var(--radius) var(--radius); }
```

---

## 7. 버튼

### 주요 액션 버튼 (저장/확인)
```css
.btn-primary {
  width: 100%;
  height: 46px;
  border-radius: 14px;
  background: var(--accent);
  color: #fff;
  border: none;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}
.btn-primary:active { background: var(--accent-dark); }
```

### 보조 버튼 / 세그먼트
```css
border: 2px solid var(--line);
background: var(--card);
border-radius: 9px;
font-size: 13px;
font-weight: 700;
color: var(--sub);
/* 활성 시 */
background: var(--accent-soft);
color: var(--accent);
border-color: var(--accent);
```

### 삭제 버튼
```css
background: var(--bg);
color: var(--danger);
```

### FAB (플로팅 추가 버튼)
```css
position: absolute;
bottom: 16px;
right: 16px;
width: 44px;
height: 44px;
background: var(--accent);
border-radius: 50%;
color: #fff;
box-shadow: 0 2px 8px rgba(91,86,200,.4);
```

---

## 8. 입력 필드

```css
/* 기본 입력 */
input {
  height: 40px;
  border-radius: 10px;
  border: 2px solid var(--accent);
  padding: 0 10px;
  font-size: 18px;
  font-weight: 500;
  background: var(--card);
  color: var(--ink);
  text-align: right;
}

/* 셀렉트 드롭다운 */
select {
  height: 40px;
  border-radius: 10px;
  border: 1.5px solid var(--line);
  padding: 0 8px;
  font-size: 15px;
  font-weight: 700;
  background: var(--bg);
  color: var(--ink);
  -webkit-appearance: none;
}
```

---

## 9. 바텀 시트 (모달)

```css
.sheet {
  position: fixed;
  left: 0; right: 0; bottom: 0;
  background: var(--card);
  border-radius: 24px 24px 0 0;
  padding: 8px 20px calc(24px + env(safe-area-inset-bottom));
  transform: translateY(100%);
  transition: transform .25s cubic-bezier(.32,.72,0,1);
  z-index: 21;
  max-width: 520px;
  margin: 0 auto;
}
.sheet.show { transform: translateY(0); }
/* 핸들 */
.handle { width: 40px; height: 4px; background: var(--line); border-radius: 3px; margin: 6px auto 16px; }
```

---

## 10. 아이콘

- 라이브러리: **Tabler Icons Webfont** (`@tabler/icons-webfont`)
- 사용법: `<i class="ti ti-[아이콘명]"></i>`
- 탭 아이콘: 이모지 사용 (더 직관적)

---

## 11. 탭 구성 패턴 (My Vault 기준)

```
👨 계정  |  👨‍👩‍👧‍👦 가족  |  🤝 인맥  |  📝 메모
```

- 이모지 + 짧은 한글 텍스트
- 탭 4개 이상 시 overflow-x: auto 스크롤 허용

---

## 12. 앱별 theme-color

| 앱 | theme-color |
|---|---|
| calc-note | `#F5F6FB` |
| weight-note | `#5B54E8` |
| my-vault | `#F5F6FB` (권장) |

---

## 13. 체크리스트 (새 앱 시작 시)

- [ ] CSS 변수 `:root` 블록 복사
- [ ] 헤더 구조 (아이콘 42px + 타이틀) 적용
- [ ] 탭바 견출지 스타일 적용
- [ ] 첫 번째 카드 `.corner-first` 클래스 적용
- [ ] FAB 버튼 우하단 배치
- [ ] safe-area-inset 패딩 적용
- [ ] Tabler Icons webfont 임포트
- [ ] SW(서비스워커) 등록
- [ ] manifest.webmanifest 설정

