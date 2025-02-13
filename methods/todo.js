import User from "../model/model.js";
import todomodel from "../model/todo.js";

export const addtodo = async (req, res) => {
    const { title, description, dueDays, time } = req.body; 
    try {
        if (!title || !description || !dueDays || !time) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }
        const newTodo = new todomodel({ title, description, dueDays, time, uid: req.user.id });
        await newTodo.save();
        res.status(201).json(newTodo);  
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const updatetodo = async (req, res) => {
    const todoid = req.params.id;
    try {
        const updatedata = await todomodel.findByIdAndUpdate(todoid, req.body, { new: true });
        if (!updatedata) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.json({ message: "Todo Update successfully" })

    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error(error.message)
    }
}

export const deletetodo = async (req, res) => {
    const todoid = req.params.id;
    try {
        const deletedata = await todomodel.findByIdAndDelete(todoid);
        if (!deletedata) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.json({ message: "Todo Delete successfully" })

    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error(error.message)
    }
}
export const alltodos = async (req, res) => {
    try {
        const todos = await todomodel.find({});
        if (!todos) {
            return res.status(404).json({ message: 'Todos not found' });
        }
        res.status(201).json({ message: "todos", todos })

    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error(error.message)

    }

}

export const usertodos = async(req,res)=>{
        try {
            const uid = req.params.id;
    
            const todos = await todomodel.find({uid}) // Convert to plain JSON
    
            res.json({ message: "Todos found", todos });
    
        } catch (error) {
            res.status(500).json({ error: error.message });
            console.error(error.message);
        }
    };
