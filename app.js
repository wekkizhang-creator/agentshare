const agents = [
  {
    id: "private-lending-litigation-agent",
    name: "张律师民事诉讼助手",
    category: "行业垂直",
    source: "Coze",
    cover: "cover-legal",
    creator: "Wang",
    rating: 4.3,
    calls: 19800,
    trial: 1,
    health: 97,
    mode: "工作流",
    priority: 111,
    detailCategory: "法律",
    detailVersion: "v1.3",
    detailUsers: "1.8w",
    detailReviews: 17,
    detailOpenSource: "否",
    ratingDistribution: [
      ["5 星", 76],
      ["4 星", 0],
      ["3 星", 12],
      ["2 星", 0],
      ["1 星", 12],
    ],
    tags: ["民间借贷", "起诉状", "答辩状"],
    description:
      "专业诉讼文书起草，浓缩多年经验，权威数据支撑，高效帮你写出符合法院要求的专业起诉状、答辩状和上诉状。",
    detailIntro:
      "一款专注于民事诉讼文书起草的专业智能工具，旨在帮助用户快速、规范地生成符合法院要求的法律文书。它通过系统化的流程和智能分析，将复杂的法律文书写作任务简化为可操作的步骤，特别适合民间借贷、买卖合同、侵权纠纷等常见民事案件。",
    examples: [
      "撰写民事起诉状",
      "工伤赔偿答辩状",
      "起草公司上诉状",
    ],
    caseStudies: [
      {
        title: "撰写民事起诉状",
        body: "根据当事人信息、诉讼请求、事实理由和证据目录生成规范起诉状。",
      },
      {
        title: "工伤赔偿答辩状",
        body: "围绕赔偿项目、责任划分、证据效力和抗辩要点生成答辩结构。",
      },
      {
        title: "起草公司上诉状",
        body: "根据一审裁判要点和争议焦点整理上诉请求、事实理由和法律依据。",
      },
    ],
    recommendedPrompts: [
      "民间借贷逾期没还，我能自己起诉吗？",
      "起诉需要准备哪些证据材料？",
      "整个诉讼流程是怎样的？",
      "整个诉讼下来要花多少钱？",
    ],
    oneStop: {
      tagline: "从一句话咨询到立案、保全、执行，全程托管",
      promise:
        "你只需要把手里的材料交给我：时效判断、证据评估、管辖选择、文书起草、费用测算、财产保全、立案提交、节点提醒到强制执行，我一站式接力完成，不用在多个工具和流程之间来回切换。",
      currentStage: 3,
      deliverables: [
        "起诉状.docx",
        "证据目录.xlsx",
        "财产保全申请书.docx",
        "费用测算单",
        "立案材料包",
        "节点提醒日历",
      ],
    },
    scriptFlow: {
      title: "诉讼流程样例",
      scenario:
        "用户先描述借款时间、约定还款日、逾期未还和催收情况；Agent 判断可自起诉，并追问借条、资金交付、催收记录、借款人身份和地址。",
      materials: ["借条.pdf", "银行回单.jpg", "微信催收.png", "借款人身份证号和住所信息"],
      summary:
        "材料补齐后，Agent 将“从现在到法院受理”拆成 9 个步骤，并在时效、证据、费用、立案材料节点给出可继续执行的结果。",
    },
    workflowSteps: [
      {
        title: "Step1 诉讼时效校验",
        body: "计算约定还款日至当前日期是否超过 3 年，并检查微信催收、对方回复、部分还款等时效中断证据。",
        trigger: "节点触发：时效有问题吗？",
        output: "从约定还款日 2023-06-01 起算未满 3 年；微信回复“再等等”可作为时效中断证据。",
        note: "建议保留原始聊天文件，必要时做公证备用。",
      },
      {
        title: "Step2 证据完整性与效力评估",
        body: "按主体证据、借贷合意、交付凭证三段式校验，重点识别银行流水缺口、现金交付、身份地址不完整等风险。",
        trigger: "节点触发：我的证据够不够？",
        output: "主体证据和借贷合意齐全；银行回单覆盖 300 万，现金交付部分缺少直接凭证。",
        note: "补充取现流水、当日沟通记录或见证人；无法补强时，可优先围绕转账部分确定诉讼请求。",
      },
      {
        title: "Step3 管辖法院确定",
        body: "结合约定管辖、被告住所地、经常居住地和合同履行地，判断可选择的受理法院。",
        trigger: "节点触发：应该去哪个法院起诉？",
        output: "输出推荐法院、备选法院、法院地址、立案庭电话和线上立案入口。",
        note: "如果借条有明确管辖条款，优先校验条款是否有效。",
      },
      {
        title: "Step4 自动生成诉讼文书",
        body: "填充要素式起诉状、证据目录、财产保全申请书等模板，自动组织事实理由和证据引用。",
        trigger: "节点触发：帮我把起诉材料写出来。",
        output: "生成起诉状初稿、诉讼请求、事实理由、证据目录和待补材料清单。",
        note: "对现金交付部分在事实理由中标注举证风险，避免文书口径过度承诺。",
      },
      {
        title: "Step5 费用计算与保全策略",
        body: "按诉讼标的和保全金额估算案件受理费、财产保全申请费、保全保函费用，并判断是否需要同步保全。",
        trigger: "节点触发：整套打下来要花多少钱？",
        output: "案件受理费约 46,800 元；财产保全申请费 5,000 元；保全保函费用通常按担保机构报价。",
        note: "诉讼费用通常由原告先垫付，胜诉后可依法主张由被告承担。",
      },
      {
        title: "Step6 财产保全同步申请",
        body: "引导补充银行账号、房产、车辆、公司股权等财产线索，判断保全范围和担保材料。",
        trigger: "节点触发：我要不要先保全对方财产？",
        output: "生成财产保全申请书、财产线索清单、担保材料清单和保函办理指引。",
        note: "对财产线索不足的案件，提示保全命中率和额外成本。",
      },
      {
        title: "Step7 立案材料包生成与提交",
        body: "按管辖法院常用格式打包立案材料，支持线上立案小程序提交，也支持打印后线下递交。",
        trigger: "节点触发：帮我准备立案材料。",
        output: "输出起诉状.docx、证据目录.xlsx、财产保全申请书.docx，并提示线上/线下提交路径。",
        note: "材料包会按证据编号、证明目的和文件格式进行核对。",
        files: [
          { name: "起诉状.docx", type: "docx", size: "10 KB" },
          { name: "证据目录.xlsx", type: "xlsx", size: "18 KB" },
          { name: "财产保全申请书.docx", type: "docx", size: "9 KB" },
        ],
      },
      {
        title: "Step8 节点追踪与提醒",
        body: "跟踪立案受理、补正、缴费、举证期限、开庭日期等节点，并为每个节点输出明确行动指令。",
        trigger: "节点触发：后面每一步你提醒我。",
        output: "生成节点日历、缴费提醒、补正材料提醒、举证期限提醒和开庭准备清单。",
        note: "关键节点需要用户人工确认后再进入下一步。",
      },
      {
        title: "Step9 执行阶段预案",
        body: "胜诉后衔接强制执行，提前准备执行申请、财产查询和信用惩戒模板。",
        trigger: "节点触发：如果胜诉后对方还不还怎么办？",
        output: "生成强制执行申请书、执行费用提示、财产查询线索表、失信名单和限制消费令申请模板。",
        note: "执行预案会复用前序财产保全和财产线索结果。",
      },
    ],
  },
  {
    id: "finance-close-agent",
    name: "财务月结全流程 Agent",
    category: "财务",
    source: "Coze",
    cover: "cover-finance",
    creator: "Finance Ops Lab",
    rating: 4.9,
    calls: 68300,
    trial: 2,
    health: 98,
    mode: "工作流",
    priority: 110,
    tags: ["月结", "凭证", "结账"],
    description:
      "自动对账、凭证生成、试算平衡、结账和出具月结报告，支持差异分析。",
    examples: ["上传月度流水和科目表，输出月结差异清单。", "生成结账检查项和月结报告摘要。"],
  },
  {
    id: "expense-audit-agent",
    name: "费用报销智能审核",
    category: "财务",
    source: "Prompt",
    cover: "cover-expense",
    creator: "Expense Guard",
    rating: 4.8,
    calls: 54200,
    trial: 3,
    health: 97,
    mode: "批处理",
    priority: 109,
    tags: ["报销", "发票", "合规"],
    description:
      "发票验真、合规校验、差旅标准匹配、异常标注并自动生成记账分录。",
    examples: ["上传报销单和发票，输出异常原因。", "按公司差旅规则标记超标项目。"],
  },
  {
    id: "tax-filing-draft-agent",
    name: "税务申报底稿生成",
    category: "财务",
    source: "ChatGPT",
    cover: "cover-tax",
    creator: "Tax Studio",
    rating: 4.7,
    calls: 36600,
    trial: 2,
    health: 94,
    mode: "表单",
    priority: 108,
    tags: ["增值税", "所得税", "底稿"],
    description:
      "自动编制增值税、所得税和个税底稿，辅助申报核对与税务风险提示。",
    examples: ["输入收入成本数据，生成申报底稿。", "对比上期申报，标记异常波动。"],
  },
  {
    id: "receivable-payable-clearing",
    name: "往来账清理 Agent",
    category: "财务",
    source: "Dify",
    cover: "cover-finance",
    creator: "Cash Cycle",
    rating: 4.8,
    calls: 29100,
    trial: 3,
    health: 95,
    mode: "批处理",
    priority: 107,
    tags: ["应收", "应付", "现金流"],
    description:
      "分析应收应付账龄、自动生成对账函、催款模板和坏账计提建议。",
    examples: ["上传往来账明细，输出逾期客户清单。", "生成分客户催款话术和对账函。"],
  },
  {
    id: "budget-tracking-agent",
    name: "预算执行跟踪 Agent",
    category: "财务",
    source: "Coze",
    cover: "cover-budget",
    creator: "Budget Radar",
    rating: 4.7,
    calls: 24800,
    trial: 4,
    health: 93,
    mode: "看板",
    priority: 106,
    tags: ["预算", "预警", "仪表盘"],
    description:
      "实时计算预算执行、超预算预警、调整建议和可视化仪表盘摘要。",
    examples: ["导入部门预算和实际发生额，输出偏差说明。", "生成预算预警和管理层汇报口径。"],
  },
  {
    id: "contract-review-sop-agent",
    name: "行业合同审查 SOP",
    category: "法务合同",
    source: "ChatGPT",
    cover: "cover-contract-sop",
    creator: "Legal SOP Works",
    rating: 4.9,
    calls: 42100,
    trial: 1,
    health: 96,
    mode: "对话",
    priority: 105,
    tags: ["合同", "风险点", "审查"],
    description:
      "面向工程、供应链、劳动和知识产权合同，识别 40+ 风险点并输出审查意见。",
    examples: ["粘贴采购合同，输出高风险条款。", "生成可交给业务方的修改建议。"],
  },
  {
    id: "contract-lifecycle-agent",
    name: "合同全生命周期管理",
    category: "法务合同",
    source: "Coze",
    cover: "cover-contract",
    creator: "Clause Flow",
    rating: 4.8,
    calls: 30300,
    trial: 2,
    health: 94,
    mode: "工作流",
    priority: 104,
    tags: ["起草", "审签", "履约"],
    description:
      "覆盖起草、审查、签署、归档、履约提醒、到期续签和终止提醒。",
    examples: ["输入合同类型，生成审签流程。", "根据履约节点生成提醒清单。"],
  },
  {
    id: "legal-document-generator",
    name: "法律文书自动生成",
    category: "法务合同",
    source: "Prompt",
    cover: "cover-legal-doc",
    creator: "Legal Draft",
    rating: 4.7,
    calls: 18700,
    trial: 2,
    health: 92,
    mode: "表单",
    priority: 103,
    tags: ["律师函", "起诉状", "证据"],
    description:
      "根据案件事实生成律师函、起诉状、答辩状、证据清单和文书模板。",
    examples: ["输入纠纷事实，生成律师函初稿。", "整理证据目录和待补充材料。"],
  },
  {
    id: "compliance-checklist-agent",
    name: "合规自查清单 Agent",
    category: "法务合同",
    source: "Dify",
    cover: "cover-compliance",
    creator: "Compliance Desk",
    rating: 4.8,
    calls: 26300,
    trial: 2,
    health: 95,
    mode: "表单",
    priority: 102,
    tags: ["数据安全", "用工", "环保"],
    description:
      "自动生成数据安全、劳动用工、反商业贿赂和环保合规自查报告。",
    examples: ["选择行业和地区，生成合规自查表。", "根据自查结果输出整改优先级。"],
  },
  {
    id: "hr-onboarding-agent",
    name: "HR Onboarding 全流程",
    category: "HR",
    source: "Coze",
    cover: "cover-hr",
    creator: "People Ops",
    rating: 4.9,
    calls: 47700,
    trial: 3,
    health: 97,
    mode: "工作流",
    priority: 101,
    tags: ["入职", "权限", "培训"],
    description:
      "新员工资料收集、合同签署、入职指引、权限开通、培训计划和试用期跟踪。",
    examples: ["输入岗位和部门，生成入职清单。", "按试用期节点生成跟进任务。"],
  },
  {
    id: "recruitment-agent",
    name: "招聘全流程 Agent",
    category: "HR",
    source: "Prompt",
    cover: "cover-recruit",
    creator: "Hire Loop",
    rating: 4.8,
    calls: 52600,
    trial: 4,
    health: 96,
    mode: "工作流",
    priority: 100,
    tags: ["JD", "简历", "面试"],
    description:
      "优化 JD、简历筛选、面试题库、面试记录、录用通知和背调提醒。",
    examples: ["输入岗位要求，生成 JD 和筛选标准。", "根据候选人简历生成面试问题。"],
  },
  {
    id: "payroll-accounting-agent",
    name: "薪酬核算 Agent",
    category: "HR",
    source: "ChatGPT",
    cover: "cover-payroll",
    creator: "Payroll Desk",
    rating: 4.7,
    calls: 33900,
    trial: 2,
    health: 94,
    mode: "批处理",
    priority: 99,
    tags: ["薪资", "社保", "个税"],
    description:
      "考勤统计、社保公积金计算、个税申报、工资条生成和发放核对。",
    examples: ["导入考勤和薪资表，输出工资核算结果。", "生成个税异常和社保基数提醒。"],
  },
  {
    id: "employee-relations-agent",
    name: "员工关系管理 Agent",
    category: "HR",
    source: "Dify",
    cover: "cover-hr-relations",
    creator: "ER Studio",
    rating: 4.6,
    calls: 20400,
    trial: 3,
    health: 92,
    mode: "对话",
    priority: 98,
    tags: ["绩效", "离职", "争议"],
    description:
      "生成劳动合同续签提醒、绩效谈话模板、离职交接清单和劳动争议跟踪。",
    examples: ["输入员工场景，生成沟通话术。", "输出离职交接和风险提示。"],
  },
  {
    id: "construction-compliance-agent",
    name: "施工方案合规审核",
    category: "行业垂直",
    source: "Prompt",
    cover: "cover-industry",
    creator: "Vertical Works",
    rating: 4.8,
    calls: 16800,
    trial: 1,
    health: 94,
    mode: "批处理",
    priority: 97,
    tags: ["建筑工程", "合规", "清单"],
    description:
      "面向建筑工程，审核施工方案、工程量清单计价、竣工资料和监理日志。",
    examples: ["上传施工方案，输出合规风险。", "生成竣工资料补齐清单。"],
  },
  {
    id: "education-question-agent",
    name: "教案与试卷生成",
    category: "行业垂直",
    source: "ChatGPT",
    cover: "cover-education",
    creator: "Edu Tailor",
    rating: 4.7,
    calls: 25600,
    trial: 5,
    health: 95,
    mode: "表单",
    priority: 96,
    tags: ["教案", "试卷", "学情"],
    description:
      "生成教案、试卷出题、知识点分布、学情分析报告和评语内容。",
    examples: ["输入年级和知识点，生成试卷。", "根据成绩表输出学情分析。"],
  },
  {
    id: "medical-record-summary",
    name: "病历摘要与医保结算",
    category: "行业垂直",
    source: "Prompt",
    cover: "cover-medical",
    creator: "Med Notes",
    rating: 4.6,
    calls: 14200,
    trial: 1,
    health: 90,
    mode: "批处理",
    priority: 95,
    tags: ["病历", "摘要", "医保"],
    description:
      "生成病历摘要、医学文献翻译、临床路径报告模板和医保结算清单。",
    examples: ["粘贴病历文本，输出摘要和关键诊断。", "生成医保结算材料检查清单。"],
  },
  {
    id: "procurement-bid-agent",
    name: "招标书与采购合规",
    category: "行业垂直",
    source: "Dify",
    cover: "cover-procurement",
    creator: "Supply Chain AI",
    rating: 4.8,
    calls: 23100,
    trial: 2,
    health: 95,
    mode: "工作流",
    priority: 94,
    tags: ["招标", "采购", "合同"],
    description:
      "生成招标书、审核供应商资质、比价分析和采购合同风险审查。",
    examples: ["输入采购需求，生成招标文件结构。", "对比供应商报价并输出风险点。"],
  },
  {
    id: "brand-content-compliance",
    name: "品牌内容合规审核",
    category: "行业垂直",
    source: "Coze",
    cover: "cover-brand",
    creator: "Brand Guard",
    rating: 4.7,
    calls: 19800,
    trial: 3,
    health: 93,
    mode: "批处理",
    priority: 93,
    tags: ["广告", "内容", "舆情"],
    description:
      "审核品牌文案、新媒体内容矩阵、活动复盘报告和舆情分析摘要。",
    examples: ["上传广告文案，输出合规修改建议。", "生成活动复盘和舆情摘要。"],
  },
  {
    id: "official-document-agent",
    name: "公文与会议纪要标准化",
    category: "行业垂直",
    source: "Markdown",
    cover: "cover-government",
    creator: "Gov Docs",
    rating: 4.6,
    calls: 12600,
    trial: 4,
    health: 91,
    mode: "表单",
    priority: 92,
    tags: ["公文", "会议纪要", "请示"],
    description:
      "完成公文格式校验、会议纪要标准化、请示报告模板和党建材料生成。",
    examples: ["粘贴会议记录，输出标准纪要。", "把工作事项整理成请示报告。"],
  },
  {
    id: "paper-format-agent",
    name: "论文格式自动校正",
    category: "个人小众",
    source: "Prompt",
    cover: "cover-personal",
    creator: "Academic Aid",
    rating: 4.8,
    calls: 37200,
    trial: 5,
    health: 96,
    mode: "批处理",
    priority: 91,
    tags: ["论文", "格式", "参考文献"],
    description:
      "按 GB/T 7714 自动校正参考文献、查重报告解读、答辩 PPT 大纲和综述生成。",
    examples: ["粘贴参考文献，输出规范格式。", "根据论文摘要生成答辩 PPT 大纲。"],
  },
  {
    id: "personal-tax-agent",
    name: "个人税务筹划",
    category: "个人小众",
    source: "ChatGPT",
    cover: "cover-personal-tax",
    creator: "Tax Lite",
    rating: 4.7,
    calls: 18800,
    trial: 5,
    health: 93,
    mode: "表单",
    priority: 90,
    tags: ["个税", "专项扣除", "房租"],
    description:
      "生成个税汇算清缴底稿、专项附加扣除自查、房租房贷抵扣测算和发票台账。",
    examples: ["输入收入和扣除项，输出汇算清缴提示。", "生成专项扣除材料清单。"],
  },
  {
    id: "family-budget-agent",
    name: "家庭账本自动分类",
    category: "个人小众",
    source: "Prompt",
    cover: "cover-family",
    creator: "Life Ledger",
    rating: 4.6,
    calls: 21900,
    trial: 8,
    health: 94,
    mode: "表单",
    priority: 89,
    tags: ["家庭账本", "预算", "旅行"],
    description:
      "自动分类家庭账本、预算跟踪、旅行计划文档、婚礼流程表和育儿日志模板。",
    examples: ["粘贴消费记录，输出分类和预算建议。", "生成旅行预算和行程文档。"],
  },
  {
    id: "commerce",
    name: "跨境 Listing 优化师",
    category: "跨境电商",
    source: "Coze",
    cover: "cover-commerce",
    creator: "Luna Studio",
    rating: 4.9,
    calls: 48210,
    trial: 3,
    health: 98,
    mode: "对话",
    tags: ["亚马逊", "关键词", "A/B"],
    description:
      "基于产品参数、竞品关键词和目标市场，生成标题、五点描述、搜索词与测试建议。",
    examples: [
      "输入产品参数，输出符合美国站风格的标题与五点描述。",
      "根据竞品关键词生成 3 组 A/B 测试方向。",
    ],
  },
  {
    id: "content",
    name: "小红书选题策划",
    category: "自媒体",
    source: "Prompt",
    cover: "cover-content",
    creator: "North Content",
    rating: 4.8,
    calls: 39452,
    trial: 5,
    health: 94,
    mode: "表单",
    tags: ["种草", "选题", "脚本"],
    description:
      "将品牌定位、目标用户和关键词转成可执行的选题池、标题和内容结构。",
    examples: ["输入品类和目标人群，输出 20 条选题。", "为单条选题生成封面标题和脚本大纲。"],
  },
  {
    id: "dev",
    name: "SQL 性能诊断",
    category: "编程",
    source: "GitHub",
    cover: "cover-dev",
    creator: "Index Lab",
    rating: 4.7,
    calls: 18640,
    trial: 2,
    health: 91,
    mode: "对话",
    tags: ["PostgreSQL", "索引", "Explain"],
    description:
      "读取 SQL、表结构和 Explain 输出，定位慢查询原因并给出索引与改写建议。",
    examples: ["粘贴 Explain Analyze，输出瓶颈解释。", "对复杂 Join 给出索引组合和风险提示。"],
  },
  {
    id: "service",
    name: "客服质检复盘",
    category: "运营",
    source: "Dify",
    cover: "cover-service",
    creator: "Ops Alpha",
    rating: 4.6,
    calls: 17442,
    trial: 3,
    health: 86,
    mode: "批处理",
    tags: ["质检", "话术", "复盘"],
    description:
      "批量分析客服会话，识别风险话术、响应延迟、解决率和可训练样本。",
    examples: ["上传客服对话，输出质检得分。", "按风险级别生成主管复盘清单。"],
  },
  {
    id: "legal",
    name: "合同风险初筛",
    category: "办公",
    source: "ChatGPT",
    cover: "cover-legal",
    creator: "Clause Works",
    rating: 4.5,
    calls: 9206,
    trial: 1,
    health: 89,
    mode: "对话",
    tags: ["合同", "条款", "风险"],
    description:
      "对商业合同进行风险初筛，标记付款、违约、保密、管辖和自动续约条款。",
    examples: ["粘贴合同条款，输出风险等级。", "生成待法务确认的问题清单。"],
  },
  {
    id: "meeting-minutes",
    name: "会议纪要整理",
    category: "办公",
    source: "Prompt",
    cover: "cover-meeting",
    creator: "Office Flow",
    rating: 4.8,
    calls: 31680,
    trial: 6,
    health: 96,
    mode: "批处理",
    tags: ["会议", "待办", "纪要"],
    description:
      "将会议录音转写或手动记录整理成议题摘要、关键结论、责任人和截止时间。",
    examples: ["粘贴会议转写，生成结构化纪要。", "按部门输出待办清单和跟进提醒。"],
  },
  {
    id: "ppt-outline",
    name: "PPT 大纲策划",
    category: "办公",
    source: "Coze",
    cover: "cover-ppt",
    creator: "Slide Works",
    rating: 4.7,
    calls: 28440,
    trial: 4,
    health: 93,
    mode: "表单",
    tags: ["汇报", "PPT", "提纲"],
    description:
      "根据汇报目标、受众和素材生成演示结构、页标题、讲稿要点和视觉建议。",
    examples: ["输入项目背景，输出 12 页路演大纲。", "把周报素材整理成管理层汇报结构。"],
  },
  {
    id: "spreadsheet-helper",
    name: "Excel 公式助手",
    category: "办公",
    source: "ChatGPT",
    cover: "cover-sheet",
    creator: "Sheet Lab",
    rating: 4.9,
    calls: 52760,
    trial: 8,
    health: 97,
    mode: "对话",
    tags: ["Excel", "公式", "透视表"],
    description:
      "把自然语言需求转换成 Excel 公式、数据清洗步骤、透视表字段和排错建议。",
    examples: ["描述统计口径，生成可复制公式。", "分析公式报错并给出修正版本。"],
  },
  {
    id: "document-summary",
    name: "长文档摘要校对",
    category: "办公",
    source: "Markdown",
    cover: "cover-document",
    creator: "Doc Pilot",
    rating: 4.6,
    calls: 20318,
    trial: 5,
    health: 92,
    mode: "批处理",
    tags: ["文档", "摘要", "校对"],
    description:
      "读取长文档内容，输出摘要、关键风险、错别字和适合转发给不同对象的版本。",
    examples: ["粘贴方案文档，生成一页摘要。", "校对通知正文并给出更正式版本。"],
  },
  {
    id: "weekly-report",
    name: "日报周报生成器",
    category: "办公",
    source: "Prompt",
    cover: "cover-report",
    creator: "Work Rhythm",
    rating: 4.7,
    calls: 35812,
    trial: 7,
    health: 95,
    mode: "表单",
    tags: ["周报", "复盘", "计划"],
    description:
      "把零散工作记录整理成日报、周报、项目复盘和下周计划，保留真实进展口径。",
    examples: ["输入本周事项，输出周报和风险提示。", "根据项目节点生成下周计划。"],
  },
  {
    id: "email-polisher",
    name: "商务邮件润色",
    category: "办公",
    source: "Prompt",
    cover: "cover-email",
    creator: "Mail Desk",
    rating: 4.8,
    calls: 44720,
    trial: 8,
    health: 96,
    mode: "对话",
    tags: ["邮件", "沟通", "中英双语"],
    description:
      "根据收件人、语气和沟通目标润色商务邮件，支持正式、友好和催办版本。",
    examples: ["把中文要点改写成英文商务邮件。", "生成礼貌但明确的催办邮件。"],
  },
  {
    id: "image-generator-assistant",
    name: "智能出图助手",
    category: "AI 绘图",
    source: "Coze",
    cover: "cover-image-agent",
    creator: "Seedream Studio",
    rating: 4.7,
    calls: 8500,
    trial: 1,
    health: 91,
    mode: "表单",
    tags: ["出图", "提示词", "风格"],
    description:
      "一句话生成自动出图提示词，支持商品图、插画、海报和社媒配图场景。",
    examples: ["输入产品和风格，输出可直接用于绘图模型的提示词。", "根据用途生成竖版海报和封面图构图建议。"],
  },
  {
    id: "novel-zero-to-hit",
    name: "小说从 0 到封神",
    category: "小说创作",
    source: "Prompt",
    cover: "cover-novel-god",
    creator: "Story Forge",
    rating: 4.6,
    calls: 72000,
    trial: 2,
    health: 90,
    mode: "对话",
    tags: ["网文", "大纲", "爽点"],
    description:
      "从书名、人设、大纲到开篇、爽点、反转和章节推进，辅助搭建完整网文创作链路。",
    examples: ["输入题材和主角设定，生成世界观与前三章大纲。", "根据章节目标补齐冲突、钩子和反转。"],
  },
  {
    id: "tomato-novel-writer",
    name: "番茄小说创作神器",
    category: "小说创作",
    source: "Prompt",
    cover: "cover-tomato-novel",
    creator: "Tomato Lab",
    rating: 4.8,
    calls: 20000,
    trial: 1,
    health: 94,
    mode: "对话",
    tags: ["番茄", "网文", "章节"],
    description:
      "面向番茄小说写作流程，生成细纲、章节节奏、人物关系和高点击开篇。",
    examples: ["输入赛道和卖点，生成 30 章分集大纲。", "把平铺剧情改成更强冲突和更高留存版本。"],
  },
  {
    id: "sales",
    name: "B2B 邮件开发",
    category: "营销",
    source: "Prompt",
    cover: "cover-sales",
    creator: "Outbound Kit",
    rating: 4.8,
    calls: 21906,
    trial: 4,
    health: 95,
    mode: "表单",
    tags: ["外贸", "邮件", "线索"],
    description:
      "根据客户画像、痛点和产品卖点生成冷启动邮件序列与跟进节奏。",
    examples: ["输入客户行业，生成 5 封邮件序列。", "为 LinkedIn 触达生成短消息版本。"],
  },
];

