import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

const PickTheorem = () => {
  const [activeExample, setActiveExample] = useState(0);

  const examples = [
    {
      name: 'Треугольник',
      interior: 0,
      boundary: 4,
      area: 1.5,
      vertices: [[2, 2], [4, 2], [3, 4]],
    },
    {
      name: 'Квадрат',
      interior: 0,
      boundary: 5,
      area: 2,
      vertices: [[1, 1], [3, 1], [3, 3], [1, 3]],
    },
    {
      name: 'Сложный многоугольник',
      interior: 5,
      boundary: 8,
      area: 8,
      vertices: [[1, 1], [5, 1], [5, 3], [3, 3], [3, 5], [1, 5]],
    },
  ];

  const currentExample = examples[activeExample];

  const renderGrid = (vertices: number[][]) => {
    const gridSize = 6;
    const cellSize = 60;

    const isPointOnBoundary = (x: number, y: number) => {
      for (let i = 0; i < vertices.length; i++) {
        const [x1, y1] = vertices[i];
        const [x2, y2] = vertices[(i + 1) % vertices.length];
        
        const dxl = x2 - x1;
        const dyl = y2 - y1;
        const dxp = x - x1;
        const dyp = y - y1;
        
        const cross = dxp * dyl - dyp * dxl;
        if (Math.abs(cross) > 0.01) continue;
        
        const dot = dxp * dxl + dyp * dyl;
        const lenSq = dxl * dxl + dyl * dyl;
        if (dot >= 0 && dot <= lenSq) return true;
      }
      return false;
    };

    const isPointInside = (x: number, y: number) => {
      let inside = false;
      for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
        const xi = vertices[i][0], yi = vertices[i][1];
        const xj = vertices[j][0], yj = vertices[j][1];
        const intersect = ((yi > y) !== (yj > y)) && 
                         (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
      }
      return inside;
    };

    return (
      <svg width={cellSize * gridSize} height={cellSize * gridSize} className="border border-border">
        {Array.from({ length: gridSize + 1 }).map((_, i) => (
          <g key={`grid-${i}`}>
            <line
              x1={0}
              y1={i * cellSize}
              x2={gridSize * cellSize}
              y2={i * cellSize}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
            <line
              x1={i * cellSize}
              y1={0}
              x2={i * cellSize}
              y2={gridSize * cellSize}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          </g>
        ))}

        <polygon
          points={vertices.map(([x, y]) => `${x * cellSize},${y * cellSize}`).join(' ')}
          fill="hsl(199 89% 48% / 0.1)"
          stroke="hsl(199 89% 48%)"
          strokeWidth="2"
        />

        {Array.from({ length: gridSize + 1 }).map((_, i) =>
          Array.from({ length: gridSize + 1 }).map((_, j) => {
            const onBoundary = isPointOnBoundary(j, i);
            const inside = isPointInside(j, i);

            return (
              <circle
                key={`${i}-${j}`}
                cx={j * cellSize}
                cy={i * cellSize}
                r={onBoundary ? 5 : inside ? 4 : 2}
                fill={onBoundary ? '#0EA5E9' : inside ? '#F97316' : '#999'}
              />
            );
          })
        )}
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-white">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-foreground">Формула Пика</h1>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        <Tabs defaultValue="home" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12">
            <TabsTrigger value="home">Главная</TabsTrigger>
            <TabsTrigger value="theory">Теория</TabsTrigger>
            <TabsTrigger value="examples">Примеры</TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-12">
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
                <Icon name="Grid3x3" size={40} className="text-primary" />
              </div>
              <h2 className="text-4xl font-bold text-foreground">
                Формула Пика
              </h2>
              <p className="text-xl text-muted-foreground">
                Простой способ вычислить площадь многоугольника на решётке
              </p>
            </div>

            <Card className="p-12 max-w-2xl mx-auto bg-card">
              <div className="text-center space-y-6">
                <div className="text-5xl font-mono font-bold text-primary">
                  S = i + b/2 − 1
                </div>
                <div className="space-y-3 text-lg text-muted-foreground">
                  <p><span className="font-mono font-semibold text-foreground">S</span> — площадь многоугольника</p>
                  <p><span className="font-mono font-semibold text-foreground">i</span> — количество узлов внутри</p>
                  <p><span className="font-mono font-semibold text-foreground">b</span> — количество узлов на границе</p>
                </div>
              </div>
            </Card>

            <div className="max-w-3xl mx-auto space-y-6">
              <h3 className="text-2xl font-semibold text-foreground text-center">
                Ключевые преимущества
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6 space-y-3">
                  <Icon name="Zap" size={32} className="text-primary" />
                  <h4 className="font-semibold text-lg">Простота</h4>
                  <p className="text-sm text-muted-foreground">
                    Не требует сложных вычислений координат
                  </p>
                </Card>
                <Card className="p-6 space-y-3">
                  <Icon name="Target" size={32} className="text-primary" />
                  <h4 className="font-semibold text-lg">Точность</h4>
                  <p className="text-sm text-muted-foreground">
                    Даёт абсолютно точный результат
                  </p>
                </Card>
                <Card className="p-6 space-y-3">
                  <Icon name="Shapes" size={32} className="text-primary" />
                  <h4 className="font-semibold text-lg">Универсальность</h4>
                  <p className="text-sm text-muted-foreground">
                    Работает для любых многоугольников
                  </p>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="theory" className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">Теория</h2>
              
              <Card className="p-8 space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Icon name="BookOpen" size={24} className="text-primary" />
                  История открытия
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Формула Пика была открыта австрийским математиком Георгом Александером Пиком 
                  в 1899 году. Она устанавливает связь между площадью многоугольника на целочисленной 
                  решётке и количеством узлов решётки внутри и на границе многоугольника.
                </p>
              </Card>

              <Card className="p-8 space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Icon name="Lightbulb" size={24} className="text-primary" />
                  Как это работает?
                </h3>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Представьте лист бумаги в клетку. Каждый узел сетки — это точка с целыми координатами. 
                    Если нарисовать многоугольник, вершины которого находятся в узлах, то его площадь 
                    можно вычислить простым подсчётом точек.
                  </p>
                  <div className="bg-secondary p-6 rounded-lg space-y-3">
                    <p className="font-semibold text-foreground">Алгоритм вычисления:</p>
                    <ol className="list-decimal list-inside space-y-2 ml-4">
                      <li>Подсчитайте узлы внутри многоугольника (<span className="font-mono font-semibold text-foreground">i</span>)</li>
                      <li>Подсчитайте узлы на границе (<span className="font-mono font-semibold text-foreground">b</span>)</li>
                      <li>Примените формулу: <span className="font-mono font-semibold text-primary">S = i + b/2 − 1</span></li>
                    </ol>
                  </div>
                </div>
              </Card>

              <Card className="p-8 space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Icon name="AlertCircle" size={24} className="text-primary" />
                  Важные условия
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>Многоугольник должен быть простым (без самопересечений)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>Все вершины должны находиться в узлах решётки</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>Формула работает только для двумерных фигур</span>
                  </li>
                </ul>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="examples" className="max-w-5xl mx-auto space-y-8">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">Интерактивные примеры</h2>
              
              <div className="flex gap-3 justify-center flex-wrap">
                {examples.map((example, idx) => (
                  <Button
                    key={idx}
                    variant={activeExample === idx ? 'default' : 'outline'}
                    onClick={() => setActiveExample(idx)}
                  >
                    {example.name}
                  </Button>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-foreground">
                    Визуализация
                  </h3>
                  <div className="flex justify-center">
                    {renderGrid(currentExample.vertices)}
                  </div>
                  <div className="mt-4 flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#F97316]"></div>
                      <span>Внутренние узлы</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#0EA5E9]"></div>
                      <span>Граничные узлы</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 space-y-6">
                  <h3 className="text-lg font-semibold text-foreground">
                    Решение
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-secondary p-4 rounded-lg space-y-2">
                      <p className="text-sm text-muted-foreground">Дано:</p>
                      <p className="font-mono">i = {currentExample.interior} (внутренних узлов)</p>
                      <p className="font-mono">b = {currentExample.boundary} (граничных узлов)</p>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">Применяем формулу:</p>
                      <div className="bg-primary/5 p-4 rounded-lg space-y-2 font-mono">
                        <p>S = i + b/2 − 1</p>
                        <p>S = {currentExample.interior} + {currentExample.boundary}/2 − 1</p>
                        <p>S = {currentExample.interior} + {currentExample.boundary / 2} − 1</p>
                        <p className="text-primary font-semibold text-lg">S = {currentExample.area}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        <Icon name="CheckCircle2" size={20} className="text-primary" />
                        <p className="font-semibold">
                          Площадь = {currentExample.area} квадратных единиц
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-border mt-20 py-8">
        <div className="container mx-auto px-6 text-center text-muted-foreground text-sm">
          <p>Образовательный проект о теореме Пика</p>
        </div>
      </footer>
    </div>
  );
};

export default PickTheorem;
