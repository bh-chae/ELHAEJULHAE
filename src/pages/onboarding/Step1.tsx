/**
 * OnboardingPage Step 1: 개인정보 입력
 * - 성별 선택
 * - 생년월일 입력
 * - 임신준비 단계 선택
 */

import React from 'react';
import { Gender, PregnancyStage } from '../../types';

interface Step1Props {
  gender?: Gender;
  birthDate?: string;
  stage?: PregnancyStage;
  onNext: (data: { gender: Gender; birthDate: string; stage: PregnancyStage }) => void;
}

export function Step1({ gender, birthDate, stage, onNext }: Step1Props) {
  const [selectedGender, setSelectedGender] = React.useState<Gender | undefined>(gender);
  const [selectedBirthDate, setSelectedBirthDate] = React.useState(birthDate || '');
  const [selectedStage, setSelectedStage] = React.useState<PregnancyStage | undefined>(stage);
  const [error, setError] = React.useState('');

  const handleNext = () => {
    setError('');

    if (!selectedGender) {
      setError('성별을 선택해주세요');
      return;
    }

    if (!selectedBirthDate) {
      setError('생년월일을 입력해주세요');
      return;
    }

    if (!selectedStage) {
      setError('임신준비 단계를 선택해주세요');
      return;
    }

    onNext({
      gender: selectedGender,
      birthDate: selectedBirthDate,
      stage: selectedStage,
    });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🌙 개인정보 입력</h2>
      <p style={styles.subtitle}>임신준비 여정을 함께 시작할게요!</p>

      {/* 성별 선택 */}
      <div style={styles.section}>
        <label style={styles.label}>성별</label>
        <div style={styles.genderGroup}>
          {(['female', 'male'] as const).map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGender(g)}
              style={{
                ...styles.genderButton,
                ...(selectedGender === g ? styles.genderButtonSelected : {}),
              }}
            >
              {g === 'female' ? '👩 여성' : '👨 남성'}
            </button>
          ))}
        </div>
      </div>

      {/* 생년월일 */}
      <div style={styles.section}>
        <label style={styles.label}>생년월일</label>
        <input
          type="date"
          value={selectedBirthDate}
          onChange={(e) => setSelectedBirthDate(e.target.value)}
          style={styles.input}
        />
        {selectedBirthDate && (
          <p style={styles.hint}>
            {new Date(selectedBirthDate).toLocaleDateString('ko-KR')}
          </p>
        )}
      </div>

      {/* 임신준비 단계 */}
      <div style={styles.section}>
        <label style={styles.label}>임신준비 방법</label>
        <div style={styles.stageGroup}>
          {(['natural', 'artificial', 'ivf'] as const).map((s) => {
            const labels = {
              natural: '자연임신',
              artificial: '인공수정',
              ivf: '시험관아기',
            };

            return (
              <button
                key={s}
                onClick={() => setSelectedStage(s)}
                style={{
                  ...styles.stageButton,
                  ...(selectedStage === s ? styles.stageButtonSelected : {}),
                }}
              >
                {labels[s]}
              </button>
            );
          })}
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && <div style={styles.error}>{error}</div>}

      {/* 다음 버튼 */}
      <button onClick={handleNext} style={styles.nextButton}>
        다음 →
      </button>
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
  genderGroup: {
    display: 'flex',
    gap: '10px',
  } as const,
  genderButton: {
    flex: 1,
    padding: '12px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  } as const,
  genderButtonSelected: {
    borderColor: '#ff6b9d',
    backgroundColor: '#fff0f5',
  } as const,
  input: {
    width: '100%',
    padding: '10px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box',
  } as const,
  hint: {
    fontSize: '12px',
    color: '#999',
    marginTop: '5px',
  } as const,
  stageGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '10px',
  } as const,
  stageButton: {
    padding: '12px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  } as const,
  stageButtonSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#f1f8f4',
  } as const,
  error: {
    color: '#d32f2f',
    fontSize: '14px',
    padding: '10px',
    backgroundColor: '#ffebee',
    borderRadius: '4px',
    marginBottom: '15px',
  } as const,
  nextButton: {
    width: '100%',
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
