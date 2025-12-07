# 🚀 Быстрый старт HealthLife AI

## Шаг 1: Проверка установленного софта

Убедитесь, что у вас установлено:

```bash
# Проверка Node.js (должно быть 18+)
node --version

# Проверка Python (должно быть 3.11+)
python --version

# Проверка Docker (опционально, но рекомендуется)
docker --version
docker-compose --version
```

Если чего-то нет, установите:
- **Node.js**: https://nodejs.org/ (выберите LTS версию)
- **Python**: https://www.python.org/downloads/
- **Docker Desktop**: https://www.docker.com/products/docker-desktop/

---

## Шаг 2: Настройка переменных окружения

### 2.1. Корневой .env файл

```bash
# Скопируйте example файл
copy .env.example .env

# Откройте .env в редакторе и заполните:
# - OPENAI_API_KEY (получите на https://platform.openai.com/api-keys)
# - SECRET_KEY (любая длинная строка для шифрования)
```

### 2.2. Frontend .env

```bash
cd apps/web
copy .env.example .env.local

# Содержимое .env.local:
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=HealthLife AI
```

### 2.3. Backend .env

```bash
cd apps/backend
copy .env.example .env

# Откройте .env и заполните:
# - DATABASE_URL (будет автоматически, если используете Docker)
# - OPENAI_API_KEY (тот же, что в корневом .env)
# - SECRET_KEY (тот же, что в корневом .env)
```

---

## Шаг 3: Запуск БЕЗ Docker (для разработки)

### 3.1. Установка PostgreSQL и Redis вручную

**Вариант А: Используйте только Docker для баз данных**
```bash
# Запустите только БД
docker-compose up -d postgres redis

# Проверьте, что запустились
docker ps
```

**Вариант Б: Установите локально**
- PostgreSQL: https://www.postgresql.org/download/
- Redis: https://redis.io/download/ (для Windows: https://github.com/microsoftarchive/redis/releases)

После установки создайте базу данных:
```bash
# Подключитесь к PostgreSQL
psql -U postgres

# Создайте БД
CREATE DATABASE healthlife_ai;
CREATE USER healthlife WITH PASSWORD 'healthlife123';
GRANT ALL PRIVILEGES ON DATABASE healthlife_ai TO healthlife;
```

### 3.2. Установка зависимостей Backend

```bash
cd apps/backend

# Создайте виртуальное окружение
python -m venv venv

# Активируйте его
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Установите зависимости
pip install -r requirements.txt
```

### 3.3. Установка зависимостей Frontend

```bash
cd apps/web
npm install
```

### 3.4. Запуск приложений

**Терминал 1 - Backend:**
```bash
cd apps/backend
# Активируйте venv, если еще не активирован
venv\Scripts\activate  # Windows
# или
source venv/bin/activate  # macOS/Linux

# Запустите сервер
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Вы увидите:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

Откройте в браузере: http://localhost:8000
Вы увидите JSON:
```json
{
  "message": "HealthLife AI Backend API",
  "version": "0.1.0",
  "docs": "/api/v1/docs"
}
```

Откройте документацию API: http://localhost:8000/api/v1/docs


**Терминал 2 - Frontend:**
```bash
cd apps/web
npm run dev
```

Вы увидите:
```
▲ Next.js 14.0.0
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in 2.3s
```

Откройте в браузере: http://localhost:3000

---

## Шаг 4: Запуск С Docker (проще, но медленнее)

```bash
# Из корневой папки проекта
docker-compose up --build

