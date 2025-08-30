import { Employee } from '../types/employee';

// Mock data pool - 员工数据池
const mockEmployees: Record<string, Employee> = {
  '1': {
    id: '1',
    name: '宋玉',
    title: '高级前端工程师',
    email: 'songyu@company.cn',
    phone: '13812345678',
    location: '北京市海淀区中关村',
    skills: [
      'React',
      'TypeScript',
      'Vue.js',
      'Node.js',
      'Webpack',
      'TailwindCSS',
      'Element Plus',
    ],
    bio: '拥有6年前端开发经验，专注于React和Vue生态系统。曾参与多个大型企业级项目的架构设计与开发，具备深厚的JavaScript功底和丰富的性能优化经验。热衷于技术分享，活跃于开源社区，持续关注前端技术发展动态。',
  },
  '2': {
    id: '2',
    name: '李明华',
    title: '产品经理',
    email: 'liminghua@company.cn',
    phone: '13987654321',
    location: '上海市浦东新区',
    skills: [
      '产品规划',
      '用户体验设计',
      'Axure',
      'Figma',
      '数据分析',
      '敏捷开发',
    ],
    bio: '5年产品经验，擅长B端产品设计和用户体验优化。曾负责多款千万级用户产品的产品规划和迭代，具备强烈的用户同理心和敏锐的商业嗅觉。',
  },
  '3': {
    id: '3',
    name: '王小雨',
    title: '全栈工程师',
    email: 'wangxiaoyu@company.cn',
    phone: '13765432109',
    location: '深圳市南山区',
    skills: [
      'Java',
      'Spring Boot',
      'MySQL',
      'Redis',
      'React',
      'Docker',
      'Kubernetes',
    ],
    bio: '7年全栈开发经验，熟悉前后端技术栈。在微服务架构、分布式系统设计方面有丰富经验，曾主导多个高并发系统的架构设计和性能调优。',
  },
};

// Current active employee
let currentEmployeeId = '1';

// Mock API
export async function getEmployee(id: string): Promise<Employee> {
  const employee = mockEmployees[id] || mockEmployees[currentEmployeeId];
  return Promise.resolve({ ...employee });
}

export async function getAllEmployees(): Promise<Employee[]> {
  return Promise.resolve(Object.values(mockEmployees));
}

export async function updateEmployee(
  id: string,
  data: Partial<Employee>
): Promise<Employee> {
  // 更新 mock 数据
  if (mockEmployees[id]) {
    mockEmployees[id] = { ...mockEmployees[id], ...data, id };
    console.log('Updated employee', id, mockEmployees[id]);
    return Promise.resolve({ ...mockEmployees[id] });
  }
  throw new Error(`Employee with id ${id} not found`);
}
