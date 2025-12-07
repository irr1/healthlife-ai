# 🎨 Руководство по UI компонентам

## ✅ Созданные компоненты

Вы только что создали 5 базовых UI компонентов:

1. **Button** - Кнопки (primary, secondary, danger, ghost)
2. **Card** - Карточки с различными вариантами
3. **Input** - Текстовые поля с иконками и валидацией
4. **Modal** - Всплывающие окна
5. **Toast** - Уведомления (success, error, warning, info)

---

## 🎯 Как просмотреть компоненты

**Запустите dev сервер** (если еще не запущен):
```bash
cd apps/web
npm run dev
```

**Откройте демо страницу:**
http://localhost:3000/components-demo

Здесь вы увидите все компоненты в действии!

---

## 📖 Как использовать компоненты

### 1. Button (Кнопка)

```typescript
import Button from '@/components/ui/Button'

// Базовое использование
<Button>Click me</Button>

// Различные варианты
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Delete</Button>
<Button variant="ghost">Cancel</Button>

// Размеры
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// Состояния
<Button disabled>Disabled</Button>
<Button isLoading>Loading...</Button>

// С обработчиком
<Button onClick={() => alert('Clicked!')}>
  Click me
</Button>
```

**Все пропсы:**
- `variant`: 'primary' | 'secondary' | 'danger' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `isLoading`: boolean - показывает спиннер
- `disabled`: boolean
- `onClick`: () => void
- Все стандартные HTML button атрибуты

---

### 2. Card (Карточка)

```typescript
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/Card'

// Простая карточка
<Card>
  <p>Content here</p>
</Card>

// Полная структура
<Card variant="elevated">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description text</CardDescription>
  </CardHeader>

  <CardContent>
    <p>Main content goes here</p>
  </CardContent>

  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// Варианты
<Card variant="default">Default with shadow</Card>
<Card variant="bordered">With border</Card>
<Card variant="elevated">Hover effect</Card>

// Отступы
<Card padding="none">No padding</Card>
<Card padding="sm">Small padding</Card>
<Card padding="md">Medium (default)</Card>
<Card padding="lg">Large padding</Card>
```

**Пропсы Card:**
- `variant`: 'default' | 'bordered' | 'elevated'
- `padding`: 'none' | 'sm' | 'md' | 'lg'

---

### 3. Input (Поле ввода)

```typescript
import Input from '@/components/ui/Input'

// Базовое использование
<Input placeholder="Enter text" />

// С лейблом
<Input label="Email" placeholder="your@email.com" />

// С иконкой слева
<Input
  leftIcon={<SearchIcon />}
  placeholder="Search..."
/>

// С иконкой справа
<Input
  rightIcon={<EmailIcon />}
  placeholder="Email"
/>

// С ошибкой
<Input
  label="Password"
  error="Password is required"
/>

// С подсказкой
<Input
  label="Username"
  helperText="Must be 3-20 characters"
/>

// Disabled
<Input disabled placeholder="Disabled" />

// Типы
<Input type="email" />
<Input type="password" />
<Input type="number" />
```

**Пропсы:**
- `label`: string - текст над полем
- `error`: string - текст ошибки (красный)
- `helperText`: string - подсказка (серый)
- `leftIcon`: ReactNode - иконка слева
- `rightIcon`: ReactNode - иконка справа
- `type`: 'text' | 'email' | 'password' | 'number' и т.д.
- Все стандартные HTML input атрибуты

---

### 4. Modal (Модальное окно)

```typescript
'use client'

import { useState } from 'react'
import Modal, { ModalFooter } from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Modal Title"
        description="Optional description"
        size="md"
      >
        <p>Your content here</p>

        <ModalFooter>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsOpen(false)}>
            Confirm
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}
```

**Пропсы:**
- `isOpen`: boolean - открыто/закрыто
- `onClose`: () => void - функция закрытия
- `title`: string - заголовок
- `description`: string - описание
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `showCloseButton`: boolean - показать X (default: true)

**ВАЖНО:** Модалы работают только в 'use client' компонентах!

---

### 5. Toast (Уведомления)

```typescript
'use client'

import { useToast } from '@/components/ui/Toast'
import Button from '@/components/ui/Button'

function MyComponent() {
  const { showToast } = useToast()

  return (
    <Button
      onClick={() =>
        showToast({
          type: 'success',
          title: 'Success!',
          message: 'Operation completed successfully.',
          duration: 5000, // опционально (default: 5000ms)
        })
      }
    >
      Show Toast
    </Button>
  )
}
```

