/**
 * OnboardingPage Step 3: D-Day 목표 설정
 * - 임신준비 방법에 따라 다른 목표 선택지 제공
 * - 자연임신: 배란일
 * - 인공수정: 배란일, 정자채취, 인공수정
 * - 체외수정: 난자채취, 정액채취, 배아이식
 * - 직접입력: 사용자 정의 목표
 */

import React from 'react';
import { PregnancyStage } from '../../types';

interface Step3Props {
  stage?: PregnancyStage;
  selectedGoal?: string;
  goalDate?: string;
  onNext: (data: { goal: string; goalDate: string }) => void;
  onPrev: () => void;
}

export function Step3({ stage, selectedGoal, goalDate, onNext, onPrev }: Step3Props) {
  const [goal, setGoal] = React.useState(selectedGoal || '');
  const [goalDateValue, setGoalDateValue] = React.useState(goalDate || '');
  const [customGoal, setCustomGoal] = React.useState('');
  const [error, setError] = React.useState('');

  // 단계별 목표 선택지
  const goalOptions: Record<PregnancyStage, { value: string; label: string; emoji: string }[]> = {
    natural: [
      { value: 'ovulation', label: '배란일', emoji: '🌙' },
    ],
    artificial: [
      { value: 'ovulation', label: '배란일', emoji: '🌙' },
      { value: 'sperm_collection', label: '정자채취', emoji: '💙' },
      { value: 'insemination', label: '인공수정', emoji: '✨' },
    ],
    ivf: [
      { value: 'egg_retrieval', label: '난자채취', emoji: '🥚' },
      { value: 'sperm_collection', label: '정액채취', emoji: '💙' },
      { value: 'embryo_transfer', label: '배아이식', emoji: '🌱' },
    ],
  };

  const currentOptions = stage ? goalOptions[stage] : [];
  const isCustom = goal === 'custom';

  const handleNext = () => {
    setError('');

    if (!goal) {
      setError('목표를 선택해주세요');
      return;
    }

    if (isCustom && !customGoal.trim()) {
      setError('목표를 입력해주세요');
      return;
    }

    if (!goalDateValue) {
      setError('목표 날짜를 입력해주세요');
      return;
    }

    // 미래 날짜 확인
    const today = new Date().toISOString().split('T')[0];
    if (goalDateValue < today) {
      setError('미래 날짜를 선택해주세요');
      return;
    }

    onNext({
      goal: isCustom ? customGoal.trim() : goal,
      goalDate: goalDateValue,
    });
  };

  const calcDaysUntil = (dateStr: string): number => {
    if (!dateStr) return 0;
    const today = new Date(new Date().toISOString().split('T')[0]);
    const target = new Date(dateStr);
    const diff = target.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const daysUntil = calcDaysUntil(goalDateValue);
  const goalLabel = isCustom
    ? customGoal
    : currentOptions.find(o => o.value === goal)?.label || '';

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🎯 목표 설정</h2>
      <p style={styles.subtitle}>
        {stage === 'natural' && '배란일을 중심으로 준비해보세요'}
        {stage === 'artificial' && '인공수정 과정 중 목표를 선택하세요'}
        {stage === 'ivf' && '체외수정 과정 중 목표를 선택하세요'}
      </p>

      {/* 목표 선택 */}
      <div style={styles.section}>
        <label style={styles.label}>목표</label>
        <div style={styles.goalGroup}>
          {currentOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setGoal(option.value);
                setCustomGoal('');
              }}
              style={{
                ...styles.goalButton,
                ...(goal === option.value ? styles.goalButtonSelected : {}),
              }}
            >
              <div style={styles.goalEmoji}>{option.emoji}</div>
              <div style={styles.goalName}>{option.label}</div>
            </button>
          ))}

          {/* 직접입력 옵션 */}
          <button
            onClick={() => setGoal('custom')}
            style={{
              ...styles.goalButton,
              ...(isCustom ? styles.goalButtonSelected : {}),
            }}
          >
            <div style={styles.goalEmoji}>✏️</div>
            <div style={styles.goalName}>직접입력</div>
          </button>
        </div>
      </div>

      {/* 직접입력 필드 */}
      {isCustom && (
        <div style={styles.section}>
          <label style={styles.label}>목표 입력</label>
          <input
            type="text"
            placeholder="예: 착상, 임신확인, 첫 검진 등"
            value={customGoal}
            onChange={(e) => setCustomGoal(e.target.value)}
            style={styles.input}
          />
        </div>
      )}

      {/* 날짜 입력 */}
      <div style={styles.section}>
        <label style={styles.label}>목표 날짜</label>
        <input
          type="date"
          value={goalDateValue}
          onChange={(e) => setGoalDateValue(e.target.value)}
          style={styles.input}
        />
        {goalDateValue && (
          <div style={styles.dateInfo}>
            <p style={styles.dateLabel}>
              {new Date(goalDateValue).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
              })}
            </p>
            {daysUntil > 0 && (
              <p style={styles.daysUntil}>
                {goalLabel}까지 {daysUntil}일 남았습니다! ⏰
              </p>
            )}
          </div>
        )}
      </div>

      {/* 요약 */}
      {goal && goalDateValue && (
        <div style={styles.summaryBox}>
          <div style={styles.summaryTitle}>📍 목표 요약</div>
          <p style={styles.summaryText}>
            {goalLabel} <br />
            {new Date(goalDateValue).toLocaleDateString('ko-KR', {
              month: 'short',
              day: 'numeric',
            })}
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
  goalGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
    gap: '10px',
  } as const,
  goalButton: {
    padding: '15px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center',
  } as const,
  goalButtonSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#f1f8f4',
  } as const,
  goalEmoji: {
    fontSize: '28px',
    marginBottom: '5px',
  } as const,
  goalName: {
    fontSize: '12px',
    fontWeight: 'bold',
  } as const,
  input: {
    width: '100%',
    padding: '10px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box',
  } as const,
  dateInfo: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
  } as const,
  dateLabel: {
    fontSize: '13px',
    color: '#333',
    margin: '0 0 5px 0',
  } as const,
  daysUntil: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#4CAF50',
    margin: 0,
  } as const,
  summaryBox: {
    padding: '15px',
    backgroundColor: '#e8f5e9',
    borderRadius: '8px',
    marginBottom: '20px',
  } as const,
  summaryTitle: {
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: '8px',
  } as const,
  summaryText: {
    fontSize: '14px',
    color: '#388e3c',
    margin: 0,
    lineHeight: '1.5',
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
