function Calendar(year, month, day) {
	this.year  = year  || 1900;
	this.month = month || 1;
	this.day   = day   || 1;
}

/* 设置日期 */
Calendar.prototype.setDate = function(year, month, day) {
	this.year  = year;
	this.month = month;
	this.day   = day;
}
/* 返回今天为本月的第几天 */
Calendar.prototype.getDate = function() {
	return this.day;
}
/* 返回今天在本月内为星期几 */
Calendar.prototype.getDay =function(year, month, day) {	
	return allDays(year || this.year, month || this.month, day || this.day) % 7;
}
/* 获取一个月的天数 */
Calendar.prototype.getMonthDays = function(year, month) {
	var dSum = 0,
			leap = isLeapYear(year);

	if(month === 0) month = 12;
	switch(month) {
		case 1 : dSum += 31; break;
		case 2 : if(leap) { dSum += 29; } else { dSum += 28; } break;
		case 3 : dSum += 31; break;
		case 4 : dSum += 30; break;
		case 5 : dSum += 31; break;
		case 6 : dSum += 30; break;
		case 7 : dSum += 31; break;
		case 8 : dSum += 31; break;
		case 9 : dSum += 30; break;
		case 10: dSum += 31; break;
		case 11: dSum += 30; break;
		case 12: dSum += 31; break;
		default: break;
	}
	return dSum;
}

/* 判断是否为闰年 */
function isLeapYear(year) {
	var leapYear = false;
	if(((year || this.year) % 400 === 0) || ((year || this.year) % 4 === 0 && (year || this.year) % 100 !== 0)) {
		leapYear = true;
	}
	return leapYear;
}

function pastDays(year, month, day) {
	var dSum = 0,
			leap = isLeapYear(year);
	for(var i = 1; i < month; i++) {
		switch(i) {
			case 1 : dSum += 31; break;
			case 2 : if(leap) { dSum += 29; } else { dSum += 28; } break;
			case 3 : dSum += 31; break;
			case 4 : dSum += 30; break;
			case 5 : dSum += 31; break;
			case 6 : dSum += 30; break;
			case 7 : dSum += 31; break;
			case 8 : dSum += 31; break;
			case 9 : dSum += 30; break;
			case 10: dSum += 31; break;
			case 11: dSum += 30; break;
			case 12: dSum += 31; break;
			default: break;
		}
	}
	return dSum + day;
}

function allDays(year, month, day) {
	var dSum = 0;
	for(var i = 1900; i < year; i++) {
		if((i % 400 === 0) || (i % 4 === 0 && i % 100 !== 0)) {
			dSum += 366;
		} else {
			dSum += 365;
		}
	}
	dSum += pastDays(year, month, day);
	return dSum;
}


