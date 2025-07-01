import { FiCheckCircle } from 'react-icons/fi';

export default function InvalidSurvey() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow">
          <FiCheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <h2 className="mt-4 text-xl font-bold text-gray-800">This survey has already been submitted. <br /> Thank You!</h2>
        </div>
      </div>
    );
}
