export default function calculateServiceTime(buyDate: Date) {
    // Clone the date to avoid mutating the original
    const serviceStartTime = new Date(buyDate);
    serviceStartTime.setDate(serviceStartTime.getDate() + 90);
  
    const serviceEndTime = new Date(buyDate);
    serviceEndTime.setFullYear(serviceEndTime.getFullYear() + 1);
  
    return {
      serviceStartTime,
      serviceEndTime,
    };
  }