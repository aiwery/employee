import { Employee } from '../types/employee';

// Mock data storage
let mockEmployee: Employee = {
  id: '1',
  name: 'Alice Johnson',
  title: 'Software Engineer',
  email: 'alice.johnson@example.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  skills: ['React', 'TypeScript', 'TailwindCSS', 'Node.js'],
  bio: 'Passionate software engineer with 5+ years of experience in frontend and full-stack development.',
};

// Mock API
export async function getEmployee(id: string): Promise<Employee> {
  return Promise.resolve({ ...mockEmployee });
}

export async function updateEmployee(
  id: string,
  data: Partial<Employee>
): Promise<Employee> {
  // 更新 mock 数据
  mockEmployee = { ...mockEmployee, ...data, id };
  console.log('Updated employee', id, mockEmployee);
  return Promise.resolve({ ...mockEmployee });
}
