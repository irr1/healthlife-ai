# 📚 Руководство по изучению структуры HealthLife AI

## 🎯 Цель этого документа

Детально разобрать структуру проекта, чтобы вы понимали:
- Где находится каждый файл и зачем он нужен
- Как связаны Frontend и Backend
- Куда добавлять новый код

---

## 1️⃣ Структура Frontend (`apps/web/src/app/`)

### 📁 Файловая маршрутизация Next.js

Next.js 14 использует **App Router** - файловая система = структура URL.

```
apps/web/src/app/
│
├── page.tsx                    → http://localhost:3000/
├── layout.tsx                  → Обертка для всех страниц
│
└── (dashboard)/                → Группа (скобки = не добавляется в URL)
    ├── layout.tsx              → Обертка для всех dashboard страниц
    │
    ├── focus/
    │   └── page.tsx            → http://localhost:3000/focus
    │
    ├── journey/
    │   └── page.tsx            → http://localhost:3000/journey
    │
    ├── coach/
    │   └── page.tsx            → http://localhost:3000/coach
    │
    ├── you/
    │   └── page.tsx            → http://localhost:3000/you
    │
    └── tribe/
        └── page.tsx            → http://localhost:3000/tribe
```

### 🔑 Ключевые файлы

#### `app/page.tsx` - Главная страница (Landing)

**Назначение:** Первая страница, которую видит пользователь

**Что внутри:**
```typescript
export default function HomePage() {
  return (
    <div className="...">
      <h1>HealthLife AI</h1>
      <a href="/focus">Get Started</a>  // ← Ведет в дашборд
    </div>
  );
}
```

**Когда редактировать:**
- Изменить дизайн главной страницы
- Добавить маркетинговую информацию
- Добавить кнопки "Login" / "Sign Up"

---

#### `app/layout.tsx` - Корневой Layout

**Назначение:** Оборачивает ВСЕ страницы приложения

**Что внутри:**
```typescript
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}  // ← Сюда рендерятся все страницы
      </body>
    </html>
  );
}
```

**Когда редактировать:**
- Подключить глобальные провайдеры (React Query, Auth)
- Добавить Google Analytics
- Подключить шрифты

**Пример (что добавить позже):**
```typescript
import { QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/lib/auth'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider>  // ← React Query
          <AuthProvider>        // ← Аутентификация
            {children}
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

---

#### `app/(dashboard)/layout.tsx` - Dashboard Layout

**Назначение:** Добавляет сайдбар для всех страниц дашборда

**Что внутри:**
```typescript
export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Сайдбар слева */}
      <aside className="fixed left-0 top-0 ...">
        <nav>
          <a href="/focus">🏠 Focus</a>
          <a href="/journey">🗺 Journey</a>
          {/* ... остальные ссылки */}
        </nav>
      </aside>

      {/* Основной контент справа */}
      <main className="ml-64 p-8">
        {children}  // ← Сюда рендерятся страницы (focus, journey, etc.)
      </main>
    </div>
  );
}
```

**Когда редактировать:**
- Изменить дизайн сайдбара
- Добавить хедер с именем пользователя
- Добавить кнопку Logout

**Пример улучшения:**
```typescript
import { useUser } from '@/hooks/useUser'

export default function DashboardLayout({ children }) {
  const { user } = useUser()  // ← Получаем данные пользователя

  return (
    <div>
      <aside>
        <h2>HealthLife AI</h2>
        <p>Привет, {user?.name}!</p>  // ← Показываем имя
        <nav>...</nav>
      </aside>
      <main>{children}</main>
    </div>
  );
}
```

---

#### `app/(dashboard)/focus/page.tsx` - Страница Focus

**Назначение:** Показывает задачи на сегодня

**Что внутри сейчас:**
```typescript
export default function FocusPage() {
  return (
    <div>
      <h1>Focus</h1>
      <div className="hero">
        <h2>Today's Focus</h2>
        <p>Walk 10,000 steps</p>  // ← Хардкод (статика)
      </div>
      <div className="timeline">
        <p>Morning: Drink water</p>  // ← Хардкод
        <p>Afternoon: Walk</p>       // ← Хардкод
      </div>
    </div>
  );
}
```

**Что нужно добавить позже:**
```typescript
import { useTasks } from '@/hooks/useTasks'  // ← Hook для получения задач

