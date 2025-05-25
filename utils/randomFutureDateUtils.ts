export async function getRandomFutureDate() {
      const today = new Date();
  
      // Generate a random number of days ahead (up to 365 days)
      const randomDaysAhead = Math.floor(Math.random() * 365);
      today.setDate(today.getDate() + randomDaysAhead);
  
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
  
      return `${day}.${month}.${year}`;
    }