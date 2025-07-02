"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const survey_routes_1 = __importDefault(require("./routes/survey.routes"));
const employee_routes_1 = __importDefault(require("./routes/employee.routes"));
const surveytoken_routes_1 = __importDefault(require("./routes/surveytoken.routes"));
const submitSurvey_routes_1 = __importDefault(require("./routes/submitSurvey.routes"));
const questions_routes_1 = __importDefault(require("./routes/questions.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5170", // Local dev
        "https://bg-survey-yv9o-2qxp7epct-halords-projects.vercel.app" // Production
    ],
    credentials: true, // Enable cookies/auth headers
}));
app.use(body_parser_1.default.json());
// Inject db into app context
app.set('db', db_1.default);
// Routes
app.use('/', auth_routes_1.default); // Mount auth routes
app.use('/surveys', survey_routes_1.default);
app.use('/employees', employee_routes_1.default); // Add this line
app.use('/survey', surveytoken_routes_1.default); // Add this line
app.use('/submit-survey', submitSurvey_routes_1.default); // Add this line
app.use('/questions', questions_routes_1.default); // Add this line
// Serve static files from React dist folder - ONLY IN PRODUCTION
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '..', 'my-app', 'dist')));
//   // Catch-all for SPA (must come last!)
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '..', 'my-app', 'dist', 'index.html'));
//   });
// }
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
});
const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
