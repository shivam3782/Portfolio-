const mongoose = require('mongoose');
const defaults = require('../../shared/profile.json');
// Mixed is limited to the nested display content validated by profileValidation.
const schema = new mongoose.Schema({ key: { type: String, unique: true, default: 'owner' }, content: { type: mongoose.Schema.Types.Mixed, default: () => defaults } }, { timestamps: true });
module.exports = mongoose.model('Profile', schema);
