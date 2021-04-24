import { LoginHandler } from "../../app/Handlers/LoginHandler"
import { HTTP_CODES, HTTP_METHODS, SessionToken } from "../../app/Models/ServerModels";
import { Utils } from "../../app/Utils/Utils";



describe('LoginHandler test suite', ()=>{

    let loginHandler : LoginHandler;
    const requestMock = {
        method : ''
    };
    const responseMoke = {
        writeHead : jest.fn(),
        write : jest.fn(),
        statusCode : 0
    };
    const authorizerMock = {
        generateToken : jest.fn()
    };

    const getRequestBodyMock = jest.fn();

    const sessionToken: SessionToken = {
        accessRights:[1,2,3],
        expirationTime: new Date(),
        tokenId:'someToken',
        userName:'someuser',
        valid:true
    };

    beforeEach(()=>{
        loginHandler = new LoginHandler(
            requestMock as any,
            responseMoke as any,
            authorizerMock as any
        )

        Utils.getRequestBody = getRequestBodyMock;
    })

    afterEach(()=>{
        responseMoke.writeHead.mockClear();
        responseMoke.write.mockClear();
    })



    test('hanlderREquest with option request',async ()=>{
         requestMock.method = HTTP_METHODS.OPTIONS;
       await  loginHandler.handleRequest();
       expect(responseMoke.writeHead).toBeCalledWith(HTTP_CODES.OK)
    })

    test('hanlderREquest with not invalid method type ',async ()=>{
        requestMock.method = 'someRandomMethod';
      await  loginHandler.handleRequest();
      expect(responseMoke.writeHead).not.toHaveBeenCalled();
   })

   test('hanlderREquest with post method with invalid token',async ()=>{
    requestMock.method = HTTP_METHODS.POST;
    getRequestBodyMock.mockReturnValueOnce({
        username: 'someUsername',
        password: 'demoPassword'
    })
  authorizerMock.generateToken.mockReturnValueOnce(null);
  await  loginHandler.handleRequest();
  expect(responseMoke.statusCode).toBe(HTTP_CODES.NOT_fOUND);
  expect(responseMoke.write).toBeCalledWith('wrong username or password');
})

test('hanlderREquest with post method with valid token',async ()=>{
    requestMock.method = HTTP_METHODS.POST;
    getRequestBodyMock.mockReturnValueOnce({
        username: 'someUsername',
        password: 'demoPassword'
    })
   authorizerMock.generateToken.mockReturnValueOnce(sessionToken);
  await  loginHandler.handleRequest();
  expect(responseMoke.writeHead).toBeCalledWith(HTTP_CODES.CREATED, { 'Content-Type': 'application/json' });
  expect(responseMoke.statusCode).toBe(HTTP_CODES.CREATED);
  expect(responseMoke.write).toBeCalledWith(JSON.stringify(sessionToken))
})


test('hanlderREquest with post method with unexpected error',async ()=>{
    requestMock.method = HTTP_METHODS.POST;
    getRequestBodyMock.mockRejectedValueOnce(new Error('bad request'))
  await  loginHandler.handleRequest();
  expect(responseMoke.statusCode).toBe(HTTP_CODES.INTERNAL_SERVER_ERROR);
  expect(responseMoke.write).toBeCalledWith('Internal error: ' + 'bad request')
})

})