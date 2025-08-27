import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Form, validators } from '../components/ui/Form';
import { getEmployee, updateEmployee } from '../services/employee';
import { Employee } from '../types/employee';

export default function EmployeePage() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    getEmployee('1').then(setEmployee);
  }, []);

  const handleFormSubmit = async (formData: Record<string, any>) => {
    if (!employee) return;
    const updated = await updateEmployee(employee.id, {
      ...employee,
      ...formData,
    });
    setEmployee(updated);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  // 定义表单字段
  const formFields = [
    { name: 'name', label: '姓名', required: true },
    { name: 'title', label: '职位', required: true },
    {
      name: 'email',
      label: '邮箱',
      type: 'email',
      required: true,
      validation: validators.email,
    },
    {
      name: 'phone',
      label: '电话',
      required: true,
      validation: validators.phone,
    },
    { name: 'location', label: '地址', required: true },
    { name: 'skills', label: '技能', required: true },
    { name: 'bio', label: '个人简介', required: true },
  ];

  if (!employee) return <div className="p-4">加载中...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl shadow-xl rounded-2xl">
        <CardContent className="p-6 space-y-4">
          {editing ? (
            <Form
              fields={formFields}
              initialData={employee}
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
            />
          ) : (
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">{employee.name}</h1>
              <p className="text-gray-600">{employee.title}</p>
              <p>
                <span className="font-medium">邮箱:</span> {employee.email}
              </p>
              <p>
                <span className="font-medium">电话:</span> {employee.phone}
              </p>
              <p>
                <span className="font-medium">地址:</span> {employee.location}
              </p>
              <p>
                <span className="font-medium">技能:</span>{' '}
                {employee.skills.join(', ')}
              </p>
              <p className="text-gray-700">{employee.bio}</p>
              <Button onClick={() => setEditing(true)}>编辑</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
