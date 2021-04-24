import { SessionToken } from '../../app/Models/ServerModels';
import * as Nedb from 'nedb';
import { SessionTokenDBAccess } from '../../app/Authorization/SessionTokenDBAccess';
jest.mock('nedb')

describe('SessionTokenDBAccess test suite',()=>{

    let sessionTokenDBAccess : SessionTokenDBAccess;

    const nedbMock = {
        loadDatabase : jest.fn(),
        insert : jest.fn(),
        find : jest.fn()
    }

    beforeEach(()=>{
        sessionTokenDBAccess = new SessionTokenDBAccess(
            nedbMock as any
        )
        expect(nedbMock.loadDatabase).toBeCalled();
    })

    afterEach(()=>{
        jest.clearAllMocks();
    })

    const sessionToken : SessionToken = {
        accessRights : null,
        expirationTime : null,
        tokenId : null,
        userName : null,
        valid : null
    }
   
    const someTokenId = '123';


    test('storeSessionToken with valid token', async()=>{
     nedbMock.insert.mockImplementationOnce((somwToken: any , cd: any)=>{
             cd();
     })
       await sessionTokenDBAccess.storeSessionToken(sessionToken);
       expect(nedbMock.insert).toBeCalledWith(sessionToken , expect.any(Function));
    })
    
    test('storeSessionToken with Error throw', async()=>{
        nedbMock.insert.mockImplementationOnce((somwToken: any , cd : any)=>{
                cd(()=>{
                   throw new Error('Bad Token');
                });
        })
          await expect(sessionTokenDBAccess.storeSessionToken(sessionToken)).rejects.toThrow('Bad Token');
          expect(nedbMock.insert).toBeCalledWith(sessionToken , expect.any(Function));
       })

    test('get token with result and no error', async () => {
        nedbMock.find.mockImplementationOnce((token : any , cb : any)=>{
            cb(null, [sessionToken])
        });
        const getTokenResult = await sessionTokenDBAccess.getToken(someTokenId);
        expect(getTokenResult).toBe(sessionToken);
        expect(nedbMock.find).toBeCalledWith({ tokenId: someTokenId }, expect.any(Function));
    });


    test('get token with no result and no error', async () => {
        nedbMock.find.mockImplementationOnce((token:any , cb : any)=>{
       cb(null,[])
        });
        const getTokenResult = await sessionTokenDBAccess.getToken(someTokenId);
        expect(getTokenResult).toBeNull;
        expect(nedbMock.find).toBeCalledWith({ tokenId: someTokenId }, expect.any(Function));
    });


    test('get token with error', async () => {
    
        nedbMock.find.mockImplementationOnce((token:any,cb:any)=>{
             cb(new Error("something went wrong"), [])
        });
        await expect(sessionTokenDBAccess.getToken(someTokenId)).rejects.toThrow("something went wrong");
        expect(nedbMock.find).toBeCalledWith({ tokenId: someTokenId }, expect.any(Function));
    });


});