**Типы уведомлений:**
```typescript
// Success (зеленый)
showToast({
  type: 'success',
  title: 'Saved!',
  message: 'Your changes have been saved.',
})

// Error (красный)
showToast({
  type: 'error',
  title: 'Error!',
  message: 'Something went wrong.',
})

// Warning (желтый)
showToast({
  type: 'warning',
  title: 'Warning!',
  message: 'Please check your input.',
})

// Info (синий)
showToast({
  type: 'info',
  title: 'Info',
  message: 'New features available!',
})
```

**ВАЖНО:**
- Toast работает только в 'use client' компонентах
- `ToastProvider` уже добавлен в [apps/web/src/app/layout.tsx](apps/web/src/app/layout.tsx)

---

## 🎨 Примеры использования

### Форма регистрации

```typescript
'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

export default function RegisterForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { showToast } = useToast()

  const handleSubmit = () => {
    if (!email || !password) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Please fill in all fields',
      })
      return
    }

    // Логика регистрации
    showToast({
      type: 'success',
      title: 'Registered!',
      message: 'Welcome to HealthLife AI',
    })
  }

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </CardContent>

      <CardFooter>
        <Button onClick={handleSubmit} className="w-full">
          Sign Up
        </Button>
      </CardFooter>
    </Card>
  )
}
```

### Подтверждение удаления

```typescript
'use client'

import { useState } from 'react'
import Modal, { ModalFooter } from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

function DeleteButton({ itemId }: { itemId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const { showToast } = useToast()

  const handleDelete = () => {
    // Логика удаления
    setIsOpen(false)
    showToast({
      type: 'success',
      title: 'Deleted',
      message: 'Item has been deleted',
    })
  }

  return (
    <>
      <Button variant="danger" onClick={() => setIsOpen(true)}>
        Delete
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Deletion"
        description="This action cannot be undone."
        size="sm"
      >
        <p className="text-gray-600">
          Are you sure you want to delete this item?
        </p>

        <ModalFooter>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}
```

---

## 📁 Где находятся файлы

```
apps/web/src/components/ui/
├── Button.tsx          # Компонент кнопки
├── Card.tsx            # Компонент карточки
├── Input.tsx           # Компонент поля ввода
├── Modal.tsx           # Компонент модального окна
├── Toast.tsx           # Компонент уведомлений
└── index.ts            # Экспорт всех компонентов
```

---

## 🎯 Следующие шаги

Теперь вы можете:

1. **Использовать компоненты на существующих страницах:**
   - Обновите [apps/web/src/app/(dashboard)/focus/page.tsx](apps/web/src/app/(dashboard)/focus/page.tsx)
   - Замените хардкод на компоненты Card и Button

2. **Создать специфичные компоненты:**
   - `TodayFocus.tsx` для Focus страницы
   - `RoadmapVisualizer.tsx` для Journey
   - `ChatWindow.tsx` для Coach

3. **Добавить анимации:**
   - Установить `framer-motion`
   - Добавить transition эффекты

4. **Создать дополнительные компоненты:**
   - Badge (бейджик)
   - Avatar (аватар)
   - Dropdown (выпадающее меню)
   - Tabs (вкладки)

---

## 💡 Советы

### Импорт компонентов

Вместо:
```typescript
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
```

Можно:
```typescript
import { Button, Card, Input } from '@/components/ui'
```

### Комбинирование компонентов

Компоненты созданы для комбинирования:

```typescript
<Card>
  <CardHeader>
    <CardTitle>Settings</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <Input label="Name" />
    <Input label="Email" />
  </CardContent>
  <CardFooter className="justify-end">
    <Button variant="ghost">Cancel</Button>
    <Button>Save</Button>
  </CardFooter>
</Card>
```

### Кастомизация стилей

Все компоненты принимают `className`:

```typescript
<Button className="w-full mt-4">
  Full width button
</Button>

<Card className="border-2 border-blue-500">
  Custom border
</Card>
```

---

**Готово! Теперь у вас есть полный набор базовых UI компонентов.** 🎉

Откройте http://localhost:3000/components-demo чтобы увидеть их в действии!