const sources = [
  { key: "Coze", name: "Coze", meta: "JSON / ZIP 工作流", icon: "C" },
  { key: "Prompt", name: "纯 Prompt", meta: "文本自动结构化", icon: "P" },
  { key: "Dify", name: "Dify", meta: "YAML / DSL", icon: "D" },
  { key: "ChatGPT", name: "ChatGPT GPTs", meta: "链接或 instructions", icon: "G" },
  { key: "GitHub", name: "GitHub 仓库", meta: "扫描 prompt 文件", icon: "H" },
  { key: "Markdown", name: "Markdown / Notion", meta: "文档抽取字段", icon: "M" },
  { key: "AgentBind", name: "绑定智能体", meta: "Skill 文件 + 授权码", icon: "S" },
];

// 当前用户（刘晨）真实用过的 Agent，按最近使用时间倒序。
// 调用工作台左侧只展示这些，而不是整个市场。
const recentAgentUsage = [
  { id: "private-lending-litigation-agent", lastUsed: "今天", calls: 3 },
  { id: "commerce", lastUsed: "05-22", calls: 8 },
  { id: "meeting-minutes", lastUsed: "05-20", calls: 5 },
  { id: "spreadsheet-helper", lastUsed: "05-18", calls: 14 },
  { id: "legal", lastUsed: "05-15", calls: 2 },
];

