import { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import ResponseModal from '../components/ResponseModal';
import type { Employeed, SelectedEmployee } from '../types';
import { FiUsers } from 'react-icons/fi';

export default function Dashboard() {
  const [selectedEmployee, setSelectedEmployee] = useState<SelectedEmployee | null>(null);
  const [employees, setEmployees] = useState<Employeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://bg-survey.onrender.com/employees', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const filtered = useMemo(() => {
    return employees.filter((e) =>
      e.fullName.toLowerCase().includes(search.toLowerCase()) ||
      e.position.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, employees]);

  const paginated = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [page, filtered]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activePage="dashboard" />

      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Employee Dashboard</h1>

        <input
          type="text"
          placeholder="Search name or position..."
          className="px-4 py-2 border border-gray-300 rounded mb-4 w-full max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="bg-white rounded shadow overflow-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">No.</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Position</th>
                  <th className="px-4 py-3">Refs</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginated.map((employee, index) => {
                  const totalRating = employee.ref.reduce((acc, ref) => {
                    if (ref.responses?.length === 3) {
                      const sum = ref.responses.reduce((s, r) => s + r.rating, 0);
                      return acc + sum;
                    }
                    return acc;
                  }, 0);

                  const totalResponses = employee.ref.reduce((acc, ref) => {
                    return acc + (ref.responses?.length === 3 ? ref.responses.length : 0);
                  }, 0);

                  const rating =
                    totalResponses > 0 ? (totalRating / totalResponses).toFixed(1) : 'N/A';

                  return (
                    <tr key={employee.id}>
                      <td className="px-4 py-2">{(page - 1) * itemsPerPage + index + 1}</td>
                      <td className="px-4 py-2">{employee.fullName}</td>
                      <td className="px-4 py-2">{employee.position}</td>
                      <td className="px-4 py-2">{employee.ref.length}</td>
                      <td className="px-4 py-2">
                        <span className="text-green-700 font-semibold bg-green-100 px-2 py-1 rounded text-xs">
                          {rating}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() =>
                            setSelectedEmployee({
                              employeeref: employee.ref,
                              questions: employee.questions,
                              name: employee.fullName,
                            })
                          }
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center text-xs"
                        >
                          <FiUsers className="mr-1" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center p-4 text-sm">
              <p>
                Showing {Math.min((page - 1) * itemsPerPage + 1, filtered.length)}–
                {Math.min(page * itemsPerPage, filtered.length)} of {filtered.length}
              </p>
              <div className="space-x-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  disabled={page * itemsPerPage >= filtered.length}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        <ResponseModal
          isOpen={!!selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          selectedEmployee={selectedEmployee?.employeeref || []}
          questions={selectedEmployee?.questions || []}
          name={selectedEmployee?.name || ''}
        />
      </div>
    </div>
  );
}
