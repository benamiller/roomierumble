document.addEventListener('DOMContentLoaded', function() {
    const dateTimeElements = document.querySelectorAll('.local-event-datetime');
    dateTimeElements.forEach(el => {
        const year = parseInt(el.dataset.year);
        const month = parseInt(el.dataset.month);
        const day = parseInt(el.dataset.day);
        const hourInOriginalTZ = parseInt(el.dataset.hour);
        const minute = parseInt(el.dataset.minute);
        const originalTZ = el.dataset.timezone;
        let hourUTC = hourInOriginalTZ;

        if (originalTZ === 'America/Los_Angeles') {
            hourUTC = hourInOriginalTZ + 7;
        }

        try {
            const eventDate = new Date(Date.UTC(year, month, day, hourUTC, minute));
            const dateTimeOptions = {
                weekday: 'short',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                timeZoneName: 'short'
            };
            el.textContent = eventDate.toLocaleString(undefined, dateTimeOptions);
        } catch (e) {
            const minuteString = String(minute).padStart(2, '0');
            const fallbackDate = new Date(year, month, day);
            const dateDisplayOptions = { month: 'long', day: 'numeric', year: 'numeric' };
            el.textContent = `${fallbackDate.toLocaleDateString(undefined, dateDisplayOptions)} at ${hourInOriginalTZ}:${minuteString} ${originalTZ.replace('_', ' ')} (Check Google Calendar for your local time)`;
        }
    });

    function setupContentSwitcher(config) {
        const contentArea = document.querySelector(config.contentAreaSelector);
        const cards = Array.from(contentArea.querySelectorAll(config.cardSelector));
        const prevButton = document.querySelector(config.prevButtonSelector);
        const nextButton = document.querySelector(config.nextButtonSelector);
        const controlsContainer = document.querySelector(config.controlsSelector);
        
        if (!contentArea || cards.length === 0 || !controlsContainer) {
            if(controlsContainer) controlsContainer.style.display = 'none';
            return;
        }

        let currentIndex = 0;
        let isMobile = window.innerWidth <= 768;
        const animationDuration = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--animation-duration') || '0.4') * 1000;

        function showCard(indexToShow) {
            const currentCard = cards[currentIndex];
            const nextCard = cards[indexToShow];

            if (currentCard && currentCard !== nextCard) {
                currentCard.classList.add('card-content-fade-out');
                currentCard.addEventListener('animationend', function onHide() {
                    this.style.display = 'none';
                    this.classList.remove('card-content-fade-out');
                    this.classList.remove('active-card');
                    this.removeEventListener('animationend', onHide);

                    if (nextCard) {
                        nextCard.style.opacity = '0';
                        nextCard.style.display = 'flex';
                        nextCard.classList.add('active-card');
                        nextCard.classList.add('card-content-fade-in');
                        nextCard.addEventListener('animationend', function onShow() {
                            this.classList.remove('card-content-fade-in');
                            this.style.opacity = '1';
                            this.removeEventListener('animationend', onShow);
                        }, { once: true });
                    }
                }, { once: true });
            } else if (nextCard) {
                cards.forEach(c => { 
                    c.style.display = 'none'; 
                    c.classList.remove('active-card');
                    c.classList.remove('card-content-fade-in');
                    c.classList.remove('card-content-fade-out');
                });
                nextCard.style.opacity = '0';
                nextCard.style.display = 'flex';
                nextCard.classList.add('active-card');
                nextCard.classList.add('card-content-fade-in');
                 nextCard.addEventListener('animationend', function onShowInitial() {
                    this.classList.remove('card-content-fade-in');
                    this.style.opacity = '1';
                    this.removeEventListener('animationend', onShowInitial);
                }, { once: true });
            }
            
            currentIndex = indexToShow;
            if (prevButton) prevButton.disabled = currentIndex === 0;
            if (nextButton) nextButton.disabled = currentIndex === cards.length - 1;
        }


        function handleResize() {
            const currentlyMobile = window.innerWidth <= 768;
            isMobile = currentlyMobile;

            if (isMobile) {
                controlsContainer.style.display = 'flex';
                contentArea.classList.add('mobile-view');
                cards.forEach((card, i) => {
                    if (i === currentIndex) {
                        card.style.display = 'flex';
                        card.classList.add('active-card');
                        card.style.opacity = '1'; 
                    } else {
                        card.style.display = 'none';
                        card.classList.remove('active-card');
                        card.style.opacity = '0';
                    }
                });
                showCard(currentIndex); 
            } else {
                controlsContainer.style.display = 'none';
                contentArea.classList.remove('mobile-view');
                cards.forEach(card => {
                    card.style.display = 'flex'; 
                    card.classList.remove('active-card');
                    card.style.opacity = '1';
                    card.classList.remove('card-content-fade-in');
                    card.classList.remove('card-content-fade-out');
                });
            }
        }
        
        handleResize(); 

        if (prevButton && nextButton) {
            prevButton.addEventListener('click', () => {
                if (currentIndex > 0) {
                    showCard(currentIndex - 1);
                }
            });
            nextButton.addEventListener('click', () => {
                if (currentIndex < cards.length - 1) {
                    showCard(currentIndex + 1);
                }
            });
        }
        window.addEventListener('resize', handleResize);
    }

    setupContentSwitcher({
        id: 'teams',
        contentAreaSelector: '#teams .teams-content-area',
        cardSelector: '#teams .team-card',
        prevButtonSelector: '#teams .prev-team',
        nextButtonSelector: '#teams .next-team',
        controlsSelector: '#teams .teams-controls'
    });

    setupContentSwitcher({
        id: 'format',
        contentAreaSelector: '#format .format-content-area',
        cardSelector: '#format .format-card',
        prevButtonSelector: '#format .prev-format',
        nextButtonSelector: '#format .next-format',
        controlsSelector: '#format .format-controls'
    });

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        if (el) {
             observer.observe(el);
        }
    });
});