// 立案材料包里的三份真实文书：弹窗预览用 html，下载指向 assets/ 下真实生成的文件。
const legalDocuments = {
  "起诉状.docx": {
    title: "民事起诉状",
    download: "assets/起诉状.docx",
    html: `
      <h1>民事起诉状</h1>
      <p class="doc-party"><b>原告：</b>刘晨，男，汉族，1985 年 3 月生，住上海市浦东新区世纪大道 100 号，公民身份号码 3101**********0011，联系电话 138****0011。</p>
      <p class="doc-party"><b>被告：</b>王磊，男，汉族，1983 年 7 月生，住上海市闵行区都市路 88 号，公民身份号码 3101**********2037，联系电话 139****2037。</p>
      <h2>诉讼请求</h2>
      <ol>
        <li>判令被告偿还原告借款本金人民币 500 万元；</li>
        <li>判令被告按年利率 6% 支付自 2023 年 6 月 1 日起至实际清偿之日止的逾期利息（暂计至起诉之日为 290,000 元）；</li>
        <li>本案诉讼费、财产保全费、保全担保费由被告承担。</li>
      </ol>
      <h2>事实与理由</h2>
      <p>2022 年 5 月 1 日，被告因经营周转向原告借款人民币 500 万元，双方签订《借款借条》，约定借款期限至 2023 年 6 月 1 日，到期一次性归还本金。</p>
      <p>借款交付情况：原告通过银行转账方式向被告支付借款本金 300 万元（详见银行转账回单 3 笔），另以现金方式交付 200 万元，被告均在借条中确认收讫。</p>
      <p>借款到期后，被告未按约定归还。原告分别于 2023 年 6 月、9 月、12 月通过微信三次催告，被告回复“资金紧张，再宽限一段时间”，至今仍未偿还，已构成违约。</p>
      <p>原告认为，被告应依法承担偿还借款本金及逾期利息的责任。为维护原告合法权益，特依据《中华人民共和国民法典》第六百六十七条、第六百七十六条之规定，向贵院提起诉讼，请依法判如所请。</p>
      <p class="doc-sign">此致<br/>上海市闵行区人民法院</p>
      <p class="doc-sign" style="text-align:right">具状人（签名）：刘晨<br/>2026 年 5 月 29 日</p>
    `,
  },
  "证据目录.xlsx": {
    title: "证据目录",
    download: "assets/证据目录.xlsx",
    html: `
      <h1>证据目录</h1>
      <p class="doc-meta">案由：民间借贷纠纷 ｜ 原告：刘晨 ｜ 被告：王磊 ｜ 制表日期：2026-05-29</p>
      <table class="doc-table">
        <thead><tr><th>序号</th><th>证据名称</th><th>证据来源</th><th>证明目的</th><th>页数</th></tr></thead>
        <tbody>
          <tr><td>1</td><td>借款借条（原件）</td><td>原告持有</td><td>证明双方借贷合意、借款金额 500 万元及还款期限</td><td>1</td></tr>
          <tr><td>2</td><td>银行转账回单（3 笔）</td><td>银行打印</td><td>证明原告实际交付借款本金 300 万元</td><td>3</td></tr>
          <tr><td>3</td><td>现金交付情况说明</td><td>原告出具</td><td>证明以现金方式交付借款 200 万元，被告借条确认收讫</td><td>1</td></tr>
          <tr><td>4</td><td>微信催收记录（3 次）</td><td>原告手机</td><td>证明原告多次主张权利，诉讼时效中断</td><td>5</td></tr>
          <tr><td>5</td><td>被告身份信息</td><td>原告提供</td><td>证明被告主体身份及送达地址</td><td>1</td></tr>
        </tbody>
      </table>
      <p class="doc-meta">合计：证据 5 组，共 11 页。</p>
    `,
  },
  "财产保全申请书.docx": {
    title: "财产保全申请书",
    download: "assets/财产保全申请书.docx",
    html: `
      <h1>财产保全申请书</h1>
      <p class="doc-party"><b>申请人：</b>刘晨，男，汉族，住上海市浦东新区世纪大道 100 号，联系电话 138****0011。</p>
      <p class="doc-party"><b>被申请人：</b>王磊，男，汉族，住上海市闵行区都市路 88 号，联系电话 139****2037。</p>
      <h2>请求事项</h2>
      <ol>
        <li>请求依法查封、扣押、冻结被申请人名下价值人民币 500 万元的财产（包括但不限于银行存款、房产、车辆及公司股权）；</li>
        <li>本次保全申请费由被申请人承担。</li>
      </ol>
      <h2>事实与理由</h2>
      <p>申请人已就与被申请人之间的民间借贷纠纷向贵院提起诉讼。被申请人到期拒不归还 500 万元借款，且经多次催告仍以“资金紧张”为由拖延，存在转移、隐匿财产的现实风险。</p>
      <p>如不及时采取保全措施，将可能使日后生效判决难以执行，严重损害申请人合法权益。为此，依据《中华人民共和国民事诉讼法》第一百零三条之规定，特申请财产保全。</p>
      <p>申请人愿意提供担保。已联系担保机构出具金额为 500 万元的保全保函，担保材料随附。</p>
      <p class="doc-sign">此致<br/>上海市闵行区人民法院</p>
      <p class="doc-sign" style="text-align:right">申请人（签名）：刘晨<br/>2026 年 5 月 29 日</p>
    `,
  },
};

const state = {
  activeView: "market",
  activeAgentId: "private-lending-litigation-agent",
  activeCategory: "全部",
  activeSource: "Coze",
  search: "",
  workflowNodes: [],
  workflowNodeCounter: 0,
};

const API_BASE = "/api";
const visibilityLabels = {
  private: "仅自己可见",
  team: "团队空间可见",
  marketplace: "准备上架市场",
};

const DEFAULT_CREATOR_SHARE_RATE = 0.7;

agents.forEach((agent) => {
  agent.creatorShareRate = DEFAULT_CREATOR_SHARE_RATE;
});

