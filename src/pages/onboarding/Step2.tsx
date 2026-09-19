/**
 * OnboardingPage Step 2: 짝꿍정보 입력
 * - 싱글/커플 선택 (E6)
 * - 커플 선택 시 짝꿍 정보 입력
 */

import React from 'react';
import { AppMode, Gender } from '../../types';

interface Step2Props {
  userGender?: Gender;
  mode?: AppMode;
  partnerGender?: Gender;
  partnerBirthDate?: string;
  onNext: (data: {
    mode: AppMode;
    partnerGender?: Gender;
    partnerBirthDate?: string;
  }) => void;
  onPrev: () => void;
}

export function Step2({
  userGender,
  mode,
  partnerGender,
  partnerBirthDate,
  onNext,
  onPrev,
}: Step2Props) {
  const [selectedMode, setSelectedMode] = React.useState<AppMode | undefined>(mode);
  const [pGender, setPGender] = React.useState<Gender | undefined>(partnerGender);
  const [pBirthDate, setPBirthDate] = React.useState(partnerBirthDate || '');
  const [error, setError] = React.useState('');

  // 짝꿍 성별은 사용자 성별의 반대
  const oppositeGender: Gender | undefined =
    userGender === 'female' ? 'male' :
    userGender === 'male' ? 'female' :
    undefined;

  const handleNext = () => {
    setError('');

    if (!selectedMode) {
      setError('모드를 선택해주세요');
      return;
    }

    if (selectedMode === 'couple') {
      if (!pGender) {
        setError('짝꿍의 성별을 선택해주세요');
        return;
      }
      if (!pBirthDate) {
        setError('짝꿍의 생년월일을 입력해주세요');
        return;
      }
    }

    onNext({
      mode: selectedMode,
      partnerGender: selectedMode === 'couple' ? pGender : undefined,
      partnerBirthDate: selectedMode === 'couple' ? pBirthDate : undefined,
    });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>💑 모드 선택</h2>
      <p style={styles.subtitle}>혼자 할래요? 짝꿍과 함께할래요?</p>

      {/* 모드 선택 */}
      <div style={styles.section}>
        <div style={styles.modeGroup}>
          <button
            onClick={() => setSelectedMode('single')}
            style={{
              ...styles.modeButton,
              ...(selectedMode === 'single' ? styles.modeButtonSelected : {}),
            }}
          >
            <div style={styles.modeEmoji}>🌙</div>
            <div style={styles.modeName}>혼자</div>
            <div style={styles.modeDesc}>혼자 임신준비를 해요</div>
          </button>

          <button
            onClick={() => setSelectedMode('couple')}
            style={{
              ...styles.modeButton,
              ...(selectedMode === 'couple' ? styles.modeButtonSelected : {}),
            }}
          >
            <div style={styles.modeEmoji}>💑</div>
            <div style={styles.modeName}>짝꿍과 함께</div>
            <div style={styles.modeDesc}>짝꿍과 함께 준비해요</div>
          </button>
        </div>
      </div>

      {/* 짝꿍 정보 (커플 모드일 때만) */}
      {selectedMode === 'couple' && (
        <div style={styles.partnerSection}>
          <h3 style={styles.partnerTitle}>짝꿍의 정보를 입력해주세요</h3>

          {/* 성별 */}
          <div style={styles.section}>
            <label style={styles.label}>
              성별
              {oppositeGender && (
                <span style={{ fontSize: '12px', color: '#666', marginLeft: '5px' }}>
                  ({oppositeGender === 'female' ? '여성' : '남성'}만 선택 가능)
                </span>
              )}
            </label>
            <div style={styles.genderGroup}>
              {(['female', 'male'] as const).map((g) => {
                const isDisabled = oppositeGender && g !== oppositeGender;
                return (
                  <button
                    key={g}
                    onClick={() => !isDisabled && setPGender(g)}
                    disabled={isDisabled}
                    style={{
                      ...styles.genderButton,
                      ...(pGender === g ? styles.genderButtonSelected : {}),
                      ...(isDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
                    }}
                  >
                    {g === 'female' ? '👩 여성' : '👨 남성'}
                  </button>
                );
              })}
            </div>
            {oppositeGender && (
              <p style={styles.hint}>
                당신이 {userGender === 'female' ? '여성' : '남성'}이므로, 짝꿍은 자동으로 {oppositeGender === 'female' ? '여성' : '남성'}으로 설정됩니다
              </p>
            )}
          </div>

          {/* 생년월일 */}
          <div style={styles.section}>
            <label style={styles.label}>생년월일</label>
            <input
              type="date"
              value={pBirthDate}
              onChange={(e) => setPBirthDate(e.target.value)}
              style={styles.input}
            />
            {pBirthDate && (
              <p style={styles.hint}>
                {new Date(pBirthDate).toLocaleDateString('ko-KR')}
              </p>
            )}
          </div>
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
  partnerSection: {
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    marginBottom: '25px',
  } as const,
  partnerTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#333',
  } as const,
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '10px',
  } as const,
  modeGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
  } as const,
  modeButton: {
    padding: '20px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center',
  } as const,
  modeButtonSelected: {
    borderColor: '#ff6b9d',
    backgroundColor: '#fff0f5',
  } as const,
  modeEmoji: {
    fontSize: '32px',
    marginBottom: '10px',
  } as const,
  modeName: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '5px',
  } as const,
  modeDesc: {
    fontSize: '12px',
    color: '#999',
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
