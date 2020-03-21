const formSearch = document.querySelector('.form-search'),
  inputCitiesFrom = document.querySelector('.input__cities-from'),
  dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
  inputCitiesTo = document.querySelector('.input__cities-to'),
  dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
  inputDateDepart = document.querySelector('.input__date-depart'),
  cheapestTicket = document.getElementById('cheapest-ticket'),
  otherCheapTickets = document.getElementById('other-cheap-tickets');


// данные
const citiesApi = 'http://api.travelpayouts.com/data/ru/cities.json',
  proxy = 'https://cors-anywhere.herokuapp.com/',
  API_KEY = '853c139c883e1864a947c2db64131e004',
  calendar = 'http://min-prices.aviasales.ru/calendar_preload',
  MAX_COUNT = 10; //количество карточек которые выводятся на экран


let city = [];

//функция запроса API
const getData = (url, callback, reject = console.error) => {
  //объект запроса
  const request = new XMLHttpRequest();

  request.open('GET', url);

  //обработчик события на полученный запрос
  request.addEventListener('readystatechange', () => {
    if (request.readyState !== 4) return;

    if (request.status === 200) {
      callback(request.response);
    } else {
      reject(request.status);
    }
  });

  request.send();
};

//создаем функцию для input'ов
const showCity = (input, list) => {
  list.textContent = ''; // затираем все, что было в данном ul

  //чтобы все города не выводились, когда ничего не ввел в input
  if (input.value !== '') {
    const filterCity = city.filter((item) => {
      //создаем условие, чтобы избежать название городов null
      const fixItem = item.name.toLowerCase(); //делаем города из массива с маленькой буквы
      return fixItem.startsWith(input.value.toLowerCase());
    });

    //Добавление городов в input при написании буквы
    filterCity.forEach((item) => {
      const li = document.createElement('li');
      li.classList.add('dropdown__city');
      li.textContent = item.name; // прописываем в лишки города
      list.append(li);
    });
  }
};

//функция для клика по полю ul
const selectCity = (e, input, list) => {
  const target = e.target;
  //при клике на город, он появлялся в input
  if (target.tagName.toLowerCase() === 'li') {
    input.value = target.textContent;
    list.textContent = '';
  }
};

//функция Для вывода верного города
const getNameCity = (code) => {
  const objCity = city.find((item) => item.code === code);
  return objCity.name;
};

