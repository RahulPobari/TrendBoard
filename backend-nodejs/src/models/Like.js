const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    //this defines the user id of liked by user
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    //this defines the object id of liked object
    likeable: {
        type: mongoose.Schema.ObjectId,
        require: true,
        refPath: 'onModel'
    },
    //this field is used for defining the type of the liked object, since this is the dynamic reference 
    onModel: {
        type: String,
        require: true,
        enum: ['Post', 'Comment']
    }
},{
    timestamps: true
});

const Like = mongoose.model('Like', likeSchema);
module.exports = Like;