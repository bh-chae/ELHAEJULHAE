import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// 테스트용 App 컴포넌트
function App() {
  const [testResults, setTestResults] = React.useState<string[]>([]);

  const runStorageTest = () => {
    const results: string[] = [];

    try {
      // 1. 버전 테스트
      localStorage.setItem('elhaejulhae_version', '1.0.0');
      const version = localStorage.getItem('elhaejulhae_version');
      results.push(`✓ 버전 설정: ${version}`);

      // 2. User 테스트
      const testUser = {
        id: 'user_test_001',
        gender: 'female',
        birthDate: '1990-05-15',
        stage: 'natural',
        role: 'owner',
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('elhaejulhae_user', JSON.stringify(testUser));
      const savedUser = JSON.parse(localStorage.getItem('elhaejulhae_user') || '{}');
      results.push(`✓ User 저장: ${savedUser.id}`);

      // 3. D-Day 테스트
      const testDDay = {
        id: 'dday_001',
        type: 'natural',
        targetDate: '2026-09-20',
        name: '배란일',
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('elhaejulhae_dday', JSON.stringify(testDDay));
      const savedDDay = JSON.parse(localStorage.getItem('elhaejulhae_dday') || '{}');
      results.push(`✓ D-Day 저장: ${savedDDay.targetDate}`);

      // 4. Character 테스트
      const testCharacter = {
        level: 1,
        currentExp: 0,
        totalExp: 0,
        nextLevelExp: 100,
      };

      localStorage.setItem('elhaejulhae_character', JSON.stringify(testCharacter));
      const savedCharacter = JSON.parse(localStorage.getItem('elhaejulhae_character') || '{}');
      results.push(`✓ Character 저장: Level ${savedCharacter.level}`);

      // 5. Todo 테스트
      const todos = [
        {
          id: 'todo_001',
          text: '병원 방문',
          date: '2026-09-18',
          category: 'common',
          completed: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'todo_002',
          text: '영양제 복용',
          date: '2026-09-18',
          category: 'mine',
          completed: false,
          createdAt: new Date().toISOString(),
        },
      ];

      localStorage.setItem('elhaejulhae_todos', JSON.stringify(todos));
      const savedTodos = JSON.parse(localStorage.getItem('elhaejulhae_todos') || '[]');
      results.push(`✓ Todos 저장: ${savedTodos.length}개`);

      // 6. Routine 테스트
      const routines = [
        {
          id: 'routine_001',
          text: '영양제 복용',
          category: 'common',
          repeat: 'daily',
          startDate: '2026-09-01',
          time: '06:00',
          createdAt: new Date().toISOString(),
        },
      ];

      localStorage.setItem('elhaejulhae_routines', JSON.stringify(routines));
      const savedRoutines = JSON.parse(localStorage.getItem('elhaejulhae_routines') || '[]');
      results.push(`✓ Routines 저장: ${savedRoutines.length}개`);

      // 7. 전체 조회
      const allKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('elhaejulhae_')) {
          allKeys.push(key);
        }
      }
      results.push(`✓ localStorage 키: ${allKeys.length}개`);

      setTestResults(results);
    } catch (error) {
      setTestResults(['❌ 테스트 실패: ' + (error as Error).message]);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <h1>🧪 이래저래 기초 구조 테스트</h1>

      <button
        onClick={runStorageTest}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        테스트 실행
      </button>

      <div style={{ marginTop: '20px' }}>
        <h2>📊 테스트 결과:</h2>
        {testResults.length === 0 ? (
          <p style={{ color: '#666' }}>
            위 버튼을 클릭해서 테스트를 시작하세요.
          </p>
        ) : (
          <ul style={{ lineHeight: '1.8' }}>
            {testResults.map((result, index) => (
              <li key={index} style={{ fontSize: '14px' }}>
                {result}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
        <h3>📝 다음 단계:</h3>
        <ol>
          <li>위 테스트 버튼을 클릭해서 결과 확인</li>
          <li>브라우저 개발자도구 (F12) → Application → Local Storage 확인</li>
          <li>모든 테스트가 통과하면 Jest 유닛 테스트로 진행</li>
        </ol>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
