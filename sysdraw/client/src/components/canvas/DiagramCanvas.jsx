/**
 * SysDraw - Diagram Canvas
 * Uses Fabric.js for drag-and-drop UML diagramming.
 * Supports: drop shapes, move, resize, delete, undo/redo, zoom, pan.
 */
import React, { useEffect, useRef, useCallback, forwardRef, useImperativeHandle, useState } from 'react';
import ContextMenu from './ContextMenu';
import PropertiesPanel from './PropertiesPanel';
import './DiagramCanvas.css';

// ─── Shape renderer on Fabric canvas ──────────────────────────────────────────
const addShapeToCanvas = (fabric, canvas, shapeData, x, y) => {
  let obj;
  const baseOpts = { left: x, top: y, hasControls: true, hasBorders: true };

  switch (shapeData.shape) {
    case 'class':
    case 'abstract':
    case 'interface':
    case 'enum': {
      // Class box: header rect + attribute section
      const header = new fabric.Rect({ width: 140, height: 30, fill: '#7c6ef7', rx: 4, ry: 4 });
      const body = new fabric.Rect({ width: 140, height: 60, fill: '#f5f3ff', top: 30, stroke: '#c0b0f0', strokeWidth: 1 });
      const label = new fabric.Text(shapeData.label, {
        left: 70, top: 8, fontSize: 12, fill: '#fff', fontWeight: 'bold',
        originX: 'center', fontFamily: 'DM Sans, sans-serif',
      });
      const attrText = new fabric.Text('+ attribute: Type', {
        left: 8, top: 38, fontSize: 10, fill: '#555', fontFamily: 'DM Sans, sans-serif',
      });
      obj = new fabric.Group([header, body, label, attrText], {
        ...baseOpts,
        data: { type: shapeData.shape, name: shapeData.label, attributes: [] },
      });
      break;
    }
    case 'usecase': {
      obj = new fabric.Ellipse({
        ...baseOpts, rx: 65, ry: 30,
        fill: '#f5f3ff', stroke: '#7c6ef7', strokeWidth: 2,
        data: { type: 'usecase', name: 'Use Case' },
      });
      const t = new fabric.Text('Use Case', {
        left: x + 65, top: y + 14, originX: 'center',
        fontSize: 11, fill: '#555', fontFamily: 'DM Sans, sans-serif',
      });
      canvas.add(obj, t);
      canvas.renderAll();
      return;
    }
    case 'actor': {
      // Stick figure
      const head = new fabric.Circle({ ...baseOpts, radius: 12, fill: '#f5f3ff', stroke: '#555', strokeWidth: 1.5 });
      const body2 = new fabric.Line([0, 26, 0, 56], { left: x + 12, top: y, stroke: '#555', strokeWidth: 1.5 });
      const arms = new fabric.Line([-16, 38, 16, 38], { left: x + 12, top: y, stroke: '#555', strokeWidth: 1.5 });
      const leg1 = new fabric.Line([0, 56, -12, 76], { left: x + 12, top: y, stroke: '#555', strokeWidth: 1.5 });
      const leg2 = new fabric.Line([0, 56, 12, 76], { left: x + 12, top: y, stroke: '#555', strokeWidth: 1.5 });
      obj = new fabric.Group([head, body2, arms, leg1, leg2], {
        ...baseOpts, data: { type: 'actor', name: 'Actor' },
      });
      break;
    }
    case 'decision':
    case 'merge': {
      const diamond = new fabric.Polygon(
        [{ x: 50, y: 0 }, { x: 100, y: 30 }, { x: 50, y: 60 }, { x: 0, y: 30 }],
        { ...baseOpts, fill: '#f5f3ff', stroke: '#7c6ef7', strokeWidth: 2, data: { type: 'decision' } }
      );
      obj = diamond;
      break;
    }
    case 'initial': {
      obj = new fabric.Circle({ ...baseOpts, radius: 14, fill: '#222', data: { type: 'initial' } });
      break;
    }
    case 'final':
    case 'flow-final': {
      const outer = new fabric.Circle({ radius: 16, fill: 'transparent', stroke: '#222', strokeWidth: 2 });
      const inner = new fabric.Circle({ radius: 10, fill: '#222', left: 6, top: 6 });
      obj = new fabric.Group([outer, inner], { ...baseOpts, data: { type: 'final' } });
      break;
    }
    case 'action': {
      obj = new fabric.Rect({
        ...baseOpts, width: 120, height: 40,
        fill: '#f5f3ff', stroke: '#7c6ef7', strokeWidth: 1.5, rx: 6, ry: 6,
        data: { type: 'action', name: 'Action' },
      });
      break;
    }
    case 'lifeline': {
      const head2 = new fabric.Rect({ width: 100, height: 30, fill: '#2d2b6b', rx: 4, ry: 4 });
      const line = new fabric.Line([50, 30, 50, 180], { stroke: '#888', strokeWidth: 1.5, strokeDashArray: [4, 4] });
      const label2 = new fabric.Text('Lifeline', {
        left: 50, top: 8, fontSize: 11, fill: '#fff', originX: 'center', fontFamily: 'DM Sans, sans-serif',
      });
      obj = new fabric.Group([head2, line, label2], {
        ...baseOpts, data: { type: 'lifeline', name: 'Lifeline' },
      });
      break;
    }
    case 'note': {
      const body3 = new fabric.Rect({ width: 110, height: 70, fill: '#fffde7', stroke: '#e0c840', strokeWidth: 1.5, rx: 2, ry: 2 });
      const fold = new fabric.Triangle({ width: 14, height: 14, fill: '#e0c840', left: 96, top: 0 });
      const noteText = new fabric.IText('Note…', {
        left: 6, top: 8, fontSize: 10, fill: '#555', fontFamily: 'DM Sans, sans-serif', width: 98,
      });
      obj = new fabric.Group([body3, fold, noteText], { ...baseOpts, data: { type: 'note' } });
      break;
    }
    /* ── Lines / connectors ── */
    case 'line-assoc':
    case 'line-inherit':
    case 'line-dep':
    case 'line-agg':
    case 'line-comp':
    case 'line-real':
    case 'line-include':
    case 'line-extend':
    case 'line-gen':
    case 'msg-sync':
    case 'msg-async':
    case 'msg-return': {
      const dash = ['line-dep', 'line-include', 'line-extend', 'msg-async', 'msg-return'].includes(shapeData.shape)
        ? [6, 4] : [];
      obj = new fabric.Line([0, 0, 140, 0], {
        ...baseOpts, stroke: '#555', strokeWidth: 1.5, strokeDashArray: dash,
        selectable: true, evented: true,
        data: { type: shapeData.shape },
      });
      break;
    }
    default: {
      obj = new fabric.Rect({
        ...baseOpts, width: 100, height: 50,
        fill: '#f5f3ff', stroke: '#7c6ef7', strokeWidth: 1.5, rx: 4, ry: 4,
        data: { type: shapeData.shape || 'generic', name: shapeData.label },
      });
    }
  }

  canvas.add(obj);
  canvas.setActiveObject(obj);
  canvas.renderAll();
};

