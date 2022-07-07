let expect = require('expect');

var{generateMessage} = require('./message');

describe('Generate Message',()=>{
    if("should generate correct message object",()=>{
        let from = 'AA',
            text = "Some random text"
            message = generateMessage(from,text);
        
        expect(typeof message.createdAt).toBe('number');
        expect(message).toMatchObject({from,text});
    });
});