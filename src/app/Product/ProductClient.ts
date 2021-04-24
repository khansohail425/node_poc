export class ProductClient {
  
    async getById(id){     
        const url = 'dummyUrl';
        const response = await fetch(url);
        return await response.json();     
    }
}