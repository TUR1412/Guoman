import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useSearchParams } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import PageShell from '../components/PageShell';
import EmptyState from '../components/EmptyState';
import AnimeCard from '../components/anime/AnimeCard';
import { AnimeGrid } from '../components/anime/AnimeGrid';
import animeData from '../data/animeData';

const SearchBar = styled.form`
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  background: var(--surface-glass);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(14px);
`;

const Input = styled.input`
  flex: 1;
  padding: 0.85rem 1rem;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-subtle);
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-primary);

  &::placeholder {
    color: var(--text-tertiary);
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.85rem 1.1rem;
  border-radius: var(--border-radius-md);
  border: 1px solid rgba(255, 77, 77, 0.45);
  background: rgba(255, 77, 77, 0.16);
  color: var(--text-primary);
  font-weight: 700;
  transition: var(--transition);

  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-glow);
  }

  &:active {
    transform: translateY(0px) scale(0.98);
  }
`;

const Summary = styled.div`
  color: var(--text-tertiary);
`;

const normalize = (value) =>
  String(value || '')
    .toLowerCase()
    .trim();

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [value, setValue] = useState(q);

  useEffect(() => {
    setValue(q);
  }, [q]);

  const results = useMemo(() => {
    const query = normalize(q);
    if (!query) return [];

    const tokens = query.split(/\s+/).filter(Boolean);
    return animeData.filter((anime) => {
      const haystack = normalize(
        [anime.title, anime.originalTitle, anime.studio, anime.type, ...(anime.tags || [])].join(
          ' ',
        ),
      );

      return tokens.every((t) => haystack.includes(t));
    });
  }, [q]);

  const onSubmit = (e) => {
    e.preventDefault();
    const next = value.trim();
    setSearchParams(next ? { q: next } : {});
  };

  return (
    <PageShell
      title="搜索"
      subtitle="按标题 / 原名 / 类型 / 标签 / 制作方搜索。支持多关键词（空格分隔）。"
    >
      <SearchBar onSubmit={onSubmit} role="search" aria-label="站内搜索">
        <span id="guoman-search-page-hint" className="sr-only">
          支持多关键词搜索，空格分隔；例如：古风 仙侠
        </span>
        <Input
          type="search"
          name="q"
          aria-label="搜索关键词"
          aria-describedby="guoman-search-page-hint"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="例如：古风 仙侠 / 斗罗 / 绘梦动画"
        />
        <Button type="submit">
          <FiSearch />
          搜索
        </Button>
      </SearchBar>

      {q ? (
        <Summary>
          关键词：<strong>{q}</strong> · 共找到 <strong>{results.length}</strong> 部作品
        </Summary>
      ) : null}

      {q && results.length > 0 ? (
        <AnimeGrid>
          {results.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </AnimeGrid>
      ) : (
        <EmptyState
          icon={<FiSearch size={22} />}
          title={q ? '没有找到匹配结果' : '从这里开始搜索'}
          description={
            q ? '换个关键词试试，或者去推荐/排行榜逛逛。' : '输入关键词，按下回车或点击搜索。'
          }
          primaryAction={{ to: '/recommendations', label: '去看推荐' }}
          secondaryAction={{ to: '/rankings', label: '看看排行榜' }}
        />
      )}
    </PageShell>
  );
}

export default SearchPage;
