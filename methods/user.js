
import User from "../model/model.js";
import todomodel from "../model/todo.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import redis from "../redis/redis.js";
const jwtkey = "abcdefghijkdadaafbfasfsfjaf";

export const signup = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: "Please provide all required fields" });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "User already exists with this email" });
        }
        const hashpassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: name,
            email: email,
            password: hashpassword,
            role: role
        })
        await newUser.save();


        res.status(201).json({ message: "User registered successfully" })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
}


export const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(password)
    try {
        if (!email || !password) {
            return res.status(400).json({ error: "Please provide all required fields" });
        }
        const user = await User.findOne({ email });
        const isMatch = await bcrypt.compare(password, user.password);

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }
        if (!isMatch) {
            return res.status(401).json({ error: "Incorrect password" });
        }
        if (user.role !== "admin" || user.role == "user") {
            return res.status(403).json({ error: "You are not authorized to access this route" });
        }

        jwt.sign({ id: user._id }, jwtkey, { expiresIn: '3days' }, ((error, token) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: "Token error" });
            }

            res.cookie('token', token, {
                secure: true,
                httpOnly: true,
                sameSite: 'None',
            })
            res.json({ message: "Logged in successfully" })
        }))

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error", "error": error.message });
    }
}

export const logout = (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.json({ message: 'Token not found' });
        }
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            path: '/'
        });
        res.json({ message: 'Logged out successfully' });

    } catch (error) {
        return res.status(500).json({ message: "Error logging out", error: error.message });

    }
}


export const valid_user = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }


        const cachedUser = await redis.get(`user:${user._id}`);
        if (cachedUser) {
            return res.json({ message: "User found", user: JSON.parse(cachedUser) });
        }

        const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            message: "User found"   
        }

        await redis.setex(`user:${user._id}`, 3600, JSON.stringify(userData));
        res.json({user:userData})


    } catch (error) {
        res.status(500).json({ error: "Server error", error: error.message });

    }

}


export const allusertodo = async (req, res) => {
    try {
        const uid = req.params.id;

        const cachedTodos = await redis.get(`todos:${uid}`);
        if (cachedTodos) {
            return res.json({ todos: JSON.parse(cachedTodos) });
        }

        const todos = await todomodel.find({ uid: uid });

        await redis.setex(`todos:${uid}`, 3600, JSON.stringify(todos));

        res.json({ message: "Todos found", todos });

    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
        console.error('Error:', error.message);
    }
};
export const allusers = async (req, res) => {
    try {

        const cachedUsers = await redis.get("all_users");
        if (cachedUsers) {
            return res.json({message: "Users found", users: JSON.parse(cachedUsers) });
        }

        const allusers = await User.find();
        await redis.setex("all_users", 3600, JSON.stringify(allusers));

        res.json({ message: "Users found", users: allusers });

    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
        console.error('Error:', error.message);

    }
}
export const deleteuser = async (req, res) => {
    try {
        const uid = req.params.id;
        const user = await User.findByIdAndDelete(uid);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        await redis.del(`user:${uid}`);
        await redis.del("all_users");

        res.json({ message: "User deleted successfully" });

    }
    catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
        console.error('Error:', error.message);
    }
}




