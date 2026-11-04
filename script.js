document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. МОБИЛЬНОЕ МЕНЮ ---
    const menuBtn = document.getElementById('menu-btn');
    const headerLinks = document.getElementById('header-links');

    if (menuBtn && headerLinks) {
        menuBtn.addEventListener('click', () => {
            const isOpen = headerLinks.classList.toggle('show');
            menuBtn.setAttribute('aria-expanded', isOpen);
        });
        headerLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                headerLinks.classList.remove('show');
                menuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // --- 2. МАСКА ТЕЛЕФОНА ---
    const phoneInput = document.getElementById('user-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', onPhoneInput);
        phoneInput.addEventListener('keydown', onPhoneKeyDown);
    }

    function getInputNumbersValue(input) { return input.value.replace(/\D/g, ''); }

    function onPhoneInput(e) {
        let input = e.target, inputNumbersValue = getInputNumbersValue(input);
        if (!inputNumbersValue) return input.value = "";
        
        if (["7", "8", "9"].indexOf(inputNumbersValue[0]) > -1) {
            if (inputNumbersValue[0] === "9") inputNumbersValue = "7" + inputNumbersValue;
            let firstSymbols = (inputNumbersValue[0] === "8") ? "8" : "+7";
            input.value = firstSymbols + " ";
            if (inputNumbersValue.length > 1) input.value += '(' + inputNumbersValue.substring(1, 4);
            if (inputNumbersValue.length >= 5) input.value += ') ' + inputNumbersValue.substring(4, 7);
            if (inputNumbersValue.length >= 8) input.value += '-' + inputNumbersValue.substring(7, 9);
            if (inputNumbersValue.length >= 10) input.value += '-' + inputNumbersValue.substring(9, 11);
        }
    }

    function onPhoneKeyDown(e) {
        if (e.key === "Backspace" && getInputNumbersValue(e.target).length <= 1) e.target.value = "";
    }

    // --- 3. ОБРАБОТКА ФОРМЫ (С ПОВЫШЕННОЙ БЕЗОПАСНОСТЬЮ) ---
    const leadForm = document.getElementById('lead-form');
    const customModal = document.getElementById('custom-modal');
    const modalMessage = document.getElementById('modal-message');
    const modalClose = document.getElementById('modal-close');

    if (leadForm && customModal && modalMessage && modalClose) {
        
        // --- СКРЫТИЕ ТОКЕНА TELEGRAM ---
        // Мы не пишем токен одной строкой. Мы собираем его из "пазла".
        // Это не 100% защита, но при беглом просмотре через F12 токен не бросается в глаза.
        const tgTokenPart1 = "9214931169:AAHO";
        const tgTokenPart2 = "pOxhpXBx2VtjSL";
        const tgTokenPart3 = "SGGW5cmMRed9A7REk";
        const telegramToken = tgTokenPart1 + tgTokenPart2 + tgTokenPart3;
        
        const chatId = "1045470986";
        const tgUrl = `https://api.telegram.org/bot${telegramToken}/sendMessage`;

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

            // Отправка в Telegram
            fetch(tgUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text: plainText, parse_mode: 'HTML' })
            })
            .then(res => {
                if (!res.ok) throw new Error(`Ошибка ${res.status}`);
                return res.json();
            })
            .then(data => {
                if (!data.ok) console.error("Telegram API:", data.description);
            })
            .catch(err => console.error("Сеть Telegram:", err));

            // Модальное окно
            modalMessage.innerHTML = `Спасибо за заявку, <b>${name}</b>!<br>Преподаватель школы «Точка.Ру» свяжется с вами по телефону <b>${phone}</b> в ближайшее время.<br><br><i>Нажмите кнопку ниже, чтобы открыть чат и продублировать заявку в наш WhatsApp.</i>`;
            customModal.classList.add('active');

            // WhatsApp
            modalClose.onclick = function() {
                customModal.classList.remove('active');
                const cleanPhone = "79298905846";
                const encodedText = encodeURIComponent(plainText);
                const waUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;
                window.open(waUrl, '_blank');
            };

            leadForm.reset();
        });

        // Закрытие модалки по клику на подложку или Escape
        customModal.addEventListener('click', (e) => { if (e.target === customModal) customModal.classList.remove('active'); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && customModal.classList.contains('active')) customModal.classList.remove('active'); });
    }
});