/**
 * Created by admin on 6/10/16.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Location = new Schema({
    Id: String,
    Longtude: String,
    Latitude: String
});

module.exports = mongoose.model('Location', Location);