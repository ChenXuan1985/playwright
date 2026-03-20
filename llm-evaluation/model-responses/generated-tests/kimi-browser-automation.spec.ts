import { test, expect } from '@playwright/test';

test.describe('基础浏览器自动化操作 - Kimi', () => {
  
  test('完整的浏览器自动化流程', async ({ page }) => {
    const results: any = {
      steps: [],
      extractedData: null
    };

    try {
      console.log('步骤 1: 页面导航');
      
      await page.goto('https://demo.playwright.dev/todomvc', {
        waitUntil: 'networkidle'
      });
      
      await expect(page).toHaveTitle(/TodoMVC|React/);
      
      const todoInput = page.getByPlaceholder('What needs to be done?');
      await expect(todoInput).toBeVisible();
      
      results.steps.push({
        step: 1,
        action: '页面导航',
        status: '成功',
        url: 'https://demo.playwright.dev/todomvc',
        title: await page.title()
      });

      console.log('步骤 2: 元素交互 - 添加待办事项');
      
      await todoInput.fill('Buy groceries');
      await todoInput.press('Enter');
      
      const todoItem = page.getByText('Buy groceries');
      await expect(todoItem).toBeVisible();
      
      await todoInput.fill('Walk the dog');
      await todoInput.press('Enter');
      
      await todoInput.fill('Read a book');
      await todoInput.press('Enter');
      
      const todoItems = page.locator('.todo-list li');
      await expect(todoItems).toHaveCount(3);
      
      results.steps.push({
        step: 2,
        action: '元素交互',
        status: '成功',
        addedItems: ['Buy groceries', 'Walk the dog', 'Read a book'],
        totalCount: 3
      });

      console.log('步骤 3: 表单操作 - 标记完成和编辑');
      
      const firstTodoCheckbox = page.locator('.todo-list li').first().getByRole('checkbox');
      await firstTodoCheckbox.check();
      
      const firstTodo = page.locator('.todo-list li').first();
      await expect(firstTodo).toHaveClass(/completed/);
      
      const todoText = page.getByText('Walk the dog');
      await todoText.dblclick();
      
      const editInput = page.locator('.todo-list li.editing .edit');
      await editInput.fill('Walk the dog in the park');
      await editInput.press('Enter');
      
      await expect(page.getByText('Walk the dog in the park')).toBeVisible();
      
      results.steps.push({
        step: 3,
        action: '表单操作',
        status: '成功',
        completedItem: 'Buy groceries',
        editedItem: 'Walk the dog → Walk the dog in the park'
      });

      console.log('步骤 4: 动态内容处理');
      
      const activeFilter = page.getByRole('link', { name: 'Active' });
      await activeFilter.click();
      
      await page.waitForFunction(() => {
        const items = document.querySelectorAll('.todo-list li');
        return items.length === 2;
      });
      
      const activeItems = page.locator('.todo-list li');
      await expect(activeItems).toHaveCount(2);
      
      const completedFilter = page.getByRole('link', { name: 'Completed' });
      await completedFilter.click();
      
      await page.waitForFunction(() => {
        const items = document.querySelectorAll('.todo-list li');
        return items.length === 1;
      });
      
      const completedItems = page.locator('.todo-list li');
      await expect(completedItems).toHaveCount(1);
      
      const allFilter = page.getByRole('link', { name: 'All' });
      await allFilter.click();
      
      await page.waitForFunction(() => {
        const items = document.querySelectorAll('.todo-list li');
        return items.length === 3;
      });
      
      results.steps.push({
        step: 4,
        action: '动态内容处理',
        status: '成功',
        filtersTested: ['Active', 'Completed', 'All'],
        dynamicContentLoaded: true
      });

      console.log('步骤 5: 数据提取');
      
      const extractedData = await page.evaluate(() => {
        const todos: Array<{text: string; completed: boolean; id: string}> = [];
        
        document.querySelectorAll('.todo-list li').forEach((li, index) => {
          const label = li.querySelector('label');
          if (label) {
            todos.push({
              text: label.textContent || '',
              completed: li.classList.contains('completed'),
              id: `todo-${index}`
            });
          }
        });
        
        const links: Array<{text: string; href: string}> = [];
        document.querySelectorAll('a').forEach(a => {
          links.push({
            text: a.textContent?.trim() || '',
            href: a.href
          });
        });
        
        return { todos, links };
      });
      
      console.log('提取的数据:', JSON.stringify(extractedData, null, 2));
      
      results.extractedData = extractedData;
      
      console.log('\n=== 测试完成 ===');
      console.log(JSON.stringify(results, null, 2));
      
    } catch (error) {
      console.error('测试失败:', error);
      throw error;
    }
  });
});
