// ... [Оставляю весь ваш код до обработки формы]

if (leadForm && customModal && modalMessage && modalClose) {
    // ВАША ЗАЩИЩЕННАЯ ССЫЛКА FORMSPREE БЕЗ ТОКЕНОВ
    const formspreeUrl = "https://formspree.io/f/mdeebbek";

    leadForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('user-name').value.trim();
        const phone = phoneInput.value;
        const cleanPhoneDigits = phone.replace(/\D/g, '');

        if (cleanPhoneDigits.length < 11) {
            alert('Пожалуйста, введите номер телефона полностью.');
            return;
        }

        const plainText = `Заявка со школы Точка.Ру! Имя: ${name}, Телефон: ${phone}`;

        // Отправка данных на Formspree
        fetch(formspreeUrl, {
            method: 'POST',
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ 
                name: name, 
                phone: phone,
                message: plainText
            })
        })
        .then(res => {
            if (!res.ok) throw new Error(`Ошибка отправки: ${res.status}`);
            return res.json();
        })
        .catch(err => console.error("Ошибка сети:", err));

        // Модальное окно
        modalMessage.innerHTML = `
            Спасибо за заявку, <b>${name}</b>!<br>
            Преподаватель школы «Точка.Ру» свяжется с вами по телефону <b>${phone}</b> в ближайшее время.<br><br>
    
        `;

        // Убираем открытие WhatsApp при закрытии модалки
        modalClose.onclick = function() {...} // Этот кусок закомментирован!

        // Добавляем отдельную кнопку для WhatsApp внутри модалки
        let waButton = document.createElement('button');
        waButton.textContent = 'Отлично';
        waButton.style.display = 'block'; // Стиль для наглядности
        waButton.onclick = () => {
            const cleanPhone = "79298905846"; // Номер должен быть без пробелов и плюса
            const encodedText = encodeURIComponent(plainText);
            window.open(`https://wa.me/${cleanPhone}?text=${encodedText}`, '_blank');
        };

        modalMessage.appendChild(waButton); // Вставим её прямо в текст благодарности
        customModal.classList.add('active');

        leadForm.reset();
    });

    // Закрытие модалки осталось прежним
}
