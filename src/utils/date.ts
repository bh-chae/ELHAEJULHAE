/**
 * 날짜 관련 유틸리티 함수
 * @module utils/date
 */

/**
 * 오늘 날짜를 YYYY-MM-DD 형식으로 반환
 */
export function getTodayDate(): string {
  const now = new Date();
  return formatDateToISO(now);
}

/**
 * Date를 ISO 8601 형식(YYYY-MM-DD)으로 포맷
 */
export function formatDateToISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * ISO 8601 문자열을 Date로 변환
 */
export function parseISO(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * D-Day까지 남은 날짜 계산 (E3)
 * @returns 남은 날 수 (양수면 미래, 음수면 과거)
 */
export function calcDaysUntilDDay(targetDate: string): number {
  const today = getTodayDate();
  const targetMs = parseISO(targetDate).getTime();
  const todayMs = parseISO(today).getTime();
  const diffMs = targetMs - todayMs;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * D-Day 카운트다운 문자열 생성 (E3: 일수만)
 * @example calcDaysUntilDDay("2026-09-20") → "배란일까지 7일"
 */
export function formatDDayCountdown(
  ddayName: string,
  targetDate: string
): string {
  const days = calcDaysUntilDDay(targetDate);

  if (days === 0) {
    return `오늘은 ${ddayName}!`;
  } else if (days > 0) {
    return `${ddayName}까지 ${days}일`;
  } else {
    return `${ddayName}로부터 ${Math.abs(days)}일 경과`;
  }
}

/**
 * 월의 일 수 계산
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * 특정 날짜의 요일 번호 (0=일, 1=월, ..., 6=토)
 */
export function getDayOfWeek(dateString: string): number {
  return parseISO(dateString).getDay();
}

/**
 * 요일 이름 반환 (한글)
 */
export function getDayName(dayOfWeek: number): string {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return days[dayOfWeek];
}

/**
 * 같은 날짜인지 확인
 */
export function isSameDay(date1: string, date2: string): boolean {
  return date1 === date2;
}

/**
 * 특정 날짜가 특정 요일인지 확인
 * @param dateString ISO 형식 날짜
 * @param dayOfWeek 요일 번호 (0=일, 1=월, ..., 6=토)
 */
export function isDayOfWeek(dateString: string, dayOfWeek: number): boolean {
  return getDayOfWeek(dateString) === dayOfWeek;
}

/**
 * 특정 범위의 모든 날짜 배열 반환
 */
export function getDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const current = parseISO(startDate);
  const end = parseISO(endDate);

  while (current <= end) {
    dates.push(formatDateToISO(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

/**
 * 월의 모든 날짜 배열 반환
 */
export function getMonthDates(year: number, month: number): string[] {
  const daysInMonth = getDaysInMonth(year, month);
  const dates: string[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    dates.push(formatDateToISO(date));
  }

  return dates;
}

/**
 * 루틴이 특정 날짜에 실행되어야 하는지 확인
 */
export function shouldRoutineRunOnDate(
  routineStartDate: string,
  routineEndDate: string | undefined,
  repeat: 'daily' | 'weekly' | 'biweekly' | 'monthly',
  dayOfWeek: number | undefined,
  targetDate: string
): boolean {
  // 종료 날짜가 지났으면 실행 안 함
  if (routineEndDate && parseISO(targetDate) > parseISO(routineEndDate)) {
    return false;
  }

  // 시작 날짜 이전이면 실행 안 함
  if (parseISO(targetDate) < parseISO(routineStartDate)) {
    return false;
  }

  if (repeat === 'daily') {
    return true;
  }

  if (repeat === 'weekly') {
    // dayOfWeek이 지정되면 그 요일에만 실행
    if (dayOfWeek !== undefined) {
      return isDayOfWeek(targetDate, dayOfWeek);
    }
    // dayOfWeek이 없으면 startDate와 같은 요일에 실행
    return getDayOfWeek(targetDate) === getDayOfWeek(routineStartDate);
  }

  if (repeat === 'biweekly') {
    const startDate = parseISO(routineStartDate);
    const targetDateObj = parseISO(targetDate);
    const diffDays = Math.floor(
      (targetDateObj.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (dayOfWeek !== undefined) {
      // 2주 주기 + 특정 요일
      return isDayOfWeek(targetDate, dayOfWeek) && diffDays % 14 >= 0;
    }

    // startDate와 같은 요일, 2주 주기
    return diffDays % 14 === 0 && getDayOfWeek(targetDate) === getDayOfWeek(routineStartDate);
  }

  if (repeat === 'monthly') {
    // 같은 날짜에 매월 반복
    const startDate = parseISO(routineStartDate);
    const targetDateObj = parseISO(targetDate);
    return startDate.getDate() === targetDateObj.getDate();
  }

  return false;
}

/**
 * 시간 포맷 (HH:MM)
 */
export function formatTime(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

/**
 * 한글 형식 날짜 (예: "2026년 9월 19일 (금)")
 */
export function formatDateKorean(dateString: string): string {
  const date = parseISO(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayName = getDayName(date.getDay());

  return `${year}년 ${month}월 ${day}일 (${dayName})`;
}

/**
 * 짧은 형식 한글 날짜 (예: "9월 19일 (금)")
 */
export function formatDateKoreanShort(dateString: string): string {
  const date = parseISO(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayName = getDayName(date.getDay());

  return `${month}월 ${day}일 (${dayName})`;
}
