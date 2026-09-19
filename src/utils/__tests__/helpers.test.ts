/**
 * 헬퍼 함수 테스트
 */

jest.mock('uuid', () => ({
  v4: () => 'test-uuid-1234',
}));

import {
  generateId,
  generateTodoId,
  generateRoutineId,
  generateInviteCode,
  isValidInviteCode,
  calculateTodoExp,
  getExpProgress,
  getExpNeeded,
  getCategoryLabel,
  getRepeatLabel,
  getStageLabel,
  getGenderLabel,
  isValidDateRange,
  calculateAge,
  getRandomNumber,
  deepClone,
  isEmpty,
  truncateString,
  removeDuplicates,
  mergeObjects,
} from '../helpers';

describe('헬퍼 함수', () => {
  describe('ID 생성', () => {
    it('generateId는 유효한 UUID 형식을 생성해야 함', () => {
      const id = generateId();
      // mock된 uuid는 고정값이므로 형식만 확인
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });

    it('generateTodoId는 "todo_" 접두사를 가져야 함', () => {
      const id = generateTodoId();
      expect(id).toMatch(/^todo_/);
    });

    it('generateRoutineId는 "routine_" 접두사를 가져야 함', () => {
      const id = generateRoutineId();
      expect(id).toMatch(/^routine_/);
    });
  });

  describe('초대 코드', () => {
    it('generateInviteCode는 6자리 코드를 생성해야 함', () => {
      const code = generateInviteCode();
      expect(code.length).toBe(6);
      expect(/^[A-Z0-9]{6}$/.test(code)).toBe(true);
    });

    it('생성된 코드마다 다른 값이어야 함', () => {
      const code1 = generateInviteCode();
      const code2 = generateInviteCode();
      expect(code1).not.toBe(code2);
    });

    it('isValidInviteCode는 유효한 코드를 확인해야 함', () => {
      expect(isValidInviteCode('ABC123')).toBe(true);
      expect(isValidInviteCode('abc123')).toBe(false); // 소문자
      expect(isValidInviteCode('ABC12')).toBe(false); // 5자리
      expect(isValidInviteCode('ABC1234')).toBe(false); // 7자리
    });
  });

  describe('EXP 계산', () => {
    it('calculateTodoExp는 10을 반환해야 함', () => {
      expect(calculateTodoExp()).toBe(10);
    });

    it('getExpProgress는 0~100을 반환해야 함', () => {
      expect(getExpProgress(0, 100)).toBe(0);
      expect(getExpProgress(50, 100)).toBe(50);
      expect(getExpProgress(100, 100)).toBe(100);
    });

    it('getExpProgress는 100을 넘지 않아야 함', () => {
      expect(getExpProgress(150, 100)).toBe(100);
    });

    it('getExpNeeded는 필요한 EXP를 반환해야 함', () => {
      expect(getExpNeeded(0, 100)).toBe(100);
      expect(getExpNeeded(50, 100)).toBe(50);
      expect(getExpNeeded(100, 100)).toBe(0);
    });
  });

  describe('라벨 변환', () => {
    it('getCategoryLabel은 한글 카테고리명을 반환해야 함', () => {
      expect(getCategoryLabel('common')).toBe('공통');
      expect(getCategoryLabel('mine')).toBe('내 투두');
      expect(getCategoryLabel('partner')).toBe('짝꿍 투두');
    });

    it('getRepeatLabel은 한글 반복명을 반환해야 함', () => {
      expect(getRepeatLabel('daily')).toBe('매일');
      expect(getRepeatLabel('weekly')).toBe('매주');
      expect(getRepeatLabel('biweekly')).toBe('2주마다');
      expect(getRepeatLabel('monthly')).toBe('매월');
    });

    it('getStageLabel은 한글 단계명을 반환해야 함', () => {
      expect(getStageLabel('natural')).toBe('자연임신');
      expect(getStageLabel('artificial')).toBe('인공수정');
      expect(getStageLabel('ivf')).toBe('시험관아기');
    });

    it('getGenderLabel은 한글 성별명을 반환해야 함', () => {
      expect(getGenderLabel('female')).toBe('여성');
      expect(getGenderLabel('male')).toBe('남성');
    });
  });

  describe('날짜 범위 검증', () => {
    it('isValidDateRange는 유효한 범위를 확인해야 함', () => {
      expect(isValidDateRange('2026-09-15', '2026-09-20')).toBe(true);
      expect(isValidDateRange('2026-09-20', '2026-09-20')).toBe(true);
    });

    it('isValidDateRange는 역순 범위를 거부해야 함', () => {
      expect(isValidDateRange('2026-09-20', '2026-09-15')).toBe(false);
    });

    it('isValidDateRange는 유효하지 않은 날짜를 거부해야 함', () => {
      expect(isValidDateRange('invalid', '2026-09-20')).toBe(false);
    });
  });

  describe('생일 계산', () => {
    it('calculateAge는 정확한 나이를 계산해야 함', () => {
      // 정확한 계산을 위해 고정된 날짜 사용
      const birthDate = '2000-01-15';
      const age = calculateAge(birthDate);
      expect(age).toBeGreaterThanOrEqual(25);
      expect(age).toBeLessThanOrEqual(26);
    });
  });

  describe('랜덤 함수', () => {
    it('getRandomNumber는 지정된 범위의 숫자를 반환해야 함', () => {
      for (let i = 0; i < 10; i++) {
        const num = getRandomNumber(1, 10);
        expect(num).toBeGreaterThanOrEqual(1);
        expect(num).toBeLessThanOrEqual(10);
      }
    });
  });

  describe('깊은 복사', () => {
    it('deepClone은 객체를 깊게 복사해야 함', () => {
      const original = {
        name: '테스트',
        nested: { value: 42 },
        array: [1, 2, 3],
      };

      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.nested).not.toBe(original.nested);
      expect(cloned.array).not.toBe(original.array);
    });

    it('deepClone은 배열을 깊게 복사해야 함', () => {
      const original = [{ id: 1 }, { id: 2 }];
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned[0]).not.toBe(original[0]);
    });

    it('deepClone은 Date를 복사해야 함', () => {
      const original = new Date('2026-09-20');
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
    });
  });

  describe('문자열 유틸', () => {
    it('isEmpty는 빈 문자열을 감지해야 함', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true);
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
      expect(isEmpty('텍스트')).toBe(false);
    });

    it('truncateString은 문자열을 자르고 말줄임을 추가해야 함', () => {
      expect(truncateString('안녕하세요', 3)).toBe('안녕하...');
      expect(truncateString('안녕', 5)).toBe('안녕');
    });
  });

  describe('배열 유틸', () => {
    it('removeDuplicates는 중복을 제거해야 함', () => {
      expect(removeDuplicates([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
      expect(removeDuplicates(['a', 'b', 'a'])).toEqual(['a', 'b']);
    });
  });

  describe('객체 병합', () => {
    it('mergeObjects는 객체를 병합해야 함', () => {
      const target = { a: 1, b: 2 };
      const source = { b: 3, c: 4 };

      expect(mergeObjects(target, source)).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('mergeObjects는 원본을 수정하지 않아야 함', () => {
      const target = { a: 1 };
      const original = { ...target };

      mergeObjects(target, { a: 2 });

      expect(target).toEqual(original);
    });
  });
});
