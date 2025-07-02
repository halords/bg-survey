"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSurveyByToken = void 0;
const getSurveyByToken = async (req, res) => {
    const db = req.app.get('db');
    const { token } = req.params;
    if (!token) {
        return res.status(400).json({ success: false, message: 'Token is required' });
    }
    try {
        // Get survey reference data
        const [refRows] = await db.execute(`SELECT 
        r.id as referenceId,
        r.full_name AS respondentName, 
        s.full_name AS employeeName, 
        s.position, 
        s.employee_id,
        r.is_submitted
      FROM survey_references r 
      JOIN surveys s ON r.survey_id = s.id 
      WHERE r.token = ?`, [token]);
        if (refRows.length === 0) {
            return res.status(404).json({ success: false, message: 'Invalid survey token' });
        }
        const refData = refRows[0];
        console.log(refData);
        // Get questions
        const [questions] = await db.execute('SELECT id, text FROM questions');
        return res.json({
            success: true,
            referenceId: refData.referenceId,
            employeeId: refData.employee_id,
            employeeName: refData.employeeName,
            position: refData.position,
            respondentName: refData.respondentName,
            questions,
            is_submitted: Boolean(refData.is_submitted)
        });
    }
    catch (error) {
        console.error('Error fetching survey by token:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching survey'
        });
    }
};
exports.getSurveyByToken = getSurveyByToken;
