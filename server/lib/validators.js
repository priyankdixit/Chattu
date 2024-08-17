import {body,validationResult,check, param, query} from 'express-validator'
import { ErrorHandler } from '../utils/utility.js';

const validateHandler=(req,res,next)=>{
    const errors=validationResult(req)
    
    const errorMessages=errors.array().map((error)=>error.msg).join(",");
    
    console.log(errors);
    if(errors.isEmpty()) return next();
    else next(new ErrorHandler(errorMessages,400))
    }
    
    


const registerValidator=()=>[
    body("name","Please enter name").notEmpty(),
    body("bio","Please enter bio").notEmpty(),
    body("username","Please enter username").notEmpty(),
    body("password","Please enter password").notEmpty(),
    
];

const loginValidator=()=>[
    body("username","Please enter username").notEmpty(),
    body("password","Please enter password").notEmpty()
];

const newGroupValidator=()=>[
    body("name","Please enter name").notEmpty(),
    body("members").notEmpty().withMessage("Please enter Members")
    .isArray({min:2,max:100}).withMessage("members required between 2 and 100"),
];

const addMemberValidator=()=>[
    body("chatId","Please enter ChatId").notEmpty(),
    body("members").notEmpty().withMessage("Please enter Members")
    .isArray({min:1,max:97}).withMessage("members required between 1 and 97"),
];

const removeMemberValidator=()=>[
    body("chatId","Please enter ChatId").notEmpty(),
    body("userId","Please enter user id").notEmpty(),
];


const sendAttachmentsValidator=()=>[
    body("chatId","Please enter ChatId").notEmpty(),
   
];

const chatIdValidator=()=>[
    param("id","Please enter ChatId").notEmpty(),
    
];


const renameGroupValidator=()=>[
    param("id","Please enter ChatId").notEmpty(),
    body("name","Please enter new name").notEmpty(),
    
];

const sendRequestValidator=()=>[
    
    body("userId","Please enter User Id").notEmpty(),
    
];

const acceptRequestValidator=()=>[
    
    body("requestId","Please enter request Id").notEmpty(),
    body("accept").notEmpty().withMessage("Please add accept").isBoolean().withMessage("accept must be boolean"),
    
];


const adminLoginValidator=()=>[
    body("secretKey","Please enter secret key").notEmpty(),
]













export {registerValidator,validateHandler,loginValidator,newGroupValidator,addMemberValidator,removeMemberValidator,sendAttachmentsValidator,chatIdValidator,renameGroupValidator,sendRequestValidator,acceptRequestValidator,adminLoginValidator}