# Или в фоновом режиме:
docker-compose up -d --build
```

Это запустит:
- PostgreSQL на порту 5432
- Redis на порту 6379
- Backend на порту 8000
- Frontend на порту 3000

Проверьте:
- Backend: http://localhost:8000
- Frontend: http://localhost:3000
- API Docs: http://localhost:8000/api/v1/docs

Остановка:
```bash
docker-compose down
```

---

## Шаг 5: Что вы увидите сейчас (минимальная версия)

### Backend (http://localhost:8000)
Вы увидите JSON с приветствием. Это нормально.

### Frontend (http://localhost:3000)
Сейчас вы увидите **ошибку или пустую страницу**, потому что:
- Нет файла `apps/web/src/app/page.tsx` (главная страница)
- Нет `apps/web/src/app/layout.tsx` с контентом

Это ожидаемо! Мы создали только структуру, но не реализовали страницы.

---

## Шаг 6: Создание минимального UI (чтобы увидеть результат)

Давайте создадим базовые страницы, чтобы вы могли видеть работающее приложение.

### 6.1. Создайте главную страницу

Файл: `apps/web/src/app/page.tsx`
```typescript
export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">HealthLife AI</h1>
        <p className="text-2xl mb-8">Your Personal AI Health Coach</p>
        <a
          href="/focus"
          className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition"
        >
          Get Started
        </a>
      </div>
    </div>
  );
}
```

### 6.2. Обновите корневой layout

Файл: `apps/web/src/app/layout.tsx`
```typescript
import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'HealthLife AI',
  description: 'AI-powered personal health coach',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

### 6.3. Создайте layout дашборда

Файл: `apps/web/src/app/(dashboard)/layout.tsx`
```typescript
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-8">HealthLife AI</h2>
        <nav className="space-y-2">
          <a href="/focus" className="block px-4 py-2 rounded hover:bg-gray-100">
            🏠 Focus
          </a>
          <a href="/journey" className="block px-4 py-2 rounded hover:bg-gray-100">
            🗺 Journey
          </a>
          <a href="/coach" className="block px-4 py-2 rounded hover:bg-gray-100">
            🧠 AI Coach
          </a>
          <a href="/you" className="block px-4 py-2 rounded hover:bg-gray-100">
            📊 You
          </a>
          <a href="/tribe" className="block px-4 py-2 rounded hover:bg-gray-100">
            🔥 Tribe
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
```

### 6.4. Обновите страницы дашборда

**Файл: `apps/web/src/app/(dashboard)/focus/page.tsx`**
```typescript
export default function FocusPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Focus</h1>
      <p className="text-gray-600 mb-8">Your tasks for today</p>

      {/* Hero Block */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-2">Today's Focus</h2>
        <p className="text-3xl">Walk 10,000 steps</p>
      </div>

      {/* Task Timeline */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4">Timeline</h3>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="font-bold">Morning</p>
            <p>Drink water, Light stretching</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <p className="font-bold">Afternoon</p>
            <p>Healthy lunch, 30-minute walk</p>
          </div>
          <div className="border-l-4 border-purple-500 pl-4">
            <p className="font-bold">Evening</p>
            <p>Light dinner, Read 20 minutes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Файл: `apps/web/src/app/(dashboard)/journey/page.tsx`**
```typescript
export default function JourneyPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Journey</h1>
      <p className="text-gray-600 mb-8">Your roadmap to success</p>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4">Roadmap</h3>
        <div className="space-y-4">
          <div className="bg-green-100 p-4 rounded">
            <p className="font-bold">✅ Phase 1: Adaptation (Current)</p>
            <p>Build basic habits</p>
          </div>
          <div className="bg-gray-100 p-4 rounded opacity-50">
            <p className="font-bold">🔒 Phase 2: Growth</p>
            <p>Increase intensity</p>
          </div>
          <div className="bg-gray-100 p-4 rounded opacity-50">
            <p className="font-bold">🔒 Phase 3: Mastery</p>
            <p>Maintain lifestyle</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Файл: `apps/web/src/app/(dashboard)/coach/page.tsx`**
