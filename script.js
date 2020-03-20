const formSearch = document.querySelector('.form-search'),
      inputCitiesFrom = document.querySelector('.input__cities-from'),
      dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
      inputCitiesTo = document.querySelector('.input__cities-to'),
      dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
      inputDateDepart = document.querySelector('.input__date-depart');


// данные
const citiesApi = 'database/cities.json',
      proxy = 'https://cors-anywhere.herokuapp.com/',
      API_KEY ='853c139c883e1864a947c2db64131e004',
      calendar = 'http://min-prices.aviasales.ru/calendar_preload';



let city = [];

//функция запроса API
const getData = (url, callback) => {
  //объект запроса
  const request = new XMLHttpRequest();

  request.open('GET', url);

  //обработчик события на полученный запрос
  request.addEventListener('readystatechange', () => {
    if (request.readyState !== 4) return;

    if (request.status === 200) {
      callback(request.response);
    } else {
      console.error(request.status);
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
      return  fixItem.includes(input.value.toLowerCase());
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
}

//функции рендеринга для вывода дешевых билетов
const renderCheapDay = (cheapTicket) => {
  console.log(cheapTicket);
};

const renderCheapYear = (cheapTickets) => {
  console.log(cheapTickets);
};

//функция которая будет рендерить рейсы
const renderCheap = (data, date) => {
  //получаем самые дешевые билеты
  const cheapTicketYear = JSON.parse(data).best_prices;

  // отфильтруем билеты на текущий день
  const cheapTicketDay = cheapTicketYear.filter((item)=>{
    return item.depart_date === date;
  });

  //рендерим полученные массивы и выводим их
  renderCheapDay(cheapTicketDay);
  renderCheapYear(cheapTicketYear);
};

//создаем метод, для отслеживания события в поле input Откуда
inputCitiesFrom.addEventListener('input', () => {
  showCity(inputCitiesFrom,dropdownCitiesFrom);
});

//событие клика на поле ul Откуда
dropdownCitiesFrom.addEventListener('click', (e) => {
  selectCity(e, inputCitiesFrom, dropdownCitiesFrom);
});

//создаем метод, для отслеживания события в поле input Куда
inputCitiesTo.addEventListener('input', () => {
  showCity(inputCitiesTo,dropdownCitiesTo);
});

//событие клика на поле ul Куда
dropdownCitiesTo.addEventListener('click', (e) => {
  selectCity(e, inputCitiesTo, dropdownCitiesTo);
});

//событие для отслеживания нажатия кнопки формы
formSearch.addEventListener('submit', (e) => {
  e.preventDefault();

  //переменные для получения города из массива
  const cityFrom = city.find((item)=> inputCitiesFrom.value === item.name);
  const cityTo = city.find((item)=> inputCitiesTo.value === item.name);

  //объект для получения кодов городов отправки, прибытия и даты
  const formData = {
    from: cityFrom.code,
    to: cityTo.code,
    when: inputDateDepart.value
  }

  //создаем строчку запроса на сервер
  const requestData = `?depart_date=${formData.when}&origin=${formData.from}`+
    `&destination=${formData.to}&one_way=true`;

  //делаем запрос и в колбеке пишем функцию использаную выше
  getData( calendar + requestData, (response) => {
    renderCheap(response, formData.when);
  });
});

// вызовы функций
getData(citiesApi, (data) => {
  //получаем города и сохраняем их в массив city
  city = JSON.parse(data).filter(item => item.name);
});


