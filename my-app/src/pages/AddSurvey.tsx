// src/pages/AddSurvey.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FiCopy, FiCheckCircle, FiExternalLink } from 'react-icons/fi';
import type { Reference } from '../types';

export default function AddSurvey() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState('');
  const [fullName, setFullName] = useState('');
  const [position, setPosition] = useState('');
  const [references, setReferences] = useState<Reference[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isEmailed, setIsEmailed] = useState(false);
  const [newReference, setNewReference] = useState({
    fullName: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const generateUniqueToken = () => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  };

  const handleAddReference = () => {
    if (newReference.fullName.trim() === '') return;
    
    const token = generateUniqueToken();
    setReferences([
      ...references,
      {
        id: Date.now().toString(),
        fullName: newReference.fullName,
        email: newReference.email,
        link: `https://bg-survey-yv9o.vercel.app/survey/${token}`
      }
    ]);
    setNewReference({ fullName: '', email: '' });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real app, you would send this to your backend
      const surveyData = {
        employeeId,
        fullName,
        position,
        references,
        createdAt: new Date().toISOString()
      };

      // console.log('Submitting survey:', surveyData);
    const accessToken = localStorage.getItem('token');
      // Simulate API call
    const response = await fetch('https://bg-survey.onrender.com/surveys', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(surveyData)
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create survey');
    }

    const result = await response.json();
    // console.log('Survey created:', result.survey.references);    
    setIsSubmitted(true);
    const refsWithEmail = references.filter((ref) => !!ref.email);
    if (refsWithEmail.length === 0) {
      navigate('/dashboard');
    }
    setReferences(result.survey.references);
    alert('Survey created successfully!');
    // navigate('/dashboard');
    } catch (error) {
      console.error('Error creating survey:', error);
      alert('Failed to create survey');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendMail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real app, you would send this to your backend
      
    const accessToken = localStorage.getItem('token');
      // Simulate API call
    const response = await fetch('https://bg-survey.onrender.com/surveys/sendmail', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({references})
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create survey');
    }

    const result = await response.json();
    console.log('Survey created:', result);
    setIsEmailed(true);
    alert('Survey created successfully!');
    // navigate('/dashboard');
    } catch (error) {
      console.error('Error creating survey:', error);
      alert('Failed to create survey');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
  if (isEmailed) {
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 2000); // 2000 milliseconds = 2 seconds
    
    return () => clearTimeout(timer); // Clean up the timer
  }
}, [isEmailed, navigate]);
  
  if (isEmailed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow">
          <FiCheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <h2 className="mt-4 text-xl font-bold text-gray-800">
            Your character reference has been emailed successfully.
            <br />
            Thank You!
          </h2>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow">
          <form  onSubmit={handleSendMail}>
            {references.map((ref, index) => (
              <div className="mt-2">
                <div>
                  <p key={index} className="font-medium">Name: {ref.fullName}</p>
                  {ref.email && <p className="text-sm text-gray-500">{ref.email}</p>}
                </div>
                <p className="text-xs text-gray-500 mb-1">Survey Link:</p>
                <div className="flex items-center bg-gray-50 rounded p-2">
                  <a 
                    href={ref.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-800 break-all"
                  >
                    {ref.link}
                  </a>
                  <button
                    type="button"
                    onClick={() => window.open(ref.link, '_blank')}
                    className="ml-2 p-1 text-indigo-600 hover:text-indigo-800"
                    title="Open in new tab"
                  >
                    <FiExternalLink size={14} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(ref.link)}
                  className="p-2 text-indigo-600 hover:text-indigo-800"
                  title="Copy link"
                >
                  <FiCopy />
                </button>
              </div>
            ))}
            <button
              type="submit"
              className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center text-xs md:text-sm"
            >
              Send Mail
            </button>
          </form>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-gray-100">
      <Navbar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        activePage="add-survey"
      />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Survey</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Employee Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee ID <span className='text-red-600'>*</span>
                  </label>
                  <input
                    type="text"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className='text-red-600'>*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position <span className='text-red-600'>*</span>
                  </label>
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* References Section */}
              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-3">Character References (3 required)</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className='text-red-600'>*</span>
                    </label>
                    <input
                      type="text"
                      value={newReference.fullName}
                      onChange={(e) => setNewReference({
                        ...newReference,
                        fullName: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className='text-red-600'>*</span>
                    </label>
                    <input
                      type="email"
                      value={newReference.email}
                      onChange={(e) => setNewReference({
                        ...newReference,
                        email: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleAddReference}
                      disabled={!newReference.fullName}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
                    >
                      Add Reference
                    </button>
                  </div>
                </div>

                {/* Reference List with Link Preview */}
                {references.length > 0 && (
                  <div className="border rounded-md divide-y">
                    {references.map((ref) => (
                      <div key={ref.id} className="p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">Name: {ref.fullName}</p>
                            {ref.email && <p className="text-sm text-gray-500">{ref.email}</p>}
                          </div>
                          {/* <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(ref.link)}
                              className="p-2 text-indigo-600 hover:text-indigo-800"
                              title="Copy link"
                            >
                              <FiCopy />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeReference(ref.id)}
                              className="p-2 text-red-600 hover:text-red-800"
                              title="Remove"
                            >
                              <FiTrash2 />
                            </button>
                          </div> */}
                        </div>
                        
                        {/* Link Preview Section */}
                        {/* <div className="mt-2">
                          <p className="text-xs text-gray-500 mb-1">Survey Link:</p>
                          <div className="flex items-center bg-gray-50 rounded p-2">
                            <a 
                              href={ref.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-indigo-600 hover:text-indigo-800 break-all"
                            >
                              {ref.link}
                            </a>
                            <button
                              type="button"
                              onClick={() => window.open(ref.link, '_blank')}
                              className="ml-2 p-1 text-indigo-600 hover:text-indigo-800"
                              title="Open in new tab"
                            >
                              <FiExternalLink size={14} />
                            </button>
                          </div>
                        </div> */}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-sm italic text-red-500">
                  * Required input fields.
                </span>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || references.length < 3}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Survey'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}