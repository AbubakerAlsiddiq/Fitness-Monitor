const inputForm = document.getElementById("input-form");
const openInputFormBtn = document.getElementById("open-input-form-btn");
const closeInputFormBtn = document.getElementById("close-input-form-btn");
const addOrUpdateInputBtn = document.getElementById("add-or-update-input-btn");
const cancelBtn = document.getElementById("cancel-btn");
const discardBtn = document.getElementById("discard-btn");
const calendarContainer = document.getElementById("calender-container");
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const descriptionInput = document.getElementById("description-input");
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const calendarBody = document.getElementById("calendar-body");
const addOrDeleteForm = document.getElementById("add-or-delete-form");
const addBtn = document.getElementById("add-button");
const deleteBtn = document.getElementById("delete-button");
const editBtn = document.getElementById("edit-button");
const nextMonth = document.getElementById("next-month-btn");
const previousMonth =  document.getElementById("prev-month-btn");

const inputData = JSON.parse(localStorage.getItem("data")) || [];
let currentInput = {};
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

const generateDatesForCurrentMonth = (year, month) => {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  
  const dates = [];
  let currentDay = new Date(firstDayOfMonth);

  while (currentDay <= lastDayOfMonth) {
      dates.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
  }

  console.log(dates);
  return dates;
};

document.addEventListener("DOMContentLoaded", () => {
  const dates = generateDatesForCurrentMonth(currentYear, currentMonth);
  populateCalendar(dates);
  updateCalendar();
  updateCalendarHeader();
});

const updateCalendarHeader = () => {
  const currentDate = new Date(currentYear, currentMonth);
  const options = { year: 'numeric', month: 'long' };
  const monthYear = currentDate.toLocaleDateString('en-US', options);

  document.getElementById('month-year').textContent = monthYear;
};

previousMonth.addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
  }
  updateCalendarHeader();
  const dates = generateDatesForCurrentMonth();
  populateCalendar(dates);
  updateCalendar();
});


nextMonth.addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
  }
  updateCalendarHeader();
  const dates = generateDatesForCurrentMonth();
  populateCalendar(dates);
  updateCalendar();
});

document.getElementById("month-year").addEventListener("click", () => {
  document.getElementById("month-year-picker").showModal();
});

document.getElementById("month-year-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const month = parseInt(document.getElementById("month-select").value);
  const year = parseInt(document.getElementById("year-input").value);

  currentMonth = month;
  currentYear = year;

  updateCalendarHeader();
  const dates = generateDatesForCurrentMonth();
  populateCalendar(dates);
  updateCalendar();

  document.getElementById("month-year-picker").close();
});

function parseDate(dateString) {
  if (!dateString || dateString.trim() === '') {
    throw new Error('Invalid date format: Empty string');
  }
  const parts = dateString.split('/');
  console.log('Parts:', parts);
  if (parts.length === 1) {
    // yyyy-MM-dd format with only one part
    const [year, month, day] = parts[0].split('-').map(Number);
    if (year && month && day) { // Check if all values are valid numbers
      console.log('Creating date with:', year, month - 1, day);
      return new Date(year, month - 1, day);
    } else {
      throw new Error(`Invalid date format: ${dateString}`);
    }
  } else {
    // Unknown format, return invalid date
    throw new Error(`Invalid date format: ${dateString}`);
  }
}

