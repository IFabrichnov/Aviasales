const formSearch = document.querySelector('.form-search'),
      inputCitiesFrom = document.querySelector('.input__cities-from'),
      dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
      inputCitiesTo = document.querySelector('.input__cities-to'),
      dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
      inputDateDepart = document.querySelector('.input__date-depart');


// создаем список городов
const city = ['Москва', 'Санкт-Петербург', 'Минск', 'Чебоксары',
      'Самара', 'Волгоград', 'Калининград', 'Одесса', 'Нижний Новгород',
      'Прага', 'Ухань', 'Ростов'];

//создаем функцию для input'ов
const showCity = (input, list) => {
  list.textContent = ''; // затираем все, что было в данном ul

  //чтобы все города не выводились, когда ничего не ввел в input
  if (input.value !== '') {
    const filterCity = city.filter((item) => {
      const fixItem = item.toLowerCase(); //делаем города из массива с маленькой буквы
      return  fixItem.includes(input.value.toLowerCase());
    });

    //Добавление городов в input при написании буквы
    filterCity.forEach((item) => {
      const li = document.createElement('li');
      li.classList.add('dropdown__city');
      li.textContent = item; // прописываем в лишки города
      list.append(li);
    });
  }
};

//создаем метод, для отслеживания события в поле input Откуда
inputCitiesFrom.addEventListener('input', () => {
  showCity(inputCitiesFrom,dropdownCitiesFrom);
});

//событие клика на поле ul Откуда
dropdownCitiesFrom.addEventListener('click', (e) => {
  const target = e.target;
  //при клике на город, он появлялся в input
  if (target.tagName.toLowerCase() === 'li') {
    inputCitiesFrom.value = target.textContent;
    dropdownCitiesFrom.textContent = '';
  }
});

//создаем метод, для отслеживания события в поле input Куда
inputCitiesTo.addEventListener('input', () => {
  showCity(inputCitiesTo,dropdownCitiesTo);
});

//событие клика на поле ul Куда
dropdownCitiesTo.addEventListener('click', (e) => {
  const target = e.target;
  //при клике на город, он появлялся в input
  if (target.tagName.toLowerCase() === 'li') {
    inputCitiesTo.value = target.textContent;
    dropdownCitiesTo.textContent = '';
  }
});