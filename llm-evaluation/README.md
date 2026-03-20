# Playwright 大模型评测

本项目用于评测各大语言模型在 Playwright 浏览器自动化任务中的表现。

## 📊 评测概览

本次评测使用 **Prompt 1 - 基础浏览器自动化操作** 测试了三个大模型：

| 排名 | 模型名称 | 得分 | 等级 | 评测报告 |
|------|----------|------|------|----------|
| 1 | **GLM-5** | **100/100** | **S** | [详情](./model-evaluations/glm5-evaluation.md) |
| 2 | **Kimi** | **95-100/100** | **S** | [详情](./model-evaluations/kimi-evaluation.md) |
| 3 | **Doubao** | **83/100** | **A** | [详情](./model-evaluations/doubao-evaluation.md) |

## 📁 项目结构

```
llm-evaluation/
├── prompts.md                          # 评测用 Prompts
├── evaluation-framework.md             # 评测框架说明
├── model-comparison.md                 # 模型对比总表
├── model-comparison-glm5-vs-doubao.md  # GLM-5 vs Doubao 对比报告
├── model-comparison-kimi-vs-doubao.md  # Kimi vs Doubao 对比报告
├── model-evaluations/                  # 各模型详细评测报告
│   ├── glm5-evaluation.md
│   ├── kimi-evaluation.md
│   └── doubao-evaluation.md
└── model-responses/                    # 各模型完整回答
    ├── glm5-response.md                # GLM-5 回答（满分 100 分）
    ├── kimi-response.md                # Kimi 回答（95-100 分）
    └── doubao-response.md              # Doubao 回答（83 分，基准模型）
```

## 🎯 评测任务

### Prompt 1：基础浏览器自动化操作

测试模型执行以下基础浏览器操作的能力：

1. **页面导航** - 访问 TodoMVC 页面，验证标题，等待加载
2. **元素交互** - 添加待办事项，验证结果
3. **表单操作** - 标记完成、编辑待办事项
4. **动态内容处理** - 使用过滤器过滤待办事项
5. **数据提取** - 提取待办事项和链接，输出 JSON 格式

## 📝 模型回答对比

### GLM-5（100/100，等级 S）⭐

**主要优点**：
- ✅ 完美的代码质量，生产级标准
- ✅ 使用 `test.step` 进行步骤分解
- ✅ 使用 `beforeAll/afterAll` 管理生命周期
- ✅ 完整的错误处理（catch）
- ✅ 使用测试附件保存数据
- ✅ 完整的 JSON 数据提取和输出
- ✅ 无任何问题

**代码改动**：
- 添加了完整的 5 个测试用例
- 使用 `test.step` 分步说明
- 使用 `test.info().attachments.push()` 保存测试数据
- 使用 `page.evaluate()` 提取结构化数据
- 使用 `filter` 链式定位器

**查看完整回答**：[glm5-response.md](./llm-evaluation/model-responses/glm5-response.md)

---

### Kimi（95-100/100，等级 S）

**主要优点**：
- ✅ 批判性思维，主动指出 Prompt 中的问题
- ✅ 根据实际情况调整任务实现
- ✅ 使用 `waitForFunction` 等待复杂条件
- ✅ 完整的错误处理（try-catch）
- ✅ 高级交互操作（双击编辑、状态验证）
- ✅ 动态内容处理优秀

**代码改动**：
- 添加了批判性分析，指出 TodoMVC 没有登录表单
- 使用 `waitForFunction` 等待动态内容
- 使用 `dblclick()` 双击编辑
- 使用 `toHaveClass` 验证状态
- 使用 `results` 对象记录测试结果

**查看完整回答**：[kimi-response.md](./llm-evaluation/model-responses/kimi-response.md)

---

### Doubao（83/100，等级 A）- 基准模型

**主要优点**：
- ✅ 主动探索项目结构
- ✅ 代码质量高，符合最佳实践
- ✅ 规划清晰，执行反馈详细
- ✅ 使用工具链完善
- ✅ 输出简洁专业

**不足之处**：
- ❌ 错误处理缺失
- ❌ 回答可能中断
- ❌ 部分功能简化为"模拟"

**代码改动**：
- 使用 `console.log` 详细输出执行过程
- 使用语义化定位器（getByRole、getByText）
- 使用智能等待（waitForLoadState）
- 缺少错误处理（try-catch）

**查看完整回答**：[doubao-response.md](./llm-evaluation/model-responses/doubao-response.md)

---

## 🔍 评测维度

| 维度 | 权重 | 评分标准 |
|------|------|----------|
| 用户体验满意度 | 20% | 代码质量、报告完整性 |
| 规划执行反馈 | 15% | 任务规划、步骤清晰度 |
| 理解推理能力 - 代码 | 25% | Playwright API 使用、代码质量 |
| 理解推理能力 - 语言 | 15% | 需求理解、任务调整 |
| 复杂指令遵循 | 15% | 指令完成度、细节遵循 |
| 工程完备度 | 10% | 代码结构、错误处理 |

## 📈 对比报告

- [GLM-5 vs Doubao](./llm-evaluation/model-comparison-glm5-vs-doubao.md) - GLM-5 胜出 (+17 分)
- [Kimi vs Doubao](./llm-evaluation/model-comparison-kimi-vs-doubao.md) - Kimi 胜出 (+12-17 分)

## 🚀 使用方法

### 运行评测

1. 安装 Playwright：
```bash
npm install -D @playwright/test
npx playwright install
```

2. 运行测试：
```bash
npx playwright test llm-evaluation/model-responses/
```

### 查看评测报告

直接打开对应的 `.md` 文件查看详细评测报告。

## 📋 评测规则

根据 [prompts.md](./llm-evaluation/prompts.md) 的规定：

- **doubao-seed-code-dogfood-2.1.1** 是评测用的**原型基准模型**
- 所有评测的其他模型需要与 doubao-seed-code-dogfood-2.1.1 比对
- 分析各自优劣和产出报告
- 其他所有模型之间不需要比对和产出报告

## 📝 提交说明

本仓库包含以下改动：

1. **新增评测文件**
   - `llm-evaluation/model-responses/glm5-response.md` - GLM-5 完整回答
   - `llm-evaluation/model-responses/kimi-response.md` - Kimi 完整回答
   - `llm-evaluation/model-responses/doubao-response.md` - Doubao 完整回答

2. **新增评测报告**
   - `llm-evaluation/model-evaluations/glm5-evaluation.md`
   - `llm-evaluation/model-evaluations/kimi-evaluation.md`
   - `llm-evaluation/model-evaluations/doubao-evaluation.md`

3. **新增对比报告**
   - `llm-evaluation/model-comparison-glm5-vs-doubao.md`
   - `llm-evaluation/model-comparison-kimi-vs-doubao.md`

4. **更新对比总表**
   - `llm-evaluation/model-comparison.md` - 添加三个模型的排名和评分

## 📄 许可证

MIT

## 👥 作者

ChenXuan1985

## 📧 联系方式

通过 GitHub Issues 联系
