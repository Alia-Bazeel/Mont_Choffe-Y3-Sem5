/* ------------------------------
    CONTACT FORM SUBMISSION
------------------------------ */

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if(contactForm){
    contactForm.addEventListener('submit', function(e){
        e.preventDefault();

        // Simple validation
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if(!name || !email || !message){
            formStatus.style.color = 'red';
            formStatus.textContent = 'Please fill in all fields.';
            return;
        }

        // Display success message
        formStatus.style.color = 'green';
        formStatus.textContent = `Thank you, ${name}! Your message has been sent.`;

        // Reset form
        contactForm.reset();

        // Clear message after 5s
        setTimeout(()=> formStatus.textContent = '', 5000);
    });
}
