import { useTranslation } from 'react-i18next';
import { useCharactersStore } from '../../store/charactersStore';
import { Plus, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function CharacterTabs() {
  const { t } = useTranslation();
  const tabs = useCharactersStore((s) => s.tabs);
  const activeCharacterId = useCharactersStore((s) => s.activeCharacterId);
  const setActiveCharacter = useCharactersStore((s) => s.setActiveCharacter);
  const addCharacter = useCharactersStore((s) => s.addCharacter);
  const removeCharacter = useCharactersStore((s) => s.removeCharacter);
  const reorderTabs = useCharactersStore((s) => s.reorderTabs);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // Handle tab click
  const handleTabClick = (characterId: string) => {
    setActiveCharacter(characterId);
  };

  // Handle new character
  const handleNewCharacter = () => {
    addCharacter();
  };

  // Handle close tab
  const handleCloseTab = (e: React.MouseEvent, characterId: string) => {
    e.stopPropagation();
    
    if (!window.confirm(t('tabs.closeConfirm'))) return;
    
    removeCharacter(characterId);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      // Create new order by moving the dragged tab to the drop position
      const newOrder = [...tabs];
      const [removed] = newOrder.splice(draggedIndex, 1);
      newOrder.splice(dragOverIndex, 0, removed);
      reorderTabs(newOrder.map((t) => t.id));
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  // Auto-scroll tabs container when active tab changes
  useEffect(() => {
    if (!tabsContainerRef.current || !activeCharacterId) return;

    const activeTabElement = tabsContainerRef.current.querySelector(
      `[data-character-id="${activeCharacterId}"]`
    ) as HTMLElement;

    if (activeTabElement) {
      activeTabElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeCharacterId]);

  // Get tab label
  const getTabLabel = (tab: typeof tabs[0]) => {
    return tab.label || tab.character.header.name || t('tabs.unnamed');
  };

  return (
    <div className="character-tabs">
      <div className="character-tabs-container" ref={tabsContainerRef}>
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeCharacterId;
          const isDragging = draggedIndex === index;
          const isDragOver = dragOverIndex === index;

          return (
            <div
              key={tab.id}
              data-character-id={tab.id}
              className={`character-tab ${isActive ? 'character-tab--active' : ''} ${
                isDragging ? 'character-tab--dragging' : ''
              } ${isDragOver ? 'character-tab--drag-over' : ''}`}
              onClick={() => handleTabClick(tab.id)}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              onDragLeave={handleDragLeave}
              title={getTabLabel(tab)}
            >
              <span className="character-tab-label">
                {getTabLabel(tab)}
                {tab.isDirty && <span className="character-tab-dirty">•</span>}
              </span>
              <button
                type="button"
                className="character-tab-close"
                onClick={(e) => handleCloseTab(e, tab.id)}
                title={t('tabs.closeCharacter')}
                aria-label={t('tabs.closeCharacter')}
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>

      <button
        className="character-tabs-new"
        onClick={handleNewCharacter}
        title={t('tabs.newCharacter')}
        aria-label={t('tabs.newCharacter')}
      >
        <Plus size={16} />
      </button>

      <style>{`
        .character-tabs {
          display: flex;
          align-items: center;
          gap: var(--s-sm);
          background: var(--c-surface);
          border-bottom: 1px solid var(--c-border);
          padding: var(--s-xs) var(--s-sm);
          overflow: hidden;
        }

        .character-tabs-container {
          display: flex;
          gap: var(--s-xs);
          overflow-x: auto;
          overflow-y: hidden;
          flex: 1;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }

        .character-tabs-container::-webkit-scrollbar {
          height: 4px;
        }

        .character-tabs-container::-webkit-scrollbar-track {
          background: var(--c-surface);
        }

        .character-tabs-container::-webkit-scrollbar-thumb {
          background: var(--c-border);
          border-radius: var(--r-sm);
        }

        .character-tabs-container::-webkit-scrollbar-thumb:hover {
          background: var(--c-text-muted);
        }

        .character-tab {
          display: flex;
          align-items: center;
          gap: var(--s-xs);
          padding: var(--s-xs) var(--s-sm);
          background: var(--c-surface-elevated);
          border: 1px solid var(--c-border);
          border-radius: var(--r-sm);
          cursor: pointer;
          transition: all var(--t-fast);
          white-space: nowrap;
          min-width: 120px;
          max-width: 200px;
          user-select: none;
        }

        .character-tab:hover {
          background: var(--c-surface-glass);
          border-color: var(--c-border-active);
        }

        .character-tab--active {
          background: var(--c-primary-muted);
          border-color: var(--c-primary);
        }

        .character-tab--dragging {
          opacity: 0.5;
        }

        .character-tab--drag-over {
          border-color: var(--c-primary);
          border-style: dashed;
        }

        .character-tab-label {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 13px;
          color: var(--c-text);
          display: flex;
          align-items: center;
          gap: var(--s-xs);
        }

        .character-tab-dirty {
          color: var(--c-warning);
          font-size: 20px;
          line-height: 1;
        }

        .character-tab-close {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          background: transparent;
          border: none;
          border-radius: var(--r-sm);
          color: var(--c-text-muted);
          cursor: pointer;
          transition: all var(--t-fast);
          opacity: 0;
        }

        .character-tab:hover .character-tab-close {
          opacity: 1;
        }

        .character-tab-close:hover {
          background: var(--c-error);
          color: var(--c-text-inverse);
        }

        .character-tabs-new {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--s-xs);
          background: var(--c-primary);
          border: none;
          border-radius: var(--r-sm);
          color: var(--c-text-inverse);
          cursor: pointer;
          transition: all var(--t-fast);
          flex-shrink: 0;
        }

        .character-tabs-new:hover {
          background: var(--c-primary-hover);
          transform: scale(1.05);
        }

        .character-tabs-new:active {
          transform: scale(0.95);
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .character-tabs {
            padding: var(--s-xs);
          }

          .character-tab {
            min-width: 100px;
            max-width: 150px;
            padding: var(--s-xs);
          }

          .character-tab-close {
            opacity: 1;
          }

          .character-tab-label {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}
