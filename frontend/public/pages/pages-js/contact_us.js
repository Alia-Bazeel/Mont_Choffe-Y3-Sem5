/* ------------------------------
    CONTACT FORM SUBMISSION
------------------------------ */

// Select contact form
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Validate inputs
        if (!name || !email || !message) {
            formStatus.style.color = 'red';
            formStatus.textContent = 'Please fill in all fields.';
            return;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            formStatus.style.color = 'red';
            formStatus.textContent = 'Please enter a valid email address.';
            return;
        }
        
        try {
            // Show sending message
            formStatus.style.color = 'blue';
            formStatus.textContent = 'Sending your message...';
            
            // Send to API
            const result = await API.sendContactMessage({ name, email, message });
            
            // Show success message
            formStatus.style.color = 'green';
            formStatus.textContent = `Thank you, ${name}! Your message has been sent.`;
            
            // Reset form
            contactForm.reset();
            
            // Clear message after 5 seconds
            setTimeout(() => {
                formStatus.textContent = '';
            }, 5000);
            
        } catch (error) {
            console.error('Contact form error:', error);
            formStatus.style.color = 'red';
            formStatus.textContent = 'Failed to send message. Please try again.';
        }
    });
}