# 🎯 최종 결정사항 & 종합분석 (통합)

**작성일**: 2026-09-19  
**상태**: ✅ Phase 1 구현 준비 완료 (E1~E10 모두 확정)  
**목적**: 21개 답변 분석 + 6개 추가 의사결정 → 10개 최종 의사결정 정리

---

## 📋 목차
1. [1단계: 종합 검토 & 분석](#1단계-종합-검토--분석)
2. [2단계: 최종 의사결정 (E1~E10)](#2단계-최종-의사결정-e1e10)
3. [3단계: 최종 데이터 구조](#3단계-최종-데이터-구조)
4. [4단계: 최종 준비 현황](#4단계-최종-준비-현황)

---

# 1단계: 종합 검토 & 분석

## 🎯 주요 7개 문제 해결 현황

| 순번 | 문제 | 상태 | 해결 방식 |
|------|------|------|---------|
| **P1** | 데이터 저장소 | ✅ **해결** | localStorage (A-1) |
| **P3** | 반복 투두 설계 | ✅ **해결** | 투두↔루틴 분리 (C-3) — **새로운 데이터 타입 추가** |
| **P5** | 초대 코드 스펙 | ✅ **해결** | URL + 6자리 코드 하이브리드 (B-1) |
| **P6** | D-Day 공유 방식 | ✅ **해결** | 공유 D-Day (B-4) |
| **P7** | 재방문/인증 전략 | ✅ **해결** | 자동 복구 + 자동 재인증 (A-2, A-3) |
| **P9** | 실시간 알림 기술 | ⏳ **부분 명확** | Firebase Realtime/Listener 사용 (추가 구현 상세 필요) |
| **P12** | 루틴 투두 생성 | ✅ **해결** | 템플릿 방식 (D-Day 화면 제안) (C-2) |

**결론**: 7개 중 6개 완전 해결, 1개 부분 명확 ✅

---

## 🔄 새로운 데이터 구조 (투두 ↔ 루틴 분리)

### Todo (단일 날짜 투두)
```typescript
interface Todo {
  id: string
  text: string
  date: string                    // ⭐ 필수: 단일 날짜만
  category: 'common' | 'mine' | 'partner'
  assignedTo?: 'owner' | 'partner'
  completed: boolean
  completedAt?: string
  createdAt: string
  deletedAt?: string              // ← 소프트 삭제 (E10)
}
```

### Routine (반복 투두 = 새 타입!)
```typescript
interface Routine {
  id: string
  text: string
  category: 'common' | 'mine' | 'partner'
  assignedTo?: 'owner' | 'partner'
  
  // 반복 설정
  repeat: 'daily' | 'weekly' | 'biweekly' | 'monthly'
  dayOfWeek?: number              // ← (E7) 0-6 (0=일, 1=월, ..., 6=토)
  
  // 시간 설정
  time?: string                   // "06:00", "12:00" 형식
  times?: string[]                // ["06:00", "12:00", "18:00"] 다중 시간 가능
  
  // 유효 기간
  startDate: string               // 루틴 시작 날짜
  endDate?: string                // 루틴 종료 날짜 (없으면 무한)
  
  createdAt: string
  deletedAt?: string              // ← 소프트 삭제 (E10)
}
```

### 완료 추적
```typescript
interface TodoCompletion {
  id: string
  routineId: string               // 어느 루틴의 완료인지
  date: string                    // 완료 날짜
  completed: boolean
  completedAt?: string
  createdAt: string
}
```

---

## ✅ 앞뒤 맥락 일관성 검토

| 항목 | 검토 | 결과 |
|------|------|------|
| **A-1 ↔ A-2**: localStorage vs 초기화 선택 | 로컬에 저장하되, 사용자가 초기화 선택 가능 | ✅ 일관 |
| **A-3 ↔ Phase 2**: 자동 재인증 vs Firebase 토큰 | Firebase 토큰 만료 시 자동 재인증 (사용자 개입 없음) | ✅ 일관 |
| **B-1 ↔ B-2**: URL + 코드 ↔ 7일 유효기간 | 코드는 7일 유효, URL도 같은 코드 사용 | ✅ 일관 |
| **B-3 ↔ B-5**: 수락 모달 ↔ 투두 카테고리 | B 수락 후 A의 투두가 B에게 "짝꿍 투두"로 표시 | ✅ 일관 |
| **B-4 ↔ C-3**: 공유 D-Day ↔ 루틴 startDate | D-Day 기반 루틴의 startDate 자동 설정 | ✅ 일관 (명시 필요) |
| **B-5 ↔ E-1**: 사용자 선택형 ↔ 자동 분류 | 투두 추가: 사용자 선택 / 모드전환: 자동 분류 | ✅ 일관 |
| **C-2 ↔ C-3**: 템플릿 루틴 ↔ startDate~endDate | D-Day 화면의 루틴 제안 시 날짜 범위 설정 | ✅ 일관 (명시 필요) |
| **D-1 ↔ D-3**: 토스트 위치 ↔ 스와이프 | 화면 상단 플로팅 토스트, 스와이프 닫기 가능 | ✅ 일관 |
| **D-4 ↔ Phase 2/3**: 실시간만 ↔ 알림 저장 | 토스트 표시만 하되, DB 저장 고려 필요 | ⚠️ 명시 권장 |
| **F-1 ↔ Phase 1/2**: 즉시 +10 EXP ↔ Firebase 동기화 | Phase 1: 로컬 즉시 / Phase 2: Firebase 동기화 | ✅ 일관 |

**결론**: 대부분 일관성 있음 ✅

---

# 2단계: 최종 의사결정 (E1~E10)

## E1: Step 4 "뷰 선택"의 Phase 배치 ✅

**결정**: 🔄 선택적 처리 (기본값: Month 자동 선택, 나중에 변경 가능)

**구현**:
- 온보딩 Step 4: 뷰 선택 제안 ("Month / Week / Day")
- **Phase 1**: Month 뷰만 구현 (기본값으로 자동 선택)
- **Phase 4**: Week/Day 뷰 추가 구현
- 사용자가 원하면 설정에서 나중에 뷰 변경 가능

---

## E2: 온보딩 완료 시 데이터 저장 시점 ✅

**결정**: 📝 Step별 저장 (Step 1,2,3 각각 저장 → Step 4 완료 후 최종 생성)

**프로세스**:
```
Step 1 완료 → OnboardingProgress.step1 저장 (성별, 생년월일, stage)
Step 2 완료 → OnboardingProgress.step2 저장 (모드, Partner 정보)
Step 3 완료 → OnboardingProgress.step3 저장 (D-Day 정보)
Step 4 완료 → 최종 생성: User, DDay, Character 한 번에 생성
          → onboarding_progress 삭제
          → MainPage로 이동
```

**장점**:
- 온보딩 도중 이탈했다가 재방문 시 진행 상태 복구 가능
- localStorage 용량 효율적

---

## E3: D-Day 카운트다운 표시 정밀도 ✅

**결정**: 📅 일수만 ("배란일까지 7일")

**구현**:
```
Header에 표시: "배란일까지 7일" (또는 "D-Day 7일 남음")

특징:
- 시간/분/초는 표시하지 않음
- 배터리 효율 고려 (초 단위 업데이트 불필요)
- 자정(00:00)에 한 번 업데이트
```

---

## E4: 루틴 완료 시 EXP 지급 방식 ✅

**결정**: ⚡ 투두와 동일 (+10 EXP 매번)

**구현**:
- 투두 완료: +10 EXP (1회만)
- 루틴 완료 (일회): +10 EXP
- 루틴 완료 (반복): 매번 +10 EXP
  ```
  예: "영양제 복용" 매일 → 매일 +10 EXP
  ```

---

## E5: 월 뷰에서 투두 추가 UI ✅

**결정**: 📅 날짜 클릭 후 모달 표시

**구현**:
```
1. 월 뷰에서 특정 날짜 클릭
   → 투두 추가 모달 표시

2. 모달 구성:
   - 제목 (필수)
   - 날짜 (자동: 클릭한 날짜)
   - 카테고리 (자동: 현재 탭 기반)
   - [추가] / [취소]

3. 플로팅 버튼은 Phase 4에서 추가
```

---

## E6: 싱글 모드 탭 구성 ✅

**결정**: 📑 "공통 / 내 투두" 탭 2개 (짝꿍 투두 없음)

**구현**:
```
싱글 모드:
  ├─ 공통 탭 (category: "common")
  └─ 내 투두 탭 (category: "mine")

커플 모드:
  ├─ 공통 탭 (category: "common")
  ├─ 내 투두 탭 (category: "mine")
  └─ 짝꿍 투두 탭 (category: "partner")

특징:
- 탭 선택 → 투두 추가 시 category 자동 설정
```

---

## E7: 루틴 반복 계산 방식 (dayOfWeek 필드) ✅

**결정**: 📆 dayOfWeek 필드 추가 - startDate와 독립적으로 반복 요일 지정

**데이터 구조**:
```typescript
Routine {
  id: "routine_001",
  text: "영양제 복용",
  repeat: "weekly",
  startDate: "2026-09-18" (수요일)
  dayOfWeek: 1  // ← 월요일 (0=일, 1=월, ..., 6=토)
  ...
}
```

**사용 예**:
```
startDate="2026-09-18" (수요일), repeat="weekly", dayOfWeek=1 (월요일)
  → 매주 월요일에만 투두 동적 생성 (startDate와 무관)
```

---

## E8: D-Day 변경 시 기존 루틴 처리 ✅

**결정**: 📝 사용자 확인 모달 (자동 변경 vs 유지)

**흐름**:
```
1. 사용자가 D-Day 수정: 2026-09-20 → 2026-09-25
2. 시스템: 영향받는 루틴 2개 감지
3. 확인 모달 표시
4. [변경] 선택: endDate 자동 계산 + 업데이트
5. [취소] 선택: D-Day 변경 안 함
```

---

## E9: Phase 1 재방문 시 로그인/복구 방식 ✅

**결정**: ❓ 복구 여부 확인 모달

**흐름**:
```
1. 앱 시작 → localStorage 확인
2. User 데이터 존재?
   ├─ YES: 저장된 데이터 복구
   │   [복구] 선택 → MainPage로 이동
   │   [새로 시작] 선택 → 데이터 초기화 → OnboardingPage
   │
   └─ NO: OnboardingPage 진입
```

---

## E10: 투두/루틴 삭제 방식 (소프트 삭제) ✅

**결정**: 🗑️ 소프트 삭제 (deletedAt 필드, Phase 5에서 휴지통 기능)

**구현**:
```typescript
// 투두/루틴 삭제
└─ deletedAt = 현재 시각 (완전 삭제 아님)

// 렌더링 시
const activeTodos = todos.filter(t => !t.deletedAt);
const deletedTodos = todos.filter(t => !!t.deletedAt); // Phase 5 휴지통
```

---

# 3단계: 최종 데이터 구조

## 핵심 변경점

### 1. OnboardingProgress 추가 (E2)
```typescript
interface OnboardingProgress {
  id: string
  step1?: { gender, birthDate, stage, completedAt }
  step2?: { mode, partner?, completedAt }
  step3?: { type, targetDate, completedAt }
  step4?: { selectedView, completedAt }
  createdAt: string
  deletedAt?: string
}
```

### 2. Routine에 dayOfWeek 필드 추가 (E7)
```typescript
interface Routine {
  id: string
  text: string
  category: 'common' | 'mine' | 'partner'
  repeat: 'daily' | 'weekly' | 'biweekly' | 'monthly'
  dayOfWeek?: number  // 0-6 (0=일, 1=월, ..., 6=토)
  startDate: string
  endDate?: string
  time?: string | string[]
  createdAt: string
  deletedAt?: string  // 소프트 삭제 (E10)
}
```

### 3. 투두/루틴 소프트 삭제 (E10)
```typescript
interface Todo {
  id: string
  text: string
  date: string
  category: 'common' | 'mine' | 'partner'
  completed: boolean
  completedAt?: string
  createdAt: string
  deletedAt?: string  // ← 소프트 삭제 (E10)
}
```

---

# 4단계: 최종 준비 현황

## ✅ 의사결정 현황

### 최종 의사결정 (E1~E10) - 모두 확정

| 번호 | 항목 | 결정사항 | Phase |
|------|------|---------|-------|
| **E1** | Step 4 뷰 선택 | Month 기본값, Phase 4에서 추가 구현 | 1/4 |
| **E2** | 온보딩 데이터 저장 | Step별 저장 후 Step 4에 최종 생성 | 1 |
| **E3** | D-Day 표시 | 일수만 (시간/분초 제외) | 1 |
| **E4** | 루틴 EXP 지급 | 투두와 동일 (+10 매번) | 1 |
| **E5** | 투두 추가 | 월 뷰 날짜 클릭 후 모달 | 1 |
| **E6** | 싱글 모드 탭 | "공통/내 투두" 2개 | 1 |
| **E7** | 루틴 반복 계산 | dayOfWeek 필드 추가 | 1 |
| **E8** | D-Day 변경 | 사용자 확인 모달 | 1/2 |
| **E9** | 재방문 복구 | 복구 여부 확인 모달 | 1 |
| **E10** | 투두 삭제 | 소프트 삭제 (Phase 5 휴지통) | 1/5 |

### 기존 의사결정 (D1~D6) - 유지
- **D1**: 싱글 모드에서 "짝꿍 투두" 탭 미표시 ✅
- **D2**: Partner는 gender, birthDate만 ✅
- **D3**: 커플 D-Day는 A 기준, B 자동 맞춤 ✅
- **D4**: 루틴 렌더링은 하이브리드 방식 ✅
- **D5**: 카테고리는 페이지 기반 자동 설정 ✅
- **D6**: D-Day 루틴 템플릿은 비활성화 상태로 추천 ✅

---

## 🎯 Phase 1 구현 체크리스트

### 데이터 구조
- [x] OnboardingProgress (E2)
- [x] Todo (E5, E6, E10)
- [x] Routine (E7, E10)
- [x] TodoCompletion
- [x] Character (E4: Routine도 +10)
- [x] User, Partner, DDay

### UI/UX
- [ ] OnboardingPage Step 1~4 (E1)
- [ ] MainPage 기본 레이아웃
- [ ] 월 뷰 캘린더 (E3)
- [ ] TodoList (E6)
- [ ] 투두 추가 모달 (E5)
- [ ] 투두 완료 & EXP (E4)
- [ ] 투두 삭제 (E10)
- [ ] 재방문 복구 모달 (E9)
- [ ] D-Day 변경 모달 (E8)

### 로컬 저장소
- [ ] localStorage: OnboardingProgress (E2)
- [ ] localStorage: 투두/루틴/완료 추적
- [ ] 재실행 시 데이터 복구 (E9)

---

## ✅ 최종 상태

🟢 **E1~E10 모든 의사결정 확정, 구현 준비 완료!**

- ✅ 7개 주요 문제 해결
- ✅ 10개 추가 의사결정 확정
- ✅ 모든 데이터 구조 최종화
- ✅ Phase 1 구현 준비 완료

---

**마지막 업데이트**: 2026-09-19
