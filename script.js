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
      // Fallbacks
      const minuteString = String(minute).padStart(2, '0');
      const fallbackDate = new Date(year, month, day);
      const dateDisplayOptions = { month: 'long', day: 'numeric', year: 'numeric' };
      el.textContent = `${fallbackDate.toLocaleDateString(undefined, dateDisplayOptions)} at ${hourInOriginalTZ}:${minuteString} ${originalTZ.replace('_', ' ')} (Check Google Calendar for your local time)`;
      console.error("Could not display local date/time: ", e);
    }
  });
});
