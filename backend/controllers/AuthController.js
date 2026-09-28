const User = require("../models/User");

exports.register = async (req, res) => {
    try {
        const { username, email, password, role, cardNo } = req.body;
        
        // 检查 Email 或 借书证号 是否已存在
        const existingUser = await User.findOne({ $or: [{ email }, { cardNo }] });
        if (existingUser) {
            return res.status(400).json({ message: "The email address or library card number has already been registered." });
        }

        const newUser = new User({
            username,
            email,
            password, // 实际项目中建议加上 bcrypt 加密
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
            return res.status(401).json({ message: "Incorrect email or password." });
        }

        // 返回用户信息（包含角色，供前端判定 admin / member）
        res.json({
            message: "Login successful.",
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