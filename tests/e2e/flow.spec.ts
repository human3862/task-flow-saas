import test, { expect } from 'playwright/test'

test('Полный цикл: логин -> проект -> задача', async ({ page }) => {
  // логин
  await page.goto('/login')
  await page.fill('input[name="email"]', 'robot@gmail.com')
  await page.fill('input[name="password"]', '1234')
  await page.click('button[type="submit"]')
  await page.waitForURL('/')

  // создание проекта
  await page.goto('/dashboard')
  await page.click('button:has-text("Добавить проект")')
  await page.fill('input[name="name"]', 'project test')
  await page.click('button:has-text("Создать проект")')

  // создание задачи
  await page.goto('/tasks')
  await page.click('button:has-text("Добавить задачу")')
  await page.fill('input[name="title"]', 'auto-test task')
  await page.selectOption('select[name="project"]', { label: 'project test' })
  await page.click('button:has-text("Создать задачу")')

  // провека
  const taskCard = page.locator('text=auto-test task')
  await expect(taskCard).toBeVisible()
})