//функция для вывода правильной даты
const getDate = (date) => {
  return new Date(date).toLocaleDateString('ru', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

//функция для учета пересадок
const getChanges = (num) => {
  if (num) {
    return num === 1 ? 'С одной пересадкой' : 'С двумя пересадками';
  } else {
    return 'Без пересадок';
  }
};

//функция правильного линка на авиасейлс при нажатии на кнопку
const getLinkAviasales = (data) => {
  let link = 'https://www.aviasales.ru/search/';

  link += data.origin;

  const date = new Date(data.depart_date);
  const day = date.getDate();

  link += day < 10 ? '0' + day : day ;

  const month = date.getMonth() + 1;

  link += month < 10 ? '0' + month : month ;

  link += data.destination;

  link += '1';
  return link;
};

//создание карточек дешевых билетов
const createCard = (data) => {
  const ticket = document.createElement('article');
  ticket.classList.add('ticket');

  let deep = '';

  if (data) {
    deep = `
    <h3 class="agent">${data.gate}</h3>
        <div class="ticket__wrapper">
            <div class="left-side">
                <a href="${getLinkAviasales(data)}" target="_blank" class="button button__buy">Купить
                за ${data.value}₽</a>
            </div>
            <div class="right-side">
                <div class="block-left">
                    <div class="city__from">Вылет из города
                    <span class="city__name">${getNameCity(data.origin)}</span>
                </div>
                <div class="date">${getDate(data.depart_date)}</div>
            </div>

            <div class="block-right">
                <div class="changes">${getChanges(data.number_of_changes)}</div>
                <div class="city__to">Город назначения:
                    <span class="city__name">${getNameCity(data.destination)}</span>
                </div>
            </div>
          </div>
      </div>
    `;
  } else {
    deep = '<h3>К сожалению на текущую дату билетов нет.</h3>'
  }
  //вставка в верстку после начала
  ticket.insertAdjacentHTML('afterbegin', deep);

  return ticket;
};

//функции рендеринга для вывода дешевых билетов
const renderCheapDay = (cheapTicket) => {
  cheapestTicket.style.display = 'block';
  cheapestTicket.innerHTML= '<h2>Самый дешевый билет на выбранную дату</h2>';

  const ticket = createCard(cheapTicket[0]);
  cheapestTicket.append(ticket);
};

const renderCheapYear = (cheapTickets) => {
  otherCheapTickets.style.display = 'block';
  otherCheapTickets.innerHTML = '<h2>Самые дешевые билеты на другие даты</h2>';

  cheapTickets.sort((a, b) => a.value - b.value);
  //условие для вывода карточек с полетами
  for (let i = 0; i < cheapTickets.length && i < MAX_COUNT; i++) {
    const ticket = createCard(cheapTickets[i]);
    otherCheapTickets.append(ticket);
  }

  console.log(cheapTickets);
};

//функция которая будет рендерить рейсы
const renderCheap = (data, date) => {
  //получаем самые дешевые билеты
  const cheapTicketYear = JSON.parse(data).best_prices;

  // отфильтруем билеты на текущий день
  const cheapTicketDay = cheapTicketYear.filter((item) => {
    return item.depart_date === date;
  });

  //рендерим полученные массивы и выводим их
  renderCheapDay(cheapTicketDay);
  renderCheapYear(cheapTicketYear);
};

//создаем метод, для отслеживания события в поле input Откуда
inputCitiesFrom.addEventListener('input', () => {
  showCity(inputCitiesFrom, dropdownCitiesFrom);
});

//событие клика на поле ul Откуда
dropdownCitiesFrom.addEventListener('click', (e) => {
  selectCity(e, inputCitiesFrom, dropdownCitiesFrom);
});

//создаем метод, для отслеживания события в поле input Куда
inputCitiesTo.addEventListener('input', () => {
  showCity(inputCitiesTo, dropdownCitiesTo);
});

//событие клика на поле ul Куда
dropdownCitiesTo.addEventListener('click', (e) => {
  selectCity(e, inputCitiesTo, dropdownCitiesTo);
});

//событие для отслеживания нажатия кнопки формы
formSearch.addEventListener('submit', (e) => {
  e.preventDefault();

  //переменные для получения города из массива
  const cityFrom = city.find((item) => inputCitiesFrom.value === item.name);
  const cityTo = city.find((item) => inputCitiesTo.value === item.name);

  //объект для получения кодов городов отправки, прибытия и даты
  const formData = {
    from: cityFrom,
    to: cityTo,
    when: inputDateDepart.value
  }

  //делаем проверку, правильно ли введены данные городов
  if (formData.from && formData.to) {
    //создаем строчку запроса на сервер
    const requestData = `?depart_date=${formData.when}&origin=${formData.from.code}` +
      `&destination=${formData.to.code}&one_way=true`;

    //делаем запрос и в колбеке пишем функцию использаную выше
    getData(calendar + requestData, (response) => {
      renderCheap(response, formData.when);
    }, (e) => {
      alert('В этом направлении нет рейсов.');});
  } else {
    alert('Введите правильное название города.');
  }

});

// вызовы функций
getData(proxy + citiesApi, (data) => {
  //получаем города и сохраняем их в массив city
  city = JSON.parse(data).filter(item => item.name);
  //сортировка городов по алфавиту
  city.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    if (a.name < b.name) {
      return -1;
    }
    return 0;
  });
});


