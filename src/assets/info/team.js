/**
 * 工作室公开成员资料。
 * 负责人固定在第一位；长介绍成员相邻排列，以保持三列卡片布局整齐。
 * `skinBackgroundColors` 可选，分别设置玩家模型在浅色、暗色主题下的背景色：
 * skinBackgroundColors: { light: '#dcefb4', dark: '#26372c' }
 * 颜色为空或未填写时，将根据成员 MCID 从对应主题的预设色板中稳定生成。
 */
export const teamMembers = Object.freeze(
  [
    {
      name: '雨过天也清',
      role: '负责人',
      description: '大姐姐天下第一',
      minecraftSkinId: 'Rain_G',
      skinBackgroundColors: {
        light: '#dcefb4',
        dark: '#26372c',
      },
    },
    {
      name: '真实z',
      role: '网站负责人、程序 test',
      description: '琴寄文乃天下第一',
      minecraftSkinId: 'zhenshiz',
    },
    {
      name: '致易',
      role: '气氛组、团队“造谣”者',
      description: '祖坚正庆天下第一',
      minecraftSkinId: 'CharlieZY_',
      skinBackgroundColors: {
        light: '#177d4c',
        dark: '#0c4f2f',
      },
    },
    {
      name: '锡麟',
      role: '万能自由人',
      description: '但行善，莫问前程',
      minecraftSkinId: 'zuiter_ZTXL',
      skinBackgroundColors: {
        light: '#40DE5A',
        dark: '#228B22',
      },
    },
    {
      name: '渔泽',
      role: '汉化、美工、策划',
      description: '被工作抽得如陀螺般旋转',
      minecraftSkinId: 'shiroi_sakana',
      skinBackgroundColors: {
        light: '#73CC80',
        dark: '#689E5F',
      },
    },
    {
      name: 'MegaDarkness',
      role: '摸鱼',
      description: '蝴蝶の夢',
      minecraftSkinId: 'Mega32K',
    },
    {
      name: '鸽子尹解',
      role: '剪辑',
      description:
        '无极玄穹高上帝玉真主宰九宸御历统天肇开化育朗重霄光明满赫奕雷霆法主威权斩妖伐邪荡魔护道清微妙有先天至圣宸居紫金琼阙统摄三界十方万灵巡游大千证果超卓不可思议功德自在行神感化救苦慈悲广度天尊金阙无上至尊自然妙有弥罗至真玉皇总持阴阳二气斡旋造化玄机执掌天经地纬号令星斗群真降福消灾解厄济生度死延祥应化无方圣恩广被万天宗主三界法王大悲大愿大圣大慈昊天金阙玉皇大天尊玄穹高上帝坐镇凌霄宝殿统御诸天星曜主持人间祸福判察善恶忠奸泽被苍生灵彰万类祥光普照寰宇紫气充盈大千神通浩荡法力无边护持正法镇伏群魔恩施三界德沛十方灵光普照万法归宗至圣至仁至威至灵玉皇上帝赦罪解厄延寿赐福天尊混元开极太初道祖万炁宗主先天元君紫宸丹皇太微帝君统御万灵执掌乾坤造化枢机权衡阴阳顺逆洞明三界幽微洞察六道轮回威镇九天十地德被四生六道大悲大愿大圣大慈大仁大孝大智大慧玄元圣祖万法至尊清微启运灵宝含真丹霄御极紫府凝神上极无上大梵天王万德庄严千灵拱卫神通广大法力无边普度群生救度万类消灾解厄赐福延生护国安民镇邪伏魔灵光普照圣德昭彰金容玉相万劫长存道贯古今德配天地威震寰宇泽被尘寰福佑群生功高万代名垂千古圣号巍巍神威赫赫区圣帝君都有人黑啊？nb。。。对不起，刚才外面人有点多',
      minecraftSkinId: 'PigeonYin',
    },
    {
      name: 'JustFaust',
      role: '美工、不时陷入催眠，陷入催眠时释放催眠烟雾、不时陷入发狂、陷入发狂时释放划空癫火',
      description:
        '你说得对,但是异世界情绪是一名2019年12月开始在YouTube活动的Vtuber\n梦想着用自己的歌与创作来表现世界的虚拟黑暗歌手\n在以ヰ世界情绪为名的画布上编织出崭新的故事\n异世界情绪拥有的不仅是歌唱的才能，更在表演、绘画等众多方面展现着自己的多才多艺\n关注异世界情绪喵，关注异世界情绪谢谢喵',
      minecraftSkinId: 'JustFaust',
    },
    {
      name: '时光/时莞',
      role: '文本皇帝、灵感提供者、团队心腹大患、社交魔王、节目效果之神、麦克风主宰者',
      description:
        '于是我到达了世界尽头，回首相望，\n没有肆虐的风，喧嚣的人儿，\n只有一群一直赶着我向前走的傻逼们；\n跑起来吧，\n你不是跑得最快了吗？',
      minecraftSkinId: 'TheShiGuang',
    },
    {
      name: '小猫柠檬挞',
      role: '文本',
      description: '高中没有初中有创造力，初中没有高中有创造力，好崩溃',
      minecraftSkinId: 'Lemon_Catt',
    },
    {
      name: '小冻',
      role: '汉化、剪辑、程序',
      description: '朝着希望不停奔跑，希望就会比预想先来临',
      minecraftSkinId: 'XD_ON',
    },
    {
      name: '樂',
      role: '简单建筑、指令、数据包、灵感提供等',
      description: '赢！Hide！迷路！',
      minecraftSkinId: 'TheLe_',
    },
    {
      name: 'cat酱˃ʍ˂',
      role: '译员',
      description: '一切都会好起来的',
      minecraftSkinId: 'TheCatCatCat417',
    },
    {
      name: '牛排吖',
      role: '程序',
      description: '为啥',
      minecraftSkinId: 'Tasty_Steak',
    },
    {
      name: '许空林',
      role: '只是个懒虫',
      description: '某一天在梦里梦见月光下的地点',
      minecraftSkinId: 'EitoSho',
      skinBackgroundColors: {
        light: '#E8E8E8',
        dark: '#424C50',
      },
    },
    {
      name: 'Snoivyel',
      role: '神秘高手',
      description: '我很神秘',
      minecraftSkinId: 'Snoivyel',
    },
    {
      name: '8455',
      role: '烟花气氛组',
      description: '烟花真好看',
      minecraftSkinId: 'WS_8455',
    },
    {
      name: 'Cn',
      role: '气氛组hide大王',
      description: '真是光阴似箭\n全是矢，还挺箭\n光阴我了，咋不直接整似我啊',
      minecraftSkinId: 'TheChengNian',
    },
  ].map((member) =>
    Object.freeze({
      ...member,
      skinBackgroundColors: Object.freeze({
        light: '',
        dark: '',
        ...member.skinBackgroundColors,
      }),
    }),
  ),
)
