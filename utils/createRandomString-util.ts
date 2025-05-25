export default class CreateRandomString {
    static async generateRandomString (length: number, type: 'alphanumeric' | 'alpha' | 'numeric' = 'alphanumeric'): Promise<string> {
       
        let chars = '';
    
        switch (type) {
          case 'alpha':
            chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            break;
          case 'numeric':
            chars = '0123456789';
            break;
          case 'alphanumeric':
          default:
            chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            break;
        }

        let result = '';
        for (let i = 0; i < length; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
    
        return result;
    
    }
}