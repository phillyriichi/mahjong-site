import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure
} from '@heroui/react'
import { useRef, useState } from 'react'

interface ConfirmOptions {
  title?: string
  messages: string[]
  confirmText?: string
  cancelText?: string
  type?: 'primary' | 'danger'
  onConfirm?: () => void
  onCancel?: () => void
}

export const useConfirm = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [options, setOptions] = useState<ConfirmOptions>({
    messages: [],
    onConfirm: () => {}
  })
  const resolver = useRef<(value: boolean) => void>(null)

  const ask = (newOptions: ConfirmOptions) => {
    setOptions({
      title: 'Confirmation',
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      type: 'primary',
      ...newOptions
    })
    onOpen()
    return new Promise((resolve) => {
      resolver.current = resolve
    })
  }

  const handleAction = (success: boolean) => {
    onClose()
    if (resolver.current) {
      resolver.current(success)
    }
  }

  const ConfirmModal = () => (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) handleAction(false)
      }}
      onClose={() => options.onCancel?.()}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader>{options.title}</ModalHeader>
            <ModalBody>
              {options.messages.map((m, i) => {
                return (
                  <p key={`confirmModalBory${i}`} className="text-dark-500">
                    {m}
                  </p>
                )
              })}
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={() => handleAction(false)}>
                {options.cancelText}
              </Button>
              <Button color={options.type} onPress={() => handleAction(true)}>
                {options.confirmText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )

  return { ask, ConfirmModal }
}

export default useConfirm
