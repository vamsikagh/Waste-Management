// Function to load user profile data
async function loadUserProfile() {
    const email = localStorage.getItem('userEmail');
    console.log('Loading profile for email:', email);
    
    if (!email) {
        console.log('No email found in localStorage, redirecting to login');
        window.location.href = 'login.html';
        return;
    }

    try {
        console.log('Fetching user data from:', `http://localhost:8081/api/email/${email}/credentials`);
        const response = await fetch(`http://localhost:8081/api/email/${email}/credentials`);
        console.log('Response status:', response.status);
        
        if (response.ok) {
            const userData = await response.json();
            console.log('Received user data:', userData);
            
            // Display user data in the form
            document.getElementById('fullname').value = userData.fullName || '';
            document.getElementById('userid').value = userData.username || '';
            document.getElementById('email').value = userData.email || '';
            
            // Store original email for comparison during update
            document.getElementById('editProfileForm').dataset.originalEmail = userData.email;
            
            // Update the welcome message
            document.querySelector('header h1').textContent = `Welcome, ${userData.fullName}`;
            
            // Show success message
            showMessage('Profile data loaded successfully', 'success');
        } else {
            console.error('Failed to load user data, status:', response.status);
            try {
                const errorText = await response.text();
                console.error('Error response:', errorText);
            } catch (e) {
                console.error('Could not read error response');
            }
            showMessage('Failed to load user data', 'error');
        }
    } catch (error) {
        console.error('Error loading user data:', error);
        showMessage('Error loading user data', 'error');
    }
}

// Function to show messages to the user
function showMessage(message, type = 'info') {
    const messageDiv = document.getElementById('message');
    if (!messageDiv) {
        const div = document.createElement('div');
        div.id = 'message';
        div.style.padding = '10px';
        div.style.margin = '10px 0';
        div.style.borderRadius = '5px';
        div.style.textAlign = 'center';
        document.querySelector('.form-container').insertBefore(div, document.querySelector('form'));
    }
    
    const div = document.getElementById('message');
    div.textContent = message;
    div.className = `message ${type}`;
    
    // Style based on message type
    switch(type) {
        case 'success':
            div.style.backgroundColor = '#d4edda';
            div.style.color = '#155724';
            div.style.border = '1px solid #c3e6cb';
            break;
        case 'error':
            div.style.backgroundColor = '#f8d7da';
            div.style.color = '#721c24';
            div.style.border = '1px solid #f5c6cb';
            break;
        default:
            div.style.backgroundColor = '#cce5ff';
            div.style.color = '#004085';
            div.style.border = '1px solid #b8daff';
    }
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        div.style.display = 'none';
    }, 5000);
}

// Function to validate form data
function validateForm(formData) {
    if (!formData.username || formData.username.trim() === '') {
        showMessage('Username cannot be empty', 'error');
        return false;
    }
    if (!formData.fullName || formData.fullName.trim() === '') {
        showMessage('Full name cannot be empty', 'error');
        return false;
    }
    if (!formData.email || !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        showMessage('Please enter a valid email address', 'error');
        return false;
    }
    return true;
}

// Function to update user profile
async function updateProfile(event) {
    event.preventDefault();
    
    const form = document.getElementById('editProfileForm');
    const originalEmail = form.dataset.originalEmail;
    const email = document.getElementById('email').value;
    
    const updatedData = {
        username: document.getElementById('userid').value,
        fullName: document.getElementById('fullname').value,
        email: email,
        password: document.getElementById('password').value
    };

    console.log('Updating profile with data:', updatedData);

    // Validate form data
    if (!validateForm(updatedData)) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:8081/api/users/${originalEmail}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        console.log('Update response status:', response.status);

        if (response.ok) {
            const updatedUser = await response.json();
            console.log('Update successful:', updatedUser);
            
            // Update stored email if it was changed
            if (email !== originalEmail) {
                localStorage.setItem('userEmail', email);
            }
            showMessage('Profile updated successfully!', 'success');
            
            // Clear password field after successful update
            document.getElementById('password').value = '';
            
            // Update the original email in the form dataset
            form.dataset.originalEmail = email;
            
            // Update welcome message
            document.querySelector('header h1').textContent = `Welcome, ${updatedUser.fullName}`;
        } else {
            console.error('Failed to update profile, status:', response.status);
            try {
                const errorData = await response.json();
                showMessage(errorData.message || 'Failed to update profile', 'error');
            } catch (e) {
                showMessage('Failed to update profile', 'error');
            }
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        showMessage('Error updating profile', 'error');
    }
}

// Load profile data when page loads
document.addEventListener('DOMContentLoaded', loadUserProfile);

// Add form submit handler
document.querySelector('form').addEventListener('submit', updateProfile); 