export default function FocusPage() {
  const { tasks, isLoading } = useTasks()  // ← Загружаем с Backend

  if (isLoading) return <Loading />

  return (
    <div>
      <h1>Focus</h1>
      <div className="hero">
        <h2>Today's Focus</h2>
        <p>{tasks.mainGoal}</p>  // ← Из Backend
      </div>
      <div className="timeline">
        {tasks.morning.map(task => (
          <TaskCard key={task.id} task={task} />  // ← Компонент
        ))}
      </div>
    </div>
  );
}
```

---

### 🧩 Остальные страницы работают аналогично:

| Файл | URL | Назначение | Что показывает сейчас |
|------|-----|------------|----------------------|
| `journey/page.tsx` | `/journey` | Roadmap прогресса | 3 фазы (хардкод) |
| `coach/page.tsx` | `/coach` | AI чат | Заглушка чата |
| `you/page.tsx` | `/you` | Профиль | Простой текст |
| `tribe/page.tsx` | `/tribe` | Сообщество | Рейтинг (хардкод) |

---

## 🎨 Структура компонентов (пока пуста)

```
apps/web/src/components/
│
├── ui/                     → Базовые компоненты
│   ├── Button.tsx          → Кнопка (создадите в Фазе 2)
│   ├── Card.tsx            → Карточка
│   ├── Input.tsx           → Поле ввода
│   └── Modal.tsx           → Модальное окно
│
├── focus/                  → Компоненты для Focus страницы
│   ├── TodayFocus.tsx      → Hero блок с главной целью
│   ├── TaskTimeline.tsx    → Timeline задач
│   ├── EnergyInput.tsx     → Слайдер энергии
│   └── QuickLog.tsx        → Быстрые действия
│
├── journey/                → Компоненты для Journey
│   ├── RoadmapVisualizer.tsx
│   ├── MilestoneCard.tsx
│   └── WeeklyReview.tsx
│
├── coach/                  → Компоненты для Coach
│   ├── ChatWindow.tsx
│   ├── MessageBubble.tsx
│   └── DailyInsight.tsx
│
├── you/                    → Компоненты для You
│   ├── BodyBattery.tsx
│   ├── HabitGrid.tsx
│   └── BiometricsChart.tsx
│
└── tribe/                  → Компоненты для Tribe
    ├── SquadCard.tsx
    ├── Leaderboard.tsx
    └── ChallengeList.tsx
```

**Сейчас все эти папки пустые.** Вы будете их заполнять в Фазе 2 (UI компоненты).

---

## 2️⃣ Структура Backend (`apps/backend/app/`)

### 📁 Структура FastAPI приложения

```
apps/backend/app/
│
├── main.py                 → Точка входа (запускает FastAPI)
│
├── core/                   → Конфигурация
│   ├── __init__.py
│   └── config.py           → Настройки из .env
│
├── api/                    → API слой
│   ├── deps.py             → Зависимости (DB сессия, auth)
│   └── v1/
│       ├── router.py       → Главный роутер (объединяет все эндпоинты)
│       └── endpoints/      → Файлы с эндпоинтами
│           ├── auth.py     → POST /api/v1/auth/register, /login
│           ├── users.py    → GET /api/v1/users/me
│           ├── plans.py    → POST /api/v1/plans/generate
│           ├── tasks.py    → GET /api/v1/tasks/today
│           ├── journey.py  → GET /api/v1/journey/roadmap
│           ├── coach.py    → POST /api/v1/coach/chat
│           └── analytics.py → GET /api/v1/analytics/habits
│
├── services/               → Бизнес-логика
│   ├── ai_engine/          → AI генерация планов
│   ├── recovery/           → Failure recovery
│   └── analytics/          → Аналитика
│
├── models/                 → SQLAlchemy модели (таблицы БД)
│   ├── __init__.py
│   ├── user.py             → Модель User
│   ├── plan.py             → Модель Plan
│   └── task.py             → Модель Task
│
├── schemas/                → Pydantic схемы (валидация)
│   ├── __init__.py
│   ├── user.py             → UserCreate, UserResponse
│   ├── plan.py             → PlanCreate, PlanResponse
│   └── task.py             → TaskCreate, TaskResponse
│
└── db/                     → База данных
    ├── __init__.py
    └── base.py             → Подключение к PostgreSQL
```

### 🔑 Ключевые файлы Backend

#### `main.py` - Точка входа

**Что внутри:**
```python
from fastapi import FastAPI
from app.api.v1.router import api_router

app = FastAPI(title="HealthLife AI Backend")

# Подключаем все эндпоинты
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "HealthLife AI Backend API"}
```

**Это файл, который запускается командой:**
```bash
uvicorn app.main:app --reload
```

---

#### `core/config.py` - Настройки

**Что внутри:**
```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    REDIS_URL: str
    OPENAI_API_KEY: str
    SECRET_KEY: str

    class Config:
        env_file = ".env"

settings = Settings()
```

**Использование:**
```python
from app.core.config import settings

print(settings.DATABASE_URL)  # postgresql://...
print(settings.OPENAI_API_KEY)  # sk-...
```

---

#### `api/v1/router.py` - Главный роутер

**Что внутри:**
```python
from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, plans, tasks

api_router = APIRouter()

