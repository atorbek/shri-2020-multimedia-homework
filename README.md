# Мультимедия

Техническое задание - [инструкция](server/TZ.md)

## Запуск
- Установить зависимости `npm i`
- Поднять приложение через `npm start`

# Отчет

Выполнено 3 пункта:

- Интерфейс страницы "Видеонаблюдение". Добавил сетку, панель управления и логику открытия/закрытия видео.
- Фильтры для видео. Для яркости и контрастности использовал css атрибут `filter`.
- Анализатор звука. Сделано через Web Audio Api. Для планирования обновления анимации `Analyser`
использовал метод `requestAnimationFrame`.

Тестирование проводилось в `Chrome version 80.0.3987.149` и на `IOS`.
Бонусное задание очень интересное, но из-за дедлайна к нему не приступил.