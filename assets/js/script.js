// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
//$(function () {
    // TODO: Add a listener for click events on the save button. This code should
    // use the id in the containing time-block as a key to save the user input in
    // local storage. HINT: What does `this` reference in the click listener
    // function? How can DOM traversal be used to get the "hour-x" id of the
    // time-block containing the button that was clicked? How might the id be
    // useful when saving the description in local storage?
    //
    // TODO: Add code to apply the past, present, or future class to each time
    // block by comparing the id to the current hour. HINTS: How can the id
    // attribute of each time-block be used to conditionally add or remove the
    // past, present, and future classes? How can Day.js be used to get the
    // current hour in 24-hour time?
    //
    // TODO: Add code to get any user input that was saved in localStorage and set
    // the values of the corresponding textarea elements. HINT: How can the id
    // attribute of each time-block be used to do this?
    //
    // TODO: Add code to display the current date in the header of the page.
  //});

  $(function () {
    // Function to generate time blocks from 9am to 10pm
    function generateTimeBlocks() {
        var startTime = 9; // 9am
        var endTime = 22; // 10pm

        for (var hour = startTime; hour <= endTime; hour++) {
            var formattedHour = hour < 12 ? hour + "AM" : (hour === 12 ? "12PM" : (hour - 12) + "PM");
            var timeBlock = $("<div>").addClass("row time-block").attr("id", "hour-" + hour);
            var hourCol = $("<div>").addClass("col-2 col-md-1 hour text-center py-3").text(formattedHour);
            var descriptionTextarea = $("<textarea>").addClass("col-8 col-md-10 description").attr("rows", "3");
            var saveButton = $("<button>").addClass("btn saveBtn col-2 col-md-1").attr("aria-label", "save").html('<i class="fas fa-save" aria-hidden="true"></i>');
            
            timeBlock.append(hourCol, descriptionTextarea, saveButton);
            $(".container-lg").append(timeBlock);
        }
    }

    // Generate time blocks on page load
    generateTimeBlocks();

    // Function to update time blocks color based on current time
    function updateTimeBlocks() {
        var currentHour = dayjs().hour();

        $(".time-block").each(function() {
            var blockHour = parseInt($(this).attr("id").split("-")[1]);

            if (blockHour < currentHour) {
                $(this).removeClass("present future").addClass("past");
            } else if (blockHour === currentHour) {
                $(this).removeClass("past future").addClass("present");
            } else {
                $(this).removeClass("past present").addClass("future");
            }
        });
    }

    // Initial call to update time blocks color
    updateTimeBlocks();

    // Event listener for save button click
    $(".saveBtn").on("click", function() {
        var userInput = $(this).siblings(".description").val().trim();
        var timeBlockId = $(this).parent().attr("id");
        localStorage.setItem(timeBlockId, userInput);
        updateTimeBlocks();

        var message = $("<p>").addClass("appointment-message").text("Appointment added to local storage ✔");
        $("#currentDay").after(message);
        setTimeout(function() {
            message.remove();
        }, 3000);
    });

    // Retrieve saved user input from local storage
    $(".time-block").each(function() {
        var timeBlockId = $(this).attr("id");
        var userInput = localStorage.getItem(timeBlockId);

        if (userInput) {
            $(this).find(".description").val(userInput);
        }
    });

    // Display current date in the header
    $("#currentDay").text(dayjs().format("dddd, MMMM D, YYYY"));
});
