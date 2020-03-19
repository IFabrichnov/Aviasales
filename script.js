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


// вызовы функций
getData(citiesApi, (data) => {
  //получаем города и сохраняем их в массив city
  city = JSON.parse(data).filter(item => item.name);
});