// 详情补全：让每个 Agent 的详情都对齐"张律师民事诉讼助手"的结构
// （长简介 / 精选案例 / 流程样例 / 工作流覆盖 / 一站式服务）。
// 已手写完整内容的 Agent（如张律师）会被保留，缺失字段才按分类套件补齐。
const detailKits = {
  财务: {
    core: {
      title: "核算与差异分析",
      body: "按科目、规则和阈值完成计算、对账与差异定位，标注异常项及其可能原因。",
      output: "输出平衡结果、差异清单和需人工确认的疑点。",
      note: "差异较大的科目建议保留底稿，便于审计追溯。",
    },
    materials: ["原始业务数据表（Excel/CSV）", "科目或规则配置", "上期对照数据", "需要重点关注的异常说明"],
    deliverables: ["处理结果表", "异常与风险清单", "处理说明摘要", "下一步行动建议"],
    tagline: "从数据导入到结果复核，财务流程一站式托管",
    introTail: "它把重复的核算、对账与合规校验沉淀为稳定流程，减少人工搬运和口径不一致。",
  },
  法务合同: {
    core: {
      title: "风险识别与条款审查",
      body: "按高、中、低风险逐条审查关键条款，识别付款、违约、保密、管辖、续约等风险点。",
      output: "输出分级风险清单和可直接替换的修改建议。",
      note: "高风险条款会标注依据，便于与业务方沟通。",
    },
    materials: ["合同或文书正文", "交易背景与诉求", "对方主体信息", "已有的内部模板或红线"],
    deliverables: ["审查意见", "风险分级清单", "修改建议稿", "待确认问题清单"],
    tagline: "从合同上传到审查意见，法务流程一站式接力",
    introTail: "它面向合同与合规场景，重视风险分级、修改建议和业务可执行性。",
  },
  HR: {
    core: {
      title: "流程编排与材料生成",
      body: "根据岗位、员工状态和制度，生成清单、模板、话术并标注关键时间节点。",
      output: "输出流程清单、责任人、时间节点和所需材料。",
      note: "涉及合规与隐私的环节会单独提示。",
    },
    materials: ["岗位或员工信息", "公司制度与流程要求", "相关时间节点", "需要沟通的对象"],
    deliverables: ["流程清单", "模板与话术", "时间节点日历", "合规风险提示"],
    tagline: "从信息录入到节点跟进，HR 流程一站式托管",
    introTail: "它围绕招聘、入离职、薪酬和员工关系设计流程，帮 HR 团队减少重复沟通。",
  },
  行业垂直: {
    core: {
      title: "专业审核与文档生成",
      body: "结合行业规范和检查项，对材料做合规审核或生成标准文档，定位风险与缺口。",
      output: "输出审核结论、风险点和补齐清单或标准文档。",
      note: "规范引用会标注出处，便于核对。",
    },
    materials: ["业务材料或方案", "适用的行业规范", "关注的风险或目标", "已有模板或历史资料"],
    deliverables: ["审核结论", "风险与缺口清单", "标准文档或模板", "整改优先级建议"],
    tagline: "从材料提交到标准交付，行业流程一站式完成",
    introTail: "它专注行业知识结构化，把复杂规范、材料和检查项转成可复用的执行模板。",
  },
  个人小众: {
    core: {
      title: "整理与测算",
      body: "按规则对个人材料做分类、校正或测算，整理成清晰可用的结果。",
      output: "输出分类结果、测算明细或规范文档。",
      note: "涉及金额或格式的结果会给出依据。",
    },
    materials: ["个人记录或文档", "适用规则或模板", "目标或偏好说明", "历史数据（可选）"],
    deliverables: ["整理结果", "测算或分类明细", "规范文档", "下一步建议"],
    tagline: "从材料整理到结果交付，个人事务一站式搞定",
    introTail: "它面向个人高频事务打磨轻量模板，强调简单可复制、结果可追踪。",
  },
  办公: {
    core: {
      title: "内容处理与结构化",
      body: "理解办公文档或需求，完成摘要、改写、整理或公式与结构生成，并做一致性检查。",
      output: "输出结构化结果、可复用模板或可直接使用的内容。",
      note: "对不确定之处会标注，避免臆造内容。",
    },
    materials: ["原始文档或素材", "处理目标与受众", "格式或口径要求", "参考示例（可选）"],
    deliverables: ["处理结果", "结构化大纲或模板", "风险或错误提示", "可转发的版本"],
    tagline: "从素材输入到成稿交付，办公提效一站式完成",
    introTail: "它深耕办公提效场景，把文档、会议、表格和邮件处理成可复用的工作流。",
  },
  跨境电商: {
    core: {
      title: "Listing 与关键词优化",
      body: "结合产品参数、竞品关键词和目标市场，生成标题、卖点和搜索词并给出测试方向。",
      output: "输出符合目标站点风格的文案和 A/B 测试建议。",
      note: "关键词会标注来源和热度参考。",
    },
    materials: ["产品参数与卖点", "目标市场与站点", "竞品链接或关键词", "品牌词与禁用词"],
    deliverables: ["标题与五点描述", "搜索词清单", "A/B 测试方向", "优化说明"],
    tagline: "从产品参数到上架文案，跨境运营一站式产出",
    introTail: "它把产品信息和市场关键词转成可直接上架的高转化文案。",
  },
  自媒体: {
    core: {
      title: "选题与脚本生成",
      body: "基于品牌定位、目标用户和关键词，产出选题池、标题和内容结构。",
      output: "输出可执行的选题、标题和脚本大纲。",
      note: "会区分种草、测评等不同内容形态。",
    },
    materials: ["品牌或品类定位", "目标用户画像", "关键词或热点", "参考爆款（可选）"],
    deliverables: ["选题池", "标题与封面文案", "脚本大纲", "发布节奏建议"],
    tagline: "从定位到脚本，内容生产一站式完成",
    introTail: "它把模糊的内容想法转成可直接拍摄或撰写的选题和脚本。",
  },
  编程: {
    core: {
      title: "诊断与改写建议",
      body: "读取代码、结构和运行信息，定位瓶颈或问题并给出可执行的改写与优化建议。",
      output: "输出问题定位、优化方案和风险提示。",
      note: "建议会说明取舍，便于评估落地成本。",
    },
    materials: ["代码或 SQL", "表结构或上下文", "运行或报错信息", "性能或目标要求"],
    deliverables: ["问题定位说明", "优化或改写方案", "索引或配置建议", "风险与回归提示"],
    tagline: "从问题输入到优化方案，研发排障一站式完成",
    introTail: "它把性能与排障经验沉淀成可复用的诊断流程。",
  },
  运营: {
    core: {
      title: "质检与复盘分析",
      body: "批量分析会话或数据，识别风险、延迟、转化等指标并归纳可改进项。",
      output: "输出质检得分、风险清单和复盘建议。",
      note: "风险样本会按级别排序，便于优先处理。",
    },
    materials: ["会话或运营数据", "质检或评估标准", "目标指标", "历史对照（可选）"],
    deliverables: ["质检或分析得分", "风险与问题清单", "复盘建议", "可训练样本"],
    tagline: "从数据上传到复盘清单，运营优化一站式完成",
    introTail: "它把运营数据转成可执行的质检结论和改进清单。",
  },
  "AI 绘图": {
    core: {
      title: "提示词与构图生成",
      body: "根据产品、用途和风格，生成可直接用于绘图模型的提示词和构图建议。",
      output: "输出结构化提示词、负向词和构图方案。",
      note: "会区分不同尺寸和用途的出图建议。",
    },
    materials: ["产品或主体描述", "用途与风格偏好", "尺寸或平台要求", "参考图（可选）"],
    deliverables: ["出图提示词", "负向词清单", "构图与配色建议", "多版本方案"],
    tagline: "从一句话需求到出图提示词，创意出图一站式完成",
    introTail: "它把模糊想法转成可直接执行的出图提示词和构图方案。",
  },
  小说创作: {
    core: {
      title: "大纲与爽点设计",
      body: "围绕题材、人设和赛道，搭建世界观、章节大纲并设计冲突、钩子和爽点。",
      output: "输出世界观、分章大纲和关键爽点设计。",
      note: "会兼顾留存节奏，避免平铺直叙。",
    },
    materials: ["题材与赛道", "主角与人物设定", "已有大纲或片段", "目标平台与篇幅"],
    deliverables: ["世界观设定", "分章大纲", "爽点与钩子清单", "开篇样章"],
    tagline: "从书名设定到分章大纲，网文创作一站式推进",
    introTail: "它聚焦网文创作链路，用结构化方法补齐大纲、人物、爽点和章节节奏。",
  },
  营销: {
    core: {
      title: "触达内容与节奏设计",
      body: "基于客户画像、痛点和卖点，生成邮件或消息序列并规划跟进节奏。",
      output: "输出多封触达内容和跟进时间表。",
      note: "会区分首次触达与跟进的口径。",
    },
    materials: ["客户画像与行业", "产品卖点与痛点", "触达渠道", "已有话术（可选）"],
    deliverables: ["触达内容序列", "跟进节奏表", "多渠道版本", "效果跟踪建议"],
    tagline: "从客户画像到触达序列，获客触达一站式完成",
    introTail: "它把客户洞察转成可直接发送的触达内容和跟进节奏。",
  },
};

const fallbackDetailKit = {
  core: {
    title: "核心处理",
    body: "围绕任务目标完成关键处理，定位重点、风险与可改进项。",
    output: "输出处理结果、关键结论和风险提示。",
    note: "关键结论会说明依据，避免过度承诺。",
  },
  materials: ["相关输入材料", "任务目标与要求", "参考资料（可选）", "需要重点关注的问题"],
  deliverables: ["处理结果", "关键结论摘要", "风险与建议清单", "下一步行动建议"],
  tagline: "从输入到交付，全流程一站式完成",
  introTail: "它通过系统化流程把复杂任务拆成可执行步骤，帮你减少重复操作、保证口径一致。",
};

function buildDetailCases(agent) {
  const source = agent.examples && agent.examples.length ? agent.examples : [agent.description];
  const tags = agent.tags || [];
  return source.slice(0, 3).map((body, index) => ({
    title: tags[index] ? `${tags[index]}场景` : `典型场景 ${index + 1}`,
    body,
  }));
}

function buildWorkflowSteps(agent, kit) {
  const tagList = (agent.tags || []).join("、") || "关键字段";
  const firstDeliverables = kit.deliverables.slice(0, 2).join("、");
  const lastDeliverable = kit.deliverables[kit.deliverables.length - 1] || "结果文件";
  return [
    {
      title: "Step1 需求确认与输入校验",
      body: `明确本次${agent.category}任务目标，确认需要的输入：${kit.materials.slice(0, 3).join("、")}，并校验资料是否齐全、口径是否一致。`,
      trigger: "节点触发：我需要准备哪些材料？",
      output: "列出待补齐材料清单，并确认任务范围与交付标准。",
      note: "资料不全时会先提示补充，避免后续返工。",
    },
    {
      title: "Step2 资料解析与结构化",
      body: `读取并解析输入内容，抽取${tagList}等要素，整理成结构化数据，便于后续处理与核对。`,
      trigger: "节点触发：帮我把材料整理清楚。",
      output: "输出结构化要素表和疑点标记。",
      note: "对识别置信度较低的内容会单独标注，供人工确认。",
    },
    {
      title: `Step3 ${kit.core.title}`,
      body: kit.core.body,
      trigger: "节点触发：开始核心处理。",
      output: kit.core.output,
      note: kit.core.note,
    },
    {
      title: "Step4 结果生成与质量检查",
      body: `生成${firstDeliverables}等交付物，并对结果做一致性、完整性和风险检查。`,
      trigger: "节点触发：把结果生成出来。",
      output: "产出可直接使用的交付物，并附质检说明和风险提示。",
      note: "关键结论会给出依据，避免过度承诺。",
    },
    {
      title: "Step5 交付与跟进",
      body: "输出最终交付物并说明使用方式，对需要持续跟踪的事项生成提醒与下一步行动清单。",
      trigger: "节点触发：后面每一步提醒我。",
      output: `交付${lastDeliverable}，并生成跟进与提醒清单。`,
      note: "重要节点需你确认后再进入下一步。",
    },
  ];
}

function enrichAgentDetail(agent) {
  const kit = detailKits[agent.category] || fallbackDetailKit;

  if (!agent.detailCategory) agent.detailCategory = agent.category;
  if (!agent.detailIntro) agent.detailIntro = `${agent.description} ${kit.introTail}`;
  if (!agent.caseStudies) agent.caseStudies = buildDetailCases(agent);
  if (!agent.workflowSteps) agent.workflowSteps = buildWorkflowSteps(agent, kit);

  if (!agent.scriptFlow) {
    const head = kit.materials.slice(0, 2).join("、");
    const rest = kit.materials.slice(2).join("、") || "关键信息";
    agent.scriptFlow = {
      title: `${agent.name} 流程样例`,
      scenario: `用户提供${head}并说明目标；Agent 确认任务范围后，追问缺失的${rest}。`,
      materials: kit.materials,
      summary: "材料补齐后，Agent 将任务拆成 5 个步骤，从输入校验到交付跟进逐步给出可执行结果。",
    };
  }

  if (!agent.oneStop) {
    agent.oneStop = {
      tagline: kit.tagline,
      promise: `你只需要把材料交给我：${kit.materials.slice(0, 3).join("、")}等，我会完成解析、${kit.core.title}、结果生成与质检、交付与跟进，全程一站式接力，不用在多个工具之间来回切换。`,
      currentStage: 2,
      deliverables: kit.deliverables,
    };
  }
}

agents.forEach(enrichAgentDetail);

const workflowTools = [
  { value: "llm.chat", label: "llm.chat", meta: "通用推理" },
  { value: "llm.extract", label: "llm.extract", meta: "结构化抽取" },
  { value: "llm.classify", label: "llm.classify", meta: "风险与类别判断" },
  { value: "web.fetch", label: "web.fetch", meta: "读取指定页面" },
  { value: "web.search", label: "web.search", meta: "搜索公开信息" },
  { value: "doc.read_pdf", label: "doc.read_pdf", meta: "读取 PDF" },
  { value: "doc.read_docx", label: "doc.read_docx", meta: "读取 Word" },
  { value: "doc.write_markdown", label: "doc.write_markdown", meta: "生成 Markdown" },
  { value: "data.transform", label: "data.transform", meta: "清洗与映射" },
  { value: "data.aggregate", label: "data.aggregate", meta: "聚合统计" },
  { value: "notify.email", label: "notify.email", meta: "邮件通知" },
  { value: "notify.webhook", label: "notify.webhook", meta: "Webhook 推送" },
  { value: "state.set", label: "state.set", meta: "保存状态变量" },
  { value: "state.get", label: "state.get", meta: "读取状态变量" },
];

const interventionLabels = {
  L0: "L0 静默",
  L1: "L1 通知",
  L2: "L2 等待确认",
  L3: "L3 强制人工",
};

const bindInstruction = `请阅读以下 Skill 描述文件，按照其中的指引完成 WPS Agent共享平台能力注册与授权：

https://oss.uumit.com/skills/SKILL.md

请按步骤完成：
1. 读取 Skill 描述文件，理解能力注册、授权与上架流程。
2. 帮我发起 WPS Agent共享平台授权流程。
3. 拿到授权码后，把授权码返回给我。`;

const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => [...document.querySelectorAll(selector)];

function formatNumber(value) {
  return new Intl.NumberFormat("zh-CN").format(value);
}

function formatCompactNumber(value) {
  if (value >= 10000) return `${(value / 10000).toFixed(1)} 万`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return formatNumber(value);
}

function renderStars(rating) {
  const filled = Math.round(rating);
  return Array.from({ length: 5 }, (_, index) => `<span class="${index < filled ? "filled" : ""}">★</span>`).join("");
}

function detailMeta(agent) {
  const versionPatch = Math.max(1, agent.tags.length + agent.trial);
  return {
    version: agent.detailVersion || `v${Math.max(1, Math.round(agent.rating - 3))}.${versionPatch}`,
    users: agent.detailUsers || formatCompactNumber(Math.max(320, Math.round(agent.calls / 11))),
    openSource: agent.detailOpenSource || (agent.source === "GitHub" || agent.source === "Markdown" ? "是" : "否"),
    reviews: agent.detailReviews || Math.max(8, Math.round(agent.calls / 4200)),
  };
}

