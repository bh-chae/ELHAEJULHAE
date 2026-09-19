/**
 * 기타 헬퍼 함수
 * @module utils/helpers
 */

import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_VALUES } from '../types';

const LOG_PREFIX = '[ElhaeJulhae Helper]';

/**
 * ID 생성 (UUID v4)
 */
export function generateId(): string {
  return uuidv4();
}

/**
 * 투두 ID 생성
 */
export function generateTodoId(): string {
  return `todo_${generateId()}`;
}

/**
 * 루틴 ID 생성
 */
export function generateRoutineId(): string {
  return `routine_${generateId()}`;
}

/**
 * 초대 코드 생성 (6자리 대문자 + 숫자)
 */
export function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const length = DEFAULT_VALUES.INVITE_CODE_LENGTH;
  let code = '';

  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
}

/**
 * 초대 코드 유효성 확인
 */
export function isValidInviteCode(code: string): boolean {
  const pattern = /^[A-Z0-9]{6}$/;
  return pattern.test(code);
}

/**
 * 무작위 ID 생성 (짧은 형식)
 */
export function generateShortId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * 배열 셔플 (Fisher-Yates)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/**
 * EXP 계산: 투두 완료 시 획득 EXP
 */
export function calculateTodoExp(): number {
  return DEFAULT_VALUES.EXP_PER_TODO;
}

/**
 * 다음 레벨까지 필요한 EXP
 */
export function getNextLevelExp(): number {
  return DEFAULT_VALUES.NEXT_LEVEL_EXP;
}

/**
 * 현재 경험치 바 진행도 (0~100)
 */
export function getExpProgress(currentExp: number, nextLevelExp: number): number {
  return Math.min(Math.floor((currentExp / nextLevelExp) * 100), 100);
}

/**
 * 레벨업까지 필요한 EXP
 */
export function getExpNeeded(currentExp: number, nextLevelExp: number): number {
  return Math.max(0, nextLevelExp - currentExp);
}

/**
 * 카테고리 한글명
 */
export function getCategoryLabel(category: 'common' | 'mine' | 'partner'): string {
  const labels = {
    common: '공통',
    mine: '내 투두',
    partner: '짝꿍 투두',
  };

  return labels[category];
}

/**
 * 반복 유형 한글명
 */
export function getRepeatLabel(repeat: 'daily' | 'weekly' | 'biweekly' | 'monthly'): string {
  const labels = {
    daily: '매일',
    weekly: '매주',
    biweekly: '2주마다',
    monthly: '매월',
  };

  return labels[repeat];
}

/**
 * 임신 준비 단계 한글명
 */
export function getStageLabel(stage: 'natural' | 'artificial' | 'ivf'): string {
  const labels = {
    natural: '자연임신',
    artificial: '인공수정',
    ivf: '시험관아기',
  };

  return labels[stage];
}

/**
 * 성별 한글명
 */
export function getGenderLabel(gender: 'female' | 'male'): string {
  const labels = {
    female: '여성',
    male: '남성',
  };

  return labels[gender];
}

/**
 * 단계별 설명 (온보딩)
 */
export function getStageDescription(stage: 'natural' | 'artificial' | 'ivf'): string {
  const descriptions = {
    natural: '자연적인 임신을 준비 중입니다',
    artificial: '인공수정을 계획 중입니다',
    ivf: '시험관아기를 준비 중입니다',
  };

  return descriptions[stage];
}

/**
 * 날짜 범위 유효성 확인
 */
export function isValidDateRange(startDate: string, endDate: string): boolean {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start <= end;
  } catch {
    return false;
  }
}

/**
 * 생일로부터 나이 계산
 */
export function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

/**
 * 범위 내 랜덤 숫자
 */
export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 깊은 복사
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as unknown as T;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  const cloned = {} as T;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

/**
 * 빈 문자열 여부 확인
 */
export function isEmpty(value: string | null | undefined): boolean {
  return !value || value.trim().length === 0;
}

/**
 * 문자열 자르기 (말줄임 추가)
 */
export function truncateString(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.substring(0, maxLength)}...`;
}

/**
 * 콘솔 로그 (환경별 조건부)
 */
export function log(message: string, data?: any): void {
  if (process.env.NODE_ENV === 'development') {
    if (data) {
      console.log(LOG_PREFIX, message, data);
    } else {
      console.log(LOG_PREFIX, message);
    }
  }
}

/**
 * 콘솔 에러
 */
export function logError(message: string, error?: any): void {
  if (process.env.NODE_ENV === 'development') {
    if (error) {
      console.error(LOG_PREFIX, message, error);
    } else {
      console.error(LOG_PREFIX, message);
    }
  }
}

/**
 * 배열 중복 제거
 */
export function removeDuplicates<T>(array: T[]): T[] {
  return [...new Set(array)];
}

/**
 * 객체 병합 (얕은 복사)
 */
export function mergeObjects<T>(target: T, source: Partial<T>): T {
  return { ...target, ...source };
}
