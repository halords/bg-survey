// src/pages/AddSurvey.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import type { Questions } from '../types';

export default function ConfigureSurvey() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [questions, setQuestions] = useState<Questions[]>([]);
  // const [isSubmitted, setIsSubmitted] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch('https://bg-survey.onrender.com/questions', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const data = await response.json();
        setQuestions(data.questions || []);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  const handleChange = (index: number, field: 'text' | 'arrange_order', value: string | number) => {
    const updated = [...questions];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setQuestions(updated);
  };

  const handleDelete = async (id: string | number) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const response = await fetch('https://bg-survey.onrender.com/questions/delete', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({id})
    });
    if(response.ok){
      const filtered = questions.filter(q => q.id !== id);
      setQuestions(filtered);
    }
  };

  const handleAddQuestion = () => {
    const maxOrder = questions.reduce((max, q) => Math.max(max, q.arrange_order), 0);
    const newQuestion = {
      id: 0, // Temporary unique ID
      text: '',
      arrange_order: maxOrder + 1,
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Missing token');

      const sorted = [...questions].sort((a, b) => a.arrange_order - b.arrange_order);

      // const payload = {
      //   questions: sorted,
      //   createdAt: new Date().toISOString(),
      // };
      // console.log(sorted);
      // return;

      const response = await fetch('https://bg-survey.onrender.com/questions/submit', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({sorted}),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Submission failed');
      }
      const data = await response.json();
      console.log(data.message);
      alert('Survey saved successfully!');
      navigate('/configure');
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to save survey');
    }
  };

  const sortedQuestions = [...questions].sort((a, b) => a.arrange_order - b.arrange_order);

  return (
    <div className="flex h-screen bg-gray-100">
      <Navbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activePage="configure"
      />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Configure Survey</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {sortedQuestions.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-md"
              >
                <div className="w-8 h-8 flex items-center justify-center font-bold text-gray-600">
                  {index + 1}
                </div>

                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => handleChange(index, 'text', e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder={`Enter question ${item.text}`}
                />
                <input
                  type="number"
                  value={item.arrange_order}
                  onChange={(e) => handleChange(index, 'arrange_order', Number(e.target.value))}
                  className="w-20 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder={`Enter question ${item.arrange_order}`}
                />
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={handleAddQuestion}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            >
              + Add Question
            </button>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                Save Survey
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
