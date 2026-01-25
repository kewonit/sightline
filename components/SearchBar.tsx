'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading: boolean;
  initialQuery?: string;
}

const EXAMPLE_QUERIES = [
  'airports near london',
  'hospitals in paris',
  'power plants in texas',
  'train stations in tokyo',
  'type:university region:california'
];

export default function SearchBar({ onSearch, loading, initialQuery = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [showExamples, setShowExamples] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !loading) {
      onSearch(query.trim());
      setShowExamples(false);
    }
  }, [query, loading, onSearch]);

  const handleExampleClick = useCallback((example: string) => {
    setQuery(example);
    setShowExamples(false);
    onSearch(example);
  }, [onSearch]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowExamples(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setShowExamples(false);
        inputRef.current?.blur();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div ref={containerRef} className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <svg className="search-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowExamples(true)}
            placeholder="Search infrastructure..."
            className="search-input"
            disabled={loading}
            autoComplete="off"
            spellCheck={false}
          />
          {loading && (
            <div className="search-spinner" />
          )}
        </div>
      </form>

      {showExamples && !query && (
        <div className="search-examples">
          <div className="examples-header">Examples</div>
          {EXAMPLE_QUERIES.map((example, idx) => (
            <button
              key={idx}
              type="button"
              className="example-item"
              onClick={() => handleExampleClick(example)}
            >
              <code>{example}</code>
            </button>
          ))}
          <div className="examples-footer">
            <span>Structured: <code>type:airport region:bavaria</code></span>
            <span>Natural: <code>wind farms near copenhagen</code></span>
          </div>
        </div>
      )}
    </div>
  );
}
