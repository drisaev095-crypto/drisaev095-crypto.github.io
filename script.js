    // --- 3. ОБРАБОТКА ФОРМЫ (БЕЗОПАСНАЯ ВЕРСИЯ ЧЕРЕЗ FORMSPREE) ---
    const leadForm = document.getElementById('lead-form');
    const customModal = document.getElementById('custom-modal');
    const modalMessage = document.getElementById('modal-message');
    const modalClose = document.getElementById('modal-close');

    if (leadForm && customModal && modalMessage && modalClose) {
        
        // Ваша защищенная ссылка Formspree без открытых токенов
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

            // Отправка данных на Formspree (оттуда они автоматически улетят вам в Telegram/WhatsApp)
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
            .then(data => {
                console.log("Успешно отправлено через Formspree");
            })
            .catch(err => console.error("Ошибка сети Formspree:", err));

            // Изменяем текст в окне на скромный и вежливый, как вы просили
            modalMessage.innerHTML = `
                Спасибо за заявку, <b>${name}</b>!<br><br>
                Ваша заявка принята.<br>
                Пожалуйста, дождитесь ответа преподавателя.
            `;

            // Кнопка просто закрывает окно
            modalClose.onclick = function() {
                customModal.classList.remove('active');
            };

            // Открываем модальное окно на экране
            customModal.classList.add('active');

            // Очищаем поля формы
            leadForm.reset();
        });

        // Закрытие модалки по клику на серый фон или клавишу Escape
        customModal.addEventListener('click', (e) => { if (e.target === customModal) customModal.classList.remove('active'); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && customModal.classList.contains('active')) customModal.classList.remove('active'); });
    }
});
