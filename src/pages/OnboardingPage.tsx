/**
 * OnboardingPage: 온보딩 페이지 메인
 * - Step 1~4 관리
 * - localStorage 저장/복구 (E2)
 * - 완료 시 MainPage로 이동
 */

import React from 'react';
import { Step1 } from './onboarding/Step1';
import { Step2 } from './onboarding/Step2';
import { Step3 } from './onboarding/Step3';
import { Step4 } from './onboarding/Step4';
import {
  OnboardingProgress,
  Gender,
  PregnancyStage,
  AppMode,
  DDayType,
} from '../types';
import { StorageService } from '../utils/storage';

interface OnboardingPageProps {
  onComplete: () => void;
}

export function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [step, setStep] = React.useState<1 | 2 | 3 | 4>(1);

  // Step 1
  const [gender, setGender] = React.useState<Gender | undefined>();
  const [birthDate, setBirthDate] = React.useState<string>();
  const [stage, setStage] = React.useState<PregnancyStage | undefined>();

  // Step 2
  const [mode, setMode] = React.useState<AppMode | undefined>();
  const [partnerGender, setPartnerGender] = React.useState<Gender | undefined>();
  const [partnerBirthDate, setPartnerBirthDate] = React.useState<string>();

  // Step 3
  const [ddayType, setDDayType] = React.useState<DDayType | undefined>();
  const [ddayDate, setDDayDate] = React.useState<string>();

  // Step 4
  const [defaultView, setDefaultView] = React.useState<'month' | 'week' | 'day'>('month');

  // 초기 로드: 저장된 진행 상태 복구 (E2)
  React.useEffect(() => {
    const progress = StorageService.loadOnboardingProgress();
    if (progress) {
      if (progress.step1) {
        setGender(progress.step1.gender);
        setBirthDate(progress.step1.birthDate);
        setStage(progress.step1.stage);
      }
      if (progress.step2) {
        setMode(progress.step2.mode);
        setPartnerGender(progress.step2.partner?.gender);
        setPartnerBirthDate(progress.step2.partner?.birthDate);
      }
      if (progress.step3) {
        setDDayType(progress.step3.type as DDayType);
        setDDayDate(progress.step3.targetDate);
      }
      if (progress.step4) {
        setDefaultView((progress.step4.selectedView as 'month' | 'week' | 'day') || 'month');
      }
    }
  }, []);

  // Step 진행 저장 (E2)
  const saveProgress = (newStep: 1 | 2 | 3 | 4) => {
    const progress: OnboardingProgress = {
      id: 'onboarding_' + Date.now(),
      createdAt: new Date().toISOString(),
    };

    if (step >= 1 && gender && birthDate && stage) {
      progress.step1 = {
        gender,
        birthDate,
        stage,
        completedAt: new Date().toISOString(),
      };
    }

    if (step >= 2 && mode) {
      progress.step2 = {
        mode,
        completedAt: new Date().toISOString(),
      };
      if (mode === 'couple' && partnerGender && partnerBirthDate) {
        progress.step2.partner = {
          gender: partnerGender,
          birthDate: partnerBirthDate,
        };
      }
    }

    if (step >= 3 && ddayType && ddayDate) {
      progress.step3 = {
        type: ddayType,
        targetDate: ddayDate,
        completedAt: new Date().toISOString(),
      };
    }

    if (step >= 4) {
      progress.step4 = {
        selectedView: defaultView,
        completedAt: new Date().toISOString(),
      };
    }

    StorageService.saveOnboardingProgress(progress);
    setStep(newStep);
  };

  // Step 1 완료
  const handleStep1Next = (data: {
    gender: Gender;
    birthDate: string;
    stage: PregnancyStage;
  }) => {
    setGender(data.gender);
    setBirthDate(data.birthDate);
    setStage(data.stage);
    saveProgress(2);
  };

  // Step 2 완료
  const handleStep2Next = (data: {
    mode: AppMode;
    partnerGender?: Gender;
    partnerBirthDate?: string;
  }) => {
    setMode(data.mode);
    setPartnerGender(data.partnerGender);
    setPartnerBirthDate(data.partnerBirthDate);
    saveProgress(3);
  };

  // Step 3 완료
  const handleStep3Next = (data: { ddayType: DDayType; ddayDate: string }) => {
    setDDayType(data.ddayType);
    setDDayDate(data.ddayDate);
    saveProgress(4);
  };

  // Step 4 완료 (온보딩 완료)
  const handleStep4Complete = (view: 'month' | 'week' | 'day') => {
    setDefaultView(view);

    // 온보딩 완료 처리
    if (gender && birthDate && stage && ddayType && ddayDate) {
      // User, DDay, Character 생성 및 저장
      StorageService.completeOnboarding(gender, birthDate, stage, ddayDate);

      // 짝꿍 정보 저장 (커플 모드)
      if (mode === 'couple' && partnerGender && partnerBirthDate) {
        const partner = {
          gender: partnerGender,
          birthDate: partnerBirthDate,
        };
        StorageService.savePartner(partner);
      }

      // 온보딩 진행 상태 삭제
      localStorage.removeItem('elhaejulhae_onboardingProgress');

      // MainPage로 이동
      onComplete();
    }
  };

  return (
    <div style={styles.page}>
      {/* 진행도 표시 */}
      <div style={styles.progressBar}>
        <div style={{ ...styles.progress, width: `${(step / 4) * 100}%` }} />
      </div>

      <div style={styles.stepLabel}>
        Step {step} / 4
      </div>

      {/* Step 렌더링 */}
      {step === 1 && (
        <Step1
          gender={gender}
          birthDate={birthDate}
          stage={stage}
          onNext={handleStep1Next}
        />
      )}

      {step === 2 && (
        <Step2
          mode={mode}
          partnerGender={partnerGender}
          partnerBirthDate={partnerBirthDate}
          onNext={handleStep2Next}
          onPrev={() => saveProgress(1)}
        />
      )}

      {step === 3 && (
        <Step3
          ddayType={ddayType}
          ddayDate={ddayDate}
          onNext={handleStep3Next}
          onPrev={() => saveProgress(2)}
        />
      )}

      {step === 4 && (
        <Step4
          defaultView={defaultView}
          onComplete={handleStep4Complete}
          onPrev={() => saveProgress(3)}
        />
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#fafafa',
    paddingBottom: '20px',
  } as const,
  progressBar: {
    height: '4px',
    backgroundColor: '#e0e0e0',
    width: '100%',
  } as const,
  progress: {
    height: '100%',
    backgroundColor: '#4CAF50',
    transition: 'width 0.3s ease',
  } as const,
  stepLabel: {
    textAlign: 'center',
    fontSize: '12px',
    color: '#999',
    paddingTop: '10px',
    marginBottom: '10px',
  } as const,
};
