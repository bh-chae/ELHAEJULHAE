/**
 * OnboardingPage Step 3: D-Day 선택
 * - D-Day 타입 선택 (배란일, 시술일, 이식일)
 * - D-Day 날짜 입력 (E3)
 */

import React from 'react';
import { DDayType, DDayName } from '../../types';

interface Step3Props {
  ddayType?: DDayType;
  ddayDate?: string;
  onNext: (data: { ddayType: DDayType; ddayDate: string }) => void;
  onPrev: () => void;
}

export function Step3({ ddayType, ddayDate, onNext, onPrev }: Step3Props) {
  const [selectedType, setSelectedType] = React.useState<DDayType | undefined>(ddayType);
  const [selectedDate, setSelectedDate] = React.useState(ddayDate || '');
  const [error, setError] = React.useState('');

  const ddayInfo: Record<
    DDayType,
    { name: DDayName; emoji: string; description: string }
  > = {
    natural: { name: '배란일', emoji: '🌙', description: '자연임신 준비' },
    artificial: { name: '시술일', emoji: '💉', description: '인공수정 예정' },
    ivf: { name: '이식일', emoji: '🥚', description: '시험관아기 이식일' },
  };

  const handleNext = () => {
    setError('');

    if (!selectedType) {
      setError('D-Day 타입을 선택해주세요');
      return;
    }

    if (!selectedDate) {
      setError('D-Day 날짜를 입력해주세요');
      return;
    }

    // 미래 날짜 확인
    const today = new Date().toISOString().split('T')[0];
    if (selectedDate < today) {
      setError('미래 날짜를 선택해주세요');
      return;
    }

    onNext({
      ddayType: selectedType,
      ddayDate: selectedDate,
    });
  };

  const calcDaysUntil = (dateStr: string): number => {
    if (!dateStr) return 0;
    const today = new Date(new Date().toISOString().split('T')[0]);
    const target = new Date(dateStr);
    const diff = target.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const daysUntil = calcDaysUntil(selectedDate);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📅 D-Day 설정</h2>
      <p style={styles.subtitle}>목표 날짜를 설정해주세요</p>

      {/* D-Day 타입 선택 */}
      <div style={styles.section}>
        <label style={styles.label}>D-Day 타입</label>
        <div style={styles.typeGroup}>
          {(Object.keys(ddayInfo) as DDayType[]).map((type) => {
            const info = ddayInfo[type];
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                style={{
                  ...styles.typeButton,
                  ...(selectedType === type ? styles.typeButtonSelected : {}),
                }}
              >
                <div style={styles.typeEmoji}>{info.emoji}</div>
                <div style={styles.typeName}>{info.name}</div>
                <div style={styles.typeDesc}>{info.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* D-Day 날짜 입력 */}
      <div style={styles.section}>
        <label style={styles.label}>목표 날짜</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={styles.input}
        />
        {selectedDate && (
          <div style={styles.ddayInfo}>
            <p style={styles.ddayDate}>
              {new Date(selectedDate).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
              })}
            </p>
            {daysUntil > 0 && (
              <p style={styles.ddayCountdown}>
                🎯 {daysUntil}일 남았습니다!
              </p>
            )}
          </div>
        )}
      </div>

      {/* 설명 */}
      {selectedType && (
        <div style={styles.infoBox}>
          <div style={styles.infoTitle}>
            {selectedType === 'natural' && '자연임신 준비'}
            {selectedType === 'artificial' && '인공수정 준비'}
            {selectedType === 'ivf' && '시험관아기 준비'}
          </div>
          <p style={styles.infoText}>
            {selectedType === 'natural' &&
              '배란일을 중심으로 추천 활동과 투두를 제안해드릴게요'}
            {selectedType === 'artificial' &&
              '시술일 전후로 필요한 준비 사항들을 관리해보세요'}
            {selectedType === 'ivf' &&
              '이식일 기준으로 맞춤형 건강 관리를 시작하세요'}
          </p>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && <div style={styles.error}>{error}</div>}

      {/* 버튼 그룹 */}
      <div style={styles.buttonGroup}>
        <button onClick={onPrev} style={styles.prevButton}>
          ← 이전
        </button>
        <button onClick={handleNext} style={styles.nextButton}>
          다음 →
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
  section: {
    marginBottom: '25px',
  } as const,
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '10px',
  } as const,
  typeGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '10px',
  } as const,
  typeButton: {
    padding: '15px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center',
  } as const,
  typeButtonSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#f1f8f4',
  } as const,
  typeEmoji: {
    fontSize: '28px',
    marginBottom: '5px',
  } as const,
  typeName: {
    fontSize: '13px',
    fontWeight: 'bold',
    marginBottom: '3px',
  } as const,
  typeDesc: {
    fontSize: '11px',
    color: '#999',
  } as const,
  input: {
    width: '100%',
    padding: '10px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box',
  } as const,
  ddayInfo: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
  } as const,
  ddayDate: {
    fontSize: '13px',
    color: '#333',
    margin: '0 0 5px 0',
  } as const,
  ddayCountdown: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#4CAF50',
    margin: 0,
  } as const,
  infoBox: {
    padding: '15px',
    backgroundColor: '#e8f5e9',
    borderRadius: '8px',
    marginBottom: '20px',
  } as const,
  infoTitle: {
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: '8px',
  } as const,
  infoText: {
    fontSize: '12px',
    color: '#388e3c',
    margin: 0,
    lineHeight: '1.4',
  } as const,
  error: {
    color: '#d32f2f',
    fontSize: '14px',
    padding: '10px',
    backgroundColor: '#ffebee',
    borderRadius: '4px',
    marginBottom: '15px',
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
  nextButton: {
    padding: '12px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  } as const,
};