```typescript
export default function CoachPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">AI Coach</h1>
      <p className="text-gray-600 mb-8">Ask me anything</p>

      <div className="bg-white rounded-lg shadow p-6 mb-4">
        <h3 className="text-xl font-bold mb-4">Daily Insight</h3>
        <p className="text-lg">💡 You sleep better when you exercise in the morning. I've moved your workouts to 9:00 AM.</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4">Chat</h3>
        <div className="h-64 bg-gray-50 rounded p-4 mb-4">
          <p className="text-gray-500">Chat will be implemented here...</p>
        </div>
        <input
          type="text"
          placeholder="Ask me something..."
          className="w-full border rounded px-4 py-2"
        />
      </div>
    </div>
  );
}
```

**Файл: `apps/web/src/app/(dashboard)/you/page.tsx`**
```typescript
export default function YouPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">You</h1>
      <p className="text-gray-600 mb-8">Your progress and stats</p>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Body Battery</h3>
          <div className="h-48 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded"></div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Habit Grid</h3>
          <div className="grid grid-cols-7 gap-2">
            {[...Array(28)].map((_, i) => (
              <div
                key={i}
                className={`h-8 rounded ${i % 3 === 0 ? 'bg-green-500' : 'bg-gray-200'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Файл: `apps/web/src/app/(dashboard)/tribe/page.tsx`**
```typescript
export default function TribePage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Tribe</h1>
      <p className="text-gray-600 mb-8">Your community</p>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4">Your Squad</h3>
        <p className="mb-4">Summer Weight Loss Warriors</p>

        <h4 className="font-bold mb-2">Leaderboard</h4>
        <div className="space-y-2">
          <div className="flex justify-between p-2 bg-yellow-100 rounded">
            <span>🥇 Alex</span>
            <span>1,250 pts</span>
          </div>
          <div className="flex justify-between p-2 bg-gray-100 rounded">
            <span>🥈 Jordan</span>
            <span>1,100 pts</span>
          </div>
          <div className="flex justify-between p-2 bg-orange-100 rounded">
            <span>🥉 You</span>
            <span>950 pts</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Шаг 7: Перезапустите и проверьте

После создания файлов:

1. Если сервер Next.js запущен, он автоматически перезагрузится
2. Откройте http://localhost:3000
3. Вы увидите красивую главную страницу
4. Нажмите "Get Started"
5. Вы попадете в дашборд с навигацией

Теперь вы можете:
- Переключаться между 5 страницами
- Видеть базовый UI каждой секции
- Понимать структуру приложения

---

## Шаг 8: Следующие шаги

Теперь, когда у вас работает базовая версия:

1. **Подключите бэкенд к фронтенду**
   - Создайте API клиент (axios)
   - Настройте React Query

2. **Реализуйте аутентификацию**
   - JWT токены
   - Login/Register формы

3. **Интегрируйте OpenAI**
   - Генерация планов
   - AI чат

4. **Добавьте базу данных**
   - SQLAlchemy модели
   - Миграции Alembic

---

## Troubleshooting (Решение проблем)

### Ошибка: "Module not found"
```bash
cd apps/web
npm install
```

### Ошибка: "Cannot connect to database"
Проверьте, что PostgreSQL запущен:
```bash
docker ps  # должен быть healthlife-postgres
```

### Ошибка: "Port 3000 already in use"
Убейте процесс:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### Ошибка: "Python не найден"
Убедитесь, что Python в PATH:
```bash
# Windows
where python

# Если не найден, переустановите Python с галочкой "Add to PATH"
```

---

## Полезные команды

```bash
# Посмотреть логи Docker контейнеров
docker-compose logs -f

# Остановить все контейнеры
docker-compose down

# Удалить все (включая данные БД)
docker-compose down -v

# Пересобрать после изменений
docker-compose up --build

# Посмотреть запущенные контейнеры
docker ps

# Зайти внутрь контейнера
docker exec -it healthlife-backend bash
```

---

## Что дальше?

Прочитайте:
- [ARCHITECTURE.md](ARCHITECTURE.md) - концепция приложения
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - детальная структура
- [README.md](README.md) - общая информация

Начните разработку с:
1. Создания API эндпоинтов в backend
2. Создания UI компонентов в components/
3. Интеграции с OpenAI API
4. Добавления базы данных

Удачи! 🚀
