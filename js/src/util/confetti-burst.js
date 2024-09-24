import confetti from 'canvas-confetti';

export const confettiBurst = () => {
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0, disableForReducedMotion: true };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        document.querySelectorAll('main').forEach(main => {
            main.classList.add('z-0');
        });

        if (timeLeft <= 0) {
            clearInterval(interval);

            document.querySelectorAll('main').forEach(main => {
                main.classList.remove('z-0');
            });

            return;
        }

        const particleCount = 50 * (timeLeft / duration);

        // since particles fall down, start a bit higher than random
        // eslint-disable-next-line object-shorthand
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        // eslint-disable-next-line object-shorthand
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
};
