window.addEventListener('load', function() {
	var doc = document;

	// 动态生成列表项
	function bringList(container, begin, end, unit) {
		var fragment = doc.createDocumentFragment();
		var	li   = null,
				div  = null,
				span = null,
				text = null;

		for(var i = begin; i <= end; i++) {
			li   = doc.createElement('li'),
			div  = doc.createElement('div'),
			span = doc.createElement('span'),
			text = doc.createTextNode(unit);
			div.innerHTML = i;
			span.appendChild(text);
			li.appendChild(div);
			li.appendChild(span);
			fragment.appendChild(li);
		}
		container.appendChild(fragment);
	}

	// 动态生成日历界面
	function bringCalendar(container, row, col) {
		var fragment = doc.createDocumentFragment();
		var tr = null,
				td = null;
		for(var i = 0; i < row; i++) {
			tr = document.createElement('tr');
			for(var j = 0; j < col; j++) {
				td = doc.createElement('td');
				tr.appendChild(td);
			}
			fragment.appendChild(tr);
		}
		container.appendChild(fragment);
	}
	
	/**** 主控件 ****/
	function bringDateArr(year, month) {
		var date          = new Calendar(year, month),
				week          = date.getDay(),                       // 获取本月1号为星期几
				curMonthDays  = date.getMonthDays(year, month),      // 获取本月天数
				prevMonthDays = date.getMonthDays(year, month - 1);  // 获取上个月天数
		var i = 1, 
				monthArr = [];

		for(; week > 0; week--) {
			monthArr.unshift(prevMonthDays--);
		}
		for(i = 1; i <= curMonthDays; i++) {
			monthArr.push(i);
		}
		for(i = 1, diff = 35 - monthArr.length; i <= diff; i++) {
			monthArr.push(i);
		}
		return monthArr;
	}

	// 刷新数据
	function flashDate(curYear, curMonth, curDay) {
		var monthArr = bringDateArr(curYear, curMonth);
		var tds      = doc.getElementsByTagName('td');
		for(var i = 7, len = tds.length; i < len; i++) {
			tds[i].innerHTML = monthArr[i - 7];
		}
		indicateToday(curDay);
	}

	// 列表事件
	function listSelected(elems, yShow, mShow) {
		var curDay = parseInt(doc.getElementById('day-selected').childNodes[0].nodeValue);
		for(var i = 0, len = elems.length; i < len; i++) {
			(function(index) {
				elems[index].addEventListener('click', function() {
					var curVal = parseInt(elems[index].firstElementChild.childNodes[0].nodeValue);
					if(curVal > 12) {
						yShow.innerHTML = curVal;
					} else {
						mShow.innerHTML = curVal;
					}
					var curYear  = parseInt(yShow.childNodes[0].nodeValue),
							curMonth = parseInt(mShow.childNodes[0].nodeValue);
					flashDate(curYear, curMonth, curDay);
					indicateDate(curYear, curMonth);
				});
			})(i);
		}
	}

	// 月份导航事件
	function monthNav(prev, next, yShow, mShow) {
		var curDay = parseInt(doc.getElementById('day-selected').childNodes[0].nodeValue);
		prev.addEventListener('click', function() {
			var curYear  = parseInt(yShow.childNodes[0].nodeValue),
					curMonth = parseInt(mShow.childNodes[0].nodeValue);
			if(curMonth > 1) {
				mShow.innerHTML = --curMonth;
			}
			flashDate(curYear, curMonth, curDay);
			indicateDate(curYear, curMonth);
		})
		next.addEventListener('click', function() {
			var curYear  = parseInt(yShow.childNodes[0].nodeValue),
					curMonth = parseInt(mShow.childNodes[0].nodeValue);
			if(curMonth < 12) {
				mShow.innerHTML = ++curMonth;
			}
			flashDate(curYear, curMonth, curDay);
			indicateDate(curYear, curMonth);
		})
	}

	// 初始化日历
	function initDate(yShow, mShow) {
		// 使用系统日期获取当前日期
		var curDate = new Date();
		var year  = curDate.getFullYear(),
				month = curDate.getMonth() + 1,
				today = curDate.getDate();

		yShow.innerHTML = year;
		mShow.innerHTML = month;
		flashDate(year, month, today);
		indicateDate(year, month);
	}

	// 返回今天
	function retToday(elem, yShow, mShow) {
		elem.addEventListener('click', function() {
			initDate(yShow, mShow);
		});
	}

	/**** 日期标识 ****/

	// 初始化日历当日的状态
	function indicateToday(today) {
		var elems = doc.getElementsByTagName('td');
		for(var i = 7, elemsLen = elems.length; i < elemsLen; i++) {
			var elem = elems[i],
					curDay = parseInt(elem.childNodes[0].nodeValue);
			if(elem.getAttribute('id')) {
				elem.removeAttribute('id');
			}
			if(curDay === today) {
				elem.setAttribute('id', 'day-selected');
			}
		}
	}

	// 设置日历中一天点击后的状态
	function bindCurDayStatus(elem) {
		elem.addEventListener('click', function(e) {
			var	selected = doc.getElementById('day-selected');
			var target = e.target || window.event;
			var curVal = parseInt(target.childNodes[0].nodeValue);
			if(typeof curVal === 'number' && !isNaN(curVal)) {
				if(selected) {
					selected.removeAttribute('id');
				}
				target.setAttribute('id', 'day-selected');
			}
		})
	}

	// 设置列表项点击后状态状态
	function indicateDate(curYear, curMonth) {
		var yUl   = doc.getElementById('year-list'),
				mUl   = doc.getElementById('month-list');
		var uls      = [yUl, mUl],
				idPrefix = ['year', 'month'];

		for(var i = 0, ulsLen = uls.length; i < ulsLen; i ++) {
			for(var j = 0, ulsChildLen = uls[i].childNodes.length; j < ulsChildLen; j++) {
				var elem = uls[i].childNodes[j],
						val  = parseInt(elem.firstElementChild.childNodes[0].nodeValue);
				if(elem.getAttribute('id')) {
					elem.removeAttribute('id');
				}
				if(arguments[i] === val) {
					elem.setAttribute('id', idPrefix[i] + '-selected');
				}
			}
		}
	}

	// 阳历节日
	var solarHoliday = {
		'1-1': '元旦',
		'4-4': '清明',
		'5-1': '劳动节',
		'6-1': '儿童节',
		'10-1': '国庆节',
	};

	// 执行函数
	(function main() {
		var yUl   = doc.getElementById('year-list'),
				mUl   = doc.getElementById('month-list');
		var table = doc.getElementById('table');
		var	yShow = doc.getElementById('year'),
				mShow = doc.getElementById('month');
		var prev  = doc.getElementById('prev'),
				next  = doc.getElementById('next'),
				month = doc.getElementById('month');
		var today = doc.getElementById('today');

		bringList(yUl, 1900, 2050, '年');
		bringList(mUl, 1, 12, '月');
		bringCalendar(table, 5, 7);

		initDate(yShow, mShow);                    // 初始化日历显示
		retToday(today, yShow, mShow);             // 返回日历的今天
		monthNav(prev, next, yShow, mShow);        // 添加月份改变事件
		listSelected(yUl.children, yShow, mShow);    // 添加年份列表选择事件
		listSelected(mUl.children, yShow, mShow);    // 添加月份列表选择事件

		bindCurDayStatus(table);
	})();
});






