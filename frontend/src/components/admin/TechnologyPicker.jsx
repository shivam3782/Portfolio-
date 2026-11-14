import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../Icon';

export default function TechnologyPicker({ value, options, onChange, error, disabled }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const expanded = open && !disabled;
  const [active, setActive] = useState(0);
  const root = useRef(null), menu = useRef(null), input = useRef(null);
  const id = useId();
  const choices = [...new Set([...options, ...value])].sort((a, b) => a.localeCompare(b)).filter(t => t.toLowerCase().includes(query.trim().toLowerCase()));
  const canAdd = query.trim().length > 0 && query.trim().length <= 60 && ![...options, ...value].some(t => t.toLowerCase() === query.trim().toLowerCase());
  const entries = [...choices.map(label => ({ label })), ...(canAdd ? [{ label: query.trim(), add: true }] : [])];
  const activeIndex = Math.min(active, Math.max(0, entries.length - 1));
  const toggle = label => {
    if (disabled) return;
    onChange(value.includes(label) ? value.filter(t => t !== label) : [...value, label]);
    setQuery(''); setActive(0); input.current.focus();
  };
  useLayoutEffect(() => {
    if (!expanded) return;
    const place = () => {
      const rect = root.current.getBoundingClientRect();
      const viewport = window.visualViewport;
      const visibleTop = viewport?.offsetTop || 0;
      const visibleLeft = viewport?.offsetLeft || 0;
      const visibleHeight = viewport?.height || window.innerHeight;
      const visibleWidth = viewport?.width || window.innerWidth;
      const width = Math.min(rect.width, visibleWidth - 24);
      const below = visibleTop + visibleHeight - rect.bottom - 18;
      const above = rect.top - visibleTop - 18;
      const upwards = below < 180 && above > below;
      Object.assign(menu.current.style, { left: Math.max(visibleLeft + 12, Math.min(rect.left, visibleLeft + visibleWidth - width - 12)) + 'px', width: width + 'px', top: upwards ? 'auto' : Math.max(visibleTop + 12, rect.bottom + 6) + 'px', bottom: upwards ? Math.max(12, window.innerHeight - rect.top + 6) + 'px' : 'auto', maxHeight: Math.max(0, Math.min(280, upwards ? above : below)) + 'px' });
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    window.visualViewport?.addEventListener('resize', place);
    window.visualViewport?.addEventListener('scroll', place);
    return () => { window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true); window.visualViewport?.removeEventListener('resize', place); window.visualViewport?.removeEventListener('scroll', place); };
  }, [expanded, value.length]);
  useEffect(() => {
    if (!expanded) return;
    const close = event => { if (!root.current.contains(event.target) && !menu.current?.contains(event.target)) setOpen(false); };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [expanded]);
  useEffect(() => { if (expanded) menu.current?.querySelector('[data-active=true]')?.scrollIntoView({ block: 'nearest' }); }, [activeIndex, expanded]);
  return <div className="technology-field"><label htmlFor={id}>Technologies</label><p className="field-hint" id={id + '-hint'}>Search the library or add a technology you used.</p>
    <div ref={root} className={'technology-input' + (error ? ' invalid' : '')}>
      <div className="selected-technologies">{value.map(tech => <span key={tech}>{tech}<button type="button" disabled={disabled} aria-label={'Remove ' + tech} onClick={() => onChange(value.filter(t => t !== tech))}>×</button></span>)}</div>
      <div className="technology-search"><Icon name="search" size={17} /><input ref={input} id={id} role="combobox" aria-autocomplete="list" aria-expanded={expanded} aria-controls={id + '-list'} aria-activedescendant={expanded && entries.length ? id + '-option-' + activeIndex : undefined} aria-invalid={!!error} aria-describedby={id + '-hint' + (error ? ' ' + id + '-error' : '')} value={query} disabled={disabled} maxLength={60} autoComplete="off" placeholder="Search or add technology…" onFocus={() => setOpen(true)} onChange={event => { setQuery(event.target.value); setActive(0); setOpen(true); }} onBlur={event => { if (!menu.current?.contains(event.relatedTarget)) setOpen(false); }} onKeyDown={event => {
        if (disabled) return;
        if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); setOpen(false); }
        if (event.key === 'Tab') setOpen(false);
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); setOpen(true); setActive(i => !expanded ? (event.key === 'ArrowDown' ? 0 : Math.max(0, entries.length - 1)) : entries.length ? (i + (event.key === 'ArrowDown' ? 1 : -1) + entries.length) % entries.length : 0); }
        if (event.key === 'Enter') { event.preventDefault(); if (expanded && entries[activeIndex]) toggle(entries[activeIndex].label); else setOpen(true); }
      }} /></div>
    </div>
    {error && <p className="field-error" id={id + '-error'}>{error}</p>}<span className="sr-only" role="status">{value.length} technologies selected.</span>
    {expanded && createPortal(<div ref={menu} className="technology-popover" id={id + '-list'} role="listbox" aria-label="Technology options" aria-multiselectable="true">{entries.map((entry, i) => <div key={entry.label} id={id + '-option-' + i} role="option" aria-selected={value.includes(entry.label)} data-active={i === activeIndex} onMouseDown={event => event.preventDefault()} onClick={() => toggle(entry.label)}><span>{entry.add ? '+ Add “' + entry.label + '”' : entry.label}</span><span aria-hidden="true">{value.includes(entry.label) ? '✓' : '+'}</span></div>)}{!entries.length && <p>No matching technologies. Type a name to add one.</p>}</div>, document.body)}
  </div>;
}
