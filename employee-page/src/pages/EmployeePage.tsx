import { useEffect, useState } from 'react';
import { Card, CardContent } from '../components/frame/Card';
import { Button } from '../components/frame/Button';
import { Form, Rules } from '../components/frame/Form';
import { Input } from '../components/frame/Input';
import {
  getEmployee,
  getAllEmployees,
  updateEmployee,
} from '../services/employee';
import { Employee } from '../types/employee';

export default function EmployeePage() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [currentEmployeeId, setCurrentEmployeeId] = useState<string>('1');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    // 加载当前员工信息和所有员工列表
    Promise.all([getEmployee(currentEmployeeId), getAllEmployees()]).then(
      ([currentEmployee, employees]) => {
        setEmployee(currentEmployee);
        setAllEmployees(employees);
      }
    );
  }, [currentEmployeeId]);

  const handleFormFinish = async (values: Record<string, any>) => {
    if (!employee) return;

    // 处理技能字段（将字符串转换为数组）
    const processedValues = { ...values };
    if (processedValues.skills && typeof processedValues.skills === 'string') {
      processedValues.skills = processedValues.skills
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => s);
    }

    const updated = await updateEmployee(currentEmployeeId, {
      ...employee,
      ...processedValues,
    });
    setEmployee(updated);
    setEditing(false);
  };

  const handleFormFinishFailed = (errorInfo: any) => {
    console.log('表单验证失败:', errorInfo);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleEmployeeSwitch = (employeeId: string) => {
    setCurrentEmployeeId(employeeId);
    setEditing(false); // 切换员工时退出编辑模式
  };

  if (!employee) return <div className="p-4">加载中...</div>;

  // 将技能数组转换为字符串用于表单显示
  const initialValues = {
    ...employee,
    skills: Array.isArray(employee.skills)
      ? employee.skills.join(', ')
      : employee.skills,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* 页面标题和员工选择器 */}
      <div className="max-w-4xl mx-auto px-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">员工档案</h1>
          </div>
        </div>

        {/* 员工快速切换卡片 */}
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {allEmployees.map((emp) => (
            <button
              key={emp.id}
              onClick={() => handleEmployeeSwitch(emp.id)}
              className={`flex-shrink-0 px-4 py-3 rounded-lg border transition-all duration-200 ${
                currentEmployeeId === emp.id
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <div className="text-left">
                <div className="font-medium text-sm">{emp.name}</div>
                <div
                  className={`text-xs ${
                    currentEmployeeId === emp.id
                      ? 'text-blue-100'
                      : 'text-gray-500'
                  }`}
                >
                  {emp.title}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <Card className="shadow-xl border-0">
          <CardContent className="p-0">
            {editing ? (
              <div className="p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    编辑员工信息
                  </h2>
                </div>
                <Form
                  initialValues={initialValues}
                  onFinish={handleFormFinish}
                  onFinishFailed={handleFormFinishFailed}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Form.Item
                      name="name"
                      label="姓名"
                      rules={[Rules.required()]}
                    >
                      <Input placeholder="请输入姓名" />
                    </Form.Item>

                    <Form.Item
                      name="title"
                      label="职位"
                      rules={[Rules.required()]}
                    >
                      <Input placeholder="请输入职位" />
                    </Form.Item>

                    <Form.Item
                      name="email"
                      label="邮箱"
                      rules={[Rules.required(), Rules.email()]}
                    >
                      <Input type="email" placeholder="请输入邮箱地址" />
                    </Form.Item>

                    <Form.Item
                      name="phone"
                      label="电话"
                      rules={[Rules.required(), Rules.phone()]}
                    >
                      <Input placeholder="请输入电话号码" />
                    </Form.Item>

                    <Form.Item
                      name="location"
                      label="工作地点"
                      rules={[Rules.required()]}
                    >
                      <Input placeholder="请输入工作地点" />
                    </Form.Item>

                    <Form.Item
                      name="skills"
                      label="专业技能"
                      rules={[Rules.required()]}
                    >
                      <Input placeholder="请用逗号分隔多个技能，如：React, TypeScript" />
                    </Form.Item>
                  </div>

                  <Form.Item
                    name="bio"
                    label="个人简介"
                    rules={[
                      Rules.required(),
                      Rules.min(10, '个人简介至少10个字符'),
                    ]}
                    className="mt-6"
                  >
                    <Input placeholder="请介绍一下自己的工作经验和专业背景" />
                  </Form.Item>

                  <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={handleCancel}
                    >
                      取消
                    </Button>
                    <Button type="submit">保存更改</Button>
                  </div>
                </Form>
              </div>
            ) : (
              <div>
                {/* 员工头部信息 */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12 text-white">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-6">
                      {/* 头像占位符 */}
                      <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-3xl font-bold text-white">
                          {employee.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h1 className="text-4xl font-bold mb-2">
                          {employee.name}
                        </h1>
                        <p className="text-xl text-blue-100 mb-3">
                          {employee.title}
                        </p>
                        <div className="flex items-center space-x-4 text-blue-100">
                          <span className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                            {employee.email}
                          </span>
                          <span className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                            {employee.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => setEditing(true)}
                      className="bg-white text-blue-600 border-white hover:bg-blue-50 hover:text-blue-700 font-medium px-6 py-2 shadow-md"
                    >
                      编辑资料
                    </Button>
                  </div>
                </div>

                {/* 详细信息区域 */}
                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* 基本信息 */}
                    <div className="lg:col-span-2 space-y-8">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <svg
                            className="w-5 h-5 mr-2 text-blue-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                          个人简介
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {employee.bio}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <svg
                            className="w-5 h-5 mr-2 text-blue-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          专业技能
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {(Array.isArray(employee.skills)
                            ? employee.skills
                            : []
                          ).map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 联系信息 */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        联系信息
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <svg
                            className="w-5 h-5 text-gray-400 mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                          <div>
                            <p className="text-sm text-gray-500">邮箱</p>
                            <p className="text-gray-900">{employee.email}</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <svg
                            className="w-5 h-5 text-gray-400 mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                          <div>
                            <p className="text-sm text-gray-500">电话</p>
                            <p className="text-gray-900">{employee.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <svg
                            className="w-5 h-5 text-gray-400 mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div>
                            <p className="text-sm text-gray-500">工作地点</p>
                            <p className="text-gray-900">{employee.location}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
