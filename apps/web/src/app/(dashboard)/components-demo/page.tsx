'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Modal, { ModalFooter } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'

export default function ComponentsDemoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { showToast } = useToast()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">UI Components Demo</h1>
        <p className="text-gray-600">
          Просмотр всех базовых компонентов приложения
        </p>
      </div>

      {/* Buttons Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Buttons</h2>
        <Card>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Variants</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Sizes</p>
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">States</p>
              <div className="flex flex-wrap gap-2">
                <Button disabled>Disabled</Button>
                <Button isLoading>Loading</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Cards Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="default">
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
              <CardDescription>With shadow</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">This is the default card with shadow.</p>
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Bordered Card</CardTitle>
              <CardDescription>With border</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">This card has a border instead of shadow.</p>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Elevated Card</CardTitle>
              <CardDescription>Hover effect</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Hover over this card to see the effect.</p>
            </CardContent>
            <CardFooter>
              <Button size="sm">Action</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Inputs Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Inputs</h2>
        <Card>
          <CardContent className="space-y-4">
            <Input
              label="Basic Input"
              placeholder="Enter your name"
              helperText="This is a helper text"
            />

            <Input
              label="With Left Icon"
              placeholder="Search..."
              leftIcon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              }
            />

            <Input
              label="Email Input"
              type="email"
              placeholder="your@email.com"
              rightIcon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              }
            />

            <Input
              label="Error State"
              placeholder="Enter value"
              error="This field is required"
            />

            <Input label="Disabled" placeholder="Disabled input" disabled />
          </CardContent>
        </Card>
      </section>

      {/* Modal Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Modal</h2>
        <Card>
          <CardContent>
            <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>

            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Example Modal"
              description="This is a modal description"
              size="md"
            >
              <div className="space-y-4">
                <p>This is the modal content. You can put any content here.</p>
                <Input placeholder="Example input in modal" />
              </div>

              <ModalFooter>
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsModalOpen(false)}>Confirm</Button>
              </ModalFooter>
            </Modal>
          </CardContent>
        </Card>
      </section>

      {/* Toast Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Toast Notifications</h2>
        <Card>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="primary"
                onClick={() =>
                  showToast({
                    type: 'success',
                    title: 'Success!',
                    message: 'Your action was successful.',
                  })
                }
              >
                Success Toast
              </Button>

              <Button
                variant="danger"
                onClick={() =>
                  showToast({
                    type: 'error',
                    title: 'Error!',
                    message: 'Something went wrong.',
                  })
                }
              >
                Error Toast
              </Button>

              <Button
                variant="secondary"
                onClick={() =>
                  showToast({
                    type: 'warning',
                    title: 'Warning!',
                    message: 'Please be careful.',
                  })
                }
              >
                Warning Toast
              </Button>

              <Button
                variant="ghost"
                onClick={() =>
                  showToast({
                    type: 'info',
                    title: 'Info',
                    message: 'Here is some information.',
                  })
                }
              >
                Info Toast
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Combined Example */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Combined Example</h2>
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              leftIcon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              }
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              leftIcon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              }
            />
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="ghost">Forgot password?</Button>
            <Button
              onClick={() =>
                showToast({
                  type: 'success',
                  title: 'Signed in!',
                  message: 'Welcome back!',
                })
              }
            >
              Sign In
            </Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  )
}
