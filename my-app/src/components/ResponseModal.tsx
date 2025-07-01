import React from 'react';
import { FiX } from 'react-icons/fi';
import type { EmployeeProps } from '../types';

interface ResponseModal {
  isOpen: boolean;
  onClose: () => void;
  selectedEmployee: EmployeeProps[];
  questions: string[];
  name?: string;
}

const ResponseModal: React.FC<ResponseModal> = ({
  isOpen,
  onClose,
  selectedEmployee,
  questions,
  name
}) => {
  if (!isOpen) return null;
  // Calculate average per respondent
  let ratings: string[] = ['','',''];
  let totalResponses = 0;
  selectedEmployee.forEach((employee, index) => {
    if(employee.responses.length!== 0){
      let responseRating = 0;
      let totalRate = 0;
      for(const responses of employee.responses){
        totalRate += responses.rating
      }
      responseRating = (totalRate/employee.responses.length)/5*100;
      ratings[index] = responseRating.toFixed(2);
      totalResponses += responseRating;
    }
  });

  const overallRating = selectedEmployee.length === 3 ? totalResponses / selectedEmployee.length : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-red-600">
          <FiX size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-6">Responses for {name}</h2>

        <div className="overflow-x-auto">
         
          <table className="min-w-full table-auto border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-center">Question</th>
                {selectedEmployee.map((r, idx) => (
                  <th key={idx} className="border px-4 py-2 text-center">{r.fullName}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {questions.map((question, qIdx) => (
                <tr key={qIdx} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{question}</td>
                  {selectedEmployee.map((r, idx) => {
                    const response = r.responses.find(res => res.questionId === qIdx + 1);
                    return (
                      <td key={idx} className="border px-4 py-2 text-center">
                        {response ? response.rating : ' '}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr className="hover:bg-gray-50">
                <td className="border px-4 py-2">Comments (Optional)</td>
                {selectedEmployee.map((r, idx) => {
                  return (
                    <td key={idx} className="border px-4 py-2">
                      {r.comments ? r.comments : ' '}
                    </td>
                  );
                })}
              </tr>
              <tr className='bg-red-100'>
                <th className='border px-4 py-2 text-right'>Average Rating</th>
                {ratings.map((rating, idx) => {
                  return (
                    <th key={idx} className='border px-4 py-2'>
                      {rating !== "" ? rating+'%' : ''}
                    </th>
                  );
                })}
              </tr>
              <tr className='bg-red-200'>
                <th className='border px-4 py-2 text-right' colSpan={3}>Overall Rating</th>
                <th className='border px-4 py-2'>
                  {overallRating !== 0 ? overallRating.toFixed(2)+'%' : ''}
                </th>
              </tr>
            </tbody>
          </table>
          <br />
          {selectedEmployee.map((r) => {
          if (!Boolean(r.is_submitted)) {
            return (
              <div key={r.id} className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-700 font-medium mb-1">
                  Send survey link to <span className="text-blue-600">{r.fullName}</span>
                </p>
                <div className="flex items-center gap-2">
                  <a
                    href={r.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors break-all font-mono text-sm flex-1"
                  >
                    {r.link}
                  </a>
                  <button
                    onClick={() => navigator.clipboard.writeText(r.link)}
                    className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors text-sm"
                    title="Copy link"
                  >
                    📋
                  </button>
                </div>
              </div>
            );
          }
          return null;
        })}
          <br />
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResponseModal;
