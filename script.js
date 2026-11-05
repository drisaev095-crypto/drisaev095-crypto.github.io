// --- 3. ОБРАБОТКА ФОРМЫ (БЕЗОПАСНАЯ ВЕРСИЯ ЧЕРЕЗ FORMSPREE) ---
const leadForm = document.getElementById('lead-form');
const customModal = document.getElementById('custom-modal');
const modalMessage = document.getElementById('modal-message');
const modalClose = document.getElementById('modal-close');

if (leadForm && customModal && modalMessage && modalClose) {
    
    // Вставьте сюда ВАШУ уникальную ссылку, которую выдал Formspree
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
                message: plainText // Formspree передаст этот текст в Telegram
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
