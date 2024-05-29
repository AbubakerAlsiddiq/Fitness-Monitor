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
const calendarDates = document.getElementById("calendar-dates");

const inputData = JSON.parse(localStorage.getItem("data")) || [];
let currentInput = {};

const addOrUpdateInput = () => {
    addOrUpdateInputBtn.innerText = "Add Data";
    const dataArrIndex = inputData.findIndex((item) => item.id === currentInput.id);
    const inputObj = {
      id: `${titleInput.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
      title: titleInput.value,
      date: dateInput.value,
      description: descriptionInput.value,
    };
  
    if (dataArrIndex === -1) {
      inputData.unshift(inputObj);
    } else {
      inputData[dataArrIndex] = inputObj;
    }
  
    localStorage.setItem("data", JSON.stringify(inputData));
    updateCalendar();
    reset();
    console.log("Data added or updated:", inputObj);
  };

  document.addEventListener("DOMContentLoaded", () => {
    updateCalendar();
  });

   
    const updateCalendar = () =>  {
      calendarBody.innerHTML = ""; // Clear the calendar body

      calendarBody.innerHTML = ""; // Clear the calendar body

    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
    const dates = [];
    let currentDay = new Date(firstDayOfMonth);

    while (currentDay <= lastDayOfMonth) {
        dates.push(new Date(currentDay));
        currentDay.setDate(currentDay.getDate() + 1);
    }

    dates.forEach(date => {
        const cell = document.createElement("div");
        cell.classList.add("calendar-date");
        cell.textContent = date.getDate();
        calendarBody.appendChild(cell);
    });


      inputData.forEach(({ id, title, date, description }) => {
        const cell = document.createElement("div");
        cell.classList.add("calendar-day");

        const dataDisplay = document.createElement("div");
        dataDisplay.textContent = `${date}: ${title} - ${description}`;

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", () => editInput(id));

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => deleteInput(id));

        cell.appendChild(dataDisplay);
        cell.appendChild(editBtn);
        cell.appendChild(deleteBtn);
  
        calendarBody.appendChild(cell);
        });
    };
  

  const deleteInput = (id) => {
    const dataArrIndex = inputData.findIndex(
        (item) => item.id === id);

        inputData.splice(dataArrIndex, 1);
        localStorage.setItem("data", JSON.stringify(inputData));
        updateCalendar();
  };

  const editInput = (id) => {
    const dataArrIndex = inputData.findIndex(
    (item) => item.id === id);

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

const getCurrentDate = () => {
  return new Date();
};

const getFirstDayOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const getLastDayOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

const generateDatesForCurrentMonth = () => {
  const currentDate = getCurrentDate();
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const lastDayOfMonth = getLastDayOfMonth(currentDate);
  
  const dates = [];
  let currentDay = new Date(firstDayOfMonth);

  while (currentDay <= lastDayOfMonth) {
      dates.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
  }

  console.log("Dates for current month:", dates); // Log dates to console
  return dates;
};

const populateCalendar = (calendarDates) => {
  console.log("Populating calendar with dates:", calendarDates);

  calendarBody.innerHTML = ""; // Clear previous calendar dates

  calendarDates.forEach(date => {
    const cell = document.createElement("div");
    cell.classList.add("calendar-date");
    cell.textContent = date.getDate();
    calendarBody.appendChild(cell);
  });

  console.log("Calendar populated successfully");
};

document.addEventListener("DOMContentLoaded", () => {
  const dates = generateDatesForCurrentMonth();
  populateCalendar(dates);
  updateCalendar(); 
});

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

cancelBtn.addEventListener("click", () => confirmCloseDialog.close());

discardBtn.addEventListener("click", () => {
  confirmCloseDialog.close();
  reset()
});

inputForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addOrUpdateInput();
});
