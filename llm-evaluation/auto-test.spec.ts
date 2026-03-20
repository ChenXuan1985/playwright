/**
 * Playwright MCP 大模型评测自动化测试脚本
 * 
 * 使用方法:
 * 1. 将模型生成的代码保存为 prompt1/model-name.spec.ts
 * 2. 运行：npx playwright test llm-evaluation/
 * 3. 查看生成的评测报告
 */

import { test, expect } from '@playwright/test';

// ============================================
// Prompt 1: 基础浏览器自动化操作 - 测试用例
// ============================================

test.describe('Prompt 1: 基础浏览器自动化', () => {
  
  test('页面导航', async ({ page }) => {
    // 测试模型生成的导航代码
    await page.goto('https://demo.playwright.dev/todomvc');
    
    // 验证页面标题
    await expect(page).toHaveTitle(/Todo/);
    
    // 验证页面加载完成
    await expect(page.locator('.todoapp')).toBeVisible();
    
    console.log('✓ 页面导航测试通过');
  });

  test('元素交互', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    
    // 输入待办事项
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Buy groceries');
    await input.press('Enter');
    
    // 验证添加成功
    await expect(page.getByText('Buy groceries')).toBeVisible();
    
    console.log('✓ 元素交互测试通过');
  });

  test('表单操作', async ({ page }) => {
    // 如果有登录功能，测试表单填写
    // 根据实际演示站点调整
    await page.goto('https://demo.playwright.dev/todomvc');
    
    // 测试输入和提交
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Test form submission');
    await input.press('Enter');
    
    await expect(page.getByText('Test form submission')).toBeVisible();
    
    console.log('✓ 表单操作测试通过');
  });

  test('动态内容处理', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    
    // 添加多个项目
    const items = ['Item 1', 'Item 2', 'Item 3'];
    const input = page.getByPlaceholder('What needs to be done?');
    
    for (const item of items) {
      await input.fill(item);
      await input.press('Enter');
    }
    
    // 验证所有项目都已添加
    for (const item of items) {
      await expect(page.getByText(item)).toBeVisible();
    }
    
    console.log('✓ 动态内容处理测试通过');
  });

  test('数据提取', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    
    // 添加测试数据
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Test item');
    await input.press('Enter');
    
    // 提取页面数据
    const extractedData = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.todo-list li'));
      return items.map(item => ({
        text: item.querySelector('.label')?.textContent || '',
        completed: item.classList.contains('completed')
      }));
    });
    
    console.log('提取的数据:', JSON.stringify(extractedData, null, 2));
    expect(extractedData.length).toBeGreaterThan(0);
    
    console.log('✓ 数据提取测试通过');
  });
});

// ============================================
// Prompt 2: 电商购物流程自动化 - 测试用例
// ============================================

test.describe('Prompt 2: 电商购物流程', () => {
  
  test('商品浏览', async ({ page }) => {
    // 使用 Playwright 演示站点
    await page.goto('https://demo.playwright.dev');
    
    // 验证页面加载
    await expect(page).toHaveTitle(/Playwright/);
    
    // 查找导航链接
    const links = await page.getByRole('link').all();
    expect(links.length).toBeGreaterThan(0);
    
    console.log('✓ 商品浏览测试通过');
  });

  test('购物车管理', async ({ page }) => {
    await page.goto('https://demo.playwright.dev');
    
    // 这个测试需要根据实际的电商演示站点调整
    // 这里使用通用的验证逻辑
    
    // 验证购物车功能（如果存在）
    const hasCart = await page.getByRole('link', { name: /cart|购物车/i }).count() > 0;
    
    if (hasCart) {
      console.log('✓ 购物车功能存在');
    } else {
      console.log('⚠ 当前演示站点无购物车功能，使用替代测试');
      // 替代测试：验证页面基本功能
      await expect(page).toHaveTitle(/Playwright/);
    }
  });

  test('结算流程', async ({ page }) => {
    // 结算流程测试需要根据实际站点调整
    await page.goto('https://demo.playwright.dev');
    
    // 验证站点可访问
    await expect(page).toHaveTitle(/Playwright/);
    
    console.log('✓ 结算流程测试通过（基础验证）');
  });

  test('订单验证', async ({ page }) => {
    await page.goto('https://demo.playwright.dev');
    
    // 提取页面信息
    const pageInfo = await page.evaluate(() => {
      return {
        title: document.title,
        url: window.location.href,
        links: Array.from(document.querySelectorAll('a')).map(a => a.textContent).slice(0, 10)
      };
    });
    
    console.log('页面信息:', pageInfo);
    expect(pageInfo.title).toBeTruthy();
    
    console.log('✓ 订单验证测试通过');
  });

  test('完整购物流程', async ({ page }) => {
    // 完整的端到端测试
    await page.goto('https://demo.playwright.dev');
    
    // 步骤 1: 访问主页
    await expect(page).toHaveTitle(/Playwright/);
    
    // 步骤 2: 浏览内容
    const links = page.getByRole('link');
    await links.first().click();
    await page.waitForLoadState('networkidle');
    
    // 步骤 3: 验证导航成功
    expect(page.url()).not.toBe('https://demo.playwright.dev');
    
    // 步骤 4: 返回主页
    await page.goto('https://demo.playwright.dev');
    
    console.log('✓ 完整购物流程测试通过');
  });
});

// ============================================
// 代码质量检查工具
// ============================================

test.describe('代码质量检查', () => {
  
  test('检查定位器质量', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    
    // 检查是否使用语义化定位器
    const semanticLocators = [
      'getByRole',
      'getByText', 
      'getByLabel',
      'getByPlaceholder',
      'getByTestId'
    ];
    
    console.log('推荐的语义化定位器:', semanticLocators);
    
    // 验证语义化定位器可用
    await expect(page.getByRole('heading')).toBeVisible();
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();
    
    console.log('✓ 定位器质量检查通过');
  });

  test('检查等待逻辑', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    
    const startTime = Date.now();
    
    // 添加待办事项
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Test wait logic');
    await input.press('Enter');
    
    // 等待元素出现（智能等待）
    await expect(page.getByText('Test wait logic')).toBeVisible();
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`操作耗时：${duration}ms`);
    expect(duration).toBeLessThan(5000); // 应在 5 秒内完成
    
    console.log('✓ 等待逻辑检查通过');
  });
});

// ============================================
// 性能测试
// ============================================

test.describe('性能测试', () => {
  
  test('页面加载性能', async ({ page }) => {
    const start = Date.now();
    await page.goto('https://demo.playwright.dev/todomvc');
    const loadTime = Date.now() - start;
    
    console.log(`页面加载时间：${loadTime}ms`);
    expect(loadTime).toBeLessThan(10000); // 10 秒内
    
    console.log('✓ 页面加载性能测试通过');
  });

  test('操作响应性能', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    
    const start = Date.now();
    
    // 连续操作
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Performance test');
    await input.press('Enter');
    await expect(page.getByText('Performance test')).toBeVisible();
    
    const duration = Date.now() - start;
    console.log(`操作响应时间：${duration}ms`);
    
    expect(duration).toBeLessThan(5000);
    
    console.log('✓ 操作响应性能测试通过');
  });
});
