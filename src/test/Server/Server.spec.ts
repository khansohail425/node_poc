import { LoginHandler } from '../../app/Handlers/LoginHandler';
jest.mock('../../app/Handlers/LoginHandler')
import { DataHandler } from '../../app/Handlers/DataHandler';
jest.mock('../../app/Handlers/DataHandler')
import { Authorizer } from '../../app/Authorization/Authorizer';
jest.mock('../../app/Authorization/Authorizer');
import { UsersDBAccess } from '../../app/Data/UsersDBAccess';
import {Server} from '../../app/Server/Server';

jest.mock('http',()=>({
    createServer:(cd:any)=>{
      cd(requestMock,responseMock)
      return listenMock;
    }
}))

const requestMock = {
    url:''
};
const responseMock = {
    end : jest.fn()
};
const listenMock = {
    listen: jest.fn()
};

describe('Server test suits',()=>{

    afterEach(()=>{
        jest.clearAllMocks();
    })

    test.only('should start with port 8080', ()=>{
        new Server().startServer();
        expect(listenMock.listen).toBeCalledWith(8080);
        expect(responseMock.end).toBeCalled();
    })


    test('should call login handler handleRequest', ()=>{
        requestMock.url = 'http://localhost:8080/login';
        const handleRequestSpy = jest.spyOn(LoginHandler.prototype , 'handleRequest');
        new Server().startServer();
        expect(handleRequestSpy).toBeCalled();
        expect(LoginHandler).toBeCalledWith(requestMock,responseMock,expect.any(Authorizer));
    })

    test('should call data handler handleRequest', ()=>{
        requestMock.url = 'http://localhost:8080/users';
        const handleRequestSpy = jest.spyOn(DataHandler.prototype , 'handleRequest');
        new Server().startServer();
        expect(handleRequestSpy).toBeCalled();
        expect(DataHandler).toBeCalledWith(requestMock,responseMock,expect.any(Authorizer),expect.any(UsersDBAccess));
        })

})

