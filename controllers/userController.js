const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')


const updateUser = async (req, res) => {
    const {userId} = req.user;

    const {name, lastName, location, email} = req.body;

    if(!name || !lastName || !location || !email){
        throw new BadRequestError('Please provide all fields');
    
    }

    const user = await User.findByIdAndUpdate
    (userId, {name, lastName, location, email},
    {new: true, runValidators: true}
    );

    await user.save();

    const token = user.createJWT();

    res.status(StatusCodes.OK).json({user: {name: user.name, 
        lastName: user.lastName, 
        location: user.location, 
        email: user.email}
        , token});

}

module.exports = {updateUser};