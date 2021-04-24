import { ProductClient } from '../../app/Product/ProductClient';
import { ProductManager } from '../../app/Product/ProductManager';
jest.mock('../../app/Product/ProductClient')

const expectedProduct = {
    id: 1,
    name: 'football'
}

const productManager = new ProductManager();

describe('ProductManager test suits', () => {

    it('should return the product', async () => {

        const productManager = new ProductManager();
        const mockGetById = jest.fn();
        ProductClient.prototype.getById = mockGetById;
        mockGetById.mockReturnValue(Promise.resolve(expectedProduct));

        const result = await productManager.getProductToManager(1);
        expect(result.name).toBe('football');
        expect(ProductClient).toBeCalled();
    })


    it('should throw the erro', async () => {

        const getByIdMock = jest.fn();
        ProductClient.prototype.getById = getByIdMock;
        getByIdMock.mockReturnValueOnce(Promise.reject(new Error('something went worng')));
        try {
            await productManager.getProductToManager(1);
        } catch (error) {
            expect(error).toHaveProperty('message', 'something went wrong');
        }

    })

})
