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

    // --- 3. ОБРАБОТКА ФОРМЫ (БЕЗОПАСНАЯ ВЕРСИЯ ЧЕРЕЗ FORMSPREE) ---
    const leadForm = document.getElementById('lead-form');
    const customModal = document.getElementById('custom-modal');
    const modalMessage = document.getElementById('modal-message');
    const modalClose = document.getElementById('modal-close');

    if (leadForm && customModal && modalMessage && modalClose) {
        
        // Ваша защищенная ссылка Formspree без токенов
        const formspreeUrl = "https://formspree.io";

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
            .then(data => {
                console.log("Успешно отправлено через Formspree");
            })
            .catch(err => console.error("Ошибка сети:", err));

            // Модальное окно
            modalMessage.innerHTML = `Спасибо за заявку, <b>${name}</b>!<br>Преподаватель школы «Точка.Ру» свяжется с вами по телефону <b>${phone}</b> в ближайшее время.<br><br><i>Нажмите кнопку ниже, чтобы открыть чат и продублировать заявку в наш WhatsApp.</i>`;
            customModal.classList.add('active');

            // WhatsApp
            modalClose.onclick = function() {
                customModal.classList.remove('active');
                const cleanPhone = "79298905846";
                const encodedText = encodeURIComponent(plainText);
                const waUrl = `https://wa.me{cleanPhone}?text=${encodedText}`;
                window.open(waUrl, '_blank');
            };

            leadForm.reset();
        });

        customModal.addEventListener('click', (e) => { if (e.target === customModal) customModal.classList.remove('active'); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && customModal.classList.contains('active')) customModal.classList.remove('active'); });
    }
});
