import React, { useState, useEffect } from 'react';
import { Input } from './Input';
import { Button } from './Button';

interface FormField {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  validation?: (value: string) => string | null;
}

interface FormProps {
  fields: FormField[];
  initialData: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  onCancel: () => void;
}

export const Form: React.FC<FormProps> = ({
  fields,
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 初始化表单数据
  useEffect(() => {
    const initialFormData: Record<string, string> = {};
    fields.forEach((field) => {
      const value = initialData[field.name];
      if (Array.isArray(value)) {
        initialFormData[field.name] = value.join(', ');
      } else {
        initialFormData[field.name] = value || '';
      }
    });
    setFormData(initialFormData);
  }, [fields, initialData]);

  // 验证单个字段
  const validateField = (field: FormField, value: string): string | null => {
    // 必填验证
    if (field.required && !value.trim()) {
      return `${field.label}是必填项`;
    }

    // 自定义验证
    if (field.validation && value.trim()) {
      return field.validation(value);
    }

    return null;
  };

  // 处理输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 实时验证
    const field = fields.find((f) => f.name === name);
    if (field) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [name]: error || '' }));
    }
  };

  // 验证整个表单
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach((field) => {
      const value = formData[field.name] || '';
      const error = validateField(field, value);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // 检查表单是否可以提交
  const isFormValid = (): boolean => {
    return fields.every((field) => {
      const value = formData[field.name] || '';
      return validateField(field, value) === null;
    });
  };

  // 处理提交
  const handleSubmit = () => {
    if (validateForm()) {
      // 处理技能字段（将字符串转换为数组）
      const processedData: Record<string, any> = { ...formData };
      if (processedData.skills && typeof processedData.skills === 'string') {
        processedData.skills = processedData.skills
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s);
      }
      onSubmit(processedData);
    }
  };

  return (
    <div className="space-y-3">
      {fields.map((field) => (
        <div key={field.name}>
          <Input
            label={field.label + (field.required ? ' *' : '')}
            name={field.name}
            type={field.type || 'text'}
            value={formData[field.name] || ''}
            onChange={handleChange}
            className={errors[field.name] ? 'border-red-500' : ''}
          />
          {errors[field.name] && (
            <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
          )}
        </div>
      ))}

      <div className="flex space-x-2 pt-2">
        <Button onClick={handleSubmit} disabled={!isFormValid()}>
          保存
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          取消
        </Button>
      </div>
    </div>
  );
};

// 常用验证函数
export const validators = {
  email: (value: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : '请输入有效的邮箱地址';
  },

  phone: (value: string): string | null => {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(value) ? null : '请输入有效的电话号码';
  },
};
