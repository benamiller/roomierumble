document.addEventListener('DOMContentLoaded', function() {
    const dateTimeElements = document.querySelectorAll('.local-event-datetime');
    dateTimeElements.forEach(el => {
	try {
	    const year = parseInt(el.dataset.year);
	    const month = parseInt(el.dataset.month);
	    const day = parseInt(el.dataset.day);
	    const hour = parseInt(el.dataset.hour);
	    const minute = parseInt(el.dataset.minute);

	    const ampm = hour >= 12 ? 'PM' : 'AM';
	    let displayHour = hour % 12;
	    if (displayHour === 0) {
		displayHour = 12;
	    }
	    const minuteString = String(minute).padStart(2, '0');
	    const timeString = `${displayHour}:${minuteString} ${ampm}`;

	    const dateForFormatting = new Date(year, month - 1, day);
	    const dateOptions = { month: 'long', day: 'numeric' };
	    const dateString = dateForFormatting.toLocaleDateString(undefined, dateOptions);

	    el.textContent = `${dateString} at ${timeString} PDT`;

	} catch (e) {
	    el.textContent = "See Google Calendar for event time.";
	    console.error("Error formatting simple date for element", el, e);
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
        let isMobile = window.innerWidth <= 850;

        function showCard(indexToShow) {
            const currentCard = cards[currentIndex];
            const nextCard = cards[indexToShow];

            if (isMobile) {
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
                        c.classList.remove('active-card', 'card-content-fade-in', 'card-content-fade-out');
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
            } else {
                cards.forEach(card => {
                    card.style.display = 'flex';
                    card.style.opacity = '1';
                    card.classList.remove('active-card', 'card-content-fade-in', 'card-content-fade-out');
                });
            }

            currentIndex = indexToShow;
            if (prevButton) prevButton.disabled = currentIndex === 0;
            if (nextButton) nextButton.disabled = currentIndex === cards.length - 1;
        }


        function handleResize() {
            const currentlyMobile = window.innerWidth <= 850;
            if (isMobile !== currentlyMobile) {
                isMobile = currentlyMobile;
                if (isMobile) {
                    controlsContainer.style.display = 'flex';
                    contentArea.classList.add('mobile-view');
                    showCard(currentIndex);
                } else {
                    controlsContainer.style.display = 'none';
                    contentArea.classList.remove('mobile-view');
                    cards.forEach(card => {
                        card.style.display = 'flex';
                        card.style.opacity = '1';
                        card.classList.remove('active-card', 'card-content-fade-in', 'card-content-fade-out');
                    });
                }
            } else if (isMobile) {
                showCard(currentIndex);
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

    const lolPollForm = document.getElementById('lolPollForm');
    const lolPollMessageDiv = document.getElementById('lolPollMessage');
    const lolPollVoteButton = lolPollForm ? lolPollForm.querySelector('button[type="submit"]') : null;
    const lolPollRadioButtons = lolPollForm ? lolPollForm.querySelectorAll('input[type="radio"]') : null;
    const VOTE_STORAGE_KEY = 'roomieRumble_trackmania';

    const lolPollResultsSpans = {
        team_valkyrae: document.getElementById('results-team_valkyrae'),
        team_tinakitten: document.getElementById('results-team_tinakitten'),
        team_kkatamina: document.getElementById('results-team_kkatamina'),
        team_fuslie: document.getElementById('results-team_fuslie')
    };

    function disableLolPollForm() {
        if (lolPollForm) {
            lolPollForm.style.display = 'none';
        }
        if (lolPollMessageDiv) {
            lolPollMessageDiv.textContent = 'Thank you for voting! Your vote has been recorded.';
            lolPollMessageDiv.style.display = 'block';
        }
    }

    function checkIfVoted() {
        if (localStorage.getItem(VOTE_STORAGE_KEY) === 'true') {
            disableLolPollForm();
            return true;
        }
        return false;
    }

    function updateLolPollDisplay(results) {
        if (!results) return;

        let maxVotes = 0;
        for (const teamKey in results) {
            const currentTeamVotes = results[teamKey] || 0;
            if (currentTeamVotes > maxVotes) {
                maxVotes = currentTeamVotes;
            }
        }

        for (const teamKey in results) {
            const voteCount = results[teamKey] || 0;
            let percentage;

            if (maxVotes === 0) {
                percentage = 0;
            } else {
                percentage = (voteCount / maxVotes) * 100;
            }

            const voteCountSpan = document.getElementById(`results-${teamKey}`);
            if (voteCountSpan) {
                voteCountSpan.textContent = voteCount;
            }

            const barElement = document.getElementById(`bar-${teamKey}`);
            if (barElement) {
                barElement.style.width = `${percentage}%`;

                if (percentage === 100 && maxVotes > 0) {
                    barElement.classList.add('leading');
                } else {
                    barElement.classList.remove('leading');
                }
            }
        }
    }

    async function fetchLolPollResults() {
        const workerUrl = 'https://poll.roomierumble.com';
        try {
            const response = await fetch(workerUrl);
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, ${errorData}`);
            }
            const results = await response.json();
            updateLolPollDisplay(results);
        } catch (error) {
            console.error('Error fetching LoL poll results:', error);
            if (lolPollMessageDiv && lolPollForm && lolPollForm.style.display !== 'none') {
                 lolPollMessageDiv.textContent = 'Error fetching poll results.';
            }
        }
    }

    if (document.getElementById('lol-poll')) {
        fetchLolPollResults();

        if (lolPollForm) {
            if (checkIfVoted()) {
            } else {
                lolPollForm.addEventListener('submit', async (event) => {
                    event.preventDefault();

                    const formData = new FormData(lolPollForm);
                    const selectedOption = formData.get('lol_vote');

                    if (lolPollVoteButton) lolPollVoteButton.disabled = true;
                    if (lolPollRadioButtons) lolPollRadioButtons.forEach(radio => radio.disabled = true);

                    if (!selectedOption) {
                        if (lolPollMessageDiv) lolPollMessageDiv.textContent = 'Please select a team to vote for.';
                        if (lolPollVoteButton) lolPollVoteButton.disabled = false;
                        if (lolPollRadioButtons) lolPollRadioButtons.forEach(radio => radio.disabled = false);
                        return;
                    }

                    if (lolPollMessageDiv) lolPollMessageDiv.textContent = 'Submitting your vote...';

                    const workerUrl = 'https://poll.roomierumble.com';

                    try {
                        const response = await fetch(workerUrl, {
                            method: 'POST',
                            body: formData,
                        });

                        const data = await response.json();

                        if (response.ok) {
                            localStorage.setItem(VOTE_STORAGE_KEY, 'true');
                            disableLolPollForm();
                            if (data.results) {
                                updateLolPollDisplay(data.results);
                            }
                        } else {
                            if (lolPollMessageDiv) lolPollMessageDiv.textContent = `Error: ${data.message || 'Could not submit vote.'}`;
                            if (lolPollVoteButton) lolPollVoteButton.disabled = false;
                            if (lolPollRadioButtons) lolPollRadioButtons.forEach(radio => radio.disabled = false);
                        }
                    } catch (error) {
                        console.error('Error submitting LoL poll vote:', error);
                        if (lolPollMessageDiv) lolPollMessageDiv.textContent = 'An error occurred. Please try again.';
                        if (lolPollVoteButton) lolPollVoteButton.disabled = false;
                        if (lolPollRadioButtons) lolPollRadioButtons.forEach(radio => radio.disabled = false);
                    }
                });
            }
        }
    }

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

    const teamCaptains = document.querySelectorAll('.team-captain');

    teamCaptains.forEach(captain => {
        captain.addEventListener('click', function(event) {
            const currentPopover = captain.querySelector('.captain-bio-popover');
            if (!currentPopover) return;

            const isAlreadyVisible = currentPopover.classList.contains('is-visible');

            document.querySelectorAll('.captain-bio-popover.is-visible').forEach(visiblePopover => {
                if (visiblePopover !== currentPopover) {
                    visiblePopover.classList.remove('is-visible');
                }
            });

            if (isAlreadyVisible) {
                currentPopover.classList.remove('is-visible');
            } else {
                currentPopover.classList.add('is-visible');
            }
        });
    });

    document.addEventListener('click', function(event) {
        const openPopover = document.querySelector('.captain-bio-popover.is-visible');
        if (openPopover) {
            const isClickInsideCaptainArea = event.target.closest('.team-captain');
            if (!isClickInsideCaptainArea) {
                openPopover.classList.remove('is-visible');
            }
        }
    });
});
