const validateEditProfileData = (req) => {
const allowedEditFields = ['fname', 'lname', 'email', 'age', 'gender', 'bio'];
const editFields = Object.keys(req.body);
const isValidEdit = editFields.every((field) => allowedEditFields.includes(field));
 return isValidEdit;

}
module.exports = {validateEditProfileData};