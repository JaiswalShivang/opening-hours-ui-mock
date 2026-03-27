document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('schedules-container');
    const addBtn = document.getElementById('add-schedule');
    const open247 = document.getElementById('open-247');
    const outputString = document.getElementById('output-string');

    container.addEventListener('click', (e) => {
        if (e.target.classList.contains('day-btn')) {
            e.target.classList.toggle('active');
            generateOSMString();
        }
    });

    container.addEventListener('input', (e) => {
        if (e.target.classList.contains('time-input')) {
            generateOSMString();
        }
    });

    addBtn.addEventListener('click', () => {
        const firstSchedule = document.querySelector('.schedule-block');
        if (firstSchedule) {
            const newSchedule = firstSchedule.cloneNode(true);

            newSchedule.querySelectorAll('.day-btn').forEach(btn => btn.classList.remove('active'));
            const times = newSchedule.querySelectorAll('.time-input');
            times[0].value = "09:00";
            times[1].value = "17:00";

            container.appendChild(newSchedule);
            generateOSMString();
        }
    });

    open247.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        container.style.opacity = isChecked ? '0.4' : '1';
        container.style.pointerEvents = isChecked ? 'none' : 'auto';
        addBtn.style.display = isChecked ? 'none' : 'block';

        generateOSMString();
    });

    function generateOSMString() {
        if (open247.checked) {
            outputString.textContent = "24/7";
            return;
        }

        const schedules = document.querySelectorAll('.schedule-block');
        let finalParts = [];

        schedules.forEach(schedule => {
            const activeDays = Array.from(schedule.querySelectorAll('.day-btn.active'))
                .map(btn => btn.textContent);

            const times = schedule.querySelectorAll('.time-input');
            const startTime = times[0].value;
            const endTime = times[1].value;
            if (activeDays.length > 0 && startTime && endTime) {
                const daysStr = activeDays.join(',');
                finalParts.push(`${daysStr} ${startTime}-${endTime}`);
            }
        });

        if (finalParts.length > 0) {
            outputString.textContent = finalParts.join('; ');
        } else {
            outputString.textContent = "Please select days and times";
        }
    }

    generateOSMString();
});