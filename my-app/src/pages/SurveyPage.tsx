import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';

interface Question {
  id: number;
  text: string;
  rating: number | null;
}

export default function SurveyPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [employeeName, setEmployeeName] = useState('');
  const [respondentName, setRespondentName] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [comments, setComments] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refId, setRefId] = useState(0);

  useEffect(() => {
    const fetchSurveyDetails = async () => {
      try {
        const response = await fetch(`http://10.10.7.106:3001/survey/${token}`);
        const data = await response.json();

        if (data.success) {
          console.log("Survey data:", data);
          if(Boolean(data.is_submitted) === true){
              navigate('/invalid-survey');
          }
          setRefId(data.referenceId);
          setEmployeeName(data.employeeName);
          setRespondentName(data.respondentName || '');
          setQuestions(data.questions.map((q: any) => ({
            id: q.id,
            text: q.text,
            rating: null,
          })));
        } else {
          navigate('/invalid-survey');
        }
      } catch (error) {
        console.error("Error loading survey:", error);
        // navigate('/invalid-survey');
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchSurveyDetails();
    } else {
      navigate('/invalid-survey');
    }
  }, [token, navigate]);

  const handleRatingChange = (questionId: number, rating: number) => {
    setQuestions(questions.map(q =>
      q.id === questionId ? { ...q, rating } : q
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // const responses = {
    //     refId: refId,
    //     questions: questions,
    //     respondentName: respondentName,
    //     comments: comments,
    //     token: token
    // };
    // console.log(responses);
    const response = await fetch('http://10.10.7.106:3001/submit-survey', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        refId,
        questions,
        respondentName,
        comments,
        token
      })
    });
    if (response.ok) {
      setIsSubmitted(true);
      // console.log("Survey submitted:", {
      //   token,
      //   respondentName,
      //   questions,
      //   comments
      // });
    }else{
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create survey');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading survey...</p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow">
          <FiCheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <h2 className="mt-4 text-xl font-bold text-gray-800">Thank You!</h2>
          <p className="mt-2 text-gray-600">
            Your character reference for {employeeName} has been submitted successfully.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Your feedback will be handled with strict confidentiality.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-indigo-700 px-6 py-4 text-white">
          <h1 className="text-2xl font-bold">Character Reference Survey</h1>
          <p className="mt-1">For: <span className="font-medium">{employeeName}</span></p>
          <p className="mt-1">Respondent: <span className="font-medium">{respondentName}</span></p>
        </div>

        <div className="bg-blue-50 px-6 py-4 border-b">
          <h2 className="font-medium text-blue-800">Data Privacy Notice</h2>
          <p className="mt-1 text-sm text-blue-700">
            All information provided in this survey will be handled with the utmost confidentiality.
            Your responses will only be used for evaluating {employeeName}'s professional qualifications.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="space-y-6">
            {questions.map((question) => (
              <div key={question.id} className="border-b pb-6 last:border-0">
                <p className="text-sm font-medium text-gray-700 mb-3">{question.text}</p>
                <div className="flex justify-between">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <label key={rating} className="flex flex-col items-center">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        checked={question.rating === rating}
                        onChange={() => handleRatingChange(question.id, rating)}
                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="mt-1 text-xs text-gray-500">{rating}</span>
                    </label>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Comments (Optional)
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Any additional feedback about this employee..."
            />
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={questions.some(q => q.rating === null)}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
            >
              Submit Reference
            </button>
            <p className="mt-2 text-xs text-gray-500 text-center">
              By submitting, you confirm that your responses are truthful and given in good faith.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