# Подключаем все эндпоинты
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(plans.router, prefix="/plans", tags=["plans"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
# и т.д.
```

**Результат:**
```
/api/v1/auth/...    → auth.py
/api/v1/users/...   → users.py
/api/v1/plans/...   → plans.py
/api/v1/tasks/...   → tasks.py
```

---

#### `api/v1/endpoints/tasks.py` - Пример эндпоинта

**Что будет внутри (пример):**
```python
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_session

router = APIRouter()

@router.get("/today")
async def get_tasks_today(
    db: AsyncSession = Depends(get_session)
):
    """Получить задачи на сегодня"""
    # TODO: Реализовать логику
    return {
        "mainGoal": "Walk 10,000 steps",
        "morning": ["Drink water", "Stretching"],
        "afternoon": ["Healthy lunch", "Walk"],
        "evening": ["Light dinner", "Read"]
    }
```

**Как это вызывается из Frontend:**
```typescript
// apps/web/src/hooks/useTasks.ts
export function useTasks() {
  return useQuery({
    queryKey: ['tasks', 'today'],
    queryFn: async () => {
      const response = await fetch('/api/tasks/today')
      return response.json()
    }
  })
}
```

---

## 3️⃣ Связь Frontend ↔ Backend

### 🔄 Как Frontend общается с Backend

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend (Next.js)          →          Backend (FastAPI)   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Пользователь открывает /focus                          │
│                                                              │
│  2. FocusPage компонент рендерится                          │
│     ↓                                                        │
│  3. useTasks() hook вызывается                              │
│     ↓                                                        │
│  4. fetch('/api/tasks/today')                               │
│     ↓                                                        │
│  5. Next.js перенаправляет на Backend                       │
│     (благодаря rewrites в next.config.js)                   │
│     /api/tasks/today  →  http://localhost:8000/api/v1/tasks/today
│                                  ↓                           │
│                              6. Backend получает запрос      │
│                                  ↓                           │
│                              7. tasks.py эндпоинт           │
│                                  ↓                           │
│                              8. Запрос в БД (PostgreSQL)    │
│                                  ↓                           │
│                              9. Возврат JSON                │
│     ←─────────────────────────────                           │
│  10. Frontend получает данные                               │
│     ↓                                                        │
│  11. React Query кэширует результат                         │
│     ↓                                                        │
│  12. FocusPage отображает задачи                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 📋 Пример полного цикла

**Frontend (`apps/web/src/app/(dashboard)/focus/page.tsx`):**
```typescript
import { useTasks } from '@/hooks/useTasks'

export default function FocusPage() {
  // 1. Вызываем hook
  const { data: tasks, isLoading } = useTasks()

  if (isLoading) return <p>Loading...</p>

  // 4. Отображаем данные с Backend
  return (
    <div>
      <h1>Today's Focus</h1>
      <p>{tasks.mainGoal}</p>
    </div>
  )
}
```

**Hook (`apps/web/src/hooks/useTasks.ts`):**
```typescript
import { useQuery } from '@tanstack/react-query'

export function useTasks() {
  return useQuery({
    queryKey: ['tasks', 'today'],
    queryFn: async () => {
      // 2. Делаем запрос
      const res = await fetch('/api/tasks/today')
      return res.json()
    }
  })
}
```

**Backend (`apps/backend/app/api/v1/endpoints/tasks.py`):**
```python
from fastapi import APIRouter

router = APIRouter()

@router.get("/today")
async def get_tasks_today():
    # 3. Возвращаем данные
    return {
        "mainGoal": "Walk 10,000 steps",
        "morning": ["Drink water", "Stretching"]
    }
```

---

## 📝 Что изучать дальше

### ✅ Вы должны понимать:

1. **Файловая маршрутизация Next.js:**
   - `app/page.tsx` = `/`
   - `app/focus/page.tsx` = `/focus`
   - Скобки `(dashboard)` не попадают в URL

2. **Layout'ы:**
   - `app/layout.tsx` - оборачивает ВСЁ
   - `app/(dashboard)/layout.tsx` - только для dashboard страниц

3. **Связь Frontend → Backend:**
   - Frontend делает `fetch('/api/tasks/today')`
   - Next.js перенаправляет на `http://localhost:8000/api/v1/tasks/today`
   - Backend возвращает JSON
   - Frontend отображает данные

---

## 🎯 Практическое задание

Чтобы закрепить понимание, попробуйте:

### Задание 1: Измените текст на главной странице

1. Откройте `apps/web/src/app/page.tsx`
2. Измените "Your Personal AI Health Coach" на "Ваш личный AI тренер"
3. Сохраните файл
4. Обновите браузер (http://localhost:3000)
5. Увидите изменения

### Задание 2: Добавьте новую ссылку в сайдбар

1. Откройте `apps/web/src/app/(dashboard)/layout.tsx`
2. Добавьте новую ссылку после "Tribe":
   ```typescript
   <a href="/settings" className="block px-4 py-2 rounded hover:bg-gray-100">
     ⚙️ Settings
   </a>
   ```
3. Сохраните
4. Перейдите на любую dashboard страницу
5. Увидите новую ссылку в сайдбаре

### Задание 3: Создайте новую страницу Settings

1. Создайте папку `apps/web/src/app/(dashboard)/settings/`
2. Создайте файл `page.tsx` внутри:
   ```typescript
   export default function SettingsPage() {
     return (
       <div>
         <h1 className="text-4xl font-bold">Settings</h1>
         <p className="text-gray-600">Your settings page</p>
       </div>
     );
   }
   ```
3. Перейдите на http://localhost:3000/settings
4. Увидите новую страницу!

---

**Теперь вы понимаете структуру проекта! 🎉**

Переходите к следующему шагу.
