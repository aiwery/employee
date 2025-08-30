import React, { useState, useEffect, useRef } from 'react';

// 封装Form组件
interface Rule {
  required?: boolean;
  message?: string;
  pattern?: RegExp;
  validator?: (value: any) => Promise<void>;
  min?: number;
  max?: number;
  type?: 'string' | 'number' | 'email' | 'url';
}

interface FormProps {
  onFinish?: (values: Record<string, any>) => void;
  onFinishFailed?: (errorInfo: any) => void;
  initialValues?: Record<string, any>;
  children: React.ReactNode;
}

interface FormItemProps {
  name: string;
  label?: string;
  rules?: Rule[];
  children: React.ReactElement;
  className?: string;
}

const FormContext = React.createContext<{
  values: Record<string, any>;
  errors: Record<string, string[]>;
  touched: Record<string, boolean>;
  onFieldChange: (name: string, value: any) => void;
  registerField: (name: string, rules: Rule[]) => void;
} | null>(null);

export const Form: React.FC<FormProps> & { Item: React.FC<FormItemProps> } = ({
  onFinish,
  onFinishFailed,
  initialValues = {},
  children,
}) => {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const rulesRef = useRef<Record<string, Rule[]>>({});

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const validateSingleRule = async (
    rule: Rule,
    value: any,
    fieldName: string
  ): Promise<void> => {
    if (
      rule.required &&
      (!value || (typeof value === 'string' && !value.trim()))
    ) {
      throw new Error(rule.message || `${fieldName}是必填项`);
    }

    if (!value) return;

    if (rule.pattern && !rule.pattern.test(value)) {
      throw new Error(rule.message || '格式不正确');
    }

    if (rule.min !== undefined && value.length < rule.min) {
      throw new Error(rule.message || `最少${rule.min}个字符`);
    }

    if (rule.max !== undefined && value.length > rule.max) {
      throw new Error(rule.message || `最多${rule.max}个字符`);
    }

    if (rule.type === 'email') {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value)) {
        throw new Error(rule.message || '请输入有效的邮箱地址');
      }
    }

    if (rule.validator) {
      await rule.validator(value);
    }
  };

  const registerField = (name: string, rules: Rule[] = []) => {
    rulesRef.current[name] = rules;
  };

  const onFieldChange = (name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));

    const rules = rulesRef.current[name] || [];
    Promise.all(
      rules.map((rule) =>
        validateSingleRule(rule, value, name).catch((err) => err.message)
      )
    ).then((results) => {
      const validationErrors = results.filter(
        (result) => typeof result === 'string'
      );
      setErrors((prev) => ({
        ...prev,
        [name]: validationErrors,
      }));
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newErrors: Record<string, string[]> = {};

      for (const [name, rules] of Object.entries(rulesRef.current)) {
        const value = values[name];
        const fieldErrors: string[] = [];

        for (const rule of rules) {
          try {
            await validateSingleRule(rule, value, name);
          } catch (error: any) {
            fieldErrors.push(error.message);
          }
        }

        if (fieldErrors.length > 0) {
          newErrors[name] = fieldErrors;
        }
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length > 0) {
        onFinishFailed?.({ values, errors: newErrors });
        return;
      }

      onFinish?.(values);
    } catch (error) {
      onFinishFailed?.(error);
    }
  };

  return (
    <FormContext.Provider
      value={{
        values,
        errors,
        touched,
        onFieldChange,
        registerField,
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {children}
      </form>
    </FormContext.Provider>
  );
};

// Form.Item 组件
const FormItem: React.FC<FormItemProps> = ({
  name,
  label,
  rules = [],
  children,
  className = '',
}) => {
  const formContext = React.useContext(FormContext);

  if (!formContext) {
    throw new Error('Form.Item must be used within Form component');
  }

  const { values, errors, touched, onFieldChange, registerField } = formContext;

  useEffect(() => {
    registerField(name, rules);
  }, [name, rules, registerField]);

  const hasError = errors[name] && errors[name].length > 0;
  const isRequired = rules.some((rule) => rule.required);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFieldChange(name, e.target.value);
  };

  const childrenWithProps = React.cloneElement(children, {
    name,
    value: values[name] || '',
    onChange: handleChange,
    className: `${children.props.className || ''} ${
      hasError ? 'border-red-500' : ''
    }`.trim(),
  });

  return (
    <div className={`form-item ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {childrenWithProps}
      {hasError && (
        <div className="mt-1">
          {errors[name].map((error, index) => (
            <p key={index} className="text-red-500 text-xs">
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

// 绑定 Form.Item
Form.Item = FormItem;

// 预定义规则
export const Rules = {
  required: (message?: string): Rule => ({
    required: true,
    message: message || '此项为必填项',
  }),

  email: (message?: string): Rule => ({
    type: 'email',
    message: message || '请输入有效的邮箱地址',
  }),

  phone: (message?: string): Rule => ({
    validator: async (value: string) => {
      const mobileRegex = /^(\+86)?1[3-9]\d{9}$/;
      const landlineRegex = /^(\d{3,4}-?)?\d{7,8}$/;
      const cleanValue = value.replace(/[\s-]/g, '');

      if (!mobileRegex.test(cleanValue) && !landlineRegex.test(value)) {
        throw new Error(message || '请输入有效的手机号码（11位）或固定电话');
      }
    },
  }),

  min: (length: number, message?: string): Rule => ({
    min: length,
    message: message || `最少${length}个字符`,
  }),

  max: (length: number, message?: string): Rule => ({
    max: length,
    message: message || `最多${length}个字符`,
  }),

  pattern: (pattern: RegExp, message?: string): Rule => ({
    pattern,
    message: message || '格式不正确',
  }),
};
