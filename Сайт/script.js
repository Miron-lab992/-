// Принудительная предзагрузка звука
const clickSound = document.getElementById('click-sound');
if (clickSound) {
    clickSound.load(); // Заставляем браузер загрузить файл в память
}
// --- 1. ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК ---
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; `i++`) {
        tabcontent[i].style.display = "none";
        tabcontent[i].classList.remove("active");
    }
    tablinks = document.getElementsByClassName("nav-btn");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    document.getElementById(tabName).style.display = "block";
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

// --- 2. МУЗЫКАЛЬНЫЙ ПЛЕЕР ---
let isPlaying = false;

function toggleMusic() {
    // Ищем элементы здесь, чтобы они точно были в HTML
    const audio = document.getElementById('bg-music');
    const playBtn = document.getElementById('play-btn');
    const statusText = document.getElementById('music-status');

    // Проверка на наличие элементов
    if (!audio || !playBtn || !statusText) {
        alert("Ошибка: Не найдены элементы плеера в HTML! Проверьте ID (bg-music, play-btn, music-status).");
        return;
    }

    if (!isPlaying) {
        audio.play().then(() => {
            isPlaying = true;
            playBtn.innerHTML = "⏸ ПАУЗА";
            statusText.innerHTML = "Играет...";
            statusText.classList.add("playing");
        }).catch(error => {
            alert("Ошибка: Не удалось воспроизвести музыку. Проверьте, что файл music.mp3 лежит в папке с сайтом.");
            console.error("Ошибка аудио:", error);
        });
    } else {
        audio.pause();
        isPlaying = false;
        playBtn.innerHTML = "▶ ИГРАТЬ МУЗЫКУ";
        statusText.innerHTML = "Выключено";
        statusText.classList.remove("playing");
    }
}
// --- СЧЕТЧИК ПОСЕЩЕНИЙ ---
document.addEventListener('DOMContentLoaded', () => {
    const counterElement = document.getElementById('visit-count');
    
    if (counterElement) {
        // Получаем текущее число из памяти браузера (или 0, если первый раз)
        let visits = localStorage.getItem('dreamusick_visits');
        
        if (visits === null) {
            visits = 0;
        } else {
            visits = parseInt(visits);
        }
        
        // Увеличиваем на 1 при каждом заходе
        visits += 1;
        
        // Сохраняем обратно в память
        localStorage.setItem('dreamusick_visits', visits);
        
        // Выводим число на экран
        counterElement.textContent = visits;
        
        // Небольшая анимация "прыжка" цифры
        setTimeout(() => {
            counterElement.classList.add('bump');
            setTimeout(() => counterElement.classList.remove('bump'), 300);
        }, 500);
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const counterElement = document.getElementById('visit-count');
    
    if (counterElement) {
        let visits = localStorage.getItem('dreamusick_visits');
        
        if (visits === null) {
            visits = 0;
        } else {
            visits = parseInt(visits);
        }
        
        visits += 1;
        localStorage.setItem('dreamusick_visits', visits);
        counterElement.textContent = visits;
        
        setTimeout(() => {
            counterElement.classList.add('bump');
            setTimeout(() => counterElement.classList.remove('bump'), 300);
        }, 500);
    }
});
// ==========================================
// 4. ЗВУК ПРИ НАЖАТИИ КНОПОК (БЕЗ ЗАДЕРЖКИ)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const clickSound = document.getElementById('click-sound');
    
    if (!clickSound) {
        console.warn("Аудио-элемент click-sound не найден!");
        return;
    }

    // 1. Принудительно загружаем звук в память заранее
    clickSound.load();
    clickSound.volume = 1.0; // Громкость (0.0 - 1.0)

    // 2. Находим все кнопки
    const allButtons = document.querySelectorAll('button, .social-link');
    
    allButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 3. Клонируем звук для каждого клика (мгновенное воспроизведение)
            const soundClone = clickSound.cloneNode();
            soundClone.volume = clickSound.volume;
            
            // 4. Воспроизводим клон
            soundClone.play().catch(() => {
                // Игнорируем ошибку, если браузер блокирует звук
            });
            
            // 5. Удаляем клон из памяти после завершения (чтобы не засорять)
            soundClone.onended = () => {
                soundClone.remove();
            };
        });
    });
});
// ==========================================
// 5. ЛЕТАЮЩИЕ ЧАСТИЦЫ (В стиле Minecraft)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    
    // Настройки
    const PARTICLE_COUNT = 50; // Количество частиц (можно увеличить для густоты)
    const COLORS = ['#55ff55', '#ffaa00', '#55ffff', '#ff55ff', '#ffffff']; // Цвета (изумруд, золото, алмаз, аметист, белый)
    const MIN_SIZE = 4; // Минимальный размер квадратика
    const MAX_SIZE = 10; // Максимальный размер квадратика
    const SPEED = 0.5; // Скорость полета (чем больше, тем быстрее)

    // Подгоняем размер холста под размер экрана
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Класс одной частицы
    class Particle {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height; // Начинаем с random позиции по высоте
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 100; // Появляются чуть ниже экрана
            this.size = Math.random() * (MAX_SIZE - MIN_SIZE) + MIN_SIZE;
            this.speedY = Math.random() * SPEED + 0.2; // Скорость полета вверх
            this.speedX = (Math.random() - 0.5) * 0.5; // Легкое покачивание влево-вправо
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            this.opacity = Math.random() * 0.5 + 0.3; // Прозрачность (0.3 - 0.8)
            this.fadeSpeed = Math.random() * 0.005 + 0.002; // Скорость исчезновения
        }

        update() {
            this.y -= this.speedY; // Летим вверх
            this.x += this.speedX; // Покачиваемся
            this.opacity -= this.fadeSpeed; // Медленно исчезаем

            // Если частица улетела вверх или стала невидимой — сбрасываем её вниз
            if (this.y < -20 || this.opacity <= 0) {
                this.reset();
            }
        }

        draw() {
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            // Рисуем квадрат (в стиле Minecraft)
            ctx.fillRect(this.x, this.y, this.size, this.size);
            ctx.globalAlpha = 1;
        }
    }

    // Создаем частицы
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    // Анимация
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем холст

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        requestAnimationFrame(animate); // Зацикливаем анимацию
    }

    animate();
});
// ==========================================
// 6. ЗАГРУЗОЧНЫЙ ЭКРАН
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingBar = document.getElementById('loading-bar');
    const loadingPercent = document.getElementById('loading-percent');

    if (!loadingScreen || !loadingBar || !loadingPercent) return;

    let progress = 0;
    const speed = Math.random() * 4 + 4; // Скорость загрузки (от 2 до 5%)

    // Функция обновления прогресса
    function updateProgress() {
        progress += speed;
        
        if (progress >= 100) {
            progress = 100;
            loadingBar.style.width = '100%';
            loadingPercent.textContent = '100%';
            
            // Небольшая задержка перед исчезновением, чтобы игрок увидел 100%
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                // Полностью удаляем из DOM через 1 секунду (после анимации)
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 1000);
            }, 500);
            
            return; // Останавливаем цикл
        }

        loadingBar.style.width = progress + '%';
        loadingPercent.textContent = Math.floor(progress) + '%';

        // Случайная задержка для эффекта "реальной загрузки"
        setTimeout(updateProgress, Math.random() * 200 + 50);
    }

    // Запускаем загрузку
    setTimeout(updateProgress, 300);
});