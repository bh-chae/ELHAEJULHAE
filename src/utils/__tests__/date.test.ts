/**
 * 날짜 유틸리티 테스트
 */

import {
  getTodayDate,
  formatDateToISO,
  parseISO,
  calcDaysUntilDDay,
  formatDDayCountdown,
  getDaysInMonth,
  getDayOfWeek,
  getDayName,
  isSameDay,
  isDayOfWeek,
  getDateRange,
  shouldRoutineRunOnDate,
  formatDateKorean,
} from '../date';

describe('날짜 유틸리티', () => {
  describe('formatDateToISO', () => {
    it('Date를 ISO 8601 형식으로 변환해야 함', () => {
      const date = new Date(2026, 8, 20); // 9월 20일 (month는 0-11)
      expect(formatDateToISO(date)).toBe('2026-09-20');
    });

    it('한 자리 월/일을 0으로 패딩해야 함', () => {
      const date = new Date(2026, 0, 5); // 1월 5일
      expect(formatDateToISO(date)).toBe('2026-01-05');
    });
  });

  describe('parseISO', () => {
    it('ISO 8601 문자열을 Date로 변환해야 함', () => {
      const result = parseISO('2026-09-20');
      expect(result.getFullYear()).toBe(2026);
      expect(result.getMonth()).toBe(8); // 0-11
      expect(result.getDate()).toBe(20);
    });

    it('1월 1일을 올바르게 파싱해야 함', () => {
      const result = parseISO('2026-01-01');
      expect(result.getMonth()).toBe(0);
      expect(result.getDate()).toBe(1);
    });
  });

  describe('calcDaysUntilDDay', () => {
    it('미래 날짜는 양수를 반환해야 함', () => {
      const today = getTodayDate();
      const future = formatDateToISO(
        new Date(parseISO(today).getTime() + 7 * 24 * 60 * 60 * 1000)
      );
      const days = calcDaysUntilDDay(future);
      expect(days).toBeGreaterThan(0);
      expect(days).toBe(7);
    });

    it('과거 날짜는 음수를 반환해야 함', () => {
      const today = getTodayDate();
      const past = formatDateToISO(
        new Date(parseISO(today).getTime() - 7 * 24 * 60 * 60 * 1000)
      );
      const days = calcDaysUntilDDay(past);
      expect(days).toBeLessThan(0);
      expect(days).toBe(-7);
    });

    it('오늘은 0을 반환해야 함', () => {
      const today = getTodayDate();
      expect(calcDaysUntilDDay(today)).toBe(0);
    });
  });

  describe('formatDDayCountdown', () => {
    it('미래 날짜에 대해 "까지 N일" 형식을 반환해야 함', () => {
      const future = formatDateToISO(
        new Date(parseISO(getTodayDate()).getTime() + 7 * 24 * 60 * 60 * 1000)
      );
      const result = formatDDayCountdown('배란일', future);
      expect(result).toContain('배란일');
      expect(result).toContain('7일');
    });

    it('오늘은 "오늘은" 형식을 반환해야 함', () => {
      const today = getTodayDate();
      const result = formatDDayCountdown('배란일', today);
      expect(result).toBe('오늘은 배란일!');
    });
  });

  describe('getDaysInMonth', () => {
    it('2월의 일 수를 반환해야 함 (평년)', () => {
      expect(getDaysInMonth(2026, 2)).toBe(28);
    });

    it('9월의 일 수를 반환해야 함', () => {
      expect(getDaysInMonth(2026, 9)).toBe(30);
    });

    it('윤년 2월의 일 수를 반환해야 함', () => {
      expect(getDaysInMonth(2024, 2)).toBe(29);
    });
  });

  describe('getDayOfWeek', () => {
    it('2026-09-20은 일요일(0)이어야 함', () => {
      const dayOfWeek = getDayOfWeek('2026-09-20');
      expect(dayOfWeek).toBe(0);
    });

    it('요일 번호가 0-6 범위여야 함', () => {
      const dayOfWeek = getDayOfWeek('2026-09-19');
      expect(dayOfWeek).toBeGreaterThanOrEqual(0);
      expect(dayOfWeek).toBeLessThanOrEqual(6);
    });
  });

  describe('getDayName', () => {
    it('요일 번호를 한글명으로 변환해야 함', () => {
      expect(getDayName(0)).toBe('일');
      expect(getDayName(1)).toBe('월');
      expect(getDayName(6)).toBe('토');
    });
  });

  describe('isSameDay', () => {
    it('같은 날짜는 true를 반환해야 함', () => {
      expect(isSameDay('2026-09-20', '2026-09-20')).toBe(true);
    });

    it('다른 날짜는 false를 반환해야 함', () => {
      expect(isSameDay('2026-09-20', '2026-09-21')).toBe(false);
    });
  });

  describe('isDayOfWeek', () => {
    it('특정 요일인지 확인해야 함', () => {
      // 2026-09-20은 일요일(0)
      expect(isDayOfWeek('2026-09-20', 0)).toBe(true);
      expect(isDayOfWeek('2026-09-20', 1)).toBe(false);
    });
  });

  describe('getDateRange', () => {
    it('시작 날짜에서 종료 날짜까지의 배열을 반환해야 함', () => {
      const range = getDateRange('2026-09-18', '2026-09-20');
      expect(range.length).toBe(3);
      expect(range[0]).toBe('2026-09-18');
      expect(range[2]).toBe('2026-09-20');
    });

    it('같은 날짜는 길이 1의 배열을 반환해야 함', () => {
      const range = getDateRange('2026-09-20', '2026-09-20');
      expect(range.length).toBe(1);
      expect(range[0]).toBe('2026-09-20');
    });
  });

  describe('shouldRoutineRunOnDate', () => {
    it('매일 루틴은 모든 날짜에서 실행되어야 함', () => {
      expect(
        shouldRoutineRunOnDate(
          '2026-09-01',
          undefined,
          'daily',
          undefined,
          '2026-09-20'
        )
      ).toBe(true);
    });

    it('시작 날짜 이전이면 실행되지 않아야 함', () => {
      expect(
        shouldRoutineRunOnDate(
          '2026-09-10',
          undefined,
          'daily',
          undefined,
          '2026-09-05'
        )
      ).toBe(false);
    });

    it('종료 날짜 이후이면 실행되지 않아야 함', () => {
      expect(
        shouldRoutineRunOnDate(
          '2026-09-01',
          '2026-09-20',
          'daily',
          undefined,
          '2026-09-25'
        )
      ).toBe(false);
    });

    it('주간 루틴이 특정 요일에만 실행되어야 함', () => {
      // 2026-09-20은 일요일(0)
      const result = shouldRoutineRunOnDate(
        '2026-09-01',
        undefined,
        'weekly',
        0, // 일요일
        '2026-09-20'
      );
      expect(result).toBe(true);

      // 월요일에는 실행 안 됨
      const resultMonday = shouldRoutineRunOnDate(
        '2026-09-01',
        undefined,
        'weekly',
        0, // 일요일
        '2026-09-21'
      );
      expect(resultMonday).toBe(false);
    });

    it('월간 루틴이 같은 날짜에 매월 실행되어야 함', () => {
      expect(
        shouldRoutineRunOnDate(
          '2026-09-15',
          undefined,
          'monthly',
          undefined,
          '2026-10-15'
        )
      ).toBe(true);

      expect(
        shouldRoutineRunOnDate(
          '2026-09-15',
          undefined,
          'monthly',
          undefined,
          '2026-10-14'
        )
      ).toBe(false);
    });
  });

  describe('formatDateKorean', () => {
    it('날짜를 한글 형식으로 포맷해야 함', () => {
      const result = formatDateKorean('2026-09-20');
      expect(result).toContain('2026년');
      expect(result).toContain('9월');
      expect(result).toContain('20일');
    });
  });
});
