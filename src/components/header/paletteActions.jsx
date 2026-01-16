import React from 'react';
import {
  FiActivity,
  FiAward,
  FiBell,
  FiBookOpen,
  FiColumns,
  FiCompass,
  FiDownload,
  FiFilm,
  FiGrid,
  FiHeart,
  FiHelpCircle,
  FiHome,
  FiInfo,
  FiLogIn,
  FiMail,
  FiMessageSquare,
  FiMoon,
  FiSearch,
  FiShare2,
  FiShield,
  FiSun,
  FiTag,
  FiTrendingUp,
  FiUser,
} from '../icons/feather';
import animeData, { tagCounts } from '../../data/animeData';
import { CATEGORY_SLUG_MAP } from '../../data/categoryMap';

const splitKeywords = (value) =>
  String(value || '')
    .split(/[、,，/|·\s]+/g)
    .map((item) => item.trim())
    .filter(Boolean);

const createAction = (id, title, description, keywords, icon, run, options) => {
  const meta = typeof options === 'string' ? options : (options?.meta ?? 'Enter');
  const prefetchPath = typeof options === 'object' && options ? options.prefetchPath : undefined;

  return {
    id,
    title,
    description,
    keywords,
    icon,
    meta,
    prefetchPath,
    run,
  };
};

const buildAnimeActions = (navigate) =>
  (Array.isArray(animeData) ? animeData : []).map((anime) =>
    createAction(
      `anime.open.${anime.id}`,
      `打开：${anime.title}`,
      `${anime.releaseYear} · ${anime.status} · ${anime.rating}/5 · ${anime.studio}`,
      [
        anime.title,
        anime.originalTitle,
        anime.studio,
        String(anime.releaseYear),
        ...(anime.tags || []),
        ...splitKeywords(anime.type),
      ],
      <FiFilm />,
      () => navigate(`/anime/${anime.id}`),
      { prefetchPath: `/anime/${anime.id}` },
    ),
  );

const buildTagActions = (navigate) => {
  const entries = Object.entries(tagCounts || {}).sort((a, b) => {
    const diff = Number(b[1] || 0) - Number(a[1] || 0);
    if (diff) return diff;
    return String(a[0]).localeCompare(String(b[0]), 'zh-Hans-CN');
  });

  return entries.map(([tag, count]) => {
    const encoded = encodeURIComponent(tag);
    const path = `/tag/${encoded}`;

    return createAction(
      `tag.open.${encoded}`,
      `标签：${tag}`,
      `查看该标签下的作品（${count} 部）`,
      [tag, `#${tag}`, '标签', 'tag'],
      <FiTag />,
      () => navigate(path),
      { prefetchPath: path },
    );
  });
};

const buildCategoryActions = (navigate) =>
  Object.entries(CATEGORY_SLUG_MAP).map(([slug, meta]) =>
    createAction(
      `category.open.${slug}`,
      `分类：${meta.title}`,
      `标签映射：${meta.tag}`,
      [meta.title, meta.tag, '分类', slug, 'category'],
      <FiGrid />,
      () => navigate(`/category/${slug}`),
      { prefetchPath: `/category/${slug}` },
    ),
  );

