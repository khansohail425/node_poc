import { HTTP_METHODS, HTTP_CODES, AccessRight, TokenState } from '../../app/Models/ServerModels';
import { DataHandler } from '../../app/Handlers/DataHandler';

const requestMock = {
    method: HTTP_METHODS.GET.valueOf(),
    headers: {
        authorization: ''
    },
   
};

const responseMock = {
    writeHead: jest.fn(),
    write: jest.fn(),
    statusCode : 0
};

const tokenValidatorMock = {
    validateToken: jest.fn()
};

const usersDBAccessMock = {};

let dataHandler: DataHandler;

const operationAuthorizedMock = jest.fn();

beforeEach(() => {
    dataHandler = new DataHandler(
        requestMock as any,
        responseMock as any,
        tokenValidatorMock as any,
        usersDBAccessMock as any
    )
})

afterEach(() => {
    responseMock.writeHead.mockClear();
})

describe('DataHanlder test suits', () => {



    test('handleRequest with unhandle request', async () => {
        requestMock.method = 'unHandle request type';
        await dataHandler.handleRequest();
        expect(responseMock.writeHead).not.toHaveBeenCalled();
    })

    test('handleRequest with option request', async () => {
        requestMock.method = HTTP_METHODS.OPTIONS;
        await dataHandler.handleRequest();
        expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.OK);
    })

    test('operationAuthorized with authorized header is null', async () => {
        requestMock.headers.authorization = null;
        const resultAccount = await dataHandler.operationAuthorized(AccessRight.READ);
        expect(resultAccount).toBe(false)
    })

    test('operationAuthorized with authorized header and valid rigths', async () => {
        requestMock.headers.authorization = 'someToken';
        tokenValidatorMock.validateToken.mockReturnValueOnce({
            accessRights: [1, 2, 3],
            state: TokenState.VALID

        });
        const resultAccount = await dataHandler.operationAuthorized(AccessRight.READ);
        expect(resultAccount).toBe(true)
    })


    test('operationAuthorized with authorized header and invalid rigths', async () => {
        requestMock.headers.authorization = 'someToken';
        tokenValidatorMock.validateToken.mockReturnValueOnce({
            accessRights: [2, 3],
            state: TokenState.VALID

        });
        const resultAccount = await dataHandler.operationAuthorized(AccessRight.READ);
        expect(resultAccount).toBe(false)
    })

    test('operationAuthorized with authorized header and null rigths', async () => {
        requestMock.headers.authorization = 'someToken';
        tokenValidatorMock.validateToken.mockReturnValueOnce({
            accessRights: [2, 3],
            state: TokenState.VALID
        });
        const resultAccount = await dataHandler.operationAuthorized(null);
        expect(resultAccount).toBe(false)
    })

    test('operationAuthorized with authorized header with expried token', async () => {
        requestMock.headers.authorization = 'someToken';
        tokenValidatorMock.validateToken.mockReturnValueOnce({
            accessRights: [2, 3],
            state: TokenState.EXPIRED
        });
        const resultAccount = await dataHandler.operationAuthorized(AccessRight.READ);
        expect(resultAccount).toBe(false)
    })


    test('operationAuthorized with authorized header with invalid token', async () => {
        requestMock.headers.authorization = 'someToken';
        tokenValidatorMock.validateToken.mockReturnValueOnce({
            accessRights: [2, 3],
            state: TokenState.INVALID
        });
        const resultAccount = await dataHandler.operationAuthorized(AccessRight.READ);
        expect(resultAccount).toBe(false)
    })

    test('handle option with false operationAuthorized', async () => {
        requestMock.method = HTTP_METHODS.GET;
        operationAuthorizedMock.mockReturnValueOnce(false);
        dataHandler.operationAuthorized = operationAuthorizedMock;
         await dataHandler.handleRequest();
         expect(responseMock.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
         expect(responseMock.write).toBeCalledWith('Unauthorized operation!')
    })    
    
})
