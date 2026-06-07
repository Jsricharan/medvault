// Add Dr. prefix to doctor names
// If name already starts with Dr. keep it as is
export const formatDoctorName = (name) => {
  if (!name) return '';

  // Already has Dr. prefix - keep as is
  if (name.startsWith('Dr.') || name.startsWith('dr.')) {
    return name;
  }

  // Add Dr. prefix
  return `Dr. ${name}`;
};

// Format patient name - no prefix needed
export const formatPatientName = (name) => {
  if (!name) return '';
  return name;
};