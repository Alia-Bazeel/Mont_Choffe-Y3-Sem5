// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    
    // Select the career form
    const careerForm = document.getElementById('careerForm');
    
    // Create message display element
    const messageDiv = document.createElement('div');
    messageDiv.id = 'careerMessage';
    messageDiv.style.display = 'none';
    messageDiv.style.padding = '15px';
    messageDiv.style.marginBottom = '20px';
    messageDiv.style.borderRadius = '8px';
    careerForm.parentNode.insertBefore(messageDiv, careerForm);
    
    // Handle form submission
    careerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const message = document.getElementById('message').value.trim();
        const resumeFile = document.getElementById('resume').files[0];
        
        // Basic validation
        if (!name || !email || !phone || !message || !resumeFile) {
            showMessage('Please fill all fields and upload resume', 'error');
            return;
        }
        
        // Validate file type
        const allowedTypes = ['application/pdf', 'application/msword', 
                             'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(resumeFile.type)) {
            showMessage('Please upload PDF or Word document only', 'error');
            return;
        }
        
        // Validate file size (max 5MB)
        if (resumeFile.size > 5 * 1024 * 1024) {
            showMessage('File too large. Max size is 5MB', 'error');
            return;
        }
        
        try {
            // Show loading message
            showMessage('Submitting application...', 'info');
            
            // Create FormData
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('message', message);
            formData.append('resume', resumeFile);
            
            // Submit to API
            const result = await API.submitApplication(formData);
            
            // Show success message
            showMessage(result.message || 'Application submitted successfully!', 'success');
            
            // Reset form after 2 seconds
            setTimeout(() => {
                careerForm.reset();
                hideMessage();
            }, 2000);
            
        } catch (error) {
            console.error('Application error:', error);
            showMessage(error.message || 'Failed to submit application', 'error');
        }
    });
    
    // Helper function to show messages
    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.style.display = 'block';
        
        if (type === 'error') {
            messageDiv.style.backgroundColor = '#f8d7da';
            messageDiv.style.color = '#721c24';
            messageDiv.style.border = '1px solid #f5c6cb';
        } else if (type === 'success') {
            messageDiv.style.backgroundColor = '#d4edda';
            messageDiv.style.color = '#155724';
            messageDiv.style.border = '1px solid #c3e6cb';
        } else {
            messageDiv.style.backgroundColor = '#d1ecf1';
            messageDiv.style.color = '#0c5460';
            messageDiv.style.border = '1px solid #bee5eb';
        }
    }
    
    // Helper function to hide message
    function hideMessage() {
        messageDiv.style.display = 'none';
        messageDiv.textContent = '';
    }
});