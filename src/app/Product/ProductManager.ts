import { ProductClient } from "./ProductClient";


export class ProductManager {
   
    async getProductToManager(id){
        const productClient = new ProductClient();
        const url = 'demmyUrl';
        const productManager = await productClient.getById(id)
        .catch(err=> err)
        return productManager;
    }
}