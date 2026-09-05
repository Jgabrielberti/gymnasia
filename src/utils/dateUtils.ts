export const calculateAge = (dob: string) => {
    const parts = dob.split('/');
    if (parts.length !== 3) return 0;
    
    const birthDay = parseInt(parts[0], 10);
    const birthMonth = parseInt(parts[1], 10) - 1;
    const birthYear = parseInt(parts[2], 10);
    
    const today = new Date();
    const birthDateObj = new Date(birthYear, birthMonth, birthDay);
    
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const m = today.getMonth() - birthDateObj.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
        age--;
    }
    return age;
  };