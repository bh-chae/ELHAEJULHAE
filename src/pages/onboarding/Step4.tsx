/**
 * OnboardingPage Step 4: 뷰 선택
 * - 기본 뷰 선택 (E1)
 * - Month만 Phase 1에서 구현
 */

import React from 'react';

interface Step4Props {
  defaultView?: 'month' | 'week' | 'day';
  onComplete: (view: 'month' | 'week' | 'day') => void;
  onPrev: () => void;
}

export function Step4({ defaultView = 'month', onComplete, onPrev }: Step4Props) {
  const [selectedView, setSelectedView] = React.useState<'month' | 'week' | 'day'>(defaultView);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📊 뷰 선택</h2>
      <p style={styles.subtitle}>선호하는 캘린더 뷰를 선택해주세요</p>

      {/* 뷰 선택 */}
      <div style={styles.viewGroup}>
        {(['month', 'week', 'day'] as const).map((view) => {
          const views = {
            month: { emoji: '📅', name: '월 뷰', desc: '한 달을 한눈에' },
            week: { emoji: '📋', name: '주 뷰', desc: '일주일 단위 (Phase 4)' },
            day: { emoji: '☀️', name: '일 뷰', desc: '하루 단위 (Phase 4)' },
          };

          const isDisabled = view !== 'month';
          const info = views[view];

          return (
            <button
              key={view}
              onClick={() => !isDisabled && setSelectedView(view)}
              disabled={isDisabled}
              style={{
                ...styles.viewButton,
                ...(selectedView === view ? styles.viewButtonSelected : {}),
                ...(isDisabled ? styles.viewButtonDisabled : {}),
              }}
              title={isDisabled ? 'Phase 4에서 이용 가능합니다' : ''}
            >
              <div style={styles.viewEmoji}>{info.emoji}</div>
              <div style={styles.viewName}>{info.name}</div>
              <div style={styles.viewDesc}>{info.desc}</div>
            </button>
          );
        })}
      </div>

      {/* 안내문 */}
      <div style={styles.infoBox}>
        <div style={styles.infoTitle}>✨ 좋은 소식!</div>
        <p style={styles.infoText}>
          온보딩이 거의 완료되었습니다!
          <br />
          지금부터 임신준비 여정을 시작할 수 있습니다 🎉
        </p>
      </div>

      {/* 버튼 그룹 */}
      <div style={styles.buttonGroup}>
        <button onClick={onPrev} style={styles.prevButton}>
          ← 이전
        </button>
        <button
          onClick={() => onComplete(selectedView)}
          style={styles.completeButton}
        >
          시작하기 🌙
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '500px',
    margin: '0 auto',
  } as const,
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
  } as const,
  subtitle: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '30px',
  } as const,
  viewGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '10px',
    marginBottom: '25px',
  } as const,
  viewButton: {
    padding: '15px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center',
  } as const,
  viewButtonSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#f1f8f4',
  } as const,
  viewButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
    backgroundColor: '#f5f5f5',
  } as const,
  viewEmoji: {
    fontSize: '28px',
    marginBottom: '5px',
  } as const,
  viewName: {
    fontSize: '13px',
    fontWeight: 'bold',
    marginBottom: '3px',
  } as const,
  viewDesc: {
    fontSize: '11px',
    color: '#999',
  } as const,
  infoBox: {
    padding: '15px',
    backgroundColor: '#fce4ec',
    borderRadius: '8px',
    marginBottom: '25px',
  } as const,
  infoTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#c2185b',
    marginBottom: '8px',
  } as const,
  infoText: {
    fontSize: '12px',
    color: '#880e4f',
    margin: 0,
    lineHeight: '1.5',
  } as const,
  buttonGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  } as const,
  prevButton: {
    padding: '12px',
    backgroundColor: '#f0f0f0',
    color: '#333',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  } as const,
  completeButton: {
    padding: '12px',
    backgroundColor: '#c2185b',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  } as const,
};
