import React from 'react';
import styled from 'styled-components';
import { FiHeart, FiFilm, FiUsers, FiGithub, FiMail } from 'react-icons/fi';
import PageShell from '../components/PageShell';

const Bento = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-lg);

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  border-radius: var(--border-radius-lg);
  background: var(--surface-glass);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-xl);
  backdrop-filter: blur(14px);
  display: grid;
  gap: var(--spacing-md);
`;

const CardTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.25rem;
`;

const CardDesc = styled.p`
  color: var(--text-secondary);
  line-height: 1.8;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
`;

const LinkButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.1rem;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-subtle);
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-primary);
  transition: var(--transition);

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.1);
  }
`;

function AboutPage() {
  return (
    <PageShell
      title="关于我们"
      subtitle="国漫世界希望做一件简单但重要的事：让“找国漫”变得更快、更美、更有温度。"
    >
      <Bento>
        <Card>
          <CardTitle>
            <FiFilm />
            我们在做什么
          </CardTitle>
          <CardDesc>
            用更清晰的作品信息结构、更舒服的浏览体验与更自然的动效，让你以更低的成本发现好作品。
            你可以按推荐、排行榜、标签与搜索快速定位，并在作品详情页看到更完整的介绍。
          </CardDesc>
          <Actions>
            <LinkButton href="#/feedback">
              <FiHeart />
              提个建议
            </LinkButton>
            <LinkButton href="#/contact">
              <FiMail />
              联系我们
            </LinkButton>
          </Actions>
        </Card>
        <Card>
          <CardTitle>
            <FiUsers />
            我们相信
          </CardTitle>
          <CardDesc>
            国漫的魅力不止“热血”，还有更细腻的情绪、更大胆的美术、更成熟的叙事。我们会持续补全内容与分类体系。
          </CardDesc>
        </Card>
      </Bento>

      <Card>
        <CardTitle>
          <FiGithub />
          开源与致谢
        </CardTitle>
        <CardDesc>
          本项目使用 React / Vite / Styled Components / Framer Motion
          等现代前端技术构建，感谢这些优秀开源项目让体验更上一层楼。
        </CardDesc>
      </Card>
    </PageShell>
  );
}

export default AboutPage;
