// Form validation rules
export const validateUser = (formData) => {
  const errors = {};

  // First Name validation
  if (!formData.firstName || formData.firstName.trim() === '') {
    errors.firstName = 'First name is required';
  } else if (formData.firstName.trim().length < 2) {
    errors.firstName = 'First name must be at least 2 characters';
  }

  // Last Name validation
  if (!formData.lastName || formData.lastName.trim() === '') {
    errors.lastName = 'Last name is required';
  } else if (formData.lastName.trim().length < 2) {
    errors.lastName = 'Last name must be at least 2 characters';
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email || formData.email.trim() === '') {
    errors.email = 'Email is required';
  } else if (!emailRegex.test(formData.email)) {
    errors.email = 'Please enter a valid email';
  }

  // Mobile validation
  const mobileRegex = /^[0-9]{10}$/;
  if (!formData.mobile || formData.mobile.trim() === '') {
    errors.mobile = 'Mobile number is required';
  } else if (!mobileRegex.test(formData.mobile)) {
    errors.mobile = 'Please enter a valid 10-digit mobile number';
  }

  // Gender validation
  if (!formData.gender) {
    errors.gender = 'Gender is required';
  }

  // Status validation
  if (!formData.status) {
    errors.status = 'Status is required';
  }

  // Location validation
  if (!formData.location || formData.location.trim() === '') {
    errors.location = 'Location is required';
  }

  return errors;
};