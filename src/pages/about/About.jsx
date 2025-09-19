export default function About() {
    return (
        <div className="container py-5">
            <h1 className="display-4 text-center mb-4">О нас</h1>
            <p className="lead text-center">
                Наш проєкт створено в рамках курсу <strong>React.js</strong>.  
                Ми вивчаємо сучасні технології веб-розробки та на практиці реалізуємо  
                онлайн-платформу з маршрутизацією, компонентами та адаптивним інтерфейсом.
            </p>

            <p className="text-center">
                Мета проєкту — закріпити навички роботи з React, навчитися структурувати код,  
                працювати з компонентами, роутером і стилями, а також створювати повноцінні  
                односторінкові застосунки (SPA).
            </p>

            <hr className="my-4" />

            <h2 className="h4 text-center mb-3">Контакти</h2>
            <ul className="list-unstyled text-center">
                <li>📧 Email: <a href="mailto:info@react-course.com">info@react-course.com</a></li>
                <li>📞 Телефон: <a href="tel:380671234567">+38 (067) 123-45-67</a></li>
            </ul>
        </div>
    );
}
