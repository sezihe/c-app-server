const yup = require('yup');
const passwordValidator = require('password-validator');

exports.signUpValidator = async (req, res, next) => {
    // validate data
    const yupSchema = yup.object().shape({
        // fname validation.
        fname: yup.string().trim()
            .matches(/[\w\-]/i, "INVALID_FNAME_CHARS")
            .min(3, "INVALID_FNAME_MIN")
            .max(50, "INVALID_FNAME_MAX")
            .required("INVALID_FNAME_REQ"),

        // lname validation.
        lname: yup.string().trim()
            .matches(/[\w\-]/i, "INVALID_LNAME_CHARS")
            .min(3, "INVALID_LNAME_MIN")
            .max(50, "INVALID_LNAME_MAX")
            .required("INVALID_LNAME_REQ"),

        // email validation.    
        email: yup.string().trim()
            .min(5, "INVALID_EMAIL_MIN")
            .email("INVALID_EMAIL")
            .required("INVALID_EMAIL_REQ"),

        // password validation. 
        password: yup.string().trim()
            .min(6, "INVALID_PASS_LENGTH")
            .required("INVALID_PASS_REQ"),
    });

    // validate password
    const passValidatorSchema = new passwordValidator();

    // add properties
    passValidatorSchema
        .has().uppercase()
        .has().lowercase()
        .has().digits()
        .has().symbols();

    // validate password with the schema
    const validPassword = passValidatorSchema.validate(req.body.password, { list: true });


    // check for errors and return the errors.
    const { fname, lname, email, password } = req.body;
    try {
        // use schema to validate request
        await yupSchema.validate({
            fname,
            lname,
            email,
            password,
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }


    // check for password validation error
    if (validPassword.length > 0) {
        switch (validPassword[0]) {
            case "uppercase":
                return res.status(400).json({
                    errId: "INVALID_PASS_UCASE",
                    errMessage: "Password must contain an UpperCase Letter",
                });
            case "lowercase":
                return res.status(400).json({
                    errId: "INVALID_PASS_LCASE",
                    errMessage: "Password must contain an LowerCase Letter",
                });
            case "digits":
                return res.status(400).json({
                    errId: "INVALID_PASS_NUM",
                    errMessage: "Password must contain a Number",
                });
            case "symbols":
                return res.status(400).json({
                    errId: "INVALID_PASS_SYMBOLS",
                    errMessage: "Password must contain a Special Character",
                });
            default:
                return res.status(400).json({
                    errId: "INVALID_PASS_ALL",
                    errMessage: "Password must contain at least: 1 Capital letter & Small letter, 1 Special character and a number",
                });
        }
    }

    next();

}

exports.signInValidator = async (req, res, next) => {
    // validate data
    const yupSchema = yup.object().shape({
        // email validation.    
        email: yup.string().trim()
            .min(5, "INVALID_EMAIL_MIN")
            .email("INVALID_EMAIL")
            .required("INVALID_EMAIL_REQ"),
    });

    // check for errors and return the errors.
    const { email, password } = req.body;
    try {
        // use schema to validate request
        await yupSchema.validate({
            email,
            password,
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }

    next();
}