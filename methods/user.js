
import User from "../model/model.js";
import todomodel from "../model/todo.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import redis from "../redis/redis.js";
import nodemailer from "nodemailer";
const jwtkey = "abcdefghijkdadaafbfasfsfjaf";

export const signup =  async (req, res) => {
    const { name,email,password,role } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        if(password.length < 8){
            return res.status(400).json({ message: "Password should be at least 8 characters long" });
        }
        console.log(email);

        const sendotp = await sendOTP(email);
        if (!sendotp.success) {
            console.log(sendotp)
            return res.status(500).json({ message: sendotp.message });
        }

        res.status(200).json({ message: 'OTP sent successfully' });



    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'yt781703@gmail.com',  // <-- Your Gmail
        pass: 'rflp zlok pcyd iewa'   // <-- Your Gmail App Password
    }
});

const otpStore = {};
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const sendOTP = async (email) => {
    try {
        const otp = generateOTP();
        otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // 5-minute expiration

        const mailOptions = {
            from: 'yt781703@gmail.com',
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP is ${otp}. It will expire in 5 minutes.`
        };

        await transporter.sendMail(mailOptions);
        return { success: true, message: 'OTP sent successfully', otp };
    } catch (error) {
        console.error("Error sending OTP:", error); 
        return { success: false, message: 'Error sending OTP', error: error.message };
    }
};


export const verify  = async (req, res) => {
    const { name, email, otp, password,role} = req.body;
    try {
        if (!otpStore[email]) {
            return res.status(400).json({ message: 'No OTP sent to this email' });
        }

        const { otp: storedOtp, expiresAt } = otpStore[email];

        if (Date.now() > expiresAt) {
            delete otpStore[email]; 
            return res.status(400).json({ message: 'OTP has expired' });
        }
        console.log(typeof((storedOtp)), typeof(otp));


        if ((Number)(storedOtp) !== otp) {
            console.log(typeof((storedOtp)), typeof(otp));
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        const hashpass = await bcrypt.hash(password, 10);  

        const newUser = new User({
            name,
            email,
            password: hashpass,
            role
        });
        await newUser.save();

        res.status(200).json({ success: true, message: 'User signed up successfully', name: newUser.name });

    } catch (error) {
        console.error("Error verifying OTP:", error); // Log error for debugging
        res.status(500).json({ success: false, message: 'Error verifying OTP', error: error.message });
    }
};


export const login = async (req, res) => {
    const { email, password } = req.body;
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

export const logout = async(req, res) => {
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
      redis.del('user:');
      redis.del("todos:");
      redis.del("todos:");
      redis.del("allTodos");    
      redis.del("all_users");
      redis.del("userTodos:");
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

        const cachedUser = await redis.get(`user:`);
     

        if (cachedUser) {
            try {
                const parsedUser = cachedUser;
                return res.json({ message: "User found", user: parsedUser });
            } catch (error) {
                console.error("Error parsing cached user:", error);
                return res.status(500).json({ error: "Invalid JSON in cache" });
            }
        }
        const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            message: "User found"   
        };

        await redis.setex(`user:`, 3600, JSON.stringify(userData));

        res.json({ user: userData });

    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
};


export const allusertodo = async (req, res) => {
    try {
        const uid = req.params.id;

        const cachedTodos = await redis.get(`todos:${uid}`);
        if (cachedTodos) {
            return res.json({ todos: JSON.parse(cachedTodos) });
        }
        const todos = await todomodel.find({ uid: uid });
        await redis.setex(`todos:`, 3600, JSON.stringify(todos));

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
            return res.json({message: "Users found", users:cachedUsers });
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
        await redis.del(`user :`);
        await redis.del("all_users");

        res.json({ message: "User deleted successfully" });

    }
    catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
        console.error('Error:', error.message);
    }
}




