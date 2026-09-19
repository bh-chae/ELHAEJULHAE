# 🧪 브라우저 콘솔 테스트 스니펫

**사용 방법:**
1. 브라우저에서 `http://localhost:5173` 접속 (또는 해당 포트)
2. 개발자 도구 열기 (F12 또는 Cmd+Option+I)
3. 콘솔(Console) 탭에서 아래 코드를 복사-붙여넣기
4. 각 테스트 섹션별로 실행

---

## 📋 1. 저장소 기초 테스트

### 1-1. 초기화 및 버전 확인
```javascript
// localStorage 초기화 확인
console.log('=== 저장소 버전 확인 ===');
const version = localStorage.getItem('elhaejulhae_version');
console.log('Current Version:', version || 'NOT SET');

// 버전 설정
localStorage.setItem('elhaejulhae_version', '1.0.0');
console.log('Version Set:', localStorage.getItem('elhaejulhae_version'));
```

---

## 📋 2. 사용자 데이터 테스트

### 2-1. User 생성 및 저장
```javascript
console.log('=== User 저장소 테스트 ===');

// 더미 User 객체
const testUser = {
  id: 'user_test_001',
  gender: 'female',
  birthDate: '1990-05-15',
  stage: 'natural',
  role: 'owner',
  createdAt: new Date().toISOString()
};

console.log('원본 User:', testUser);

// localStorage에 저장
localStorage.setItem('elhaejulhae_user', JSON.stringify(testUser));
console.log('저장됨 ✓');

// 다시 불러오기
const savedUser = JSON.parse(localStorage.getItem('elhaejulhae_user'));
console.log('불러온 User:', savedUser);
console.log('데이터 일치:', JSON.stringify(testUser) === JSON.stringify(savedUser));
```

---

## 📋 3. D-Day 데이터 테스트

### 3-1. D-Day 생성 및 저장
```javascript
console.log('=== D-Day 저장소 테스트 ===');

const testDDay = {
  id: 'dday_001',
  type: 'natural',
  targetDate: '2026-09-20',
  name: '배란일',
  createdAt: new Date().toISOString()
};

console.log('원본 D-Day:', testDDay);

localStorage.setItem('elhaejulhae_dday', JSON.stringify(testDDay));
console.log('저장됨 ✓');

const savedDDay = JSON.parse(localStorage.getItem('elhaejulhae_dday'));
console.log('불러온 D-Day:', savedDDay);
```

---

## 📋 4. Character (EXP) 데이터 테스트

### 4-1. Character 생성 및 저장
```javascript
console.log('=== Character 저장소 테스트 ===');

const testCharacter = {
  level: 1,
  currentExp: 0,
  totalExp: 0,
  nextLevelExp: 100
};

console.log('원본 Character:', testCharacter);

localStorage.setItem('elhaejulhae_character', JSON.stringify(testCharacter));
console.log('저장됨 ✓');

const savedCharacter = JSON.parse(localStorage.getItem('elhaejulhae_character'));
console.log('불러온 Character:', savedCharacter);
```

---

## 📋 5. 투두(Todo) 배열 테스트

### 5-1. Todo 추가
```javascript
console.log('=== Todo 배열 테스트 ===');

// 빈 배열로 시작
const todos = [];

// Todo 객체 추가
const todo1 = {
  id: 'todo_001',
  text: '병원 방문',
  date: '2026-09-18',
  category: 'common',
  completed: false,
  createdAt: new Date().toISOString()
};

const todo2 = {
  id: 'todo_002',
  text: '영양제 복용',
  date: '2026-09-18',
  category: 'mine',
  completed: false,
  createdAt: new Date().toISOString()
};

todos.push(todo1);
todos.push(todo2);

console.log('추가된 Todos:', todos);

// localStorage에 저장
localStorage.setItem('elhaejulhae_todos', JSON.stringify(todos));
console.log('저장됨 ✓');

// 불러오기
const savedTodos = JSON.parse(localStorage.getItem('elhaejulhae_todos'));
console.log('불러온 Todos:', savedTodos);
console.log('Todo 개수:', savedTodos.length);
```

### 5-2. Todo 필터링
```javascript
console.log('=== Todo 필터링 테스트 ===');

const savedTodos = JSON.parse(localStorage.getItem('elhaejulhae_todos'));

// 특정 날짜의 Todo 조회
const todosOn18th = savedTodos.filter(t => t.date === '2026-09-18');
console.log('2026-09-18의 Todos:', todosOn18th);

// 카테고리별 조회
const commonTodos = savedTodos.filter(t => t.category === 'common');
console.log('공통 Todos:', commonTodos);

const mineTodos = savedTodos.filter(t => t.category === 'mine');
console.log('내 Todos:', mineTodos);
```

### 5-3. Todo 완료 처리
```javascript
console.log('=== Todo 완료 처리 ===');

let todos = JSON.parse(localStorage.getItem('elhaejulhae_todos'));

// 첫 번째 Todo 완료 처리
todos[0].completed = true;
todos[0].completedAt = new Date().toISOString();

console.log('완료된 Todo:', todos[0]);

// 저장
localStorage.setItem('elhaejulhae_todos', JSON.stringify(todos));
console.log('저장됨 ✓');
```

