const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const usersFile = path.join(__dirname, '../data/users.json');

// Helper: read users
const readUsers = () => JSON.parse(fs.readFileSync(usersFile, 'utf-8'));

// Helper: save users
const saveUsers = (users) => fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
        return res.status(400).json({ success: false, message: 'All fields are required' });

    const users = readUsers();
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now(), name, email, password: hashedPassword, role: 'user' };

    users.push(newUser);
    saveUsers(users);

    const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ success: true, token, user: { name, email, role: newUser.role } });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    const users = readUsers();
    const user = users.find(u => u.email === email);
    if (!user) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ success: true, token, user: { name: user.name, email: user.email, role: user.role } });
};

exports.getMe = (req, res) => {
    const users = readUsers();
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, user: { name: user.name, email: user.email, role: user.role } });
};
