// register.js - Plain JavaScript version

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const whatsappNo = document.getElementById('whatsappNo').value.trim();
            const postalAddress = document.getElementById('postalAddress').value.trim();
            
            // Validation flags
            let isValid = true;
            let errorMessage = '';
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!username) {
                errorMessage += 'Username (email) is required.\n';
                isValid = false;
            } else if (!emailRegex.test(username)) {
                errorMessage += 'Please enter a valid email address.\n';
                isValid = false;
            }
            
            // Password validation
            if (!password) {
                errorMessage += 'Password is required.\n';
                isValid = false;
            } else if (password.length < 6) {
                errorMessage += 'Password must be at least 6 characters long.\n';
                isValid = false;
            }
            
            // Confirm password validation
            if (!confirmPassword) {
                errorMessage += 'Please confirm your password.\n';
                isValid = false;
            } else if (password !== confirmPassword) {
                errorMessage += 'Passwords do not match.\n';
                isValid = false;
            }
            
            // WhatsApp number validation
            const phoneRegex = /^[0-9]{10,15}$/;
            if (!whatsappNo) {
                errorMessage += 'WhatsApp number is required.\n';
                isValid = false;
            } else if (!phoneRegex.test(whatsappNo)) {
                errorMessage += 'Please enter a valid WhatsApp number (10-15 digits).\n';
                isValid = false;
            }
            
            // Postal address validation
            if (!postalAddress) {
                errorMessage += 'Postal address is required.\n';
                isValid = false;
            } else if (postalAddress.length < 10) {
                errorMessage += 'Please enter a complete postal address.\n';
                isValid = false;
            }
            
            if (isValid) {
                // Form is valid - submit data to server
                const userData = {
                    username: username,
                    password: password,
                    whatsappNo: whatsappNo,
                    postalAddress: postalAddress,
                    role: 'User' // Default role
                };
                
                console.log('Registration data:', userData);
                
                // In a real application, you would send this to your backend
                // Example: fetch('/api/register', { method: 'POST', body: JSON.stringify(userData) })
                
                // Show success message
                alert('Registration successful!');
                registerForm.reset();
            } else {
                alert('Please fix the following errors:\n' + errorMessage);
            }
        });
        
        // Real-time validation
        const inputs = registerForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    }
    
    function validateField(field) {
        const value = field.value.trim();
        const errorSpan = document.getElementById(field.id + 'Error');
        
        if (!errorSpan) return;
        
        let error = '';
        
        switch (field.id) {
            case 'username':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    error = 'Email is required';
                } else if (!emailRegex.test(value)) {
                    error = 'Invalid email format';
                }
                break;
                
            case 'password':
                if (!value) {
                    error = 'Password is required';
                } else if (value.length < 6) {
                    error = 'Password must be at least 6 characters';
                }
                break;
                
            case 'confirmPassword':
                const password = document.getElementById('password').value;
                if (!value) {
                    error = 'Please confirm your password';
                } else if (value !== password) {
                    error = 'Passwords do not match';
                }
                break;
                
            case 'whatsappNo':
                const phoneRegex = /^[0-9]{10,15}$/;
                if (!value) {
                    error = 'WhatsApp number is required';
                } else if (!phoneRegex.test(value)) {
                    error = 'Invalid phone number format';
                }
                break;
                
            case 'postalAddress':
                if (!value) {
                    error = 'Postal address is required';
                } else if (value.length < 10) {
                    error = 'Address is too short';
                }
                break;
        }
        
        errorSpan.textContent = error;
        field.style.borderColor = error ? 'red' : '#ccc';
    }
});