export const buildCommandPaletteActions = ({ navigate, theme, onToggleTheme }) => {
  const base = [
    createAction('nav.home', '前往首页', '回到精选首页', ['首页', 'home', '/'], <FiHome />, () =>
      navigate('/'),
    ),
    createAction(
      'nav.recommendations',
      '国漫推荐',
      '打开推荐页面',
      ['推荐', 'recommendations'],
      <FiCompass />,
      () => navigate('/recommendations'),
      { prefetchPath: '/recommendations' },
    ),
    createAction(
      'nav.favorites',
      '收藏',
      '查看我的收藏列表',
      ['收藏', 'favorites'],
      <FiHeart />,
      () => navigate('/favorites'),
      { prefetchPath: '/favorites' },
    ),
    createAction(
      'nav.compare',
      '作品对比',
      '并排对照两部作品的关键指标',
      ['对比', 'compare', '比较', 'diff'],
      <FiColumns />,
      () => navigate('/compare'),
      { prefetchPath: '/compare' },
    ),
    createAction(
      'nav.following',
      '追更中心',
      '管理追更与提醒设置',
      ['追更', 'following', 'reminder', '通知'],
      <FiBell />,
      () => navigate('/following'),
      { prefetchPath: '/following' },
    ),
    createAction(
      'nav.pro',
      '会员与赞助',
      '开启 PRO 视觉与权益模型（本地演示）',
      ['pro', '会员', '赞助', 'pricing', 'support'],
      <FiAward />,
      () => navigate('/pro'),
      { prefetchPath: '/pro' },
    ),
    createAction(
      'nav.insights',
      '足迹中心',
      '查看播放/下载/分享足迹与留存概览',
      ['足迹', 'insights', 'activity', '留存', '增长'],
      <FiActivity />,
      () => navigate('/insights'),
      { prefetchPath: '/insights' },
    ),
    createAction(
      'nav.posters',
      '海报工坊',
      '生成分享海报并管理历史（SVG）',
      ['海报', 'poster', 'share', 'svg', '裂变'],
      <FiShare2 />,
      () => navigate('/posters'),
      { prefetchPath: '/posters' },
    ),
    createAction(
      'nav.achievements',
      '成就中心',
      '查看成就进度条与解锁状态',
      ['成就', 'achievements', 'badge'],
      <FiAward />,
      () => navigate('/achievements'),
      { prefetchPath: '/achievements' },
    ),
    createAction(
      'nav.rankings',
      '排行榜',
      '查看评分/人气排行',
      ['排行', 'rankings'],
      <FiTrendingUp />,
      () => navigate('/rankings'),
      { prefetchPath: '/rankings' },
    ),
    createAction(
      'nav.news',
      '最新资讯',
      '打开资讯列表',
      ['资讯', 'news'],
      <FiBookOpen />,
      () => navigate('/news'),
      { prefetchPath: '/news' },
    ),
    createAction(
      'nav.search',
      '打开搜索',
      '前往搜索页（也可直接输入关键词）',
      ['搜索', 'search'],
      <FiSearch />,
      () => navigate('/search'),
      { prefetchPath: '/search' },
    ),
    createAction(
      'nav.profile',
      '用户中心',
      '管理本地数据与偏好',
      ['用户中心', 'profile', '设置', 'settings'],
      <FiUser />,
      () => navigate('/profile'),
      { prefetchPath: '/profile' },
    ),
    createAction(
      'nav.diagnostics',
      '诊断面板',
      '查看本地健康快照（性能/错误/存储/SW）',
      ['诊断', 'diagnostics', 'health', '性能', '错误', '存储'],
      <FiActivity />,
      () => navigate('/diagnostics'),
      { prefetchPath: '/diagnostics' },
    ),
    createAction(
      'nav.about',
      '关于我们',
      '项目介绍与设计理念',
      ['关于', 'about'],
      <FiInfo />,
      () => navigate('/about'),
      { prefetchPath: '/about' },
    ),
    createAction(
      'nav.help',
      '帮助中心',
      '常见操作指引与使用建议',
      ['帮助', 'help', '指引'],
      <FiHelpCircle />,
      () => navigate('/help'),
      { prefetchPath: '/help' },
    ),
    createAction(
      'nav.faq',
      '常见问题',
      '查看常见问题与解答',
      ['faq', '常见问题', '问题', '解答'],
      <FiHelpCircle />,
      () => navigate('/faq'),
      { prefetchPath: '/faq' },
    ),
    createAction(
      'nav.feedback',
      '意见反馈',
      '向我们提交建议（本地保存）',
      ['反馈', 'feedback', '建议'],
      <FiMessageSquare />,
      () => navigate('/feedback'),
      { prefetchPath: '/feedback' },
    ),
    createAction(
      'nav.contact',
      '联系我们',
      '查看联系信息与反馈入口',
      ['联系', 'contact', '邮箱', 'mail'],
      <FiMail />,
      () => navigate('/contact'),
      { prefetchPath: '/contact' },
    ),
    createAction(
      'nav.app',
      '下载 APP',
      '移动端体验与离线观看（规划中）',
      ['app', '下载', '移动端', '离线'],
      <FiDownload />,
      () => navigate('/app'),
      { prefetchPath: '/app' },
    ),
    createAction(
      'nav.privacy',
      '隐私政策',
      '查看隐私与数据说明（示例文本）',
      ['隐私', 'privacy', '数据'],
      <FiShield />,
      () => navigate('/privacy'),
      { prefetchPath: '/privacy' },
    ),
    createAction(
      'nav.terms',
      '服务条款',
      '查看服务条款（示例文本）',
      ['条款', 'terms', 'policy'],
      <FiShield />,
      () => navigate('/terms'),
      { prefetchPath: '/terms' },
    ),
    createAction(
      'nav.cookies',
      'Cookie 政策',
      '查看 Cookie 使用范围（示例文本）',
      ['cookie', 'cookies', '政策'],
      <FiShield />,
      () => navigate('/cookies'),
      { prefetchPath: '/cookies' },
    ),
    createAction(
      'nav.accessibility',
      '无障碍声明',
      '查看可访问性声明与支持范围',
      ['无障碍', 'accessibility', 'a11y'],
      <FiShield />,
      () => navigate('/accessibility'),
      { prefetchPath: '/accessibility' },
    ),
    createAction(
      'nav.login',
      '登录 / 注册',
      '进入账号页（占位）',
      ['登录', '注册', 'login'],
      <FiLogIn />,
      () => navigate('/login'),
      { prefetchPath: '/login' },
    ),
  ];

  const themeAction = createAction(
    'theme.toggle',
    theme === 'dark' ? '切换到浅色主题' : '切换到深色主题',
    '立即切换主题并持久化',
    ['主题', 'theme', 'dark', 'light'],
    theme === 'dark' ? <FiSun /> : <FiMoon />,
    onToggleTheme,
  );

  return [
    ...base,
    ...buildCategoryActions(navigate),
    ...buildTagActions(navigate),
    ...buildAnimeActions(navigate),
    themeAction,
  ];
};
