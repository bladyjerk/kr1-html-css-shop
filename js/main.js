// Получаем модальное окно по id.
const orderDialog = document.getElementById('order-dialog');

// Получаем все кнопки заказа в карточках товаров (БЭМ-элемент product-card__button).
const orderButtons = document.querySelectorAll('.product-card__button');

// Получаем кнопку закрытия модального окна.
const closeDialogButton = document.getElementById('close-order-dialog');

// Получаем скрытое поле, в которое будет записан выбранный товар.
const selectedProductInput = document.getElementById('selected-product');

// Получаем форму заявки и сообщение об успешной отправке.
const orderForm = document.getElementById('order-form');
const successMessage = document.getElementById('success-message');

// Модальное окно есть не на всех страницах (например, его нет на contacts.html).
if (orderDialog && orderForm) {
  // Перебираем все кнопки «Заказать».
  orderButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // Получаем название товара из data-атрибута
      // и записываем его в скрытое поле формы.
      selectedProductInput.value = button.dataset.product;

      // Открываем модальное окно.
      orderDialog.showModal();
    });
  });

  // Закрываем модальное окно по кнопке «Закрыть».
  closeDialogButton.addEventListener('click', () => {
    orderDialog.close();
  });

  // Возвращает БЭМ-модификатор ошибки для поля формы,
  // например order-form__input → order-form__input--error.
  const getErrorClass = (element) => {
    const elementClass = Array.from(element.classList)
      .find((className) => className.startsWith('order-form__') && !className.includes('--'));

    return elementClass ? `${elementClass}--error` : null;
  };

  // Обрабатываем отправку формы.
  orderForm.addEventListener('submit', (event) => {
    // Отменяем стандартную отправку формы,
    // потому что backend пока не подключён.
    event.preventDefault();

    const formElements = Array.from(orderForm.elements).filter((element) => element.willValidate);

    // Сбрасываем предыдущие признаки ошибок.
    formElements.forEach((element) => {
      element.removeAttribute('aria-invalid');

      const errorClass = getErrorClass(element);
      if (errorClass) {
        element.classList.remove(errorClass);
      }
    });

    // Проверяем встроенные HTML-ограничения формы.
    if (!orderForm.checkValidity()) {
      formElements.forEach((element) => {
        if (!element.checkValidity()) {
          element.setAttribute('aria-invalid', 'true');

          const errorClass = getErrorClass(element);
          if (errorClass) {
            element.classList.add(errorClass);
          }
        }
      });

      // Показываем стандартные сообщения браузера.
      orderForm.reportValidity();
      return;
    }

    // Показываем сообщение об успешной отправке.
    if (successMessage) {
      successMessage.hidden = false;
    }

    // Очищаем форму и закрываем модальное окно.
    orderForm.reset();
    orderDialog.close();
  });
}
