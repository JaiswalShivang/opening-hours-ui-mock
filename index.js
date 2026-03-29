document.addEventListener('DOMContentLoaded', () => {
    const dayOrder = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    const container = document.getElementById('schedules-container');
    const addBtn = document.getElementById('add-schedule');
    const open247 = document.getElementById('open-247');
    const outputString = document.getElementById('output-string');
    const summaryDisplay = document.getElementById('hoursSummary');
    const hoursToggle = document.getElementById('hoursToggle');
    const hoursPanel = document.getElementById('hoursPanel');
    const hoursSection = document.getElementById('hoursAccordion');
    const template = document.getElementById('schedule-template');

    const defaultSummary = 'Mo-Fr 09:00-17:00; Sa-Su 10:00-14:00';
    let isPanelOpen = false;

    summaryDisplay.textContent = defaultSummary;
    outputString.textContent = defaultSummary;
    hydrateFromString(defaultSummary);

    hoursToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        isPanelOpen ? collapsePanel() : expandPanel();
    });

    hoursPanel.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    document.addEventListener('click', (event) => {
        if (!isPanelOpen) {
            return;
        }
        if (!hoursSection.contains(event.target)) {
            collapsePanel();
        }
    });

    container.addEventListener('click', (event) => {
        if (event.target.classList.contains('day-btn')) {
            event.target.classList.toggle('active');
            generateOSMString();
        }
    });

    container.addEventListener('input', (event) => {
        if (event.target.classList.contains('time-input')) {
            generateOSMString();
        }
    });

    addBtn.addEventListener('click', () => {
        container.appendChild(createScheduleBlock());
        generateOSMString();
    });

    open247.addEventListener('change', () => {
        update247State();
        generateOSMString();
    });

    function expandPanel() {
        isPanelOpen = true;
        hoursSection.classList.add('expanded');
        hoursToggle.setAttribute('aria-expanded', 'true');
        hydrateFromString(summaryDisplay.textContent.trim());
    }

    function collapsePanel() {
        isPanelOpen = false;
        hoursSection.classList.remove('expanded');
        hoursToggle.setAttribute('aria-expanded', 'false');
        generateOSMString();
    }

    function createScheduleBlock(segment = {}) {
        const fragment = template.content.cloneNode(true);
        const block = fragment.querySelector('.schedule-block');
        const startInput = block.querySelector('[data-time="start"]');
        const endInput = block.querySelector('[data-time="end"]');
        const activeSet = new Set(segment.activeDays || []);

        startInput.value = segment.startTime || '09:00';
        endInput.value = segment.endTime || '17:00';

        block.querySelectorAll('.day-btn').forEach(btn => {
            if (activeSet.has(btn.dataset.day)) {
                btn.classList.add('active');
            }
        });

        return block;
    }

    function renderSchedules(segments) {
        container.innerHTML = '';
        if (!segments.length) {
            container.appendChild(createScheduleBlock());
            return;
        }
        segments.forEach(segment => container.appendChild(createScheduleBlock(segment)));
    }

    function hydrateFromString(osmString) {
        if (!osmString || osmString === 'Please select days and times') {
            renderSchedules([]);
            return;
        }

        if (osmString === '24/7') {
            open247.checked = true;
            update247State();
            return;
        }

        open247.checked = false;
        update247State();

        const segments = parseSegments(osmString);
        renderSchedules(segments);
    }

    function parseSegments(osmString) {
        return osmString.split(';').map(part => part.trim()).filter(Boolean).map(part => {
            const match = part.match(/(.+)\s+(\d{2}:\d{2})-(\d{2}:\d{2})/);
            if (!match) {
                return null;
            }
            const activeDays = expandDayTokens(match[1].trim());
            return {
                activeDays,
                startTime: match[2],
                endTime: match[3]
            };
        }).filter(Boolean);
    }

    function expandDayTokens(segment) {
        const tokens = segment.split(',');
        const result = new Set();
        tokens.forEach(token => {
            const trimmed = token.trim();
            if (!trimmed) {
                return;
            }
            if (trimmed.includes('-')) {
                const [start, end] = trimmed.split('-').map(day => day.trim());
                const startIndex = dayOrder.indexOf(start);
                const endIndex = dayOrder.indexOf(end);
                if (startIndex === -1 || endIndex === -1) {
                    return;
                }
                if (startIndex <= endIndex) {
                    dayOrder.slice(startIndex, endIndex + 1).forEach(day => result.add(day));
                } else {
                    dayOrder.slice(startIndex).concat(dayOrder.slice(0, endIndex + 1)).forEach(day => result.add(day));
                }
            } else if (dayOrder.includes(trimmed)) {
                result.add(trimmed);
            }
        });
        return Array.from(result);
    }

    function update247State() {
        const disabled = open247.checked;
        container.style.pointerEvents = disabled ? 'none' : 'auto';
        container.style.opacity = disabled ? '0.4' : '1';
        addBtn.style.display = disabled ? 'none' : 'block';
    }

    function generateOSMString() {
        if (open247.checked) {
            updateOutputs('24/7');
            return;
        }

        const schedules = container.querySelectorAll('.schedule-block');
        const finalParts = [];

        schedules.forEach(schedule => {
            const activeDays = Array.from(schedule.querySelectorAll('.day-btn.active')).map(btn => btn.dataset.day);
            const times = schedule.querySelectorAll('.time-input');
            const startTime = times[0].value;
            const endTime = times[1].value;

            if (activeDays.length && startTime && endTime) {
                finalParts.push(`${activeDays.join(',')} ${startTime}-${endTime}`);
            }
        });

        if (finalParts.length) {
            updateOutputs(finalParts.join('; '));
        } else {
            updateOutputs('Please select days and times');
        }
    }

    function updateOutputs(value) {
        summaryDisplay.textContent = value;
        outputString.textContent = value;
    }
});