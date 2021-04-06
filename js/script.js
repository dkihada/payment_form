let currentTab = 0; // Текущая вкладка устанавливается как первая вкладка (0)
showTab(currentTab); // Отображаем текущую вкладку

function showTab(n) {
  // Эта функция отобразит указанную вкладку формы ...

  let tab = document.querySelectorAll(".form__page");
    // top = document.querySelectorAll('.form__top'),

    tab[n].style.display = "block";

    if (n == (tab.length)) {
        tab[n].style.display = 'none';
    }

    //   ... и запускаем функцию, которая отображает правильный индикатор шага:
    fixStepIndicator(n);
}

function secondTab(n) {
    // Эта функция определит, какую вкладку отображать
    let x = document.getElementsByClassName("form__page"),
        info = document.querySelector('._active-info'),
		btn = document.querySelectorAll('.form__button');
    // Выйдите из функции, если какое-либо поле в текущей вкладке недействительно:
    if (n == 1 && !validateForm()) return false;
    // Скрыть текущую вкладку:
    x[currentTab].style.display = "none";
    
    // Увеличить или уменьшить текущую вкладку на 1:
    currentTab = currentTab + n;
    // если вы дошли до конца формы ...
    if (currentTab >= x.length) {
      // ... форма отправляется:
        info.classList.remove('_active-info');
        document.querySelector('.form__thanks').style.display = 'block';
		// Задержка отправки формы, чтобы поблагодарить пользователя
		setTimeout(() =>{
			document.querySelector("#form").submit();
		}, 2000);
        return false;
    }
    // В противном случае отобразите правильную вкладку:
    showTab(currentTab);
  }

function validateForm() {
  // Эта функция занимается проверкой полей формы
  let tab, y, i, valid = true;

    tab = document.querySelectorAll(".form__page");
    y = tab[currentTab].querySelectorAll("._req");

  // Цикл, который проверяет каждое поле ввода на текущей вкладке:

  for (i = 0; i < y.length; i++) {
    // Если поле пустое ...
    if (y[i].value == "") {
      // добавляем в поле "недопустимый" класс:
      y[i].className += " _error";
      // и установим текущий действительный статус на false:
      valid = false;
    } else {
        y[i].classList.remove("_error");
    }
  }

  // Если действительный статус - истина, помечаем шаг как завершенный и действительный:
  return valid; // возвращаем действительный статус
}

function fixStepIndicator(n) {
  // Эта функция удаляет "активный" класс всех шагов ...
  let i, x = document.querySelectorAll(".form__top");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" _active-top", "");
  }
  // ... и добавляем "активный" класс к текущему шагу:
  x[n].className += " _active-top";
}

// Маска для ввода данных платежной карты

let ccNumberInput = document.querySelector('._number'),
		ccNumberPattern = /^\d{0,16}$/g,
		ccNumberSeparator = " ",
		ccNumberInputOldValue,
		ccNumberInputOldCursor,
		
		ccExpiryInput = document.querySelector('._validity'),
		ccExpiryPattern = /^\d{0,4}$/g,
		ccExpirySeparator = "/",
		ccExpiryInputOldValue,
		ccExpiryInputOldCursor,
		
		ccCVCInput = document.querySelector('._cvv'),
		ccCVCPattern = /^\d{0,3}$/g,
		
		mask = (value, limit, separator) => {
			var output = [];
			for (let i = 0; i < value.length; i++) {
				if ( i !== 0 && i % limit === 0) {
					output.push(separator);
				}
				
				output.push(value[i]);
			}
			
			return output.join("");
		},
		unmask = (value) => value.replace(/[^\d]/g, ''),
		checkSeparator = (position, interval) => Math.floor(position / (interval + 1)),
		ccNumberInputKeyDownHandler = (e) => {
			let el = e.target;
			ccNumberInputOldValue = el.value;
			ccNumberInputOldCursor = el.selectionEnd;
		},
		ccNumberInputInputHandler = (e) => {
			let el = e.target,
					newValue = unmask(el.value),
					newCursorPosition;
			
			if ( newValue.match(ccNumberPattern) ) {
				newValue = mask(newValue, 4, ccNumberSeparator);
				
				newCursorPosition = 
					ccNumberInputOldCursor - checkSeparator(ccNumberInputOldCursor, 4) + 
					checkSeparator(ccNumberInputOldCursor + (newValue.length - ccNumberInputOldValue.length), 4) + 
					(unmask(newValue).length - unmask(ccNumberInputOldValue).length);
				
				el.value = (newValue !== "") ? newValue : "";
			} else {
				el.value = ccNumberInputOldValue;
				newCursorPosition = ccNumberInputOldCursor;
			}
			
			el.setSelectionRange(newCursorPosition, newCursorPosition);
			
			highlightCC(el.value);
		},
		highlightCC = (ccValue) => {
			let ccCardType = '',
					ccCardTypePatterns = {
						amex: /^3/,
						visa: /^4/,
						mastercard: /^5/,
						disc: /^6/,
						
						genric: /(^1|^2|^7|^8|^9|^0)/,
					};
			
			for (const cardType in ccCardTypePatterns) {
				if ( ccCardTypePatterns[cardType].test(ccValue) ) {
					ccCardType = cardType;
					break;
				}
			}
		},
		ccExpiryInputKeyDownHandler = (e) => {
			let el = e.target;
			ccExpiryInputOldValue = el.value;
			ccExpiryInputOldCursor = el.selectionEnd;
		},
		ccExpiryInputInputHandler = (e) => {
			let el = e.target,
					newValue = el.value;
			
			newValue = unmask(newValue);
			if ( newValue.match(ccExpiryPattern) ) {
				newValue = mask(newValue, 2, ccExpirySeparator);
				el.value = newValue;
			} else {
				el.value = ccExpiryInputOldValue;
			}
		};

ccNumberInput.addEventListener('keydown', ccNumberInputKeyDownHandler);
ccNumberInput.addEventListener('input', ccNumberInputInputHandler);

ccExpiryInput.addEventListener('keydown', ccExpiryInputKeyDownHandler);
ccExpiryInput.addEventListener('input', ccExpiryInputInputHandler);