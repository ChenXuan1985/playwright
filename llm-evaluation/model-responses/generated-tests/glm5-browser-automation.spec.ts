import { test, expect, Page } from '@playwright/test';

const TODO_URL = 'https://demo.playwright.dev/todomvc';

test.describe('Playwright 基础浏览器自动化操作考核', () => {
  test.describe.configure({ mode: 'serial' });

  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('1. 页面导航测试', async () => {
    await test.step('访问 TodoMVC 页面', async () => {
      await page.goto(TODO_URL);
    });

    await test.step('等待页面完全加载', async () => {
      await page.waitForLoadState('networkidle');
    });

    await test.step('验证页面标题正确', async () => {
      const title = await page.title();
      expect(title).toContain('TodoMVC');
    });
    await test.step('验证页面主要元素存在', async () => {
      await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();
    });
  });
  
  test('2. 元素交互测试 - 添加待办事项', async () => {
    const todoText = 'Buy groceries';

    await test.step('输入待办事项文本', async () => {
      const input = page.getByPlaceholder('What needs to be done?');
      await input.fill(todoText);
    });

    await test.step('按 Enter 键提交', async () => {
      const input = page.getByPlaceholder('What needs to be done?');
      await input.press('Enter');
    });

    await test.step('验证待办事项已添加', async () => {
      const todoItem = page.getByText(todoText);
      await expect(todoItem).toBeVisible();
    });
  });

  test('3. 表单操作测试 - 标记完成和编辑', async () => {
    await test.step('标记第一个待办事项为已完成', async () => {
      const checkbox = page.locator('.todo-list li').first().getByRole('checkbox');
      await checkbox.check();
    });

    await test.step('验证已完成状态', async () => {
      const firstTodo = page.locator('.todo-list li').first();
      await expect(firstTodo).toHaveClass(/completed/);
    });

    await test.step('双击编辑待办事项', async () => {
      const todoText = page.getByText('Buy groceries');
      await todoText.dblclick();
    });

    await test.step('清除并输入新文本', async () => {
      const editInput = page.locator('.todo-list li.editing .edit');
      await editInput.fill('Buy groceries and cook');
      await editInput.press('Enter');
    });

    await test.step('验证编辑成功', async () => {
      await expect(page.getByText('Buy groceries and cook')).toBeVisible();
    });
  });

  test('4. 动态内容处理测试 - 过滤待办事项', async () => {
    await test.step('添加更多待办事项', async () => {
      const input = page.getByPlaceholder('What needs to be done?');
      await input.fill('Walk the dog');
      await input.press('Enter');
      await input.fill('Read a book');
      await input.press('Enter');
    });

    await test.step('点击 Active 过滤器', async () => {
      const activeFilter = page.getByRole('link', { name: 'Active' });
      await activeFilter.click();
    });

    await test.step('等待并验证过滤后的内容', async () => {
      await page.waitForFunction(() => {
        const items = document.querySelectorAll('.todo-list li');
        return items.length === 2;
      });
      const activeItems = page.locator('.todo-list li');
      await expect(activeItems).toHaveCount(2);
    });

    await test.step('点击 Completed 过滤器', async () => {
      const completedFilter = page.getByRole('link', { name: 'Completed' });
      await completedFilter.click();
    });

    await test.step('验证已完成的待办事项', async () => {
      await page.waitForFunction(() => {
        const items = document.querySelectorAll('.todo-list li');
        return items.length === 1;
      });
      const completedItems = page.locator('.todo-list li');
      await expect(completedItems).toHaveCount(1);
    });

    await test.step('返回 All 过滤器', async () => {
      const allFilter = page.getByRole('link', { name: 'All' });
      await allFilter.click();
    });

    await test.step('验证所有待办事项', async () => {
      await page.waitForFunction(() => {
        const items = document.querySelectorAll('.todo-list li');
        return items.length === 3;
      });
      const allItems = page.locator('.todo-list li');
      await expect(allItems).toHaveCount(3);
    });
  });

  test('5. 数据提取测试 - 提取待办事项和链接', async () => {
    await test.step('执行 JavaScript 获取页面数据', async () => {
      const extractedData = await page.evaluate(() => {
        const todos = Array.from(document.querySelectorAll('[data-testid="todo-item-label"]'))
          .map(item => item.textContent || '');
        const links = Array.from(document.querySelectorAll('a'))
          .map(link => ({
            text: link.textContent?.trim() || '',
            href: link.href
          }));
        return { todos, links };
      });

      console.log('提取的待办事项:', extractedData.todos);
      console.log('提取的链接:', extractedData.links);

      expect(extractedData.todos.length).toBeGreaterThanOrEqual(1);
      expect(extractedData.links.length).toBeGreaterThan(0);
    });

    await test.step('以 JSON 格式输出数据', async () => {
      const jsonData = {
        timestamp: new Date().toISOString(),
        pageUrl: page.url(),
        pageTitle: await page.title(),
        todos: (await page.evaluate(() => {
          return Array.from(document.querySelectorAll('[data-testid="todo-item-label"]'))
            .map(item => item.textContent || '');
        })),
        links: (await page.evaluate(() => {
          return Array.from(document.querySelectorAll('a'))
            .map(link => ({
              text: link.textContent?.trim() || '',
              href: link.href
            }));
        })).filter(l => l.text || l.href),
        statistics: {
          totalTodos: (await page.evaluate(() => {
            return document.querySelectorAll('[data-testid="todo-item-label"]').length;
          })),
          totalLinks: (await page.evaluate(() => {
            return document.querySelectorAll('a').length;
          }))
        }
      };

      console.log(JSON.stringify(jsonData, null, 2));
    });

    await test.step('附加 JSON 数据到测试结果', async () => {
      const jsonData = {
        timestamp: new Date().toISOString(),
        pageUrl: page.url(),
        pageTitle: await page.title(),
        todos: (await page.evaluate(() => {
          return Array.from(document.querySelectorAll('[data-testid="todo-item-label"]'))
            .map(item => item.textContent || '');
        })),
        links: (await page.evaluate(() => {
          return Array.from(document.querySelectorAll('a'))
            .map(link => ({
              text: link.textContent?.trim() || '',
              href: link.href
            }));
        })).filter(l => l.text || l.href)
      };

      test.info().attachments.push({
        name: 'extracted-data.json',
        contentType: 'application/json',
        body: Buffer.from(JSON.stringify(jsonData, null, 2))
      });
    });
  });

  test('综合测试：语义化定位器演示', async () => {
    await test.step('使用 getByRole 定位器', async () => {
      const heading = page.getByRole('heading', { name: /todos/i });
      await expect(heading).toBeVisible();
    });

    await test.step('使用 getByPlaceholder 定位器', async () => {
      const input = page.getByPlaceholder('What needs to be done?');
      await expect(input).toBeVisible();
      await expect(input).toBeEditable();
    });

    await test.step('使用 getByText 定位器', async () => {
      const footer = page.getByText('Double-click to edit a todo');
      await expect(footer).toBeVisible();
    });

    await test.step('使用 getByTestId 定位器', async () => {
      const todoItems = page.getByTestId('todo-item');
      const count = await todoItems.count();
      expect(count).toBeGreaterThan(0);
    });

    await test.step('使用 filter 链式定位', async () => {
      const specificTodo = page.getByTestId('todo-item-label').filter({ hasText: 'Buy groceries and cook' });
      const isVisible = await specificTodo.isVisible().catch(() => false);
      console.log(`特定待办事项可见：${isVisible}`);
    });
  });
});
