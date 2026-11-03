import test from 'node:test';
import assert from 'node:assert/strict';
import {shiftDay,scheduled,streak,activity} from '../lib/tracking.mjs';
test('calendar arithmetic crosses years and daylight saving changes',()=>{assert.equal(shiftDay('2024-12-31',1),'2025-01-01');assert.equal(shiftDay('2024-03-31',1),'2024-04-01')});
test('weekday schedules skip weekends and do not break streaks',()=>{let h={start:'2024-03-01',schedule:'weekdays',days:[1,2,3,4,5],completions:['2024-03-01','2024-03-04']};assert.equal(scheduled(h,'2024-03-03'),false);assert.equal(streak(h,'2024-03-04').current,2);assert.equal(streak(h,'2024-03-06').current,0)});
test('today is not missed before day ends',()=>{let h={start:'2024-01-01',schedule:'daily',completions:['2024-01-01']};assert.equal(streak(h,'2024-01-02').current,1);assert.equal(streak(h,'2024-01-03').current,0)});
test('duplicate check-ins cannot inflate activity',()=>{assert.deepEqual(activity([{completedAt:'2024-01-01'}],[{completions:['2024-01-01','2024-01-01']}]),{'2024-01-01':2})});