function detailCases(agent) {
  if (agent.caseStudies?.length) {
    return agent.caseStudies.slice(0, 3);
  }
  const titles = agent.examples.length > 0 ? agent.examples : [agent.description];
  return titles.slice(0, 3).map((example, index) => ({
    title: index === 0 ? `【${agent.mode}】${agent.name}` : `案例 ${index + 1}`,
    body: example,
  }));
}

function creatorIntro(agent) {
  const categoryFocus = {
    财务: "熟悉财务共享、月结和合规审计流程，擅长把企业日常表格和制度沉淀为稳定自动化交付。",
    法务合同: "长期服务合同审查和合规团队，重视风险分级、修改建议和业务可执行性。",
    HR: "围绕招聘、入离职、薪酬和员工关系设计流程型 Agent，帮助 HR 团队减少重复沟通。",
    行业垂直: "专注行业知识结构化，把复杂规范、材料和检查项转成可复用的执行模板。",
    个人小众: "面向个人高频事务打磨轻量模板，强调简单可复制、结果可追踪。",
    办公: "深耕办公提效场景，把文档、会议、表格和邮件处理成更容易复用的工作流。",
    小说创作: "聚焦网文创作链路，擅长用结构化方法补齐大纲、人物、爽点和章节节奏。",
    "AI 绘图": "熟悉商品图、海报和社媒配图需求，能把模糊想法转成可直接执行的出图提示词。",
  };
  return categoryFocus[agent.category] || `专注${agent.category}场景，持续把真实用户反馈沉淀到 Agent 能力里。`;
}

function ratingRows(agent) {
  if (agent.ratingDistribution?.length) return agent.ratingDistribution;
  const five = Math.min(92, Math.max(44, Math.round(agent.rating * 15 + agent.health * 0.16)));
  const four = Math.max(12, Math.round((100 - five) * 0.54));
  const three = Math.max(4, Math.round((100 - five) * 0.2));
  const two = Math.max(2, Math.round((100 - five) * 0.12));
  const one = Math.max(2, 100 - five - four - three - two);
  return [
    ["5 星", five],
    ["4 星", four],
    ["3 星", three],
    ["2 星", two],
    ["1 星", one],
  ];
}

function recommendedPrompts(agent) {
  const basePrompts = agent.recommendedPrompts || agent.examples || [];
  const categoryPrompts = {
    财务: [
      `请帮我梳理${agent.name}的执行步骤，并列出需要上传的数据字段。`,
      "基于本月业务数据，输出异常项、风险原因和下一步处理建议。",
    ],
    法务合同: [
      "请按高、中、低风险审查这份合同，并给出可直接替换的修改建议。",
      "请把这份材料整理成审查意见、待确认问题和业务侧行动清单。",
    ],
    HR: [
      "请根据岗位和员工状态生成流程清单、责任人和时间节点。",
      "请输出候选人/员工沟通话术，并标记潜在合规风险。",
    ],
    行业垂直: [
      "请基于这个行业场景输出审核清单、风险点和交付模板。",
      "请把输入材料整理成管理层可读的摘要和执行建议。",
    ],
    个人小众: [
      "请把我的材料整理成步骤清单，并说明每一步需要补充什么信息。",
      "请生成一个适合个人使用的模板，要求简单、可复制、可追踪。",
    ],
    办公: [
      "请把下面的原始材料整理成结构化结果，并给出下一步行动项。",
      "请生成适合发给同事或管理层的正式版本。",
    ],
    小说创作: [
      "请基于题材、人设和目标读者，生成完整故事大纲和前三章节奏。",
      "请强化这一章的冲突、爽点、钩子和结尾反转。",
    ],
    "AI 绘图": [
      "请根据产品、风格和用途生成高质量绘图提示词。",
      "请给出 3 个不同风格的构图方案和负面提示词。",
    ],
  };
  const prompts = [...basePrompts, ...(categoryPrompts[agent.category] || [])];
  return [...new Set(prompts)].slice(0, 4);
}

function renderPromptSuggestions(agent) {
  const prompts = recommendedPrompts(agent);
  qs("#promptChipRow").innerHTML = prompts
    .map((prompt) => `<button type="button" data-prompt="${escapeHtml(prompt)}">${escapeHtml(prompt)}</button>`)
    .join("");
  const input = qs("#chatInput");
  if (input && !input.value.trim() && prompts[0]) {
    input.value = prompts[0];
  }
}

function activeAgent() {
  return agents.find((agent) => agent.id === state.activeAgentId) || agents[0];
}

function setView(view) {
  state.activeView = view;
  qsa("[data-view-panel]").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.viewPanel === view);
  });
  qsa(".nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });
  if (view === "run") renderRunView();
  if (view === "inapp") renderInappView();
}

// 端内入口演示：按"正在编辑采购合同"这个上下文推荐的合同/法务类 Agent。
const inappRecommendations = [
  { id: "legal", reason: "一键初筛付款、违约、保密和管辖条款风险。" },
  { id: "contract-review-sop-agent", reason: "按采购合同 SOP 输出可交付的审查意见。" },
  { id: "contract-lifecycle-agent", reason: "把这份合同纳入审签、履约和到期提醒流程。" },
  { id: "legal-document-generator", reason: "据此生成补充协议、催告函等配套文书。" },
  { id: "compliance-checklist-agent", reason: "对照采购合规清单做一次自查。" },
  { id: "private-lending-litigation-agent", reason: "若后续发生纠纷，衔接诉讼与立案材料。" },
];

function renderInappView() {
  const rail = qs("#inappAgentList");
  if (rail) {
    rail.innerHTML = inappRecommendations
      .map(({ id, reason }) => {
        const agent = agents.find((item) => item.id === id);
        if (!agent) return "";
        return `
          <div class="inapp-agent-card" data-open-agent="${agent.id}">
            <div class="inapp-agent-cover agent-cover ${agent.cover}" aria-hidden="true"></div>
            <div class="inapp-agent-body">
              <div class="inapp-agent-top">
                <strong>${escapeHtml(agent.name)}</strong>
                <span class="inapp-agent-score">★ ${agent.rating.toFixed(1)}</span>
              </div>
              <p class="inapp-agent-reason">${escapeHtml(reason)}</p>
              <div class="inapp-agent-actions">
                <button class="inapp-use" type="button" data-run-agent="${agent.id}">立即使用</button>
                <button class="inapp-open" type="button" data-open-agent="${agent.id}">查看详情</button>
              </div>
            </div>
          </div>
        `;
      })
      .join("");
  }

  const chipWrap = qs("#inappBubbleChips");
  if (chipWrap) {
    chipWrap.innerHTML = inappRecommendations
      .slice(0, 3)
      .map(({ id }) => {
        const agent = agents.find((item) => item.id === id);
        if (!agent) return "";
        return `<button type="button" data-open-agent="${agent.id}">${escapeHtml(agent.name)}</button>`;
      })
      .join("");
  }
}

