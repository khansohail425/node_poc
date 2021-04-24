import {Launcher} from '../app/Launcher';
import { Server } from '../app/Server/Server';
import {mocked} from 'ts-jest/utils/'

jest.mock('../app/Server/Server',()=>{
    return {
        Server:jest.fn(()=>{
            return {
                startServer: ()=>{
                    console.log('A fake server is started');
                }
            }
        })
    }
})

describe('Launcher test suitd', ()=>{

const mockedServer = mocked(Server , true);

test('create server',()=>{
  new Launcher();
  expect(mockedServer).toBeCalled();
})


test('Called lunchApp method',()=>{
   const launchAppMock = jest.fn();
  Launcher.prototype.launchApp = launchAppMock;
  new Launcher().launchApp();
  expect(launchAppMock).toBeCalled();
}
)});