// ─── Canvas Component ──────────────────────────────────────────────────────────
const DiagramCanvas = forwardRef(({ diagramType, onElementsChange }, ref) => {
  const canvasEl = useRef(null);
  const fabricRef = useRef(null);
  const historyRef = useRef({ past: [], future: [] });
  const [contextMenu, setContextMenu] = React.useState(null); // { x, y, obj }
  const [selectedObj, setSelectedObj] = React.useState(null);

  // Expose getElements and undo/redo to parent via ref
  useImperativeHandle(ref, () => ({
    getElements: () => {
      if (!fabricRef.current) return [];
      return fabricRef.current.getObjects().map((obj) => ({
        ...obj.data,
        left: obj.left,
        top: obj.top,
        width: obj.width,
        height: obj.height,
        scaleX: obj.scaleX,
        scaleY: obj.scaleY,
        angle: obj.angle,
      }));
    },
    undo: () => handleUndo(),
    redo: () => handleRedo(),
    canUndo: () => historyRef.current.past.length > 0,
    canRedo: () => historyRef.current.future.length > 0,
    loadElements: (elements) => loadFromJSON(elements),
    clear: () => {
      fabricRef.current?.clear();
      fabricRef.current?.renderAll();
    },
  }));

  const saveSnapshot = useCallback(() => {
    if (!fabricRef.current) return;
    const json = JSON.stringify(fabricRef.current.toJSON(['data']));
    historyRef.current.past.push(json);
    historyRef.current.future = [];
    if (historyRef.current.past.length > 50) historyRef.current.past.shift();
  }, []);

  const handleUndo = useCallback(() => {
    const { past, future } = historyRef.current;
    if (!past.length || !fabricRef.current) return;
    const current = JSON.stringify(fabricRef.current.toJSON(['data']));
    future.push(current);
    const prev = past.pop();
    fabricRef.current.loadFromJSON(prev, () => fabricRef.current.renderAll());
  }, []);

  const handleRedo = useCallback(() => {
    const { past, future } = historyRef.current;
    if (!future.length || !fabricRef.current) return;
    const current = JSON.stringify(fabricRef.current.toJSON(['data']));
    past.push(current);
    const next = future.pop();
    fabricRef.current.loadFromJSON(next, () => fabricRef.current.renderAll());
  }, []);

  const loadFromJSON = useCallback((elements) => {
    if (!fabricRef.current || !elements?.length) return;
    // Simplified: just log — full load requires serialization schema
    console.log('Load elements', elements);
  }, []);

  useEffect(() => {
    if (!canvasEl.current) return;
    // Dynamically import fabric to avoid SSR issues
    import('fabric').then(({ fabric }) => {
      const canvas = new fabric.Canvas(canvasEl.current, {
        backgroundColor: '#f8f8fc',
        selection: true,
        preserveObjectStacking: true,
      });

      // Resize canvas to fit container
      const resize = () => {
        const wrap = canvasEl.current?.parentElement;
        if (wrap) {
          canvas.setWidth(wrap.clientWidth);
          canvas.setHeight(wrap.clientHeight);
          canvas.renderAll();
        }
      };
      resize();
      window.addEventListener('resize', resize);

      // Track object changes for history
      canvas.on('object:modified', () => {
        saveSnapshot();
        onElementsChange?.();
      });
      canvas.on('object:added', () => {
        onElementsChange?.();
      });

      // Selection tracking → show properties panel
      canvas.on('selection:created', (e) => setSelectedObj(e.selected?.[0] || null));
      canvas.on('selection:updated', (e) => setSelectedObj(e.selected?.[0] || null));
      canvas.on('selection:cleared', () => setSelectedObj(null));

      // Right-click → context menu
      canvas.on('mouse:down', (e) => {
        if (e.e.button === 2) {
          e.e.preventDefault();
          const obj = canvas.findTarget(e.e);
          if (obj) {
            canvas.setActiveObject(obj);
            canvas.renderAll();
            setContextMenu({ x: e.e.clientX, y: e.e.clientY, obj });
          }
        }
      });

      // Prevent default browser context menu on canvas
      canvasEl.current?.closest('.canvas-wrap')?.addEventListener('contextmenu', (e) => e.preventDefault());

      // Delete key removes selected object
      const handleKey = (e) => {
        if ((e.key === 'Delete' || e.key === 'Backspace') && document.activeElement === document.body) {
          const obj = canvas.getActiveObject();
          if (obj) {
            saveSnapshot();
            canvas.remove(obj);
            canvas.renderAll();
          }
        }
        if (e.ctrlKey && e.key === 'z') handleUndo();
        if (e.ctrlKey && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) handleRedo();
      };
      window.addEventListener('keydown', handleKey);

      fabricRef.current = canvas;

      return () => {
        window.removeEventListener('resize', resize);
        window.removeEventListener('keydown', handleKey);
        canvas.dispose();
      };
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Drop handler: shapes dragged from sidebar ──
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData('application/sysdraw-shape');
    if (!raw || !fabricRef.current) return;

    const shapeData = JSON.parse(raw);
    const canvas = fabricRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (canvas.getZoom());
    const y = (e.clientY - rect.top) / (canvas.getZoom());

    import('fabric').then(({ fabric }) => {
      saveSnapshot();
      addShapeToCanvas(fabric, canvas, shapeData, x - 60, y - 25);
    });
  }, [saveSnapshot]);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleContextAction = useCallback((action) => {
    const canvas = fabricRef.current;
    const obj = canvas?.getActiveObject();
    if (!obj || !canvas) return;

    saveSnapshot();
    switch (action) {
      case 'delete':
        canvas.remove(obj);
        break;
      case 'duplicate':
        obj.clone((cloned) => {
          cloned.set({ left: obj.left + 20, top: obj.top + 20 });
          canvas.add(cloned);
          canvas.setActiveObject(cloned);
        });
        break;
      case 'front':
        canvas.bringToFront(obj);
        break;
      case 'back':
        canvas.sendToBack(obj);
        break;
      case 'edit':
        if (obj.enterEditing) obj.enterEditing();
        break;
      default: break;
    }
    canvas.renderAll();
    onElementsChange?.();
  }, [saveSnapshot, onElementsChange]);

  const handlePropsUpdate = useCallback(({ name, fill }) => {
    const canvas = fabricRef.current;
    const obj = canvas?.getActiveObject();
    if (!obj || !canvas) return;

    saveSnapshot();
    if (fill) obj.set('fill', fill);
    if (name && obj.data) obj.data.name = name;
    canvas.renderAll();
    onElementsChange?.();
  }, [saveSnapshot, onElementsChange]);

  return (
    <div
      className="canvas-wrap"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {/* Mini toolbar above canvas */}
      <div className="canvas-toolbar">
        {[
          { icon: '↩', tip: 'Undo', act: handleUndo },
          { icon: '↪', tip: 'Redo', act: handleRedo },
          { icon: '🗑', tip: 'Clear', act: () => { fabricRef.current?.clear(); fabricRef.current?.renderAll(); } },
          { icon: '⊞', tip: 'Fit', act: () => { fabricRef.current?.setZoom(1); fabricRef.current?.renderAll(); } },
        ].map(({ icon, tip, act }) => (
          <button key={tip} className="canvas-toolbar-btn" title={tip} onClick={act}>{icon}</button>
        ))}

        <div className="canvas-toolbar-sep" />

        {[
          { icon: 'T', tip: 'Text' },
          { icon: '✏', tip: 'Pencil' },
          { icon: '⬚', tip: 'Frame' },
          { icon: '🖼', tip: 'Image' },
          { icon: '⋮', tip: 'More' },
        ].map(({ icon, tip }) => (
          <button key={tip} className="canvas-toolbar-btn" title={tip}>{icon}</button>
        ))}
      </div>

      {/* Canvas element */}
      <canvas ref={canvasEl} />

      {/* Context menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onAction={handleContextAction}
          onClose={() => setContextMenu(null)}
        />
      )}

      {/* Properties panel */}
      {selectedObj && (
        <PropertiesPanel
          selectedObject={selectedObj}
          onUpdate={handlePropsUpdate}
          onClose={() => {
            fabricRef.current?.discardActiveObject();
            fabricRef.current?.renderAll();
            setSelectedObj(null);
          }}
        />
      )}

      {/* Zoom indicator */}
      <div className="canvas-zoom-bar">
        <span className="canvas-zoom-label">
          {fabricRef.current ? Math.round((fabricRef.current.getZoom?.() || 1) * 100) : 100}%
        </span>
        <button onClick={() => {
          const c = fabricRef.current;
          if (c) { c.setZoom(Math.min(c.getZoom() * 1.2, 4)); c.renderAll(); }
        }}>+</button>
        <button onClick={() => {
          const c = fabricRef.current;
          if (c) { c.setZoom(Math.max(c.getZoom() * 0.8, 0.1)); c.renderAll(); }
        }}>−</button>
      </div>
    </div>
  );
});

DiagramCanvas.displayName = 'DiagramCanvas';
export default DiagramCanvas;
