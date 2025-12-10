// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {

    // 1. Select the career application form
    const form = document.getElementById("careerForm");

    // 2. Create a custom message box to show success/error messages
    const messageBox = document.createElement("div");
    messageBox.style.display = "none";               // Hide by default
    messageBox.style.padding = "15px 20px";          // Add padding
    messageBox.style.borderRadius = "10px";          // Rounded corners
    messageBox.style.marginBottom = "20px";          // Spacing from form
    messageBox.style.fontFamily = "'Roboto', sans-serif";
    messageBox.style.fontSize = "1rem";
    form.prepend(messageBox);                         // Place it at the top of the form

    // 3. Listen for form submission
    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent the default page reload

        // 4. Grab input values
        const name = document.getElementById("name");
        const email = document.getElementById("email");
        const phone = document.getElementById("phone");
        const resume = document.getElementById("resume").files[0];

        // 5. Reset previous error highlights
        [name, email, phone, resume].forEach(field => {
            if(field?.style) field.style.borderColor = "#ccc"; // Reset border color
        });
        messageBox.style.display = "none"; // Hide previous messages

        // 6. Validation: check if all fields are filled
        if (!name.value.trim() || !email.value.trim() || !phone.value.trim() || !resume) {
            messageBox.textContent = "Please fill all required fields and upload your resume.";
            messageBox.style.backgroundColor = "#fde2e2"; // Light red for error
            messageBox.style.color = "#c33";             // Dark red text
            messageBox.style.display = "block";

            // Highlight missing fields with red border
            if(!name.value.trim()) name.style.borderColor = "#c33";
            if(!email.value.trim()) email.style.borderColor = "#c33";
            if(!phone.value.trim()) phone.style.borderColor = "#c33";
            if(!resume) resume.style.borderColor = "#c33";

            return; // Stop submission if validation fails
        }

        // 7. If all fields are valid, show success message
        messageBox.textContent = "Thank you! Your application has been submitted.";
        messageBox.style.backgroundColor = "#e7f9ed"; // Light green for success
        messageBox.style.color = "#2c662d";           // Dark green text
        messageBox.style.display = "block";

        // 8. Reset form after 1.5 seconds to let user see message
        setTimeout(() => form.reset(), 1500);
    });
});
