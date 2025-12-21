// 导入本地图片资源
import animeCover1 from '../assets/images/anime-cover-1.svg';
import animeCover2 from '../assets/images/anime-cover-2.svg';
import animeCover3 from '../assets/images/anime-cover-3.svg';
import animeCover4 from '../assets/images/anime-cover-4.svg';
import animeCover5 from '../assets/images/anime-cover-5.svg';
import animeCover6 from '../assets/images/anime-cover-6.svg';
import animeCover7 from '../assets/images/anime-cover-7.svg';
import animeCover8 from '../assets/images/anime-cover-8.svg';
import animeCover9 from '../assets/images/anime-cover-9.svg';
import animeCover10 from '../assets/images/anime-cover-10.svg';
import animeCover11 from '../assets/images/anime-cover-11.svg';
import animeCover12 from '../assets/images/anime-cover-12.svg';

// 模拟国漫数据
const animeData = [
  {
    id: 1,
    title: '斗罗大陆',
    originalTitle: 'Douluo Dalu',
    cover: animeCover1,
    type: '动作、奇幻、冒险',
    releaseYear: 2018,
    status: '连载中',
    episodes: 196,
    rating: 4.7,
    studio: '玄机科技',
    description:
      '唐门外门弟子唐三，因偷学内门绝学《玄天功》被师父逐出师门，为了唐门的荣誉，他决定深入"诺丁学院"学习。唐三在学院里结识了小舞、戴沐白、奥斯卡、马红俊、宁荣荣、朱竹清等人，并想办法进入了"史莱克学院"。随着唐三武魂觉醒异常，他意识到自己肩负的使命，以及牵扯在她一家身上的千年仇恨。',
    tags: ['玄幻', '武侠', '热血', '战斗'],
    popularity: 9800,
    trailer: 'https://youtu.be/example1',
    staff: [
      { role: '原著', name: '唐家三少' },
      { role: '导演', name: '沈乐平' },
    ],
    characters: [
      { name: '唐三', role: '主角', voice: '边江' },
      { name: '小舞', role: '女主角', voice: '锦儿' },
      { name: '戴沐白', role: '配角', voice: '西川' },
    ],
    relatedAnime: [2, 5, 8],
    watchLinks: [
      { platform: '腾讯视频', url: 'https://v.qq.com/example' },
      { platform: 'bilibili', url: 'https://www.bilibili.com/example' },
    ],
    reviews: [
      { user: '动漫迷123', rating: 5, comment: '国漫良心之作，每一集都充满热血与感动' },
      { user: '幻想者', rating: 4, comment: '制作精良，情节引人入胜，期待后续发展' },
    ],
  },
  {
    id: 2,
    title: '天官赐福',
    originalTitle: "Heaven Official's Blessing",
    cover: animeCover2,
    type: '仙侠、奇幻、古风',
    releaseYear: 2020,
    status: '已完结',
    episodes: 11,
    rating: 4.9,
    studio: '绘梦动画',
    description:
      '天官赐福讲述了已成仙的前太子谢怜与神秘的鬼王花城之间的冒险故事。谢怜三次成神，三次被贬，在第三次成为天官后，他不慎遇到了一个自称是他的头号粉丝的鬼王。故事围绕着谢怜解开自己的前世之谜，以及与花城的感情发展展开。',
    tags: ['古风', 'BL', '奇幻', '冒险'],
    popularity: 9500,
    trailer: 'https://youtu.be/example2',
    staff: [
      { role: '原著', name: '墨香铜臭' },
      { role: '导演', name: '李豪凌' },
    ],
    characters: [
      { name: '谢怜', role: '主角', voice: '姜广涛' },
      { name: '花城', role: '男主角', voice: '马正阳' },
      { name: '风子', role: '配角', voice: '伍六七' },
    ],
    relatedAnime: [3, 6, 12],
    watchLinks: [
      { platform: 'bilibili', url: 'https://www.bilibili.com/example' },
      { platform: '优酷', url: 'https://www.youku.com/example' },
    ],
    reviews: [
      { user: '古风爱好者', rating: 5, comment: '作画精美，还原度高，剧情扣人心弦' },
      { user: '墨香粉', rating: 5, comment: '终于等到了心爱作品的动画化，太满足了' },
    ],
  },
  {
    id: 3,
    title: '魔道祖师',
    originalTitle: 'Mo Dao Zu Shi',
    cover: animeCover3,
    type: '仙侠、悬疑、古风',
    releaseYear: 2018,
    status: '已完结',
    episodes: 33,
    rating: 4.8,
    studio: '绘梦动画',
    description:
      '围绕着云梦江氏的少主魏无羡与姑苏蓝氏的二公子蓝忘机展开的一段啼笑皆非的仙侠传奇。魏无羡因机缘巧合，重生到一个自甘堕落的修士身上，开始了一段寻回真相的旅程。',
    tags: ['古风', '仙侠', '悬疑', '情感'],
    popularity: 9600,
    trailer: 'https://youtu.be/example3',
    staff: [
      { role: '原著', name: '墨香铜臭' },
      { role: '导演', name: '熊可' },
    ],
    characters: [
      { name: '魏无羡', role: '主角', voice: '鹿杖客' },
      { name: '蓝忘机', role: '男主角', voice: '边江' },
      { name: '江澄', role: '配角', voice: '张杰' },
    ],
    relatedAnime: [2, 7, 13],
    watchLinks: [
      { platform: '腾讯视频', url: 'https://v.qq.com/example' },
      { platform: 'bilibili', url: 'https://www.bilibili.com/example' },
    ],
    reviews: [
      { user: '魔道迷', rating: 5, comment: '每一帧都能当壁纸，剧情还原很到位' },
      { user: '动漫达人', rating: 4, comment: '国漫制作精良的代表作，值得一看' },
    ],
  },
  {
    id: 4,
    title: '全职高手',
    originalTitle: "The King's Avatar",
    cover: animeCover4,
    type: '游戏、电竞、热血',
    releaseYear: 2017,
    status: '已完结',
    episodes: 40,
    rating: 4.6,
    studio: '彩色铅笔',
    description:
      '网游荣耀中被誉为教科书级别的顶尖高手叶修，因为种种原因遭到俱乐部的驱逐，离开职业圈的他被兴欣网吧收留，然而随着荣耀十区的开启，他重新回到了职业之巅。',
    tags: ['电竞', '游戏', '团队', '励志'],
    popularity: 9300,
    trailer: 'https://youtu.be/example4',
    staff: [
      { role: '原著', name: '蝴蝶蓝' },
      { role: '导演', name: '史涓生' },
    ],
    characters: [
      { name: '叶修', role: '主角', voice: '阿杰' },
      { name: '苏沐橙', role: '女主角', voice: '刘丽琴' },
      { name: '黄少天', role: '配角', voice: 'TF家族-易烊千玺' },
    ],
    relatedAnime: [9, 10, 14],
    watchLinks: [
      { platform: '爱奇艺', url: 'https://www.iqiyi.com/example' },
      { platform: 'bilibili', url: 'https://www.bilibili.com/example' },
    ],
    reviews: [
      { user: '电竞迷', rating: 5, comment: '完美呈现了电竞选手的热血与拼搏精神' },
      { user: '游戏玩家', rating: 4, comment: '剧情紧凑，人物塑造深入，推荐观看' },
    ],
  },
  {
    id: 5,
    title: '灵笼',
    originalTitle: 'Ling Long',
    cover: animeCover5,
    type: '科幻、末世、冒险',
    releaseYear: 2019,
    status: '连载中',
    episodes: 13,
    rating: 4.5,
    studio: '艺画开天',
    description:
      '未来世界，地球环境剧变，人类被迫生活在塔内避难所"三十三号城市"中。外围满是巨型怪物，塔内则有三大势力角力：联合政府、企业联合体与天选者。故事围绕着主角标记为"麒"的男子，从三十三号城市下层前往地面的旅途中所展开。',
    tags: ['科幻', '末世', '机甲', '悬疑'],
    popularity: 8900,
    trailer: 'https://youtu.be/example5',
    staff: [
      { role: '导演', name: '艺画开天团队' },
      { role: '剧本', name: '艺画开天编剧组' },
    ],
    characters: [
      { name: '"麒"', role: '主角', voice: '宝木中阳' },
      { name: '马克', role: '配角', voice: '藤新' },
      { name: '琳', role: '女主角', voice: '图特哈蒙' },
    ],
    relatedAnime: [11, 15, 21],
    watchLinks: [
      { platform: 'bilibili', url: 'https://www.bilibili.com/example' },
      { platform: '爱奇艺', url: 'https://www.iqiyi.com/example' },
    ],
    reviews: [
      { user: '科幻迷', rating: 5, comment: '国产原创科幻动画的巅峰之作' },
      { user: '动画迷', rating: 4, comment: '世界观宏大，画面精良，值得一看' },
    ],
  },
  {
    id: 6,
    title: '大理寺日志',
    originalTitle: 'Mystery of Antiques',
    cover: animeCover6,
    type: '古风、推理、悬疑',
    releaseYear: 2020,
    status: '已完结',
    episodes: 12,
    rating: 4.3,
    studio: 'B.CMAY PICTURES',
    description:
      '《大理寺日志》讲述了唐朝大理寺的小官员李饼，奉命与法医宋不悲、女捕快白情儿，一起破获各种离奇案件的故事。李饼虽不会武功，但智慧过人，善于观察，屡屡靠理性推理解决危机。',
    tags: ['古风', '推理', '悬疑', '喜剧'],
    popularity: 8500,
    trailer: 'https://youtu.be/example6',
    staff: [
      { role: '原著', name: '沐清雨' },
      { role: '导演', name: '李豪凌' },
    ],
    characters: [
      { name: '李饼', role: '主角', voice: '阿杰' },
      { name: '白情儿', role: '女主角', voice: '杨天翔' },
      { name: '宋不悲', role: '配角', voice: '刘校妤' },
    ],
    relatedAnime: [16, 17, 25],
    watchLinks: [
      { platform: 'bilibili', url: 'https://www.bilibili.com/example' },
      { platform: '优酷', url: 'https://www.youku.com/example' },
    ],
    reviews: [
      { user: '推理爱好者', rating: 4, comment: '轻松幽默中带着烧脑的推理，很有特色' },
      { user: '古风粉', rating: 5, comment: '画风独特，故事有趣，国漫佳作' },
    ],
  },
  {
    id: 7,
    title: '镇魂街',
    originalTitle: 'Rakshasa Street',
    cover: animeCover7,
    type: '都市、奇幻、热血',
    releaseYear: 2016,
    status: '连载中',
    episodes: 24,
    rating: 4.4,
    studio: '刘阔工作室',
    description:
      '普通上班族夏铃在一次意外中wanderer，被卷入了守护灵体的战斗。为了查明真相，她来到了镇魂街，并在这里遇到了拥有"双守护灵"的少年曹焱兵。两人一起，卷入了一场关乎镇魂街存亡的战斗中。',
    tags: ['热血', '都市', '灵异', '战斗'],
    popularity: 9100,
    trailer: 'https://youtu.be/example7',
    staff: [
      { role: '原著', name: '许辰' },
      { role: '导演', name: '刘阔' },
    ],
    characters: [
      { name: '曹焱兵', role: '主角', voice: '阿杰' },
      { name: '夏铃', role: '女主角', voice: '边江' },
      { name: '黑熊精', role: '配角', voice: '锦儿' },
    ],
    relatedAnime: [19, 22, 26],
    watchLinks: [
      { platform: '腾讯视频', url: 'https://v.qq.com/example' },
      { platform: 'bilibili', url: 'https://www.bilibili.com/example' },
    ],
    reviews: [
      { user: '漫迷小王', rating: 4, comment: '国漫中少有的打斗场面流畅的作品' },
      { user: '动画达人', rating: 5, comment: '题材新颖，人设出彩，剧情紧凑' },
    ],
  },
  {
    id: 8,
    title: '武庚纪',
    originalTitle: "Chronicles of the God's Order",
    cover: animeCover8,
    type: '神话、热血、战斗',
    releaseYear: 2016,
    status: '连载中',
    episodes: 92,
    rating: 4.5,
    studio: '玄机科技',
    description:
      '《武庚纪》的故事发生在神话时代，各部落蒸蒸日上，种族林立，争斗不断。武庚因对神之手政策不满，被神所杀，灵魂转生到孤儿武日身上，开始了复仇之路，并揭开了更大的阴谋。',
    tags: ['玄幻', '神话', '热血', '复仇'],
    popularity: 9000,
    trailer: 'https://youtu.be/example8',
    staff: [
      { role: '原著', name: '郑健和' },
      { role: '导演', name: '沈乐平' },
    ],
    characters: [
      { name: '武庚', role: '主角', voice: '暂无' },
      { name: '孔雀', role: '女主角', voice: '暂无' },
      { name: '风后', role: '配角', voice: '暂无' },
    ],
    relatedAnime: [1, 7, 18],
    watchLinks: [
      { platform: '腾讯视频', url: 'https://v.qq.com/example' },
      { platform: 'bilibili', url: 'https://www.bilibili.com/example' },
    ],
    reviews: [
      { user: '神话迷', rating: 5, comment: '对中国传统神话的创新演绎，精彩绝伦' },
      { user: '漫画读者', rating: 4, comment: '原著粉表示动画还原度很高，制作精良' },
    ],
  },
  {
    id: 9,
    title: '凡人修仙传',
    originalTitle: "A Record of a Mortal's Journey to Immortality",
    cover: animeCover9,
    type: '修仙、冒险、奇幻',
    releaseYear: 2020,
    status: '连载中',
    episodes: 22,
    rating: 4.6,
    studio: '中影年年',
    description:
      '普通少年韩立为求修仙长生，历经种种艰险、背叛、打压，在修仙界攀登巅峰的故事。从默默无闻到一跃成为修仙界的传奇，韩立的经历充满了生存危机与成长。',
    tags: ['修仙', '冒险', '奇幻', '成长'],
    popularity: 8800,
    trailer: 'https://youtu.be/example9',
    staff: [
      { role: '原著', name: '忘语' },
      { role: '导演', name: '赵禹晴' },
    ],
    characters: [
      { name: '韩立', role: '主角', voice: '山新' },
      { name: '南宫婉', role: '女主角', voice: '皇贞季' },
      { name: '墨大夫', role: '配角', voice: '佟心竹' },
    ],
    relatedAnime: [4, 20, 24],
    watchLinks: [
      { platform: 'bilibili', url: 'https://www.bilibili.com/example' },
      { platform: '爱奇艺', url: 'https://www.iqiyi.com/example' },
    ],
    reviews: [
      { user: '修仙迷', rating: 5, comment: '难得一见的硬核修仙动画，剧情扎实' },
      { user: '二次元', rating: 4, comment: '打斗场面流畅，特效炫酷，很有代入感' },
    ],
  },
  {
    id: 10,
    title: '雾山五行',
    originalTitle: 'Fog Hill of Five Elements',
    cover: animeCover10,
    type: '武侠、奇幻、冒险',
    releaseYear: 2020,
    status: '连载中',
    episodes: 3,
    rating: 4.8,
    studio: '六道无鱼',
    description:
      '《雾山五行》讲述了生活在"神秘瘴气"笼罩的雾山之中的少数民族"苗民"，为了驱散瘴气，保护族人，以"五行"的力量与瘴气背后的邪恶"神"展开一场旷世大战的故事。',
    tags: ['武侠', '五行', '民族风', '战斗'],
    popularity: 9200,
    trailer: 'https://youtu.be/example10',
    staff: [
      { role: '导演', name: '林魂' },
      { role: '剧本', name: '煦有猫' },
    ],
    characters: [
      { name: '辰月', role: '主角', voice: '沈念如' },
      { name: '菊影', role: '女主角', voice: '李兰陵' },
      { name: '羽非', role: '配角', voice: '醋醋' },
    ],
    relatedAnime: [14, 18, 21],
    watchLinks: [
      { platform: 'bilibili', url: 'https://www.bilibili.com/example' },
      { platform: '优酷', url: 'https://www.youku.com/example' },
    ],
    reviews: [
      { user: '动画评论家', rating: 5, comment: '国漫巅峰之作，每一帧都是壁纸' },
      { user: '五行迷', rating: 5, comment: '中国传统元素与现代动画的完美结合' },
    ],
  },
  {
    id: 11,
    title: '刺客伍六七',
    originalTitle: 'Killer Seven',
    cover: animeCover11,
    type: '喜剧、动作、热血',
    releaseYear: 2018,
    status: '连载中',
    episodes: 24,
    rating: 4.7,
    studio: '啊哈娱乐',
    description:
      '这是一部以爆笑为主题的动画，讲述了一个想要隐姓埋名的刺客——伍六七，在边境小镇开理发店的故事。由于身手了得，他被许多人追杀，只能一边打工一边保命，在生死边缘中寻求真相。',
    tags: ['搞笑', '热血', '动作', '悬疑'],
    popularity: 9400,
    trailer: 'https://youtu.be/example11',
    staff: [
      { role: '导演', name: '何小疯' },
      { role: '制作', name: '啊哈娱乐' },
    ],
    characters: [
      { name: '伍六七', role: '主角', voice: '何小疯' },
      { name: '鸡大保', role: '配角', voice: '姜广涛' },
      { name: '梅花十三', role: '女主角', voice: '段艺璇' },
    ],
    relatedAnime: [5, 17, 23],
    watchLinks: [
      { platform: 'bilibili', url: 'https://www.bilibili.com/example' },
      { platform: '腾讯视频', url: 'https://v.qq.com/example' },
    ],
    reviews: [
      { user: '欢乐剧迷', rating: 5, comment: '国漫良心之作，笑中带泪' },
      { user: '伍六七粉', rating: 5, comment: '不看你就亏了，每集都让人期待' },
    ],
  },
  {
    id: 12,
    title: '元龙',
    originalTitle: 'Yuan Long',
    cover: animeCover12,
    type: '玄幻、异世界、冒险',
    releaseYear: 2020,
    status: '连载中',
    episodes: 16,
    rating: 4.3,
    studio: '腾讯视频',
    description:
      '《元龙》讲述了特种兵王胜被一道神秘的雷电劈中后穿越到异世界，并附身到另一个叫做王胜的少年体内。在这个异世界中，家族与个人的力量至上，王胜不得不依靠现代知识与军事素养，从一个懦弱少年逐渐成长为强者的故事。',
    tags: ['穿越', '异世界', '战斗', '成长'],
    popularity: 8700,
    trailer: 'https://youtu.be/example12',
    staff: [
      { role: '原著', name: '任怨' },
      { role: '导演', name: '孙纪剑' },
    ],
    characters: [
      { name: '王胜', role: '主角', voice: '苏尚卿' },
      { name: '温馨', role: '女主角', voice: '郭浩然' },
      { name: '李飞飞', role: '配角', voice: '冷泉夜月' },
    ],
    relatedAnime: [2, 8, 16],
    watchLinks: [
      { platform: '腾讯视频', url: 'https://v.qq.com/example' },
      { platform: 'bilibili', url: 'https://www.bilibili.com/example' },
    ],
    reviews: [
      { user: '玄幻爱好者', rating: 4, comment: '穿越故事中的一股清流，制作不错' },
      { user: '异世界迷', rating: 4, comment: '主角光环适中，剧情发展合理' },
    ],
  },
];

export const featuredAnime = [1, 2, 3, 4, 10];
export const popularAnime = [11, 3, 1, 7, 10, 2, 5, 9];
export const newReleases = [10, 12, 5, 6, 9];
export const categories = [
  { id: 1, name: '热血' },
  { id: 2, name: '古风' },
  { id: 3, name: '玄幻' },
  { id: 4, name: '科幻' },
  { id: 5, name: '奇幻' },
  { id: 6, name: '仙侠' },
  { id: 7, name: '武侠' },
  { id: 8, name: '悬疑' },
  { id: 9, name: '推理' },
  { id: 10, name: '冒险' },
];

export const animeIndex = new Map(animeData.map((anime) => [anime.id, anime]));

export const selectAnimeByIds = (ids = []) => ids.map((id) => animeIndex.get(id)).filter(Boolean);

export const selectAnimeByCategory = (categoryName) =>
  animeData.filter((anime) => anime.tags.some((tag) => tag === categoryName));

export const tagCounts = animeData.reduce((acc, anime) => {
  (anime.tags || []).forEach((tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
  });
  return acc;
}, {});

export default animeData;
