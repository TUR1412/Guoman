// 观众脉冲：输出作品口碑热度、评论均分与关键词摘要。
import React from 'react';
import styled from 'styled-components';
import { FiActivity, FiMessageSquare, FiStar } from '../../icons/feather';

const Card = styled.section.attrs({
  'data-card': true,
  'data-divider': 'card',
  'data-elev': '3',
})`
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  display: grid;
  gap: var(--spacing-lg);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      320px 200px at 12% 0%,
      rgba(var(--secondary-rgb), 0.18),
      transparent 60%
    );
    opacity: 0.8;
    pointer-events: none;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-md);
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h3`
  font-size: var(--text-3xl);
  font-family: var(--font-display);
  letter-spacing: 0.02em;
`;

const Subtitle = styled.p`
  color: var(--text-secondary);
  max-width: 60ch;
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs-plus);
  padding: 6px 12px;
  border-radius: var(--border-radius-pill);
  border: 1px solid var(--stamp-border);
  background: var(--stamp-bg);
  color: var(--stamp-text);
  font-size: var(--text-xs);
  font-weight: 800;
  box-shadow: var(--shadow-stamp);
`;

const Metrics = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--spacing-md);
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MetricCard = styled.div.attrs({ 'data-card': true, 'data-elev': '2' })`
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  display: grid;
  gap: 6px;
`;

const MetricLabel = styled.div`
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const MetricValue = styled.div`
  font-size: var(--text-5xl);
  font-weight: 800;
  color: var(--text-primary);
`;

const HeatBar = styled.div`
  height: 6px;
  border-radius: var(--border-radius-pill);
  background: var(--progress-track);
  overflow: hidden;
  position: relative;
  z-index: 1;
`;

const HeatFill = styled.div`
  height: 100%;
  width: ${(props) => `${props.$value}%`};
  background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.85), rgba(var(--accent-rgb), 0.7));
`;

const Keywords = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  position: relative;
  z-index: 1;
`;

const Keyword = styled.span`
  padding: 4px 10px;
  border-radius: var(--border-radius-pill);
  border: 1px solid var(--chip-border);
  background: var(--chip-bg);
  color: var(--text-secondary);
  font-size: var(--text-xs);
`;

function AudiencePulse({ pulse }) {
  if (!pulse) return null;

  return (
    <Card aria-label="观众口碑脉冲">
      <Header>
        <div>
          <Title>观众口碑脉冲</Title>
          <Subtitle>结合评论密度与作品热度，快速判断口碑与讨论氛围。</Subtitle>
        </div>
        <Badge>
          <FiActivity /> {pulse.tone}
        </Badge>
      </Header>

      <Metrics>
        <MetricCard>
          <MetricLabel>
            <FiActivity /> 热度指数
          </MetricLabel>
          <MetricValue>{pulse.heat}</MetricValue>
        </MetricCard>
        <MetricCard>
          <MetricLabel>
            <FiStar /> 评论均分
          </MetricLabel>
          <MetricValue>{pulse.avgReviewRating}</MetricValue>
        </MetricCard>
        <MetricCard>
          <MetricLabel>
            <FiMessageSquare /> 评论量
          </MetricLabel>
          <MetricValue>{pulse.reviewCount}</MetricValue>
        </MetricCard>
      </Metrics>

      <HeatBar aria-hidden="true">
        <HeatFill $value={pulse.heat} />
      </HeatBar>

      <Keywords aria-label="口碑关键词">
        {pulse.keywords && pulse.keywords.length > 0 ? (
          pulse.keywords.map((word) => <Keyword key={word}>{word}</Keyword>)
        ) : (
          <Keyword>{pulse.vibe}</Keyword>
        )}
      </Keywords>
    </Card>
  );
}

export default AudiencePulse;
