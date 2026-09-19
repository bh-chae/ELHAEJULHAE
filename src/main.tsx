import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { OnboardingPage } from './pages/OnboardingPage';
import { StorageService } from './utils/storage';

function App() {
  const [isOnboarding, setIsOnboarding] = React.useState(true);

  React.useEffect(() => {
    // 앱 초기화
    StorageService.initialize();

    // 사용자가 있으면 온보딩 스킵
    const user = StorageService.loadUser();
    if (user) {
      setIsOnboarding(false);
    }
  }, []);

  if (isOnboarding) {
    return <OnboardingPage onComplete={() => setIsOnboarding(false)} />;
  }

  // MainPage (다음 단계에서 구현)
  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <h1>🎉 이래저래 - 임신준비 부부 투두</h1>
      <p>MainPage는 다음 단계에서 구현됩니다!</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
