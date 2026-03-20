# Doubao 模型回答 - Prompt 1 基础浏览器自动化操作

**评测日期**: 2026-03-20  
**模型名称**: Doubao (doubao-seed-code-dogfood-2.1.1)  
**得分**: 83/100 (等级 A)  
**备注**: 基准模型

---

## 完整回答

```typescript
import { test, expect } from '@playwright/test';

const TODO_URL = 'https://demo.playwright.dev/todomvc';

test.describe('基础浏览器自动化操作考核', () => {
  test.describe.configure({ mode: 'serial' });

  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    await page.close();
  });

  // ========== 1. 页面导航测试 ==========
  test('1. 页面导航测试', async () => {
    console.log('=== 步骤 1: 页面导航 ===');
    
    await page.goto(TODO_URL, {
      waitUntil: 'domcontentloaded'
    });
    
    console.log('✓ 页面 DOM 内容已加载');
    
    await page.waitForLoadState('networkidle');
    console.log('✓ 网络请求已空闲');
    
    const title = await page.title();
    console.log(`页面标题：${title}`);
    expect(title).toContain('TodoMVC');
    
    const mainHeading = page.getByRole('heading', { name: /todomvc/i });
    await expect(mainHeading).toBeVisible();
    console.log('✓ 页面标题元素可见');
  });

  // ========== 2. 元素交互测试 ==========
  test('2. 元素交互测试 - 添加待办事项', async () => {
    console.log('=== 步骤 2: 元素交互 ===');
    
    const todoInput = page.getByPlaceholder('What needs to be done?');
    await expect(todoInput).toBeVisible();
    
    const todoText = 'Buy groceries';
    await todoInput.fill(todoText);
    console.log(`✓ 已输入待办事项：${todoText}`);
    
    await todoInput.press('Enter');
    console.log('✓ 已按 Enter 键提交');
    
    const todoItem = page.getByText(todoText);
    await expect(todoItem).toBeVisible();
    console.log('✓ 待办事项已添加并可见');
  });

  // ========== 3. 表单操作测试 ==========
  test('3. 表单操作测试 - 标记完成', async () => {
    console.log('=== 步骤 3: 表单操作 ===');
    
    const firstTodo = page.locator('.todo-list li').first();
    const checkbox = firstTodo.getByRole('checkbox');
    
    await checkbox.check();
    console.log('✓ 已勾选第一个待办事项');
    
    await expect(firstTodo).toHaveClass(/completed/);
    console.log('✓ 验证已完成状态');
  });

  // ========== 4. 动态内容处理测试 ==========
  test('4. 动态内容处理测试 - 过滤待办事项', async () => {
    console.log('=== 步骤 4: 动态内容处理 ===');
    
    // 添加更多待办事项
    const todoInput = page.getByPlaceholder('What needs to be done?');
    await todoInput.fill('Walk the dog');
    await todoInput.press('Enter');
    
    await todoInput.fill('Read a book');
    await todoInput.press('Enter');
    
    console.log('✓ 已添加更多待办事项');
    
    // 点击 Active 过滤器
    const activeFilter = page.getByRole('link', { name: 'Active' });
    await activeFilter.click();
    console.log('✓ 已点击 Active 过滤器');
    
    await page.waitForLoadState('networkidle');
    
    const activeItems = page.locator('.todo-list li');
    const count = await activeItems.count();
    console.log(`Active 待办事项数量：${count}`);
    expect(count).toBeGreaterThan(0);
    
    // 点击 Completed 过滤器
    const completedFilter = page.getByRole('link', { name: 'Completed' });
    await completedFilter.click();
    console.log('✓ 已点击 Completed 过滤器');
    
    await page.waitForLoadState('networkidle');
    
    const completedItems = page.locator('.todo-list li');
    const completedCount = await completedItems.count();
    console.log(`Completed 待办事项数量：${completedCount}`);
    expect(completedCount).toBeGreaterThan(0);
  });

  // ========== 5. 数据提取测试 ==========
  test('5. 数据提取测试 - 提取待办事项', async () => {
    console.log('=== 步骤 5: 数据提取 ===');
    
    const todos = await page.evaluate(() => {
      const todoElements = document.querySelectorAll('.todo-list li');
      return Array.from(todoElements).map(todo => {
        const label = todo.querySelector('label');
        return {
          text: label?.textContent || '',
          completed: todo.classList.contains('completed')
        };
      });
    });
    
    console.log('提取的待办事项:', JSON.stringify(todos, null, 2));
    expect(todos.length).toBeGreaterThan(0);
    
    // 提取链接
    const links = await page.evaluate(() => {
      const linkElements = document.querySelectorAll('a');
      return Array.from(linkElements).map(link => ({
        text: link.textContent?.trim() || '',
        href: link.href
      }));
    });
    
    console.log('提取的链接:', JSON.stringify(links, null, 2));
    expect(links.length).toBeGreaterThan(0);
    
    // 输出 JSON 格式数据
    const jsonData = {
      timestamp: new Date().toISOString(),
      pageUrl: page.url(),
      pageTitle: await page.title(),
      todos: todos,
      links: links,
      statistics: {
        totalTodos: todos.length,
        totalLinks: links.length
      }
    };
    
    console.log('\n=== 最终数据 ===');
    console.log(JSON.stringify(jsonData, null, 2));
  });
});
```

---

## 评测结果

- **得分**: 83/100
- **等级**: A (良好)
- **问题数量**: 3 个
- **代码通过率**: 60%

## 优点

1. 主动探索项目结构
2. 代码质量高，符合最佳实践
3. 规划清晰，执行反馈详细
4. 使用工具链完善
5. 输出简洁专业

## 不足

1. 错误处理缺失
2. 回答可能中断
3. 部分功能简化为"模拟"

## 问题统计

- 指令遵循失效：1（缺少错误处理）
- 偷懒：1（部分功能"模拟"）
- 输出中断：1（回答被截断）

## 评测报告链接

[详细评测报告](./model-evaluations/doubao-evaluation.md)

---

## 作为基准模型的说明

Doubao (doubao-seed-code-dogfood-2.1.1) 是本次评测的**基准模型**，其他所有模型都需要与它进行对比分析。

- GLM-5 vs Doubao: GLM-5 胜出 (+17 分)
- Kimi vs Doubao: Kimi 胜出 (+12-17 分)
