import * as Nedb from 'nedb';
import { SessionTokenDBAccess } from '../../app/Authorization/SessionTokenDBAccess';
jest.mock('nedb')
import { UsersDBAccess } from '../../app/Data/UsersDBAccess';
import { User } from '../../app/Models/UserModels';

let usersDBAccess: UsersDBAccess;

let superUser: User = {
    age: null,
    email: null,
    id: 'someId',
    name: 'someUser',
    workingPosition: null
};

const someUserName = 'someUser';


const nedbMock = {
    loadDatabase: jest.fn(),
    insert: jest.fn(),
    find: jest.fn()
}

beforeEach(() => {
    usersDBAccess = new UsersDBAccess(
        nedbMock as any
    )
    expect(nedbMock.loadDatabase).toBeCalled();
})

afterEach(() => {
    jest.clearAllMocks();
})


test('put user with valid token', async () => {
    nedbMock.insert.mockImplementationOnce((superUser: any, cd: any) => {
        cd();
    })
    await usersDBAccess.putUser(superUser);
    expect(nedbMock.insert).toBeCalledWith(superUser, expect.any(Function));
})

test('put user with Error throw', async () => {
    nedbMock.insert.mockImplementationOnce((superUser: any, cd: any) => {
        cd(() => {
            throw new Error('Bad Token');
        });
    })
    await expect(usersDBAccess.putUser(superUser)).rejects.toThrow('Bad Token');
    expect(nedbMock.insert).toBeCalledWith(superUser, expect.any(Function));
})




test('getUsernameByname with valid username', async () => {
    const regEx = new RegExp(someUserName);
    nedbMock.find.mockImplementationOnce((name: any, cb: any) => {
        cb(null, [superUser])
    });
    const getUserResult = await usersDBAccess.getUsersByName(someUserName);
    const user = getUserResult[0];
    expect(user).toBe(superUser);
   expect(nedbMock.find).toBeCalledWith({ name: regEx }, expect.any(Function));
})

test('getUsernameByname with error', async () => {
    const regEx = new RegExp(someUserName);
    nedbMock.find.mockImplementationOnce((name: any, cb: any) => {
        cb(new Error("something went wrong"), null)
    });
    await expect(usersDBAccess.getUsersByName(someUserName)).rejects.toThrow("something went wrong");
    expect(nedbMock.find).toBeCalledWith({name:regEx}, expect.any(Function));
});








