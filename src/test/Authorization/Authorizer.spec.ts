import { SessionTokenDBAccess } from '../../app/Authorization/SessionTokenDBAccess';
import { Authorizer } from '../../app/Authorization/Authorizer'
import { UserCredentialsDbAccess } from '../../app/Authorization/UserCredentialsDbAccess';
import { SessionToken } from '../../app/Models/ServerModels';
jest.mock("../../app/Authorization/SessionTokenDBAccess");
jest.mock("../../app/Authorization/UserCredentialsDbAccess");
describe('Authorizer test suite', () => {

    let authorizer: Authorizer;

    const sessionTokenDBAccessMock = {
        storeSessionToken: jest.fn()
    };

    const userCredentialsDbAccessMock = {
        getUserCredential: jest.fn(),
    };

    beforeEach(() => {
        authorizer = new Authorizer(
            sessionTokenDBAccessMock as any,
            userCredentialsDbAccessMock as any
        )
    })

    afterEach(()=>{
        sessionTokenDBAccessMock.storeSessionToken.mockClear();
        userCredentialsDbAccessMock.getUserCredential.mockClear();
    })

    test('constructor arguments', () => {
        new Authorizer();
        expect(SessionTokenDBAccess).toBeCalled();
        expect(UserCredentialsDbAccess).toBeCalled();
    })


    test('generate token with valid credaintial', async () => {
       
        jest.spyOn(global.Math,'random').mockImplementationOnce(()=> 0);
        jest.spyOn(global.Date,'now').mockImplementationOnce(()=> 0);

        const someAccount = {
            username: "user1",
             password : "pass"
        }

         userCredentialsDbAccessMock.getUserCredential.mockReturnValueOnce({
            username:"user1",
            accessRights: [1,2,3]
        });

        const expectedSessionToken: SessionToken = {
            accessRights: [1,2,3],
            expirationTime : new Date(60*60*1000) ,
            userName: "user1",
            valid: true,
            tokenId: ''
        }
        const sessionToken = await authorizer.generateToken(someAccount);
        expect(sessionToken).toEqual(expectedSessionToken);
    })
})