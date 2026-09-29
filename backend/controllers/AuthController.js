const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const { username, email, password, role, cardNo } = req.body;
        
        const existingUser = await User.findOne({ $or: [{ email }, { cardNo }] });
        if (existingUser) {
            return res.status(400).json({ message: "邮箱或借书证号已被注册" });
        }

        const newUser = new User({
            username,
            email,
            password,
            role: role || "member",
            cardNo
        });

        await newUser.save();
        res.json(newUser);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });

        if (!user) {
            return res.status(401).json({ message: "邮箱或密码错误" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, email: user.email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: `${process.env.JWT_EXPIRES_IN}h` }
        );

        res.json({
            message: "登录成功",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                cardNo: user.cardNo
            }
        });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.updateUserById = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.deleteUserById = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.sendStatus(204);
    } catch (err) {
        res.status(500).json(err);
    }
};