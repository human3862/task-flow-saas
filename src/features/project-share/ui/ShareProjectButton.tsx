'use client'
import { Button } from '@/shared/ui'
import { toast } from 'sonner'
export function ShareProjectButton({
  projectId,
}: {
  projectId: string | number
}) {
  const copyLink = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const url = `${window.location.origin}/tasks?project=${projectId}`
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success('Ссылка скопирована', {
          id: `share-${projectId}`,
          description: 'Отправьте её коллегам',
        })
      })
      .catch(() => {
        toast.error('Ошибка копирования')
      })
  }

  return (
    <Button onClick={copyLink} variant="sea" size="sm">
      Поделиться 🔗
    </Button>
  )
}