const addOrUpdateInput = () => {
  console.log("Adding or updating input...");

  const dates = generateDatesForCurrentMonth(currentYear, currentMonth);
  console.log(dates);

  const inputObj = {
      id: `${titleInput.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
      title: titleInput.value,
      date: parseDate(dateInput.value),
      description: descriptionInput.value,
  };

  console.log(`Parsed date: ${inputObj.date.toLocaleDateString()}`);

  const matchedDate = dates.find(date => {
      const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const inputDateString = `${inputObj.date.getFullYear()}-${String(inputObj.date.getMonth() + 1).padStart(2, '0')}-${String(inputObj.date.getDate()).padStart(2, '0')}`;
      console.log(`Comparing ${dateString} with ${inputDateString}`);
      return dateString === inputDateString;
  });

  if (matchedDate) {
      console.log(`Matched date: ${matchedDate.toLocaleDateString()}`);
      const calendarCell = document.querySelector(`[data-date="${matchedDate.toISOString()}"]`);
      if (calendarCell) {
          const eventDiv = document.createElement("div");
          eventDiv.classList.add("event");
          eventDiv.textContent = `${inputObj.title} - ${inputObj.description}`;
          calendarCell.appendChild(eventDiv);
          calendarCell.setAttribute('data-event-id', inputObj.id);

          const eventData = {
              id: inputObj.id,
              title: inputObj.title,
              date: inputObj.date.toISOString(),
              description: inputObj.description,
          };

          const existingData = localStorage.getItem("events");
          const events = existingData ? JSON.parse(existingData) : [];

          const existingEventIndex = events.findIndex((event) => event.id === eventData.id);

          if (existingEventIndex !== -1) {
              events[existingEventIndex] = eventData;
          } else {
              events.push(eventData);
          }

          localStorage.setItem("events", JSON.stringify(events));

          const existingInputIndex = inputData.findIndex((input) => input.id === inputObj.id);
          if (existingInputIndex !== -1) {
              inputData[existingInputIndex] = inputObj;
          } else {
              inputData.push(inputObj);
          }
      } else {
          console.log(`No calendar cell found for date: ${matchedDate.toISOString()}`);
      }
  } else {
      console.log('No match found');
  }

  populateCalendar();
  updateCalendar();
  updateProgressBar();
};


const updateCalendar = () => {
  calendarBody.innerHTML = "";
  const dates = generateDatesForCurrentMonth(currentYear, currentMonth);

  dates.forEach((date, index) => {
    const dateCell = document.createElement("div");
    dateCell.classList.add("calendar-date");
    dateCell.textContent = date.getDate();
    dateCell.dataset.date = date.toISOString();

    // Generate a unique event ID for each date
    const eventId = date.toISOString();

    // Match event data to populate the calendar
    inputData.forEach((data) => {
      const cellDate = new Date(data.date);
      const dateString = `${cellDate.getFullYear()}-${cellDate.getMonth() + 1}-${cellDate.getDate()}`;
      const dateCell = document.querySelector(`[data-date="${dateString}"]`);
      if (dateCell) {
        const dataDisplay = document.createElement("div");
        dataDisplay.textContent = `${data.title}: ${data.description}`;
        dateCell.appendChild(dataDisplay);

        dateCell.addEventListener("click", () => {
          if (data.id) {
            console.log("Cell clicked!");
            setEventId(data.id);
            addOrDeleteForm.classList.toggle("hidden");
          } else {
            console.error("No event ID found for the clicked cell.");
          }
        });

        // Set the same event ID for all logs in this date cell
        data.id = eventId;
      }
    });

    console.log(localStorage.getItem("events"));

    // Add event listener to the date cell
    dateCell.addEventListener("click", () => {
      console.log("Cell clicked!");
      addOrDeleteForm.dataset.eventId = eventId; // Set the event ID to the form
      addOrDeleteForm.classList.toggle("hidden");
    });

    calendarBody.appendChild(dateCell);
  });

  loadEvents();
  updateProgressBar();
};

editBtn.addEventListener("click", () => {
  let eventId = addOrDeleteForm.dataset.eventId;
  if (eventId) {
      editInput(eventId);
  } else {
      console.error("No event selected for editing.");
  }
});

deleteBtn.addEventListener("click", () => {
  let eventId = addOrDeleteForm.dataset.eventId;
  if (eventId) {
    const eventDate = addOrDeleteForm.dataset.date;
    deleteInput(eventId, eventDate);
  } else {
    console.error("No event selected for deletion.");
  }
});

function deleteInput(eventDate) {
  console.log(eventDate);
  const events = JSON.parse(localStorage.getItem("events"));
  const eventIndex = events.findIndex((event) => event.date === eventDate);
  if (eventIndex !== -1) {
    events.splice(eventIndex, 1);
    localStorage.setItem("events", JSON.stringify(events));
  } else {
    console.error("Event not found for deletion.");
  }
}

const editInput = (id) => {
  const dataArrIndex = inputData.findIndex((item) => item.id === id);

  currentInput = inputData[dataArrIndex];
  titleInput.value = currentInput.title;
  dateInput.value = currentInput.date;
  descriptionInput.value = currentInput.description;
  addOrUpdateInputBtn.innerText = "Update Data";
  inputForm.classList.toggle("hidden");  
};

const reset = () => {
  titleInput.value = "";
  dateInput.value = "";
  descriptionInput.value = "";
  inputForm.classList.toggle("hidden");
  currentInput = {};
};

const populateCalendar = () => {
  const dateInput = document.getElementById('date');
  if (!dateInput) {
    // Handle empty input date string
    return;
  }
  const titleInput = document.getElementById('title');
  const descriptionInput = document.getElementById('description');
  if (!titleInput || !descriptionInput) {
    // Handle missing title or description input elements
    return;
  }
  const date = parseDate(dateInput.value.trim()); // Parse the input date string into a Date object
  const dateCell = document.querySelector(`[data-date="${date.toISOString()}"]`);
  if (dateCell) {
    const eventDiv = document.createElement("div");
    eventDiv.classList.add("event");
    eventDiv.textContent = `${titleInput.value} - ${descriptionInput.value}`;
    dateCell.appendChild(eventDiv);
  }
};

openInputFormBtn.addEventListener("click", () => inputForm.classList.toggle("hidden"));

closeInputFormBtn.addEventListener("click", () => {
  const formInputsContainValues = titleInput.value || dateInput.value || descriptionInput.value;
  const formInputValuesUpdated = titleInput.value !== currentInput.title || dateInput.value !== currentInput.date || descriptionInput.value !== currentInput.description;

  if (formInputsContainValues && formInputValuesUpdated) {
    confirmCloseDialog.showModal();
  } else {
    reset();
  }
});

addBtn.addEventListener("click", () => {
  inputForm.classList.toggle("hidden");
  addOrDeleteForm.classList.toggle("hidden");
  updateCalendar();
});

cancelBtn.addEventListener("click", () => confirmCloseDialog.close());

discardBtn.addEventListener("click", () => {
  confirmCloseDialog.close();
  reset()
});

inputForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addOrUpdateInput();
  inputForm.style.display = "none";
});

const loadEvents = () => {
  const existingData = localStorage.getItem("events");
  const events = existingData ? JSON.parse(existingData) : [];

  events.forEach((event) => {
    const date = new Date(event.date);
    const calendarCell = document.querySelector(`[data-date="${date.toISOString()}"]`);

    if (calendarCell) {
      const eventDiv = document.createElement("div");
      eventDiv.classList.add("event");
      eventDiv.textContent = `${event.title} - ${event.description}`;
      calendarCell.appendChild(eventDiv);
    }
  });
};

const updateProgressBar = () => {
  const calendarCells = [...document.querySelectorAll('.calendar-body > div')];
  const totalCells = calendarCells.length; // Denominator
  const filledCells = calendarCells.filter(cell => cell.querySelector('.event') !== null).length; // Numerator (count cells with events)
  const progressPercentage = (filledCells / totalCells) * 100;
  document.querySelector('.progress-bar').style.width = `${progressPercentage}%`;
  document.querySelector('.progress-text').innerText = `${progressPercentage.toFixed(2)}% (${filledCells} / ${totalCells})`;
};
