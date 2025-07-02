"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuestions = exports.submitQuestions = exports.getQuestions = void 0;
const inspector_1 = require("inspector");
const getQuestions = async (req, res) => {
    const db = req.app.get('db');
    try {
        const [questions] = await db.execute("SELECT * FROM questions WHERE status != ? OR status IS NULL ORDER BY arrange_order ASC", ['deleted']);
        return res.json({
            success: true,
            questions: questions
        });
    }
    catch (error) {
        inspector_1.console.error('Error fetching questions:', error);
        return res.status(500).json({ error: 'Failed to fetch questions' });
    }
};
exports.getQuestions = getQuestions;
const submitQuestions = async (req, res) => {
    const db = req.app.get('db');
    const { sorted } = req.body;
    try {
        for (const question of sorted) {
            const [result] = await db.execute('SELECT * FROM questions WHERE id = ?', [question.id]);
            if (result.length === 0) {
                await db.execute('INSERT INTO questions (text, arrange_order) VALUES (?, ?)', [question.text, question.arrange_order]);
            }
            else {
                await db.execute('UPDATE questions SET text = ?, arrange_order = ? WHERE id = ?', [question.text, question.arrange_order, question.id]);
            }
        }
        return res.json({
            success: true,
            message: 'Updated questions',
        });
    }
    catch (error) {
        inspector_1.console.error('Error updating questions:', error);
        return res.status(500).json({ error: 'Failed to update questions' });
    }
};
exports.submitQuestions = submitQuestions;
const deleteQuestions = async (req, res) => {
    const db = req.app.get('db');
    const { id } = req.body;
    // console.log(id);
    try {
        const [result] = await db.execute('UPDATE questions SET status = ? WHERE id = ?', ['deleted', id]);
        // Check if any rows were affected
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Question not found' });
        }
        return res.json({
            success: true,
            message: 'Question marked as deleted'
        });
    }
    catch (error) {
        inspector_1.console.error('Error fetching questions:', error);
        return res.status(500).json({ error: 'Failed to fetch questions' });
    }
};
exports.deleteQuestions = deleteQuestions;