### 5-4. Todo 삭제 (소프트 삭제)
```javascript
console.log('=== Todo 소프트 삭제 ===');

let todos = JSON.parse(localStorage.getItem('elhaejulhae_todos'));

// 두 번째 Todo 소프트 삭제
todos[1].deletedAt = new Date().toISOString();

console.log('삭제된 Todo:', todos[1]);

// 저장
localStorage.setItem('elhaejulhae_todos', JSON.stringify(todos));

// 활성 Todo만 조회
const activeTodos = todos.filter(t => !t.deletedAt);
console.log('활성 Todos:', activeTodos);
console.log('활성 Todo 개수:', activeTodos.length);
```

---

## 📋 6. 루틴(Routine) 테스트

### 6-1. Routine 추가
```javascript
console.log('=== Routine 배열 테스트 ===');

const routines = [];

const routine1 = {
  id: 'routine_001',
  text: '영양제 복용',
  category: 'common',
  repeat: 'daily',
  startDate: '2026-09-01',
  time: '06:00',
  createdAt: new Date().toISOString()
};

const routine2 = {
  id: 'routine_002',
  text: '운동 30분',
  category: 'common',
  repeat: 'daily',
  startDate: '2026-09-01',
  createdAt: new Date().toISOString()
};

routines.push(routine1);
routines.push(routine2);

console.log('Routines:', routines);

localStorage.setItem('elhaejulhae_routines', JSON.stringify(routines));
console.log('저장됨 ✓');
```

---

## 📋 7. 전체 AppState 테스트

### 7-1. 전체 상태 저장 및 복구
```javascript
console.log('=== 전체 AppState 테스트 ===');

// 현재 저장된 모든 데이터 조회
const appState = {
  user: JSON.parse(localStorage.getItem('elhaejulhae_user')),
  dday: JSON.parse(localStorage.getItem('elhaejulhae_dday')),
  character: JSON.parse(localStorage.getItem('elhaejulhae_character')),
  todos: JSON.parse(localStorage.getItem('elhaejulhae_todos') || '[]'),
  routines: JSON.parse(localStorage.getItem('elhaejulhae_routines') || '[]'),
};

console.log('Current AppState:', appState);
console.log('User:', appState.user?.id || 'NOT SET');
console.log('D-Day:', appState.dday?.targetDate || 'NOT SET');
console.log('Character Level:', appState.character?.level || 'NOT SET');
console.log('Todo Count:', appState.todos.length);
console.log('Routine Count:', appState.routines.length);
```

---

## 📋 8. 날짜 유틸리티 테스트 (향후 사용)

### 테스트용 날짜 계산 함수
```javascript
console.log('=== 날짜 계산 테스트 ===');

// 오늘 날짜
const today = new Date().toISOString().split('T')[0];
console.log('Today:', today);

// D-Day 계산 (D-Day까지 남은 일수)
const targetDate = '2026-09-20';
const targetMs = new Date(targetDate).getTime();
const todayMs = new Date(today).getTime();
const daysUntil = Math.ceil((targetMs - todayMs) / (1000 * 60 * 60 * 24));
console.log(`${targetDate}까지 ${daysUntil}일 남음`);

// 요일 계산
const date = new Date(targetDate);
const dayOfWeek = date.getDay();
const days = ['일', '월', '화', '수', '목', '금', '토'];
console.log(`${targetDate}는 ${days[dayOfWeek]}요일`);
```

---

## 📋 9. 데이터 초기화 (테스트 완료 후)

### 전체 localStorage 초기화
```javascript
console.log('=== localStorage 초기화 ===');

// 현재 저장된 키 출력
console.log('저장된 키 목록:');
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  console.log(`- ${key}`);
}

// 전체 삭제 (주의!)
// localStorage.clear();
// console.log('모든 데이터 삭제됨');

// 또는 선택적 삭제
localStorage.removeItem('elhaejulhae_todos');
console.log('Todos만 삭제됨');
```

---

## 📊 테스트 체크리스트

- [ ] 1-1. 버전 확인
- [ ] 2-1. User 저장/복구
- [ ] 3-1. D-Day 저장/복구
- [ ] 4-1. Character 저장/복구
- [ ] 5-1. Todo 추가
- [ ] 5-2. Todo 필터링
- [ ] 5-3. Todo 완료 처리
- [ ] 5-4. Todo 소프트 삭제
- [ ] 6-1. Routine 추가
- [ ] 7-1. 전체 AppState 조회
- [ ] 8. 날짜 계산 테스트
- [ ] 9. 데이터 초기화

---

## 💡 팁

- 각 테스트를 순서대로 실행하세요
- 콘솔 출력 결과를 확인하세요
- `console.table()`을 사용하면 배열/객체를 테이블로 볼 수 있습니다
- 예: `console.table(JSON.parse(localStorage.getItem('elhaejulhae_todos')))`

---

**다음 단계:** 모든 테스트가 통과하면 Jest를 추가해서 자동화합니다! 🚀
