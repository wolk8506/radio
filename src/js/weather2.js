function weatherW(data) {
  const week = data.forecast.forecastday
    .map(i => {
      // **************************************************************************
      const {
        avghumidity = i.day.avghumidity,
        avgtemp_c = i.day.avgtemp_c,
        maxtemp_c = i.day.maxtemp_c,
        mintemp_c = i.day.mintemp_c,
        icon = i.day.condition.icon,
        conditionText = i.day.condition.text,
        daily_will_it_rain = i.day.daily_will_it_rain,
        daily_chance_of_rain = i.day.daily_chance_of_rain,
        daily_will_it_snow = i.day.daily_will_it_snow,
        daily_chance_of_snow = i.day.daily_chance_of_snow,
      } = i;
      const dayAndMonth = new Date(
        i.date.split('-').join(', ')
      ).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      });
      let precipitation = 0;
      if (daily_will_it_rain == 1) {
        precipitation = daily_chance_of_rain;
      } else if (daily_will_it_snow == 1) {
        precipitation = daily_chance_of_snow;
      } else precipitation = 0;
      // ****************************************************************************

      return `<ul class="panel-weather-day">
        <li class="week-first-item"><p><svg class="icon-calendar" width="20" height="20">
          <use href="${sprite}#icon-calendar"></use>
        </svg>${dayAndMonth}</p><div class="week-humidity">
        <li class="condition-text">${conditionText}</li>
        <li class="condition-week"> <p>${avgtemp_c}°C</p><img src='${icon}'></li>
        <li> <p>max t: ${maxtemp_c}°C</p></li>
        <li> <p>min t: ${mintemp_c}°C</p></li>
        <!-- <li> <p>Будет дождь: ${daily_will_it_rain}</p></li> -->
        <li> <p class="month-precipitation">Вероятность осадков: ${precipitation}%</p></li>
        <!-- <li> <p>Будет снег ${daily_will_it_snow}%</p></li> -->
        <!-- <li> <p>Вероятность снега ${daily_chance_of_snow}</p></li> -->
        <li class="condition-block-item">
            <svg width="32" height="32">
              <use href="${sprite}#icon-umbrella"></use></svg
          >${i.day.totalprecip_mm} мм
        </li>

          <p class="condition-block-item">
            <svg width="32" height="32">
              <use href="${sprite}#icon-clouds"></use>
            </svg>
            ${i.day.maxtemp_c} %
          </p>
          <p class="condition-block-item">
            <svg width="32" height="32">
              <use href="${sprite}#icon-eye3"></use>
            </svg>
            ${i.day.avgvis_km} км
          </p>
          <p class="condition-block-item">
            <svg width="32" height="32">
              <use href="${sprite}#icon-raindrop1"></use>
            </svg>
            ${avghumidity} %
          </p>
    </ul>`;
    })
    .join('');
  // weatherDayTest = week;
}