// 从端内入口跳转到 Agent 市场，并选中对应 Agent 直接展示详情。
function openAgentInMarket(agentId) {
  state.activeAgentId = agentId;
  state.activeCategory = "全部";
  state.search = "";
  const searchInput = qs("#globalSearch");
  if (searchInput) searchInput.value = "";
  renderCategories();
  renderAgentGrid();
  renderRunView();
  setView("market");
  qs("#agentDetail")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderCategories() {
  const categories = ["全部", ...new Set(agents.map((agent) => agent.category))];
  qs("#categoryRow").innerHTML = categories
    .map(
      (category) =>
        `<button type="button" class="${category === state.activeCategory ? "active" : ""}" data-category="${category}">${category}</button>`,
    )
    .join("");
}

function filteredAgents() {
  const sortValue = qs("#sortFilter")?.value || "score";
  const search = state.search.trim().toLowerCase();

  return [...agents]
    .filter((agent) => state.activeCategory === "全部" || agent.category === state.activeCategory)
    .filter((agent) => {
      if (!search) return true;
      const text = [agent.name, agent.category, agent.creator, ...agent.tags].join(" ").toLowerCase();
      return text.includes(search);
    })
    .sort((a, b) => {
      const priorityDelta = (b.priority || 0) - (a.priority || 0);
      if (priorityDelta) return priorityDelta;
      if (sortValue === "calls") return b.calls - a.calls;
      if (sortValue === "health") return b.health - a.health;
      return b.rating * b.health - a.rating * a.health;
    });
}

function renderAgentGrid() {
  const list = filteredAgents();
  if (list.length === 0) {
    qs("#agentGrid").innerHTML = `
      <div class="empty-state">
        <strong>没有匹配的 Agent</strong>
        <span>调整关键词、分类或来源筛选后再查看。</span>
      </div>
    `;
    qs("#agentDetail").innerHTML = `
      <div class="empty-state compact">
        <strong>未选择 Agent</strong>
        <span>市场列表恢复结果后会显示详情。</span>
      </div>
    `;
    return;
  }

  if (!list.some((agent) => agent.id === state.activeAgentId) && list[0]) {
    state.activeAgentId = list[0].id;
  }

  qs("#agentGrid").innerHTML = list
    .map(
      (agent) => `
        <button class="agent-card ${agent.id === state.activeAgentId ? "active" : ""}" type="button" data-agent-id="${agent.id}">
          <div class="agent-card-head">
            <span class="agent-card-icon agent-cover ${agent.cover}" aria-hidden="true"></span>
            <div class="agent-card-headings">
              <h3>${agent.name}</h3>
              <div class="card-meta">
                <span class="card-rating">★ ${agent.rating.toFixed(1)}</span>
                <span>${formatNumber(agent.calls)} 次调用</span>
              </div>
            </div>
          </div>
          <p>${agent.description}</p>
          <div class="tag-row">
            ${agent.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
          </div>
        </button>
      `,
    )
    .join("");

  renderAgentDetail();
}

function renderAgentDetail() {
  const agent = activeAgent();
  const meta = detailMeta(agent);
  const cases = detailCases(agent);
  const ratings = ratingRows(agent);
  const intro = creatorIntro(agent);
  const detailCategory = agent.detailCategory || agent.category;
  const detailIntro = agent.detailIntro
    ? `
      <div class="agent-long-intro">
        <p>${escapeHtml(agent.detailIntro)}</p>
        <button type="button">展开</button>
      </div>
    `
    : `
      <div class="creator-card">
        <div>
          <span>创建人</span>
          <strong>${escapeHtml(agent.creator)}</strong>
        </div>
        <p>${escapeHtml(intro)} 已服务 ${meta.users} 用户，健康度 ${agent.health}，可直接查看完整能力链路。</p>
      </div>
    `;
  const scriptFlow = agent.scriptFlow
    ? `
      <div class="detail-section">
        <div class="detail-section-head">
          <strong>${escapeHtml(agent.scriptFlow.title)}</strong>
          <span>流程样例</span>
        </div>
        <div class="script-flow-card">
          <p>${escapeHtml(agent.scriptFlow.scenario)}</p>
          <div class="script-materials">
            ${(agent.scriptFlow.materials || []).map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
          </div>
          <div class="script-flow-summary">${escapeHtml(agent.scriptFlow.summary)}</div>
        </div>
      </div>
    `
    : "";
  const workflowCoverage = agent.workflowSteps
    ? `
      <div class="detail-section">
        <div class="detail-section-head">
          <strong>工作流覆盖</strong>
          <span>${agent.workflowSteps.length} 个流程节点</span>
        </div>
        <div class="workflow-coverage-list">
          ${agent.workflowSteps
            .map(
              (step, index) => `
                <div class="workflow-coverage-item">
                  <span>${String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>${escapeHtml(step.title)}</strong>
                    <p>${escapeHtml(step.body)}</p>
                    ${step.trigger ? `<em>${escapeHtml(step.trigger)}</em>` : ""}
                    ${
                      step.output || step.note
                        ? `
                          <div class="workflow-step-result">
                            ${step.output ? `<div><b>输出</b><span>${escapeHtml(step.output)}</span></div>` : ""}
                            ${step.note ? `<div><b>提示</b><span>${escapeHtml(step.note)}</span></div>` : ""}
                          </div>
                        `
                        : ""
                    }
                  </div>
                </div>
              `,
            )
            .join("")}
        </div>
      </div>
    `
    : "";
  qs("#agentDetail").innerHTML = `
    <div class="detail-profile">
      <div class="detail-app-icon agent-cover ${agent.cover}" aria-hidden="true"></div>
      <h2>${escapeHtml(agent.name)}</h2>
      <p>${escapeHtml(agent.description)}</p>
      <div class="detail-stars" aria-label="${agent.rating.toFixed(1)} 分">
        <strong>${agent.rating.toFixed(1)}</strong>
        <span>${renderStars(agent.rating)}</span>
      </div>
    </div>
    <div class="detail-meta-grid">
      <div><strong>${agent.rating.toFixed(1)}</strong><span>评分</span></div>
      <div><strong>${escapeHtml(detailCategory)}</strong><span>分类</span></div>
      <div><strong>${escapeHtml(agent.creator)}</strong><span>开发者</span></div>
      <div><strong>${meta.version}</strong><span>版本</span></div>
      <div><strong>${meta.users}</strong><span>用户</span></div>
      <div><strong>${meta.openSource}</strong><span>是否开源</span></div>
    </div>
    <div class="tag-row detail-tags">
      ${agent.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
    </div>
    ${detailIntro}
    <div class="detail-actions detail-actions-prominent">
      <button class="primary-button" type="button" data-run-agent="${agent.id}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
        <span>开始使用</span>
      </button>
      <button class="secondary-button" type="button" data-run-agent="${agent.id}">查看流程</button>
      <button class="icon-button" type="button" title="收藏" aria-label="收藏">
        <svg viewBox="0 0 24 24"><path d="M12 17.3 6.2 21l1.5-6.6L2.5 10l6.8-.6L12 3l2.7 6.4 6.8.6-5.2 4.4 1.5 6.6z" /></svg>
      </button>
    </div>
    <div class="detail-section">
      <div class="detail-section-head">
        <strong>精选案例</strong>
        <span>${agent.mode}场景</span>
      </div>
      <div class="case-strip">
        ${cases
          .map(
            (item) => `
              <div class="case-card">
                <div class="case-thumb agent-cover ${agent.cover}" aria-hidden="true"></div>
                <strong>${escapeHtml(item.title)}</strong>
                <span>${escapeHtml(item.body)}</span>
              </div>
            `,
          )
        .join("")}
      </div>
    </div>
    ${scriptFlow}
    ${workflowCoverage}
    <div class="detail-section">
      <div class="detail-section-head">
        <strong>评分</strong>
        <span>${meta.reviews} 条评价</span>
      </div>
      <div class="rating-summary">
        <div>
          <strong>${agent.rating.toFixed(1)}</strong>
          <span>${renderStars(agent.rating)}</span>
        </div>
        <div class="rating-bars">
          ${ratings
            .map(
              ([label, value]) => `
                <div class="rating-row">
                  <span>${label}</span>
                  <div><i style="width: ${value}%"></i></div>
                </div>
              `,
            )
            .join("")}
        </div>
      </div>
    </div>
  `;
}

function renderSources() {
  qs("#sourceGrid").innerHTML = sources
    .map(
      (source) => `
        <button class="source-card ${source.key === state.activeSource ? "active" : ""}" type="button" data-source="${source.key}">
          <span class="source-icon">${source.icon}</span>
          <span>
            <strong>${source.name}</strong>
            <span>${source.meta}</span>
          </span>
        </button>
      `,
    )
    .join("");
}

function setBindStatus(message, type = "idle") {
  const status = qs("#bindStatus");
  if (!status) return;
  status.className = `status-banner ${type}`;
  status.textContent = message;
}

function renderImportInputMode() {
  const isBindMode = state.activeSource === "AgentBind";
  qs("#uploadDrop").hidden = isBindMode;
  qs("#promptPasteField").hidden = isBindMode;
  qs("#bindAgentPanel").hidden = !isBindMode;
  qs("#importDefaultActions").hidden = isBindMode;

  if (isBindMode) {
    qs("#bindInstruction").value = bindInstruction;
    qs("#schemaState").textContent = "授权预览就绪";
    setBindStatus("可直接完成授权预览。", "idle");
  }

  renderSchemaPreview();
}

function renderSchemaPreview(mode = "default") {
  if (state.activeSource === "AgentBind") {
    const authorizationCode = qs("#authorizationCode")?.value.trim() || "AUTO-AUTH-CODE";
    const lines = [
      ["import.mode", "agent_authorization"],
      ["skill.url", "https://oss.uumit.com/skills/SKILL.md"],
      ["auth_code", authorizationCode],
      ["binding_status", "bound"],
      ["source_platform", "external_agent"],
    ];

    qs("#schemaPreview").innerHTML = lines
      .map(([key, value]) => `<div class="schema-line"><span>${key}</span><strong>${value}</strong></div>`)
      .join("");
    qs("#issueList").innerHTML = [
      ["说明", "系统会读取 Skill、完成授权预览并返回绑定结果。"],
      ["状态", "当前可完整展示导入链路。"],
    ]
      .map(([title, body]) => `<div class="issue-item"><strong>${title}</strong> ${body}</div>`)
      .join("");
    qs("#schemaState").textContent = "授权预览已生成";
    return;
  }

  const pasted = qs("#promptPaste")?.value.trim();
  const agentName = pasted && mode === "parsed" ? "跨境 Listing 优化师" : "待解析 Agent";
    const lines = [
      ["agent.name", agentName],
      ["interaction_mode", "chat"],
      ["model.provider", "openai"],
      ["model.temperature", "0.7"],
      ["pricing_mode", "token_usage"],
      ["creator_share_rate", "70%"],
      ["trial_quota", "3"],
      ["source_platform", state.activeSource.toLowerCase()],
    ];

  qs("#schemaPreview").innerHTML = lines
    .map(([key, value]) => `<div class="schema-line"><span>${key}</span><strong>${value}</strong></div>`)
    .join("");

  const issues =
    mode === "parsed"
      ? [
          ["待确认", "检测到外部关键词数据引用，需要确认工具调用范围。"],
          ["建议", "简介、卖点和示例对话已生成初稿，可在上架前微调。"],
        ]
      : [
          ["待解析", "选择来源并提交内容后展示字段兼容性。"],
          ["底线", "system prompt 仅进入后端加密字段，前端不展示明文。"],
        ];

  qs("#issueList").innerHTML = issues
    .map(([title, body]) => `<div class="issue-item"><strong>${title}</strong> ${body}</div>`)
    .join("");
  qs("#schemaState").textContent = mode === "parsed" ? "已解析 14 个字段" : "等待解析";
}

function setBuildStatus(message, type = "idle") {
  const status = qs("#buildStatus");
  if (!status) return;
  status.className = `status-banner ${type}`;
  status.textContent = message;
}

function renderDraftSummary(draft) {
  qs("#buildDraftSummary").innerHTML = `
    <div>
      <span>草稿 ID</span>
      <strong>${escapeHtml(draft.id)}</strong>
    </div>
    <div>
      <span>Agent 名称</span>
      <strong>${escapeHtml(draft.name)}</strong>
    </div>
    <div>
      <span>可见范围</span>
      <strong>${escapeHtml(visibilityLabels[draft.visibility] || draft.visibility)}</strong>
    </div>
    <div>
      <span>当前状态</span>
      <strong>${escapeHtml(draft.status)}</strong>
    </div>
    <div>
      <span>下一步</span>
      <strong>${escapeHtml(draft.nextStep || "instruction")}</strong>
    </div>
  `;
}

function setWorkflowStatus(message, type = "idle") {
  const status = qs("#workflowStatus");
  if (!status) return;
  status.className = `status-banner ${type}`;
  status.textContent = message;
}

function nextWorkflowNodeId() {
  state.workflowNodeCounter += 1;
  return `workflow_node_${state.workflowNodeCounter}`;
}

function hasGoalTerms(goal, terms) {
  const normalized = goal.toLowerCase();
  return terms.some((term) => normalized.includes(term.toLowerCase()));
}

function createWorkflowNode(overrides = {}) {
  return {
    id: nextWorkflowNodeId(),
    title: "补充节点",
    description: "说明这一步要完成的动作、判断依据和边界。",
    tool: "llm.chat",
    inputs: "引用任务目标和前序节点输出。",
    expectedOutput: "产出可供下一步继续处理的结构化结果。",
    interventionLevel: "L0",
    estimatedCost: 0.08,
    estimatedDuration: 3,
    ...overrides,
  };
}

function buildWorkflowPlanFromGoal(goal) {
  const isResearchTask = hasGoalTerms(goal, ["竞品", "网页", "官网", "URL", "链接", "搜索", "抓取", "社媒", "应用商店"]);
  const isDocumentTask = hasGoalTerms(goal, ["PDF", "Word", "docx", "合同", "文档", "文件", "报告"]);
  const isDataTask = hasGoalTerms(goal, ["数据", "表格", "问卷", "客户", "CRM", "清洗", "聚类", "汇总", "对比"]);
  const needsNotification = hasGoalTerms(goal, ["邮件", "通知", "推送", "webhook", "发送", "飞书"]);
  const needsRiskReview = hasGoalTerms(goal, ["合规", "法务", "审批", "风险", "预算", "成本", "对外"]);

  const nodes = [
    createWorkflowNode({
      title: "明确目标与验收标准",
      description: "解析用户目标，拆出任务边界、成功标准、关键约束和需要人工确认的风险点。",
      tool: "llm.chat",
      inputs: "builderGoal 原始目标文本。",
      expectedOutput: "任务范围、验收标准、约束清单和风险提示。",
      interventionLevel: "L0",
      estimatedCost: 0.08,
      estimatedDuration: 3,
    }),
  ];

  if (isResearchTask) {
    nodes.push(
      createWorkflowNode({
        title: "检索候选信息源",
        description: "围绕目标中的对象、时间范围和关键词检索公开信息源，并过滤明显无关结果。",
        tool: "web.search",
        inputs: "${workflow_node_1.output.keywords}",
        expectedOutput: "候选 URL、来源名称、相关性说明。",
        interventionLevel: "L0",
        estimatedCost: 0.12,
        estimatedDuration: 5,
      }),
      createWorkflowNode({
        title: "抓取关键页面内容",
        description: "读取候选页面正文并保存来源、时间和摘要，供后续抽取与对比使用。",
        tool: "web.fetch",
        inputs: "${previous.output.urls}",
        expectedOutput: "页面正文、来源元数据和 200 字摘要。",
        interventionLevel: "L0",
        estimatedCost: 0.16,
        estimatedDuration: 8,
      }),
    );
  } else if (isDocumentTask) {
    nodes.push(
      createWorkflowNode({
        title: "读取文档材料",
        description: "读取平台内文档内容，保留页码、标题和段落结构，避免后续分析丢失出处。",
        tool: hasGoalTerms(goal, ["Word", "docx"]) ? "doc.read_docx" : "doc.read_pdf",
        inputs: "平台内存储的待处理文档路径。",
        expectedOutput: "带出处的文档正文与章节索引。",
        interventionLevel: "L0",
        estimatedCost: 0.14,
        estimatedDuration: 6,
      }),
    );
  } else {
    nodes.push(
      createWorkflowNode({
        title: "整理输入资料",
        description: "把用户目标、已知材料和需要补齐的信息整理成统一上下文。",
        tool: "state.get",
        inputs: "当前草稿目标、用户补充信息、默认配置。",
        expectedOutput: "标准化任务上下文。",
        interventionLevel: "L0",
        estimatedCost: 0.03,
        estimatedDuration: 2,
      }),
    );
  }

  nodes.push(
    createWorkflowNode({
      title: "抽取关键事实",
      description: "从已收集材料中抽取实体、时间、动作、风险、指标和证据引用。",
      tool: "llm.extract",
      inputs: "${previous.output}",
      expectedOutput: "结构化事实表和证据引用。",
      interventionLevel: "L0",
      estimatedCost: 0.22,
      estimatedDuration: 6,
    }),
    createWorkflowNode({
      title: isDataTask ? "清洗并聚合数据" : "整理分析维度",
      description: isDataTask
        ? "清洗字段、合并同义项并按关键维度聚合，形成可分析的数据视图。"
        : "把抽取结果归纳成主题、优先级和可比较维度，形成后续产出的骨架。",
      tool: isDataTask ? "data.aggregate" : "data.transform",
      inputs: "${previous.output.facts}",
      expectedOutput: isDataTask ? "聚合后的指标表和异常说明。" : "主题分类、优先级和分析框架。",
      interventionLevel: "L0",
      estimatedCost: 0.18,
      estimatedDuration: 7,
    }),
    createWorkflowNode({
      title: "生成分析结论",
      description: "基于事实和维度生成结论、建议、待确认事项，并标记证据不足的位置。",
      tool: "llm.chat",
      inputs: "${previous.output}",
      expectedOutput: "结论清单、建议动作和证据不足说明。",
      interventionLevel: needsRiskReview ? "L1" : "L0",
      estimatedCost: 0.28,
      estimatedDuration: 6,
    }),
    createWorkflowNode({
      title: "写出交付稿",
      description: "把结论组织成 Markdown 交付稿，包含摘要、过程、关键发现和下一步建议。",
      tool: "doc.write_markdown",
      inputs: "${previous.output}",
      expectedOutput: "Markdown 结果文件和摘要。",
      interventionLevel: needsRiskReview ? "L2" : "L1",
      estimatedCost: 0.2,
      estimatedDuration: 5,
    }),
  );

  if (needsNotification) {
    nodes.push(
      createWorkflowNode({
        title: "确认并发送通知",
        description: "在对外发送前展示收件人、正文摘要和附件清单，等待用户确认后再发送。",
        tool: "notify.email",
        inputs: "${previous.output.file_url}",
        expectedOutput: "发送状态、收件人和消息 ID。",
        interventionLevel: "L2",
        estimatedCost: 0.05,
        estimatedDuration: 2,
      }),
    );
  }

  return nodes.slice(0, 8);
}

function workflowToolOptions(selectedTool) {
  return workflowTools
    .map(
      (tool) => `
        <option value="${tool.value}" ${tool.value === selectedTool ? "selected" : ""}>
          ${tool.label} · ${tool.meta}
        </option>
      `,
    )
    .join("");
}

function interventionOptions(selectedLevel) {
  return Object.entries(interventionLabels)
    .map(
      ([level, label]) => `
        <option value="${level}" ${level === selectedLevel ? "selected" : ""}>${label}</option>
      `,
    )
    .join("");
}

function renderWorkflowSummary() {
  const summary = qs("#workflowSummary");
  if (!summary) return;
  const nodes = state.workflowNodes;
  const totalDuration = nodes.reduce((sum, node) => sum + Number(node.estimatedDuration || 0), 0);
  const totalCost = nodes.reduce((sum, node) => sum + Number(node.estimatedCost || 0), 0);
  const levels = ["L0", "L1", "L2", "L3"].map(
    (level) => `${level} ${nodes.filter((node) => node.interventionLevel === level).length}`,
  );

  summary.innerHTML = `
    <div>
      <span>总步骤</span>
      <strong>${nodes.length}</strong>
    </div>
    <div>
      <span>预估耗时</span>
      <strong>${totalDuration} 分钟</strong>
    </div>
    <div>
      <span>预估成本</span>
      <strong>$${totalCost.toFixed(2)}</strong>
    </div>
    <div>
      <span>介入级别</span>
      <strong>${levels.join(" · ")}</strong>
    </div>
  `;
}

function renderWorkflowBuilder() {
  const list = qs("#workflowNodeList");
  if (!list) return;
  renderWorkflowSummary();

  if (state.workflowNodes.length === 0) {
    list.innerHTML = `
      <div class="workflow-empty">
        <strong>还没有工作流节点</strong>
        <span>输入目标后点击“生成计划”，或手动新增节点。</span>
      </div>
    `;
    return;
  }

  list.innerHTML = state.workflowNodes
    .map(
      (node, index) => `
        <article class="workflow-node-card" data-workflow-node-id="${node.id}">
          <div class="workflow-node-top">
            <div class="node-index">步骤 ${index + 1}</div>
            <span class="level-badge level-${node.interventionLevel.toLowerCase()}">${interventionLabels[node.interventionLevel]}</span>
            <div class="node-actions">
              <button class="icon-button" type="button" title="上移" aria-label="上移节点" data-workflow-action="move-up" ${index === 0 ? "disabled" : ""}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 15 6-6 6 6" /></svg>
              </button>
              <button class="icon-button" type="button" title="下移" aria-label="下移节点" data-workflow-action="move-down" ${index === state.workflowNodes.length - 1 ? "disabled" : ""}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
              </button>
              <button class="icon-button danger" type="button" title="删除" aria-label="删除节点" data-workflow-action="delete">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M10 11v6m4-6v6M8 7l1-3h6l1 3m-9 0 1 13h8l1-13" /></svg>
              </button>
            </div>
          </div>

          <div class="workflow-node-grid">
            <label class="field-block">
              <span>节点标题</span>
              <input type="text" data-workflow-field="title" maxlength="80" value="${escapeHtml(node.title)}" />
            </label>
            <label class="field-block">
              <span>工具</span>
              <select data-workflow-field="tool">${workflowToolOptions(node.tool)}</select>
            </label>
            <label class="field-block wide-field">
              <span>描述</span>
              <textarea rows="3" data-workflow-field="description" maxlength="500">${escapeHtml(node.description)}</textarea>
            </label>
            <label class="field-block">
              <span>输入参数</span>
              <textarea rows="3" data-workflow-field="inputs" maxlength="500">${escapeHtml(node.inputs)}</textarea>
            </label>
            <label class="field-block">
              <span>预期产出</span>
              <textarea rows="3" data-workflow-field="expectedOutput" maxlength="500">${escapeHtml(node.expectedOutput)}</textarea>
            </label>
            <label class="field-block">
              <span>介入级别</span>
              <select data-workflow-field="interventionLevel">${interventionOptions(node.interventionLevel)}</select>
            </label>
            <label class="field-block">
              <span>预估耗时(分钟)</span>
              <input type="number" min="0" max="120" step="1" data-workflow-field="estimatedDuration" value="${Number(node.estimatedDuration || 0)}" />
            </label>
            <label class="field-block">
              <span>预估成本(美元)</span>
              <input type="number" min="0" max="50" step="0.01" data-workflow-field="estimatedCost" value="${Number(node.estimatedCost || 0).toFixed(2)}" />
            </label>
          </div>
        </article>
      `,
    )
    .join("");
}

function generateWorkflowPlan() {
  const goal = qs("#builderGoal").value.trim();
  if (!goal) {
    setWorkflowStatus("请先填写要解决的场景，再生成工作流计划。", "error");
    qs("#builderGoal").focus();
    return;
  }

  state.workflowNodeCounter = 0;
  state.workflowNodes = buildWorkflowPlanFromGoal(goal);
  setWorkflowStatus("已按目标生成线性计划。可继续编辑节点、工具和介入级别；当前不会写入后端。", "success");
  renderWorkflowBuilder();
}

function addWorkflowNode() {
  state.workflowNodes.push(
    createWorkflowNode({
      title: `人工补充节点 ${state.workflowNodes.length + 1}`,
      interventionLevel: "L1",
      estimatedCost: 0.1,
      estimatedDuration: 3,
    }),
  );
  setWorkflowStatus("已新增一个本地工作流节点。", "success");
  renderWorkflowBuilder();
}

function resetWorkflowPlan() {
  state.workflowNodes = [];
  setWorkflowStatus("已重置工作流计划。输入目标后可重新生成。", "idle");
  renderWorkflowBuilder();
}

function handleWorkflowNodeAction(button) {
  const card = button.closest("[data-workflow-node-id]");
  if (!card) return;
  const index = state.workflowNodes.findIndex((node) => node.id === card.dataset.workflowNodeId);
  if (index < 0) return;

  const action = button.dataset.workflowAction;
  if (action === "move-up" && index > 0) {
    [state.workflowNodes[index - 1], state.workflowNodes[index]] = [state.workflowNodes[index], state.workflowNodes[index - 1]];
  }
  if (action === "move-down" && index < state.workflowNodes.length - 1) {
    [state.workflowNodes[index], state.workflowNodes[index + 1]] = [state.workflowNodes[index + 1], state.workflowNodes[index]];
  }
  if (action === "delete") {
    state.workflowNodes.splice(index, 1);
    setWorkflowStatus(state.workflowNodes.length ? "节点已删除，总览已更新。" : "节点已清空，可重新生成计划。", "idle");
  }

  renderWorkflowBuilder();
}

function updateWorkflowNodeFromInput(event) {
  const field = event.target.dataset.workflowField;
  if (!field) return;
  const card = event.target.closest("[data-workflow-node-id]");
  if (!card) return;
  const node = state.workflowNodes.find((item) => item.id === card.dataset.workflowNodeId);
  if (!node) return;

  if (field === "estimatedCost") {
    node[field] = Math.max(0, Number.parseFloat(event.target.value) || 0);
    renderWorkflowSummary();
    return;
  }
  if (field === "estimatedDuration") {
    node[field] = Math.max(0, Number.parseInt(event.target.value, 10) || 0);
    renderWorkflowSummary();
    return;
  }

  node[field] = event.target.value;
  if (field === "interventionLevel") {
    renderWorkflowBuilder();
  }
}

async function createAgentDraft(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const button = qs("#createDraftButton");
  const ownerUserId = qs("#builderOwnerId").value.trim();
  const payload = {
    name: qs("#builderAgentName").value.trim(),
    description: qs("#builderGoal").value.trim(),
    visibility: qs("#builderVisibility").value,
  };

  if (!ownerUserId || !payload.name || !payload.description) {
    setBuildStatus("用户 ID、Agent 名称和场景说明都必须填写。", "error");
    return;
  }

  setBuildStatus("正在创建草稿并写入数据库...", "pending");
  button.disabled = true;
  form.classList.add("is-submitting");

  try {
    const response = await fetch(`${API_BASE}/agent-drafts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-Id": ownerUserId,
      },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "创建草稿失败");
    }
    renderDraftSummary(result.draft);
    setBuildStatus("草稿已创建，已写入 SQLite。可继续完善工作流计划；工作流当前仅保存在页面内。", "success");
  } catch (error) {
    setBuildStatus(error.message || "创建草稿失败", "error");
  } finally {
    button.disabled = false;
    form.classList.remove("is-submitting");
  }
}

async function copyBindInstruction() {
  try {
    await navigator.clipboard.writeText(bindInstruction);
    setBindStatus("指令已复制，可以发送给你的智能体。", "success");
  } catch (error) {
    qs("#bindInstruction").select();
    setBindStatus("无法直接写入剪贴板，请手动复制指令文本。", "error");
  }
}

function confirmAuthorizationCode() {
  const code = qs("#authorizationCode").value.trim() || "AUTO-AUTH-CODE";
  qs("#authorizationCode").value = code;
  setBindStatus("授权已通过，可继续查看 Schema 预览。", "success");
  renderSchemaPreview();
}

function checkBindStatus() {
  setBindStatus("绑定状态：已通过。", "success");
}

function stripStepPrefix(title) {
  return title.replace(/^Step\d+\s*/, "");
}

function renderOneStopInfo(agent) {
  const steps = agent.workflowSteps || [];
  const current = agent.oneStop.currentStage || 1;
  const statusLabel = { done: "已完成", active: "进行中", todo: "待开始" };
  const statusOf = (index) => (index + 1 < current ? "done" : index + 1 === current ? "active" : "todo");
  const doneCount = steps.filter((_, index) => index + 1 < current).length;
  const materials = agent.scriptFlow?.materials || [];

  const journey = steps
    .map(
      (step, index) => `
        <button class="journey-step ${statusOf(index)}" type="button" data-stage-index="${index}">
          <span class="journey-rail"><i></i></span>
          <span class="journey-body">
            <span class="journey-top">
              <strong>${String(index + 1).padStart(2, "0")} ${escapeHtml(stripStepPrefix(step.title))}</strong>
              <em class="journey-status ${statusOf(index)}">${statusLabel[statusOf(index)]}</em>
            </span>
            <span class="journey-desc">${escapeHtml(step.body)}</span>
          </span>
        </button>
      `,
    )
    .join("");

  return `
    <div class="panel-head">
      <h2>一站式服务</h2>
      <span>${steps.length} 个阶段</span>
    </div>
    <div class="run-agent-profile">
      <div class="detail-app-icon agent-cover ${agent.cover}" aria-hidden="true"></div>
      <h3>${escapeHtml(agent.name)}</h3>
    </div>
    <div class="onestop-banner">
      <strong>${escapeHtml(agent.oneStop.tagline)}</strong>
      <p>${escapeHtml(agent.oneStop.promise)}</p>
    </div>
    <div class="run-agent-section">
      <div class="run-agent-section-head">
        <strong>服务进度</strong>
        <span>${doneCount}/${steps.length} 已完成 · 点击查看结果</span>
      </div>
      <div class="journey-list">${journey}</div>
    </div>
    ${
      materials.length
        ? `
          <div class="run-agent-section">
            <div class="run-agent-section-head">
              <strong>需要你提供</strong>
              <span>${materials.length} 项</span>
            </div>
            <ul class="onestop-checklist">
              ${materials.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>
          </div>
        `
        : ""
    }
    <div class="run-agent-section">
      <div class="run-agent-section-head">
        <strong>一站式交付物</strong>
        <span>${agent.oneStop.deliverables.length} 份</span>
      </div>
      <div class="onestop-deliverables">
        ${agent.oneStop.deliverables.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
      </div>
    </div>
  `;
}

function renderRunAgentInfo(agent) {
  const container = qs("#runAgentInfo");
  if (!container) return;

  if (agent.oneStop && agent.workflowSteps?.length) {
    container.innerHTML = renderOneStopInfo(agent);
    return;
  }

  const meta = detailMeta(agent);
  const detailCategory = agent.detailCategory || agent.category;
  const steps = agent.workflowSteps || [];
  const stepPreview = steps
    .slice(0, 5)
    .map(
      (step, index) => `
        <li>
          <span>${String(index + 1).padStart(2, "0")}</span>
          <strong>${escapeHtml(stripStepPrefix(step.title))}</strong>
        </li>
      `,
    )
    .join("");

  container.innerHTML = `
    <div class="panel-head">
      <h2>Agent 详情</h2>
      <span>能力介绍</span>
    </div>
    <div class="run-agent-profile">
      <div class="detail-app-icon agent-cover ${agent.cover}" aria-hidden="true"></div>
      <h3>${escapeHtml(agent.name)}</h3>
      <p>${escapeHtml(agent.description)}</p>
    </div>
    <div class="run-agent-tags">
      ${agent.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
    </div>
    <div class="run-agent-facts">
      <div><span>类型</span><strong>${escapeHtml(detailCategory)}</strong></div>
      <div><span>模式</span><strong>${escapeHtml(agent.mode)}</strong></div>
      <div><span>健康度</span><strong>${agent.health}</strong></div>
      <div><span>用户</span><strong>${meta.users}</strong></div>
    </div>
    ${
      steps.length
        ? `
          <div class="run-agent-section">
            <div class="run-agent-section-head">
              <strong>流程覆盖</strong>
              <span>${steps.length} 步</span>
            </div>
            <ul class="run-agent-step-list">${stepPreview}</ul>
          </div>
        `
        : ""
    }
    ${
      agent.scriptFlow
        ? `
          <div class="run-agent-section">
            <div class="run-agent-section-head">
              <strong>参考材料</strong>
              <span>${agent.scriptFlow.materials.length} 项</span>
            </div>
            <p class="run-agent-note">${escapeHtml(agent.scriptFlow.materials.join("、"))}</p>
          </div>
        `
        : ""
    }
  `;
}

function renderRunView() {
  const agent = activeAgent();
  const used = recentAgentUsage
    .map((entry) => ({ ...entry, agent: agents.find((item) => item.id === entry.id) }))
    .filter((entry) => entry.agent);
  // 正在打开的 Agent 也算"用过"：若不在历史里，置顶为"刚刚使用"。
  if (!used.some((entry) => entry.id === agent.id)) {
    used.unshift({ id: agent.id, lastUsed: "刚刚", calls: 1, agent });
  }
  qs("#runAgentList").innerHTML = used
    .map(
      ({ id, lastUsed, calls, agent: item }) => `
        <button class="run-agent-button ${id === agent.id ? "active" : ""}" type="button" data-agent-id="${id}">
          <strong>${escapeHtml(item.name)}</strong>
          <span>${escapeHtml(item.detailCategory || item.category)} · 最近 ${lastUsed} · ${calls} 次</span>
        </button>
      `,
    )
    .join("");
  qs("#chatAgentName").textContent = agent.name;
  qs("#chatAgentMeta").textContent = agent.oneStop
    ? agent.oneStop.tagline
    : `${agent.detailCategory || agent.category} · ${agent.mode}`;
  renderPromptSuggestions(agent);
  renderRunAgentInfo(agent);
}

function formatMessageHtml(value) {
  return escapeHtml(value).replaceAll("\n", "<br>");
}

function buildLegalReply(text) {
  if (/确认提交|提交立案|确认立案|确认无误/.test(text)) {
    return "已确认提交，立案材料包正在递交法院。\n\n1. 起诉状.docx、证据目录.xlsx、财产保全申请书.docx 已通过线上立案系统一并提交。\n2. 案件号待法院受理后自动回填到你的节点日历。\n\n我已经为你建立全流程提醒：缴费、补正、举证期限、开庭准备会按节点提醒你确认。\n\n到这里，从一句话咨询到立案提交已经全程跑通。后续如果需要财产保全或强制执行，我可以直接接力，你不用在多个系统之间来回切换。";
  }

  if (/时效|超过|三年|3 年|3年/.test(text)) {
    return "时效本身没过：从约定还款日 2023-06-01 起算，目前还没满 3 年。\n\n我会重点保留 3 类材料：\n1. 借条原件或清晰扫描件。\n2. 微信催收原始记录。\n3. 对方回复“再等等”等承认欠款的内容。\n\n建议把原始聊天文件保留好，必要时做公证备用。";
  }

  if (/证据|够不够|借条|银行|回单|微信|现金|材料/.test(text)) {
    return "我先按证据链做一次评估：\n\n主体证据：齐全。身份证号、住所信息已具备。\n借贷合意：齐全。借条可以证明借款关系。\n交付凭证：部分缺口。银行回单覆盖 300 万，现金交付部分需要补强。\n\n建议补充取现流水、当日沟通记录或见证人材料；如果补强困难，可以优先围绕转账部分确定诉讼请求。";
  }

  if (/费用|多少钱|花多少钱|成本|受理费|保全费/.test(text)) {
    return "费用节点结果如下：\n\n案件受理费：约 46,800 元，通常立案时缴纳。\n财产保全申请费：5,000 元，申请保全时缴纳。\n保全保函费用：通常按担保机构报价确认。\n\n这部分是诉讼费用口径，不是平台调用费用。胜诉后可以依法主张由被告承担，但原告一般需要先垫付。";
  }

  if (/立案|材料包|起诉状|提交|法院/.test(text)) {
    return "我按管辖法院常用格式生成了立案材料包：\n\n1. 起诉状.docx：诉讼请求、事实理由、证据引用已填写。\n2. 证据目录.xlsx：借条、回单、微信催收按证明目的归类。\n3. 财产保全申请书.docx：包含担保材料和财产线索清单。\n\n你可以走法院线上立案小程序提交，也可以打印后线下递交。";
  }

  if (/接下来|怎么办|流程|步骤|工作流/.test(text)) {
    return "根据你提供的材料，我把“从现在到法院受理”拆成 9 个节点：\n\n1. 诉讼时效校验\n2. 证据完整性与效力评估\n3. 管辖法院确定\n4. 自动生成诉讼文书\n5. 费用计算与保全策略\n6. 财产保全同步申请\n7. 立案材料包生成与提交\n8. 节点追踪与提醒\n9. 执行阶段预案\n\n你可以继续问任意一个节点，我会按该节点给出演示结果。";
  }

  return "可以自起诉。我会先确认 4 个关键信息：\n\n1. 是否有借条或借款合同。\n2. 资金是转账还是现金交付。\n3. 催收记录是否能证明对方承认欠款。\n4. 是否掌握借款人身份证号和住所地。\n\n你可以继续补充材料，我会把案件拆成可执行的诉讼工作流。";
}

function buildMockAgentReply(agent, text) {
  if (agent.id === "private-lending-litigation-agent") {
    return buildLegalReply(text);
  }
  const firstStep = agent.workflowSteps?.[0]?.title || "任务理解";
  const outputMode = agent.mode || "结构化";
  return `已收到任务。\n\n我会按“${firstStep}”开始拆解任务，并输出${outputMode}结果、关键风险点和下一步行动清单。`;
}

// 一站式服务地图：点击某个阶段，直接用该阶段的数据演示结果。
function runWorkflowStage(stepIndex) {
  const agent = activeAgent();
  const step = agent.workflowSteps?.[stepIndex];
  if (!step) return;
  const stream = qs("#chatStream");
  if (!stream) return;

  const question = step.trigger ? step.trigger.replace(/^节点触发[:：]\s*/, "") : stripStepPrefix(step.title);
  const lines = [`【阶段 ${stepIndex + 1} · ${stripStepPrefix(step.title)}】`, step.body];
  if (step.output) lines.push(`输出：${step.output}`);
  if (step.note) lines.push(`提示：${step.note}`);
  const filesHtml = step.files ? renderFileCards(step.files) : "";

  stream.insertAdjacentHTML(
    "beforeend",
    `<div class="message user"><p>${escapeHtml(question)}</p></div>`,
  );
  stream.insertAdjacentHTML(
    "beforeend",
    `<div class="message assistant"><p>${formatMessageHtml(lines.join("\n\n"))}</p>${filesHtml}</div>`,
  );
  stream.scrollTop = stream.scrollHeight;
}

function renderFileCards(files) {
  return `<div class="file-cards">${files
    .map(
      (f) => `<button class="file-card" type="button" data-doc="${escapeHtml(f.name)}">
        <span class="file-ic ${escapeHtml(f.type)}">${escapeHtml(f.type.toUpperCase())}</span>
        <span class="file-meta"><strong>${escapeHtml(f.name)}</strong><em>${escapeHtml(f.size)} · 点击预览</em></span>
      </button>`,
    )
    .join("")}</div>`;
}

function openDocPreview(name) {
  const doc = legalDocuments[name];
  const overlay = qs("#docPreview");
  if (!doc || !overlay) return;
  overlay.querySelector(".doc-title").textContent = doc.title;
  overlay.querySelector(".doc-file").textContent = name;
  overlay.querySelector(".doc-body").innerHTML = doc.html;
  const dl = overlay.querySelector(".doc-download");
  dl.setAttribute("href", doc.download);
  dl.setAttribute("download", name);
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
}

function closeDocPreview() {
  const overlay = qs("#docPreview");
  if (!overlay) return;
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
}

async function sendAgentMessage() {
  const input = qs("#chatInput");
  const text = input.value.trim();
  if (!text) return;

  const stream = qs("#chatStream");
  const agent = activeAgent();
  const button = qs("#sendMessage");
  stream.insertAdjacentHTML(
    "beforeend",
    `<div class="message user"><p>${escapeHtml(text)}</p></div>`,
  );
  stream.insertAdjacentHTML(
    "beforeend",
    `<div class="message assistant pending" id="pendingAgentMessage"><p>正在生成结果...</p></div>`,
  );
  input.value = "";
  stream.scrollTop = stream.scrollHeight;

  button.disabled = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 420));
    const answer = buildMockAgentReply(agent, text);
    const pending = qs("#pendingAgentMessage");
    pending.classList.remove("pending");
    pending.innerHTML = `<p>${formatMessageHtml(answer)}</p>`;
  } catch (error) {
    const pending = qs("#pendingAgentMessage");
    if (pending) {
      pending.classList.remove("pending");
      pending.classList.add("warning");
      pending.innerHTML = `<p>${escapeHtml(error.message || "生成失败")}</p>`;
    }
  } finally {
    button.disabled = false;
    const pending = qs("#pendingAgentMessage");
    if (pending) pending.removeAttribute("id");
    stream.scrollTop = stream.scrollHeight;
  }
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.addEventListener("click", (event) => {
  const nav = event.target.closest("[data-view]");
  if (nav) setView(nav.dataset.view);

  const link = event.target.closest("[data-view-link]");
  if (link) setView(link.dataset.viewLink);

  const category = event.target.closest("[data-category]");
  if (category) {
    state.activeCategory = category.dataset.category;
    renderCategories();
    renderAgentGrid();
  }

  const agentButton = event.target.closest("[data-agent-id]");
  if (agentButton) {
    state.activeAgentId = agentButton.dataset.agentId;
    renderAgentGrid();
    renderRunView();
  }

  const runButton = event.target.closest("[data-run-agent]");
  if (runButton) {
    state.activeAgentId = runButton.dataset.runAgent;
    setView("run");
  }

  const openAgentButton = event.target.closest("[data-open-agent]");
  if (openAgentButton && !event.target.closest("[data-run-agent]")) {
    openAgentInMarket(openAgentButton.dataset.openAgent);
  }

  const bubbleClose = event.target.closest(".inapp-bubble-close");
  if (bubbleClose) {
    bubbleClose.closest(".inapp-bubble")?.classList.add("dismissed");
  }

  const promptButton = event.target.closest("[data-prompt]");
  if (promptButton) {
    qs("#chatInput").value = promptButton.dataset.prompt;
    qs("#chatInput").focus();
  }

  const stageButton = event.target.closest("[data-stage-index]");
  if (stageButton) {
    runWorkflowStage(Number(stageButton.dataset.stageIndex));
  }

  const sourceButton = event.target.closest("[data-source]");
  if (sourceButton) {
    const source = sources.find((item) => item.key === sourceButton.dataset.source);
    state.activeSource = source.key;
    qs("#selectedSourceName").textContent = source.name;
    qs("#selectedSourceMeta").textContent = source.meta;
    renderSources();
    renderImportInputMode();
  }

  const introButton = event.target.closest(".agent-long-intro button");
  if (introButton) {
    const intro = introButton.closest(".agent-long-intro");
    const expanded = intro.classList.toggle("expanded");
    introButton.textContent = expanded ? "收起" : "展开";
  }

  const docButton = event.target.closest("[data-doc]");
  if (docButton) {
    openDocPreview(docButton.dataset.doc);
  }

  if (event.target.closest(".doc-close") || event.target.classList.contains("doc-overlay")) {
    closeDocPreview();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeDocPreview();
});

qs("#globalSearch").addEventListener("input", (event) => {
  state.search = event.target.value;
  renderAgentGrid();
});

qs("#sortFilter").addEventListener("change", renderAgentGrid);
qs("#parseButton").addEventListener("click", () => renderSchemaPreview("parsed"));
qs("#copyBindInstruction").addEventListener("click", copyBindInstruction);
qs("#confirmAuthorization").addEventListener("click", confirmAuthorizationCode);
qs("#checkBindStatus").addEventListener("click", checkBindStatus);
qs("#authorizationCode").addEventListener("input", renderSchemaPreview);
qs("#sendMessage").addEventListener("click", sendAgentMessage);
qs("#createDraftForm").addEventListener("submit", createAgentDraft);
qs("#generateWorkflowButton").addEventListener("click", generateWorkflowPlan);
qs("#addWorkflowNodeButton").addEventListener("click", addWorkflowNode);
qs("#resetWorkflowButton").addEventListener("click", resetWorkflowPlan);
qs("#workflowNodeList").addEventListener("click", (event) => {
  const button = event.target.closest("[data-workflow-action]");
  if (button) handleWorkflowNodeAction(button);
});
qs("#workflowNodeList").addEventListener("input", updateWorkflowNodeFromInput);
qs("#workflowNodeList").addEventListener("change", updateWorkflowNodeFromInput);

renderCategories();
renderAgentGrid();
renderSources();
renderImportInputMode();
renderRunView();
renderInappView();
renderWorkflowBuilder();
